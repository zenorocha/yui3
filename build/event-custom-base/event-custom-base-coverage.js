if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/event-custom-base/event-custom-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-custom-base/event-custom-base.js",
    code: []
};
_yuitest_coverage["build/event-custom-base/event-custom-base.js"].code=["YUI.add('event-custom-base', function (Y, NAME) {","","/**"," * Custom event engine, DOM event listener abstraction layer, synthetic DOM"," * events."," * @module event-custom"," */","","Y.Env.evt = {","    handles: {},","    plugins: {}","};","","","/**"," * Custom event engine, DOM event listener abstraction layer, synthetic DOM"," * events."," * @module event-custom"," * @submodule event-custom-base"," */","","/**"," * Allows for the insertion of methods that are executed before or after"," * a specified method"," * @class Do"," * @static"," */","","var DO_BEFORE = 0,","    DO_AFTER = 1,","","DO = {","","    /**","     * Cache of objects touched by the utility","     * @property objs","     * @static","     * @deprecated Since 3.6.0. The `_yuiaop` property on the AOP'd object","     * replaces the role of this property, but is considered to be private, and","     * is only mentioned to provide a migration path.","     *","     * If you have a use case which warrants migration to the _yuiaop property,","     * please file a ticket to let us know what it's used for and we can see if","     * we need to expose hooks for that functionality more formally.","     */","    objs: null,","","    /**","     * <p>Execute the supplied method before the specified function.  Wrapping","     * function may optionally return an instance of the following classes to","     * further alter runtime behavior:</p>","     * <dl>","     *     <dt></code>Y.Do.Halt(message, returnValue)</code></dt>","     *         <dd>Immediatly stop execution and return","     *         <code>returnValue</code>.  No other wrapping functions will be","     *         executed.</dd>","     *     <dt></code>Y.Do.AlterArgs(message, newArgArray)</code></dt>","     *         <dd>Replace the arguments that the original function will be","     *         called with.</dd>","     *     <dt></code>Y.Do.Prevent(message)</code></dt>","     *         <dd>Don't execute the wrapped function.  Other before phase","     *         wrappers will be executed.</dd>","     * </dl>","     *","     * @method before","     * @param fn {Function} the function to execute","     * @param obj the object hosting the method to displace","     * @param sFn {string} the name of the method to displace","     * @param c The execution context for fn","     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber","     * when the event fires.","     * @return {string} handle for the subscription","     * @static","     */","    before: function(fn, obj, sFn, c) {","        var f = fn, a;","        if (c) {","            a = [fn, c].concat(Y.Array(arguments, 4, true));","            f = Y.rbind.apply(Y, a);","        }","","        return this._inject(DO_BEFORE, f, obj, sFn);","    },","","    /**","     * <p>Execute the supplied method after the specified function.  Wrapping","     * function may optionally return an instance of the following classes to","     * further alter runtime behavior:</p>","     * <dl>","     *     <dt></code>Y.Do.Halt(message, returnValue)</code></dt>","     *         <dd>Immediatly stop execution and return","     *         <code>returnValue</code>.  No other wrapping functions will be","     *         executed.</dd>","     *     <dt></code>Y.Do.AlterReturn(message, returnValue)</code></dt>","     *         <dd>Return <code>returnValue</code> instead of the wrapped","     *         method's original return value.  This can be further altered by","     *         other after phase wrappers.</dd>","     * </dl>","     *","     * <p>The static properties <code>Y.Do.originalRetVal</code> and","     * <code>Y.Do.currentRetVal</code> will be populated for reference.</p>","     *","     * @method after","     * @param fn {Function} the function to execute","     * @param obj the object hosting the method to displace","     * @param sFn {string} the name of the method to displace","     * @param c The execution context for fn","     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber","     * @return {string} handle for the subscription","     * @static","     */","    after: function(fn, obj, sFn, c) {","        var f = fn, a;","        if (c) {","            a = [fn, c].concat(Y.Array(arguments, 4, true));","            f = Y.rbind.apply(Y, a);","        }","","        return this._inject(DO_AFTER, f, obj, sFn);","    },","","    /**","     * Execute the supplied method before or after the specified function.","     * Used by <code>before</code> and <code>after</code>.","     *","     * @method _inject","     * @param when {string} before or after","     * @param fn {Function} the function to execute","     * @param obj the object hosting the method to displace","     * @param sFn {string} the name of the method to displace","     * @param c The execution context for fn","     * @return {string} handle for the subscription","     * @private","     * @static","     */","    _inject: function(when, fn, obj, sFn) {","        // object id","        var id = Y.stamp(obj), o, sid;","","        if (!obj._yuiaop) {","            // create a map entry for the obj if it doesn't exist, to hold overridden methods","            obj._yuiaop = {};","        }","","        o = obj._yuiaop;","","        if (!o[sFn]) {","            // create a map entry for the method if it doesn't exist","            o[sFn] = new Y.Do.Method(obj, sFn);","","            // re-route the method to our wrapper","            obj[sFn] = function() {","                return o[sFn].exec.apply(o[sFn], arguments);","            };","        }","","        // subscriber id","        sid = id + Y.stamp(fn) + sFn;","","        // register the callback","        o[sFn].register(sid, fn, when);","","        return new Y.EventHandle(o[sFn], sid);","    },","","    /**","     * Detach a before or after subscription.","     *","     * @method detach","     * @param handle {string} the subscription handle","     * @static","     */","    detach: function(handle) {","        if (handle.detach) {","            handle.detach();","        }","    }","};","","Y.Do = DO;","","//////////////////////////////////////////////////////////////////////////","","/**"," * Contains the return value from the wrapped method, accessible"," * by 'after' event listeners."," *"," * @property originalRetVal"," * @static"," * @since 3.2.0"," */","","/**"," * Contains the current state of the return value, consumable by"," * 'after' event listeners, and updated if an after subscriber"," * changes the return value generated by the wrapped function."," *"," * @property currentRetVal"," * @static"," * @since 3.2.0"," */","","//////////////////////////////////////////////////////////////////////////","","/**"," * Wrapper for a displaced method with aop enabled"," * @class Do.Method"," * @constructor"," * @param obj The object to operate on"," * @param sFn The name of the method to displace"," */","DO.Method = function(obj, sFn) {","    this.obj = obj;","    this.methodName = sFn;","    this.method = obj[sFn];","    this.before = {};","    this.after = {};","};","","/**"," * Register a aop subscriber"," * @method register"," * @param sid {string} the subscriber id"," * @param fn {Function} the function to execute"," * @param when {string} when to execute the function"," */","DO.Method.prototype.register = function (sid, fn, when) {","    if (when) {","        this.after[sid] = fn;","    } else {","        this.before[sid] = fn;","    }","};","","/**"," * Unregister a aop subscriber"," * @method delete"," * @param sid {string} the subscriber id"," * @param fn {Function} the function to execute"," * @param when {string} when to execute the function"," */","DO.Method.prototype._delete = function (sid) {","    delete this.before[sid];","    delete this.after[sid];","};","","/**"," * <p>Execute the wrapped method.  All arguments are passed into the wrapping"," * functions.  If any of the before wrappers return an instance of"," * <code>Y.Do.Halt</code> or <code>Y.Do.Prevent</code>, neither the wrapped"," * function nor any after phase subscribers will be executed.</p>"," *"," * <p>The return value will be the return value of the wrapped function or one"," * provided by a wrapper function via an instance of <code>Y.Do.Halt</code> or"," * <code>Y.Do.AlterReturn</code>."," *"," * @method exec"," * @param arg* {any} Arguments are passed to the wrapping and wrapped functions"," * @return {any} Return value of wrapped function unless overwritten (see above)"," */","DO.Method.prototype.exec = function () {","","    var args = Y.Array(arguments, 0, true),","        i, ret, newRet,","        bf = this.before,","        af = this.after,","        prevented = false;","","    // execute before","    for (i in bf) {","        if (bf.hasOwnProperty(i)) {","            ret = bf[i].apply(this.obj, args);","            if (ret) {","                switch (ret.constructor) {","                    case DO.Halt:","                        return ret.retVal;","                    case DO.AlterArgs:","                        args = ret.newArgs;","                        break;","                    case DO.Prevent:","                        prevented = true;","                        break;","                    default:","                }","            }","        }","    }","","    // execute method","    if (!prevented) {","        ret = this.method.apply(this.obj, args);","    }","","    DO.originalRetVal = ret;","    DO.currentRetVal = ret;","","    // execute after methods.","    for (i in af) {","        if (af.hasOwnProperty(i)) {","            newRet = af[i].apply(this.obj, args);","            // Stop processing if a Halt object is returned","            if (newRet && newRet.constructor === DO.Halt) {","                return newRet.retVal;","            // Check for a new return value","            } else if (newRet && newRet.constructor === DO.AlterReturn) {","                ret = newRet.newRetVal;","                // Update the static retval state","                DO.currentRetVal = ret;","            }","        }","    }","","    return ret;","};","","//////////////////////////////////////////////////////////////////////////","","/**"," * Return an AlterArgs object when you want to change the arguments that"," * were passed into the function.  Useful for Do.before subscribers.  An"," * example would be a service that scrubs out illegal characters prior to"," * executing the core business logic."," * @class Do.AlterArgs"," * @constructor"," * @param msg {String} (optional) Explanation of the altered return value"," * @param newArgs {Array} Call parameters to be used for the original method"," *                        instead of the arguments originally passed in."," */","DO.AlterArgs = function(msg, newArgs) {","    this.msg = msg;","    this.newArgs = newArgs;","};","","/**"," * Return an AlterReturn object when you want to change the result returned"," * from the core method to the caller.  Useful for Do.after subscribers."," * @class Do.AlterReturn"," * @constructor"," * @param msg {String} (optional) Explanation of the altered return value"," * @param newRetVal {any} Return value passed to code that invoked the wrapped"," *                      function."," */","DO.AlterReturn = function(msg, newRetVal) {","    this.msg = msg;","    this.newRetVal = newRetVal;","};","","/**"," * Return a Halt object when you want to terminate the execution"," * of all subsequent subscribers as well as the wrapped method"," * if it has not exectued yet.  Useful for Do.before subscribers."," * @class Do.Halt"," * @constructor"," * @param msg {String} (optional) Explanation of why the termination was done"," * @param retVal {any} Return value passed to code that invoked the wrapped"," *                      function."," */","DO.Halt = function(msg, retVal) {","    this.msg = msg;","    this.retVal = retVal;","};","","/**"," * Return a Prevent object when you want to prevent the wrapped function"," * from executing, but want the remaining listeners to execute.  Useful"," * for Do.before subscribers."," * @class Do.Prevent"," * @constructor"," * @param msg {String} (optional) Explanation of why the termination was done"," */","DO.Prevent = function(msg) {","    this.msg = msg;","};","","/**"," * Return an Error object when you want to terminate the execution"," * of all subsequent method calls."," * @class Do.Error"," * @constructor"," * @param msg {String} (optional) Explanation of the altered return value"," * @param retVal {any} Return value passed to code that invoked the wrapped"," *                      function."," * @deprecated use Y.Do.Halt or Y.Do.Prevent"," */","DO.Error = DO.Halt;","","","//////////////////////////////////////////////////////////////////////////","","/**"," * Custom event engine, DOM event listener abstraction layer, synthetic DOM"," * events."," * @module event-custom"," * @submodule event-custom-base"," */","","","// var onsubscribeType = \"_event:onsub\",","var YArray = Y.Array,","","    AFTER = 'after',","    CONFIGS = [","        'broadcast',","        'monitored',","        'bubbles',","        'context',","        'contextFn',","        'currentTarget',","        'defaultFn',","        'defaultTargetOnly',","        'details',","        'emitFacade',","        'fireOnce',","        'async',","        'host',","        'preventable',","        'preventedFn',","        'queuable',","        'silent',","        'stoppedFn',","        'target',","        'type'","    ],","","    CONFIGS_HASH = YArray.hash(CONFIGS),","","    nativeSlice = Array.prototype.slice,","","    YUI3_SIGNATURE = 9,","    YUI_LOG = 'yui:log',","","    mixConfigs = function(r, s, ov) {","        var p;","","        for (p in s) {","            if (CONFIGS_HASH[p] && (ov || !(p in r))) {","                r[p] = s[p];","            }","        }","","        return r;","    };","","/**"," * The CustomEvent class lets you define events for your application"," * that can be subscribed to by one or more independent component."," *"," * @param {String} type The type of event, which is passed to the callback"," * when the event fires."," * @param {object} defaults configuration object."," * @class CustomEvent"," * @constructor"," */",""," /**"," * The type of event, returned to subscribers when the event fires"," * @property type"," * @type string"," */","","/**"," * By default all custom events are logged in the debug build, set silent"," * to true to disable debug outpu for this event."," * @property silent"," * @type boolean"," */","","Y.CustomEvent = function(type, defaults) {","","    this._kds = Y.CustomEvent.keepDeprecatedSubs;","","    this.id = Y.guid();","","    this.type = type;","    this.silent = this.logSystem = (type === YUI_LOG);","","    if (this._kds) {","        /**","         * The subscribers to this event","         * @property subscribers","         * @type Subscriber {}","         * @deprecated","         */","","        /**","         * 'After' subscribers","         * @property afters","         * @type Subscriber {}","         * @deprecated","         */","        this.subscribers = {};","        this.afters = {};","    }","","    if (defaults) {","        mixConfigs(this, defaults, true);","    }","};","","/**"," * Static flag to enable population of the <a href=\"#property_subscribers\">`subscribers`</a>"," * and  <a href=\"#property_subscribers\">`afters`</a> properties held on a `CustomEvent` instance."," *"," * These properties were changed to private properties (`_subscribers` and `_afters`), and"," * converted from objects to arrays for performance reasons."," *"," * Setting this property to true will populate the deprecated `subscribers` and `afters`"," * properties for people who may be using them (which is expected to be rare). There will"," * be a performance hit, compared to the new array based implementation."," *"," * If you are using these deprecated properties for a use case which the public API"," * does not support, please file an enhancement request, and we can provide an alternate"," * public implementation which doesn't have the performance cost required to maintiain the"," * properties as objects."," *"," * @property keepDeprecatedSubs"," * @static"," * @for CustomEvent"," * @type boolean"," * @default false"," * @deprecated"," */","Y.CustomEvent.keepDeprecatedSubs = false;","","Y.CustomEvent.mixConfigs = mixConfigs;","","Y.CustomEvent.prototype = {","","    constructor: Y.CustomEvent,","","    /**","     * Monitor when an event is attached or detached.","     *","     * @property monitored","     * @type boolean","     */","","    /**","     * If 0, this event does not broadcast.  If 1, the YUI instance is notified","     * every time this event fires.  If 2, the YUI instance and the YUI global","     * (if event is enabled on the global) are notified every time this event","     * fires.","     * @property broadcast","     * @type int","     */","","    /**","     * Specifies whether this event should be queued when the host is actively","     * processing an event.  This will effect exectution order of the callbacks","     * for the various events.","     * @property queuable","     * @type boolean","     * @default false","     */","","    /**","     * This event has fired if true","     *","     * @property fired","     * @type boolean","     * @default false;","     */","","    /**","     * An array containing the arguments the custom event","     * was last fired with.","     * @property firedWith","     * @type Array","     */","","    /**","     * This event should only fire one time if true, and if","     * it has fired, any new subscribers should be notified","     * immediately.","     *","     * @property fireOnce","     * @type boolean","     * @default false;","     */","","    /**","     * fireOnce listeners will fire syncronously unless async","     * is set to true","     * @property async","     * @type boolean","     * @default false","     */","","    /**","     * Flag for stopPropagation that is modified during fire()","     * 1 means to stop propagation to bubble targets.  2 means","     * to also stop additional subscribers on this target.","     * @property stopped","     * @type int","     */","","    /**","     * Flag for preventDefault that is modified during fire().","     * if it is not 0, the default behavior for this event","     * @property prevented","     * @type int","     */","","    /**","     * Specifies the host for this custom event.  This is used","     * to enable event bubbling","     * @property host","     * @type EventTarget","     */","","    /**","     * The default function to execute after event listeners","     * have fire, but only if the default action was not","     * prevented.","     * @property defaultFn","     * @type Function","     */","","    /**","     * The function to execute if a subscriber calls","     * stopPropagation or stopImmediatePropagation","     * @property stoppedFn","     * @type Function","     */","","    /**","     * The function to execute if a subscriber calls","     * preventDefault","     * @property preventedFn","     * @type Function","     */","","    /**","     * The subscribers to this event","     * @property _subscribers","     * @type Subscriber []","     * @private","     */","","    /**","     * 'After' subscribers","     * @property _afters","     * @type Subscriber []","     * @private","     */","","    /**","     * If set to true, the custom event will deliver an EventFacade object","     * that is similar to a DOM event object.","     * @property emitFacade","     * @type boolean","     * @default false","     */","","    /**","     * Supports multiple options for listener signatures in order to","     * port YUI 2 apps.","     * @property signature","     * @type int","     * @default 9","     */","    signature : YUI3_SIGNATURE,","","    /**","     * The context the the event will fire from by default.  Defaults to the YUI","     * instance.","     * @property context","     * @type object","     */","    context : Y,","","    /**","     * Specifies whether or not this event's default function","     * can be cancelled by a subscriber by executing preventDefault()","     * on the event facade","     * @property preventable","     * @type boolean","     * @default true","     */","    preventable : true,","","    /**","     * Specifies whether or not a subscriber can stop the event propagation","     * via stopPropagation(), stopImmediatePropagation(), or halt()","     *","     * Events can only bubble if emitFacade is true.","     *","     * @property bubbles","     * @type boolean","     * @default true","     */","    bubbles : true,","","    /**","     * Returns the number of subscribers for this event as the sum of the on()","     * subscribers and after() subscribers.","     *","     * @method hasSubs","     * @return Number","     */","    hasSubs: function(when) {","        var s = 0,","            a = 0,","            subs = this._subscribers,","            afters = this._afters,","            sib = this.sibling;","","        if (subs) {","            s = subs.length;","        }","","        if (afters) {","            a = afters.length;","        }","","        if (sib) {","            subs = sib._subscribers;","            afters = sib._afters;","","            if (subs) {","                s += subs.length;","            }","","            if (afters) {","                a += afters.length;","            }","        }","","        if (when) {","            return (when === 'after') ? a : s;","        }","","        return (s + a);","    },","","    /**","     * Monitor the event state for the subscribed event.  The first parameter","     * is what should be monitored, the rest are the normal parameters when","     * subscribing to an event.","     * @method monitor","     * @param what {string} what to monitor ('detach', 'attach', 'publish').","     * @return {EventHandle} return value from the monitor event subscription.","     */","    monitor: function(what) {","        this.monitored = true;","        var type = this.id + '|' + this.type + '_' + what,","            args = nativeSlice.call(arguments, 0);","        args[0] = type;","        return this.host.on.apply(this.host, args);","    },","","    /**","     * Get all of the subscribers to this event and any sibling event","     * @method getSubs","     * @return {Array} first item is the on subscribers, second the after.","     */","    getSubs: function() {","","        var sibling = this.sibling,","            subs = this._subscribers,","            afters = this._afters,","            siblingSubs,","            siblingAfters;","","        if (sibling) {","            siblingSubs = sibling._subscribers;","            siblingAfters = sibling._afters;","        }","","        if (siblingSubs) {","            if (subs) {","                subs = subs.concat(siblingSubs);","            } else {","                subs = siblingSubs.concat();","            }","        } else {","            if (subs) {","                subs = subs.concat();","            } else {","                subs = [];","            }","        }","","        if (siblingAfters) {","            if (afters) {","                afters = afters.concat(siblingAfters);","            } else {","                afters = siblingAfters.concat();","            }","        } else {","            if (afters) {","                afters = afters.concat();","            } else {","                afters = [];","            }","        }","","        return [subs, afters];","    },","","    /**","     * Apply configuration properties.  Only applies the CONFIG whitelist","     * @method applyConfig","     * @param o hash of properties to apply.","     * @param force {boolean} if true, properties that exist on the event","     * will be overwritten.","     */","    applyConfig: function(o, force) {","        mixConfigs(this, o, force);","    },","","    /**","     * Create the Subscription for subscribing function, context, and bound","     * arguments.  If this is a fireOnce event, the subscriber is immediately","     * notified.","     *","     * @method _on","     * @param fn {Function} Subscription callback","     * @param [context] {Object} Override `this` in the callback","     * @param [args] {Array} bound arguments that will be passed to the callback after the arguments generated by fire()","     * @param [when] {String} \"after\" to slot into after subscribers","     * @return {EventHandle}","     * @protected","     */","    _on: function(fn, context, args, when) {","","","        var s = new Y.Subscriber(fn, context, args, when),","            firedWith;","","        if (this.fireOnce && this.fired) {","","            firedWith = this.firedWith;","","            // It's a little ugly for this to know about facades,","            // but given the current breakup, not much choice without","            // moving a whole lot of stuff around.","            if (this.emitFacade && this._addFacadeToArgs) {","                this._addFacadeToArgs(firedWith);","            }","","            if (this.async) {","                setTimeout(Y.bind(this._notify, this, s, firedWith), 0);","            } else {","                this._notify(s, firedWith);","            }","        }","","        if (when === AFTER) {","            if (!this._afters) {","                this._afters = [];","            }","            this._afters.push(s);","        } else {","            if (!this._subscribers) {","                this._subscribers = [];","            }","            this._subscribers.push(s);","        }","","        if (this._kds) {","            if (when === AFTER) {","                this.afters[s.id] = s;","            } else {","                this.subscribers[s.id] = s;","            }","        }","","        return new Y.EventHandle(this, s);","    },","","    /**","     * Listen for this event","     * @method subscribe","     * @param {Function} fn The function to execute.","     * @return {EventHandle} Unsubscribe handle.","     * @deprecated use on.","     */","    subscribe: function(fn, context) {","        var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;","        return this._on(fn, context, a, true);","    },","","    /**","     * Listen for this event","     * @method on","     * @param {Function} fn The function to execute.","     * @param {object} context optional execution context.","     * @param {mixed} arg* 0..n additional arguments to supply to the subscriber","     * when the event fires.","     * @return {EventHandle} An object with a detach method to detch the handler(s).","     */","    on: function(fn, context) {","        var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;","","        if (this.monitored && this.host) {","            this.host._monitor('attach', this, {","                args: arguments","            });","        }","        return this._on(fn, context, a, true);","    },","","    /**","     * Listen for this event after the normal subscribers have been notified and","     * the default behavior has been applied.  If a normal subscriber prevents the","     * default behavior, it also prevents after listeners from firing.","     * @method after","     * @param {Function} fn The function to execute.","     * @param {object} context optional execution context.","     * @param {mixed} arg* 0..n additional arguments to supply to the subscriber","     * when the event fires.","     * @return {EventHandle} handle Unsubscribe handle.","     */","    after: function(fn, context) {","        var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;","        return this._on(fn, context, a, AFTER);","    },","","    /**","     * Detach listeners.","     * @method detach","     * @param {Function} fn  The subscribed function to remove, if not supplied","     *                       all will be removed.","     * @param {Object}   context The context object passed to subscribe.","     * @return {int} returns the number of subscribers unsubscribed.","     */","    detach: function(fn, context) {","        // unsubscribe handle","        if (fn && fn.detach) {","            return fn.detach();","        }","","        var i, s,","            found = 0,","            subs = this._subscribers,","            afters = this._afters;","","        if (subs) {","            for (i = subs.length; i >= 0; i--) {","                s = subs[i];","                if (s && (!fn || fn === s.fn)) {","                    this._delete(s, subs, i);","                    found++;","                }","            }","        }","","        if (afters) {","            for (i = afters.length; i >= 0; i--) {","                s = afters[i];","                if (s && (!fn || fn === s.fn)) {","                    this._delete(s, afters, i);","                    found++;","                }","            }","        }","","        return found;","    },","","    /**","     * Detach listeners.","     * @method unsubscribe","     * @param {Function} fn  The subscribed function to remove, if not supplied","     *                       all will be removed.","     * @param {Object}   context The context object passed to subscribe.","     * @return {int|undefined} returns the number of subscribers unsubscribed.","     * @deprecated use detach.","     */","    unsubscribe: function() {","        return this.detach.apply(this, arguments);","    },","","    /**","     * Notify a single subscriber","     * @method _notify","     * @param {Subscriber} s the subscriber.","     * @param {Array} args the arguments array to apply to the listener.","     * @protected","     */","    _notify: function(s, args, ef) {","","","        var ret;","","        ret = s.notify(args, this);","","        if (false === ret || this.stopped > 1) {","            return false;","        }","","        return true;","    },","","    /**","     * Logger abstraction to centralize the application of the silent flag","     * @method log","     * @param {string} msg message to log.","     * @param {string} cat log category.","     */","    log: function(msg, cat) {","    },","","    /**","     * Notifies the subscribers.  The callback functions will be executed","     * from the context specified when the event was created, and with the","     * following parameters:","     *   <ul>","     *   <li>The type of event</li>","     *   <li>All of the arguments fire() was executed with as an array</li>","     *   <li>The custom object (if any) that was passed into the subscribe()","     *       method</li>","     *   </ul>","     * @method fire","     * @param {Object*} arguments an arbitrary set of parameters to pass to","     *                            the handler.","     * @return {boolean} false if one of the subscribers returned false,","     *                   true otherwise.","     *","     */","    fire: function() {","","        // push is the fastest way to go from arguments to arrays","        // for most browsers currently","        // http://jsperf.com/push-vs-concat-vs-slice/2","","        var args = [];","        args.push.apply(args, arguments);","","        return this._fire(args);","    },","","    /**","     * Private internal implementation for `fire`, which is can be used directly by","     * `EventTarget` and other event module classes which have already converted from","     * an `arguments` list to an array, to avoid the repeated overhead.","     *","     * @method _fire","     * @private","     * @param {Array} args The array of arguments passed to be passed to handlers.","     * @return {boolean} false if one of the subscribers returned false, true otherwise.","     */","    _fire: function(args) {","","        if (this.fireOnce && this.fired) {","            return true;","        } else {","","            // this doesn't happen if the event isn't published","            // this.host._monitor('fire', this.type, args);","","            this.fired = true;","","            if (this.fireOnce) {","                this.firedWith = args;","            }","","            if (this.emitFacade) {","                return this.fireComplex(args);","            } else {","                return this.fireSimple(args);","            }","        }","    },","","    /**","     * Set up for notifying subscribers of non-emitFacade events.","     *","     * @method fireSimple","     * @param args {Array} Arguments passed to fire()","     * @return Boolean false if a subscriber returned false","     * @protected","     */","    fireSimple: function(args) {","        this.stopped = 0;","        this.prevented = 0;","        if (this.hasSubs()) {","            var subs = this.getSubs();","            this._procSubs(subs[0], args);","            this._procSubs(subs[1], args);","        }","        if (this.broadcast) {","            this._broadcast(args);","        }","        return this.stopped ? false : true;","    },","","    // Requires the event-custom-complex module for full funcitonality.","    fireComplex: function(args) {","        args[0] = args[0] || {};","        return this.fireSimple(args);","    },","","    /**","     * Notifies a list of subscribers.","     *","     * @method _procSubs","     * @param subs {Array} List of subscribers","     * @param args {Array} Arguments passed to fire()","     * @param ef {}","     * @return Boolean false if a subscriber returns false or stops the event","     *              propagation via e.stopPropagation(),","     *              e.stopImmediatePropagation(), or e.halt()","     * @private","     */","    _procSubs: function(subs, args, ef) {","        var s, i, l;","","        for (i = 0, l = subs.length; i < l; i++) {","            s = subs[i];","            if (s && s.fn) {","                if (false === this._notify(s, args, ef)) {","                    this.stopped = 2;","                }","                if (this.stopped === 2) {","                    return false;","                }","            }","        }","","        return true;","    },","","    /**","     * Notifies the YUI instance if the event is configured with broadcast = 1,","     * and both the YUI instance and Y.Global if configured with broadcast = 2.","     *","     * @method _broadcast","     * @param args {Array} Arguments sent to fire()","     * @private","     */","    _broadcast: function(args) {","        if (!this.stopped && this.broadcast) {","","            var a = args.concat();","            a.unshift(this.type);","","            if (this.host !== Y) {","                Y.fire.apply(Y, a);","            }","","            if (this.broadcast === 2) {","                Y.Global.fire.apply(Y.Global, a);","            }","        }","    },","","    /**","     * Removes all listeners","     * @method unsubscribeAll","     * @return {int} The number of listeners unsubscribed.","     * @deprecated use detachAll.","     */","    unsubscribeAll: function() {","        return this.detachAll.apply(this, arguments);","    },","","    /**","     * Removes all listeners","     * @method detachAll","     * @return {int} The number of listeners unsubscribed.","     */","    detachAll: function() {","        return this.detach();","    },","","    /**","     * Deletes the subscriber from the internal store of on() and after()","     * subscribers.","     *","     * @method _delete","     * @param s subscriber object.","     * @param subs (optional) on or after subscriber array","     * @param index (optional) The index found.","     * @private","     */","    _delete: function(s, subs, i) {","        var when = s._when;","","        if (!subs) {","            subs = (when === AFTER) ? this._afters : this._subscribers;","        }","","        if (subs) {","            i = YArray.indexOf(subs, s, 0);","","            if (s && subs[i] === s) {","                subs.splice(i, 1);","            }","        }","","        if (this._kds) {","            if (when === AFTER) {","                delete this.afters[s.id];","            } else {","                delete this.subscribers[s.id];","            }","        }","","        if (this.monitored && this.host) {","            this.host._monitor('detach', this, {","                ce: this,","                sub: s","            });","        }","","        if (s) {","            s.deleted = true;","        }","    }","};","/**"," * Stores the subscriber information to be used when the event fires."," * @param {Function} fn       The wrapped function to execute."," * @param {Object}   context  The value of the keyword 'this' in the listener."," * @param {Array} args*       0..n additional arguments to supply the listener."," *"," * @class Subscriber"," * @constructor"," */","Y.Subscriber = function(fn, context, args, when) {","","    /**","     * The callback that will be execute when the event fires","     * This is wrapped by Y.rbind if obj was supplied.","     * @property fn","     * @type Function","     */","    this.fn = fn;","","    /**","     * Optional 'this' keyword for the listener","     * @property context","     * @type Object","     */","    this.context = context;","","    /**","     * Unique subscriber id","     * @property id","     * @type String","     */","    this.id = Y.guid();","","    /**","     * Additional arguments to propagate to the subscriber","     * @property args","     * @type Array","     */","    this.args = args;","","    this._when = when;","","    /**","     * Custom events for a given fire transaction.","     * @property events","     * @type {EventTarget}","     */","    // this.events = null;","","    /**","     * This listener only reacts to the event once","     * @property once","     */","    // this.once = false;","","};","","Y.Subscriber.prototype = {","    constructor: Y.Subscriber,","","    _notify: function(c, args, ce) {","        if (this.deleted && !this.postponed) {","            if (this.postponed) {","                delete this.fn;","                delete this.context;","            } else {","                delete this.postponed;","                return null;","            }","        }","        var a = this.args, ret;","        switch (ce.signature) {","            case 0:","                ret = this.fn.call(c, ce.type, args, c);","                break;","            case 1:","                ret = this.fn.call(c, args[0] || null, c);","                break;","            default:","                if (a || args) {","                    args = args || [];","                    a = (a) ? args.concat(a) : args;","                    ret = this.fn.apply(c, a);","                } else {","                    ret = this.fn.call(c);","                }","        }","","        if (this.once) {","            ce._delete(this);","        }","","        return ret;","    },","","    /**","     * Executes the subscriber.","     * @method notify","     * @param args {Array} Arguments array for the subscriber.","     * @param ce {CustomEvent} The custom event that sent the notification.","     */","    notify: function(args, ce) {","        var c = this.context,","            ret = true;","","        if (!c) {","            c = (ce.contextFn) ? ce.contextFn() : ce.context;","        }","","        // only catch errors if we will not re-throw them.","        if (Y.config && Y.config.throwFail) {","            ret = this._notify(c, args, ce);","        } else {","            try {","                ret = this._notify(c, args, ce);","            } catch (e) {","                Y.error(this + ' failed: ' + e.message, e);","            }","        }","","        return ret;","    },","","    /**","     * Returns true if the fn and obj match this objects properties.","     * Used by the unsubscribe method to match the right subscriber.","     *","     * @method contains","     * @param {Function} fn the function to execute.","     * @param {Object} context optional 'this' keyword for the listener.","     * @return {boolean} true if the supplied arguments match this","     *                   subscriber's signature.","     */","    contains: function(fn, context) {","        if (context) {","            return ((this.fn === fn) && this.context === context);","        } else {","            return (this.fn === fn);","        }","    },","","    valueOf : function() {","        return this.id;","    }","","};","/**"," * Return value from all subscribe operations"," * @class EventHandle"," * @constructor"," * @param {CustomEvent} evt the custom event."," * @param {Subscriber} sub the subscriber."," */","Y.EventHandle = function(evt, sub) {","","    /**","     * The custom event","     *","     * @property evt","     * @type CustomEvent","     */","    this.evt = evt;","","    /**","     * The subscriber object","     *","     * @property sub","     * @type Subscriber","     */","    this.sub = sub;","};","","Y.EventHandle.prototype = {","    batch: function(f, c) {","        f.call(c || this, this);","        if (Y.Lang.isArray(this.evt)) {","            Y.Array.each(this.evt, function(h) {","                h.batch.call(c || h, f);","            });","        }","    },","","    /**","     * Detaches this subscriber","     * @method detach","     * @return {int} the number of detached listeners","     */","    detach: function() {","        var evt = this.evt, detached = 0, i;","        if (evt) {","            if (Y.Lang.isArray(evt)) {","                for (i = 0; i < evt.length; i++) {","                    detached += evt[i].detach();","                }","            } else {","                evt._delete(this.sub);","                detached = 1;","            }","","        }","","        return detached;","    },","","    /**","     * Monitor the event state for the subscribed event.  The first parameter","     * is what should be monitored, the rest are the normal parameters when","     * subscribing to an event.","     * @method monitor","     * @param what {string} what to monitor ('attach', 'detach', 'publish').","     * @return {EventHandle} return value from the monitor event subscription.","     */","    monitor: function(what) {","        return this.evt.monitor.apply(this.evt, arguments);","    }","};","","/**"," * Custom event engine, DOM event listener abstraction layer, synthetic DOM"," * events."," * @module event-custom"," * @submodule event-custom-base"," */","","/**"," * EventTarget provides the implementation for any object to"," * publish, subscribe and fire to custom events, and also"," * alows other EventTargets to target the object with events"," * sourced from the other object."," * EventTarget is designed to be used with Y.augment to wrap"," * EventCustom in an interface that allows events to be listened to"," * and fired by name.  This makes it possible for implementing code to"," * subscribe to an event that either has not been created yet, or will"," * not be created at all."," * @class EventTarget"," * @param opts a configuration object"," * @config emitFacade {boolean} if true, all events will emit event"," * facade payloads by default (default false)"," * @config prefix {String} the prefix to apply to non-prefixed event names"," */","","var L = Y.Lang,","    PREFIX_DELIMITER = ':',","    CATEGORY_DELIMITER = '|',","    AFTER_PREFIX = '~AFTER~',","    WILD_TYPE_RE = /(.*?)(:)(.*?)/,","","    _wildType = Y.cached(function(type) {","        return type.replace(WILD_TYPE_RE, \"*$2$3\");","    }),","","    /**","     * If the instance has a prefix attribute and the","     * event type is not prefixed, the instance prefix is","     * applied to the supplied type.","     * @method _getType","     * @private","     */","    _getType = function(type, pre) {","","        if (!pre || (typeof type !== \"string\") || type.indexOf(PREFIX_DELIMITER) > -1) {","            return type;","        }","","        return pre + PREFIX_DELIMITER + type;","    },","","    /**","     * Returns an array with the detach key (if provided),","     * and the prefixed event name from _getType","     * Y.on('detachcategory| menu:click', fn)","     * @method _parseType","     * @private","     */","    _parseType = Y.cached(function(type, pre) {","","        var t = type, detachcategory, after, i;","","        if (!L.isString(t)) {","            return t;","        }","","        i = t.indexOf(AFTER_PREFIX);","","        if (i > -1) {","            after = true;","            t = t.substr(AFTER_PREFIX.length);","        }","","        i = t.indexOf(CATEGORY_DELIMITER);","","        if (i > -1) {","            detachcategory = t.substr(0, (i));","            t = t.substr(i+1);","            if (t === '*') {","                t = null;","            }","        }","","        // detach category, full type with instance prefix, is this an after listener, short type","        return [detachcategory, (pre) ? _getType(t, pre) : t, after, t];","    }),","","    ET = function(opts) {","","        var etState = this._yuievt,","            etConfig;","","        if (!etState) {","            etState = this._yuievt = {","                events: {},    // PERF: Not much point instantiating lazily. We're bound to have events","                targets: null, // PERF: Instantiate lazily, if user actually adds target,","                config: {","                    host: this,","                    context: this","                },","                chain: Y.config.chain","            };","        }","","        etConfig = etState.config;","","        if (opts) {","            mixConfigs(etConfig, opts, true);","","            if (opts.chain !== undefined) {","                etState.chain = opts.chain;","            }","","            if (opts.prefix) {","                etConfig.prefix = opts.prefix;","            }","        }","    };","","ET.prototype = {","","    constructor: ET,","","    /**","     * Listen to a custom event hosted by this object one time.","     * This is the equivalent to <code>on</code> except the","     * listener is immediatelly detached when it is executed.","     * @method once","     * @param {String} type The name of the event","     * @param {Function} fn The callback to execute in response to the event","     * @param {Object} [context] Override `this` object in callback","     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber","     * @return {EventHandle} A subscription handle capable of detaching the","     *                       subscription","     */","    once: function() {","        var handle = this.on.apply(this, arguments);","        handle.batch(function(hand) {","            if (hand.sub) {","                hand.sub.once = true;","            }","        });","        return handle;","    },","","    /**","     * Listen to a custom event hosted by this object one time.","     * This is the equivalent to <code>after</code> except the","     * listener is immediatelly detached when it is executed.","     * @method onceAfter","     * @param {String} type The name of the event","     * @param {Function} fn The callback to execute in response to the event","     * @param {Object} [context] Override `this` object in callback","     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber","     * @return {EventHandle} A subscription handle capable of detaching that","     *                       subscription","     */","    onceAfter: function() {","        var handle = this.after.apply(this, arguments);","        handle.batch(function(hand) {","            if (hand.sub) {","                hand.sub.once = true;","            }","        });","        return handle;","    },","","    /**","     * Takes the type parameter passed to 'on' and parses out the","     * various pieces that could be included in the type.  If the","     * event type is passed without a prefix, it will be expanded","     * to include the prefix one is supplied or the event target","     * is configured with a default prefix.","     * @method parseType","     * @param {String} type the type","     * @param {String} [pre=this._yuievt.config.prefix] the prefix","     * @since 3.3.0","     * @return {Array} an array containing:","     *  * the detach category, if supplied,","     *  * the prefixed event type,","     *  * whether or not this is an after listener,","     *  * the supplied event type","     */","    parseType: function(type, pre) {","        return _parseType(type, pre || this._yuievt.config.prefix);","    },","","    /**","     * Subscribe a callback function to a custom event fired by this object or","     * from an object that bubbles its events to this object.","     *","     * Callback functions for events published with `emitFacade = true` will","     * receive an `EventFacade` as the first argument (typically named \"e\").","     * These callbacks can then call `e.preventDefault()` to disable the","     * behavior published to that event's `defaultFn`.  See the `EventFacade`","     * API for all available properties and methods. Subscribers to","     * non-`emitFacade` events will receive the arguments passed to `fire()`","     * after the event name.","     *","     * To subscribe to multiple events at once, pass an object as the first","     * argument, where the key:value pairs correspond to the eventName:callback,","     * or pass an array of event names as the first argument to subscribe to","     * all listed events with the same callback.","     *","     * Returning `false` from a callback is supported as an alternative to","     * calling `e.preventDefault(); e.stopPropagation();`.  However, it is","     * recommended to use the event methods whenever possible.","     *","     * @method on","     * @param {String} type The name of the event","     * @param {Function} fn The callback to execute in response to the event","     * @param {Object} [context] Override `this` object in callback","     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber","     * @return {EventHandle} A subscription handle capable of detaching that","     *                       subscription","     */","    on: function(type, fn, context) {","","        var yuievt = this._yuievt,","            parts = _parseType(type, yuievt.config.prefix), f, c, args, ret, ce,","            detachcategory, handle, store = Y.Env.evt.handles, after, adapt, shorttype,","            Node = Y.Node, n, domevent, isArr;","","        // full name, args, detachcategory, after","        this._monitor('attach', parts[1], {","            args: arguments,","            category: parts[0],","            after: parts[2]","        });","","        if (L.isObject(type)) {","","            if (L.isFunction(type)) {","                return Y.Do.before.apply(Y.Do, arguments);","            }","","            f = fn;","            c = context;","            args = nativeSlice.call(arguments, 0);","            ret = [];","","            if (L.isArray(type)) {","                isArr = true;","            }","","            after = type._after;","            delete type._after;","","            Y.each(type, function(v, k) {","","                if (L.isObject(v)) {","                    f = v.fn || ((L.isFunction(v)) ? v : f);","                    c = v.context || c;","                }","","                var nv = (after) ? AFTER_PREFIX : '';","","                args[0] = nv + ((isArr) ? v : k);","                args[1] = f;","                args[2] = c;","","                ret.push(this.on.apply(this, args));","","            }, this);","","            return (yuievt.chain) ? this : new Y.EventHandle(ret);","        }","","        detachcategory = parts[0];","        after = parts[2];","        shorttype = parts[3];","","        // extra redirection so we catch adaptor events too.  take a look at this.","        if (Node && Y.instanceOf(this, Node) && (shorttype in Node.DOM_EVENTS)) {","            args = nativeSlice.call(arguments, 0);","            args.splice(2, 0, Node.getDOMNode(this));","            return Y.on.apply(Y, args);","        }","","        type = parts[1];","","        if (Y.instanceOf(this, YUI)) {","","            adapt = Y.Env.evt.plugins[type];","            args  = nativeSlice.call(arguments, 0);","            args[0] = shorttype;","","            if (Node) {","                n = args[2];","","                if (Y.instanceOf(n, Y.NodeList)) {","                    n = Y.NodeList.getDOMNodes(n);","                } else if (Y.instanceOf(n, Node)) {","                    n = Node.getDOMNode(n);","                }","","                domevent = (shorttype in Node.DOM_EVENTS);","","                // Captures both DOM events and event plugins.","                if (domevent) {","                    args[2] = n;","                }","            }","","            // check for the existance of an event adaptor","            if (adapt) {","                handle = adapt.on.apply(Y, args);","            } else if ((!type) || domevent) {","                handle = Y.Event._attach(args);","            }","","        }","","        if (!handle) {","            ce = yuievt.events[type] || this.publish(type);","            handle = ce._on(fn, context, (arguments.length > 3) ? nativeSlice.call(arguments, 3) : null, (after) ? 'after' : true);","","            // TODO: More robust regex, accounting for category","            if (type.indexOf(\"*:\") !== -1) {","                this._hasSiblings = true;","            }","        }","","        if (detachcategory) {","            store[detachcategory] = store[detachcategory] || {};","            store[detachcategory][type] = store[detachcategory][type] || [];","            store[detachcategory][type].push(handle);","        }","","        return (yuievt.chain) ? this : handle;","","    },","","    /**","     * subscribe to an event","     * @method subscribe","     * @deprecated use on","     */","    subscribe: function() {","        return this.on.apply(this, arguments);","    },","","    /**","     * Detach one or more listeners the from the specified event","     * @method detach","     * @param type {string|Object}   Either the handle to the subscriber or the","     *                        type of event.  If the type","     *                        is not specified, it will attempt to remove","     *                        the listener from all hosted events.","     * @param fn   {Function} The subscribed function to unsubscribe, if not","     *                          supplied, all subscribers will be removed.","     * @param context  {Object}   The custom object passed to subscribe.  This is","     *                        optional, but if supplied will be used to","     *                        disambiguate multiple listeners that are the same","     *                        (e.g., you subscribe many object using a function","     *                        that lives on the prototype)","     * @return {EventTarget} the host","     */","    detach: function(type, fn, context) {","","        var evts = this._yuievt.events,","            i,","            Node = Y.Node,","            isNode = Node && (Y.instanceOf(this, Node));","","        // detachAll disabled on the Y instance.","        if (!type && (this !== Y)) {","            for (i in evts) {","                if (evts.hasOwnProperty(i)) {","                    evts[i].detach(fn, context);","                }","            }","            if (isNode) {","                Y.Event.purgeElement(Node.getDOMNode(this));","            }","","            return this;","        }","","        var parts = _parseType(type, this._yuievt.config.prefix),","        detachcategory = L.isArray(parts) ? parts[0] : null,","        shorttype = (parts) ? parts[3] : null,","        adapt, store = Y.Env.evt.handles, detachhost, cat, args,","        ce,","","        keyDetacher = function(lcat, ltype, host) {","            var handles = lcat[ltype], ce, i;","            if (handles) {","                for (i = handles.length - 1; i >= 0; --i) {","                    ce = handles[i].evt;","                    if (ce.host === host || ce.el === host) {","                        handles[i].detach();","                    }","                }","            }","        };","","        if (detachcategory) {","","            cat = store[detachcategory];","            type = parts[1];","            detachhost = (isNode) ? Y.Node.getDOMNode(this) : this;","","            if (cat) {","                if (type) {","                    keyDetacher(cat, type, detachhost);","                } else {","                    for (i in cat) {","                        if (cat.hasOwnProperty(i)) {","                            keyDetacher(cat, i, detachhost);","                        }","                    }","                }","","                return this;","            }","","        // If this is an event handle, use it to detach","        } else if (L.isObject(type) && type.detach) {","            type.detach();","            return this;","        // extra redirection so we catch adaptor events too.  take a look at this.","        } else if (isNode && ((!shorttype) || (shorttype in Node.DOM_EVENTS))) {","            args = nativeSlice.call(arguments, 0);","            args[2] = Node.getDOMNode(this);","            Y.detach.apply(Y, args);","            return this;","        }","","        adapt = Y.Env.evt.plugins[shorttype];","","        // The YUI instance handles DOM events and adaptors","        if (Y.instanceOf(this, YUI)) {","            args = nativeSlice.call(arguments, 0);","            // use the adaptor specific detach code if","            if (adapt && adapt.detach) {","                adapt.detach.apply(Y, args);","                return this;","            // DOM event fork","            } else if (!type || (!adapt && Node && (type in Node.DOM_EVENTS))) {","                args[0] = type;","                Y.Event.detach.apply(Y.Event, args);","                return this;","            }","        }","","        // ce = evts[type];","        ce = evts[parts[1]];","        if (ce) {","            ce.detach(fn, context);","        }","","        return this;","    },","","    /**","     * detach a listener","     * @method unsubscribe","     * @deprecated use detach","     */","    unsubscribe: function() {","        return this.detach.apply(this, arguments);","    },","","    /**","     * Removes all listeners from the specified event.  If the event type","     * is not specified, all listeners from all hosted custom events will","     * be removed.","     * @method detachAll","     * @param type {String}   The type, or name of the event","     */","    detachAll: function(type) {","        return this.detach(type);","    },","","    /**","     * Removes all listeners from the specified event.  If the event type","     * is not specified, all listeners from all hosted custom events will","     * be removed.","     * @method unsubscribeAll","     * @param type {String}   The type, or name of the event","     * @deprecated use detachAll","     */","    unsubscribeAll: function() {","        return this.detachAll.apply(this, arguments);","    },","","    /**","     * Creates a new custom event of the specified type.  If a custom event","     * by that name already exists, it will not be re-created.  In either","     * case the custom event is returned.","     *","     * @method publish","     *","     * @param type {String} the type, or name of the event","     * @param opts {object} optional config params.  Valid properties are:","     *","     *  <ul>","     *    <li>","     *   'broadcast': whether or not the YUI instance and YUI global are notified when the event is fired (false)","     *    </li>","     *    <li>","     *   'bubbles': whether or not this event bubbles (true)","     *              Events can only bubble if emitFacade is true.","     *    </li>","     *    <li>","     *   'context': the default execution context for the listeners (this)","     *    </li>","     *    <li>","     *   'defaultFn': the default function to execute when this event fires if preventDefault was not called","     *    </li>","     *    <li>","     *   'emitFacade': whether or not this event emits a facade (false)","     *    </li>","     *    <li>","     *   'prefix': the prefix for this targets events, e.g., 'menu' in 'menu:click'","     *    </li>","     *    <li>","     *   'fireOnce': if an event is configured to fire once, new subscribers after","     *   the fire will be notified immediately.","     *    </li>","     *    <li>","     *   'async': fireOnce event listeners will fire synchronously if the event has already","     *    fired unless async is true.","     *    </li>","     *    <li>","     *   'preventable': whether or not preventDefault() has an effect (true)","     *    </li>","     *    <li>","     *   'preventedFn': a function that is executed when preventDefault is called","     *    </li>","     *    <li>","     *   'queuable': whether or not this event can be queued during bubbling (false)","     *    </li>","     *    <li>","     *   'silent': if silent is true, debug messages are not provided for this event.","     *    </li>","     *    <li>","     *   'stoppedFn': a function that is executed when stopPropagation is called","     *    </li>","     *","     *    <li>","     *   'monitored': specifies whether or not this event should send notifications about","     *   when the event has been attached, detached, or published.","     *    </li>","     *    <li>","     *   'type': the event type (valid option if not provided as the first parameter to publish)","     *    </li>","     *  </ul>","     *","     *  @return {CustomEvent} the custom event","     *","     */","    publish: function(type, opts) {","","        var ret,","            etState = this._yuievt,","            etConfig = etState.config,","            pre = etConfig.prefix;","","        if (typeof type === \"string\")  {","            if (pre) {","                type = _getType(type, pre);","            }","            ret = this._publish(type, etConfig, opts);","        } else {","            ret = {};","","            Y.each(type, function(v, k) {","                if (pre) {","                    k = _getType(k, pre);","                }","                ret[k] = this._publish(k, etConfig, v || opts);","            }, this);","","        }","","        return ret;","    },","","    /**","     * Returns the fully qualified type, given a short type string.","     * That is, returns \"foo:bar\" when given \"bar\" if \"foo\" is the configured prefix.","     *","     * NOTE: This method, unlike _getType, does no checking of the value passed in, and","     * is designed to be used with the low level _publish() method, for critical path","     * implementations which need to fast-track publish for performance reasons.","     *","     * @method _getFullType","     * @private","     * @param {String} type The short type to prefix","     * @return {String} The prefixed type, if a prefix is set, otherwise the type passed in","     */","    _getFullType : function(type) {","","        var pre = this._yuievt.config.prefix;","","        if (pre) {","            return pre + PREFIX_DELIMITER + type;","        } else {","            return type;","        }","    },","","    /**","     * The low level event publish implementation. It expects all the massaging to have been done","     * outside of this method. e.g. the `type` to `fullType` conversion. It's designed to be a fast","     * path publish, which can be used by critical code paths to improve performance.","     *","     * @method _publish","     * @private","     * @param {String} fullType The prefixed type of the event to publish.","     * @param {Object} etOpts The EventTarget specific configuration to mix into the published event.","     * @param {Object} ceOpts The publish specific configuration to mix into the published event.","     * @return {CustomEvent} The published event. If called without `etOpts` or `ceOpts`, this will","     * be the default `CustomEvent` instance, and can be configured independently.","     */","    _publish : function(fullType, etOpts, ceOpts) {","","        var ce,","            etState = this._yuievt,","            etConfig = etState.config,","            host = etConfig.host,","            context = etConfig.context,","            events = etState.events;","","        ce = events[fullType];","","        // PERF: Hate to pull the check out of monitor, but trying to keep critical path tight.","        if ((etConfig.monitored && !ce) || (ce && ce.monitored)) {","            this._monitor('publish', fullType, {","                args: arguments","            });","        }","","        if (!ce) {","            // Publish event","            ce = events[fullType] = new Y.CustomEvent(fullType, etOpts);","","            if (!etOpts) {","                ce.host = host;","                ce.context = context;","            }","        }","","        if (ceOpts) {","            mixConfigs(ce, ceOpts, true);","        }","","        return ce;","    },","","    /**","     * This is the entry point for the event monitoring system.","     * You can monitor 'attach', 'detach', 'fire', and 'publish'.","     * When configured, these events generate an event.  click ->","     * click_attach, click_detach, click_publish -- these can","     * be subscribed to like other events to monitor the event","     * system.  Inividual published events can have monitoring","     * turned on or off (publish can't be turned off before it","     * it published) by setting the events 'monitor' config.","     *","     * @method _monitor","     * @param what {String} 'attach', 'detach', 'fire', or 'publish'","     * @param eventType {String|CustomEvent} The prefixed name of the event being monitored, or the CustomEvent object.","     * @param o {Object} Information about the event interaction, such as","     *                  fire() args, subscription category, publish config","     * @private","     */","    _monitor: function(what, eventType, o) {","        var monitorevt, ce, type;","","        if (eventType) {","            if (typeof eventType === \"string\") {","                type = eventType;","                ce = this.getEvent(eventType, true);","            } else {","                ce = eventType;","                type = eventType.type;","            }","","            if ((this._yuievt.config.monitored && (!ce || ce.monitored)) || (ce && ce.monitored)) {","                monitorevt = type + '_' + what;","                o.monitored = what;","                this.fire.call(this, monitorevt, o);","            }","        }","    },","","    /**","     * Fire a custom event by name.  The callback functions will be executed","     * from the context specified when the event was created, and with the","     * following parameters.","     *","     * The first argument is the event type, and any additional arguments are","     * passed to the listeners as parameters.  If the first of these is an","     * object literal, and the event is configured to emit an event facade,","     * that object is mixed into the event facade and the facade is provided","     * in place of the original object.","     *","     * If the custom event object hasn't been created, then the event hasn't","     * been published and it has no subscribers.  For performance sake, we","     * immediate exit in this case.  This means the event won't bubble, so","     * if the intention is that a bubble target be notified, the event must","     * be published on this object first.","     *","     * @method fire","     * @param type {String|Object} The type of the event, or an object that contains","     * a 'type' property.","     * @param arguments {Object*} an arbitrary set of parameters to pass to","     * the handler.  If the first of these is an object literal and the event is","     * configured to emit an event facade, the event facade will replace that","     * parameter after the properties the object literal contains are copied to","     * the event facade.","     * @return {Boolean} True if the whole lifecycle of the event went through,","     * false if at any point the event propagation was halted.","     */","    fire: function(type) {","","        var typeIncluded = (typeof type === \"string\"),","            argCount = arguments.length,","            t = type,","            yuievt = this._yuievt,","            etConfig = yuievt.config,","            pre = etConfig.prefix,","            ret,","            ce,","            ce2,","            args;","","        if (typeIncluded && argCount <= 3) {","","            // PERF: Try to avoid slice/iteration for the common signatures","","            // Most common","            if (argCount === 2) {","                args = [arguments[1]]; // fire(\"foo\", {})","            } else if (argCount === 3) {","                args = [arguments[1], arguments[2]]; // fire(\"foo\", {}, opts)","            } else {","                args = []; // fire(\"foo\")","            }","","        } else {","            args = nativeSlice.call(arguments, ((typeIncluded) ? 1 : 0));","        }","","        if (!typeIncluded) {","            t = (type && type.type);","        }","","        if (pre) {","            t = _getType(t, pre);","        }","","        ce = yuievt.events[t];","","        if (this._hasSiblings) {","            ce2 = this.getSibling(t, ce);","","            if (ce2 && !ce) {","                ce = this.publish(t);","            }","        }","","        // PERF: trying to avoid function call, since this is a critical path","        if ((etConfig.monitored && (!ce || ce.monitored)) || (ce && ce.monitored)) {","            this._monitor('fire', (ce || t), {","                args: args","            });","        }","","        // this event has not been published or subscribed to","        if (!ce) {","            if (yuievt.hasTargets) {","                return this.bubble({ type: t }, args, this);","            }","","            // otherwise there is nothing to be done","            ret = true;","        } else {","","            if (ce2) {","                ce.sibling = ce2;","            }","","            ret = ce._fire(args);","        }","","        return (yuievt.chain) ? this : ret;","    },","","    getSibling: function(type, ce) {","        var ce2;","","        // delegate to *:type events if there are subscribers","        if (type.indexOf(PREFIX_DELIMITER) > -1) {","            type = _wildType(type);","            ce2 = this.getEvent(type, true);","            if (ce2) {","                ce2.applyConfig(ce);","                ce2.bubbles = false;","                ce2.broadcast = 0;","            }","        }","","        return ce2;","    },","","    /**","     * Returns the custom event of the provided type has been created, a","     * falsy value otherwise","     * @method getEvent","     * @param type {String} the type, or name of the event","     * @param prefixed {String} if true, the type is prefixed already","     * @return {CustomEvent} the custom event or null","     */","    getEvent: function(type, prefixed) {","        var pre, e;","","        if (!prefixed) {","            pre = this._yuievt.config.prefix;","            type = (pre) ? _getType(type, pre) : type;","        }","        e = this._yuievt.events;","        return e[type] || null;","    },","","    /**","     * Subscribe to a custom event hosted by this object.  The","     * supplied callback will execute after any listeners add","     * via the subscribe method, and after the default function,","     * if configured for the event, has executed.","     *","     * @method after","     * @param {String} type The name of the event","     * @param {Function} fn The callback to execute in response to the event","     * @param {Object} [context] Override `this` object in callback","     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber","     * @return {EventHandle} A subscription handle capable of detaching the","     *                       subscription","     */","    after: function(type, fn) {","","        var a = nativeSlice.call(arguments, 0);","","        switch (L.type(type)) {","            case 'function':","                return Y.Do.after.apply(Y.Do, arguments);","            case 'array':","            //     YArray.each(a[0], function(v) {","            //         v = AFTER_PREFIX + v;","            //     });","            //     break;","            case 'object':","                a[0]._after = true;","                break;","            default:","                a[0] = AFTER_PREFIX + type;","        }","","        return this.on.apply(this, a);","","    },","","    /**","     * Executes the callback before a DOM event, custom event","     * or method.  If the first argument is a function, it","     * is assumed the target is a method.  For DOM and custom","     * events, this is an alias for Y.on.","     *","     * For DOM and custom events:","     * type, callback, context, 0-n arguments","     *","     * For methods:","     * callback, object (method host), methodName, context, 0-n arguments","     *","     * @method before","     * @return detach handle","     */","    before: function() {","        return this.on.apply(this, arguments);","    }","","};","","Y.EventTarget = ET;","","// make Y an event target","Y.mix(Y, ET.prototype);","ET.call(Y, { bubbles: false });","","YUI.Env.globalEvents = YUI.Env.globalEvents || new ET();","","/**"," * Hosts YUI page level events.  This is where events bubble to"," * when the broadcast config is set to 2.  This property is"," * only available if the custom event module is loaded."," * @property Global"," * @type EventTarget"," * @for YUI"," */","Y.Global = YUI.Env.globalEvents;","","// @TODO implement a global namespace function on Y.Global?","","/**","`Y.on()` can do many things:","","<ul>","    <li>Subscribe to custom events `publish`ed and `fire`d from Y</li>","    <li>Subscribe to custom events `publish`ed with `broadcast` 1 or 2 and","        `fire`d from any object in the YUI instance sandbox</li>","    <li>Subscribe to DOM events</li>","    <li>Subscribe to the execution of a method on any object, effectively","    treating that method as an event</li>","</ul>","","For custom event subscriptions, pass the custom event name as the first argument","and callback as the second. The `this` object in the callback will be `Y` unless","an override is passed as the third argument.","","    Y.on('io:complete', function () {","        Y.MyApp.updateStatus('Transaction complete');","    });","","To subscribe to DOM events, pass the name of a DOM event as the first argument","and a CSS selector string as the third argument after the callback function.","Alternately, the third argument can be a `Node`, `NodeList`, `HTMLElement`,","array, or simply omitted (the default is the `window` object).","","    Y.on('click', function (e) {","        e.preventDefault();","","        // proceed with ajax form submission","        var url = this.get('action');","        ...","    }, '#my-form');","","The `this` object in DOM event callbacks will be the `Node` targeted by the CSS","selector or other identifier.","","`on()` subscribers for DOM events or custom events `publish`ed with a","`defaultFn` can prevent the default behavior with `e.preventDefault()` from the","event object passed as the first parameter to the subscription callback.","","To subscribe to the execution of an object method, pass arguments corresponding to the call signature for","<a href=\"../classes/Do.html#methods_before\">`Y.Do.before(...)`</a>.","","NOTE: The formal parameter list below is for events, not for function","injection.  See `Y.Do.before` for that signature.","","@method on","@param {String} type DOM or custom event name","@param {Function} fn The callback to execute in response to the event","@param {Object} [context] Override `this` object in callback","@param {Any} [arg*] 0..n additional arguments to supply to the subscriber","@return {EventHandle} A subscription handle capable of detaching the","                      subscription","@see Do.before","@for YUI","**/","","/**","Listen for an event one time.  Equivalent to `on()`, except that","the listener is immediately detached when executed.","","See the <a href=\"#methods_on\">`on()` method</a> for additional subscription","options.","","@see on","@method once","@param {String} type DOM or custom event name","@param {Function} fn The callback to execute in response to the event","@param {Object} [context] Override `this` object in callback","@param {Any} [arg*] 0..n additional arguments to supply to the subscriber","@return {EventHandle} A subscription handle capable of detaching the","                      subscription","@for YUI","**/","","/**","Listen for an event one time.  Equivalent to `once()`, except, like `after()`,","the subscription callback executes after all `on()` subscribers and the event's","`defaultFn` (if configured) have executed.  Like `after()` if any `on()` phase","subscriber calls `e.preventDefault()`, neither the `defaultFn` nor the `after()`","subscribers will execute.","","The listener is immediately detached when executed.","","See the <a href=\"#methods_on\">`on()` method</a> for additional subscription","options.","","@see once","@method onceAfter","@param {String} type The custom event name","@param {Function} fn The callback to execute in response to the event","@param {Object} [context] Override `this` object in callback","@param {Any} [arg*] 0..n additional arguments to supply to the subscriber","@return {EventHandle} A subscription handle capable of detaching the","                      subscription","@for YUI","**/","","/**","Like `on()`, this method creates a subscription to a custom event or to the","execution of a method on an object.","","For events, `after()` subscribers are executed after the event's","`defaultFn` unless `e.preventDefault()` was called from an `on()` subscriber.","","See the <a href=\"#methods_on\">`on()` method</a> for additional subscription","options.","","NOTE: The subscription signature shown is for events, not for function","injection.  See <a href=\"../classes/Do.html#methods_after\">`Y.Do.after`</a>","for that signature.","","@see on","@see Do.after","@method after","@param {String} type The custom event name","@param {Function} fn The callback to execute in response to the event","@param {Object} [context] Override `this` object in callback","@param {Any} [args*] 0..n additional arguments to supply to the subscriber","@return {EventHandle} A subscription handle capable of detaching the","                      subscription","@for YUI","**/","","","}, '@VERSION@', {\"requires\": [\"oop\"]});"];
_yuitest_coverage["build/event-custom-base/event-custom-base.js"].lines = {"1":0,"9":0,"29":0,"76":0,"77":0,"78":0,"79":0,"82":0,"113":0,"114":0,"115":0,"116":0,"119":0,"138":0,"140":0,"142":0,"145":0,"147":0,"149":0,"152":0,"153":0,"158":0,"161":0,"163":0,"174":0,"175":0,"180":0,"212":0,"213":0,"214":0,"215":0,"216":0,"217":0,"227":0,"228":0,"229":0,"231":0,"242":0,"243":0,"244":0,"261":0,"263":0,"270":0,"271":0,"272":0,"273":0,"274":0,"276":0,"278":0,"279":0,"281":0,"282":0,"290":0,"291":0,"294":0,"295":0,"298":0,"299":0,"300":0,"302":0,"303":0,"305":0,"306":0,"308":0,"313":0,"329":0,"330":0,"331":0,"343":0,"344":0,"345":0,"358":0,"359":0,"360":0,"371":0,"372":0,"385":0,"399":0,"433":0,"435":0,"436":0,"437":0,"441":0,"468":0,"470":0,"472":0,"474":0,"475":0,"477":0,"491":0,"492":0,"495":0,"496":0,"523":0,"525":0,"527":0,"702":0,"708":0,"709":0,"712":0,"713":0,"716":0,"717":0,"718":0,"720":0,"721":0,"724":0,"725":0,"729":0,"730":0,"733":0,"745":0,"746":0,"748":0,"749":0,"759":0,"765":0,"766":0,"767":0,"770":0,"771":0,"772":0,"774":0,"777":0,"778":0,"780":0,"784":0,"785":0,"786":0,"788":0,"791":0,"792":0,"794":0,"798":0,"809":0,"828":0,"831":0,"833":0,"838":0,"839":0,"842":0,"843":0,"845":0,"849":0,"850":0,"851":0,"853":0,"855":0,"856":0,"858":0,"861":0,"862":0,"863":0,"865":0,"869":0,"880":0,"881":0,"894":0,"896":0,"897":0,"901":0,"916":0,"917":0,"930":0,"931":0,"934":0,"939":0,"940":0,"941":0,"942":0,"943":0,"944":0,"949":0,"950":0,"951":0,"952":0,"953":0,"954":0,"959":0,"972":0,"985":0,"987":0,"989":0,"990":0,"993":0,"1028":0,"1029":0,"1031":0,"1046":0,"1047":0,"1053":0,"1055":0,"1056":0,"1059":0,"1060":0,"1062":0,"1076":0,"1077":0,"1078":0,"1079":0,"1080":0,"1081":0,"1083":0,"1084":0,"1086":0,"1091":0,"1092":0,"1108":0,"1110":0,"1111":0,"1112":0,"1113":0,"1114":0,"1116":0,"1117":0,"1122":0,"1134":0,"1136":0,"1137":0,"1139":0,"1140":0,"1143":0,"1144":0,"1156":0,"1165":0,"1179":0,"1181":0,"1182":0,"1185":0,"1186":0,"1188":0,"1189":0,"1193":0,"1194":0,"1195":0,"1197":0,"1201":0,"1202":0,"1208":0,"1209":0,"1222":0,"1230":0,"1237":0,"1244":0,"1251":0,"1253":0,"1270":0,"1274":0,"1275":0,"1276":0,"1277":0,"1279":0,"1280":0,"1283":0,"1284":0,"1286":0,"1287":0,"1289":0,"1290":0,"1292":0,"1293":0,"1294":0,"1295":0,"1297":0,"1301":0,"1302":0,"1305":0,"1315":0,"1318":0,"1319":0,"1323":0,"1324":0,"1326":0,"1327":0,"1329":0,"1333":0,"1347":0,"1348":0,"1350":0,"1355":0,"1366":0,"1374":0,"1382":0,"1385":0,"1387":0,"1388":0,"1389":0,"1390":0,"1401":0,"1402":0,"1403":0,"1404":0,"1405":0,"1408":0,"1409":0,"1414":0,"1426":0,"1454":0,"1461":0,"1473":0,"1474":0,"1477":0,"1489":0,"1491":0,"1492":0,"1495":0,"1497":0,"1498":0,"1499":0,"1502":0,"1504":0,"1505":0,"1506":0,"1507":0,"1508":0,"1513":0,"1518":0,"1521":0,"1522":0,"1533":0,"1535":0,"1536":0,"1538":0,"1539":0,"1542":0,"1543":0,"1548":0,"1565":0,"1566":0,"1567":0,"1568":0,"1571":0,"1587":0,"1588":0,"1589":0,"1590":0,"1593":0,"1613":0,"1647":0,"1653":0,"1659":0,"1661":0,"1662":0,"1665":0,"1666":0,"1667":0,"1668":0,"1670":0,"1671":0,"1674":0,"1675":0,"1677":0,"1679":0,"1680":0,"1681":0,"1684":0,"1686":0,"1687":0,"1688":0,"1690":0,"1694":0,"1697":0,"1698":0,"1699":0,"1702":0,"1703":0,"1704":0,"1705":0,"1708":0,"1710":0,"1712":0,"1713":0,"1714":0,"1716":0,"1717":0,"1719":0,"1720":0,"1721":0,"1722":0,"1725":0,"1728":0,"1729":0,"1734":0,"1735":0,"1736":0,"1737":0,"1742":0,"1743":0,"1744":0,"1747":0,"1748":0,"1752":0,"1753":0,"1754":0,"1755":0,"1758":0,"1768":0,"1789":0,"1795":0,"1796":0,"1797":0,"1798":0,"1801":0,"1802":0,"1805":0,"1808":0,"1815":0,"1816":0,"1817":0,"1818":0,"1819":0,"1820":0,"1826":0,"1828":0,"1829":0,"1830":0,"1832":0,"1833":0,"1834":0,"1836":0,"1837":0,"1838":0,"1843":0,"1847":0,"1848":0,"1849":0,"1851":0,"1852":0,"1853":0,"1854":0,"1855":0,"1858":0,"1861":0,"1862":0,"1864":0,"1865":0,"1866":0,"1868":0,"1869":0,"1870":0,"1871":0,"1876":0,"1877":0,"1878":0,"1881":0,"1890":0,"1901":0,"1913":0,"1984":0,"1989":0,"1990":0,"1991":0,"1993":0,"1995":0,"1997":0,"1998":0,"1999":0,"2001":0,"2006":0,"2024":0,"2026":0,"2027":0,"2029":0,"2048":0,"2055":0,"2058":0,"2059":0,"2064":0,"2066":0,"2068":0,"2069":0,"2070":0,"2074":0,"2075":0,"2078":0,"2099":0,"2101":0,"2102":0,"2103":0,"2104":0,"2106":0,"2107":0,"2110":0,"2111":0,"2112":0,"2113":0,"2148":0,"2159":0,"2164":0,"2165":0,"2166":0,"2167":0,"2169":0,"2173":0,"2176":0,"2177":0,"2180":0,"2181":0,"2184":0,"2186":0,"2187":0,"2189":0,"2190":0,"2195":0,"2196":0,"2202":0,"2203":0,"2204":0,"2208":0,"2211":0,"2212":0,"2215":0,"2218":0,"2222":0,"2225":0,"2226":0,"2227":0,"2228":0,"2229":0,"2230":0,"2231":0,"2235":0,"2247":0,"2249":0,"2250":0,"2251":0,"2253":0,"2254":0,"2273":0,"2275":0,"2277":0,"2284":0,"2285":0,"2287":0,"2290":0,"2310":0,"2315":0,"2318":0,"2319":0,"2321":0,"2331":0};
_yuitest_coverage["build/event-custom-base/event-custom-base.js"].functions = {"before:75":0,"after:112":0,"]:152":0,"_inject:136":0,"detach:173":0,"Method:212":0,"register:227":0,"_delete:242":0,"exec:261":0,"AlterArgs:329":0,"AlterReturn:343":0,"Halt:358":0,"Prevent:371":0,"mixConfigs:432":0,"CustomEvent:468":0,"hasSubs:701":0,"monitor:744":0,"getSubs:757":0,"applyConfig:808":0,"_on:825":0,"subscribe:879":0,"on:893":0,"after:915":0,"detach:928":0,"unsubscribe:971":0,"_notify:982":0,"fire:1022":0,"_fire:1044":0,"fireSimple:1075":0,"fireComplex:1090":0,"_procSubs:1107":0,"_broadcast:1133":0,"unsubscribeAll:1155":0,"detachAll:1164":0,"_delete:1178":0,"Subscriber:1222":0,"_notify:1273":0,"notify:1314":0,"contains:1346":0,"valueOf:1354":0,"EventHandle:1366":0,"(anonymous 2):1389":0,"batch:1386":0,"detach:1400":0,"monitor:1425":0,"(anonymous 3):1460":0,"_getType:1471":0,"(anonymous 4):1487":0,"ET:1516":0,"(anonymous 5):1566":0,"once:1564":0,"(anonymous 6):1588":0,"onceAfter:1586":0,"parseType:1612":0,"(anonymous 7):1677":0,"on:1645":0,"subscribe:1767":0,"keyDetacher:1814":0,"detach:1787":0,"unsubscribe:1889":0,"detachAll:1900":0,"unsubscribeAll:1912":0,"(anonymous 8):1997":0,"publish:1982":0,"_getFullType:2022":0,"_publish:2046":0,"_monitor:2098":0,"fire:2146":0,"getSibling:2221":0,"getEvent:2246":0,"after:2271":0,"before:2309":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-custom-base/event-custom-base.js"].coveredLines = 541;
_yuitest_coverage["build/event-custom-base/event-custom-base.js"].coveredFunctions = 73;
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1);
YUI.add('event-custom-base', function (Y, NAME) {

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 */

_yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 9);
Y.Env.evt = {
    handles: {},
    plugins: {}
};


/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */

/**
 * Allows for the insertion of methods that are executed before or after
 * a specified method
 * @class Do
 * @static
 */

_yuitest_coverline("build/event-custom-base/event-custom-base.js", 29);
var DO_BEFORE = 0,
    DO_AFTER = 1,

DO = {

    /**
     * Cache of objects touched by the utility
     * @property objs
     * @static
     * @deprecated Since 3.6.0. The `_yuiaop` property on the AOP'd object
     * replaces the role of this property, but is considered to be private, and
     * is only mentioned to provide a migration path.
     *
     * If you have a use case which warrants migration to the _yuiaop property,
     * please file a ticket to let us know what it's used for and we can see if
     * we need to expose hooks for that functionality more formally.
     */
    objs: null,

    /**
     * <p>Execute the supplied method before the specified function.  Wrapping
     * function may optionally return an instance of the following classes to
     * further alter runtime behavior:</p>
     * <dl>
     *     <dt></code>Y.Do.Halt(message, returnValue)</code></dt>
     *         <dd>Immediatly stop execution and return
     *         <code>returnValue</code>.  No other wrapping functions will be
     *         executed.</dd>
     *     <dt></code>Y.Do.AlterArgs(message, newArgArray)</code></dt>
     *         <dd>Replace the arguments that the original function will be
     *         called with.</dd>
     *     <dt></code>Y.Do.Prevent(message)</code></dt>
     *         <dd>Don't execute the wrapped function.  Other before phase
     *         wrappers will be executed.</dd>
     * </dl>
     *
     * @method before
     * @param fn {Function} the function to execute
     * @param obj the object hosting the method to displace
     * @param sFn {string} the name of the method to displace
     * @param c The execution context for fn
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {string} handle for the subscription
     * @static
     */
    before: function(fn, obj, sFn, c) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "before", 75);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 76);
