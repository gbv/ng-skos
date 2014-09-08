/**
 * @ngdoc overview
 * @name json-text
 * @module json-text
 * @description
 *
 * This utility module provides directive {@link json-text.directive:jsonText 
 * jsonText} for directly displaying or editing JSON objects as text strings.
 */
angular.module('jsonText', []).directive('jsonText', function () {
  return {
    restrict: 'AE',
    require: 'ngModel',
    scope: {},
    link: function (scope, element, attrs, ngModel) {
      scope.jsonValid = true;
      function fromJson(text) {
        try {
          scope.jsonValid = true;
          return angular.fromJson(text);
        } catch (e) {
          scope.jsonValid = false;
        }
      }
      function toJson(object) {
        return angular.toJson(object, true);
      }
      ngModel.$parsers.push(fromJson);
      ngModel.$formatters.push(toJson);
      scope.$watch(attrs.ngModel, function (newValue, oldValue) {
        if (newValue != oldValue) {
          ngModel.$setViewValue(toJson(newValue));
          ngModel.$render();
        }
      }, true);
    }
  };
});
/**
 * @ngdoc overview
 * @name ng-skos
 * @module ng-skos
 * @description
 *
 * The main module <b>ngSKOS</b> contains several directives and services to
 * handle SKOS data. See the [developer guide](#guide) for an introduction and
 * the [API reference](#api) for documentation of the module.
 */
