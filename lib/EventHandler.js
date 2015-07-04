(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("EventHandler", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function EventHandler(types,    // @arg EventTypeString|EventTypeStringArray - support types. "type" or ["type", ...]
                      target) { // @arg TargetObject = null
//{@dev
    if (target && !target["addEventListener"]) {
        throw new TypeError("Event target has not addEventListener function");
    }
//}@dev

    this._handler = {};             // event handlers. { type: [handler, ...], ... }
    this._target  = target || null; // event target object.

    var that = this;

    (Array.isArray(types) ? types : [types]).forEach(function(type) {
        that._handler[type] = [];
    });
}

EventHandler["repository"] = "https://github.com/uupaa/EventHandler.js";
EventHandler["prototype"] = {
    "constructor":  EventHandler,       // new EventHandler(types:EventTypeString|EventTypeStringArray, target:TargetObject = null):EventHandler
    "on":           EventHandler_on,    // EventHandler#on(type:EventTypeString, handler:Function):void
    "off":          EventHandler_off,   // EventHandler#off(type:EventTypeString, handler:Function = null):void
    "has":          EventHandler_has,   // EventHandler#has(type):Boolean
    "list":         EventHandler_list,  // EventHandler#list(type):FunctionArray
    "fire":         EventHandler_fire,  // EventHandler#fire(type:EventTypeString):void
    "clear":        EventHandler_clear  // EventHandler#clear():void
};

// --- implements ------------------------------------------
function EventHandler_on(type,      // @arg EventTypeString
                         handler) { // @arg Function - handler(event:EventObject):void
//{@dev
    $valid($type(type,    "String"),   EventHandler_on, "type");
    $valid($type(handler, "Function"), EventHandler_on, "handler");

    if ( !(type in this._handler) ) {
        throw new TypeError("Unknown type: " + type);
    }
//}@dev

    this._handler[type].push(handler);
    if (this._target) {
        this._target["addEventListener"](type, handler, false);
    }
}

function EventHandler_off(type,      // @arg EventTypeString
                          handler) { // @arg Function = null - handler(event:EventObject):void
//{@dev
    $valid($type(type,    "String"),        EventHandler_off, "type");
    $valid($type(handler, "Function|omit"), EventHandler_off, "handler");
//}@dev

    if (handler) {
        this._handler[type] = this._handler[type].filter(function(fn) {
            return fn !== handler;
        });
        if (this._target) {
            this._target["removeEventListener"](type, handler, false);
        }
    } else {
        _off(this._target, type, this._handler);
    }
}
function _off(target, type, handler) {
    if (target) {
        handler[type].forEach(function(fn) {
            target["removeEventListener"](type, fn, false);
        });
    }
    handler[type] = [];
}

function EventHandler_has(type) { // @arg EventTypeString
                                  // @ret Boolean
    return type in this._handler;
}

function EventHandler_list(type) { // @arg EventTypeString
                                   // @ret FunctionArray - [handler, ...] or []
    return this._handler[type] || [];
}

function EventHandler_fire(type,     // @arg EventTypeString
                           detail) { // @arg Any|Object = {} - event.detail
//{@dev
    $valid($type(type, "String"), EventHandler_fire, "type");
//}@dev

    var event = null;

    if (global["CustomEvent"]) {
        event = new CustomEvent(type, { "detail": detail });
    } else {
        event = { "target": this._target, "type": type, "detail": detail };
    }

    if (this._target) {
        this._target["dispatchEvent"](event);
    } else {
        (this._handler[type] || []).forEach(function(fn) {
            fn(event);
        });
    }
}

function EventHandler_clear() {
    for (var type in this._handler) {
        _off(this._target, type, this._handler);
    }
}

return EventHandler; // return entity

});

