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
        $scope.exampleMappings = [
            {
                from:{ 
                    members:[{
                        notation: [ '12345' ],
                        prefLabel: { en: 'originLabel1' },
                        inScheme: { notation: ['origin'] }
                    }]
                },
                to:{
                    members[{
                        notation: [ 'ABC' ],
                        prefLabel: { en: 'targetLabel1' },
                        inScheme: { notation: ['target'] }
                    }]
                },
                mappingType: 'strong',
                mappingRelevance: '',
                created: '2014-01-01',
                creator: 'source'
            },
            {
                from: {
                    members:[{
                        notation: [ '98765' ],
                        prefLabel: { en: 'originLabel2' },
                    }]
                },
                fromScheme:{ notation: ['origin'] },
                to: {
                    members:[{
                        notation: [ 'DEF' ],
                        prefLabel: { en: 'targetLabel2' },
                    }]
                },
                toScheme: { notation: ['target'] },
                mappingType: 'medium',
                created: '2010-05-05',
                creator: 'source'
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
        controller: function($scope) {
            $scope.predicate = '-mappingRelevance';
        }
            // ...
    };
});
