angular.module('myApp', ['ui.bootstrap','ngSKOS','ngSuggest'])
.run(function($rootScope,$http) {
    
        $http.get('data/jita/jita.json').success(function(jita){
            $rootScope.jita = jita;
            $rootScope.sampleSkosConcept = jita.topConcepts[0].narrower[0];
            // TODO: JITA-Zugriff als TerminologyProvider
        });
        $http.get('data/ezb/ezb.json').success(function(ezb){
            $rootScope.ezb = ezb;
        });

})
.config(function($locationProvider, $anchorScrollProvider) {
    $locationProvider.html5Mode(true);
});

function myController($scope, $timeout, $rootScope, $q, OpenSearchSuggestions, SkosConceptProvider, SkosHTTPProvider, version) {

    // RVK-Zugriff ausgelagert in rvk.js
    var rvk = rvkConceptScheme(
        $q,
        SkosConceptProvider, SkosHTTPProvider, OpenSearchSuggestions
    );

    rvk.getTopConcepts().then(function(response){
        rvk.topConcepts = response;
    });

    // demo of skos-browser
    $scope.selectedBrowserConcept = {};
    
    rvk.lookupNotation('UN').then(function(response){
        angular.copy(response, $scope.selectedBrowserConcept);
    });

    $scope.selectTopConcept = function(concept){
        rvk.lookupNotation(concept.notation).then(function(response){
            angular.copy(response, $scope.selectedBrowserConcept);
        });
    };


    // demo of skos-list
    $scope.conceptList = [];
    $scope.selectedListConcept = {};
    rvk.lookupNotation('UN').then(function(response){
        angular.copy(response, $scope.selectedListConcept);
    });
    $scope.addConcept = function(concept){
        $scope.conceptList.push({
            prefLabel: { de: concept.prefLabel.de },
            notation: [ concept.notation[0] ],
            uri: concept.uri
        });
    };
    $scope.checkDuplicate = function(){
        var dupe = false;
        angular.forEach($scope.conceptList, function(value, key){
            if(value.uri == $scope.selectedListConcept.uri){
                dupe = true;
            }
        })
        return dupe;
    };
    $scope.reselectConcept = function(concept){
        rvk.lookupNotation(concept.notation[0]).then(function(response){
            angular.copy(response, $scope.selectedListConcept);
        });
        $scope.conceptLabel = {};
    };
    
    $scope.rvk = rvk;
    $scope.treeActive = {};
    $scope.tree = function(){
        if($scope.treeSelect == 'jita'){
            angular.copy($scope.jita, $scope.treeActive);
        }
        if($scope.treeSelect == 'ezb'){
            angular.copy($rootScope.ezb, $scope.treeActive);
        }
    };
    $scope.language = "en";

    $scope.version = version;
}

