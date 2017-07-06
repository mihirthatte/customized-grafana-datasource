#!/usr/bin/python

# enable debugging
import sys
import json
from urllib import urlencode
import os
from urllib2 import Request, urlopen, URLError, HTTPBasicAuthHandler, HTTPPasswordMgr, HTTPPasswordMgrWithDefaultRealm, build_opener, install_opener
import re
import datetime
from ast import literal_eval

tsds_url = "https://tsds.bldc.grnoc.iu.edu/i2/services/"

def atoi(text):
    return int(text) if text.isdigit() else text

def natural_keys(text):
    return [ atoi(c) for c in re.split('(\d+)', text) ]

#Look for fields in tsds JSON output where key contains keyword - "values"
def findtarget_names(tsds_result,i, alias_list):
        returnname = []
        results_dict = tsds_result["results"][i]
	if len(alias_list) == 0:
        	for key,value in results_dict.iteritems():
                	targetname = []
                	if isinstance(value, list):
                        	targetname.append(key)
                        	nonValues = []
                        	for k , v in results_dict.iteritems():
                                	if not isinstance(v, list):
                                        	nonValues.append(k)
                        	nonValues.sort(key=natural_keys)
                        	for nV in nonValues:
                                	targetname.append("| "+str(results_dict[nV]))
                        	returnname.append(" ".join(targetname))

	else:
		for key,value in results_dict.iteritems():
                        targetname = []
                        if isinstance(value, list):
                                targetname.append(key)
                                nonValues = list(alias_list) #deep copy to counter alias_list values getting modified due to references
                               	for i in range(0,len(nonValues)):
        				if '$' in nonValues[i]:
						v = nonValues[i][1:]
          					nonValues[i] = str(results_dict[v])
				targetname.append(" "+" ".join(nonValues))
                                returnname.append(" ".join(targetname))	
        return returnname

def match(key,targetname):
        #tname = targetname[:targetname.find(")")+1]
        #print tnam
        return True if targetname.find(key)>-1 else False
        #return True if targetname.find(key)>-1 else False

#Reversing the datapoints received from tsds and converting time field into miliseconds (*1000)
def convert(innerValue):
        IV = [ list(reversed(element)) for element in innerValue]
        return [[element[0],element[1]*1000] for element in IV]

def replaceQuery(query,start_time,end_time, aggValue):
	
        replace = {"$START":start_time,"$END":end_time, "{":" ", "}":" "}
        replace = dict((re.escape(key),value) for key, value in replace.iteritems())
        pattern = re.compile("|".join(replace.keys()))
        query = pattern.sub(lambda m: replace[re.escape(m.group(0))], query)
	
	replace = {"$quantify":str(aggValue)}
	replace = dict((re.escape(key),value) for key, value in replace.iteritems())
	pattern = re.compile("|".join(replace.keys()))
	query = pattern.sub(lambda m: replace[re.escape(m.group(0))], query)
	return query 

def auth_Connection(url):
	username = "test_user"
        password = "testpass123"
        passman = HTTPPasswordMgrWithDefaultRealm() # creating a password manager
        passman.add_password(None, url, username, password)
        authhandler = HTTPBasicAuthHandler(passman)
        opener = build_opener(authhandler)
        install_opener(opener)


def make_TSDS_Request(url,postParam = None):
	auth_Connection(url)
	try:
		if not postParam:
                	request = Request(url)
                	response = urlopen(request)
                	return json.load(response)
		else:
			request = Request(url,postParam)
			response = urlopen(request)
			return json.load(response)
			
        except URLError, e:
                print "Content-type: text/plain"
                print 'Error opening tsds URL \n', e


