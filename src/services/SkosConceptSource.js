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
