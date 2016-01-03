module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //multiple sources and multiple dests.
    concat: {
      js: {
        files: {
          // 'dist/serverConcatFiles.js' : ['app/collections/links.js', 
          //                               'app/collections/users.js', 
          //                               'app/models/link.js', 
          //                               'app/models/user.js', 
          //                               'app/config.js', 
          //                               'lib/request-handler.js',
          //                               'lib/utility.js',
          //                               'server.js',
          //                               'index.js'
          //                               ],

          'public/dist/clientConcatFiles.js' : ['public/client/app.js',
                                        'public/client/createLinkView.js',
                                        'public/client/link.js',
                                        'public/client/links.js',
                                        'public/client/linksView.js',
                                        'public/client/linkView.js',
                                        'public/client/router.js'
                                        ],

          'public/dist/libConcatFiles.js' : ['public/lib/backbone.js',
                                      'public/lib/handlebars.js',
                                      'public/lib/jquery.js',
                                      'public/lib/undscore.js',
                                      ]

        }
      }
    },    
    //OR multiple sources and single dest.
    // concat: {
    //   js: {
    //     src: ['public/client/app.js', 'public/client/createLinkView.js', 'public/client/link.js', 'public/client/links.js','public/client/linksView.js', 'public/client/linkView.js', 'public/client/router.js'],
    //     dest: 'public/dist/build.js'
    //   },
    // },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    //minify js
    uglify: {
      js: {
        files: {
          'public/dist/clientConcatFiles.js' : ['public/dist/clientConcatFiles.js'],
          'public/dist/libConcatFiles.js' : ['public/dist/libConcatFiles.js']
        }
      }
    },

    jshint: {
      files: [
        // Add filespec list here
        // when we run grunt build, then jsHint runs first and checks the client files
        // No need to jshint /lib files
        'public/client/app.js',
        'public/client/createLinkView.js',
        'public/client/link.js',
        'public/client/links.js',
        'public/client/linksView.js',
        'public/client/linkView.js',
        'public/client/router.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      css: {
        src: 'public/style.css',
        dest: 'public/dist/style.css'
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        //git push
          command: 'git add .; git commit -m "production"; git push heroku master'
        // ,
        // 'git-commit-build': {
        //   command: 'git commit -m "build"'
        // }
      }
    }
  });

//grunt production(production is for Heroku) //grunt development(is for local server)
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    //1) jshint to check for errors, 2) next, concat files, 3) minify...
    'jshint', 'concat', 'uglify', 'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      // git commit origin master
      //'shell:git-add-dist'
       grunt.task.run([ 'shell:prodServer' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    //'jshint', 'mochaTest'
    'upload'
  ]);

  grunt.registerTask('default', [
    // add your default tasks here
    //Don't need to put anything here unless you want it to run when you just type 'grunt' in command line
    'build'
  ]);

  //grunt.registerTask('heroku:production', 'clean less mincss');

};
