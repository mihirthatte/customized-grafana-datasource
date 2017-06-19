'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDatasource = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenericDatasource = exports.GenericDatasource = function () {
  function GenericDatasource(instanceSettings, $q, backendSrv, templateSrv) {
    _classCallCheck(this, GenericDatasource);

    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.selectMenu = ['=', '>', '<'];
    this.metricValue = this.metricValue || [];
    this.metricColumn = this.metricColumn || [];
    this.whereSuggest = [];
  }

  _createClass(GenericDatasource, [{
    key: 'query',
    value: function query(options) {
      console.log(options.targets);
      //console.log(ctrl.metric_array);
      //var my_tar = options.target[0];
      //console.log(my_tar);
      var query = this.buildQueryParameters(options);
      console.log(query);
      query.targets = query.targets.filter(function (t) {
        return !t.hide;
      });

      if (query.targets.length <= 0) {
        return this.q.when({ data: [] });
      }

      return this.backendSrv.datasourceRequest({
        url: this.url + '/query',
        data: query,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }, {
    key: 'testDatasource',
    value: function testDatasource() {
      return this.backendSrv.datasourceRequest({
        url: this.url + '/',
        method: 'GET'
      }).then(function (response) {
        if (response.status === 200) {
          return { status: "success", message: "Data source is working", title: "Success" };
        }
      });
    }
  }, {
    key: 'annotationQuery',
    value: function annotationQuery(options) {
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
      }).then(function (result) {
        return result.data;
      });
    }
  }, {
    key: 'metricFindTables',
    value: function metricFindTables(options) {
      var target = typeof options === "string" ? options : "Find tables";
      var interpolated = {
        target: this.templateSrv.replace(target, null, 'regex')
      };
      //console.log(interpolated);
      var a = this.backendSrv.datasourceRequest({
        url: this.url + '/searchT',
        data: interpolated,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(this.mapToTextValue);
      return a;
    }
  }, {
    key: 'metricFindColumns',
    value: function metricFindColumns(options) {
      var target = typeof options === "string" ? options : options.series;
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
  }, {
    key: 'findWhereFields',
    value: function findWhereFields(options, parentIndex, index, like_field, callback) {
      var target = typeof options === "string" ? options : options.series;
      var meta_field = options.whereClauseGroup[parentIndex][index].left;
      //var like_field = options.whereClauseGroup[parentIndex][index].right;
      var interpolated = {
        target: this.templateSrv.replace(target, null, 'regex'),
        meta_field: this.templateSrv.replace(meta_field, null, 'regex'),
        like_field: this.templateSrv.replace(like_field, null, 'regex')
      };
      console.log(interpolated);
      var r = this.backendSrv.datasourceRequest({
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
  }, {
    key: 'metricFindValues',
    value: function metricFindValues(options) {
      var target = typeof options === "string" ? options : options.series;
      var interpolated = {
        target: this.templateSrv.replace(target, null, 'regex')
      };
      console.log(interpolated);
      var r = this.backendSrv.datasourceRequest({
        url: this.url + '/searchV',
        data: interpolated,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(this.mapToTextValue);
      /*then(function(result){
      this.metricValue = result.data;
      console.log(this.metricValue);
      }.bind(this)); */
      return r;
    }
  }, {
    key: 'findOperator',
    value: function findOperator() {

      var r = new Promise(function (resolve, reject) {
        var a = { "data": ['=', '<', '>'], "status": 200, "statusText": "OK" };
        resolve(a);
      }).then(this.mapToTextValue);
      return r;
    }
  }, {
    key: 'mapToTextValue',
    value: function mapToTextValue(result) {
      var a = _lodash2.default.map(result.data, function (d, i) {
        if (d && d.text && d.value) {
          return { text: d.text, value: d.value };
        } else if (_lodash2.default.isObject(d)) {
          return { text: d, value: i };
        }
        return { text: d, value: d };
      });
      return a;
    }
  }, {
    key: 'mapToArray',
    value: function mapToArray(result) {
      return result.data;
    }
  }, {
    key: 'mapToListValue',
    value: function mapToListValue(result) {
      this.metricValue = result.data;
      console.log(this.metricValue);
    }
  }, {
    key: 'buildQueryParameters',
    value: function buildQueryParameters(options) {
      //remove placeholder targets
      options.targets = _lodash2.default.filter(options.targets, function (target) {
        return target.target !== 'select metric';
      });
      console.log(options.targets.metric_array);

      var query = _lodash2.default.map(options.targets, function (target) {
        console.log(target.rawQuery);

        if (target.rawQuery) {
          var query = target.target;
          return query;
        } else {
          var query = 'get ';
          var seriesName = target.series;
          for (var index = 0; index < target.metric_array.length; index++) {
            query += ' ' + target.metric_array[index];
            if (index + 1 == target.metric_array.length) {
              break;
            }
            query += ',';
          }
          console.log(query);

          for (var index = 0; index < target.metricValues_array.length; index++) {
            query += ', aggregate(values.' + target.metricValues_array[index] + ', $quantify, ';
            if (target.aggregator[index] == "percentile") query += target.aggregator[index] + '(' + target.percentileValue[index] + '))';else query += target.aggregator[index] + ')';
          }
          console.log(query);

          query += ' between ($START,$END)';
          if (target.groupby_field != " ") {
            query += ' by ' + target.groupby_field;
          }
          query += ' from ' + seriesName;
          query += " where ";
          for (var i = 0; i < target.whereClauseGroup.length; i++) {
            if (i > 0) query += " " + target.outerGroupOperator[i] + " ";
            query += " ( ";
            for (var j = 0; j < target.whereClauseGroup[i].length; j++) {
              if (j > 0) query = query + " " + target.inlineGroupOperator[i][j] + " ";
              query += target.whereClauseGroup[i][j].left + " " + target.whereClauseGroup[i][j].op + " \"" + target.whereClauseGroup[i][j].right + "\"";
            }
            query += " )";
          }

          target.target = query;
          return query;
        }
      });

      var targets = _lodash2.default.map(options.targets, function (target) {
        console.log(target);
        return {
          //target: this.templateSrv.replace(target.target),
          target: query[0],
          refId: target.refId,
          hide: target.hide,
          type: target.type || 'timeserie',
          alias: target.target_alias
        };
      });

      options.targets = targets;
      console.log(options.targets);
      return options;
    }
  }]);

  return GenericDatasource;
}();
//# sourceMappingURL=datasource.js.map
