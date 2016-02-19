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
.directive('skosList', function($timeout){
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
});
