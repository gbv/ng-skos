'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-git-is-clean');

    grunt.initConfig({
        pkg: require('./package.json'),
        ngdocs: {
            options: {
                html5Mode: false,
                titleLink: '#/api',
                navTemplate: 'src/docs-nav.html',
                scripts: [ 
                    'angular.js',
                    'lib/angular-resource.min.js',
                    'ng-skos.min.js',
                ]
            },
            api: {
                title: 'API Reference',
                src: [
                    'src/*.js',
                    'src/**/*.js',
                    'src/*.ngdoc',
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
                dest: 'ng-skos-templates.js',
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
                    'ng-skos-templates.js'
                ],
                dest: 'ng-skos.js',
            },
        },
        ngmin: {
            angular: {
                src: ['ng-skos.js'],
                dest: 'ng-skos.js',
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
                    prefix: "\\('version',\\s*'" 
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
            docindex: {
                command: "cp src/index.ngdoc.tpl src/index.ngdoc && cat README.md >> src/index.ngdoc"
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
            site: {
                command: "rm -rf site && mkdir site && cp -r docs/* site"
            },
            working_copy_must_be_clean: {
                command: "if git status --porcelain 2>/dev/null | grep -q .; then exit 1; fi",
                options: { failOnError: true } 
            },
            push_site: {
                command: "git push origin gh-pages",
                options: { failOnError: true } 
            },
            gh_pages: {
                command: [
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
            }
        }
    });

    grunt.registerTask('default',['docs']);

    grunt.registerTask('build',['version','ngtemplates','concat','ngmin','uglify']);
    grunt.registerTask('test',['karma:unit']);
    grunt.registerTask('publish',['build','git-is-clean','test','release']);

    grunt.registerTask('docs',['clean','build','shell:docindex','ngdocs','shell:demo']);
    grunt.registerTask('gh-pages', ['test','shell:working_copy_must_be_clean','site','shell:gh_pages']);
    grunt.registerTask('push-site', ['gh-pages','shell:push_site']);
    grunt.registerTask('site', ['docs','shell:site']);
};
