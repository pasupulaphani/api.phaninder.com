//Grunt is just JavaScript running in node, after all...
module.exports = function(grunt) {

	// All upfront config goes in a massive nested object.
	grunt.initConfig({
		srcFolder: 'public/js/src',
		distFolder: 'public/js',
		distFile: 'main.js',
		minFile: 'main.min.js',

		// Allows us to reference properties we declared in package.json.
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				// should pass src js files as list to avoid dependency issues
				src: '<%= pkg.staticJSDependencies %>',
				dest: '<%= distFolder %>/<%= distFile %>'
			}
		},

		uglify: {
			min: {
				files: [{
					src: '<%= distFolder %>/<%= distFile %>',
					dest: '<%= distFolder %>/<%= minFile %>'
				}]
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
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Register our own custom task alias.
	grunt.registerTask('build', ['concat', 'uglify']);
};