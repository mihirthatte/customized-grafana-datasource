'use strict';

System.register(['lodash'], function (_export, _context) {
  "use strict";

  var _, _createClass, GenericDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }],
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

      _export('GenericDatasource', GenericDatasource = function () {
        function GenericDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, GenericDatasource);

          this.type = instanceSettings.type;
          this.url = instanceSettings.url;
          this.name = instanceSettings.name;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
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
            var target = typeof options === "string" ? options : options.target;
            var interpolated = {
              target: this.templateSrv.replace(target, null, 'regex')
            };
            //console.log(interpolated);
            return this.backendSrv.datasourceRequest({
              url: this.url + '/searchT',
              data: interpolated,
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            }).then(this.mapToTextValue);
          }
        }, {
          key: 'metricFindColumns',
          value: function metricFindColumns(options) {
            var target = typeof options === "string" ? options : options.series;
            var interpolated = {
              target: this.templateSrv.replace(target, null, 'regex')
            };
            console.log(interpolated);
            return this.backendSrv.datasourceRequest({
              url: this.url + '/searchC',
              data: interpolated,
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            }).then(this.mapToTextValue);
          }
        }, {
          key: 'metricFindValues',
          value: function metricFindValues(options) {
            var target = typeof options === "string" ? options : options.series;
            var interpolated = {
              target: this.templateSrv.replace(target, null, 'regex')
            };
            console.log(interpolated);
            return this.backendSrv.datasourceRequest({
              url: this.url + '/searchV',
              data: interpolated,
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            }).then(this.mapToTextValue);
          }
        }, {
          key: 'mapToTextValue',
          value: function mapToTextValue(result) {
            return _.map(result.data, function (d, i) {
              if (d && d.text && d.value) {
                return { text: d.text, value: d.value };
              } else if (_.isObject(d)) {
                return { text: d, value: i };
              }
              return { text: d, value: d };
            });
          }
        }, {
          key: 'buildQueryParameters',
          value: function buildQueryParameters(options) {
            //remove placeholder targets
            options.targets = _.filter(options.targets, function (target) {
              return target.target !== 'select metric';
            });
            console.log(options.targets.metric_array);

            var query = _.map(options.targets, function (target) {
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
                  query += ' , values.' + target.metricValues_array[index];
                }
                console.log(query);

                query += ' between ($START,$END)';
                if (target.groupby_field != " ") {
                  query += ' by ' + target.groupby_field;
                }
                query += ' from ' + seriesName;
                if (target.condition) {
                  query += ' where ' + target.condition;
                }
                target.target = query;
                return query;
              }
            });

            var targets = _.map(options.targets, function (target) {
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
      }());

      _export('GenericDatasource', GenericDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
