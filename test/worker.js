// EventHandler test

onmessage = function(event) {
    self.unitTest = event.data; // { message, setting: { secondary, baseDir } }

    if (!self.console) { // polyfill WebWorkerConsole
        self.console = function() {};
        self.console.dir = function() {};
        self.console.log = function() {};
        self.console.warn = function() {};
        self.console.error = function() {};
        self.console.table = function() {};
    }

    importScripts("../lib/WebModule.js");

    //publish to global. eg: window.WebModule.Class -> window.Class
    WebModule.publish = true;

    importScripts("../node_modules/uupaa.es.js/lib/ES.js");
    importScripts("../node_modules/uupaa.task.js/lib/Task.js");
    importScripts("../node_modules/uupaa.task.js/lib/TaskMap.js");
    importScripts("wmtools.js");
    importScripts("../lib/EventHandler.js");
    importScripts("../release/EventHandler.w.min.js");
    importScripts("testcase.js");

    self.postMessage(self.unitTest);
};