def search():
	inpParameter = literal_eval(sys.stdin.read()) # reading the input data sent in POST method
	searchType = inpParameter['type']
	output=[]
	if searchType == "Column": # Searching for Columns
		url = tsds_url+"metadata.cgi?method=get_meta_fields;measurement_type="+inpParameter['target']
		json_result = make_TSDS_Request(url)
                for eachDict in json_result["results"]:
                        if "fields" in eachDict:
                                for field in eachDict["fields"]:
                                        output.append(eachDict["name"]+"."+field["name"])
                        else:
                                output.append(eachDict["name"])

	elif searchType == "Value": # Searching for Values
		url = tsds_url+"metadata.cgi?method=get_measurement_type_values;measurement_type="+inpParameter['target']
		json_result = make_TSDS_Request(url)	
		output = [eachDict["name"] for eachDict in json_result["results"] if "name" in eachDict]

	elif searchType == "Table": # Searching for Tables
		url = tsds_url+"metadata.cgi?method=get_measurement_types"
                json_result = make_TSDS_Request(url)    
                output = [eachDict["name"] for eachDict in json_result["results"] if "name" in eachDict]

	elif searchType == "Where":
		url = tsds_url+"metadata.cgi?method=get_meta_field_values;measurement_type="+inpParameter['target']+";meta_field="+inpParameter['meta_field']+";limit=10;offset=0;"+inpParameter['meta_field']+"_like="+inpParameter['like_field']
		json_result = make_TSDS_Request(url)
		output = [eachDict["value"] for eachDict in json_result["results"]]

	elif searchType == "Where_Related":
		url = tsds_url+"metadata.cgi?method=get_meta_field_values;measurement_type="+inpParameter['target']+";meta_field="+inpParameter['meta_field']+";limit=10;offset=0;"+inpParameter['parent_meta_field']+"="+inpParameter['parent_meta_field_value']+";"+inpParameter['meta_field']+"_like="+str(inpParameter['like_field'])
		json_result = make_TSDS_Request(url)
		output = [eachDict["value"] for eachDict in json_result["results"]]

	elif searchType == "Search":
		url = tsds_url+"query.cgi"
		postParameters = {"method":"query","query":inpParameter["target"]}
		json_result = make_TSDS_Request(url,urlencode(postParameters))
		for eachDict in json_result["results"]:
			v=""
			for key,value in eachDict.iteritems():
				if len(v) == 0:
					v+= key+" = \""+value+"\""
				else:
					v = v+" and "+key+" = \""+value+"\""
			output.append(v)

	print "Content-Type: application/json" # set the HTTP response header to json data
	print "Cache-Control: no-cache\n"
	print json.dumps(output) #HTTP response
		

def query():
        inpParameter = json.loads(sys.stdin.read())

        #get to the target field of json : 
        tsds_query=[]
        start_time=""
        end_time=""
        maxDataPoints=1
	target_alias =""
	alias_list = []
        for key,value in inpParameter.iteritems():
                if key == "targets":
                        for eachElement in value:
                                tsds_query.append(eachElement["target"])
				if "alias" in eachElement and eachElement['alias'] != "":
					target_alias = eachElement["alias"]
                if key =="range":
                        start_time = value["from"]
                        end_time = (value["to"])
                if key =="maxDataPoints":
                        maxDataPoints = value

        #Read query and set the variable $START & $END in the query to appropriate timestamp sent by grafana before querying tsds - 
        # - Convert start_time from iso8601 to UTC format 
	if target_alias != "":
		alias_list = target_alias.split(' ')

        start_time = datetime.datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%S.%fZ")
        ostart = (start_time - datetime.datetime(1970, 1, 1)).total_seconds()
        start_time = str(start_time.strftime("%m-%d-%Y %H:%M:%S.%fZ")).replace("-","/") # Replace '-' with '/'
        start_time =  '"'+start_time[:start_time.index(".")]+' UTC"' # Adding quotes before and after

        # - Convert end_time from iso8601 to UTC format
        end_time = datetime.datetime.strptime(end_time, "%Y-%m-%dT%H:%M:%S.%fZ")
        oend = (end_time - datetime.datetime(1970, 1, 1)).total_seconds()
        end_time= str(end_time.strftime("%m-%d-%Y %H:%M:%S.%fZ")).replace("-","/") #Replace '-' with '/' 
        end_time =  '"'+end_time[:end_time.index(".")]+' UTC"' #Adding quotes before and after
        time_duration = (oend-ostart)
	
        aggValue = int(time_duration/maxDataPoints)
	'''
        if time_duration > 172800  and time_duration <= 604800:#Time between 2 and 7 days
                aggValue = max(aggValue, int(86400/maxDataPoints))
        elif time_duration > 604800 and time_duration <= 2592000 : #Time between 7 and 30 days
                aggValue = max(aggValue, 3600)
        elif time_duration > 2592000: #Time greater than 30 days
                aggValue = max(aggValue, 86400)
	'''
	if time_duration >= 7776000:
		aggValue = max(aggValue, 86400)
	elif time_duration >= 259200:
		aggValue = max(aggValue, 3600) 
	
        output=[]
	q=""
	for index in range(len(tsds_query)):
                tsds_query[index] = replaceQuery(tsds_query[index],start_time,end_time,aggValue)
                #Request data from tsds - 
		url= tsds_url+"query.cgi"
		postParameters = {"method":"query","query":tsds_query[index]}
		tsds_result = make_TSDS_Request(url,urlencode(postParameters))
                #Prepare output for grafana
                #Format the data received from tsds to grafana compatible data -
                for i in range(len(tsds_result["results"])):
                        #Search for target name - 
                        target = findtarget_names(tsds_result, i, alias_list)
                        for eachTarget in target:
                                dict_element={"target":eachTarget}
                                value = tsds_result["results"][i]

                                for innerKey,innerValue in value.iteritems():
                                        if isinstance(innerValue,list) and match(innerKey,eachTarget):
                                                dict_element["datapoints"] = convert(innerValue)
                                output.append(dict_element)
	output = sorted(output, key=lambda k : k["target"])
        print "Content-Type: application/json" # set the HTTP response header to json data
        print "Cache-Control: no-cache\n"
        print json.dumps(output)

