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
                altLabel: "" ,
                hasChildren: false
            }
            if (angular.isArray(item.node.register)){
                concept.altLabel = item.node.register;
            } else if (angular.isString(item.node.register)){
                concept.altLabel = [item.node.register];
            }
            if (item.node.has_children == 'yes'){
                concept.hasChildren = true;
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
    var getNarrower = new SkosConceptProvider({
        url: "http://rvk.uni-regensburg.de/api/json/children/{notation}",
        transform: function(item) {
            var concept = {
                notation: [ item.node.notation ],
                uri: item.node.notation,
                prefLabel: { de: item.node.benennung },
                narrower: [],
                broader: [],
            };
            if(!item.node.nochildren){
                if(angular.isArray(item.node.children.node)){
                    angular.forEach(item.node.children.node, function(nterm) {
                        concept.narrower.push({uri: nterm.notation, prefLabel: { de: nterm.benennung }, notation: [ nterm.notation ] });
                    });
                } else if(angular.isString(item.node.children.node)){
                    concept.narrower = [{uri: item.node.children.node.notation, prefLabel: { de: item.node.children.node.benennung }, notation: [ item.node.children.node.notation ] }];
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
            var concept = { 
                notation: [ item.node.notation ],
                uri: item.node.notation,
                prefLabel: { de: item.node.benennung },
                broader: [],
            };
            if(item.node.ancestor){
                concept.broader.push({ notation: [ item.node.ancestor.node.notation ], uri: item.node.ancestor.node.notation, prefLabel: { de: item.node.ancestor.node.benennung } })
            }
            return concept;
        },
        jsonp: 'jsonp'
    });
 

    var rvkByNotation = function(notation) {
        var concept = { notation: [ notation ] };
        var promise = rvkProvider.getConcept(concept);
// FIXME
 //       var deferred = $q.defer();
        
 //       return promise.then(function(response){
//        })
//        var then = p.then;
//        p.then = function(fn) {
//        console.log(promise);
            // ...
  //          then(data);
/*
        promise.then(function(){
            getNarrower.updateConcept(concept).then(function(r){
                console.log("children loaded");
                deferred.resolve(r);
            });
            // TODO: expand narrower/broader
            console.log("promise");
        });

        return deferred.promise;
        */
        return promise;
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
