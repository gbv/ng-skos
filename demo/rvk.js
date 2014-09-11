function rvkTerminologyService($q, SkosConceptProvider, SkosConceptListProvider, OpenSearchSuggestions) {

    var rvkProvider = new SkosConceptProvider({
        //url:'data/rvk/{notation}.json',
        //jsonp: false,

        // TOOD: look up narrower
        url: "http://rvk.uni-regensburg.de/api/json/node/{notation}",
        transform: function(item) {
            var concept = {
                notation: [ item.node.notation ],
                uri: item.node.notation,
                prefLabel: { de: item.node.benennung },
                narrower: false
            }

            var register = item.node.register;
            if (angular.isArray(register)) {
                concept.altLabel = { de: register };
            } else if (angular.isString(register)) {
                concept.altLabel = { de: [register] };
            }

            if (item.node.has_children == 'yes'){
                concept.narrower = true;
            }

            return concept;
        },
        jsonp: 'jsonp'
    });

    var rvkTransform = function(nodes) {
        return {
            values: nodes.map(function(v) {
                return {
                    label: v.benennung,
                    notation: v.notation
                };
            }),
        };
    };

    // get all direct children of the concept
    // TODO: cleanup this code
    var getNarrower = new SkosConceptProvider({
        url: "http://rvk.uni-regensburg.de/api/json/children/{notation}",
        transform: function(item) {
            var node = item.node;
            if(!node) return;

            var concept = {
                notation: [ node.notation ],
                uri: node.notation,
                prefLabel: { de: node.benennung },
                narrower: [],
                broader: [],
            };
            if(!node.nochildren){
                if(angular.isArray(node.children.node)){
                    angular.forEach(node.children.node, function(nterm) {
                        concept.narrower.push({uri: nterm.notation, prefLabel: { de: nterm.benennung }, notation: [ nterm.notation ] });
                    });
                } else if(angular.isString(node.children.node)){
                    concept.narrower = [{uri: node.children.node.notation, prefLabel: { de: node.children.node.benennung }, notation: [ node.children.node.notation ] }];
                }
            }
            return concept;
        },
        jsonp: 'jsonp'
    });

    // get the direct ancestor of the concept
    var getBroader = new SkosConceptProvider({
        url: "http://rvk.uni-regensburg.de/api/json/ancestors/{notation}",
        transform: function(item) {
            var node = item.node;
            if(!node) return;

            var concept = { 
                notation: [ node.notation ],
                uri: node.notation,
                prefLabel: { de: node.benennung },
                broader: [],
            };
            if (node.ancestor){
                concept.broader.push({ notation: [ node.ancestor.node.notation ], uri: node.ancestor.node.notation, prefLabel: { de: node.ancestor.node.benennung } })
            }
            return concept;
        },
        jsonp: 'jsonp'
    });
 

    var rvkByNotation = function(notation) {
        var concept = { notation: [ notation ] };
        var deferred = $q.defer();
        // first get & update concept
        var promise = rvkProvider.updateConcept(concept);
        promise.then(function(){
            // then get children (TODO: get ancestors)
            if (concept.narrower === true) {
                getNarrower.updateConcept(concept).then(function(){
                    deferred.resolve(concept);
                });
            } else {
                deferred.resolve(concept);
            }
        });
        // promise the final result
        return deferred.promise;
    };

    return {
        byNotation: rvkByNotation,
        suggest: new OpenSearchSuggestions({
            url: "http://rvk.uni-regensburg.de/api/json/nodes/{searchTerms}",
            jsonp: 'jsonp',
            transform: function(response) { 
                return rvkTransform(response.node) 
            },
            jsonp: 'jsonp'
        }),
        topConcepts: new SkosConceptListProvider({
            url: "http://rvk.uni-regensburg.de/api/json/children",
            jsonp: 'jsonp',
            transform: function(response) { 
                return rvkTransform(response.node.children.node) 
            },
        }),
    };
}