def parseDrillDownQuery(query, drill, timeFrom, timeTo):
	q = "get "+drill+" "+ query[query.find('between'): query.find("by")]+" by "+drill +" " + query[query.find('from'):]
	replace = {"$START":timeFrom,"$END":timeTo}
	replace = dict((re.escape(key),value) for key, value in replace.iteritems())
	pattern = re.compile("|".join(replace.keys()))
	return pattern.sub(lambda m: replace[re.escape(m.group(0))], q)



def generateDB(postParam):
	url = "https://tsds-frontend-el7-test.grnoc.iu.edu/grafana/api/dashboards/db"
        API_KEY = "eyJrIjoiM0VFS1NqNUtBZ3B4cFdWUTVRVGNJQnRsMEFZVTBjUWUiLCJuIjoiZGFzaGJvYXJkX2tleSIsImlkIjoxfQ=="
        #print postParam
        req_headers={"Authorization":"Bearer "+API_KEY,"Content-Type":"application/json"}
        try:
                request = Request(url,json.dumps(postParam),req_headers)
                response = urlopen(request)
        except URLError, e:
                print 'Error opening URL ---- ***  \n'
                print e.readlines()
                sys.exit(1)
        #data = json.load(response)
        if response.getcode() == 200:
                print "Content-Type: text/plain"
                print "Success"

