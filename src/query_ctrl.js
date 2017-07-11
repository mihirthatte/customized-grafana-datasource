import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

export class GenericDatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector, uiSegmentSrv)  {
    super($scope, $injector);

    this.scope = $scope;
    this.uiSegmentSrv = uiSegmentSrv;
    this.target.series = this.target.series||'select table';
    this.target.type = this.target.type || 'timeserie';
    this.target.condition = this.target.condition||[];
    this.target.groupby_field = this.target.groupby_field || ' '; 
    //this.target.segments = this.target.segments||[];
    //this.target.valueSegments =this.target.valueSegments||[];
    this.target.metric_array = this.target.metric_array||['Select Metric'];
    this.target.metricValues_array = this.target.metricValues_array ||['Select Metric Value'];
    this.target.aggregator = this.target.aggregator ||['average'];
    this.target.target_alias = this.target.target_alias||"";
    this.target.whereClauseGroup = this.target.whereClauseGroup||[[{'left':'Select Metric','op':'','right':''}]];
    this.target.inlineGroupOperator = this.target.inlineGroupOperator||[['']];
    this.target.outerGroupOperator = this.target.outerGroupOperator || [''];
    this.target.percentileValue = this.target.percentileValue||[''];
    this.target.bucket = this.target.bucket||[];
    this.target.bucketValue = this.target.bucketValue||[];
    this.test ="";
    this.index="";
    this.parentIndex="";
    this.hoverEdit = false;
    this.hiddenIndex = "";
    this.target.drillDown = [];
    this.target.drillDownValue = [];
    self = this;
  }

  addWhereClause(index){
		this.target.whereClauseGroup[index].push({'left':'Select Metric','op':'=','right':''});
                console.log(this.target.metricValues_array);
  	}
 removeWhereClause(parentIndex,index){
		console.log(this.target.whereClauseGroup[parentIndex][index]);
		this.target.whereClauseGroup[parentIndex].splice(index,1);
		console.log(this.target.whereClauseGroup[parentIndex]);

	}

  addWhereClauseGroup(){
                this.target.whereClauseGroup.push([{'left':'Select Metric','op':'','right':''}]);
		this.target.inlineGroupOperator.push(['']);
                console.log(this.target.metricValues_array);
        }

    getOperator(){              
       var a = this.datasource.findOperator();
	return a;
	//.then(this.uiSegmentSrv.transformToSegments(false));
	
	}	
  addSegments(){
		this.target.metric_array.push('Select Metric');
		console.log(this.target.metric_array);
	}

 removeSegment(index){
		if(this.target.metric_array.length == 1){
                        this.target.metric_array.splice(index,1,'Select Metric');
                }
		else{
			this.target.metric_array.splice(index,1);
		}
		console.log("I am in remove seg");
	}

  addValueSegments(){
                this.target.metricValues_array.push('Select Metric Value');
		this.target.aggregator.push('average');
		this.target.percentileValue.push('');
                console.log(this.target.metricValues_array);
        } 

 removeValueSegment(index){
		if(this.target.metricValues_array.length == 1){
			this.target.metricValues_array.splice(index,1,'Select Metric Value');
		}
		else{ 
			this.target.metricValues_array.splice(index,1);
		}
		console.log("I am in remove value seg");

	}

 addBucket(index){
		this.target.bucket.splice(index,0,'bucket');
		this.target.bucketValue.splice(index,0,'');
		console.log(this.target.bucket);
	}

  getColumns() {
	console.log("I am in get Columns");
	console.log(this.target);
    return this.datasource.findMetric(this.target,"Column")
      .then(this.uiSegmentSrv.transformToSegments(false));
  }

  getMetricValues() {
        console.log("I am in get Metric Values");
        console.log(this.target);
    	return this.datasource.findMetric(this.target,"Value")
      .then(this.uiSegmentSrv.transformToSegments(false));
       }

 

 getTableNames() {
        console.log("I am in get Table Names");
        console.log(this.target);
    	return  this.datasource.metricFindTables(this.target)
      .then(this.uiSegmentSrv.transformToSegments(false));
        }

 getWhereFields(){
	console.log("I am in get Table Names");
        console.log(self.target);
	console.log(arguments[0]);
	//var a = this.target.whereClauseGroup[parentIndex][index].right;
    	return self.datasource.findWhereFields(self.target,self.parentIndex, self.index, arguments[0], arguments[1]);
        }

generateDrillDown(){
	this.target.drillDown.splice(0,0,'Drill');
}


createDashboard(){
	var r = this.datasource.generateDashboard(this.target, this.panelCtrl.$scope.ctrl.range.from.toISOString(), this.panelCtrl.$scope.ctrl.range.to.toISOString(),  this.panelCtrl.dashboard.title, this.datasource.name);
	//this.saveDashboard()
	window.location.reload();
	return r;

}
 foo(){
	console.log("I am in foo");
       	console.log(self.test);
	//console.log(index);
	//return ["abcd","azme","aoiq","dnvbv","doie","abwe","aoio"];
	return self.wName;
	}

  saveIndices(parentIndex, index){
        console.log("I am saving indices");
        this.parentIndex = parentIndex;
	this.index = index;
	//return self.datasource.findWhereFields(self.target,parentIndex, index, " ", arguments[1]);
	}



  toggleEditorMode() {
    this.target.rawQuery = !this.target.rawQuery;
  }

 onChangeInternal() {
	//this.target.metric_array = ['Select Metric'];
        //this.target.metricValues_array = ['Select Matric Value'];
       console.log(this.target);
	this.panelCtrl.refresh();
     }
 hoverIn(){
	this.hoverEdit = true;
	}
 hoverOut(){
	this.hoverEdit = false;
	}
 
}

GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';

