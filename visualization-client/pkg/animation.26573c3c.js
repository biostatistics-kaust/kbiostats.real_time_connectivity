// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../node_modules/kefir/dist/kefir.esm.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dissableDeprecationWarnings = dissableDeprecationWarnings;
exports.Observable = Observable;
exports.Stream = Stream;
exports.Property = Property;
exports.never = never;
exports.later = later;
exports.interval = interval;
exports.sequentially = sequentially;
exports.fromPoll = fromPoll;
exports.withInterval = withInterval;
exports.fromCallback = fromCallback;
exports.fromNodeCallback = fromNodeCallback;
exports.fromEvents = fromEvents;
exports.stream = stream;
exports.constant = constant;
exports.constantError = constantError;
exports.fromPromise = fromPromise;
exports.fromESObservable = fromESObservable;
exports.combine = combine;
exports.zip = zip;
exports.merge = merge;
exports.concat = concat$1;
exports.Pool = Pool;
exports.default = exports.staticLand = exports.repeat = exports.pool = exports.Kefir = void 0;

/*! Kefir.js v3.8.8
 *  https://github.com/kefirjs/kefir
 */
function createObj(proto) {
  var F = function () {};

  F.prototype = proto;
  return new F();
}

function extend(target
/*, mixin1, mixin2...*/
) {
  var length = arguments.length,
      i = void 0,
      prop = void 0;

  for (i = 1; i < length; i++) {
    for (prop in arguments[i]) {
      target[prop] = arguments[i][prop];
    }
  }

  return target;
}

function inherit(Child, Parent
/*, mixin1, mixin2...*/
) {
  var length = arguments.length,
      i = void 0;
  Child.prototype = createObj(Parent.prototype);
  Child.prototype.constructor = Child;

  for (i = 2; i < length; i++) {
    extend(Child.prototype, arguments[i]);
  }

  return Child;
}

var NOTHING = ['<nothing>'];
var END = 'end';
var VALUE = 'value';
var ERROR = 'error';
var ANY = 'any';

function concat(a, b) {
  var result = void 0,
      length = void 0,
      i = void 0,
      j = void 0;

  if (a.length === 0) {
    return b;
  }

  if (b.length === 0) {
    return a;
  }

  j = 0;
  result = new Array(a.length + b.length);
  length = a.length;

  for (i = 0; i < length; i++, j++) {
    result[j] = a[i];
  }

  length = b.length;

  for (i = 0; i < length; i++, j++) {
    result[j] = b[i];
  }

  return result;
}

function find(arr, value) {
  var length = arr.length,
      i = void 0;

  for (i = 0; i < length; i++) {
    if (arr[i] === value) {
      return i;
    }
  }

  return -1;
}

function findByPred(arr, pred) {
  var length = arr.length,
      i = void 0;

  for (i = 0; i < length; i++) {
    if (pred(arr[i])) {
      return i;
    }
  }

  return -1;
}

function cloneArray(input) {
  var length = input.length,
      result = new Array(length),
      i = void 0;

  for (i = 0; i < length; i++) {
    result[i] = input[i];
  }

  return result;
}

function remove(input, index) {
  var length = input.length,
      result = void 0,
      i = void 0,
      j = void 0;

  if (index >= 0 && index < length) {
    if (length === 1) {
      return [];
    } else {
      result = new Array(length - 1);

      for (i = 0, j = 0; i < length; i++) {
        if (i !== index) {
          result[j] = input[i];
          j++;
        }
      }

      return result;
    }
  } else {
    return input;
  }
}

function map(input, fn) {
  var length = input.length,
      result = new Array(length),
      i = void 0;

  for (i = 0; i < length; i++) {
    result[i] = fn(input[i]);
  }

  return result;
}

function forEach(arr, fn) {
  var length = arr.length,
      i = void 0;

  for (i = 0; i < length; i++) {
    fn(arr[i]);
  }
}

function fillArray(arr, value) {
  var length = arr.length,
      i = void 0;

  for (i = 0; i < length; i++) {
    arr[i] = value;
  }
}

function contains(arr, value) {
  return find(arr, value) !== -1;
}

function slide(cur, next, max) {
  var length = Math.min(max, cur.length + 1),
      offset = cur.length - length + 1,
      result = new Array(length),
      i = void 0;

  for (i = offset; i < length; i++) {
    result[i - offset] = cur[i];
  }

  result[length - 1] = next;
  return result;
}

function callSubscriber(type, fn, event) {
  if (type === ANY) {
    fn(event);
  } else if (type === event.type) {
    if (type === VALUE || type === ERROR) {
      fn(event.value);
    } else {
      fn();
    }
  }
}

function Dispatcher() {
  this._items = [];
  this._spies = [];
  this._inLoop = 0;
  this._removedItems = null;
}

extend(Dispatcher.prototype, {
  add: function (type, fn) {
    this._items = concat(this._items, [{
      type: type,
      fn: fn
    }]);
    return this._items.length;
  },
  remove: function (type, fn) {
    var index = findByPred(this._items, function (x) {
      return x.type === type && x.fn === fn;
    }); // if we're currently in a notification loop,
    // remember this subscriber was removed

    if (this._inLoop !== 0 && index !== -1) {
      if (this._removedItems === null) {
        this._removedItems = [];
      }

      this._removedItems.push(this._items[index]);
    }

    this._items = remove(this._items, index);
    return this._items.length;
  },
  addSpy: function (fn) {
    this._spies = concat(this._spies, [fn]);
    return this._spies.length;
  },
  // Because spies are only ever a function that perform logging as
  // their only side effect, we don't need the same complicated
  // removal logic like in remove()
  removeSpy: function (fn) {
    this._spies = remove(this._spies, this._spies.indexOf(fn));
    return this._spies.length;
  },
  dispatch: function (event) {
    this._inLoop++;

    for (var i = 0, spies = this._spies; this._spies !== null && i < spies.length; i++) {
      spies[i](event);
    }

    for (var _i = 0, items = this._items; _i < items.length; _i++) {
      // cleanup was called
      if (this._items === null) {
        break;
      } // this subscriber was removed


      if (this._removedItems !== null && contains(this._removedItems, items[_i])) {
        continue;
      }

      callSubscriber(items[_i].type, items[_i].fn, event);
    }

    this._inLoop--;

    if (this._inLoop === 0) {
      this._removedItems = null;
    }
  },
  cleanup: function () {
    this._items = null;
    this._spies = null;
  }
});

function Observable() {
  this._dispatcher = new Dispatcher();
  this._active = false;
  this._alive = true;
  this._activating = false;
  this._logHandlers = null;
  this._spyHandlers = null;
}

extend(Observable.prototype, {
  _name: 'observable',
  _onActivation: function () {},
  _onDeactivation: function () {},
  _setActive: function (active) {
    if (this._active !== active) {
      this._active = active;

      if (active) {
        this._activating = true;

        this._onActivation();

        this._activating = false;
      } else {
        this._onDeactivation();
      }
    }
  },
  _clear: function () {
    this._setActive(false);

    this._dispatcher.cleanup();

    this._dispatcher = null;
    this._logHandlers = null;
  },
  _emit: function (type, x) {
    switch (type) {
      case VALUE:
        return this._emitValue(x);

      case ERROR:
        return this._emitError(x);

      case END:
        return this._emitEnd();
    }
  },
  _emitValue: function (value) {
    if (this._alive) {
      this._dispatcher.dispatch({
        type: VALUE,
        value: value
      });
    }
  },
  _emitError: function (value) {
    if (this._alive) {
      this._dispatcher.dispatch({
        type: ERROR,
        value: value
      });
    }
  },
  _emitEnd: function () {
    if (this._alive) {
      this._alive = false;

      this._dispatcher.dispatch({
        type: END
      });

      this._clear();
    }
  },
  _on: function (type, fn) {
    if (this._alive) {
      this._dispatcher.add(type, fn);

      this._setActive(true);
    } else {
      callSubscriber(type, fn, {
        type: END
      });
    }

    return this;
  },
  _off: function (type, fn) {
    if (this._alive) {
      var count = this._dispatcher.remove(type, fn);

      if (count === 0) {
        this._setActive(false);
      }
    }

    return this;
  },
  onValue: function (fn) {
    return this._on(VALUE, fn);
  },
  onError: function (fn) {
    return this._on(ERROR, fn);
  },
  onEnd: function (fn) {
    return this._on(END, fn);
  },
  onAny: function (fn) {
    return this._on(ANY, fn);
  },
  offValue: function (fn) {
    return this._off(VALUE, fn);
  },
  offError: function (fn) {
    return this._off(ERROR, fn);
  },
  offEnd: function (fn) {
    return this._off(END, fn);
  },
  offAny: function (fn) {
    return this._off(ANY, fn);
  },
  observe: function (observerOrOnValue, onError, onEnd) {
    var _this = this;

    var closed = false;
    var observer = !observerOrOnValue || typeof observerOrOnValue === 'function' ? {
      value: observerOrOnValue,
      error: onError,
      end: onEnd
    } : observerOrOnValue;

    var handler = function (event) {
      if (event.type === END) {
        closed = true;
      }

      if (event.type === VALUE && observer.value) {
        observer.value(event.value);
      } else if (event.type === ERROR && observer.error) {
        observer.error(event.value);
      } else if (event.type === END && observer.end) {
        observer.end(event.value);
      }
    };

    this.onAny(handler);
    return {
      unsubscribe: function () {
        if (!closed) {
          _this.offAny(handler);

          closed = true;
        }
      },

      get closed() {
        return closed;
      }

    };
  },
  // A and B must be subclasses of Stream and Property (order doesn't matter)
  _ofSameType: function (A, B) {
    return A.prototype.getType() === this.getType() ? A : B;
  },
  setName: function (sourceObs
  /* optional */
  , selfName) {
    this._name = selfName ? sourceObs._name + '.' + selfName : sourceObs;
    return this;
  },
  log: function () {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.toString();
    var isCurrent = void 0;

    var handler = function (event) {
      var type = '<' + event.type + (isCurrent ? ':current' : '') + '>';

      if (event.type === END) {
        console.log(name, type);
      } else {
        console.log(name, type, event.value);
      }
    };

    if (this._alive) {
      if (!this._logHandlers) {
        this._logHandlers = [];
      }

      this._logHandlers.push({
        name: name,
        handler: handler
      });
    }

    isCurrent = true;
    this.onAny(handler);
    isCurrent = false;
    return this;
  },
  offLog: function () {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.toString();

    if (this._logHandlers) {
      var handlerIndex = findByPred(this._logHandlers, function (obj) {
        return obj.name === name;
      });

      if (handlerIndex !== -1) {
        this.offAny(this._logHandlers[handlerIndex].handler);

        this._logHandlers.splice(handlerIndex, 1);
      }
    }

    return this;
  },
  spy: function () {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.toString();

    var handler = function (event) {
      var type = '<' + event.type + '>';

      if (event.type === END) {
        console.log(name, type);
      } else {
        console.log(name, type, event.value);
      }
    };

    if (this._alive) {
      if (!this._spyHandlers) {
        this._spyHandlers = [];
      }

      this._spyHandlers.push({
        name: name,
        handler: handler
      });

      this._dispatcher.addSpy(handler);
    }

    return this;
  },
  offSpy: function () {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.toString();

    if (this._spyHandlers) {
      var handlerIndex = findByPred(this._spyHandlers, function (obj) {
        return obj.name === name;
      });

      if (handlerIndex !== -1) {
        this._dispatcher.removeSpy(this._spyHandlers[handlerIndex].handler);

        this._spyHandlers.splice(handlerIndex, 1);
      }
    }

    return this;
  }
}); // extend() can't handle `toString` in IE8

Observable.prototype.toString = function () {
  return '[' + this._name + ']';
};

function Stream() {
  Observable.call(this);
}

inherit(Stream, Observable, {
  _name: 'stream',
  getType: function () {
    return 'stream';
  }
});

function Property() {
  Observable.call(this);
  this._currentEvent = null;
}

inherit(Property, Observable, {
  _name: 'property',
  _emitValue: function (value) {
    if (this._alive) {
      this._currentEvent = {
        type: VALUE,
        value: value
      };

      if (!this._activating) {
        this._dispatcher.dispatch({
          type: VALUE,
          value: value
        });
      }
    }
  },
  _emitError: function (value) {
    if (this._alive) {
      this._currentEvent = {
        type: ERROR,
        value: value
      };

      if (!this._activating) {
        this._dispatcher.dispatch({
          type: ERROR,
          value: value
        });
      }
    }
  },
  _emitEnd: function () {
    if (this._alive) {
      this._alive = false;

      if (!this._activating) {
        this._dispatcher.dispatch({
          type: END
        });
      }

      this._clear();
    }
  },
  _on: function (type, fn) {
    if (this._alive) {
      this._dispatcher.add(type, fn);

      this._setActive(true);
    }

    if (this._currentEvent !== null) {
      callSubscriber(type, fn, this._currentEvent);
    }

    if (!this._alive) {
      callSubscriber(type, fn, {
        type: END
      });
    }

    return this;
  },
  getType: function () {
    return 'property';
  }
});
var neverS = new Stream();

neverS._emitEnd();

neverS._name = 'never';

function never() {
  return neverS;
}

function timeBased(mixin) {
  function AnonymousStream(wait, options) {
    var _this = this;

    Stream.call(this);
    this._wait = wait;
    this._intervalId = null;

    this._$onTick = function () {
      return _this._onTick();
    };

    this._init(options);
  }

  inherit(AnonymousStream, Stream, {
    _init: function () {},
    _free: function () {},
    _onTick: function () {},
    _onActivation: function () {
      this._intervalId = setInterval(this._$onTick, this._wait);
    },
    _onDeactivation: function () {
      if (this._intervalId !== null) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
    },
    _clear: function () {
      Stream.prototype._clear.call(this);

      this._$onTick = null;

      this._free();
    }
  }, mixin);
  return AnonymousStream;
}

var S = timeBased({
  _name: 'later',
  _init: function (_ref) {
    var x = _ref.x;
    this._x = x;
  },
  _free: function () {
    this._x = null;
  },
  _onTick: function () {
    this._emitValue(this._x);

    this._emitEnd();
  }
});

function later(wait, x) {
  return new S(wait, {
    x: x
  });
}

var S$1 = timeBased({
  _name: 'interval',
  _init: function (_ref) {
    var x = _ref.x;
    this._x = x;
  },
  _free: function () {
    this._x = null;
  },
  _onTick: function () {
    this._emitValue(this._x);
  }
});

function interval(wait, x) {
  return new S$1(wait, {
    x: x
  });
}

var S$2 = timeBased({
  _name: 'sequentially',
  _init: function (_ref) {
    var xs = _ref.xs;
    this._xs = cloneArray(xs);
  },
  _free: function () {
    this._xs = null;
  },
  _onTick: function () {
    if (this._xs.length === 1) {
      this._emitValue(this._xs[0]);

      this._emitEnd();
    } else {
      this._emitValue(this._xs.shift());
    }
  }
});

function sequentially(wait, xs) {
  return xs.length === 0 ? never() : new S$2(wait, {
    xs: xs
  });
}

var S$3 = timeBased({
  _name: 'fromPoll',
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
  },
  _free: function () {
    this._fn = null;
  },
  _onTick: function () {
    var fn = this._fn;

    this._emitValue(fn());
  }
});

function fromPoll(wait, fn) {
  return new S$3(wait, {
    fn: fn
  });
}

function emitter(obs) {
  function value(x) {
    obs._emitValue(x);

    return obs._active;
  }

  function error(x) {
    obs._emitError(x);

    return obs._active;
  }

  function end() {
    obs._emitEnd();

    return obs._active;
  }

  function event(e) {
    obs._emit(e.type, e.value);

    return obs._active;
  }

  return {
    value: value,
    error: error,
    end: end,
    event: event,
    // legacy
    emit: value,
    emitEvent: event
  };
}

var S$4 = timeBased({
  _name: 'withInterval',
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
    this._emitter = emitter(this);
  },
  _free: function () {
    this._fn = null;
    this._emitter = null;
  },
  _onTick: function () {
    var fn = this._fn;
    fn(this._emitter);
  }
});

function withInterval(wait, fn) {
  return new S$4(wait, {
    fn: fn
  });
}

function S$5(fn) {
  Stream.call(this);
  this._fn = fn;
  this._unsubscribe = null;
}

inherit(S$5, Stream, {
  _name: 'stream',
  _onActivation: function () {
    var fn = this._fn;
    var unsubscribe = fn(emitter(this));
    this._unsubscribe = typeof unsubscribe === 'function' ? unsubscribe : null; // fix https://github.com/kefirjs/kefir/issues/35

    if (!this._active) {
      this._callUnsubscribe();
    }
  },
  _callUnsubscribe: function () {
    if (this._unsubscribe !== null) {
      this._unsubscribe();

      this._unsubscribe = null;
    }
  },
  _onDeactivation: function () {
    this._callUnsubscribe();
  },
  _clear: function () {
    Stream.prototype._clear.call(this);

    this._fn = null;
  }
});

function stream(fn) {
  return new S$5(fn);
}

function fromCallback(callbackConsumer) {
  var called = false;
  return stream(function (emitter) {
    if (!called) {
      callbackConsumer(function (x) {
        emitter.emit(x);
        emitter.end();
      });
      called = true;
    }
  }).setName('fromCallback');
}

function fromNodeCallback(callbackConsumer) {
  var called = false;
  return stream(function (emitter) {
    if (!called) {
      callbackConsumer(function (error, x) {
        if (error) {
          emitter.error(error);
        } else {
          emitter.emit(x);
        }

        emitter.end();
      });
      called = true;
    }
  }).setName('fromNodeCallback');
}

function spread(fn, length) {
  switch (length) {
    case 0:
      return function () {
        return fn();
      };

    case 1:
      return function (a) {
        return fn(a[0]);
      };

    case 2:
      return function (a) {
        return fn(a[0], a[1]);
      };

    case 3:
      return function (a) {
        return fn(a[0], a[1], a[2]);
      };

    case 4:
      return function (a) {
        return fn(a[0], a[1], a[2], a[3]);
      };

    default:
      return function (a) {
        return fn.apply(null, a);
      };
  }
}

function apply(fn, c, a) {
  var aLength = a ? a.length : 0;

  if (c == null) {
    switch (aLength) {
      case 0:
        return fn();

      case 1:
        return fn(a[0]);

      case 2:
        return fn(a[0], a[1]);

      case 3:
        return fn(a[0], a[1], a[2]);

      case 4:
        return fn(a[0], a[1], a[2], a[3]);

      default:
        return fn.apply(null, a);
    }
  } else {
    switch (aLength) {
      case 0:
        return fn.call(c);

      default:
        return fn.apply(c, a);
    }
  }
}

function fromSubUnsub(sub, unsub, transformer
/* Function | falsey */
) {
  return stream(function (emitter) {
    var handler = transformer ? function () {
      emitter.emit(apply(transformer, this, arguments));
    } : function (x) {
      emitter.emit(x);
    };
    sub(handler);
    return function () {
      return unsub(handler);
    };
  }).setName('fromSubUnsub');
}

var pairs = [['addEventListener', 'removeEventListener'], ['addListener', 'removeListener'], ['on', 'off']];

function fromEvents(target, eventName, transformer) {
  var sub = void 0,
      unsub = void 0;

  for (var i = 0; i < pairs.length; i++) {
    if (typeof target[pairs[i][0]] === 'function' && typeof target[pairs[i][1]] === 'function') {
      sub = pairs[i][0];
      unsub = pairs[i][1];
      break;
    }
  }

  if (sub === undefined) {
    throw new Error("target don't support any of " + 'addEventListener/removeEventListener, addListener/removeListener, on/off method pair');
  }

  return fromSubUnsub(function (handler) {
    return target[sub](eventName, handler);
  }, function (handler) {
    return target[unsub](eventName, handler);
  }, transformer).setName('fromEvents');
} // HACK:
//   We don't call parent Class constructor, but instead putting all necessary
//   properties into prototype to simulate ended Property
//   (see Propperty and Observable classes).


function P(value) {
  this._currentEvent = {
    type: 'value',
    value: value,
    current: true
  };
}

inherit(P, Property, {
  _name: 'constant',
  _active: false,
  _activating: false,
  _alive: false,
  _dispatcher: null,
  _logHandlers: null
});

function constant(x) {
  return new P(x);
} // HACK:
//   We don't call parent Class constructor, but instead putting all necessary
//   properties into prototype to simulate ended Property
//   (see Propperty and Observable classes).


function P$1(value) {
  this._currentEvent = {
    type: 'error',
    value: value,
    current: true
  };
}

inherit(P$1, Property, {
  _name: 'constantError',
  _active: false,
  _activating: false,
  _alive: false,
  _dispatcher: null,
  _logHandlers: null
});

function constantError(x) {
  return new P$1(x);
}

function createConstructor(BaseClass, name) {
  return function AnonymousObservable(source, options) {
    var _this = this;

    BaseClass.call(this);
    this._source = source;
    this._name = source._name + '.' + name;

    this._init(options);

    this._$handleAny = function (event) {
      return _this._handleAny(event);
    };
  };
}

function createClassMethods(BaseClass) {
  return {
    _init: function () {},
    _free: function () {},
    _handleValue: function (x) {
      this._emitValue(x);
    },
    _handleError: function (x) {
      this._emitError(x);
    },
    _handleEnd: function () {
      this._emitEnd();
    },
    _handleAny: function (event) {
      switch (event.type) {
        case VALUE:
          return this._handleValue(event.value);

        case ERROR:
          return this._handleError(event.value);

        case END:
          return this._handleEnd();
      }
    },
    _onActivation: function () {
      this._source.onAny(this._$handleAny);
    },
    _onDeactivation: function () {
      this._source.offAny(this._$handleAny);
    },
    _clear: function () {
      BaseClass.prototype._clear.call(this);

      this._source = null;
      this._$handleAny = null;

      this._free();
    }
  };
}

function createStream(name, mixin) {
  var S = createConstructor(Stream, name);
  inherit(S, Stream, createClassMethods(Stream), mixin);
  return S;
}

function createProperty(name, mixin) {
  var P = createConstructor(Property, name);
  inherit(P, Property, createClassMethods(Property), mixin);
  return P;
}

var P$2 = createProperty('toProperty', {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._getInitialCurrent = fn;
  },
  _onActivation: function () {
    if (this._getInitialCurrent !== null) {
      var getInitial = this._getInitialCurrent;

      this._emitValue(getInitial());
    }

    this._source.onAny(this._$handleAny); // copied from patterns/one-source

  }
});

function toProperty(obs) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (fn !== null && typeof fn !== 'function') {
    throw new Error('You should call toProperty() with a function or no arguments.');
  }

  return new P$2(obs, {
    fn: fn
  });
}

var S$6 = createStream('changes', {
  _handleValue: function (x) {
    if (!this._activating) {
      this._emitValue(x);
    }
  },
  _handleError: function (x) {
    if (!this._activating) {
      this._emitError(x);
    }
  }
});

function changes(obs) {
  return new S$6(obs);
}

function fromPromise(promise) {
  var called = false;
  var result = stream(function (emitter) {
    if (!called) {
      var onValue = function (x) {
        emitter.emit(x);
        emitter.end();
      };

      var onError = function (x) {
        emitter.error(x);
        emitter.end();
      };

      var _promise = promise.then(onValue, onError); // prevent libraries like 'Q' or 'when' from swallowing exceptions


      if (_promise && typeof _promise.done === 'function') {
        _promise.done();
      }

      called = true;
    }
  });
  return toProperty(result, null).setName('fromPromise');
}

function getGlodalPromise() {
  if (typeof Promise === 'function') {
    return Promise;
  } else {
    throw new Error("There isn't default Promise, use shim or parameter");
  }
}

var toPromise = function (obs) {
  var Promise = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getGlodalPromise();
  var last = null;
  return new Promise(function (resolve, reject) {
    obs.onAny(function (event) {
      if (event.type === END && last !== null) {
        (last.type === VALUE ? resolve : reject)(last.value);
        last = null;
      } else {
        last = event;
      }
    });
  });
};

function symbolObservablePonyfill(root) {
  var result;
  var Symbol = root.Symbol;

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      result = Symbol.observable;
    } else {
      result = Symbol('observable');
      Symbol.observable = result;
    }
  } else {
    result = '@@observable';
  }

  return result;
}
/* global window */


var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = symbolObservablePonyfill(root); // this file contains some hot JS modules systems stuff

var $$observable = result.default ? result.default : result;

function fromESObservable(_observable) {
  var observable = _observable[$$observable] ? _observable[$$observable]() : _observable;
  return stream(function (emitter) {
    var unsub = observable.subscribe({
      error: function (error) {
        emitter.error(error);
        emitter.end();
      },
      next: function (value) {
        emitter.emit(value);
      },
      complete: function () {
        emitter.end();
      }
    });

    if (unsub.unsubscribe) {
      return function () {
        unsub.unsubscribe();
      };
    } else {
      return unsub;
    }
  }).setName('fromESObservable');
}

function ESObservable(observable) {
  this._observable = observable.takeErrors(1);
}

extend(ESObservable.prototype, {
  subscribe: function (observerOrOnNext, onError, onComplete) {
    var _this = this;

    var observer = typeof observerOrOnNext === 'function' ? {
      next: observerOrOnNext,
      error: onError,
      complete: onComplete
    } : observerOrOnNext;

    var fn = function (event) {
      if (event.type === END) {
        closed = true;
      }

      if (event.type === VALUE && observer.next) {
        observer.next(event.value);
      } else if (event.type === ERROR && observer.error) {
        observer.error(event.value);
      } else if (event.type === END && observer.complete) {
        observer.complete(event.value);
      }
    };

    this._observable.onAny(fn);

    var closed = false;
    var subscription = {
      unsubscribe: function () {
        closed = true;

        _this._observable.offAny(fn);
      },

      get closed() {
        return closed;
      }

    };
    return subscription;
  }
}); // Need to assign directly b/c Symbols aren't enumerable.

ESObservable.prototype[$$observable] = function () {
  return this;
};

function toESObservable() {
  return new ESObservable(this);
}

function collect(source, keys, values) {
  for (var prop in source) {
    if (source.hasOwnProperty(prop)) {
      keys.push(prop);
      values.push(source[prop]);
    }
  }
}

function defaultErrorsCombinator(errors) {
  var latestError = void 0;

  for (var i = 0; i < errors.length; i++) {
    if (errors[i] !== undefined) {
      if (latestError === undefined || latestError.index < errors[i].index) {
        latestError = errors[i];
      }
    }
  }

  return latestError.error;
}

function Combine(active, passive, combinator) {
  var _this = this;

  Stream.call(this);
  this._activeCount = active.length;
  this._sources = concat(active, passive);
  this._combinator = combinator;
  this._aliveCount = 0;
  this._latestValues = new Array(this._sources.length);
  this._latestErrors = new Array(this._sources.length);
  fillArray(this._latestValues, NOTHING);
  this._emitAfterActivation = false;
  this._endAfterActivation = false;
  this._latestErrorIndex = 0;
  this._$handlers = [];

  var _loop = function (i) {
    _this._$handlers.push(function (event) {
      return _this._handleAny(i, event);
    });
  };

  for (var i = 0; i < this._sources.length; i++) {
    _loop(i);
  }
}

inherit(Combine, Stream, {
  _name: 'combine',
  _onActivation: function () {
    this._aliveCount = this._activeCount; // we need to suscribe to _passive_ sources before _active_
    // (see https://github.com/kefirjs/kefir/issues/98)

    for (var i = this._activeCount; i < this._sources.length; i++) {
      this._sources[i].onAny(this._$handlers[i]);
    }

    for (var _i = 0; _i < this._activeCount; _i++) {
      this._sources[_i].onAny(this._$handlers[_i]);
    }

    if (this._emitAfterActivation) {
      this._emitAfterActivation = false;

      this._emitIfFull();
    }

    if (this._endAfterActivation) {
      this._emitEnd();
    }
  },
  _onDeactivation: function () {
    var length = this._sources.length,
        i = void 0;

    for (i = 0; i < length; i++) {
      this._sources[i].offAny(this._$handlers[i]);
    }
  },
  _emitIfFull: function () {
    var hasAllValues = true;
    var hasErrors = false;
    var length = this._latestValues.length;
    var valuesCopy = new Array(length);
    var errorsCopy = new Array(length);

    for (var i = 0; i < length; i++) {
      valuesCopy[i] = this._latestValues[i];
      errorsCopy[i] = this._latestErrors[i];

      if (valuesCopy[i] === NOTHING) {
        hasAllValues = false;
      }

      if (errorsCopy[i] !== undefined) {
        hasErrors = true;
      }
    }

    if (hasAllValues) {
      var combinator = this._combinator;

      this._emitValue(combinator(valuesCopy));
    }

    if (hasErrors) {
      this._emitError(defaultErrorsCombinator(errorsCopy));
    }
  },
  _handleAny: function (i, event) {
    if (event.type === VALUE || event.type === ERROR) {
      if (event.type === VALUE) {
        this._latestValues[i] = event.value;
        this._latestErrors[i] = undefined;
      }

      if (event.type === ERROR) {
        this._latestValues[i] = NOTHING;
        this._latestErrors[i] = {
          index: this._latestErrorIndex++,
          error: event.value
        };
      }

      if (i < this._activeCount) {
        if (this._activating) {
          this._emitAfterActivation = true;
        } else {
          this._emitIfFull();
        }
      }
    } else {
      // END
      if (i < this._activeCount) {
        this._aliveCount--;

        if (this._aliveCount === 0) {
          if (this._activating) {
            this._endAfterActivation = true;
          } else {
            this._emitEnd();
          }
        }
      }
    }
  },
  _clear: function () {
    Stream.prototype._clear.call(this);

    this._sources = null;
    this._latestValues = null;
    this._latestErrors = null;
    this._combinator = null;
    this._$handlers = null;
  }
});

function combineAsArray(active) {
  var passive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var combinator = arguments[2];

  if (!Array.isArray(passive)) {
    throw new Error('Combine can only combine active and passive collections of the same type.');
  }

  combinator = combinator ? spread(combinator, active.length + passive.length) : function (x) {
    return x;
  };
  return active.length === 0 ? never() : new Combine(active, passive, combinator);
}

function combineAsObject(active) {
  var passive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var combinator = arguments[2];

  if (typeof passive !== 'object' || Array.isArray(passive)) {
    throw new Error('Combine can only combine active and passive collections of the same type.');
  }

  var keys = [],
      activeObservables = [],
      passiveObservables = [];
  collect(active, keys, activeObservables);
  collect(passive, keys, passiveObservables);

  var objectify = function (values) {
    var event = {};

    for (var i = values.length - 1; 0 <= i; i--) {
      event[keys[i]] = values[i];
    }

    return combinator ? combinator(event) : event;
  };

  return activeObservables.length === 0 ? never() : new Combine(activeObservables, passiveObservables, objectify);
}

function combine(active, passive, combinator) {
  if (typeof passive === 'function') {
    combinator = passive;
    passive = undefined;
  }

  return Array.isArray(active) ? combineAsArray(active, passive, combinator) : combineAsObject(active, passive, combinator);
}

var Observable$2 = {
  empty: function () {
    return never();
  },
  // Monoid based on merge() seems more useful than one based on concat().
  concat: function (a, b) {
    return a.merge(b);
  },
  of: function (x) {
    return constant(x);
  },
  map: function (fn, obs) {
    return obs.map(fn);
  },
  bimap: function (fnErr, fnVal, obs) {
    return obs.mapErrors(fnErr).map(fnVal);
  },
  // This ap strictly speaking incompatible with chain. If we derive ap from chain we get
  // different (not very useful) behavior. But spec requires that if method can be derived
  // it must have the same behavior as hand-written method. We intentionally violate the spec
  // in hope that it won't cause many troubles in practice. And in return we have more useful type.
  ap: function (obsFn, obsVal) {
    return combine([obsFn, obsVal], function (fn, val) {
      return fn(val);
    });
  },
  chain: function (fn, obs) {
    return obs.flatMap(fn);
  }
};
var staticLand = Object.freeze({
  Observable: Observable$2
});
exports.staticLand = staticLand;
var mixin = {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
  },
  _free: function () {
    this._fn = null;
  },
  _handleValue: function (x) {
    var fn = this._fn;

    this._emitValue(fn(x));
  }
};
var S$7 = createStream('map', mixin);
var P$3 = createProperty('map', mixin);

var id = function (x) {
  return x;
};

function map$1(obs) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id;
  return new (obs._ofSameType(S$7, P$3))(obs, {
    fn: fn
  });
}

var mixin$1 = {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
  },
  _free: function () {
    this._fn = null;
  },
  _handleValue: function (x) {
    var fn = this._fn;

    if (fn(x)) {
      this._emitValue(x);
    }
  }
};
var S$8 = createStream('filter', mixin$1);
var P$4 = createProperty('filter', mixin$1);

var id$1 = function (x) {
  return x;
};

function filter(obs) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$1;
  return new (obs._ofSameType(S$8, P$4))(obs, {
    fn: fn
  });
}

var mixin$2 = {
  _init: function (_ref) {
    var n = _ref.n;
    this._n = n;

    if (n <= 0) {
      this._emitEnd();
    }
  },
  _handleValue: function (x) {
    if (this._n === 0) {
      return;
    }

    this._n--;

    this._emitValue(x);

    if (this._n === 0) {
      this._emitEnd();
    }
  }
};
var S$9 = createStream('take', mixin$2);
var P$5 = createProperty('take', mixin$2);

function take(obs, n) {
  return new (obs._ofSameType(S$9, P$5))(obs, {
    n: n
  });
}

var mixin$3 = {
  _init: function (_ref) {
    var n = _ref.n;
    this._n = n;

    if (n <= 0) {
      this._emitEnd();
    }
  },
  _handleError: function (x) {
    if (this._n === 0) {
      return;
    }

    this._n--;

    this._emitError(x);

    if (this._n === 0) {
      this._emitEnd();
    }
  }
};
var S$10 = createStream('takeErrors', mixin$3);
var P$6 = createProperty('takeErrors', mixin$3);

function takeErrors(obs, n) {
  return new (obs._ofSameType(S$10, P$6))(obs, {
    n: n
  });
}

var mixin$4 = {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
  },
  _free: function () {
    this._fn = null;
  },
  _handleValue: function (x) {
    var fn = this._fn;

    if (fn(x)) {
      this._emitValue(x);
    } else {
      this._emitEnd();
    }
  }
};
var S$11 = createStream('takeWhile', mixin$4);
var P$7 = createProperty('takeWhile', mixin$4);

var id$2 = function (x) {
  return x;
};

function takeWhile(obs) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$2;
  return new (obs._ofSameType(S$11, P$7))(obs, {
    fn: fn
  });
}

var mixin$5 = {
  _init: function () {
    this._lastValue = NOTHING;
  },
  _free: function () {
    this._lastValue = null;
  },
  _handleValue: function (x) {
    this._lastValue = x;
  },
  _handleEnd: function () {
    if (this._lastValue !== NOTHING) {
      this._emitValue(this._lastValue);
    }

    this._emitEnd();
  }
};
var S$12 = createStream('last', mixin$5);
var P$8 = createProperty('last', mixin$5);

function last(obs) {
  return new (obs._ofSameType(S$12, P$8))(obs);
}

var mixin$6 = {
  _init: function (_ref) {
    var n = _ref.n;
    this._n = Math.max(0, n);
  },
  _handleValue: function (x) {
    if (this._n === 0) {
      this._emitValue(x);
    } else {
      this._n--;
    }
  }
};
var S$13 = createStream('skip', mixin$6);
var P$9 = createProperty('skip', mixin$6);

function skip(obs, n) {
  return new (obs._ofSameType(S$13, P$9))(obs, {
    n: n
  });
}

var mixin$7 = {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
  },
  _free: function () {
    this._fn = null;
  },
  _handleValue: function (x) {
    var fn = this._fn;

    if (this._fn !== null && !fn(x)) {
      this._fn = null;
    }

    if (this._fn === null) {
      this._emitValue(x);
    }
  }
};
var S$14 = createStream('skipWhile', mixin$7);
var P$10 = createProperty('skipWhile', mixin$7);

var id$3 = function (x) {
  return x;
};

function skipWhile(obs) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$3;
  return new (obs._ofSameType(S$14, P$10))(obs, {
    fn: fn
  });
}

var mixin$8 = {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
    this._prev = NOTHING;
  },
  _free: function () {
    this._fn = null;
    this._prev = null;
  },
  _handleValue: function (x) {
    var fn = this._fn;

    if (this._prev === NOTHING || !fn(this._prev, x)) {
      this._prev = x;

      this._emitValue(x);
    }
  }
};
var S$15 = createStream('skipDuplicates', mixin$8);
var P$11 = createProperty('skipDuplicates', mixin$8);

var eq = function (a, b) {
  return a === b;
};

function skipDuplicates(obs) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : eq;
  return new (obs._ofSameType(S$15, P$11))(obs, {
    fn: fn
  });
}

var mixin$9 = {
  _init: function (_ref) {
    var fn = _ref.fn,
        seed = _ref.seed;
    this._fn = fn;
    this._prev = seed;
  },
  _free: function () {
    this._prev = null;
    this._fn = null;
  },
  _handleValue: function (x) {
    if (this._prev !== NOTHING) {
      var fn = this._fn;

      this._emitValue(fn(this._prev, x));
    }

    this._prev = x;
  }
};
var S$16 = createStream('diff', mixin$9);
var P$12 = createProperty('diff', mixin$9);

function defaultFn(a, b) {
  return [a, b];
}

function diff(obs, fn) {
  var seed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : NOTHING;
  return new (obs._ofSameType(S$16, P$12))(obs, {
    fn: fn || defaultFn,
    seed: seed
  });
}

var P$13 = createProperty('scan', {
  _init: function (_ref) {
    var fn = _ref.fn,
        seed = _ref.seed;
    this._fn = fn;
    this._seed = seed;

    if (seed !== NOTHING) {
      this._emitValue(seed);
    }
  },
  _free: function () {
    this._fn = null;
    this._seed = null;
  },
  _handleValue: function (x) {
    var fn = this._fn;

    if (this._currentEvent === null || this._currentEvent.type === ERROR) {
      this._emitValue(this._seed === NOTHING ? x : fn(this._seed, x));
    } else {
      this._emitValue(fn(this._currentEvent.value, x));
    }
  }
});

function scan(obs, fn) {
  var seed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : NOTHING;
  return new P$13(obs, {
    fn: fn,
    seed: seed
  });
}

var mixin$10 = {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
  },
  _free: function () {
    this._fn = null;
  },
  _handleValue: function (x) {
    var fn = this._fn;
    var xs = fn(x);

    for (var i = 0; i < xs.length; i++) {
      this._emitValue(xs[i]);
    }
  }
};
var S$17 = createStream('flatten', mixin$10);

var id$4 = function (x) {
  return x;
};

function flatten(obs) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$4;
  return new S$17(obs, {
    fn: fn
  });
}

var END_MARKER = {};
var mixin$11 = {
  _init: function (_ref) {
    var _this = this;

    var wait = _ref.wait;
    this._wait = Math.max(0, wait);
    this._buff = [];

    this._$shiftBuff = function () {
      var value = _this._buff.shift();

      if (value === END_MARKER) {
        _this._emitEnd();
      } else {
        _this._emitValue(value);
      }
    };
  },
  _free: function () {
    this._buff = null;
    this._$shiftBuff = null;
  },
  _handleValue: function (x) {
    if (this._activating) {
      this._emitValue(x);
    } else {
      this._buff.push(x);

      setTimeout(this._$shiftBuff, this._wait);
    }
  },
  _handleEnd: function () {
    if (this._activating) {
      this._emitEnd();
    } else {
      this._buff.push(END_MARKER);

      setTimeout(this._$shiftBuff, this._wait);
    }
  }
};
var S$18 = createStream('delay', mixin$11);
var P$14 = createProperty('delay', mixin$11);

function delay(obs, wait) {
  return new (obs._ofSameType(S$18, P$14))(obs, {
    wait: wait
  });
}

var now = Date.now ? function () {
  return Date.now();
} : function () {
  return new Date().getTime();
};
var mixin$12 = {
  _init: function (_ref) {
    var _this = this;

    var wait = _ref.wait,
        leading = _ref.leading,
        trailing = _ref.trailing;
    this._wait = Math.max(0, wait);
    this._leading = leading;
    this._trailing = trailing;
    this._trailingValue = null;
    this._timeoutId = null;
    this._endLater = false;
    this._lastCallTime = 0;

    this._$trailingCall = function () {
      return _this._trailingCall();
    };
  },
  _free: function () {
    this._trailingValue = null;
    this._$trailingCall = null;
  },
  _handleValue: function (x) {
    if (this._activating) {
      this._emitValue(x);
    } else {
      var curTime = now();

      if (this._lastCallTime === 0 && !this._leading) {
        this._lastCallTime = curTime;
      }

      var remaining = this._wait - (curTime - this._lastCallTime);

      if (remaining <= 0) {
        this._cancelTrailing();

        this._lastCallTime = curTime;

        this._emitValue(x);
      } else if (this._trailing) {
        this._cancelTrailing();

        this._trailingValue = x;
        this._timeoutId = setTimeout(this._$trailingCall, remaining);
      }
    }
  },
  _handleEnd: function () {
    if (this._activating) {
      this._emitEnd();
    } else {
      if (this._timeoutId) {
        this._endLater = true;
      } else {
        this._emitEnd();
      }
    }
  },
  _cancelTrailing: function () {
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  },
  _trailingCall: function () {
    this._emitValue(this._trailingValue);

    this._timeoutId = null;
    this._trailingValue = null;
    this._lastCallTime = !this._leading ? 0 : now();

    if (this._endLater) {
      this._emitEnd();
    }
  }
};
var S$19 = createStream('throttle', mixin$12);
var P$15 = createProperty('throttle', mixin$12);

function throttle(obs, wait) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$leading = _ref2.leading,
      leading = _ref2$leading === undefined ? true : _ref2$leading,
      _ref2$trailing = _ref2.trailing,
      trailing = _ref2$trailing === undefined ? true : _ref2$trailing;

  return new (obs._ofSameType(S$19, P$15))(obs, {
    wait: wait,
    leading: leading,
    trailing: trailing
  });
}

var mixin$13 = {
  _init: function (_ref) {
    var _this = this;

    var wait = _ref.wait,
        immediate = _ref.immediate;
    this._wait = Math.max(0, wait);
    this._immediate = immediate;
    this._lastAttempt = 0;
    this._timeoutId = null;
    this._laterValue = null;
    this._endLater = false;

    this._$later = function () {
      return _this._later();
    };
  },
  _free: function () {
    this._laterValue = null;
    this._$later = null;
  },
  _handleValue: function (x) {
    if (this._activating) {
      this._emitValue(x);
    } else {
      this._lastAttempt = now();

      if (this._immediate && !this._timeoutId) {
        this._emitValue(x);
      }

      if (!this._timeoutId) {
        this._timeoutId = setTimeout(this._$later, this._wait);
      }

      if (!this._immediate) {
        this._laterValue = x;
      }
    }
  },
  _handleEnd: function () {
    if (this._activating) {
      this._emitEnd();
    } else {
      if (this._timeoutId && !this._immediate) {
        this._endLater = true;
      } else {
        this._emitEnd();
      }
    }
  },
  _later: function () {
    var last = now() - this._lastAttempt;

    if (last < this._wait && last >= 0) {
      this._timeoutId = setTimeout(this._$later, this._wait - last);
    } else {
      this._timeoutId = null;

      if (!this._immediate) {
        var _laterValue = this._laterValue;
        this._laterValue = null;

        this._emitValue(_laterValue);
      }

      if (this._endLater) {
        this._emitEnd();
      }
    }
  }
};
var S$20 = createStream('debounce', mixin$13);
var P$16 = createProperty('debounce', mixin$13);

function debounce(obs, wait) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$immediate = _ref2.immediate,
      immediate = _ref2$immediate === undefined ? false : _ref2$immediate;

  return new (obs._ofSameType(S$20, P$16))(obs, {
    wait: wait,
    immediate: immediate
  });
}

var mixin$14 = {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
  },
  _free: function () {
    this._fn = null;
  },
  _handleError: function (x) {
    var fn = this._fn;

    this._emitError(fn(x));
  }
};
var S$21 = createStream('mapErrors', mixin$14);
var P$17 = createProperty('mapErrors', mixin$14);

var id$5 = function (x) {
  return x;
};

function mapErrors(obs) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$5;
  return new (obs._ofSameType(S$21, P$17))(obs, {
    fn: fn
  });
}

var mixin$15 = {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
  },
  _free: function () {
    this._fn = null;
  },
  _handleError: function (x) {
    var fn = this._fn;

    if (fn(x)) {
      this._emitError(x);
    }
  }
};
var S$22 = createStream('filterErrors', mixin$15);
var P$18 = createProperty('filterErrors', mixin$15);

var id$6 = function (x) {
  return x;
};

function filterErrors(obs) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$6;
  return new (obs._ofSameType(S$22, P$18))(obs, {
    fn: fn
  });
}

var mixin$16 = {
  _handleValue: function () {}
};
var S$23 = createStream('ignoreValues', mixin$16);
var P$19 = createProperty('ignoreValues', mixin$16);

function ignoreValues(obs) {
  return new (obs._ofSameType(S$23, P$19))(obs);
}

var mixin$17 = {
  _handleError: function () {}
};
var S$24 = createStream('ignoreErrors', mixin$17);
var P$20 = createProperty('ignoreErrors', mixin$17);

function ignoreErrors(obs) {
  return new (obs._ofSameType(S$24, P$20))(obs);
}

var mixin$18 = {
  _handleEnd: function () {}
};
var S$25 = createStream('ignoreEnd', mixin$18);
var P$21 = createProperty('ignoreEnd', mixin$18);

function ignoreEnd(obs) {
  return new (obs._ofSameType(S$25, P$21))(obs);
}

var mixin$19 = {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
  },
  _free: function () {
    this._fn = null;
  },
  _handleEnd: function () {
    var fn = this._fn;

    this._emitValue(fn());

    this._emitEnd();
  }
};
var S$26 = createStream('beforeEnd', mixin$19);
var P$22 = createProperty('beforeEnd', mixin$19);

function beforeEnd(obs, fn) {
  return new (obs._ofSameType(S$26, P$22))(obs, {
    fn: fn
  });
}

var mixin$20 = {
  _init: function (_ref) {
    var min = _ref.min,
        max = _ref.max;
    this._max = max;
    this._min = min;
    this._buff = [];
  },
  _free: function () {
    this._buff = null;
  },
  _handleValue: function (x) {
    this._buff = slide(this._buff, x, this._max);

    if (this._buff.length >= this._min) {
      this._emitValue(this._buff);
    }
  }
};
var S$27 = createStream('slidingWindow', mixin$20);
var P$23 = createProperty('slidingWindow', mixin$20);

function slidingWindow(obs, max) {
  var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return new (obs._ofSameType(S$27, P$23))(obs, {
    min: min,
    max: max
  });
}

var mixin$21 = {
  _init: function (_ref) {
    var fn = _ref.fn,
        flushOnEnd = _ref.flushOnEnd;
    this._fn = fn;
    this._flushOnEnd = flushOnEnd;
    this._buff = [];
  },
  _free: function () {
    this._buff = null;
  },
  _flush: function () {
    if (this._buff !== null && this._buff.length !== 0) {
      this._emitValue(this._buff);

      this._buff = [];
    }
  },
  _handleValue: function (x) {
    this._buff.push(x);

    var fn = this._fn;

    if (!fn(x)) {
      this._flush();
    }
  },
  _handleEnd: function () {
    if (this._flushOnEnd) {
      this._flush();
    }

    this._emitEnd();
  }
};
var S$28 = createStream('bufferWhile', mixin$21);
var P$24 = createProperty('bufferWhile', mixin$21);

var id$7 = function (x) {
  return x;
};

function bufferWhile(obs, fn) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$flushOnEnd = _ref2.flushOnEnd,
      flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;

  return new (obs._ofSameType(S$28, P$24))(obs, {
    fn: fn || id$7,
    flushOnEnd: flushOnEnd
  });
}

var mixin$22 = {
  _init: function (_ref) {
    var count = _ref.count,
        flushOnEnd = _ref.flushOnEnd;
    this._count = count;
    this._flushOnEnd = flushOnEnd;
    this._buff = [];
  },
  _free: function () {
    this._buff = null;
  },
  _flush: function () {
    if (this._buff !== null && this._buff.length !== 0) {
      this._emitValue(this._buff);

      this._buff = [];
    }
  },
  _handleValue: function (x) {
    this._buff.push(x);

    if (this._buff.length >= this._count) {
      this._flush();
    }
  },
  _handleEnd: function () {
    if (this._flushOnEnd) {
      this._flush();
    }

    this._emitEnd();
  }
};
var S$29 = createStream('bufferWithCount', mixin$22);
var P$25 = createProperty('bufferWithCount', mixin$22);

function bufferWhile$1(obs, count) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$flushOnEnd = _ref2.flushOnEnd,
      flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;

  return new (obs._ofSameType(S$29, P$25))(obs, {
    count: count,
    flushOnEnd: flushOnEnd
  });
}

var mixin$23 = {
  _init: function (_ref) {
    var _this = this;

    var wait = _ref.wait,
        count = _ref.count,
        flushOnEnd = _ref.flushOnEnd;
    this._wait = wait;
    this._count = count;
    this._flushOnEnd = flushOnEnd;
    this._intervalId = null;

    this._$onTick = function () {
      return _this._flush();
    };

    this._buff = [];
  },
  _free: function () {
    this._$onTick = null;
    this._buff = null;
  },
  _flush: function () {
    if (this._buff !== null) {
      this._emitValue(this._buff);

      this._buff = [];
    }
  },
  _handleValue: function (x) {
    this._buff.push(x);

    if (this._buff.length >= this._count) {
      clearInterval(this._intervalId);

      this._flush();

      this._intervalId = setInterval(this._$onTick, this._wait);
    }
  },
  _handleEnd: function () {
    if (this._flushOnEnd && this._buff.length !== 0) {
      this._flush();
    }

    this._emitEnd();
  },
  _onActivation: function () {
    this._intervalId = setInterval(this._$onTick, this._wait);

    this._source.onAny(this._$handleAny); // copied from patterns/one-source

  },
  _onDeactivation: function () {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }

    this._source.offAny(this._$handleAny); // copied from patterns/one-source

  }
};
var S$30 = createStream('bufferWithTimeOrCount', mixin$23);
var P$26 = createProperty('bufferWithTimeOrCount', mixin$23);

function bufferWithTimeOrCount(obs, wait, count) {
  var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref2$flushOnEnd = _ref2.flushOnEnd,
      flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;

  return new (obs._ofSameType(S$30, P$26))(obs, {
    wait: wait,
    count: count,
    flushOnEnd: flushOnEnd
  });
}

function xformForObs(obs) {
  return {
    '@@transducer/step': function (res, input) {
      obs._emitValue(input);

      return null;
    },
    '@@transducer/result': function () {
      obs._emitEnd();

      return null;
    }
  };
}

var mixin$24 = {
  _init: function (_ref) {
    var transducer = _ref.transducer;
    this._xform = transducer(xformForObs(this));
  },
  _free: function () {
    this._xform = null;
  },
  _handleValue: function (x) {
    if (this._xform['@@transducer/step'](null, x) !== null) {
      this._xform['@@transducer/result'](null);
    }
  },
  _handleEnd: function () {
    this._xform['@@transducer/result'](null);
  }
};
var S$31 = createStream('transduce', mixin$24);
var P$27 = createProperty('transduce', mixin$24);

function transduce(obs, transducer) {
  return new (obs._ofSameType(S$31, P$27))(obs, {
    transducer: transducer
  });
}

var mixin$25 = {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._handler = fn;
    this._emitter = emitter(this);
  },
  _free: function () {
    this._handler = null;
    this._emitter = null;
  },
  _handleAny: function (event) {
    this._handler(this._emitter, event);
  }
};
var S$32 = createStream('withHandler', mixin$25);
var P$28 = createProperty('withHandler', mixin$25);

function withHandler(obs, fn) {
  return new (obs._ofSameType(S$32, P$28))(obs, {
    fn: fn
  });
}

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function Zip(sources, combinator) {
  var _this = this;

  Stream.call(this);
  this._buffers = map(sources, function (source) {
    return isArray(source) ? cloneArray(source) : [];
  });
  this._sources = map(sources, function (source) {
    return isArray(source) ? never() : source;
  });
  this._combinator = combinator ? spread(combinator, this._sources.length) : function (x) {
    return x;
  };
  this._aliveCount = 0;
  this._$handlers = [];

  var _loop = function (i) {
    _this._$handlers.push(function (event) {
      return _this._handleAny(i, event);
    });
  };

  for (var i = 0; i < this._sources.length; i++) {
    _loop(i);
  }
}

inherit(Zip, Stream, {
  _name: 'zip',
  _onActivation: function () {
    // if all sources are arrays
    while (this._isFull()) {
      this._emit();
    }

    var length = this._sources.length;
    this._aliveCount = length;

    for (var i = 0; i < length && this._active; i++) {
      this._sources[i].onAny(this._$handlers[i]);
    }
  },
  _onDeactivation: function () {
    for (var i = 0; i < this._sources.length; i++) {
      this._sources[i].offAny(this._$handlers[i]);
    }
  },
  _emit: function () {
    var values = new Array(this._buffers.length);

    for (var i = 0; i < this._buffers.length; i++) {
      values[i] = this._buffers[i].shift();
    }

    var combinator = this._combinator;

    this._emitValue(combinator(values));
  },
  _isFull: function () {
    for (var i = 0; i < this._buffers.length; i++) {
      if (this._buffers[i].length === 0) {
        return false;
      }
    }

    return true;
  },
  _handleAny: function (i, event) {
    if (event.type === VALUE) {
      this._buffers[i].push(event.value);

      if (this._isFull()) {
        this._emit();
      }
    }

    if (event.type === ERROR) {
      this._emitError(event.value);
    }

    if (event.type === END) {
      this._aliveCount--;

      if (this._aliveCount === 0) {
        this._emitEnd();
      }
    }
  },
  _clear: function () {
    Stream.prototype._clear.call(this);

    this._sources = null;
    this._buffers = null;
    this._combinator = null;
    this._$handlers = null;
  }
});

function zip(observables, combinator
/* Function | falsey */
) {
  return observables.length === 0 ? never() : new Zip(observables, combinator);
}

var id$8 = function (x) {
  return x;
};

function AbstractPool() {
  var _this = this;

  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$queueLim = _ref.queueLim,
      queueLim = _ref$queueLim === undefined ? 0 : _ref$queueLim,
      _ref$concurLim = _ref.concurLim,
      concurLim = _ref$concurLim === undefined ? -1 : _ref$concurLim,
      _ref$drop = _ref.drop,
      drop = _ref$drop === undefined ? 'new' : _ref$drop;

  Stream.call(this);
  this._queueLim = queueLim < 0 ? -1 : queueLim;
  this._concurLim = concurLim < 0 ? -1 : concurLim;
  this._drop = drop;
  this._queue = [];
  this._curSources = [];

  this._$handleSubAny = function (event) {
    return _this._handleSubAny(event);
  };

  this._$endHandlers = [];
  this._currentlyAdding = null;

  if (this._concurLim === 0) {
    this._emitEnd();
  }
}

inherit(AbstractPool, Stream, {
  _name: 'abstractPool',
  _add: function (obj, toObs
  /* Function | falsey */
  ) {
    toObs = toObs || id$8;

    if (this._concurLim === -1 || this._curSources.length < this._concurLim) {
      this._addToCur(toObs(obj));
    } else {
      if (this._queueLim === -1 || this._queue.length < this._queueLim) {
        this._addToQueue(toObs(obj));
      } else if (this._drop === 'old') {
        this._removeOldest();

        this._add(obj, toObs);
      }
    }
  },
  _addAll: function (obss) {
    var _this2 = this;

    forEach(obss, function (obs) {
      return _this2._add(obs);
    });
  },
  _remove: function (obs) {
    if (this._removeCur(obs) === -1) {
      this._removeQueue(obs);
    }
  },
  _addToQueue: function (obs) {
    this._queue = concat(this._queue, [obs]);
  },
  _addToCur: function (obs) {
    if (this._active) {
      // HACK:
      //
      // We have two optimizations for cases when `obs` is ended. We don't want
      // to add such observable to the list, but only want to emit events
      // from it (if it has some).
      //
      // Instead of this hacks, we could just did following,
      // but it would be 5-8 times slower:
      //
      //     this._curSources = concat(this._curSources, [obs]);
      //     this._subscribe(obs);
      //
      // #1
      // This one for cases when `obs` already ended
      // e.g., Kefir.constant() or Kefir.never()
      if (!obs._alive) {
        if (obs._currentEvent) {
          this._emit(obs._currentEvent.type, obs._currentEvent.value);
        } // The _emit above could have caused this stream to end.


        if (this._active) {
          if (this._queue.length !== 0) {
            this._pullQueue();
          } else if (this._curSources.length === 0) {
            this._onEmpty();
          }
        }

        return;
      } // #2
      // This one is for cases when `obs` going to end synchronously on
      // first subscriber e.g., Kefir.stream(em => {em.emit(1); em.end()})


      this._currentlyAdding = obs;
      obs.onAny(this._$handleSubAny);
      this._currentlyAdding = null;

      if (obs._alive) {
        this._curSources = concat(this._curSources, [obs]);

        if (this._active) {
          this._subToEnd(obs);
        }
      } else {
        if (this._queue.length !== 0) {
          this._pullQueue();
        } else if (this._curSources.length === 0) {
          this._onEmpty();
        }
      }
    } else {
      this._curSources = concat(this._curSources, [obs]);
    }
  },
  _subToEnd: function (obs) {
    var _this3 = this;

    var onEnd = function () {
      return _this3._removeCur(obs);
    };

    this._$endHandlers.push({
      obs: obs,
      handler: onEnd
    });

    obs.onEnd(onEnd);
  },
  _subscribe: function (obs) {
    obs.onAny(this._$handleSubAny); // it can become inactive in responce of subscribing to `obs.onAny` above

    if (this._active) {
      this._subToEnd(obs);
    }
  },
  _unsubscribe: function (obs) {
    obs.offAny(this._$handleSubAny);
    var onEndI = findByPred(this._$endHandlers, function (obj) {
      return obj.obs === obs;
    });

    if (onEndI !== -1) {
      obs.offEnd(this._$endHandlers[onEndI].handler);

      this._$endHandlers.splice(onEndI, 1);
    }
  },
  _handleSubAny: function (event) {
    if (event.type === VALUE) {
      this._emitValue(event.value);
    } else if (event.type === ERROR) {
      this._emitError(event.value);
    }
  },
  _removeQueue: function (obs) {
    var index = find(this._queue, obs);
    this._queue = remove(this._queue, index);
    return index;
  },
  _removeCur: function (obs) {
    if (this._active) {
      this._unsubscribe(obs);
    }

    var index = find(this._curSources, obs);
    this._curSources = remove(this._curSources, index);

    if (index !== -1) {
      if (this._queue.length !== 0) {
        this._pullQueue();
      } else if (this._curSources.length === 0) {
        this._onEmpty();
      }
    }

    return index;
  },
  _removeOldest: function () {
    this._removeCur(this._curSources[0]);
  },
  _pullQueue: function () {
    if (this._queue.length !== 0) {
      this._queue = cloneArray(this._queue);

      this._addToCur(this._queue.shift());
    }
  },
  _onActivation: function () {
    for (var i = 0, sources = this._curSources; i < sources.length && this._active; i++) {
      this._subscribe(sources[i]);
    }
  },
  _onDeactivation: function () {
    for (var i = 0, sources = this._curSources; i < sources.length; i++) {
      this._unsubscribe(sources[i]);
    }

    if (this._currentlyAdding !== null) {
      this._unsubscribe(this._currentlyAdding);
    }
  },
  _isEmpty: function () {
    return this._curSources.length === 0;
  },
  _onEmpty: function () {},
  _clear: function () {
    Stream.prototype._clear.call(this);

    this._queue = null;
    this._curSources = null;
    this._$handleSubAny = null;
    this._$endHandlers = null;
  }
});

function Merge(sources) {
  AbstractPool.call(this);

  this._addAll(sources);

  this._initialised = true;
}

inherit(Merge, AbstractPool, {
  _name: 'merge',
  _onEmpty: function () {
    if (this._initialised) {
      this._emitEnd();
    }
  }
});

function merge(observables) {
  return observables.length === 0 ? never() : new Merge(observables);
}

function S$33(generator) {
  var _this = this;

  Stream.call(this);
  this._generator = generator;
  this._source = null;
  this._inLoop = false;
  this._iteration = 0;

  this._$handleAny = function (event) {
    return _this._handleAny(event);
  };
}

inherit(S$33, Stream, {
  _name: 'repeat',
  _handleAny: function (event) {
    if (event.type === END) {
      this._source = null;

      this._getSource();
    } else {
      this._emit(event.type, event.value);
    }
  },
  _getSource: function () {
    if (!this._inLoop) {
      this._inLoop = true;
      var generator = this._generator;

      while (this._source === null && this._alive && this._active) {
        this._source = generator(this._iteration++);

        if (this._source) {
          this._source.onAny(this._$handleAny);
        } else {
          this._emitEnd();
        }
      }

      this._inLoop = false;
    }
  },
  _onActivation: function () {
    if (this._source) {
      this._source.onAny(this._$handleAny);
    } else {
      this._getSource();
    }
  },
  _onDeactivation: function () {
    if (this._source) {
      this._source.offAny(this._$handleAny);
    }
  },
  _clear: function () {
    Stream.prototype._clear.call(this);

    this._generator = null;
    this._source = null;
    this._$handleAny = null;
  }
});

var repeat = function (generator) {
  return new S$33(generator);
};

exports.repeat = repeat;

function concat$1(observables) {
  return repeat(function (index) {
    return observables.length > index ? observables[index] : false;
  }).setName('concat');
}

function Pool() {
  AbstractPool.call(this);
}

inherit(Pool, AbstractPool, {
  _name: 'pool',
  plug: function (obs) {
    this._add(obs);

    return this;
  },
  unplug: function (obs) {
    this._remove(obs);

    return this;
  }
});

function FlatMap(source, fn, options) {
  var _this = this;

  AbstractPool.call(this, options);
  this._source = source;
  this._fn = fn;
  this._mainEnded = false;
  this._lastCurrent = null;

  this._$handleMain = function (event) {
    return _this._handleMain(event);
  };
}

inherit(FlatMap, AbstractPool, {
  _onActivation: function () {
    AbstractPool.prototype._onActivation.call(this);

    if (this._active) {
      this._source.onAny(this._$handleMain);
    }
  },
  _onDeactivation: function () {
    AbstractPool.prototype._onDeactivation.call(this);

    this._source.offAny(this._$handleMain);

    this._hadNoEvSinceDeact = true;
  },
  _handleMain: function (event) {
    if (event.type === VALUE) {
      // Is latest value before deactivation survived, and now is 'current' on this activation?
      // We don't want to handle such values, to prevent to constantly add
      // same observale on each activation/deactivation when our main source
      // is a `Kefir.conatant()` for example.
      var sameCurr = this._activating && this._hadNoEvSinceDeact && this._lastCurrent === event.value;

      if (!sameCurr) {
        this._add(event.value, this._fn);
      }

      this._lastCurrent = event.value;
      this._hadNoEvSinceDeact = false;
    }

    if (event.type === ERROR) {
      this._emitError(event.value);
    }

    if (event.type === END) {
      if (this._isEmpty()) {
        this._emitEnd();
      } else {
        this._mainEnded = true;
      }
    }
  },
  _onEmpty: function () {
    if (this._mainEnded) {
      this._emitEnd();
    }
  },
  _clear: function () {
    AbstractPool.prototype._clear.call(this);

    this._source = null;
    this._lastCurrent = null;
    this._$handleMain = null;
  }
});

function FlatMapErrors(source, fn) {
  FlatMap.call(this, source, fn);
}

inherit(FlatMapErrors, FlatMap, {
  // Same as in FlatMap, only VALUE/ERROR flipped
  _handleMain: function (event) {
    if (event.type === ERROR) {
      var sameCurr = this._activating && this._hadNoEvSinceDeact && this._lastCurrent === event.value;

      if (!sameCurr) {
        this._add(event.value, this._fn);
      }

      this._lastCurrent = event.value;
      this._hadNoEvSinceDeact = false;
    }

    if (event.type === VALUE) {
      this._emitValue(event.value);
    }

    if (event.type === END) {
      if (this._isEmpty()) {
        this._emitEnd();
      } else {
        this._mainEnded = true;
      }
    }
  }
});

function createConstructor$1(BaseClass, name) {
  return function AnonymousObservable(primary, secondary, options) {
    var _this = this;

    BaseClass.call(this);
    this._primary = primary;
    this._secondary = secondary;
    this._name = primary._name + '.' + name;
    this._lastSecondary = NOTHING;

    this._$handleSecondaryAny = function (event) {
      return _this._handleSecondaryAny(event);
    };

    this._$handlePrimaryAny = function (event) {
      return _this._handlePrimaryAny(event);
    };

    this._init(options);
  };
}

function createClassMethods$1(BaseClass) {
  return {
    _init: function () {},
    _free: function () {},
    _handlePrimaryValue: function (x) {
      this._emitValue(x);
    },
    _handlePrimaryError: function (x) {
      this._emitError(x);
    },
    _handlePrimaryEnd: function () {
      this._emitEnd();
    },
    _handleSecondaryValue: function (x) {
      this._lastSecondary = x;
    },
    _handleSecondaryError: function (x) {
      this._emitError(x);
    },
    _handleSecondaryEnd: function () {},
    _handlePrimaryAny: function (event) {
      switch (event.type) {
        case VALUE:
          return this._handlePrimaryValue(event.value);

        case ERROR:
          return this._handlePrimaryError(event.value);

        case END:
          return this._handlePrimaryEnd(event.value);
      }
    },
    _handleSecondaryAny: function (event) {
      switch (event.type) {
        case VALUE:
          return this._handleSecondaryValue(event.value);

        case ERROR:
          return this._handleSecondaryError(event.value);

        case END:
          this._handleSecondaryEnd(event.value);

          this._removeSecondary();

      }
    },
    _removeSecondary: function () {
      if (this._secondary !== null) {
        this._secondary.offAny(this._$handleSecondaryAny);

        this._$handleSecondaryAny = null;
        this._secondary = null;
      }
    },
    _onActivation: function () {
      if (this._secondary !== null) {
        this._secondary.onAny(this._$handleSecondaryAny);
      }

      if (this._active) {
        this._primary.onAny(this._$handlePrimaryAny);
      }
    },
    _onDeactivation: function () {
      if (this._secondary !== null) {
        this._secondary.offAny(this._$handleSecondaryAny);
      }

      this._primary.offAny(this._$handlePrimaryAny);
    },
    _clear: function () {
      BaseClass.prototype._clear.call(this);

      this._primary = null;
      this._secondary = null;
      this._lastSecondary = null;
      this._$handleSecondaryAny = null;
      this._$handlePrimaryAny = null;

      this._free();
    }
  };
}

function createStream$1(name, mixin) {
  var S = createConstructor$1(Stream, name);
  inherit(S, Stream, createClassMethods$1(Stream), mixin);
  return S;
}

function createProperty$1(name, mixin) {
  var P = createConstructor$1(Property, name);
  inherit(P, Property, createClassMethods$1(Property), mixin);
  return P;
}

var mixin$26 = {
  _handlePrimaryValue: function (x) {
    if (this._lastSecondary !== NOTHING && this._lastSecondary) {
      this._emitValue(x);
    }
  },
  _handleSecondaryEnd: function () {
    if (this._lastSecondary === NOTHING || !this._lastSecondary) {
      this._emitEnd();
    }
  }
};
var S$34 = createStream$1('filterBy', mixin$26);
var P$29 = createProperty$1('filterBy', mixin$26);

function filterBy(primary, secondary) {
  return new (primary._ofSameType(S$34, P$29))(primary, secondary);
}

var id2 = function (_, x) {
  return x;
};

function sampledBy(passive, active, combinator) {
  var _combinator = combinator ? function (a, b) {
    return combinator(b, a);
  } : id2;

  return combine([active], [passive], _combinator).setName(passive, 'sampledBy');
}

var mixin$27 = {
  _handlePrimaryValue: function (x) {
    if (this._lastSecondary !== NOTHING) {
      this._emitValue(x);
    }
  },
  _handleSecondaryEnd: function () {
    if (this._lastSecondary === NOTHING) {
      this._emitEnd();
    }
  }
};
var S$35 = createStream$1('skipUntilBy', mixin$27);
var P$30 = createProperty$1('skipUntilBy', mixin$27);

function skipUntilBy(primary, secondary) {
  return new (primary._ofSameType(S$35, P$30))(primary, secondary);
}

var mixin$28 = {
  _handleSecondaryValue: function () {
    this._emitEnd();
  }
};
var S$36 = createStream$1('takeUntilBy', mixin$28);
var P$31 = createProperty$1('takeUntilBy', mixin$28);

function takeUntilBy(primary, secondary) {
  return new (primary._ofSameType(S$36, P$31))(primary, secondary);
}

var mixin$29 = {
  _init: function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$flushOnEnd = _ref.flushOnEnd,
        flushOnEnd = _ref$flushOnEnd === undefined ? true : _ref$flushOnEnd;

    this._buff = [];
    this._flushOnEnd = flushOnEnd;
  },
  _free: function () {
    this._buff = null;
  },
  _flush: function () {
    if (this._buff !== null) {
      this._emitValue(this._buff);

      this._buff = [];
    }
  },
  _handlePrimaryEnd: function () {
    if (this._flushOnEnd) {
      this._flush();
    }

    this._emitEnd();
  },
  _onActivation: function () {
    this._primary.onAny(this._$handlePrimaryAny);

    if (this._alive && this._secondary !== null) {
      this._secondary.onAny(this._$handleSecondaryAny);
    }
  },
  _handlePrimaryValue: function (x) {
    this._buff.push(x);
  },
  _handleSecondaryValue: function () {
    this._flush();
  },
  _handleSecondaryEnd: function () {
    if (!this._flushOnEnd) {
      this._emitEnd();
    }
  }
};
var S$37 = createStream$1('bufferBy', mixin$29);
var P$32 = createProperty$1('bufferBy', mixin$29);

function bufferBy(primary, secondary, options
/* optional */
) {
  return new (primary._ofSameType(S$37, P$32))(primary, secondary, options);
}

var mixin$30 = {
  _init: function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$flushOnEnd = _ref.flushOnEnd,
        flushOnEnd = _ref$flushOnEnd === undefined ? true : _ref$flushOnEnd,
        _ref$flushOnChange = _ref.flushOnChange,
        flushOnChange = _ref$flushOnChange === undefined ? false : _ref$flushOnChange;

    this._buff = [];
    this._flushOnEnd = flushOnEnd;
    this._flushOnChange = flushOnChange;
  },
  _free: function () {
    this._buff = null;
  },
  _flush: function () {
    if (this._buff !== null) {
      this._emitValue(this._buff);

      this._buff = [];
    }
  },
  _handlePrimaryEnd: function () {
    if (this._flushOnEnd) {
      this._flush();
    }

    this._emitEnd();
  },
  _handlePrimaryValue: function (x) {
    this._buff.push(x);

    if (this._lastSecondary !== NOTHING && !this._lastSecondary) {
      this._flush();
    }
  },
  _handleSecondaryEnd: function () {
    if (!this._flushOnEnd && (this._lastSecondary === NOTHING || this._lastSecondary)) {
      this._emitEnd();
    }
  },
  _handleSecondaryValue: function (x) {
    if (this._flushOnChange && !x) {
      this._flush();
    } // from default _handleSecondaryValue


    this._lastSecondary = x;
  }
};
var S$38 = createStream$1('bufferWhileBy', mixin$30);
var P$33 = createProperty$1('bufferWhileBy', mixin$30);

function bufferWhileBy(primary, secondary, options
/* optional */
) {
  return new (primary._ofSameType(S$38, P$33))(primary, secondary, options);
}

var f = function () {
  return false;
};

var t = function () {
  return true;
};

function awaiting(a, b) {
  var result = merge([map$1(a, t), map$1(b, f)]);
  result = skipDuplicates(result);
  result = toProperty(result, f);
  return result.setName(a, 'awaiting');
}

var mixin$31 = {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
  },
  _free: function () {
    this._fn = null;
  },
  _handleValue: function (x) {
    var fn = this._fn;
    var result = fn(x);

    if (result.convert) {
      this._emitError(result.error);
    } else {
      this._emitValue(x);
    }
  }
};
var S$39 = createStream('valuesToErrors', mixin$31);
var P$34 = createProperty('valuesToErrors', mixin$31);

var defFn = function (x) {
  return {
    convert: true,
    error: x
  };
};

function valuesToErrors(obs) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defFn;
  return new (obs._ofSameType(S$39, P$34))(obs, {
    fn: fn
  });
}

var mixin$32 = {
  _init: function (_ref) {
    var fn = _ref.fn;
    this._fn = fn;
  },
  _free: function () {
    this._fn = null;
  },
  _handleError: function (x) {
    var fn = this._fn;
    var result = fn(x);

    if (result.convert) {
      this._emitValue(result.value);
    } else {
      this._emitError(x);
    }
  }
};
var S$40 = createStream('errorsToValues', mixin$32);
var P$35 = createProperty('errorsToValues', mixin$32);

var defFn$1 = function (x) {
  return {
    convert: true,
    value: x
  };
};

function errorsToValues(obs) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defFn$1;
  return new (obs._ofSameType(S$40, P$35))(obs, {
    fn: fn
  });
}

var mixin$33 = {
  _handleError: function (x) {
    this._emitError(x);

    this._emitEnd();
  }
};
var S$41 = createStream('endOnError', mixin$33);
var P$36 = createProperty('endOnError', mixin$33);

function endOnError(obs) {
  return new (obs._ofSameType(S$41, P$36))(obs);
} // Create a stream
// -----------------------------------------------------------------------------
// () -> Stream
// (number, any) -> Stream
// (number, any) -> Stream
// (number, Array<any>) -> Stream
// (number, Function) -> Stream
// (number, Function) -> Stream
// (Function) -> Stream
// (Function) -> Stream
// Target = {addEventListener, removeEventListener}|{addListener, removeListener}|{on, off}
// (Target, string, Function|undefined) -> Stream
// (Function) -> Stream
// Create a property
// -----------------------------------------------------------------------------
// (any) -> Property
// (any) -> Property
// Convert observables
// -----------------------------------------------------------------------------
// (Stream|Property, Function|undefined) -> Property


Observable.prototype.toProperty = function (fn) {
  return toProperty(this, fn);
}; // (Stream|Property) -> Stream


Observable.prototype.changes = function () {
  return changes(this);
}; // Interoperation with other implimentations
// -----------------------------------------------------------------------------
// (Promise) -> Property
// (Stream|Property, Function|undefined) -> Promise


Observable.prototype.toPromise = function (Promise) {
  return toPromise(this, Promise);
}; // (ESObservable) -> Stream
// (Stream|Property) -> ES7 Observable


Observable.prototype.toESObservable = toESObservable;
Observable.prototype[$$observable] = toESObservable; // Modify an observable
// -----------------------------------------------------------------------------
// (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property

Observable.prototype.map = function (fn) {
  return map$1(this, fn);
}; // (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property


Observable.prototype.filter = function (fn) {
  return filter(this, fn);
}; // (Stream, number) -> Stream
// (Property, number) -> Property


Observable.prototype.take = function (n) {
  return take(this, n);
}; // (Stream, number) -> Stream
// (Property, number) -> Property


Observable.prototype.takeErrors = function (n) {
  return takeErrors(this, n);
}; // (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property


Observable.prototype.takeWhile = function (fn) {
  return takeWhile(this, fn);
}; // (Stream) -> Stream
// (Property) -> Property


Observable.prototype.last = function () {
  return last(this);
}; // (Stream, number) -> Stream
// (Property, number) -> Property


Observable.prototype.skip = function (n) {
  return skip(this, n);
}; // (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property


Observable.prototype.skipWhile = function (fn) {
  return skipWhile(this, fn);
}; // (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property


Observable.prototype.skipDuplicates = function (fn) {
  return skipDuplicates(this, fn);
}; // (Stream, Function|falsey, any|undefined) -> Stream
// (Property, Function|falsey, any|undefined) -> Property


Observable.prototype.diff = function (fn, seed) {
  return diff(this, fn, seed);
}; // (Stream|Property, Function, any|undefined) -> Property


Observable.prototype.scan = function (fn, seed) {
  return scan(this, fn, seed);
}; // (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property


Observable.prototype.flatten = function (fn) {
  return flatten(this, fn);
}; // (Stream, number) -> Stream
// (Property, number) -> Property


Observable.prototype.delay = function (wait) {
  return delay(this, wait);
}; // Options = {leading: boolean|undefined, trailing: boolean|undefined}
// (Stream, number, Options|undefined) -> Stream
// (Property, number, Options|undefined) -> Property


Observable.prototype.throttle = function (wait, options) {
  return throttle(this, wait, options);
}; // Options = {immediate: boolean|undefined}
// (Stream, number, Options|undefined) -> Stream
// (Property, number, Options|undefined) -> Property


Observable.prototype.debounce = function (wait, options) {
  return debounce(this, wait, options);
}; // (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property


Observable.prototype.mapErrors = function (fn) {
  return mapErrors(this, fn);
}; // (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property


Observable.prototype.filterErrors = function (fn) {
  return filterErrors(this, fn);
}; // (Stream) -> Stream
// (Property) -> Property


Observable.prototype.ignoreValues = function () {
  return ignoreValues(this);
}; // (Stream) -> Stream
// (Property) -> Property


Observable.prototype.ignoreErrors = function () {
  return ignoreErrors(this);
}; // (Stream) -> Stream
// (Property) -> Property


Observable.prototype.ignoreEnd = function () {
  return ignoreEnd(this);
}; // (Stream, Function) -> Stream
// (Property, Function) -> Property


Observable.prototype.beforeEnd = function (fn) {
  return beforeEnd(this, fn);
}; // (Stream, number, number|undefined) -> Stream
// (Property, number, number|undefined) -> Property


Observable.prototype.slidingWindow = function (max, min) {
  return slidingWindow(this, max, min);
}; // Options = {flushOnEnd: boolean|undefined}
// (Stream, Function|falsey, Options|undefined) -> Stream
// (Property, Function|falsey, Options|undefined) -> Property


Observable.prototype.bufferWhile = function (fn, options) {
  return bufferWhile(this, fn, options);
}; // (Stream, number) -> Stream
// (Property, number) -> Property


Observable.prototype.bufferWithCount = function (count, options) {
  return bufferWhile$1(this, count, options);
}; // Options = {flushOnEnd: boolean|undefined}
// (Stream, number, number, Options|undefined) -> Stream
// (Property, number, number, Options|undefined) -> Property


Observable.prototype.bufferWithTimeOrCount = function (wait, count, options) {
  return bufferWithTimeOrCount(this, wait, count, options);
}; // (Stream, Function) -> Stream
// (Property, Function) -> Property


Observable.prototype.transduce = function (transducer) {
  return transduce(this, transducer);
}; // (Stream, Function) -> Stream
// (Property, Function) -> Property


Observable.prototype.withHandler = function (fn) {
  return withHandler(this, fn);
}; // (Stream, Stream -> a) -> a
// (Property, Property -> a) -> a


Observable.prototype.thru = function (fn) {
  return fn(this);
}; // Combine observables
// -----------------------------------------------------------------------------
// (Array<Stream|Property>, Function|undefiend) -> Stream
// (Array<Stream|Property>, Array<Stream|Property>, Function|undefiend) -> Stream


Observable.prototype.combine = function (other, combinator) {
  return combine([this, other], combinator);
}; // (Array<Stream|Property>, Function|undefiend) -> Stream


Observable.prototype.zip = function (other, combinator) {
  return zip([this, other], combinator);
}; // (Array<Stream|Property>) -> Stream


Observable.prototype.merge = function (other) {
  return merge([this, other]);
}; // (Array<Stream|Property>) -> Stream


Observable.prototype.concat = function (other) {
  return concat$1([this, other]);
}; // () -> Pool


var pool = function () {
  return new Pool();
}; // (Function) -> Stream
// Options = {concurLim: number|undefined, queueLim: number|undefined, drop: 'old'|'new'|undefiend}
// (Stream|Property, Function|falsey, Options|undefined) -> Stream


exports.pool = pool;

Observable.prototype.flatMap = function (fn) {
  return new FlatMap(this, fn).setName(this, 'flatMap');
};

Observable.prototype.flatMapLatest = function (fn) {
  return new FlatMap(this, fn, {
    concurLim: 1,
    drop: 'old'
  }).setName(this, 'flatMapLatest');
};

Observable.prototype.flatMapFirst = function (fn) {
  return new FlatMap(this, fn, {
    concurLim: 1
  }).setName(this, 'flatMapFirst');
};

Observable.prototype.flatMapConcat = function (fn) {
  return new FlatMap(this, fn, {
    queueLim: -1,
    concurLim: 1
  }).setName(this, 'flatMapConcat');
};

Observable.prototype.flatMapConcurLimit = function (fn, limit) {
  return new FlatMap(this, fn, {
    queueLim: -1,
    concurLim: limit
  }).setName(this, 'flatMapConcurLimit');
}; // (Stream|Property, Function|falsey) -> Stream


Observable.prototype.flatMapErrors = function (fn) {
  return new FlatMapErrors(this, fn).setName(this, 'flatMapErrors');
}; // Combine two observables
// -----------------------------------------------------------------------------
// (Stream, Stream|Property) -> Stream
// (Property, Stream|Property) -> Property


Observable.prototype.filterBy = function (other) {
  return filterBy(this, other);
}; // (Stream, Stream|Property, Function|undefiend) -> Stream
// (Property, Stream|Property, Function|undefiend) -> Property


Observable.prototype.sampledBy = function (other, combinator) {
  return sampledBy(this, other, combinator);
}; // (Stream, Stream|Property) -> Stream
// (Property, Stream|Property) -> Property


Observable.prototype.skipUntilBy = function (other) {
  return skipUntilBy(this, other);
}; // (Stream, Stream|Property) -> Stream
// (Property, Stream|Property) -> Property


Observable.prototype.takeUntilBy = function (other) {
  return takeUntilBy(this, other);
}; // Options = {flushOnEnd: boolean|undefined}
// (Stream, Stream|Property, Options|undefined) -> Stream
// (Property, Stream|Property, Options|undefined) -> Property


Observable.prototype.bufferBy = function (other, options) {
  return bufferBy(this, other, options);
}; // Options = {flushOnEnd: boolean|undefined}
// (Stream, Stream|Property, Options|undefined) -> Stream
// (Property, Stream|Property, Options|undefined) -> Property


Observable.prototype.bufferWhileBy = function (other, options) {
  return bufferWhileBy(this, other, options);
}; // Deprecated
// -----------------------------------------------------------------------------


var DEPRECATION_WARNINGS = true;

function dissableDeprecationWarnings() {
  DEPRECATION_WARNINGS = false;
}

function warn(msg) {
  if (DEPRECATION_WARNINGS && console && typeof console.warn === 'function') {
    var msg2 = '\nHere is an Error object for you containing the call stack:';
    console.warn(msg, msg2, new Error());
  }
} // (Stream|Property, Stream|Property) -> Property


Observable.prototype.awaiting = function (other) {
  warn('You are using deprecated .awaiting() method, see https://github.com/kefirjs/kefir/issues/145');
  return awaiting(this, other);
}; // (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property


Observable.prototype.valuesToErrors = function (fn) {
  warn('You are using deprecated .valuesToErrors() method, see https://github.com/kefirjs/kefir/issues/149');
  return valuesToErrors(this, fn);
}; // (Stream, Function|undefined) -> Stream
// (Property, Function|undefined) -> Property


Observable.prototype.errorsToValues = function (fn) {
  warn('You are using deprecated .errorsToValues() method, see https://github.com/kefirjs/kefir/issues/149');
  return errorsToValues(this, fn);
}; // (Stream) -> Stream
// (Property) -> Property


Observable.prototype.endOnError = function () {
  warn('You are using deprecated .endOnError() method, see https://github.com/kefirjs/kefir/issues/150');
  return endOnError(this);
}; // Exports
// --------------------------------------------------------------------------


var Kefir = {
  Observable: Observable,
  Stream: Stream,
  Property: Property,
  never: never,
  later: later,
  interval: interval,
  sequentially: sequentially,
  fromPoll: fromPoll,
  withInterval: withInterval,
  fromCallback: fromCallback,
  fromNodeCallback: fromNodeCallback,
  fromEvents: fromEvents,
  stream: stream,
  constant: constant,
  constantError: constantError,
  fromPromise: fromPromise,
  fromESObservable: fromESObservable,
  combine: combine,
  zip: zip,
  merge: merge,
  concat: concat$1,
  Pool: Pool,
  pool: pool,
  repeat: repeat,
  staticLand: staticLand
};
exports.Kefir = Kefir;
Kefir.Kefir = Kefir;
var _default = Kefir;
exports.default = _default;
},{}],"../../node_modules/jstat/dist/jstat.js":[function(require,module,exports) {
var define;
(function (window, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.jStat = factory();
    }
})(this, function () {
var jStat = (function(Math, undefined) {

// For quick reference.
var concat = Array.prototype.concat;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

// Calculate correction for IEEE error
// TODO: This calculation can be improved.
function calcRdx(n, m) {
  var val = n > m ? n : m;
  return Math.pow(10,
                  17 - ~~(Math.log(((val > 0) ? val : -val)) * Math.LOG10E));
}


var isArray = Array.isArray || function isArray(arg) {
  return toString.call(arg) === '[object Array]';
};


function isFunction(arg) {
  return toString.call(arg) === '[object Function]';
}


function isNumber(num) {
  return (typeof num === 'number') ? num - num === 0 : false;
}


// Converts the jStat matrix to vector.
function toVector(arr) {
  return concat.apply([], arr);
}


// The one and only jStat constructor.
function jStat() {
  return new jStat._init(arguments);
}


// TODO: Remove after all references in src files have been removed.
jStat.fn = jStat.prototype;


// By separating the initializer from the constructor it's easier to handle
// always returning a new instance whether "new" was used or not.
jStat._init = function _init(args) {
  // If first argument is an array, must be vector or matrix.
  if (isArray(args[0])) {
    // Check if matrix.
    if (isArray(args[0][0])) {
      // See if a mapping function was also passed.
      if (isFunction(args[1]))
        args[0] = jStat.map(args[0], args[1]);
      // Iterate over each is faster than this.push.apply(this, args[0].
      for (var i = 0; i < args[0].length; i++)
        this[i] = args[0][i];
      this.length = args[0].length;

    // Otherwise must be a vector.
    } else {
      this[0] = isFunction(args[1]) ? jStat.map(args[0], args[1]) : args[0];
      this.length = 1;
    }

  // If first argument is number, assume creation of sequence.
  } else if (isNumber(args[0])) {
    this[0] = jStat.seq.apply(null, args);
    this.length = 1;

  // Handle case when jStat object is passed to jStat.
  } else if (args[0] instanceof jStat) {
    // Duplicate the object and pass it back.
    return jStat(args[0].toArray());

  // Unexpected argument value, return empty jStat object.
  // TODO: This is strange behavior. Shouldn't this throw or some such to let
  // the user know they had bad arguments?
  } else {
    this[0] = [];
    this.length = 1;
  }

  return this;
};
jStat._init.prototype = jStat.prototype;
jStat._init.constructor = jStat;


// Utility functions.
// TODO: for internal use only?
jStat.utils = {
  calcRdx: calcRdx,
  isArray: isArray,
  isFunction: isFunction,
  isNumber: isNumber,
  toVector: toVector
};


jStat._random_fn = Math.random;
jStat.setRandom = function setRandom(fn) {
  if (typeof fn !== 'function')
    throw new TypeError('fn is not a function');
  jStat._random_fn = fn;
};


// Easily extend the jStat object.
// TODO: is this seriously necessary?
jStat.extend = function extend(obj) {
  var i, j;

  if (arguments.length === 1) {
    for (j in obj)
      jStat[j] = obj[j];
    return this;
  }

  for (i = 1; i < arguments.length; i++) {
    for (j in arguments[i])
      obj[j] = arguments[i][j];
  }

  return obj;
};


// Returns the number of rows in the matrix.
jStat.rows = function rows(arr) {
  return arr.length || 1;
};


// Returns the number of columns in the matrix.
jStat.cols = function cols(arr) {
  return arr[0].length || 1;
};


// Returns the dimensions of the object { rows: i, cols: j }
jStat.dimensions = function dimensions(arr) {
  return {
    rows: jStat.rows(arr),
    cols: jStat.cols(arr)
  };
};


// Returns a specified row as a vector or return a sub matrix by pick some rows
jStat.row = function row(arr, index) {
  if (isArray(index)) {
    return index.map(function(i) {
      return jStat.row(arr, i);
    })
  }
  return arr[index];
};


// return row as array
// rowa([[1,2],[3,4]],0) -> [1,2]
jStat.rowa = function rowa(arr, i) {
  return jStat.row(arr, i);
};


// Returns the specified column as a vector or return a sub matrix by pick some
// columns
jStat.col = function col(arr, index) {
  if (isArray(index)) {
    var submat = jStat.arange(arr.length).map(function() {
      return new Array(index.length);
    });
    index.forEach(function(ind, i){
      jStat.arange(arr.length).forEach(function(j) {
        submat[j][i] = arr[j][ind];
      });
    });
    return submat;
  }
  var column = new Array(arr.length);
  for (var i = 0; i < arr.length; i++)
    column[i] = [arr[i][index]];
  return column;
};


// return column as array
// cola([[1,2],[3,4]],0) -> [1,3]
jStat.cola = function cola(arr, i) {
  return jStat.col(arr, i).map(function(a){ return a[0] });
};


// Returns the diagonal of the matrix
jStat.diag = function diag(arr) {
  var nrow = jStat.rows(arr);
  var res = new Array(nrow);
  for (var row = 0; row < nrow; row++)
    res[row] = [arr[row][row]];
  return res;
};


// Returns the anti-diagonal of the matrix
jStat.antidiag = function antidiag(arr) {
  var nrow = jStat.rows(arr) - 1;
  var res = new Array(nrow);
  for (var i = 0; nrow >= 0; nrow--, i++)
    res[i] = [arr[i][nrow]];
  return res;
};

// Transpose a matrix or array.
jStat.transpose = function transpose(arr) {
  var obj = [];
  var objArr, rows, cols, j, i;

  // Make sure arr is in matrix format.
  if (!isArray(arr[0]))
    arr = [arr];

  rows = arr.length;
  cols = arr[0].length;

  for (i = 0; i < cols; i++) {
    objArr = new Array(rows);
    for (j = 0; j < rows; j++)
      objArr[j] = arr[j][i];
    obj.push(objArr);
  }

  // If obj is vector, return only single array.
  return obj.length === 1 ? obj[0] : obj;
};


// Map a function to an array or array of arrays.
// "toAlter" is an internal variable.
jStat.map = function map(arr, func, toAlter) {
  var row, nrow, ncol, res, col;

  if (!isArray(arr[0]))
    arr = [arr];

  nrow = arr.length;
  ncol = arr[0].length;
  res = toAlter ? arr : new Array(nrow);

  for (row = 0; row < nrow; row++) {
    // if the row doesn't exist, create it
    if (!res[row])
      res[row] = new Array(ncol);
    for (col = 0; col < ncol; col++)
      res[row][col] = func(arr[row][col], row, col);
  }

  return res.length === 1 ? res[0] : res;
};


// Cumulatively combine the elements of an array or array of arrays using a function.
jStat.cumreduce = function cumreduce(arr, func, toAlter) {
  var row, nrow, ncol, res, col;

  if (!isArray(arr[0]))
    arr = [arr];

  nrow = arr.length;
  ncol = arr[0].length;
  res = toAlter ? arr : new Array(nrow);

  for (row = 0; row < nrow; row++) {
    // if the row doesn't exist, create it
    if (!res[row])
      res[row] = new Array(ncol);
    if (ncol > 0)
      res[row][0] = arr[row][0];
    for (col = 1; col < ncol; col++)
      res[row][col] = func(res[row][col-1], arr[row][col]);
  }
  return res.length === 1 ? res[0] : res;
};


// Destructively alter an array.
jStat.alter = function alter(arr, func) {
  return jStat.map(arr, func, true);
};


// Generate a rows x cols matrix according to the supplied function.
jStat.create = function  create(rows, cols, func) {
  var res = new Array(rows);
  var i, j;

  if (isFunction(cols)) {
    func = cols;
    cols = rows;
  }

  for (i = 0; i < rows; i++) {
    res[i] = new Array(cols);
    for (j = 0; j < cols; j++)
      res[i][j] = func(i, j);
  }

  return res;
};


function retZero() { return 0; }


// Generate a rows x cols matrix of zeros.
jStat.zeros = function zeros(rows, cols) {
  if (!isNumber(cols))
    cols = rows;
  return jStat.create(rows, cols, retZero);
};


function retOne() { return 1; }


// Generate a rows x cols matrix of ones.
jStat.ones = function ones(rows, cols) {
  if (!isNumber(cols))
    cols = rows;
  return jStat.create(rows, cols, retOne);
};


// Generate a rows x cols matrix of uniformly random numbers.
jStat.rand = function rand(rows, cols) {
  if (!isNumber(cols))
    cols = rows;
  return jStat.create(rows, cols, jStat._random_fn);
};


function retIdent(i, j) { return i === j ? 1 : 0; }


// Generate an identity matrix of size row x cols.
jStat.identity = function identity(rows, cols) {
  if (!isNumber(cols))
    cols = rows;
  return jStat.create(rows, cols, retIdent);
};


// Tests whether a matrix is symmetric
jStat.symmetric = function symmetric(arr) {
  var size = arr.length;
  var row, col;

  if (arr.length !== arr[0].length)
    return false;

  for (row = 0; row < size; row++) {
    for (col = 0; col < size; col++)
      if (arr[col][row] !== arr[row][col])
        return false;
  }

  return true;
};


// Set all values to zero.
jStat.clear = function clear(arr) {
  return jStat.alter(arr, retZero);
};


// Generate sequence.
jStat.seq = function seq(min, max, length, func) {
  if (!isFunction(func))
    func = false;

  var arr = [];
  var hival = calcRdx(min, max);
  var step = (max * hival - min * hival) / ((length - 1) * hival);
  var current = min;
  var cnt;

  // Current is assigned using a technique to compensate for IEEE error.
  // TODO: Needs better implementation.
  for (cnt = 0;
       current <= max && cnt < length;
       cnt++, current = (min * hival + step * hival * cnt) / hival) {
    arr.push((func ? func(current, cnt) : current));
  }

  return arr;
};


// arange(5) -> [0,1,2,3,4]
// arange(1,5) -> [1,2,3,4]
// arange(5,1,-1) -> [5,4,3,2]
jStat.arange = function arange(start, end, step) {
  var rl = [];
  var i;
  step = step || 1;
  if (end === undefined) {
    end = start;
    start = 0;
  }
  if (start === end || step === 0) {
    return [];
  }
  if (start < end && step < 0) {
    return [];
  }
  if (start > end && step > 0) {
    return [];
  }
  if (step > 0) {
    for (i = start; i < end; i += step) {
      rl.push(i);
    }
  } else {
    for (i = start; i > end; i += step) {
      rl.push(i);
    }
  }
  return rl;
};


// A=[[1,2,3],[4,5,6],[7,8,9]]
// slice(A,{row:{end:2},col:{start:1}}) -> [[2,3],[5,6]]
// slice(A,1,{start:1}) -> [5,6]
// as numpy code A[:2,1:]
jStat.slice = (function(){
  function _slice(list, start, end, step) {
    // note it's not equal to range.map mode it's a bug
    var i;
    var rl = [];
    var length = list.length;
    if (start === undefined && end === undefined && step === undefined) {
      return jStat.copy(list);
    }

    start = start || 0;
    end = end || list.length;
    start = start >= 0 ? start : length + start;
    end = end >= 0 ? end : length + end;
    step = step || 1;
    if (start === end || step === 0) {
      return [];
    }
    if (start < end && step < 0) {
      return [];
    }
    if (start > end && step > 0) {
      return [];
    }
    if (step > 0) {
      for (i = start; i < end; i += step) {
        rl.push(list[i]);
      }
    } else {
      for (i = start; i > end;i += step) {
        rl.push(list[i]);
      }
    }
    return rl;
  }

  function slice(list, rcSlice) {
    var colSlice, rowSlice;
    rcSlice = rcSlice || {};
    if (isNumber(rcSlice.row)) {
      if (isNumber(rcSlice.col))
        return list[rcSlice.row][rcSlice.col];
      var row = jStat.rowa(list, rcSlice.row);
      colSlice = rcSlice.col || {};
      return _slice(row, colSlice.start, colSlice.end, colSlice.step);
    }

    if (isNumber(rcSlice.col)) {
      var col = jStat.cola(list, rcSlice.col);
      rowSlice = rcSlice.row || {};
      return _slice(col, rowSlice.start, rowSlice.end, rowSlice.step);
    }

    rowSlice = rcSlice.row || {};
    colSlice = rcSlice.col || {};
    var rows = _slice(list, rowSlice.start, rowSlice.end, rowSlice.step);
    return rows.map(function(row) {
      return _slice(row, colSlice.start, colSlice.end, colSlice.step);
    });
  }

  return slice;
}());


// A=[[1,2,3],[4,5,6],[7,8,9]]
// sliceAssign(A,{row:{start:1},col:{start:1}},[[0,0],[0,0]])
// A=[[1,2,3],[4,0,0],[7,0,0]]
jStat.sliceAssign = function sliceAssign(A, rcSlice, B) {
  var nl, ml;
  if (isNumber(rcSlice.row)) {
    if (isNumber(rcSlice.col))
      return A[rcSlice.row][rcSlice.col] = B;
    rcSlice.col = rcSlice.col || {};
    rcSlice.col.start = rcSlice.col.start || 0;
    rcSlice.col.end = rcSlice.col.end || A[0].length;
    rcSlice.col.step = rcSlice.col.step || 1;
    nl = jStat.arange(rcSlice.col.start,
                          Math.min(A.length, rcSlice.col.end),
                          rcSlice.col.step);
    var m = rcSlice.row;
    nl.forEach(function(n, i) {
      A[m][n] = B[i];
    });
    return A;
  }

  if (isNumber(rcSlice.col)) {
    rcSlice.row = rcSlice.row || {};
    rcSlice.row.start = rcSlice.row.start || 0;
    rcSlice.row.end = rcSlice.row.end || A.length;
    rcSlice.row.step = rcSlice.row.step || 1;
    ml = jStat.arange(rcSlice.row.start,
                          Math.min(A[0].length, rcSlice.row.end),
                          rcSlice.row.step);
    var n = rcSlice.col;
    ml.forEach(function(m, j) {
      A[m][n] = B[j];
    });
    return A;
  }

  if (B[0].length === undefined) {
    B = [B];
  }
  rcSlice.row.start = rcSlice.row.start || 0;
  rcSlice.row.end = rcSlice.row.end || A.length;
  rcSlice.row.step = rcSlice.row.step || 1;
  rcSlice.col.start = rcSlice.col.start || 0;
  rcSlice.col.end = rcSlice.col.end || A[0].length;
  rcSlice.col.step = rcSlice.col.step || 1;
  ml = jStat.arange(rcSlice.row.start,
                        Math.min(A.length, rcSlice.row.end),
                        rcSlice.row.step);
  nl = jStat.arange(rcSlice.col.start,
                        Math.min(A[0].length, rcSlice.col.end),
                        rcSlice.col.step);
  ml.forEach(function(m, i) {
    nl.forEach(function(n, j) {
      A[m][n] = B[i][j];
    });
  });
  return A;
};


// [1,2,3] ->
// [[1,0,0],[0,2,0],[0,0,3]]
jStat.diagonal = function diagonal(diagArray) {
  var mat = jStat.zeros(diagArray.length, diagArray.length);
  diagArray.forEach(function(t, i) {
    mat[i][i] = t;
  });
  return mat;
};


// return copy of A
jStat.copy = function copy(A) {
  return A.map(function(row) {
    if (isNumber(row))
      return row;
    return row.map(function(t) {
      return t;
    });
  });
};


// TODO: Go over this entire implementation. Seems a tragic waste of resources
// doing all this work. Instead, and while ugly, use new Function() to generate
// a custom function for each static method.

// Quick reference.
var jProto = jStat.prototype;

// Default length.
jProto.length = 0;

// For internal use only.
// TODO: Check if they're actually used, and if they are then rename them
// to _*
jProto.push = Array.prototype.push;
jProto.sort = Array.prototype.sort;
jProto.splice = Array.prototype.splice;
jProto.slice = Array.prototype.slice;


// Return a clean array.
jProto.toArray = function toArray() {
  return this.length > 1 ? slice.call(this) : slice.call(this)[0];
};


// Map a function to a matrix or vector.
jProto.map = function map(func, toAlter) {
  return jStat(jStat.map(this, func, toAlter));
};


// Cumulatively combine the elements of a matrix or vector using a function.
jProto.cumreduce = function cumreduce(func, toAlter) {
  return jStat(jStat.cumreduce(this, func, toAlter));
};


// Destructively alter an array.
jProto.alter = function alter(func) {
  jStat.alter(this, func);
  return this;
};


// Extend prototype with methods that have no argument.
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function(func) {
      var self = this,
      results;
      // Check for callback.
      if (func) {
        setTimeout(function() {
          func.call(self, jProto[passfunc].call(self));
        });
        return this;
      }
      results = jStat[passfunc](this);
      return isArray(results) ? jStat(results) : results;
    };
  })(funcs[i]);
})('transpose clear symmetric rows cols dimensions diag antidiag'.split(' '));


// Extend prototype with methods that have one argument.
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function(index, func) {
      var self = this;
      // check for callback
      if (func) {
        setTimeout(function() {
          func.call(self, jProto[passfunc].call(self, index));
        });
        return this;
      }
      return jStat(jStat[passfunc](this, index));
    };
  })(funcs[i]);
})('row col'.split(' '));


// Extend prototype with simple shortcut methods.
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function() {
      return jStat(jStat[passfunc].apply(null, arguments));
    };
  })(funcs[i]);
})('create zeros ones rand identity'.split(' '));


// Exposing jStat.
return jStat;

}(Math));
(function(jStat, Math) {

var isFunction = jStat.utils.isFunction;

// Ascending functions for sort
function ascNum(a, b) { return a - b; }

function clip(arg, min, max) {
  return Math.max(min, Math.min(arg, max));
}


// sum of an array
jStat.sum = function sum(arr) {
  var sum = 0;
  var i = arr.length;
  while (--i >= 0)
    sum += arr[i];
  return sum;
};


// sum squared
jStat.sumsqrd = function sumsqrd(arr) {
  var sum = 0;
  var i = arr.length;
  while (--i >= 0)
    sum += arr[i] * arr[i];
  return sum;
};


// sum of squared errors of prediction (SSE)
jStat.sumsqerr = function sumsqerr(arr) {
  var mean = jStat.mean(arr);
  var sum = 0;
  var i = arr.length;
  var tmp;
  while (--i >= 0) {
    tmp = arr[i] - mean;
    sum += tmp * tmp;
  }
  return sum;
};

// sum of an array in each row
jStat.sumrow = function sumrow(arr) {
  var sum = 0;
  var i = arr.length;
  while (--i >= 0)
    sum += arr[i];
  return sum;
};

// product of an array
jStat.product = function product(arr) {
  var prod = 1;
  var i = arr.length;
  while (--i >= 0)
    prod *= arr[i];
  return prod;
};


// minimum value of an array
jStat.min = function min(arr) {
  var low = arr[0];
  var i = 0;
  while (++i < arr.length)
    if (arr[i] < low)
      low = arr[i];
  return low;
};


// maximum value of an array
jStat.max = function max(arr) {
  var high = arr[0];
  var i = 0;
  while (++i < arr.length)
    if (arr[i] > high)
      high = arr[i];
  return high;
};


// unique values of an array
jStat.unique = function unique(arr) {
  var hash = {}, _arr = [];
  for(var i = 0; i < arr.length; i++) {
    if (!hash[arr[i]]) {
      hash[arr[i]] = true;
      _arr.push(arr[i]);
    }
  }
  return _arr;
};


// mean value of an array
jStat.mean = function mean(arr) {
  return jStat.sum(arr) / arr.length;
};


// mean squared error (MSE)
jStat.meansqerr = function meansqerr(arr) {
  return jStat.sumsqerr(arr) / arr.length;
};


// geometric mean of an array
jStat.geomean = function geomean(arr) {
  return Math.pow(jStat.product(arr), 1 / arr.length);
};


// median of an array
jStat.median = function median(arr) {
  var arrlen = arr.length;
  var _arr = arr.slice().sort(ascNum);
  // check if array is even or odd, then return the appropriate
  return !(arrlen & 1)
    ? (_arr[(arrlen / 2) - 1 ] + _arr[(arrlen / 2)]) / 2
    : _arr[(arrlen / 2) | 0 ];
};


// cumulative sum of an array
jStat.cumsum = function cumsum(arr) {
  return jStat.cumreduce(arr, function (a, b) { return a + b; });
};


// cumulative product of an array
jStat.cumprod = function cumprod(arr) {
  return jStat.cumreduce(arr, function (a, b) { return a * b; });
};


// successive differences of a sequence
jStat.diff = function diff(arr) {
  var diffs = [];
  var arrLen = arr.length;
  var i;
  for (i = 1; i < arrLen; i++)
    diffs.push(arr[i] - arr[i - 1]);
  return diffs;
};


// ranks of an array
jStat.rank = function (arr) {
  var i;
  var distinctNumbers = [];
  var numberCounts = {};
  for (i = 0; i < arr.length; i++) {
    var number = arr[i];
    if (numberCounts[number]) {
      numberCounts[number]++;
    } else {
      numberCounts[number] = 1;
      distinctNumbers.push(number);
    }
  }

  var sortedDistinctNumbers = distinctNumbers.sort(ascNum);
  var numberRanks = {};
  var currentRank = 1;
  for (i = 0; i < sortedDistinctNumbers.length; i++) {
    var number = sortedDistinctNumbers[i];
    var count = numberCounts[number];
    var first = currentRank;
    var last = currentRank + count - 1;
    var rank = (first + last) / 2;
    numberRanks[number] = rank;
    currentRank += count;
  }

  return arr.map(function (number) {
    return numberRanks[number];
  });
};


// mode of an array
// if there are multiple modes of an array, return all of them
// is this the appropriate way of handling it?
jStat.mode = function mode(arr) {
  var arrLen = arr.length;
  var _arr = arr.slice().sort(ascNum);
  var count = 1;
  var maxCount = 0;
  var numMaxCount = 0;
  var mode_arr = [];
  var i;

  for (i = 0; i < arrLen; i++) {
    if (_arr[i] === _arr[i + 1]) {
      count++;
    } else {
      if (count > maxCount) {
        mode_arr = [_arr[i]];
        maxCount = count;
        numMaxCount = 0;
      }
      // are there multiple max counts
      else if (count === maxCount) {
        mode_arr.push(_arr[i]);
        numMaxCount++;
      }
      // resetting count for new value in array
      count = 1;
    }
  }

  return numMaxCount === 0 ? mode_arr[0] : mode_arr;
};


// range of an array
jStat.range = function range(arr) {
  return jStat.max(arr) - jStat.min(arr);
};

// variance of an array
// flag = true indicates sample instead of population
jStat.variance = function variance(arr, flag) {
  return jStat.sumsqerr(arr) / (arr.length - (flag ? 1 : 0));
};

// pooled variance of an array of arrays
jStat.pooledvariance = function pooledvariance(arr) {
  var sumsqerr = arr.reduce(function (a, samples) {return a + jStat.sumsqerr(samples);}, 0);
  var count = arr.reduce(function (a, samples) {return a + samples.length;}, 0);
  return sumsqerr / (count - arr.length);
};

// deviation of an array
jStat.deviation = function (arr) {
  var mean = jStat.mean(arr);
  var arrlen = arr.length;
  var dev = new Array(arrlen);
  for (var i = 0; i < arrlen; i++) {
    dev[i] = arr[i] - mean;
  }
  return dev;
};

// standard deviation of an array
// flag = true indicates sample instead of population
jStat.stdev = function stdev(arr, flag) {
  return Math.sqrt(jStat.variance(arr, flag));
};

// pooled standard deviation of an array of arrays
jStat.pooledstdev = function pooledstdev(arr) {
  return Math.sqrt(jStat.pooledvariance(arr));
};

// mean deviation (mean absolute deviation) of an array
jStat.meandev = function meandev(arr) {
  var mean = jStat.mean(arr);
  var a = [];
  for (var i = arr.length - 1; i >= 0; i--) {
    a.push(Math.abs(arr[i] - mean));
  }
  return jStat.mean(a);
};


// median deviation (median absolute deviation) of an array
jStat.meddev = function meddev(arr) {
  var median = jStat.median(arr);
  var a = [];
  for (var i = arr.length - 1; i >= 0; i--) {
    a.push(Math.abs(arr[i] - median));
  }
  return jStat.median(a);
};


// coefficient of variation
jStat.coeffvar = function coeffvar(arr) {
  return jStat.stdev(arr) / jStat.mean(arr);
};


// quartiles of an array
jStat.quartiles = function quartiles(arr) {
  var arrlen = arr.length;
  var _arr = arr.slice().sort(ascNum);
  return [
    _arr[ Math.round((arrlen) / 4) - 1 ],
    _arr[ Math.round((arrlen) / 2) - 1 ],
    _arr[ Math.round((arrlen) * 3 / 4) - 1 ]
  ];
};


// Arbitary quantiles of an array. Direct port of the scipy.stats
// implementation by Pierre GF Gerard-Marchant.
jStat.quantiles = function quantiles(arr, quantilesArray, alphap, betap) {
  var sortedArray = arr.slice().sort(ascNum);
  var quantileVals = [quantilesArray.length];
  var n = arr.length;
  var i, p, m, aleph, k, gamma;

  if (typeof alphap === 'undefined')
    alphap = 3 / 8;
  if (typeof betap === 'undefined')
    betap = 3 / 8;

  for (i = 0; i < quantilesArray.length; i++) {
    p = quantilesArray[i];
    m = alphap + p * (1 - alphap - betap);
    aleph = n * p + m;
    k = Math.floor(clip(aleph, 1, n - 1));
    gamma = clip(aleph - k, 0, 1);
    quantileVals[i] = (1 - gamma) * sortedArray[k - 1] + gamma * sortedArray[k];
  }

  return quantileVals;
};

// Return the k-th percentile of values in a range, where k is in the range 0..1, inclusive.
// Passing true for the exclusive parameter excludes both endpoints of the range.
jStat.percentile = function percentile(arr, k, exclusive) {
  var _arr = arr.slice().sort(ascNum);
  var realIndex = k * (_arr.length + (exclusive ? 1 : -1)) + (exclusive ? 0 : 1);
  var index = parseInt(realIndex);
  var frac = realIndex - index;
  if (index + 1 < _arr.length) {
    return _arr[index - 1] + frac * (_arr[index] - _arr[index - 1]);
  } else {
    return _arr[index - 1];
  }
}

// The percentile rank of score in a given array. Returns the percentage
// of all values in the input array that are less than (kind='strict') or
// less or equal than (kind='weak') score. Default is weak.
jStat.percentileOfScore = function percentileOfScore(arr, score, kind) {
  var counter = 0;
  var len = arr.length;
  var strict = false;
  var value, i;

  if (kind === 'strict')
    strict = true;

  for (i = 0; i < len; i++) {
    value = arr[i];
    if ((strict && value < score) ||
        (!strict && value <= score)) {
      counter++;
    }
  }

  return counter / len;
};


// Histogram (bin count) data
jStat.histogram = function histogram(arr, binCnt) {
  binCnt = binCnt || 4;
  var first = jStat.min(arr);
  var binWidth = (jStat.max(arr) - first) / binCnt;
  var len = arr.length;
  var bins = [];
  var i;

  for (i = 0; i < binCnt; i++)
    bins[i] = 0;
  for (i = 0; i < len; i++)
    bins[Math.min(Math.floor(((arr[i] - first) / binWidth)), binCnt - 1)] += 1;

  return bins;
};


// covariance of two arrays
jStat.covariance = function covariance(arr1, arr2) {
  var u = jStat.mean(arr1);
  var v = jStat.mean(arr2);
  var arr1Len = arr1.length;
  var sq_dev = new Array(arr1Len);
  var i;

  for (i = 0; i < arr1Len; i++)
    sq_dev[i] = (arr1[i] - u) * (arr2[i] - v);

  return jStat.sum(sq_dev) / (arr1Len - 1);
};


// (pearson's) population correlation coefficient, rho
jStat.corrcoeff = function corrcoeff(arr1, arr2) {
  return jStat.covariance(arr1, arr2) /
      jStat.stdev(arr1, 1) /
      jStat.stdev(arr2, 1);
};

  // (spearman's) rank correlation coefficient, sp
jStat.spearmancoeff =  function (arr1, arr2) {
  arr1 = jStat.rank(arr1);
  arr2 = jStat.rank(arr2);
  //return pearson's correlation of the ranks:
  return jStat.corrcoeff(arr1, arr2);
}


// statistical standardized moments (general form of skew/kurt)
jStat.stanMoment = function stanMoment(arr, n) {
  var mu = jStat.mean(arr);
  var sigma = jStat.stdev(arr);
  var len = arr.length;
  var skewSum = 0;

  for (var i = 0; i < len; i++)
    skewSum += Math.pow((arr[i] - mu) / sigma, n);

  return skewSum / arr.length;
};

// (pearson's) moment coefficient of skewness
jStat.skewness = function skewness(arr) {
  return jStat.stanMoment(arr, 3);
};

// (pearson's) (excess) kurtosis
jStat.kurtosis = function kurtosis(arr) {
  return jStat.stanMoment(arr, 4) - 3;
};


var jProto = jStat.prototype;


// Extend jProto with method for calculating cumulative sums and products.
// This differs from the similar extension below as cumsum and cumprod should
// not be run again in the case fullbool === true.
// If a matrix is passed, automatically assume operation should be done on the
// columns.
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    // If a matrix is passed, automatically assume operation should be done on
    // the columns.
    jProto[passfunc] = function(fullbool, func) {
      var arr = [];
      var i = 0;
      var tmpthis = this;
      // Assignment reassignation depending on how parameters were passed in.
      if (isFunction(fullbool)) {
        func = fullbool;
        fullbool = false;
      }
      // Check if a callback was passed with the function.
      if (func) {
        setTimeout(function() {
          func.call(tmpthis, jProto[passfunc].call(tmpthis, fullbool));
        });
        return this;
      }
      // Check if matrix and run calculations.
      if (this.length > 1) {
        tmpthis = fullbool === true ? this : this.transpose();
        for (; i < tmpthis.length; i++)
          arr[i] = jStat[passfunc](tmpthis[i]);
        return arr;
      }
      // Pass fullbool if only vector, not a matrix. for variance and stdev.
      return jStat[passfunc](this[0], fullbool);
    };
  })(funcs[i]);
})(('cumsum cumprod').split(' '));


// Extend jProto with methods which don't require arguments and work on columns.
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    // If a matrix is passed, automatically assume operation should be done on
    // the columns.
    jProto[passfunc] = function(fullbool, func) {
      var arr = [];
      var i = 0;
      var tmpthis = this;
      // Assignment reassignation depending on how parameters were passed in.
      if (isFunction(fullbool)) {
        func = fullbool;
        fullbool = false;
      }
      // Check if a callback was passed with the function.
      if (func) {
        setTimeout(function() {
          func.call(tmpthis, jProto[passfunc].call(tmpthis, fullbool));
        });
        return this;
      }
      // Check if matrix and run calculations.
      if (this.length > 1) {
        if (passfunc !== 'sumrow')
          tmpthis = fullbool === true ? this : this.transpose();
        for (; i < tmpthis.length; i++)
          arr[i] = jStat[passfunc](tmpthis[i]);
        return fullbool === true
            ? jStat[passfunc](jStat.utils.toVector(arr))
            : arr;
      }
      // Pass fullbool if only vector, not a matrix. for variance and stdev.
      return jStat[passfunc](this[0], fullbool);
    };
  })(funcs[i]);
})(('sum sumsqrd sumsqerr sumrow product min max unique mean meansqerr ' +
    'geomean median diff rank mode range variance deviation stdev meandev ' +
    'meddev coeffvar quartiles histogram skewness kurtosis').split(' '));


// Extend jProto with functions that take arguments. Operations on matrices are
// done on columns.
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function() {
      var arr = [];
      var i = 0;
      var tmpthis = this;
      var args = Array.prototype.slice.call(arguments);
      var callbackFunction;

      // If the last argument is a function, we assume it's a callback; we
      // strip the callback out and call the function again.
      if (isFunction(args[args.length - 1])) {
        callbackFunction = args[args.length - 1];
        var argsToPass = args.slice(0, args.length - 1);

        setTimeout(function() {
          callbackFunction.call(tmpthis,
                                jProto[passfunc].apply(tmpthis, argsToPass));
        });
        return this;

      // Otherwise we curry the function args and call normally.
      } else {
        callbackFunction = undefined;
        var curriedFunction = function curriedFunction(vector) {
          return jStat[passfunc].apply(tmpthis, [vector].concat(args));
        }
      }

      // If this is a matrix, run column-by-column.
      if (this.length > 1) {
        tmpthis = tmpthis.transpose();
        for (; i < tmpthis.length; i++)
          arr[i] = curriedFunction(tmpthis[i]);
        return arr;
      }

      // Otherwise run on the vector.
      return curriedFunction(this[0]);
    };
  })(funcs[i]);
})('quantiles percentileOfScore'.split(' '));

}(jStat, Math));
// Special functions //
(function(jStat, Math) {

// Log-gamma function
jStat.gammaln = function gammaln(x) {
  var j = 0;
  var cof = [
    76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
  ];
  var ser = 1.000000000190015;
  var xx, y, tmp;
  tmp = (y = xx = x) + 5.5;
  tmp -= (xx + 0.5) * Math.log(tmp);
  for (; j < 6; j++)
    ser += cof[j] / ++y;
  return Math.log(2.5066282746310005 * ser / xx) - tmp;
};

/*
 * log-gamma function to support poisson distribution sampling. The
 * algorithm comes from SPECFUN by Shanjie Zhang and Jianming Jin and their
 * book "Computation of Special Functions", 1996, John Wiley & Sons, Inc.
 */
jStat.loggam = function loggam(x) {
  var x0, x2, xp, gl, gl0;
  var k, n;

  var a = [8.333333333333333e-02, -2.777777777777778e-03,
          7.936507936507937e-04, -5.952380952380952e-04,
          8.417508417508418e-04, -1.917526917526918e-03,
          6.410256410256410e-03, -2.955065359477124e-02,
          1.796443723688307e-01, -1.39243221690590e+00];
  x0 = x;
  n = 0;
  if ((x == 1.0) || (x == 2.0)) {
      return 0.0;
  }
  if (x <= 7.0) {
      n = Math.floor(7 - x);
      x0 = x + n;
  }
  x2 = 1.0 / (x0 * x0);
  xp = 2 * Math.PI;
  gl0 = a[9];
  for (k = 8; k >= 0; k--) {
      gl0 *= x2;
      gl0 += a[k];
  }
  gl = gl0 / x0 + 0.5 * Math.log(xp) + (x0 - 0.5) * Math.log(x0) - x0;
  if (x <= 7.0) {
      for (k = 1; k <= n; k++) {
          gl -= Math.log(x0 - 1.0);
          x0 -= 1.0;
      }
  }
  return gl;
}

// gamma of x
jStat.gammafn = function gammafn(x) {
  var p = [-1.716185138865495, 24.76565080557592, -379.80425647094563,
           629.3311553128184, 866.9662027904133, -31451.272968848367,
           -36144.413418691176, 66456.14382024054
  ];
  var q = [-30.8402300119739, 315.35062697960416, -1015.1563674902192,
           -3107.771671572311, 22538.118420980151, 4755.8462775278811,
           -134659.9598649693, -115132.2596755535];
  var fact = false;
  var n = 0;
  var xden = 0;
  var xnum = 0;
  var y = x;
  var i, z, yi, res;
  if (x > 171.6243769536076) {
    return Infinity;
  }
  if (y <= 0) {
    res = y % 1 + 3.6e-16;
    if (res) {
      fact = (!(y & 1) ? 1 : -1) * Math.PI / Math.sin(Math.PI * res);
      y = 1 - y;
    } else {
      return Infinity;
    }
  }
  yi = y;
  if (y < 1) {
    z = y++;
  } else {
    z = (y -= n = (y | 0) - 1) - 1;
  }
  for (i = 0; i < 8; ++i) {
    xnum = (xnum + p[i]) * z;
    xden = xden * z + q[i];
  }
  res = xnum / xden + 1;
  if (yi < y) {
    res /= yi;
  } else if (yi > y) {
    for (i = 0; i < n; ++i) {
      res *= y;
      y++;
    }
  }
  if (fact) {
    res = fact / res;
  }
  return res;
};


// lower incomplete gamma function, which is usually typeset with a
// lower-case greek gamma as the function symbol
jStat.gammap = function gammap(a, x) {
  return jStat.lowRegGamma(a, x) * jStat.gammafn(a);
};


// The lower regularized incomplete gamma function, usually written P(a,x)
jStat.lowRegGamma = function lowRegGamma(a, x) {
  var aln = jStat.gammaln(a);
  var ap = a;
  var sum = 1 / a;
  var del = sum;
  var b = x + 1 - a;
  var c = 1 / 1.0e-30;
  var d = 1 / b;
  var h = d;
  var i = 1;
  // calculate maximum number of itterations required for a
  var ITMAX = -~(Math.log((a >= 1) ? a : 1 / a) * 8.5 + a * 0.4 + 17);
  var an;

  if (x < 0 || a <= 0) {
    return NaN;
  } else if (x < a + 1) {
    for (; i <= ITMAX; i++) {
      sum += del *= x / ++ap;
    }
    return (sum * Math.exp(-x + a * Math.log(x) - (aln)));
  }

  for (; i <= ITMAX; i++) {
    an = -i * (i - a);
    b += 2;
    d = an * d + b;
    c = b + an / c;
    d = 1 / d;
    h *= d * c;
  }

  return (1 - h * Math.exp(-x + a * Math.log(x) - (aln)));
};

// natural log factorial of n
jStat.factorialln = function factorialln(n) {
  return n < 0 ? NaN : jStat.gammaln(n + 1);
};

// factorial of n
jStat.factorial = function factorial(n) {
  return n < 0 ? NaN : jStat.gammafn(n + 1);
};

// combinations of n, m
jStat.combination = function combination(n, m) {
  // make sure n or m don't exceed the upper limit of usable values
  return (n > 170 || m > 170)
      ? Math.exp(jStat.combinationln(n, m))
      : (jStat.factorial(n) / jStat.factorial(m)) / jStat.factorial(n - m);
};


jStat.combinationln = function combinationln(n, m){
  return jStat.factorialln(n) - jStat.factorialln(m) - jStat.factorialln(n - m);
};


// permutations of n, m
jStat.permutation = function permutation(n, m) {
  return jStat.factorial(n) / jStat.factorial(n - m);
};


// beta function
jStat.betafn = function betafn(x, y) {
  // ensure arguments are positive
  if (x <= 0 || y <= 0)
    return undefined;
  // make sure x + y doesn't exceed the upper limit of usable values
  return (x + y > 170)
      ? Math.exp(jStat.betaln(x, y))
      : jStat.gammafn(x) * jStat.gammafn(y) / jStat.gammafn(x + y);
};


// natural logarithm of beta function
jStat.betaln = function betaln(x, y) {
  return jStat.gammaln(x) + jStat.gammaln(y) - jStat.gammaln(x + y);
};


// Evaluates the continued fraction for incomplete beta function by modified
// Lentz's method.
jStat.betacf = function betacf(x, a, b) {
  var fpmin = 1e-30;
  var m = 1;
  var qab = a + b;
  var qap = a + 1;
  var qam = a - 1;
  var c = 1;
  var d = 1 - qab * x / qap;
  var m2, aa, del, h;

  // These q's will be used in factors that occur in the coefficients
  if (Math.abs(d) < fpmin)
    d = fpmin;
  d = 1 / d;
  h = d;

  for (; m <= 100; m++) {
    m2 = 2 * m;
    aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    // One step (the even one) of the recurrence
    d = 1 + aa * d;
    if (Math.abs(d) < fpmin)
      d = fpmin;
    c = 1 + aa / c;
    if (Math.abs(c) < fpmin)
      c = fpmin;
    d = 1 / d;
    h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    // Next step of the recurrence (the odd one)
    d = 1 + aa * d;
    if (Math.abs(d) < fpmin)
      d = fpmin;
    c = 1 + aa / c;
    if (Math.abs(c) < fpmin)
      c = fpmin;
    d = 1 / d;
    del = d * c;
    h *= del;
    if (Math.abs(del - 1.0) < 3e-7)
      break;
  }

  return h;
};


// Returns the inverse of the lower regularized inomplete gamma function
jStat.gammapinv = function gammapinv(p, a) {
  var j = 0;
  var a1 = a - 1;
  var EPS = 1e-8;
  var gln = jStat.gammaln(a);
  var x, err, t, u, pp, lna1, afac;

  if (p >= 1)
    return Math.max(100, a + 100 * Math.sqrt(a));
  if (p <= 0)
    return 0;
  if (a > 1) {
    lna1 = Math.log(a1);
    afac = Math.exp(a1 * (lna1 - 1) - gln);
    pp = (p < 0.5) ? p : 1 - p;
    t = Math.sqrt(-2 * Math.log(pp));
    x = (2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t;
    if (p < 0.5)
      x = -x;
    x = Math.max(1e-3,
                 a * Math.pow(1 - 1 / (9 * a) - x / (3 * Math.sqrt(a)), 3));
  } else {
    t = 1 - a * (0.253 + a * 0.12);
    if (p < t)
      x = Math.pow(p / t, 1 / a);
    else
      x = 1 - Math.log(1 - (p - t) / (1 - t));
  }

  for(; j < 12; j++) {
    if (x <= 0)
      return 0;
    err = jStat.lowRegGamma(a, x) - p;
    if (a > 1)
      t = afac * Math.exp(-(x - a1) + a1 * (Math.log(x) - lna1));
    else
      t = Math.exp(-x + a1 * Math.log(x) - gln);
    u = err / t;
    x -= (t = u / (1 - 0.5 * Math.min(1, u * ((a - 1) / x - 1))));
    if (x <= 0)
      x = 0.5 * (x + t);
    if (Math.abs(t) < EPS * x)
      break;
  }

  return x;
};


// Returns the error function erf(x)
jStat.erf = function erf(x) {
  var cof = [-1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2,
             -9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4,
             4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6,
             1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8,
             6.529054439e-9, 5.059343495e-9, -9.91364156e-10,
             -2.27365122e-10, 9.6467911e-11, 2.394038e-12,
             -6.886027e-12, 8.94487e-13, 3.13092e-13,
             -1.12708e-13, 3.81e-16, 7.106e-15,
             -1.523e-15, -9.4e-17, 1.21e-16,
             -2.8e-17];
  var j = cof.length - 1;
  var isneg = false;
  var d = 0;
  var dd = 0;
  var t, ty, tmp, res;

  if (x < 0) {
    x = -x;
    isneg = true;
  }

  t = 2 / (2 + x);
  ty = 4 * t - 2;

  for(; j > 0; j--) {
    tmp = d;
    d = ty * d - dd + cof[j];
    dd = tmp;
  }

  res = t * Math.exp(-x * x + 0.5 * (cof[0] + ty * d) - dd);
  return isneg ? res - 1 : 1 - res;
};


// Returns the complmentary error function erfc(x)
jStat.erfc = function erfc(x) {
  return 1 - jStat.erf(x);
};


// Returns the inverse of the complementary error function
jStat.erfcinv = function erfcinv(p) {
  var j = 0;
  var x, err, t, pp;
  if (p >= 2)
    return -100;
  if (p <= 0)
    return 100;
  pp = (p < 1) ? p : 2 - p;
  t = Math.sqrt(-2 * Math.log(pp / 2));
  x = -0.70711 * ((2.30753 + t * 0.27061) /
                  (1 + t * (0.99229 + t * 0.04481)) - t);
  for (; j < 2; j++) {
    err = jStat.erfc(x) - pp;
    x += err / (1.12837916709551257 * Math.exp(-x * x) - x * err);
  }
  return (p < 1) ? x : -x;
};


// Returns the inverse of the incomplete beta function
jStat.ibetainv = function ibetainv(p, a, b) {
  var EPS = 1e-8;
  var a1 = a - 1;
  var b1 = b - 1;
  var j = 0;
  var lna, lnb, pp, t, u, err, x, al, h, w, afac;
  if (p <= 0)
    return 0;
  if (p >= 1)
    return 1;
  if (a >= 1 && b >= 1) {
    pp = (p < 0.5) ? p : 1 - p;
    t = Math.sqrt(-2 * Math.log(pp));
    x = (2.30753 + t * 0.27061) / (1 + t* (0.99229 + t * 0.04481)) - t;
    if (p < 0.5)
      x = -x;
    al = (x * x - 3) / 6;
    h = 2 / (1 / (2 * a - 1)  + 1 / (2 * b - 1));
    w = (x * Math.sqrt(al + h) / h) - (1 / (2 * b - 1) - 1 / (2 * a - 1)) *
        (al + 5 / 6 - 2 / (3 * h));
    x = a / (a + b * Math.exp(2 * w));
  } else {
    lna = Math.log(a / (a + b));
    lnb = Math.log(b / (a + b));
    t = Math.exp(a * lna) / a;
    u = Math.exp(b * lnb) / b;
    w = t + u;
    if (p < t / w)
      x = Math.pow(a * w * p, 1 / a);
    else
      x = 1 - Math.pow(b * w * (1 - p), 1 / b);
  }
  afac = -jStat.gammaln(a) - jStat.gammaln(b) + jStat.gammaln(a + b);
  for(; j < 10; j++) {
    if (x === 0 || x === 1)
      return x;
    err = jStat.ibeta(x, a, b) - p;
    t = Math.exp(a1 * Math.log(x) + b1 * Math.log(1 - x) + afac);
    u = err / t;
    x -= (t = u / (1 - 0.5 * Math.min(1, u * (a1 / x - b1 / (1 - x)))));
    if (x <= 0)
      x = 0.5 * (x + t);
    if (x >= 1)
      x = 0.5 * (x + t + 1);
    if (Math.abs(t) < EPS * x && j > 0)
      break;
  }
  return x;
};


// Returns the incomplete beta function I_x(a,b)
jStat.ibeta = function ibeta(x, a, b) {
  // Factors in front of the continued fraction.
  var bt = (x === 0 || x === 1) ?  0 :
    Math.exp(jStat.gammaln(a + b) - jStat.gammaln(a) -
             jStat.gammaln(b) + a * Math.log(x) + b *
             Math.log(1 - x));
  if (x < 0 || x > 1)
    return false;
  if (x < (a + 1) / (a + b + 2))
    // Use continued fraction directly.
    return bt * jStat.betacf(x, a, b) / a;
  // else use continued fraction after making the symmetry transformation.
  return 1 - bt * jStat.betacf(1 - x, b, a) / b;
};


// Returns a normal deviate (mu=0, sigma=1).
// If n and m are specified it returns a object of normal deviates.
jStat.randn = function randn(n, m) {
  var u, v, x, y, q;
  if (!m)
    m = n;
  if (n)
    return jStat.create(n, m, function() { return jStat.randn(); });
  do {
    u = jStat._random_fn();
    v = 1.7156 * (jStat._random_fn() - 0.5);
    x = u - 0.449871;
    y = Math.abs(v) + 0.386595;
    q = x * x + y * (0.19600 * y - 0.25472 * x);
  } while (q > 0.27597 && (q > 0.27846 || v * v > -4 * Math.log(u) * u * u));
  return v / u;
};


// Returns a gamma deviate by the method of Marsaglia and Tsang.
jStat.randg = function randg(shape, n, m) {
  var oalph = shape;
  var a1, a2, u, v, x, mat;
  if (!m)
    m = n;
  if (!shape)
    shape = 1;
  if (n) {
    mat = jStat.zeros(n,m);
    mat.alter(function() { return jStat.randg(shape); });
    return mat;
  }
  if (shape < 1)
    shape += 1;
  a1 = shape - 1 / 3;
  a2 = 1 / Math.sqrt(9 * a1);
  do {
    do {
      x = jStat.randn();
      v = 1 + a2 * x;
    } while(v <= 0);
    v = v * v * v;
    u = jStat._random_fn();
  } while(u > 1 - 0.331 * Math.pow(x, 4) &&
          Math.log(u) > 0.5 * x*x + a1 * (1 - v + Math.log(v)));
  // alpha > 1
  if (shape == oalph)
    return a1 * v;
  // alpha < 1
  do {
    u = jStat._random_fn();
  } while(u === 0);
  return Math.pow(u, 1 / oalph) * a1 * v;
};


// making use of static methods on the instance
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jStat.fn[passfunc] = function() {
      return jStat(
          jStat.map(this, function(value) { return jStat[passfunc](value); }));
    }
  })(funcs[i]);
})('gammaln gammafn factorial factorialln'.split(' '));


(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jStat.fn[passfunc] = function() {
      return jStat(jStat[passfunc].apply(null, arguments));
    };
  })(funcs[i]);
})('randn'.split(' '));

}(jStat, Math));
(function(jStat, Math) {

// generate all distribution instance methods
(function(list) {
  for (var i = 0; i < list.length; i++) (function(func) {
    // distribution instance method
    jStat[func] = function f(a, b, c) {
      if (!(this instanceof f))
        return new f(a, b, c);
      this._a = a;
      this._b = b;
      this._c = c;
      return this;
    };
    // distribution method to be used on a jStat instance
    jStat.fn[func] = function(a, b, c) {
      var newthis = jStat[func](a, b, c);
      newthis.data = this;
      return newthis;
    };
    // sample instance method
    jStat[func].prototype.sample = function(arr) {
      var a = this._a;
      var b = this._b;
      var c = this._c;
      if (arr)
        return jStat.alter(arr, function() {
          return jStat[func].sample(a, b, c);
        });
      else
        return jStat[func].sample(a, b, c);
    };
    // generate the pdf, cdf and inv instance methods
    (function(vals) {
      for (var i = 0; i < vals.length; i++) (function(fnfunc) {
        jStat[func].prototype[fnfunc] = function(x) {
          var a = this._a;
          var b = this._b;
          var c = this._c;
          if (!x && x !== 0)
            x = this.data;
          if (typeof x !== 'number') {
            return jStat.fn.map.call(x, function(x) {
              return jStat[func][fnfunc](x, a, b, c);
            });
          }
          return jStat[func][fnfunc](x, a, b, c);
        };
      })(vals[i]);
    })('pdf cdf inv'.split(' '));
    // generate the mean, median, mode and variance instance methods
    (function(vals) {
      for (var i = 0; i < vals.length; i++) (function(fnfunc) {
        jStat[func].prototype[fnfunc] = function() {
          return jStat[func][fnfunc](this._a, this._b, this._c);
        };
      })(vals[i]);
    })('mean median mode variance'.split(' '));
  })(list[i]);
})((
  'beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy ' +
  'laplace lognormal noncentralt normal pareto studentt weibull uniform ' +
  'binomial negbin hypgeom poisson triangular tukey arcsine'
).split(' '));



// extend beta function with static methods
jStat.extend(jStat.beta, {
  pdf: function pdf(x, alpha, beta) {
    // PDF is zero outside the support
    if (x > 1 || x < 0)
      return 0;
    // PDF is one for the uniform case
    if (alpha == 1 && beta == 1)
      return 1;

    if (alpha < 512 && beta < 512) {
      return (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) /
          jStat.betafn(alpha, beta);
    } else {
      return Math.exp((alpha - 1) * Math.log(x) +
                      (beta - 1) * Math.log(1 - x) -
                      jStat.betaln(alpha, beta));
    }
  },

  cdf: function cdf(x, alpha, beta) {
    return (x > 1 || x < 0) ? (x > 1) * 1 : jStat.ibeta(x, alpha, beta);
  },

  inv: function inv(x, alpha, beta) {
    return jStat.ibetainv(x, alpha, beta);
  },

  mean: function mean(alpha, beta) {
    return alpha / (alpha + beta);
  },

  median: function median(alpha, beta) {
    return jStat.ibetainv(0.5, alpha, beta);
  },

  mode: function mode(alpha, beta) {
    return (alpha - 1 ) / ( alpha + beta - 2);
  },

  // return a random sample
  sample: function sample(alpha, beta) {
    var u = jStat.randg(alpha);
    return u / (u + jStat.randg(beta));
  },

  variance: function variance(alpha, beta) {
    return (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
  }
});

// extend F function with static methods
jStat.extend(jStat.centralF, {
  // This implementation of the pdf function avoids float overflow
  // See the way that R calculates this value:
  // https://svn.r-project.org/R/trunk/src/nmath/df.c
  pdf: function pdf(x, df1, df2) {
    var p, q, f;

    if (x < 0)
      return 0;

    if (df1 <= 2) {
      if (x === 0 && df1 < 2) {
        return Infinity;
      }
      if (x === 0 && df1 === 2) {
        return 1;
      }
      return (1 / jStat.betafn(df1 / 2, df2 / 2)) *
              Math.pow(df1 / df2, df1 / 2) *
              Math.pow(x, (df1/2) - 1) *
              Math.pow((1 + (df1 / df2) * x), -(df1 + df2) / 2);
    }

    p = (df1 * x) / (df2 + x * df1);
    q = df2 / (df2 + x * df1);
    f = df1 * q / 2.0;
    return f * jStat.binomial.pdf((df1 - 2) / 2, (df1 + df2 - 2) / 2, p);
  },

  cdf: function cdf(x, df1, df2) {
    if (x < 0)
      return 0;
    return jStat.ibeta((df1 * x) / (df1 * x + df2), df1 / 2, df2 / 2);
  },

  inv: function inv(x, df1, df2) {
    return df2 / (df1 * (1 / jStat.ibetainv(x, df1 / 2, df2 / 2) - 1));
  },

  mean: function mean(df1, df2) {
    return (df2 > 2) ? df2 / (df2 - 2) : undefined;
  },

  mode: function mode(df1, df2) {
    return (df1 > 2) ? (df2 * (df1 - 2)) / (df1 * (df2 + 2)) : undefined;
  },

  // return a random sample
  sample: function sample(df1, df2) {
    var x1 = jStat.randg(df1 / 2) * 2;
    var x2 = jStat.randg(df2 / 2) * 2;
    return (x1 / df1) / (x2 / df2);
  },

  variance: function variance(df1, df2) {
    if (df2 <= 4)
      return undefined;
    return 2 * df2 * df2 * (df1 + df2 - 2) /
        (df1 * (df2 - 2) * (df2 - 2) * (df2 - 4));
  }
});


// extend cauchy function with static methods
jStat.extend(jStat.cauchy, {
  pdf: function pdf(x, local, scale) {
    if (scale < 0) { return 0; }

    return (scale / (Math.pow(x - local, 2) + Math.pow(scale, 2))) / Math.PI;
  },

  cdf: function cdf(x, local, scale) {
    return Math.atan((x - local) / scale) / Math.PI + 0.5;
  },

  inv: function(p, local, scale) {
    return local + scale * Math.tan(Math.PI * (p - 0.5));
  },

  median: function median(local/*, scale*/) {
    return local;
  },

  mode: function mode(local/*, scale*/) {
    return local;
  },

  sample: function sample(local, scale) {
    return jStat.randn() *
        Math.sqrt(1 / (2 * jStat.randg(0.5))) * scale + local;
  }
});



// extend chisquare function with static methods
jStat.extend(jStat.chisquare, {
  pdf: function pdf(x, dof) {
    if (x < 0)
      return 0;
    return (x === 0 && dof === 2) ? 0.5 :
        Math.exp((dof / 2 - 1) * Math.log(x) - x / 2 - (dof / 2) *
                 Math.log(2) - jStat.gammaln(dof / 2));
  },

  cdf: function cdf(x, dof) {
    if (x < 0)
      return 0;
    return jStat.lowRegGamma(dof / 2, x / 2);
  },

  inv: function(p, dof) {
    return 2 * jStat.gammapinv(p, 0.5 * dof);
  },

  mean : function(dof) {
    return dof;
  },

  // TODO: this is an approximation (is there a better way?)
  median: function median(dof) {
    return dof * Math.pow(1 - (2 / (9 * dof)), 3);
  },

  mode: function mode(dof) {
    return (dof - 2 > 0) ? dof - 2 : 0;
  },

  sample: function sample(dof) {
    return jStat.randg(dof / 2) * 2;
  },

  variance: function variance(dof) {
    return 2 * dof;
  }
});



// extend exponential function with static methods
jStat.extend(jStat.exponential, {
  pdf: function pdf(x, rate) {
    return x < 0 ? 0 : rate * Math.exp(-rate * x);
  },

  cdf: function cdf(x, rate) {
    return x < 0 ? 0 : 1 - Math.exp(-rate * x);
  },

  inv: function(p, rate) {
    return -Math.log(1 - p) / rate;
  },

  mean : function(rate) {
    return 1 / rate;
  },

  median: function (rate) {
    return (1 / rate) * Math.log(2);
  },

  mode: function mode(/*rate*/) {
    return 0;
  },

  sample: function sample(rate) {
    return -1 / rate * Math.log(jStat._random_fn());
  },

  variance : function(rate) {
    return Math.pow(rate, -2);
  }
});



// extend gamma function with static methods
jStat.extend(jStat.gamma, {
  pdf: function pdf(x, shape, scale) {
    if (x < 0)
      return 0;
    return (x === 0 && shape === 1) ? 1 / scale :
            Math.exp((shape - 1) * Math.log(x) - x / scale -
                    jStat.gammaln(shape) - shape * Math.log(scale));
  },

  cdf: function cdf(x, shape, scale) {
    if (x < 0)
      return 0;
    return jStat.lowRegGamma(shape, x / scale);
  },

  inv: function(p, shape, scale) {
    return jStat.gammapinv(p, shape) * scale;
  },

  mean : function(shape, scale) {
    return shape * scale;
  },

  mode: function mode(shape, scale) {
    if(shape > 1) return (shape - 1) * scale;
    return undefined;
  },

  sample: function sample(shape, scale) {
    return jStat.randg(shape) * scale;
  },

  variance: function variance(shape, scale) {
    return shape * scale * scale;
  }
});

// extend inverse gamma function with static methods
jStat.extend(jStat.invgamma, {
  pdf: function pdf(x, shape, scale) {
    if (x <= 0)
      return 0;
    return Math.exp(-(shape + 1) * Math.log(x) - scale / x -
                    jStat.gammaln(shape) + shape * Math.log(scale));
  },

  cdf: function cdf(x, shape, scale) {
    if (x <= 0)
      return 0;
    return 1 - jStat.lowRegGamma(shape, scale / x);
  },

  inv: function(p, shape, scale) {
    return scale / jStat.gammapinv(1 - p, shape);
  },

  mean : function(shape, scale) {
    return (shape > 1) ? scale / (shape - 1) : undefined;
  },

  mode: function mode(shape, scale) {
    return scale / (shape + 1);
  },

  sample: function sample(shape, scale) {
    return scale / jStat.randg(shape);
  },

  variance: function variance(shape, scale) {
    if (shape <= 2)
      return undefined;
    return scale * scale / ((shape - 1) * (shape - 1) * (shape - 2));
  }
});


// extend kumaraswamy function with static methods
jStat.extend(jStat.kumaraswamy, {
  pdf: function pdf(x, alpha, beta) {
    if (x === 0 && alpha === 1)
      return beta;
    else if (x === 1 && beta === 1)
      return alpha;
    return Math.exp(Math.log(alpha) + Math.log(beta) + (alpha - 1) *
                    Math.log(x) + (beta - 1) *
                    Math.log(1 - Math.pow(x, alpha)));
  },

  cdf: function cdf(x, alpha, beta) {
    if (x < 0)
      return 0;
    else if (x > 1)
      return 1;
    return (1 - Math.pow(1 - Math.pow(x, alpha), beta));
  },

  inv: function inv(p, alpha, beta) {
    return Math.pow(1 - Math.pow(1 - p, 1 / beta), 1 / alpha);
  },

  mean : function(alpha, beta) {
    return (beta * jStat.gammafn(1 + 1 / alpha) *
            jStat.gammafn(beta)) / (jStat.gammafn(1 + 1 / alpha + beta));
  },

  median: function median(alpha, beta) {
    return Math.pow(1 - Math.pow(2, -1 / beta), 1 / alpha);
  },

  mode: function mode(alpha, beta) {
    if (!(alpha >= 1 && beta >= 1 && (alpha !== 1 && beta !== 1)))
      return undefined;
    return Math.pow((alpha - 1) / (alpha * beta - 1), 1 / alpha);
  },

  variance: function variance(/*alpha, beta*/) {
    throw new Error('variance not yet implemented');
    // TODO: complete this
  }
});



// extend lognormal function with static methods
jStat.extend(jStat.lognormal, {
  pdf: function pdf(x, mu, sigma) {
    if (x <= 0)
      return 0;
    return Math.exp(-Math.log(x) - 0.5 * Math.log(2 * Math.PI) -
                    Math.log(sigma) - Math.pow(Math.log(x) - mu, 2) /
                    (2 * sigma * sigma));
  },

  cdf: function cdf(x, mu, sigma) {
    if (x < 0)
      return 0;
    return 0.5 +
        (0.5 * jStat.erf((Math.log(x) - mu) / Math.sqrt(2 * sigma * sigma)));
  },

  inv: function(p, mu, sigma) {
    return Math.exp(-1.41421356237309505 * sigma * jStat.erfcinv(2 * p) + mu);
  },

  mean: function mean(mu, sigma) {
    return Math.exp(mu + sigma * sigma / 2);
  },

  median: function median(mu/*, sigma*/) {
    return Math.exp(mu);
  },

  mode: function mode(mu, sigma) {
    return Math.exp(mu - sigma * sigma);
  },

  sample: function sample(mu, sigma) {
    return Math.exp(jStat.randn() * sigma + mu);
  },

  variance: function variance(mu, sigma) {
    return (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma);
  }
});



// extend noncentralt function with static methods
jStat.extend(jStat.noncentralt, {
  pdf: function pdf(x, dof, ncp) {
    var tol = 1e-14;
    if (Math.abs(ncp) < tol)  // ncp approx 0; use student-t
      return jStat.studentt.pdf(x, dof)

    if (Math.abs(x) < tol) {  // different formula for x == 0
      return Math.exp(jStat.gammaln((dof + 1) / 2) - ncp * ncp / 2 -
                      0.5 * Math.log(Math.PI * dof) - jStat.gammaln(dof / 2));
    }

    // formula for x != 0
    return dof / x *
        (jStat.noncentralt.cdf(x * Math.sqrt(1 + 2 / dof), dof+2, ncp) -
         jStat.noncentralt.cdf(x, dof, ncp));
  },

  cdf: function cdf(x, dof, ncp) {
    var tol = 1e-14;
    var min_iterations = 200;

    if (Math.abs(ncp) < tol)  // ncp approx 0; use student-t
      return jStat.studentt.cdf(x, dof);

    // turn negative x into positive and flip result afterwards
    var flip = false;
    if (x < 0) {
      flip = true;
      ncp = -ncp;
    }

    var prob = jStat.normal.cdf(-ncp, 0, 1);
    var value = tol + 1;
    // use value at last two steps to determine convergence
    var lastvalue = value;
    var y = x * x / (x * x + dof);
    var j = 0;
    var p = Math.exp(-ncp * ncp / 2);
    var q = Math.exp(-ncp * ncp / 2 - 0.5 * Math.log(2) -
                     jStat.gammaln(3 / 2)) * ncp;
    while (j < min_iterations || lastvalue > tol || value > tol) {
      lastvalue = value;
      if (j > 0) {
        p *= (ncp * ncp) / (2 * j);
        q *= (ncp * ncp) / (2 * (j + 1 / 2));
      }
      value = p * jStat.beta.cdf(y, j + 0.5, dof / 2) +
          q * jStat.beta.cdf(y, j+1, dof/2);
      prob += 0.5 * value;
      j++;
    }

    return flip ? (1 - prob) : prob;
  }
});


// extend normal function with static methods
jStat.extend(jStat.normal, {
  pdf: function pdf(x, mean, std) {
    return Math.exp(-0.5 * Math.log(2 * Math.PI) -
                    Math.log(std) - Math.pow(x - mean, 2) / (2 * std * std));
  },

  cdf: function cdf(x, mean, std) {
    return 0.5 * (1 + jStat.erf((x - mean) / Math.sqrt(2 * std * std)));
  },

  inv: function(p, mean, std) {
    return -1.41421356237309505 * std * jStat.erfcinv(2 * p) + mean;
  },

  mean : function(mean/*, std*/) {
    return mean;
  },

  median: function median(mean/*, std*/) {
    return mean;
  },

  mode: function (mean/*, std*/) {
    return mean;
  },

  sample: function sample(mean, std) {
    return jStat.randn() * std + mean;
  },

  variance : function(mean, std) {
    return std * std;
  }
});



// extend pareto function with static methods
jStat.extend(jStat.pareto, {
  pdf: function pdf(x, scale, shape) {
    if (x < scale)
      return 0;
    return (shape * Math.pow(scale, shape)) / Math.pow(x, shape + 1);
  },

  cdf: function cdf(x, scale, shape) {
    if (x < scale)
      return 0;
    return 1 - Math.pow(scale / x, shape);
  },

  inv: function inv(p, scale, shape) {
    return scale / Math.pow(1 - p, 1 / shape);
  },

  mean: function mean(scale, shape) {
    if (shape <= 1)
      return undefined;
    return (shape * Math.pow(scale, shape)) / (shape - 1);
  },

  median: function median(scale, shape) {
    return scale * (shape * Math.SQRT2);
  },

  mode: function mode(scale/*, shape*/) {
    return scale;
  },

  variance : function(scale, shape) {
    if (shape <= 2)
      return undefined;
    return (scale*scale * shape) / (Math.pow(shape - 1, 2) * (shape - 2));
  }
});



// extend studentt function with static methods
jStat.extend(jStat.studentt, {
  pdf: function pdf(x, dof) {
    dof = dof > 1e100 ? 1e100 : dof;
    return (1/(Math.sqrt(dof) * jStat.betafn(0.5, dof/2))) *
        Math.pow(1 + ((x * x) / dof), -((dof + 1) / 2));
  },

  cdf: function cdf(x, dof) {
    var dof2 = dof / 2;
    return jStat.ibeta((x + Math.sqrt(x * x + dof)) /
                       (2 * Math.sqrt(x * x + dof)), dof2, dof2);
  },

  inv: function(p, dof) {
    var x = jStat.ibetainv(2 * Math.min(p, 1 - p), 0.5 * dof, 0.5);
    x = Math.sqrt(dof * (1 - x) / x);
    return (p > 0.5) ? x : -x;
  },

  mean: function mean(dof) {
    return (dof > 1) ? 0 : undefined;
  },

  median: function median(/*dof*/) {
    return 0;
  },

  mode: function mode(/*dof*/) {
    return 0;
  },

  sample: function sample(dof) {
    return jStat.randn() * Math.sqrt(dof / (2 * jStat.randg(dof / 2)));
  },

  variance: function variance(dof) {
    return (dof  > 2) ? dof / (dof - 2) : (dof > 1) ? Infinity : undefined;
  }
});



// extend weibull function with static methods
jStat.extend(jStat.weibull, {
  pdf: function pdf(x, scale, shape) {
    if (x < 0 || scale < 0 || shape < 0)
      return 0;
    return (shape / scale) * Math.pow((x / scale), (shape - 1)) *
        Math.exp(-(Math.pow((x / scale), shape)));
  },

  cdf: function cdf(x, scale, shape) {
    return x < 0 ? 0 : 1 - Math.exp(-Math.pow((x / scale), shape));
  },

  inv: function(p, scale, shape) {
    return scale * Math.pow(-Math.log(1 - p), 1 / shape);
  },

  mean : function(scale, shape) {
    return scale * jStat.gammafn(1 + 1 / shape);
  },

  median: function median(scale, shape) {
    return scale * Math.pow(Math.log(2), 1 / shape);
  },

  mode: function mode(scale, shape) {
    if (shape <= 1)
      return 0;
    return scale * Math.pow((shape - 1) / shape, 1 / shape);
  },

  sample: function sample(scale, shape) {
    return scale * Math.pow(-Math.log(jStat._random_fn()), 1 / shape);
  },

  variance: function variance(scale, shape) {
    return scale * scale * jStat.gammafn(1 + 2 / shape) -
        Math.pow(jStat.weibull.mean(scale, shape), 2);
  }
});



// extend uniform function with static methods
jStat.extend(jStat.uniform, {
  pdf: function pdf(x, a, b) {
    return (x < a || x > b) ? 0 : 1 / (b - a);
  },

  cdf: function cdf(x, a, b) {
    if (x < a)
      return 0;
    else if (x < b)
      return (x - a) / (b - a);
    return 1;
  },

  inv: function(p, a, b) {
    return a + (p * (b - a));
  },

  mean: function mean(a, b) {
    return 0.5 * (a + b);
  },

  median: function median(a, b) {
    return jStat.mean(a, b);
  },

  mode: function mode(/*a, b*/) {
    throw new Error('mode is not yet implemented');
  },

  sample: function sample(a, b) {
    return (a / 2 + b / 2) + (b / 2 - a / 2) * (2 * jStat._random_fn() - 1);
  },

  variance: function variance(a, b) {
    return Math.pow(b - a, 2) / 12;
  }
});


// Got this from http://www.math.ucla.edu/~tom/distributions/binomial.html
function betinc(x, a, b, eps) {
  var a0 = 0;
  var b0 = 1;
  var a1 = 1;
  var b1 = 1;
  var m9 = 0;
  var a2 = 0;
  var c9;

  while (Math.abs((a1 - a2) / a1) > eps) {
    a2 = a1;
    c9 = -(a + m9) * (a + b + m9) * x / (a + 2 * m9) / (a + 2 * m9 + 1);
    a0 = a1 + c9 * a0;
    b0 = b1 + c9 * b0;
    m9 = m9 + 1;
    c9 = m9 * (b - m9) * x / (a + 2 * m9 - 1) / (a + 2 * m9);
    a1 = a0 + c9 * a1;
    b1 = b0 + c9 * b1;
    a0 = a0 / b1;
    b0 = b0 / b1;
    a1 = a1 / b1;
    b1 = 1;
  }

  return a1 / a;
}


// extend uniform function with static methods
jStat.extend(jStat.binomial, {
  pdf: function pdf(k, n, p) {
    return (p === 0 || p === 1) ?
      ((n * p) === k ? 1 : 0) :
      jStat.combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  },

  cdf: function cdf(x, n, p) {
    var betacdf;
    var eps = 1e-10;

    if (x < 0)
      return 0;
    if (x >= n)
      return 1;
    if (p < 0 || p > 1 || n <= 0)
      return NaN;

    x = Math.floor(x);
    var z = p;
    var a = x + 1;
    var b = n - x;
    var s = a + b;
    var bt = Math.exp(jStat.gammaln(s) - jStat.gammaln(b) -
                      jStat.gammaln(a) + a * Math.log(z) + b * Math.log(1 - z));

    if (z < (a + 1) / (s + 2))
      betacdf = bt * betinc(z, a, b, eps);
    else
      betacdf = 1 - bt * betinc(1 - z, b, a, eps);

    return Math.round((1 - betacdf) * (1 / eps)) / (1 / eps);
  }
});



// extend uniform function with static methods
jStat.extend(jStat.negbin, {
  pdf: function pdf(k, r, p) {
    if (k !== k >>> 0)
      return false;
    if (k < 0)
      return 0;
    return jStat.combination(k + r - 1, r - 1) *
        Math.pow(1 - p, k) * Math.pow(p, r);
  },

  cdf: function cdf(x, r, p) {
    var sum = 0,
    k = 0;
    if (x < 0) return 0;
    for (; k <= x; k++) {
      sum += jStat.negbin.pdf(k, r, p);
    }
    return sum;
  }
});



// extend uniform function with static methods
jStat.extend(jStat.hypgeom, {
  pdf: function pdf(k, N, m, n) {
    // Hypergeometric PDF.

    // A simplification of the CDF algorithm below.

    // k = number of successes drawn
    // N = population size
    // m = number of successes in population
    // n = number of items drawn from population

    if(k !== k | 0) {
      return false;
    } else if(k < 0 || k < m - (N - n)) {
      // It's impossible to have this few successes drawn.
      return 0;
    } else if(k > n || k > m) {
      // It's impossible to have this many successes drawn.
      return 0;
    } else if (m * 2 > N) {
      // More than half the population is successes.

      if(n * 2 > N) {
        // More than half the population is sampled.

        return jStat.hypgeom.pdf(N - m - n + k, N, N - m, N - n)
      } else {
        // Half or less of the population is sampled.

        return jStat.hypgeom.pdf(n - k, N, N - m, n);
      }

    } else if(n * 2 > N) {
      // Half or less is successes.

      return jStat.hypgeom.pdf(m - k, N, m, N - n);

    } else if(m < n) {
      // We want to have the number of things sampled to be less than the
      // successes available. So swap the definitions of successful and sampled.
      return jStat.hypgeom.pdf(k, N, n, m);
    } else {
      // If we get here, half or less of the population was sampled, half or
      // less of it was successes, and we had fewer sampled things than
      // successes. Now we can do this complicated iterative algorithm in an
      // efficient way.

      // The basic premise of the algorithm is that we partially normalize our
      // intermediate product to keep it in a numerically good region, and then
      // finish the normalization at the end.

      // This variable holds the scaled probability of the current number of
      // successes.
      var scaledPDF = 1;

      // This keeps track of how much we have normalized.
      var samplesDone = 0;

      for(var i = 0; i < k; i++) {
        // For every possible number of successes up to that observed...

        while(scaledPDF > 1 && samplesDone < n) {
          // Intermediate result is growing too big. Apply some of the
          // normalization to shrink everything.

          scaledPDF *= 1 - (m / (N - samplesDone));

          // Say we've normalized by this sample already.
          samplesDone++;
        }

        // Work out the partially-normalized hypergeometric PDF for the next
        // number of successes
        scaledPDF *= (n - i) * (m - i) / ((i + 1) * (N - m - n + i + 1));
      }

      for(; samplesDone < n; samplesDone++) {
        // Apply all the rest of the normalization
        scaledPDF *= 1 - (m / (N - samplesDone));
      }

      // Bound answer sanely before returning.
      return Math.min(1, Math.max(0, scaledPDF));
    }
  },

  cdf: function cdf(x, N, m, n) {
    // Hypergeometric CDF.

    // This algorithm is due to Prof. Thomas S. Ferguson, <tom@math.ucla.edu>,
    // and comes from his hypergeometric test calculator at
    // <http://www.math.ucla.edu/~tom/distributions/Hypergeometric.html>.

    // x = number of successes drawn
    // N = population size
    // m = number of successes in population
    // n = number of items drawn from population

    if(x < 0 || x < m - (N - n)) {
      // It's impossible to have this few successes drawn or fewer.
      return 0;
    } else if(x >= n || x >= m) {
      // We will always have this many successes or fewer.
      return 1;
    } else if (m * 2 > N) {
      // More than half the population is successes.

      if(n * 2 > N) {
        // More than half the population is sampled.

        return jStat.hypgeom.cdf(N - m - n + x, N, N - m, N - n)
      } else {
        // Half or less of the population is sampled.

        return 1 - jStat.hypgeom.cdf(n - x - 1, N, N - m, n);
      }

    } else if(n * 2 > N) {
      // Half or less is successes.

      return 1 - jStat.hypgeom.cdf(m - x - 1, N, m, N - n);

    } else if(m < n) {
      // We want to have the number of things sampled to be less than the
      // successes available. So swap the definitions of successful and sampled.
      return jStat.hypgeom.cdf(x, N, n, m);
    } else {
      // If we get here, half or less of the population was sampled, half or
      // less of it was successes, and we had fewer sampled things than
      // successes. Now we can do this complicated iterative algorithm in an
      // efficient way.

      // The basic premise of the algorithm is that we partially normalize our
      // intermediate sum to keep it in a numerically good region, and then
      // finish the normalization at the end.

      // Holds the intermediate, scaled total CDF.
      var scaledCDF = 1;

      // This variable holds the scaled probability of the current number of
      // successes.
      var scaledPDF = 1;

      // This keeps track of how much we have normalized.
      var samplesDone = 0;

      for(var i = 0; i < x; i++) {
        // For every possible number of successes up to that observed...

        while(scaledCDF > 1 && samplesDone < n) {
          // Intermediate result is growing too big. Apply some of the
          // normalization to shrink everything.

          var factor = 1 - (m / (N - samplesDone));

          scaledPDF *= factor;
          scaledCDF *= factor;

          // Say we've normalized by this sample already.
          samplesDone++;
        }

        // Work out the partially-normalized hypergeometric PDF for the next
        // number of successes
        scaledPDF *= (n - i) * (m - i) / ((i + 1) * (N - m - n + i + 1));

        // Add to the CDF answer.
        scaledCDF += scaledPDF;
      }

      for(; samplesDone < n; samplesDone++) {
        // Apply all the rest of the normalization
        scaledCDF *= 1 - (m / (N - samplesDone));
      }

      // Bound answer sanely before returning.
      return Math.min(1, Math.max(0, scaledCDF));
    }
  }
});



// extend uniform function with static methods
jStat.extend(jStat.poisson, {
  pdf: function pdf(k, l) {
    if (l < 0 || (k % 1) !== 0 || k < 0) {
      return 0;
    }

    return Math.pow(l, k) * Math.exp(-l) / jStat.factorial(k);
  },

  cdf: function cdf(x, l) {
    var sumarr = [],
    k = 0;
    if (x < 0) return 0;
    for (; k <= x; k++) {
      sumarr.push(jStat.poisson.pdf(k, l));
    }
    return jStat.sum(sumarr);
  },

  mean : function(l) {
    return l;
  },

  variance : function(l) {
    return l;
  },

  sampleSmall: function sampleSmall(l) {
    var p = 1, k = 0, L = Math.exp(-l);
    do {
      k++;
      p *= jStat._random_fn();
    } while (p > L);
    return k - 1;
  },

  sampleLarge: function sampleLarge(l) {
    var lam = l;
    var k;
    var U, V, slam, loglam, a, b, invalpha, vr, us;

    slam = Math.sqrt(lam);
    loglam = Math.log(lam);
    b = 0.931 + 2.53 * slam;
    a = -0.059 + 0.02483 * b;
    invalpha = 1.1239 + 1.1328 / (b - 3.4);
    vr = 0.9277 - 3.6224 / (b - 2);

    while (1) {
      U = Math.random() - 0.5;
      V = Math.random();
      us = 0.5 - Math.abs(U);
      k = Math.floor((2 * a / us + b) * U + lam + 0.43);
      if ((us >= 0.07) && (V <= vr)) {
          return k;
      }
      if ((k < 0) || ((us < 0.013) && (V > us))) {
          continue;
      }
      /* log(V) == log(0.0) ok here */
      /* if U==0.0 so that us==0.0, log is ok since always returns */
      if ((Math.log(V) + Math.log(invalpha) - Math.log(a / (us * us) + b)) <= (-lam + k * loglam - jStat.loggam(k + 1))) {
          return k;
      }
    }
  },

  sample: function sample(l) {
    if (l < 10)
      return this.sampleSmall(l);
    else
      return this.sampleLarge(l);
  }
});

// extend triangular function with static methods
jStat.extend(jStat.triangular, {
  pdf: function pdf(x, a, b, c) {
    if (b <= a || c < a || c > b) {
      return NaN;
    } else {
      if (x < a || x > b) {
        return 0;
      } else if (x < c) {
          return (2 * (x - a)) / ((b - a) * (c - a));
      } else if (x === c) {
          return (2 / (b - a));
      } else { // x > c
          return (2 * (b - x)) / ((b - a) * (b - c));
      }
    }
  },

  cdf: function cdf(x, a, b, c) {
    if (b <= a || c < a || c > b)
      return NaN;
    if (x <= a)
      return 0;
    else if (x >= b)
      return 1;
    if (x <= c)
      return Math.pow(x - a, 2) / ((b - a) * (c - a));
    else // x > c
      return 1 - Math.pow(b - x, 2) / ((b - a) * (b - c));
  },

  inv: function inv(p, a, b, c) {
    if (b <= a || c < a || c > b) {
      return NaN;
    } else {
      if (p <= ((c - a) / (b - a))) {
        return a + (b - a) * Math.sqrt(p * ((c - a) / (b - a)));
      } else { // p > ((c - a) / (b - a))
        return a + (b - a) * (1 - Math.sqrt((1 - p) * (1 - ((c - a) / (b - a)))));
      }
    }
  },

  mean: function mean(a, b, c) {
    return (a + b + c) / 3;
  },

  median: function median(a, b, c) {
    if (c <= (a + b) / 2) {
      return b - Math.sqrt((b - a) * (b - c)) / Math.sqrt(2);
    } else if (c > (a + b) / 2) {
      return a + Math.sqrt((b - a) * (c - a)) / Math.sqrt(2);
    }
  },

  mode: function mode(a, b, c) {
    return c;
  },

  sample: function sample(a, b, c) {
    var u = jStat._random_fn();
    if (u < ((c - a) / (b - a)))
      return a + Math.sqrt(u * (b - a) * (c - a))
    return b - Math.sqrt((1 - u) * (b - a) * (b - c));
  },

  variance: function variance(a, b, c) {
    return (a * a + b * b + c * c - a * b - a * c - b * c) / 18;
  }
});


// extend arcsine function with static methods
jStat.extend(jStat.arcsine, {
  pdf: function pdf(x, a, b) {
    if (b <= a) return NaN;

    return (x <= a || x >= b) ? 0 :
      (2 / Math.PI) *
        Math.pow(Math.pow(b - a, 2) -
                  Math.pow(2 * x - a - b, 2), -0.5);
  },

  cdf: function cdf(x, a, b) {
    if (x < a)
      return 0;
    else if (x < b)
      return (2 / Math.PI) * Math.asin(Math.sqrt((x - a)/(b - a)));
    return 1;
  },

  inv: function(p, a, b) {
    return a + (0.5 - 0.5 * Math.cos(Math.PI * p)) * (b - a);
  },

  mean: function mean(a, b) {
    if (b <= a) return NaN;
    return (a + b) / 2;
  },

  median: function median(a, b) {
    if (b <= a) return NaN;
    return (a + b) / 2;
  },

  mode: function mode(/*a, b*/) {
    throw new Error('mode is not yet implemented');
  },

  sample: function sample(a, b) {
    return ((a + b) / 2) + ((b - a) / 2) *
      Math.sin(2 * Math.PI * jStat.uniform.sample(0, 1));
  },

  variance: function variance(a, b) {
    if (b <= a) return NaN;
    return Math.pow(b - a, 2) / 8;
  }
});


function laplaceSign(x) { return x / Math.abs(x); }

jStat.extend(jStat.laplace, {
  pdf: function pdf(x, mu, b) {
    return (b <= 0) ? 0 : (Math.exp(-Math.abs(x - mu) / b)) / (2 * b);
  },

  cdf: function cdf(x, mu, b) {
    if (b <= 0) { return 0; }

    if(x < mu) {
      return 0.5 * Math.exp((x - mu) / b);
    } else {
      return 1 - 0.5 * Math.exp(- (x - mu) / b);
    }
  },

  mean: function(mu/*, b*/) {
    return mu;
  },

  median: function(mu/*, b*/) {
    return mu;
  },

  mode: function(mu/*, b*/) {
    return mu;
  },

  variance: function(mu, b) {
    return 2 * b * b;
  },

  sample: function sample(mu, b) {
    var u = jStat._random_fn() - 0.5;

    return mu - (b * laplaceSign(u) * Math.log(1 - (2 * Math.abs(u))));
  }
});

function tukeyWprob(w, rr, cc) {
  var nleg = 12;
  var ihalf = 6;

  var C1 = -30;
  var C2 = -50;
  var C3 = 60;
  var bb   = 8;
  var wlar = 3;
  var wincr1 = 2;
  var wincr2 = 3;
  var xleg = [
    0.981560634246719250690549090149,
    0.904117256370474856678465866119,
    0.769902674194304687036893833213,
    0.587317954286617447296702418941,
    0.367831498998180193752691536644,
    0.125233408511468915472441369464
  ];
  var aleg = [
    0.047175336386511827194615961485,
    0.106939325995318430960254718194,
    0.160078328543346226334652529543,
    0.203167426723065921749064455810,
    0.233492536538354808760849898925,
    0.249147045813402785000562436043
  ];

  var qsqz = w * 0.5;

  // if w >= 16 then the integral lower bound (occurs for c=20)
  // is 0.99999999999995 so return a value of 1.

  if (qsqz >= bb)
    return 1.0;

  // find (f(w/2) - 1) ^ cc
  // (first term in integral of hartley's form).

  var pr_w = 2 * jStat.normal.cdf(qsqz, 0, 1, 1, 0) - 1; // erf(qsqz / M_SQRT2)
  // if pr_w ^ cc < 2e-22 then set pr_w = 0
  if (pr_w >= Math.exp(C2 / cc))
    pr_w = Math.pow(pr_w, cc);
  else
    pr_w = 0.0;

  // if w is large then the second component of the
  // integral is small, so fewer intervals are needed.

  var wincr;
  if (w > wlar)
    wincr = wincr1;
  else
    wincr = wincr2;

  // find the integral of second term of hartley's form
  // for the integral of the range for equal-length
  // intervals using legendre quadrature.  limits of
  // integration are from (w/2, 8).  two or three
  // equal-length intervals are used.

  // blb and bub are lower and upper limits of integration.

  var blb = qsqz;
  var binc = (bb - qsqz) / wincr;
  var bub = blb + binc;
  var einsum = 0.0;

  // integrate over each interval

  var cc1 = cc - 1.0;
  for (var wi = 1; wi <= wincr; wi++) {
    var elsum = 0.0;
    var a = 0.5 * (bub + blb);

    // legendre quadrature with order = nleg

    var b = 0.5 * (bub - blb);

    for (var jj = 1; jj <= nleg; jj++) {
      var j, xx;
      if (ihalf < jj) {
        j = (nleg - jj) + 1;
        xx = xleg[j-1];
      } else {
        j = jj;
        xx = -xleg[j-1];
      }
      var c = b * xx;
      var ac = a + c;

      // if exp(-qexpo/2) < 9e-14,
      // then doesn't contribute to integral

      var qexpo = ac * ac;
      if (qexpo > C3)
        break;

      var pplus = 2 * jStat.normal.cdf(ac, 0, 1, 1, 0);
      var pminus= 2 * jStat.normal.cdf(ac, w, 1, 1, 0);

      // if rinsum ^ (cc-1) < 9e-14,
      // then doesn't contribute to integral

      var rinsum = (pplus * 0.5) - (pminus * 0.5);
      if (rinsum >= Math.exp(C1 / cc1)) {
        rinsum = (aleg[j-1] * Math.exp(-(0.5 * qexpo))) * Math.pow(rinsum, cc1);
        elsum += rinsum;
      }
    }
    elsum *= (((2.0 * b) * cc) / Math.sqrt(2 * Math.PI));
    einsum += elsum;
    blb = bub;
    bub += binc;
  }

  // if pr_w ^ rr < 9e-14, then return 0
  pr_w += einsum;
  if (pr_w <= Math.exp(C1 / rr))
    return 0;

  pr_w = Math.pow(pr_w, rr);
  if (pr_w >= 1) // 1 was iMax was eps
    return 1;
  return pr_w;
}

function tukeyQinv(p, c, v) {
  var p0 = 0.322232421088;
  var q0 = 0.993484626060e-01;
  var p1 = -1.0;
  var q1 = 0.588581570495;
  var p2 = -0.342242088547;
  var q2 = 0.531103462366;
  var p3 = -0.204231210125;
  var q3 = 0.103537752850;
  var p4 = -0.453642210148e-04;
  var q4 = 0.38560700634e-02;
  var c1 = 0.8832;
  var c2 = 0.2368;
  var c3 = 1.214;
  var c4 = 1.208;
  var c5 = 1.4142;
  var vmax = 120.0;

  var ps = 0.5 - 0.5 * p;
  var yi = Math.sqrt(Math.log(1.0 / (ps * ps)));
  var t = yi + (((( yi * p4 + p3) * yi + p2) * yi + p1) * yi + p0)
     / (((( yi * q4 + q3) * yi + q2) * yi + q1) * yi + q0);
  if (v < vmax) t += (t * t * t + t) / v / 4.0;
  var q = c1 - c2 * t;
  if (v < vmax) q += -c3 / v + c4 * t / v;
  return t * (q * Math.log(c - 1.0) + c5);
}

jStat.extend(jStat.tukey, {
  cdf: function cdf(q, nmeans, df) {
    // Identical implementation as the R ptukey() function as of commit 68947
    var rr = 1;
    var cc = nmeans;

    var nlegq = 16;
    var ihalfq = 8;

    var eps1 = -30.0;
    var eps2 = 1.0e-14;
    var dhaf  = 100.0;
    var dquar = 800.0;
    var deigh = 5000.0;
    var dlarg = 25000.0;
    var ulen1 = 1.0;
    var ulen2 = 0.5;
    var ulen3 = 0.25;
    var ulen4 = 0.125;
    var xlegq = [
      0.989400934991649932596154173450,
      0.944575023073232576077988415535,
      0.865631202387831743880467897712,
      0.755404408355003033895101194847,
      0.617876244402643748446671764049,
      0.458016777657227386342419442984,
      0.281603550779258913230460501460,
      0.950125098376374401853193354250e-1
    ];
    var alegq = [
      0.271524594117540948517805724560e-1,
      0.622535239386478928628438369944e-1,
      0.951585116824927848099251076022e-1,
      0.124628971255533872052476282192,
      0.149595988816576732081501730547,
      0.169156519395002538189312079030,
      0.182603415044923588866763667969,
      0.189450610455068496285396723208
    ];

    if (q <= 0)
      return 0;

    // df must be > 1
    // there must be at least two values

    if (df < 2 || rr < 1 || cc < 2) return NaN;

    if (!Number.isFinite(q))
      return 1;

    if (df > dlarg)
      return tukeyWprob(q, rr, cc);

    // calculate leading constant

    var f2 = df * 0.5;
    var f2lf = ((f2 * Math.log(df)) - (df * Math.log(2))) - jStat.gammaln(f2);
    var f21 = f2 - 1.0;

    // integral is divided into unit, half-unit, quarter-unit, or
    // eighth-unit length intervals depending on the value of the
    // degrees of freedom.

    var ff4 = df * 0.25;
    var ulen;
    if      (df <= dhaf)  ulen = ulen1;
    else if (df <= dquar) ulen = ulen2;
    else if (df <= deigh) ulen = ulen3;
    else                  ulen = ulen4;

    f2lf += Math.log(ulen);

    // integrate over each subinterval

    var ans = 0.0;

    for (var i = 1; i <= 50; i++) {
      var otsum = 0.0;

      // legendre quadrature with order = nlegq
      // nodes (stored in xlegq) are symmetric around zero.

      var twa1 = (2 * i - 1) * ulen;

      for (var jj = 1; jj <= nlegq; jj++) {
        var j, t1;
        if (ihalfq < jj) {
          j = jj - ihalfq - 1;
          t1 = (f2lf + (f21 * Math.log(twa1 + (xlegq[j] * ulen))))
              - (((xlegq[j] * ulen) + twa1) * ff4);
        } else {
          j = jj - 1;
          t1 = (f2lf + (f21 * Math.log(twa1 - (xlegq[j] * ulen))))
              + (((xlegq[j] * ulen) - twa1) * ff4);
        }

        // if exp(t1) < 9e-14, then doesn't contribute to integral
        var qsqz;
        if (t1 >= eps1) {
          if (ihalfq < jj) {
            qsqz = q * Math.sqrt(((xlegq[j] * ulen) + twa1) * 0.5);
          } else {
            qsqz = q * Math.sqrt(((-(xlegq[j] * ulen)) + twa1) * 0.5);
          }

          // call wprob to find integral of range portion

          var wprb = tukeyWprob(qsqz, rr, cc);
          var rotsum = (wprb * alegq[j]) * Math.exp(t1);
          otsum += rotsum;
        }
        // end legendre integral for interval i
        // L200:
      }

      // if integral for interval i < 1e-14, then stop.
      // However, in order to avoid small area under left tail,
      // at least  1 / ulen  intervals are calculated.
      if (i * ulen >= 1.0 && otsum <= eps2)
        break;

      // end of interval i
      // L330:

      ans += otsum;
    }

    if (otsum > eps2) { // not converged
      throw new Error('tukey.cdf failed to converge');
    }
    if (ans > 1)
      ans = 1;
    return ans;
  },

  inv: function(p, nmeans, df) {
    // Identical implementation as the R qtukey() function as of commit 68947
    var rr = 1;
    var cc = nmeans;

    var eps = 0.0001;
    var maxiter = 50;

    // df must be > 1 ; there must be at least two values
    if (df < 2 || rr < 1 || cc < 2) return NaN;

    if (p < 0 || p > 1) return NaN;
    if (p === 0) return 0;
    if (p === 1) return Infinity;

    // Initial value

    var x0 = tukeyQinv(p, cc, df);

    // Find prob(value < x0)

    var valx0 = jStat.tukey.cdf(x0, nmeans, df) - p;

    // Find the second iterate and prob(value < x1).
    // If the first iterate has probability value
    // exceeding p then second iterate is 1 less than
    // first iterate; otherwise it is 1 greater.

    var x1;
    if (valx0 > 0.0)
      x1 = Math.max(0.0, x0 - 1.0);
    else
      x1 = x0 + 1.0;
    var valx1 = jStat.tukey.cdf(x1, nmeans, df) - p;

    // Find new iterate

    var ans;
    for(var iter = 1; iter < maxiter; iter++) {
      ans = x1 - ((valx1 * (x1 - x0)) / (valx1 - valx0));
      valx0 = valx1;

      // New iterate must be >= 0

      x0 = x1;
      if (ans < 0.0) {
        ans = 0.0;
        valx1 = -p;
      }
      // Find prob(value < new iterate)

      valx1 = jStat.tukey.cdf(ans, nmeans, df) - p;
      x1 = ans;

      // If the difference between two successive
      // iterates is less than eps, stop

      var xabs = Math.abs(x1 - x0);
      if (xabs < eps)
        return ans;
    }

    throw new Error('tukey.inv failed to converge');
  }
});

}(jStat, Math));
/* Provides functions for the solution of linear system of equations, integration, extrapolation,
 * interpolation, eigenvalue problems, differential equations and PCA analysis. */

(function(jStat, Math) {

var push = Array.prototype.push;
var isArray = jStat.utils.isArray;

function isUsable(arg) {
  return isArray(arg) || arg instanceof jStat;
}

jStat.extend({

  // add a vector/matrix to a vector/matrix or scalar
  add: function add(arr, arg) {
    // check if arg is a vector or scalar
    if (isUsable(arg)) {
      if (!isUsable(arg[0])) arg = [ arg ];
      return jStat.map(arr, function(value, row, col) {
        return value + arg[row][col];
      });
    }
    return jStat.map(arr, function(value) { return value + arg; });
  },

  // subtract a vector or scalar from the vector
  subtract: function subtract(arr, arg) {
    // check if arg is a vector or scalar
    if (isUsable(arg)) {
      if (!isUsable(arg[0])) arg = [ arg ];
      return jStat.map(arr, function(value, row, col) {
        return value - arg[row][col] || 0;
      });
    }
    return jStat.map(arr, function(value) { return value - arg; });
  },

  // matrix division
  divide: function divide(arr, arg) {
    if (isUsable(arg)) {
      if (!isUsable(arg[0])) arg = [ arg ];
      return jStat.multiply(arr, jStat.inv(arg));
    }
    return jStat.map(arr, function(value) { return value / arg; });
  },

  // matrix multiplication
  multiply: function multiply(arr, arg) {
    var row, col, nrescols, sum, nrow, ncol, res, rescols;
    // eg: arr = 2 arg = 3 -> 6 for res[0][0] statement closure
    if (arr.length === undefined && arg.length === undefined) {
      return arr * arg;
    }
    nrow = arr.length,
    ncol = arr[0].length,
    res = jStat.zeros(nrow, nrescols = (isUsable(arg)) ? arg[0].length : ncol),
    rescols = 0;
    if (isUsable(arg)) {
      for (; rescols < nrescols; rescols++) {
        for (row = 0; row < nrow; row++) {
          sum = 0;
          for (col = 0; col < ncol; col++)
          sum += arr[row][col] * arg[col][rescols];
          res[row][rescols] = sum;
        }
      }
      return (nrow === 1 && rescols === 1) ? res[0][0] : res;
    }
    return jStat.map(arr, function(value) { return value * arg; });
  },

  // outer([1,2,3],[4,5,6])
  // ===
  // [[1],[2],[3]] times [[4,5,6]]
  // ->
  // [[4,5,6],[8,10,12],[12,15,18]]
  outer:function outer(A, B) {
    return jStat.multiply(A.map(function(t){ return [t] }), [B]);
  },


  // Returns the dot product of two matricies
  dot: function dot(arr, arg) {
    if (!isUsable(arr[0])) arr = [ arr ];
    if (!isUsable(arg[0])) arg = [ arg ];
    // convert column to row vector
    var left = (arr[0].length === 1 && arr.length !== 1) ? jStat.transpose(arr) : arr,
    right = (arg[0].length === 1 && arg.length !== 1) ? jStat.transpose(arg) : arg,
    res = [],
    row = 0,
    nrow = left.length,
    ncol = left[0].length,
    sum, col;
    for (; row < nrow; row++) {
      res[row] = [];
      sum = 0;
      for (col = 0; col < ncol; col++)
      sum += left[row][col] * right[row][col];
      res[row] = sum;
    }
    return (res.length === 1) ? res[0] : res;
  },

  // raise every element by a scalar
  pow: function pow(arr, arg) {
    return jStat.map(arr, function(value) { return Math.pow(value, arg); });
  },

  // exponentiate every element
  exp: function exp(arr) {
    return jStat.map(arr, function(value) { return Math.exp(value); });
  },

  // generate the natural log of every element
  log: function exp(arr) {
    return jStat.map(arr, function(value) { return Math.log(value); });
  },

  // generate the absolute values of the vector
  abs: function abs(arr) {
    return jStat.map(arr, function(value) { return Math.abs(value); });
  },

  // computes the p-norm of the vector
  // In the case that a matrix is passed, uses the first row as the vector
  norm: function norm(arr, p) {
    var nnorm = 0,
    i = 0;
    // check the p-value of the norm, and set for most common case
    if (isNaN(p)) p = 2;
    // check if multi-dimensional array, and make vector correction
    if (isUsable(arr[0])) arr = arr[0];
    // vector norm
    for (; i < arr.length; i++) {
      nnorm += Math.pow(Math.abs(arr[i]), p);
    }
    return Math.pow(nnorm, 1 / p);
  },

  // computes the angle between two vectors in rads
  // In case a matrix is passed, this uses the first row as the vector
  angle: function angle(arr, arg) {
    return Math.acos(jStat.dot(arr, arg) / (jStat.norm(arr) * jStat.norm(arg)));
  },

  // augment one matrix by another
  // Note: this function returns a matrix, not a jStat object
  aug: function aug(a, b) {
    var newarr = [];
    var i;
    for (i = 0; i < a.length; i++) {
      newarr.push(a[i].slice());
    }
    for (i = 0; i < newarr.length; i++) {
      push.apply(newarr[i], b[i]);
    }
    return newarr;
  },

  // The inv() function calculates the inverse of a matrix
  // Create the inverse by augmenting the matrix by the identity matrix of the
  // appropriate size, and then use G-J elimination on the augmented matrix.
  inv: function inv(a) {
    var rows = a.length;
    var cols = a[0].length;
    var b = jStat.identity(rows, cols);
    var c = jStat.gauss_jordan(a, b);
    var result = [];
    var i = 0;
    var j;

    //We need to copy the inverse portion to a new matrix to rid G-J artifacts
    for (; i < rows; i++) {
      result[i] = [];
      for (j = cols; j < c[0].length; j++)
        result[i][j - cols] = c[i][j];
    }
    return result;
  },

  // calculate the determinant of a matrix
  det: function det(a) {
    var alen = a.length,
    alend = alen * 2,
    vals = new Array(alend),
    rowshift = alen - 1,
    colshift = alend - 1,
    mrow = rowshift - alen + 1,
    mcol = colshift,
    i = 0,
    result = 0,
    j;
    // check for special 2x2 case
    if (alen === 2) {
      return a[0][0] * a[1][1] - a[0][1] * a[1][0];
    }
    for (; i < alend; i++) {
      vals[i] = 1;
    }
    for (i = 0; i < alen; i++) {
      for (j = 0; j < alen; j++) {
        vals[(mrow < 0) ? mrow + alen : mrow ] *= a[i][j];
        vals[(mcol < alen) ? mcol + alen : mcol ] *= a[i][j];
        mrow++;
        mcol--;
      }
      mrow = --rowshift - alen + 1;
      mcol = --colshift;
    }
    for (i = 0; i < alen; i++) {
      result += vals[i];
    }
    for (; i < alend; i++) {
      result -= vals[i];
    }
    return result;
  },

  gauss_elimination: function gauss_elimination(a, b) {
    var i = 0,
    j = 0,
    n = a.length,
    m = a[0].length,
    factor = 1,
    sum = 0,
    x = [],
    maug, pivot, temp, k;
    a = jStat.aug(a, b);
    maug = a[0].length;
    for(i = 0; i < n; i++) {
      pivot = a[i][i];
      j = i;
      for (k = i + 1; k < m; k++) {
        if (pivot < Math.abs(a[k][i])) {
          pivot = a[k][i];
          j = k;
        }
      }
      if (j != i) {
        for(k = 0; k < maug; k++) {
          temp = a[i][k];
          a[i][k] = a[j][k];
          a[j][k] = temp;
        }
      }
      for (j = i + 1; j < n; j++) {
        factor = a[j][i] / a[i][i];
        for(k = i; k < maug; k++) {
          a[j][k] = a[j][k] - factor * a[i][k];
        }
      }
    }
    for (i = n - 1; i >= 0; i--) {
      sum = 0;
      for (j = i + 1; j<= n - 1; j++) {
        sum = sum + x[j] * a[i][j];
      }
      x[i] =(a[i][maug - 1] - sum) / a[i][i];
    }
    return x;
  },

  gauss_jordan: function gauss_jordan(a, b) {
    var m = jStat.aug(a, b);
    var h = m.length;
    var w = m[0].length;
    var c = 0;
    var x, y, y2;
    // find max pivot
    for (y = 0; y < h; y++) {
      var maxrow = y;
      for (y2 = y+1; y2 < h; y2++) {
        if (Math.abs(m[y2][y]) > Math.abs(m[maxrow][y]))
          maxrow = y2;
      }
      var tmp = m[y];
      m[y] = m[maxrow];
      m[maxrow] = tmp
      for (y2 = y+1; y2 < h; y2++) {
        c = m[y2][y] / m[y][y];
        for (x = y; x < w; x++) {
          m[y2][x] -= m[y][x] * c;
        }
      }
    }
    // backsubstitute
    for (y = h-1; y >= 0; y--) {
      c = m[y][y];
      for (y2 = 0; y2 < y; y2++) {
        for (x = w-1; x > y-1; x--) {
          m[y2][x] -= m[y][x] * m[y2][y] / c;
        }
      }
      m[y][y] /= c;
      for (x = h; x < w; x++) {
        m[y][x] /= c;
      }
    }
    return m;
  },

  // solve equation
  // Ax=b
  // A is upper triangular matrix
  // A=[[1,2,3],[0,4,5],[0,6,7]]
  // b=[1,2,3]
  // triaUpSolve(A,b) // -> [2.666,0.1666,1.666]
  // if you use matrix style
  // A=[[1,2,3],[0,4,5],[0,6,7]]
  // b=[[1],[2],[3]]
  // will return [[2.666],[0.1666],[1.666]]
  triaUpSolve: function triaUpSolve(A, b) {
    var size = A[0].length;
    var x = jStat.zeros(1, size)[0];
    var parts;
    var matrix_mode = false;

    if (b[0].length != undefined) {
      b = b.map(function(i){ return i[0] });
      matrix_mode = true;
    }

    jStat.arange(size - 1, -1, -1).forEach(function(i) {
      parts = jStat.arange(i + 1, size).map(function(j) {
        return x[j] * A[i][j];
      });
      x[i] = (b[i] - jStat.sum(parts)) / A[i][i];
    });

    if (matrix_mode)
      return x.map(function(i){ return [i] });
    return x;
  },

  triaLowSolve: function triaLowSolve(A, b) {
    // like to triaUpSolve but A is lower triangular matrix
    var size = A[0].length;
    var x = jStat.zeros(1, size)[0];
    var parts;

    var matrix_mode=false;
    if (b[0].length != undefined) {
      b = b.map(function(i){ return i[0] });
      matrix_mode = true;
    }

    jStat.arange(size).forEach(function(i) {
      parts = jStat.arange(i).map(function(j) {
        return A[i][j] * x[j];
      });
      x[i] = (b[i] - jStat.sum(parts)) / A[i][i];
    })

    if (matrix_mode)
      return x.map(function(i){ return [i] });
    return x;
  },


  // A -> [L,U]
  // A=LU
  // L is lower triangular matrix
  // U is upper triangular matrix
  lu: function lu(A) {
    var size = A.length;
    //var L=jStat.diagonal(jStat.ones(1,size)[0]);
    var L = jStat.identity(size);
    var R = jStat.zeros(A.length, A[0].length);
    var parts;
    jStat.arange(size).forEach(function(t) {
      R[0][t] = A[0][t];
    });
    jStat.arange(1, size).forEach(function(l) {
      jStat.arange(l).forEach(function(i) {
        parts = jStat.arange(i).map(function(jj) {
          return L[l][jj] * R[jj][i];
        });
        L[l][i] = (A[l][i] - jStat.sum(parts)) / R[i][i];
      });
      jStat.arange(l, size).forEach(function(j) {
        parts = jStat.arange(l).map(function(jj) {
          return L[l][jj] * R[jj][j];
        });
        R[l][j] = A[parts.length][j] - jStat.sum(parts);
      });
    });
    return [L, R];
  },

  // A -> T
  // A=TT'
  // T is lower triangular matrix
  cholesky: function cholesky(A) {
    var size = A.length;
    var T = jStat.zeros(A.length, A[0].length);
    var parts;
    jStat.arange(size).forEach(function(i) {
      parts = jStat.arange(i).map(function(t) {
        return Math.pow(T[i][t],2);
      });
      T[i][i] = Math.sqrt(A[i][i] - jStat.sum(parts));
      jStat.arange(i + 1, size).forEach(function(j) {
        parts = jStat.arange(i).map(function(t) {
          return T[i][t] * T[j][t];
        });
        T[j][i] = (A[i][j] - jStat.sum(parts)) / T[i][i];
      });
    });
    return T;
  },


  gauss_jacobi: function gauss_jacobi(a, b, x, r) {
    var i = 0;
    var j = 0;
    var n = a.length;
    var l = [];
    var u = [];
    var d = [];
    var xv, c, h, xk;
    for (; i < n; i++) {
      l[i] = [];
      u[i] = [];
      d[i] = [];
      for (j = 0; j < n; j++) {
        if (i > j) {
          l[i][j] = a[i][j];
          u[i][j] = d[i][j] = 0;
        } else if (i < j) {
          u[i][j] = a[i][j];
          l[i][j] = d[i][j] = 0;
        } else {
          d[i][j] = a[i][j];
          l[i][j] = u[i][j] = 0;
        }
      }
    }
    h = jStat.multiply(jStat.multiply(jStat.inv(d), jStat.add(l, u)), -1);
    c = jStat.multiply(jStat.inv(d), b);
    xv = x;
    xk = jStat.add(jStat.multiply(h, x), c);
    i = 2;
    while (Math.abs(jStat.norm(jStat.subtract(xk,xv))) > r) {
      xv = xk;
      xk = jStat.add(jStat.multiply(h, xv), c);
      i++;
    }
    return xk;
  },

  gauss_seidel: function gauss_seidel(a, b, x, r) {
    var i = 0;
    var n = a.length;
    var l = [];
    var u = [];
    var d = [];
    var j, xv, c, h, xk;
    for (; i < n; i++) {
      l[i] = [];
      u[i] = [];
      d[i] = [];
      for (j = 0; j < n; j++) {
        if (i > j) {
          l[i][j] = a[i][j];
          u[i][j] = d[i][j] = 0;
        } else if (i < j) {
          u[i][j] = a[i][j];
          l[i][j] = d[i][j] = 0;
        } else {
          d[i][j] = a[i][j];
          l[i][j] = u[i][j] = 0;
        }
      }
    }
    h = jStat.multiply(jStat.multiply(jStat.inv(jStat.add(d, l)), u), -1);
    c = jStat.multiply(jStat.inv(jStat.add(d, l)), b);
    xv = x;
    xk = jStat.add(jStat.multiply(h, x), c);
    i = 2;
    while (Math.abs(jStat.norm(jStat.subtract(xk, xv))) > r) {
      xv = xk;
      xk = jStat.add(jStat.multiply(h, xv), c);
      i = i + 1;
    }
    return xk;
  },

  SOR: function SOR(a, b, x, r, w) {
    var i = 0;
    var n = a.length;
    var l = [];
    var u = [];
    var d = [];
    var j, xv, c, h, xk;
    for (; i < n; i++) {
      l[i] = [];
      u[i] = [];
      d[i] = [];
      for (j = 0; j < n; j++) {
        if (i > j) {
          l[i][j] = a[i][j];
          u[i][j] = d[i][j] = 0;
        } else if (i < j) {
          u[i][j] = a[i][j];
          l[i][j] = d[i][j] = 0;
        } else {
          d[i][j] = a[i][j];
          l[i][j] = u[i][j] = 0;
        }
      }
    }
    h = jStat.multiply(jStat.inv(jStat.add(d, jStat.multiply(l, w))),
                       jStat.subtract(jStat.multiply(d, 1 - w),
                                      jStat.multiply(u, w)));
    c = jStat.multiply(jStat.multiply(jStat.inv(jStat.add(d,
        jStat.multiply(l, w))), b), w);
    xv = x;
    xk = jStat.add(jStat.multiply(h, x), c);
    i = 2;
    while (Math.abs(jStat.norm(jStat.subtract(xk, xv))) > r) {
      xv = xk;
      xk = jStat.add(jStat.multiply(h, xv), c);
      i++;
    }
    return xk;
  },

  householder: function householder(a) {
    var m = a.length;
    var n = a[0].length;
    var i = 0;
    var w = [];
    var p = [];
    var alpha, r, k, j, factor;
    for (; i < m - 1; i++) {
      alpha = 0;
      for (j = i + 1; j < n; j++)
      alpha += (a[j][i] * a[j][i]);
      factor = (a[i + 1][i] > 0) ? -1 : 1;
      alpha = factor * Math.sqrt(alpha);
      r = Math.sqrt((((alpha * alpha) - a[i + 1][i] * alpha) / 2));
      w = jStat.zeros(m, 1);
      w[i + 1][0] = (a[i + 1][i] - alpha) / (2 * r);
      for (k = i + 2; k < m; k++) w[k][0] = a[k][i] / (2 * r);
      p = jStat.subtract(jStat.identity(m, n),
          jStat.multiply(jStat.multiply(w, jStat.transpose(w)), 2));
      a = jStat.multiply(p, jStat.multiply(a, p));
    }
    return a;
  },

  // A -> [Q,R]
  // Q is orthogonal matrix
  // R is upper triangular
  QR: (function() {
    // x -> Q
    // find a orthogonal matrix Q st.
    // Qx=y
    // y is [||x||,0,0,...]

    // quick ref
    var sum   = jStat.sum;
    var range = jStat.arange;

    function qr2(x) {
      // quick impletation
      // https://www.stat.wisc.edu/~larget/math496/qr.html

      var n = x.length;
      var p = x[0].length;

      var r = jStat.zeros(p, p);
      x = jStat.copy(x);

      var i,j,k;
      for(j = 0; j < p; j++){
        r[j][j] = Math.sqrt(sum(range(n).map(function(i){
          return x[i][j] * x[i][j];
        })));
        for(i = 0; i < n; i++){
          x[i][j] = x[i][j] / r[j][j];
        }
        for(k = j+1; k < p; k++){
          r[j][k] = sum(range(n).map(function(i){
            return x[i][j] * x[i][k];
          }));
          for(i = 0; i < n; i++){
            x[i][k] = x[i][k] - x[i][j]*r[j][k];
          }
        }
      }
      return [x, r];
    }

    return qr2;
  }()),

  lstsq: (function() {
    // solve least squard problem for Ax=b as QR decomposition way if b is
    // [[b1],[b2],[b3]] form will return [[x1],[x2],[x3]] array form solution
    // else b is [b1,b2,b3] form will return [x1,x2,x3] array form solution
    function R_I(A) {
      A = jStat.copy(A);
      var size = A.length;
      var I = jStat.identity(size);
      jStat.arange(size - 1, -1, -1).forEach(function(i) {
        jStat.sliceAssign(
            I, { row: i }, jStat.divide(jStat.slice(I, { row: i }), A[i][i]));
        jStat.sliceAssign(
            A, { row: i }, jStat.divide(jStat.slice(A, { row: i }), A[i][i]));
        jStat.arange(i).forEach(function(j) {
          var c = jStat.multiply(A[j][i], -1);
          var Aj = jStat.slice(A, { row: j });
          var cAi = jStat.multiply(jStat.slice(A, { row: i }), c);
          jStat.sliceAssign(A, { row: j }, jStat.add(Aj, cAi));
          var Ij = jStat.slice(I, { row: j });
          var cIi = jStat.multiply(jStat.slice(I, { row: i }), c);
          jStat.sliceAssign(I, { row: j }, jStat.add(Ij, cIi));
        })
      });
      return I;
    }

    function qr_solve(A, b){
      var array_mode = false;
      if (b[0].length === undefined) {
        // [c1,c2,c3] mode
        b = b.map(function(x){ return [x] });
        array_mode = true;
      }
      var QR = jStat.QR(A);
      var Q = QR[0];
      var R = QR[1];
      var attrs = A[0].length;
      var Q1 = jStat.slice(Q,{col:{end:attrs}});
      var R1 = jStat.slice(R,{row:{end:attrs}});
      var RI = R_I(R1);
      var Q2 = jStat.transpose(Q1);

      if(Q2[0].length === undefined){
        Q2 = [Q2]; // The confusing jStat.multifly implementation threat nature process again.
      }

      var x = jStat.multiply(jStat.multiply(RI, Q2), b);

      if(x.length === undefined){
        x = [[x]]; // The confusing jStat.multifly implementation threat nature process again.
      }


      if (array_mode)
        return x.map(function(i){ return i[0] });
      return x;
    }

    return qr_solve;
  }()),

  jacobi: function jacobi(a) {
    var condition = 1;
    var n = a.length;
    var e = jStat.identity(n, n);
    var ev = [];
    var b, i, j, p, q, maxim, theta, s;
    // condition === 1 only if tolerance is not reached
    while (condition === 1) {
      maxim = a[0][1];
      p = 0;
      q = 1;
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          if (i != j) {
            if (maxim < Math.abs(a[i][j])) {
              maxim = Math.abs(a[i][j]);
              p = i;
              q = j;
            }
          }
        }
      }
      if (a[p][p] === a[q][q])
        theta = (a[p][q] > 0) ? Math.PI / 4 : -Math.PI / 4;
      else
        theta = Math.atan(2 * a[p][q] / (a[p][p] - a[q][q])) / 2;
      s = jStat.identity(n, n);
      s[p][p] = Math.cos(theta);
      s[p][q] = -Math.sin(theta);
      s[q][p] = Math.sin(theta);
      s[q][q] = Math.cos(theta);
      // eigen vector matrix
      e = jStat.multiply(e, s);
      b = jStat.multiply(jStat.multiply(jStat.inv(s), a), s);
      a = b;
      condition = 0;
      for (i = 1; i < n; i++) {
        for (j = 1; j < n; j++) {
          if (i != j && Math.abs(a[i][j]) > 0.001) {
            condition = 1;
          }
        }
      }
    }
    for (i = 0; i < n; i++) ev.push(a[i][i]);
    //returns both the eigenvalue and eigenmatrix
    return [e, ev];
  },

  rungekutta: function rungekutta(f, h, p, t_j, u_j, order) {
    var k1, k2, u_j1, k3, k4;
    if (order === 2) {
      while (t_j <= p) {
        k1 = h * f(t_j, u_j);
        k2 = h * f(t_j + h, u_j + k1);
        u_j1 = u_j + (k1 + k2) / 2;
        u_j = u_j1;
        t_j = t_j + h;
      }
    }
    if (order === 4) {
      while (t_j <= p) {
        k1 = h * f(t_j, u_j);
        k2 = h * f(t_j + h / 2, u_j + k1 / 2);
        k3 = h * f(t_j + h / 2, u_j + k2 / 2);
        k4 = h * f(t_j +h, u_j + k3);
        u_j1 = u_j + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        u_j = u_j1;
        t_j = t_j + h;
      }
    }
    return u_j;
  },

  romberg: function romberg(f, a, b, order) {
    var i = 0;
    var h = (b - a) / 2;
    var x = [];
    var h1 = [];
    var g = [];
    var m, a1, j, k, I;
    while (i < order / 2) {
      I = f(a);
      for (j = a, k = 0; j <= b; j = j + h, k++) x[k] = j;
      m = x.length;
      for (j = 1; j < m - 1; j++) {
        I += (((j % 2) !== 0) ? 4 : 2) * f(x[j]);
      }
      I = (h / 3) * (I + f(b));
      g[i] = I;
      h /= 2;
      i++;
    }
    a1 = g.length;
    m = 1;
    while (a1 !== 1) {
      for (j = 0; j < a1 - 1; j++)
      h1[j] = ((Math.pow(4, m)) * g[j + 1] - g[j]) / (Math.pow(4, m) - 1);
      a1 = h1.length;
      g = h1;
      h1 = [];
      m++;
    }
    return g;
  },

  richardson: function richardson(X, f, x, h) {
    function pos(X, x) {
      var i = 0;
      var n = X.length;
      var p;
      for (; i < n; i++)
        if (X[i] === x) p = i;
      return p;
    }
    var h_min = Math.abs(x - X[pos(X, x) + 1]);
    var i = 0;
    var g = [];
    var h1 = [];
    var y1, y2, m, a, j;
    while (h >= h_min) {
      y1 = pos(X, x + h);
      y2 = pos(X, x);
      g[i] = (f[y1] - 2 * f[y2] + f[2 * y2 - y1]) / (h * h);
      h /= 2;
      i++;
    }
    a = g.length;
    m = 1;
    while (a != 1) {
      for (j = 0; j < a - 1; j++)
        h1[j] = ((Math.pow(4, m)) * g[j + 1] - g[j]) / (Math.pow(4, m) - 1);
      a = h1.length;
      g = h1;
      h1 = [];
      m++;
    }
    return g;
  },

  simpson: function simpson(f, a, b, n) {
    var h = (b - a) / n;
    var I = f(a);
    var x = [];
    var j = a;
    var k = 0;
    var i = 1;
    var m;
    for (; j <= b; j = j + h, k++)
      x[k] = j;
    m = x.length;
    for (; i < m - 1; i++) {
      I += ((i % 2 !== 0) ? 4 : 2) * f(x[i]);
    }
    return (h / 3) * (I + f(b));
  },

  hermite: function hermite(X, F, dF, value) {
    var n = X.length;
    var p = 0;
    var i = 0;
    var l = [];
    var dl = [];
    var A = [];
    var B = [];
    var j;
    for (; i < n; i++) {
      l[i] = 1;
      for (j = 0; j < n; j++) {
        if (i != j) l[i] *= (value - X[j]) / (X[i] - X[j]);
      }
      dl[i] = 0;
      for (j = 0; j < n; j++) {
        if (i != j) dl[i] += 1 / (X [i] - X[j]);
      }
      A[i] = (1 - 2 * (value - X[i]) * dl[i]) * (l[i] * l[i]);
      B[i] = (value - X[i]) * (l[i] * l[i]);
      p += (A[i] * F[i] + B[i] * dF[i]);
    }
    return p;
  },

  lagrange: function lagrange(X, F, value) {
    var p = 0;
    var i = 0;
    var j, l;
    var n = X.length;
    for (; i < n; i++) {
      l = F[i];
      for (j = 0; j < n; j++) {
        // calculating the lagrange polynomial L_i
        if (i != j) l *= (value - X[j]) / (X[i] - X[j]);
      }
      // adding the lagrange polynomials found above
      p += l;
    }
    return p;
  },

  cubic_spline: function cubic_spline(X, F, value) {
    var n = X.length;
    var i = 0, j;
    var A = [];
    var B = [];
    var alpha = [];
    var c = [];
    var h = [];
    var b = [];
    var d = [];
    for (; i < n - 1; i++)
      h[i] = X[i + 1] - X[i];
    alpha[0] = 0;
    for (i = 1; i < n - 1; i++) {
      alpha[i] = (3 / h[i]) * (F[i + 1] - F[i]) -
          (3 / h[i-1]) * (F[i] - F[i-1]);
    }
    for (i = 1; i < n - 1; i++) {
      A[i] = [];
      B[i] = [];
      A[i][i-1] = h[i-1];
      A[i][i] = 2 * (h[i - 1] + h[i]);
      A[i][i+1] = h[i];
      B[i][0] = alpha[i];
    }
    c = jStat.multiply(jStat.inv(A), B);
    for (j = 0; j < n - 1; j++) {
      b[j] = (F[j + 1] - F[j]) / h[j] - h[j] * (c[j + 1][0] + 2 * c[j][0]) / 3;
      d[j] = (c[j + 1][0] - c[j][0]) / (3 * h[j]);
    }
    for (j = 0; j < n; j++) {
      if (X[j] > value) break;
    }
    j -= 1;
    return F[j] + (value - X[j]) * b[j] + jStat.sq(value-X[j]) *
        c[j] + (value - X[j]) * jStat.sq(value - X[j]) * d[j];
  },

  gauss_quadrature: function gauss_quadrature() {
    throw new Error('gauss_quadrature not yet implemented');
  },

  PCA: function PCA(X) {
    var m = X.length;
    var n = X[0].length;
    var i = 0;
    var j, temp1;
    var u = [];
    var D = [];
    var result = [];
    var temp2 = [];
    var Y = [];
    var Bt = [];
    var B = [];
    var C = [];
    var V = [];
    var Vt = [];
    for (i = 0; i < m; i++) {
      u[i] = jStat.sum(X[i]) / n;
    }
    for (i = 0; i < n; i++) {
      B[i] = [];
      for(j = 0; j < m; j++) {
        B[i][j] = X[j][i] - u[j];
      }
    }
    B = jStat.transpose(B);
    for (i = 0; i < m; i++) {
      C[i] = [];
      for (j = 0; j < m; j++) {
        C[i][j] = (jStat.dot([B[i]], [B[j]])) / (n - 1);
      }
    }
    result = jStat.jacobi(C);
    V = result[0];
    D = result[1];
    Vt = jStat.transpose(V);
    for (i = 0; i < D.length; i++) {
      for (j = i; j < D.length; j++) {
        if(D[i] < D[j])  {
          temp1 = D[i];
          D[i] = D[j];
          D[j] = temp1;
          temp2 = Vt[i];
          Vt[i] = Vt[j];
          Vt[j] = temp2;
        }
      }
    }
    Bt = jStat.transpose(B);
    for (i = 0; i < m; i++) {
      Y[i] = [];
      for (j = 0; j < Bt.length; j++) {
        Y[i][j] = jStat.dot([Vt[i]], [Bt[j]]);
      }
    }
    return [X, D, Vt, Y];
  }
});

// extend jStat.fn with methods that require one argument
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jStat.fn[passfunc] = function(arg, func) {
      var tmpthis = this;
      // check for callback
      if (func) {
        setTimeout(function() {
          func.call(tmpthis, jStat.fn[passfunc].call(tmpthis, arg));
        }, 15);
        return this;
      }
      if (typeof jStat[passfunc](this, arg) === 'number')
        return jStat[passfunc](this, arg);
      else
        return jStat(jStat[passfunc](this, arg));
    };
  }(funcs[i]));
}('add divide multiply subtract dot pow exp log abs norm angle'.split(' ')));

}(jStat, Math));
(function(jStat, Math) {

var slice = [].slice;
var isNumber = jStat.utils.isNumber;
var isArray = jStat.utils.isArray;

// flag==true denotes use of sample standard deviation
// Z Statistics
jStat.extend({
  // 2 different parameter lists:
  // (value, mean, sd)
  // (value, array, flag)
  zscore: function zscore() {
    var args = slice.call(arguments);
    if (isNumber(args[1])) {
      return (args[0] - args[1]) / args[2];
    }
    return (args[0] - jStat.mean(args[1])) / jStat.stdev(args[1], args[2]);
  },

  // 3 different paramter lists:
  // (value, mean, sd, sides)
  // (zscore, sides)
  // (value, array, sides, flag)
  ztest: function ztest() {
    var args = slice.call(arguments);
    var z;
    if (isArray(args[1])) {
      // (value, array, sides, flag)
      z = jStat.zscore(args[0],args[1],args[3]);
      return (args[2] === 1) ?
        (jStat.normal.cdf(-Math.abs(z), 0, 1)) :
        (jStat.normal.cdf(-Math.abs(z), 0, 1)*2);
    } else {
      if (args.length > 2) {
        // (value, mean, sd, sides)
        z = jStat.zscore(args[0],args[1],args[2]);
        return (args[3] === 1) ?
          (jStat.normal.cdf(-Math.abs(z),0,1)) :
          (jStat.normal.cdf(-Math.abs(z),0,1)* 2);
      } else {
        // (zscore, sides)
        z = args[0];
        return (args[1] === 1) ?
          (jStat.normal.cdf(-Math.abs(z),0,1)) :
          (jStat.normal.cdf(-Math.abs(z),0,1)*2);
      }
    }
  }
});

jStat.extend(jStat.fn, {
  zscore: function zscore(value, flag) {
    return (value - this.mean()) / this.stdev(flag);
  },

  ztest: function ztest(value, sides, flag) {
    var zscore = Math.abs(this.zscore(value, flag));
    return (sides === 1) ?
      (jStat.normal.cdf(-zscore, 0, 1)) :
      (jStat.normal.cdf(-zscore, 0, 1) * 2);
  }
});

// T Statistics
jStat.extend({
  // 2 parameter lists
  // (value, mean, sd, n)
  // (value, array)
  tscore: function tscore() {
    var args = slice.call(arguments);
    return (args.length === 4) ?
      ((args[0] - args[1]) / (args[2] / Math.sqrt(args[3]))) :
      ((args[0] - jStat.mean(args[1])) /
       (jStat.stdev(args[1], true) / Math.sqrt(args[1].length)));
  },

  // 3 different paramter lists:
  // (value, mean, sd, n, sides)
  // (tscore, n, sides)
  // (value, array, sides)
  ttest: function ttest() {
    var args = slice.call(arguments);
    var tscore;
    if (args.length === 5) {
      tscore = Math.abs(jStat.tscore(args[0], args[1], args[2], args[3]));
      return (args[4] === 1) ?
        (jStat.studentt.cdf(-tscore, args[3]-1)) :
        (jStat.studentt.cdf(-tscore, args[3]-1)*2);
    }
    if (isNumber(args[1])) {
      tscore = Math.abs(args[0])
      return (args[2] == 1) ?
        (jStat.studentt.cdf(-tscore, args[1]-1)) :
        (jStat.studentt.cdf(-tscore, args[1]-1) * 2);
    }
    tscore = Math.abs(jStat.tscore(args[0], args[1]))
    return (args[2] == 1) ?
      (jStat.studentt.cdf(-tscore, args[1].length-1)) :
      (jStat.studentt.cdf(-tscore, args[1].length-1) * 2);
  }
});

jStat.extend(jStat.fn, {
  tscore: function tscore(value) {
    return (value - this.mean()) / (this.stdev(true) / Math.sqrt(this.cols()));
  },

  ttest: function ttest(value, sides) {
    return (sides === 1) ?
      (1 - jStat.studentt.cdf(Math.abs(this.tscore(value)), this.cols()-1)) :
      (jStat.studentt.cdf(-Math.abs(this.tscore(value)), this.cols()-1)*2);
  }
});

// F Statistics
jStat.extend({
  // Paramter list is as follows:
  // (array1, array2, array3, ...)
  // or it is an array of arrays
  // array of arrays conversion
  anovafscore: function anovafscore() {
    var args = slice.call(arguments),
    expVar, sample, sampMean, sampSampMean, tmpargs, unexpVar, i, j;
    if (args.length === 1) {
      tmpargs = new Array(args[0].length);
      for (i = 0; i < args[0].length; i++) {
        tmpargs[i] = args[0][i];
      }
      args = tmpargs;
    }
    // Builds sample array
    sample = new Array();
    for (i = 0; i < args.length; i++) {
      sample = sample.concat(args[i]);
    }
    sampMean = jStat.mean(sample);
    // Computes the explained variance
    expVar = 0;
    for (i = 0; i < args.length; i++) {
      expVar = expVar + args[i].length * Math.pow(jStat.mean(args[i]) - sampMean, 2);
    }
    expVar /= (args.length - 1);
    // Computes unexplained variance
    unexpVar = 0;
    for (i = 0; i < args.length; i++) {
      sampSampMean = jStat.mean(args[i]);
      for (j = 0; j < args[i].length; j++) {
        unexpVar += Math.pow(args[i][j] - sampSampMean, 2);
      }
    }
    unexpVar /= (sample.length - args.length);
    return expVar / unexpVar;
  },

  // 2 different paramter setups
  // (array1, array2, array3, ...)
  // (anovafscore, df1, df2)
  anovaftest: function anovaftest() {
    var args = slice.call(arguments),
    df1, df2, n, i;
    if (isNumber(args[0])) {
      return 1 - jStat.centralF.cdf(args[0], args[1], args[2]);
    }
    var anovafscore = jStat.anovafscore(args);
    df1 = args.length - 1;
    n = 0;
    for (i = 0; i < args.length; i++) {
      n = n + args[i].length;
    }
    df2 = n - df1 - 1;
    return 1 - jStat.centralF.cdf(anovafscore, df1, df2);
  },

  ftest: function ftest(fscore, df1, df2) {
    return 1 - jStat.centralF.cdf(fscore, df1, df2);
  }
});

jStat.extend(jStat.fn, {
  anovafscore: function anovafscore() {
    return jStat.anovafscore(this.toArray());
  },

  anovaftes: function anovaftes() {
    var n = 0;
    var i;
    for (i = 0; i < this.length; i++) {
      n = n + this[i].length;
    }
    return jStat.ftest(this.anovafscore(), this.length - 1, n - this.length);
  }
});

// Tukey's range test
jStat.extend({
  // 2 parameter lists
  // (mean1, mean2, n1, n2, sd)
  // (array1, array2, sd)
  qscore: function qscore() {
    var args = slice.call(arguments);
    var mean1, mean2, n1, n2, sd;
    if (isNumber(args[0])) {
        mean1 = args[0];
        mean2 = args[1];
        n1 = args[2];
        n2 = args[3];
        sd = args[4];
    } else {
        mean1 = jStat.mean(args[0]);
        mean2 = jStat.mean(args[1]);
        n1 = args[0].length;
        n2 = args[1].length;
        sd = args[2];
    }
    return Math.abs(mean1 - mean2) / (sd * Math.sqrt((1 / n1 + 1 / n2) / 2));
  },

  // 3 different parameter lists:
  // (qscore, n, k)
  // (mean1, mean2, n1, n2, sd, n, k)
  // (array1, array2, sd, n, k)
  qtest: function qtest() {
    var args = slice.call(arguments);

    var qscore;
    if (args.length === 3) {
      qscore = args[0];
      args = args.slice(1);
    } else if (args.length === 7) {
      qscore = jStat.qscore(args[0], args[1], args[2], args[3], args[4]);
      args = args.slice(5);
    } else {
      qscore = jStat.qscore(args[0], args[1], args[2]);
      args = args.slice(3);
    }

    var n = args[0];
    var k = args[1];

    return 1 - jStat.tukey.cdf(qscore, k, n - k);
  },

  tukeyhsd: function tukeyhsd(arrays) {
    var sd = jStat.pooledstdev(arrays);
    var means = arrays.map(function (arr) {return jStat.mean(arr);});
    var n = arrays.reduce(function (n, arr) {return n + arr.length;}, 0);

    var results = [];
    for (var i = 0; i < arrays.length; ++i) {
        for (var j = i + 1; j < arrays.length; ++j) {
            var p = jStat.qtest(means[i], means[j], arrays[i].length, arrays[j].length, sd, n, arrays.length);
            results.push([[i, j], p]);
        }
    }

    return results;
  }
});

// Error Bounds
jStat.extend({
  // 2 different parameter setups
  // (value, alpha, sd, n)
  // (value, alpha, array)
  normalci: function normalci() {
    var args = slice.call(arguments),
    ans = new Array(2),
    change;
    if (args.length === 4) {
      change = Math.abs(jStat.normal.inv(args[1] / 2, 0, 1) *
                        args[2] / Math.sqrt(args[3]));
    } else {
      change = Math.abs(jStat.normal.inv(args[1] / 2, 0, 1) *
                        jStat.stdev(args[2]) / Math.sqrt(args[2].length));
    }
    ans[0] = args[0] - change;
    ans[1] = args[0] + change;
    return ans;
  },

  // 2 different parameter setups
  // (value, alpha, sd, n)
  // (value, alpha, array)
  tci: function tci() {
    var args = slice.call(arguments),
    ans = new Array(2),
    change;
    if (args.length === 4) {
      change = Math.abs(jStat.studentt.inv(args[1] / 2, args[3] - 1) *
                        args[2] / Math.sqrt(args[3]));
    } else {
      change = Math.abs(jStat.studentt.inv(args[1] / 2, args[2].length - 1) *
                        jStat.stdev(args[2], true) / Math.sqrt(args[2].length));
    }
    ans[0] = args[0] - change;
    ans[1] = args[0] + change;
    return ans;
  },

  significant: function significant(pvalue, alpha) {
    return pvalue < alpha;
  }
});

jStat.extend(jStat.fn, {
  normalci: function normalci(value, alpha) {
    return jStat.normalci(value, alpha, this.toArray());
  },

  tci: function tci(value, alpha) {
    return jStat.tci(value, alpha, this.toArray());
  }
});

// internal method for calculating the z-score for a difference of proportions test
function differenceOfProportions(p1, n1, p2, n2) {
  if (p1 > 1 || p2 > 1 || p1 <= 0 || p2 <= 0) {
    throw new Error("Proportions should be greater than 0 and less than 1")
  }
  var pooled = (p1 * n1 + p2 * n2) / (n1 + n2);
  var se = Math.sqrt(pooled * (1 - pooled) * ((1/n1) + (1/n2)));
  return (p1 - p2) / se;
}

// Difference of Proportions
jStat.extend(jStat.fn, {
  oneSidedDifferenceOfProportions: function oneSidedDifferenceOfProportions(p1, n1, p2, n2) {
    var z = differenceOfProportions(p1, n1, p2, n2);
    return jStat.ztest(z, 1);
  },

  twoSidedDifferenceOfProportions: function twoSidedDifferenceOfProportions(p1, n1, p2, n2) {
    var z = differenceOfProportions(p1, n1, p2, n2);
    return jStat.ztest(z, 2);
  }
});

}(jStat, Math));
jStat.models = (function(){
  function sub_regress(exog) {
    var var_count = exog[0].length;
    var modelList = jStat.arange(var_count).map(function(endog_index) {
      var exog_index =
          jStat.arange(var_count).filter(function(i){return i!==endog_index});
      return ols(jStat.col(exog, endog_index).map(function(x){ return x[0] }),
                 jStat.col(exog, exog_index))
    });
    return modelList;
  }

  // do OLS model regress
  // exog have include const columns ,it will not generate it .In fact, exog is
  // "design matrix" look at
  //https://en.wikipedia.org/wiki/Design_matrix
  function ols(endog, exog) {
    var nobs = endog.length;
    var df_model = exog[0].length - 1;
    var df_resid = nobs-df_model - 1;
    var coef = jStat.lstsq(exog, endog);
    var predict =
        jStat.multiply(exog, coef.map(function(x) { return [x] }))
            .map(function(p) { return p[0] });
    var resid = jStat.subtract(endog, predict);
    var ybar = jStat.mean(endog);
    // constant cause problem
    // var SST = jStat.sum(endog.map(function(y) {
    //   return Math.pow(y-ybar,2);
    // }));
    var SSE = jStat.sum(predict.map(function(f) {
      return Math.pow(f - ybar, 2);
    }));
    var SSR = jStat.sum(endog.map(function(y, i) {
      return Math.pow(y - predict[i], 2);
    }));
    var SST = SSE + SSR;
    var R2 = (SSE / SST);
    return {
        exog:exog,
        endog:endog,
        nobs:nobs,
        df_model:df_model,
        df_resid:df_resid,
        coef:coef,
        predict:predict,
        resid:resid,
        ybar:ybar,
        SST:SST,
        SSE:SSE,
        SSR:SSR,
        R2:R2
    };
  }

  // H0: b_I=0
  // H1: b_I!=0
  function t_test(model) {
    var subModelList = sub_regress(model.exog);
    //var sigmaHat=jStat.stdev(model.resid);
    var sigmaHat = Math.sqrt(model.SSR / (model.df_resid));
    var seBetaHat = subModelList.map(function(mod) {
      var SST = mod.SST;
      var R2 = mod.R2;
      return sigmaHat / Math.sqrt(SST * (1 - R2));
    });
    var tStatistic = model.coef.map(function(coef, i) {
      return (coef - 0) / seBetaHat[i];
    });
    var pValue = tStatistic.map(function(t) {
      var leftppf = jStat.studentt.cdf(t, model.df_resid);
      return (leftppf > 0.5 ? 1 - leftppf : leftppf) * 2;
    });
    var c = jStat.studentt.inv(0.975, model.df_resid);
    var interval95 = model.coef.map(function(coef, i) {
      var d = c * seBetaHat[i];
      return [coef - d, coef + d];
    })
    return {
        se: seBetaHat,
        t: tStatistic,
        p: pValue,
        sigmaHat: sigmaHat,
        interval95: interval95
    };
  }

  function F_test(model) {
    var F_statistic =
        (model.R2 / model.df_model) / ((1 - model.R2) / model.df_resid);
    var fcdf = function(x, n1, n2) {
      return jStat.beta.cdf(x / (n2 / n1 + x), n1 / 2, n2 / 2)
    }
    var pvalue = 1 - fcdf(F_statistic, model.df_model, model.df_resid);
    return { F_statistic: F_statistic, pvalue: pvalue };
  }

  function ols_wrap(endog, exog) {
    var model = ols(endog,exog);
    var ttest = t_test(model);
    var ftest = F_test(model);
    // Provide the Wherry / Ezekiel / McNemar / Cohen Adjusted R^2
    // Which matches the 'adjusted R^2' provided by R's lm package
    var adjust_R2 =
        1 - (1 - model.R2) * ((model.nobs - 1) / (model.df_resid));
    model.t = ttest;
    model.f = ftest;
    model.adjust_R2 = adjust_R2;
    return model;
  }

  return { ols: ols_wrap };
})();
//To regress, simply build X matrix
//(append column of 1's) using
//buildxmatrix and build the Y
//matrix using buildymatrix
//(simply the transpose)
//and run regress.



//Regressions

jStat.extend({
  buildxmatrix: function buildxmatrix(){
    //Parameters will be passed in as such
    //(array1,array2,array3,...)
    //as (x1,x2,x3,...)
    //needs to be (1,x1,x2,x3,...)
    var matrixRows = new Array(arguments.length);
    for(var i=0;i<arguments.length;i++){
      var array = [1];
      matrixRows[i]= array.concat(arguments[i]);
    }
    return jStat(matrixRows);

  },

  builddxmatrix: function builddxmatrix() {
    //Paramters will be passed in as such
    //([array1,array2,...]
    var matrixRows = new Array(arguments[0].length);
    for(var i=0;i<arguments[0].length;i++){
      var array = [1]
      matrixRows[i]= array.concat(arguments[0][i]);
    }
    return jStat(matrixRows);

  },

  buildjxmatrix: function buildjxmatrix(jMat) {
    //Builds from jStat Matrix
    var pass = new Array(jMat.length)
    for(var i=0;i<jMat.length;i++){
      pass[i] = jMat[i];
    }
    return jStat.builddxmatrix(pass);

  },

  buildymatrix: function buildymatrix(array){
    return jStat(array).transpose();
  },

  buildjymatrix: function buildjymatrix(jMat){
    return jMat.transpose();
  },

  matrixmult: function matrixmult(A,B){
    var i, j, k, result, sum;
    if (A.cols() == B.rows()) {
      if(B.rows()>1){
        result = [];
        for (i = 0; i < A.rows(); i++) {
          result[i] = [];
          for (j = 0; j < B.cols(); j++) {
            sum = 0;
            for (k = 0; k < A.cols(); k++) {
              sum += A.toArray()[i][k] * B.toArray()[k][j];
            }
            result[i][j] = sum;
          }
        }
        return jStat(result);
      }
      result = [];
      for (i = 0; i < A.rows(); i++) {
        result[i] = [];
        for (j = 0; j < B.cols(); j++) {
          sum = 0;
          for (k = 0; k < A.cols(); k++) {
            sum += A.toArray()[i][k] * B.toArray()[j];
          }
          result[i][j] = sum;
        }
      }
      return jStat(result);
    }
  },

  //regress and regresst to be fixed

  regress: function regress(jMatX,jMatY){
    //print("regressin!");
    //print(jMatX.toArray());
    var innerinv = jStat.xtranspxinv(jMatX);
    //print(innerinv);
    var xtransp = jMatX.transpose();
    var next = jStat.matrixmult(jStat(innerinv),xtransp);
    return jStat.matrixmult(next,jMatY);

  },

  regresst: function regresst(jMatX,jMatY,sides){
    var beta = jStat.regress(jMatX,jMatY);

    var compile = {};
    compile.anova = {};
    var jMatYBar = jStat.jMatYBar(jMatX, beta);
    compile.yBar = jMatYBar;
    var yAverage = jMatY.mean();
    compile.anova.residuals = jStat.residuals(jMatY, jMatYBar);

    compile.anova.ssr = jStat.ssr(jMatYBar, yAverage);
    compile.anova.msr = compile.anova.ssr / (jMatX[0].length - 1);

    compile.anova.sse = jStat.sse(jMatY, jMatYBar);
    compile.anova.mse =
        compile.anova.sse / (jMatY.length - (jMatX[0].length - 1) - 1);

    compile.anova.sst = jStat.sst(jMatY, yAverage);
    compile.anova.mst = compile.anova.sst / (jMatY.length - 1);

    compile.anova.r2 = 1 - (compile.anova.sse / compile.anova.sst);
    if (compile.anova.r2 < 0) compile.anova.r2 = 0;

    compile.anova.fratio = compile.anova.msr / compile.anova.mse;
    compile.anova.pvalue =
        jStat.anovaftest(compile.anova.fratio,
                         jMatX[0].length - 1,
                         jMatY.length - (jMatX[0].length - 1) - 1);

    compile.anova.rmse = Math.sqrt(compile.anova.mse);

    compile.anova.r2adj = 1 - (compile.anova.mse / compile.anova.mst);
    if (compile.anova.r2adj < 0) compile.anova.r2adj = 0;

    compile.stats = new Array(jMatX[0].length);
    var covar = jStat.xtranspxinv(jMatX);
    var sds, ts, ps;

    for(var i=0; i<beta.length;i++){
      sds=Math.sqrt(compile.anova.mse * Math.abs(covar[i][i]));
      ts= Math.abs(beta[i] / sds);
      ps= jStat.ttest(ts, jMatY.length - jMatX[0].length - 1, sides);

      compile.stats[i]=[beta[i], sds, ts, ps];
    }

    compile.regress = beta;
    return compile;
  },

  xtranspx: function xtranspx(jMatX){
    return jStat.matrixmult(jMatX.transpose(),jMatX);
  },


  xtranspxinv: function xtranspxinv(jMatX){
    var inner = jStat.matrixmult(jMatX.transpose(),jMatX);
    var innerinv = jStat.inv(inner);
    return innerinv;
  },

  jMatYBar: function jMatYBar(jMatX, beta) {
    var yBar = jStat.matrixmult(jMatX, beta);
    return new jStat(yBar);
  },

  residuals: function residuals(jMatY, jMatYBar) {
    return jStat.matrixsubtract(jMatY, jMatYBar);
  },

  ssr: function ssr(jMatYBar, yAverage) {
    var ssr = 0;
    for(var i = 0; i < jMatYBar.length; i++) {
      ssr += Math.pow(jMatYBar[i] - yAverage, 2);
    }
    return ssr;
  },

  sse: function sse(jMatY, jMatYBar) {
    var sse = 0;
    for(var i = 0; i < jMatY.length; i++) {
      sse += Math.pow(jMatY[i] - jMatYBar[i], 2);
    }
    return sse;
  },

  sst: function sst(jMatY, yAverage) {
    var sst = 0;
    for(var i = 0; i < jMatY.length; i++) {
      sst += Math.pow(jMatY[i] - yAverage, 2);
    }
    return sst;
  },

  matrixsubtract: function matrixsubtract(A,B){
    var ans = new Array(A.length);
    for(var i=0;i<A.length;i++){
      ans[i] = new Array(A[i].length);
      for(var j=0;j<A[i].length;j++){
        ans[i][j]=A[i][j]-B[i][j];
      }
    }
    return jStat(ans);
  }
});
  // Make it compatible with previous version.
  jStat.jStat = jStat;

  return jStat;
});

},{}],"dataprovider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataprovider = exports.websocket_connection = exports.random_connection = void 0;

var _kefir = _interopRequireDefault(require("kefir"));

var _jstat = _interopRequireDefault(require("jstat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var random_connection = function random_connection() {
  var onstart = function onstart() {};

  var onmessage = function onmessage(value) {};

  var onerror = function onerror(msg) {};

  var retrieve_continue = true;

  var configure = function configure(cmd, value) {
    console.log("Send cmd:", cmd, " value:", value);
  };

  var send = function send(cmd) {
    if (cmd == "stop") {
      retrieve_continue = false;
    }
  };

  var start = function start() {
    self.onstart();
    var index = 0;

    var caller = function caller() {
      var data = random_data_generator();
      var value = {};

      if (index == 0) {
        value.type = "channels";
        value.value = data["channels"];
      } else {
        value.type = index % 2 == 1 ? "timepoint" : "connectivity";
        value.value = data[value.type];
      }

      self.onmessage(JSON.stringify(value));
      index++;
      if (retrieve_continue) setTimeout(caller, random_frequency());
    };

    setTimeout(caller, frequency);
  };

  var frequency = 500;

  var random_frequency = function random_frequency() {
    return Math.max(300, Math.min(2000, frequency + _jstat.default.normal.sample(0, 0.1)));
  };

  var random_data_generator = function random_data_generator() {
    return {
      channels: ["T3", "T4", "F3", "F4"],
      timepoint: [Array.from({
        length: 4
      }, function (v, i) {
        return _jstat.default.normal.sample(0, 1);
      })],
      connectivity: [Array.from({
        length: 16
      }, function (v, i) {
        return [Math.floor(i / 4), i % 4, _jstat.default.normal.sample(0, 1)];
      })]
    };
  };

  var self = {
    configure: configure,
    start: start,
    send: send,
    onstart: onstart,
    onmessage: onmessage,
    onerror: onerror
  };
  return self;
};

exports.random_connection = random_connection;

var websocket_connection = function websocket_connection(_ref) {
  var _ref$server = _ref.server,
      server = _ref$server === void 0 ? "localhost" : _ref$server,
      _ref$port = _ref.port,
      port = _ref$port === void 0 ? 9120 : _ref$port;
  var socket = new WebSocket("ws://".concat(server, ":").concat(port), "ovar-protocol");
  window.socket_ = socket;

  socket.onmessage = function (event) {
    try {
      self.onmessage(event.data);
    } catch (e) {
      console.error(e);
      console.error("#" + event.data);
    }
  };

  socket.onerror = function (d) {
    return self.onerror(d);
  };

  socket.onopen = function (event) {
    self.onstart();
  };

  var onstart = function onstart() {};

  var onmessage = function onmessage(value) {};

  var onerror = function onerror(msg) {};

  var configure = function configure(cmd) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    if (cmd == "close") {
      socket.send(JSON.stringify({
        command: cmd,
        value: value
      }));
      setTimeout(function () {
        return socket.close();
      }, 200);
    }

    var repetitions = ["pause", "stop"].includes(cmd) ? 1000 : 1;

    for (var i = 0; i < repetitions; i++) {
      socket.send(JSON.stringify({
        command: cmd,
        value: value
      }));
    }

    if (["pause", "stop"].includes(cmd)) {
      setTimeout(function () {
        for (var _i = 0; _i < repetitions; _i++) {
          socket.send(JSON.stringify({
            command: cmd,
            value: value
          }));
        }
      }, 100);
      setTimeout(function () {
        for (var _i2 = 0; _i2 < repetitions; _i2++) {
          socket.send(JSON.stringify({
            command: cmd,
            value: value
          }));
        }
      }, 150);
      setTimeout(function () {
        for (var _i3 = 0; _i3 < repetitions; _i3++) {
          socket.send(JSON.stringify({
            command: cmd,
            value: value
          }));
        }
      }, 200);
      setTimeout(function () {
        for (var _i4 = 0; _i4 < repetitions; _i4++) {
          socket.send(JSON.stringify({
            command: cmd,
            value: value
          }));
        }
      }, 250);
    }

    console.log("====CONFIG====");

    for (var _i5 = 0; _i5 < 100; _i5++) {
      console.log(JSON.stringify({
        command: cmd,
        value: value
      }));
    }
  };

  var send = function send(cmd) {
    return configure(cmd, "");
  };

  var start = function start() {
    send("start");
  };

  var ready = function ready() {
    return socket.readyState == 1;
  };

  var self = {
    configure: configure,
    start: start,
    send: send,
    onstart: onstart,
    onmessage: onmessage,
    onerror: onerror,
    ready: ready
  };
  return self;
};

exports.websocket_connection = websocket_connection;

var dataprovider = function dataprovider(connection) {
  var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var subscribers = {};
  subscribers["channels"] = [];
  subscribers["timepoint"] = [];
  subscribers["connectivity"] = [];

  var subscribe = function subscribe(subscription_type, subscriber) {
    console.log("subscribing", subscription_type, subscriber);

    if (!subscribers[subscription_type]) {
      subscribers[subscription_type] = [];
    }

    subscribers[subscription_type].push(subscriber);
    return {
      subscribe: subscribe,
      execute: execute
    };
  };

  var execute = function execute(cmd) {
    connection.send(cmd);
  };

  connection.onmessage = function (raw_value) {
    var value = JSON.parse(raw_value);

    if (!subscribers[value.type]) {
      subscribers[value.type] = [];
    }

    subscribers[value.type].forEach(function (v) {
      return v(value.value);
    }); //console.log("Received", value);
  };

  var proper_start = function proper_start() {
    if (connection.ready()) {
      Object.keys(properties).forEach(function (prop) {
        return connection.configure(prop, properties[prop]);
      });
      connection.start();
    } else {
      setTimeout(proper_start, 100);
    }
  };

  proper_start();
  return {
    subscribe: subscribe,
    execute: execute
  };
};

exports.dataprovider = dataprovider;
},{"kefir":"../../node_modules/kefir/dist/kefir.esm.js","jstat":"../../node_modules/jstat/dist/jstat.js"}],"../../node_modules/konva/lib/Global.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PI_OVER_180 = Math.PI / 180;
function detectBrowser() {
    return (typeof window !== 'undefined' &&
        ({}.toString.call(window) === '[object Window]' ||
            {}.toString.call(window) === '[object global]'));
}
var _detectIE = function (ua) {
    var msie = ua.indexOf('msie ');
    if (msie > 0) {
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    var trident = ua.indexOf('trident/');
    if (trident > 0) {
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    var edge = ua.indexOf('edge/');
    if (edge > 0) {
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
    return false;
};
exports._parseUA = function (userAgent) {
    var ua = userAgent.toLowerCase(), match = /(chrome)[ /]([\w.]+)/.exec(ua) ||
        /(webkit)[ /]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ /]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        (ua.indexOf('compatible') < 0 &&
            /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
        [], mobile = !!userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i), ieMobile = !!userAgent.match(/IEMobile/i);
    return {
        browser: match[1] || '',
        version: match[2] || '0',
        isIE: _detectIE(ua),
        mobile: mobile,
        ieMobile: ieMobile
    };
};
exports.glob = typeof global !== 'undefined'
    ? global
    : typeof window !== 'undefined'
        ? window
        : typeof WorkerGlobalScope !== 'undefined'
            ? self
            : {};
exports.Konva = {
    _global: exports.glob,
    version: '4.2.2',
    isBrowser: detectBrowser(),
    isUnminified: /param/.test(function (param) { }.toString()),
    dblClickWindow: 400,
    getAngle: function (angle) {
        return exports.Konva.angleDeg ? angle * PI_OVER_180 : angle;
    },
    enableTrace: false,
    _pointerEventsEnabled: false,
    hitOnDragEnabled: false,
    captureTouchEventsEnabled: false,
    listenClickTap: false,
    inDblClickWindow: false,
    pixelRatio: undefined,
    dragDistance: 3,
    angleDeg: true,
    showWarnings: true,
    dragButtons: [0, 1],
    isDragging: function () {
        return exports.Konva['DD'].isDragging;
    },
    isDragReady: function () {
        return !!exports.Konva['DD'].node;
    },
    UA: exports._parseUA((exports.glob.navigator && exports.glob.navigator.userAgent) || ''),
    document: exports.glob.document,
    _injectGlobal: function (Konva) {
        exports.glob.Konva = Konva;
    },
    _parseUA: exports._parseUA
};
exports._NODES_REGISTRY = {};
exports._registerNode = function (NodeClass) {
    exports._NODES_REGISTRY[NodeClass.prototype.getClassName()] = NodeClass;
    exports.Konva[NodeClass.prototype.getClassName()] = NodeClass;
};

},{}],"../../node_modules/konva/lib/Util.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("./Global");
var Collection = (function () {
    function Collection() {
    }
    Collection.toCollection = function (arr) {
        var collection = new Collection(), len = arr.length, n;
        for (n = 0; n < len; n++) {
            collection.push(arr[n]);
        }
        return collection;
    };
    Collection._mapMethod = function (methodName) {
        Collection.prototype[methodName] = function () {
            var len = this.length, i;
            var args = [].slice.call(arguments);
            for (i = 0; i < len; i++) {
                this[i][methodName].apply(this[i], args);
            }
            return this;
        };
    };
    Collection.mapMethods = function (constructor) {
        var prot = constructor.prototype;
        for (var methodName in prot) {
            Collection._mapMethod(methodName);
        }
    };
    return Collection;
}());
exports.Collection = Collection;
Collection.prototype = [];
Collection.prototype.each = function (func) {
    for (var n = 0; n < this.length; n++) {
        func(this[n], n);
    }
};
Collection.prototype.toArray = function () {
    var arr = [], len = this.length, n;
    for (n = 0; n < len; n++) {
        arr.push(this[n]);
    }
    return arr;
};
var Transform = (function () {
    function Transform(m) {
        if (m === void 0) { m = [1, 0, 0, 1, 0, 0]; }
        this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
    }
    Transform.prototype.copy = function () {
        return new Transform(this.m);
    };
    Transform.prototype.point = function (point) {
        var m = this.m;
        return {
            x: m[0] * point.x + m[2] * point.y + m[4],
            y: m[1] * point.x + m[3] * point.y + m[5]
        };
    };
    Transform.prototype.translate = function (x, y) {
        this.m[4] += this.m[0] * x + this.m[2] * y;
        this.m[5] += this.m[1] * x + this.m[3] * y;
        return this;
    };
    Transform.prototype.scale = function (sx, sy) {
        this.m[0] *= sx;
        this.m[1] *= sx;
        this.m[2] *= sy;
        this.m[3] *= sy;
        return this;
    };
    Transform.prototype.rotate = function (rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        var m11 = this.m[0] * c + this.m[2] * s;
        var m12 = this.m[1] * c + this.m[3] * s;
        var m21 = this.m[0] * -s + this.m[2] * c;
        var m22 = this.m[1] * -s + this.m[3] * c;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    };
    Transform.prototype.getTranslation = function () {
        return {
            x: this.m[4],
            y: this.m[5]
        };
    };
    Transform.prototype.skew = function (sx, sy) {
        var m11 = this.m[0] + this.m[2] * sy;
        var m12 = this.m[1] + this.m[3] * sy;
        var m21 = this.m[2] + this.m[0] * sx;
        var m22 = this.m[3] + this.m[1] * sx;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    };
    Transform.prototype.multiply = function (matrix) {
        var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
        var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
        var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
        var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
        var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
        var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        this.m[4] = dx;
        this.m[5] = dy;
        return this;
    };
    Transform.prototype.invert = function () {
        var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
        var m0 = this.m[3] * d;
        var m1 = -this.m[1] * d;
        var m2 = -this.m[2] * d;
        var m3 = this.m[0] * d;
        var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
        var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
        return this;
    };
    Transform.prototype.getMatrix = function () {
        return this.m;
    };
    Transform.prototype.setAbsolutePosition = function (x, y) {
        var m0 = this.m[0], m1 = this.m[1], m2 = this.m[2], m3 = this.m[3], m4 = this.m[4], m5 = this.m[5], yt = (m0 * (y - m5) - m1 * (x - m4)) / (m0 * m3 - m1 * m2), xt = (x - m4 - m2 * yt) / m0;
        return this.translate(xt, yt);
    };
    return Transform;
}());
exports.Transform = Transform;
var OBJECT_ARRAY = '[object Array]', OBJECT_NUMBER = '[object Number]', OBJECT_STRING = '[object String]', OBJECT_BOOLEAN = '[object Boolean]', PI_OVER_DEG180 = Math.PI / 180, DEG180_OVER_PI = 180 / Math.PI, HASH = '#', EMPTY_STRING = '', ZERO = '0', KONVA_WARNING = 'Konva warning: ', KONVA_ERROR = 'Konva error: ', RGB_PAREN = 'rgb(', COLORS = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 132, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 255, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 203],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [119, 128, 144],
    slategrey: [119, 128, 144],
    snow: [255, 255, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    transparent: [255, 255, 255, 0],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 5]
}, RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/, animQueue = [];
exports.Util = {
    _isElement: function (obj) {
        return !!(obj && obj.nodeType == 1);
    },
    _isFunction: function (obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    _isPlainObject: function (obj) {
        return !!obj && obj.constructor === Object;
    },
    _isArray: function (obj) {
        return Object.prototype.toString.call(obj) === OBJECT_ARRAY;
    },
    _isNumber: function (obj) {
        return (Object.prototype.toString.call(obj) === OBJECT_NUMBER &&
            !isNaN(obj) &&
            isFinite(obj));
    },
    _isString: function (obj) {
        return Object.prototype.toString.call(obj) === OBJECT_STRING;
    },
    _isBoolean: function (obj) {
        return Object.prototype.toString.call(obj) === OBJECT_BOOLEAN;
    },
    isObject: function (val) {
        return val instanceof Object;
    },
    isValidSelector: function (selector) {
        if (typeof selector !== 'string') {
            return false;
        }
        var firstChar = selector[0];
        return (firstChar === '#' ||
            firstChar === '.' ||
            firstChar === firstChar.toUpperCase());
    },
    _sign: function (number) {
        if (number === 0) {
            return 0;
        }
        if (number > 0) {
            return 1;
        }
        else {
            return -1;
        }
    },
    requestAnimFrame: function (callback) {
        animQueue.push(callback);
        if (animQueue.length === 1) {
            requestAnimationFrame(function () {
                var queue = animQueue;
                animQueue = [];
                queue.forEach(function (cb) {
                    cb();
                });
            });
        }
    },
    createCanvasElement: function () {
        var canvas = document.createElement('canvas');
        try {
            canvas.style = canvas.style || {};
        }
        catch (e) { }
        return canvas;
    },
    createImageElement: function () {
        return document.createElement('img');
    },
    _isInDocument: function (el) {
        while ((el = el.parentNode)) {
            if (el == document) {
                return true;
            }
        }
        return false;
    },
    _simplifyArray: function (arr) {
        var retArr = [], len = arr.length, util = exports.Util, n, val;
        for (n = 0; n < len; n++) {
            val = arr[n];
            if (util._isNumber(val)) {
                val = Math.round(val * 1000) / 1000;
            }
            else if (!util._isString(val)) {
                val = val.toString();
            }
            retArr.push(val);
        }
        return retArr;
    },
    _urlToImage: function (url, callback) {
        var imageObj = new Global_1.glob.Image();
        imageObj.onload = function () {
            callback(imageObj);
        };
        imageObj.src = url;
    },
    _rgbToHex: function (r, g, b) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    _hexToRgb: function (hex) {
        hex = hex.replace(HASH, EMPTY_STRING);
        var bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    },
    getRandomColor: function () {
        var randColor = ((Math.random() * 0xffffff) << 0).toString(16);
        while (randColor.length < 6) {
            randColor = ZERO + randColor;
        }
        return HASH + randColor;
    },
    get: function (val, def) {
        if (val === undefined) {
            return def;
        }
        else {
            return val;
        }
    },
    getRGB: function (color) {
        var rgb;
        if (color in COLORS) {
            rgb = COLORS[color];
            return {
                r: rgb[0],
                g: rgb[1],
                b: rgb[2]
            };
        }
        else if (color[0] === HASH) {
            return this._hexToRgb(color.substring(1));
        }
        else if (color.substr(0, 4) === RGB_PAREN) {
            rgb = RGB_REGEX.exec(color.replace(/ /g, ''));
            return {
                r: parseInt(rgb[1], 10),
                g: parseInt(rgb[2], 10),
                b: parseInt(rgb[3], 10)
            };
        }
        else {
            return {
                r: 0,
                g: 0,
                b: 0
            };
        }
    },
    colorToRGBA: function (str) {
        str = str || 'black';
        return (exports.Util._namedColorToRBA(str) ||
            exports.Util._hex3ColorToRGBA(str) ||
            exports.Util._hex6ColorToRGBA(str) ||
            exports.Util._rgbColorToRGBA(str) ||
            exports.Util._rgbaColorToRGBA(str) ||
            exports.Util._hslColorToRGBA(str));
    },
    _namedColorToRBA: function (str) {
        var c = COLORS[str.toLowerCase()];
        if (!c) {
            return null;
        }
        return {
            r: c[0],
            g: c[1],
            b: c[2],
            a: 1
        };
    },
    _rgbColorToRGBA: function (str) {
        if (str.indexOf('rgb(') === 0) {
            str = str.match(/rgb\(([^)]+)\)/)[1];
            var parts = str.split(/ *, */).map(Number);
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: 1
            };
        }
    },
    _rgbaColorToRGBA: function (str) {
        if (str.indexOf('rgba(') === 0) {
            str = str.match(/rgba\(([^)]+)\)/)[1];
            var parts = str.split(/ *, */).map(Number);
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: parts[3]
            };
        }
    },
    _hex6ColorToRGBA: function (str) {
        if (str[0] === '#' && str.length === 7) {
            return {
                r: parseInt(str.slice(1, 3), 16),
                g: parseInt(str.slice(3, 5), 16),
                b: parseInt(str.slice(5, 7), 16),
                a: 1
            };
        }
    },
    _hex3ColorToRGBA: function (str) {
        if (str[0] === '#' && str.length === 4) {
            return {
                r: parseInt(str[1] + str[1], 16),
                g: parseInt(str[2] + str[2], 16),
                b: parseInt(str[3] + str[3], 16),
                a: 1
            };
        }
    },
    _hslColorToRGBA: function (str) {
        if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(str)) {
            var _a = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(str), _ = _a[0], hsl = _a.slice(1);
            var h = Number(hsl[0]) / 360;
            var s = Number(hsl[1]) / 100;
            var l = Number(hsl[2]) / 100;
            var t2 = void 0;
            var t3 = void 0;
            var val = void 0;
            if (s === 0) {
                val = l * 255;
                return {
                    r: Math.round(val),
                    g: Math.round(val),
                    b: Math.round(val),
                    a: 1
                };
            }
            if (l < 0.5) {
                t2 = l * (1 + s);
            }
            else {
                t2 = l + s - l * s;
            }
            var t1 = 2 * l - t2;
            var rgb = [0, 0, 0];
            for (var i = 0; i < 3; i++) {
                t3 = h + (1 / 3) * -(i - 1);
                if (t3 < 0) {
                    t3++;
                }
                if (t3 > 1) {
                    t3--;
                }
                if (6 * t3 < 1) {
                    val = t1 + (t2 - t1) * 6 * t3;
                }
                else if (2 * t3 < 1) {
                    val = t2;
                }
                else if (3 * t3 < 2) {
                    val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                }
                else {
                    val = t1;
                }
                rgb[i] = val * 255;
            }
            return {
                r: Math.round(rgb[0]),
                g: Math.round(rgb[1]),
                b: Math.round(rgb[2]),
                a: 1
            };
        }
    },
    haveIntersection: function (r1, r2) {
        return !(r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y);
    },
    cloneObject: function (obj) {
        var retObj = {};
        for (var key in obj) {
            if (this._isPlainObject(obj[key])) {
                retObj[key] = this.cloneObject(obj[key]);
            }
            else if (this._isArray(obj[key])) {
                retObj[key] = this.cloneArray(obj[key]);
            }
            else {
                retObj[key] = obj[key];
            }
        }
        return retObj;
    },
    cloneArray: function (arr) {
        return arr.slice(0);
    },
    _degToRad: function (deg) {
        return deg * PI_OVER_DEG180;
    },
    _radToDeg: function (rad) {
        return rad * DEG180_OVER_PI;
    },
    _capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    throw: function (str) {
        throw new Error(KONVA_ERROR + str);
    },
    error: function (str) {
        console.error(KONVA_ERROR + str);
    },
    warn: function (str) {
        if (!Global_1.Konva.showWarnings) {
            return;
        }
        console.warn(KONVA_WARNING + str);
    },
    extend: function (child, parent) {
        function Ctor() {
            this.constructor = child;
        }
        Ctor.prototype = parent.prototype;
        var oldProto = child.prototype;
        child.prototype = new Ctor();
        for (var key in oldProto) {
            if (oldProto.hasOwnProperty(key)) {
                child.prototype[key] = oldProto[key];
            }
        }
        child.__super__ = parent.prototype;
        child.super = parent;
    },
    _getControlPoints: function (x0, y0, x1, y1, x2, y2, t) {
        var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)), d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), fa = (t * d01) / (d01 + d12), fb = (t * d12) / (d01 + d12), p1x = x1 - fa * (x2 - x0), p1y = y1 - fa * (y2 - y0), p2x = x1 + fb * (x2 - x0), p2y = y1 + fb * (y2 - y0);
        return [p1x, p1y, p2x, p2y];
    },
    _expandPoints: function (p, tension) {
        var len = p.length, allPoints = [], n, cp;
        for (n = 2; n < len - 2; n += 2) {
            cp = exports.Util._getControlPoints(p[n - 2], p[n - 1], p[n], p[n + 1], p[n + 2], p[n + 3], tension);
            allPoints.push(cp[0]);
            allPoints.push(cp[1]);
            allPoints.push(p[n]);
            allPoints.push(p[n + 1]);
            allPoints.push(cp[2]);
            allPoints.push(cp[3]);
        }
        return allPoints;
    },
    each: function (obj, func) {
        for (var key in obj) {
            func(key, obj[key]);
        }
    },
    _inRange: function (val, left, right) {
        return left <= val && val < right;
    },
    _getProjectionToSegment: function (x1, y1, x2, y2, x3, y3) {
        var x, y, dist;
        var pd2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        if (pd2 == 0) {
            x = x1;
            y = y1;
            dist = (x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2);
        }
        else {
            var u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / pd2;
            if (u < 0) {
                x = x1;
                y = y1;
                dist = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3);
            }
            else if (u > 1.0) {
                x = x2;
                y = y2;
                dist = (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3);
            }
            else {
                x = x1 + u * (x2 - x1);
                y = y1 + u * (y2 - y1);
                dist = (x - x3) * (x - x3) + (y - y3) * (y - y3);
            }
        }
        return [x, y, dist];
    },
    _getProjectionToLine: function (pt, line, isClosed) {
        var pc = exports.Util.cloneObject(pt);
        var dist = Number.MAX_VALUE;
        line.forEach(function (p1, i) {
            if (!isClosed && i === line.length - 1) {
                return;
            }
            var p2 = line[(i + 1) % line.length];
            var proj = exports.Util._getProjectionToSegment(p1.x, p1.y, p2.x, p2.y, pt.x, pt.y);
            var px = proj[0], py = proj[1], pdist = proj[2];
            if (pdist < dist) {
                pc.x = px;
                pc.y = py;
                dist = pdist;
            }
        });
        return pc;
    },
    _prepareArrayForTween: function (startArray, endArray, isClosed) {
        var n, start = [], end = [];
        if (startArray.length > endArray.length) {
            var temp = endArray;
            endArray = startArray;
            startArray = temp;
        }
        for (n = 0; n < startArray.length; n += 2) {
            start.push({
                x: startArray[n],
                y: startArray[n + 1]
            });
        }
        for (n = 0; n < endArray.length; n += 2) {
            end.push({
                x: endArray[n],
                y: endArray[n + 1]
            });
        }
        var newStart = [];
        end.forEach(function (point) {
            var pr = exports.Util._getProjectionToLine(point, start, isClosed);
            newStart.push(pr.x);
            newStart.push(pr.y);
        });
        return newStart;
    },
    _prepareToStringify: function (obj) {
        var desc;
        obj.visitedByCircularReferenceRemoval = true;
        for (var key in obj) {
            if (!(obj.hasOwnProperty(key) && obj[key] && typeof obj[key] == 'object')) {
                continue;
            }
            desc = Object.getOwnPropertyDescriptor(obj, key);
            if (obj[key].visitedByCircularReferenceRemoval ||
                exports.Util._isElement(obj[key])) {
                if (desc.configurable) {
                    delete obj[key];
                }
                else {
                    return null;
                }
            }
            else if (exports.Util._prepareToStringify(obj[key]) === null) {
                if (desc.configurable) {
                    delete obj[key];
                }
                else {
                    return null;
                }
            }
        }
        delete obj.visitedByCircularReferenceRemoval;
        return obj;
    },
    _assign: function (target, source) {
        for (var key in source) {
            target[key] = source[key];
        }
        return target;
    },
    _getFirstPointerId: function (evt) {
        if (!evt.touches) {
            return 999;
        }
        else {
            return evt.changedTouches[0].identifier;
        }
    }
};

},{"./Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/Validators.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("./Global");
var Util_1 = require("./Util");
function _formatValue(val) {
    if (Util_1.Util._isString(val)) {
        return '"' + val + '"';
    }
    if (Object.prototype.toString.call(val) === '[object Number]') {
        return val;
    }
    if (Util_1.Util._isBoolean(val)) {
        return val;
    }
    return Object.prototype.toString.call(val);
}
function RGBComponent(val) {
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    return Math.round(val);
}
exports.RGBComponent = RGBComponent;
function alphaComponent(val) {
    if (val > 1) {
        return 1;
    }
    else if (val < 0.0001) {
        return 0.0001;
    }
    return val;
}
exports.alphaComponent = alphaComponent;
function getNumberValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            if (!Util_1.Util._isNumber(val)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number.');
            }
            return val;
        };
    }
}
exports.getNumberValidator = getNumberValidator;
function getNumberOrAutoValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            var isNumber = Util_1.Util._isNumber(val);
            var isAuto = val === 'auto';
            if (!(isNumber || isAuto)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number or "auto".');
            }
            return val;
        };
    }
}
exports.getNumberOrAutoValidator = getNumberOrAutoValidator;
function getStringValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            if (!Util_1.Util._isString(val)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a string.');
            }
            return val;
        };
    }
}
exports.getStringValidator = getStringValidator;
function getFunctionValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            if (!Util_1.Util._isFunction(val)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a function.');
            }
            return val;
        };
    }
}
exports.getFunctionValidator = getFunctionValidator;
function getNumberArrayValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            if (!Util_1.Util._isArray(val)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a array of numbers.');
            }
            else {
                val.forEach(function (item) {
                    if (!Util_1.Util._isNumber(item)) {
                        Util_1.Util.warn('"' +
                            attr +
                            '" attribute has non numeric element ' +
                            item +
                            '. Make sure that all elements are numbers.');
                    }
                });
            }
            return val;
        };
    }
}
exports.getNumberArrayValidator = getNumberArrayValidator;
function getBooleanValidator() {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            var isBool = val === true || val === false;
            if (!isBool) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a boolean.');
            }
            return val;
        };
    }
}
exports.getBooleanValidator = getBooleanValidator;
function getComponentValidator(components) {
    if (Global_1.Konva.isUnminified) {
        return function (val, attr) {
            if (!Util_1.Util.isObject(val)) {
                Util_1.Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be an object with properties ' +
                    components);
            }
            return val;
        };
    }
}
exports.getComponentValidator = getComponentValidator;

},{"./Global":"../../node_modules/konva/lib/Global.js","./Util":"../../node_modules/konva/lib/Util.js"}],"../../node_modules/konva/lib/Factory.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Validators_1 = require("./Validators");
var GET = 'get', SET = 'set';
exports.Factory = {
    addGetterSetter: function (constructor, attr, def, validator, after) {
        this.addGetter(constructor, attr, def);
        this.addSetter(constructor, attr, validator, after);
        this.addOverloadedGetterSetter(constructor, attr);
    },
    addGetter: function (constructor, attr, def) {
        var method = GET + Util_1.Util._capitalize(attr);
        constructor.prototype[method] =
            constructor.prototype[method] ||
                function () {
                    var val = this.attrs[attr];
                    return val === undefined ? def : val;
                };
    },
    addSetter: function (constructor, attr, validator, after) {
        var method = SET + Util_1.Util._capitalize(attr);
        if (!constructor.prototype[method]) {
            exports.Factory.overWriteSetter(constructor, attr, validator, after);
        }
    },
    overWriteSetter: function (constructor, attr, validator, after) {
        var method = SET + Util_1.Util._capitalize(attr);
        constructor.prototype[method] = function (val) {
            if (validator && val !== undefined && val !== null) {
                val = validator.call(this, val, attr);
            }
            this._setAttr(attr, val);
            if (after) {
                after.call(this);
            }
            return this;
        };
    },
    addComponentsGetterSetter: function (constructor, attr, components, validator, after) {
        var len = components.length, capitalize = Util_1.Util._capitalize, getter = GET + capitalize(attr), setter = SET + capitalize(attr), n, component;
        constructor.prototype[getter] = function () {
            var ret = {};
            for (n = 0; n < len; n++) {
                component = components[n];
                ret[component] = this.getAttr(attr + capitalize(component));
            }
            return ret;
        };
        var basicValidator = Validators_1.getComponentValidator(components);
        constructor.prototype[setter] = function (val) {
            var oldVal = this.attrs[attr], key;
            if (validator) {
                val = validator.call(this, val);
            }
            if (basicValidator) {
                basicValidator.call(this, val, attr);
            }
            for (key in val) {
                if (!val.hasOwnProperty(key)) {
                    continue;
                }
                this._setAttr(attr + capitalize(key), val[key]);
            }
            this._fireChangeEvent(attr, oldVal, val);
            if (after) {
                after.call(this);
            }
            return this;
        };
        this.addOverloadedGetterSetter(constructor, attr);
    },
    addOverloadedGetterSetter: function (constructor, attr) {
        var capitalizedAttr = Util_1.Util._capitalize(attr), setter = SET + capitalizedAttr, getter = GET + capitalizedAttr;
        constructor.prototype[attr] = function () {
            if (arguments.length) {
                this[setter](arguments[0]);
                return this;
            }
            return this[getter]();
        };
    },
    addDeprecatedGetterSetter: function (constructor, attr, def, validator) {
        Util_1.Util.error('Adding deprecated ' + attr);
        var method = GET + Util_1.Util._capitalize(attr);
        var message = attr +
            ' property is deprecated and will be removed soon. Look at Konva change log for more information.';
        constructor.prototype[method] = function () {
            Util_1.Util.error(message);
            var val = this.attrs[attr];
            return val === undefined ? def : val;
        };
        this.addSetter(constructor, attr, validator, function () {
            Util_1.Util.error(message);
        });
        this.addOverloadedGetterSetter(constructor, attr);
    },
    backCompat: function (constructor, methods) {
        Util_1.Util.each(methods, function (oldMethodName, newMethodName) {
            var method = constructor.prototype[newMethodName];
            var oldGetter = GET + Util_1.Util._capitalize(oldMethodName);
            var oldSetter = SET + Util_1.Util._capitalize(oldMethodName);
            function deprecated() {
                method.apply(this, arguments);
                Util_1.Util.error('"' +
                    oldMethodName +
                    '" method is deprecated and will be removed soon. Use ""' +
                    newMethodName +
                    '" instead.');
            }
            constructor.prototype[oldMethodName] = deprecated;
            constructor.prototype[oldGetter] = deprecated;
            constructor.prototype[oldSetter] = deprecated;
        });
    },
    afterSetFilter: function () {
        this._filterUpToDate = false;
    }
};

},{"./Util":"../../node_modules/konva/lib/Util.js","./Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/Context.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Global_1 = require("./Global");
var COMMA = ',', OPEN_PAREN = '(', CLOSE_PAREN = ')', OPEN_PAREN_BRACKET = '([', CLOSE_BRACKET_PAREN = '])', SEMICOLON = ';', DOUBLE_PAREN = '()', EQUALS = '=', CONTEXT_METHODS = [
    'arc',
    'arcTo',
    'beginPath',
    'bezierCurveTo',
    'clearRect',
    'clip',
    'closePath',
    'createLinearGradient',
    'createPattern',
    'createRadialGradient',
    'drawImage',
    'ellipse',
    'fill',
    'fillText',
    'getImageData',
    'createImageData',
    'lineTo',
    'moveTo',
    'putImageData',
    'quadraticCurveTo',
    'rect',
    'restore',
    'rotate',
    'save',
    'scale',
    'setLineDash',
    'setTransform',
    'stroke',
    'strokeText',
    'transform',
    'translate'
];
var CONTEXT_PROPERTIES = [
    'fillStyle',
    'strokeStyle',
    'shadowColor',
    'shadowBlur',
    'shadowOffsetX',
    'shadowOffsetY',
    'lineCap',
    'lineDashOffset',
    'lineJoin',
    'lineWidth',
    'miterLimit',
    'font',
    'textAlign',
    'textBaseline',
    'globalAlpha',
    'globalCompositeOperation',
    'imageSmoothingEnabled'
];
var traceArrMax = 100;
var Context = (function () {
    function Context(canvas) {
        this.canvas = canvas;
        this._context = canvas._canvas.getContext('2d');
        if (Global_1.Konva.enableTrace) {
            this.traceArr = [];
            this._enableTrace();
        }
    }
    Context.prototype.fillShape = function (shape) {
        if (shape.fillEnabled()) {
            this._fill(shape);
        }
    };
    Context.prototype._fill = function (shape) {
    };
    Context.prototype.strokeShape = function (shape) {
        if (shape.hasStroke()) {
            this._stroke(shape);
        }
    };
    Context.prototype._stroke = function (shape) {
    };
    Context.prototype.fillStrokeShape = function (shape) {
        this.fillShape(shape);
        this.strokeShape(shape);
    };
    Context.prototype.getTrace = function (relaxed) {
        var traceArr = this.traceArr, len = traceArr.length, str = '', n, trace, method, args;
        for (n = 0; n < len; n++) {
            trace = traceArr[n];
            method = trace.method;
            if (method) {
                args = trace.args;
                str += method;
                if (relaxed) {
                    str += DOUBLE_PAREN;
                }
                else {
                    if (Util_1.Util._isArray(args[0])) {
                        str += OPEN_PAREN_BRACKET + args.join(COMMA) + CLOSE_BRACKET_PAREN;
                    }
                    else {
                        str += OPEN_PAREN + args.join(COMMA) + CLOSE_PAREN;
                    }
                }
            }
            else {
                str += trace.property;
                if (!relaxed) {
                    str += EQUALS + trace.val;
                }
            }
            str += SEMICOLON;
        }
        return str;
    };
    Context.prototype.clearTrace = function () {
        this.traceArr = [];
    };
    Context.prototype._trace = function (str) {
        var traceArr = this.traceArr, len;
        traceArr.push(str);
        len = traceArr.length;
        if (len >= traceArrMax) {
            traceArr.shift();
        }
    };
    Context.prototype.reset = function () {
        var pixelRatio = this.getCanvas().getPixelRatio();
        this.setTransform(1 * pixelRatio, 0, 0, 1 * pixelRatio, 0, 0);
    };
    Context.prototype.getCanvas = function () {
        return this.canvas;
    };
    Context.prototype.clear = function (bounds) {
        var canvas = this.getCanvas();
        if (bounds) {
            this.clearRect(bounds.x || 0, bounds.y || 0, bounds.width || 0, bounds.height || 0);
        }
        else {
            this.clearRect(0, 0, canvas.getWidth() / canvas.pixelRatio, canvas.getHeight() / canvas.pixelRatio);
        }
    };
    Context.prototype._applyLineCap = function (shape) {
        var lineCap = shape.getLineCap();
        if (lineCap) {
            this.setAttr('lineCap', lineCap);
        }
    };
    Context.prototype._applyOpacity = function (shape) {
        var absOpacity = shape.getAbsoluteOpacity();
        if (absOpacity !== 1) {
            this.setAttr('globalAlpha', absOpacity);
        }
    };
    Context.prototype._applyLineJoin = function (shape) {
        var lineJoin = shape.getLineJoin();
        if (lineJoin) {
            this.setAttr('lineJoin', lineJoin);
        }
    };
    Context.prototype.setAttr = function (attr, val) {
        this._context[attr] = val;
    };
    Context.prototype.arc = function (a0, a1, a2, a3, a4, a5) {
        this._context.arc(a0, a1, a2, a3, a4, a5);
    };
    Context.prototype.arcTo = function (a0, a1, a2, a3, a4) {
        this._context.arcTo(a0, a1, a2, a3, a4);
    };
    Context.prototype.beginPath = function () {
        this._context.beginPath();
    };
    Context.prototype.bezierCurveTo = function (a0, a1, a2, a3, a4, a5) {
        this._context.bezierCurveTo(a0, a1, a2, a3, a4, a5);
    };
    Context.prototype.clearRect = function (a0, a1, a2, a3) {
        this._context.clearRect(a0, a1, a2, a3);
    };
    Context.prototype.clip = function () {
        this._context.clip();
    };
    Context.prototype.closePath = function () {
        this._context.closePath();
    };
    Context.prototype.createImageData = function (a0, a1) {
        var a = arguments;
        if (a.length === 2) {
            return this._context.createImageData(a0, a1);
        }
        else if (a.length === 1) {
            return this._context.createImageData(a0);
        }
    };
    Context.prototype.createLinearGradient = function (a0, a1, a2, a3) {
        return this._context.createLinearGradient(a0, a1, a2, a3);
    };
    Context.prototype.createPattern = function (a0, a1) {
        return this._context.createPattern(a0, a1);
    };
    Context.prototype.createRadialGradient = function (a0, a1, a2, a3, a4, a5) {
        return this._context.createRadialGradient(a0, a1, a2, a3, a4, a5);
    };
    Context.prototype.drawImage = function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        var a = arguments, _context = this._context;
        if (a.length === 3) {
            _context.drawImage(a0, a1, a2);
        }
        else if (a.length === 5) {
            _context.drawImage(a0, a1, a2, a3, a4);
        }
        else if (a.length === 9) {
            _context.drawImage(a0, a1, a2, a3, a4, a5, a6, a7, a8);
        }
    };
    Context.prototype.ellipse = function (a0, a1, a2, a3, a4, a5, a6, a7) {
        this._context.ellipse(a0, a1, a2, a3, a4, a5, a6, a7);
    };
    Context.prototype.isPointInPath = function (x, y) {
        return this._context.isPointInPath(x, y);
    };
    Context.prototype.fill = function () {
        this._context.fill();
    };
    Context.prototype.fillRect = function (x, y, width, height) {
        this._context.fillRect(x, y, width, height);
    };
    Context.prototype.strokeRect = function (x, y, width, height) {
        this._context.strokeRect(x, y, width, height);
    };
    Context.prototype.fillText = function (a0, a1, a2) {
        this._context.fillText(a0, a1, a2);
    };
    Context.prototype.measureText = function (text) {
        return this._context.measureText(text);
    };
    Context.prototype.getImageData = function (a0, a1, a2, a3) {
        return this._context.getImageData(a0, a1, a2, a3);
    };
    Context.prototype.lineTo = function (a0, a1) {
        this._context.lineTo(a0, a1);
    };
    Context.prototype.moveTo = function (a0, a1) {
        this._context.moveTo(a0, a1);
    };
    Context.prototype.rect = function (a0, a1, a2, a3) {
        this._context.rect(a0, a1, a2, a3);
    };
    Context.prototype.putImageData = function (a0, a1, a2) {
        this._context.putImageData(a0, a1, a2);
    };
    Context.prototype.quadraticCurveTo = function (a0, a1, a2, a3) {
        this._context.quadraticCurveTo(a0, a1, a2, a3);
    };
    Context.prototype.restore = function () {
        this._context.restore();
    };
    Context.prototype.rotate = function (a0) {
        this._context.rotate(a0);
    };
    Context.prototype.save = function () {
        this._context.save();
    };
    Context.prototype.scale = function (a0, a1) {
        this._context.scale(a0, a1);
    };
    Context.prototype.setLineDash = function (a0) {
        if (this._context.setLineDash) {
            this._context.setLineDash(a0);
        }
        else if ('mozDash' in this._context) {
            this._context['mozDash'] = a0;
        }
        else if ('webkitLineDash' in this._context) {
            this._context['webkitLineDash'] = a0;
        }
    };
    Context.prototype.getLineDash = function () {
        return this._context.getLineDash();
    };
    Context.prototype.setTransform = function (a0, a1, a2, a3, a4, a5) {
        this._context.setTransform(a0, a1, a2, a3, a4, a5);
    };
    Context.prototype.stroke = function () {
        this._context.stroke();
    };
    Context.prototype.strokeText = function (a0, a1, a2, a3) {
        this._context.strokeText(a0, a1, a2, a3);
    };
    Context.prototype.transform = function (a0, a1, a2, a3, a4, a5) {
        this._context.transform(a0, a1, a2, a3, a4, a5);
    };
    Context.prototype.translate = function (a0, a1) {
        this._context.translate(a0, a1);
    };
    Context.prototype._enableTrace = function () {
        var that = this, len = CONTEXT_METHODS.length, _simplifyArray = Util_1.Util._simplifyArray, origSetter = this.setAttr, n, args;
        var func = function (methodName) {
            var origMethod = that[methodName], ret;
            that[methodName] = function () {
                args = _simplifyArray(Array.prototype.slice.call(arguments, 0));
                ret = origMethod.apply(that, arguments);
                that._trace({
                    method: methodName,
                    args: args
                });
                return ret;
            };
        };
        for (n = 0; n < len; n++) {
            func(CONTEXT_METHODS[n]);
        }
        that.setAttr = function () {
            origSetter.apply(that, arguments);
            var prop = arguments[0];
            var val = arguments[1];
            if (prop === 'shadowOffsetX' ||
                prop === 'shadowOffsetY' ||
                prop === 'shadowBlur') {
                val = val / this.canvas.getPixelRatio();
            }
            that._trace({
                property: prop,
                val: val
            });
        };
    };
    Context.prototype._applyGlobalCompositeOperation = function (node) {
        var globalCompositeOperation = node.getGlobalCompositeOperation();
        if (globalCompositeOperation !== 'source-over') {
            this.setAttr('globalCompositeOperation', globalCompositeOperation);
        }
    };
    return Context;
}());
exports.Context = Context;
CONTEXT_PROPERTIES.forEach(function (prop) {
    Object.defineProperty(Context.prototype, prop, {
        get: function () {
            return this._context[prop];
        },
        set: function (val) {
            this._context[prop] = val;
        }
    });
});
var SceneContext = (function (_super) {
    __extends(SceneContext, _super);
    function SceneContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SceneContext.prototype._fillColor = function (shape) {
        var fill = shape.fill();
        this.setAttr('fillStyle', fill);
        shape._fillFunc(this);
    };
    SceneContext.prototype._fillPattern = function (shape) {
        var fillPatternX = shape.getFillPatternX(), fillPatternY = shape.getFillPatternY(), fillPatternRotation = Global_1.Konva.getAngle(shape.getFillPatternRotation()), fillPatternOffsetX = shape.getFillPatternOffsetX(), fillPatternOffsetY = shape.getFillPatternOffsetY(), fillPatternScaleX = shape.getFillPatternScaleX(), fillPatternScaleY = shape.getFillPatternScaleY();
        if (fillPatternX || fillPatternY) {
            this.translate(fillPatternX || 0, fillPatternY || 0);
        }
        if (fillPatternRotation) {
            this.rotate(fillPatternRotation);
        }
        if (fillPatternScaleX || fillPatternScaleY) {
            this.scale(fillPatternScaleX, fillPatternScaleY);
        }
        if (fillPatternOffsetX || fillPatternOffsetY) {
            this.translate(-1 * fillPatternOffsetX, -1 * fillPatternOffsetY);
        }
        this.setAttr('fillStyle', shape._getFillPattern());
        shape._fillFunc(this);
    };
    SceneContext.prototype._fillLinearGradient = function (shape) {
        var grd = shape._getLinearGradient();
        if (grd) {
            this.setAttr('fillStyle', grd);
            shape._fillFunc(this);
        }
    };
    SceneContext.prototype._fillRadialGradient = function (shape) {
        var grd = shape._getRadialGradient();
        if (grd) {
            this.setAttr('fillStyle', grd);
            shape._fillFunc(this);
        }
    };
    SceneContext.prototype._fill = function (shape) {
        var hasColor = shape.fill(), fillPriority = shape.getFillPriority();
        if (hasColor && fillPriority === 'color') {
            this._fillColor(shape);
            return;
        }
        var hasPattern = shape.getFillPatternImage();
        if (hasPattern && fillPriority === 'pattern') {
            this._fillPattern(shape);
            return;
        }
        var hasLinearGradient = shape.getFillLinearGradientColorStops();
        if (hasLinearGradient && fillPriority === 'linear-gradient') {
            this._fillLinearGradient(shape);
            return;
        }
        var hasRadialGradient = shape.getFillRadialGradientColorStops();
        if (hasRadialGradient && fillPriority === 'radial-gradient') {
            this._fillRadialGradient(shape);
            return;
        }
        if (hasColor) {
            this._fillColor(shape);
        }
        else if (hasPattern) {
            this._fillPattern(shape);
        }
        else if (hasLinearGradient) {
            this._fillLinearGradient(shape);
        }
        else if (hasRadialGradient) {
            this._fillRadialGradient(shape);
        }
    };
    SceneContext.prototype._strokeLinearGradient = function (shape) {
        var start = shape.getStrokeLinearGradientStartPoint(), end = shape.getStrokeLinearGradientEndPoint(), colorStops = shape.getStrokeLinearGradientColorStops(), grd = this.createLinearGradient(start.x, start.y, end.x, end.y);
        if (colorStops) {
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            this.setAttr('strokeStyle', grd);
        }
    };
    SceneContext.prototype._stroke = function (shape) {
        var dash = shape.dash(), strokeScaleEnabled = shape.getStrokeScaleEnabled();
        if (shape.hasStroke()) {
            if (!strokeScaleEnabled) {
                this.save();
                var pixelRatio = this.getCanvas().getPixelRatio();
                this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            }
            this._applyLineCap(shape);
            if (dash && shape.dashEnabled()) {
                this.setLineDash(dash);
                this.setAttr('lineDashOffset', shape.dashOffset());
            }
            this.setAttr('lineWidth', shape.strokeWidth());
            if (!shape.getShadowForStrokeEnabled()) {
                this.setAttr('shadowColor', 'rgba(0,0,0,0)');
            }
            var hasLinearGradient = shape.getStrokeLinearGradientColorStops();
            if (hasLinearGradient) {
                this._strokeLinearGradient(shape);
            }
            else {
                this.setAttr('strokeStyle', shape.stroke());
            }
            shape._strokeFunc(this);
            if (!strokeScaleEnabled) {
                this.restore();
            }
        }
    };
    SceneContext.prototype._applyShadow = function (shape) {
        var util = Util_1.Util, color = util.get(shape.getShadowRGBA(), 'black'), blur = util.get(shape.getShadowBlur(), 5), offset = util.get(shape.getShadowOffset(), {
            x: 0,
            y: 0
        }), scale = shape.getAbsoluteScale(), ratio = this.canvas.getPixelRatio(), scaleX = scale.x * ratio, scaleY = scale.y * ratio;
        this.setAttr('shadowColor', color);
        this.setAttr('shadowBlur', blur * Math.min(Math.abs(scaleX), Math.abs(scaleY)));
        this.setAttr('shadowOffsetX', offset.x * scaleX);
        this.setAttr('shadowOffsetY', offset.y * scaleY);
    };
    return SceneContext;
}(Context));
exports.SceneContext = SceneContext;
var HitContext = (function (_super) {
    __extends(HitContext, _super);
    function HitContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HitContext.prototype._fill = function (shape) {
        this.save();
        this.setAttr('fillStyle', shape.colorKey);
        shape._fillFuncHit(this);
        this.restore();
    };
    HitContext.prototype.strokeShape = function (shape) {
        if (shape.hasHitStroke()) {
            this._stroke(shape);
        }
    };
    HitContext.prototype._stroke = function (shape) {
        if (shape.hasHitStroke()) {
            var strokeScaleEnabled = shape.getStrokeScaleEnabled();
            if (!strokeScaleEnabled) {
                this.save();
                var pixelRatio = this.getCanvas().getPixelRatio();
                this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            }
            this._applyLineCap(shape);
            var hitStrokeWidth = shape.hitStrokeWidth();
            var strokeWidth = hitStrokeWidth === 'auto' ? shape.strokeWidth() : hitStrokeWidth;
            this.setAttr('lineWidth', strokeWidth);
            this.setAttr('strokeStyle', shape.colorKey);
            shape._strokeFuncHit(this);
            if (!strokeScaleEnabled) {
                this.restore();
            }
        }
    };
    return HitContext;
}(Context));
exports.HitContext = HitContext;

},{"./Util":"../../node_modules/konva/lib/Util.js","./Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/Canvas.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Context_1 = require("./Context");
var Global_1 = require("./Global");
var Factory_1 = require("./Factory");
var Validators_1 = require("./Validators");
var _pixelRatio;
function getDevicePixelRatio() {
    if (_pixelRatio) {
        return _pixelRatio;
    }
    var canvas = Util_1.Util.createCanvasElement();
    var context = canvas.getContext('2d');
    _pixelRatio = (function () {
        var devicePixelRatio = Global_1.Konva._global.devicePixelRatio || 1, backingStoreRatio = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio ||
            1;
        return devicePixelRatio / backingStoreRatio;
    })();
    return _pixelRatio;
}
var Canvas = (function () {
    function Canvas(config) {
        this.pixelRatio = 1;
        this.width = 0;
        this.height = 0;
        this.isCache = false;
        var conf = config || {};
        var pixelRatio = conf.pixelRatio || Global_1.Konva.pixelRatio || getDevicePixelRatio();
        this.pixelRatio = pixelRatio;
        this._canvas = Util_1.Util.createCanvasElement();
        this._canvas.style.padding = '0';
        this._canvas.style.margin = '0';
        this._canvas.style.border = '0';
        this._canvas.style.background = 'transparent';
        this._canvas.style.position = 'absolute';
        this._canvas.style.top = '0';
        this._canvas.style.left = '0';
    }
    Canvas.prototype.getContext = function () {
        return this.context;
    };
    Canvas.prototype.getPixelRatio = function () {
        return this.pixelRatio;
    };
    Canvas.prototype.setPixelRatio = function (pixelRatio) {
        var previousRatio = this.pixelRatio;
        this.pixelRatio = pixelRatio;
        this.setSize(this.getWidth() / previousRatio, this.getHeight() / previousRatio);
    };
    Canvas.prototype.setWidth = function (width) {
        this.width = this._canvas.width = width * this.pixelRatio;
        this._canvas.style.width = width + 'px';
        var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
        _context.scale(pixelRatio, pixelRatio);
    };
    Canvas.prototype.setHeight = function (height) {
        this.height = this._canvas.height = height * this.pixelRatio;
        this._canvas.style.height = height + 'px';
        var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
        _context.scale(pixelRatio, pixelRatio);
    };
    Canvas.prototype.getWidth = function () {
        return this.width;
    };
    Canvas.prototype.getHeight = function () {
        return this.height;
    };
    Canvas.prototype.setSize = function (width, height) {
        this.setWidth(width || 0);
        this.setHeight(height || 0);
    };
    Canvas.prototype.toDataURL = function (mimeType, quality) {
        try {
            return this._canvas.toDataURL(mimeType, quality);
        }
        catch (e) {
            try {
                return this._canvas.toDataURL();
            }
            catch (err) {
                Util_1.Util.error('Unable to get data URL. ' +
                    err.message +
                    ' For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html.');
                return '';
            }
        }
    };
    return Canvas;
}());
exports.Canvas = Canvas;
Factory_1.Factory.addGetterSetter(Canvas, 'pixelRatio', undefined, Validators_1.getNumberValidator());
var SceneCanvas = (function (_super) {
    __extends(SceneCanvas, _super);
    function SceneCanvas(config) {
        if (config === void 0) { config = { width: 0, height: 0 }; }
        var _this = _super.call(this, config) || this;
        _this.context = new Context_1.SceneContext(_this);
        _this.setSize(config.width, config.height);
        return _this;
    }
    return SceneCanvas;
}(Canvas));
exports.SceneCanvas = SceneCanvas;
var HitCanvas = (function (_super) {
    __extends(HitCanvas, _super);
    function HitCanvas(config) {
        if (config === void 0) { config = { width: 0, height: 0 }; }
        var _this = _super.call(this, config) || this;
        _this.hitCanvas = true;
        _this.context = new Context_1.HitContext(_this);
        _this.setSize(config.width, config.height);
        return _this;
    }
    return HitCanvas;
}(Canvas));
exports.HitCanvas = HitCanvas;

},{"./Util":"../../node_modules/konva/lib/Util.js","./Context":"../../node_modules/konva/lib/Context.js","./Global":"../../node_modules/konva/lib/Global.js","./Factory":"../../node_modules/konva/lib/Factory.js","./Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/DragAndDrop.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("./Global");
var Util_1 = require("./Util");
exports.DD = {
    get isDragging() {
        var flag = false;
        exports.DD._dragElements.forEach(function (elem) {
            if (elem.dragStatus === 'dragging') {
                flag = true;
            }
        });
        return flag;
    },
    justDragged: false,
    get node() {
        var node;
        exports.DD._dragElements.forEach(function (elem) {
            node = elem.node;
        });
        return node;
    },
    _dragElements: new Map(),
    _drag: function (evt) {
        exports.DD._dragElements.forEach(function (elem, key) {
            var node = elem.node;
            var stage = node.getStage();
            stage.setPointersPositions(evt);
            if (elem.pointerId === undefined) {
                elem.pointerId = Util_1.Util._getFirstPointerId(evt);
            }
            var pos = stage._changedPointerPositions.find(function (pos) { return pos.id === elem.pointerId; });
            if (!pos) {
                return;
            }
            if (elem.dragStatus !== 'dragging') {
                var dragDistance = node.dragDistance();
                var distance = Math.max(Math.abs(pos.x - elem.startPointerPos.x), Math.abs(pos.y - elem.startPointerPos.y));
                if (distance < dragDistance) {
                    return;
                }
                node.startDrag({ evt: evt });
                if (!node.isDragging()) {
                    return;
                }
            }
            node._setDragPosition(evt, elem);
            node.fire('dragmove', {
                type: 'dragmove',
                target: node,
                evt: evt
            }, true);
        });
    },
    _endDragBefore: function (evt) {
        exports.DD._dragElements.forEach(function (elem, key) {
            var node = elem.node;
            var stage = node.getStage();
            if (evt) {
                stage.setPointersPositions(evt);
            }
            var pos = stage._changedPointerPositions.find(function (pos) { return pos.id === elem.pointerId; });
            if (!pos) {
                return;
            }
            if (elem.dragStatus === 'dragging' || elem.dragStatus === 'stopped') {
                exports.DD.justDragged = true;
                Global_1.Konva.listenClickTap = false;
                elem.dragStatus = 'stopped';
            }
            var drawNode = elem.node.getLayer() ||
                (elem.node instanceof Global_1.Konva['Stage'] && elem.node);
            if (drawNode) {
                drawNode.draw();
            }
        });
    },
    _endDragAfter: function (evt) {
        exports.DD._dragElements.forEach(function (elem, key) {
            if (elem.dragStatus === 'stopped') {
                elem.node.fire('dragend', {
                    type: 'dragend',
                    target: elem.node,
                    evt: evt
                }, true);
            }
            if (elem.dragStatus !== 'dragging') {
                exports.DD._dragElements.delete(key);
            }
        });
    }
};
if (Global_1.Konva.isBrowser) {
    window.addEventListener('mouseup', exports.DD._endDragBefore, true);
    window.addEventListener('touchend', exports.DD._endDragBefore, true);
    window.addEventListener('mousemove', exports.DD._drag);
    window.addEventListener('touchmove', exports.DD._drag);
    window.addEventListener('mouseup', exports.DD._endDragAfter, false);
    window.addEventListener('touchend', exports.DD._endDragAfter, false);
}

},{"./Global":"../../node_modules/konva/lib/Global.js","./Util":"../../node_modules/konva/lib/Util.js"}],"../../node_modules/konva/lib/Node.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Factory_1 = require("./Factory");
var Canvas_1 = require("./Canvas");
var Global_1 = require("./Global");
var DragAndDrop_1 = require("./DragAndDrop");
var Validators_1 = require("./Validators");
exports.ids = {};
exports.names = {};
var _addId = function (node, id) {
    if (!id) {
        return;
    }
    exports.ids[id] = node;
};
exports._removeId = function (id, node) {
    if (!id) {
        return;
    }
    if (exports.ids[id] !== node) {
        return;
    }
    delete exports.ids[id];
};
exports._addName = function (node, name) {
    if (name) {
        if (!exports.names[name]) {
            exports.names[name] = [];
        }
        exports.names[name].push(node);
    }
};
exports._removeName = function (name, _id) {
    if (!name) {
        return;
    }
    var nodes = exports.names[name];
    if (!nodes) {
        return;
    }
    for (var n = 0; n < nodes.length; n++) {
        var no = nodes[n];
        if (no._id === _id) {
            nodes.splice(n, 1);
        }
    }
    if (nodes.length === 0) {
        delete exports.names[name];
    }
};
var ABSOLUTE_OPACITY = 'absoluteOpacity', ABSOLUTE_TRANSFORM = 'absoluteTransform', ABSOLUTE_SCALE = 'absoluteScale', CANVAS = 'canvas', CHANGE = 'Change', CHILDREN = 'children', KONVA = 'konva', LISTENING = 'listening', MOUSEENTER = 'mouseenter', MOUSELEAVE = 'mouseleave', NAME = 'name', SET = 'set', SHAPE = 'Shape', SPACE = ' ', STAGE = 'stage', TRANSFORM = 'transform', UPPER_STAGE = 'Stage', VISIBLE = 'visible', CLONE_BLACK_LIST = ['id'], TRANSFORM_CHANGE_STR = [
    'xChange.konva',
    'yChange.konva',
    'scaleXChange.konva',
    'scaleYChange.konva',
    'skewXChange.konva',
    'skewYChange.konva',
    'rotationChange.konva',
    'offsetXChange.konva',
    'offsetYChange.konva',
    'transformsEnabledChange.konva'
].join(SPACE), SCALE_CHANGE_STR = ['scaleXChange.konva', 'scaleYChange.konva'].join(SPACE);
var emptyChildren = new Util_1.Collection();
var idCounter = 1;
var Node = (function () {
    function Node(config) {
        var _this = this;
        this._id = idCounter++;
        this.eventListeners = {};
        this.attrs = {};
        this.index = 0;
        this.parent = null;
        this._cache = new Map();
        this._lastPos = null;
        this._filterUpToDate = false;
        this._isUnderCache = false;
        this.children = emptyChildren;
        this._dragEventId = null;
        this.setAttrs(config);
        this.on(TRANSFORM_CHANGE_STR, function () {
            _this._clearCache(TRANSFORM);
            _this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        });
        this.on(SCALE_CHANGE_STR, function () {
            _this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
        });
        this.on('visibleChange.konva', function () {
            _this._clearSelfAndDescendantCache(VISIBLE);
        });
        this.on('listeningChange.konva', function () {
            _this._clearSelfAndDescendantCache(LISTENING);
        });
        this.on('opacityChange.konva', function () {
            _this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
        });
    }
    Node.prototype.hasChildren = function () {
        return false;
    };
    Node.prototype.getChildren = function () {
        return emptyChildren;
    };
    Node.prototype._clearCache = function (attr) {
        if (attr) {
            this._cache.delete(attr);
        }
        else {
            this._cache.clear();
        }
    };
    Node.prototype._getCache = function (attr, privateGetter) {
        var cache = this._cache.get(attr);
        if (cache === undefined) {
            cache = privateGetter.call(this);
            this._cache.set(attr, cache);
        }
        return cache;
    };
    Node.prototype._getCanvasCache = function () {
        return this._cache.get(CANVAS);
    };
    Node.prototype._clearSelfAndDescendantCache = function (attr) {
        this._clearCache(attr);
        if (this.isCached()) {
            return;
        }
        if (this.children) {
            this.children.each(function (node) {
                node._clearSelfAndDescendantCache(attr);
            });
        }
    };
    Node.prototype.clearCache = function () {
        this._cache.delete(CANVAS);
        this._clearSelfAndDescendantCache();
        return this;
    };
    Node.prototype.cache = function (config) {
        var conf = config || {};
        var rect = {};
        if (conf.x === undefined ||
            conf.y === undefined ||
            conf.width === undefined ||
            conf.height === undefined) {
            rect = this.getClientRect({
                skipTransform: true,
                relativeTo: this.getParent()
            });
        }
        var width = Math.ceil(conf.width || rect.width), height = Math.ceil(conf.height || rect.height), pixelRatio = conf.pixelRatio, x = conf.x === undefined ? rect.x : conf.x, y = conf.y === undefined ? rect.y : conf.y, offset = conf.offset || 0, drawBorder = conf.drawBorder || false;
        if (!width || !height) {
            Util_1.Util.error('Can not cache the node. Width or height of the node equals 0. Caching is skipped.');
            return;
        }
        width += offset * 2;
        height += offset * 2;
        x -= offset;
        y -= offset;
        var cachedSceneCanvas = new Canvas_1.SceneCanvas({
            pixelRatio: pixelRatio,
            width: width,
            height: height
        }), cachedFilterCanvas = new Canvas_1.SceneCanvas({
            pixelRatio: pixelRatio,
            width: width,
            height: height
        }), cachedHitCanvas = new Canvas_1.HitCanvas({
            pixelRatio: 1,
            width: width,
            height: height
        }), sceneContext = cachedSceneCanvas.getContext(), hitContext = cachedHitCanvas.getContext();
        cachedHitCanvas.isCache = true;
        this._cache.delete('canvas');
        this._filterUpToDate = false;
        if (conf.imageSmoothingEnabled === false) {
            cachedSceneCanvas.getContext()._context.imageSmoothingEnabled = false;
            cachedFilterCanvas.getContext()._context.imageSmoothingEnabled = false;
            cachedHitCanvas.getContext()._context.imageSmoothingEnabled = false;
        }
        sceneContext.save();
        hitContext.save();
        sceneContext.translate(-x, -y);
        hitContext.translate(-x, -y);
        this._isUnderCache = true;
        this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
        this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
        this.drawScene(cachedSceneCanvas, this, true);
        this.drawHit(cachedHitCanvas, this, true);
        this._isUnderCache = false;
        sceneContext.restore();
        hitContext.restore();
        if (drawBorder) {
            sceneContext.save();
            sceneContext.beginPath();
            sceneContext.rect(0, 0, width, height);
            sceneContext.closePath();
            sceneContext.setAttr('strokeStyle', 'red');
            sceneContext.setAttr('lineWidth', 5);
            sceneContext.stroke();
            sceneContext.restore();
        }
        this._cache.set(CANVAS, {
            scene: cachedSceneCanvas,
            filter: cachedFilterCanvas,
            hit: cachedHitCanvas,
            x: x,
            y: y
        });
        return this;
    };
    Node.prototype.isCached = function () {
        return this._cache.has('canvas');
    };
    Node.prototype.getClientRect = function (config) {
        throw new Error('abstract "getClientRect" method call');
    };
    Node.prototype._transformedRect = function (rect, top) {
        var points = [
            { x: rect.x, y: rect.y },
            { x: rect.x + rect.width, y: rect.y },
            { x: rect.x + rect.width, y: rect.y + rect.height },
            { x: rect.x, y: rect.y + rect.height }
        ];
        var minX, minY, maxX, maxY;
        var trans = this.getAbsoluteTransform(top);
        points.forEach(function (point) {
            var transformed = trans.point(point);
            if (minX === undefined) {
                minX = maxX = transformed.x;
                minY = maxY = transformed.y;
            }
            minX = Math.min(minX, transformed.x);
            minY = Math.min(minY, transformed.y);
            maxX = Math.max(maxX, transformed.x);
            maxY = Math.max(maxY, transformed.y);
        });
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    };
    Node.prototype._drawCachedSceneCanvas = function (context) {
        context.save();
        context._applyOpacity(this);
        context._applyGlobalCompositeOperation(this);
        var canvasCache = this._getCanvasCache();
        context.translate(canvasCache.x, canvasCache.y);
        var cacheCanvas = this._getCachedSceneCanvas();
        var ratio = cacheCanvas.pixelRatio;
        context.drawImage(cacheCanvas._canvas, 0, 0, cacheCanvas.width / ratio, cacheCanvas.height / ratio);
        context.restore();
    };
    Node.prototype._drawCachedHitCanvas = function (context) {
        var canvasCache = this._getCanvasCache(), hitCanvas = canvasCache.hit;
        context.save();
        context.translate(canvasCache.x, canvasCache.y);
        context.drawImage(hitCanvas._canvas, 0, 0);
        context.restore();
    };
    Node.prototype._getCachedSceneCanvas = function () {
        var filters = this.filters(), cachedCanvas = this._getCanvasCache(), sceneCanvas = cachedCanvas.scene, filterCanvas = cachedCanvas.filter, filterContext = filterCanvas.getContext(), len, imageData, n, filter;
        if (filters) {
            if (!this._filterUpToDate) {
                var ratio = sceneCanvas.pixelRatio;
                try {
                    len = filters.length;
                    filterContext.clear();
                    filterContext.drawImage(sceneCanvas._canvas, 0, 0, sceneCanvas.getWidth() / ratio, sceneCanvas.getHeight() / ratio);
                    imageData = filterContext.getImageData(0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());
                    for (n = 0; n < len; n++) {
                        filter = filters[n];
                        if (typeof filter !== 'function') {
                            Util_1.Util.error('Filter should be type of function, but got ' +
                                typeof filter +
                                ' instead. Please check correct filters');
                            continue;
                        }
                        filter.call(this, imageData);
                        filterContext.putImageData(imageData, 0, 0);
                    }
                }
                catch (e) {
                    Util_1.Util.error('Unable to apply filter. ' +
                        e.message +
                        ' This post my help you https://konvajs.org/docs/posts/Tainted_Canvas.html.');
                }
                this._filterUpToDate = true;
            }
            return filterCanvas;
        }
        return sceneCanvas;
    };
    Node.prototype.on = function (evtStr, handler) {
        if (arguments.length === 3) {
            return this._delegate.apply(this, arguments);
        }
        var events = evtStr.split(SPACE), len = events.length, n, event, parts, baseEvent, name;
        for (n = 0; n < len; n++) {
            event = events[n];
            parts = event.split('.');
            baseEvent = parts[0];
            name = parts[1] || '';
            if (!this.eventListeners[baseEvent]) {
                this.eventListeners[baseEvent] = [];
            }
            this.eventListeners[baseEvent].push({
                name: name,
                handler: handler
            });
        }
        return this;
    };
    Node.prototype.off = function (evtStr, callback) {
        var events = (evtStr || '').split(SPACE), len = events.length, n, t, event, parts, baseEvent, name;
        if (!evtStr) {
            for (t in this.eventListeners) {
                this._off(t);
            }
        }
        for (n = 0; n < len; n++) {
            event = events[n];
            parts = event.split('.');
            baseEvent = parts[0];
            name = parts[1];
            if (baseEvent) {
                if (this.eventListeners[baseEvent]) {
                    this._off(baseEvent, name, callback);
                }
            }
            else {
                for (t in this.eventListeners) {
                    this._off(t, name, callback);
                }
            }
        }
        return this;
    };
    Node.prototype.dispatchEvent = function (evt) {
        var e = {
            target: this,
            type: evt.type,
            evt: evt
        };
        this.fire(evt.type, e);
        return this;
    };
    Node.prototype.addEventListener = function (type, handler) {
        this.on(type, function (evt) {
            handler.call(this, evt.evt);
        });
        return this;
    };
    Node.prototype.removeEventListener = function (type) {
        this.off(type);
        return this;
    };
    Node.prototype._delegate = function (event, selector, handler) {
        var stopNode = this;
        this.on(event, function (evt) {
            var targets = evt.target.findAncestors(selector, true, stopNode);
            for (var i = 0; i < targets.length; i++) {
                evt = Util_1.Util.cloneObject(evt);
                evt.currentTarget = targets[i];
                handler.call(targets[i], evt);
            }
        });
    };
    Node.prototype.remove = function () {
        if (this.isDragging()) {
            this.stopDrag();
        }
        DragAndDrop_1.DD._dragElements.delete(this._id);
        this._remove();
        return this;
    };
    Node.prototype._clearCaches = function () {
        this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
        this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
        this._clearSelfAndDescendantCache(STAGE);
        this._clearSelfAndDescendantCache(VISIBLE);
        this._clearSelfAndDescendantCache(LISTENING);
    };
    Node.prototype._remove = function () {
        this._clearCaches();
        var parent = this.getParent();
        if (parent && parent.children) {
            parent.children.splice(this.index, 1);
            parent._setChildrenIndices();
            this.parent = null;
        }
    };
    Node.prototype.destroy = function () {
        exports._removeId(this.id(), this);
        var names = (this.name() || '').split(/\s/g);
        for (var i = 0; i < names.length; i++) {
            var subname = names[i];
            exports._removeName(subname, this._id);
        }
        this.remove();
        return this;
    };
    Node.prototype.getAttr = function (attr) {
        var method = 'get' + Util_1.Util._capitalize(attr);
        if (Util_1.Util._isFunction(this[method])) {
            return this[method]();
        }
        return this.attrs[attr];
    };
    Node.prototype.getAncestors = function () {
        var parent = this.getParent(), ancestors = new Util_1.Collection();
        while (parent) {
            ancestors.push(parent);
            parent = parent.getParent();
        }
        return ancestors;
    };
    Node.prototype.getAttrs = function () {
        return this.attrs || {};
    };
    Node.prototype.setAttrs = function (config) {
        var key, method;
        if (!config) {
            return this;
        }
        for (key in config) {
            if (key === CHILDREN) {
                continue;
            }
            method = SET + Util_1.Util._capitalize(key);
            if (Util_1.Util._isFunction(this[method])) {
                this[method](config[key]);
            }
            else {
                this._setAttr(key, config[key]);
            }
        }
        return this;
    };
    Node.prototype.isListening = function () {
        return this._getCache(LISTENING, this._isListening);
    };
    Node.prototype._isListening = function () {
        var listening = this.listening(), parent = this.getParent();
        if (listening === 'inherit') {
            if (parent) {
                return parent.isListening();
            }
            else {
                return true;
            }
        }
        else {
            return listening;
        }
    };
    Node.prototype.isVisible = function () {
        return this._getCache(VISIBLE, this._isVisible);
    };
    Node.prototype._isVisible = function (relativeTo) {
        var visible = this.visible(), parent = this.getParent();
        if (visible === 'inherit') {
            if (parent && parent !== relativeTo) {
                return parent._isVisible(relativeTo);
            }
            else {
                return true;
            }
        }
        else if (relativeTo && relativeTo !== parent) {
            return visible && parent._isVisible(relativeTo);
        }
        else {
            return visible;
        }
    };
    Node.prototype.shouldDrawHit = function () {
        var layer = this.getLayer();
        return ((!layer && this.isListening() && this.isVisible()) ||
            (layer &&
                layer.hitGraphEnabled() &&
                this.isListening() &&
                this.isVisible()));
    };
    Node.prototype.show = function () {
        this.visible(true);
        return this;
    };
    Node.prototype.hide = function () {
        this.visible(false);
        return this;
    };
    Node.prototype.getZIndex = function () {
        return this.index || 0;
    };
    Node.prototype.getAbsoluteZIndex = function () {
        var depth = this.getDepth(), that = this, index = 0, nodes, len, n, child;
        function addChildren(children) {
            nodes = [];
            len = children.length;
            for (n = 0; n < len; n++) {
                child = children[n];
                index++;
                if (child.nodeType !== SHAPE) {
                    nodes = nodes.concat(child.getChildren().toArray());
                }
                if (child._id === that._id) {
                    n = len;
                }
            }
            if (nodes.length > 0 && nodes[0].getDepth() <= depth) {
                addChildren(nodes);
            }
        }
        if (that.nodeType !== UPPER_STAGE) {
            addChildren(that.getStage().getChildren());
        }
        return index;
    };
    Node.prototype.getDepth = function () {
        var depth = 0, parent = this.parent;
        while (parent) {
            depth++;
            parent = parent.parent;
        }
        return depth;
    };
    Node.prototype.setPosition = function (pos) {
        this.x(pos.x);
        this.y(pos.y);
        return this;
    };
    Node.prototype.getPosition = function () {
        return {
            x: this.x(),
            y: this.y()
        };
    };
    Node.prototype.getAbsolutePosition = function (top) {
        var haveCachedParent = false;
        var parent = this.parent;
        while (parent) {
            if (parent.isCached()) {
                haveCachedParent = true;
                break;
            }
            parent = parent.parent;
        }
        if (haveCachedParent && !top) {
            top = true;
        }
        var absoluteMatrix = this.getAbsoluteTransform(top).getMatrix(), absoluteTransform = new Util_1.Transform(), offset = this.offset();
        absoluteTransform.m = absoluteMatrix.slice();
        absoluteTransform.translate(offset.x, offset.y);
        return absoluteTransform.getTranslation();
    };
    Node.prototype.setAbsolutePosition = function (pos) {
        var origTrans = this._clearTransform(), it;
        this.attrs.x = origTrans.x;
        this.attrs.y = origTrans.y;
        delete origTrans.x;
        delete origTrans.y;
        it = this.getAbsoluteTransform();
        it.invert();
        it.translate(pos.x, pos.y);
        pos = {
            x: this.attrs.x + it.getTranslation().x,
            y: this.attrs.y + it.getTranslation().y
        };
        this.setPosition({ x: pos.x, y: pos.y });
        this._setTransform(origTrans);
        return this;
    };
    Node.prototype._setTransform = function (trans) {
        var key;
        for (key in trans) {
            this.attrs[key] = trans[key];
        }
        this._clearCache(TRANSFORM);
        this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
    };
    Node.prototype._clearTransform = function () {
        var trans = {
            x: this.x(),
            y: this.y(),
            rotation: this.rotation(),
            scaleX: this.scaleX(),
            scaleY: this.scaleY(),
            offsetX: this.offsetX(),
            offsetY: this.offsetY(),
            skewX: this.skewX(),
            skewY: this.skewY()
        };
        this.attrs.x = 0;
        this.attrs.y = 0;
        this.attrs.rotation = 0;
        this.attrs.scaleX = 1;
        this.attrs.scaleY = 1;
        this.attrs.offsetX = 0;
        this.attrs.offsetY = 0;
        this.attrs.skewX = 0;
        this.attrs.skewY = 0;
        this._clearCache(TRANSFORM);
        this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        return trans;
    };
    Node.prototype.move = function (change) {
        var changeX = change.x, changeY = change.y, x = this.x(), y = this.y();
        if (changeX !== undefined) {
            x += changeX;
        }
        if (changeY !== undefined) {
            y += changeY;
        }
        this.setPosition({ x: x, y: y });
        return this;
    };
    Node.prototype._eachAncestorReverse = function (func, top) {
        var family = [], parent = this.getParent(), len, n;
        if (top && top._id === this._id) {
            func(this);
            return;
        }
        family.unshift(this);
        while (parent && (!top || parent._id !== top._id)) {
            family.unshift(parent);
            parent = parent.parent;
        }
        len = family.length;
        for (n = 0; n < len; n++) {
            func(family[n]);
        }
    };
    Node.prototype.rotate = function (theta) {
        this.rotation(this.rotation() + theta);
        return this;
    };
    Node.prototype.moveToTop = function () {
        if (!this.parent) {
            Util_1.Util.warn('Node has no parent. moveToTop function is ignored.');
            return false;
        }
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.push(this);
        this.parent._setChildrenIndices();
        return true;
    };
    Node.prototype.moveUp = function () {
        if (!this.parent) {
            Util_1.Util.warn('Node has no parent. moveUp function is ignored.');
            return false;
        }
        var index = this.index, len = this.parent.getChildren().length;
        if (index < len - 1) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index + 1, 0, this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    };
    Node.prototype.moveDown = function () {
        if (!this.parent) {
            Util_1.Util.warn('Node has no parent. moveDown function is ignored.');
            return false;
        }
        var index = this.index;
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index - 1, 0, this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    };
    Node.prototype.moveToBottom = function () {
        if (!this.parent) {
            Util_1.Util.warn('Node has no parent. moveToBottom function is ignored.');
            return false;
        }
        var index = this.index;
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.unshift(this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    };
    Node.prototype.setZIndex = function (zIndex) {
        if (!this.parent) {
            Util_1.Util.warn('Node has no parent. zIndex parameter is ignored.');
            return this;
        }
        if (zIndex < 0 || zIndex >= this.parent.children.length) {
            Util_1.Util.warn('Unexpected value ' +
                zIndex +
                ' for zIndex property. zIndex is just index of a node in children of its parent. Expected value is from 0 to ' +
                (this.parent.children.length - 1) +
                '.');
        }
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.splice(zIndex, 0, this);
        this.parent._setChildrenIndices();
        return this;
    };
    Node.prototype.getAbsoluteOpacity = function () {
        return this._getCache(ABSOLUTE_OPACITY, this._getAbsoluteOpacity);
    };
    Node.prototype._getAbsoluteOpacity = function () {
        var absOpacity = this.opacity();
        var parent = this.getParent();
        if (parent && !parent._isUnderCache) {
            absOpacity *= parent.getAbsoluteOpacity();
        }
        return absOpacity;
    };
    Node.prototype.moveTo = function (newContainer) {
        if (this.getParent() !== newContainer) {
            this._remove();
            newContainer.add(this);
        }
        return this;
    };
    Node.prototype.toObject = function () {
        var obj = {}, attrs = this.getAttrs(), key, val, getter, defaultValue, nonPlainObject;
        obj.attrs = {};
        for (key in attrs) {
            val = attrs[key];
            nonPlainObject =
                Util_1.Util.isObject(val) && !Util_1.Util._isPlainObject(val) && !Util_1.Util._isArray(val);
            if (nonPlainObject) {
                continue;
            }
            getter = typeof this[key] === 'function' && this[key];
            delete attrs[key];
            defaultValue = getter ? getter.call(this) : null;
            attrs[key] = val;
            if (defaultValue !== val) {
                obj.attrs[key] = val;
            }
        }
        obj.className = this.getClassName();
        return Util_1.Util._prepareToStringify(obj);
    };
    Node.prototype.toJSON = function () {
        return JSON.stringify(this.toObject());
    };
    Node.prototype.getParent = function () {
        return this.parent;
    };
    Node.prototype.findAncestors = function (selector, includeSelf, stopNode) {
        var res = [];
        if (includeSelf && this._isMatch(selector)) {
            res.push(this);
        }
        var ancestor = this.parent;
        while (ancestor) {
            if (ancestor === stopNode) {
                return res;
            }
            if (ancestor._isMatch(selector)) {
                res.push(ancestor);
            }
            ancestor = ancestor.parent;
        }
        return res;
    };
    Node.prototype.isAncestorOf = function (node) {
        return false;
    };
    Node.prototype.findAncestor = function (selector, includeSelf, stopNode) {
        return this.findAncestors(selector, includeSelf, stopNode)[0];
    };
    Node.prototype._isMatch = function (selector) {
        if (!selector) {
            return false;
        }
        if (typeof selector === 'function') {
            return selector(this);
        }
        var selectorArr = selector.replace(/ /g, '').split(','), len = selectorArr.length, n, sel;
        for (n = 0; n < len; n++) {
            sel = selectorArr[n];
            if (!Util_1.Util.isValidSelector(sel)) {
                Util_1.Util.warn('Selector "' +
                    sel +
                    '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".');
                Util_1.Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".');
                Util_1.Util.warn('Konva is awesome, right?');
            }
            if (sel.charAt(0) === '#') {
                if (this.id() === sel.slice(1)) {
                    return true;
                }
            }
            else if (sel.charAt(0) === '.') {
                if (this.hasName(sel.slice(1))) {
                    return true;
                }
            }
            else if (this.className === sel || this.nodeType === sel) {
                return true;
            }
        }
        return false;
    };
    Node.prototype.getLayer = function () {
        var parent = this.getParent();
        return parent ? parent.getLayer() : null;
    };
    Node.prototype.getStage = function () {
        return this._getCache(STAGE, this._getStage);
    };
    Node.prototype._getStage = function () {
        var parent = this.getParent();
        if (parent) {
            return parent.getStage();
        }
        else {
            return undefined;
        }
    };
    Node.prototype.fire = function (eventType, evt, bubble) {
        evt = evt || {};
        evt.target = evt.target || this;
        if (bubble) {
            this._fireAndBubble(eventType, evt);
        }
        else {
            this._fire(eventType, evt);
        }
        return this;
    };
    Node.prototype.getAbsoluteTransform = function (top) {
        if (top) {
            return this._getAbsoluteTransform(top);
        }
        else {
            return this._getCache(ABSOLUTE_TRANSFORM, this._getAbsoluteTransform);
        }
    };
    Node.prototype._getAbsoluteTransform = function (top) {
        var at;
        if (top) {
            at = new Util_1.Transform();
            this._eachAncestorReverse(function (node) {
                var transformsEnabled = node.transformsEnabled();
                if (transformsEnabled === 'all') {
                    at.multiply(node.getTransform());
                }
                else if (transformsEnabled === 'position') {
                    at.translate(node.x() - node.offsetX(), node.y() - node.offsetY());
                }
            }, top);
            return at;
        }
        else {
            if (this.parent) {
                at = this.parent.getAbsoluteTransform().copy();
            }
            else {
                at = new Util_1.Transform();
            }
            var transformsEnabled = this.transformsEnabled();
            if (transformsEnabled === 'all') {
                at.multiply(this.getTransform());
            }
            else if (transformsEnabled === 'position') {
                at.translate(this.x() - this.offsetX(), this.y() - this.offsetY());
            }
            return at;
        }
    };
    Node.prototype.getAbsoluteScale = function (top) {
        if (top) {
            return this._getAbsoluteScale(top);
        }
        else {
            return this._getCache(ABSOLUTE_SCALE, this._getAbsoluteScale);
        }
    };
    Node.prototype._getAbsoluteScale = function (top) {
        var parent = this;
        while (parent) {
            if (parent._isUnderCache) {
                top = parent;
            }
            parent = parent.getParent();
        }
        var scaleX = 1, scaleY = 1;
        this._eachAncestorReverse(function (node) {
            scaleX *= node.scaleX();
            scaleY *= node.scaleY();
        }, top);
        return {
            x: scaleX,
            y: scaleY
        };
    };
    Node.prototype.getAbsoluteRotation = function () {
        var parent = this;
        var rotation = 0;
        while (parent) {
            rotation += parent.rotation();
            parent = parent.getParent();
        }
        return rotation;
    };
    Node.prototype.getTransform = function () {
        return this._getCache(TRANSFORM, this._getTransform);
    };
    Node.prototype._getTransform = function () {
        var m = new Util_1.Transform(), x = this.x(), y = this.y(), rotation = Global_1.Konva.getAngle(this.rotation()), scaleX = this.scaleX(), scaleY = this.scaleY(), skewX = this.skewX(), skewY = this.skewY(), offsetX = this.offsetX(), offsetY = this.offsetY();
        if (x !== 0 || y !== 0) {
            m.translate(x, y);
        }
        if (rotation !== 0) {
            m.rotate(rotation);
        }
        if (skewX !== 0 || skewY !== 0) {
            m.skew(skewX, skewY);
        }
        if (scaleX !== 1 || scaleY !== 1) {
            m.scale(scaleX, scaleY);
        }
        if (offsetX !== 0 || offsetY !== 0) {
            m.translate(-1 * offsetX, -1 * offsetY);
        }
        return m;
    };
    Node.prototype.clone = function (obj) {
        var attrs = Util_1.Util.cloneObject(this.attrs), key, allListeners, len, n, listener;
        for (key in obj) {
            attrs[key] = obj[key];
        }
        var node = new this.constructor(attrs);
        for (key in this.eventListeners) {
            allListeners = this.eventListeners[key];
            len = allListeners.length;
            for (n = 0; n < len; n++) {
                listener = allListeners[n];
                if (listener.name.indexOf(KONVA) < 0) {
                    if (!node.eventListeners[key]) {
                        node.eventListeners[key] = [];
                    }
                    node.eventListeners[key].push(listener);
                }
            }
        }
        return node;
    };
    Node.prototype._toKonvaCanvas = function (config) {
        config = config || {};
        var box = this.getClientRect();
        var stage = this.getStage(), x = config.x !== undefined ? config.x : box.x, y = config.y !== undefined ? config.y : box.y, pixelRatio = config.pixelRatio || 1, canvas = new Canvas_1.SceneCanvas({
            width: config.width || box.width || (stage ? stage.width() : 0),
            height: config.height || box.height || (stage ? stage.height() : 0),
            pixelRatio: pixelRatio
        }), context = canvas.getContext();
        context.save();
        if (x || y) {
            context.translate(-1 * x, -1 * y);
        }
        this.drawScene(canvas);
        context.restore();
        return canvas;
    };
    Node.prototype.toCanvas = function (config) {
        return this._toKonvaCanvas(config)._canvas;
    };
    Node.prototype.toDataURL = function (config) {
        config = config || {};
        var mimeType = config.mimeType || null, quality = config.quality || null;
        var url = this._toKonvaCanvas(config).toDataURL(mimeType, quality);
        if (config.callback) {
            config.callback(url);
        }
        return url;
    };
    Node.prototype.toImage = function (config) {
        if (!config || !config.callback) {
            throw 'callback required for toImage method config argument';
        }
        var callback = config.callback;
        delete config.callback;
        Util_1.Util._urlToImage(this.toDataURL(config), function (img) {
            callback(img);
        });
    };
    Node.prototype.setSize = function (size) {
        this.width(size.width);
        this.height(size.height);
        return this;
    };
    Node.prototype.getSize = function () {
        return {
            width: this.width(),
            height: this.height()
        };
    };
    Node.prototype.getClassName = function () {
        return this.className || this.nodeType;
    };
    Node.prototype.getType = function () {
        return this.nodeType;
    };
    Node.prototype.getDragDistance = function () {
        if (this.attrs.dragDistance !== undefined) {
            return this.attrs.dragDistance;
        }
        else if (this.parent) {
            return this.parent.getDragDistance();
        }
        else {
            return Global_1.Konva.dragDistance;
        }
    };
    Node.prototype._off = function (type, name, callback) {
        var evtListeners = this.eventListeners[type], i, evtName, handler;
        for (i = 0; i < evtListeners.length; i++) {
            evtName = evtListeners[i].name;
            handler = evtListeners[i].handler;
            if ((evtName !== 'konva' || name === 'konva') &&
                (!name || evtName === name) &&
                (!callback || callback === handler)) {
                evtListeners.splice(i, 1);
                if (evtListeners.length === 0) {
                    delete this.eventListeners[type];
                    break;
                }
                i--;
            }
        }
    };
    Node.prototype._fireChangeEvent = function (attr, oldVal, newVal) {
        this._fire(attr + CHANGE, {
            oldVal: oldVal,
            newVal: newVal
        });
    };
    Node.prototype.setId = function (id) {
        var oldId = this.id();
        exports._removeId(oldId, this);
        _addId(this, id);
        this._setAttr('id', id);
        return this;
    };
    Node.prototype.setName = function (name) {
        var oldNames = (this.name() || '').split(/\s/g);
        var newNames = (name || '').split(/\s/g);
        var subname, i;
        for (i = 0; i < oldNames.length; i++) {
            subname = oldNames[i];
            if (newNames.indexOf(subname) === -1 && subname) {
                exports._removeName(subname, this._id);
            }
        }
        for (i = 0; i < newNames.length; i++) {
            subname = newNames[i];
            if (oldNames.indexOf(subname) === -1 && subname) {
                exports._addName(this, subname);
            }
        }
        this._setAttr(NAME, name);
        return this;
    };
    Node.prototype.addName = function (name) {
        if (!this.hasName(name)) {
            var oldName = this.name();
            var newName = oldName ? oldName + ' ' + name : name;
            this.setName(newName);
        }
        return this;
    };
    Node.prototype.hasName = function (name) {
        if (!name) {
            return false;
        }
        var fullName = this.name();
        if (!fullName) {
            return false;
        }
        var names = (fullName || '').split(/\s/g);
        return names.indexOf(name) !== -1;
    };
    Node.prototype.removeName = function (name) {
        var names = (this.name() || '').split(/\s/g);
        var index = names.indexOf(name);
        if (index !== -1) {
            names.splice(index, 1);
            this.setName(names.join(' '));
        }
        return this;
    };
    Node.prototype.setAttr = function (attr, val) {
        var func = this[SET + Util_1.Util._capitalize(attr)];
        if (Util_1.Util._isFunction(func)) {
            func.call(this, val);
        }
        else {
            this._setAttr(attr, val);
        }
        return this;
    };
    Node.prototype._setAttr = function (key, val) {
        var oldVal = this.attrs[key];
        if (oldVal === val && !Util_1.Util.isObject(val)) {
            return;
        }
        if (val === undefined || val === null) {
            delete this.attrs[key];
        }
        else {
            this.attrs[key] = val;
        }
        this._fireChangeEvent(key, oldVal, val);
    };
    Node.prototype._setComponentAttr = function (key, component, val) {
        var oldVal;
        if (val !== undefined) {
            oldVal = this.attrs[key];
            if (!oldVal) {
                this.attrs[key] = this.getAttr(key);
            }
            this.attrs[key][component] = val;
            this._fireChangeEvent(key, oldVal, val);
        }
    };
    Node.prototype._fireAndBubble = function (eventType, evt, compareShape) {
        if (evt && this.nodeType === SHAPE) {
            evt.target = this;
        }
        var shouldStop = (eventType === MOUSEENTER || eventType === MOUSELEAVE) &&
            ((compareShape &&
                (this === compareShape ||
                    (this.isAncestorOf && this.isAncestorOf(compareShape)))) ||
                (this.nodeType === 'Stage' && !compareShape));
        if (!shouldStop) {
            this._fire(eventType, evt);
            var stopBubble = (eventType === MOUSEENTER || eventType === MOUSELEAVE) &&
                compareShape &&
                compareShape.isAncestorOf &&
                compareShape.isAncestorOf(this) &&
                !compareShape.isAncestorOf(this.parent);
            if (((evt && !evt.cancelBubble) || !evt) &&
                this.parent &&
                this.parent.isListening() &&
                !stopBubble) {
                if (compareShape && compareShape.parent) {
                    this._fireAndBubble.call(this.parent, eventType, evt, compareShape);
                }
                else {
                    this._fireAndBubble.call(this.parent, eventType, evt);
                }
            }
        }
    };
    Node.prototype._fire = function (eventType, evt) {
        var events = this.eventListeners[eventType], i;
        if (events) {
            evt = evt || {};
            evt.currentTarget = this;
            evt.type = eventType;
            for (i = 0; i < events.length; i++) {
                events[i].handler.call(this, evt);
            }
        }
    };
    Node.prototype.draw = function () {
        this.drawScene();
        this.drawHit();
        return this;
    };
    Node.prototype._createDragElement = function (evt) {
        var pointerId = evt ? evt.pointerId : undefined;
        var stage = this.getStage();
        var ap = this.getAbsolutePosition();
        var pos = stage._getPointerById(pointerId) ||
            stage._changedPointerPositions[0] ||
            ap;
        DragAndDrop_1.DD._dragElements.set(this._id, {
            node: this,
            startPointerPos: pos,
            offset: {
                x: pos.x - ap.x,
                y: pos.y - ap.y
            },
            dragStatus: 'ready',
            pointerId: pointerId
        });
    };
    Node.prototype.startDrag = function (evt) {
        if (!DragAndDrop_1.DD._dragElements.has(this._id)) {
            this._createDragElement(evt);
        }
        var elem = DragAndDrop_1.DD._dragElements.get(this._id);
        elem.dragStatus = 'dragging';
        this.fire('dragstart', {
            type: 'dragstart',
            target: this,
            evt: evt && evt.evt
        }, true);
    };
    Node.prototype._setDragPosition = function (evt, elem) {
        var pos = this.getStage()._getPointerById(elem.pointerId);
        if (!pos) {
            return;
        }
        var newNodePos = {
            x: pos.x - elem.offset.x,
            y: pos.y - elem.offset.y
        };
        var dbf = this.dragBoundFunc();
        if (dbf !== undefined) {
            var bounded = dbf.call(this, newNodePos, evt);
            if (!bounded) {
                Util_1.Util.warn('dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.');
            }
            else {
                newNodePos = bounded;
            }
        }
        if (!this._lastPos ||
            this._lastPos.x !== newNodePos.x ||
            this._lastPos.y !== newNodePos.y) {
            this.setAbsolutePosition(newNodePos);
            if (this.getLayer()) {
                this.getLayer().batchDraw();
            }
            else if (this.getStage()) {
                this.getStage().batchDraw();
            }
        }
        this._lastPos = newNodePos;
    };
    Node.prototype.stopDrag = function (evt) {
        var elem = DragAndDrop_1.DD._dragElements.get(this._id);
        if (elem) {
            elem.dragStatus = 'stopped';
        }
        DragAndDrop_1.DD._endDragBefore(evt);
        DragAndDrop_1.DD._endDragAfter(evt);
    };
    Node.prototype.setDraggable = function (draggable) {
        this._setAttr('draggable', draggable);
        this._dragChange();
    };
    Node.prototype.isDragging = function () {
        var elem = DragAndDrop_1.DD._dragElements.get(this._id);
        return elem ? elem.dragStatus === 'dragging' : false;
    };
    Node.prototype._listenDrag = function () {
        this._dragCleanup();
        this.on('mousedown.konva touchstart.konva', function (evt) {
            var _this = this;
            var shouldCheckButton = evt.evt['button'] !== undefined;
            var canDrag = !shouldCheckButton || Global_1.Konva.dragButtons.indexOf(evt.evt['button']) >= 0;
            if (!canDrag) {
                return;
            }
            if (this.isDragging()) {
                return;
            }
            var hasDraggingChild = false;
            DragAndDrop_1.DD._dragElements.forEach(function (elem) {
                if (_this.isAncestorOf(elem.node)) {
                    hasDraggingChild = true;
                }
            });
            if (!hasDraggingChild) {
                this._createDragElement(evt);
            }
        });
    };
    Node.prototype._dragChange = function () {
        if (this.attrs.draggable) {
            this._listenDrag();
        }
        else {
            this._dragCleanup();
            var stage = this.getStage();
            if (stage && DragAndDrop_1.DD._dragElements.has(this._id)) {
                this.stopDrag();
            }
        }
    };
    Node.prototype._dragCleanup = function () {
        this.off('mousedown.konva');
        this.off('touchstart.konva');
    };
    Node.create = function (data, container) {
        if (Util_1.Util._isString(data)) {
            data = JSON.parse(data);
        }
        return this._createNode(data, container);
    };
    Node._createNode = function (obj, container) {
        var className = Node.prototype.getClassName.call(obj), children = obj.children, no, len, n;
        if (container) {
            obj.attrs.container = container;
        }
        if (!Global_1._NODES_REGISTRY[className]) {
            Util_1.Util.warn('Can not find a node with class name "' +
                className +
                '". Fallback to "Shape".');
            className = 'Shape';
        }
        var Class = Global_1._NODES_REGISTRY[className];
        no = new Class(obj.attrs);
        if (children) {
            len = children.length;
            for (n = 0; n < len; n++) {
                no.add(Node._createNode(children[n]));
            }
        }
        return no;
    };
    return Node;
}());
exports.Node = Node;
Node.prototype.nodeType = 'Node';
Node.prototype._attrsAffectingSize = [];
Factory_1.Factory.addGetterSetter(Node, 'zIndex');
Factory_1.Factory.addGetterSetter(Node, 'absolutePosition');
Factory_1.Factory.addGetterSetter(Node, 'position');
Factory_1.Factory.addGetterSetter(Node, 'x', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Node, 'y', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Node, 'globalCompositeOperation', 'source-over', Validators_1.getStringValidator());
Factory_1.Factory.addGetterSetter(Node, 'opacity', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Node, 'name', '', Validators_1.getStringValidator());
Factory_1.Factory.addGetterSetter(Node, 'id', '', Validators_1.getStringValidator());
Factory_1.Factory.addGetterSetter(Node, 'rotation', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addComponentsGetterSetter(Node, 'scale', ['x', 'y']);
Factory_1.Factory.addGetterSetter(Node, 'scaleX', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Node, 'scaleY', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addComponentsGetterSetter(Node, 'skew', ['x', 'y']);
Factory_1.Factory.addGetterSetter(Node, 'skewX', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Node, 'skewY', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addComponentsGetterSetter(Node, 'offset', ['x', 'y']);
Factory_1.Factory.addGetterSetter(Node, 'offsetX', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Node, 'offsetY', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Node, 'dragDistance', null, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Node, 'width', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Node, 'height', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Node, 'listening', 'inherit', function (val) {
    var isValid = val === true || val === false || val === 'inherit';
    if (!isValid) {
        Util_1.Util.warn(val +
            ' is a not valid value for "listening" attribute. The value may be true, false or "inherit".');
    }
    return val;
});
Factory_1.Factory.addGetterSetter(Node, 'preventDefault', true, Validators_1.getBooleanValidator());
Factory_1.Factory.addGetterSetter(Node, 'filters', null, function (val) {
    this._filterUpToDate = false;
    return val;
});
Factory_1.Factory.addGetterSetter(Node, 'visible', 'inherit', function (val) {
    var isValid = val === true || val === false || val === 'inherit';
    if (!isValid) {
        Util_1.Util.warn(val +
            ' is a not valid value for "visible" attribute. The value may be true, false or "inherit".');
    }
    return val;
});
Factory_1.Factory.addGetterSetter(Node, 'transformsEnabled', 'all', Validators_1.getStringValidator());
Factory_1.Factory.addGetterSetter(Node, 'size');
Factory_1.Factory.addGetterSetter(Node, 'dragBoundFunc');
Factory_1.Factory.addGetterSetter(Node, 'draggable', false, Validators_1.getBooleanValidator());
Factory_1.Factory.backCompat(Node, {
    rotateDeg: 'rotate',
    setRotationDeg: 'setRotation',
    getRotationDeg: 'getRotation'
});
Util_1.Collection.mapMethods(Node);

},{"./Util":"../../node_modules/konva/lib/Util.js","./Factory":"../../node_modules/konva/lib/Factory.js","./Canvas":"../../node_modules/konva/lib/Canvas.js","./Global":"../../node_modules/konva/lib/Global.js","./DragAndDrop":"../../node_modules/konva/lib/DragAndDrop.js","./Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/Container.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Factory_1 = require("./Factory");
var Node_1 = require("./Node");
var DragAndDrop_1 = require("./DragAndDrop");
var Validators_1 = require("./Validators");
var Global_1 = require("./Global");
var Container = (function (_super) {
    __extends(Container, _super);
    function Container() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.children = new Util_1.Collection();
        return _this;
    }
    Container.prototype.getChildren = function (filterFunc) {
        if (!filterFunc) {
            return this.children;
        }
        var results = new Util_1.Collection();
        this.children.each(function (child) {
            if (filterFunc(child)) {
                results.push(child);
            }
        });
        return results;
    };
    Container.prototype.hasChildren = function () {
        return this.getChildren().length > 0;
    };
    Container.prototype.removeChildren = function () {
        var child;
        for (var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            child.parent = null;
            child.index = 0;
            child.remove();
        }
        this.children = new Util_1.Collection();
        return this;
    };
    Container.prototype.destroyChildren = function () {
        var child;
        for (var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            child.parent = null;
            child.index = 0;
            child.destroy();
        }
        this.children = new Util_1.Collection();
        return this;
    };
    Container.prototype.add = function () {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        var child = children[0];
        if (child.getParent()) {
            child.moveTo(this);
            return this;
        }
        var _children = this.children;
        this._validateAdd(child);
        child._clearCaches();
        child.index = _children.length;
        child.parent = this;
        _children.push(child);
        this._fire('add', {
            child: child
        });
        return this;
    };
    Container.prototype.destroy = function () {
        if (this.hasChildren()) {
            this.destroyChildren();
        }
        _super.prototype.destroy.call(this);
        return this;
    };
    Container.prototype.find = function (selector) {
        return this._generalFind(selector, false);
    };
    Container.prototype.get = function (selector) {
        Util_1.Util.warn('collection.get() method is deprecated. Please use collection.find() instead.');
        return this.find(selector);
    };
    Container.prototype.findOne = function (selector) {
        var result = this._generalFind(selector, true);
        return result.length > 0 ? result[0] : undefined;
    };
    Container.prototype._generalFind = function (selector, findOne) {
        var retArr = [];
        this._descendants(function (node) {
            var valid = node._isMatch(selector);
            if (valid) {
                retArr.push(node);
            }
            if (valid && findOne) {
                return true;
            }
            return false;
        });
        return Util_1.Collection.toCollection(retArr);
    };
    Container.prototype._descendants = function (fn) {
        var shouldStop = false;
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            shouldStop = fn(child);
            if (shouldStop) {
                return true;
            }
            if (!child.hasChildren()) {
                continue;
            }
            shouldStop = child._descendants(fn);
            if (shouldStop) {
                return true;
            }
        }
        return false;
    };
    Container.prototype.toObject = function () {
        var obj = Node_1.Node.prototype.toObject.call(this);
        obj.children = [];
        var children = this.getChildren();
        var len = children.length;
        for (var n = 0; n < len; n++) {
            var child = children[n];
            obj.children.push(child.toObject());
        }
        return obj;
    };
    Container.prototype._getDescendants = function (arr) {
        var retArr = [];
        var len = arr.length;
        for (var n = 0; n < len; n++) {
            var node = arr[n];
            if (this.isAncestorOf(node)) {
                retArr.push(node);
            }
        }
        return retArr;
    };
    Container.prototype.isAncestorOf = function (node) {
        var parent = node.getParent();
        while (parent) {
            if (parent._id === this._id) {
                return true;
            }
            parent = parent.getParent();
        }
        return false;
    };
    Container.prototype.clone = function (obj) {
        var node = Node_1.Node.prototype.clone.call(this, obj);
        this.getChildren().each(function (no) {
            node.add(no.clone());
        });
        return node;
    };
    Container.prototype.getAllIntersections = function (pos) {
        var arr = [];
        this.find('Shape').each(function (shape) {
            if (shape.isVisible() && shape.intersects(pos)) {
                arr.push(shape);
            }
        });
        return arr;
    };
    Container.prototype._setChildrenIndices = function () {
        this.children.each(function (child, n) {
            child.index = n;
        });
    };
    Container.prototype.drawScene = function (can, top, caching) {
        var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas()), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedSceneCanvas = cachedCanvas && cachedCanvas.scene;
        if (this.isVisible() || caching) {
            if (!caching && cachedSceneCanvas) {
                context.save();
                layer._applyTransform(this, context, top);
                this._drawCachedSceneCanvas(context);
                context.restore();
            }
            else {
                this._drawChildren(canvas, 'drawScene', top, false, caching, caching);
            }
        }
        return this;
    };
    Container.prototype.drawHit = function (can, top, caching) {
        var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
        if (this.shouldDrawHit(canvas) || caching) {
            if (!caching && cachedHitCanvas) {
                context.save();
                layer._applyTransform(this, context, top);
                this._drawCachedHitCanvas(context);
                context.restore();
            }
            else {
                this._drawChildren(canvas, 'drawHit', top, false, caching, caching);
            }
        }
        return this;
    };
    Container.prototype._drawChildren = function (canvas, drawMethod, top, caching, skipBuffer, skipComposition) {
        var layer = this.getLayer(), context = canvas && canvas.getContext(), clipWidth = this.clipWidth(), clipHeight = this.clipHeight(), clipFunc = this.clipFunc(), hasClip = (clipWidth && clipHeight) || clipFunc, clipX, clipY;
        if (hasClip && layer) {
            context.save();
            var transform = this.getAbsoluteTransform(top);
            var m = transform.getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            context.beginPath();
            if (clipFunc) {
                clipFunc.call(this, context, this);
            }
            else {
                clipX = this.clipX();
                clipY = this.clipY();
                context.rect(clipX, clipY, clipWidth, clipHeight);
            }
            context.clip();
            m = transform
                .copy()
                .invert()
                .getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }
        var hasComposition = this.globalCompositeOperation() !== 'source-over' &&
            !skipComposition &&
            drawMethod === 'drawScene';
        if (hasComposition && layer) {
            context.save();
            context._applyGlobalCompositeOperation(this);
        }
        this.children.each(function (child) {
            child[drawMethod](canvas, top, caching, skipBuffer);
        });
        if (hasComposition && layer) {
            context.restore();
        }
        if (hasClip && layer) {
            context.restore();
        }
    };
    Container.prototype.shouldDrawHit = function (canvas) {
        if (canvas && canvas.isCache) {
            return true;
        }
        var layer = this.getLayer();
        var layerUnderDrag = false;
        DragAndDrop_1.DD._dragElements.forEach(function (elem) {
            if (elem.dragStatus === 'dragging' && elem.node.getLayer() === layer) {
                layerUnderDrag = true;
            }
        });
        var dragSkip = !Global_1.Konva.hitOnDragEnabled && layerUnderDrag;
        return layer && layer.hitGraphEnabled() && this.isVisible() && !dragSkip;
    };
    Container.prototype.getClientRect = function (attrs) {
        attrs = attrs || {};
        var skipTransform = attrs.skipTransform;
        var relativeTo = attrs.relativeTo;
        var minX, minY, maxX, maxY;
        var selfRect = {
            x: Infinity,
            y: Infinity,
            width: 0,
            height: 0
        };
        var that = this;
        this.children.each(function (child) {
            if (!child.visible()) {
                return;
            }
            var rect = child.getClientRect({
                relativeTo: that,
                skipShadow: attrs.skipShadow,
                skipStroke: attrs.skipStroke
            });
            if (rect.width === 0 && rect.height === 0) {
                return;
            }
            if (minX === undefined) {
                minX = rect.x;
                minY = rect.y;
                maxX = rect.x + rect.width;
                maxY = rect.y + rect.height;
            }
            else {
                minX = Math.min(minX, rect.x);
                minY = Math.min(minY, rect.y);
                maxX = Math.max(maxX, rect.x + rect.width);
                maxY = Math.max(maxY, rect.y + rect.height);
            }
        });
        var shapes = this.find('Shape');
        var hasVisible = false;
        for (var i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            if (shape._isVisible(this)) {
                hasVisible = true;
                break;
            }
        }
        if (hasVisible && minX !== undefined) {
            selfRect = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            };
        }
        else {
            selfRect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        }
        if (!skipTransform) {
            return this._transformedRect(selfRect, relativeTo);
        }
        return selfRect;
    };
    return Container;
}(Node_1.Node));
exports.Container = Container;
Factory_1.Factory.addComponentsGetterSetter(Container, 'clip', [
    'x',
    'y',
    'width',
    'height'
]);
Factory_1.Factory.addGetterSetter(Container, 'clipX', undefined, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Container, 'clipY', undefined, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Container, 'clipWidth', undefined, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Container, 'clipHeight', undefined, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Container, 'clipFunc');
Util_1.Collection.mapMethods(Container);

},{"./Util":"../../node_modules/konva/lib/Util.js","./Factory":"../../node_modules/konva/lib/Factory.js","./Node":"../../node_modules/konva/lib/Node.js","./DragAndDrop":"../../node_modules/konva/lib/DragAndDrop.js","./Validators":"../../node_modules/konva/lib/Validators.js","./Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/PointerEvents.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("./Global");
var Captures = new Map();
var SUPPORT_POINTER_EVENTS = Global_1.Konva._global['PointerEvent'] !== undefined;
function getCapturedShape(pointerId) {
    return Captures.get(pointerId);
}
exports.getCapturedShape = getCapturedShape;
function createEvent(evt) {
    return {
        evt: evt,
        pointerId: evt.pointerId
    };
}
exports.createEvent = createEvent;
function hasPointerCapture(pointerId, shape) {
    return Captures.get(pointerId) === shape;
}
exports.hasPointerCapture = hasPointerCapture;
function setPointerCapture(pointerId, shape) {
    releaseCapture(pointerId);
    var stage = shape.getStage();
    if (!stage)
        return;
    Captures.set(pointerId, shape);
    if (SUPPORT_POINTER_EVENTS) {
        shape._fire('gotpointercapture', createEvent(new PointerEvent('gotpointercapture')));
    }
}
exports.setPointerCapture = setPointerCapture;
function releaseCapture(pointerId, target) {
    var shape = Captures.get(pointerId);
    if (!shape)
        return;
    var stage = shape.getStage();
    if (stage && stage.content) {
    }
    Captures.delete(pointerId);
    if (SUPPORT_POINTER_EVENTS) {
        shape._fire('lostpointercapture', createEvent(new PointerEvent('lostpointercapture')));
    }
}
exports.releaseCapture = releaseCapture;

},{"./Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/Stage.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Factory_1 = require("./Factory");
var Container_1 = require("./Container");
var Global_1 = require("./Global");
var Canvas_1 = require("./Canvas");
var DragAndDrop_1 = require("./DragAndDrop");
var Global_2 = require("./Global");
var PointerEvents = require("./PointerEvents");
var STAGE = 'Stage', STRING = 'string', PX = 'px', MOUSEOUT = 'mouseout', MOUSELEAVE = 'mouseleave', MOUSEOVER = 'mouseover', MOUSEENTER = 'mouseenter', MOUSEMOVE = 'mousemove', MOUSEDOWN = 'mousedown', MOUSEUP = 'mouseup', POINTERMOVE = 'pointermove', POINTERDOWN = 'pointerdown', POINTERUP = 'pointerup', POINTERCANCEL = 'pointercancel', LOSTPOINTERCAPTURE = 'lostpointercapture', CONTEXTMENU = 'contextmenu', CLICK = 'click', DBL_CLICK = 'dblclick', TOUCHSTART = 'touchstart', TOUCHEND = 'touchend', TAP = 'tap', DBL_TAP = 'dbltap', TOUCHMOVE = 'touchmove', WHEEL = 'wheel', CONTENT_MOUSEOUT = 'contentMouseout', CONTENT_MOUSEOVER = 'contentMouseover', CONTENT_MOUSEMOVE = 'contentMousemove', CONTENT_MOUSEDOWN = 'contentMousedown', CONTENT_MOUSEUP = 'contentMouseup', CONTENT_CONTEXTMENU = 'contentContextmenu', CONTENT_CLICK = 'contentClick', CONTENT_DBL_CLICK = 'contentDblclick', CONTENT_TOUCHSTART = 'contentTouchstart', CONTENT_TOUCHEND = 'contentTouchend', CONTENT_DBL_TAP = 'contentDbltap', CONTENT_TAP = 'contentTap', CONTENT_TOUCHMOVE = 'contentTouchmove', CONTENT_POINTERMOVE = 'contentPointermove', CONTENT_POINTERDOWN = 'contentPointerdown', CONTENT_POINTERUP = 'contentPointerup', CONTENT_WHEEL = 'contentWheel', RELATIVE = 'relative', KONVA_CONTENT = 'konvajs-content', SPACE = ' ', UNDERSCORE = '_', CONTAINER = 'container', MAX_LAYERS_NUMBER = 5, EMPTY_STRING = '', EVENTS = [
    MOUSEENTER,
    MOUSEDOWN,
    MOUSEMOVE,
    MOUSEUP,
    MOUSEOUT,
    TOUCHSTART,
    TOUCHMOVE,
    TOUCHEND,
    MOUSEOVER,
    WHEEL,
    CONTEXTMENU,
    POINTERDOWN,
    POINTERMOVE,
    POINTERUP,
    POINTERCANCEL,
    LOSTPOINTERCAPTURE
], eventsLength = EVENTS.length;
function addEvent(ctx, eventName) {
    ctx.content.addEventListener(eventName, function (evt) {
        ctx[UNDERSCORE + eventName](evt);
    }, false);
}
var NO_POINTERS_MESSAGE = "Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);";
exports.stages = [];
function checkNoClip(attrs) {
    if (attrs === void 0) { attrs = {}; }
    if (attrs.clipFunc || attrs.clipWidth || attrs.clipHeight) {
        Util_1.Util.warn('Stage does not support clipping. Please use clip for Layers or Groups.');
    }
    return attrs;
}
var Stage = (function (_super) {
    __extends(Stage, _super);
    function Stage(config) {
        var _this = _super.call(this, checkNoClip(config)) || this;
        _this._pointerPositions = [];
        _this._changedPointerPositions = [];
        _this._buildDOM();
        _this._bindContentEvents();
        exports.stages.push(_this);
        _this.on('widthChange.konva heightChange.konva', _this._resizeDOM);
        _this.on('visibleChange.konva', _this._checkVisibility);
        _this.on('clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva', function () {
            checkNoClip(_this.attrs);
        });
        _this._checkVisibility();
        return _this;
    }
    Stage.prototype._validateAdd = function (child) {
        var isLayer = child.getType() === 'Layer';
        var isFastLayer = child.getType() === 'FastLayer';
        var valid = isLayer || isFastLayer;
        if (!valid) {
            Util_1.Util.throw('You may only add layers to the stage.');
        }
    };
    Stage.prototype._checkVisibility = function () {
        if (!this.content) {
            return;
        }
        var style = this.visible() ? '' : 'none';
        this.content.style.display = style;
    };
    Stage.prototype.setContainer = function (container) {
        if (typeof container === STRING) {
            if (container.charAt(0) === '.') {
                var className = container.slice(1);
                container = document.getElementsByClassName(className)[0];
            }
            else {
                var id;
                if (container.charAt(0) !== '#') {
                    id = container;
                }
                else {
                    id = container.slice(1);
                }
                container = document.getElementById(id);
            }
            if (!container) {
                throw 'Can not find container in document with id ' + id;
            }
        }
        this._setAttr(CONTAINER, container);
        if (this.content) {
            if (this.content.parentElement) {
                this.content.parentElement.removeChild(this.content);
            }
            container.appendChild(this.content);
        }
        return this;
    };
    Stage.prototype.shouldDrawHit = function () {
        return true;
    };
    Stage.prototype.clear = function () {
        var layers = this.children, len = layers.length, n;
        for (n = 0; n < len; n++) {
            layers[n].clear();
        }
        return this;
    };
    Stage.prototype.clone = function (obj) {
        if (!obj) {
            obj = {};
        }
        obj.container = document.createElement('div');
        return Container_1.Container.prototype.clone.call(this, obj);
    };
    Stage.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        var content = this.content;
        if (content && Util_1.Util._isInDocument(content)) {
            this.container().removeChild(content);
        }
        var index = exports.stages.indexOf(this);
        if (index > -1) {
            exports.stages.splice(index, 1);
        }
        return this;
    };
    Stage.prototype.getPointerPosition = function () {
        var pos = this._pointerPositions[0] || this._changedPointerPositions[0];
        if (!pos) {
            Util_1.Util.warn(NO_POINTERS_MESSAGE);
            return null;
        }
        return {
            x: pos.x,
            y: pos.y
        };
    };
    Stage.prototype._getPointerById = function (id) {
        return this._pointerPositions.find(function (p) { return p.id === id; });
    };
    Stage.prototype.getPointersPositions = function () {
        return this._pointerPositions;
    };
    Stage.prototype.getStage = function () {
        return this;
    };
    Stage.prototype.getContent = function () {
        return this.content;
    };
    Stage.prototype._toKonvaCanvas = function (config) {
        config = config || {};
        var x = config.x || 0, y = config.y || 0, canvas = new Canvas_1.SceneCanvas({
            width: config.width || this.width(),
            height: config.height || this.height(),
            pixelRatio: config.pixelRatio || 1
        }), _context = canvas.getContext()._context, layers = this.children;
        if (x || y) {
            _context.translate(-1 * x, -1 * y);
        }
        layers.each(function (layer) {
            if (!layer.isVisible()) {
                return;
            }
            var layerCanvas = layer._toKonvaCanvas(config);
            _context.drawImage(layerCanvas._canvas, x, y, layerCanvas.getWidth() / layerCanvas.getPixelRatio(), layerCanvas.getHeight() / layerCanvas.getPixelRatio());
        });
        return canvas;
    };
    Stage.prototype.getIntersection = function (pos, selector) {
        if (!pos) {
            return null;
        }
        var layers = this.children, len = layers.length, end = len - 1, n, shape;
        for (n = end; n >= 0; n--) {
            shape = layers[n].getIntersection(pos, selector);
            if (shape) {
                return shape;
            }
        }
        return null;
    };
    Stage.prototype._resizeDOM = function () {
        var width = this.width();
        var height = this.height();
        if (this.content) {
            this.content.style.width = width + PX;
            this.content.style.height = height + PX;
        }
        this.bufferCanvas.setSize(width, height);
        this.bufferHitCanvas.setSize(width, height);
        this.children.each(function (layer) {
            layer.setSize({ width: width, height: height });
            layer.draw();
        });
    };
    Stage.prototype.add = function (layer) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        _super.prototype.add.call(this, layer);
        var length = this.children.length;
        if (length > MAX_LAYERS_NUMBER) {
            Util_1.Util.warn('The stage has ' +
                length +
                ' layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group.');
        }
        layer._setCanvasSize(this.width(), this.height());
        layer.draw();
        if (Global_1.Konva.isBrowser) {
            this.content.appendChild(layer.canvas._canvas);
        }
        return this;
    };
    Stage.prototype.getParent = function () {
        return null;
    };
    Stage.prototype.getLayer = function () {
        return null;
    };
    Stage.prototype.hasPointerCapture = function (pointerId) {
        return PointerEvents.hasPointerCapture(pointerId, this);
    };
    Stage.prototype.setPointerCapture = function (pointerId) {
        PointerEvents.setPointerCapture(pointerId, this);
    };
    Stage.prototype.releaseCapture = function (pointerId) {
        PointerEvents.releaseCapture(pointerId, this);
    };
    Stage.prototype.getLayers = function () {
        return this.getChildren();
    };
    Stage.prototype._bindContentEvents = function () {
        if (!Global_1.Konva.isBrowser) {
            return;
        }
        for (var n = 0; n < eventsLength; n++) {
            addEvent(this, EVENTS[n]);
        }
    };
    Stage.prototype._mouseenter = function (evt) {
        this.setPointersPositions(evt);
        this._fire(MOUSEENTER, { evt: evt, target: this, currentTarget: this });
    };
    Stage.prototype._mouseover = function (evt) {
        this.setPointersPositions(evt);
        this._fire(CONTENT_MOUSEOVER, { evt: evt });
        this._fire(MOUSEOVER, { evt: evt, target: this, currentTarget: this });
    };
    Stage.prototype._mouseout = function (evt) {
        this.setPointersPositions(evt);
        var targetShape = this.targetShape;
        var eventsEnabled = !DragAndDrop_1.DD.isDragging || Global_1.Konva.hitOnDragEnabled;
        if (targetShape && eventsEnabled) {
            targetShape._fireAndBubble(MOUSEOUT, { evt: evt });
            targetShape._fireAndBubble(MOUSELEAVE, { evt: evt });
            this._fire(MOUSELEAVE, { evt: evt, target: this, currentTarget: this });
            this.targetShape = null;
        }
        else if (eventsEnabled) {
            this._fire(MOUSELEAVE, {
                evt: evt,
                target: this,
                currentTarget: this
            });
            this._fire(MOUSEOUT, {
                evt: evt,
                target: this,
                currentTarget: this
            });
        }
        this.pointerPos = undefined;
        this._pointerPositions = [];
        this._fire(CONTENT_MOUSEOUT, { evt: evt });
    };
    Stage.prototype._mousemove = function (evt) {
        if (Global_1.Konva.UA.ieMobile) {
            return this._touchmove(evt);
        }
        this.setPointersPositions(evt);
        var pointerId = Util_1.Util._getFirstPointerId(evt);
        var shape;
        var eventsEnabled = !DragAndDrop_1.DD.isDragging || Global_1.Konva.hitOnDragEnabled;
        if (eventsEnabled) {
            shape = this.getIntersection(this.getPointerPosition());
            if (shape && shape.isListening()) {
                var differentTarget = !this.targetShape || this.targetShape !== shape;
                if (eventsEnabled && differentTarget) {
                    if (this.targetShape) {
                        this.targetShape._fireAndBubble(MOUSEOUT, { evt: evt, pointerId: pointerId }, shape);
                        this.targetShape._fireAndBubble(MOUSELEAVE, { evt: evt, pointerId: pointerId }, shape);
                    }
                    shape._fireAndBubble(MOUSEOVER, { evt: evt, pointerId: pointerId }, this.targetShape);
                    shape._fireAndBubble(MOUSEENTER, { evt: evt, pointerId: pointerId }, this.targetShape);
                    shape._fireAndBubble(MOUSEMOVE, { evt: evt, pointerId: pointerId });
                    this.targetShape = shape;
                }
                else {
                    shape._fireAndBubble(MOUSEMOVE, { evt: evt, pointerId: pointerId });
                }
            }
            else {
                if (this.targetShape && eventsEnabled) {
                    this.targetShape._fireAndBubble(MOUSEOUT, { evt: evt, pointerId: pointerId });
                    this.targetShape._fireAndBubble(MOUSELEAVE, { evt: evt, pointerId: pointerId });
                    this._fire(MOUSEOVER, {
                        evt: evt,
                        target: this,
                        currentTarget: this,
                        pointerId: pointerId
                    });
                    this.targetShape = null;
                }
                this._fire(MOUSEMOVE, {
                    evt: evt,
                    target: this,
                    currentTarget: this,
                    pointerId: pointerId
                });
            }
            this._fire(CONTENT_MOUSEMOVE, { evt: evt });
        }
        if (evt.cancelable) {
            evt.preventDefault();
        }
    };
    Stage.prototype._mousedown = function (evt) {
        if (Global_1.Konva.UA.ieMobile) {
            return this._touchstart(evt);
        }
        this.setPointersPositions(evt);
        var pointerId = Util_1.Util._getFirstPointerId(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        DragAndDrop_1.DD.justDragged = false;
        Global_1.Konva.listenClickTap = true;
        if (shape && shape.isListening()) {
            this.clickStartShape = shape;
            shape._fireAndBubble(MOUSEDOWN, { evt: evt, pointerId: pointerId });
        }
        else {
            this._fire(MOUSEDOWN, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: pointerId
            });
        }
        this._fire(CONTENT_MOUSEDOWN, { evt: evt });
    };
    Stage.prototype._mouseup = function (evt) {
        if (Global_1.Konva.UA.ieMobile) {
            return this._touchend(evt);
        }
        this.setPointersPositions(evt);
        var pointerId = Util_1.Util._getFirstPointerId(evt);
        var shape = this.getIntersection(this.getPointerPosition()), clickStartShape = this.clickStartShape, clickEndShape = this.clickEndShape, fireDblClick = false;
        if (Global_1.Konva.inDblClickWindow) {
            fireDblClick = true;
            clearTimeout(this.dblTimeout);
        }
        else if (!DragAndDrop_1.DD.justDragged) {
            Global_1.Konva.inDblClickWindow = true;
            clearTimeout(this.dblTimeout);
        }
        this.dblTimeout = setTimeout(function () {
            Global_1.Konva.inDblClickWindow = false;
        }, Global_1.Konva.dblClickWindow);
        if (shape && shape.isListening()) {
            this.clickEndShape = shape;
            shape._fireAndBubble(MOUSEUP, { evt: evt, pointerId: pointerId });
            if (Global_1.Konva.listenClickTap &&
                clickStartShape &&
                clickStartShape._id === shape._id) {
                shape._fireAndBubble(CLICK, { evt: evt, pointerId: pointerId });
                if (fireDblClick && clickEndShape && clickEndShape === shape) {
                    shape._fireAndBubble(DBL_CLICK, { evt: evt, pointerId: pointerId });
                }
            }
        }
        else {
            this._fire(MOUSEUP, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: pointerId
            });
            if (Global_1.Konva.listenClickTap) {
                this._fire(CLICK, {
                    evt: evt,
                    target: this,
                    currentTarget: this,
                    pointerId: pointerId
                });
            }
            if (fireDblClick) {
                this._fire(DBL_CLICK, {
                    evt: evt,
                    target: this,
                    currentTarget: this,
                    pointerId: pointerId
                });
            }
        }
        this._fire(CONTENT_MOUSEUP, { evt: evt });
        if (Global_1.Konva.listenClickTap) {
            this._fire(CONTENT_CLICK, { evt: evt });
            if (fireDblClick) {
                this._fire(CONTENT_DBL_CLICK, { evt: evt });
            }
        }
        Global_1.Konva.listenClickTap = false;
        if (evt.cancelable) {
            evt.preventDefault();
        }
    };
    Stage.prototype._contextmenu = function (evt) {
        this.setPointersPositions(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        if (shape && shape.isListening()) {
            shape._fireAndBubble(CONTEXTMENU, { evt: evt });
        }
        else {
            this._fire(CONTEXTMENU, {
                evt: evt,
                target: this,
                currentTarget: this
            });
        }
        this._fire(CONTENT_CONTEXTMENU, { evt: evt });
    };
    Stage.prototype._touchstart = function (evt) {
        var _this = this;
        this.setPointersPositions(evt);
        var triggeredOnShape = false;
        this._changedPointerPositions.forEach(function (pos) {
            var shape = _this.getIntersection(pos);
            Global_1.Konva.listenClickTap = true;
            DragAndDrop_1.DD.justDragged = false;
            var hasShape = shape && shape.isListening();
            if (!hasShape) {
                return;
            }
            if (Global_1.Konva.captureTouchEventsEnabled) {
                shape.setPointerCapture(pos.id);
            }
            _this.tapStartShape = shape;
            shape._fireAndBubble(TOUCHSTART, { evt: evt, pointerId: pos.id }, _this);
            triggeredOnShape = true;
            if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                evt.preventDefault();
            }
        });
        if (!triggeredOnShape) {
            this._fire(TOUCHSTART, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id
            });
        }
        this._fire(CONTENT_TOUCHSTART, { evt: evt });
    };
    Stage.prototype._touchmove = function (evt) {
        var _this = this;
        this.setPointersPositions(evt);
        var eventsEnabled = !DragAndDrop_1.DD.isDragging || Global_1.Konva.hitOnDragEnabled;
        if (eventsEnabled) {
            var triggeredOnShape = false;
            var processedShapesIds = {};
            this._changedPointerPositions.forEach(function (pos) {
                var shape = PointerEvents.getCapturedShape(pos.id) || _this.getIntersection(pos);
                var hasShape = shape && shape.isListening();
                if (!hasShape) {
                    return;
                }
                if (processedShapesIds[shape._id]) {
                    return;
                }
                processedShapesIds[shape._id] = true;
                shape._fireAndBubble(TOUCHMOVE, { evt: evt, pointerId: pos.id });
                triggeredOnShape = true;
                if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                    evt.preventDefault();
                }
            });
            if (!triggeredOnShape) {
                this._fire(TOUCHMOVE, {
                    evt: evt,
                    target: this,
                    currentTarget: this,
                    pointerId: this._changedPointerPositions[0].id
                });
            }
            this._fire(CONTENT_TOUCHMOVE, { evt: evt });
        }
        if (DragAndDrop_1.DD.isDragging && DragAndDrop_1.DD.node.preventDefault() && evt.cancelable) {
            evt.preventDefault();
        }
    };
    Stage.prototype._touchend = function (evt) {
        var _this = this;
        this.setPointersPositions(evt);
        var clickEndShape = this.clickEndShape, fireDblClick = false;
        if (Global_1.Konva.inDblClickWindow) {
            fireDblClick = true;
            clearTimeout(this.dblTimeout);
        }
        else if (!DragAndDrop_1.DD.justDragged) {
            Global_1.Konva.inDblClickWindow = true;
            clearTimeout(this.dblTimeout);
        }
        this.dblTimeout = setTimeout(function () {
            Global_1.Konva.inDblClickWindow = false;
        }, Global_1.Konva.dblClickWindow);
        var triggeredOnShape = false;
        var processedShapesIds = {};
        var tapTriggered = false;
        var dblTapTriggered = false;
        this._changedPointerPositions.forEach(function (pos) {
            var shape = PointerEvents.getCapturedShape(pos.id) ||
                _this.getIntersection(pos);
            if (shape) {
                shape.releaseCapture(pos.id);
            }
            var hasShape = shape && shape.isListening();
            if (!hasShape) {
                return;
            }
            if (processedShapesIds[shape._id]) {
                return;
            }
            processedShapesIds[shape._id] = true;
            _this.clickEndShape = shape;
            shape._fireAndBubble(TOUCHEND, { evt: evt, pointerId: pos.id });
            triggeredOnShape = true;
            if (Global_1.Konva.listenClickTap && shape === _this.tapStartShape) {
                tapTriggered = true;
                shape._fireAndBubble(TAP, { evt: evt, pointerId: pos.id });
                if (fireDblClick && clickEndShape && clickEndShape === shape) {
                    dblTapTriggered = true;
                    shape._fireAndBubble(DBL_TAP, { evt: evt, pointerId: pos.id });
                }
            }
            if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                evt.preventDefault();
            }
        });
        if (!triggeredOnShape) {
            this._fire(TOUCHEND, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id
            });
        }
        if (Global_1.Konva.listenClickTap && !tapTriggered) {
            this._fire(TAP, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id
            });
        }
        if (fireDblClick && !dblTapTriggered) {
            this._fire(DBL_TAP, {
                evt: evt,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id
            });
        }
        this._fire(CONTENT_TOUCHEND, { evt: evt });
        if (Global_1.Konva.listenClickTap) {
            this._fire(CONTENT_TAP, { evt: evt });
            if (fireDblClick) {
                this._fire(CONTENT_DBL_TAP, { evt: evt });
            }
        }
        Global_1.Konva.listenClickTap = false;
    };
    Stage.prototype._wheel = function (evt) {
        this.setPointersPositions(evt);
        var shape = this.getIntersection(this.getPointerPosition());
        if (shape && shape.isListening()) {
            shape._fireAndBubble(WHEEL, { evt: evt });
        }
        else {
            this._fire(WHEEL, {
                evt: evt,
                target: this,
                currentTarget: this
            });
        }
        this._fire(CONTENT_WHEEL, { evt: evt });
    };
    Stage.prototype._pointerdown = function (evt) {
        if (!Global_1.Konva._pointerEventsEnabled) {
            return;
        }
        this.setPointersPositions(evt);
        var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERDOWN, PointerEvents.createEvent(evt));
        }
    };
    Stage.prototype._pointermove = function (evt) {
        if (!Global_1.Konva._pointerEventsEnabled) {
            return;
        }
        this.setPointersPositions(evt);
        var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERMOVE, PointerEvents.createEvent(evt));
        }
    };
    Stage.prototype._pointerup = function (evt) {
        if (!Global_1.Konva._pointerEventsEnabled) {
            return;
        }
        this.setPointersPositions(evt);
        var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERUP, PointerEvents.createEvent(evt));
        }
        PointerEvents.releaseCapture(evt.pointerId);
    };
    Stage.prototype._pointercancel = function (evt) {
        if (!Global_1.Konva._pointerEventsEnabled) {
            return;
        }
        this.setPointersPositions(evt);
        var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
            this.getIntersection(this.getPointerPosition());
        if (shape) {
            shape._fireAndBubble(POINTERUP, PointerEvents.createEvent(evt));
        }
        PointerEvents.releaseCapture(evt.pointerId);
    };
    Stage.prototype._lostpointercapture = function (evt) {
        PointerEvents.releaseCapture(evt.pointerId);
    };
    Stage.prototype.setPointersPositions = function (evt) {
        var _this = this;
        var contentPosition = this._getContentPosition(), x = null, y = null;
        evt = evt ? evt : window.event;
        if (evt.touches !== undefined) {
            this._pointerPositions = [];
            this._changedPointerPositions = [];
            Util_1.Collection.prototype.each.call(evt.touches, function (touch) {
                _this._pointerPositions.push({
                    id: touch.identifier,
                    x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                    y: (touch.clientY - contentPosition.top) / contentPosition.scaleY
                });
            });
            Util_1.Collection.prototype.each.call(evt.changedTouches || evt.touches, function (touch) {
                _this._changedPointerPositions.push({
                    id: touch.identifier,
                    x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                    y: (touch.clientY - contentPosition.top) / contentPosition.scaleY
                });
            });
        }
        else {
            x = (evt.clientX - contentPosition.left) / contentPosition.scaleX;
            y = (evt.clientY - contentPosition.top) / contentPosition.scaleY;
            this.pointerPos = {
                x: x,
                y: y
            };
            this._pointerPositions = [{ x: x, y: y, id: Util_1.Util._getFirstPointerId(evt) }];
            this._changedPointerPositions = [
                { x: x, y: y, id: Util_1.Util._getFirstPointerId(evt) }
            ];
        }
    };
    Stage.prototype._setPointerPosition = function (evt) {
        Util_1.Util.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.');
        this.setPointersPositions(evt);
    };
    Stage.prototype._getContentPosition = function () {
        if (!this.content || !this.content.getBoundingClientRect) {
            return {
                top: 0,
                left: 0,
                scaleX: 1,
                scaleY: 1
            };
        }
        var rect = this.content.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            scaleX: rect.width / this.content.clientWidth || 1,
            scaleY: rect.height / this.content.clientHeight || 1
        };
    };
    Stage.prototype._buildDOM = function () {
        this.bufferCanvas = new Canvas_1.SceneCanvas({
            width: this.width(),
            height: this.height()
        });
        this.bufferHitCanvas = new Canvas_1.HitCanvas({
            pixelRatio: 1,
            width: this.width(),
            height: this.height()
        });
        if (!Global_1.Konva.isBrowser) {
            return;
        }
        var container = this.container();
        if (!container) {
            throw 'Stage has no container. A container is required.';
        }
        container.innerHTML = EMPTY_STRING;
        this.content = document.createElement('div');
        this.content.style.position = RELATIVE;
        this.content.style.userSelect = 'none';
        this.content.className = KONVA_CONTENT;
        this.content.setAttribute('role', 'presentation');
        container.appendChild(this.content);
        this._resizeDOM();
    };
    Stage.prototype.cache = function () {
        Util_1.Util.warn('Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.');
        return this;
    };
    Stage.prototype.clearCache = function () {
        return this;
    };
    Stage.prototype.batchDraw = function () {
        this.children.each(function (layer) {
            layer.batchDraw();
        });
        return this;
    };
    return Stage;
}(Container_1.Container));
exports.Stage = Stage;
Stage.prototype.nodeType = STAGE;
Global_2._registerNode(Stage);
Factory_1.Factory.addGetterSetter(Stage, 'container');

},{"./Util":"../../node_modules/konva/lib/Util.js","./Factory":"../../node_modules/konva/lib/Factory.js","./Container":"../../node_modules/konva/lib/Container.js","./Global":"../../node_modules/konva/lib/Global.js","./Canvas":"../../node_modules/konva/lib/Canvas.js","./DragAndDrop":"../../node_modules/konva/lib/DragAndDrop.js","./PointerEvents":"../../node_modules/konva/lib/PointerEvents.js"}],"../../node_modules/konva/lib/BaseLayer.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Container_1 = require("./Container");
var Node_1 = require("./Node");
var Factory_1 = require("./Factory");
var Canvas_1 = require("./Canvas");
var BaseLayer = (function (_super) {
    __extends(BaseLayer, _super);
    function BaseLayer(config) {
        var _this = _super.call(this, config) || this;
        _this.canvas = new Canvas_1.SceneCanvas();
        _this._waitingForDraw = false;
        _this.on('visibleChange', _this._checkVisibility);
        _this._checkVisibility();
        _this.on('imageSmoothingEnabledChange', _this._checkSmooth);
        _this._checkSmooth();
        return _this;
    }
    BaseLayer.prototype.createPNGStream = function () {
        var c = this.canvas._canvas;
        return c.createPNGStream();
    };
    BaseLayer.prototype.getCanvas = function () {
        return this.canvas;
    };
    BaseLayer.prototype.getHitCanvas = function () {
        return this.hitCanvas;
    };
    BaseLayer.prototype.getContext = function () {
        return this.getCanvas().getContext();
    };
    BaseLayer.prototype.clear = function (bounds) {
        this.getContext().clear(bounds);
        return this;
    };
    BaseLayer.prototype.setZIndex = function (index) {
        _super.prototype.setZIndex.call(this, index);
        var stage = this.getStage();
        if (stage) {
            stage.content.removeChild(this.getCanvas()._canvas);
            if (index < stage.children.length - 1) {
                stage.content.insertBefore(this.getCanvas()._canvas, stage.children[index + 1].getCanvas()._canvas);
            }
            else {
                stage.content.appendChild(this.getCanvas()._canvas);
            }
        }
        return this;
    };
    BaseLayer.prototype.moveToTop = function () {
        Node_1.Node.prototype.moveToTop.call(this);
        var stage = this.getStage();
        if (stage) {
            stage.content.removeChild(this.getCanvas()._canvas);
            stage.content.appendChild(this.getCanvas()._canvas);
        }
        return true;
    };
    BaseLayer.prototype.moveUp = function () {
        var moved = Node_1.Node.prototype.moveUp.call(this);
        if (!moved) {
            return false;
        }
        var stage = this.getStage();
        if (!stage) {
            return false;
        }
        stage.content.removeChild(this.getCanvas()._canvas);
        if (this.index < stage.children.length - 1) {
            stage.content.insertBefore(this.getCanvas()._canvas, stage.children[this.index + 1].getCanvas()._canvas);
        }
        else {
            stage.content.appendChild(this.getCanvas()._canvas);
        }
        return true;
    };
    BaseLayer.prototype.moveDown = function () {
        if (Node_1.Node.prototype.moveDown.call(this)) {
            var stage = this.getStage();
            if (stage) {
                var children = stage.children;
                stage.content.removeChild(this.getCanvas()._canvas);
                stage.content.insertBefore(this.getCanvas()._canvas, children[this.index + 1].getCanvas()._canvas);
            }
            return true;
        }
        return false;
    };
    BaseLayer.prototype.moveToBottom = function () {
        if (Node_1.Node.prototype.moveToBottom.call(this)) {
            var stage = this.getStage();
            if (stage) {
                var children = stage.children;
                stage.content.removeChild(this.getCanvas()._canvas);
                stage.content.insertBefore(this.getCanvas()._canvas, children[1].getCanvas()._canvas);
            }
            return true;
        }
        return false;
    };
    BaseLayer.prototype.getLayer = function () {
        return this;
    };
    BaseLayer.prototype.hitGraphEnabled = function () {
        return true;
    };
    BaseLayer.prototype.remove = function () {
        var _canvas = this.getCanvas()._canvas;
        Node_1.Node.prototype.remove.call(this);
        if (_canvas && _canvas.parentNode && Util_1.Util._isInDocument(_canvas)) {
            _canvas.parentNode.removeChild(_canvas);
        }
        return this;
    };
    BaseLayer.prototype.getStage = function () {
        return this.parent;
    };
    BaseLayer.prototype.setSize = function (_a) {
        var width = _a.width, height = _a.height;
        this.canvas.setSize(width, height);
        return this;
    };
    BaseLayer.prototype._toKonvaCanvas = function (config) {
        config = config || {};
        config.width = config.width || this.getWidth();
        config.height = config.height || this.getHeight();
        config.x = config.x !== undefined ? config.x : this.x();
        config.y = config.y !== undefined ? config.y : this.y();
        return Node_1.Node.prototype._toKonvaCanvas.call(this, config);
    };
    BaseLayer.prototype._checkVisibility = function () {
        var visible = this.visible();
        if (visible) {
            this.canvas._canvas.style.display = 'block';
        }
        else {
            this.canvas._canvas.style.display = 'none';
        }
    };
    BaseLayer.prototype._checkSmooth = function () {
        this.getContext()._context.imageSmoothingEnabled = this.imageSmoothingEnabled();
    };
    BaseLayer.prototype.getWidth = function () {
        if (this.parent) {
            return this.parent.width();
        }
    };
    BaseLayer.prototype.setWidth = function () {
        Util_1.Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.');
    };
    BaseLayer.prototype.getHeight = function () {
        if (this.parent) {
            return this.parent.height();
        }
    };
    BaseLayer.prototype.setHeight = function () {
        Util_1.Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.');
    };
    BaseLayer.prototype.getIntersection = function (pos, selector) {
        return null;
    };
    BaseLayer.prototype.batchDraw = function () {
        var _this = this;
        if (!this._waitingForDraw) {
            this._waitingForDraw = true;
            Util_1.Util.requestAnimFrame(function () {
                _this.draw();
                _this._waitingForDraw = false;
            });
        }
        return this;
    };
    BaseLayer.prototype._applyTransform = function (shape, context, top) {
        var m = shape.getAbsoluteTransform(top).getMatrix();
        context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    };
    return BaseLayer;
}(Container_1.Container));
exports.BaseLayer = BaseLayer;
BaseLayer.prototype.nodeType = 'BaseLayer';
Factory_1.Factory.addGetterSetter(BaseLayer, 'imageSmoothingEnabled', true);
Factory_1.Factory.addGetterSetter(BaseLayer, 'clearBeforeDraw', true);
Util_1.Collection.mapMethods(BaseLayer);

},{"./Util":"../../node_modules/konva/lib/Util.js","./Container":"../../node_modules/konva/lib/Container.js","./Node":"../../node_modules/konva/lib/Node.js","./Factory":"../../node_modules/konva/lib/Factory.js","./Canvas":"../../node_modules/konva/lib/Canvas.js"}],"../../node_modules/konva/lib/Shape.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Factory_1 = require("./Factory");
var Node_1 = require("./Node");
var Validators_1 = require("./Validators");
var Global_1 = require("./Global");
var PointerEvents = require("./PointerEvents");
var HAS_SHADOW = 'hasShadow';
var SHADOW_RGBA = 'shadowRGBA';
var patternImage = 'patternImage';
var linearGradient = 'linearGradient';
var radialGradient = 'radialGradient';
var dummyContext;
function getDummyContext() {
    if (dummyContext) {
        return dummyContext;
    }
    dummyContext = Util_1.Util.createCanvasElement().getContext('2d');
    return dummyContext;
}
exports.shapes = {};
function _fillFunc(context) {
    context.fill();
}
function _strokeFunc(context) {
    context.stroke();
}
function _fillFuncHit(context) {
    context.fill();
}
function _strokeFuncHit(context) {
    context.stroke();
}
function _clearHasShadowCache() {
    this._clearCache(HAS_SHADOW);
}
function _clearGetShadowRGBACache() {
    this._clearCache(SHADOW_RGBA);
}
function _clearFillPatternCache() {
    this._clearCache(patternImage);
}
function _clearLinearGradientCache() {
    this._clearCache(linearGradient);
}
function _clearRadialGradientCache() {
    this._clearCache(radialGradient);
}
var Shape = (function (_super) {
    __extends(Shape, _super);
    function Shape(config) {
        var _this = _super.call(this, config) || this;
        var key;
        while (true) {
            key = Util_1.Util.getRandomColor();
            if (key && !(key in exports.shapes)) {
                break;
            }
        }
        _this.colorKey = key;
        exports.shapes[key] = _this;
        _this.on('shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearHasShadowCache);
        _this.on('shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearGetShadowRGBACache);
        _this.on('fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva', _clearFillPatternCache);
        _this.on('fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva', _clearLinearGradientCache);
        _this.on('fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva', _clearRadialGradientCache);
        return _this;
    }
    Shape.prototype.getContext = function () {
        return this.getLayer().getContext();
    };
    Shape.prototype.getCanvas = function () {
        return this.getLayer().getCanvas();
    };
    Shape.prototype.getSceneFunc = function () {
        return this.attrs.sceneFunc || this['_sceneFunc'];
    };
    Shape.prototype.getHitFunc = function () {
        return this.attrs.hitFunc || this['_hitFunc'];
    };
    Shape.prototype.hasShadow = function () {
        return this._getCache(HAS_SHADOW, this._hasShadow);
    };
    Shape.prototype._hasShadow = function () {
        return (this.shadowEnabled() &&
            this.shadowOpacity() !== 0 &&
            !!(this.shadowColor() ||
                this.shadowBlur() ||
                this.shadowOffsetX() ||
                this.shadowOffsetY()));
    };
    Shape.prototype._getFillPattern = function () {
        return this._getCache(patternImage, this.__getFillPattern);
    };
    Shape.prototype.__getFillPattern = function () {
        if (this.fillPatternImage()) {
            var ctx = getDummyContext();
            var pattern = ctx.createPattern(this.fillPatternImage(), this.fillPatternRepeat() || 'repeat');
            return pattern;
        }
    };
    Shape.prototype._getLinearGradient = function () {
        return this._getCache(linearGradient, this.__getLinearGradient);
    };
    Shape.prototype.__getLinearGradient = function () {
        var colorStops = this.fillLinearGradientColorStops();
        if (colorStops) {
            var ctx = getDummyContext();
            var start = this.fillLinearGradientStartPoint();
            var end = this.fillLinearGradientEndPoint();
            var grd = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            return grd;
        }
    };
    Shape.prototype._getRadialGradient = function () {
        return this._getCache(radialGradient, this.__getRadialGradient);
    };
    Shape.prototype.__getRadialGradient = function () {
        var colorStops = this.fillRadialGradientColorStops();
        if (colorStops) {
            var ctx = getDummyContext();
            var start = this.fillRadialGradientStartPoint();
            var end = this.fillRadialGradientEndPoint();
            var grd = ctx.createRadialGradient(start.x, start.y, this.fillRadialGradientStartRadius(), end.x, end.y, this.fillRadialGradientEndRadius());
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            return grd;
        }
    };
    Shape.prototype.getShadowRGBA = function () {
        return this._getCache(SHADOW_RGBA, this._getShadowRGBA);
    };
    Shape.prototype._getShadowRGBA = function () {
        if (this.hasShadow()) {
            var rgba = Util_1.Util.colorToRGBA(this.shadowColor());
            return ('rgba(' +
                rgba.r +
                ',' +
                rgba.g +
                ',' +
                rgba.b +
                ',' +
                rgba.a * (this.shadowOpacity() || 1) +
                ')');
        }
    };
    Shape.prototype.hasFill = function () {
        return (this.fillEnabled() &&
            !!(this.fill() ||
                this.fillPatternImage() ||
                this.fillLinearGradientColorStops() ||
                this.fillRadialGradientColorStops()));
    };
    Shape.prototype.hasStroke = function () {
        return (this.strokeEnabled() &&
            this.strokeWidth() &&
            !!(this.stroke() || this.strokeLinearGradientColorStops()));
    };
    Shape.prototype.hasHitStroke = function () {
        var width = this.hitStrokeWidth();
        if (width === 'auto') {
            return this.hasStroke();
        }
        return this.strokeEnabled() && !!width;
    };
    Shape.prototype.intersects = function (point) {
        var stage = this.getStage(), bufferHitCanvas = stage.bufferHitCanvas, p;
        bufferHitCanvas.getContext().clear();
        this.drawHit(bufferHitCanvas);
        p = bufferHitCanvas.context.getImageData(Math.round(point.x), Math.round(point.y), 1, 1).data;
        return p[3] > 0;
    };
    Shape.prototype.destroy = function () {
        Node_1.Node.prototype.destroy.call(this);
        delete exports.shapes[this.colorKey];
        delete this.colorKey;
        return this;
    };
    Shape.prototype._useBufferCanvas = function (caching) {
        return !!((!caching || this.hasShadow()) &&
            this.perfectDrawEnabled() &&
            this.getAbsoluteOpacity() !== 1 &&
            this.hasFill() &&
            this.hasStroke() &&
            this.getStage());
    };
    Shape.prototype.setStrokeHitEnabled = function (val) {
        Util_1.Util.warn('strokeHitEnabled property is deprecated. Please use hitStrokeWidth instead.');
        if (val) {
            this.hitStrokeWidth('auto');
        }
        else {
            this.hitStrokeWidth(0);
        }
    };
    Shape.prototype.getStrokeHitEnabled = function () {
        if (this.hitStrokeWidth() === 0) {
            return false;
        }
        else {
            return true;
        }
    };
    Shape.prototype.getSelfRect = function () {
        var size = this.size();
        return {
            x: this._centroid ? -size.width / 2 : 0,
            y: this._centroid ? -size.height / 2 : 0,
            width: size.width,
            height: size.height
        };
    };
    Shape.prototype.getClientRect = function (attrs) {
        attrs = attrs || {};
        var skipTransform = attrs.skipTransform;
        var relativeTo = attrs.relativeTo;
        var fillRect = this.getSelfRect();
        var applyStroke = !attrs.skipStroke && this.hasStroke();
        var strokeWidth = (applyStroke && this.strokeWidth()) || 0;
        var fillAndStrokeWidth = fillRect.width + strokeWidth;
        var fillAndStrokeHeight = fillRect.height + strokeWidth;
        var applyShadow = !attrs.skipShadow && this.hasShadow();
        var shadowOffsetX = applyShadow ? this.shadowOffsetX() : 0;
        var shadowOffsetY = applyShadow ? this.shadowOffsetY() : 0;
        var preWidth = fillAndStrokeWidth + Math.abs(shadowOffsetX);
        var preHeight = fillAndStrokeHeight + Math.abs(shadowOffsetY);
        var blurRadius = (applyShadow && this.shadowBlur()) || 0;
        var width = preWidth + blurRadius * 2;
        var height = preHeight + blurRadius * 2;
        var roundingOffset = 0;
        if (Math.round(strokeWidth / 2) !== strokeWidth / 2) {
            roundingOffset = 1;
        }
        var rect = {
            width: width + roundingOffset,
            height: height + roundingOffset,
            x: -Math.round(strokeWidth / 2 + blurRadius) +
                Math.min(shadowOffsetX, 0) +
                fillRect.x,
            y: -Math.round(strokeWidth / 2 + blurRadius) +
                Math.min(shadowOffsetY, 0) +
                fillRect.y
        };
        if (!skipTransform) {
            return this._transformedRect(rect, relativeTo);
        }
        return rect;
    };
    Shape.prototype.drawScene = function (can, top, caching, skipBuffer) {
        var layer = this.getLayer(), canvas = can || layer.getCanvas(), context = canvas.getContext(), cachedCanvas = this._getCanvasCache(), drawFunc = this.sceneFunc(), hasShadow = this.hasShadow(), hasStroke = this.hasStroke(), stage, bufferCanvas, bufferContext;
        if (!this.isVisible() && !caching) {
            return this;
        }
        if (cachedCanvas) {
            context.save();
            layer._applyTransform(this, context, top);
            this._drawCachedSceneCanvas(context);
            context.restore();
            return this;
        }
        if (!drawFunc) {
            return this;
        }
        context.save();
        if (this._useBufferCanvas(caching) && !skipBuffer) {
            stage = this.getStage();
            bufferCanvas = stage.bufferCanvas;
            bufferContext = bufferCanvas.getContext();
            bufferContext.clear();
            bufferContext.save();
            bufferContext._applyLineJoin(this);
            if (!caching) {
                if (layer) {
                    layer._applyTransform(this, bufferContext, top);
                }
                else {
                    var m = this.getAbsoluteTransform(top).getMatrix();
                    context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
                }
            }
            drawFunc.call(this, bufferContext, this);
            bufferContext.restore();
            var ratio = bufferCanvas.pixelRatio;
            if (hasShadow && !canvas.hitCanvas) {
                context.save();
                context._applyShadow(this);
                context._applyOpacity(this);
                context._applyGlobalCompositeOperation(this);
                context.drawImage(bufferCanvas._canvas, 0, 0, bufferCanvas.width / ratio, bufferCanvas.height / ratio);
                context.restore();
            }
            else {
                context._applyOpacity(this);
                context._applyGlobalCompositeOperation(this);
                context.drawImage(bufferCanvas._canvas, 0, 0, bufferCanvas.width / ratio, bufferCanvas.height / ratio);
            }
        }
        else {
            context._applyLineJoin(this);
            if (!caching) {
                if (layer) {
                    layer._applyTransform(this, context, top);
                }
                else {
                    var o = this.getAbsoluteTransform(top).getMatrix();
                    context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
                }
            }
            if (hasShadow && hasStroke && !canvas.hitCanvas) {
                context.save();
                if (!caching) {
                    context._applyOpacity(this);
                    context._applyGlobalCompositeOperation(this);
                }
                context._applyShadow(this);
                drawFunc.call(this, context, this);
                context.restore();
                if (this.hasFill() && this.shadowForStrokeEnabled()) {
                    drawFunc.call(this, context, this);
                }
            }
            else if (hasShadow && !canvas.hitCanvas) {
                context.save();
                if (!caching) {
                    context._applyOpacity(this);
                    context._applyGlobalCompositeOperation(this);
                }
                context._applyShadow(this);
                drawFunc.call(this, context, this);
                context.restore();
            }
            else {
                if (!caching) {
                    context._applyOpacity(this);
                    context._applyGlobalCompositeOperation(this);
                }
                drawFunc.call(this, context, this);
            }
        }
        context.restore();
        return this;
    };
    Shape.prototype.drawHit = function (can, top, caching) {
        var layer = this.getLayer(), canvas = can || layer.hitCanvas, context = canvas && canvas.getContext(), drawFunc = this.hitFunc() || this.sceneFunc(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
        if (!this.colorKey) {
            console.log(this);
            Util_1.Util.warn('Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. See the shape in logs above. If you want to reuse shape you should call remove() instead of destroy()');
        }
        if (!this.shouldDrawHit() && !caching) {
            return this;
        }
        if (cachedHitCanvas) {
            context.save();
            layer._applyTransform(this, context, top);
            this._drawCachedHitCanvas(context);
            context.restore();
            return this;
        }
        if (!drawFunc) {
            return this;
        }
        context.save();
        context._applyLineJoin(this);
        if (!caching) {
            if (layer) {
                layer._applyTransform(this, context, top);
            }
            else {
                var o = this.getAbsoluteTransform(top).getMatrix();
                context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
            }
        }
        drawFunc.call(this, context, this);
        context.restore();
        return this;
    };
    Shape.prototype.drawHitFromCache = function (alphaThreshold) {
        if (alphaThreshold === void 0) { alphaThreshold = 0; }
        var cachedCanvas = this._getCanvasCache(), sceneCanvas = this._getCachedSceneCanvas(), hitCanvas = cachedCanvas.hit, hitContext = hitCanvas.getContext(), hitWidth = hitCanvas.getWidth(), hitHeight = hitCanvas.getHeight(), hitImageData, hitData, len, rgbColorKey, i, alpha;
        hitContext.clear();
        hitContext.drawImage(sceneCanvas._canvas, 0, 0, hitWidth, hitHeight);
        try {
            hitImageData = hitContext.getImageData(0, 0, hitWidth, hitHeight);
            hitData = hitImageData.data;
            len = hitData.length;
            rgbColorKey = Util_1.Util._hexToRgb(this.colorKey);
            for (i = 0; i < len; i += 4) {
                alpha = hitData[i + 3];
                if (alpha > alphaThreshold) {
                    hitData[i] = rgbColorKey.r;
                    hitData[i + 1] = rgbColorKey.g;
                    hitData[i + 2] = rgbColorKey.b;
                    hitData[i + 3] = 255;
                }
                else {
                    hitData[i + 3] = 0;
                }
            }
            hitContext.putImageData(hitImageData, 0, 0);
        }
        catch (e) {
            Util_1.Util.error('Unable to draw hit graph from cached scene canvas. ' + e.message);
        }
        return this;
    };
    Shape.prototype.hasPointerCapture = function (pointerId) {
        return PointerEvents.hasPointerCapture(pointerId, this);
    };
    Shape.prototype.setPointerCapture = function (pointerId) {
        PointerEvents.setPointerCapture(pointerId, this);
    };
    Shape.prototype.releaseCapture = function (pointerId) {
        PointerEvents.releaseCapture(pointerId, this);
    };
    return Shape;
}(Node_1.Node));
exports.Shape = Shape;
Shape.prototype._fillFunc = _fillFunc;
Shape.prototype._strokeFunc = _strokeFunc;
Shape.prototype._fillFuncHit = _fillFuncHit;
Shape.prototype._strokeFuncHit = _strokeFuncHit;
Shape.prototype._centroid = false;
Shape.prototype.nodeType = 'Shape';
Global_1._registerNode(Shape);
Factory_1.Factory.addGetterSetter(Shape, 'stroke', undefined, Validators_1.getStringValidator());
Factory_1.Factory.addGetterSetter(Shape, 'strokeWidth', 2, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'hitStrokeWidth', 'auto', Validators_1.getNumberOrAutoValidator());
Factory_1.Factory.addGetterSetter(Shape, 'strokeHitEnabled', true, Validators_1.getBooleanValidator());
Factory_1.Factory.addGetterSetter(Shape, 'perfectDrawEnabled', true, Validators_1.getBooleanValidator());
Factory_1.Factory.addGetterSetter(Shape, 'shadowForStrokeEnabled', true, Validators_1.getBooleanValidator());
Factory_1.Factory.addGetterSetter(Shape, 'lineJoin');
Factory_1.Factory.addGetterSetter(Shape, 'lineCap');
Factory_1.Factory.addGetterSetter(Shape, 'sceneFunc');
Factory_1.Factory.addGetterSetter(Shape, 'hitFunc');
Factory_1.Factory.addGetterSetter(Shape, 'dash');
Factory_1.Factory.addGetterSetter(Shape, 'dashOffset', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'shadowColor', undefined, Validators_1.getStringValidator());
Factory_1.Factory.addGetterSetter(Shape, 'shadowBlur', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'shadowOpacity', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addComponentsGetterSetter(Shape, 'shadowOffset', ['x', 'y']);
Factory_1.Factory.addGetterSetter(Shape, 'shadowOffsetX', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'shadowOffsetY', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternImage');
Factory_1.Factory.addGetterSetter(Shape, 'fill', undefined, Validators_1.getStringValidator());
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternX', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternY', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'fillLinearGradientColorStops');
Factory_1.Factory.addGetterSetter(Shape, 'strokeLinearGradientColorStops');
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientStartRadius', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientEndRadius', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientColorStops');
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternRepeat', 'repeat');
Factory_1.Factory.addGetterSetter(Shape, 'fillEnabled', true);
Factory_1.Factory.addGetterSetter(Shape, 'strokeEnabled', true);
Factory_1.Factory.addGetterSetter(Shape, 'shadowEnabled', true);
Factory_1.Factory.addGetterSetter(Shape, 'dashEnabled', true);
Factory_1.Factory.addGetterSetter(Shape, 'strokeScaleEnabled', true);
Factory_1.Factory.addGetterSetter(Shape, 'fillPriority', 'color');
Factory_1.Factory.addComponentsGetterSetter(Shape, 'fillPatternOffset', ['x', 'y']);
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternOffsetX', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternOffsetY', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addComponentsGetterSetter(Shape, 'fillPatternScale', ['x', 'y']);
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternScaleX', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternScaleY', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientStartPoint', [
    'x',
    'y'
]);
Factory_1.Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientStartPoint', [
    'x',
    'y'
]);
Factory_1.Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointX', 0);
Factory_1.Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointX', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointY', 0);
Factory_1.Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointY', 0);
Factory_1.Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientEndPoint', [
    'x',
    'y'
]);
Factory_1.Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientEndPoint', [
    'x',
    'y'
]);
Factory_1.Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointX', 0);
Factory_1.Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointX', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointY', 0);
Factory_1.Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointY', 0);
Factory_1.Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientStartPoint', [
    'x',
    'y'
]);
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointX', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointY', 0);
Factory_1.Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientEndPoint', [
    'x',
    'y'
]);
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointX', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointY', 0);
Factory_1.Factory.addGetterSetter(Shape, 'fillPatternRotation', 0);
Factory_1.Factory.backCompat(Shape, {
    dashArray: 'dash',
    getDashArray: 'getDash',
    setDashArray: 'getDash',
    drawFunc: 'sceneFunc',
    getDrawFunc: 'getSceneFunc',
    setDrawFunc: 'setSceneFunc',
    drawHitFunc: 'hitFunc',
    getDrawHitFunc: 'getHitFunc',
    setDrawHitFunc: 'setHitFunc'
});
Util_1.Collection.mapMethods(Shape);

},{"./Util":"../../node_modules/konva/lib/Util.js","./Factory":"../../node_modules/konva/lib/Factory.js","./Node":"../../node_modules/konva/lib/Node.js","./Validators":"../../node_modules/konva/lib/Validators.js","./Global":"../../node_modules/konva/lib/Global.js","./PointerEvents":"../../node_modules/konva/lib/PointerEvents.js"}],"../../node_modules/konva/lib/Layer.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Container_1 = require("./Container");
var Factory_1 = require("./Factory");
var BaseLayer_1 = require("./BaseLayer");
var Canvas_1 = require("./Canvas");
var Shape_1 = require("./Shape");
var Validators_1 = require("./Validators");
var Global_1 = require("./Global");
var HASH = '#', BEFORE_DRAW = 'beforeDraw', DRAW = 'draw', INTERSECTION_OFFSETS = [
    { x: 0, y: 0 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 }
], INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length;
var Layer = (function (_super) {
    __extends(Layer, _super);
    function Layer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hitCanvas = new Canvas_1.HitCanvas({
            pixelRatio: 1
        });
        return _this;
    }
    Layer.prototype._setCanvasSize = function (width, height) {
        this.canvas.setSize(width, height);
        this.hitCanvas.setSize(width, height);
        this._checkSmooth();
    };
    Layer.prototype._validateAdd = function (child) {
        var type = child.getType();
        if (type !== 'Group' && type !== 'Shape') {
            Util_1.Util.throw('You may only add groups and shapes to a layer.');
        }
    };
    Layer.prototype.getIntersection = function (pos, selector) {
        var obj, i, intersectionOffset, shape;
        if (!this.hitGraphEnabled() || !this.isVisible()) {
            return null;
        }
        var spiralSearchDistance = 1;
        var continueSearch = false;
        while (true) {
            for (i = 0; i < INTERSECTION_OFFSETS_LEN; i++) {
                intersectionOffset = INTERSECTION_OFFSETS[i];
                obj = this._getIntersection({
                    x: pos.x + intersectionOffset.x * spiralSearchDistance,
                    y: pos.y + intersectionOffset.y * spiralSearchDistance
                });
                shape = obj.shape;
                if (shape && selector) {
                    return shape.findAncestor(selector, true);
                }
                else if (shape) {
                    return shape;
                }
                continueSearch = !!obj.antialiased;
                if (!obj.antialiased) {
                    break;
                }
            }
            if (continueSearch) {
                spiralSearchDistance += 1;
            }
            else {
                return null;
            }
        }
    };
    Layer.prototype._getIntersection = function (pos) {
        var ratio = this.hitCanvas.pixelRatio;
        var p = this.hitCanvas.context.getImageData(Math.round(pos.x * ratio), Math.round(pos.y * ratio), 1, 1).data, p3 = p[3], colorKey, shape;
        if (p3 === 255) {
            colorKey = Util_1.Util._rgbToHex(p[0], p[1], p[2]);
            shape = Shape_1.shapes[HASH + colorKey];
            if (shape) {
                return {
                    shape: shape
                };
            }
            return {
                antialiased: true
            };
        }
        else if (p3 > 0) {
            return {
                antialiased: true
            };
        }
        return {};
    };
    Layer.prototype.drawScene = function (can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas());
        this._fire(BEFORE_DRAW, {
            node: this
        });
        if (this.clearBeforeDraw()) {
            canvas.getContext().clear();
        }
        Container_1.Container.prototype.drawScene.call(this, canvas, top);
        this._fire(DRAW, {
            node: this
        });
        return this;
    };
    Layer.prototype.drawHit = function (can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas);
        if (layer && layer.clearBeforeDraw()) {
            layer
                .getHitCanvas()
                .getContext()
                .clear();
        }
        Container_1.Container.prototype.drawHit.call(this, canvas, top);
        return this;
    };
    Layer.prototype.clear = function (bounds) {
        BaseLayer_1.BaseLayer.prototype.clear.call(this, bounds);
        this.getHitCanvas()
            .getContext()
            .clear(bounds);
        return this;
    };
    Layer.prototype.enableHitGraph = function () {
        this.hitGraphEnabled(true);
        return this;
    };
    Layer.prototype.disableHitGraph = function () {
        this.hitGraphEnabled(false);
        return this;
    };
    Layer.prototype.toggleHitCanvas = function () {
        if (!this.parent) {
            return;
        }
        var parent = this.parent;
        var added = !!this.hitCanvas._canvas.parentNode;
        if (added) {
            parent.content.removeChild(this.hitCanvas._canvas);
        }
        else {
            parent.content.appendChild(this.hitCanvas._canvas);
        }
    };
    Layer.prototype.setSize = function (_a) {
        var width = _a.width, height = _a.height;
        _super.prototype.setSize.call(this, { width: width, height: height });
        this.hitCanvas.setSize(width, height);
        return this;
    };
    return Layer;
}(BaseLayer_1.BaseLayer));
exports.Layer = Layer;
Layer.prototype.nodeType = 'Layer';
Global_1._registerNode(Layer);
Factory_1.Factory.addGetterSetter(Layer, 'hitGraphEnabled', true, Validators_1.getBooleanValidator());
Util_1.Collection.mapMethods(Layer);

},{"./Util":"../../node_modules/konva/lib/Util.js","./Container":"../../node_modules/konva/lib/Container.js","./Factory":"../../node_modules/konva/lib/Factory.js","./BaseLayer":"../../node_modules/konva/lib/BaseLayer.js","./Canvas":"../../node_modules/konva/lib/Canvas.js","./Shape":"../../node_modules/konva/lib/Shape.js","./Validators":"../../node_modules/konva/lib/Validators.js","./Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/FastLayer.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Container_1 = require("./Container");
var BaseLayer_1 = require("./BaseLayer");
var Global_1 = require("./Global");
var FastLayer = (function (_super) {
    __extends(FastLayer, _super);
    function FastLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FastLayer.prototype._validateAdd = function (child) {
        var type = child.getType();
        if (type !== 'Shape') {
            Util_1.Util.throw('You may only add shapes to a fast layer.');
        }
    };
    FastLayer.prototype._setCanvasSize = function (width, height) {
        this.canvas.setSize(width, height);
        this._checkSmooth();
    };
    FastLayer.prototype.hitGraphEnabled = function () {
        return false;
    };
    FastLayer.prototype.drawScene = function (can) {
        var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas());
        if (this.clearBeforeDraw()) {
            canvas.getContext().clear();
        }
        Container_1.Container.prototype.drawScene.call(this, canvas);
        return this;
    };
    FastLayer.prototype.draw = function () {
        this.drawScene();
        return this;
    };
    return FastLayer;
}(BaseLayer_1.BaseLayer));
exports.FastLayer = FastLayer;
FastLayer.prototype.nodeType = 'FastLayer';
Global_1._registerNode(FastLayer);
Util_1.Collection.mapMethods(FastLayer);

},{"./Util":"../../node_modules/konva/lib/Util.js","./Container":"../../node_modules/konva/lib/Container.js","./BaseLayer":"../../node_modules/konva/lib/BaseLayer.js","./Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/Group.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Container_1 = require("./Container");
var Global_1 = require("./Global");
var Group = (function (_super) {
    __extends(Group, _super);
    function Group() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Group.prototype._validateAdd = function (child) {
        var type = child.getType();
        if (type !== 'Group' && type !== 'Shape') {
            Util_1.Util.throw('You may only add groups and shapes to groups.');
        }
    };
    return Group;
}(Container_1.Container));
exports.Group = Group;
Group.prototype.nodeType = 'Group';
Global_1._registerNode(Group);
Util_1.Collection.mapMethods(Group);

},{"./Util":"../../node_modules/konva/lib/Util.js","./Container":"../../node_modules/konva/lib/Container.js","./Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/Animation.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("./Global");
var now = (function () {
    if (Global_1.glob.performance && Global_1.glob.performance.now) {
        return function () {
            return Global_1.glob.performance.now();
        };
    }
    return function () {
        return new Date().getTime();
    };
})();
var Animation = (function () {
    function Animation(func, layers) {
        this.id = Animation.animIdCounter++;
        this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: now(),
            frameRate: 0
        };
        this.func = func;
        this.setLayers(layers);
    }
    Animation.prototype.setLayers = function (layers) {
        var lays = [];
        if (!layers) {
            lays = [];
        }
        else if (layers.length > 0) {
            lays = layers;
        }
        else {
            lays = [layers];
        }
        this.layers = lays;
        return this;
    };
    Animation.prototype.getLayers = function () {
        return this.layers;
    };
    Animation.prototype.addLayer = function (layer) {
        var layers = this.layers, len = layers.length, n;
        for (n = 0; n < len; n++) {
            if (layers[n]._id === layer._id) {
                return false;
            }
        }
        this.layers.push(layer);
        return true;
    };
    Animation.prototype.isRunning = function () {
        var a = Animation, animations = a.animations, len = animations.length, n;
        for (n = 0; n < len; n++) {
            if (animations[n].id === this.id) {
                return true;
            }
        }
        return false;
    };
    Animation.prototype.start = function () {
        this.stop();
        this.frame.timeDiff = 0;
        this.frame.lastTime = now();
        Animation._addAnimation(this);
        return this;
    };
    Animation.prototype.stop = function () {
        Animation._removeAnimation(this);
        return this;
    };
    Animation.prototype._updateFrameObject = function (time) {
        this.frame.timeDiff = time - this.frame.lastTime;
        this.frame.lastTime = time;
        this.frame.time += this.frame.timeDiff;
        this.frame.frameRate = 1000 / this.frame.timeDiff;
    };
    Animation._addAnimation = function (anim) {
        this.animations.push(anim);
        this._handleAnimation();
    };
    Animation._removeAnimation = function (anim) {
        var id = anim.id, animations = this.animations, len = animations.length, n;
        for (n = 0; n < len; n++) {
            if (animations[n].id === id) {
                this.animations.splice(n, 1);
                break;
            }
        }
    };
    Animation._runFrames = function () {
        var layerHash = {}, animations = this.animations, anim, layers, func, n, i, layersLen, layer, key, needRedraw;
        for (n = 0; n < animations.length; n++) {
            anim = animations[n];
            layers = anim.layers;
            func = anim.func;
            anim._updateFrameObject(now());
            layersLen = layers.length;
            if (func) {
                needRedraw = func.call(anim, anim.frame) !== false;
            }
            else {
                needRedraw = true;
            }
            if (!needRedraw) {
                continue;
            }
            for (i = 0; i < layersLen; i++) {
                layer = layers[i];
                if (layer._id !== undefined) {
                    layerHash[layer._id] = layer;
                }
            }
        }
        for (key in layerHash) {
            if (!layerHash.hasOwnProperty(key)) {
                continue;
            }
            layerHash[key].draw();
        }
    };
    Animation._animationLoop = function () {
        var Anim = Animation;
        if (Anim.animations.length) {
            Anim._runFrames();
            requestAnimationFrame(Anim._animationLoop);
        }
        else {
            Anim.animRunning = false;
        }
    };
    Animation._handleAnimation = function () {
        if (!this.animRunning) {
            this.animRunning = true;
            requestAnimationFrame(this._animationLoop);
        }
    };
    Animation.animations = [];
    Animation.animIdCounter = 0;
    Animation.animRunning = false;
    return Animation;
}());
exports.Animation = Animation;

},{"./Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/Tween.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var Animation_1 = require("./Animation");
var Node_1 = require("./Node");
var Global_1 = require("./Global");
var blacklist = {
    node: 1,
    duration: 1,
    easing: 1,
    onFinish: 1,
    yoyo: 1
}, PAUSED = 1, PLAYING = 2, REVERSING = 3, idCounter = 0, colorAttrs = ['fill', 'stroke', 'shadowColor'];
var TweenEngine = (function () {
    function TweenEngine(prop, propFunc, func, begin, finish, duration, yoyo) {
        this.prop = prop;
        this.propFunc = propFunc;
        this.begin = begin;
        this._pos = begin;
        this.duration = duration;
        this._change = 0;
        this.prevPos = 0;
        this.yoyo = yoyo;
        this._time = 0;
        this._position = 0;
        this._startTime = 0;
        this._finish = 0;
        this.func = func;
        this._change = finish - this.begin;
        this.pause();
    }
    TweenEngine.prototype.fire = function (str) {
        var handler = this[str];
        if (handler) {
            handler();
        }
    };
    TweenEngine.prototype.setTime = function (t) {
        if (t > this.duration) {
            if (this.yoyo) {
                this._time = this.duration;
                this.reverse();
            }
            else {
                this.finish();
            }
        }
        else if (t < 0) {
            if (this.yoyo) {
                this._time = 0;
                this.play();
            }
            else {
                this.reset();
            }
        }
        else {
            this._time = t;
            this.update();
        }
    };
    TweenEngine.prototype.getTime = function () {
        return this._time;
    };
    TweenEngine.prototype.setPosition = function (p) {
        this.prevPos = this._pos;
        this.propFunc(p);
        this._pos = p;
    };
    TweenEngine.prototype.getPosition = function (t) {
        if (t === undefined) {
            t = this._time;
        }
        return this.func(t, this.begin, this._change, this.duration);
    };
    TweenEngine.prototype.play = function () {
        this.state = PLAYING;
        this._startTime = this.getTimer() - this._time;
        this.onEnterFrame();
        this.fire('onPlay');
    };
    TweenEngine.prototype.reverse = function () {
        this.state = REVERSING;
        this._time = this.duration - this._time;
        this._startTime = this.getTimer() - this._time;
        this.onEnterFrame();
        this.fire('onReverse');
    };
    TweenEngine.prototype.seek = function (t) {
        this.pause();
        this._time = t;
        this.update();
        this.fire('onSeek');
    };
    TweenEngine.prototype.reset = function () {
        this.pause();
        this._time = 0;
        this.update();
        this.fire('onReset');
    };
    TweenEngine.prototype.finish = function () {
        this.pause();
        this._time = this.duration;
        this.update();
        this.fire('onFinish');
    };
    TweenEngine.prototype.update = function () {
        this.setPosition(this.getPosition(this._time));
    };
    TweenEngine.prototype.onEnterFrame = function () {
        var t = this.getTimer() - this._startTime;
        if (this.state === PLAYING) {
            this.setTime(t);
        }
        else if (this.state === REVERSING) {
            this.setTime(this.duration - t);
        }
    };
    TweenEngine.prototype.pause = function () {
        this.state = PAUSED;
        this.fire('onPause');
    };
    TweenEngine.prototype.getTimer = function () {
        return new Date().getTime();
    };
    return TweenEngine;
}());
var Tween = (function () {
    function Tween(config) {
        var that = this, node = config.node, nodeId = node._id, duration, easing = config.easing || exports.Easings.Linear, yoyo = !!config.yoyo, key;
        if (typeof config.duration === 'undefined') {
            duration = 0.3;
        }
        else if (config.duration === 0) {
            duration = 0.001;
        }
        else {
            duration = config.duration;
        }
        this.node = node;
        this._id = idCounter++;
        var layers = node.getLayer() ||
            (node instanceof Global_1.Konva['Stage'] ? node.getLayers() : null);
        if (!layers) {
            Util_1.Util.error('Tween constructor have `node` that is not in a layer. Please add node into layer first.');
        }
        this.anim = new Animation_1.Animation(function () {
            that.tween.onEnterFrame();
        }, layers);
        this.tween = new TweenEngine(key, function (i) {
            that._tweenFunc(i);
        }, easing, 0, 1, duration * 1000, yoyo);
        this._addListeners();
        if (!Tween.attrs[nodeId]) {
            Tween.attrs[nodeId] = {};
        }
        if (!Tween.attrs[nodeId][this._id]) {
            Tween.attrs[nodeId][this._id] = {};
        }
        if (!Tween.tweens[nodeId]) {
            Tween.tweens[nodeId] = {};
        }
        for (key in config) {
            if (blacklist[key] === undefined) {
                this._addAttr(key, config[key]);
            }
        }
        this.reset();
        this.onFinish = config.onFinish;
        this.onReset = config.onReset;
    }
    Tween.prototype._addAttr = function (key, end) {
        var node = this.node, nodeId = node._id, start, diff, tweenId, n, len, trueEnd, trueStart, endRGBA;
        tweenId = Tween.tweens[nodeId][key];
        if (tweenId) {
            delete Tween.attrs[nodeId][tweenId][key];
        }
        start = node.getAttr(key);
        if (Util_1.Util._isArray(end)) {
            diff = [];
            len = Math.max(end.length, start.length);
            if (key === 'points' && end.length !== start.length) {
                if (end.length > start.length) {
                    trueStart = start;
                    start = Util_1.Util._prepareArrayForTween(start, end, node.closed());
                }
                else {
                    trueEnd = end;
                    end = Util_1.Util._prepareArrayForTween(end, start, node.closed());
                }
            }
            if (key.indexOf('fill') === 0) {
                for (n = 0; n < len; n++) {
                    if (n % 2 === 0) {
                        diff.push(end[n] - start[n]);
                    }
                    else {
                        var startRGBA = Util_1.Util.colorToRGBA(start[n]);
                        endRGBA = Util_1.Util.colorToRGBA(end[n]);
                        start[n] = startRGBA;
                        diff.push({
                            r: endRGBA.r - startRGBA.r,
                            g: endRGBA.g - startRGBA.g,
                            b: endRGBA.b - startRGBA.b,
                            a: endRGBA.a - startRGBA.a
                        });
                    }
                }
            }
            else {
                for (n = 0; n < len; n++) {
                    diff.push(end[n] - start[n]);
                }
            }
        }
        else if (colorAttrs.indexOf(key) !== -1) {
            start = Util_1.Util.colorToRGBA(start);
            endRGBA = Util_1.Util.colorToRGBA(end);
            diff = {
                r: endRGBA.r - start.r,
                g: endRGBA.g - start.g,
                b: endRGBA.b - start.b,
                a: endRGBA.a - start.a
            };
        }
        else {
            diff = end - start;
        }
        Tween.attrs[nodeId][this._id][key] = {
            start: start,
            diff: diff,
            end: end,
            trueEnd: trueEnd,
            trueStart: trueStart
        };
        Tween.tweens[nodeId][key] = this._id;
    };
    Tween.prototype._tweenFunc = function (i) {
        var node = this.node, attrs = Tween.attrs[node._id][this._id], key, attr, start, diff, newVal, n, len, end;
        for (key in attrs) {
            attr = attrs[key];
            start = attr.start;
            diff = attr.diff;
            end = attr.end;
            if (Util_1.Util._isArray(start)) {
                newVal = [];
                len = Math.max(start.length, end.length);
                if (key.indexOf('fill') === 0) {
                    for (n = 0; n < len; n++) {
                        if (n % 2 === 0) {
                            newVal.push((start[n] || 0) + diff[n] * i);
                        }
                        else {
                            newVal.push('rgba(' +
                                Math.round(start[n].r + diff[n].r * i) +
                                ',' +
                                Math.round(start[n].g + diff[n].g * i) +
                                ',' +
                                Math.round(start[n].b + diff[n].b * i) +
                                ',' +
                                (start[n].a + diff[n].a * i) +
                                ')');
                        }
                    }
                }
                else {
                    for (n = 0; n < len; n++) {
                        newVal.push((start[n] || 0) + diff[n] * i);
                    }
                }
            }
            else if (colorAttrs.indexOf(key) !== -1) {
                newVal =
                    'rgba(' +
                        Math.round(start.r + diff.r * i) +
                        ',' +
                        Math.round(start.g + diff.g * i) +
                        ',' +
                        Math.round(start.b + diff.b * i) +
                        ',' +
                        (start.a + diff.a * i) +
                        ')';
            }
            else {
                newVal = start + diff * i;
            }
            node.setAttr(key, newVal);
        }
    };
    Tween.prototype._addListeners = function () {
        var _this = this;
        this.tween.onPlay = function () {
            _this.anim.start();
        };
        this.tween.onReverse = function () {
            _this.anim.start();
        };
        this.tween.onPause = function () {
            _this.anim.stop();
        };
        this.tween.onFinish = function () {
            var node = _this.node;
            var attrs = Tween.attrs[node._id][_this._id];
            if (attrs.points && attrs.points.trueEnd) {
                node.setAttr('points', attrs.points.trueEnd);
            }
            if (_this.onFinish) {
                _this.onFinish.call(_this);
            }
        };
        this.tween.onReset = function () {
            var node = _this.node;
            var attrs = Tween.attrs[node._id][_this._id];
            if (attrs.points && attrs.points.trueStart) {
                node.points(attrs.points.trueStart);
            }
            if (_this.onReset) {
                _this.onReset();
            }
        };
    };
    Tween.prototype.play = function () {
        this.tween.play();
        return this;
    };
    Tween.prototype.reverse = function () {
        this.tween.reverse();
        return this;
    };
    Tween.prototype.reset = function () {
        this.tween.reset();
        return this;
    };
    Tween.prototype.seek = function (t) {
        this.tween.seek(t * 1000);
        return this;
    };
    Tween.prototype.pause = function () {
        this.tween.pause();
        return this;
    };
    Tween.prototype.finish = function () {
        this.tween.finish();
        return this;
    };
    Tween.prototype.destroy = function () {
        var nodeId = this.node._id, thisId = this._id, attrs = Tween.tweens[nodeId], key;
        this.pause();
        for (key in attrs) {
            delete Tween.tweens[nodeId][key];
        }
        delete Tween.attrs[nodeId][thisId];
    };
    Tween.attrs = {};
    Tween.tweens = {};
    return Tween;
}());
exports.Tween = Tween;
Node_1.Node.prototype.to = function (params) {
    var onFinish = params.onFinish;
    params.node = this;
    params.onFinish = function () {
        this.destroy();
        if (onFinish) {
            onFinish();
        }
    };
    var tween = new Tween(params);
    tween.play();
};
exports.Easings = {
    BackEaseIn: function (t, b, c, d) {
        var s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    BackEaseOut: function (t, b, c, d) {
        var s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    BackEaseInOut: function (t, b, c, d) {
        var s = 1.70158;
        if ((t /= d / 2) < 1) {
            return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    ElasticEaseIn: function (t, b, c, d, a, p) {
        var s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        return (-(a *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b);
    },
    ElasticEaseOut: function (t, b, c, d, a, p) {
        var s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
            c +
            b);
    },
    ElasticEaseInOut: function (t, b, c, d, a, p) {
        var s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        if (t < 1) {
            return (-0.5 *
                (a *
                    Math.pow(2, 10 * (t -= 1)) *
                    Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                b);
        }
        return (a *
            Math.pow(2, -10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
            0.5 +
            c +
            b);
    },
    BounceEaseOut: function (t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        }
        else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        }
        else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
        }
    },
    BounceEaseIn: function (t, b, c, d) {
        return c - exports.Easings.BounceEaseOut(d - t, 0, c, d) + b;
    },
    BounceEaseInOut: function (t, b, c, d) {
        if (t < d / 2) {
            return exports.Easings.BounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
        }
        else {
            return exports.Easings.BounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    },
    EaseIn: function (t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    EaseOut: function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    EaseInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t + b;
        }
        return (-c / 2) * (--t * (t - 2) - 1) + b;
    },
    StrongEaseIn: function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    StrongEaseOut: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    StrongEaseInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t * t * t * t + b;
        }
        return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
    },
    Linear: function (t, b, c, d) {
        return (c * t) / d + b;
    }
};

},{"./Util":"../../node_modules/konva/lib/Util.js","./Animation":"../../node_modules/konva/lib/Animation.js","./Node":"../../node_modules/konva/lib/Node.js","./Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/_CoreInternals.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("./Global");
var Util_1 = require("./Util");
var Node_1 = require("./Node");
var Container_1 = require("./Container");
var Stage_1 = require("./Stage");
var Layer_1 = require("./Layer");
var FastLayer_1 = require("./FastLayer");
var Group_1 = require("./Group");
var DragAndDrop_1 = require("./DragAndDrop");
var Shape_1 = require("./Shape");
var Animation_1 = require("./Animation");
var Tween_1 = require("./Tween");
var Context_1 = require("./Context");
var Canvas_1 = require("./Canvas");
exports.Konva = Util_1.Util._assign(Global_1.Konva, {
    Collection: Util_1.Collection,
    Util: Util_1.Util,
    Transform: Util_1.Transform,
    Node: Node_1.Node,
    ids: Node_1.ids,
    names: Node_1.names,
    Container: Container_1.Container,
    Stage: Stage_1.Stage,
    stages: Stage_1.stages,
    Layer: Layer_1.Layer,
    FastLayer: FastLayer_1.FastLayer,
    Group: Group_1.Group,
    DD: DragAndDrop_1.DD,
    Shape: Shape_1.Shape,
    shapes: Shape_1.shapes,
    Animation: Animation_1.Animation,
    Tween: Tween_1.Tween,
    Easings: Tween_1.Easings,
    Context: Context_1.Context,
    Canvas: Canvas_1.Canvas
});

},{"./Global":"../../node_modules/konva/lib/Global.js","./Util":"../../node_modules/konva/lib/Util.js","./Node":"../../node_modules/konva/lib/Node.js","./Container":"../../node_modules/konva/lib/Container.js","./Stage":"../../node_modules/konva/lib/Stage.js","./Layer":"../../node_modules/konva/lib/Layer.js","./FastLayer":"../../node_modules/konva/lib/FastLayer.js","./Group":"../../node_modules/konva/lib/Group.js","./DragAndDrop":"../../node_modules/konva/lib/DragAndDrop.js","./Shape":"../../node_modules/konva/lib/Shape.js","./Animation":"../../node_modules/konva/lib/Animation.js","./Tween":"../../node_modules/konva/lib/Tween.js","./Context":"../../node_modules/konva/lib/Context.js","./Canvas":"../../node_modules/konva/lib/Canvas.js"}],"../../node_modules/konva/lib/shapes/Arc.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Global_1 = require("../Global");
var Validators_1 = require("../Validators");
var Global_2 = require("../Global");
var Arc = (function (_super) {
    __extends(Arc, _super);
    function Arc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Arc.prototype._sceneFunc = function (context) {
        var angle = Global_1.Konva.getAngle(this.angle()), clockwise = this.clockwise();
        context.beginPath();
        context.arc(0, 0, this.outerRadius(), 0, angle, clockwise);
        context.arc(0, 0, this.innerRadius(), angle, 0, !clockwise);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Arc.prototype.getWidth = function () {
        return this.outerRadius() * 2;
    };
    Arc.prototype.getHeight = function () {
        return this.outerRadius() * 2;
    };
    Arc.prototype.setWidth = function (width) {
        this.outerRadius(width / 2);
    };
    Arc.prototype.setHeight = function (height) {
        this.outerRadius(height / 2);
    };
    return Arc;
}(Shape_1.Shape));
exports.Arc = Arc;
Arc.prototype._centroid = true;
Arc.prototype.className = 'Arc';
Arc.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
Global_2._registerNode(Arc);
Factory_1.Factory.addGetterSetter(Arc, 'innerRadius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Arc, 'outerRadius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Arc, 'angle', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Arc, 'clockwise', false, Validators_1.getBooleanValidator());
Util_1.Collection.mapMethods(Arc);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Global":"../../node_modules/konva/lib/Global.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/shapes/Line.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Validators_1 = require("../Validators");
var Global_1 = require("../Global");
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(config) {
        var _this = _super.call(this, config) || this;
        _this.on('pointsChange.konva tensionChange.konva closedChange.konva bezierChange.konva', function () {
            this._clearCache('tensionPoints');
        });
        return _this;
    }
    Line.prototype._sceneFunc = function (context) {
        var points = this.points(), length = points.length, tension = this.tension(), closed = this.closed(), bezier = this.bezier(), tp, len, n;
        if (!length) {
            return;
        }
        context.beginPath();
        context.moveTo(points[0], points[1]);
        if (tension !== 0 && length > 4) {
            tp = this.getTensionPoints();
            len = tp.length;
            n = closed ? 0 : 4;
            if (!closed) {
                context.quadraticCurveTo(tp[0], tp[1], tp[2], tp[3]);
            }
            while (n < len - 2) {
                context.bezierCurveTo(tp[n++], tp[n++], tp[n++], tp[n++], tp[n++], tp[n++]);
            }
            if (!closed) {
                context.quadraticCurveTo(tp[len - 2], tp[len - 1], points[length - 2], points[length - 1]);
            }
        }
        else if (bezier) {
            n = 2;
            while (n < length) {
                context.bezierCurveTo(points[n++], points[n++], points[n++], points[n++], points[n++], points[n++]);
            }
        }
        else {
            for (n = 2; n < length; n += 2) {
                context.lineTo(points[n], points[n + 1]);
            }
        }
        if (closed) {
            context.closePath();
            context.fillStrokeShape(this);
        }
        else {
            context.strokeShape(this);
        }
    };
    Line.prototype.getTensionPoints = function () {
        return this._getCache('tensionPoints', this._getTensionPoints);
    };
    Line.prototype._getTensionPoints = function () {
        if (this.closed()) {
            return this._getTensionPointsClosed();
        }
        else {
            return Util_1.Util._expandPoints(this.points(), this.tension());
        }
    };
    Line.prototype._getTensionPointsClosed = function () {
        var p = this.points(), len = p.length, tension = this.tension(), firstControlPoints = Util_1.Util._getControlPoints(p[len - 2], p[len - 1], p[0], p[1], p[2], p[3], tension), lastControlPoints = Util_1.Util._getControlPoints(p[len - 4], p[len - 3], p[len - 2], p[len - 1], p[0], p[1], tension), middle = Util_1.Util._expandPoints(p, tension), tp = [firstControlPoints[2], firstControlPoints[3]]
            .concat(middle)
            .concat([
            lastControlPoints[0],
            lastControlPoints[1],
            p[len - 2],
            p[len - 1],
            lastControlPoints[2],
            lastControlPoints[3],
            firstControlPoints[0],
            firstControlPoints[1],
            p[0],
            p[1]
        ]);
        return tp;
    };
    Line.prototype.getWidth = function () {
        return this.getSelfRect().width;
    };
    Line.prototype.getHeight = function () {
        return this.getSelfRect().height;
    };
    Line.prototype.getSelfRect = function () {
        var points = this.points();
        if (points.length < 4) {
            return {
                x: points[0] || 0,
                y: points[1] || 0,
                width: 0,
                height: 0
            };
        }
        if (this.tension() !== 0) {
            points = __spreadArrays([
                points[0],
                points[1]
            ], this._getTensionPoints(), [
                points[points.length - 2],
                points[points.length - 1]
            ]);
        }
        else {
            points = this.points();
        }
        var minX = points[0];
        var maxX = points[0];
        var minY = points[1];
        var maxY = points[1];
        var x, y;
        for (var i = 0; i < points.length / 2; i++) {
            x = points[i * 2];
            y = points[i * 2 + 1];
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    };
    return Line;
}(Shape_1.Shape));
exports.Line = Line;
Line.prototype.className = 'Line';
Line.prototype._attrsAffectingSize = ['points', 'bezier', 'tension'];
Global_1._registerNode(Line);
Factory_1.Factory.addGetterSetter(Line, 'closed', false);
Factory_1.Factory.addGetterSetter(Line, 'bezier', false);
Factory_1.Factory.addGetterSetter(Line, 'tension', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Line, 'points', [], Validators_1.getNumberArrayValidator());
Util_1.Collection.mapMethods(Line);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Validators":"../../node_modules/konva/lib/Validators.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/Arrow.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Line_1 = require("./Line");
var Validators_1 = require("../Validators");
var Global_1 = require("../Global");
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    function Arrow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Arrow.prototype._sceneFunc = function (ctx) {
        _super.prototype._sceneFunc.call(this, ctx);
        var PI2 = Math.PI * 2;
        var points = this.points();
        var tp = points;
        var fromTension = this.tension() !== 0 && points.length > 4;
        if (fromTension) {
            tp = this.getTensionPoints();
        }
        var n = points.length;
        var dx, dy;
        if (fromTension) {
            dx = points[n - 2] - (tp[tp.length - 2] + tp[tp.length - 4]) / 2;
            dy = points[n - 1] - (tp[tp.length - 1] + tp[tp.length - 3]) / 2;
        }
        else {
            dx = points[n - 2] - points[n - 4];
            dy = points[n - 1] - points[n - 3];
        }
        var radians = (Math.atan2(dy, dx) + PI2) % PI2;
        var length = this.pointerLength();
        var width = this.pointerWidth();
        ctx.save();
        ctx.beginPath();
        ctx.translate(points[n - 2], points[n - 1]);
        ctx.rotate(radians);
        ctx.moveTo(0, 0);
        ctx.lineTo(-length, width / 2);
        ctx.lineTo(-length, -width / 2);
        ctx.closePath();
        ctx.restore();
        if (this.pointerAtBeginning()) {
            ctx.save();
            ctx.translate(points[0], points[1]);
            if (fromTension) {
                dx = (tp[0] + tp[2]) / 2 - points[0];
                dy = (tp[1] + tp[3]) / 2 - points[1];
            }
            else {
                dx = points[2] - points[0];
                dy = points[3] - points[1];
            }
            ctx.rotate((Math.atan2(-dy, -dx) + PI2) % PI2);
            ctx.moveTo(0, 0);
            ctx.lineTo(-length, width / 2);
            ctx.lineTo(-length, -width / 2);
            ctx.closePath();
            ctx.restore();
        }
        var isDashEnabled = this.dashEnabled();
        if (isDashEnabled) {
            this.attrs.dashEnabled = false;
            ctx.setLineDash([]);
        }
        ctx.fillStrokeShape(this);
        if (isDashEnabled) {
            this.attrs.dashEnabled = true;
        }
    };
    Arrow.prototype.getSelfRect = function () {
        var lineRect = _super.prototype.getSelfRect.call(this);
        var offset = this.pointerWidth() / 2;
        return {
            x: lineRect.x - offset,
            y: lineRect.y - offset,
            width: lineRect.width + offset * 2,
            height: lineRect.height + offset * 2
        };
    };
    return Arrow;
}(Line_1.Line));
exports.Arrow = Arrow;
Arrow.prototype.className = 'Arrow';
Global_1._registerNode(Arrow);
Factory_1.Factory.addGetterSetter(Arrow, 'pointerLength', 10, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Arrow, 'pointerWidth', 10, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Arrow, 'pointerAtBeginning', false);
Util_1.Collection.mapMethods(Arrow);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","./Line":"../../node_modules/konva/lib/shapes/Line.js","../Validators":"../../node_modules/konva/lib/Validators.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/Circle.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Validators_1 = require("../Validators");
var Global_1 = require("../Global");
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Circle.prototype._sceneFunc = function (context) {
        context.beginPath();
        context.arc(0, 0, this.radius(), 0, Math.PI * 2, false);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Circle.prototype.getWidth = function () {
        return this.radius() * 2;
    };
    Circle.prototype.getHeight = function () {
        return this.radius() * 2;
    };
    Circle.prototype.setWidth = function (width) {
        if (this.radius() !== width / 2) {
            this.radius(width / 2);
        }
    };
    Circle.prototype.setHeight = function (height) {
        if (this.radius() !== height / 2) {
            this.radius(height / 2);
        }
    };
    return Circle;
}(Shape_1.Shape));
exports.Circle = Circle;
Circle.prototype._centroid = true;
Circle.prototype.className = 'Circle';
Circle.prototype._attrsAffectingSize = ['radius'];
Global_1._registerNode(Circle);
Factory_1.Factory.addGetterSetter(Circle, 'radius', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(Circle);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Validators":"../../node_modules/konva/lib/Validators.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/Ellipse.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Validators_1 = require("../Validators");
var Global_1 = require("../Global");
var Ellipse = (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ellipse.prototype._sceneFunc = function (context) {
        var rx = this.radiusX(), ry = this.radiusY();
        context.beginPath();
        context.save();
        if (rx !== ry) {
            context.scale(1, ry / rx);
        }
        context.arc(0, 0, rx, 0, Math.PI * 2, false);
        context.restore();
        context.closePath();
        context.fillStrokeShape(this);
    };
    Ellipse.prototype.getWidth = function () {
        return this.radiusX() * 2;
    };
    Ellipse.prototype.getHeight = function () {
        return this.radiusY() * 2;
    };
    Ellipse.prototype.setWidth = function (width) {
        this.radiusX(width / 2);
    };
    Ellipse.prototype.setHeight = function (height) {
        this.radiusY(height / 2);
    };
    return Ellipse;
}(Shape_1.Shape));
exports.Ellipse = Ellipse;
Ellipse.prototype.className = 'Ellipse';
Ellipse.prototype._centroid = true;
Ellipse.prototype._attrsAffectingSize = ['radiusX', 'radiusY'];
Global_1._registerNode(Ellipse);
Factory_1.Factory.addComponentsGetterSetter(Ellipse, 'radius', ['x', 'y']);
Factory_1.Factory.addGetterSetter(Ellipse, 'radiusX', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Ellipse, 'radiusY', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(Ellipse);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Validators":"../../node_modules/konva/lib/Validators.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/Image.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Validators_1 = require("../Validators");
var Global_1 = require("../Global");
var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Image.prototype._useBufferCanvas = function () {
        return !!((this.hasShadow() || this.getAbsoluteOpacity() !== 1) &&
            this.hasStroke() &&
            this.getStage());
    };
    Image.prototype._sceneFunc = function (context) {
        var width = this.width(), height = this.height(), image = this.image(), cropWidth, cropHeight, params;
        if (image) {
            cropWidth = this.cropWidth();
            cropHeight = this.cropHeight();
            if (cropWidth && cropHeight) {
                params = [
                    image,
                    this.cropX(),
                    this.cropY(),
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    width,
                    height
                ];
            }
            else {
                params = [image, 0, 0, width, height];
            }
        }
        if (this.hasFill() || this.hasStroke()) {
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        }
        if (image) {
            context.drawImage.apply(context, params);
        }
    };
    Image.prototype._hitFunc = function (context) {
        var width = this.width(), height = this.height();
        context.beginPath();
        context.rect(0, 0, width, height);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Image.prototype.getWidth = function () {
        var _a;
        var image = this.image();
        return _a = this.attrs.width, (_a !== null && _a !== void 0 ? _a : (image ? image.width : 0));
    };
    Image.prototype.getHeight = function () {
        var _a;
        var image = this.image();
        return _a = this.attrs.height, (_a !== null && _a !== void 0 ? _a : (image ? image.height : 0));
    };
    Image.fromURL = function (url, callback) {
        var img = Util_1.Util.createImageElement();
        img.onload = function () {
            var image = new Image({
                image: img
            });
            callback(image);
        };
        img.crossOrigin = 'Anonymous';
        img.src = url;
    };
    return Image;
}(Shape_1.Shape));
exports.Image = Image;
Image.prototype.className = 'Image';
Global_1._registerNode(Image);
Factory_1.Factory.addGetterSetter(Image, 'image');
Factory_1.Factory.addComponentsGetterSetter(Image, 'crop', ['x', 'y', 'width', 'height']);
Factory_1.Factory.addGetterSetter(Image, 'cropX', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Image, 'cropY', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Image, 'cropWidth', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Image, 'cropHeight', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(Image);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Validators":"../../node_modules/konva/lib/Validators.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/Label.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Group_1 = require("../Group");
var Validators_1 = require("../Validators");
var Global_1 = require("../Global");
var ATTR_CHANGE_LIST = [
    'fontFamily',
    'fontSize',
    'fontStyle',
    'padding',
    'lineHeight',
    'text',
    'width'
], CHANGE_KONVA = 'Change.konva', NONE = 'none', UP = 'up', RIGHT = 'right', DOWN = 'down', LEFT = 'left', attrChangeListLen = ATTR_CHANGE_LIST.length;
var Label = (function (_super) {
    __extends(Label, _super);
    function Label(config) {
        var _this = _super.call(this, config) || this;
        _this.on('add.konva', function (evt) {
            this._addListeners(evt.child);
            this._sync();
        });
        return _this;
    }
    Label.prototype.getText = function () {
        return this.find('Text')[0];
    };
    Label.prototype.getTag = function () {
        return this.find('Tag')[0];
    };
    Label.prototype._addListeners = function (text) {
        var that = this, n;
        var func = function () {
            that._sync();
        };
        for (n = 0; n < attrChangeListLen; n++) {
            text.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, func);
        }
    };
    Label.prototype.getWidth = function () {
        return this.getText().width();
    };
    Label.prototype.getHeight = function () {
        return this.getText().height();
    };
    Label.prototype._sync = function () {
        var text = this.getText(), tag = this.getTag(), width, height, pointerDirection, pointerWidth, x, y, pointerHeight;
        if (text && tag) {
            width = text.width();
            height = text.height();
            pointerDirection = tag.pointerDirection();
            pointerWidth = tag.pointerWidth();
            pointerHeight = tag.pointerHeight();
            x = 0;
            y = 0;
            switch (pointerDirection) {
                case UP:
                    x = width / 2;
                    y = -1 * pointerHeight;
                    break;
                case RIGHT:
                    x = width + pointerWidth;
                    y = height / 2;
                    break;
                case DOWN:
                    x = width / 2;
                    y = height + pointerHeight;
                    break;
                case LEFT:
                    x = -1 * pointerWidth;
                    y = height / 2;
                    break;
            }
            tag.setAttrs({
                x: -1 * x,
                y: -1 * y,
                width: width,
                height: height
            });
            text.setAttrs({
                x: -1 * x,
                y: -1 * y
            });
        }
    };
    return Label;
}(Group_1.Group));
exports.Label = Label;
Label.prototype.className = 'Label';
Global_1._registerNode(Label);
Util_1.Collection.mapMethods(Label);
var Tag = (function (_super) {
    __extends(Tag, _super);
    function Tag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tag.prototype._sceneFunc = function (context) {
        var width = this.width(), height = this.height(), pointerDirection = this.pointerDirection(), pointerWidth = this.pointerWidth(), pointerHeight = this.pointerHeight(), cornerRadius = Math.min(this.cornerRadius(), width / 2, height / 2);
        context.beginPath();
        if (!cornerRadius) {
            context.moveTo(0, 0);
        }
        else {
            context.moveTo(cornerRadius, 0);
        }
        if (pointerDirection === UP) {
            context.lineTo((width - pointerWidth) / 2, 0);
            context.lineTo(width / 2, -1 * pointerHeight);
            context.lineTo((width + pointerWidth) / 2, 0);
        }
        if (!cornerRadius) {
            context.lineTo(width, 0);
        }
        else {
            context.lineTo(width - cornerRadius, 0);
            context.arc(width - cornerRadius, cornerRadius, cornerRadius, (Math.PI * 3) / 2, 0, false);
        }
        if (pointerDirection === RIGHT) {
            context.lineTo(width, (height - pointerHeight) / 2);
            context.lineTo(width + pointerWidth, height / 2);
            context.lineTo(width, (height + pointerHeight) / 2);
        }
        if (!cornerRadius) {
            context.lineTo(width, height);
        }
        else {
            context.lineTo(width, height - cornerRadius);
            context.arc(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2, false);
        }
        if (pointerDirection === DOWN) {
            context.lineTo((width + pointerWidth) / 2, height);
            context.lineTo(width / 2, height + pointerHeight);
            context.lineTo((width - pointerWidth) / 2, height);
        }
        if (!cornerRadius) {
            context.lineTo(0, height);
        }
        else {
            context.lineTo(cornerRadius, height);
            context.arc(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false);
        }
        if (pointerDirection === LEFT) {
            context.lineTo(0, (height + pointerHeight) / 2);
            context.lineTo(-1 * pointerWidth, height / 2);
            context.lineTo(0, (height - pointerHeight) / 2);
        }
        if (cornerRadius) {
            context.lineTo(0, cornerRadius);
            context.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, (Math.PI * 3) / 2, false);
        }
        context.closePath();
        context.fillStrokeShape(this);
    };
    Tag.prototype.getSelfRect = function () {
        var x = 0, y = 0, pointerWidth = this.pointerWidth(), pointerHeight = this.pointerHeight(), direction = this.pointerDirection(), width = this.width(), height = this.height();
        if (direction === UP) {
            y -= pointerHeight;
            height += pointerHeight;
        }
        else if (direction === DOWN) {
            height += pointerHeight;
        }
        else if (direction === LEFT) {
            x -= pointerWidth * 1.5;
            width += pointerWidth;
        }
        else if (direction === RIGHT) {
            width += pointerWidth * 1.5;
        }
        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    };
    return Tag;
}(Shape_1.Shape));
exports.Tag = Tag;
Tag.prototype.className = 'Tag';
Global_1._registerNode(Tag);
Factory_1.Factory.addGetterSetter(Tag, 'pointerDirection', NONE);
Factory_1.Factory.addGetterSetter(Tag, 'pointerWidth', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Tag, 'pointerHeight', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Tag, 'cornerRadius', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(Tag);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Group":"../../node_modules/konva/lib/Group.js","../Validators":"../../node_modules/konva/lib/Validators.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/Path.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Global_1 = require("../Global");
var Path = (function (_super) {
    __extends(Path, _super);
    function Path(config) {
        var _this = _super.call(this, config) || this;
        _this.dataArray = [];
        _this.pathLength = 0;
        _this.dataArray = Path.parsePathData(_this.data());
        _this.pathLength = 0;
        for (var i = 0; i < _this.dataArray.length; ++i) {
            _this.pathLength += _this.dataArray[i].pathLength;
        }
        _this.on('dataChange.konva', function () {
            this.dataArray = Path.parsePathData(this.data());
            this.pathLength = 0;
            for (var i = 0; i < this.dataArray.length; ++i) {
                this.pathLength += this.dataArray[i].pathLength;
            }
        });
        return _this;
    }
    Path.prototype._sceneFunc = function (context) {
        var ca = this.dataArray;
        context.beginPath();
        var isClosed = false;
        for (var n = 0; n < ca.length; n++) {
            var c = ca[n].command;
            var p = ca[n].points;
            switch (c) {
                case 'L':
                    context.lineTo(p[0], p[1]);
                    break;
                case 'M':
                    context.moveTo(p[0], p[1]);
                    break;
                case 'C':
                    context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                    break;
                case 'Q':
                    context.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                    break;
                case 'A':
                    var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6], fs = p[7];
                    var r = rx > ry ? rx : ry;
                    var scaleX = rx > ry ? 1 : rx / ry;
                    var scaleY = rx > ry ? ry / rx : 1;
                    context.translate(cx, cy);
                    context.rotate(psi);
                    context.scale(scaleX, scaleY);
                    context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                    context.scale(1 / scaleX, 1 / scaleY);
                    context.rotate(-psi);
                    context.translate(-cx, -cy);
                    break;
                case 'z':
                    isClosed = true;
                    context.closePath();
                    break;
            }
        }
        if (!isClosed && !this.hasFill()) {
            context.strokeShape(this);
        }
        else {
            context.fillStrokeShape(this);
        }
    };
    Path.prototype.getSelfRect = function () {
        var points = [];
        this.dataArray.forEach(function (data) {
            if (data.command === 'A') {
                var start = data.points[4];
                var dTheta = data.points[5];
                var end = data.points[4] + dTheta;
                var inc = Math.PI / 180.0;
                if (Math.abs(start - end) < inc) {
                    inc = Math.abs(start - end);
                }
                if (dTheta < 0) {
                    for (var t = start - inc; t > end; t -= inc) {
                        var point = Path.getPointOnEllipticalArc(data.points[0], data.points[1], data.points[2], data.points[3], t, 0);
                        points.push(point.x, point.y);
                    }
                }
                else {
                    for (var t = start + inc; t < end; t += inc) {
                        var point = Path.getPointOnEllipticalArc(data.points[0], data.points[1], data.points[2], data.points[3], t, 0);
                        points.push(point.x, point.y);
                    }
                }
            }
            else if (data.command === 'C') {
                for (var t = 0.0; t <= 1; t += 0.01) {
                    var point = Path.getPointOnCubicBezier(t, data.start.x, data.start.y, data.points[0], data.points[1], data.points[2], data.points[3], data.points[4], data.points[5]);
                    points.push(point.x, point.y);
                }
            }
            else {
                points = points.concat(data.points);
            }
        });
        var minX = points[0];
        var maxX = points[0];
        var minY = points[1];
        var maxY = points[1];
        var x, y;
        for (var i = 0; i < points.length / 2; i++) {
            x = points[i * 2];
            y = points[i * 2 + 1];
            if (!isNaN(x)) {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
            }
            if (!isNaN(y)) {
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
        }
        return {
            x: Math.round(minX),
            y: Math.round(minY),
            width: Math.round(maxX - minX),
            height: Math.round(maxY - minY)
        };
    };
    Path.prototype.getLength = function () {
        return this.pathLength;
    };
    Path.prototype.getPointAtLength = function (length) {
        var point, i = 0, ii = this.dataArray.length;
        if (!ii) {
            return null;
        }
        while (i < ii && length > this.dataArray[i].pathLength) {
            length -= this.dataArray[i].pathLength;
            ++i;
        }
        if (i === ii) {
            point = this.dataArray[i - 1].points.slice(-2);
            return {
                x: point[0],
                y: point[1]
            };
        }
        if (length < 0.01) {
            point = this.dataArray[i].points.slice(0, 2);
            return {
                x: point[0],
                y: point[1]
            };
        }
        var cp = this.dataArray[i];
        var p = cp.points;
        switch (cp.command) {
            case 'L':
                return Path.getPointOnLine(length, cp.start.x, cp.start.y, p[0], p[1]);
            case 'C':
                return Path.getPointOnCubicBezier(length / cp.pathLength, cp.start.x, cp.start.y, p[0], p[1], p[2], p[3], p[4], p[5]);
            case 'Q':
                return Path.getPointOnQuadraticBezier(length / cp.pathLength, cp.start.x, cp.start.y, p[0], p[1], p[2], p[3]);
            case 'A':
                var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6];
                theta += (dTheta * length) / cp.pathLength;
                return Path.getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi);
        }
        return null;
    };
    Path.getLineLength = function (x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    };
    Path.getPointOnLine = function (dist, P1x, P1y, P2x, P2y, fromX, fromY) {
        if (fromX === undefined) {
            fromX = P1x;
        }
        if (fromY === undefined) {
            fromY = P1y;
        }
        var m = (P2y - P1y) / (P2x - P1x + 0.00000001);
        var run = Math.sqrt((dist * dist) / (1 + m * m));
        if (P2x < P1x) {
            run *= -1;
        }
        var rise = m * run;
        var pt;
        if (P2x === P1x) {
            pt = {
                x: fromX,
                y: fromY + rise
            };
        }
        else if ((fromY - P1y) / (fromX - P1x + 0.00000001) === m) {
            pt = {
                x: fromX + run,
                y: fromY + rise
            };
        }
        else {
            var ix, iy;
            var len = this.getLineLength(P1x, P1y, P2x, P2y);
            if (len < 0.00000001) {
                return undefined;
            }
            var u = (fromX - P1x) * (P2x - P1x) + (fromY - P1y) * (P2y - P1y);
            u = u / (len * len);
            ix = P1x + u * (P2x - P1x);
            iy = P1y + u * (P2y - P1y);
            var pRise = this.getLineLength(fromX, fromY, ix, iy);
            var pRun = Math.sqrt(dist * dist - pRise * pRise);
            run = Math.sqrt((pRun * pRun) / (1 + m * m));
            if (P2x < P1x) {
                run *= -1;
            }
            rise = m * run;
            pt = {
                x: ix + run,
                y: iy + rise
            };
        }
        return pt;
    };
    Path.getPointOnCubicBezier = function (pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
        function CB1(t) {
            return t * t * t;
        }
        function CB2(t) {
            return 3 * t * t * (1 - t);
        }
        function CB3(t) {
            return 3 * t * (1 - t) * (1 - t);
        }
        function CB4(t) {
            return (1 - t) * (1 - t) * (1 - t);
        }
        var x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
        var y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);
        return {
            x: x,
            y: y
        };
    };
    Path.getPointOnQuadraticBezier = function (pct, P1x, P1y, P2x, P2y, P3x, P3y) {
        function QB1(t) {
            return t * t;
        }
        function QB2(t) {
            return 2 * t * (1 - t);
        }
        function QB3(t) {
            return (1 - t) * (1 - t);
        }
        var x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
        var y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);
        return {
            x: x,
            y: y
        };
    };
    Path.getPointOnEllipticalArc = function (cx, cy, rx, ry, theta, psi) {
        var cosPsi = Math.cos(psi), sinPsi = Math.sin(psi);
        var pt = {
            x: rx * Math.cos(theta),
            y: ry * Math.sin(theta)
        };
        return {
            x: cx + (pt.x * cosPsi - pt.y * sinPsi),
            y: cy + (pt.x * sinPsi + pt.y * cosPsi)
        };
    };
    Path.parsePathData = function (data) {
        if (!data) {
            return [];
        }
        var cs = data;
        var cc = [
            'm',
            'M',
            'l',
            'L',
            'v',
            'V',
            'h',
            'H',
            'z',
            'Z',
            'c',
            'C',
            'q',
            'Q',
            't',
            'T',
            's',
            'S',
            'a',
            'A'
        ];
        cs = cs.replace(new RegExp(' ', 'g'), ',');
        for (var n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        var arr = cs.split('|');
        var ca = [];
        var coords = [];
        var cpx = 0;
        var cpy = 0;
        var re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
        var match;
        for (n = 1; n < arr.length; n++) {
            var str = arr[n];
            var c = str.charAt(0);
            str = str.slice(1);
            coords.length = 0;
            while ((match = re.exec(str))) {
                coords.push(match[0]);
            }
            var p = [];
            for (var j = 0, jlen = coords.length; j < jlen; j++) {
                var parsed = parseFloat(coords[j]);
                if (!isNaN(parsed)) {
                    p.push(parsed);
                }
                else {
                    p.push(0);
                }
            }
            while (p.length > 0) {
                if (isNaN(p[0])) {
                    break;
                }
                var cmd = null;
                var points = [];
                var startX = cpx, startY = cpy;
                var prevCmd, ctlPtx, ctlPty;
                var rx, ry, psi, fa, fs, x1, y1;
                switch (c) {
                    case 'l':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'L':
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'm':
                        var dx = p.shift();
                        var dy = p.shift();
                        cpx += dx;
                        cpy += dy;
                        cmd = 'M';
                        if (ca.length > 2 && ca[ca.length - 1].command === 'z') {
                            for (var idx = ca.length - 2; idx >= 0; idx--) {
                                if (ca[idx].command === 'M') {
                                    cpx = ca[idx].points[0] + dx;
                                    cpy = ca[idx].points[1] + dy;
                                    break;
                                }
                            }
                        }
                        points.push(cpx, cpy);
                        c = 'l';
                        break;
                    case 'M':
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'L';
                        break;
                    case 'h':
                        cpx += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'H':
                        cpx = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'v':
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'V':
                        cpy = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'C':
                        points.push(p.shift(), p.shift(), p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'c':
                        points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'S':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 's':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'Q':
                        points.push(p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'q':
                        points.push(cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(cpx, cpy);
                        break;
                    case 'T':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 't':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 'A':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy;
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                    case 'a':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy;
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                }
                ca.push({
                    command: cmd || c,
                    points: points,
                    start: {
                        x: startX,
                        y: startY
                    },
                    pathLength: this.calcLength(startX, startY, cmd || c, points)
                });
            }
            if (c === 'z' || c === 'Z') {
                ca.push({
                    command: 'z',
                    points: [],
                    start: undefined,
                    pathLength: 0
                });
            }
        }
        return ca;
    };
    Path.calcLength = function (x, y, cmd, points) {
        var len, p1, p2, t;
        var path = Path;
        switch (cmd) {
            case 'L':
                return path.getLineLength(x, y, points[0], points[1]);
            case 'C':
                len = 0.0;
                p1 = path.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                for (t = 0.01; t <= 1; t += 0.01) {
                    p2 = path.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'Q':
                len = 0.0;
                p1 = path.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);
                for (t = 0.01; t <= 1; t += 0.01) {
                    p2 = path.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'A':
                len = 0.0;
                var start = points[4];
                var dTheta = points[5];
                var end = points[4] + dTheta;
                var inc = Math.PI / 180.0;
                if (Math.abs(start - end) < inc) {
                    inc = Math.abs(start - end);
                }
                p1 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
                if (dTheta < 0) {
                    for (t = start - inc; t > end; t -= inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                else {
                    for (t = start + inc; t < end; t += inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
                len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                return len;
        }
        return 0;
    };
    Path.convertEndpointToCenterParameterization = function (x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
        var psi = psiDeg * (Math.PI / 180.0);
        var xp = (Math.cos(psi) * (x1 - x2)) / 2.0 + (Math.sin(psi) * (y1 - y2)) / 2.0;
        var yp = (-1 * Math.sin(psi) * (x1 - x2)) / 2.0 +
            (Math.cos(psi) * (y1 - y2)) / 2.0;
        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }
        var f = Math.sqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) /
            (rx * rx * (yp * yp) + ry * ry * (xp * xp)));
        if (fa === fs) {
            f *= -1;
        }
        if (isNaN(f)) {
            f = 0;
        }
        var cxp = (f * rx * yp) / ry;
        var cyp = (f * -ry * xp) / rx;
        var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
        var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;
        var vMag = function (v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        var vRatio = function (u, v) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
        };
        var vAngle = function (u, v) {
            return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
        };
        var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
        var u = [(xp - cxp) / rx, (yp - cyp) / ry];
        var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
        var dTheta = vAngle(u, v);
        if (vRatio(u, v) <= -1) {
            dTheta = Math.PI;
        }
        if (vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if (fs === 0 && dTheta > 0) {
            dTheta = dTheta - 2 * Math.PI;
        }
        if (fs === 1 && dTheta < 0) {
            dTheta = dTheta + 2 * Math.PI;
        }
        return [cx, cy, rx, ry, theta, dTheta, psi, fs];
    };
    return Path;
}(Shape_1.Shape));
exports.Path = Path;
Path.prototype.className = 'Path';
Path.prototype._attrsAffectingSize = ['data'];
Global_1._registerNode(Path);
Factory_1.Factory.addGetterSetter(Path, 'data');
Util_1.Collection.mapMethods(Path);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/Rect.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Global_1 = require("../Global");
var Rect = (function (_super) {
    __extends(Rect, _super);
    function Rect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rect.prototype._sceneFunc = function (context) {
        var cornerRadius = this.cornerRadius(), width = this.width(), height = this.height();
        context.beginPath();
        if (!cornerRadius) {
            context.rect(0, 0, width, height);
        }
        else {
            var topLeft = 0;
            var topRight = 0;
            var bottomLeft = 0;
            var bottomRight = 0;
            if (typeof cornerRadius === 'number') {
                topLeft = topRight = bottomLeft = bottomRight = Math.min(cornerRadius, width / 2, height / 2);
            }
            else {
                topLeft = Math.min(cornerRadius[0], width / 2, height / 2);
                topRight = Math.min(cornerRadius[1], width / 2, height / 2);
                bottomRight = Math.min(cornerRadius[2], width / 2, height / 2);
                bottomLeft = Math.min(cornerRadius[3], width / 2, height / 2);
            }
            context.moveTo(topLeft, 0);
            context.lineTo(width - topRight, 0);
            context.arc(width - topRight, topRight, topRight, (Math.PI * 3) / 2, 0, false);
            context.lineTo(width, height - bottomRight);
            context.arc(width - bottomRight, height - bottomRight, bottomRight, 0, Math.PI / 2, false);
            context.lineTo(bottomLeft, height);
            context.arc(bottomLeft, height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI, false);
            context.lineTo(0, topLeft);
            context.arc(topLeft, topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false);
        }
        context.closePath();
        context.fillStrokeShape(this);
    };
    return Rect;
}(Shape_1.Shape));
exports.Rect = Rect;
Rect.prototype.className = 'Rect';
Global_1._registerNode(Rect);
Factory_1.Factory.addGetterSetter(Rect, 'cornerRadius', 0);
Util_1.Collection.mapMethods(Rect);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/RegularPolygon.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Validators_1 = require("../Validators");
var Global_1 = require("../Global");
var RegularPolygon = (function (_super) {
    __extends(RegularPolygon, _super);
    function RegularPolygon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RegularPolygon.prototype._sceneFunc = function (context) {
        var sides = this.sides(), radius = this.radius(), n, x, y;
        context.beginPath();
        context.moveTo(0, 0 - radius);
        for (n = 1; n < sides; n++) {
            x = radius * Math.sin((n * 2 * Math.PI) / sides);
            y = -1 * radius * Math.cos((n * 2 * Math.PI) / sides);
            context.lineTo(x, y);
        }
        context.closePath();
        context.fillStrokeShape(this);
    };
    RegularPolygon.prototype.getWidth = function () {
        return this.radius() * 2;
    };
    RegularPolygon.prototype.getHeight = function () {
        return this.radius() * 2;
    };
    RegularPolygon.prototype.setWidth = function (width) {
        this.radius(width / 2);
    };
    RegularPolygon.prototype.setHeight = function (height) {
        this.radius(height / 2);
    };
    return RegularPolygon;
}(Shape_1.Shape));
exports.RegularPolygon = RegularPolygon;
RegularPolygon.prototype.className = 'RegularPolygon';
RegularPolygon.prototype._centroid = true;
RegularPolygon.prototype._attrsAffectingSize = ['radius'];
Global_1._registerNode(RegularPolygon);
Factory_1.Factory.addGetterSetter(RegularPolygon, 'radius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(RegularPolygon, 'sides', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(RegularPolygon);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Validators":"../../node_modules/konva/lib/Validators.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/Ring.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Validators_1 = require("../Validators");
var Global_1 = require("../Global");
var PIx2 = Math.PI * 2;
var Ring = (function (_super) {
    __extends(Ring, _super);
    function Ring() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ring.prototype._sceneFunc = function (context) {
        context.beginPath();
        context.arc(0, 0, this.innerRadius(), 0, PIx2, false);
        context.moveTo(this.outerRadius(), 0);
        context.arc(0, 0, this.outerRadius(), PIx2, 0, true);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Ring.prototype.getWidth = function () {
        return this.outerRadius() * 2;
    };
    Ring.prototype.getHeight = function () {
        return this.outerRadius() * 2;
    };
    Ring.prototype.setWidth = function (width) {
        this.outerRadius(width / 2);
    };
    Ring.prototype.setHeight = function (height) {
        this.outerRadius(height / 2);
    };
    return Ring;
}(Shape_1.Shape));
exports.Ring = Ring;
Ring.prototype.className = 'Ring';
Ring.prototype._centroid = true;
Ring.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
Global_1._registerNode(Ring);
Factory_1.Factory.addGetterSetter(Ring, 'innerRadius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Ring, 'outerRadius', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(Ring);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Validators":"../../node_modules/konva/lib/Validators.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/Sprite.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Animation_1 = require("../Animation");
var Validators_1 = require("../Validators");
var Global_1 = require("../Global");
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(config) {
        var _this = _super.call(this, config) || this;
        _this._updated = true;
        _this.anim = new Animation_1.Animation(function () {
            var updated = _this._updated;
            _this._updated = false;
            return updated;
        });
        _this.on('animationChange.konva', function () {
            this.frameIndex(0);
        });
        _this.on('frameIndexChange.konva', function () {
            this._updated = true;
        });
        _this.on('frameRateChange.konva', function () {
            if (!this.anim.isRunning()) {
                return;
            }
            clearInterval(this.interval);
            this._setInterval();
        });
        return _this;
    }
    Sprite.prototype._sceneFunc = function (context) {
        var anim = this.animation(), index = this.frameIndex(), ix4 = index * 4, set = this.animations()[anim], offsets = this.frameOffsets(), x = set[ix4 + 0], y = set[ix4 + 1], width = set[ix4 + 2], height = set[ix4 + 3], image = this.image();
        if (this.hasFill() || this.hasStroke()) {
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        }
        if (image) {
            if (offsets) {
                var offset = offsets[anim], ix2 = index * 2;
                context.drawImage(image, x, y, width, height, offset[ix2 + 0], offset[ix2 + 1], width, height);
            }
            else {
                context.drawImage(image, x, y, width, height, 0, 0, width, height);
            }
        }
    };
    Sprite.prototype._hitFunc = function (context) {
        var anim = this.animation(), index = this.frameIndex(), ix4 = index * 4, set = this.animations()[anim], offsets = this.frameOffsets(), width = set[ix4 + 2], height = set[ix4 + 3];
        context.beginPath();
        if (offsets) {
            var offset = offsets[anim];
            var ix2 = index * 2;
            context.rect(offset[ix2 + 0], offset[ix2 + 1], width, height);
        }
        else {
            context.rect(0, 0, width, height);
        }
        context.closePath();
        context.fillShape(this);
    };
    Sprite.prototype._useBufferCanvas = function () {
        return ((this.hasShadow() || this.getAbsoluteOpacity() !== 1) && this.hasStroke());
    };
    Sprite.prototype._setInterval = function () {
        var that = this;
        this.interval = setInterval(function () {
            that._updateIndex();
        }, 1000 / this.frameRate());
    };
    Sprite.prototype.start = function () {
        if (this.isRunning()) {
            return;
        }
        var layer = this.getLayer();
        this.anim.setLayers(layer);
        this._setInterval();
        this.anim.start();
    };
    Sprite.prototype.stop = function () {
        this.anim.stop();
        clearInterval(this.interval);
    };
    Sprite.prototype.isRunning = function () {
        return this.anim.isRunning();
    };
    Sprite.prototype._updateIndex = function () {
        var index = this.frameIndex(), animation = this.animation(), animations = this.animations(), anim = animations[animation], len = anim.length / 4;
        if (index < len - 1) {
            this.frameIndex(index + 1);
        }
        else {
            this.frameIndex(0);
        }
    };
    return Sprite;
}(Shape_1.Shape));
exports.Sprite = Sprite;
Sprite.prototype.className = 'Sprite';
Global_1._registerNode(Sprite);
Factory_1.Factory.addGetterSetter(Sprite, 'animation');
Factory_1.Factory.addGetterSetter(Sprite, 'animations');
Factory_1.Factory.addGetterSetter(Sprite, 'frameOffsets');
Factory_1.Factory.addGetterSetter(Sprite, 'image');
Factory_1.Factory.addGetterSetter(Sprite, 'frameIndex', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Sprite, 'frameRate', 17, Validators_1.getNumberValidator());
Factory_1.Factory.backCompat(Sprite, {
    index: 'frameIndex',
    getIndex: 'getFrameIndex',
    setIndex: 'setFrameIndex'
});
Util_1.Collection.mapMethods(Sprite);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Animation":"../../node_modules/konva/lib/Animation.js","../Validators":"../../node_modules/konva/lib/Validators.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/Star.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Validators_1 = require("../Validators");
var Global_1 = require("../Global");
var Star = (function (_super) {
    __extends(Star, _super);
    function Star() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Star.prototype._sceneFunc = function (context) {
        var innerRadius = this.innerRadius(), outerRadius = this.outerRadius(), numPoints = this.numPoints();
        context.beginPath();
        context.moveTo(0, 0 - outerRadius);
        for (var n = 1; n < numPoints * 2; n++) {
            var radius = n % 2 === 0 ? outerRadius : innerRadius;
            var x = radius * Math.sin((n * Math.PI) / numPoints);
            var y = -1 * radius * Math.cos((n * Math.PI) / numPoints);
            context.lineTo(x, y);
        }
        context.closePath();
        context.fillStrokeShape(this);
    };
    Star.prototype.getWidth = function () {
        return this.outerRadius() * 2;
    };
    Star.prototype.getHeight = function () {
        return this.outerRadius() * 2;
    };
    Star.prototype.setWidth = function (width) {
        this.outerRadius(width / 2);
    };
    Star.prototype.setHeight = function (height) {
        this.outerRadius(height / 2);
    };
    return Star;
}(Shape_1.Shape));
exports.Star = Star;
Star.prototype.className = 'Star';
Star.prototype._centroid = true;
Star.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
Global_1._registerNode(Star);
Factory_1.Factory.addGetterSetter(Star, 'numPoints', 5, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Star, 'innerRadius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Star, 'outerRadius', 0, Validators_1.getNumberValidator());
Util_1.Collection.mapMethods(Star);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Validators":"../../node_modules/konva/lib/Validators.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/Text.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Global_1 = require("../Global");
var Validators_1 = require("../Validators");
var Global_2 = require("../Global");
var AUTO = 'auto', CENTER = 'center', JUSTIFY = 'justify', CHANGE_KONVA = 'Change.konva', CONTEXT_2D = '2d', DASH = '-', LEFT = 'left', TEXT = 'text', TEXT_UPPER = 'Text', TOP = 'top', BOTTOM = 'bottom', MIDDLE = 'middle', NORMAL = 'normal', PX_SPACE = 'px ', SPACE = ' ', RIGHT = 'right', WORD = 'word', CHAR = 'char', NONE = 'none', ELLIPSIS = '…', ATTR_CHANGE_LIST = [
    'fontFamily',
    'fontSize',
    'fontStyle',
    'fontVariant',
    'padding',
    'align',
    'verticalAlign',
    'lineHeight',
    'text',
    'width',
    'height',
    'wrap',
    'ellipsis',
    'letterSpacing'
], attrChangeListLen = ATTR_CHANGE_LIST.length;
var dummyContext;
function getDummyContext() {
    if (dummyContext) {
        return dummyContext;
    }
    dummyContext = Util_1.Util.createCanvasElement().getContext(CONTEXT_2D);
    return dummyContext;
}
function _fillFunc(context) {
    context.fillText(this._partialText, this._partialTextX, this._partialTextY);
}
function _strokeFunc(context) {
    context.strokeText(this._partialText, this._partialTextX, this._partialTextY);
}
function checkDefaultFill(config) {
    config = config || {};
    if (!config.fillLinearGradientColorStops &&
        !config.fillRadialGradientColorStops &&
        !config.fillPatternImage) {
        config.fill = config.fill || 'black';
    }
    return config;
}
var trimRight = String.prototype.trimRight ||
    function polyfill() {
        return this.replace(/[\s\xa0]+$/, '');
    };
var Text = (function (_super) {
    __extends(Text, _super);
    function Text(config) {
        var _this = _super.call(this, checkDefaultFill(config)) || this;
        _this._partialTextX = 0;
        _this._partialTextY = 0;
        for (var n = 0; n < attrChangeListLen; n++) {
            _this.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, _this._setTextData);
        }
        _this._setTextData();
        return _this;
    }
    Text.prototype._sceneFunc = function (context) {
        var padding = this.padding(), fontSize = this.fontSize(), lineHeightPx = this.lineHeight() * fontSize, textArr = this.textArr, textArrLen = textArr.length, verticalAlign = this.verticalAlign(), alignY = 0, align = this.align(), totalWidth = this.getWidth(), letterSpacing = this.letterSpacing(), fill = this.fill(), textDecoration = this.textDecoration(), shouldUnderline = textDecoration.indexOf('underline') !== -1, shouldLineThrough = textDecoration.indexOf('line-through') !== -1, n;
        var translateY = 0;
        var translateY = lineHeightPx / 2;
        var lineTranslateX = 0;
        var lineTranslateY = 0;
        context.setAttr('font', this._getContextFont());
        context.setAttr('textBaseline', MIDDLE);
        context.setAttr('textAlign', LEFT);
        if (verticalAlign === MIDDLE) {
            alignY = (this.getHeight() - textArrLen * lineHeightPx - padding * 2) / 2;
        }
        else if (verticalAlign === BOTTOM) {
            alignY = this.getHeight() - textArrLen * lineHeightPx - padding * 2;
        }
        context.translate(padding, alignY + padding);
        for (n = 0; n < textArrLen; n++) {
            var lineTranslateX = 0;
            var lineTranslateY = 0;
            var obj = textArr[n], text = obj.text, width = obj.width, lastLine = n !== textArrLen - 1, spacesNumber, oneWord, lineWidth;
            context.save();
            if (align === RIGHT) {
                lineTranslateX += totalWidth - width - padding * 2;
            }
            else if (align === CENTER) {
                lineTranslateX += (totalWidth - width - padding * 2) / 2;
            }
            if (shouldUnderline) {
                context.save();
                context.beginPath();
                context.moveTo(lineTranslateX, translateY + lineTranslateY + Math.round(fontSize / 2));
                spacesNumber = text.split(' ').length - 1;
                oneWord = spacesNumber === 0;
                lineWidth =
                    align === JUSTIFY && lastLine && !oneWord
                        ? totalWidth - padding * 2
                        : width;
                context.lineTo(lineTranslateX + Math.round(lineWidth), translateY + lineTranslateY + Math.round(fontSize / 2));
                context.lineWidth = fontSize / 15;
                context.strokeStyle = fill;
                context.stroke();
                context.restore();
            }
            if (shouldLineThrough) {
                context.save();
                context.beginPath();
                context.moveTo(lineTranslateX, translateY + lineTranslateY);
                spacesNumber = text.split(' ').length - 1;
                oneWord = spacesNumber === 0;
                lineWidth =
                    align === JUSTIFY && lastLine && !oneWord
                        ? totalWidth - padding * 2
                        : width;
                context.lineTo(lineTranslateX + Math.round(lineWidth), translateY + lineTranslateY);
                context.lineWidth = fontSize / 15;
                context.strokeStyle = fill;
                context.stroke();
                context.restore();
            }
            if (letterSpacing !== 0 || align === JUSTIFY) {
                spacesNumber = text.split(' ').length - 1;
                for (var li = 0; li < text.length; li++) {
                    var letter = text[li];
                    if (letter === ' ' && n !== textArrLen - 1 && align === JUSTIFY) {
                        lineTranslateX += Math.floor((totalWidth - padding * 2 - width) / spacesNumber);
                    }
                    this._partialTextX = lineTranslateX;
                    this._partialTextY = translateY + lineTranslateY;
                    this._partialText = letter;
                    context.fillStrokeShape(this);
                    lineTranslateX +=
                        Math.round(this.measureSize(letter).width) + letterSpacing;
                }
            }
            else {
                this._partialTextX = lineTranslateX;
                this._partialTextY = translateY + lineTranslateY;
                this._partialText = text;
                context.fillStrokeShape(this);
            }
            context.restore();
            if (textArrLen > 1) {
                translateY += lineHeightPx;
            }
        }
    };
    Text.prototype._hitFunc = function (context) {
        var width = this.getWidth(), height = this.getHeight();
        context.beginPath();
        context.rect(0, 0, width, height);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Text.prototype.setText = function (text) {
        var str = Util_1.Util._isString(text)
            ? text
            : text === null || text === undefined
                ? ''
                : text + '';
        this._setAttr(TEXT, str);
        return this;
    };
    Text.prototype.getWidth = function () {
        var isAuto = this.attrs.width === AUTO || this.attrs.width === undefined;
        return isAuto ? this.getTextWidth() + this.padding() * 2 : this.attrs.width;
    };
    Text.prototype.getHeight = function () {
        var isAuto = this.attrs.height === AUTO || this.attrs.height === undefined;
        return isAuto
            ? this.fontSize() * this.textArr.length * this.lineHeight() +
                this.padding() * 2
            : this.attrs.height;
    };
    Text.prototype.getTextWidth = function () {
        return this.textWidth;
    };
    Text.prototype.getTextHeight = function () {
        Util_1.Util.warn('text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.');
        return this.textHeight;
    };
    Text.prototype.measureSize = function (text) {
        var _context = getDummyContext(), fontSize = this.fontSize(), metrics;
        _context.save();
        _context.font = this._getContextFont();
        metrics = _context.measureText(text);
        _context.restore();
        return {
            width: metrics.width,
            height: fontSize
        };
    };
    Text.prototype._getContextFont = function () {
        if (Global_1.Konva.UA.isIE) {
            return (this.fontStyle() +
                SPACE +
                this.fontSize() +
                PX_SPACE +
                this.fontFamily());
        }
        return (this.fontStyle() +
            SPACE +
            this.fontVariant() +
            SPACE +
            this.fontSize() +
            PX_SPACE +
            this.fontFamily());
    };
    Text.prototype._addTextLine = function (line) {
        if (this.align() === JUSTIFY) {
            line = line.trim();
        }
        var width = this._getTextWidth(line);
        return this.textArr.push({ text: line, width: width });
    };
    Text.prototype._getTextWidth = function (text) {
        var letterSpacing = this.letterSpacing();
        var length = text.length;
        return (getDummyContext().measureText(text).width +
            (length ? letterSpacing * (length - 1) : 0));
    };
    Text.prototype._setTextData = function () {
        var lines = this.text().split('\n'), fontSize = +this.fontSize(), textWidth = 0, lineHeightPx = this.lineHeight() * fontSize, width = this.attrs.width, height = this.attrs.height, fixedWidth = width !== AUTO && width !== undefined, fixedHeight = height !== AUTO && height !== undefined, padding = this.padding(), maxWidth = width - padding * 2, maxHeightPx = height - padding * 2, currentHeightPx = 0, wrap = this.wrap(), shouldWrap = wrap !== NONE, wrapAtWord = wrap !== CHAR && shouldWrap, shouldAddEllipsis = this.ellipsis() && !shouldWrap;
        this.textArr = [];
        getDummyContext().font = this._getContextFont();
        var additionalWidth = shouldAddEllipsis ? this._getTextWidth(ELLIPSIS) : 0;
        for (var i = 0, max = lines.length; i < max; ++i) {
            var line = lines[i];
            var lineWidth = this._getTextWidth(line);
            if (fixedWidth && lineWidth > maxWidth) {
                while (line.length > 0) {
                    var low = 0, high = line.length, match = '', matchWidth = 0;
                    while (low < high) {
                        var mid = (low + high) >>> 1, substr = line.slice(0, mid + 1), substrWidth = this._getTextWidth(substr) + additionalWidth;
                        if (substrWidth <= maxWidth) {
                            low = mid + 1;
                            match = substr + (shouldAddEllipsis ? ELLIPSIS : '');
                            matchWidth = substrWidth;
                        }
                        else {
                            high = mid;
                        }
                    }
                    if (match) {
                        if (wrapAtWord) {
                            var wrapIndex;
                            var nextChar = line[match.length];
                            var nextIsSpaceOrDash = nextChar === SPACE || nextChar === DASH;
                            if (nextIsSpaceOrDash && matchWidth <= maxWidth) {
                                wrapIndex = match.length;
                            }
                            else {
                                wrapIndex =
                                    Math.max(match.lastIndexOf(SPACE), match.lastIndexOf(DASH)) +
                                        1;
                            }
                            if (wrapIndex > 0) {
                                low = wrapIndex;
                                match = match.slice(0, low);
                                matchWidth = this._getTextWidth(match);
                            }
                        }
                        match = match.trimRight();
                        this._addTextLine(match);
                        textWidth = Math.max(textWidth, matchWidth);
                        currentHeightPx += lineHeightPx;
                        if (!shouldWrap ||
                            (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx)) {
                            break;
                        }
                        line = line.slice(low);
                        line = line.trimLeft();
                        if (line.length > 0) {
                            lineWidth = this._getTextWidth(line);
                            if (lineWidth <= maxWidth) {
                                this._addTextLine(line);
                                currentHeightPx += lineHeightPx;
                                textWidth = Math.max(textWidth, lineWidth);
                                break;
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            else {
                this._addTextLine(line);
                currentHeightPx += lineHeightPx;
                textWidth = Math.max(textWidth, lineWidth);
            }
            if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
                break;
            }
        }
        this.textHeight = fontSize;
        this.textWidth = textWidth;
    };
    Text.prototype.getStrokeScaleEnabled = function () {
        return true;
    };
    return Text;
}(Shape_1.Shape));
exports.Text = Text;
Text.prototype._fillFunc = _fillFunc;
Text.prototype._strokeFunc = _strokeFunc;
Text.prototype.className = TEXT_UPPER;
Text.prototype._attrsAffectingSize = [
    'text',
    'fontSize',
    'padding',
    'wrap',
    'lineHeight'
];
Global_2._registerNode(Text);
Factory_1.Factory.overWriteSetter(Text, 'width', Validators_1.getNumberOrAutoValidator());
Factory_1.Factory.overWriteSetter(Text, 'height', Validators_1.getNumberOrAutoValidator());
Factory_1.Factory.addGetterSetter(Text, 'fontFamily', 'Arial');
Factory_1.Factory.addGetterSetter(Text, 'fontSize', 12, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Text, 'fontStyle', NORMAL);
Factory_1.Factory.addGetterSetter(Text, 'fontVariant', NORMAL);
Factory_1.Factory.addGetterSetter(Text, 'padding', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Text, 'align', LEFT);
Factory_1.Factory.addGetterSetter(Text, 'verticalAlign', TOP);
Factory_1.Factory.addGetterSetter(Text, 'lineHeight', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Text, 'wrap', WORD);
Factory_1.Factory.addGetterSetter(Text, 'ellipsis', false);
Factory_1.Factory.addGetterSetter(Text, 'letterSpacing', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Text, 'text', '', Validators_1.getStringValidator());
Factory_1.Factory.addGetterSetter(Text, 'textDecoration', '');
Util_1.Collection.mapMethods(Text);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Global":"../../node_modules/konva/lib/Global.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/shapes/TextPath.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Path_1 = require("./Path");
var Text_1 = require("./Text");
var Validators_1 = require("../Validators");
var Global_1 = require("../Global");
var EMPTY_STRING = '', NORMAL = 'normal';
function _fillFunc(context) {
    context.fillText(this.partialText, 0, 0);
}
function _strokeFunc(context) {
    context.strokeText(this.partialText, 0, 0);
}
var TextPath = (function (_super) {
    __extends(TextPath, _super);
    function TextPath(config) {
        var _this = _super.call(this, config) || this;
        _this.dummyCanvas = Util_1.Util.createCanvasElement();
        _this.dataArray = [];
        _this.dataArray = Path_1.Path.parsePathData(_this.attrs.data);
        _this.on('dataChange.konva', function () {
            this.dataArray = Path_1.Path.parsePathData(this.attrs.data);
            this._setTextData();
        });
        _this.on('textChange.konva alignChange.konva letterSpacingChange.konva kerningFuncChange.konva', _this._setTextData);
        if (config && config['getKerning']) {
            Util_1.Util.warn('getKerning TextPath API is deprecated. Please use "kerningFunc" instead.');
            _this.kerningFunc(config['getKerning']);
        }
        _this._setTextData();
        return _this;
    }
    TextPath.prototype._sceneFunc = function (context) {
        context.setAttr('font', this._getContextFont());
        context.setAttr('textBaseline', this.textBaseline());
        context.setAttr('textAlign', 'left');
        context.save();
        var textDecoration = this.textDecoration();
        var fill = this.fill();
        var fontSize = this.fontSize();
        var glyphInfo = this.glyphInfo;
        if (textDecoration === 'underline') {
            context.beginPath();
        }
        for (var i = 0; i < glyphInfo.length; i++) {
            context.save();
            var p0 = glyphInfo[i].p0;
            context.translate(p0.x, p0.y);
            context.rotate(glyphInfo[i].rotation);
            this.partialText = glyphInfo[i].text;
            context.fillStrokeShape(this);
            if (textDecoration === 'underline') {
                if (i === 0) {
                    context.moveTo(0, fontSize / 2 + 1);
                }
                context.lineTo(fontSize, fontSize / 2 + 1);
            }
            context.restore();
        }
        if (textDecoration === 'underline') {
            context.strokeStyle = fill;
            context.lineWidth = fontSize / 20;
            context.stroke();
        }
        context.restore();
    };
    TextPath.prototype._hitFunc = function (context) {
        context.beginPath();
        var glyphInfo = this.glyphInfo;
        if (glyphInfo.length >= 1) {
            var p0 = glyphInfo[0].p0;
            context.moveTo(p0.x, p0.y);
        }
        for (var i = 0; i < glyphInfo.length; i++) {
            var p1 = glyphInfo[i].p1;
            context.lineTo(p1.x, p1.y);
        }
        context.setAttr('lineWidth', this.fontSize());
        context.setAttr('strokeStyle', this.colorKey);
        context.stroke();
    };
    TextPath.prototype.getTextWidth = function () {
        return this.textWidth;
    };
    TextPath.prototype.getTextHeight = function () {
        Util_1.Util.warn('text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.');
        return this.textHeight;
    };
    TextPath.prototype.setText = function (text) {
        return Text_1.Text.prototype.setText.call(this, text);
    };
    TextPath.prototype._getContextFont = function () {
        return Text_1.Text.prototype._getContextFont.call(this);
    };
    TextPath.prototype._getTextSize = function (text) {
        var dummyCanvas = this.dummyCanvas;
        var _context = dummyCanvas.getContext('2d');
        _context.save();
        _context.font = this._getContextFont();
        var metrics = _context.measureText(text);
        _context.restore();
        return {
            width: metrics.width,
            height: parseInt(this.attrs.fontSize, 10)
        };
    };
    TextPath.prototype._setTextData = function () {
        var that = this;
        var size = this._getTextSize(this.attrs.text);
        var letterSpacing = this.letterSpacing();
        var align = this.align();
        var kerningFunc = this.kerningFunc();
        this.textWidth = size.width;
        this.textHeight = size.height;
        var textFullWidth = Math.max(this.textWidth + ((this.attrs.text || '').length - 1) * letterSpacing, 0);
        this.glyphInfo = [];
        var fullPathWidth = 0;
        for (var l = 0; l < that.dataArray.length; l++) {
            if (that.dataArray[l].pathLength > 0) {
                fullPathWidth += that.dataArray[l].pathLength;
            }
        }
        var offset = 0;
        if (align === 'center') {
            offset = Math.max(0, fullPathWidth / 2 - textFullWidth / 2);
        }
        if (align === 'right') {
            offset = Math.max(0, fullPathWidth - textFullWidth);
        }
        var charArr = this.text().split('');
        var spacesNumber = this.text().split(' ').length - 1;
        var p0, p1, pathCmd;
        var pIndex = -1;
        var currentT = 0;
        var getNextPathSegment = function () {
            currentT = 0;
            var pathData = that.dataArray;
            for (var j = pIndex + 1; j < pathData.length; j++) {
                if (pathData[j].pathLength > 0) {
                    pIndex = j;
                    return pathData[j];
                }
                else if (pathData[j].command === 'M') {
                    p0 = {
                        x: pathData[j].points[0],
                        y: pathData[j].points[1]
                    };
                }
            }
            return {};
        };
        var findSegmentToFitCharacter = function (c) {
            var glyphWidth = that._getTextSize(c).width + letterSpacing;
            if (c === ' ' && align === 'justify') {
                glyphWidth += (fullPathWidth - textFullWidth) / spacesNumber;
            }
            var currLen = 0;
            var attempts = 0;
            p1 = undefined;
            while (Math.abs(glyphWidth - currLen) / glyphWidth > 0.01 &&
                attempts < 25) {
                attempts++;
                var cumulativePathLength = currLen;
                while (pathCmd === undefined) {
                    pathCmd = getNextPathSegment();
                    if (pathCmd &&
                        cumulativePathLength + pathCmd.pathLength < glyphWidth) {
                        cumulativePathLength += pathCmd.pathLength;
                        pathCmd = undefined;
                    }
                }
                if (pathCmd === {} || p0 === undefined) {
                    return undefined;
                }
                var needNewSegment = false;
                switch (pathCmd.command) {
                    case 'L':
                        if (Path_1.Path.getLineLength(p0.x, p0.y, pathCmd.points[0], pathCmd.points[1]) > glyphWidth) {
                            p1 = Path_1.Path.getPointOnLine(glyphWidth, p0.x, p0.y, pathCmd.points[0], pathCmd.points[1], p0.x, p0.y);
                        }
                        else {
                            pathCmd = undefined;
                        }
                        break;
                    case 'A':
                        var start = pathCmd.points[4];
                        var dTheta = pathCmd.points[5];
                        var end = pathCmd.points[4] + dTheta;
                        if (currentT === 0) {
                            currentT = start + 0.00000001;
                        }
                        else if (glyphWidth > currLen) {
                            currentT += ((Math.PI / 180.0) * dTheta) / Math.abs(dTheta);
                        }
                        else {
                            currentT -= ((Math.PI / 360.0) * dTheta) / Math.abs(dTheta);
                        }
                        if ((dTheta < 0 && currentT < end) ||
                            (dTheta >= 0 && currentT > end)) {
                            currentT = end;
                            needNewSegment = true;
                        }
                        p1 = Path_1.Path.getPointOnEllipticalArc(pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], currentT, pathCmd.points[6]);
                        break;
                    case 'C':
                        if (currentT === 0) {
                            if (glyphWidth > pathCmd.pathLength) {
                                currentT = 0.00000001;
                            }
                            else {
                                currentT = glyphWidth / pathCmd.pathLength;
                            }
                        }
                        else if (glyphWidth > currLen) {
                            currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                        }
                        else {
                            currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                        }
                        if (currentT > 1.0) {
                            currentT = 1.0;
                            needNewSegment = true;
                        }
                        p1 = Path_1.Path.getPointOnCubicBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], pathCmd.points[4], pathCmd.points[5]);
                        break;
                    case 'Q':
                        if (currentT === 0) {
                            currentT = glyphWidth / pathCmd.pathLength;
                        }
                        else if (glyphWidth > currLen) {
                            currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                        }
                        else {
                            currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                        }
                        if (currentT > 1.0) {
                            currentT = 1.0;
                            needNewSegment = true;
                        }
                        p1 = Path_1.Path.getPointOnQuadraticBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3]);
                        break;
                }
                if (p1 !== undefined) {
                    currLen = Path_1.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
                }
                if (needNewSegment) {
                    needNewSegment = false;
                    pathCmd = undefined;
                }
            }
        };
        var testChar = 'C';
        var glyphWidth = that._getTextSize(testChar).width + letterSpacing;
        var lettersInOffset = offset / glyphWidth - 1;
        for (var k = 0; k < lettersInOffset; k++) {
            findSegmentToFitCharacter(testChar);
            if (p0 === undefined || p1 === undefined) {
                break;
            }
            p0 = p1;
        }
        for (var i = 0; i < charArr.length; i++) {
            findSegmentToFitCharacter(charArr[i]);
            if (p0 === undefined || p1 === undefined) {
                break;
            }
            var width = Path_1.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
            var kern = 0;
            if (kerningFunc) {
                try {
                    kern = kerningFunc(charArr[i - 1], charArr[i]) * this.fontSize();
                }
                catch (e) {
                    kern = 0;
                }
            }
            p0.x += kern;
            p1.x += kern;
            this.textWidth += kern;
            var midpoint = Path_1.Path.getPointOnLine(kern + width / 2.0, p0.x, p0.y, p1.x, p1.y);
            var rotation = Math.atan2(p1.y - p0.y, p1.x - p0.x);
            this.glyphInfo.push({
                transposeX: midpoint.x,
                transposeY: midpoint.y,
                text: charArr[i],
                rotation: rotation,
                p0: p0,
                p1: p1
            });
            p0 = p1;
        }
    };
    TextPath.prototype.getSelfRect = function () {
        if (!this.glyphInfo.length) {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        }
        var points = [];
        this.glyphInfo.forEach(function (info) {
            points.push(info.p0.x);
            points.push(info.p0.y);
            points.push(info.p1.x);
            points.push(info.p1.y);
        });
        var minX = points[0] || 0;
        var maxX = points[0] || 0;
        var minY = points[1] || 0;
        var maxY = points[1] || 0;
        var x, y;
        for (var i = 0; i < points.length / 2; i++) {
            x = points[i * 2];
            y = points[i * 2 + 1];
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
        var fontSize = this.fontSize();
        return {
            x: minX - fontSize / 2,
            y: minY - fontSize / 2,
            width: maxX - minX + fontSize,
            height: maxY - minY + fontSize
        };
    };
    return TextPath;
}(Shape_1.Shape));
exports.TextPath = TextPath;
TextPath.prototype._fillFunc = _fillFunc;
TextPath.prototype._strokeFunc = _strokeFunc;
TextPath.prototype._fillFuncHit = _fillFunc;
TextPath.prototype._strokeFuncHit = _strokeFunc;
TextPath.prototype.className = 'TextPath';
TextPath.prototype._attrsAffectingSize = ['text', 'fontSize', 'data'];
Global_1._registerNode(TextPath);
Factory_1.Factory.addGetterSetter(TextPath, 'data');
Factory_1.Factory.addGetterSetter(TextPath, 'fontFamily', 'Arial');
Factory_1.Factory.addGetterSetter(TextPath, 'fontSize', 12, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(TextPath, 'fontStyle', NORMAL);
Factory_1.Factory.addGetterSetter(TextPath, 'align', 'left');
Factory_1.Factory.addGetterSetter(TextPath, 'letterSpacing', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(TextPath, 'textBaseline', 'middle');
Factory_1.Factory.addGetterSetter(TextPath, 'fontVariant', NORMAL);
Factory_1.Factory.addGetterSetter(TextPath, 'text', EMPTY_STRING);
Factory_1.Factory.addGetterSetter(TextPath, 'textDecoration', null);
Factory_1.Factory.addGetterSetter(TextPath, 'kerningFunc', null);
Util_1.Collection.mapMethods(TextPath);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","./Path":"../../node_modules/konva/lib/shapes/Path.js","./Text":"../../node_modules/konva/lib/shapes/Text.js","../Validators":"../../node_modules/konva/lib/Validators.js","../Global":"../../node_modules/konva/lib/Global.js"}],"../../node_modules/konva/lib/shapes/Transformer.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Shape_1 = require("../Shape");
var Rect_1 = require("./Rect");
var Group_1 = require("../Group");
var Global_1 = require("../Global");
var Validators_1 = require("../Validators");
var Global_2 = require("../Global");
var EVENTS_NAME = 'tr-konva';
var ATTR_CHANGE_LIST = [
    'resizeEnabledChange',
    'rotateAnchorOffsetChange',
    'rotateEnabledChange',
    'enabledAnchorsChange',
    'anchorSizeChange',
    'borderEnabledChange',
    'borderStrokeChange',
    'borderStrokeWidthChange',
    'borderDashChange',
    'anchorStrokeChange',
    'anchorStrokeWidthChange',
    'anchorFillChange',
    'anchorCornerRadiusChange',
    'ignoreStrokeChange'
]
    .map(function (e) { return e + ("." + EVENTS_NAME); })
    .join(' ');
var NODE_RECT = 'nodeRect';
var TRANSFORM_CHANGE_STR = [
    'widthChange',
    'heightChange',
    'scaleXChange',
    'scaleYChange',
    'skewXChange',
    'skewYChange',
    'rotationChange',
    'offsetXChange',
    'offsetYChange',
    'transformsEnabledChange',
    'strokeWidthChange'
]
    .map(function (e) { return e + ("." + EVENTS_NAME); })
    .join(' ');
var ANGLES = {
    'top-left': -45,
    'top-center': 0,
    'top-right': 45,
    'middle-right': -90,
    'middle-left': 90,
    'bottom-left': -135,
    'bottom-center': 180,
    'bottom-right': 135
};
var TOUCH_DEVICE = 'ontouchstart' in Global_1.Konva._global;
function getCursor(anchorName, rad, isMirrored) {
    if (anchorName === 'rotater') {
        return 'crosshair';
    }
    rad += Util_1.Util._degToRad(ANGLES[anchorName] || 0);
    if (isMirrored) {
        rad *= -1;
    }
    var angle = ((Util_1.Util._radToDeg(rad) % 360) + 360) % 360;
    if (Util_1.Util._inRange(angle, 315 + 22.5, 360) || Util_1.Util._inRange(angle, 0, 22.5)) {
        return 'ns-resize';
    }
    else if (Util_1.Util._inRange(angle, 45 - 22.5, 45 + 22.5)) {
        return 'nesw-resize';
    }
    else if (Util_1.Util._inRange(angle, 90 - 22.5, 90 + 22.5)) {
        return 'ew-resize';
    }
    else if (Util_1.Util._inRange(angle, 135 - 22.5, 135 + 22.5)) {
        return 'nwse-resize';
    }
    else if (Util_1.Util._inRange(angle, 180 - 22.5, 180 + 22.5)) {
        return 'ns-resize';
    }
    else if (Util_1.Util._inRange(angle, 225 - 22.5, 225 + 22.5)) {
        return 'nesw-resize';
    }
    else if (Util_1.Util._inRange(angle, 270 - 22.5, 270 + 22.5)) {
        return 'ew-resize';
    }
    else if (Util_1.Util._inRange(angle, 315 - 22.5, 315 + 22.5)) {
        return 'nwse-resize';
    }
    else {
        Util_1.Util.error('Transformer has unknown angle for cursor detection: ' + angle);
        return 'pointer';
    }
}
var ANCHORS_NAMES = [
    'top-left',
    'top-center',
    'top-right',
    'middle-right',
    'middle-left',
    'bottom-left',
    'bottom-center',
    'bottom-right'
];
var MAX_SAFE_INTEGER = 100000000;
var Transformer = (function (_super) {
    __extends(Transformer, _super);
    function Transformer(config) {
        var _this = _super.call(this, config) || this;
        _this._transforming = false;
        _this._createElements();
        _this._handleMouseMove = _this._handleMouseMove.bind(_this);
        _this._handleMouseUp = _this._handleMouseUp.bind(_this);
        _this.update = _this.update.bind(_this);
        _this.on(ATTR_CHANGE_LIST, _this.update);
        if (_this.getNode()) {
            _this.update();
        }
        return _this;
    }
    Transformer.prototype.attachTo = function (node) {
        this.setNode(node);
        return this;
    };
    Transformer.prototype.setNode = function (node) {
        var _this = this;
        if (this._node) {
            this.detach();
        }
        this._node = node;
        this._resetTransformCache();
        var additionalEvents = node._attrsAffectingSize
            .map(function (prop) { return prop + 'Change.' + EVENTS_NAME; })
            .join(' ');
        var onChange = function () {
            _this._resetTransformCache();
            if (!_this._transforming) {
                _this.update();
            }
        };
        node.on(additionalEvents, onChange);
        node.on(TRANSFORM_CHANGE_STR, onChange);
        node.on("xChange." + EVENTS_NAME + " yChange." + EVENTS_NAME, function () {
            return _this._resetTransformCache();
        });
        var elementsCreated = !!this.findOne('.top-left');
        if (elementsCreated) {
            this.update();
        }
        return this;
    };
    Transformer.prototype.getNode = function () {
        return this._node;
    };
    Transformer.prototype.getActiveAnchor = function () {
        return this._movingAnchorName;
    };
    Transformer.prototype.detach = function () {
        if (this.getNode()) {
            this.getNode().off('.' + EVENTS_NAME);
            this._node = undefined;
        }
        this._resetTransformCache();
    };
    Transformer.prototype._resetTransformCache = function () {
        this._clearCache(NODE_RECT);
        this._clearCache('transform');
        this._clearSelfAndDescendantCache('absoluteTransform');
    };
    Transformer.prototype._getNodeRect = function () {
        return this._getCache(NODE_RECT, this.__getNodeRect);
    };
    Transformer.prototype.__getNodeRect = function () {
        var node = this.getNode();
        if (!node) {
            return {
                x: -MAX_SAFE_INTEGER,
                y: -MAX_SAFE_INTEGER,
                width: 0,
                height: 0,
                rotation: 0
            };
        }
        if (node.parent && this.parent && node.parent !== this.parent) {
            Util_1.Util.warn('Transformer and attached node have different parents. Konva does not support such case right now. Please move Transformer to the parent of attaching node.');
        }
        var rect = node.getClientRect({
            skipTransform: true,
            skipShadow: true,
            skipStroke: this.ignoreStroke()
        });
        var rotation = Global_1.Konva.getAngle(node.rotation());
        var dx = rect.x * node.scaleX() - node.offsetX() * node.scaleX();
        var dy = rect.y * node.scaleY() - node.offsetY() * node.scaleY();
        return {
            x: node.x() + dx * Math.cos(rotation) + dy * Math.sin(-rotation),
            y: node.y() + dy * Math.cos(rotation) + dx * Math.sin(rotation),
            width: rect.width * node.scaleX(),
            height: rect.height * node.scaleY(),
            rotation: node.rotation()
        };
    };
    Transformer.prototype.getX = function () {
        return this._getNodeRect().x;
    };
    Transformer.prototype.getY = function () {
        return this._getNodeRect().y;
    };
    Transformer.prototype.getRotation = function () {
        return this._getNodeRect().rotation;
    };
    Transformer.prototype.getWidth = function () {
        return this._getNodeRect().width;
    };
    Transformer.prototype.getHeight = function () {
        return this._getNodeRect().height;
    };
    Transformer.prototype._createElements = function () {
        this._createBack();
        ANCHORS_NAMES.forEach(function (name) {
            this._createAnchor(name);
        }.bind(this));
        this._createAnchor('rotater');
    };
    Transformer.prototype._createAnchor = function (name) {
        var _this = this;
        var anchor = new Rect_1.Rect({
            stroke: 'rgb(0, 161, 255)',
            fill: 'white',
            strokeWidth: 1,
            name: name + ' _anchor',
            dragDistance: 0,
            draggable: true,
            hitStrokeWidth: TOUCH_DEVICE ? 10 : 'auto'
        });
        var self = this;
        anchor.on('mousedown touchstart', function (e) {
            self._handleMouseDown(e);
        });
        anchor.on('dragstart', function (e) {
            e.cancelBubble = true;
        });
        anchor.on('dragmove', function (e) {
            e.cancelBubble = true;
        });
        anchor.on('dragend', function (e) {
            e.cancelBubble = true;
        });
        anchor.on('mouseenter', function () {
            var rad = Global_1.Konva.getAngle(_this.getAbsoluteRotation());
            var scale = _this.getNode().getAbsoluteScale();
            var isMirrored = scale.y * scale.x < 0;
            var cursor = getCursor(name, rad, isMirrored);
            anchor.getStage().content.style.cursor = cursor;
            _this._cursorChange = true;
        });
        anchor.on('mouseout', function () {
            if (!anchor.getStage() || !anchor.getParent()) {
                return;
            }
            anchor.getStage().content.style.cursor = '';
            _this._cursorChange = false;
        });
        this.add(anchor);
    };
    Transformer.prototype._createBack = function () {
        var back = new Shape_1.Shape({
            name: 'back',
            width: 0,
            height: 0,
            listening: false,
            sceneFunc: function (ctx) {
                var tr = this.getParent();
                var padding = tr.padding();
                ctx.beginPath();
                ctx.rect(-padding, -padding, this.width() + padding * 2, this.height() + padding * 2);
                ctx.moveTo(this.width() / 2, -padding);
                if (tr.rotateEnabled()) {
                    ctx.lineTo(this.width() / 2, -tr.rotateAnchorOffset() * Util_1.Util._sign(this.height()) - padding);
                }
                ctx.fillStrokeShape(this);
            }
        });
        this.add(back);
    };
    Transformer.prototype._handleMouseDown = function (e) {
        this._movingAnchorName = e.target.name().split(' ')[0];
        var attrs = this._getNodeRect();
        var width = attrs.width;
        var height = attrs.height;
        var hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        this.sin = Math.abs(height / hypotenuse);
        this.cos = Math.abs(width / hypotenuse);
        window.addEventListener('mousemove', this._handleMouseMove);
        window.addEventListener('touchmove', this._handleMouseMove);
        window.addEventListener('mouseup', this._handleMouseUp, true);
        window.addEventListener('touchend', this._handleMouseUp, true);
        this._transforming = true;
        this._fire('transformstart', { evt: e, target: this.getNode() });
        this.getNode()._fire('transformstart', { evt: e, target: this.getNode() });
    };
    Transformer.prototype._handleMouseMove = function (e) {
        var x, y, newHypotenuse;
        var anchorNode = this.findOne('.' + this._movingAnchorName);
        var stage = anchorNode.getStage();
        stage.setPointersPositions(e);
        anchorNode.setAbsolutePosition(stage.getPointerPosition());
        var keepProportion = this.keepRatio() || e.shiftKey;
        var padding = this.padding();
        if (this._movingAnchorName === 'top-left') {
            if (keepProportion) {
                newHypotenuse = Math.sqrt(Math.pow(this.findOne('.bottom-right').x() - anchorNode.x() - padding * 2, 2) +
                    Math.pow(this.findOne('.bottom-right').y() - anchorNode.y() - padding * 2, 2));
                var reverseX = this.findOne('.top-left').x() > this.findOne('.bottom-right').x()
                    ? -1
                    : 1;
                var reverseY = this.findOne('.top-left').y() > this.findOne('.bottom-right').y()
                    ? -1
                    : 1;
                x = newHypotenuse * this.cos * reverseX;
                y = newHypotenuse * this.sin * reverseY;
                this.findOne('.top-left').x(this.findOne('.bottom-right').x() - x - padding * 2);
                this.findOne('.top-left').y(this.findOne('.bottom-right').y() - y - padding * 2);
            }
        }
        else if (this._movingAnchorName === 'top-center') {
            this.findOne('.top-left').y(anchorNode.y());
        }
        else if (this._movingAnchorName === 'top-right') {
            if (keepProportion) {
                newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - this.findOne('.bottom-left').x() - padding * 2, 2) +
                    Math.pow(this.findOne('.bottom-left').y() - anchorNode.y() - padding * 2, 2));
                var reverseX = this.findOne('.top-right').x() < this.findOne('.top-left').x()
                    ? -1
                    : 1;
                var reverseY = this.findOne('.top-right').y() > this.findOne('.bottom-left').y()
                    ? -1
                    : 1;
                x = newHypotenuse * this.cos * reverseX;
                y = newHypotenuse * this.sin * reverseY;
                this.findOne('.top-right').x(x + padding);
                this.findOne('.top-right').y(this.findOne('.bottom-left').y() - y - padding * 2);
            }
            var pos = anchorNode.position();
            this.findOne('.top-left').y(pos.y);
            this.findOne('.bottom-right').x(pos.x);
        }
        else if (this._movingAnchorName === 'middle-left') {
            this.findOne('.top-left').x(anchorNode.x());
        }
        else if (this._movingAnchorName === 'middle-right') {
            this.findOne('.bottom-right').x(anchorNode.x());
        }
        else if (this._movingAnchorName === 'bottom-left') {
            if (keepProportion) {
                newHypotenuse = Math.sqrt(Math.pow(this.findOne('.top-right').x() - anchorNode.x() - padding * 2, 2) +
                    Math.pow(anchorNode.y() - this.findOne('.top-right').y() - padding * 2, 2));
                var reverseX = this.findOne('.top-right').x() < this.findOne('.bottom-left').x()
                    ? -1
                    : 1;
                var reverseY = this.findOne('.bottom-right').y() < this.findOne('.top-left').y()
                    ? -1
                    : 1;
                x = newHypotenuse * this.cos * reverseX;
                y = newHypotenuse * this.sin * reverseY;
                this.findOne('.bottom-left').x(this.findOne('.top-right').x() - x - padding * 2);
                this.findOne('.bottom-left').y(y + padding);
            }
            pos = anchorNode.position();
            this.findOne('.top-left').x(pos.x);
            this.findOne('.bottom-right').y(pos.y);
        }
        else if (this._movingAnchorName === 'bottom-center') {
            this.findOne('.bottom-right').y(anchorNode.y());
        }
        else if (this._movingAnchorName === 'bottom-right') {
            if (keepProportion) {
                newHypotenuse = Math.sqrt(Math.pow(this.findOne('.bottom-right').x() - padding, 2) +
                    Math.pow(this.findOne('.bottom-right').y() - padding, 2));
                var reverseX = this.findOne('.top-left').x() > this.findOne('.bottom-right').x()
                    ? -1
                    : 1;
                var reverseY = this.findOne('.top-left').y() > this.findOne('.bottom-right').y()
                    ? -1
                    : 1;
                x = newHypotenuse * this.cos * reverseX;
                y = newHypotenuse * this.sin * reverseY;
                this.findOne('.bottom-right').x(x + padding);
                this.findOne('.bottom-right').y(y + padding);
            }
        }
        else if (this._movingAnchorName === 'rotater') {
            var attrs = this._getNodeRect();
            x = anchorNode.x() - attrs.width / 2;
            y = -anchorNode.y() + attrs.height / 2;
            var dAlpha = Math.atan2(-y, x) + Math.PI / 2;
            if (attrs.height < 0) {
                dAlpha -= Math.PI;
            }
            var rot = Global_1.Konva.getAngle(this.rotation());
            var newRotation = Util_1.Util._radToDeg(rot) + Util_1.Util._radToDeg(dAlpha);
            var alpha = Global_1.Konva.getAngle(this.getNode().rotation());
            var newAlpha = Util_1.Util._degToRad(newRotation);
            var snaps = this.rotationSnaps();
            var offset = Global_1.Konva.getAngle(this.rotationSnapTolerance());
            for (var i = 0; i < snaps.length; i++) {
                var angle = Global_1.Konva.getAngle(snaps[i]);
                var dif = Math.abs(angle - Util_1.Util._degToRad(newRotation)) % (Math.PI * 2);
                if (dif < offset) {
                    newRotation = Util_1.Util._radToDeg(angle);
                    newAlpha = Util_1.Util._degToRad(newRotation);
                }
            }
            var dx = padding;
            var dy = padding;
            this._fitNodeInto({
                rotation: Global_1.Konva.angleDeg ? newRotation : Util_1.Util._degToRad(newRotation),
                x: attrs.x +
                    (attrs.width / 2 + padding) *
                        (Math.cos(alpha) - Math.cos(newAlpha)) +
                    (attrs.height / 2 + padding) *
                        (Math.sin(-alpha) - Math.sin(-newAlpha)) -
                    (dx * Math.cos(rot) + dy * Math.sin(-rot)),
                y: attrs.y +
                    (attrs.height / 2 + padding) *
                        (Math.cos(alpha) - Math.cos(newAlpha)) +
                    (attrs.width / 2 + padding) *
                        (Math.sin(alpha) - Math.sin(newAlpha)) -
                    (dy * Math.cos(rot) + dx * Math.sin(rot)),
                width: attrs.width + padding * 2,
                height: attrs.height + padding * 2
            }, e);
        }
        else {
            console.error(new Error('Wrong position argument of selection resizer: ' +
                this._movingAnchorName));
        }
        if (this._movingAnchorName === 'rotater') {
            return;
        }
        var centeredScaling = this.centeredScaling() || e.altKey;
        if (centeredScaling) {
            var topLeft = this.findOne('.top-left');
            var bottomRight = this.findOne('.bottom-right');
            var topOffsetX = topLeft.x() + padding;
            var topOffsetY = topLeft.y() + padding;
            var bottomOffsetX = this.getWidth() - bottomRight.x() + padding;
            var bottomOffsetY = this.getHeight() - bottomRight.y() + padding;
            bottomRight.move({
                x: -topOffsetX,
                y: -topOffsetY
            });
            topLeft.move({
                x: bottomOffsetX,
                y: bottomOffsetY
            });
        }
        var absPos = this.findOne('.top-left').getAbsolutePosition(this.getParent());
        x = absPos.x;
        y = absPos.y;
        var width = this.findOne('.bottom-right').x() - this.findOne('.top-left').x();
        var height = this.findOne('.bottom-right').y() - this.findOne('.top-left').y();
        this._fitNodeInto({
            x: x + this.offsetX(),
            y: y + this.offsetY(),
            width: width,
            height: height
        }, e);
    };
    Transformer.prototype._handleMouseUp = function (e) {
        this._removeEvents(e);
    };
    Transformer.prototype._removeEvents = function (e) {
        if (this._transforming) {
            this._transforming = false;
            window.removeEventListener('mousemove', this._handleMouseMove);
            window.removeEventListener('touchmove', this._handleMouseMove);
            window.removeEventListener('mouseup', this._handleMouseUp, true);
            window.removeEventListener('touchend', this._handleMouseUp, true);
            var node = this.getNode();
            this._fire('transformend', { evt: e, target: node });
            if (node) {
                node.fire('transformend', { evt: e, target: node });
            }
            this._movingAnchorName = null;
        }
    };
    Transformer.prototype._fitNodeInto = function (newAttrs, evt) {
        var boundBoxFunc = this.boundBoxFunc();
        if (boundBoxFunc) {
            var oldAttrs = this._getNodeRect();
            newAttrs = boundBoxFunc.call(this, oldAttrs, newAttrs);
        }
        var node = this.getNode();
        if (newAttrs.rotation !== undefined) {
            this.getNode().rotation(newAttrs.rotation);
        }
        var pure = node.getClientRect({
            skipTransform: true,
            skipShadow: true,
            skipStroke: this.ignoreStroke()
        });
        var padding = this.padding();
        var scaleX = pure.width ? (newAttrs.width - padding * 2) / pure.width : 1;
        var scaleY = pure.height
            ? (newAttrs.height - padding * 2) / pure.height
            : 1;
        var rotation = Global_1.Konva.getAngle(node.rotation());
        var dx = pure.x * scaleX - padding - node.offsetX() * scaleX;
        var dy = pure.y * scaleY - padding - node.offsetY() * scaleY;
        this.getNode().setAttrs({
            scaleX: scaleX,
            scaleY: scaleY,
            x: newAttrs.x - (dx * Math.cos(rotation) + dy * Math.sin(-rotation)),
            y: newAttrs.y - (dy * Math.cos(rotation) + dx * Math.sin(rotation))
        });
        this._fire('transform', { evt: evt, target: this.getNode() });
        this.getNode()._fire('transform', { evt: evt, target: this.getNode() });
        this.update();
        this.getLayer().batchDraw();
    };
    Transformer.prototype.forceUpdate = function () {
        this._resetTransformCache();
        this.update();
    };
    Transformer.prototype.update = function () {
        var _this = this;
        var attrs = this._getNodeRect();
        var node = this.getNode();
        var scale = { x: 1, y: 1 };
        if (node && node.getParent()) {
            scale = node.getParent().getAbsoluteScale();
        }
        var invertedScale = {
            x: 1 / scale.x,
            y: 1 / scale.y
        };
        var width = attrs.width;
        var height = attrs.height;
        var enabledAnchors = this.enabledAnchors();
        var resizeEnabled = this.resizeEnabled();
        var padding = this.padding();
        var anchorSize = this.anchorSize();
        this.find('._anchor').each(function (node) {
            return node.setAttrs({
                width: anchorSize,
                height: anchorSize,
                offsetX: anchorSize / 2,
                offsetY: anchorSize / 2,
                stroke: _this.anchorStroke(),
                strokeWidth: _this.anchorStrokeWidth(),
                fill: _this.anchorFill(),
                cornerRadius: _this.anchorCornerRadius()
            });
        });
        this.findOne('.top-left').setAttrs({
            x: -padding,
            y: -padding,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('top-left') >= 0
        });
        this.findOne('.top-center').setAttrs({
            x: width / 2,
            y: -padding,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('top-center') >= 0
        });
        this.findOne('.top-right').setAttrs({
            x: width + padding,
            y: -padding,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('top-right') >= 0
        });
        this.findOne('.middle-left').setAttrs({
            x: -padding,
            y: height / 2,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('middle-left') >= 0
        });
        this.findOne('.middle-right').setAttrs({
            x: width + padding,
            y: height / 2,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('middle-right') >= 0
        });
        this.findOne('.bottom-left').setAttrs({
            x: -padding,
            y: height + padding,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('bottom-left') >= 0
        });
        this.findOne('.bottom-center').setAttrs({
            x: width / 2,
            y: height + padding,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('bottom-center') >= 0
        });
        this.findOne('.bottom-right').setAttrs({
            x: width + padding,
            y: height + padding,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('bottom-right') >= 0
        });
        var scaledRotateAnchorOffset = -this.rotateAnchorOffset() * Math.abs(invertedScale.y);
        this.findOne('.rotater').setAttrs({
            x: width / 2,
            y: scaledRotateAnchorOffset * Util_1.Util._sign(height) - padding,
            scale: invertedScale,
            visible: this.rotateEnabled()
        });
        this.findOne('.back').setAttrs({
            width: width * scale.x,
            height: height * scale.y,
            scale: invertedScale,
            visible: this.borderEnabled(),
            stroke: this.borderStroke(),
            strokeWidth: this.borderStrokeWidth(),
            dash: this.borderDash()
        });
    };
    Transformer.prototype.isTransforming = function () {
        return this._transforming;
    };
    Transformer.prototype.stopTransform = function () {
        if (this._transforming) {
            this._removeEvents();
            var anchorNode = this.findOne('.' + this._movingAnchorName);
            if (anchorNode) {
                anchorNode.stopDrag();
            }
        }
    };
    Transformer.prototype.destroy = function () {
        if (this.getStage() && this._cursorChange) {
            this.getStage().content.style.cursor = '';
        }
        Group_1.Group.prototype.destroy.call(this);
        this.detach();
        this._removeEvents();
        return this;
    };
    Transformer.prototype.toObject = function () {
        return Node_1.Node.prototype.toObject.call(this);
    };
    return Transformer;
}(Group_1.Group));
exports.Transformer = Transformer;
function validateAnchors(val) {
    if (!(val instanceof Array)) {
        Util_1.Util.warn('enabledAnchors value should be an array');
    }
    if (val instanceof Array) {
        val.forEach(function (name) {
            if (ANCHORS_NAMES.indexOf(name) === -1) {
                Util_1.Util.warn('Unknown anchor name: ' +
                    name +
                    '. Available names are: ' +
                    ANCHORS_NAMES.join(', '));
            }
        });
    }
    return val || [];
}
Transformer.prototype.className = 'Transformer';
Global_2._registerNode(Transformer);
Factory_1.Factory.addGetterSetter(Transformer, 'enabledAnchors', ANCHORS_NAMES, validateAnchors);
Factory_1.Factory.addGetterSetter(Transformer, 'resizeEnabled', true);
Factory_1.Factory.addGetterSetter(Transformer, 'anchorSize', 10, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'rotateEnabled', true);
Factory_1.Factory.addGetterSetter(Transformer, 'rotationSnaps', []);
Factory_1.Factory.addGetterSetter(Transformer, 'rotateAnchorOffset', 50, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'rotationSnapTolerance', 5, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'borderEnabled', true);
Factory_1.Factory.addGetterSetter(Transformer, 'anchorStroke', 'rgb(0, 161, 255)');
Factory_1.Factory.addGetterSetter(Transformer, 'anchorStrokeWidth', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'anchorFill', 'white');
Factory_1.Factory.addGetterSetter(Transformer, 'anchorCornerRadius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'borderStroke', 'rgb(0, 161, 255)');
Factory_1.Factory.addGetterSetter(Transformer, 'borderStrokeWidth', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'borderDash');
Factory_1.Factory.addGetterSetter(Transformer, 'keepRatio', true);
Factory_1.Factory.addGetterSetter(Transformer, 'centeredScaling', false);
Factory_1.Factory.addGetterSetter(Transformer, 'ignoreStroke', false);
Factory_1.Factory.addGetterSetter(Transformer, 'padding', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'node');
Factory_1.Factory.addGetterSetter(Transformer, 'boundBoxFunc');
Factory_1.Factory.backCompat(Transformer, {
    lineEnabled: 'borderEnabled',
    rotateHandlerOffset: 'rotateAnchorOffset',
    enabledHandlers: 'enabledAnchors'
});
Util_1.Collection.mapMethods(Transformer);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Shape":"../../node_modules/konva/lib/Shape.js","./Rect":"../../node_modules/konva/lib/shapes/Rect.js","../Group":"../../node_modules/konva/lib/Group.js","../Global":"../../node_modules/konva/lib/Global.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/shapes/Wedge.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Shape_1 = require("../Shape");
var Global_1 = require("../Global");
var Validators_1 = require("../Validators");
var Global_2 = require("../Global");
var Wedge = (function (_super) {
    __extends(Wedge, _super);
    function Wedge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Wedge.prototype._sceneFunc = function (context) {
        context.beginPath();
        context.arc(0, 0, this.radius(), 0, Global_1.Konva.getAngle(this.angle()), this.clockwise());
        context.lineTo(0, 0);
        context.closePath();
        context.fillStrokeShape(this);
    };
    Wedge.prototype.getWidth = function () {
        return this.radius() * 2;
    };
    Wedge.prototype.getHeight = function () {
        return this.radius() * 2;
    };
    Wedge.prototype.setWidth = function (width) {
        this.radius(width / 2);
    };
    Wedge.prototype.setHeight = function (height) {
        this.radius(height / 2);
    };
    return Wedge;
}(Shape_1.Shape));
exports.Wedge = Wedge;
Wedge.prototype.className = 'Wedge';
Wedge.prototype._centroid = true;
Wedge.prototype._attrsAffectingSize = ['radius'];
Global_2._registerNode(Wedge);
Factory_1.Factory.addGetterSetter(Wedge, 'radius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Wedge, 'angle', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Wedge, 'clockwise', false);
Factory_1.Factory.backCompat(Wedge, {
    angleDeg: 'angle',
    getAngleDeg: 'getAngle',
    setAngleDeg: 'setAngle'
});
Util_1.Collection.mapMethods(Wedge);

},{"../Util":"../../node_modules/konva/lib/Util.js","../Factory":"../../node_modules/konva/lib/Factory.js","../Shape":"../../node_modules/konva/lib/Shape.js","../Global":"../../node_modules/konva/lib/Global.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/Blur.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
function BlurStack() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
}
var mul_table = [
    512,
    512,
    456,
    512,
    328,
    456,
    335,
    512,
    405,
    328,
    271,
    456,
    388,
    335,
    292,
    512,
    454,
    405,
    364,
    328,
    298,
    271,
    496,
    456,
    420,
    388,
    360,
    335,
    312,
    292,
    273,
    512,
    482,
    454,
    428,
    405,
    383,
    364,
    345,
    328,
    312,
    298,
    284,
    271,
    259,
    496,
    475,
    456,
    437,
    420,
    404,
    388,
    374,
    360,
    347,
    335,
    323,
    312,
    302,
    292,
    282,
    273,
    265,
    512,
    497,
    482,
    468,
    454,
    441,
    428,
    417,
    405,
    394,
    383,
    373,
    364,
    354,
    345,
    337,
    328,
    320,
    312,
    305,
    298,
    291,
    284,
    278,
    271,
    265,
    259,
    507,
    496,
    485,
    475,
    465,
    456,
    446,
    437,
    428,
    420,
    412,
    404,
    396,
    388,
    381,
    374,
    367,
    360,
    354,
    347,
    341,
    335,
    329,
    323,
    318,
    312,
    307,
    302,
    297,
    292,
    287,
    282,
    278,
    273,
    269,
    265,
    261,
    512,
    505,
    497,
    489,
    482,
    475,
    468,
    461,
    454,
    447,
    441,
    435,
    428,
    422,
    417,
    411,
    405,
    399,
    394,
    389,
    383,
    378,
    373,
    368,
    364,
    359,
    354,
    350,
    345,
    341,
    337,
    332,
    328,
    324,
    320,
    316,
    312,
    309,
    305,
    301,
    298,
    294,
    291,
    287,
    284,
    281,
    278,
    274,
    271,
    268,
    265,
    262,
    259,
    257,
    507,
    501,
    496,
    491,
    485,
    480,
    475,
    470,
    465,
    460,
    456,
    451,
    446,
    442,
    437,
    433,
    428,
    424,
    420,
    416,
    412,
    408,
    404,
    400,
    396,
    392,
    388,
    385,
    381,
    377,
    374,
    370,
    367,
    363,
    360,
    357,
    354,
    350,
    347,
    344,
    341,
    338,
    335,
    332,
    329,
    326,
    323,
    320,
    318,
    315,
    312,
    310,
    307,
    304,
    302,
    299,
    297,
    294,
    292,
    289,
    287,
    285,
    282,
    280,
    278,
    275,
    273,
    271,
    269,
    267,
    265,
    263,
    261,
    259
];
var shg_table = [
    9,
    11,
    12,
    13,
    13,
    14,
    14,
    15,
    15,
    15,
    15,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24
];
function filterGaussBlurRGBA(imageData, radius) {
    var pixels = imageData.data, width = imageData.width, height = imageData.height;
    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;
    var div = radius + radius + 1, widthMinus1 = width - 1, heightMinus1 = height - 1, radiusPlus1 = radius + 1, sumFactor = (radiusPlus1 * (radiusPlus1 + 1)) / 2, stackStart = new BlurStack(), stackEnd = null, stack = stackStart, stackIn = null, stackOut = null, mul_sum = mul_table[radius], shg_sum = shg_table[radius];
    for (i = 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i === radiusPlus1) {
            stackEnd = stack;
        }
    }
    stack.next = stackStart;
    yw = yi = 0;
    for (y = 0; y < height; y++) {
        r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        stack = stackStart;
        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        for (i = 1; i < radiusPlus1; i++) {
            p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
            r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
            a_sum += (stack.a = pa = pixels[p + 3]) * rbs;
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            stack = stack.next;
        }
        stackIn = stackStart;
        stackOut = stackEnd;
        for (x = 0; x < width; x++) {
            pixels[yi + 3] = pa = (a_sum * mul_sum) >> shg_sum;
            if (pa !== 0) {
                pa = 255 / pa;
                pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
            }
            else {
                pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
            }
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;
            r_in_sum += stackIn.r = pixels[p];
            g_in_sum += stackIn.g = pixels[p + 1];
            b_in_sum += stackIn.b = pixels[p + 2];
            a_in_sum += stackIn.a = pixels[p + 3];
            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;
            a_sum += a_in_sum;
            stackIn = stackIn.next;
            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            a_out_sum += pa = stackOut.a;
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            stackOut = stackOut.next;
            yi += 4;
        }
        yw += width;
    }
    for (x = 0; x < width; x++) {
        g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
        yi = x << 2;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        stack = stackStart;
        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        yp = width;
        for (i = 1; i <= radius; i++) {
            yi = (yp + x) << 2;
            r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
            a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            stack = stack.next;
            if (i < heightMinus1) {
                yp += width;
            }
        }
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (y = 0; y < height; y++) {
            p = yi << 2;
            pixels[p + 3] = pa = (a_sum * mul_sum) >> shg_sum;
            if (pa > 0) {
                pa = 255 / pa;
                pixels[p] = ((r_sum * mul_sum) >> shg_sum) * pa;
                pixels[p + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                pixels[p + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
            }
            else {
                pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
            }
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            p =
                (x +
                    ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width) <<
                    2;
            r_sum += r_in_sum += stackIn.r = pixels[p];
            g_sum += g_in_sum += stackIn.g = pixels[p + 1];
            b_sum += b_in_sum += stackIn.b = pixels[p + 2];
            a_sum += a_in_sum += stackIn.a = pixels[p + 3];
            stackIn = stackIn.next;
            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            a_out_sum += pa = stackOut.a;
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            stackOut = stackOut.next;
            yi += width;
        }
    }
}
exports.Blur = function Blur(imageData) {
    var radius = Math.round(this.blurRadius());
    if (radius > 0) {
        filterGaussBlurRGBA(imageData, radius);
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'blurRadius', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/Brighten.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
exports.Brighten = function (imageData) {
    var brightness = this.brightness() * 255, data = imageData.data, len = data.length, i;
    for (i = 0; i < len; i += 4) {
        data[i] += brightness;
        data[i + 1] += brightness;
        data[i + 2] += brightness;
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'brightness', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/Contrast.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
exports.Contrast = function (imageData) {
    var adjust = Math.pow((this.contrast() + 100) / 100, 2);
    var data = imageData.data, nPixels = data.length, red = 150, green = 150, blue = 150, i;
    for (i = 0; i < nPixels; i += 4) {
        red = data[i];
        green = data[i + 1];
        blue = data[i + 2];
        red /= 255;
        red -= 0.5;
        red *= adjust;
        red += 0.5;
        red *= 255;
        green /= 255;
        green -= 0.5;
        green *= adjust;
        green += 0.5;
        green *= 255;
        blue /= 255;
        blue -= 0.5;
        blue *= adjust;
        blue += 0.5;
        blue *= 255;
        red = red < 0 ? 0 : red > 255 ? 255 : red;
        green = green < 0 ? 0 : green > 255 ? 255 : green;
        blue = blue < 0 ? 0 : blue > 255 ? 255 : blue;
        data[i] = red;
        data[i + 1] = green;
        data[i + 2] = blue;
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'contrast', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/Emboss.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Util_1 = require("../Util");
var Validators_1 = require("../Validators");
exports.Emboss = function (imageData) {
    var strength = this.embossStrength() * 10, greyLevel = this.embossWhiteLevel() * 255, direction = this.embossDirection(), blend = this.embossBlend(), dirY = 0, dirX = 0, data = imageData.data, w = imageData.width, h = imageData.height, w4 = w * 4, y = h;
    switch (direction) {
        case 'top-left':
            dirY = -1;
            dirX = -1;
            break;
        case 'top':
            dirY = -1;
            dirX = 0;
            break;
        case 'top-right':
            dirY = -1;
            dirX = 1;
            break;
        case 'right':
            dirY = 0;
            dirX = 1;
            break;
        case 'bottom-right':
            dirY = 1;
            dirX = 1;
            break;
        case 'bottom':
            dirY = 1;
            dirX = 0;
            break;
        case 'bottom-left':
            dirY = 1;
            dirX = -1;
            break;
        case 'left':
            dirY = 0;
            dirX = -1;
            break;
        default:
            Util_1.Util.error('Unknown emboss direction: ' + direction);
    }
    do {
        var offsetY = (y - 1) * w4;
        var otherY = dirY;
        if (y + otherY < 1) {
            otherY = 0;
        }
        if (y + otherY > h) {
            otherY = 0;
        }
        var offsetYOther = (y - 1 + otherY) * w * 4;
        var x = w;
        do {
            var offset = offsetY + (x - 1) * 4;
            var otherX = dirX;
            if (x + otherX < 1) {
                otherX = 0;
            }
            if (x + otherX > w) {
                otherX = 0;
            }
            var offsetOther = offsetYOther + (x - 1 + otherX) * 4;
            var dR = data[offset] - data[offsetOther];
            var dG = data[offset + 1] - data[offsetOther + 1];
            var dB = data[offset + 2] - data[offsetOther + 2];
            var dif = dR;
            var absDif = dif > 0 ? dif : -dif;
            var absG = dG > 0 ? dG : -dG;
            var absB = dB > 0 ? dB : -dB;
            if (absG > absDif) {
                dif = dG;
            }
            if (absB > absDif) {
                dif = dB;
            }
            dif *= strength;
            if (blend) {
                var r = data[offset] + dif;
                var g = data[offset + 1] + dif;
                var b = data[offset + 2] + dif;
                data[offset] = r > 255 ? 255 : r < 0 ? 0 : r;
                data[offset + 1] = g > 255 ? 255 : g < 0 ? 0 : g;
                data[offset + 2] = b > 255 ? 255 : b < 0 ? 0 : b;
            }
            else {
                var grey = greyLevel - dif;
                if (grey < 0) {
                    grey = 0;
                }
                else if (grey > 255) {
                    grey = 255;
                }
                data[offset] = data[offset + 1] = data[offset + 2] = grey;
            }
        } while (--x);
    } while (--y);
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'embossStrength', 0.5, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'embossWhiteLevel', 0.5, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'embossDirection', 'top-left', null, Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'embossBlend', false, null, Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Util":"../../node_modules/konva/lib/Util.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/Enhance.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
function remap(fromValue, fromMin, fromMax, toMin, toMax) {
    var fromRange = fromMax - fromMin, toRange = toMax - toMin, toValue;
    if (fromRange === 0) {
        return toMin + toRange / 2;
    }
    if (toRange === 0) {
        return toMin;
    }
    toValue = (fromValue - fromMin) / fromRange;
    toValue = toRange * toValue + toMin;
    return toValue;
}
exports.Enhance = function (imageData) {
    var data = imageData.data, nSubPixels = data.length, rMin = data[0], rMax = rMin, r, gMin = data[1], gMax = gMin, g, bMin = data[2], bMax = bMin, b, i;
    var enhanceAmount = this.enhance();
    if (enhanceAmount === 0) {
        return;
    }
    for (i = 0; i < nSubPixels; i += 4) {
        r = data[i + 0];
        if (r < rMin) {
            rMin = r;
        }
        else if (r > rMax) {
            rMax = r;
        }
        g = data[i + 1];
        if (g < gMin) {
            gMin = g;
        }
        else if (g > gMax) {
            gMax = g;
        }
        b = data[i + 2];
        if (b < bMin) {
            bMin = b;
        }
        else if (b > bMax) {
            bMax = b;
        }
    }
    if (rMax === rMin) {
        rMax = 255;
        rMin = 0;
    }
    if (gMax === gMin) {
        gMax = 255;
        gMin = 0;
    }
    if (bMax === bMin) {
        bMax = 255;
        bMin = 0;
    }
    var rMid, rGoalMax, rGoalMin, gMid, gGoalMax, gGoalMin, bMid, bGoalMax, bGoalMin;
    if (enhanceAmount > 0) {
        rGoalMax = rMax + enhanceAmount * (255 - rMax);
        rGoalMin = rMin - enhanceAmount * (rMin - 0);
        gGoalMax = gMax + enhanceAmount * (255 - gMax);
        gGoalMin = gMin - enhanceAmount * (gMin - 0);
        bGoalMax = bMax + enhanceAmount * (255 - bMax);
        bGoalMin = bMin - enhanceAmount * (bMin - 0);
    }
    else {
        rMid = (rMax + rMin) * 0.5;
        rGoalMax = rMax + enhanceAmount * (rMax - rMid);
        rGoalMin = rMin + enhanceAmount * (rMin - rMid);
        gMid = (gMax + gMin) * 0.5;
        gGoalMax = gMax + enhanceAmount * (gMax - gMid);
        gGoalMin = gMin + enhanceAmount * (gMin - gMid);
        bMid = (bMax + bMin) * 0.5;
        bGoalMax = bMax + enhanceAmount * (bMax - bMid);
        bGoalMin = bMin + enhanceAmount * (bMin - bMid);
    }
    for (i = 0; i < nSubPixels; i += 4) {
        data[i + 0] = remap(data[i + 0], rMin, rMax, rGoalMin, rGoalMax);
        data[i + 1] = remap(data[i + 1], gMin, gMax, gGoalMin, gGoalMax);
        data[i + 2] = remap(data[i + 2], bMin, bMax, bGoalMin, bGoalMax);
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'enhance', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/Grayscale.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grayscale = function (imageData) {
    var data = imageData.data, len = data.length, i, brightness;
    for (i = 0; i < len; i += 4) {
        brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        data[i] = brightness;
        data[i + 1] = brightness;
        data[i + 2] = brightness;
    }
};

},{}],"../../node_modules/konva/lib/filters/HSL.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
Factory_1.Factory.addGetterSetter(Node_1.Node, 'hue', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'saturation', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'luminance', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
exports.HSL = function (imageData) {
    var data = imageData.data, nPixels = data.length, v = 1, s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360, l = this.luminance() * 127, i;
    var vsu = v * s * Math.cos((h * Math.PI) / 180), vsw = v * s * Math.sin((h * Math.PI) / 180);
    var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
    var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
    var br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
    var r, g, b, a;
    for (i = 0; i < nPixels; i += 4) {
        r = data[i + 0];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];
        data[i + 0] = rr * r + rg * g + rb * b + l;
        data[i + 1] = gr * r + gg * g + gb * b + l;
        data[i + 2] = br * r + bg * g + bb * b + l;
        data[i + 3] = a;
    }
};

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/HSV.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
exports.HSV = function (imageData) {
    var data = imageData.data, nPixels = data.length, v = Math.pow(2, this.value()), s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360, i;
    var vsu = v * s * Math.cos((h * Math.PI) / 180), vsw = v * s * Math.sin((h * Math.PI) / 180);
    var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
    var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
    var br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
    var r, g, b, a;
    for (i = 0; i < nPixels; i += 4) {
        r = data[i + 0];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];
        data[i + 0] = rr * r + rg * g + rb * b;
        data[i + 1] = gr * r + gg * g + gb * b;
        data[i + 2] = br * r + bg * g + bb * b;
        data[i + 3] = a;
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'hue', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'saturation', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'value', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/Invert.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invert = function (imageData) {
    var data = imageData.data, len = data.length, i;
    for (i = 0; i < len; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
};

},{}],"../../node_modules/konva/lib/filters/Kaleidoscope.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Util_1 = require("../Util");
var Validators_1 = require("../Validators");
var ToPolar = function (src, dst, opt) {
    var srcPixels = src.data, dstPixels = dst.data, xSize = src.width, ySize = src.height, xMid = opt.polarCenterX || xSize / 2, yMid = opt.polarCenterY || ySize / 2, i, x, y, r = 0, g = 0, b = 0, a = 0;
    var rad, rMax = Math.sqrt(xMid * xMid + yMid * yMid);
    x = xSize - xMid;
    y = ySize - yMid;
    rad = Math.sqrt(x * x + y * y);
    rMax = rad > rMax ? rad : rMax;
    var rSize = ySize, tSize = xSize, radius, theta;
    var conversion = ((360 / tSize) * Math.PI) / 180, sin, cos;
    for (theta = 0; theta < tSize; theta += 1) {
        sin = Math.sin(theta * conversion);
        cos = Math.cos(theta * conversion);
        for (radius = 0; radius < rSize; radius += 1) {
            x = Math.floor(xMid + ((rMax * radius) / rSize) * cos);
            y = Math.floor(yMid + ((rMax * radius) / rSize) * sin);
            i = (y * xSize + x) * 4;
            r = srcPixels[i + 0];
            g = srcPixels[i + 1];
            b = srcPixels[i + 2];
            a = srcPixels[i + 3];
            i = (theta + radius * xSize) * 4;
            dstPixels[i + 0] = r;
            dstPixels[i + 1] = g;
            dstPixels[i + 2] = b;
            dstPixels[i + 3] = a;
        }
    }
};
var FromPolar = function (src, dst, opt) {
    var srcPixels = src.data, dstPixels = dst.data, xSize = src.width, ySize = src.height, xMid = opt.polarCenterX || xSize / 2, yMid = opt.polarCenterY || ySize / 2, i, x, y, dx, dy, r = 0, g = 0, b = 0, a = 0;
    var rad, rMax = Math.sqrt(xMid * xMid + yMid * yMid);
    x = xSize - xMid;
    y = ySize - yMid;
    rad = Math.sqrt(x * x + y * y);
    rMax = rad > rMax ? rad : rMax;
    var rSize = ySize, tSize = xSize, radius, theta, phaseShift = opt.polarRotation || 0;
    var x1, y1;
    for (x = 0; x < xSize; x += 1) {
        for (y = 0; y < ySize; y += 1) {
            dx = x - xMid;
            dy = y - yMid;
            radius = (Math.sqrt(dx * dx + dy * dy) * rSize) / rMax;
            theta = ((Math.atan2(dy, dx) * 180) / Math.PI + 360 + phaseShift) % 360;
            theta = (theta * tSize) / 360;
            x1 = Math.floor(theta);
            y1 = Math.floor(radius);
            i = (y1 * xSize + x1) * 4;
            r = srcPixels[i + 0];
            g = srcPixels[i + 1];
            b = srcPixels[i + 2];
            a = srcPixels[i + 3];
            i = (y * xSize + x) * 4;
            dstPixels[i + 0] = r;
            dstPixels[i + 1] = g;
            dstPixels[i + 2] = b;
            dstPixels[i + 3] = a;
        }
    }
};
exports.Kaleidoscope = function (imageData) {
    var xSize = imageData.width, ySize = imageData.height;
    var x, y, xoff, i, r, g, b, a, srcPos, dstPos;
    var power = Math.round(this.kaleidoscopePower());
    var angle = Math.round(this.kaleidoscopeAngle());
    var offset = Math.floor((xSize * (angle % 360)) / 360);
    if (power < 1) {
        return;
    }
    var tempCanvas = Util_1.Util.createCanvasElement();
    tempCanvas.width = xSize;
    tempCanvas.height = ySize;
    var scratchData = tempCanvas
        .getContext('2d')
        .getImageData(0, 0, xSize, ySize);
    ToPolar(imageData, scratchData, {
        polarCenterX: xSize / 2,
        polarCenterY: ySize / 2
    });
    var minSectionSize = xSize / Math.pow(2, power);
    while (minSectionSize <= 8) {
        minSectionSize = minSectionSize * 2;
        power -= 1;
    }
    minSectionSize = Math.ceil(minSectionSize);
    var sectionSize = minSectionSize;
    var xStart = 0, xEnd = sectionSize, xDelta = 1;
    if (offset + minSectionSize > xSize) {
        xStart = sectionSize;
        xEnd = 0;
        xDelta = -1;
    }
    for (y = 0; y < ySize; y += 1) {
        for (x = xStart; x !== xEnd; x += xDelta) {
            xoff = Math.round(x + offset) % xSize;
            srcPos = (xSize * y + xoff) * 4;
            r = scratchData.data[srcPos + 0];
            g = scratchData.data[srcPos + 1];
            b = scratchData.data[srcPos + 2];
            a = scratchData.data[srcPos + 3];
            dstPos = (xSize * y + x) * 4;
            scratchData.data[dstPos + 0] = r;
            scratchData.data[dstPos + 1] = g;
            scratchData.data[dstPos + 2] = b;
            scratchData.data[dstPos + 3] = a;
        }
    }
    for (y = 0; y < ySize; y += 1) {
        sectionSize = Math.floor(minSectionSize);
        for (i = 0; i < power; i += 1) {
            for (x = 0; x < sectionSize + 1; x += 1) {
                srcPos = (xSize * y + x) * 4;
                r = scratchData.data[srcPos + 0];
                g = scratchData.data[srcPos + 1];
                b = scratchData.data[srcPos + 2];
                a = scratchData.data[srcPos + 3];
                dstPos = (xSize * y + sectionSize * 2 - x - 1) * 4;
                scratchData.data[dstPos + 0] = r;
                scratchData.data[dstPos + 1] = g;
                scratchData.data[dstPos + 2] = b;
                scratchData.data[dstPos + 3] = a;
            }
            sectionSize *= 2;
        }
    }
    FromPolar(scratchData, imageData, { polarRotation: 0 });
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'kaleidoscopePower', 2, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'kaleidoscopeAngle', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Util":"../../node_modules/konva/lib/Util.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/Mask.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
function pixelAt(idata, x, y) {
    var idx = (y * idata.width + x) * 4;
    var d = [];
    d.push(idata.data[idx++], idata.data[idx++], idata.data[idx++], idata.data[idx++]);
    return d;
}
function rgbDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) +
        Math.pow(p1[1] - p2[1], 2) +
        Math.pow(p1[2] - p2[2], 2));
}
function rgbMean(pTab) {
    var m = [0, 0, 0];
    for (var i = 0; i < pTab.length; i++) {
        m[0] += pTab[i][0];
        m[1] += pTab[i][1];
        m[2] += pTab[i][2];
    }
    m[0] /= pTab.length;
    m[1] /= pTab.length;
    m[2] /= pTab.length;
    return m;
}
function backgroundMask(idata, threshold) {
    var rgbv_no = pixelAt(idata, 0, 0);
    var rgbv_ne = pixelAt(idata, idata.width - 1, 0);
    var rgbv_so = pixelAt(idata, 0, idata.height - 1);
    var rgbv_se = pixelAt(idata, idata.width - 1, idata.height - 1);
    var thres = threshold || 10;
    if (rgbDistance(rgbv_no, rgbv_ne) < thres &&
        rgbDistance(rgbv_ne, rgbv_se) < thres &&
        rgbDistance(rgbv_se, rgbv_so) < thres &&
        rgbDistance(rgbv_so, rgbv_no) < thres) {
        var mean = rgbMean([rgbv_ne, rgbv_no, rgbv_se, rgbv_so]);
        var mask = [];
        for (var i = 0; i < idata.width * idata.height; i++) {
            var d = rgbDistance(mean, [
                idata.data[i * 4],
                idata.data[i * 4 + 1],
                idata.data[i * 4 + 2]
            ]);
            mask[i] = d < thres ? 0 : 255;
        }
        return mask;
    }
}
function applyMask(idata, mask) {
    for (var i = 0; i < idata.width * idata.height; i++) {
        idata.data[4 * i + 3] = mask[i];
    }
}
function erodeMask(mask, sw, sh) {
    var weights = [1, 1, 1, 1, 0, 1, 1, 1, 1];
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var maskResult = [];
    for (var y = 0; y < sh; y++) {
        for (var x = 0; x < sw; x++) {
            var so = y * sw + x;
            var a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = y + cy - halfSide;
                    var scx = x + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = scy * sw + scx;
                        var wt = weights[cy * side + cx];
                        a += mask[srcOff] * wt;
                    }
                }
            }
            maskResult[so] = a === 255 * 8 ? 255 : 0;
        }
    }
    return maskResult;
}
function dilateMask(mask, sw, sh) {
    var weights = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var maskResult = [];
    for (var y = 0; y < sh; y++) {
        for (var x = 0; x < sw; x++) {
            var so = y * sw + x;
            var a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = y + cy - halfSide;
                    var scx = x + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = scy * sw + scx;
                        var wt = weights[cy * side + cx];
                        a += mask[srcOff] * wt;
                    }
                }
            }
            maskResult[so] = a >= 255 * 4 ? 255 : 0;
        }
    }
    return maskResult;
}
function smoothEdgeMask(mask, sw, sh) {
    var weights = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var maskResult = [];
    for (var y = 0; y < sh; y++) {
        for (var x = 0; x < sw; x++) {
            var so = y * sw + x;
            var a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = y + cy - halfSide;
                    var scx = x + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = scy * sw + scx;
                        var wt = weights[cy * side + cx];
                        a += mask[srcOff] * wt;
                    }
                }
            }
            maskResult[so] = a;
        }
    }
    return maskResult;
}
exports.Mask = function (imageData) {
    var threshold = this.threshold(), mask = backgroundMask(imageData, threshold);
    if (mask) {
        mask = erodeMask(mask, imageData.width, imageData.height);
        mask = dilateMask(mask, imageData.width, imageData.height);
        mask = smoothEdgeMask(mask, imageData.width, imageData.height);
        applyMask(imageData, mask);
    }
    return imageData;
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'threshold', 0, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/Noise.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
exports.Noise = function (imageData) {
    var amount = this.noise() * 255, data = imageData.data, nPixels = data.length, half = amount / 2, i;
    for (i = 0; i < nPixels; i += 4) {
        data[i + 0] += half - 2 * half * Math.random();
        data[i + 1] += half - 2 * half * Math.random();
        data[i + 2] += half - 2 * half * Math.random();
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'noise', 0.2, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/Pixelate.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Util_1 = require("../Util");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
exports.Pixelate = function (imageData) {
    var pixelSize = Math.ceil(this.pixelSize()), width = imageData.width, height = imageData.height, x, y, i, red, green, blue, alpha, nBinsX = Math.ceil(width / pixelSize), nBinsY = Math.ceil(height / pixelSize), xBinStart, xBinEnd, yBinStart, yBinEnd, xBin, yBin, pixelsInBin, data = imageData.data;
    if (pixelSize <= 0) {
        Util_1.Util.error('pixelSize value can not be <= 0');
        return;
    }
    for (xBin = 0; xBin < nBinsX; xBin += 1) {
        for (yBin = 0; yBin < nBinsY; yBin += 1) {
            red = 0;
            green = 0;
            blue = 0;
            alpha = 0;
            xBinStart = xBin * pixelSize;
            xBinEnd = xBinStart + pixelSize;
            yBinStart = yBin * pixelSize;
            yBinEnd = yBinStart + pixelSize;
            pixelsInBin = 0;
            for (x = xBinStart; x < xBinEnd; x += 1) {
                if (x >= width) {
                    continue;
                }
                for (y = yBinStart; y < yBinEnd; y += 1) {
                    if (y >= height) {
                        continue;
                    }
                    i = (width * y + x) * 4;
                    red += data[i + 0];
                    green += data[i + 1];
                    blue += data[i + 2];
                    alpha += data[i + 3];
                    pixelsInBin += 1;
                }
            }
            red = red / pixelsInBin;
            green = green / pixelsInBin;
            blue = blue / pixelsInBin;
            alpha = alpha / pixelsInBin;
            for (x = xBinStart; x < xBinEnd; x += 1) {
                if (x >= width) {
                    continue;
                }
                for (y = yBinStart; y < yBinEnd; y += 1) {
                    if (y >= height) {
                        continue;
                    }
                    i = (width * y + x) * 4;
                    data[i + 0] = red;
                    data[i + 1] = green;
                    data[i + 2] = blue;
                    data[i + 3] = alpha;
                }
            }
        }
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'pixelSize', 8, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Util":"../../node_modules/konva/lib/Util.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/Posterize.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
exports.Posterize = function (imageData) {
    var levels = Math.round(this.levels() * 254) + 1, data = imageData.data, len = data.length, scale = 255 / levels, i;
    for (i = 0; i < len; i += 1) {
        data[i] = Math.floor(data[i] / scale) * scale;
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'levels', 0.5, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/RGB.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
exports.RGB = function (imageData) {
    var data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), i, brightness;
    for (i = 0; i < nPixels; i += 4) {
        brightness =
            (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]) / 255;
        data[i] = brightness * red;
        data[i + 1] = brightness * green;
        data[i + 2] = brightness * blue;
        data[i + 3] = data[i + 3];
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'red', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
Factory_1.Factory.addGetterSetter(Node_1.Node, 'green', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
Factory_1.Factory.addGetterSetter(Node_1.Node, 'blue', 0, Validators_1.RGBComponent, Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/RGBA.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
exports.RGBA = function (imageData) {
    var data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), alpha = this.alpha(), i, ia;
    for (i = 0; i < nPixels; i += 4) {
        ia = 1 - alpha;
        data[i] = red * alpha + data[i] * ia;
        data[i + 1] = green * alpha + data[i + 1] * ia;
        data[i + 2] = blue * alpha + data[i + 2] * ia;
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'red', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
Factory_1.Factory.addGetterSetter(Node_1.Node, 'green', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
Factory_1.Factory.addGetterSetter(Node_1.Node, 'blue', 0, Validators_1.RGBComponent, Factory_1.Factory.afterSetFilter);
Factory_1.Factory.addGetterSetter(Node_1.Node, 'alpha', 1, function (val) {
    this._filterUpToDate = false;
    if (val > 1) {
        return 1;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return val;
    }
});

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/filters/Sepia.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sepia = function (imageData) {
    var data = imageData.data, nPixels = data.length, i, r, g, b;
    for (i = 0; i < nPixels; i += 4) {
        r = data[i + 0];
        g = data[i + 1];
        b = data[i + 2];
        data[i + 0] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }
};

},{}],"../../node_modules/konva/lib/filters/Solarize.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solarize = function (imageData) {
    var data = imageData.data, w = imageData.width, h = imageData.height, w4 = w * 4, y = h;
    do {
        var offsetY = (y - 1) * w4;
        var x = w;
        do {
            var offset = offsetY + (x - 1) * 4;
            var r = data[offset];
            var g = data[offset + 1];
            var b = data[offset + 2];
            if (r > 127) {
                r = 255 - r;
            }
            if (g > 127) {
                g = 255 - g;
            }
            if (b > 127) {
                b = 255 - b;
            }
            data[offset] = r;
            data[offset + 1] = g;
            data[offset + 2] = b;
        } while (--x);
    } while (--y);
};

},{}],"../../node_modules/konva/lib/filters/Threshold.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Validators_1 = require("../Validators");
exports.Threshold = function (imageData) {
    var level = this.threshold() * 255, data = imageData.data, len = data.length, i;
    for (i = 0; i < len; i += 1) {
        data[i] = data[i] < level ? 0 : 255;
    }
};
Factory_1.Factory.addGetterSetter(Node_1.Node, 'threshold', 0.5, Validators_1.getNumberValidator(), Factory_1.Factory.afterSetFilter);

},{"../Factory":"../../node_modules/konva/lib/Factory.js","../Node":"../../node_modules/konva/lib/Node.js","../Validators":"../../node_modules/konva/lib/Validators.js"}],"../../node_modules/konva/lib/_FullInternals.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _CoreInternals_1 = require("./_CoreInternals");
var Arc_1 = require("./shapes/Arc");
var Arrow_1 = require("./shapes/Arrow");
var Circle_1 = require("./shapes/Circle");
var Ellipse_1 = require("./shapes/Ellipse");
var Image_1 = require("./shapes/Image");
var Label_1 = require("./shapes/Label");
var Line_1 = require("./shapes/Line");
var Path_1 = require("./shapes/Path");
var Rect_1 = require("./shapes/Rect");
var RegularPolygon_1 = require("./shapes/RegularPolygon");
var Ring_1 = require("./shapes/Ring");
var Sprite_1 = require("./shapes/Sprite");
var Star_1 = require("./shapes/Star");
var Text_1 = require("./shapes/Text");
var TextPath_1 = require("./shapes/TextPath");
var Transformer_1 = require("./shapes/Transformer");
var Wedge_1 = require("./shapes/Wedge");
var Blur_1 = require("./filters/Blur");
var Brighten_1 = require("./filters/Brighten");
var Contrast_1 = require("./filters/Contrast");
var Emboss_1 = require("./filters/Emboss");
var Enhance_1 = require("./filters/Enhance");
var Grayscale_1 = require("./filters/Grayscale");
var HSL_1 = require("./filters/HSL");
var HSV_1 = require("./filters/HSV");
var Invert_1 = require("./filters/Invert");
var Kaleidoscope_1 = require("./filters/Kaleidoscope");
var Mask_1 = require("./filters/Mask");
var Noise_1 = require("./filters/Noise");
var Pixelate_1 = require("./filters/Pixelate");
var Posterize_1 = require("./filters/Posterize");
var RGB_1 = require("./filters/RGB");
var RGBA_1 = require("./filters/RGBA");
var Sepia_1 = require("./filters/Sepia");
var Solarize_1 = require("./filters/Solarize");
var Threshold_1 = require("./filters/Threshold");
exports.Konva = _CoreInternals_1.Konva.Util._assign(_CoreInternals_1.Konva, {
    Arc: Arc_1.Arc,
    Arrow: Arrow_1.Arrow,
    Circle: Circle_1.Circle,
    Ellipse: Ellipse_1.Ellipse,
    Image: Image_1.Image,
    Label: Label_1.Label,
    Tag: Label_1.Tag,
    Line: Line_1.Line,
    Path: Path_1.Path,
    Rect: Rect_1.Rect,
    RegularPolygon: RegularPolygon_1.RegularPolygon,
    Ring: Ring_1.Ring,
    Sprite: Sprite_1.Sprite,
    Star: Star_1.Star,
    Text: Text_1.Text,
    TextPath: TextPath_1.TextPath,
    Transformer: Transformer_1.Transformer,
    Wedge: Wedge_1.Wedge,
    Filters: {
        Blur: Blur_1.Blur,
        Brighten: Brighten_1.Brighten,
        Contrast: Contrast_1.Contrast,
        Emboss: Emboss_1.Emboss,
        Enhance: Enhance_1.Enhance,
        Grayscale: Grayscale_1.Grayscale,
        HSL: HSL_1.HSL,
        HSV: HSV_1.HSV,
        Invert: Invert_1.Invert,
        Kaleidoscope: Kaleidoscope_1.Kaleidoscope,
        Mask: Mask_1.Mask,
        Noise: Noise_1.Noise,
        Pixelate: Pixelate_1.Pixelate,
        Posterize: Posterize_1.Posterize,
        RGB: RGB_1.RGB,
        RGBA: RGBA_1.RGBA,
        Sepia: Sepia_1.Sepia,
        Solarize: Solarize_1.Solarize,
        Threshold: Threshold_1.Threshold
    }
});

},{"./_CoreInternals":"../../node_modules/konva/lib/_CoreInternals.js","./shapes/Arc":"../../node_modules/konva/lib/shapes/Arc.js","./shapes/Arrow":"../../node_modules/konva/lib/shapes/Arrow.js","./shapes/Circle":"../../node_modules/konva/lib/shapes/Circle.js","./shapes/Ellipse":"../../node_modules/konva/lib/shapes/Ellipse.js","./shapes/Image":"../../node_modules/konva/lib/shapes/Image.js","./shapes/Label":"../../node_modules/konva/lib/shapes/Label.js","./shapes/Line":"../../node_modules/konva/lib/shapes/Line.js","./shapes/Path":"../../node_modules/konva/lib/shapes/Path.js","./shapes/Rect":"../../node_modules/konva/lib/shapes/Rect.js","./shapes/RegularPolygon":"../../node_modules/konva/lib/shapes/RegularPolygon.js","./shapes/Ring":"../../node_modules/konva/lib/shapes/Ring.js","./shapes/Sprite":"../../node_modules/konva/lib/shapes/Sprite.js","./shapes/Star":"../../node_modules/konva/lib/shapes/Star.js","./shapes/Text":"../../node_modules/konva/lib/shapes/Text.js","./shapes/TextPath":"../../node_modules/konva/lib/shapes/TextPath.js","./shapes/Transformer":"../../node_modules/konva/lib/shapes/Transformer.js","./shapes/Wedge":"../../node_modules/konva/lib/shapes/Wedge.js","./filters/Blur":"../../node_modules/konva/lib/filters/Blur.js","./filters/Brighten":"../../node_modules/konva/lib/filters/Brighten.js","./filters/Contrast":"../../node_modules/konva/lib/filters/Contrast.js","./filters/Emboss":"../../node_modules/konva/lib/filters/Emboss.js","./filters/Enhance":"../../node_modules/konva/lib/filters/Enhance.js","./filters/Grayscale":"../../node_modules/konva/lib/filters/Grayscale.js","./filters/HSL":"../../node_modules/konva/lib/filters/HSL.js","./filters/HSV":"../../node_modules/konva/lib/filters/HSV.js","./filters/Invert":"../../node_modules/konva/lib/filters/Invert.js","./filters/Kaleidoscope":"../../node_modules/konva/lib/filters/Kaleidoscope.js","./filters/Mask":"../../node_modules/konva/lib/filters/Mask.js","./filters/Noise":"../../node_modules/konva/lib/filters/Noise.js","./filters/Pixelate":"../../node_modules/konva/lib/filters/Pixelate.js","./filters/Posterize":"../../node_modules/konva/lib/filters/Posterize.js","./filters/RGB":"../../node_modules/konva/lib/filters/RGB.js","./filters/RGBA":"../../node_modules/konva/lib/filters/RGBA.js","./filters/Sepia":"../../node_modules/konva/lib/filters/Sepia.js","./filters/Solarize":"../../node_modules/konva/lib/filters/Solarize.js","./filters/Threshold":"../../node_modules/konva/lib/filters/Threshold.js"}],"../../node_modules/konva/lib/index.js":[function(require,module,exports) {
var Konva = require('./_FullInternals').Konva;
Konva._injectGlobal(Konva);
exports['default'] = Konva;
module.exports = exports['default'];

},{"./_FullInternals":"../../node_modules/konva/lib/_FullInternals.js"}],"../opc-eeg-positions@1.0.0/eeg2D.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rescaledEEGLocations2D = exports.EEG2DPositions = void 0;

/*jshint esversion: 6, browser: true*/
//https://github.com/sappelhoff/eeg_positions
var EEG2DPositions = {
  Nz: [0.0, 1.0],
  Iz: [0.0, -1.0],
  Cz: [0.0, 0.0],
  T9: [-1.0, 0.0],
  T10: [1.0, 0.0],
  NFpz: [0.0, 0.8541162227602905],
  Fpz: [0.0, 0.726585179526356],
  AFpz: [0.0, 0.6127922971114168],
  AFz: [0.0, 0.5095100138556493],
  AFFz: [0.0, 0.41421123542850447],
  Fz: [0.0, 0.324930901050304],
  FFCz: [0.0, 0.24008461131676362],
  FCz: [0.0, 0.1583722002972682],
  FCCz: [0.0, 0.07868390602203552],
  CCPz: [0.0, -0.07868390602203552],
  CPz: [0.0, -0.1583722002972682],
  CPPz: [0.0, -0.24008461131676362],
  Pz: [0.0, -0.324930901050304],
  PPOz: [0.0, -0.41421123542850447],
  POz: [0.0, -0.5095100138556493],
  POOz: [0.0, -0.6127922971114168],
  Oz: [0.0, -0.726585179526356],
  OIz: [0.0, -0.8541162227602905],
  N2h: [0.1564, 0.9877],
  N2: [0.309, 0.9511],
  AFp10: [0.454, 0.891],
  AF10: [0.5878, 0.809],
  AFF10: [0.7071, 0.7071],
  F10: [0.809, 0.5878],
  FFT10: [0.891, 0.454],
  FT10: [0.9511, 0.309],
  FTT10: [0.9877, 0.1564],
  TTP10: [0.9877, -0.1564],
  TP10: [0.9511, -0.309],
  TPP10: [0.891, -0.454],
  P10: [0.809, -0.5878],
  PPO10: [0.7071, -0.7071],
  PO10: [0.5878, -0.809],
  POO10: [0.454, -0.891],
  I2: [0.309, -0.9511],
  I2h: [0.1564, -0.9877],
  N1h: [-0.1564, 0.9877],
  N1: [-0.309, 0.9511],
  AFp9: [-0.454, 0.891],
  AF9: [-0.5878, 0.809],
  AFF9: [-0.7071, 0.7071],
  F9: [-0.809, 0.5878],
  FFT9: [-0.891, 0.454],
  FT9: [-0.9511, 0.309],
  FTT9: [-0.9877, 0.1564],
  TTP9: [-0.9877, -0.1564],
  TP9: [-0.9511, -0.309],
  TPP9: [-0.891, -0.454],
  P9: [-0.809, -0.5878],
  PPO9: [-0.7071, -0.7071],
  PO9: [-0.5878, -0.809],
  POO9: [-0.454, -0.891],
  I1: [-0.309, -0.9511],
  I1h: [-0.1564, -0.9877],
  T9h: [-0.8541162227602905, 0.0],
  T7: [-0.726585179526356, 0.0],
  T7h: [-0.6127922971114168, 0.0],
  C5: [-0.5095100138556493, 0.0],
  C5h: [-0.41421123542850447, 0.0],
  C3: [-0.324930901050304, 0.0],
  C3h: [-0.24008461131676362, 0.0],
  C1: [-0.1583722002972682, 0.0],
  C1h: [-0.07868390602203552, 0.0],
  C2h: [0.07868390602203552, 0.0],
  C2: [0.1583722002972682, 0.0],
  C4h: [0.24008461131676362, 0.0],
  C4: [0.324930901050304, 0.0],
  C6h: [0.41421123542850447, 0.0],
  C6: [0.5095100138556493, 0.0],
  T8h: [0.6127922971114168, 0.0],
  T8: [0.726585179526356, 0.0],
  T10h: [0.8541162227602905, 0.0],
  NFp2h: [0.13360428917329642, 0.8435662400553442],
  NFp2: [0.26392251815980633, 0.8123486682808716],
  AFp10h: [0.3877551020408163, 0.760982359045313],
  AF10h: [0.5020754064337599, 0.6910238671739882],
  AFF10h: [0.6039432722241439, 0.6039432722241439],
  F10h: [0.6910238671739882, 0.5020754064337599],
  FFT10h: [0.760982359045313, 0.3877551020408163],
  FT10h: [0.8123486682808716, 0.26392251815980633],
  FTT10h: [0.8435662400553442, 0.13360428917329642],
  TTP10h: [0.8435662400553442, -0.13360428917329642],
  TP10h: [0.8123486682808716, -0.26392251815980633],
  TPP10h: [0.760982359045313, -0.3877551020408163],
  P10h: [0.6910238671739882, -0.5020754064337599],
  PPO10h: [0.6039432722241439, -0.6039432722241439],
  PO10h: [0.5020754064337599, -0.6910238671739882],
  POO10h: [0.3877551020408163, -0.760982359045313],
  OI2: [0.26392251815980633, -0.8123486682808716],
  OI2h: [0.13360428917329642, -0.8435662400553442],
  NFp1h: [-0.13360428917329642, 0.8435662400553442],
  NFp1: [-0.26392251815980633, 0.8123486682808716],
  AFp9h: [-0.3877551020408163, 0.760982359045313],
  AF9h: [-0.5020754064337599, 0.6910238671739882],
  AFF9h: [-0.6039432722241439, 0.6039432722241439],
  F9h: [-0.6910238671739882, 0.5020754064337599],
  FFT9h: [-0.760982359045313, 0.3877551020408163],
  FT9h: [-0.8123486682808716, 0.26392251815980633],
  FTT9h: [-0.8435662400553442, 0.13360428917329642],
  TTP9h: [-0.8435662400553442, -0.13360428917329642],
  TP9h: [-0.8123486682808716, -0.26392251815980633],
  TPP9h: [-0.760982359045313, -0.3877551020408163],
  P9h: [-0.6910238671739882, -0.5020754064337599],
  PPO9h: [-0.6039432722241439, -0.6039432722241439],
  PO9h: [-0.5020754064337599, -0.6910238671739882],
  POO9h: [-0.3877551020408163, -0.760982359045313],
  OI1: [-0.26392251815980633, -0.8123486682808716],
  OI1h: [-0.13360428917329642, -0.8435662400553442],
  Fp2h: [0.11367456073338426, 0.7176470588235295],
  Fp2: [0.2245225362872422, 0.6909854851031322],
  AFp8: [0.3298701298701299, 0.6473644003055768],
  AF8: [0.42704354469060357, 0.5878533231474408],
  AFF8: [0.5137509549274255, 0.5137509549274255],
  F8: [0.5878533231474408, 0.42704354469060357],
  FFT8: [0.6473644003055768, 0.3298701298701299],
  FT8: [0.6909854851031322, 0.2245225362872422],
  FTT8: [0.7176470588235295, 0.11367456073338426],
  TTP8: [0.7176470588235295, -0.11367456073338426],
  TP8: [0.6909854851031322, -0.2245225362872422],
  TPP8: [0.6473644003055768, -0.3298701298701299],
  P8: [0.5878533231474408, -0.42704354469060357],
  PPO8: [0.5137509549274255, -0.5137509549274255],
  PO8: [0.42704354469060357, -0.5878533231474408],
  POO8: [0.3298701298701299, -0.6473644003055768],
  O2: [0.2245225362872422, -0.6909854851031322],
  O2h: [0.11367456073338426, -0.7176470588235295],
  Fp1h: [-0.11367456073338426, 0.7176470588235295],
  Fp1: [-0.2245225362872422, 0.6909854851031322],
  AFp7: [-0.3298701298701299, 0.6473644003055768],
  AF7: [-0.42704354469060357, 0.5878533231474408],
  AFF7: [-0.5137509549274255, 0.5137509549274255],
  F7: [-0.5878533231474408, 0.42704354469060357],
  FFT7: [-0.6473644003055768, 0.3298701298701299],
  FT7: [-0.6909854851031322, 0.2245225362872422],
  FTT7: [-0.7176470588235295, 0.11367456073338426],
  TTP7: [-0.7176470588235295, -0.11367456073338426],
  TP7: [-0.6909854851031322, -0.2245225362872422],
  TPP7: [-0.6473644003055768, -0.3298701298701299],
  P7: [-0.5878533231474408, -0.42704354469060357],
  PPO7: [-0.5137509549274255, -0.5137509549274255],
  PO7: [-0.42704354469060357, -0.5878533231474408],
  POO7: [-0.3298701298701299, -0.6473644003055768],
  O1: [-0.2245225362872422, -0.6909854851031322],
  O1h: [-0.11367456073338426, -0.7176470588235295],
  AFp7h: [-0.28673621460506704, 0.638822652757079],
  AFp5: [-0.24432937057836776, 0.6316825906206696],
  AFp5h: [-0.20265042979942693, 0.6257879656160459],
  AFp3: [-0.16150208230394578, 0.621020681866309],
  AFp3h: [-0.12073417544839136, 0.6174192197641147],
  AFp1: [-0.08029904471826112, 0.6148414786099959],
  AFp1h: [-0.04009092787766067, 0.6132809809189226],
  AFp2h: [0.04009092787766067, 0.6132809809189226],
  AFp2: [0.08029904471826112, 0.6148414786099959],
  AFp4h: [0.12073417544839136, 0.6174192197641147],
  AFp4: [0.16150208230394578, 0.621020681866309],
  AFp6h: [0.20265042979942693, 0.6257879656160459],
  AFp6: [0.24432937057836776, 0.6316825906206696],
  AFp8h: [0.28673621460506704, 0.638822652757079],
  AF7h: [-0.36991098788851595, 0.5677805340726688],
  AF5: [-0.31425766182761766, 0.5513009327442318],
  AF5h: [-0.2599728629579376, 0.5379240162822253],
  AF3: [-0.20670981376304318, 0.5274072117289658],
  AF3h: [-0.1542591035508699, 0.5194360002587155],
  AF1: [-0.10247259750191182, 0.5138924292633189],
  AF1h: [-0.0511622031328954, 0.5105482566953006],
  AF2h: [0.0511622031328954, 0.5105482566953006],
  AF2: [0.10247259750191182, 0.5138924292633189],
  AF4h: [0.1542591035508699, 0.5194360002587155],
  AF4: [0.20670981376304318, 0.5274072117289658],
  AF6h: [0.2599728629579376, 0.5379240162822253],
  AF6: [0.31425766182761766, 0.5513009327442318],
  AF8h: [0.36991098788851595, 0.5677805340726688],
  AFF7h: [-0.4425571561671326, 0.4873503905970043],
  AFF5: [-0.37430433012080905, 0.4661327541740193],
  AFF5h: [-0.30841060890992805, 0.449257505998314],
  AFF3: [-0.2444222236110243, 0.4360977438910068],
  AFF3h: [-0.1820445848265808, 0.42628925469234036],
  AFF1: [-0.1207214715161617, 0.4194892553128163],
  AFF1h: [-0.06016585308474975, 0.4155149091336823],
  AFF2h: [0.06016585308474975, 0.4155149091336823],
  AFF2: [0.1207214715161617, 0.4194892553128163],
  AFF4h: [0.1820445848265808, 0.42628925469234036],
  AFF4: [0.2444222236110243, 0.4360977438910068],
  AFF6h: [0.30841060890992805, 0.449257505998314],
  AFF6: [0.37430433012080905, 0.4661327541740193],
  AFF8h: [0.4425571561671326, 0.4873503905970043],
  F7h: [-0.5032135037785155, 0.3991807331026203],
  F5: [-0.42338949454905844, 0.3771390815989428],
  F5h: [-0.3473559194899362, 0.3599199899987498],
  F3: [-0.2744172145845786, 0.346682606096832],
  F3h: [-0.20379995379995378, 0.33685608685608687],
  F1: [-0.13492644986755342, 0.3301583723158429],
  F1h: [-0.0672110203854913, 0.3262234072099095],
  F2h: [0.0672110203854913, 0.3262234072099095],
  F2: [0.13492644986755342, 0.3301583723158429],
  F4h: [0.20379995379995378, 0.33685608685608687],
  F4: [0.2744172145845786, 0.346682606096832],
  F6h: [0.3473559194899362, 0.3599199899987498],
  F6: [0.42338949454905844, 0.3771390815989428],
  F8h: [0.5032135037785155, 0.3991807331026203],
  FFT7h: [-0.55086224952873, 0.30475459051874604],
  FFC5: [-0.46120996441281137, 0.28521514073115495],
  FFC5h: [-0.37697448359659785, 0.2701701093560146],
  FFC3: [-0.2969101934738666, 0.2586774473000289],
  FFC3h: [-0.22004333092605968, 0.2502638742292095],
  FFC1: [-0.14549778402334884, 0.24451410658307213],
  FFC1h: [-0.07236282433007231, 0.24117396852403233],
  FFC2h: [0.07236282433007231, 0.24117396852403233],
  FFC2: [0.14549778402334884, 0.24451410658307213],
  FFC4h: [0.22004333092605968, 0.2502638742292095],
  FFC4: [0.2969101934738666, 0.2586774473000289],
  FFC6h: [0.37697448359659785, 0.2701701093560146],
  FFC6: [0.46120996441281137, 0.28521514073115495],
  FFT8h: [0.55086224952873, 0.30475459051874604],
  FT7h: [-0.5851969812365853, 0.20570518590320572],
  FC5: [-0.4881438041815401, 0.19122896481387047],
  FC5h: [-0.3978091325831994, 0.18015121747931176],
  FC3: [-0.31264795400743994, 0.17179573892458574],
  FC3h: [-0.23132634309804345, 0.1657118149389255],
  FC1: [-0.15274425438136216, 0.16155945009969566],
  FC1h: [-0.07593957828530185, 0.15914832190544928],
  FC2h: [0.07593957828530185, 0.15914832190544928],
  FC2: [0.15274425438136216, 0.16155945009969566],
  FC4h: [0.23132634309804345, 0.1657118149389255],
  FC4: [0.31264795400743994, 0.17179573892458574],
  FC6h: [0.3978091325831994, 0.18015121747931176],
  FC6: [0.4881438041815401, 0.19122896481387047],
  FT8h: [0.5851969812365853, 0.20570518590320572],
  FTT7h: [-0.6059249052704099, 0.10361694798484326],
  FCC5: [-0.5042324699936829, 0.09595704358812382],
  FCC5h: [-0.4101870368191977, 0.0901070462298553],
  FCC3: [-0.32189079597844805, 0.08570793756596122],
  FCC3h: [-0.23793066780093577, 0.08251807741386644],
  FCC1: [-0.1569830386142187, 0.0803732535959169],
  FCC1h: [-0.07799767171129218, 0.07911120109328339],
  FCC2h: [0.07799767171129218, 0.07911120109328339],
  FCC2: [0.1569830386142187, 0.0803732535959169],
  FCC4h: [0.23793066780093577, 0.08251807741386644],
  FCC4: [0.32189079597844805, 0.08570793756596122],
  FCC6h: [0.4101870368191977, 0.0901070462298553],
  FCC6: [0.5042324699936829, 0.09595704358812382],
  FTT8h: [0.6059249052704099, 0.10361694798484326],
  TTP7h: [-0.6059249052704099, -0.10361694798484326],
  CCP5: [-0.5042324699936829, -0.09595704358812382],
  CCP5h: [-0.4101870368191977, -0.0901070462298553],
  CCP3: [-0.32189079597844805, -0.08570793756596122],
  CCP3h: [-0.23793066780093577, -0.08251807741386644],
  CCP1: [-0.1569830386142187, -0.0803732535959169],
  CCP1h: [-0.07799767171129218, -0.07911120109328339],
  CCP2h: [0.07799767171129218, -0.07911120109328339],
  CCP2: [0.1569830386142187, -0.0803732535959169],
  CCP4h: [0.23793066780093577, -0.08251807741386644],
  CCP4: [0.32189079597844805, -0.08570793756596122],
  CCP6h: [0.4101870368191977, -0.0901070462298553],
  CCP6: [0.5042324699936829, -0.09595704358812382],
  TTP8h: [0.6059249052704099, -0.10361694798484326],
  TP7h: [-0.5851969812365853, -0.20570518590320572],
  CP5: [-0.4881438041815401, -0.19122896481387047],
  CP5h: [-0.3978091325831994, -0.18015121747931176],
  CP3: [-0.31264795400743994, -0.17179573892458574],
  CP3h: [-0.23132634309804345, -0.1657118149389255],
  CP1: [-0.15274425438136216, -0.16155945009969566],
  CP1h: [-0.07593957828530185, -0.15914832190544928],
  CP2h: [0.07593957828530185, -0.15914832190544928],
  CP2: [0.15274425438136216, -0.16155945009969566],
  CP4h: [0.23132634309804345, -0.1657118149389255],
  CP4: [0.31264795400743994, -0.17179573892458574],
  CP6h: [0.3978091325831994, -0.18015121747931176],
  CP6: [0.4881438041815401, -0.19122896481387047],
  TP8h: [0.5851969812365853, -0.20570518590320572],
  TPP7h: [-0.55086224952873, -0.30475459051874604],
  CPP5: [-0.46120996441281137, -0.28521514073115495],
  CPP5h: [-0.37697448359659785, -0.2701701093560146],
  CPP3: [-0.2969101934738666, -0.2586774473000289],
  CPP3h: [-0.22004333092605968, -0.2502638742292095],
  CPP1: [-0.14549778402334884, -0.24451410658307213],
  CPP1h: [-0.07236282433007231, -0.24117396852403233],
  CPP2h: [0.07236282433007231, -0.24117396852403233],
  CPP2: [0.14549778402334884, -0.24451410658307213],
  CPP4h: [0.22004333092605968, -0.2502638742292095],
  CPP4: [0.2969101934738666, -0.2586774473000289],
  CPP6h: [0.37697448359659785, -0.2701701093560146],
  CPP6: [0.46120996441281137, -0.28521514073115495],
  TPP8h: [0.55086224952873, -0.30475459051874604],
  P7h: [-0.5032135037785155, -0.3991807331026203],
  P5: [-0.42338949454905844, -0.3771390815989428],
  P5h: [-0.3473559194899362, -0.3599199899987498],
  P3: [-0.2744172145845786, -0.346682606096832],
  P3h: [-0.20379995379995378, -0.33685608685608687],
  P1: [-0.13492644986755342, -0.3301583723158429],
  P1h: [-0.0672110203854913, -0.3262234072099095],
  P2h: [0.0672110203854913, -0.3262234072099095],
  P2: [0.13492644986755342, -0.3301583723158429],
  P4h: [0.20379995379995378, -0.33685608685608687],
  P4: [0.2744172145845786, -0.346682606096832],
  P6h: [0.3473559194899362, -0.3599199899987498],
  P6: [0.42338949454905844, -0.3771390815989428],
  P8h: [0.5032135037785155, -0.3991807331026203],
  PPO7h: [-0.4425571561671326, -0.4873503905970043],
  PPO5: [-0.37430433012080905, -0.4661327541740193],
  PPO5h: [-0.30841060890992805, -0.449257505998314],
  PPO3: [-0.2444222236110243, -0.4360977438910068],
  PPO3h: [-0.1820445848265808, -0.42628925469234036],
  PPO1: [-0.1207214715161617, -0.4194892553128163],
  PPO1h: [-0.06016585308474975, -0.4155149091336823],
  PPO2h: [0.06016585308474975, -0.4155149091336823],
  PPO2: [0.1207214715161617, -0.4194892553128163],
  PPO4h: [0.1820445848265808, -0.42628925469234036],
  PPO4: [0.2444222236110243, -0.4360977438910068],
  PPO6h: [0.30841060890992805, -0.449257505998314],
  PPO6: [0.37430433012080905, -0.4661327541740193],
  PPO8h: [0.4425571561671326, -0.4873503905970043],
  PO7h: [-0.36991098788851595, -0.5677805340726688],
  PO5: [-0.31425766182761766, -0.5513009327442318],
  PO5h: [-0.2599728629579376, -0.5379240162822253],
  PO3: [-0.20670981376304318, -0.5274072117289658],
  PO3h: [-0.1542591035508699, -0.5194360002587155],
  PO1: [-0.10247259750191182, -0.5138924292633189],
  PO1h: [-0.0511622031328954, -0.5105482566953006],
  PO2h: [0.0511622031328954, -0.5105482566953006],
  PO2: [0.10247259750191182, -0.5138924292633189],
  PO4h: [0.1542591035508699, -0.5194360002587155],
  PO4: [0.20670981376304318, -0.5274072117289658],
  PO6h: [0.2599728629579376, -0.5379240162822253],
  PO6: [0.31425766182761766, -0.5513009327442318],
  PO8h: [0.36991098788851595, -0.5677805340726688],
  POO7h: [-0.28673621460506704, -0.638822652757079],
  POO5: [-0.24432937057836776, -0.6316825906206696],
  POO5h: [-0.20265042979942693, -0.6257879656160459],
  POO3: [-0.16150208230394578, -0.621020681866309],
  POO3h: [-0.12073417544839136, -0.6174192197641147],
  POO1: [-0.08029904471826112, -0.6148414786099959],
  POO1h: [-0.04009092787766067, -0.6132809809189226],
  POO2h: [0.04009092787766067, -0.6132809809189226],
  POO2: [0.08029904471826112, -0.6148414786099959],
  POO4h: [0.12073417544839136, -0.6174192197641147],
  POO4: [0.16150208230394578, -0.621020681866309],
  POO6h: [0.20265042979942693, -0.6257879656160459],
  POO6: [0.24432937057836776, -0.6316825906206696],
  POO8h: [0.28673621460506704, -0.638822652757079]
};
exports.EEG2DPositions = EEG2DPositions;

var rescaledEEGLocations2D = function rescaledEEGLocations2D(_ref) {
  var width = _ref.width,
      height = _ref.height,
      left = _ref.left,
      top = _ref.top;
  var invertY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var zoom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.9;
  var adjWidth = zoom * width;
  var adjHeight = zoom * height;
  var rescaled = {};
  Object.keys(EEG2DPositions).forEach(function (m) {
    var v = EEG2DPositions[m];
    rescaled[m] = [v[0] * adjWidth / 2 + width / 2 + left, (invertY ? -1 : 1) * v[1] * adjHeight / 2 + height / 2 + top];
  });
  return rescaled;
};

exports.rescaledEEGLocations2D = rescaledEEGLocations2D;
},{}],"../../node_modules/colormap/colorScale.js":[function(require,module,exports) {
module.exports={
	"jet":[{"index":0,"rgb":[0,0,131]},{"index":0.125,"rgb":[0,60,170]},{"index":0.375,"rgb":[5,255,255]},{"index":0.625,"rgb":[255,255,0]},{"index":0.875,"rgb":[250,0,0]},{"index":1,"rgb":[128,0,0]}],

	"hsv":[{"index":0,"rgb":[255,0,0]},{"index":0.169,"rgb":[253,255,2]},{"index":0.173,"rgb":[247,255,2]},{"index":0.337,"rgb":[0,252,4]},{"index":0.341,"rgb":[0,252,10]},{"index":0.506,"rgb":[1,249,255]},{"index":0.671,"rgb":[2,0,253]},{"index":0.675,"rgb":[8,0,253]},{"index":0.839,"rgb":[255,0,251]},{"index":0.843,"rgb":[255,0,245]},{"index":1,"rgb":[255,0,6]}],

	"hot":[{"index":0,"rgb":[0,0,0]},{"index":0.3,"rgb":[230,0,0]},{"index":0.6,"rgb":[255,210,0]},{"index":1,"rgb":[255,255,255]}],

	"cool":[{"index":0,"rgb":[0,255,255]},{"index":1,"rgb":[255,0,255]}],

	"spring":[{"index":0,"rgb":[255,0,255]},{"index":1,"rgb":[255,255,0]}],

	"summer":[{"index":0,"rgb":[0,128,102]},{"index":1,"rgb":[255,255,102]}],

	"autumn":[{"index":0,"rgb":[255,0,0]},{"index":1,"rgb":[255,255,0]}],

	"winter":[{"index":0,"rgb":[0,0,255]},{"index":1,"rgb":[0,255,128]}],

	"bone":[{"index":0,"rgb":[0,0,0]},{"index":0.376,"rgb":[84,84,116]},{"index":0.753,"rgb":[169,200,200]},{"index":1,"rgb":[255,255,255]}],

	"copper":[{"index":0,"rgb":[0,0,0]},{"index":0.804,"rgb":[255,160,102]},{"index":1,"rgb":[255,199,127]}],

	"greys":[{"index":0,"rgb":[0,0,0]},{"index":1,"rgb":[255,255,255]}],

	"yignbu":[{"index":0,"rgb":[8,29,88]},{"index":0.125,"rgb":[37,52,148]},{"index":0.25,"rgb":[34,94,168]},{"index":0.375,"rgb":[29,145,192]},{"index":0.5,"rgb":[65,182,196]},{"index":0.625,"rgb":[127,205,187]},{"index":0.75,"rgb":[199,233,180]},{"index":0.875,"rgb":[237,248,217]},{"index":1,"rgb":[255,255,217]}],

	"greens":[{"index":0,"rgb":[0,68,27]},{"index":0.125,"rgb":[0,109,44]},{"index":0.25,"rgb":[35,139,69]},{"index":0.375,"rgb":[65,171,93]},{"index":0.5,"rgb":[116,196,118]},{"index":0.625,"rgb":[161,217,155]},{"index":0.75,"rgb":[199,233,192]},{"index":0.875,"rgb":[229,245,224]},{"index":1,"rgb":[247,252,245]}],

	"yiorrd":[{"index":0,"rgb":[128,0,38]},{"index":0.125,"rgb":[189,0,38]},{"index":0.25,"rgb":[227,26,28]},{"index":0.375,"rgb":[252,78,42]},{"index":0.5,"rgb":[253,141,60]},{"index":0.625,"rgb":[254,178,76]},{"index":0.75,"rgb":[254,217,118]},{"index":0.875,"rgb":[255,237,160]},{"index":1,"rgb":[255,255,204]}],

	"bluered":[{"index":0,"rgb":[0,0,255]},{"index":1,"rgb":[255,0,0]}],

	"rdbu":[{"index":0,"rgb":[5,10,172]},{"index":0.35,"rgb":[106,137,247]},{"index":0.5,"rgb":[190,190,190]},{"index":0.6,"rgb":[220,170,132]},{"index":0.7,"rgb":[230,145,90]},{"index":1,"rgb":[178,10,28]}],

	"picnic":[{"index":0,"rgb":[0,0,255]},{"index":0.1,"rgb":[51,153,255]},{"index":0.2,"rgb":[102,204,255]},{"index":0.3,"rgb":[153,204,255]},{"index":0.4,"rgb":[204,204,255]},{"index":0.5,"rgb":[255,255,255]},{"index":0.6,"rgb":[255,204,255]},{"index":0.7,"rgb":[255,153,255]},{"index":0.8,"rgb":[255,102,204]},{"index":0.9,"rgb":[255,102,102]},{"index":1,"rgb":[255,0,0]}],

	"rainbow":[{"index":0,"rgb":[150,0,90]},{"index":0.125,"rgb":[0,0,200]},{"index":0.25,"rgb":[0,25,255]},{"index":0.375,"rgb":[0,152,255]},{"index":0.5,"rgb":[44,255,150]},{"index":0.625,"rgb":[151,255,0]},{"index":0.75,"rgb":[255,234,0]},{"index":0.875,"rgb":[255,111,0]},{"index":1,"rgb":[255,0,0]}],

	"portland":[{"index":0,"rgb":[12,51,131]},{"index":0.25,"rgb":[10,136,186]},{"index":0.5,"rgb":[242,211,56]},{"index":0.75,"rgb":[242,143,56]},{"index":1,"rgb":[217,30,30]}],

	"blackbody":[{"index":0,"rgb":[0,0,0]},{"index":0.2,"rgb":[230,0,0]},{"index":0.4,"rgb":[230,210,0]},{"index":0.7,"rgb":[255,255,255]},{"index":1,"rgb":[160,200,255]}],

	"earth":[{"index":0,"rgb":[0,0,130]},{"index":0.1,"rgb":[0,180,180]},{"index":0.2,"rgb":[40,210,40]},{"index":0.4,"rgb":[230,230,50]},{"index":0.6,"rgb":[120,70,20]},{"index":1,"rgb":[255,255,255]}],

	"electric":[{"index":0,"rgb":[0,0,0]},{"index":0.15,"rgb":[30,0,100]},{"index":0.4,"rgb":[120,0,100]},{"index":0.6,"rgb":[160,90,0]},{"index":0.8,"rgb":[230,200,0]},{"index":1,"rgb":[255,250,220]}],

	"alpha": [{"index":0, "rgb": [255,255,255,0]},{"index":1, "rgb": [255,255,255,1]}],

	"viridis": [{"index":0,"rgb":[68,1,84]},{"index":0.13,"rgb":[71,44,122]},{"index":0.25,"rgb":[59,81,139]},{"index":0.38,"rgb":[44,113,142]},{"index":0.5,"rgb":[33,144,141]},{"index":0.63,"rgb":[39,173,129]},{"index":0.75,"rgb":[92,200,99]},{"index":0.88,"rgb":[170,220,50]},{"index":1,"rgb":[253,231,37]}],

	"inferno": [{"index":0,"rgb":[0,0,4]},{"index":0.13,"rgb":[31,12,72]},{"index":0.25,"rgb":[85,15,109]},{"index":0.38,"rgb":[136,34,106]},{"index":0.5,"rgb":[186,54,85]},{"index":0.63,"rgb":[227,89,51]},{"index":0.75,"rgb":[249,140,10]},{"index":0.88,"rgb":[249,201,50]},{"index":1,"rgb":[252,255,164]}],

	"magma": [{"index":0,"rgb":[0,0,4]},{"index":0.13,"rgb":[28,16,68]},{"index":0.25,"rgb":[79,18,123]},{"index":0.38,"rgb":[129,37,129]},{"index":0.5,"rgb":[181,54,122]},{"index":0.63,"rgb":[229,80,100]},{"index":0.75,"rgb":[251,135,97]},{"index":0.88,"rgb":[254,194,135]},{"index":1,"rgb":[252,253,191]}],

	"plasma": [{"index":0,"rgb":[13,8,135]},{"index":0.13,"rgb":[75,3,161]},{"index":0.25,"rgb":[125,3,168]},{"index":0.38,"rgb":[168,34,150]},{"index":0.5,"rgb":[203,70,121]},{"index":0.63,"rgb":[229,107,93]},{"index":0.75,"rgb":[248,148,65]},{"index":0.88,"rgb":[253,195,40]},{"index":1,"rgb":[240,249,33]}],

	"warm": [{"index":0,"rgb":[125,0,179]},{"index":0.13,"rgb":[172,0,187]},{"index":0.25,"rgb":[219,0,170]},{"index":0.38,"rgb":[255,0,130]},{"index":0.5,"rgb":[255,63,74]},{"index":0.63,"rgb":[255,123,0]},{"index":0.75,"rgb":[234,176,0]},{"index":0.88,"rgb":[190,228,0]},{"index":1,"rgb":[147,255,0]}],

	"cool": [{"index":0,"rgb":[125,0,179]},{"index":0.13,"rgb":[116,0,218]},{"index":0.25,"rgb":[98,74,237]},{"index":0.38,"rgb":[68,146,231]},{"index":0.5,"rgb":[0,204,197]},{"index":0.63,"rgb":[0,247,146]},{"index":0.75,"rgb":[0,255,88]},{"index":0.88,"rgb":[40,255,8]},{"index":1,"rgb":[147,255,0]}],

	"rainbow-soft": [{"index":0,"rgb":[125,0,179]},{"index":0.1,"rgb":[199,0,180]},{"index":0.2,"rgb":[255,0,121]},{"index":0.3,"rgb":[255,108,0]},{"index":0.4,"rgb":[222,194,0]},{"index":0.5,"rgb":[150,255,0]},{"index":0.6,"rgb":[0,255,55]},{"index":0.7,"rgb":[0,246,150]},{"index":0.8,"rgb":[50,167,222]},{"index":0.9,"rgb":[103,51,235]},{"index":1,"rgb":[124,0,186]}],

	"bathymetry": [{"index":0,"rgb":[40,26,44]},{"index":0.13,"rgb":[59,49,90]},{"index":0.25,"rgb":[64,76,139]},{"index":0.38,"rgb":[63,110,151]},{"index":0.5,"rgb":[72,142,158]},{"index":0.63,"rgb":[85,174,163]},{"index":0.75,"rgb":[120,206,163]},{"index":0.88,"rgb":[187,230,172]},{"index":1,"rgb":[253,254,204]}],

	"cdom": [{"index":0,"rgb":[47,15,62]},{"index":0.13,"rgb":[87,23,86]},{"index":0.25,"rgb":[130,28,99]},{"index":0.38,"rgb":[171,41,96]},{"index":0.5,"rgb":[206,67,86]},{"index":0.63,"rgb":[230,106,84]},{"index":0.75,"rgb":[242,149,103]},{"index":0.88,"rgb":[249,193,135]},{"index":1,"rgb":[254,237,176]}],

	"chlorophyll": [{"index":0,"rgb":[18,36,20]},{"index":0.13,"rgb":[25,63,41]},{"index":0.25,"rgb":[24,91,59]},{"index":0.38,"rgb":[13,119,72]},{"index":0.5,"rgb":[18,148,80]},{"index":0.63,"rgb":[80,173,89]},{"index":0.75,"rgb":[132,196,122]},{"index":0.88,"rgb":[175,221,162]},{"index":1,"rgb":[215,249,208]}],

	"density": [{"index":0,"rgb":[54,14,36]},{"index":0.13,"rgb":[89,23,80]},{"index":0.25,"rgb":[110,45,132]},{"index":0.38,"rgb":[120,77,178]},{"index":0.5,"rgb":[120,113,213]},{"index":0.63,"rgb":[115,151,228]},{"index":0.75,"rgb":[134,185,227]},{"index":0.88,"rgb":[177,214,227]},{"index":1,"rgb":[230,241,241]}],

	"freesurface-blue": [{"index":0,"rgb":[30,4,110]},{"index":0.13,"rgb":[47,14,176]},{"index":0.25,"rgb":[41,45,236]},{"index":0.38,"rgb":[25,99,212]},{"index":0.5,"rgb":[68,131,200]},{"index":0.63,"rgb":[114,156,197]},{"index":0.75,"rgb":[157,181,203]},{"index":0.88,"rgb":[200,208,216]},{"index":1,"rgb":[241,237,236]}],

	"freesurface-red": [{"index":0,"rgb":[60,9,18]},{"index":0.13,"rgb":[100,17,27]},{"index":0.25,"rgb":[142,20,29]},{"index":0.38,"rgb":[177,43,27]},{"index":0.5,"rgb":[192,87,63]},{"index":0.63,"rgb":[205,125,105]},{"index":0.75,"rgb":[216,162,148]},{"index":0.88,"rgb":[227,199,193]},{"index":1,"rgb":[241,237,236]}],

	"oxygen": [{"index":0,"rgb":[64,5,5]},{"index":0.13,"rgb":[106,6,15]},{"index":0.25,"rgb":[144,26,7]},{"index":0.38,"rgb":[168,64,3]},{"index":0.5,"rgb":[188,100,4]},{"index":0.63,"rgb":[206,136,11]},{"index":0.75,"rgb":[220,174,25]},{"index":0.88,"rgb":[231,215,44]},{"index":1,"rgb":[248,254,105]}],

	"par": [{"index":0,"rgb":[51,20,24]},{"index":0.13,"rgb":[90,32,35]},{"index":0.25,"rgb":[129,44,34]},{"index":0.38,"rgb":[159,68,25]},{"index":0.5,"rgb":[182,99,19]},{"index":0.63,"rgb":[199,134,22]},{"index":0.75,"rgb":[212,171,35]},{"index":0.88,"rgb":[221,210,54]},{"index":1,"rgb":[225,253,75]}],

	"phase": [{"index":0,"rgb":[145,105,18]},{"index":0.13,"rgb":[184,71,38]},{"index":0.25,"rgb":[186,58,115]},{"index":0.38,"rgb":[160,71,185]},{"index":0.5,"rgb":[110,97,218]},{"index":0.63,"rgb":[50,123,164]},{"index":0.75,"rgb":[31,131,110]},{"index":0.88,"rgb":[77,129,34]},{"index":1,"rgb":[145,105,18]}],

	"salinity": [{"index":0,"rgb":[42,24,108]},{"index":0.13,"rgb":[33,50,162]},{"index":0.25,"rgb":[15,90,145]},{"index":0.38,"rgb":[40,118,137]},{"index":0.5,"rgb":[59,146,135]},{"index":0.63,"rgb":[79,175,126]},{"index":0.75,"rgb":[120,203,104]},{"index":0.88,"rgb":[193,221,100]},{"index":1,"rgb":[253,239,154]}],

	"temperature": [{"index":0,"rgb":[4,35,51]},{"index":0.13,"rgb":[23,51,122]},{"index":0.25,"rgb":[85,59,157]},{"index":0.38,"rgb":[129,79,143]},{"index":0.5,"rgb":[175,95,130]},{"index":0.63,"rgb":[222,112,101]},{"index":0.75,"rgb":[249,146,66]},{"index":0.88,"rgb":[249,196,65]},{"index":1,"rgb":[232,250,91]}],

	"turbidity": [{"index":0,"rgb":[34,31,27]},{"index":0.13,"rgb":[65,50,41]},{"index":0.25,"rgb":[98,69,52]},{"index":0.38,"rgb":[131,89,57]},{"index":0.5,"rgb":[161,112,59]},{"index":0.63,"rgb":[185,140,66]},{"index":0.75,"rgb":[202,174,88]},{"index":0.88,"rgb":[216,209,126]},{"index":1,"rgb":[233,246,171]}],

	"velocity-blue": [{"index":0,"rgb":[17,32,64]},{"index":0.13,"rgb":[35,52,116]},{"index":0.25,"rgb":[29,81,156]},{"index":0.38,"rgb":[31,113,162]},{"index":0.5,"rgb":[50,144,169]},{"index":0.63,"rgb":[87,173,176]},{"index":0.75,"rgb":[149,196,189]},{"index":0.88,"rgb":[203,221,211]},{"index":1,"rgb":[254,251,230]}],

	"velocity-green": [{"index":0,"rgb":[23,35,19]},{"index":0.13,"rgb":[24,64,38]},{"index":0.25,"rgb":[11,95,45]},{"index":0.38,"rgb":[39,123,35]},{"index":0.5,"rgb":[95,146,12]},{"index":0.63,"rgb":[152,165,18]},{"index":0.75,"rgb":[201,186,69]},{"index":0.88,"rgb":[233,216,137]},{"index":1,"rgb":[255,253,205]}],

	"cubehelix": [{"index":0,"rgb":[0,0,0]},{"index":0.07,"rgb":[22,5,59]},{"index":0.13,"rgb":[60,4,105]},{"index":0.2,"rgb":[109,1,135]},{"index":0.27,"rgb":[161,0,147]},{"index":0.33,"rgb":[210,2,142]},{"index":0.4,"rgb":[251,11,123]},{"index":0.47,"rgb":[255,29,97]},{"index":0.53,"rgb":[255,54,69]},{"index":0.6,"rgb":[255,85,46]},{"index":0.67,"rgb":[255,120,34]},{"index":0.73,"rgb":[255,157,37]},{"index":0.8,"rgb":[241,191,57]},{"index":0.87,"rgb":[224,220,93]},{"index":0.93,"rgb":[218,241,142]},{"index":1,"rgb":[227,253,198]}]
};

},{}],"../../node_modules/lerp/index.js":[function(require,module,exports) {
function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}
module.exports = lerp
},{}],"../../node_modules/colormap/index.js":[function(require,module,exports) {
/*
 * Ben Postlethwaite
 * January 2013
 * License MIT
 */
'use strict';

var colorScale = require('./colorScale');
var lerp = require('lerp')

module.exports = createColormap;

function createColormap (spec) {
    /*
     * Default Options
     */
    var indicies, fromrgba, torgba,
        nsteps, cmap, colormap, format,
        nshades, colors, alpha, i;

    if ( !spec ) spec = {};

    nshades = (spec.nshades || 72) - 1;
    format = spec.format || 'hex';

    colormap = spec.colormap;
    if (!colormap) colormap = 'jet';

    if (typeof colormap === 'string') {
        colormap = colormap.toLowerCase();

        if (!colorScale[colormap]) {
            throw Error(colormap + ' not a supported colorscale');
        }

        cmap = colorScale[colormap];

    } else if (Array.isArray(colormap)) {
        cmap = colormap.slice();

    } else {
        throw Error('unsupported colormap option', colormap);
    }

    if (cmap.length > nshades + 1) {
        throw new Error(
            colormap+' map requires nshades to be at least size '+cmap.length
        );
    }

    if (!Array.isArray(spec.alpha)) {

        if (typeof spec.alpha === 'number') {
            alpha = [spec.alpha, spec.alpha];

        } else {
            alpha = [1, 1];
        }

    } else if (spec.alpha.length !== 2) {
        alpha = [1, 1];

    } else {
        alpha = spec.alpha.slice();
    }

    // map index points from 0..1 to 0..n-1
    indicies = cmap.map(function(c) {
        return Math.round(c.index * nshades);
    });

    // Add alpha channel to the map
    alpha[0] = Math.min(Math.max(alpha[0], 0), 1);
    alpha[1] = Math.min(Math.max(alpha[1], 0), 1);

    var steps = cmap.map(function(c, i) {
        var index = cmap[i].index

        var rgba = cmap[i].rgb.slice();

        // if user supplies their own map use it
        if (rgba.length === 4 && rgba[3] >= 0 && rgba[3] <= 1) {
            return rgba
        }
        rgba[3] = alpha[0] + (alpha[1] - alpha[0])*index;

        return rgba
    })


    /*
     * map increasing linear values between indicies to
     * linear steps in colorvalues
     */
    var colors = []
    for (i = 0; i < indicies.length-1; ++i) {
        nsteps = indicies[i+1] - indicies[i];
        fromrgba = steps[i];
        torgba = steps[i+1];

        for (var j = 0; j < nsteps; j++) {
            var amt = j / nsteps
            colors.push([
                Math.round(lerp(fromrgba[0], torgba[0], amt)),
                Math.round(lerp(fromrgba[1], torgba[1], amt)),
                Math.round(lerp(fromrgba[2], torgba[2], amt)),
                lerp(fromrgba[3], torgba[3], amt)
            ])
        }
    }

    //add 1 step as last value
    colors.push(cmap[cmap.length - 1].rgb.concat(alpha[1]))

    if (format === 'hex') colors = colors.map( rgb2hex );
    else if (format === 'rgbaString') colors = colors.map( rgbaStr );
    else if (format === 'float') colors = colors.map( rgb2float );

    return colors;
};

function rgb2float (rgba) {
    return [
        rgba[0] / 255,
        rgba[1] / 255,
        rgba[2] / 255,
        rgba[3]
    ]
}

function rgb2hex (rgba) {
    var dig, hex = '#';
    for (var i = 0; i < 3; ++i) {
        dig = rgba[i];
        dig = dig.toString(16);
        hex += ('00' + dig).substr( dig.length );
    }
    return hex;
}

function rgbaStr (rgba) {
    return 'rgba(' + rgba.join(',') + ')';
}

},{"./colorScale":"../../node_modules/colormap/colorScale.js","lerp":"../../node_modules/lerp/index.js"}],"color_utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.color_scale = exports.to_bin_hex = void 0;

var _colormap = _interopRequireDefault(require("colormap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var to_bin_hex = function to_bin_hex(hex_string) {
  if (Number.isSafeInteger(hex_string)) return hex_string;
  if (hex_string.startsWith("#")) hex_string = hex_string.substr(1);
  return parseInt(hex_string, 16);
};

exports.to_bin_hex = to_bin_hex;
window.colormap = _colormap.default;

var color_scale = function color_scale(cmap, _ref) {
  var _ref$levels = _ref.levels,
      levels = _ref$levels === void 0 ? 20 : _ref$levels,
      _ref$max = _ref.max,
      max = _ref$max === void 0 ? 100 : _ref$max,
      _ref$min = _ref.min,
      min = _ref$min === void 0 ? -100 : _ref$min;
  var true_cmap = cmap.replace(/_r$/, ""); //levels -= 1

  if (levels < 6) {
    levels = 10 * levels;
  } //max += (max - min) * 0.1
  //min -= (max - min) * 0.1


  var my_colormap = (0, _colormap.default)({
    colormap: true_cmap,
    nshades: levels,
    format: 'hex'
  });
  console.log("===========");
  console.log(my_colormap);

  if (cmap.endsWith("_r")) {
    my_colormap = my_colormap.reverse();
  }

  console.log(my_colormap);

  var getInt = function getInt(v) {
    v = getScale(v);
    return to_bin_hex(my_colormap[v]);
  };

  var getHex = function getHex(v) {
    v = getScale(v);
    return my_colormap[v];
  };

  var getScale = function getScale(v) {
    return Math.max(0, Math.min(levels - 1, Math.floor(levels * (v - min) / (max - min)))); //v = Math.max(0, Math.min(levels - 1, Math.ceil(levels * (v - min) / (max - min))));

    v = Math.ceil((levels - 1) * (v - min) / (max - min));
    return v;
  };

  return {
    getInt: getInt,
    getHex: getHex,
    getScale: getScale
  };
};

exports.color_scale = color_scale;
window.color_scale = color_scale;
},{"colormap":"../../node_modules/colormap/index.js"}],"basic_layout.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawScale = exports.drawArrows = exports.drawArrow = exports.drawLines = exports.drawLine = exports.drawMatrices = exports.drawMatrix = exports.drawLabelsEEG = exports.drawPointsEEG = void 0;

var _konva = _interopRequireDefault(require("konva"));

var _color_utils = require("./color_utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var has_layers = function has_layers(app) {
  return app.getLayers().length > 0;
}; // Before: 283MB, CPU 0% GPU 23%
// After: 280-370MB, CPU 103% GPU 43%


var drawPointsEEG = function drawPointsEEG(locations, app) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$border_color = _ref.border_color,
      border_color = _ref$border_color === void 0 ? "gray" : _ref$border_color,
      _ref$fill_color = _ref.fill_color,
      fill_color = _ref$fill_color === void 0 ? "orange" : _ref$fill_color,
      _ref$radius = _ref.radius,
      radius = _ref$radius === void 0 ? 2 : _ref$radius,
      _ref$alpha = _ref.alpha,
      alpha = _ref$alpha === void 0 ? 1 : _ref$alpha;

  var layer = has_layers(app) ? app.getLayers()[0] : new _konva.default.Layer();
  Object.keys(locations).forEach(function (m) {
    var v = locations[m];
    var circle = new _konva.default.Circle({
      x: v[0],
      y: v[1],
      radius: radius,
      perfectDrawEnabled: false,
      opacity: alpha //zIndex: 0,

    });
    circle.fill(fill_color);
    circle.stroke(border_color);
    circle.strokeWidth(1);
    layer.add(circle);
  });
  if (!has_layers(app)) app.add(layer);
};

exports.drawPointsEEG = drawPointsEEG;

var drawLabelsEEG = function drawLabelsEEG(data_positions, app) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$border_color = _ref2.border_color,
      border_color = _ref2$border_color === void 0 ? "gray" : _ref2$border_color,
      _ref2$fill_color = _ref2.fill_color,
      fill_color = _ref2$fill_color === void 0 ? "orange" : _ref2$fill_color,
      _ref2$radius = _ref2.radius,
      radius = _ref2$radius === void 0 ? 2 : _ref2$radius;

  var layer = has_layers(app) ? app.getLayers()[0] : new _konva.default.Layer();

  for (var i = 0; i < data_positions.length; i++) {
    var _data_positions$i = _slicedToArray(data_positions[i], 3),
        x = _data_positions$i[0],
        y = _data_positions$i[1],
        m = _data_positions$i[2];

    var circle = new _konva.default.Circle({
      x: x,
      y: y,
      radius: radius,
      perfectDrawEnabled: false //zIndex: 0,

    });
    circle.fill(fill_color);
    circle.stroke(border_color);
    circle.strokeWidth(1);
    layer.add(circle);
    var text = new _konva.default.Text({
      x: x + 3,
      y: y,
      text: m.toUpperCase(),
      //fontSize: 8,
      fontSize: 14,
      fontFamily: 'Calibri',
      fill: border_color,
      opacity: 0.5,
      perfectDrawEnabled: false //zIndex: 0,

    });
    layer.add(text);
  }

  if (!has_layers(app)) app.add(layer);
};

exports.drawLabelsEEG = drawLabelsEEG;

var drawMatrix = function drawMatrix(matrix, app) {
  var layout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var data_positions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var title = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

  var _ref3 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {},
      _ref3$cmap = _ref3.cmap,
      cmap = _ref3$cmap === void 0 ? "viridis" : _ref3$cmap,
      _ref3$cmap_levels = _ref3.cmap_levels,
      cmap_levels = _ref3$cmap_levels === void 0 ? 20 : _ref3$cmap_levels,
      _ref3$cmap_max = _ref3.cmap_max,
      cmap_max = _ref3$cmap_max === void 0 ? 10 : _ref3$cmap_max,
      _ref3$cmap_min = _ref3.cmap_min,
      cmap_min = _ref3$cmap_min === void 0 ? 0 : _ref3$cmap_min,
      _ref3$cmap_autolevel = _ref3.cmap_autolevel,
      cmap_autolevel = _ref3$cmap_autolevel === void 0 ? true : _ref3$cmap_autolevel,
      _ref3$size = _ref3.size,
      size = _ref3$size === void 0 ? 120 : _ref3$size,
      _ref3$pos_x = _ref3.pos_x,
      pos_x = _ref3$pos_x === void 0 ? 20 : _ref3$pos_x,
      _ref3$pos_y = _ref3.pos_y,
      pos_y = _ref3$pos_y === void 0 ? 450 : _ref3$pos_y,
      _ref3$border_color = _ref3.border_color,
      border_color = _ref3$border_color === void 0 ? "black" : _ref3$border_color,
      _ref3$border_width = _ref3.border_width,
      border_width = _ref3$border_width === void 0 ? 0.1 : _ref3$border_width,
      _ref3$label_color = _ref3.label_color,
      label_color = _ref3$label_color === void 0 ? "black" : _ref3$label_color,
      _ref3$replace_diagona = _ref3.replace_diagonals,
      replace_diagonals = _ref3$replace_diagona === void 0 ? true : _ref3$replace_diagona;

  var is_new_layout = false;
  var layer = null;

  if (!layout) {
    //console.log("NO")
    layout = _toConsumableArray(Array(matrix.length)).map(function () {
      return null;
    }); /////layout.

    layer = has_layers(app) ? app.getLayers()[0] : new _konva.default.Layer();
    is_new_layout = true;
  } else {//console.log("YES")
  }

  var p = Math.round(Math.sqrt(matrix.length));

  if (replace_diagonals && false) {
    //let max_val = Math.max(...matrix.flat(2).filter((v, i) => i % 4 == 3));
    //let mean_val = matrix.filter((v, i) => v[0] != v[1]).map(v => v[3]).reduce((a,b) => a+b) / matrix.length;
    //let sd_val = Math.sqrt(matrix.filter((v, i) => v[0] != v[1]).map(v => v[3]*v[3]).reduce((a,b) => a+b) / matrix.length - mean_val * mean_val);
    //const restrict = (x) => Math.max(mean_val - 3 * sd_val, Math.min(mean_val + 3 * sd_val, x))
    //console.log(mean_val, sd_val)
    var ordered_matrix = matrix.copyWithin().sort(function (a, b) {
      return a[3] - b[3];
    });
    var percentile_95 = ordered_matrix[Math.ceil(ordered_matrix.length * 0.95)][3];
    var percentile_5 = ordered_matrix[Math.ceil(ordered_matrix.length * 0.05)][3];

    var restrict = function restrict(x) {
      return Math.max(percentile_5, Math.min(percentile_95, x));
    };

    matrix = matrix.map(function (v, i) {
      return v[0] == v[1] ? [v[0], v[1], v[2], NaN] : [v[0], v[1], v[2], restrict(v[3])];
    });
    window.__matrix = matrix;
    cmap_max = percentile_95;
    cmap_min = percentile_5;
  } else {
    if (cmap_autolevel) {
      //cmap_max = Math.max(...matrix.flat(2).filter((v, i) => i % 4 == 3).filter(isFinite))
      //cmap_min = Math.min(...matrix.flat(2).filter((v, i) => i % 4 == 3).filter(isFinite))
      cmap_max = Math.max.apply(Math, _toConsumableArray(matrix.filter(function (v) {
        return v[0] != v[1];
      }).map(function (m) {
        return m[3];
      })));
      cmap_min = Math.min.apply(Math, _toConsumableArray(matrix.filter(function (v) {
        return v[0] != v[1];
      }).map(function (m) {
        return m[3];
      })));
    }
  }

  var colscale = (0, _color_utils.color_scale)(cmap, {
    levels: cmap_levels,
    max: cmap_max,
    min: cmap_min
  });
  window.colscale_ = {
    cmap_levels: cmap_levels,
    cmap_max: cmap_max,
    cmap_min: cmap_min
  };
  window.colscale_matrix = matrix.filter(function (v) {
    return v[3] >= cmap_max - 0.1 * (cmap_max - cmap_min);
  }); //let total_width = Math.ceil(size / p);

  var total_width = Math.floor(size / p);
  var cell_width = total_width > 1 ? total_width - border_width : total_width;
  var cell_border_width = total_width > 1 ? border_width : 0;

  for (var k = 0; k < matrix.length; k++) {
    var j = matrix[k][0];
    var i = matrix[k][1];
    var val = matrix[k][3];
    var x0 = pos_x + total_width * i;
    var y0 = pos_y + total_width * j;
    var rect = void 0;

    if (is_new_layout) {
      //rect = app.makeRectangle(x0, y0, cell_width, cell_width);
      rect = new _konva.default.Rect({
        x: x0,
        y: y0,
        width: cell_width,
        height: cell_width,
        perfectDrawEnabled: false //zIndex: 0,

      });
      layout[k] = rect; //////layout.

      layer.add(layout[k]);
    } else {
      rect = layout[k]; //rect.draw();
    } ///console.log(val, colscale.getHex(val))


    if (i == j) {
      rect.fill("#FF0000");
      rect.opacity(0);
    } else {
      rect.fill(colscale.getHex(val));
      rect.opacity(1);
    }

    if (border_width > 0) {
      rect.stroke(border_color);
      rect.strokeWidth(border_width);
    } else {
      rect.strokeWidth(0);
    }
  }

  if (is_new_layout) {
    var text_height = Math.min(14, cell_width);

    for (var _i2 = 0; _i2 < p; _i2++) {
      var x = pos_x + total_width * p + 2;
      var y = pos_y + total_width * _i2 + (total_width - text_height) / 2;
      var text = new _konva.default.Text({
        x: x,
        y: y,
        text: data_positions[_i2][2],
        fontSize: text_height,
        fontFamily: 'Calibri',
        fill: label_color,
        perfectDrawEnabled: false //zIndex: 0,

      });
      layer.add(text);
    }

    for (var _j = 0; _j < p; _j++) {
      var _x = pos_x + total_width * _j + text_height + (total_width - text_height) / 2;

      var _y = pos_y + total_width * p + 2;

      var _text = new _konva.default.Text({
        x: _x,
        y: _y,
        text: data_positions[_j][2],
        fontSize: text_height,
        fontFamily: 'Calibri',
        rotation: 90,
        fill: label_color,
        perfectDrawEnabled: false //zIndex: 0,

      });

      layer.add(_text);
    }

    {
      var _x2 = pos_x + 1;

      var _y2 = pos_y - Math.max(14, text_height + 2) - 1;

      var title_text = new _konva.default.Text({
        x: _x2,
        y: _y2,
        text: title,
        fontSize: Math.max(14, text_height + 2),
        fontFamily: 'Calibri',
        fill: label_color,
        fontStyle: "bold",
        fontVariant: "small-caps",
        perfectDrawEnabled: false //zIndex: 0,

      });
      layer.add(title_text);
    } ///

    if (!has_layers(app)) app.add(layer);
  }

  return layout;
};

exports.drawMatrix = drawMatrix;

var drawMatrices = function drawMatrices(matrices, app) {
  var layouts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var data_positions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var titles = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  var _ref4 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {},
      _ref4$cmap = _ref4.cmap,
      cmap = _ref4$cmap === void 0 ? "viridis" : _ref4$cmap,
      _ref4$cmap_levels = _ref4.cmap_levels,
      cmap_levels = _ref4$cmap_levels === void 0 ? 20 : _ref4$cmap_levels,
      _ref4$cmap_max = _ref4.cmap_max,
      cmap_max = _ref4$cmap_max === void 0 ? 10 : _ref4$cmap_max,
      _ref4$cmap_min = _ref4.cmap_min,
      cmap_min = _ref4$cmap_min === void 0 ? 0 : _ref4$cmap_min,
      _ref4$cmap_autolevel = _ref4.cmap_autolevel,
      cmap_autolevel = _ref4$cmap_autolevel === void 0 ? true : _ref4$cmap_autolevel,
      _ref4$size = _ref4.size,
      size = _ref4$size === void 0 ? 120 : _ref4$size,
      _ref4$pos_x = _ref4.pos_x,
      pos_x = _ref4$pos_x === void 0 ? 20 : _ref4$pos_x,
      _ref4$pos_y = _ref4.pos_y,
      pos_y = _ref4$pos_y === void 0 ? 450 : _ref4$pos_y,
      _ref4$shift_x = _ref4.shift_x,
      shift_x = _ref4$shift_x === void 0 ? 20 : _ref4$shift_x,
      _ref4$border_color = _ref4.border_color,
      border_color = _ref4$border_color === void 0 ? "#000000" : _ref4$border_color,
      _ref4$border_width = _ref4.border_width,
      border_width = _ref4$border_width === void 0 ? 0.1 : _ref4$border_width,
      _ref4$label_color = _ref4.label_color,
      label_color = _ref4$label_color === void 0 ? "black" : _ref4$label_color;

  if (!layouts) {
    layouts = _toConsumableArray(Array(matrices.length)).map(function () {
      return null;
    });
  }

  var update = function update(k, new_matrix) {
    var x0 = pos_x + (size + shift_x) * k;
    layouts[k] = drawMatrix(new_matrix, app, layouts[k], data_positions, titles[k], {
      cmap: cmap,
      cmap_levels: cmap_levels,
      cmap_max: cmap_max,
      cmap_min: cmap_min,
      cmap_autolevel: cmap_autolevel,
      size: size,
      pos_x: x0,
      pos_y: pos_y,
      border_color: border_color,
      border_width: border_width,
      label_color: label_color
    });
    var layer = has_layers(app) ? app.getLayers()[0] : new _konva.default.Layer();
    layer.batchDraw();
  };

  for (var k = 0; k < matrices.length; k++) {
    update(k, matrices[k]);
  }

  return {
    update: update,
    layouts: layouts
  };
}; //


exports.drawMatrices = drawMatrices;

var drawLine = function drawLine(y) {
  var layout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var _ref5 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref5$line_color = _ref5.line_color,
      line_color = _ref5$line_color === void 0 ? "black" : _ref5$line_color,
      _ref5$max_points = _ref5.max_points,
      max_points = _ref5$max_points === void 0 ? 100 : _ref5$max_points,
      _ref5$scale_x = _ref5.scale_x,
      scale_x = _ref5$scale_x === void 0 ? 5 : _ref5$scale_x,
      _ref5$scale_y = _ref5.scale_y,
      scale_y = _ref5$scale_y === void 0 ? 1 : _ref5$scale_y,
      _ref5$pos_x = _ref5.pos_x,
      pos_x = _ref5$pos_x === void 0 ? 300 : _ref5$pos_x,
      _ref5$pos_y = _ref5.pos_y,
      pos_y = _ref5$pos_y === void 0 ? 10 : _ref5$pos_y,
      _ref5$line_width = _ref5.line_width,
      line_width = _ref5$line_width === void 0 ? 1 : _ref5$line_width,
      _ref5$alpha = _ref5.alpha,
      alpha = _ref5$alpha === void 0 ? 1 : _ref5$alpha,
      _ref5$spline_tension = _ref5.spline_tension,
      spline_tension = _ref5$spline_tension === void 0 ? 0.5 : _ref5$spline_tension;

  if (!layout) {
    var _points = _toConsumableArray(Array(2 * max_points)).map(function (m, i) {
      return i % 2 == 0 ? Math.floor(i / 2) * scale_x : NaN;
    });

    layout = new _konva.default.Line({
      points: _points,
      perfectDrawEnabled: false //zIndex: 0,

    });
    layout._true_points = _points.map(function (m) {
      return NaN;
    });
    layout.move({
      x: pos_x,
      y: pos_y
    });
    layout.stroke(line_color);
    layout.strokeWidth(line_width);
    layout.opacity(alpha);
    layout.tension(spline_tension);
  }

  var true_points = layout._true_points;
  var points = layout.points();
  var mean_y = 0;
  var mean2_y = 0;

  for (var t = 0; t < max_points; t++) {
    mean_y += true_points[2 * t + 1] || 0;
    mean2_y += true_points[2 * t + 1] * true_points[2 * t + 1] || 0;
  }

  mean_y = mean_y / max_points;
  mean2_y = mean2_y / max_points; //

  var std_y = (mean2_y - mean_y * mean_y) * max_points / (max_points - 1) || 1e-4;

  for (var _t = 0; _t < max_points - 1; _t++) {
    layout._true_points[2 * _t + 1] = layout._true_points[2 * (_t + 1) + 1];
  }

  layout._true_points[2 * max_points - 1] = y * scale_y; //

  for (var _t2 = 0; _t2 < max_points; _t2++) {
    //points[2 * t + 1] = (layout._true_points[2 * t + 1] - mean_y) / std_y;
    points[2 * _t2 + 1] = layout._true_points[2 * _t2 + 1] - mean_y;
  } //

  /*
  //let ref_val = points[1] || points[2 * max_points - 1] || 0;
  for(let t = 0; t < max_points - 1; t++){
    points[2 * t + 1] = points[2 * (t + 1) + 1];
  }
  points[2 * max_points - 1] = y * scale_y;*/


  layout.points(points);
  return layout;
};

exports.drawLine = drawLine;

var drawLines = function drawLines(signal_timepoint, app) {
  var layouts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var labels = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var _ref6 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
      _ref6$cmap = _ref6.cmap,
      cmap = _ref6$cmap === void 0 ? "viridis" : _ref6$cmap,
      _ref6$max_points = _ref6.max_points,
      max_points = _ref6$max_points === void 0 ? 100 : _ref6$max_points,
      _ref6$scale_y = _ref6.scale_y,
      scale_y = _ref6$scale_y === void 0 ? 1 : _ref6$scale_y,
      _ref6$pos_x = _ref6.pos_x,
      pos_x = _ref6$pos_x === void 0 ? 300 : _ref6$pos_x,
      _ref6$pos_y = _ref6.pos_y,
      pos_y = _ref6$pos_y === void 0 ? 10 : _ref6$pos_y,
      _ref6$width = _ref6.width,
      width = _ref6$width === void 0 ? 100 : _ref6$width,
      _ref6$height = _ref6.height,
      height = _ref6$height === void 0 ? 400 : _ref6$height,
      _ref6$line_width = _ref6.line_width,
      line_width = _ref6$line_width === void 0 ? 1 : _ref6$line_width,
      _ref6$alpha = _ref6.alpha,
      alpha = _ref6$alpha === void 0 ? 1 : _ref6$alpha,
      _ref6$spline_tension = _ref6.spline_tension,
      spline_tension = _ref6$spline_tension === void 0 ? 0.5 : _ref6$spline_tension;

  var is_new_layout = false;
  var layer = null;

  if (!layouts) {
    layouts = _toConsumableArray(Array(signal_timepoint.length)).map(function () {
      return null;
    });
    layer = has_layers(app) ? app.getLayers()[0] : new _konva.default.Layer();
    is_new_layout = true;
  }

  var colscale = (0, _color_utils.color_scale)(cmap, {
    levels: Math.max(10, signal_timepoint.length),
    max: signal_timepoint.length + 1,
    min: 0
  });
  var shift_y = height / signal_timepoint.length;
  var scale_x = width / max_points;

  var update = function update(k, timepoint) {
    var is_new = layouts[k] == null;
    layouts[k] = drawLine(timepoint, layouts[k], {
      line_color: colscale.getHex(k),
      max_points: max_points,
      scale_x: scale_x,
      scale_y: scale_y,
      pos_x: pos_x,
      pos_y: pos_y + k * shift_y,
      line_width: line_width,
      alpha: alpha,
      spline_tension: spline_tension
    });

    if (is_new) {
      ////console.log(pos_x + width + 3, pos_y, labels[k])
      var title_text = new _konva.default.Text({
        x: pos_x + width + 3,
        y: pos_y + k * shift_y,
        text: labels[k],
        fontSize: 12,
        fontFamily: 'Calibri',
        fill: colscale.getHex(k),
        fontStyle: "bold",
        //fontVariant: "small-caps",
        perfectDrawEnabled: false //zIndex: 0,

      });
      layer.add(title_text);
      layer.add(layouts[k]);
    }
  };

  var update_all = function update_all(multitimepoint) {
    for (var k = 0; k < multitimepoint.length; k++) {
      update(k, multitimepoint[k]);
    }

    if (is_new_layout) {
      if (!has_layers(app)) app.add(layer);
    } else {
      layer.batchDraw();
    }

    is_new_layout = false;
  };

  update_all(signal_timepoint);
  return {
    update: update,
    update_all: update_all,
    layouts: layouts
  };
};

exports.drawLines = drawLines;

var drawArrow = function drawArrow(link, positions, app) {
  var layout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var _ref7 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
      _ref7$cmap = _ref7.cmap,
      cmap = _ref7$cmap === void 0 ? "viridis" : _ref7$cmap,
      _ref7$value_levels = _ref7.value_levels,
      value_levels = _ref7$value_levels === void 0 ? 20 : _ref7$value_levels,
      _ref7$value_max = _ref7.value_max,
      value_max = _ref7$value_max === void 0 ? 10 : _ref7$value_max,
      _ref7$value_min = _ref7.value_min,
      value_min = _ref7$value_min === void 0 ? 0 : _ref7$value_min,
      _ref7$line_width_max = _ref7.line_width_max,
      line_width_max = _ref7$line_width_max === void 0 ? 5 : _ref7$line_width_max,
      _ref7$line_width_min = _ref7.line_width_min,
      line_width_min = _ref7$line_width_min === void 0 ? 0.1 : _ref7$line_width_min,
      _ref7$alpha_max = _ref7.alpha_max,
      alpha_max = _ref7$alpha_max === void 0 ? 1 : _ref7$alpha_max,
      _ref7$alpha_min = _ref7.alpha_min,
      alpha_min = _ref7$alpha_min === void 0 ? 0.1 : _ref7$alpha_min;

  if (!layout) {
    /////console.log("new!")
    layout = new _konva.default.Arrow({
      perfectDrawEnabled: false,
      tension: 0.5 //zIndex: 0,

    });
  }

  var colscale = (0, _color_utils.color_scale)(cmap, {
    levels: value_levels,
    max: value_max,
    min: value_min
  });

  var _link = _slicedToArray(link, 4),
      src = _link[0],
      dst = _link[1],
      lag = _link[2],
      val = _link[3];

  var _positions$src = _slicedToArray(positions[src], 3),
      x0 = _positions$src[0],
      y0 = _positions$src[1],
      n0 = _positions$src[2];

  var _positions$dst = _slicedToArray(positions[dst], 3),
      x1 = _positions$dst[0],
      y1 = _positions$dst[1],
      n1 = _positions$dst[2];

  var line_color = colscale.getHex(val); //let relative_val = (colscale.getScale(val) / value_levels);
  //let relative_val = (value_max - val) / (value_max - value_min);

  var relative_val = val / (value_max - value_min); ////relative_val = relative_val * relative_val;
  ///relative_val = 1 - relative_val;
  //let line_width = 1;
  //relative_val = 1 - relative_val;

  var line_width = relative_val * (line_width_max - line_width_min) + line_width_min; //relative_val = 1 - relative_val;

  var alpha = relative_val * (alpha_max - alpha_min) + alpha_min;
  /*
  line_width = 1
  alpha = 1
  line_color = "white"
  */

  layout.opacity(alpha);
  layout.x(x0);
  layout.y(y0); //layout.points([0, 0, x1 - x0, y1 - y0]);

  layout.points([0, 0, (x1 - x0) * 0.4, (y1 - y0) * 0.7, x1 - x0, y1 - y0]);
  layout.pointerLength(10);
  layout.pointerWidth(10);
  layout.fill(line_color);
  layout.stroke(line_color);
  layout.strokeWidth(line_width);
  return layout;
};

exports.drawArrow = drawArrow;

var drawArrows = function drawArrows(links, positions, app) {
  var layouts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var _ref8 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
      _ref8$cmap = _ref8.cmap,
      cmap = _ref8$cmap === void 0 ? "viridis" : _ref8$cmap,
      _ref8$value_levels = _ref8.value_levels,
      value_levels = _ref8$value_levels === void 0 ? 20 : _ref8$value_levels,
      _ref8$value_max = _ref8.value_max,
      value_max = _ref8$value_max === void 0 ? 10 : _ref8$value_max,
      _ref8$value_min = _ref8.value_min,
      value_min = _ref8$value_min === void 0 ? 0 : _ref8$value_min,
      _ref8$value_autolevel = _ref8.value_autolevel,
      value_autolevel = _ref8$value_autolevel === void 0 ? false : _ref8$value_autolevel,
      _ref8$line_width_max = _ref8.line_width_max,
      line_width_max = _ref8$line_width_max === void 0 ? 1 : _ref8$line_width_max,
      _ref8$line_width_min = _ref8.line_width_min,
      line_width_min = _ref8$line_width_min === void 0 ? 0.1 : _ref8$line_width_min,
      _ref8$alpha_max = _ref8.alpha_max,
      alpha_max = _ref8$alpha_max === void 0 ? 0.9 : _ref8$alpha_max,
      _ref8$alpha_min = _ref8.alpha_min,
      alpha_min = _ref8$alpha_min === void 0 ? 0.1 : _ref8$alpha_min;

  var is_new_layout = false;
  var layer = null;
  var link_number = links.length;

  if (!layouts) {
    layouts = _toConsumableArray(Array(link_number * 2)).map(function () {
      return null;
    });
    layer = has_layers(app) ? app.getLayers()[0] : new _konva.default.Layer();
    is_new_layout = true;
  }

  var animate = function animate(link) {
    link.opacity(0.2);
    link.strokeWidth(4); //const points = link.points();

    var anim = new _konva.default.Animation(function (frame) {
      link.opacity(0.2);
      var points = link._base_points;
      var period = 1000;
      var w = Math.cos(frame.time * 2 * Math.PI / period);
      var k = -0.5 * w + 0.5; //let k = Math.max(frame.time, period) / period;

      link.points([0, 0, k * points[2], k * points[3]]); //if(k >= 1) anim.stop();
    }, layer);
    anim.start();
  };

  var update = function update(k, new_link) {
    var total_links = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    total_links = total_links == null ? links.length : total_links;
    var is_new = layouts[k] == null;
    layouts[k] = drawArrow(new_link, positions, app, layouts[k], {
      cmap: cmap,
      value_levels: value_levels,
      value_max: value_max,
      value_min: value_min,
      value_autolevel: value_autolevel,
      line_width_max: line_width_max,
      line_width_min: line_width_min,
      //alpha: 0.3,
      alpha_max: alpha_max,
      alpha_min: alpha_min
    });
    layouts[k]._base_points = layouts[k].points(); // fixed

    layouts[k + total_links] = drawArrow(new_link, positions, app, layouts[k + total_links], {
      cmap: cmap,
      value_levels: value_levels,
      value_max: value_max,
      value_min: value_min,
      line_width_max: line_width_max,
      line_width_min: line_width_min,
      alpha_max: 0.9,
      alpha_min: 0.1
    });

    if (is_new) {
      layer.add(layouts[k]);
      layer.add(layouts[k + total_links]);
      animate(layouts[k]);
    } else {//layouts[k].draw();
    }
  };

  var update_all = function update_all(new_links) {
    var filter_links = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var L = 2 * new_links.length - layouts.length;
    console.log("###", 2 * new_links.length, layouts.length, "::", L);

    for (var k = 0; k < L; k++) {
      layouts.push(null); // = [...Array(link_number * 2)].map(() => null);

      layouts.push(null); // = [...Array(link_number * 2)].map(() => null);
    } //


    if (value_autolevel) {
      //value_max = Math.max(...new_links.flat(2).filter((v, i) => i % 4 == 3))
      //value_min = Math.min(...new_links.flat(2).filter((v, i) => i % 4 == 3))
      value_max = Math.max.apply(Math, _toConsumableArray(new_links.filter(function (v) {
        return v[0] != v[1];
      }).map(function (v, i) {
        return v[3];
      })));
      value_min = Math.min.apply(Math, _toConsumableArray(new_links.filter(function (v) {
        return v[0] != v[1];
      }).map(function (v, i) {
        return v[3];
      })));
    }

    window._new_links = new_links;
    window._new_links_a = {
      new_links: new_links,
      value_max: value_max,
      value_min: value_min
    };

    if (filter_links) {
      var ordered_matrix = new_links.copyWithin().sort(function (a, b) {
        return a[3] - b[3];
      }); //const percentile_95 = ordered_matrix[Math.ceil(ordered_matrix.length * 0.95)][3]
      //const percentile_5 = ordered_matrix[Math.ceil(ordered_matrix.length * 0.05)][3]
      /////const percentile_80 = ordered_matrix[Math.ceil(ordered_matrix.length * 0.80)][3]

      var percentile_threshold = ordered_matrix[Math.ceil(ordered_matrix.length * 0.80)][3];
      new_links = new_links.filter(function (v) {
        return v[0] != v[1] && v[3] > percentile_threshold;
      }).map(function (v, i) {
        return [v[0], v[1], v[2], v[3]];
      });
      value_max = Math.max.apply(Math, _toConsumableArray(new_links.filter(function (v) {
        return v[0] != v[1];
      }).map(function (v, i) {
        return v[3];
      })));
      value_min = Math.min.apply(Math, _toConsumableArray(new_links.filter(function (v) {
        return v[0] != v[1];
      }).map(function (v, i) {
        return v[3];
      })));
    }

    window._new_links_a = {
      new_links: new_links,
      value_max: value_max,
      value_min: value_min
    }; //
    //
    //

    for (var _k = 0; _k < layouts.length; _k++) {
      if (layouts[_k] != null) {
        layouts[_k].opacity(0);
      }
    }

    for (var _k2 = 0; _k2 < new_links.length; _k2++) {
      update(_k2, new_links[_k2], new_links.length);
    }

    if (is_new_layout) {
      if (!has_layers(app)) app.add(layer);
    } else {
      layer.batchDraw();
    }

    is_new_layout = false;
  };

  update_all(links);
  return {
    update: update,
    update_all: update_all,
    layouts: layouts
  };
};

exports.drawArrows = drawArrows;

var drawScale = function drawScale(app) {
  var layout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var _ref9 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref9$cmap = _ref9.cmap,
      cmap = _ref9$cmap === void 0 ? "viridis" : _ref9$cmap,
      _ref9$cmap_levels = _ref9.cmap_levels,
      cmap_levels = _ref9$cmap_levels === void 0 ? 20 : _ref9$cmap_levels,
      _ref9$cmap_max = _ref9.cmap_max,
      cmap_max = _ref9$cmap_max === void 0 ? 10 : _ref9$cmap_max,
      _ref9$cmap_min = _ref9.cmap_min,
      cmap_min = _ref9$cmap_min === void 0 ? 0 : _ref9$cmap_min,
      _ref9$height = _ref9.height,
      height = _ref9$height === void 0 ? 120 : _ref9$height,
      _ref9$width = _ref9.width,
      width = _ref9$width === void 0 ? 10 : _ref9$width,
      _ref9$pos_x = _ref9.pos_x,
      pos_x = _ref9$pos_x === void 0 ? 20 : _ref9$pos_x,
      _ref9$pos_y = _ref9.pos_y,
      pos_y = _ref9$pos_y === void 0 ? 450 : _ref9$pos_y,
      _ref9$border_color = _ref9.border_color,
      border_color = _ref9$border_color === void 0 ? "black" : _ref9$border_color,
      _ref9$border_width = _ref9.border_width,
      border_width = _ref9$border_width === void 0 ? 0.1 : _ref9$border_width,
      _ref9$label_color = _ref9.label_color,
      label_color = _ref9$label_color === void 0 ? "black" : _ref9$label_color;

  var is_new_layout = false;
  var layer = null;

  if (!layout) {
    layout = _toConsumableArray(Array(cmap_levels)).map(function () {
      return null;
    });
    layer = has_layers(app) ? app.getLayers()[0] : new _konva.default.Layer();
    is_new_layout = true;
  } //let colscale_levels = Math.max(10, cmap_levels);


  var colscale_levels = 6 * cmap_levels;
  var colscale = (0, _color_utils.color_scale)(cmap, {
    levels: colscale_levels,
    max: cmap_levels,
    min: 0
  });
  var cell_height = height / cmap_levels;

  if (is_new_layout) {
    for (var val = 0; val < cmap_levels; val++) {
      var col = colscale.getHex(cmap_levels - 1 - val);
      var x0 = pos_x;
      var y0 = pos_y + cell_height * val;
      var rect = void 0;
      rect = new _konva.default.Rect({
        x: x0,
        y: y0,
        width: width,
        height: cell_height,
        perfectDrawEnabled: false,
        fill: col //zIndex: 0,

      });
      layout[val] = rect;
      layer.add(layout[val]);

      if (border_width > 0) {
        rect.stroke(border_color);
        rect.strokeWidth(border_width);
      } else {
        rect.strokeWidth(0);
      }
    }
  }

  var text_height = Math.max(6, Math.min(14, cell_height));
  var min_label, max_label;
  {
    var x = pos_x + 2;
    var y = pos_y - text_height; // + (cell_height - text_height) / 2;

    max_label = new _konva.default.Text({
      x: x,
      y: y,
      text: "".concat(cmap_max),
      fontSize: text_height,
      fontFamily: 'Calibri',
      fill: label_color,
      perfectDrawEnabled: false //zIndex: 0,

    });
    layer.add(max_label);
  }
  {
    var _x3 = pos_x + 2;

    var _y3 = pos_y + cell_height * cmap_levels; // - (cell_height - text_height) / 2;


    min_label = new _konva.default.Text({
      x: _x3,
      y: _y3,
      text: "".concat(cmap_min),
      fontSize: text_height,
      fontFamily: 'Calibri',
      fill: label_color,
      perfectDrawEnabled: false //zIndex: 0,

    });
    layer.add(min_label);
  } ///

  if (!has_layers(app)) app.add(layer);

  var update_range = function update_range(cmap_max, cmap_min) {
    var _ref10 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref10$to_scientific_ = _ref10.to_scientific_notation,
        to_scientific_notation = _ref10$to_scientific_ === void 0 ? true : _ref10$to_scientific_,
        _ref10$shift = _ref10.shift,
        shift = _ref10$shift === void 0 ? 0 : _ref10$shift;

    if (to_scientific_notation) {
      min_label.text("".concat((cmap_min + shift).toExponential(2)));
      max_label.text("".concat((cmap_max + shift).toExponential(2)));
    } else {
      min_label.text("".concat(cmap_min + shift));
      max_label.text("".concat(cmap_max + shift));
    }

    layer.batchDraw();
  };

  update_range(cmap_max, cmap_min);
  return {
    layout: layout,
    update_range: update_range
  };
};

exports.drawScale = drawScale;
},{"konva":"../../node_modules/konva/lib/index.js","./color_utils":"color_utils.js"}],"eeg_layout.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draw_animation = exports.random_links = exports.random_point = exports.random_matrix = exports.zero_matrix = void 0;

var _jstat = _interopRequireDefault(require("jstat"));

var _konva = _interopRequireDefault(require("konva"));

var _eeg2D = require("../opc-eeg-positions@1.0.0/eeg2D.js");

var _basic_layout = require("./basic_layout");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var zero_matrix = function zero_matrix(M) {
  var matrix2 = [];

  for (var i = 0; i < M; i++) {
    for (var j = 0; j < M; j++) {
      matrix2.push([i, j, 0, 0]);
    }
  }

  return matrix2;
};

exports.zero_matrix = zero_matrix;

var random_matrix = function random_matrix(M) {
  var matrix2 = [];

  for (var i = 0; i < M; i++) {
    for (var j = 0; j < M; j++) {
      matrix2.push([i, j, 0, _jstat.default.normal.sample(0, 50)]); //matrix2.push([i, j, 0, i*j]);

      if (i == j && i == 0) {
        matrix2[matrix2.length - 1][3] = 0;
      }
    }
  }

  return matrix2;
};

exports.random_matrix = random_matrix;

var random_point = function random_point(M) {
  var matrix2 = [];

  for (var i = 0; i < M; i++) {
    matrix2.push(_jstat.default.normal.sample(0, 2));
  }

  return matrix2;
};

exports.random_point = random_point;

var random_links = function random_links(M, number_links) {
  var links = _toConsumableArray(Array(number_links)).map(function (v) {
    return [Math.floor(_jstat.default.uniform.sample(0, M)), Math.floor(_jstat.default.uniform.sample(0, M)), -1, _jstat.default.normal.sample(0, 2)];
  });

  return links;
}; ///////////////////////////////////////////////////////////////////////////////

/**
 * From https://stackoverflow.com/a/44779316
 *
 * @param {Function} fn Callback function
 * @param {Boolean|undefined} [throttle] Optionally throttle callback
 * @return {Function} Bound function
 *
 * @example
 * //generate rAFed function
 * jQuery.fn.addClassRaf = bindRaf(jQuery.fn.addClass);
 *
 * //use rAFed function
 * $('div').addClassRaf('is-stuck');
 */


exports.random_links = random_links;

var bindRaf = function bindRaf(fn) {
  var throttle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var isRunning = false,
      that,
      args;

  var run = function run() {
    //isRunning = false;
    fn.apply(that, args);
  };

  return function () {
    that = this;
    args = arguments;

    if (isRunning && throttle) {
      return;
    }

    isRunning = true;
    requestAnimationFrame(run);
  };
};

var create_links = function create_links(links, link_arrows, app, data_positions, settings) {
  var number_links = settings.animation.mainmap_number_links;

  var update = function update(new_links) {
    if (!link_arrows) {
      link_arrows = (0, _basic_layout.drawArrows)(new_links, data_positions, app, null, {
        cmap: settings.animation.arrow_cmap,
        value_levels: settings.animation.arrow_value_levels,
        value_max: settings.animation.arrow_value_max,
        value_min: settings.animation.arrow_value_min,
        value_autolevel: true,
        line_width_max: settings.animation.arrow_line_width_max,
        line_width_min: settings.animation.arrow_line_width_min,
        alpha_max: settings.animation.arrow_line_alpha_max,
        alpha_min: settings.animation.arrow_line_alpha_min
      });
    } else {
      link_arrows.update_all(new_links);
    }
  };

  update(links);
  return {
    update: update
  };
};

var create_lines = function create_lines(new_timepoint, app, settings, channels) {
  var lines = (0, _basic_layout.drawLines)(new_timepoint, app, null, channels, {
    cmap: settings.animation.timeseries_cmap,
    max_points: settings.animation.timeseries_max_points,
    scale_y: settings.animation.timeseries_scale_y,
    pos_x: settings.animation.timeseries_pos_x,
    pos_y: settings.animation.timeseries_pos_y,
    width: settings.animation.timeseries_width,
    height: settings.animation.timeseries_height,
    line_width: settings.animation.timeseries_line_width,
    alpha: settings.animation.timeseries_alpha,
    spline_tension: settings.animation.timeseries_spline_tension
  });
  return lines;
}; // https://stackoverflow.com/questions/12539574/whats-the-best-way-most-efficient-to-turn-all-the-keys-of-an-object-to-lower


var objectKeysToLowerCase = function objectKeysToLowerCase(obj) {
  var key,
      keys = Object.keys(obj);
  var n = keys.length;
  var newobj = {};

  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = obj[key];
  }

  return newobj;
};

var getMinMaxInMatrix = function getMinMaxInMatrix(link_matrix) {
  return {
    //max: Math.max(...link_matrix.flat(2).filter((v, i) => i % 4 == 3)),
    //min: Math.min(...link_matrix.flat(2).filter((v, i) => i % 4 == 3)),
    max: Math.max.apply(Math, _toConsumableArray(link_matrix.filter(function (v) {
      return v[0] != v[1];
    }).map(function (m) {
      return m[3];
    }))),
    min: Math.min.apply(Math, _toConsumableArray(link_matrix.filter(function (v) {
      return v[0] != v[1];
    }).map(function (m) {
      return m[3];
    })))
  };
}; ///////////////////////////////////////////////////////////////////////////////


var draw_animation = function draw_animation(canvas_element, canvas_params, settings, channels) {
  var M = channels.length; ///////////////////////////////////////////////////////////////////////////////

  var app = new _konva.default.Stage({
    container: canvas_element,
    width: canvas_params.width,
    height: canvas_params.height //pixelRatio: 2,

  });
  window._app = app; //

  var image_background = window.getComputedStyle(app.container().querySelector('[role="presentation"]')).backgroundImage.replace(/(^\s*url\s*\(\s*|\s*\)\s*|"|')/g, "");
  console.log("image_background:", image_background); //
  //Konva.Image.fromURL(image_background, function(imgNode)

  {
    //  window._imgNode = imgNode;
    var has_layers = function has_layers(app) {
      return app.getLayers().length > 0;
    };

    var had_layer = has_layers(app);
    var layer = had_layer ? app.getLayers()[0] : new _konva.default.Layer();
    var shape = new _konva.default.Rect({
      x: 0,
      y: 0,
      width: app.width(),
      height: app.height(),
      //fill: 'rgba(255, 255, 255, 0.2)',
      //stroke: 'black',
      strokeWidth: 0 //shadowBlur : 40,
      //fillPatternImage: _imgNode.image(),
      //zIndex: -1000,
      //opacity : 0.5,

    });
    window._shape = shape;
    console.log(shape);
    layer.add(shape);
    if (!had_layer) app.add(layer);

    _konva.default.Image.fromURL(image_background, function (imgNode) {
      shape.fillPatternImage(imgNode.image());
    });
  }
  /*Konva.Image.fromURL(image_background, function(imgNode) {
    const has_layers = (app) => app.getLayers().length > 0
    window._imgNode = imgNode;
    let layer = has_layers(app)? app.getLayers()[0]: new Konva.Layer();
    imgNode.setAttrs({
      x: 0,
      y: 0,
      scaleX: app.width() / imgNode.width(),
      scaleY: app.width() / imgNode.width(),
    });
    layer.add(imgNode);
    //layer.batchDraw();
    app.add(layer);
  });
  */
  //

  /*
  {
    const has_layers = (app) => app.getLayers().length > 0
    let layer = has_layers(app)? app.getLayers()[0]: new Konva.Layer();
    let shape = new Konva.Rect({
      x: 20,
      y: 20,
      width: app.width(),
      height: app.height(),
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4,
      shadowBlur : 40,
      //opacity : 0.5,
    });
    window._shape = shape;
    console.log(shape)
    layer.add(shape);
    app.add(layer);
  }
  */

  var eeg_locations = objectKeysToLowerCase((0, _eeg2D.rescaledEEGLocations2D)({
    width: settings.animation.brain_width,
    height: settings.animation.brain_height,
    top: settings.animation.brain_top,
    left: settings.animation.brain_left
  }, true));
  var timeseries = create_lines(random_point(M), app, settings, channels);
  var data_positions = channels.map(function (k) {
    return [].concat(_toConsumableArray(eeg_locations[k.toLowerCase()]), [k]);
  });
  window._data_positions = data_positions;
  (0, _basic_layout.drawPointsEEG)(eeg_locations, app, {
    border_color: settings.animation.brain_nodes_border_color,
    fill_color: settings.animation.brain_nodes_fill_color,
    radius: settings.animation.brain_nodes_radius,
    alpha: 0.2
  });
  (0, _basic_layout.drawLabelsEEG)(data_positions, app, {
    border_color: settings.animation.brain_nodes_border_color,
    fill_color: settings.animation.brain_nodes_fill_color,
    radius: settings.animation.brain_nodes_radius
  }); ///////////////////////////////////////////////////////////////////////////////

  var connectivity_matrix = (0, _basic_layout.drawMatrices)([random_matrix(M)], app, null, data_positions, ["Maximum cross-lag connectivity (PDC)"], {
    cmap: settings.animation.mainmap_cmap,
    cmap_levels: settings.animation.mainmap_cmap_levels,
    cmap_max: settings.animation.mainmap_cmap_max,
    cmap_min: settings.animation.mainmap_cmap_min,
    cmap_autolevel: true,
    size: settings.animation.mainmap_size,
    pos_x: settings.animation.mainmap_left,
    pos_y: settings.animation.mainmap_top,
    shift_x: 0,
    border_color: settings.animation.mainmap_border_color,
    border_width: settings.animation.mainmap_border_width,
    label_color: settings.animation.mainmap_label_color
  });
  var connectivity_matrix_scale = (0, _basic_layout.drawScale)(app, null, {
    cmap: settings.animation.mainmap_cmap,
    cmap_levels: settings.animation.mainmap_cmap_levels,
    cmap_max: settings.animation.mainmap_cmap_max,
    cmap_min: settings.animation.mainmap_cmap_min,
    height: settings.animation.mainmap_size,
    width: 10,
    pos_x: settings.animation.mainmap_left + settings.animation.mainmap_size * 1.1,
    pos_y: settings.animation.mainmap_top,
    border_color: settings.animation.mainmap_border_color,
    border_width: settings.animation.mainmap_border_width,
    label_color: settings.animation.mainmap_label_color
  });
  var lag_dependency_matrix = (0, _basic_layout.drawMatrices)([random_matrix(M)], app, null, data_positions, ["Maximum lag"], {
    cmap: settings.animation.lagmap_cmap,
    cmap_levels: settings.animation.lagmap_cmap_levels,
    cmap_max: settings.animation.lagmap_cmap_max,
    cmap_min: settings.animation.lagmap_cmap_min,
    cmap_autolevel: false,
    size: settings.animation.lagmap_size,
    pos_x: settings.animation.lagmap_left,
    pos_y: settings.animation.lagmap_top,
    shift_x: 0,
    border_color: settings.animation.lagmap_border_color,
    border_width: settings.animation.lagmap_border_width,
    label_color: settings.animation.lagmap_label_color
  });
  var lag_dependency_matrix_scale = (0, _basic_layout.drawScale)(app, null, {
    cmap: settings.animation.lagmap_cmap,
    cmap_levels: settings.animation.lagmap_cmap_levels,
    cmap_max: settings.animation.lagmap_cmap_max,
    cmap_min: settings.animation.lagmap_cmap_min,
    height: settings.animation.lagmap_size,
    width: 10,
    pos_x: settings.animation.lagmap_left + settings.animation.lagmap_size * 1.1,
    pos_y: settings.animation.lagmap_top,
    border_color: settings.animation.lagmap_border_color,
    border_width: settings.animation.lagmap_border_width,
    label_color: settings.animation.lagmap_label_color
  });
  lag_dependency_matrix_scale.update_range(settings.animation.lagmap_cmap_levels, 1, {
    to_scientific_notation: false,
    shift: 0
  });
  var spectral_connectivity_matrices = (0, _basic_layout.drawMatrices)([random_matrix(M), random_matrix(M), random_matrix(M), random_matrix(M), random_matrix(M)], app, null, data_positions, ["Delta [0-4Hz]", "Theta [4-8Hz]", "Alpha [8-12Hz]", "Beta [12-30Hz]", "Gamma [30-50Hz]"], {
    cmap: settings.animation.minimap_cmap,
    cmap_levels: settings.animation.minimap_cmap_levels,
    cmap_max: settings.animation.minimap_cmap_max,
    cmap_min: settings.animation.minimap_cmap_min,
    size: settings.animation.minimap_size,
    pos_x: settings.animation.minimap_left + 0,
    pos_y: settings.animation.minimap_top + 0,
    shift_x: settings.animation.minimap_separation_x,
    border_color: settings.animation.minimap_border_color,
    border_width: settings.animation.minimap_border_width,
    label_color: settings.animation.minimap_label_color
  }); //const connectivity_arrows = create_links(random_links(M, settings.animation.mainmap_number_links), null, app, data_positions, settings);

  var connectivity_arrows = (0, _basic_layout.drawArrows)(random_links(M, settings.animation.mainmap_number_links), data_positions, app, null, {
    cmap: settings.animation.arrow_cmap,
    value_levels: settings.animation.arrow_value_levels,
    value_max: settings.animation.arrow_value_max,
    value_min: settings.animation.arrow_value_min,
    value_autolevel: true,
    line_width_max: settings.animation.arrow_line_width_max,
    line_width_min: settings.animation.arrow_line_width_min
  });
  var connectivity_arrows_scale = (0, _basic_layout.drawScale)(app, null, {
    cmap: settings.animation.arrow_cmap,
    cmap_levels: settings.animation.arrow_value_levels,
    cmap_max: settings.animation.arrow_value_max,
    cmap_min: settings.animation.arrow_value_min,
    height: settings.animation.brain_height,
    width: 10,
    pos_x: settings.animation.brain_left - 15,
    pos_y: settings.animation.brain_top,
    border_color: "white",
    border_width: 0,
    label_color: settings.animation.mainmap_label_color // NOTE: It derives the label color from mainmap

  }); //return {app, connectivity_matrix, lag_dependency_matrix, spectral_connectivity_matrices, timeseries, connectivity_arrows};
  ///////////////////////////////////////////////////////////////////////////////

  var fill_matrix = function fill_matrix(X) {
    //console.log(X)
    var X1 = zero_matrix(M);

    for (var k = 0; k < X.length; k++) {
      var i = X[k][0];
      var j = X[k][1];
      X1[i * M + j][2] = X[k][2];
      X1[i * M + j][3] = X[k][3];
    }

    return X1;
  };

  var update_connectivity = function update_connectivity(X) {
    connectivity_matrix.update(0, fill_matrix(X));
    var ranges = getMinMaxInMatrix(X);
    connectivity_matrix_scale.update_range(ranges.max, ranges.min, {
      to_scientific_notation: true,
      shift: 0
    });
  };

  var update_lag_dependency = function update_lag_dependency(X) {
    lag_dependency_matrix.update(0, fill_matrix(X)); //const ranges = getMinMaxInMatrix(X);
    //lag_dependency_matrix_scale.update_range(ranges.max, ranges.min, {to_scientific_notation: false, shift: 1});
  };

  var update_connectivity_delta = function update_connectivity_delta(X) {
    return spectral_connectivity_matrices.update(0, fill_matrix(X));
  };

  var update_connectivity_theta = function update_connectivity_theta(X) {
    return spectral_connectivity_matrices.update(1, fill_matrix(X));
  };

  var update_connectivity_alpha = function update_connectivity_alpha(X) {
    return spectral_connectivity_matrices.update(2, fill_matrix(X));
  };

  var update_connectivity_beta = function update_connectivity_beta(X) {
    return spectral_connectivity_matrices.update(3, fill_matrix(X));
  };

  var update_connectivity_gamma = function update_connectivity_gamma(X) {
    return spectral_connectivity_matrices.update(4, fill_matrix(X));
  };

  var update_connectivity_arrows = function update_connectivity_arrows(X) {
    //connectivity_arrows.update(X)
    connectivity_arrows.update_all(X);
    var ranges = getMinMaxInMatrix(X);
    connectivity_arrows_scale.update_range(ranges.max, ranges.min, {
      to_scientific_notation: true,
      shift: 0
    });
  };

  var update_timeseries = function update_timeseries(X) {
    return timeseries.update_all(X);
  }; //
  //


  return {
    app: app,
    update_connectivity: update_connectivity,
    update_lag_dependency: update_lag_dependency,
    update_connectivity_delta: update_connectivity_delta,
    update_connectivity_theta: update_connectivity_theta,
    update_connectivity_alpha: update_connectivity_alpha,
    update_connectivity_beta: update_connectivity_beta,
    update_connectivity_gamma: update_connectivity_gamma,
    update_connectivity_arrows: update_connectivity_arrows,
    update_timeseries: update_timeseries
  };
};

exports.draw_animation = draw_animation;
},{"jstat":"../../node_modules/jstat/dist/jstat.js","konva":"../../node_modules/konva/lib/index.js","../opc-eeg-positions@1.0.0/eeg2D.js":"../opc-eeg-positions@1.0.0/eeg2D.js","./basic_layout":"basic_layout.js"}],"animation.js":[function(require,module,exports) {
"use strict";

var _kefir = _interopRequireDefault(require("kefir"));

var _jstat = _interopRequireDefault(require("jstat"));

var _dataprovider = require("./dataprovider");

var _konva = _interopRequireDefault(require("konva"));

var _eeg2D = require("../opc-eeg-positions@1.0.0/eeg2D.js");

var _eeg_layout = require("./eeg_layout");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// ffmpeg -i recordings.webm -movflags faststart -profile:v high -level 4.2 video.mp4
_konva.default.showWarnings = false; ///////////////////////////////////////////////////////////////////////////////

var settings = {
  animation: {
    brain_width: 300,
    brain_height: 400,
    brain_top: 50,
    brain_left: 20,
    brain_nodes_border_color: "#feeb77",
    brain_nodes_fill_color: "#650a5a",
    brain_nodes_radius: 2,
    //
    mainmap_size: 350,
    mainmap_top: 50,
    mainmap_left: 850,
    mainmap_cmap: "viridis",
    mainmap_cmap_levels: 20,
    mainmap_cmap_max: 0.01,
    mainmap_cmap_min: 0,
    //mainmap_border_width: 0.1,
    mainmap_border_width: 0,
    mainmap_border_color: "#DDDDDD",
    mainmap_label_color: "#FFFFFF",
    mainmap_number_links: 6,
    //
    lagmap_size: 240,
    lagmap_top: 440,
    lagmap_left: 890,
    lagmap_cmap: "RdBu",
    lagmap_cmap_levels: 20,
    lagmap_cmap_max: 10,
    lagmap_cmap_min: 0,
    lagmap_border_width: 0.1,
    lagmap_border_color: "#DDDDDD",
    lagmap_label_color: "#FFFFFF",
    //
    minimap_size: 130,
    minimap_top: 550,
    minimap_left: 20,
    minimap_separation_x: 30,
    minimap_cmap: "viridis",
    minimap_cmap_levels: 20,
    minimap_cmap_max: 0.01,
    minimap_cmap_min: 0,
    //minimap_border_width: 0.1,
    minimap_border_width: 0,
    minimap_border_color: "#DDDDDD",
    minimap_label_color: "#FFFFFF",
    //
    //arrow_cmap: "hot_r",
    //arrow_cmap: "par_r",
    arrow_cmap: "viridis",
    arrow_value_levels: 20,
    arrow_value_max: 0.01,
    arrow_value_min: -0.01,
    arrow_line_width_max: 1,
    arrow_line_width_min: 0.1,
    arrow_line_alpha_max: 0.7,
    arrow_line_alpha_min: 0.1,
    //
    timeseries_cmap: "phase_r",
    timeseries_max_points: 100,
    timeseries_scale_y: 1e8,
    timeseries_pos_x: 340,
    timeseries_pos_y: 50,
    timeseries_width: 460,
    timeseries_height: 450,
    timeseries_line_width: 1,
    timeseries_alpha: 1,
    timeseries_spline_tension: 0 // reduce memory load from ~150MB/110%CPU to 85MB/90%CPU
    //

  } ///////////////////////////////////////////////////////////////////////////////

};
///////////////////////////////////////////////////////////////////////////////
var server_settings = {
  server: "localhost",
  port: 9120
};
var server_config = {
  "numpy-file": "NatEEG-S061-01--24-A.npy",
  //"numpy-file": "NatEEG-S061-01--26.npy",
  //"numpy-file": "Nathan-example.npy",
  //
  "amplitude-factor": 1e-8,
  "lags": 128,
  //"lags": 2,
  //
  //"lags": 64,
  //"lags": 16,
  //"batch": 2,
  "batch-general-pdc": 5,
  "batch-region-pdc": 15,
  "batch-connectivity": 5,
  "batch-link-arrows": 4,
  "batch-timeseries": 1,
  //
  "sampling-frequency": 256,
  "pdc-number-evaluation-points": 20,
  //
  "max-representative-values": 50
};
settings.animation.mainmap_number_links = server_config["max-representative-values"];
settings.animation.lagmap_cmap_levels = server_config["lags"];
var channels = null;
var animation = null;
var app_provider = (0, _dataprovider.dataprovider)((0, _dataprovider.websocket_connection)(server_settings), server_config).subscribe("channels", function (v) {
  channels = v;
  console.log(channels);
  animation = (0, _eeg_layout.draw_animation)(document.getElementById("app"), {
    width: 1300,
    height: 700
  }, settings, channels);
  window._animation = animation;
}).subscribe("timepoints", function (v) {
  document.title = "<<T>> ".concat(Math.min.apply(Math, _toConsumableArray(v)), " ").concat(Math.max.apply(Math, _toConsumableArray(v)));

  if (animation) {
    animation.update_timeseries(v);
  }
}).subscribe( //"maximum-values", (v) => {
//  document.title = "<<MV>>" + v.length.toString() + "," + v[0].length.toString()
//  if(animation){
//    animation.update_connectivity(v)
//  }
//}).subscribe(
"pdc-total", function (v) {
  //"maximum-values", (v) => {
  document.title = "<<PDC-000>>" + v.length.toString() + "," + v[0].length.toString();

  if (animation) {
    window.connectivity = v;
    animation.update_connectivity(v);
    animation.update_connectivity_arrows(v);
  }
}).subscribe("pdc-delta", function (v) {
  document.title = "<<PDC-D>>" + v.length.toString() + "," + v[0].length.toString();

  if (animation) {
    animation.update_connectivity_delta(v);
  }
}).subscribe("pdc-theta", function (v) {
  document.title = "<<PDC-T>>" + v.length.toString() + "," + v[0].length.toString();

  if (animation) {
    animation.update_connectivity_theta(v);
  }
}).subscribe("pdc-alpha", function (v) {
  document.title = "<<PDC-A>>" + v.length.toString() + "," + v[0].length.toString();

  if (animation) {
    animation.update_connectivity_alpha(v);
  }
}).subscribe("pdc-beta", function (v) {
  document.title = "<<PDC-B>>" + v.length.toString() + "," + v[0].length.toString();

  if (animation) {
    animation.update_connectivity_beta(v);
  }
}).subscribe("pdc-gamma", function (v) {
  document.title = "<<PDC-G>>" + v.length.toString() + "," + v[0].length.toString();

  if (animation) {
    animation.update_connectivity_gamma(v);
  }
}).subscribe("maximum-lags", function (v) {
  document.title = "<<ML>>" + v.length.toString() + "," + v[0].length.toString();

  if (animation) {
    animation.update_lag_dependency(v);
  }
}).subscribe(
/*"relevant-links", (v) => {
  document.title = "<<RL>>" + v.length.toString() + "," + v[0].length.toString()
  //console.log("SS", v.length.toString() + "," + v[0].length.toString())
  if(animation) animation.update_connectivity_arrows(v)
}).subscribe(*/
"pdc-relevant-links", function (v) {
  document.title = "<<PRL>>" + v.length.toString() + "," + v[0].length.toString(); //console.log("SS", v.length.toString() + "," + v[0].length.toString())

  window._links = v; //if(animation) animation.update_connectivity_arrows(v.filter((v, i) => Math.abs(v[3]) > 0))
  //////
  ///if(animation) animation.update_connectivity_arrows(v)
});

var export_canvas_animation = function export_canvas_animation(layer) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$target_element = _ref.target_element,
      target_element = _ref$target_element === void 0 ? document.body : _ref$target_element,
      _ref$show_video = _ref.show_video,
      show_video = _ref$show_video === void 0 ? true : _ref$show_video;

  var canvas = layer.canvas._canvas;
  var rec = null;

  var stop = function stop() {
    rec.stop();
  };

  var start = function start() {
    var chunks = []; // here we will store our recorded media chunks (Blobs)

    var stream = canvas.captureStream(); // grab our canvas MediaStream

    rec = new MediaRecorder(stream); // init the recorder
    // every time the recorder has new data, we will store it in our array

    rec.ondataavailable = function (e) {
      return chunks.push(e.data);
    }; // only when the recorder stops, we construct a complete Blob from all the chunks


    rec.onstop = function (e) {
      return show(new Blob(chunks, {
        type: 'video/webm'
      }));
    };

    rec.start();
  };

  var show = function show(blob) {
    target_element.classList.remove("hidden");
    var vid = document.createElement('video');
    vid.src = URL.createObjectURL(blob);
    vid.controls = true;
    var a = document.createElement('a');
    a.classList.add("download-link");
    a.download = 'animation_video.webm';
    a.href = vid.src;
    a.textContent = 'Download this sequence as a .webm video';
    target_element.appendChild(vid);
    target_element.appendChild(a);
  };

  return {
    start: start,
    stop: stop,
    show: show
  };
};

var video_recording = null;
setTimeout(function () {
  video_recording = export_canvas_animation(animation.app.getLayers()[0], {
    target_element: document.querySelector("#video-container"),
    show_video: false
  });
  video_recording.start();
}, 3000);
setTimeout(function () {
  app_provider.execute("stop");
  setTimeout(function () {
    video_recording.stop();
  }, 10000);
}, 3000 * 2 * 20);
/*
const _channels = ["Nz","Iz","Cz","T9","T10","NFpz","Fpz","AFpz","AFz","AFFz","Fz","FFCz","FCz","FCCz","CCPz","CPz","CPPz","Pz","PPOz","POz",
"POOz","Oz","OIz","N2h","N2","AFp10","AF10","AFF10","F10","FFT10","FT10","FTT10","TTP10","TP10","TPP10","P10","PPO10",
"PO10","POO10","I2","I2h","N1h","N1","AFp9","AF9","AFF9","F9","FFT9","FT9","FTT9","TTP9","TP9","TPP9","P9","PPO9","PO9",
"POO9","I1","I1h","T9h","T7","T7h","C5","C5h","C3","C3h","C1","C1h","C2h","C2","C4h","C4","C6h","C6","T8h","T8","T10h",
"NFp2h","NFp2","AFp10h","AF10h","AFF10h","F10h","FFT10h","FT10h","FTT10h","TTP10h","TP10h","TPP10h","P10h","PPO10h",
"PO10h","POO10h","OI2","OI2h","NFp1h","NFp1","AFp9h","AF9h","AFF9h","F9h","FFT9h","FT9h","FTT9h","TTP9h","TP9h","TPP9h",
"P9h","PPO9h","PO9h","POO9h","OI1","OI1h","Fp2h","Fp2","AFp8","AF8","AFF8","F8","FFT8","FT8","FTT8","TTP8","TP8","TPP8",
"P8","PPO8","PO8","POO8","O2","O2h","Fp1h","Fp1","AFp7","AF7","AFF7","F7","FFT7","FT7","FTT7","TTP7","TP7","TPP7","P7",
"PPO7","PO7","POO7","O1","O1h","AFp7h","AFp5","AFp5h","AFp3","AFp3h","AFp1","AFp1h","AFp2h","AFp2","AFp4h","AFp4","AFp6h",
"AFp6","AFp8h","AF7h","AF5","AF5h","AF3","AF3h","AF1","AF1h","AF2h","AF2","AF4h","AF4","AF6h","AF6","AF8h","AFF7h","AFF5",
"AFF5h","AFF3","AFF3h","AFF1","AFF1h","AFF2h","AFF2","AFF4h","AFF4","AFF6h","AFF6","AFF8h","F7h","F5","F5h","F3","F3h",
"F1","F1h","F2h","F2","F4h","F4","F6h","F6","F8h","FFT7h","FFC5","FFC5h","FFC3","FFC3h","FFC1","FFC1h","FFC2h","FFC2",
"FFC4h","FFC4","FFC6h","FFC6","FFT8h","FT7h","FC5","FC5h","FC3","FC3h","FC1","FC1h","FC2h","FC2","FC4h","FC4","FC6h",
"FC6","FT8h","FTT7h","FCC5","FCC5h","FCC3","FCC3h","FCC1","FCC1h","FCC2h","FCC2","FCC4h","FCC4","FCC6h","FCC6","FTT8h",
"TTP7h","CCP5","CCP5h","CCP3","CCP3h","CCP1","CCP1h","CCP2h","CCP2","CCP4h","CCP4","CCP6h","CCP6","TTP8h","TP7h","CP5",
"CP5h","CP3","CP3h","CP1","CP1h","CP2h","CP2","CP4h","CP4","CP6h","CP6","TP8h","TPP7h","CPP5","CPP5h","CPP3","CPP3h",
"CPP1","CPP1h","CPP2h","CPP2","CPP4h","CPP4","CPP6h","CPP6","TPP8h","P7h","P5","P5h","P3","P3h","P1","P1h","P2h","P2",
"P4h","P4","P6h","P6","P8h","PPO7h","PPO5","PPO5h","PPO3","PPO3h","PPO1","PPO1h","PPO2h","PPO2","PPO4h","PPO4","PPO6h",
"PPO6","PPO8h","PO7h","PO5","PO5h","PO3","PO3h","PO1","PO1h","PO2h","PO2","PO4h","PO4","PO6h","PO6","PO8h","POO7h",
"POO5","POO5h","POO3","POO3h","POO1","POO1h","POO2h","POO2","POO4h","POO4","POO6h","POO6","POO8h"].slice(0, 64);
const __channels = ["O2", "O1", "F3", "F4"];
const c3hannels = ["O2", "O1", "F3", "F4", "C5", "C6", "AF7", "AF8"];
const channels = ["Fp1", "Fpz", "Fp2", "AF7", "AF3", "AF4", "AF8", "F7", "F5", "F3", "F1", "Fz", "F2", "F4", "F6", "F8", "FT7", "FC5", "FC3", "FC1", "FCz", "FC2", "FC4", "FC6", "FT8", "T7", "C5", "C3", "C1", "Cz", "C2", "C4", "C6", "T8", "TP7", "CP5", "CP3", "CP1", "CPz", "CP2", "CP4", "CP6", "TP8", "P7", "P5", "P3", "P1", "Pz", "P2", "P4", "P6", "P8", "PO7", "PO3", "Poz", "PO4", "PO8", "O1", "Oz", "O2", "TP9", "TP10"];
window.eeg = rescaledEEGLocations2D({
    width: 100,
    height: 100,
    top: 0,
    left: 0,
  }, true);
window.ch =channels
const animation = draw_animation(document.getElementById("app"), {width: 1300, height: 700}, settings, channels);

setInterval(() => {
  animation.update_timeseries(random_point(channels.length))
  animation.update_connectivity_delta(random_matrix(channels.length))
  animation.update_connectivity_theta(random_matrix(channels.length))
  animation.update_connectivity_alpha(random_matrix(channels.length))
  animation.update_connectivity_beta(random_matrix(channels.length))
  animation.update_connectivity_gamma(random_matrix(channels.length))
  animation.update_connectivity(random_matrix(channels.length))
  animation.update_lag_dependency(random_matrix(channels.length))
  animation.update_connectivity_arrows(random_links(channels.length, settings.animation.mainmap_number_links))
}, 100)

*/
},{"kefir":"../../node_modules/kefir/dist/kefir.esm.js","jstat":"../../node_modules/jstat/dist/jstat.js","./dataprovider":"dataprovider.js","konva":"../../node_modules/konva/lib/index.js","../opc-eeg-positions@1.0.0/eeg2D.js":"../opc-eeg-positions@1.0.0/eeg2D.js","./eeg_layout":"eeg_layout.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56852" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","animation.js"], null)
//# sourceMappingURL=/animation.26573c3c.js.map