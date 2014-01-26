//Grunt is just JavaScript running in node, after all...
module.exports = function(grunt) {

	// All upfront config goes in a massive nested object.
	grunt.initConfig({

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