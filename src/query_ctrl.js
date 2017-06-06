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
    this.target.segments = this.target.segments||[];
    this.target.valueSegments =this.target.valueSegments||[];
    this.target.metric_array = this.target.metric_array||['Select Metric'];
    this.target.metricValues_array = this.target.metricValues_array ||['Select Metric Value'];
    this.target.target_alias = this.target.target_alias||"";
    this.target.whereClause = this.target.whereClause||['Select Metric'];
    this.target.whereClauseGroup = this.target.whereClauseGroup||[this.target.whereClause];
    //this.target.operator = ['=', '>', '<', '!~', '<>','Like','Not Like'];
    this.target.operator = this.target.operator||["="];
    this.selectMenu = [{'text':'=' , "value": "="}];
    this.target.wName = ["Aida", "Aidan", "Alla", "Allen", "Beverly", "Bea", "Caleb","Catherine","false"];
    this.target.whereGroup = this.target.whereGroup||["AND"];
  }

  addWhereClause(){
		this.target.whereClause.push('Select Metric Value');
                console.log(this.target.metricValues_array);

  	}
  addWhereClauseGroup(){
                this.target.whereClauseGroup.push(['Select Metric Value']);
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

  addValueSegments(){
                this.target.metricValues_array.push('Select Metric Value');
                console.log(this.target.metricValues_array);
        }
  getColumns() {
	console.log("I am in get Columns");
	console.log(this.target);
    return this.datasource.metricFindColumns(this.target)
      .then(this.uiSegmentSrv.transformToSegments(false));
  }

  getMetricValues() {
        console.log("I am in get Metric Values");
        console.log(this.target);
    var a = this.datasource.metricFindValues(this.target);
	console.log(a.$$state);
	return a;
      //.then(this.uiSegmentSrv.transformToSegments(false));
       }



 getTableNames() {
        console.log("I am in get Table Names");
        console.log(this.target);
    return  this.datasource.metricFindTables(this.target)
      .then(this.uiSegmentSrv.transformToSegments(false));
        }

 getWhereFields(index){
	this.panelCtrl.refresh();
	console.log("I am in get Table Names");
        console.log(this.target);
    	return this.datasource.findWhereFields(this.target,index)
      .then(this.uiSegmentSrv.transformToSegments(false));
        }

 myFunc(){
	console.log("I am in my Func");
        console.log(this.target);
	}

  toggleEditorMode() {
    this.target.rawQuery = !this.target.rawQuery;
  }


 onChangeInternal() {
	this.target.metric_array = ['Select Metric'];
        this.target.metricValues_array = ['Select Matric Value'];
       console.log(this.target);
     }



 
}

GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';