var f = fn, a;
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 77);
if (c) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 78);
a = [fn, c].concat(Y.Array(arguments, 4, true));
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 79);
f = Y.rbind.apply(Y, a);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 82);
return this._inject(DO_BEFORE, f, obj, sFn);
    },

    /**
     * <p>Execute the supplied method after the specified function.  Wrapping
     * function may optionally return an instance of the following classes to
     * further alter runtime behavior:</p>
     * <dl>
     *     <dt></code>Y.Do.Halt(message, returnValue)</code></dt>
     *         <dd>Immediatly stop execution and return
     *         <code>returnValue</code>.  No other wrapping functions will be
     *         executed.</dd>
     *     <dt></code>Y.Do.AlterReturn(message, returnValue)</code></dt>
     *         <dd>Return <code>returnValue</code> instead of the wrapped
     *         method's original return value.  This can be further altered by
     *         other after phase wrappers.</dd>
     * </dl>
     *
     * <p>The static properties <code>Y.Do.originalRetVal</code> and
     * <code>Y.Do.currentRetVal</code> will be populated for reference.</p>
     *
     * @method after
     * @param fn {Function} the function to execute
     * @param obj the object hosting the method to displace
     * @param sFn {string} the name of the method to displace
     * @param c The execution context for fn
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * @return {string} handle for the subscription
     * @static
     */
    after: function(fn, obj, sFn, c) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "after", 112);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 113);
