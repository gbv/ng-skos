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
