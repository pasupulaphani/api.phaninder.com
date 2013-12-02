phaninder.com
=============

NodeJs app
-------
 * express
 * mongodb


Required /etc/env.config format.

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
    		"MongoStore": {
    			"db": "myblog",
    			"host": "localhost",
    			"port": "27017",
    			"username": "",
    			"password": "",
    			"collection": "mySessions"
    		},
    		"secret": "yourSecretKey",
    		"logSettings": {
    			"stdoutLevel": "error",
    			"logFile": "/home/phani/myblog.log",
    			"logFileLevel": "debug"
    		}
    	},
    	"production": {
            "same goes here": "fill with production settings"
    	}
    }