var f = fn, a;
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 114);
if (c) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 115);
a = [fn, c].concat(Y.Array(arguments, 4, true));
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 116);
f = Y.rbind.apply(Y, a);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 119);
return this._inject(DO_AFTER, f, obj, sFn);
    },

    /**
     * Execute the supplied method before or after the specified function.
     * Used by <code>before</code> and <code>after</code>.
     *
     * @method _inject
     * @param when {string} before or after
     * @param fn {Function} the function to execute
     * @param obj the object hosting the method to displace
     * @param sFn {string} the name of the method to displace
     * @param c The execution context for fn
     * @return {string} handle for the subscription
     * @private
     * @static
     */
    _inject: function(when, fn, obj, sFn) {
        // object id
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_inject", 136);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 138);
var id = Y.stamp(obj), o, sid;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 140);
if (!obj._yuiaop) {
            // create a map entry for the obj if it doesn't exist, to hold overridden methods
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 142);
obj._yuiaop = {};
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 145);
o = obj._yuiaop;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 147);
if (!o[sFn]) {
            // create a map entry for the method if it doesn't exist
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 149);
o[sFn] = new Y.Do.Method(obj, sFn);

            // re-route the method to our wrapper
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 152);
obj[sFn] = function() {
                _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "]", 152);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 153);
