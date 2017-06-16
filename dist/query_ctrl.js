'use strict';

System.register(['app/plugins/sdk', './css/query-editor.css!'], function (_export, _context) {
  "use strict";

  var QueryCtrl, _createClass, GenericDatasourceQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }, function (_cssQueryEditorCss) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('GenericDatasourceQueryCtrl', GenericDatasourceQueryCtrl = function (_QueryCtrl) {
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
          //this.target.segments = this.target.segments||[];
          //this.target.valueSegments =this.target.valueSegments||[];
          _this.target.metric_array = _this.target.metric_array || ['Select Metric'];
          _this.target.metricValues_array = _this.target.metricValues_array || ['Select Metric Value'];
          _this.target.target_alias = _this.target.target_alias || "";
          _this.target.whereClauseGroup = _this.target.whereClauseGroup || [[{ 'left': 'Select Metric', 'op': '', 'right': 'Insert Target' }]];
          _this.target.inlineGroupOperator = _this.target.inlineGroupOperator || [['']];
          _this.target.outerGroupOperator = _this.target.outerGroupOperator || [''];
          _this.target.wName = ["Aida", "Aidan", "Alla", "Allen", "Beverly", "Bea", "Caleb", "Catherine", "false"];
          _this.wName = ["abcd", "azme", "aoiq", "dnvbv", "doie", "abwe", "aoio"];
          _this.test = "";
          _this.index = "";
          _this.parentIndex = "";
          _this.hoverEdit = false;
          _this.hiddenIndex = "";
          self = _this;
          return _this;
        }

        _createClass(GenericDatasourceQueryCtrl, [{
          key: 'addWhereClause',
          value: function addWhereClause(index) {
            this.target.whereClauseGroup[index].push({ 'left': 'Select Metric', 'op': '=', 'right': 'Insert Target' });
            console.log(this.target.metricValues_array);
          }
        }, {
          key: 'removeWhereClause',
          value: function removeWhereClause(parentIndex, index) {
            console.log(this.target.whereClauseGroup[parentIndex][index]);
            this.target.whereClauseGroup[parentIndex].splice(index, 1);
            console.log(this.target.whereClauseGroup[parentIndex]);
          }
        }, {
          key: 'addWhereClauseGroup',
          value: function addWhereClauseGroup() {
            this.target.whereClauseGroup.push([{ 'left': 'Select Metric', 'op': '', 'right': 'Insert Target' }]);
            this.target.inlineGroupOperator.push(['']);
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
          key: 'removeSegment',
          value: function removeSegment(index) {
            if (this.target.metric_array.length == 1) {
              this.target.metric_array.splice(index, 1, 'Select Metric');
            } else {
              this.target.metric_array.splice(index, 1);
            }
            console.log("I am in remove seg");
          }
        }, {
          key: 'addValueSegments',
          value: function addValueSegments() {
            this.target.metricValues_array.push('Select Metric Value');
            console.log(this.target.metricValues_array);
          }
        }, {
          key: 'removeValueSegment',
          value: function removeValueSegment(index) {
            if (this.target.metricValues_array.length == 1) {
              this.target.metricValues_array.splice(index, 1, 'Select Metric Value');
            } else {
              this.target.metricValues_array.splice(index, 1);
            }
            console.log("I am in remove value seg");
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
            return this.datasource.metricFindValues(this.target);
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
          value: function getWhereFields() {
            console.log("I am in get Table Names");
            console.log(self.target);
            console.log(arguments[0]);
            //var a = this.target.whereClauseGroup[parentIndex][index].right;
            return self.datasource.findWhereFields(self.target, self.parentIndex, self.index, arguments[0], arguments[1]);
          }
        }, {
          key: 'foo',
          value: function foo() {
            console.log("I am in foo");
            console.log(self.test);
            //console.log(index);
            //return ["abcd","azme","aoiq","dnvbv","doie","abwe","aoio"];
            return self.wName;
          }
        }, {
          key: 'saveIndices',
          value: function saveIndices(parentIndex, index) {
            console.log("I am saving indices");
            this.parentIndex = parentIndex;
            this.index = index;
          }
        }, {
          key: 'toggleEditorMode',
          value: function toggleEditorMode() {
            this.target.rawQuery = !this.target.rawQuery;
          }
        }, {
          key: 'onChangeInternal',
          value: function onChangeInternal() {
            //this.target.metric_array = ['Select Metric'];
            //this.target.metricValues_array = ['Select Matric Value'];
            console.log(this.target);
            this.panelCtrl.refresh();
          }
        }, {
          key: 'hoverIn',
          value: function hoverIn() {
            this.hoverEdit = true;
          }
        }, {
          key: 'hoverOut',
          value: function hoverOut() {
            this.hoverEdit = false;
          }
        }]);

        return GenericDatasourceQueryCtrl;
      }(QueryCtrl));

      _export('GenericDatasourceQueryCtrl', GenericDatasourceQueryCtrl);

      GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
