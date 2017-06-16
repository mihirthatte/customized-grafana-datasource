import _ from "lodash";

export class GenericDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.selectMenu = ['=','>','<'];
    this.metricValue = this.metricValue||[];
    this.metricColumn =this.metricColumn||[];
    this.whereSuggest =[];
  }

  query(options) {
    console.log(options.targets);
    //console.log(ctrl.metric_array);
    //var my_tar = options.target[0];
    //console.log(my_tar);
    var query = this.buildQueryParameters(options); 
    console.log(query);
    query.targets = query.targets.filter(t => !t.hide);

    if (query.targets.length <= 0) {
      return this.q.when({data: []});
    }

    return this.backendSrv.datasourceRequest({
      url: this.url + '/query',
      data: query,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  testDatasource() {
    return this.backendSrv.datasourceRequest({
      url: this.url + '/',
      method: 'GET'
    }).then(response => {
      if (response.status === 200) {
        return { status: "success", message: "Data source is working", title: "Success" };
      }
    });
  }

  annotationQuery(options) {
    var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
    var annotationQuery = {
      range: options.range,
      annotation: {
        name: options.annotation.name,
        datasource: options.annotation.datasource,
        enable: options.annotation.enable,
        iconColor: options.annotation.iconColor,
        query: query
      },
      rangeRaw: options.rangeRaw
    };

    return this.backendSrv.datasourceRequest({
      url: this.url + '/annotations',
      method: 'POST',
      data: annotationQuery
    }).then(result => {
      return result.data;
    });
  }

  metricFindTables(options) {
    var target = typeof (options) === "string" ? options : "Find tables";
    var interpolated = {
        target: this.templateSrv.replace(target, null, 'regex')
    };
   //console.log(interpolated);
    var a =  this.backendSrv.datasourceRequest({
      url: this.url + '/searchT',
      data: interpolated,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(this.mapToTextValue);
	return a;
  }

  metricFindColumns(options) {
    var target = typeof (options) === "string" ? options : options.series;
    var interpolated = {
        target: this.templateSrv.replace(target, null, 'regex')
    };
    console.log(interpolated);
    var r = this.backendSrv.datasourceRequest({
      url: this.url + '/searchC',
      data: interpolated,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(this.mapToTextValue);
	/*.then(function(result){
        this.metricColumn = result.data;
        console.log(this.metricColumn);
        }.bind(this));
	*/
	return r;
  }

  findWhereFields(options,parentIndex,index, like_field, callback){
	var target = typeof (options) === "string" ? options : options.series;
	var meta_field = options.whereClauseGroup[parentIndex][index].left;
	//var like_field = options.whereClauseGroup[parentIndex][index].right;
    var interpolated = {
        target: this.templateSrv.replace(target, null, 'regex'),
	meta_field: this.templateSrv.replace(meta_field, null, 'regex'),
	like_field: this.templateSrv.replace(like_field, null, 'regex')
    };
    console.log(interpolated);
    var r =  this.backendSrv.datasourceRequest({
      url: this.url + '/searchW',
      data: interpolated,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(this.mapToArray).then(callback);
	/*.then(function(result){
        this.whereSuggest = result.data;
        console.log(this.whereSuggest);
	return this.whereSuggest;
        }.bind(this));*/
	return r;
  }

  metricFindValues(options) {
    var target = typeof (options) === "string" ? options : options.series;
    var interpolated = {
        target: this.templateSrv.replace(target, null, 'regex')
    };
    console.log(interpolated);
    var r =  this.backendSrv.datasourceRequest({
      url: this.url + '/searchV',
      data: interpolated,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(function(result){
	this.metricValue = result.data;
	console.log(this.metricValue);
	}.bind(this));
	return r;
  }
   findOperator(){

	var r =  new Promise(function(resolve, reject) {
		var a = {"data":['=','<','>'], "status":200, "statusText":"OK"};
	        resolve(a);
	}).then(this.mapToTextValue);
	return r;
	}
  mapToTextValue(result) {
    var a =  _.map(result.data, (d, i) => {
      if (d && d.text && d.value) {
        return { text: d.text, value: d.value };
      } else if (_.isObject(d)) {
        return { text: d, value: i};
      }
      return { text: d, value: d };
    });
	return a;
  }

 mapToArray(result){
	return result.data;
	}

  mapToListValue(result) {
    this.metricValue = result.data;
    console.log(this.metricValue);
  }

  buildQueryParameters(options) {
    //remove placeholder targets
    options.targets = _.filter(options.targets, target => {
      return target.target !== 'select metric';
    });
    console.log(options.targets.metric_array);

	var query = _.map(options.targets, function(target) {
		console.log(target.rawQuery);

		if(target.rawQuery){
			var query = target.target;
			return query;
		}
		

		else{
			var query = 'get ';
			var seriesName = target.series;
			for(var index = 0 ; index < target.metric_array.length; index++){
				query+= ' '+target.metric_array[index];
				if ( index+1 == target.metric_array.length){
					break;
				}
				query+=',';
			}		
			console.log(query);

			for(var index = 0 ; index < target.metricValues_array.length; index++){
                        	query+= ' , values.'+target.metricValues_array[index]; 
                	}
                	console.log(query);
		
			query+= ' between ($START,$END)';
			if (target.groupby_field != " ") {
                		query += ' by ' + target.groupby_field;
                	}
        		query += ' from ' + seriesName;
				query += " where ";
				for(var i=0; i<target.whereClauseGroup.length; i++)
				{
					if(i>0) query +=" "+ target.outerGroupOperator[i]+" ";
					query +=" ( ";
					for(var j =0 ; j<target.whereClauseGroup[i].length; j++){
						if(j>0) query = query +" "+target.inlineGroupOperator[i][j]+" ";
     						query += target.whereClauseGroup[i][j].left+" "+target.whereClauseGroup[i][j].op+" \""+target.whereClauseGroup[i][j].right+"\"";
					}
					query +=" )";
				}
				
			target.target = query;
			return query;
		}
	}); 

    var targets = _.map(options.targets, target => {
	console.log(target);
      return {
        //target: this.templateSrv.replace(target.target),
        target: query[0],
        refId: target.refId,
        hide: target.hide,
        type: target.type || 'timeserie',
	alias : target.target_alias
      };
    });
    
    options.targets = targets;
    console.log(options.targets);
    return options;
  }
}