return o[sFn].exec.apply(o[sFn], arguments);
            };
        }

        // subscriber id
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 158);
sid = id + Y.stamp(fn) + sFn;

        // register the callback
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 161);
o[sFn].register(sid, fn, when);

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 163);
return new Y.EventHandle(o[sFn], sid);
    },

    /**
     * Detach a before or after subscription.
     *
     * @method detach
     * @param handle {string} the subscription handle
     * @static
     */
    detach: function(handle) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "detach", 173);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 174);
if (handle.detach) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 175);
handle.detach();
        }
    }
};

_yuitest_coverline("build/event-custom-base/event-custom-base.js", 180);
Y.Do = DO;

//////////////////////////////////////////////////////////////////////////

/**
 * Contains the return value from the wrapped method, accessible
 * by 'after' event listeners.
 *
 * @property originalRetVal
 * @static
 * @since 3.2.0
 */

/**
 * Contains the current state of the return value, consumable by
 * 'after' event listeners, and updated if an after subscriber
 * changes the return value generated by the wrapped function.
 *
 * @property currentRetVal
 * @static
 * @since 3.2.0
 */

//////////////////////////////////////////////////////////////////////////

/**
 * Wrapper for a displaced method with aop enabled
 * @class Do.Method
 * @constructor
 * @param obj The object to operate on
 * @param sFn The name of the method to displace
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 212);
DO.Method = function(obj, sFn) {
    _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "Method", 212);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 213);
this.obj = obj;
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 214);
this.methodName = sFn;
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 215);
this.method = obj[sFn];
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 216);
this.before = {};
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 217);
this.after = {};
};

/**
 * Register a aop subscriber
 * @method register
 * @param sid {string} the subscriber id
 * @param fn {Function} the function to execute
 * @param when {string} when to execute the function
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 227);
DO.Method.prototype.register = function (sid, fn, when) {
    _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "register", 227);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 228);
if (when) {
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 229);
this.after[sid] = fn;
    } else {
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 231);
this.before[sid] = fn;
    }
};

/**
 * Unregister a aop subscriber
 * @method delete
 * @param sid {string} the subscriber id
 * @param fn {Function} the function to execute
 * @param when {string} when to execute the function
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 242);
DO.Method.prototype._delete = function (sid) {
    _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_delete", 242);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 243);
delete this.before[sid];
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 244);
delete this.after[sid];
};

/**
 * <p>Execute the wrapped method.  All arguments are passed into the wrapping
 * functions.  If any of the before wrappers return an instance of
 * <code>Y.Do.Halt</code> or <code>Y.Do.Prevent</code>, neither the wrapped
 * function nor any after phase subscribers will be executed.</p>
 *
 * <p>The return value will be the return value of the wrapped function or one
 * provided by a wrapper function via an instance of <code>Y.Do.Halt</code> or
 * <code>Y.Do.AlterReturn</code>.
 *
 * @method exec
 * @param arg* {any} Arguments are passed to the wrapping and wrapped functions
 * @return {any} Return value of wrapped function unless overwritten (see above)
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 261);
DO.Method.prototype.exec = function () {

    _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "exec", 261);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 263);
var args = Y.Array(arguments, 0, true),
        i, ret, newRet,
        bf = this.before,
        af = this.after,
        prevented = false;

    // execute before
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 270);
for (i in bf) {
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 271);
if (bf.hasOwnProperty(i)) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 272);
ret = bf[i].apply(this.obj, args);
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 273);
if (ret) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 274);
switch (ret.constructor) {
                    case DO.Halt:
                        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 276);
return ret.retVal;
                    case DO.AlterArgs:
                        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 278);
args = ret.newArgs;
                        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 279);
break;
                    case DO.Prevent:
                        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 281);
prevented = true;
                        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 282);
break;
                    default:
                }
            }
        }
    }

    // execute method
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 290);
if (!prevented) {
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 291);
ret = this.method.apply(this.obj, args);
    }

    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 294);
DO.originalRetVal = ret;
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 295);
DO.currentRetVal = ret;

    // execute after methods.
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 298);
for (i in af) {
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 299);
if (af.hasOwnProperty(i)) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 300);
newRet = af[i].apply(this.obj, args);
            // Stop processing if a Halt object is returned
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 302);
if (newRet && newRet.constructor === DO.Halt) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 303);
return newRet.retVal;
            // Check for a new return value
            } else {_yuitest_coverline("build/event-custom-base/event-custom-base.js", 305);
if (newRet && newRet.constructor === DO.AlterReturn) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 306);
ret = newRet.newRetVal;
                // Update the static retval state
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 308);
DO.currentRetVal = ret;
            }}
        }
    }

    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 313);
return ret;
};

//////////////////////////////////////////////////////////////////////////

/**
 * Return an AlterArgs object when you want to change the arguments that
 * were passed into the function.  Useful for Do.before subscribers.  An
 * example would be a service that scrubs out illegal characters prior to
 * executing the core business logic.
 * @class Do.AlterArgs
 * @constructor
 * @param msg {String} (optional) Explanation of the altered return value
 * @param newArgs {Array} Call parameters to be used for the original method
 *                        instead of the arguments originally passed in.
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 329);
DO.AlterArgs = function(msg, newArgs) {
    _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "AlterArgs", 329);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 330);
this.msg = msg;
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 331);
this.newArgs = newArgs;
};

/**
 * Return an AlterReturn object when you want to change the result returned
 * from the core method to the caller.  Useful for Do.after subscribers.
 * @class Do.AlterReturn
 * @constructor
 * @param msg {String} (optional) Explanation of the altered return value
 * @param newRetVal {any} Return value passed to code that invoked the wrapped
 *                      function.
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 343);
DO.AlterReturn = function(msg, newRetVal) {
    _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "AlterReturn", 343);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 344);
this.msg = msg;
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 345);
this.newRetVal = newRetVal;
};

/**
 * Return a Halt object when you want to terminate the execution
 * of all subsequent subscribers as well as the wrapped method
 * if it has not exectued yet.  Useful for Do.before subscribers.
 * @class Do.Halt
 * @constructor
 * @param msg {String} (optional) Explanation of why the termination was done
 * @param retVal {any} Return value passed to code that invoked the wrapped
 *                      function.
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 358);
DO.Halt = function(msg, retVal) {
    _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "Halt", 358);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 359);
this.msg = msg;
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 360);
this.retVal = retVal;
};

/**
 * Return a Prevent object when you want to prevent the wrapped function
 * from executing, but want the remaining listeners to execute.  Useful
 * for Do.before subscribers.
 * @class Do.Prevent
 * @constructor
 * @param msg {String} (optional) Explanation of why the termination was done
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 371);
DO.Prevent = function(msg) {
    _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "Prevent", 371);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 372);
this.msg = msg;
};

/**
 * Return an Error object when you want to terminate the execution
 * of all subsequent method calls.
 * @class Do.Error
 * @constructor
 * @param msg {String} (optional) Explanation of the altered return value
 * @param retVal {any} Return value passed to code that invoked the wrapped
 *                      function.
 * @deprecated use Y.Do.Halt or Y.Do.Prevent
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 385);
DO.Error = DO.Halt;


//////////////////////////////////////////////////////////////////////////

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */


