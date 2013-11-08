module.exports = function(grunt) {
//  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',

		clean: {
      dist: ['dist']
    },
    recess: {
      options: {
        compile: true,
        banner: '<%= banner %>'
      },
      components: {
        src: ['less/components.less'],
        dest: 'css/components.css'
      },
      bootstrap: {
        src: ['less/bootstrap/bootstrap.less'],
        dest: 'css/bootstrap.css'
      },
      min: {
        options: {
          compress: true
        },
        src: ['less/components.less'],
        dest: 'dist/css/components.min.css'
      }
    },
    htmlhint: {
      build: {
        options: {
          'tag-pair': true,
          // Force tags to have a closing pair
          'tagname-lowercase': true,
          // Force tags to be lowercase
          'attr-lowercase': true,
          // Force attribute names to be lowercase e.g. <div id="header"> is invalid
          'attr-value-double-quotes': true,
          // Force attributes to have double quotes rather than single
          'doctype-first': true,
          // Force the DOCTYPE declaration to come first in the document
          'spec-char-escape': true,
          // Force special characters to be escaped
          'id-unique': true,
          // Prevent using the same ID multiple times in a document
          'head-script-disabled': true,
          // Prevent script tags being loaded in the  for performance reasons
          'style-disabled': true
          // Prevent style tags. CSS should be loaded through
        },
        src: ['example/index.html']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: {
        src: ['src/**/tree.js']
      }
    },
		concat: {
			options: {
			},
			dist: {
				src: ['src/ztesoft/*.js', 'src/ztesoft/events/*.js', 'src/ztesoft/utils/*.js', 'src/ztesoft/components/*.js'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
	
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		}
	});

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-recess');

	grunt.registerTask('css', ['recess:components']);
	grunt.registerTask('default', ['clean', 'jshint', 'concat', 'uglify', 'recess']);
};