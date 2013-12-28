//Grunt is just JavaScript running in node, after all...
module.exports = function(grunt) {

	// All upfront config goes in a massive nested object.
	grunt.initConfig({
		srcFolder: 'public/js/src',
		distJsFolder: 'public/js',
		distJsFile: 'main.js',
		minJsFile: 'main.min.js',
		distCssFolder: 'public/css',
		minCssFile: 'main.min.css',

		// Allows us to reference properties we declared in package.json.
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: ';'
			},
			js: {
				// should pass src js files as list to avoid dependency issues
				src: '<%= pkg.staticJSDependencies %>',
				dest: '<%= distJsFolder %>/<%= distJsFile %>'
			}
		},

		uglify: {
			js: {
				files: [{
					src: '<%= distJsFolder %>/<%= distJsFile %>',
					dest: '<%= distJsFolder %>/<%= minJsFile %>'
				}]
			}
		},

		cssmin: {
		  combine: {
		    files: {
		      '<%= distCssFolder %>/<%= minCssFile %>': '<%= pkg.staticCSSDependencies %>'
		    }
		  }
		},

		// Still to configure
		jshint: {
			src: ['Gruntfile.js', 'routes/**/*.js'],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {
					require: true,
					define: true,
					requirejs: true,
					describe: true,
					expect: true,
					it: true
				}
			}
		}
	}); // The end of grunt.initConfig

	// Now actually load the tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Register our own custom task alias.
	grunt.registerTask('build', ['concat', 'uglify', 'cssmin']);
};