# EventHandler.js [![Build Status](https://travis-ci.org/uupaa/EventHandler.js.svg)](https://travis-ci.org/uupaa/EventHandler.js)

[![npm](https://nodei.co/npm/uupaa.eventhandler.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.eventhandler.js/)

Event handler class.

- Please refer to [Spec](https://github.com/uupaa/EventHandler.js/wiki/) and [API Spec](https://github.com/uupaa/EventHandler.js/wiki/EventHandler) links.
- The EventHandler.js is made of [WebModule](https://github.com/uupaa/WebModule).

## Browser and NW.js(node-webkit)

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/EventHandler.js"></script>
<script>
    function a1(event) {
        console.log("call a1. detail: " + JSON.stringify(event.detail));
    }
    function a2(event) {
        console.log("call a2. detail: " + JSON.stringify(event.detail));
    }

    var event = new EventHandler(["type-a", "type-b"]);

    event.on("type-a", a1);
    event.on("type-a", a2);
    event.fire("type-a", { foo: 1 });
    event.clear();
</script>
```

## WebWorkers

```js
importScripts("<module-dir>lib/WebModule.js");
importScripts("<module-dir>lib/EventHandler.js");

...
```

## Node.js

```js
require("<module-dir>lib/WebModule.js");
require("<module-dir>lib/EventHandler.js");

...
```