// var onsubscribeType = "_event:onsub",
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 399);
var YArray = Y.Array,

    AFTER = 'after',
    CONFIGS = [
        'broadcast',
        'monitored',
        'bubbles',
        'context',
        'contextFn',
        'currentTarget',
        'defaultFn',
        'defaultTargetOnly',
        'details',
        'emitFacade',
        'fireOnce',
        'async',
        'host',
        'preventable',
        'preventedFn',
        'queuable',
        'silent',
        'stoppedFn',
        'target',
        'type'
    ],

    CONFIGS_HASH = YArray.hash(CONFIGS),

    nativeSlice = Array.prototype.slice,

    YUI3_SIGNATURE = 9,
    YUI_LOG = 'yui:log',

    mixConfigs = function(r, s, ov) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "mixConfigs", 432);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 433);
var p;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 435);
for (p in s) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 436);
if (CONFIGS_HASH[p] && (ov || !(p in r))) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 437);
r[p] = s[p];
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 441);
return r;
    };

/**
 * The CustomEvent class lets you define events for your application
 * that can be subscribed to by one or more independent component.
 *
 * @param {String} type The type of event, which is passed to the callback
 * when the event fires.
 * @param {object} defaults configuration object.
 * @class CustomEvent
 * @constructor
 */

 /**
 * The type of event, returned to subscribers when the event fires
 * @property type
 * @type string
 */

/**
 * By default all custom events are logged in the debug build, set silent
 * to true to disable debug outpu for this event.
 * @property silent
 * @type boolean
 */

_yuitest_coverline("build/event-custom-base/event-custom-base.js", 468);
Y.CustomEvent = function(type, defaults) {

    _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "CustomEvent", 468);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 470);
this._kds = Y.CustomEvent.keepDeprecatedSubs;

    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 472);
this.id = Y.guid();

    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 474);
this.type = type;
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 475);
this.silent = this.logSystem = (type === YUI_LOG);

    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 477);
if (this._kds) {
        /**
         * The subscribers to this event
         * @property subscribers
         * @type Subscriber {}
         * @deprecated
         */

        /**
         * 'After' subscribers
         * @property afters
         * @type Subscriber {}
         * @deprecated
         */
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 491);
this.subscribers = {};
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 492);
this.afters = {};
    }

    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 495);
if (defaults) {
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 496);
mixConfigs(this, defaults, true);
    }
};

