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
function EventHandler(types,    // @arg EventTypeStringArray - support types. "type" or ["type", ...]
                      target) { // @arg TargetObject = null
    this._handlers  = {};             // event handlers. { type: [handler, ...], ... }
    this._target    = target || null; // event target object.
    this._DOM       = target && target["addEventListener"]; // target is DOM

    var that = this;

    types.forEach(function(type) {
        that._handlers[type] = [];
    });
}

EventHandler["repository"] = "https://github.com/uupaa/EventHandler.js";
EventHandler["prototype"] = {
    "constructor":  EventHandler,       // new EventHandler(types:EventTypeString|EventTypeStringArray, target:TargetObject = null):EventHandler
    "on":           EventHandler_on,    // EventHandler#on(type:EventTypeString, handler:Function):void
    "off":          EventHandler_off,   // EventHandler#off(type:EventTypeString, handler:Function = null):void
    "list":         EventHandler_list,  // EventHandler#list(type):FunctionArray
    "fire":         EventHandler_fire,  // EventHandler#fire(type:EventTypeString, detail:Any|Object = {}):void
    "know":         EventHandler_know,  // EventHandler#know(type):Boolean
    "clear":        EventHandler_clear  // EventHandler#clear():void
};

// --- implements ------------------------------------------
function EventHandler_on(type,      // @arg EventTypeString
                         handler) { // @arg Function - handler(event:EventObject):void
//{@dev
    $valid($type(type,    "String"),   EventHandler_on, "type");
    $valid($type(handler, "Function"), EventHandler_on, "handler");

    if ( !(type in this._handlers) ) {
        throw new TypeError("Unknown type: " + type);
    }
//}@dev

    if (this._handlers[type].indexOf(handler) < 0) {
        this._handlers[type].push(handler);
        if (this._DOM) {
            this._target["addEventListener"](type, handler, false);
        }
    }
}

function EventHandler_off(type,      // @arg EventTypeString
                          handler) { // @arg Function = null - handler(event:EventObject):void
//{@dev
    $valid($type(type,    "String"),        EventHandler_off, "type");
    $valid($type(handler, "Function|omit"), EventHandler_off, "handler");
//}@dev

    if (handler) {
        _removeOne.call(this, type, handler);
    } else {
        _removeAll.call(this, type);
    }
}

function EventHandler_know(type) { // @arg EventTypeString
                                   // @ret Boolean
    return type in this._handlers;
}

function EventHandler_list(type) { // @arg EventTypeString
                                   // @ret FunctionArray - [handler, ...] or []
    return this._handlers[type] || [];
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

    if (this._DOM) {
        this._target["dispatchEvent"](event);
    } else {
        (this._handlers[type] || []).forEach(function(handler) {
            handler(event);
        });
    }
}

function EventHandler_clear() {
    for (var type in this._handlers) {
        _removeAll.call(this, type);
    }
}

function _removeOne(type, handler) {
    if (this._DOM) {
        this._target["removeEventListener"](type, handler, false);
    }

    var pos = this._handlers[type].indexOf(handler);

    if (pos >= 0) {
        this._handlers[type].splice(pos, 1);
    }
}

function _removeAll(type) {
    if (this._DOM) {
        this._handlers[type].forEach(function(handler) {
            this._target["removeEventListener"](type, handler, false);
        }, this);
    }

    this._handlers[type] = [];
}

return EventHandler; // return entity

});