angular.module('ngSKOS', ['ngSanitize']).value('version', '0.0.1');
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConcept
 * @restrict A
 * @scope
 * @description
 * 
 * Display a ng-skos [concept](#/guide/concepts). Changes on the concept are
 * reflected by changes in the scope variables so the display is updated
 * automatically.
 *
 * ## Scope
 *
 * The following variables are added to the scope:
 * <ul>
 * <li>ancestors (array of concepts)
 * <li>prefLabel (object of strings)
 * <li>altLabel (object of array of strings)
 * <li>notation (string)
 * <li>note (object of array of strings)
 * <li>broader (array of concepts)
 * <li>narrower (array of concepts)
 * <li>related (array of concepts)
 * </ul>
 *
 * In addition the helper method `isEmptyObject` is provided to check whether an object
 * is empty.
 *
 * ## Source code
 *
 * The most recent 
 * [source code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosConcept.js)
 * of this directive is available at GitHub.
 * 
 * @param {string} skos-concept Assignable angular expression with a
 *      [concept](#/guide/concepts) to bind to
 * @param {string} language Assignable angular expression with 
 *      preferred language to be used as bounded `language` variable. 
 * @param {string} skos-click function to call when a connected concept is clicked
 * @param {string} template-url URL of a template to display the concept
 *
 */
angular.module('ngSKOS').directive('skosConcept', function () {
  return {
    restrict: 'AE',
    scope: {
      concept: '=skosConcept',
      language: '=language',
      click: '=skosClick'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'template/skos-concept.html';
    },
    link: function link(scope, element, attr) {
      scope.isEmptyObject = function (object) {
        var keys = Object.keys;
        return !(keys && keys.length);
      };
      scope.$watch('concept', function (concept) {
        angular.forEach([
          'uri',
          'inScheme',
          'ancestors',
          'prefLabel',
          'altLabel',
          'note',
          'notation',
          'narrower',
          'broader',
          'related'
        ], function (field) {
          scope[field] = concept ? concept[field] : null;
        });
      }, true);
    }
  };
});
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConceptBrowser
 * @restrict E
 * @scope
 * @description
 *
 * ## Scope
 *
 * The following variables are added to the scope:
 * <ul>
 * <li>concept
 * </ul>
 *
 * @param {string} concept selected [concept](#/guide/concepts)
 * @param {string} typeahead OpenSearchSuggestions for typeahead
 * @param {string} lookup-notation SkosConceptProvider to look up by notation
 * @param {string} search NOT SUPPORTED YET
 * @param {string} template-url URL of a template to display the concept browser
 */
angular.module('ngSKOS').directive('skosConceptBrowser', function () {
  return {
    restrict: 'E',
    scope: {
      concept: '=concept',
      typeahead: '=typeahead',
      lookupNotation: '=lookupNotation',
      search: '=search'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'template/skos-concept-browser.html';
    },
    link: function link(scope, element, attr) {
      scope.searchLabel = '';
      scope.$watch('concept', function (concept) {
      }, true);
      // look up by notation or label
      scope.lookupConcept = function (item) {
        // populate with basic data
        var concept = {
            notation: [item.notation],
            prefLabel: { de: item.label }
          };
        // call SkosConceptProvider
        scope.lookup.updateConcept(concept).then(function () {
          console.log('updateConcept');
        });
      };
    }
  };
});
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConceptList
 * @restrict A
 * @description
 *
 * This directive displays a list of [concepts](#/guide/concepts) with options to manipulate those lists.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosConceptList.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skosConceptList Object containing an array of concepts
 * @param {string} onSelect function handling the selection of one list item
 * @param {string} templateUrl URL of a template to display the concept list
 *
*/
angular.module('ngSKOS').directive('skosConceptList', function () {
  return {
    restrict: 'A',
    scope: {
      concepts: '=skosConceptList',
      onSelect: '=onSelect'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl ? attrs.templateUrl : 'template/skos-concept-list.html';
    },
    link: function link(scope, element, attr) {
      scope.removeConcept = function (index) {
        scope.concepts.splice(index, 1);
      };
      scope.$watch('concepts');
    }
  };
});
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosLabel
 * @restrict A
 * @description
 *
 * Displays the preferred label of a concept.
 * Changes on the preferred label(s) are reflected in the display.
 *
 * @param {string} skos-label Assignable angular expression with 
 *      [concept](#/guide/concepts) data to bind to.
 * @param {string=} lang optional language. If not specified, an arbitrary
 *      preferred label is selected. Future versions of this directive may
 *      use more elaborated heuristics to select an alternative language.
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      <dl>
        <dt>en</dt>
        <dd><span skos-label="sampleConcept" lang="en"/></dd>
        <dt>de</dt>
        <dd><span skos-label="sampleConcept" lang="de"/></dd>
        <dt><input type="text" ng-model="lang2"/></dt>
        <dd><span skos-label="sampleConcept" lang="{{lang2}}"/></dd>
      </dl>
      <textarea json-text ng-model="sampleConcept" cols="40" rows="20" />
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS','jsonText']);

    function myController($scope) {
        $scope.sampleConcept = {
            prefLabel: { 
                en: "example",
                de: "Beispiel",
            },
        };
        $scope.lang2 = "fr";
    }
  </file>
</example>
 */
angular.module('ngSKOS').directive('skosLabel', function () {
  return {
    restrict: 'A',
    scope: { concept: '=skosLabel' },
    template: '{{concept.prefLabel[language] ? concept.prefLabel[language] : "???"}}',
    link: function (scope, element, attrs) {
      function updateLanguage(language) {
        scope.language = language ? language : attrs.lang;
        //console.log("updateLanguage: "+scope.language);
        //console.log(scope.concept.prefLabel);
        language = scope.concept ? selectLanguage(scope.concept.prefLabel, scope.language) : '';
        if (language != scope.language) {
          // console.log("use language "+language+" instead of "+scope.language);
          scope.language = language;
        }
      }
      function selectLanguage(labels, language) {
        if (angular.isObject(labels)) {
          if (language && labels[language]) {
            return language;
          } else {
            for (language in labels) {
              return language;
            }
          }
        }
      }
      // update if lang attribute changed (also called once at initialization)
      attrs.$observe('lang', updateLanguage);
      // update with same language if prefLabels changed
      scope.$watch('concept.prefLabel', function (value) {
        updateLanguage();
      }, true);
    }
  };
});
/**
 * @ngdoc directive
 * @name ng-skos.directive:skosTree
 * @restrict A
 * @description
 *
 * ...
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosTree.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skos-tree Tree to display
 * @param {string} template-url URL of a template to display the tree
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      ...
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        // ...
    }
  </file>
</example>
 */
angular.module('ngSKOS').directive('skosTree', [
  '$compile',
  function ($compile) {
    return {
      restrict: 'A',
      transclude: true,
      scope: { tree: '=skosTree' },
      templateUrl: function (elem, attrs) {
        return attrs.templateUrl ? attrs.templateUrl : 'template/skos-tree.html';
      },
      compile: function (tElement, tAttr, transclude) {
        var contents = tElement.contents().remove();
        var compiledContents;
        return function (scope, iElement, iAttr) {
          if (!compiledContents) {
            compiledContents = $compile(contents, transclude);
          }
          compiledContents(scope, function (clone, scope) {
            iElement.append(clone);
          });
        };
      }
    };
  }
]);
/**
 * @ngdoc service
 * @name ng-skos.service:SkosConceptListProvider
 * @description
 * 
 * Get an ordered list of concepts via HTTP.
 *
 * The server to be queried with this service is expected to return a list with
 * [concept](#/guide/concepts) objects.
 * 
 * ## Configuration
 * 
 * * **`url`**: URL template to get the list from
 * * **`jsonp`**: enable JSONP
 * * **`transform`**: transformation function to map to expected response format
 *
 * ## Methods
 *
 * * **`getConceptList()`**
 * * **`updateConceptList(list)`**
 *
 */
angular.module('ngSKOS').factory('SkosConceptListProvider', [
  'SkosProvider',
  function (SkosProvider) {
    // inherit from SkosProvider
    var SkosConceptListProvider = function (args) {
      SkosProvider.call(this, args);
    };
    SkosConceptListProvider.prototype = new SkosProvider();
    SkosConceptListProvider.prototype.getConceptList = function () {
      return this.get();
    };
    SkosConceptListProvider.prototype.updateConceptList = function () {
      return this.getConceptList(list).then(function (response) {
        angular.copy(response, list);
      });
    };
    return SkosConceptListProvider;
  }
]);
/**
 * @ngdoc service
 * @name ng-skos.service:SkosConceptProvider
 * @description
 * 
 * Get concepts via HTTP. 
 *
 * The server to be queried with this service is expected to return a JSON
 * object with one [concept](#/guide/concepts). The concept object may contain
 * links to narrower and broader concepts, among other information.
 * 
 * ## Configuration
 * 
 * * **`url`**: URL template for requests
 * * **`jsonp`**: enable JSONP
 * * **`transform`**: custom transformation function to map expected response format
 *
 * ## Methods
 *
 * * **`getConcept(concept)`**
 * * **`updateConcept(concept)`**
 * * **`updateConnected(concept)`**
 *
 * @example
 *  <example module="myApp">
 *    <file name="index.html">
 *      <div ng-controller="myController">
 *      </div>
 *    </file>
 *    <file name="script.js">
 *      angular.module('myApp',['ngSKOS']);
 *      function myController($scope, SkosConceptProvider) {
 *          var foo = new SkosConceptProvider({
 *              url: '...'
 *          });
 *      }
 *    </file>
 *  </example>
 */
angular.module('ngSKOS').factory('SkosConceptProvider', [
  'SkosProvider',
  function (SkosProvider) {
    // inherit from SkosProvider
    var SkosConceptProvider = function (args) {
      SkosProvider.call(this, args);
    };
    SkosConceptProvider.prototype = new SkosProvider();
    SkosConceptProvider.prototype.getConcept = function (concept) {
      var url;
      // look up by uri / notation / prefLabel
      if (this.url) {
        if (angular.isFunction(this.url)) {
          url = this.url(concept);
        } else {
          url = this.url;
          if (concept.notation) {
            var notation = concept.notation[0];
            url = url.replace('{notation}', decodeURIComponent(notation));
          }
          url = url.replace('{uri}', decodeURIComponent(concept.uri));
        }
      } else {
        url = concept.uri;
      }
      return this.get(url);
    };
    SkosConceptProvider.prototype.updateConcept = function (concept) {
      return this.getConcept(concept).then(function (response) {
        angular.copy(response, concept);
      });
    };
    SkosConceptProvider.prototype.updateConnected = function (concept, which) {
      if (angular.isString(which)) {
        which = [which];
      } else if (!angular.isArray(which)) {
        which = [
          'broader',
          'narrower',
          'related'
        ];
      }
      var service = this;
      angular.forEach(which, function (w) {
        angular.forEach(concept[w], function (c) {
          service.updateConcept(c);
        });
      });
    };
    return SkosConceptProvider;
  }
]);
/**
 * @ngdoc service
 * @name ng-skos.service:SkosProvider
 * @description
 * 
 * Utility service to facilitate HTTP requests. 
 *
 * This service implements use of URL templates to perform HTTP requests with 
 * optional transformation of JSON responses and error handling. Directly use
 * [SkosConceptProvider](#/api/ng-skos.service:SkosConceptProvider) and
 * [SkosConceptListProvider](#/api/ng-skos.service:SkosConceptListProvider)
 * instead.
 * 
 * ## Configuration
 * 
 * * **`url`**: URL template for requests
 * * **`jsonp`**: enable JSONP
 * * **`transform`**: custom transformation function to map expected response format
 *
 * ## Methods
 *
 * * **`get([url])`**: perform a HTTP request
 *
 */
angular.module('ngSKOS').factory('SkosProvider', [
  '$http',
  '$q',
  function ($http, $q) {
    // constructor
    var SkosProvider = function (args) {
      if (!args) {
        args = {};
      }
      this.transform = args.transform;
      this.url = args.url;
      var jsonp = args.jsonp;
      if (jsonp && (jsonp === true || angular.isNumber(jsonp) || jsonp.match(/^\d/))) {
        jsonp = 'callback';
      }
      this.jsonp = jsonp;
    };
    SkosProvider.prototype = {
      get: function (url) {
        if (!url) {
          url = this.url;
        }
        var transform = this.transform;
        var get = $http.get;
        if (this.jsonp) {
          get = $http.jsonp;
          url += url.indexOf('?') == -1 ? '?' : '&';
          url += this.jsonp + '=JSON_CALLBACK';
        }
        return get(url).then(function (response) {
          try {
            return transform ? transform(response.data) : response.data;
          } catch (e) {
            console.error(e);
            return $q.reject(e);
          }
        }, function (response) {
          console.error(response);
          return $q.reject(response.data);
        });
      }
    };
    return SkosProvider;
  }
]);
angular.module('ngSKOS').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('template/skos-concept-browser.html', '<div style="margin:1em 0em"><input class="form-control" suggest-typeahead="" typeahead-on-select="" ng-model="conceptLabel" placeholder="Search by terms (typeahead)" typeahead-loading="loadingLocations" typeahead-editable="false"><i ng-show="loadingLocations" class="glyphicon glyphicon-refresh typeahead-loading"></i></div><div class="search-top" style="overflow:hidden;margin-bottom:15px"><form ng-submit="reselectConcept(\'origin\', originNotation)"><span style="float:left"><input class="form-control search-top-input" ng-model="originNotation.notation" placeholder="Enter full notation"></span> <button type="submit" ng-disabled="!originNotation.notation.length" class="search-top-button"><span class="glyphicon glyphicon-search"></span></form></div><div skos-concept="concept" skos-click="" language="language"></div>');
    $templateCache.put('template/skos-concept-list.html', '<div><ul ng-if="concepts.length" style="list-style-type:none;padding-left:0px"><li ng-repeat="c in concepts" style="max-width:320px;display:block"><span class="notation">{{c.notation[0]}}</span> <span>{{c.prefLabel.de}}</span><div style="display:inline-table"><a href="#" ng-click="onSelect(c)"><span class="glyphicon glyphicon-search"></span></a> <a href="#" ng-click="removeConcept($index)"><span class="glyphicon glyphicon-trash"></span></a></div></li></ul></div>');
    $templateCache.put('template/skos-concept-thesaurus.html', '<div class="skos-concept-thesaurus"><ul ng-if="ancestors.length" class="ancestors"><span ng-if="inScheme" class="classification">{{inScheme}}</span><li class="ancestor" ng-repeat="a in ancestors"><span skos-label="a" lang="{{language}}" ng-click="update(a);reload();"></span></li></ul><div class="top top-classic"><span ng-if="notation" class="notation">{{notation[0]}}</span> <b><span skos-label="concept" lang="{{language}}"></span></b><a ng-if="notation" class="uri" href="{{uri}}"><span style="vertical-align:-10%" class="glyphicon glyphicon-globe"></span></a></div><div ng-if="altLabel.length" class="skos-concept-altlabel"><ul><li ng-repeat="alt in altLabel"><span ng-if="$index < 5" style="display:inline">{{alt}}</span> <span style="margin-left:-4px;margin-right:3px" ng-if="$index < 4 && $index < altLabel.length-1">,</span></li></ul></div><div ng-if="broader.length" class="skos-concept-thesaurus-relation"><b>Broader Terms:</b><ul ng-repeat="b in broader"><li><span skos-label="b" lang="{{language}}" ng-click="click(b)"></li></ul></div><div ng-if="narrower.length" class="skos-concept-thesaurus-relation"><b>Narrower Terms:</b><ul ng-repeat="n in narrower"><li><span skos-label="n" lang="{{language}}" ng-click="click(n)"></li></ul></div><div ng-if="related.length" class="skos-concept-thesaurus-relation"><b>Related Terms:</b><ul ng-repeat="r in related"><li><span skos-label="r" lang="{{language}}" ng-click="click(r)"></li></ul></div></div>');
    $templateCache.put('template/skos-concept.html', '<div class="skos-concept"><div class="top top-alt"><span ng-if="notation.length" class="notation">{{notation[0]}}</span> <b><span ng-if="prefLabel" skos-label="concept" lang="{{language}}"></span></b> <a ng-if="uri && uri != notation" class="uri" href="{{uri}}"><span class="glyphicon glyphicon-globe"></span></a></div><div ng-if="altLabel.length" class="skos-concept-altlabel"><ul><li ng-repeat="alt in altLabel"><span ng-if="$index < 5" style="display:inline">{{alt}}</span> <span style="margin-left:-4px;margin-right:3px" ng-if="$index < 4 && $index < altLabel.length-1">,</span></li></ul></div><div ng-if="broader.length || narrower.length || related.length" class="skos-concept-connected"><div ng-if="broader.length" class="skos-concept-relation skos-concept-relation-broader"><ul ng-repeat="c in broader"><li><span skos-label="c" lang="{{language}}" ng-click="click(c)"></span></li></ul></div><div ng-if="narrower.length" class="skos-concept-relation skos-concept-relation-narrower"><ul ng-repeat="c in narrower"><li><span skos-label="c" lang="{{language}}" ng-click="click(c)"></span></li></ul></div><div ng-if="related.length" class="skos-concept-relation skos-concept-relation-related"><ul ng-repeat="c in related"><li><span skos-label="c" lang="{{language}}" ng-click="click(c)"></span></li></ul></div></div><div ng-if="!isEmptyObject(note)" style="margin-top:10px"><div ng-repeat="note in note.en" style="width:100%;padding:4px 6px;border:1px solid #ddd;margin-top:8px"><em>{{note}}</em></div></div></div>');
    $templateCache.put('template/skos-tree.html', '<div class="skos-tree"><p class="set"><span ng-if="tree.notation" class="notation">{{tree.notation[0]}}</span> <span class="nlabel">{{ tree.prefLabel.de }}</span></p><ul><li ng-repeat="n in tree.narrower"><span skos-tree="n"></span></li></ul></div>');
  }
]);