/**
 * Static flag to enable population of the <a href="#property_subscribers">`subscribers`</a>
 * and  <a href="#property_subscribers">`afters`</a> properties held on a `CustomEvent` instance.
 *
 * These properties were changed to private properties (`_subscribers` and `_afters`), and
 * converted from objects to arrays for performance reasons.
 *
 * Setting this property to true will populate the deprecated `subscribers` and `afters`
 * properties for people who may be using them (which is expected to be rare). There will
 * be a performance hit, compared to the new array based implementation.
 *
 * If you are using these deprecated properties for a use case which the public API
 * does not support, please file an enhancement request, and we can provide an alternate
 * public implementation which doesn't have the performance cost required to maintiain the
 * properties as objects.
 *
 * @property keepDeprecatedSubs
 * @static
 * @for CustomEvent
 * @type boolean
 * @default false
 * @deprecated
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 523);
Y.CustomEvent.keepDeprecatedSubs = false;

_yuitest_coverline("build/event-custom-base/event-custom-base.js", 525);
Y.CustomEvent.mixConfigs = mixConfigs;

_yuitest_coverline("build/event-custom-base/event-custom-base.js", 527);
Y.CustomEvent.prototype = {

    constructor: Y.CustomEvent,

    /**
     * Monitor when an event is attached or detached.
     *
     * @property monitored
     * @type boolean
     */

    /**
     * If 0, this event does not broadcast.  If 1, the YUI instance is notified
     * every time this event fires.  If 2, the YUI instance and the YUI global
     * (if event is enabled on the global) are notified every time this event
     * fires.
     * @property broadcast
     * @type int
     */

    /**
     * Specifies whether this event should be queued when the host is actively
     * processing an event.  This will effect exectution order of the callbacks
     * for the various events.
     * @property queuable
     * @type boolean
     * @default false
     */

    /**
     * This event has fired if true
     *
     * @property fired
     * @type boolean
     * @default false;
     */

    /**
     * An array containing the arguments the custom event
     * was last fired with.
     * @property firedWith
     * @type Array
     */

    /**
     * This event should only fire one time if true, and if
     * it has fired, any new subscribers should be notified
     * immediately.
     *
     * @property fireOnce
     * @type boolean
     * @default false;
     */

    /**
     * fireOnce listeners will fire syncronously unless async
     * is set to true
     * @property async
     * @type boolean
     * @default false
     */

    /**
     * Flag for stopPropagation that is modified during fire()
     * 1 means to stop propagation to bubble targets.  2 means
     * to also stop additional subscribers on this target.
     * @property stopped
     * @type int
     */

    /**
     * Flag for preventDefault that is modified during fire().
     * if it is not 0, the default behavior for this event
     * @property prevented
     * @type int
     */

    /**
     * Specifies the host for this custom event.  This is used
     * to enable event bubbling
     * @property host
     * @type EventTarget
     */

    /**
     * The default function to execute after event listeners
     * have fire, but only if the default action was not
     * prevented.
     * @property defaultFn
     * @type Function
     */

    /**
     * The function to execute if a subscriber calls
     * stopPropagation or stopImmediatePropagation
     * @property stoppedFn
     * @type Function
     */

    /**
     * The function to execute if a subscriber calls
     * preventDefault
     * @property preventedFn
     * @type Function
     */

    /**
     * The subscribers to this event
     * @property _subscribers
     * @type Subscriber []
     * @private
     */

    /**
     * 'After' subscribers
     * @property _afters
     * @type Subscriber []
     * @private
     */

    /**
     * If set to true, the custom event will deliver an EventFacade object
     * that is similar to a DOM event object.
     * @property emitFacade
     * @type boolean
     * @default false
     */

    /**
     * Supports multiple options for listener signatures in order to
     * port YUI 2 apps.
     * @property signature
     * @type int
     * @default 9
     */
    signature : YUI3_SIGNATURE,

    /**
     * The context the the event will fire from by default.  Defaults to the YUI
     * instance.
     * @property context
     * @type object
     */
    context : Y,

    /**
     * Specifies whether or not this event's default function
     * can be cancelled by a subscriber by executing preventDefault()
     * on the event facade
     * @property preventable
     * @type boolean
     * @default true
     */
    preventable : true,

    /**
     * Specifies whether or not a subscriber can stop the event propagation
     * via stopPropagation(), stopImmediatePropagation(), or halt()
     *
     * Events can only bubble if emitFacade is true.
     *
     * @property bubbles
     * @type boolean
     * @default true
     */
    bubbles : true,

    /**
     * Returns the number of subscribers for this event as the sum of the on()
     * subscribers and after() subscribers.
     *
     * @method hasSubs
     * @return Number
     */
    hasSubs: function(when) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "hasSubs", 701);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 702);
var s = 0,
            a = 0,
            subs = this._subscribers,
            afters = this._afters,
            sib = this.sibling;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 708);
if (subs) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 709);
s = subs.length;
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 712);
if (afters) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 713);
a = afters.length;
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 716);
if (sib) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 717);
subs = sib._subscribers;
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 718);
afters = sib._afters;

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 720);
if (subs) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 721);
s += subs.length;
            }

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 724);
if (afters) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 725);
a += afters.length;
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 729);
if (when) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 730);
return (when === 'after') ? a : s;
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 733);
return (s + a);
    },

    /**
     * Monitor the event state for the subscribed event.  The first parameter
     * is what should be monitored, the rest are the normal parameters when
     * subscribing to an event.
     * @method monitor
     * @param what {string} what to monitor ('detach', 'attach', 'publish').
     * @return {EventHandle} return value from the monitor event subscription.
     */
    monitor: function(what) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "monitor", 744);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 745);
this.monitored = true;
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 746);
var type = this.id + '|' + this.type + '_' + what,
            args = nativeSlice.call(arguments, 0);
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 748);
args[0] = type;
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 749);
return this.host.on.apply(this.host, args);
    },

    /**
     * Get all of the subscribers to this event and any sibling event
     * @method getSubs
     * @return {Array} first item is the on subscribers, second the after.
     */
    getSubs: function() {

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "getSubs", 757);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 759);
var sibling = this.sibling,
            subs = this._subscribers,
            afters = this._afters,
            siblingSubs,
            siblingAfters;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 765);
if (sibling) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 766);
siblingSubs = sibling._subscribers;
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 767);
siblingAfters = sibling._afters;
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 770);
if (siblingSubs) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 771);
if (subs) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 772);
subs = subs.concat(siblingSubs);
            } else {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 774);
subs = siblingSubs.concat();
            }
        } else {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 777);
if (subs) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 778);
subs = subs.concat();
            } else {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 780);
subs = [];
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 784);
if (siblingAfters) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 785);
if (afters) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 786);
afters = afters.concat(siblingAfters);
            } else {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 788);
afters = siblingAfters.concat();
            }
        } else {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 791);
if (afters) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 792);
afters = afters.concat();
            } else {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 794);
afters = [];
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 798);
return [subs, afters];
    },

    /**
     * Apply configuration properties.  Only applies the CONFIG whitelist
     * @method applyConfig
     * @param o hash of properties to apply.
     * @param force {boolean} if true, properties that exist on the event
     * will be overwritten.
     */
    applyConfig: function(o, force) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "applyConfig", 808);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 809);
mixConfigs(this, o, force);
    },

    /**
     * Create the Subscription for subscribing function, context, and bound
     * arguments.  If this is a fireOnce event, the subscriber is immediately
     * notified.
     *
     * @method _on
     * @param fn {Function} Subscription callback
     * @param [context] {Object} Override `this` in the callback
     * @param [args] {Array} bound arguments that will be passed to the callback after the arguments generated by fire()
     * @param [when] {String} "after" to slot into after subscribers
     * @return {EventHandle}
     * @protected
     */
    _on: function(fn, context, args, when) {


        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_on", 825);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 828);
var s = new Y.Subscriber(fn, context, args, when),
            firedWith;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 831);
if (this.fireOnce && this.fired) {

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 833);
firedWith = this.firedWith;

            // It's a little ugly for this to know about facades,
            // but given the current breakup, not much choice without
            // moving a whole lot of stuff around.
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 838);
if (this.emitFacade && this._addFacadeToArgs) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 839);
this._addFacadeToArgs(firedWith);
            }

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 842);
if (this.async) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 843);
setTimeout(Y.bind(this._notify, this, s, firedWith), 0);
            } else {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 845);
this._notify(s, firedWith);
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 849);
if (when === AFTER) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 850);
if (!this._afters) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 851);
this._afters = [];
            }
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 853);
this._afters.push(s);
        } else {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 855);
if (!this._subscribers) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 856);
this._subscribers = [];
            }
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 858);
this._subscribers.push(s);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 861);
if (this._kds) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 862);
if (when === AFTER) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 863);
this.afters[s.id] = s;
            } else {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 865);
this.subscribers[s.id] = s;
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 869);
return new Y.EventHandle(this, s);
    },

    /**
     * Listen for this event
     * @method subscribe
     * @param {Function} fn The function to execute.
     * @return {EventHandle} Unsubscribe handle.
     * @deprecated use on.
     */
    subscribe: function(fn, context) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "subscribe", 879);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 880);
var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 881);
return this._on(fn, context, a, true);
    },

    /**
     * Listen for this event
     * @method on
     * @param {Function} fn The function to execute.
     * @param {object} context optional execution context.
     * @param {mixed} arg* 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {EventHandle} An object with a detach method to detch the handler(s).
     */
    on: function(fn, context) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "on", 893);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 894);
var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 896);
if (this.monitored && this.host) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 897);
this.host._monitor('attach', this, {
                args: arguments
            });
        }
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 901);
return this._on(fn, context, a, true);
    },

    /**
     * Listen for this event after the normal subscribers have been notified and
     * the default behavior has been applied.  If a normal subscriber prevents the
     * default behavior, it also prevents after listeners from firing.
     * @method after
     * @param {Function} fn The function to execute.
     * @param {object} context optional execution context.
     * @param {mixed} arg* 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {EventHandle} handle Unsubscribe handle.
     */
    after: function(fn, context) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "after", 915);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 916);
var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 917);
return this._on(fn, context, a, AFTER);
    },

    /**
     * Detach listeners.
     * @method detach
     * @param {Function} fn  The subscribed function to remove, if not supplied
     *                       all will be removed.
     * @param {Object}   context The context object passed to subscribe.
     * @return {int} returns the number of subscribers unsubscribed.
     */
    detach: function(fn, context) {
        // unsubscribe handle
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "detach", 928);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 930);
if (fn && fn.detach) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 931);
return fn.detach();
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 934);
var i, s,
            found = 0,
            subs = this._subscribers,
            afters = this._afters;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 939);
if (subs) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 940);
for (i = subs.length; i >= 0; i--) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 941);
s = subs[i];
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 942);
if (s && (!fn || fn === s.fn)) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 943);
this._delete(s, subs, i);
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 944);
found++;
                }
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 949);
if (afters) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 950);
for (i = afters.length; i >= 0; i--) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 951);
s = afters[i];
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 952);
if (s && (!fn || fn === s.fn)) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 953);
this._delete(s, afters, i);
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 954);
found++;
                }
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 959);
return found;
    },

    /**
     * Detach listeners.
     * @method unsubscribe
     * @param {Function} fn  The subscribed function to remove, if not supplied
     *                       all will be removed.
     * @param {Object}   context The context object passed to subscribe.
     * @return {int|undefined} returns the number of subscribers unsubscribed.
     * @deprecated use detach.
     */
    unsubscribe: function() {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "unsubscribe", 971);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 972);
return this.detach.apply(this, arguments);
    },

    /**
     * Notify a single subscriber
     * @method _notify
     * @param {Subscriber} s the subscriber.
     * @param {Array} args the arguments array to apply to the listener.
     * @protected
     */
    _notify: function(s, args, ef) {


        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_notify", 982);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 985);
var ret;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 987);
ret = s.notify(args, this);

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 989);
if (false === ret || this.stopped > 1) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 990);
return false;
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 993);
return true;
    },

    /**
     * Logger abstraction to centralize the application of the silent flag
     * @method log
     * @param {string} msg message to log.
     * @param {string} cat log category.
     */
    log: function(msg, cat) {
    },

    /**
     * Notifies the subscribers.  The callback functions will be executed
     * from the context specified when the event was created, and with the
     * following parameters:
     *   <ul>
     *   <li>The type of event</li>
     *   <li>All of the arguments fire() was executed with as an array</li>
     *   <li>The custom object (if any) that was passed into the subscribe()
     *       method</li>
     *   </ul>
     * @method fire
     * @param {Object*} arguments an arbitrary set of parameters to pass to
     *                            the handler.
     * @return {boolean} false if one of the subscribers returned false,
     *                   true otherwise.
     *
     */
    fire: function() {

        // push is the fastest way to go from arguments to arrays
        // for most browsers currently
        // http://jsperf.com/push-vs-concat-vs-slice/2

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "fire", 1022);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1028);
var args = [];
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1029);
args.push.apply(args, arguments);

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1031);
return this._fire(args);
    },

    /**
     * Private internal implementation for `fire`, which is can be used directly by
     * `EventTarget` and other event module classes which have already converted from
     * an `arguments` list to an array, to avoid the repeated overhead.
     *
     * @method _fire
     * @private
     * @param {Array} args The array of arguments passed to be passed to handlers.
     * @return {boolean} false if one of the subscribers returned false, true otherwise.
     */
    _fire: function(args) {

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_fire", 1044);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1046);
if (this.fireOnce && this.fired) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1047);
return true;
        } else {

            // this doesn't happen if the event isn't published
            // this.host._monitor('fire', this.type, args);

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1053);
this.fired = true;

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1055);
if (this.fireOnce) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1056);
this.firedWith = args;
            }

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1059);
if (this.emitFacade) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1060);
return this.fireComplex(args);
            } else {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1062);
return this.fireSimple(args);
            }
        }
    },

    /**
     * Set up for notifying subscribers of non-emitFacade events.
     *
     * @method fireSimple
     * @param args {Array} Arguments passed to fire()
     * @return Boolean false if a subscriber returned false
     * @protected
     */
    fireSimple: function(args) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "fireSimple", 1075);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1076);
this.stopped = 0;
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1077);
this.prevented = 0;
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1078);
if (this.hasSubs()) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1079);
var subs = this.getSubs();
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1080);
this._procSubs(subs[0], args);
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1081);
this._procSubs(subs[1], args);
        }
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1083);
if (this.broadcast) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1084);
this._broadcast(args);
        }
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1086);
return this.stopped ? false : true;
    },

    // Requires the event-custom-complex module for full funcitonality.
    fireComplex: function(args) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "fireComplex", 1090);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1091);
args[0] = args[0] || {};
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1092);
return this.fireSimple(args);
    },

    /**
     * Notifies a list of subscribers.
     *
     * @method _procSubs
     * @param subs {Array} List of subscribers
     * @param args {Array} Arguments passed to fire()
     * @param ef {}
     * @return Boolean false if a subscriber returns false or stops the event
     *              propagation via e.stopPropagation(),
     *              e.stopImmediatePropagation(), or e.halt()
     * @private
     */
    _procSubs: function(subs, args, ef) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_procSubs", 1107);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1108);
var s, i, l;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1110);
for (i = 0, l = subs.length; i < l; i++) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1111);
s = subs[i];
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1112);
if (s && s.fn) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1113);
if (false === this._notify(s, args, ef)) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1114);
this.stopped = 2;
                }
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1116);
if (this.stopped === 2) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1117);
return false;
                }
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1122);
return true;
    },

    /**
     * Notifies the YUI instance if the event is configured with broadcast = 1,
     * and both the YUI instance and Y.Global if configured with broadcast = 2.
     *
     * @method _broadcast
     * @param args {Array} Arguments sent to fire()
     * @private
     */
    _broadcast: function(args) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_broadcast", 1133);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1134);
if (!this.stopped && this.broadcast) {

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1136);
var a = args.concat();
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1137);
a.unshift(this.type);

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1139);
if (this.host !== Y) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1140);
Y.fire.apply(Y, a);
            }

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1143);
if (this.broadcast === 2) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1144);
Y.Global.fire.apply(Y.Global, a);
            }
        }
    },

    /**
     * Removes all listeners
     * @method unsubscribeAll
     * @return {int} The number of listeners unsubscribed.
     * @deprecated use detachAll.
     */
    unsubscribeAll: function() {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "unsubscribeAll", 1155);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1156);
return this.detachAll.apply(this, arguments);
    },

    /**
     * Removes all listeners
     * @method detachAll
     * @return {int} The number of listeners unsubscribed.
     */
    detachAll: function() {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "detachAll", 1164);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1165);
return this.detach();
    },

    /**
     * Deletes the subscriber from the internal store of on() and after()
     * subscribers.
     *
     * @method _delete
     * @param s subscriber object.
     * @param subs (optional) on or after subscriber array
     * @param index (optional) The index found.
     * @private
     */
    _delete: function(s, subs, i) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_delete", 1178);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1179);
var when = s._when;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1181);
if (!subs) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1182);
subs = (when === AFTER) ? this._afters : this._subscribers;
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1185);
if (subs) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1186);
i = YArray.indexOf(subs, s, 0);

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1188);
if (s && subs[i] === s) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1189);
subs.splice(i, 1);
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1193);
if (this._kds) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1194);
if (when === AFTER) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1195);
delete this.afters[s.id];
            } else {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1197);
delete this.subscribers[s.id];
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1201);
if (this.monitored && this.host) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1202);
this.host._monitor('detach', this, {
                ce: this,
                sub: s
            });
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1208);
if (s) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1209);
s.deleted = true;
        }
    }
};
/**
 * Stores the subscriber information to be used when the event fires.
 * @param {Function} fn       The wrapped function to execute.
 * @param {Object}   context  The value of the keyword 'this' in the listener.
 * @param {Array} args*       0..n additional arguments to supply the listener.
 *
 * @class Subscriber
 * @constructor
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1222);
Y.Subscriber = function(fn, context, args, when) {

    /**
     * The callback that will be execute when the event fires
     * This is wrapped by Y.rbind if obj was supplied.
     * @property fn
     * @type Function
     */
    _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "Subscriber", 1222);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1230);
