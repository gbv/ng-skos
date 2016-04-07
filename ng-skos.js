'use strict';
/**
 * @ngdoc overview
 * @name ng-skos
 * @module ng-skos
 * @description
 *
 * The main module <b>ngSKOS</b> contains several directives and services to
 * handle SKOS data. See the [API reference](#api) for module documentation.
 */
angular.module('ngSKOS',[])
.constant('ngSKOS.version', '0.0.9');

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosBrowser
 * @restrict E
 * @scope
 * @description
 *
 * Provides a browsing interface to a concept scheme.
 *
 * The concept scheme must be provided as object with lookup functions to look
 * up a concept by URI (`lookupURI`), by notation (`lookupNotation`), and/or by
 * a unique preferred label (`lookupLabel`). Each lookup function, if given, 
 * must return an AngularJS promise to return a single concept in JSKOS format.
 * *Searching* in a concept scheme is not supported by this directive but one
 * can provide an additional OpenSearchSuggestion service (see
 * [ng-suggest](http://gbv.github.io/ng-suggest/)) with field `suggest`.
 *
 * ## Scope
 *
 * The following variables are added to the scope, if the corresponding
 * lookup function have been provided:
 *
 * <ul>
 * <li>selectURI
 * <li>selectNotation
 * <li>selectLabel
 * </ul>
 *
 * The current version only tries either one of this methods.
 *
 * The variable `loading` can be used to indicate loading delay.
 *
 * Suggestions are not fully supported yet.
 *
 * ## Customization
 *
 * The [default 
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-browser.html)
 * can be changed with parameter `templateUrl`.
 *
 * @param {string} concept selected [concept](http://gbv.github.io/jskos/jskos.html#concepts)
 * @param {string} concept scheme object with lookup methods
 * @param {string} template-url URL of a template to display the concept browser
 */
angular.module('ngSKOS')
.directive('skosBrowser', function() {
    return {
        restrict: 'E',
        scope: { 
            concept: '=concept',
            scheme: '=conceptScheme',
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-browser.html';
        },
        link: function link(scope, element, attr) {

            angular.forEach(['URI','Notation','Label'],function(value){
                var lookup = scope.scheme['lookup'+value];
                if (lookup) {
                    scope['select'+value] = function(query) {
                        console.log('skosBrowser.select'+value+': '+query);
                        lookup(query).then(
                            function(response) { 
                                angular.copy(response, scope.concept);
                            }
                        );
                    };
                }
            });

            scope.selectConcept = function(concept) {
                if (scope.selectURI && concept.uri) {
                    scope.selectURI(concept.uri);
                } else if (scope.selectNotation && concept.notation && concept.notation.length) {
                    scope.selectNotation(concept.notation);
                } else if (scope.selectLabel && concept.prefLabel) {
                    scope.selectLabel(concept.prefLabel);
                }
            };
        }
     }
});

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConcept
 * @restrict A
 * @scope
 * @description
 * 
 * Display a [concept](http://gbv.github.io/jskos/jskos.html#concepts). 
 * Changes on the concept object are reflected by changes in the scope 
 * variables so the display is updated automatically.
 *
 * ## Scope
 *
 * The following variables are added to the scope:
 * <ul>
 * <li>ancestors (array of concepts)
 * <li>prefLabel (object of strings)
 * <li>altLabel (object of array of strings)
 * <li>notation (string)
 * <li>broader (array of concepts)
 * <li>narrower (array of concepts)
 * <li>related (array of concepts)
 * </ul>
 *
 * In addition the helper method `isEmptyObject` is provided to check whether an object
 * is empty.
 *
 * ## Customization
 *
 * The [default
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-concept.html) 
 * can be changed with parameter `templateUrl`.
 *
 * @param {string} skos-concept Assignable angular expression with a
 *      [concept](http://gbv.github.io/jskos/jskos.html#concepts) to bind to
 * @param {string} language Assignable angular expression with 
 *      preferred language to be used as bounded `language` variable. 
 * @param {string} skos-click function to call when a connected concept is clicked
 * @param {string} template-url URL of a template to display the concept
 *
 */
angular.module('ngSKOS')
.directive('skosConcept', function() {
    return {
        restrict: 'AE',
        scope: { 
            concept: '=skosConcept',
            language: '=language',
            click: '=skosClick',
            // TODO: simplify use by providing a SkosConceptProvider and properties
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-concept.html';
        },
        link: function link(scope, element, attr) {
            scope.isEmptyObject = function(object) { 
                var keys = Object.keys;
                return !(keys && keys.length);
            };
            scope.$watch('concept',function(concept) {
                angular.forEach([
                        'uri','inScheme','ancestors','prefLabel',
                        'altLabel','scopeNote','description','notation','narrower','broader','related'
                    ],
                    function(field) {
                        scope[field] = concept ? concept[field] : null;
                    }
                );
            },true);
        }
    }
});

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosLabel
 * @restrict A
 * @description
 *
 * Shows the multilingual label of a concept or concept scheme, given as
 * JSON object with language codes mapped to labels. A preferred language 
 * can be selected with parameter `lang`. The language a label is actually
 * shown in, is made available as element attribute `skos-lang`.
 *
 * Future versions of this directive may use more elaborated heuristics 
 * to select an alternative languages.
 *
 * @param {string} skos-label Expression with multilingual label data
 * @param {string=} lang preferred language to show. If not available,
 *      a language is chosen based on the given label data.
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      <ul>
        <li skos-label="example" lang="en" />
        <li skos-label="example" lang="de" />
        <li>
         <span skos-label="example" lang="{{language}}"/>
         <input type="text" ng-model="language" class="input-small"/>
         (select language)
        </li>
      </dl>
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        $scope.example = {
            en: "example",
            de: "Beispiel",
        };
        $scope.language = "fr";
    }
  </file>
  <file name="style.css">
   *[skos-label]:after { 
      content: "\00a0" attr(skos-lang); 
      vertical-align: super;
      color: gray;
   }
  </file>
</example>
 */
angular.module('ngSKOS')
.directive('skosLabel', function() {
    return {
        restrict: 'A',
        scope: { 
            label: '=skosLabel',
        },
        template: '{{label[language]}}',
        link: function(scope, element, attrs) {

            function updateLanguage(language) {
                scope.language = language ? language : attrs.lang;

                language = scope.label ? selectLanguage(scope.label, scope.language) : "";

                if (language != scope.language) {
                    scope.language = language;
                }

                attrs.$set('skos-lang', language);
            }

            function selectLanguage(labels, language) {
                if ( angular.isObject(labels) ) {
                    if ( language && angular.isString(labels[language])) {
                        return language;
                    } else {
                        return guessLanguage(labels);
                    }
                }
            }

            function guessLanguage(labels) {
                // TODO: https://github.com/gbv/ng-skos/issues/17
                for (var language in labels) {
                    if (angular.isString(labels[language])) {
                        return language; // take arbitrary language
                    }
                }
            }

            // update if lang attribute changed (also called at initialization)
            attrs.$observe('lang', updateLanguage);

            // update if labels changed
            scope.$watch('label', function() { updateLanguage(); }, true);
        },
    };
});

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosList
 * @restrict A
 * @description
 *
 * This directive displays a list of [concepts](http://gbv.github.io/jskos/jskos.html#concepts) 
 * with options to manipulate those lists.
 *
 * ## Customization
 *
 * The [default
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-list.html) 
 * can be changed with parameter `templateUrl`.
 *
 * @param {string} concepts array of JSKOS concepts to display
 * @param {string} onSelect function handling the selection of one concept
 * @param {string} canRemove support a `removeConcept` method to remove concepts
 * @param {string} showLabels chose, if concept labels should be shown as well as notations
 * @param {string} templateUrl URL of a template to display the concept list
 *
 */
angular.module('ngSKOS')
.directive('skosList', ["$timeout", function($timeout){
    return {
        restrict: 'E',
        scope: {
            concepts: '=concepts',
            onSelect: '=onSelect',
            canRemove: '=removeable',
            showLabels: '=showLabels',
            lang: '=language',
            listname:'@listName'
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'template/skos-list.html';
        },
        link: function link(scope, element, attr) {
            
            scope.$watch('concepts');
            scope.$watch('lang', function(lang){
                scope.popOverTitle = function(label){
                    if(scope.showLabels != true){
                        if(label[lang]){
                            return label[lang];
                        }else{
                            for(lang in label){
                                return label[lang];
                            }
                        }
                    }
                }
            });
            
            scope.removeConcept = function(index) { 
                scope.concepts.splice(index, 1);
            };
            scope.focusConcept = function(index) {
                // TODO: remove depenency on jQuery
                if(!scope.listname){
                    scope.listname = Math.random().toString(36).slice(2);
                }
                var fc = angular.element("[list-index=" + scope.listname + "_" + index + "]");
                fc.focus();
            };
            scope.tabFocus = 0;
            scope.onClick = function(index){
                scope.tabFocus = index;
                if(scope.onSelect){
                  scope.onSelect(scope.concepts[index]);
                }
            };
            scope.onFocus = function(index){
                scope.tabFocus = index;
            };
            scope.onKeyDown = function($event, first, last, index) {
                var key = $event.keyCode;

                var length = scope.concepts.length;

                if ([38,40,46,13].indexOf(key) == -1 || length == 0) return;
                $event.preventDefault();
                
                // up
                if(key == 38){
                    scope.tabFocus = (scope.tabFocus + length - 1) % length;
                    $timeout(function(){ scope.focusConcept(scope.tabFocus) },0,false);
                // down
                } else if(key == 40){
                    scope.tabFocus = (scope.tabFocus + 1) % length;
                    $timeout(function(){ scope.focusConcept(scope.tabFocus) },0,false);
                // del
                } else if(key == 46 && scope.canRemove == true){
                    if(last){
                        scope.tabFocus--;
                    }
                    scope.removeConcept(index);
                    $timeout(function(){ scope.focusConcept(scope.tabFocus) },0,false);
                // enter
                } else if(key == 13 && scope.onSelect){
                    $event.preventDefault();
                    scope.onSelect(scope.concepts[index]);
                }
            };
        }
    };
}]);

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosMappingTable
 * @restrict A
 * @description
 *
 * This directive displays [mappings](#/guide/mappings) between concepts of
 * two concept schemes in a table format.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosMappingTable.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skos-mapping-table Mapping to display
 * @param {string} select-mapping function to handle mappings selected from within this template
 * @param {string} template-url URL of a template to display the mapping
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      <div skos-mapping-table="exampleMappings">
      </div>
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        $scope.exampleMappings = {
            [{
                from: [{
                    notation: [ '12345' ],
                    prefLabel: { en: 'originLabel1' },
                    inScheme: { notation: ['origin'] }
                }],
                to: [{
                    notation: [ 'ABC' ],
                    prefLabel: { en: 'targetLabel1' },
                    inSchemen: { notation: ['target'] }
                }
                type: 'strong',
                timestamp: '2014-01-01',
                source: 'source'
            },
            {
                from: [{
                    notation: [ '98765' ],
                    prefLabel: { en: 'originLabel2' },
                    inScheme: { notation: ['origin'] }
                }],
                to: [{
                    notation: [ 'DEF' ],
                    prefLabel: { en: 'targetLabel2' },
                    inSchemen: { notation: ['target'] }
                }
                type: 'medium',
                timestamp: '2010-05-05',
                source: 'source'
            }]

        }
    }
  </file>
</example>
 */
angular.module('ngSKOS')
.directive('skosMappingTable', function() {
    return {
        restrict: 'A',
        scope: {
            mapping: '=skosMappingTable',
            select: '=selectMapping',
            lookup: '=lookupMapping',
            lang: '=language',
            schemes:'=activeSchemes'
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'template/skos-mapping-table.html';
        },
        link: function(scope, element, attr, controller, transclude) {
            scope.$watch('lang', function(lang){
                scope.popOverTitle = function(label){
                    if(label[lang]){
                        return label[lang];
                    }else{
                        for(lang in label){
                            return label[lang];
                        }
                    }
                }
            });
            scope.$watch('schemes');
        },
        controller: ["$scope", function($scope) {
            $scope.predicate = '-mappingRelevance';
        }]
            // ...
    };
});

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosNotes
 * @restrict A
 * @description
 *
 * Shows the [documentary notes](http://www.w3.org/TR/skos-primer/#secdocumentation)
 * of a concept. A preferred language can be selected with parameter `lang`. If
 * no language is selected, an arbitrary language with given notes is chosen.
 *
 * ## Scope
 *
 * The variables `scopeNote`, `definition`, `example`, and `historyNote` are
 * added to the scope, if given es keys of the `skos-notes` parameter object.
 *
 * ## Customization
 *
 * The [default
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-notes.html) 
 * can be changed with parameter `templateUrl`.
 *
 * @param {string} skos-notes Expression with multilingual notes data
 * @param {string=} lang preferred language to show notes in.
 * @param {string} template-url URL of a template to display the concept
 */
angular.module('ngSKOS')
.directive('skosNotes', function() {
    return {
        restrict: 'A',
        scope: { 
            notes: '=skosNotes',
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-notes.html';
        },
        link: function(scope, element, attrs) {

            function update(language) {
                scope.language = language ? language : attrs.lang;                
                if (!language) { 
                    language = guessLanguage(scope.notes);
                }
                if (language != scope.language) {
                    scope.language = language;
                }
            }

            // take arbitrary language
            function guessLanguage(notes) {
                for (var type in notes) {
                    for (var language in notes[type]) {
                        return language;
                    }
                }
            }
    
            // update if lang attribute changed (also called at initialization)
            attrs.$observe('lang', update);

            // update if notes changed
            scope.$watch('notes',function(notes) {
                angular.forEach(['scopeNote','definition','example','historyNote'],
                    function(field) {
                        scope[field] = angular.isObject(notes) 
                                     ? notes[field] : null;
                    }
                );
            },true);
        }
    };
});

/**
 * @ngdoc directive
 * @name ng-skos.directive:skosTree
 * @restrict A
 * @description
 *
 * Displays a hierarchical view of a concept and its transitive narrowers.
 *
 * ## Customization
 *
 * The [default
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-tree.html) 
 * can be changed with parameter `templateUrl`.
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
angular.module('ngSKOS')
.directive('skosTree', ["$compile", function($compile) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            tree:'=skosTree',
            language: '=language'
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-tree.html';
        },
        compile: function(tElement, tAttr, transclude) {
            var contents = tElement.contents().remove();
            var compiledContents;
            return function(scope, iElement, iAttr) {
                if(!compiledContents) {
                    compiledContents = $compile(contents, transclude);
                }
                compiledContents(scope, function(clone, scope) {
                         iElement.append(clone);
                });
            };
        }
    };
}]);

/**
 * @ngdoc service
 * @name ng-skos.service:SkosConceptSource
 * @description
 * 
 * Get concepts via HTTP. 
 *
 * The server to be queried with this service is expected to return a JSON
 * object with one [concept](http://gbv.github.io/jskos/jskos.html#concepts)
 * The concept object may contain
 * links to narrower and broader concepts, among other information.
 * 
 * This service is experimental.
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
 */
angular.module('ngSKOS')
.factory('SkosConceptSource',['SkosHTTP',function(SkosHTTP) {

    // inherit from SkosHTTP
    var SkosConceptSource = function(args) {
        SkosHTTP.call(this, args);
    };
    SkosConceptSource.prototype = new SkosHTTP();
    
    SkosConceptSource.prototype.getConcept = function(concept) {
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
    
    SkosConceptSource.prototype.updateConcept = function(concept) {
        return this.getConcept(concept).then(
            function(response) {
                angular.copy(response, concept);
            }
        );
    };

    SkosConceptSource.prototype.updateConnected = function(concept, which) {
        if (angular.isString(which)) {
            which = [which];
        } else if (!angular.isArray(which)) {
            which = ['broader','narrower','related'];
        }
        var service = this;
        angular.forEach(which, function(w) {
            angular.forEach(concept[w], function(c){
                service.updateConcept(c);
            });
        });
    };
 
    return SkosConceptSource;
}]);

/**
 * @ngdoc service
 * @module ng-skos
 * @name ng-skos.service:SkosHTTP
 * @description
 * 
 * Utility service to facilitate HTTP requests. 
 *
 * This service implements use of URL templates to perform HTTP requests with 
 * optional transformation of JSON responses and error handling.
 *
 * The service is not related to JSKOS but used as utility in ng-skos. A future
 * release of ng-skos may drop it favor of $http or 
 * use [$resource](//docs.angularjs.org/api/ngResource/service/$resource).
 * 
 * ## Configuration
 * 
 * * **`url`**: URL requests
 * * **`jsonp`**: enable JSONP (true/false/0/1/name)
 * * **`transform`**: custom transformation function to map expected response format
 *
 * ## Methods
 *
 * * **`get([url])`**: perform a HTTP request
 *
 */
angular.module('ngSKOS')
.factory('SkosHTTP',['$http','$q',function($http,$q) {

    var SkosHTTP = function(args) {
        if (!args) { args = {}; }
        this.transform = args.transform;
        this.url = args.url;
        var jsonp = args.jsonp;
        if (jsonp && (jsonp === true || angular.isNumber(jsonp) || jsonp.match(/^\d/))) {
            jsonp = 'callback';
        }
        this.jsonp = jsonp;
    };

    SkosHTTP.prototype = {
        get: function(url) {
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

            return get(url).then(
                function(response) {
                    try {
                        return transform ? transform(response.data) : response.data;
                    } catch(e) {
                        console.error(e);
                        return $q.reject(e);
                    }
                }, function(response) {
                    console.error(response);
                    return $q.reject(response.data);
                }
            );
        }
    };

    return SkosHTTP;
}]);

angular.module('ngSKOS').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/skos-browser.html',
    "<div ng-if=\"scheme.suggest\" style=\"margin:1em 0em;position:relative\"><input class=\"form-control\" suggest-typeahead=\"scheme.suggest\" typeahead-on-select=\"selectNotation($item.description)\" ng-model=\"conceptLabel\" placeholder=\"Search by terms (typeahead)\" typeahead-loading=\"loading\" typeahead-editable=\"false\"> <span ng-show=\"loading\" class=\"typeahead-loading-right\"><i class=\"glyphicon glyphicon-refresh\"></i></span></div><div ng-if=\"selectNotation\" class=\"search-top\" style=\"overflow:hidden;margin-bottom:15px\"><form ng-submit=\"selectNotation(notation)\"><span style=\"float:left\"><input class=\"form-control search-top-input\" ng-model=\"notation\" placeholder=\"Enter full notation\"></span> <button type=\"submit\" ng-disabled=\"!notation.length\" class=\"search-top-button\"><span class=\"glyphicon glyphicon-search\"></span></button></form></div><div skos-concept=\"concept\" skos-click=\"selectConcept\" language=\"language\"></div>"
  );


  $templateCache.put('template/skos-concept-thesaurus.html',
    "<div class=\"skos-concept-thesaurus\"><ul ng-if=\"ancestors.length\" class=\"ancestors\"><li class=\"ancestor\" ng-repeat=\"a in ancestors\"><span class=\"ancestors-label\" skos-label=\"a.prefLabel\" lang=\"{{language}}\" ng-click=\"update(a);reload();\"></span> <span class=\"ancestors-greater\">></span></li></ul><div class=\"top top-classic\"><span ng-if=\"notation\" class=\"notation\">{{notation[0]}}</span> <b><span skos-label=\"concept.prefLabel\" lang=\"{{language}}\"></span></b><a ng-if=\"notation\" class=\"uri\" href=\"{{uri}}\"><span style=\"vertical-align:-10%\" class=\"glyphicon glyphicon-globe\"></span></a></div><div ng-if=\"altLabel\" class=\"skos-concept-altlabel\"><ul><li ng-repeat=\"a in altLabel[language]\" style=\"display:inline\"><span ng-if=\"$index < 5\" style=\"display:inline\">{{a}}</span> <span style=\"margin-left:-4px;margin-right:3px\" ng-if=\"$index < 4 && $index < altLabel[language].length-1\">,</span></li></ul></div><div ng-if=\"broader.length\" class=\"skos-concept-thesaurus-relation\"><b>Broader Terms:</b><ul ng-repeat=\"b in broader\"><li><span skos-label=\"b.prefLabel\" lang=\"{{language}}\" ng-click=\"click(b)\"></li></ul></div><div ng-if=\"narrower.length\" class=\"skos-concept-thesaurus-relation\"><b>Narrower Terms:</b><ul ng-repeat=\"n in narrower\"><li><span skos-label=\"n.prefLabel\" lang=\"{{language}}\" ng-click=\"click(n)\"></li></ul></div><div ng-if=\"related.length\" class=\"skos-concept-thesaurus-relation\"><b>Related Terms:</b><ul ng-repeat=\"r in related\"><li><span skos-label=\"r.prefLabel\" lang=\"{{language}}\" ng-click=\"click(r)\"></li></ul></div><div ng-if=\"scopeNote.length\"><div ng-repeat=\"n in scopeNote\" class=\"skos-note skos-concept-thesaurus-note\"><em><div skos-label=\"n\" lang=\"{{language}}\"></div></em></div></div><div ng-if=\"definition.length\"><div ng-repeat=\"n in definition\" class=\"skos-note skos-concept-thesaurus-note\"><em><div skos-label=\"n\" lang=\"{{language}}\"></div></em></div></div></div>"
  );


  $templateCache.put('template/skos-concept.html',
    "<div class=\"skos-concept\"><div class=\"top top-alt\"><span ng-if=\"notation.length\" class=\"notation\">{{notation[0]}}</span> <b><span ng-if=\"prefLabel\" skos-label=\"concept.prefLabel\" lang=\"{{language}}\"></span></b> <a ng-if=\"uri && uri != notation\" class=\"uri\" href=\"{{uri}}\" target=\"_blank\"><span class=\"glyphicon glyphicon-globe\"></span></a></div><div ng-if=\"altLabel\" class=\"skos-concept-altlabel\"><ul><li ng-repeat=\"a in altLabel[language]\"><span ng-if=\"$index < 5\">{{a}}</span> <span style=\"margin-left:-4px;margin-right:3px\" ng-if=\"$index < 4 && $index < altLabel[language].length-1\">,</span></li></ul></div><div ng-if=\"broader.length || narrower.length || related.length\" class=\"skos-concept-connected\"><div ng-if=\"broader.length\" class=\"skos-concept-relation skos-concept-relation-broader\"><ul ng-repeat=\"c in broader\"><li><div>&#8613;</div><div class=\"skos-concept-relation-label\"><span ng-if=\"c.prefLabel\" skos-label=\"c.prefLabel\" lang=\"{{language}}\" ng-click=\"click(c)\" title=\"{{c.notation[0]}}\"></span> <span ng-if=\"!c.prefLabel\">{{c.notation[0]}}</span></div></li></ul></div><div ng-if=\"narrower.length\" class=\"skos-concept-relation skos-concept-relation-narrower\"><ul ng-repeat=\"c in narrower\"><li><div>&#8615;</div><div class=\"skos-concept-relation-label\"><span ng-if=\"c.prefLabel\" skos-label=\"c.prefLabel\" lang=\"{{language}}\" ng-click=\"click(c)\" title=\"{{c.notation[0]}}\"></span> <span ng-if=\"!c.prefLabel\">{{c.notation[0]}}</span></div></li></ul></div><div ng-if=\"related.length\" class=\"skos-concept-relation skos-concept-relation-related\"><ul ng-repeat=\"c in related\"><li><div>&#8614;</div><div class=\"skos-concept-relation-label\"><span ng-if=\"c.prefLabel\" skos-label=\"c.prefLabel\" lang=\"{{language}}\" ng-click=\"click(c)\" title=\"{{c.notation[0]}}\"></span> <span ng-if=\"!c.prefLabel\">{{c.notation[0]}}</span></div></li></ul></div></div><div style=\"margin-bottom:10px\"><div skos-notes=\"concept\" lang=\"{{language}}\"></div></div></div>"
  );


  $templateCache.put('template/skos-list.html',
    "<ul ng-if=\"concepts.length\" class=\"skos-simple-list\"><li ng-repeat=\"c in concepts\"><div class=\"set\" tabindex=\"0\" ng-keydown=\"onKeyDown($event, $first, $last, $index)\" list-index=\"{{listname + '_' + $index}}\" ng-focus=\"onFocus($index)\"><span ng-if=\"c.prefLabel\" style=\"whitespace:nowrap\" class=\"notation skos-list-notation\" title=\"{{popOverTitle(c.prefLabel)}}\" ng-click=\"onClick($index)\">{{c.notation[0]}}</span> <span ng-if=\"!c.prefLabel\" style=\"whitespace:nowrap\" class=\"notation skos-list-notation\" ng-click=\"onClick($index)\">{{c.notation[0]}}</span> <span ng-if=\"showLabels && c.prefLabel\" skos-label=\"c.prefLabel\" lang=\"{{language}}\" class=\"skos-list-label\" ng-click=\"onClick($index)\"></span><div style=\"display:inline-table;padding-left:3px\"><a ng-if=\"onSelect\" href=\"\" ng-click=\"onSelect(c)\" style=\"text-decoration:none;vertical-align:middle\"><span class=\"glyphicon glyphicon-info-sign\" title=\"Select concept (ENTER)\"></span></a> <a ng-if=\"canRemove\" href=\"\" ng-click=\"removeConcept($index)\" style=\"text-decoration:none;vertical-align:middle\"><span class=\"glyphicon glyphicon-trash\" title=\"Remove concept (DEL)\"></span></a></div></div></li></ul>"
  );


  $templateCache.put('template/skos-mapping-table.html',
    "<table class=\"table table-hover table-condensed table-bordered mapping-table\"><thead><tr><th class=\"mapping-table-scheme\"><span>Source Scheme</span></th><th class=\"mapping-table-scheme\"><span>Source Concept</span></th><th class=\"skos-mapping-cell skos-mapping-cell-center\"><span>Target Scheme</span></th><th class=\"skos-mapping-cell skos-mapping-cell-center\"><span>Target Concept(s)</span></th><th class=\"skos-mapping-cell skos-mapping-cell-center\" ng-if=\"type\"><span class=\"mapping-table-header-sortable\">Type</span> <a ng-click=\"predicate = 'type.value';reverse = !reverse\" href=\"\" class=\"mapping-table-icon\"><span class=\"glyphicon glyphicon-sort\"></span></a></th><th class=\"skos-mapping-cell skos-mapping-cell-center\" style=\"min-width:80px\"><span class=\"mapping-table-header-sortable\">Creator</span> <a ng-click=\"predicate = 'creator';reverse = !reverse\" href=\"\" class=\"mapping-table-icon\"><span class=\"glyphicon glyphicon-sort\"></span></a></th><th class=\"skos-mapping-cell skos-mapping-cell-center\" style=\"min-width:120px\"><span class=\"mapping-table-header-sortable\">Last Change</span> <a ng-click=\"predicate = 'created';reverse = !reverse\" href=\"\" class=\"mapping-table-icon\"><span class=\"glyphicon glyphicon-sort\"></span></a></th><th class=\"skos-mapping-cell skos-mapping-cell-center\" style=\"min-width:100px\"><span class=\"mapping-table-header-sortable\">Relevance</span> <a ng-click=\"predicate = 'mappingRelevance';reverse = !reverse\" href=\"\" class=\"mapping-table-icon\"><span class=\"glyphicon glyphicon-sort\"></span></a></th></tr></thead><tbody><tr ng-repeat=\"m in mapping | orderBy:predicate:reverse\"><td class=\"skos-mapping-cell\"><ul class=\"simple-list simple-list-center\"><li><span class=\"classification\">{{m.from.members[0].inScheme.notation[0]}}</span></li></ul></td><td class=\"skos-mapping-cell\"><ul class=\"simple-list\"><li><span ng-if=\"m.from.members[0].prefLabel\" class=\"notation\" title=\"{{popOverTitle(m.from.members[0].prefLabel)}}\">{{m.from.members[0].notation[0]}}</span> <span ng-if=\"!m.from.members[0].prefLabel\" class=\"notation\">{{m.from.members[0].notation[0]}}</span></li></ul></td><td class=\"skos-mapping-cell\"><ul class=\"simple-list simple-list-center\"><li><span class=\"classification\">{{m.to.members[0].inScheme.notation[0]}}</span></li></ul></td><td class=\"skos-mapping-cell\"><ul class=\"simple-list\"><li ng-repeat=\"t in m.to.members\"><div class=\"skos-mapping-target\"><span ng-if=\"t.prefLabel\" class=\"notation\" title=\"{{popOverTitle(t.prefLabel)}}\">{{t.notation[0]}}</span> <span ng-if=\"!t.prefLabel\" class=\"notation\">{{t.notation[0]}}</span> <a ng-if=\"lookup\" ng-class=\"{ 'link-disabled': t.inScheme.notation[0] != schemes.target }\" title=\"Select concept\" class=\"mapping-action-icon\"><span ng-click=\"lookup(t, m.to.members[0].inScheme.notation[0])\"><span style=\"top:2px\" class=\"glyphicon glyphicon-info-sign\"></span></span></a> <a ng-if=\"select\" ng-class=\"{ 'link-disabled': t.inScheme.notation[0] != schemes.target }\" title=\"Add concept to mapping\" class=\"mapping-action-icon\"><span ng-click=\"select(t, m.to.members[0].inScheme.notation[0])\"><span style=\"\" class=\"glyphicon glyphicon-plus\"></span></span></a></div></li></ul></td><td ng-if=\"type\">{{m.type.prefLabel}}</td><td class=\"skos-mapping-cell skos-mapping-cell-center\"><span>{{m.creator}}</span></td><td class=\"skos-mapping-cell skos-mapping-cell-center\"><span ng-if=\"!m.modified && !m.issued && m.created\">{{m.created}} (created)</span> <span ng-if=\"!m.modified && m.issued\">{{m.issued}} (issued)</span> <span ng-if=\"m.modified\">{{m.modified}} (modified)</span></td><td class=\"skos-mapping-cell skos-mapping-cell-center\"><span ng-if=\"m.mappingType\">{{m.mappingType}} ({{m.mappingRelevance}})</span> <span ng-if=\"!m.mappingType && m.mappingRelevance\">{{m.mappingRelevance}}</span></td></tr></tbody></table>"
  );


  $templateCache.put('template/skos-notes.html',
    "<ul ng-repeat=\"n in scopeNote[language]\" class=\"skos-note skos-note-scopeNote\"><li ng-if=\"$index < 5\">{{n}}</li></ul><ul ng-repeat=\"n in definition[language]\" class=\"skos-note skos-note-definition\"><li ng-if=\"$index < 5\">{{n}}</li></ul><ul ng-repeat=\"n in example[language]\" class=\"skos-note skos-note-example\"><li ng-if=\"$index < 5\">{{n}}</li></ul><ul ng-repeat=\"n in historyNote[language]\" class=\"skos-note skos-note-historyNote\"><li ng-if=\"$index < 5\">{{n}}</li></ul>"
  );


  $templateCache.put('template/skos-tree.html',
    "<div style=\"\" class=\"skos-tree\"><p class=\"set\" ng-if=\"!tree.topConcepts\"><span ng-if=\"tree.notation.length\" class=\"notation\" style=\"white-space:nowrap\">{{tree.notation[0]}}</span> <span skos-label=\"tree.prefLabel\" lang=\"{{language}}\" style=\"padding-left:3px\"></span></p><ul><li ng-repeat=\"n in tree.narrower ? tree.narrower : tree.topConcepts\"><span skos-tree=\"n\" language=\"language\"></span></li></ul></div>"
  );

}]);