def drilldown():
	open("dash.txt",'w').close()
	output_file = open("dash.txt","rw+")
	inpParameter = literal_eval(sys.stdin.read())
	query = inpParameter["query"]
	drill = inpParameter["drill"]
	start_time = inpParameter["timeFrom"]
	end_time = inpParameter["timeTo"]

	#Convert From time to ISO Format
	start_time = datetime.datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%S.%fZ")
	ostart = (start_time - datetime.datetime(1970, 1, 1)).total_seconds()
	start_time = str(start_time.strftime("%m-%d-%Y %H:%M:%S.%fZ")).replace("-","/") # Replace '-' with '/'
	start_time =  '"'+start_time[:start_time.index(".")]+' UTC"' # Adding quotes before and after
	output_file.write("Start_time -"+str(start_time)+"\n")

	#Conver To time to ISO Format
	end_time = datetime.datetime.strptime(end_time, "%Y-%m-%dT%H:%M:%S.%fZ")
	oend = (end_time - datetime.datetime(1970, 1, 1)).total_seconds()
	end_time= str(end_time.strftime("%m-%d-%Y %H:%M:%S.%fZ")).replace("-","/") #Replace '-' with '/' 
	end_time =  '"'+end_time[:end_time.index(".")]+' UTC"' #Adding quotes before and after
	output_file.write("End_time -"+str(end_time)+"\n")


	
	DB_title = inpParameter["DB_title"]
	Data_source = inpParameter["Data_source"]
	url = "https://tsds-frontend-el7-test.grnoc.iu.edu/grafana/api/dashboards/db/"+DB_title
	API_KEY = "eyJrIjoiM0VFS1NqNUtBZ3B4cFdWUTVRVGNJQnRsMEFZVTBjUWUiLCJuIjoiZGFzaGJvYXJkX2tleSIsImlkIjoxfQ=="
	req_headers={"Authorization":"Bearer "+API_KEY,"Content-Type":"application/json"}
	#print postParam
	try:
		request = Request(url,headers = req_headers)
		response = urlopen(request)
	except URLError, e:
		print 'Error opening URL ---- ***  \n'
		print e.readlines()
		sys.exit(1)
		#print "grafana dashboard --- ",response.getcode()
	#output_file.write(response.read()+"\n")
	data = json.load(response)
	db =  data["dashboard"]
	output_file.write("query --- "+query+" Drill -- "+drill+"\n")
	output_file.write(json.dumps(db)+"\n")
	if "links" not in db["rows"][0]["panels"][0]:
  		db["rows"][0]["panels"][0]["links"] = [{"dashUri":"db/Drill_Down_on_"+DB_title,"dashboard":"Drill_Down_on_"+DB_title,"title":"Drill_Down_on_"+DB_title,"type":"dashboard"}]
	else:
		db["rows"][0]["panels"][0]["links"] = []
		db["rows"][0]["panels"][0]["links"].append({"dashUri":"db/Drill_Down_on_"+DB_title,"dashboard":"Drill_Down_on_"+DB_title,"title":"Drill_Down_on_"+DB_title,"type":"dashboard"})
	
	postParam = {"dashboard":db,"overwrite": True }
	generateDB(postParam) #Creating a link in same dashboard to a drill down db
			
	
	#Create new dashboard with templates
	templateQuery = parseDrillDownQuery(query, drill, start_time, end_time)
	output_file.write("\n")
	output_file.write("Query for template ---- \n")
	output_file.write(templateQuery)
	if len(db["templating"]["list"]) == 0:
		db["templating"]["list"].append({ "allValue": None, "current": { "text": "", "value": [ ] },"datasource": Data_source, "hide": 0, "includeAll": True, "label": None, "multi": True, "name": "temp", "options": [], "query": templateQuery, "refresh": 2, "regex": "", "sort": 0,   "tagValuesQuery": "", "tags": [], "tagsQuery": "", "type": "query", "useTags": False })
	else:
		db["templating"]["list"] = []
		db["templating"]["list"].append({ "allValue": None, "current": { "text": "", "value": [ ] },"datasource": Data_source, "hide": 0, "includeAll": True, "label": None, "multi": True, "name": "temp", "options": [], "query": templateQuery, "refresh": 2, "regex": "", "sort": 0,   "tagValuesQuery": "", "tags": [], "tagsQuery": "", "type": "query", "useTags": False })
	db["rows"][0]["panels"][0]["targets"][0]["rawQuery"] = True
	panel_query = db["rows"][0]["panels"][0]["targets"][0]["target"]
	#panel_query = panel_query[:panel_query.find(")",-1)] + "and $temp )"
	panel_query = panel_query + " and ($temp)"
	db["rows"][0]["panels"][0]["targets"][0]["target"] = panel_query
	db["rows"][0]["panels"][0]["repeat"] = "temp"
	db["rows"][0]["panels"][0]["minSpan"] = 12
	db["rows"][0]["panels"][0]["yaxes"][0]["format"] = "bps"
	db["rows"][0]["panels"][0]["yaxes"][1]["format"] = "bps"
	db["rows"][0]["panels"][0]["title"] = "$temp"	
	if "transparent" in db["rows"][0]["panels"][0]:
		db["rows"][0]["panels"][0]["transparent"] = True
	else:
		db["rows"][0]["panels"][0]["transparent"] = True
	db["id"] = None
	db["title"] = "Drill_Down_on_"+DB_title
	postParam = {"dashboard":db,"overwrite": True }
	generateDB(postParam)

def createTemplateVars(metadata):
       	temp={}
       	interface=[]
       	node=[]
       	for eachresult in metadata:
               	interface.append(eachresult["intf"])
               	node.append(eachresult["node"])
       	temp["interface"]=interface
        temp["node"]=node
        return json.dumps(temp)



if __name__ == "__main__":
	print "Cache-Control: no-cache"
	path  = os.environ["PATH_INFO"]
	inpUrl = path
	if inpUrl == "/dashboard":
		drilldown()
	if inpUrl == "/search":
        	search()
	if inpUrl == "/query":
		query()
			