this.fn = fn;

    /**
     * Optional 'this' keyword for the listener
     * @property context
     * @type Object
     */
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1237);
this.context = context;

    /**
     * Unique subscriber id
     * @property id
     * @type String
     */
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1244);
this.id = Y.guid();

    /**
     * Additional arguments to propagate to the subscriber
     * @property args
     * @type Array
     */
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1251);
this.args = args;

    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1253);
this._when = when;

    /**
     * Custom events for a given fire transaction.
     * @property events
     * @type {EventTarget}
     */
    // this.events = null;

    /**
     * This listener only reacts to the event once
     * @property once
     */
    // this.once = false;

};

_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1270);
Y.Subscriber.prototype = {
    constructor: Y.Subscriber,

    _notify: function(c, args, ce) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_notify", 1273);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1274);
if (this.deleted && !this.postponed) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1275);
if (this.postponed) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1276);
delete this.fn;
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1277);
delete this.context;
            } else {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1279);
delete this.postponed;
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1280);
return null;
            }
        }
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1283);
var a = this.args, ret;
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1284);
switch (ce.signature) {
            case 0:
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1286);
ret = this.fn.call(c, ce.type, args, c);
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1287);
break;
            case 1:
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1289);
ret = this.fn.call(c, args[0] || null, c);
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1290);
break;
            default:
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1292);
if (a || args) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1293);
args = args || [];
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1294);
a = (a) ? args.concat(a) : args;
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1295);
ret = this.fn.apply(c, a);
                } else {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1297);
ret = this.fn.call(c);
                }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1301);
if (this.once) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1302);
ce._delete(this);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1305);
return ret;
    },

    /**
     * Executes the subscriber.
     * @method notify
     * @param args {Array} Arguments array for the subscriber.
     * @param ce {CustomEvent} The custom event that sent the notification.
     */
    notify: function(args, ce) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "notify", 1314);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1315);
var c = this.context,
            ret = true;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1318);
if (!c) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1319);
c = (ce.contextFn) ? ce.contextFn() : ce.context;
        }

        // only catch errors if we will not re-throw them.
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1323);
if (Y.config && Y.config.throwFail) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1324);
ret = this._notify(c, args, ce);
        } else {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1326);
try {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1327);
ret = this._notify(c, args, ce);
            } catch (e) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1329);
Y.error(this + ' failed: ' + e.message, e);
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1333);
return ret;
    },

    /**
     * Returns true if the fn and obj match this objects properties.
     * Used by the unsubscribe method to match the right subscriber.
     *
     * @method contains
     * @param {Function} fn the function to execute.
     * @param {Object} context optional 'this' keyword for the listener.
     * @return {boolean} true if the supplied arguments match this
     *                   subscriber's signature.
     */
    contains: function(fn, context) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "contains", 1346);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1347);
if (context) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1348);
return ((this.fn === fn) && this.context === context);
        } else {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1350);
return (this.fn === fn);
        }
    },

    valueOf : function() {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "valueOf", 1354);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1355);
return this.id;
    }

};
/**
 * Return value from all subscribe operations
 * @class EventHandle
 * @constructor
 * @param {CustomEvent} evt the custom event.
 * @param {Subscriber} sub the subscriber.
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1366);
Y.EventHandle = function(evt, sub) {

    /**
     * The custom event
     *
     * @property evt
     * @type CustomEvent
     */
    _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "EventHandle", 1366);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1374);
this.evt = evt;

    /**
     * The subscriber object
     *
     * @property sub
     * @type Subscriber
     */
    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1382);
this.sub = sub;
};

_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1385);
Y.EventHandle.prototype = {
    batch: function(f, c) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "batch", 1386);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1387);
f.call(c || this, this);
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1388);
if (Y.Lang.isArray(this.evt)) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1389);
Y.Array.each(this.evt, function(h) {
                _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "(anonymous 2)", 1389);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1390);
h.batch.call(c || h, f);
            });
        }
    },

    /**
     * Detaches this subscriber
     * @method detach
     * @return {int} the number of detached listeners
     */
    detach: function() {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "detach", 1400);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1401);
var evt = this.evt, detached = 0, i;
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1402);
if (evt) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1403);
if (Y.Lang.isArray(evt)) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1404);
for (i = 0; i < evt.length; i++) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1405);
detached += evt[i].detach();
                }
            } else {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1408);
evt._delete(this.sub);
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1409);
detached = 1;
            }

        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1414);
return detached;
    },

    /**
     * Monitor the event state for the subscribed event.  The first parameter
     * is what should be monitored, the rest are the normal parameters when
     * subscribing to an event.
     * @method monitor
     * @param what {string} what to monitor ('attach', 'detach', 'publish').
     * @return {EventHandle} return value from the monitor event subscription.
     */
    monitor: function(what) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "monitor", 1425);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1426);
return this.evt.monitor.apply(this.evt, arguments);
    }
};

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */

/**
 * EventTarget provides the implementation for any object to
 * publish, subscribe and fire to custom events, and also
 * alows other EventTargets to target the object with events
 * sourced from the other object.
 * EventTarget is designed to be used with Y.augment to wrap
 * EventCustom in an interface that allows events to be listened to
 * and fired by name.  This makes it possible for implementing code to
 * subscribe to an event that either has not been created yet, or will
 * not be created at all.
 * @class EventTarget
 * @param opts a configuration object
 * @config emitFacade {boolean} if true, all events will emit event
 * facade payloads by default (default false)
 * @config prefix {String} the prefix to apply to non-prefixed event names
 */

_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1454);
var L = Y.Lang,
    PREFIX_DELIMITER = ':',
    CATEGORY_DELIMITER = '|',
    AFTER_PREFIX = '~AFTER~',
    WILD_TYPE_RE = /(.*?)(:)(.*?)/,

    _wildType = Y.cached(function(type) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "(anonymous 3)", 1460);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1461);
return type.replace(WILD_TYPE_RE, "*$2$3");
    }),

    /**
     * If the instance has a prefix attribute and the
     * event type is not prefixed, the instance prefix is
     * applied to the supplied type.
     * @method _getType
     * @private
     */
    _getType = function(type, pre) {

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_getType", 1471);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1473);
if (!pre || (typeof type !== "string") || type.indexOf(PREFIX_DELIMITER) > -1) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1474);
return type;
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1477);
return pre + PREFIX_DELIMITER + type;
    },

    /**
     * Returns an array with the detach key (if provided),
     * and the prefixed event name from _getType
     * Y.on('detachcategory| menu:click', fn)
     * @method _parseType
     * @private
     */
    _parseType = Y.cached(function(type, pre) {

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "(anonymous 4)", 1487);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1489);
var t = type, detachcategory, after, i;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1491);
if (!L.isString(t)) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1492);
return t;
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1495);
i = t.indexOf(AFTER_PREFIX);

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1497);
if (i > -1) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1498);
after = true;
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1499);
t = t.substr(AFTER_PREFIX.length);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1502);
i = t.indexOf(CATEGORY_DELIMITER);

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1504);
if (i > -1) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1505);
detachcategory = t.substr(0, (i));
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1506);
t = t.substr(i+1);
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1507);
if (t === '*') {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1508);
t = null;
            }
        }

        // detach category, full type with instance prefix, is this an after listener, short type
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1513);
return [detachcategory, (pre) ? _getType(t, pre) : t, after, t];
    }),

    ET = function(opts) {

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "ET", 1516);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1518);
var etState = this._yuievt,
            etConfig;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1521);
if (!etState) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1522);
etState = this._yuievt = {
                events: {},    // PERF: Not much point instantiating lazily. We're bound to have events
                targets: null, // PERF: Instantiate lazily, if user actually adds target,
                config: {
                    host: this,
                    context: this
                },
                chain: Y.config.chain
            };
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1533);
etConfig = etState.config;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1535);
if (opts) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1536);
mixConfigs(etConfig, opts, true);

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1538);
if (opts.chain !== undefined) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1539);
etState.chain = opts.chain;
            }

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1542);
if (opts.prefix) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1543);
etConfig.prefix = opts.prefix;
            }
        }
    };

_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1548);
ET.prototype = {

    constructor: ET,

    /**
     * Listen to a custom event hosted by this object one time.
     * This is the equivalent to <code>on</code> except the
     * listener is immediatelly detached when it is executed.
     * @method once
     * @param {String} type The name of the event
     * @param {Function} fn The callback to execute in response to the event
     * @param {Object} [context] Override `this` object in callback
     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching the
     *                       subscription
     */
    once: function() {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "once", 1564);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1565);
var handle = this.on.apply(this, arguments);
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1566);
handle.batch(function(hand) {
            _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "(anonymous 5)", 1566);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1567);
if (hand.sub) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1568);
hand.sub.once = true;
            }
        });
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1571);
return handle;
    },

    /**
     * Listen to a custom event hosted by this object one time.
     * This is the equivalent to <code>after</code> except the
     * listener is immediatelly detached when it is executed.
     * @method onceAfter
     * @param {String} type The name of the event
     * @param {Function} fn The callback to execute in response to the event
     * @param {Object} [context] Override `this` object in callback
     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching that
     *                       subscription
     */
    onceAfter: function() {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "onceAfter", 1586);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1587);
var handle = this.after.apply(this, arguments);
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1588);
handle.batch(function(hand) {
            _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "(anonymous 6)", 1588);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1589);
if (hand.sub) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1590);
hand.sub.once = true;
            }
        });
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1593);
return handle;
    },

    /**
     * Takes the type parameter passed to 'on' and parses out the
     * various pieces that could be included in the type.  If the
     * event type is passed without a prefix, it will be expanded
     * to include the prefix one is supplied or the event target
     * is configured with a default prefix.
     * @method parseType
     * @param {String} type the type
     * @param {String} [pre=this._yuievt.config.prefix] the prefix
     * @since 3.3.0
     * @return {Array} an array containing:
     *  * the detach category, if supplied,
     *  * the prefixed event type,
     *  * whether or not this is an after listener,
     *  * the supplied event type
     */
    parseType: function(type, pre) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "parseType", 1612);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1613);
return _parseType(type, pre || this._yuievt.config.prefix);
    },

    /**
     * Subscribe a callback function to a custom event fired by this object or
     * from an object that bubbles its events to this object.
     *
     * Callback functions for events published with `emitFacade = true` will
     * receive an `EventFacade` as the first argument (typically named "e").
     * These callbacks can then call `e.preventDefault()` to disable the
     * behavior published to that event's `defaultFn`.  See the `EventFacade`
     * API for all available properties and methods. Subscribers to
     * non-`emitFacade` events will receive the arguments passed to `fire()`
     * after the event name.
     *
     * To subscribe to multiple events at once, pass an object as the first
     * argument, where the key:value pairs correspond to the eventName:callback,
     * or pass an array of event names as the first argument to subscribe to
     * all listed events with the same callback.
     *
     * Returning `false` from a callback is supported as an alternative to
     * calling `e.preventDefault(); e.stopPropagation();`.  However, it is
     * recommended to use the event methods whenever possible.
     *
     * @method on
     * @param {String} type The name of the event
     * @param {Function} fn The callback to execute in response to the event
     * @param {Object} [context] Override `this` object in callback
     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching that
     *                       subscription
     */
    on: function(type, fn, context) {

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "on", 1645);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1647);
var yuievt = this._yuievt,
            parts = _parseType(type, yuievt.config.prefix), f, c, args, ret, ce,
            detachcategory, handle, store = Y.Env.evt.handles, after, adapt, shorttype,
            Node = Y.Node, n, domevent, isArr;

        // full name, args, detachcategory, after
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1653);
this._monitor('attach', parts[1], {
            args: arguments,
            category: parts[0],
            after: parts[2]
        });

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1659);
if (L.isObject(type)) {

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1661);
if (L.isFunction(type)) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1662);
return Y.Do.before.apply(Y.Do, arguments);
            }

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1665);
f = fn;
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1666);
c = context;
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1667);
args = nativeSlice.call(arguments, 0);
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1668);
ret = [];

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1670);
if (L.isArray(type)) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1671);
isArr = true;
            }

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1674);
after = type._after;
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1675);
delete type._after;

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1677);
Y.each(type, function(v, k) {

                _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "(anonymous 7)", 1677);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1679);
if (L.isObject(v)) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1680);
f = v.fn || ((L.isFunction(v)) ? v : f);
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1681);
c = v.context || c;
                }

                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1684);
var nv = (after) ? AFTER_PREFIX : '';

                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1686);
args[0] = nv + ((isArr) ? v : k);
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1687);
args[1] = f;
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1688);
args[2] = c;

                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1690);
ret.push(this.on.apply(this, args));

            }, this);

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1694);
return (yuievt.chain) ? this : new Y.EventHandle(ret);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1697);
detachcategory = parts[0];
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1698);
after = parts[2];
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1699);
shorttype = parts[3];

        // extra redirection so we catch adaptor events too.  take a look at this.
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1702);
if (Node && Y.instanceOf(this, Node) && (shorttype in Node.DOM_EVENTS)) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1703);
args = nativeSlice.call(arguments, 0);
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1704);
args.splice(2, 0, Node.getDOMNode(this));
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1705);
return Y.on.apply(Y, args);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1708);
type = parts[1];

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1710);
if (Y.instanceOf(this, YUI)) {

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1712);
adapt = Y.Env.evt.plugins[type];
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1713);
args  = nativeSlice.call(arguments, 0);
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1714);
args[0] = shorttype;

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1716);
if (Node) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1717);
n = args[2];

                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1719);
if (Y.instanceOf(n, Y.NodeList)) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1720);
n = Y.NodeList.getDOMNodes(n);
                } else {_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1721);
if (Y.instanceOf(n, Node)) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1722);
n = Node.getDOMNode(n);
                }}

                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1725);
domevent = (shorttype in Node.DOM_EVENTS);

                // Captures both DOM events and event plugins.
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1728);
if (domevent) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1729);
args[2] = n;
                }
            }

            // check for the existance of an event adaptor
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1734);
if (adapt) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1735);
handle = adapt.on.apply(Y, args);
            } else {_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1736);
if ((!type) || domevent) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1737);
handle = Y.Event._attach(args);
            }}

        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1742);
if (!handle) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1743);
ce = yuievt.events[type] || this.publish(type);
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1744);
handle = ce._on(fn, context, (arguments.length > 3) ? nativeSlice.call(arguments, 3) : null, (after) ? 'after' : true);

            // TODO: More robust regex, accounting for category
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1747);
if (type.indexOf("*:") !== -1) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1748);
this._hasSiblings = true;
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1752);
if (detachcategory) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1753);
store[detachcategory] = store[detachcategory] || {};
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1754);
store[detachcategory][type] = store[detachcategory][type] || [];
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1755);
store[detachcategory][type].push(handle);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1758);
return (yuievt.chain) ? this : handle;

    },

    /**
     * subscribe to an event
     * @method subscribe
     * @deprecated use on
     */
    subscribe: function() {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "subscribe", 1767);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1768);
return this.on.apply(this, arguments);
    },

    /**
     * Detach one or more listeners the from the specified event
     * @method detach
     * @param type {string|Object}   Either the handle to the subscriber or the
     *                        type of event.  If the type
     *                        is not specified, it will attempt to remove
     *                        the listener from all hosted events.
     * @param fn   {Function} The subscribed function to unsubscribe, if not
     *                          supplied, all subscribers will be removed.
     * @param context  {Object}   The custom object passed to subscribe.  This is
     *                        optional, but if supplied will be used to
     *                        disambiguate multiple listeners that are the same
     *                        (e.g., you subscribe many object using a function
     *                        that lives on the prototype)
     * @return {EventTarget} the host
     */
    detach: function(type, fn, context) {

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "detach", 1787);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1789);
var evts = this._yuievt.events,
            i,
            Node = Y.Node,
            isNode = Node && (Y.instanceOf(this, Node));

        // detachAll disabled on the Y instance.
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1795);
if (!type && (this !== Y)) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1796);
for (i in evts) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1797);
if (evts.hasOwnProperty(i)) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1798);
evts[i].detach(fn, context);
                }
            }
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1801);
if (isNode) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1802);
Y.Event.purgeElement(Node.getDOMNode(this));
            }

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1805);
return this;
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1808);
var parts = _parseType(type, this._yuievt.config.prefix),
        detachcategory = L.isArray(parts) ? parts[0] : null,
        shorttype = (parts) ? parts[3] : null,
        adapt, store = Y.Env.evt.handles, detachhost, cat, args,
        ce,

        keyDetacher = function(lcat, ltype, host) {
            _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "keyDetacher", 1814);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1815);
var handles = lcat[ltype], ce, i;
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1816);
if (handles) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1817);
for (i = handles.length - 1; i >= 0; --i) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1818);
ce = handles[i].evt;
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1819);
if (ce.host === host || ce.el === host) {
                        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1820);
handles[i].detach();
                    }
                }
            }
        };

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1826);
if (detachcategory) {

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1828);
cat = store[detachcategory];
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1829);
type = parts[1];
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1830);
detachhost = (isNode) ? Y.Node.getDOMNode(this) : this;

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1832);
if (cat) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1833);
if (type) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1834);
keyDetacher(cat, type, detachhost);
                } else {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1836);
for (i in cat) {
                        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1837);
if (cat.hasOwnProperty(i)) {
                            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1838);
keyDetacher(cat, i, detachhost);
                        }
                    }
                }

                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1843);
return this;
            }

        // If this is an event handle, use it to detach
        } else {_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1847);
if (L.isObject(type) && type.detach) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1848);
type.detach();
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1849);
return this;
        // extra redirection so we catch adaptor events too.  take a look at this.
        } else {_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1851);
