'use strict';

// 引入hello模块:
var greet = require('./hello');
var server = require('./server');
var router = require('./router');
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

server.start(router.route, handle);

//var s = 'Michael';

//greet(s); // Hello, Michael!