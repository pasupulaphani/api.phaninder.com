var express = require('express');

// middleware modules
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var favicon = require('static-favicon');
var morgan = require('morgan');
var methodOverride = require('method-override');
var csrf = require('csurf')
var helmet = require('helmet');

// others
var path = require('path');
var seo  = require('seo');

// custom
var config = require('./config');
var configUtil = require('../app/helpers/configUtil.js');
var appUtils = require('../app/helpers/appUtils');
var logger = require('../config/logger');
var cors = require('./middleware/cors');
var sessionStore = require('./session_store/memory_store');

module.exports = function(app) {

    var static_dir = path.join(app.locals.home_dir + '/public');

    app.use(compress());
    // static should be above cookie parser to not set cookie for static files
    app.use(express.static(static_dir));
    app.use(favicon(static_dir + '/favicon.ico'));

    //Set views path, template engine and default layout
    app.set('views', app.locals.home_dir + '/app/views');
    app.set('view engine', 'jade');

    // basic express logger. Writes to stdout
    //morgan - previously logger
    app.use(
        morgan(process.env.NODE_ENV === 'dev' ? 'dev' : 'combined')
    );

// app.use(new seo({
//   cacheDirectory: path.resolve(process.cwd(), '.seo-cache'),
//   routes: require('./routes/seo-routes'),
//   requestURL: 'http://local-phaninder.com',
//   pageModifier: function (page, callback) {
//     // This function can be used to modify a page before it is cached
//     // `page` is an instance of PhantomJS's Page object. For an example
//     // see `test/middleware.test.js`
//   }
// }).init());

    session_store_options = configUtil.getSessionStore(config, app.locals.db_server);
    // maintain session stuff
    app.use(cookieParser(config.secret));
    sessionStore(app);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // enable csrf
    app.use(csrf({
        value: configUtil.csrfValue
    }));
    app.use(cors.allowCrossDomain);
    app.use(helmet());

    // to enable RESTFUL methods
    app.use(methodOverride());

    app.use(function(req, res, next) {

        // action after response
        var afterResponse = function() {
            logger.info({
                req: req
            }, "End request");
        }
        res.on('finish', afterResponse);
        res.on('close', afterResponse);

        // actions before response
        logger.info({
            req: req
        }, "Start request");

        // expose sessions to views
        res.locals = {
            session: req.session,
            site: config.site,
            mode: process.env.NODE_ENV,
            url: {
                host: req.hostname,
                path: req.path
            },
            staticHost: config.staticHost
        };

        res.locals.infoStatus = appUtils.infoStatus

        console.log("user: "+req.session.user)
        // angularJs looks for this cookie by default
        res.cookie('XSRF-TOKEN', req.csrfToken(), { domain: config.domain});

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
            res.sendStatus(200);
        } else {
            next();
        }

    })

}
