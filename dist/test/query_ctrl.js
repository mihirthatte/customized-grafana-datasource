'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDatasourceQueryCtrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = require('app/plugins/sdk');

require('./css/query-editor.css!');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GenericDatasourceQueryCtrl = exports.GenericDatasourceQueryCtrl = function (_QueryCtrl) {
  _inherits(GenericDatasourceQueryCtrl, _QueryCtrl);

  function GenericDatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
    _classCallCheck(this, GenericDatasourceQueryCtrl);

    var _this = _possibleConstructorReturn(this, (GenericDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(GenericDatasourceQueryCtrl)).call(this, $scope, $injector));

    _this.scope = $scope;
    _this.uiSegmentSrv = uiSegmentSrv;
    _this.target.series = _this.target.series || 'select table';
    _this.target.type = _this.target.type || 'timeserie';
    _this.target.condition = _this.target.condition || [];
    _this.target.groupby_field = _this.target.groupby_field || ' ';
    _this.target.segments = _this.target.segments || [];
    _this.target.valueSegments = _this.target.valueSegments || [];
    _this.target.metric_array = _this.target.metric_array || ['Select Metric'];
    _this.target.metricValues_array = _this.target.metricValues_array || ['Select Metric Value'];
    _this.target.target_alias = _this.target.target_alias || "";
    _this.target.whereClause = _this.target.whereClause || ['Select Metric'];
    _this.target.whereClauseGroup = _this.target.whereClauseGroup || [_this.target.whereClause];
    //this.target.operator = ['=', '>', '<', '!~', '<>','Like','Not Like'];
    _this.target.operator = _this.target.operator || ["="];
    _this.selectMenu = [{ 'text': '=', "value": "=" }];
    _this.target.wName = ["Aida", "Aidan", "Alla", "Allen", "Beverly", "Bea", "Caleb", "Catherine", "false"];
    _this.target.whereGroup = _this.target.whereGroup || ["AND"];
    return _this;
  }

  _createClass(GenericDatasourceQueryCtrl, [{
    key: 'addWhereClause',
    value: function addWhereClause() {
      this.target.whereClause.push('Select Metric Value');
      console.log(this.target.metricValues_array);
    }
  }, {
    key: 'addWhereClauseGroup',
    value: function addWhereClauseGroup() {
      this.target.whereClauseGroup.push([]);
      console.log(this.target.metricValues_array);
    }
  }, {
    key: 'getOperator',
    value: function getOperator() {
      var a = this.datasource.findOperator();
      return a;
      //.then(this.uiSegmentSrv.transformToSegments(false));
    }
  }, {
    key: 'addSegments',
    value: function addSegments() {
      this.target.metric_array.push('Select Metric');
      console.log(this.target.metric_array);
    }
  }, {
    key: 'addValueSegments',
    value: function addValueSegments() {
      this.target.metricValues_array.push('Select Metric Value');
      console.log(this.target.metricValues_array);
    }
  }, {
    key: 'getColumns',
    value: function getColumns() {
      console.log("I am in get Columns");
      console.log(this.target);
      return this.datasource.metricFindColumns(this.target).then(this.uiSegmentSrv.transformToSegments(false));
    }
  }, {
    key: 'getMetricValues',
    value: function getMetricValues() {
      console.log("I am in get Metric Values");
      console.log(this.target);
      var a = this.datasource.metricFindValues(this.target);
      console.log(a.$$state);
      return a;
      //.then(this.uiSegmentSrv.transformToSegments(false));
    }
  }, {
    key: 'getTableNames',
    value: function getTableNames() {
      console.log("I am in get Table Names");
      console.log(this.target);
      return this.datasource.metricFindTables(this.target).then(this.uiSegmentSrv.transformToSegments(false));
    }
  }, {
    key: 'getWhereFields',
    value: function getWhereFields(index) {
      this.panelCtrl.refresh();
      console.log("I am in get Table Names");
      console.log(this.target);
      return this.datasource.findWhereFields(this.target, index).then(this.uiSegmentSrv.transformToSegments(false));
    }
  }, {
    key: 'myFunc',
    value: function myFunc() {
      console.log("I am in my Func");
      console.log(this.target);
    }
  }, {
    key: 'toggleEditorMode',
    value: function toggleEditorMode() {
      this.target.rawQuery = !this.target.rawQuery;
    }
  }, {
    key: 'onChangeInternal',
    value: function onChangeInternal() {
      this.target.metric_array = ['Select Metric'];
      this.target.metricValues_array = ['Select Matric Value'];
      console.log(this.target);
    }
  }]);

  return GenericDatasourceQueryCtrl;
}(_sdk.QueryCtrl);

GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
//# sourceMappingURL=query_ctrl.js.map
