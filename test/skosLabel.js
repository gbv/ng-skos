'use strict';

describe('skos-label directive', function() {
    beforeEach(module('ngSKOS'));

    var scope, element;

    // for each test create a new scope with a sample concept
    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        scope.myLabel = {
            en: 'chair', 
            de: 'Stuhl'
        };
        scope.myLang = 'en';
    }));

    function compileDirective(template) {
        inject(function($compile) {
            element = $compile(template)(scope);
        });
        scope.$digest();
    };

    it('should display a label if no language has been selected',function(){
        compileDirective('<span skos-label="myLabel"/>');
        expect(element.html()).toBeTruthy();
    });

    it('should display a label of requested language',function(){
        compileDirective('<span skos-label="myLabel" lang="en"/>');
        expect(element.html()).toBe('chair')
        expect(element.attr('skos-lang')).toBe('en');
    });

    it('should reflect label changes',function(){
        compileDirective('<span skos-label="myLabel" lang="en"/>');

        scope.myLabel.en = 'stool';
        scope.$digest();
        expect(element.html()).toBe('stool');

        scope.myLabel.en = 'chair';
        scope.$digest();
        expect(element.html()).toBe('chair');
    });

    it('should reflect lang attribute changes',function(){
        compileDirective('<span skos-label="myLabel" lang="{{myLang}}"/>');
        expect(element.html()).toBe('chair');
        expect(element.attr('skos-lang')).toBe('en');
        scope.myLang = 'de';
        scope.$digest();
        expect(element.html()).toBe('Stuhl');
        expect(element.attr('skos-lang')).toBe('de');
    });

    it('should ignore boolean values', function() {
        scope.myLabel.en = false;
        compileDirective('<span skos-label="myLabel" lang="en"/>');
        scope.$digest();
        expect(element.html()).toBe('Stuhl');
        expect(element.attr('skos-lang')).toBe('de');
    });
});
