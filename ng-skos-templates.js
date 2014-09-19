angular.module('ngSKOS').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/skos-concept-browser.html',
    "<div ng-if=\"suggestConcept\" style=\"margin:1em 0em\"><input class=\"form-control\" suggest-typeahead=\"suggestConcept\" typeahead-on-select=\"selectNotation($item.notation)\" ng-model=\"conceptLabel\" placeholder=\"Search by terms (typeahead)\" typeahead-loading=\"loadingLocations\" typeahead-editable=\"false\"> <i ng-show=\"loadingLocations\" class=\"glyphicon glyphicon-refresh typeahead-loading\"></i></div><div ng-if=\"selectNotation\" class=\"search-top\" style=\"overflow:hidden;margin-bottom:15px\"><form ng-submit=\"selectNotation(notation)\"><span style=\"float:left\"><input class=\"form-control search-top-input\" ng-model=\"notation\" placeholder=\"Enter full notation\"></span> <button type=\"submit\" ng-disabled=\"!notation.length\" class=\"search-top-button\"><span class=\"glyphicon glyphicon-search\"></span></form></div><div skos-concept=\"concept\" skos-click=\"selectConcept\" language=\"language\"></div>"
  );


  $templateCache.put('template/skos-concept-list.html',
    "<div><ul ng-if=\"concepts.length\" style=\"list-style-type:none;padding-left:0px\"><li ng-repeat=\"c in concepts\" style=\"max-width:320px;display:block\"><div style=\"display:list-item\"><span class=\"notation\">{{c.notation[0]}}</span> <span ng-click=\"onSelect(c)\" style=\"cursor:pointer\">{{c.prefLabel.de}}</span> <a style=\"text-decoration:none\" href=\"\" ng-click=\"removeConcept($index)\"><span class=\"glyphicon glyphicon-trash\"></span></a></div></li></ul></div>"
  );


  $templateCache.put('template/skos-concept-thesaurus.html',
    "<div class=\"skos-concept-thesaurus\"><ul ng-if=\"ancestors.length\" class=\"ancestors\"><span ng-if=\"inScheme\" class=\"classification\">{{inScheme}}</span><li class=\"ancestor\" ng-repeat=\"a in ancestors\"><span skos-label=\"a\" lang=\"{{language}}\" ng-click=\"update(a);reload();\"></span></li></ul><div class=\"top top-classic\"><span ng-if=\"notation\" class=\"notation\">{{notation[0]}}</span> <b><span skos-label=\"concept\" lang=\"{{language}}\"></span></b><a ng-if=\"notation\" class=\"uri\" href=\"{{uri}}\"><span style=\"vertical-align:-10%\" class=\"glyphicon glyphicon-globe\"></span></a></div><div ng-if=\"altLabel.length\" class=\"skos-concept-altlabel\"><ul><li ng-repeat=\"alt in altLabel\"><span ng-if=\"$index < 5\" style=\"display:inline\">{{alt}}</span> <span style=\"margin-left:-4px;margin-right:3px\" ng-if=\"$index < 4 && $index < altLabel.length-1\">,</span></li></ul></div><div ng-if=\"broader.length\" class=\"skos-concept-thesaurus-relation\"><b>Broader Terms:</b><ul ng-repeat=\"b in broader\"><li><span skos-label=\"b\" lang=\"{{language}}\" ng-click=\"click(b)\"></li></ul></div><div ng-if=\"narrower.length\" class=\"skos-concept-thesaurus-relation\"><b>Narrower Terms:</b><ul ng-repeat=\"n in narrower\"><li><span skos-label=\"n\" lang=\"{{language}}\" ng-click=\"click(n)\"></li></ul></div><div ng-if=\"related.length\" class=\"skos-concept-thesaurus-relation\"><b>Related Terms:</b><ul ng-repeat=\"r in related\"><li><span skos-label=\"r\" lang=\"{{language}}\" ng-click=\"click(r)\"></li></ul></div></div>"
  );


  $templateCache.put('template/skos-concept.html',
    "<div class=\"skos-concept\"><div class=\"top top-alt\"><span ng-if=\"notation.length\" class=\"notation\">{{notation[0]}}</span> <b><span ng-if=\"prefLabel\" skos-label=\"concept\" lang=\"{{language}}\"></span></b> <a ng-if=\"uri && uri != notation\" class=\"uri\" href=\"{{uri}}\"><span class=\"glyphicon glyphicon-globe\"></span></a></div><div ng-if=\"altLabel.length\" class=\"skos-concept-altlabel\"><ul><li ng-repeat=\"alt in altLabel\"><span ng-if=\"$index < 5\" style=\"display:inline\">{{alt}}</span> <span style=\"margin-left:-4px;margin-right:3px\" ng-if=\"$index < 4 && $index < altLabel.length-1\">,</span></li></ul></div><div ng-if=\"broader.length || narrower.length || related.length\" class=\"skos-concept-connected\"><div ng-if=\"broader.length\" class=\"skos-concept-relation skos-concept-relation-broader\"><ul ng-repeat=\"c in broader\"><li><span skos-label=\"c\" lang=\"{{language}}\" ng-click=\"click(c)\" title=\"{{c.notation[0]}}\"></span></li></ul></div><div ng-if=\"narrower.length\" class=\"skos-concept-relation skos-concept-relation-narrower\"><ul ng-repeat=\"c in narrower\"><li><span skos-label=\"c\" lang=\"{{language}}\" ng-click=\"click(c)\" title=\"{{c.notation[0]}}\"></span></li></ul></div><div ng-if=\"related.length\" class=\"skos-concept-relation skos-concept-relation-related\"><ul ng-repeat=\"c in related\"><li><span skos-label=\"c\" lang=\"{{language}}\" ng-click=\"click(c)\" title=\"{{c.notation[0]}}\"></span></li></ul></div></div><div ng-if=\"!isEmptyObject(note)\" style=\"margin-top:10px\"><div ng-repeat=\"note in note.en\" style=\"width:100%;padding:4px 6px;border:1px solid #ddd;margin-top:8px\"><em>{{note}}</em></div></div></div>"
  );


  $templateCache.put('template/skos-tree.html',
    "<div style=\"\" class=\"skos-tree\"><p class=\"set\" ng-if=\"!tree.topConcepts\"><span ng-if=\"tree.notation\" class=\"notation\">{{tree.notation[0]}}</span> <span class=\"nlabel\" style=\"display:table-cell\">{{tree.prefLabel.de}}</span></p><ul><li ng-repeat=\"n in tree.narrower ? tree.narrower : tree.topConcepts\"><span skos-tree=\"n\"></span></li></ul></div>"
  );

}]);
