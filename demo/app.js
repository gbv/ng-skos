angular.module('myApp', ['ui.bootstrap','ngSKOS','ngSuggest'])
.run(function($rootScope,$http,$q) {
    $rootScope.getSamples = $q.defer();
    $http.get('data/jita/jita.json').success(function(jita){
        $rootScope.jita = jita;
        $rootScope.sampleSkosConcept = jita.topConcepts[0].narrower[0];
    });
    $http.get('data/rvk/UN.json').success(function(rvk){
        $rootScope.rvkUN = rvk;
    });
    $http.get('data/ddc/ddcsample.json').success(function(ddc){
        $rootScope.ddc = ddc;
    });
    $http.get('data/ezb/ezb.json').success(function(ezb){
        $rootScope.ezb = ezb;
    });
    $http.get('data/notes-1.json').success(function(notes){
        $rootScope.sampleNotes = notes;
    });
    $http.get('data/DDC_612.112.json').success(function(mapping){
        $rootScope.sampleMapping = mapping;
        $rootScope.getSamples.resolve();
    });
})
.config(function($locationProvider, $anchorScrollProvider) {
    $locationProvider.html5Mode(true);
})
.controller('myController',[
    '$scope','$timeout','$rootScope','$q',
    'OpenSearchSuggestions','SkosConceptSource','SkosHTTP','ngSKOS.version',
    function myController($scope, $timeout, $rootScope, $q, OpenSearchSuggestions, SkosConceptSource, SkosHTTP,version) {

    // RVK-Zugriff ausgelagert in rvk.js
    var rvk = rvkConceptScheme(
        $q,
        SkosConceptSource, SkosHTTP, OpenSearchSuggestions
    );
    // demo of skos-concept
    $scope.getSamples.promise.then(function(){
        $scope.sampleConcept = angular.copy($scope.jita.topConcepts[0].narrower[0]);
    });
    
    $scope.selectSampleConcept = function(scheme){
        if(scheme == 'jita'){
            angular.copy($scope.jita.topConcepts[0].narrower[0], $scope.sampleConcept);
        }else if(scheme == 'rvk'){
            angular.copy($scope.rvkUN, $scope.sampleConcept);
        }else if(scheme == 'ddc'){
            angular.copy($scope.ddc, $scope.sampleConcept);
        }
    }
    
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
    $scope.checkDuplicate = function(list){
        var dupe = false;
        if($scope.selectedListConcept.notation){
          angular.forEach($scope.conceptList, function(value, key){
              if(value.uri == $scope.selectedListConcept.uri || value.notation[0] == $scope.selectedListConcept.notation[0]){
                  dupe = true;
              }
          })
        }else{
          dupe = true;
        }
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
            angular.copy($scope.ezb, $scope.treeActive);
        }
    };
    $scope.language = "en";
    
    $scope.lookupMappingConcept = function(concept, scheme){
      $scope.retrievedMT = concept;
      $scope.retrievedScheme = scheme;
    }
    $scope.mappingList = [];
    $scope.schemes = { target: 'RVK' };
    $scope.addMappingConcept = function(concept){
        $scope.mappingList.push({
            prefLabel: concept.prefLabel ? concept.prefLabel : "",
            notation: [ concept.notation[0] ],
            uri: concept.uri
        });
    };

    $scope.version = version;
}]);

