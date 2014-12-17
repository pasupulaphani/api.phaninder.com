var getDBURL = exports.getDBURL = function(config, db_server) {

    var url = "";
    var db = eval("config." + db_server)

    switch (db.DBMS) {
        case "MongoDB":
            url = buildMongoURL(db.MongoDB);
            break;
        default:
            console.log("No config set");
    }

    return url;
}

var buildMongoURL = function(db_props) {

    console.log("Building MongoDB connection url");

    var dbUrl = 'mongodb://';
    dbUrl += db_props.username + ':' + db_props.password + '@';
    dbUrl += db_props.host + ':' + db_props.port;
    dbUrl += '/' + db_props.db;

    console.log("URL: " + dbUrl);
    return dbUrl;
}

var getSessionStore = exports.getSessionStore = function(config, db_server) {

    var db = eval("config." + db_server)

    console.info("configure session store: " + db.session_store)
    switch (db.session_store) {
        case "MongoStore":
            return db.MongoStore;
        default:
            console.log("No config set");
    }

    return
}

var csrfValue = exports.csrfValue = function(req) {
    var token = (req.body && req.body._csrf) || (req.query && req.query._csrf) || (req.headers['x-csrf-token']) || (req.headers['x-xsrf-token']);
    return token;
};

// good way for an utils module
module.exports = exports;
