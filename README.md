phaninder.com
=============

Stack
-------
 * Persistence store: MongoDB hosted on MongoHq (primary)/MongoLab (secondary)
 * Session store: MongoDB (moving to Redis)
 * Backend: Node.js
 * AngularJS on the client
 * CSS based on Foundation

Web framework
-------
 * Expressjs

 
Build
-------
 * Grunt.js

Deployment
-------
 * Capistrano

Config:  config/env/env.json format.

    {
    	"development": {
    		"db": "MongoDB",
    		"session_store": "MongoStore",
    		"MongoDB": {
    			"db": "myblog",
    			"host": "localhost",
    			"port": "27017",
    			"username": "",
    			"password": ""
    		},
    		"MongoStore": {                  // Store is connect-mongo module
    			"db": "myblog",              // http://kcbanner.github.io/connect-mongo/
    			"host": "localhost",
    			"port": "27017",
    			"username": "",
    			"password": "",
    			"collection": "mysessions",
                "clear_interval": 3600
    		},
    		"secret": "yourSecretKey",
    		"logSettings": {
    			"stdoutLevel": "error",
    			"logFile": "/home/phani/myblog.log",
    			"logFileLevel": "debug"
    		}
    	}
    }
