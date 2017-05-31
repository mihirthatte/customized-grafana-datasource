import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

export class GenericDatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector, uiSegmentSrv)  {
    super($scope, $injector);

    this.scope = $scope;
    this.uiSegmentSrv = uiSegmentSrv;
    this.target.series = this.target.series||'select table';
    this.target.type = this.target.type || 'timeserie';
    this.target.condition = this.target.condition || ' ';
    this.target.groupby_field = this.target.groupby_field || ' '; 
    this.target.segments = this.target.segments||[];
    this.target.valueSegments =this.target.valueSegments||[];
    this.target.metric_array = this.target.metric_array||['Select Metric'];
    this.target.metricValues_array = this.target.metricValues_array ||['Select Metric Value'];
    this.target.target_alias = this.target.target_alias||"";
    
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
    return this.datasource.metricFindValues(this.target)
      .then(this.uiSegmentSrv.transformToSegments(false));
       }



 getTableNames() {
        console.log("I am in get Table Names");
        console.log(this.target);
    return this.datasource.metricFindTables(this.target)
      .then(this.uiSegmentSrv.transformToSegments(false));
        }
	


  toggleEditorMode() {
    this.target.rawQuery = !this.target.rawQuery;
  }

  onChangeInternal(param, index) {
    console.log(index);
	
    if(param == 'table'){
	this.target.metric_array = [];
        this.target.metricValues_array = [];
    }
    
    else if (param == 'metric'){
    	if (this.target.metric != 'select metric'){
		if(this.target.metric_array[index]){
			this.target.metric_array[index] = this.target.metric;
		}
		else {
    			this.target.metric_array.push(this.target.metric);
		}
    	}
    }

   else if(param == 'values'){
   	if (this.target.metricValues != 'select metric Value'){
		if(this.target.metricValues_array[index]){
			this.target.metricValues_array[index] = this.target.metricValues;
		}
		else { 
        		this.target.metricValues_array.push(this.target.metricValues);
		}
    	}
   }
    console.log(this.target);
    //this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }
}

GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';