if (isNode && ((!shorttype) || (shorttype in Node.DOM_EVENTS))) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1852);
args = nativeSlice.call(arguments, 0);
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1853);
args[2] = Node.getDOMNode(this);
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1854);
Y.detach.apply(Y, args);
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1855);
return this;
        }}}

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1858);
adapt = Y.Env.evt.plugins[shorttype];

        // The YUI instance handles DOM events and adaptors
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1861);
if (Y.instanceOf(this, YUI)) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1862);
args = nativeSlice.call(arguments, 0);
            // use the adaptor specific detach code if
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1864);
if (adapt && adapt.detach) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1865);
adapt.detach.apply(Y, args);
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1866);
return this;
            // DOM event fork
            } else {_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1868);
if (!type || (!adapt && Node && (type in Node.DOM_EVENTS))) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1869);
args[0] = type;
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1870);
Y.Event.detach.apply(Y.Event, args);
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1871);
return this;
            }}
        }

        // ce = evts[type];
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1876);
ce = evts[parts[1]];
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1877);
if (ce) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1878);
ce.detach(fn, context);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1881);
return this;
    },

    /**
     * detach a listener
     * @method unsubscribe
     * @deprecated use detach
     */
    unsubscribe: function() {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "unsubscribe", 1889);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1890);
return this.detach.apply(this, arguments);
    },

    /**
     * Removes all listeners from the specified event.  If the event type
     * is not specified, all listeners from all hosted custom events will
     * be removed.
     * @method detachAll
     * @param type {String}   The type, or name of the event
     */
    detachAll: function(type) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "detachAll", 1900);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1901);
return this.detach(type);
    },

    /**
     * Removes all listeners from the specified event.  If the event type
     * is not specified, all listeners from all hosted custom events will
     * be removed.
     * @method unsubscribeAll
     * @param type {String}   The type, or name of the event
     * @deprecated use detachAll
     */
    unsubscribeAll: function() {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "unsubscribeAll", 1912);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1913);
return this.detachAll.apply(this, arguments);
    },

    /**
     * Creates a new custom event of the specified type.  If a custom event
     * by that name already exists, it will not be re-created.  In either
     * case the custom event is returned.
     *
     * @method publish
     *
     * @param type {String} the type, or name of the event
     * @param opts {object} optional config params.  Valid properties are:
     *
     *  <ul>
     *    <li>
     *   'broadcast': whether or not the YUI instance and YUI global are notified when the event is fired (false)
     *    </li>
     *    <li>
     *   'bubbles': whether or not this event bubbles (true)
     *              Events can only bubble if emitFacade is true.
     *    </li>
     *    <li>
     *   'context': the default execution context for the listeners (this)
     *    </li>
     *    <li>
     *   'defaultFn': the default function to execute when this event fires if preventDefault was not called
     *    </li>
     *    <li>
     *   'emitFacade': whether or not this event emits a facade (false)
     *    </li>
     *    <li>
     *   'prefix': the prefix for this targets events, e.g., 'menu' in 'menu:click'
     *    </li>
     *    <li>
     *   'fireOnce': if an event is configured to fire once, new subscribers after
     *   the fire will be notified immediately.
     *    </li>
     *    <li>
     *   'async': fireOnce event listeners will fire synchronously if the event has already
     *    fired unless async is true.
     *    </li>
     *    <li>
     *   'preventable': whether or not preventDefault() has an effect (true)
     *    </li>
     *    <li>
     *   'preventedFn': a function that is executed when preventDefault is called
     *    </li>
     *    <li>
     *   'queuable': whether or not this event can be queued during bubbling (false)
     *    </li>
     *    <li>
     *   'silent': if silent is true, debug messages are not provided for this event.
     *    </li>
     *    <li>
     *   'stoppedFn': a function that is executed when stopPropagation is called
     *    </li>
     *
     *    <li>
     *   'monitored': specifies whether or not this event should send notifications about
     *   when the event has been attached, detached, or published.
     *    </li>
     *    <li>
     *   'type': the event type (valid option if not provided as the first parameter to publish)
     *    </li>
     *  </ul>
     *
     *  @return {CustomEvent} the custom event
     *
     */
    publish: function(type, opts) {

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "publish", 1982);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1984);
var ret,
            etState = this._yuievt,
            etConfig = etState.config,
            pre = etConfig.prefix;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1989);
if (typeof type === "string")  {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1990);
if (pre) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1991);
type = _getType(type, pre);
            }
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1993);
ret = this._publish(type, etConfig, opts);
        } else {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1995);
ret = {};

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1997);
Y.each(type, function(v, k) {
                _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "(anonymous 8)", 1997);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 1998);
if (pre) {
                    _yuitest_coverline("build/event-custom-base/event-custom-base.js", 1999);
k = _getType(k, pre);
                }
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2001);
ret[k] = this._publish(k, etConfig, v || opts);
            }, this);

        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2006);
return ret;
    },

    /**
     * Returns the fully qualified type, given a short type string.
     * That is, returns "foo:bar" when given "bar" if "foo" is the configured prefix.
     *
     * NOTE: This method, unlike _getType, does no checking of the value passed in, and
     * is designed to be used with the low level _publish() method, for critical path
     * implementations which need to fast-track publish for performance reasons.
     *
     * @method _getFullType
     * @private
     * @param {String} type The short type to prefix
     * @return {String} The prefixed type, if a prefix is set, otherwise the type passed in
     */
    _getFullType : function(type) {

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_getFullType", 2022);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2024);
var pre = this._yuievt.config.prefix;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2026);
if (pre) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2027);
return pre + PREFIX_DELIMITER + type;
        } else {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2029);
return type;
        }
    },

    /**
     * The low level event publish implementation. It expects all the massaging to have been done
     * outside of this method. e.g. the `type` to `fullType` conversion. It's designed to be a fast
     * path publish, which can be used by critical code paths to improve performance.
     *
     * @method _publish
     * @private
     * @param {String} fullType The prefixed type of the event to publish.
     * @param {Object} etOpts The EventTarget specific configuration to mix into the published event.
     * @param {Object} ceOpts The publish specific configuration to mix into the published event.
     * @return {CustomEvent} The published event. If called without `etOpts` or `ceOpts`, this will
     * be the default `CustomEvent` instance, and can be configured independently.
     */
    _publish : function(fullType, etOpts, ceOpts) {

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_publish", 2046);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2048);
var ce,
            etState = this._yuievt,
            etConfig = etState.config,
            host = etConfig.host,
            context = etConfig.context,
            events = etState.events;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2055);
ce = events[fullType];

        // PERF: Hate to pull the check out of monitor, but trying to keep critical path tight.
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2058);
if ((etConfig.monitored && !ce) || (ce && ce.monitored)) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2059);
this._monitor('publish', fullType, {
                args: arguments
            });
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2064);
if (!ce) {
            // Publish event
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2066);
ce = events[fullType] = new Y.CustomEvent(fullType, etOpts);

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2068);
if (!etOpts) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2069);
ce.host = host;
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2070);
ce.context = context;
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2074);
if (ceOpts) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2075);
mixConfigs(ce, ceOpts, true);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2078);
return ce;
    },

    /**
     * This is the entry point for the event monitoring system.
     * You can monitor 'attach', 'detach', 'fire', and 'publish'.
     * When configured, these events generate an event.  click ->
     * click_attach, click_detach, click_publish -- these can
     * be subscribed to like other events to monitor the event
     * system.  Inividual published events can have monitoring
     * turned on or off (publish can't be turned off before it
     * it published) by setting the events 'monitor' config.
     *
     * @method _monitor
     * @param what {String} 'attach', 'detach', 'fire', or 'publish'
     * @param eventType {String|CustomEvent} The prefixed name of the event being monitored, or the CustomEvent object.
     * @param o {Object} Information about the event interaction, such as
     *                  fire() args, subscription category, publish config
     * @private
     */
    _monitor: function(what, eventType, o) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "_monitor", 2098);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2099);
var monitorevt, ce, type;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2101);
if (eventType) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2102);
if (typeof eventType === "string") {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2103);
type = eventType;
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2104);
ce = this.getEvent(eventType, true);
            } else {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2106);
ce = eventType;
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2107);
type = eventType.type;
            }

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2110);
if ((this._yuievt.config.monitored && (!ce || ce.monitored)) || (ce && ce.monitored)) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2111);
monitorevt = type + '_' + what;
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2112);
o.monitored = what;
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2113);
this.fire.call(this, monitorevt, o);
            }
        }
    },

    /**
     * Fire a custom event by name.  The callback functions will be executed
     * from the context specified when the event was created, and with the
     * following parameters.
     *
     * The first argument is the event type, and any additional arguments are
     * passed to the listeners as parameters.  If the first of these is an
     * object literal, and the event is configured to emit an event facade,
     * that object is mixed into the event facade and the facade is provided
     * in place of the original object.
     *
     * If the custom event object hasn't been created, then the event hasn't
     * been published and it has no subscribers.  For performance sake, we
     * immediate exit in this case.  This means the event won't bubble, so
     * if the intention is that a bubble target be notified, the event must
     * be published on this object first.
     *
     * @method fire
     * @param type {String|Object} The type of the event, or an object that contains
     * a 'type' property.
     * @param arguments {Object*} an arbitrary set of parameters to pass to
     * the handler.  If the first of these is an object literal and the event is
     * configured to emit an event facade, the event facade will replace that
     * parameter after the properties the object literal contains are copied to
     * the event facade.
     * @return {Boolean} True if the whole lifecycle of the event went through,
     * false if at any point the event propagation was halted.
     */
    fire: function(type) {

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "fire", 2146);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2148);
var typeIncluded = (typeof type === "string"),
            argCount = arguments.length,
            t = type,
            yuievt = this._yuievt,
            etConfig = yuievt.config,
            pre = etConfig.prefix,
            ret,
            ce,
            ce2,
            args;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2159);
if (typeIncluded && argCount <= 3) {

            // PERF: Try to avoid slice/iteration for the common signatures

            // Most common
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2164);
if (argCount === 2) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2165);
args = [arguments[1]]; // fire("foo", {})
            } else {_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2166);
if (argCount === 3) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2167);
args = [arguments[1], arguments[2]]; // fire("foo", {}, opts)
            } else {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2169);
args = []; // fire("foo")
            }}

        } else {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2173);
args = nativeSlice.call(arguments, ((typeIncluded) ? 1 : 0));
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2176);
if (!typeIncluded) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2177);
t = (type && type.type);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2180);
if (pre) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2181);
t = _getType(t, pre);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2184);
ce = yuievt.events[t];

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2186);
if (this._hasSiblings) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2187);
ce2 = this.getSibling(t, ce);

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2189);
if (ce2 && !ce) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2190);
ce = this.publish(t);
            }
        }

        // PERF: trying to avoid function call, since this is a critical path
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2195);
if ((etConfig.monitored && (!ce || ce.monitored)) || (ce && ce.monitored)) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2196);
this._monitor('fire', (ce || t), {
                args: args
            });
        }

        // this event has not been published or subscribed to
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2202);
if (!ce) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2203);
if (yuievt.hasTargets) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2204);
return this.bubble({ type: t }, args, this);
            }

            // otherwise there is nothing to be done
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2208);
ret = true;
        } else {

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2211);
if (ce2) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2212);
ce.sibling = ce2;
            }

            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2215);
ret = ce._fire(args);
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2218);
return (yuievt.chain) ? this : ret;
    },

    getSibling: function(type, ce) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "getSibling", 2221);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2222);
var ce2;

        // delegate to *:type events if there are subscribers
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2225);
if (type.indexOf(PREFIX_DELIMITER) > -1) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2226);
type = _wildType(type);
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2227);
ce2 = this.getEvent(type, true);
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2228);
if (ce2) {
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2229);
ce2.applyConfig(ce);
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2230);
ce2.bubbles = false;
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2231);
ce2.broadcast = 0;
            }
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2235);
return ce2;
    },

    /**
     * Returns the custom event of the provided type has been created, a
     * falsy value otherwise
     * @method getEvent
     * @param type {String} the type, or name of the event
     * @param prefixed {String} if true, the type is prefixed already
     * @return {CustomEvent} the custom event or null
     */
    getEvent: function(type, prefixed) {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "getEvent", 2246);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2247);
var pre, e;

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2249);
if (!prefixed) {
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2250);
pre = this._yuievt.config.prefix;
            _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2251);
type = (pre) ? _getType(type, pre) : type;
        }
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2253);
e = this._yuievt.events;
        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2254);
return e[type] || null;
    },

    /**
     * Subscribe to a custom event hosted by this object.  The
     * supplied callback will execute after any listeners add
     * via the subscribe method, and after the default function,
     * if configured for the event, has executed.
     *
     * @method after
     * @param {String} type The name of the event
     * @param {Function} fn The callback to execute in response to the event
     * @param {Object} [context] Override `this` object in callback
     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching the
     *                       subscription
     */
    after: function(type, fn) {

        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "after", 2271);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2273);
var a = nativeSlice.call(arguments, 0);

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2275);
switch (L.type(type)) {
            case 'function':
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2277);
return Y.Do.after.apply(Y.Do, arguments);
            case 'array':
            //     YArray.each(a[0], function(v) {
            //         v = AFTER_PREFIX + v;
            //     });
            //     break;
            case 'object':
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2284);
a[0]._after = true;
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2285);
break;
            default:
                _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2287);
a[0] = AFTER_PREFIX + type;
        }

        _yuitest_coverline("build/event-custom-base/event-custom-base.js", 2290);
return this.on.apply(this, a);

    },

    /**
     * Executes the callback before a DOM event, custom event
     * or method.  If the first argument is a function, it
     * is assumed the target is a method.  For DOM and custom
     * events, this is an alias for Y.on.
     *
     * For DOM and custom events:
     * type, callback, context, 0-n arguments
     *
     * For methods:
     * callback, object (method host), methodName, context, 0-n arguments
     *
     * @method before
     * @return detach handle
     */
    before: function() {
        _yuitest_coverfunc("build/event-custom-base/event-custom-base.js", "before", 2309);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2310);
return this.on.apply(this, arguments);
    }

};

_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2315);
Y.EventTarget = ET;

// make Y an event target
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2318);
Y.mix(Y, ET.prototype);
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2319);
ET.call(Y, { bubbles: false });

_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2321);
YUI.Env.globalEvents = YUI.Env.globalEvents || new ET();

/**
 * Hosts YUI page level events.  This is where events bubble to
 * when the broadcast config is set to 2.  This property is
 * only available if the custom event module is loaded.
 * @property Global
 * @type EventTarget
 * @for YUI
 */
_yuitest_coverline("build/event-custom-base/event-custom-base.js", 2331);
Y.Global = YUI.Env.globalEvents;

// @TODO implement a global namespace function on Y.Global?

/**
`Y.on()` can do many things:

<ul>
    <li>Subscribe to custom events `publish`ed and `fire`d from Y</li>
    <li>Subscribe to custom events `publish`ed with `broadcast` 1 or 2 and
        `fire`d from any object in the YUI instance sandbox</li>
    <li>Subscribe to DOM events</li>
    <li>Subscribe to the execution of a method on any object, effectively
    treating that method as an event</li>
</ul>

For custom event subscriptions, pass the custom event name as the first argument
and callback as the second. The `this` object in the callback will be `Y` unless
an override is passed as the third argument.

    Y.on('io:complete', function () {
        Y.MyApp.updateStatus('Transaction complete');
    });

To subscribe to DOM events, pass the name of a DOM event as the first argument
and a CSS selector string as the third argument after the callback function.
Alternately, the third argument can be a `Node`, `NodeList`, `HTMLElement`,
array, or simply omitted (the default is the `window` object).

    Y.on('click', function (e) {
        e.preventDefault();

        // proceed with ajax form submission
        var url = this.get('action');
        ...
    }, '#my-form');

The `this` object in DOM event callbacks will be the `Node` targeted by the CSS
selector or other identifier.

`on()` subscribers for DOM events or custom events `publish`ed with a
`defaultFn` can prevent the default behavior with `e.preventDefault()` from the
event object passed as the first parameter to the subscription callback.

To subscribe to the execution of an object method, pass arguments corresponding to the call signature for
<a href="../classes/Do.html#methods_before">`Y.Do.before(...)`</a>.

NOTE: The formal parameter list below is for events, not for function
injection.  See `Y.Do.before` for that signature.

@method on
@param {String} type DOM or custom event name
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [arg*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching the
                      subscription
@see Do.before
@for YUI
**/

/**
Listen for an event one time.  Equivalent to `on()`, except that
the listener is immediately detached when executed.

See the <a href="#methods_on">`on()` method</a> for additional subscription
options.

@see on
@method once
@param {String} type DOM or custom event name
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [arg*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching the
                      subscription
@for YUI
**/

/**
Listen for an event one time.  Equivalent to `once()`, except, like `after()`,
the subscription callback executes after all `on()` subscribers and the event's
`defaultFn` (if configured) have executed.  Like `after()` if any `on()` phase
subscriber calls `e.preventDefault()`, neither the `defaultFn` nor the `after()`
subscribers will execute.

The listener is immediately detached when executed.

See the <a href="#methods_on">`on()` method</a> for additional subscription
options.

@see once
@method onceAfter
@param {String} type The custom event name
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [arg*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching the
                      subscription
@for YUI
**/

/**
Like `on()`, this method creates a subscription to a custom event or to the
execution of a method on an object.

For events, `after()` subscribers are executed after the event's
`defaultFn` unless `e.preventDefault()` was called from an `on()` subscriber.

See the <a href="#methods_on">`on()` method</a> for additional subscription
options.

NOTE: The subscription signature shown is for events, not for function
injection.  See <a href="../classes/Do.html#methods_after">`Y.Do.after`</a>
for that signature.

@see on
@see Do.after
@method after
@param {String} type The custom event name
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [args*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching the
                      subscription
@for YUI
**/


}, '@VERSION@', {"requires": ["oop"]});
