// EventHandler test

require("../lib/WebModule.js");

//publish to global. eg: window.WebModule.Class -> window.Class
WebModule.publish = true;

require("../node_modules/uupaa.es.js/lib/ES.js");
require("../node_modules/uupaa.task.js/lib/Task.js");
require("../node_modules/uupaa.task.js/lib/TaskMap.js");
require("./wmtools.js");
require("../lib/EventHandler.js");
require("../release/EventHandler.n.min.js");
require("./testcase.js");

