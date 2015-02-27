'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-git-is-clean');

    grunt.initConfig({
        pkg: require('package.json'),
        ngdocs: {
            options: {
                titleLink: '#/api',
                navTemplate: 'src/docs-nav.html',
                sourceLink: 'https://github.com/gbv/ng-skos/blob/{{sha}}/{{file}}#L{{codeline}}',
                editLink: 'https://github.com/gbv/ng-skos/edit/master/{{file}}',
                scripts: [ 
                    'angular.js',
                    'ng-skos.min.js',
                ]
            },
            api: {
                title: 'Documentation',
                src: [
                    'src/*.js',
                    'src/**/*.js',
                    '*.ngdoc',
                ],
            },
        },
        connect: {
            options: {
                keepalive: true
            },
            server: {}
        },
        clean: ['docs'],
        karma: {
            unit: { 
                configFile: 'karma.conf.js',
                keepalive: true,
                singleRun: true,
                autoWatch: false,
            },
            watch: {
                configFile: 'karma.conf.js',
                keepalive: true,
                singleRun: false,
                autoWatch: true,
            }
        },
        ngtemplates: {
            app: {
                cwd:  'src/templates',
                src: '**.html', 
                dest: 'templates.js',
            },
            options: {
                module: 'ngSKOS',
                prefix: 'template/',
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true, 
                    removeComments: true
                } 
            }
        },
        concat: {
            dist: {
                src: [
                    'src/*.js','src/**/*.js',
                    'templates.js'
                ],
                dest: 'ng-skos.js',
            },
        },
        ngAnnotate: {
            angular: {
                files: {
                    'ng-skos.js': ['ng-skos.js']
                }
            }
        },
        uglify : {
            options: {
                report: 'min',
                mangle: false
            },
            my_target : {
                files : {
                    'ng-skos.min.js' : ['ng-skos.js']
                }
            }
        },
        // update/bump version number in package and source files
        version: {
            bump: {
                src: ['package.json', 'bower.json'],
            },
            module: {
                options: { 
                    prefix: "\\('ngSKOS.version',\\s*'" 
                },
                src: ['src/ng-skos.js'],
            },
        },
        // release to npmjs and GitHub
        release: {
            options: {
                bump: false,
                commit: false
            }
        },
        shell: {
            prepare_ngdocs: {
                command: [
                    'cp src/index.ngdoc.tpl index.ngdoc',
                    'cat README.md >> index.ngdoc',
                    'cp CONTRIBUTING.md contributing.ngdoc'
                ].join('&&')
            },
            demo: {
                command: [
                    "rm -rf docs/demo",
                    "cp -r demo docs",
                    "find docs/demo -type l -exec rm '{}' ';'",
                    "cp ng-skos.js docs/grunt-scripts",
                    "cp -r lib docs/grunt-scripts",
                    "cp ng-skos.css docs",
                    "perl -pi -e 's|<script src=\"\\.\\./src.+|<script src=\"../grunt-scripts/ng-skos.js\"></script>|' docs/demo/*.html",
                    "perl -pi -e 's|<script src=\"\\.\\./lib|<script src=\"../grunt-scripts/lib|' docs/demo/*.html"
                ].join('&&')
            },
            gh_pages: {
                command: [
                    'rm -rf site && mkdir site && cp -r docs/* site',
                    'git checkout gh-pages',
                    'git pull origin gh-pages',
                    'cp -rf site/* .',
                    'rm -rf site',
                    'git add .',
                    'git commit -m "updated site"',
                    'git checkout master'
                ].join('&&'),
                options: { 
                    stdout: true,
                    stderr: true,
                    failOnError: true
                } 
            },
            push_gh_pages: {
                command: "git push origin gh-pages",
                options: { failOnError: true } 
            }
        }
    });

    grunt.registerTask('default',['docs']);

    grunt.registerTask('build',['version','ngtemplates','concat','ngAnnotate','uglify']);
    grunt.registerTask('test',['karma:unit']);
    grunt.registerTask('publish',['build','git-is-clean','test','release','homepage']);

    grunt.registerTask('docs',['clean','build','shell:prepare_ngdocs','ngdocs','shell:demo']);

    grunt.registerTask('gh-pages', ['test','git-is-clean','shell:gh_pages']);
    grunt.registerTask('homepage', ['gh-pages','git-is-clean','shell:push_gh_pages']);

    grunt.registerTask('site', ['docs','shell:site']);
};
