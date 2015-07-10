var ModuleTestEventHandler = (function(global) {

global["BENCHMARK"] = false;

var test = new Test("EventHandler", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
        }
    }).add([
        testEventHandler_on,
        testEventHandler_off,
        testEventHandler_off_type,
        testEventHandler_know,
        testEventHandler_list,
        testEventHandler_fire,
        testEventHandler_fire_detail,
        testEventHandler_clear,
    ]);

if (IN_BROWSER || IN_NW) {
    test.add([
        testEventHandler_dom,
        testEventHandler_dom_detail,
    ]);
} else if (IN_WORKER) {
    test.add([
        // worker test
    ]);
} else if (IN_NODE) {
    test.add([
        // node.js and io.js test
    ]);
}

// --- test cases ------------------------------------------
function testEventHandler_on(test, pass, miss) {

    function a1() { task.pass(); }
    function a2() { task.pass(); }
    function b1() { task.pass(); }

    var task = new Task("testEventHandler_on", 3, function(error, buffer) {
        if (error) {
            test.done(miss());
        } else {
            test.done(pass());
        }
    });

    var event = new EventHandler(["a", "b", "c"]);

    event.on("a", a1);
    event.on("a", a2);
    event.on("b", b1);

    event.fire("a");
    event.fire("b");
}

function testEventHandler_off(test, pass, miss) {

    function a1() { task.miss(); }
    function a2() { task.miss(); }
    function b1() { task.miss(); }

    var task = new Task("testEventHandler_off", 1, function(error, buffer) {
        if (error) {
            test.done(miss());
        } else {
            test.done(pass());
        }
    });

    var event = new EventHandler(["a", "b", "c"]);

    event.on("a", a1);
    event.on("a", a2);
    event.on("b", b1);

    event.off("a", a1);
    event.off("a", a2);
    event.off("b", b1);

    event.fire("a");
    event.fire("b");

    task.pass();
}

function testEventHandler_off_type(test, pass, miss) {

    function a1() { task.miss(); }
    function a2() { task.miss(); }
    function b1() { task.miss(); }

    var task = new Task("testEventHandler_off_type", 1, function(error, buffer) {
        if (error) {
            test.done(miss());
        } else {
            test.done(pass());
        }
    });

    var event = new EventHandler(["a", "b", "c"]);

    event.on("a", a1);
    event.on("a", a2);
    event.on("b", b1);

    event.off("a");
    event.off("b");

    event.fire("a");
    event.fire("b");

    if (event.list("a").length === 0 &&
        event.list("b").length === 0) {
        task.pass();
    }
}


function testEventHandler_know(test, pass, miss) {

    function a1() { }
    function a2() { }
    function b1() { }

    var task = new Task("testEventHandler_know", 1, function(error, buffer) {
        if (error) {
            test.done(miss());
        } else {
            test.done(pass());
        }
    });

    var event = new EventHandler(["a", "b", "c"]);

    event.on("a", a1);
    event.on("a", a2);
    event.on("b", b1);

    if ( event.know("a") &&
         event.know("b") &&
        !event.know("z") ) {
        task.pass();
    } else {
        task.miss();
    }
}

function testEventHandler_list(test, pass, miss) {

    function a1() { }
    function a2() { }
    function b1() { }

    var task = new Task("testEventHandler_list", 1, function(error, buffer) {
        if (error) {
            test.done(miss());
        } else {
            test.done(pass());
        }
    });

    var event = new EventHandler(["a", "b", "c"]);

    event.on("a", a1);
    event.on("a", a2);
    event.on("b", b1);

    if ( event.list("a").length === 2 &&
         event.list("b").length === 1 ) {
        task.pass();
    } else {
        task.miss();
    }
}

function testEventHandler_fire(test, pass, miss) {

    function a1() { task.pass(); }
    function a2() { task.pass(); }
    function b1() { task.pass(); }

    var task = new Task("testEventHandler_fire", 6, function(error, buffer) {
        if (error) {
            test.done(miss());
        } else {
            test.done(pass());
        }
    });

    var event = new EventHandler(["a", "b", "c"]);

    event.on("a", a1);
    event.on("a", a2);
    event.on("b", b1);

    event.fire("a");
    event.fire("b");

    event.fire("a");
    event.fire("b");
}

function testEventHandler_fire_detail(test, pass, miss) {

    function a1(event) { event.detail.foo === 1 ? task.pass() : task.miss(); }
    function a2(event) { event.detail.foo === 1 ? task.pass() : task.miss(); }
    function b1(event) { event.detail.bar === 2 ? task.pass() : task.miss(); }

    var task = new Task("testEventHandler_fire", 3, function(error, buffer) {
        if (error) {
            test.done(miss());
        } else {
            test.done(pass());
        }
    });

    var event = new EventHandler(["a", "b", "c"]);

    event.on("a", a1);
    event.on("a", a2);
    event.on("b", b1);

    event.fire("a", { foo: 1 });
    event.fire("b", { bar: 2 });
}


function testEventHandler_clear(test, pass, miss) {

    function a1() { }
    function a2() { }
    function b1() { }

    var task = new Task("testEventHandler_clear", 1, function(error, buffer) {
        if (error) {
            test.done(miss());
        } else {
            test.done(pass());
        }
    });

    var event = new EventHandler(["a", "b", "c"]);

    event.on("a", a1);
    event.on("a", a2);
    event.on("b", b1);

    event.clear();

    task.pass();
}

function testEventHandler_dom(test, pass, miss) {

    var button = document.body.appendChild( document.createElement("button") );

    var event = new EventHandler(["click"], button);

    event.on("click", function(event) {
        document.body.removeChild(button);
        test.done(pass());
    });

    event.fire("click");
}

function testEventHandler_dom_detail(test, pass, miss) {
    var button = document.body.appendChild( document.createElement("button") );

    var event = new EventHandler(["click"], button);

    event.on("click", function(event) {
        document.body.removeChild(button);
        if (event.detail.foo === 123) {
            test.done(pass());
        }
    });

    event.fire("click", { foo: 123 });
}

return test.run();

})(GLOBAL);

