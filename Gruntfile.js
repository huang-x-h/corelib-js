module.exports = function(grunt) {
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
	grunt.loadNpmTasks('grunt-recess');

	grunt.registerTask('css', ['recess:components']);
	grunt.registerTask('default', ['clean', 'concat', 'uglify', 'recess']);
};