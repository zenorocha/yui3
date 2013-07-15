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
_yuitest_coverage["build/event-synthetic/event-synthetic.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-synthetic/event-synthetic.js",
    code: []
};
_yuitest_coverage["build/event-synthetic/event-synthetic.js"].code=["YUI.add('event-synthetic', function (Y, NAME) {","","/**"," * Define new DOM events that can be subscribed to from Nodes."," *"," * @module event"," * @submodule event-synthetic"," */","var CustomEvent = Y.CustomEvent,","    DOMMap   = Y.Env.evt.dom_map,","    toArray  = Y.Array,","    YLang    = Y.Lang,","    isObject = YLang.isObject,","    isString = YLang.isString,","    isArray  = YLang.isArray,","    query    = Y.Selector.query,","    noop     = function () {};","","/**"," * <p>The triggering mechanism used by SyntheticEvents.</p>"," *"," * <p>Implementers should not instantiate these directly.  Use the Notifier"," * provided to the event's implemented <code>on(node, sub, notifier)</code> or"," * <code>delegate(node, sub, notifier, filter)</code> methods.</p>"," *"," * @class SyntheticEvent.Notifier"," * @constructor"," * @param handle {EventHandle} the detach handle for the subscription to an"," *              internal custom event used to execute the callback passed to"," *              on(..) or delegate(..)"," * @param emitFacade {Boolean} take steps to ensure the first arg received by"," *              the subscription callback is an event facade"," * @private"," * @since 3.2.0"," */","function Notifier(handle, emitFacade) {","    this.handle     = handle;","    this.emitFacade = emitFacade;","}","","/**"," * <p>Executes the subscription callback, passing the firing arguments as the"," * first parameters to that callback. For events that are configured with"," * emitFacade=true, it is common practice to pass the triggering DOMEventFacade"," * as the first parameter.  Barring a proper DOMEventFacade or EventFacade"," * (from a CustomEvent), a new EventFacade will be generated.  In that case, if"," * fire() is called with a simple object, it will be mixed into the facade."," * Otherwise, the facade will be prepended to the callback parameters.</p>"," *"," * <p>For notifiers provided to delegate logic, the first argument should be an"," * object with a &quot;currentTarget&quot; property to identify what object to"," * default as 'this' in the callback.  Typically this is gleaned from the"," * DOMEventFacade or EventFacade, but if configured with emitFacade=false, an"," * object must be provided.  In that case, the object will be removed from the"," * callback parameters.</p>"," *"," * <p>Additional arguments passed during event subscription will be"," * automatically added after those passed to fire().</p>"," *"," * @method fire"," * @param e {EventFacade|DOMEventFacade|Object|any} (see description)"," * @param arg* {any} additional arguments received by all subscriptions"," * @private"," */","Notifier.prototype.fire = function (e) {","    // first arg to delegate notifier should be an object with currentTarget","    var args     = toArray(arguments, 0, true),","        handle   = this.handle,","        ce       = handle.evt,","        sub      = handle.sub,","        thisObj  = sub.context,","        delegate = sub.filter,","        event    = e || {},","        ret;","","    if (this.emitFacade) {","        if (!e || !e.preventDefault) {","            event = ce._getFacade();","","            if (isObject(e) && !e.preventDefault) {","                Y.mix(event, e, true);","                args[0] = event;","            } else {","                args.unshift(event);","            }","        }","","        event.type    = ce.type;","        event.details = args.slice();","","        if (delegate) {","            event.container = ce.host;","        }","    } else if (delegate && isObject(e) && e.currentTarget) {","        args.shift();","    }","","    sub.context = thisObj || event.currentTarget || ce.host;","    ret = ce.fire.apply(ce, args);","    sub.context = thisObj; // reset for future firing","","    // to capture callbacks that return false to stopPropagation.","    // Useful for delegate implementations","    return ret;","};","","/**"," * Manager object for synthetic event subscriptions to aggregate multiple synths on the"," * same node without colliding with actual DOM subscription entries in the global map of"," * DOM subscriptions.  Also facilitates proper cleanup on page unload."," *"," * @class SynthRegistry"," * @constructor"," * @param el {HTMLElement} the DOM element"," * @param yuid {String} the yuid stamp for the element"," * @param key {String} the generated id token used to identify an event type +"," *                     element in the global DOM subscription map."," * @private"," */","function SynthRegistry(el, yuid, key) {","    this.handles = [];","    this.el      = el;","    this.key     = key;","    this.domkey  = yuid;","}","","SynthRegistry.prototype = {","    constructor: SynthRegistry,","","    // A few object properties to fake the CustomEvent interface for page","    // unload cleanup.  DON'T TOUCH!","    type      : '_synth',","    fn        : noop,","    capture   : false,","","    /**","     * Adds a subscription from the Notifier registry.","     *","     * @method register","     * @param handle {EventHandle} the subscription","     * @since 3.4.0","     */","    register: function (handle) {","        handle.evt.registry = this;","        this.handles.push(handle);","    },","","    /**","     * Removes the subscription from the Notifier registry.","     *","     * @method _unregisterSub","     * @param sub {Subscription} the subscription","     * @since 3.4.0","     */","    unregister: function (sub) {","        var handles = this.handles,","            events = DOMMap[this.domkey],","            i;","","        for (i = handles.length - 1; i >= 0; --i) {","            if (handles[i].sub === sub) {","                handles.splice(i, 1);","                break;","            }","        }","","        // Clean up left over objects when there are no more subscribers.","        if (!handles.length) {","            delete events[this.key];","            if (!Y.Object.size(events)) {","                delete DOMMap[this.domkey];","            }","        }","    },","","    /**","     * Used by the event system's unload cleanup process.  When navigating","     * away from the page, the event system iterates the global map of element","     * subscriptions and detaches everything using detachAll().  Normally,","     * the map is populated with custom events, so this object needs to","     * at least support the detachAll method to duck type its way to","     * cleanliness.","     *","     * @method detachAll","     * @private","     * @since 3.4.0","     */","    detachAll : function () {","        var handles = this.handles,","            i = handles.length;","","        while (--i >= 0) {","            handles[i].detach();","        }","    }","};","","/**"," * <p>Wrapper class for the integration of new events into the YUI event"," * infrastructure.  Don't instantiate this object directly, use"," * <code>Y.Event.define(type, config)</code>.  See that method for details.</p>"," *"," * <p>Properties that MAY or SHOULD be specified in the configuration are noted"," * below and in the description of <code>Y.Event.define</code>.</p>"," *"," * @class SyntheticEvent"," * @constructor"," * @param cfg {Object} Implementation pieces and configuration"," * @since 3.1.0"," * @in event-synthetic"," */","function SyntheticEvent() {","    this._init.apply(this, arguments);","}","","Y.mix(SyntheticEvent, {","    Notifier: Notifier,","    SynthRegistry: SynthRegistry,","","    /**","     * Returns the array of subscription handles for a node for the given event","     * type.  Passing true as the third argument will create a registry entry","     * in the event system's DOM map to host the array if one doesn't yet exist.","     *","     * @method getRegistry","     * @param node {Node} the node","     * @param type {String} the event","     * @param create {Boolean} create a registration entry to host a new array","     *                  if one doesn't exist.","     * @return {Array}","     * @static","     * @protected","     * @since 3.2.0","     */","    getRegistry: function (node, type, create) {","        var el     = node._node,","            yuid   = Y.stamp(el),","            key    = 'event:' + yuid + type + '_synth',","            events = DOMMap[yuid];","","        if (create) {","            if (!events) {","                events = DOMMap[yuid] = {};","            }","            if (!events[key]) {","                events[key] = new SynthRegistry(el, yuid, key);","            }","        }","","        return (events && events[key]) || null;","    },","","    /**","     * Alternate <code>_delete()</code> method for the CustomEvent object","     * created to manage SyntheticEvent subscriptions.","     *","     * @method _deleteSub","     * @param sub {Subscription} the subscription to clean up","     * @private","     * @since 3.2.0","     */","    _deleteSub: function (sub) {","        if (sub && sub.fn) {","            var synth = this.eventDef,","                method = (sub.filter) ? 'detachDelegate' : 'detach';","","            this._subscribers = [];","","            if (CustomEvent.keepDeprecatedSubs) {","                this.subscribers = {};","            }","","            synth[method](sub.node, sub, this.notifier, sub.filter);","            this.registry.unregister(sub);","","            delete sub.fn;","            delete sub.node;","            delete sub.context;","        }","    },","","    prototype: {","        constructor: SyntheticEvent,","","        /**","         * Construction logic for the event.","         *","         * @method _init","         * @protected","         */","        _init: function () {","            var config = this.publishConfig || (this.publishConfig = {});","","            // The notification mechanism handles facade creation","            this.emitFacade = ('emitFacade' in config) ?","                                config.emitFacade :","                                true;","            config.emitFacade  = false;","        },","","        /**","         * <p>Implementers MAY provide this method definition.</p>","         *","         * <p>Implement this function if the event supports a different","         * subscription signature.  This function is used by both","         * <code>on()</code> and <code>delegate()</code>.  The second parameter","         * indicates that the event is being subscribed via","         * <code>delegate()</code>.</p>","         *","         * <p>Implementations must remove extra arguments from the args list","         * before returning.  The required args for <code>on()</code>","         * subscriptions are</p>","         * <pre><code>[type, callback, target, context, argN...]</code></pre>","         *","         * <p>The required args for <code>delegate()</code>","         * subscriptions are</p>","         *","         * <pre><code>[type, callback, target, filter, context, argN...]</code></pre>","         *","         * <p>The return value from this function will be stored on the","         * subscription in the '_extra' property for reference elsewhere.</p>","         *","         * @method processArgs","         * @param args {Array} parmeters passed to Y.on(..) or Y.delegate(..)","         * @param delegate {Boolean} true if the subscription is from Y.delegate","         * @return {any}","         */","        processArgs: noop,","","        /**","         * <p>Implementers MAY override this property.</p>","         *","         * <p>Whether to prevent multiple subscriptions to this event that are","         * classified as being the same.  By default, this means the subscribed","         * callback is the same function.  See the <code>subMatch</code>","         * method.  Setting this to true will impact performance for high volume","         * events.</p>","         *","         * @property preventDups","         * @type {Boolean}","         * @default false","         */","        //preventDups  : false,","","        /**","         * <p>Implementers SHOULD provide this method definition.</p>","         *","         * Implementation logic for subscriptions done via <code>node.on(type,","         * fn)</code> or <code>Y.on(type, fn, target)</code>.  This","         * function should set up the monitor(s) that will eventually fire the","         * event.  Typically this involves subscribing to at least one DOM","         * event.  It is recommended to store detach handles from any DOM","         * subscriptions to make for easy cleanup in the <code>detach</code>","         * method.  Typically these handles are added to the <code>sub</code>","         * object.  Also for SyntheticEvents that leverage a single DOM","         * subscription under the hood, it is recommended to pass the DOM event","         * object to <code>notifier.fire(e)</code>.  (The event name on the","         * object will be updated).","         *","         * @method on","         * @param node {Node} the node the subscription is being applied to","         * @param sub {Subscription} the object to track this subscription","         * @param notifier {SyntheticEvent.Notifier} call notifier.fire(..) to","         *              trigger the execution of the subscribers","         */","        on: noop,","","        /**","         * <p>Implementers SHOULD provide this method definition.</p>","         *","         * <p>Implementation logic for detaching subscriptions done via","         * <code>node.on(type, fn)</code>.  This function should clean up any","         * subscriptions made in the <code>on()</code> phase.</p>","         *","         * @method detach","         * @param node {Node} the node the subscription was applied to","         * @param sub {Subscription} the object tracking this subscription","         * @param notifier {SyntheticEvent.Notifier} the Notifier used to","         *              trigger the execution of the subscribers","         */","        detach: noop,","","        /**","         * <p>Implementers SHOULD provide this method definition.</p>","         *","         * <p>Implementation logic for subscriptions done via","         * <code>node.delegate(type, fn, filter)</code> or","         * <code>Y.delegate(type, fn, container, filter)</code>.  Like with","         * <code>on()</code> above, this function should monitor the environment","         * for the event being fired, and trigger subscription execution by","         * calling <code>notifier.fire(e)</code>.</p>","         *","         * <p>This function receives a fourth argument, which is the filter","         * used to identify which Node's are of interest to the subscription.","         * The filter will be either a boolean function that accepts a target","         * Node for each hierarchy level as the event bubbles, or a selector","         * string.  To translate selector strings into filter functions, use","         * <code>Y.delegate.compileFilter(filter)</code>.</p>","         *","         * @method delegate","         * @param node {Node} the node the subscription is being applied to","         * @param sub {Subscription} the object to track this subscription","         * @param notifier {SyntheticEvent.Notifier} call notifier.fire(..) to","         *              trigger the execution of the subscribers","         * @param filter {String|Function} Selector string or function that","         *              accepts an event object and returns null, a Node, or an","         *              array of Nodes matching the criteria for processing.","         * @since 3.2.0","         */","        delegate       : noop,","","        /**","         * <p>Implementers SHOULD provide this method definition.</p>","         *","         * <p>Implementation logic for detaching subscriptions done via","         * <code>node.delegate(type, fn, filter)</code> or","         * <code>Y.delegate(type, fn, container, filter)</code>.  This function","         * should clean up any subscriptions made in the","         * <code>delegate()</code> phase.</p>","         *","         * @method detachDelegate","         * @param node {Node} the node the subscription was applied to","         * @param sub {Subscription} the object tracking this subscription","         * @param notifier {SyntheticEvent.Notifier} the Notifier used to","         *              trigger the execution of the subscribers","         * @param filter {String|Function} Selector string or function that","         *              accepts an event object and returns null, a Node, or an","         *              array of Nodes matching the criteria for processing.","         * @since 3.2.0","         */","        detachDelegate : noop,","","        /**","         * Sets up the boilerplate for detaching the event and facilitating the","         * execution of subscriber callbacks.","         *","         * @method _on","         * @param args {Array} array of arguments passed to","         *              <code>Y.on(...)</code> or <code>Y.delegate(...)</code>","         * @param delegate {Boolean} true if called from","         * <code>Y.delegate(...)</code>","         * @return {EventHandle} the detach handle for this subscription","         * @private","         * since 3.2.0","         */","        _on: function (args, delegate) {","            var handles  = [],","                originalArgs = args.slice(),","                extra    = this.processArgs(args, delegate),","                selector = args[2],","                method   = delegate ? 'delegate' : 'on',","                nodes, handle;","","            // Can't just use Y.all because it doesn't support window (yet?)","            nodes = (isString(selector)) ?","                query(selector) :","                toArray(selector || Y.one(Y.config.win));","","            if (!nodes.length && isString(selector)) {","                handle = Y.on('available', function () {","                    Y.mix(handle, Y[method].apply(Y, originalArgs), true);","                }, selector);","","                return handle;","            }","","            Y.Array.each(nodes, function (node) {","                var subArgs = args.slice(),","                    filter;","","                node = Y.one(node);","","                if (node) {","                    if (delegate) {","                        filter = subArgs.splice(3, 1)[0];","                    }","","                    // (type, fn, el, thisObj, ...) => (fn, thisObj, ...)","                    subArgs.splice(0, 4, subArgs[1], subArgs[3]);","","                    if (!this.preventDups ||","                        !this.getSubs(node, args, null, true))","                    {","                        handles.push(this._subscribe(node, method, subArgs, extra, filter));","                    }","                }","            }, this);","","            return (handles.length === 1) ?","                handles[0] :","                new Y.EventHandle(handles);","        },","","        /**","         * Creates a new Notifier object for use by this event's","         * <code>on(...)</code> or <code>delegate(...)</code> implementation","         * and register the custom event proxy in the DOM system for cleanup.","         *","         * @method _subscribe","         * @param node {Node} the Node hosting the event","         * @param method {String} \"on\" or \"delegate\"","         * @param args {Array} the subscription arguments passed to either","         *              <code>Y.on(...)</code> or <code>Y.delegate(...)</code>","         *              after running through <code>processArgs(args)</code> to","         *              normalize the argument signature","         * @param extra {any} Extra data parsed from","         *              <code>processArgs(args)</code>","         * @param filter {String|Function} the selector string or function","         *              filter passed to <code>Y.delegate(...)</code> (not","         *              present when called from <code>Y.on(...)</code>)","         * @return {EventHandle}","         * @private","         * @since 3.2.0","         */","        _subscribe: function (node, method, args, extra, filter) {","            var dispatcher = new Y.CustomEvent(this.type, this.publishConfig),","                handle     = dispatcher.on.apply(dispatcher, args),","                notifier   = new Notifier(handle, this.emitFacade),","                registry   = SyntheticEvent.getRegistry(node, this.type, true),","                sub        = handle.sub;","","            sub.node   = node;","            sub.filter = filter;","            if (extra) {","                this.applyArgExtras(extra, sub);","            }","","            Y.mix(dispatcher, {","                eventDef     : this,","                notifier     : notifier,","                host         : node,       // I forget what this is for","                currentTarget: node,       // for generating facades","                target       : node,       // for generating facades","                el           : node._node, // For category detach","","                _delete      : SyntheticEvent._deleteSub","            }, true);","","            handle.notifier = notifier;","","            registry.register(handle);","","            // Call the implementation's \"on\" or \"delegate\" method","            this[method](node, sub, notifier, filter);","","            return handle;","        },","","        /**","         * <p>Implementers MAY provide this method definition.</p>","         *","         * <p>Implement this function if you want extra data extracted during","         * processArgs to be propagated to subscriptions on a per-node basis.","         * That is to say, if you call <code>Y.on('xyz', fn, xtra, 'div')</code>","         * the data returned from processArgs will be shared","         * across the subscription objects for all the divs.  If you want each","         * subscription to receive unique information, do that processing","         * here.</p>","         *","         * <p>The default implementation adds the data extracted by processArgs","         * to the subscription object as <code>sub._extra</code>.</p>","         *","         * @method applyArgExtras","         * @param extra {any} Any extra data extracted from processArgs","         * @param sub {Subscription} the individual subscription","         */","        applyArgExtras: function (extra, sub) {","            sub._extra = extra;","        },","","        /**","         * Removes the subscription(s) from the internal subscription dispatch","         * mechanism.  See <code>SyntheticEvent._deleteSub</code>.","         *","         * @method _detach","         * @param args {Array} The arguments passed to","         *                  <code>node.detach(...)</code>","         * @private","         * @since 3.2.0","         */","        _detach: function (args) {","            // Can't use Y.all because it doesn't support window (yet?)","            // TODO: Does Y.all support window now?","            var target = args[2],","                els    = (isString(target)) ?","                            query(target) : toArray(target),","                node, i, len, handles, j;","","            // (type, fn, el, context, filter?) => (type, fn, context, filter?)","            args.splice(2, 1);","","            for (i = 0, len = els.length; i < len; ++i) {","                node = Y.one(els[i]);","","                if (node) {","                    handles = this.getSubs(node, args);","","                    if (handles) {","                        for (j = handles.length - 1; j >= 0; --j) {","                            handles[j].detach();","                        }","                    }","                }","            }","        },","","        /**","         * Returns the detach handles of subscriptions on a node that satisfy a","         * search/filter function.  By default, the filter used is the","         * <code>subMatch</code> method.","         *","         * @method getSubs","         * @param node {Node} the node hosting the event","         * @param args {Array} the array of original subscription args passed","         *              to <code>Y.on(...)</code> (before","         *              <code>processArgs</code>","         * @param filter {Function} function used to identify a subscription","         *              for inclusion in the returned array","         * @param first {Boolean} stop after the first match (used to check for","         *              duplicate subscriptions)","         * @return {EventHandle[]} detach handles for the matching subscriptions","         */","        getSubs: function (node, args, filter, first) {","            var registry = SyntheticEvent.getRegistry(node, this.type),","                handles  = [],","                allHandles, i, len, handle;","","            if (registry) {","                allHandles = registry.handles;","","                if (!filter) {","                    filter = this.subMatch;","                }","","                for (i = 0, len = allHandles.length; i < len; ++i) {","                    handle = allHandles[i];","                    if (filter.call(this, handle.sub, args)) {","                        if (first) {","                            return handle;","                        } else {","                            handles.push(allHandles[i]);","                        }","                    }","                }","            }","","            return handles.length && handles;","        },","","        /**","         * <p>Implementers MAY override this to define what constitutes a","         * &quot;same&quot; subscription.  Override implementations should","         * consider the lack of a comparator as a match, so calling","         * <code>getSubs()</code> with no arguments will return all subs.</p>","         *","         * <p>Compares a set of subscription arguments against a Subscription","         * object to determine if they match.  The default implementation","         * compares the callback function against the second argument passed to","         * <code>Y.on(...)</code> or <code>node.detach(...)</code> etc.</p>","         *","         * @method subMatch","         * @param sub {Subscription} the existing subscription","         * @param args {Array} the calling arguments passed to","         *                  <code>Y.on(...)</code> etc.","         * @return {Boolean} true if the sub can be described by the args","         *                  present","         * @since 3.2.0","         */","        subMatch: function (sub, args) {","            // Default detach cares only about the callback matching","            return !args[1] || sub.fn === args[1];","        }","    }","}, true);","","Y.SyntheticEvent = SyntheticEvent;","","/**"," * <p>Defines a new event in the DOM event system.  Implementers are"," * responsible for monitoring for a scenario whereby the event is fired.  A"," * notifier object is provided to the functions identified below.  When the"," * criteria defining the event are met, call notifier.fire( [args] ); to"," * execute event subscribers.</p>"," *"," * <p>The first parameter is the name of the event.  The second parameter is a"," * configuration object which define the behavior of the event system when the"," * new event is subscribed to or detached from.  The methods that should be"," * defined in this configuration object are <code>on</code>,"," * <code>detach</code>, <code>delegate</code>, and <code>detachDelegate</code>."," * You are free to define any other methods or properties needed to define your"," * event.  Be aware, however, that since the object is used to subclass"," * SyntheticEvent, you should avoid method names used by SyntheticEvent unless"," * your intention is to override the default behavior.</p>"," *"," * <p>This is a list of properties and methods that you can or should specify"," * in the configuration object:</p>"," *"," * <dl>"," *   <dt><code>on</code></dt>"," *       <dd><code>function (node, subscription, notifier)</code> The"," *       implementation logic for subscription.  Any special setup you need to"," *       do to create the environment for the event being fired--E.g. native"," *       DOM event subscriptions.  Store subscription related objects and"," *       state on the <code>subscription</code> object.  When the"," *       criteria have been met to fire the synthetic event, call"," *       <code>notifier.fire(e)</code>.  See Notifier's <code>fire()</code>"," *       method for details about what to pass as parameters.</dd>"," *"," *   <dt><code>detach</code></dt>"," *       <dd><code>function (node, subscription, notifier)</code> The"," *       implementation logic for cleaning up a detached subscription. E.g."," *       detach any DOM subscriptions added in <code>on</code>.</dd>"," *"," *   <dt><code>delegate</code></dt>"," *       <dd><code>function (node, subscription, notifier, filter)</code> The"," *       implementation logic for subscription via <code>Y.delegate</code> or"," *       <code>node.delegate</code>.  The filter is typically either a selector"," *       string or a function.  You can use"," *       <code>Y.delegate.compileFilter(selectorString)</code> to create a"," *       filter function from a selector string if needed.  The filter function"," *       expects an event object as input and should output either null, a"," *       matching Node, or an array of matching Nodes.  Otherwise, this acts"," *       like <code>on</code> DOM event subscriptions.  Store subscription"," *       related objects and information on the <code>subscription</code>"," *       object.  When the criteria have been met to fire the synthetic event,"," *       call <code>notifier.fire(e)</code> as noted above.</dd>"," *"," *   <dt><code>detachDelegate</code></dt>"," *       <dd><code>function (node, subscription, notifier)</code> The"," *       implementation logic for cleaning up a detached delegate subscription."," *       E.g. detach any DOM delegate subscriptions added in"," *       <code>delegate</code>.</dd>"," *"," *   <dt><code>publishConfig</code></dt>"," *       <dd>(Object) The configuration object that will be used to instantiate"," *       the underlying CustomEvent. See Notifier's <code>fire</code> method"," *       for details.</dd>"," *"," *   <dt><code>processArgs</code></dt"," *       <dd>"," *          <p><code>function (argArray, fromDelegate)</code> Optional method"," *          to extract any additional arguments from the subscription"," *          signature.  Using this allows <code>on</code> or"," *          <code>delegate</code> signatures like"," *          <code>node.on(&quot;hover&quot;, overCallback,"," *          outCallback)</code>.</p>"," *          <p>When processing an atypical argument signature, make sure the"," *          args array is returned to the normal signature before returning"," *          from the function.  For example, in the &quot;hover&quot; example"," *          above, the <code>outCallback</code> needs to be <code>splice</code>d"," *          out of the array.  The expected signature of the args array for"," *          <code>on()</code> subscriptions is:</p>"," *          <pre>"," *              <code>[type, callback, target, contextOverride, argN...]</code>"," *          </pre>"," *          <p>And for <code>delegate()</code>:</p>"," *          <pre>"," *              <code>[type, callback, target, filter, contextOverride, argN...]</code>"," *          </pre>"," *          <p>where <code>target</code> is the node the event is being"," *          subscribed for.  You can see these signatures documented for"," *          <code>Y.on()</code> and <code>Y.delegate()</code> respectively.</p>"," *          <p>Whatever gets returned from the function will be stored on the"," *          <code>subscription</code> object under"," *          <code>subscription._extra</code>.</p></dd>"," *   <dt><code>subMatch</code></dt>"," *       <dd>"," *           <p><code>function (sub, args)</code>  Compares a set of"," *           subscription arguments against a Subscription object to determine"," *           if they match.  The default implementation compares the callback"," *           function against the second argument passed to"," *           <code>Y.on(...)</code> or <code>node.detach(...)</code> etc.</p>"," *       </dd>"," * </dl>"," *"," * @method define"," * @param type {String} the name of the event"," * @param config {Object} the prototype definition for the new event (see above)"," * @param force {Boolean} override an existing event (use with caution)"," * @return {SyntheticEvent} the subclass implementation instance created to"," *              handle event subscriptions of this type"," * @static"," * @for Event"," * @since 3.1.0"," * @in event-synthetic"," */","Y.Event.define = function (type, config, force) {","    var eventDef, Impl, synth;","","    if (type && type.type) {","        eventDef = type;","        force = config;","    } else if (config) {","        eventDef = Y.merge({ type: type }, config);","    }","","    if (eventDef) {","        if (force || !Y.Node.DOM_EVENTS[eventDef.type]) {","            Impl = function () {","                SyntheticEvent.apply(this, arguments);","            };","            Y.extend(Impl, SyntheticEvent, eventDef);","            synth = new Impl();","","            type = synth.type;","","            Y.Node.DOM_EVENTS[type] = Y.Env.evt.plugins[type] = {","                eventDef: synth,","","                on: function () {","                    return synth._on(toArray(arguments));","                },","","                delegate: function () {","                    return synth._on(toArray(arguments), true);","                },","","                detach: function () {","                    return synth._detach(toArray(arguments));","                }","            };","","        }","    } else if (isString(type) || isArray(type)) {","        Y.Array.each(toArray(type), function (t) {","            Y.Node.DOM_EVENTS[t] = 1;","        });","    }","","    return synth;","};","","","}, '@VERSION@', {\"requires\": [\"node-base\", \"event-custom-complex\"]});"];
_yuitest_coverage["build/event-synthetic/event-synthetic.js"].lines = {"1":0,"9":0,"36":0,"37":0,"38":0,"65":0,"67":0,"76":0,"77":0,"78":0,"80":0,"81":0,"82":0,"84":0,"88":0,"89":0,"91":0,"92":0,"94":0,"95":0,"98":0,"99":0,"100":0,"104":0,"120":0,"121":0,"122":0,"123":0,"124":0,"127":0,"144":0,"145":0,"156":0,"160":0,"161":0,"162":0,"163":0,"168":0,"169":0,"170":0,"171":0,"189":0,"192":0,"193":0,"212":0,"213":0,"216":0,"236":0,"241":0,"242":0,"243":0,"245":0,"246":0,"250":0,"263":0,"264":0,"267":0,"269":0,"270":0,"273":0,"274":0,"276":0,"277":0,"278":0,"292":0,"295":0,"298":0,"447":0,"455":0,"459":0,"460":0,"461":0,"464":0,"467":0,"468":0,"471":0,"473":0,"474":0,"475":0,"479":0,"481":0,"484":0,"489":0,"516":0,"522":0,"523":0,"524":0,"525":0,"528":0,"539":0,"541":0,"544":0,"546":0,"568":0,"584":0,"590":0,"592":0,"593":0,"595":0,"596":0,"598":0,"599":0,"600":0,"624":0,"628":0,"629":0,"631":0,"632":0,"635":0,"636":0,"637":0,"638":0,"639":0,"641":0,"647":0,"671":0,"676":0,"787":0,"788":0,"790":0,"791":0,"792":0,"793":0,"794":0,"797":0,"798":0,"799":0,"800":0,"802":0,"803":0,"805":0,"807":0,"811":0,"815":0,"819":0,"824":0,"825":0,"826":0,"830":0};
_yuitest_coverage["build/event-synthetic/event-synthetic.js"].functions = {"Notifier:36":0,"fire:65":0,"SynthRegistry:120":0,"register:143":0,"unregister:155":0,"detachAll:188":0,"SyntheticEvent:212":0,"getRegistry:235":0,"_deleteSub:262":0,"_init:291":0,"(anonymous 2):460":0,"(anonymous 3):467":0,"_on:446":0,"_subscribe:515":0,"applyArgExtras:567":0,"_detach:581":0,"getSubs:623":0,"subMatch:669":0,"Impl:799":0,"on:810":0,"delegate:814":0,"detach:818":0,"(anonymous 4):825":0,"define:787":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-synthetic/event-synthetic.js"].coveredLines = 139;
_yuitest_coverage["build/event-synthetic/event-synthetic.js"].coveredFunctions = 25;
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 1);
YUI.add('event-synthetic', function (Y, NAME) {

/**
 * Define new DOM events that can be subscribed to from Nodes.
 *
 * @module event
 * @submodule event-synthetic
 */
_yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 9);
var CustomEvent = Y.CustomEvent,
    DOMMap   = Y.Env.evt.dom_map,
    toArray  = Y.Array,
    YLang    = Y.Lang,
    isObject = YLang.isObject,
    isString = YLang.isString,
    isArray  = YLang.isArray,
    query    = Y.Selector.query,
    noop     = function () {};

/**
 * <p>The triggering mechanism used by SyntheticEvents.</p>
 *
 * <p>Implementers should not instantiate these directly.  Use the Notifier
 * provided to the event's implemented <code>on(node, sub, notifier)</code> or
 * <code>delegate(node, sub, notifier, filter)</code> methods.</p>
 *
 * @class SyntheticEvent.Notifier
 * @constructor
 * @param handle {EventHandle} the detach handle for the subscription to an
 *              internal custom event used to execute the callback passed to
 *              on(..) or delegate(..)
 * @param emitFacade {Boolean} take steps to ensure the first arg received by
 *              the subscription callback is an event facade
 * @private
 * @since 3.2.0
 */
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 36);
function Notifier(handle, emitFacade) {
    _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "Notifier", 36);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 37);
this.handle     = handle;
    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 38);
this.emitFacade = emitFacade;
}

/**
 * <p>Executes the subscription callback, passing the firing arguments as the
 * first parameters to that callback. For events that are configured with
 * emitFacade=true, it is common practice to pass the triggering DOMEventFacade
 * as the first parameter.  Barring a proper DOMEventFacade or EventFacade
 * (from a CustomEvent), a new EventFacade will be generated.  In that case, if
 * fire() is called with a simple object, it will be mixed into the facade.
 * Otherwise, the facade will be prepended to the callback parameters.</p>
 *
 * <p>For notifiers provided to delegate logic, the first argument should be an
 * object with a &quot;currentTarget&quot; property to identify what object to
 * default as 'this' in the callback.  Typically this is gleaned from the
 * DOMEventFacade or EventFacade, but if configured with emitFacade=false, an
 * object must be provided.  In that case, the object will be removed from the
 * callback parameters.</p>
 *
 * <p>Additional arguments passed during event subscription will be
 * automatically added after those passed to fire().</p>
 *
 * @method fire
 * @param e {EventFacade|DOMEventFacade|Object|any} (see description)
 * @param arg* {any} additional arguments received by all subscriptions
 * @private
 */
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 65);
Notifier.prototype.fire = function (e) {
    // first arg to delegate notifier should be an object with currentTarget
    _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "fire", 65);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 67);
var args     = toArray(arguments, 0, true),
        handle   = this.handle,
        ce       = handle.evt,
        sub      = handle.sub,
        thisObj  = sub.context,
        delegate = sub.filter,
        event    = e || {},
        ret;

    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 76);
if (this.emitFacade) {
        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 77);
if (!e || !e.preventDefault) {
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 78);
event = ce._getFacade();

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 80);
if (isObject(e) && !e.preventDefault) {
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 81);
Y.mix(event, e, true);
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 82);
args[0] = event;
            } else {
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 84);
args.unshift(event);
            }
        }

        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 88);
event.type    = ce.type;
        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 89);
event.details = args.slice();

        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 91);
if (delegate) {
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 92);
event.container = ce.host;
        }
    } else {_yuitest_coverline("build/event-synthetic/event-synthetic.js", 94);
if (delegate && isObject(e) && e.currentTarget) {
        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 95);
args.shift();
    }}

    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 98);
sub.context = thisObj || event.currentTarget || ce.host;
    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 99);
ret = ce.fire.apply(ce, args);
    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 100);
sub.context = thisObj; // reset for future firing

    // to capture callbacks that return false to stopPropagation.
    // Useful for delegate implementations
    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 104);
return ret;
};

/**
 * Manager object for synthetic event subscriptions to aggregate multiple synths on the
 * same node without colliding with actual DOM subscription entries in the global map of
 * DOM subscriptions.  Also facilitates proper cleanup on page unload.
 *
 * @class SynthRegistry
 * @constructor
 * @param el {HTMLElement} the DOM element
 * @param yuid {String} the yuid stamp for the element
 * @param key {String} the generated id token used to identify an event type +
 *                     element in the global DOM subscription map.
 * @private
 */
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 120);
function SynthRegistry(el, yuid, key) {
    _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "SynthRegistry", 120);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 121);
this.handles = [];
    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 122);
this.el      = el;
    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 123);
this.key     = key;
    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 124);
this.domkey  = yuid;
}

_yuitest_coverline("build/event-synthetic/event-synthetic.js", 127);
SynthRegistry.prototype = {
    constructor: SynthRegistry,

    // A few object properties to fake the CustomEvent interface for page
    // unload cleanup.  DON'T TOUCH!
    type      : '_synth',
    fn        : noop,
    capture   : false,

    /**
     * Adds a subscription from the Notifier registry.
     *
     * @method register
     * @param handle {EventHandle} the subscription
     * @since 3.4.0
     */
    register: function (handle) {
        _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "register", 143);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 144);
handle.evt.registry = this;
        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 145);
this.handles.push(handle);
    },

    /**
     * Removes the subscription from the Notifier registry.
     *
     * @method _unregisterSub
     * @param sub {Subscription} the subscription
     * @since 3.4.0
     */
    unregister: function (sub) {
        _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "unregister", 155);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 156);
var handles = this.handles,
            events = DOMMap[this.domkey],
            i;

        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 160);
for (i = handles.length - 1; i >= 0; --i) {
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 161);
if (handles[i].sub === sub) {
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 162);
handles.splice(i, 1);
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 163);
break;
            }
        }

        // Clean up left over objects when there are no more subscribers.
        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 168);
if (!handles.length) {
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 169);
delete events[this.key];
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 170);
if (!Y.Object.size(events)) {
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 171);
delete DOMMap[this.domkey];
            }
        }
    },

    /**
     * Used by the event system's unload cleanup process.  When navigating
     * away from the page, the event system iterates the global map of element
     * subscriptions and detaches everything using detachAll().  Normally,
     * the map is populated with custom events, so this object needs to
     * at least support the detachAll method to duck type its way to
     * cleanliness.
     *
     * @method detachAll
     * @private
     * @since 3.4.0
     */
    detachAll : function () {
        _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "detachAll", 188);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 189);
var handles = this.handles,
            i = handles.length;

        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 192);
while (--i >= 0) {
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 193);
handles[i].detach();
        }
    }
};

/**
 * <p>Wrapper class for the integration of new events into the YUI event
 * infrastructure.  Don't instantiate this object directly, use
 * <code>Y.Event.define(type, config)</code>.  See that method for details.</p>
 *
 * <p>Properties that MAY or SHOULD be specified in the configuration are noted
 * below and in the description of <code>Y.Event.define</code>.</p>
 *
 * @class SyntheticEvent
 * @constructor
 * @param cfg {Object} Implementation pieces and configuration
 * @since 3.1.0
 * @in event-synthetic
 */
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 212);
function SyntheticEvent() {
    _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "SyntheticEvent", 212);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 213);
this._init.apply(this, arguments);
}

_yuitest_coverline("build/event-synthetic/event-synthetic.js", 216);
Y.mix(SyntheticEvent, {
    Notifier: Notifier,
    SynthRegistry: SynthRegistry,

    /**
     * Returns the array of subscription handles for a node for the given event
     * type.  Passing true as the third argument will create a registry entry
     * in the event system's DOM map to host the array if one doesn't yet exist.
     *
     * @method getRegistry
     * @param node {Node} the node
     * @param type {String} the event
     * @param create {Boolean} create a registration entry to host a new array
     *                  if one doesn't exist.
     * @return {Array}
     * @static
     * @protected
     * @since 3.2.0
     */
    getRegistry: function (node, type, create) {
        _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "getRegistry", 235);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 236);
var el     = node._node,
            yuid   = Y.stamp(el),
            key    = 'event:' + yuid + type + '_synth',
            events = DOMMap[yuid];

        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 241);
if (create) {
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 242);
if (!events) {
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 243);
events = DOMMap[yuid] = {};
            }
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 245);
if (!events[key]) {
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 246);
events[key] = new SynthRegistry(el, yuid, key);
            }
        }

        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 250);
return (events && events[key]) || null;
    },

    /**
     * Alternate <code>_delete()</code> method for the CustomEvent object
     * created to manage SyntheticEvent subscriptions.
     *
     * @method _deleteSub
     * @param sub {Subscription} the subscription to clean up
     * @private
     * @since 3.2.0
     */
    _deleteSub: function (sub) {
        _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "_deleteSub", 262);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 263);
if (sub && sub.fn) {
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 264);
var synth = this.eventDef,
                method = (sub.filter) ? 'detachDelegate' : 'detach';

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 267);
this._subscribers = [];

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 269);
if (CustomEvent.keepDeprecatedSubs) {
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 270);
this.subscribers = {};
            }

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 273);
synth[method](sub.node, sub, this.notifier, sub.filter);
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 274);
this.registry.unregister(sub);

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 276);
delete sub.fn;
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 277);
delete sub.node;
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 278);
delete sub.context;
        }
    },

    prototype: {
        constructor: SyntheticEvent,

        /**
         * Construction logic for the event.
         *
         * @method _init
         * @protected
         */
        _init: function () {
            _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "_init", 291);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 292);
var config = this.publishConfig || (this.publishConfig = {});

            // The notification mechanism handles facade creation
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 295);
this.emitFacade = ('emitFacade' in config) ?
                                config.emitFacade :
                                true;
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 298);
config.emitFacade  = false;
        },

        /**
         * <p>Implementers MAY provide this method definition.</p>
         *
         * <p>Implement this function if the event supports a different
         * subscription signature.  This function is used by both
         * <code>on()</code> and <code>delegate()</code>.  The second parameter
         * indicates that the event is being subscribed via
         * <code>delegate()</code>.</p>
         *
         * <p>Implementations must remove extra arguments from the args list
         * before returning.  The required args for <code>on()</code>
         * subscriptions are</p>
         * <pre><code>[type, callback, target, context, argN...]</code></pre>
         *
         * <p>The required args for <code>delegate()</code>
         * subscriptions are</p>
         *
         * <pre><code>[type, callback, target, filter, context, argN...]</code></pre>
         *
         * <p>The return value from this function will be stored on the
         * subscription in the '_extra' property for reference elsewhere.</p>
         *
         * @method processArgs
         * @param args {Array} parmeters passed to Y.on(..) or Y.delegate(..)
         * @param delegate {Boolean} true if the subscription is from Y.delegate
         * @return {any}
         */
        processArgs: noop,

        /**
         * <p>Implementers MAY override this property.</p>
         *
         * <p>Whether to prevent multiple subscriptions to this event that are
         * classified as being the same.  By default, this means the subscribed
         * callback is the same function.  See the <code>subMatch</code>
         * method.  Setting this to true will impact performance for high volume
         * events.</p>
         *
         * @property preventDups
         * @type {Boolean}
         * @default false
         */
        //preventDups  : false,

        /**
         * <p>Implementers SHOULD provide this method definition.</p>
         *
         * Implementation logic for subscriptions done via <code>node.on(type,
         * fn)</code> or <code>Y.on(type, fn, target)</code>.  This
         * function should set up the monitor(s) that will eventually fire the
         * event.  Typically this involves subscribing to at least one DOM
         * event.  It is recommended to store detach handles from any DOM
         * subscriptions to make for easy cleanup in the <code>detach</code>
         * method.  Typically these handles are added to the <code>sub</code>
         * object.  Also for SyntheticEvents that leverage a single DOM
         * subscription under the hood, it is recommended to pass the DOM event
         * object to <code>notifier.fire(e)</code>.  (The event name on the
         * object will be updated).
         *
         * @method on
         * @param node {Node} the node the subscription is being applied to
         * @param sub {Subscription} the object to track this subscription
         * @param notifier {SyntheticEvent.Notifier} call notifier.fire(..) to
         *              trigger the execution of the subscribers
         */
        on: noop,

        /**
         * <p>Implementers SHOULD provide this method definition.</p>
         *
         * <p>Implementation logic for detaching subscriptions done via
         * <code>node.on(type, fn)</code>.  This function should clean up any
         * subscriptions made in the <code>on()</code> phase.</p>
         *
         * @method detach
         * @param node {Node} the node the subscription was applied to
         * @param sub {Subscription} the object tracking this subscription
         * @param notifier {SyntheticEvent.Notifier} the Notifier used to
         *              trigger the execution of the subscribers
         */
        detach: noop,

        /**
         * <p>Implementers SHOULD provide this method definition.</p>
         *
         * <p>Implementation logic for subscriptions done via
         * <code>node.delegate(type, fn, filter)</code> or
         * <code>Y.delegate(type, fn, container, filter)</code>.  Like with
         * <code>on()</code> above, this function should monitor the environment
         * for the event being fired, and trigger subscription execution by
         * calling <code>notifier.fire(e)</code>.</p>
         *
         * <p>This function receives a fourth argument, which is the filter
         * used to identify which Node's are of interest to the subscription.
         * The filter will be either a boolean function that accepts a target
         * Node for each hierarchy level as the event bubbles, or a selector
         * string.  To translate selector strings into filter functions, use
         * <code>Y.delegate.compileFilter(filter)</code>.</p>
         *
         * @method delegate
         * @param node {Node} the node the subscription is being applied to
         * @param sub {Subscription} the object to track this subscription
         * @param notifier {SyntheticEvent.Notifier} call notifier.fire(..) to
         *              trigger the execution of the subscribers
         * @param filter {String|Function} Selector string or function that
         *              accepts an event object and returns null, a Node, or an
         *              array of Nodes matching the criteria for processing.
         * @since 3.2.0
         */
        delegate       : noop,

        /**
         * <p>Implementers SHOULD provide this method definition.</p>
         *
         * <p>Implementation logic for detaching subscriptions done via
         * <code>node.delegate(type, fn, filter)</code> or
         * <code>Y.delegate(type, fn, container, filter)</code>.  This function
         * should clean up any subscriptions made in the
         * <code>delegate()</code> phase.</p>
         *
         * @method detachDelegate
         * @param node {Node} the node the subscription was applied to
         * @param sub {Subscription} the object tracking this subscription
         * @param notifier {SyntheticEvent.Notifier} the Notifier used to
         *              trigger the execution of the subscribers
         * @param filter {String|Function} Selector string or function that
         *              accepts an event object and returns null, a Node, or an
         *              array of Nodes matching the criteria for processing.
         * @since 3.2.0
         */
        detachDelegate : noop,

        /**
         * Sets up the boilerplate for detaching the event and facilitating the
         * execution of subscriber callbacks.
         *
         * @method _on
         * @param args {Array} array of arguments passed to
         *              <code>Y.on(...)</code> or <code>Y.delegate(...)</code>
         * @param delegate {Boolean} true if called from
         * <code>Y.delegate(...)</code>
         * @return {EventHandle} the detach handle for this subscription
         * @private
         * since 3.2.0
         */
        _on: function (args, delegate) {
            _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "_on", 446);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 447);
var handles  = [],
                originalArgs = args.slice(),
                extra    = this.processArgs(args, delegate),
                selector = args[2],
                method   = delegate ? 'delegate' : 'on',
                nodes, handle;

            // Can't just use Y.all because it doesn't support window (yet?)
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 455);
nodes = (isString(selector)) ?
                query(selector) :
                toArray(selector || Y.one(Y.config.win));

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 459);
if (!nodes.length && isString(selector)) {
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 460);
handle = Y.on('available', function () {
                    _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "(anonymous 2)", 460);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 461);
Y.mix(handle, Y[method].apply(Y, originalArgs), true);
                }, selector);

                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 464);
return handle;
            }

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 467);
Y.Array.each(nodes, function (node) {
                _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "(anonymous 3)", 467);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 468);
var subArgs = args.slice(),
                    filter;

                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 471);
node = Y.one(node);

                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 473);
if (node) {
                    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 474);
if (delegate) {
                        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 475);
filter = subArgs.splice(3, 1)[0];
                    }

                    // (type, fn, el, thisObj, ...) => (fn, thisObj, ...)
                    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 479);
subArgs.splice(0, 4, subArgs[1], subArgs[3]);

                    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 481);
if (!this.preventDups ||
                        !this.getSubs(node, args, null, true))
                    {
                        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 484);
handles.push(this._subscribe(node, method, subArgs, extra, filter));
                    }
                }
            }, this);

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 489);
return (handles.length === 1) ?
                handles[0] :
                new Y.EventHandle(handles);
        },

        /**
         * Creates a new Notifier object for use by this event's
         * <code>on(...)</code> or <code>delegate(...)</code> implementation
         * and register the custom event proxy in the DOM system for cleanup.
         *
         * @method _subscribe
         * @param node {Node} the Node hosting the event
         * @param method {String} "on" or "delegate"
         * @param args {Array} the subscription arguments passed to either
         *              <code>Y.on(...)</code> or <code>Y.delegate(...)</code>
         *              after running through <code>processArgs(args)</code> to
         *              normalize the argument signature
         * @param extra {any} Extra data parsed from
         *              <code>processArgs(args)</code>
         * @param filter {String|Function} the selector string or function
         *              filter passed to <code>Y.delegate(...)</code> (not
         *              present when called from <code>Y.on(...)</code>)
         * @return {EventHandle}
         * @private
         * @since 3.2.0
         */
        _subscribe: function (node, method, args, extra, filter) {
            _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "_subscribe", 515);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 516);
var dispatcher = new Y.CustomEvent(this.type, this.publishConfig),
                handle     = dispatcher.on.apply(dispatcher, args),
                notifier   = new Notifier(handle, this.emitFacade),
                registry   = SyntheticEvent.getRegistry(node, this.type, true),
                sub        = handle.sub;

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 522);
sub.node   = node;
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 523);
sub.filter = filter;
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 524);
if (extra) {
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 525);
this.applyArgExtras(extra, sub);
            }

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 528);
Y.mix(dispatcher, {
                eventDef     : this,
                notifier     : notifier,
                host         : node,       // I forget what this is for
                currentTarget: node,       // for generating facades
                target       : node,       // for generating facades
                el           : node._node, // For category detach

                _delete      : SyntheticEvent._deleteSub
            }, true);

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 539);
handle.notifier = notifier;

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 541);
registry.register(handle);

            // Call the implementation's "on" or "delegate" method
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 544);
this[method](node, sub, notifier, filter);

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 546);
return handle;
        },

        /**
         * <p>Implementers MAY provide this method definition.</p>
         *
         * <p>Implement this function if you want extra data extracted during
         * processArgs to be propagated to subscriptions on a per-node basis.
         * That is to say, if you call <code>Y.on('xyz', fn, xtra, 'div')</code>
         * the data returned from processArgs will be shared
         * across the subscription objects for all the divs.  If you want each
         * subscription to receive unique information, do that processing
         * here.</p>
         *
         * <p>The default implementation adds the data extracted by processArgs
         * to the subscription object as <code>sub._extra</code>.</p>
         *
         * @method applyArgExtras
         * @param extra {any} Any extra data extracted from processArgs
         * @param sub {Subscription} the individual subscription
         */
        applyArgExtras: function (extra, sub) {
            _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "applyArgExtras", 567);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 568);
sub._extra = extra;
        },

        /**
         * Removes the subscription(s) from the internal subscription dispatch
         * mechanism.  See <code>SyntheticEvent._deleteSub</code>.
         *
         * @method _detach
         * @param args {Array} The arguments passed to
         *                  <code>node.detach(...)</code>
         * @private
         * @since 3.2.0
         */
        _detach: function (args) {
            // Can't use Y.all because it doesn't support window (yet?)
            // TODO: Does Y.all support window now?
            _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "_detach", 581);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 584);
var target = args[2],
                els    = (isString(target)) ?
                            query(target) : toArray(target),
                node, i, len, handles, j;

            // (type, fn, el, context, filter?) => (type, fn, context, filter?)
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 590);
args.splice(2, 1);

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 592);
for (i = 0, len = els.length; i < len; ++i) {
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 593);
node = Y.one(els[i]);

                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 595);
if (node) {
                    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 596);
handles = this.getSubs(node, args);

                    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 598);
if (handles) {
                        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 599);
for (j = handles.length - 1; j >= 0; --j) {
                            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 600);
handles[j].detach();
                        }
                    }
                }
            }
        },

        /**
         * Returns the detach handles of subscriptions on a node that satisfy a
         * search/filter function.  By default, the filter used is the
         * <code>subMatch</code> method.
         *
         * @method getSubs
         * @param node {Node} the node hosting the event
         * @param args {Array} the array of original subscription args passed
         *              to <code>Y.on(...)</code> (before
         *              <code>processArgs</code>
         * @param filter {Function} function used to identify a subscription
         *              for inclusion in the returned array
         * @param first {Boolean} stop after the first match (used to check for
         *              duplicate subscriptions)
         * @return {EventHandle[]} detach handles for the matching subscriptions
         */
        getSubs: function (node, args, filter, first) {
            _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "getSubs", 623);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 624);
var registry = SyntheticEvent.getRegistry(node, this.type),
                handles  = [],
                allHandles, i, len, handle;

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 628);
if (registry) {
                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 629);
allHandles = registry.handles;

                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 631);
if (!filter) {
                    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 632);
filter = this.subMatch;
                }

                _yuitest_coverline("build/event-synthetic/event-synthetic.js", 635);
for (i = 0, len = allHandles.length; i < len; ++i) {
                    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 636);
handle = allHandles[i];
                    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 637);
if (filter.call(this, handle.sub, args)) {
                        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 638);
if (first) {
                            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 639);
return handle;
                        } else {
                            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 641);
handles.push(allHandles[i]);
                        }
                    }
                }
            }

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 647);
return handles.length && handles;
        },

        /**
         * <p>Implementers MAY override this to define what constitutes a
         * &quot;same&quot; subscription.  Override implementations should
         * consider the lack of a comparator as a match, so calling
         * <code>getSubs()</code> with no arguments will return all subs.</p>
         *
         * <p>Compares a set of subscription arguments against a Subscription
         * object to determine if they match.  The default implementation
         * compares the callback function against the second argument passed to
         * <code>Y.on(...)</code> or <code>node.detach(...)</code> etc.</p>
         *
         * @method subMatch
         * @param sub {Subscription} the existing subscription
         * @param args {Array} the calling arguments passed to
         *                  <code>Y.on(...)</code> etc.
         * @return {Boolean} true if the sub can be described by the args
         *                  present
         * @since 3.2.0
         */
        subMatch: function (sub, args) {
            // Default detach cares only about the callback matching
            _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "subMatch", 669);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 671);
return !args[1] || sub.fn === args[1];
        }
    }
}, true);

_yuitest_coverline("build/event-synthetic/event-synthetic.js", 676);
Y.SyntheticEvent = SyntheticEvent;

/**
 * <p>Defines a new event in the DOM event system.  Implementers are
 * responsible for monitoring for a scenario whereby the event is fired.  A
 * notifier object is provided to the functions identified below.  When the
 * criteria defining the event are met, call notifier.fire( [args] ); to
 * execute event subscribers.</p>
 *
 * <p>The first parameter is the name of the event.  The second parameter is a
 * configuration object which define the behavior of the event system when the
 * new event is subscribed to or detached from.  The methods that should be
 * defined in this configuration object are <code>on</code>,
 * <code>detach</code>, <code>delegate</code>, and <code>detachDelegate</code>.
 * You are free to define any other methods or properties needed to define your
 * event.  Be aware, however, that since the object is used to subclass
 * SyntheticEvent, you should avoid method names used by SyntheticEvent unless
 * your intention is to override the default behavior.</p>
 *
 * <p>This is a list of properties and methods that you can or should specify
 * in the configuration object:</p>
 *
 * <dl>
 *   <dt><code>on</code></dt>
 *       <dd><code>function (node, subscription, notifier)</code> The
 *       implementation logic for subscription.  Any special setup you need to
 *       do to create the environment for the event being fired--E.g. native
 *       DOM event subscriptions.  Store subscription related objects and
 *       state on the <code>subscription</code> object.  When the
 *       criteria have been met to fire the synthetic event, call
 *       <code>notifier.fire(e)</code>.  See Notifier's <code>fire()</code>
 *       method for details about what to pass as parameters.</dd>
 *
 *   <dt><code>detach</code></dt>
 *       <dd><code>function (node, subscription, notifier)</code> The
 *       implementation logic for cleaning up a detached subscription. E.g.
 *       detach any DOM subscriptions added in <code>on</code>.</dd>
 *
 *   <dt><code>delegate</code></dt>
 *       <dd><code>function (node, subscription, notifier, filter)</code> The
 *       implementation logic for subscription via <code>Y.delegate</code> or
 *       <code>node.delegate</code>.  The filter is typically either a selector
 *       string or a function.  You can use
 *       <code>Y.delegate.compileFilter(selectorString)</code> to create a
 *       filter function from a selector string if needed.  The filter function
 *       expects an event object as input and should output either null, a
 *       matching Node, or an array of matching Nodes.  Otherwise, this acts
 *       like <code>on</code> DOM event subscriptions.  Store subscription
 *       related objects and information on the <code>subscription</code>
 *       object.  When the criteria have been met to fire the synthetic event,
 *       call <code>notifier.fire(e)</code> as noted above.</dd>
 *
 *   <dt><code>detachDelegate</code></dt>
 *       <dd><code>function (node, subscription, notifier)</code> The
 *       implementation logic for cleaning up a detached delegate subscription.
 *       E.g. detach any DOM delegate subscriptions added in
 *       <code>delegate</code>.</dd>
 *
 *   <dt><code>publishConfig</code></dt>
 *       <dd>(Object) The configuration object that will be used to instantiate
 *       the underlying CustomEvent. See Notifier's <code>fire</code> method
 *       for details.</dd>
 *
 *   <dt><code>processArgs</code></dt
 *       <dd>
 *          <p><code>function (argArray, fromDelegate)</code> Optional method
 *          to extract any additional arguments from the subscription
 *          signature.  Using this allows <code>on</code> or
 *          <code>delegate</code> signatures like
 *          <code>node.on(&quot;hover&quot;, overCallback,
 *          outCallback)</code>.</p>
 *          <p>When processing an atypical argument signature, make sure the
 *          args array is returned to the normal signature before returning
 *          from the function.  For example, in the &quot;hover&quot; example
 *          above, the <code>outCallback</code> needs to be <code>splice</code>d
 *          out of the array.  The expected signature of the args array for
 *          <code>on()</code> subscriptions is:</p>
 *          <pre>
 *              <code>[type, callback, target, contextOverride, argN...]</code>
 *          </pre>
 *          <p>And for <code>delegate()</code>:</p>
 *          <pre>
 *              <code>[type, callback, target, filter, contextOverride, argN...]</code>
 *          </pre>
 *          <p>where <code>target</code> is the node the event is being
 *          subscribed for.  You can see these signatures documented for
 *          <code>Y.on()</code> and <code>Y.delegate()</code> respectively.</p>
 *          <p>Whatever gets returned from the function will be stored on the
 *          <code>subscription</code> object under
 *          <code>subscription._extra</code>.</p></dd>
 *   <dt><code>subMatch</code></dt>
 *       <dd>
 *           <p><code>function (sub, args)</code>  Compares a set of
 *           subscription arguments against a Subscription object to determine
 *           if they match.  The default implementation compares the callback
 *           function against the second argument passed to
 *           <code>Y.on(...)</code> or <code>node.detach(...)</code> etc.</p>
 *       </dd>
 * </dl>
 *
 * @method define
 * @param type {String} the name of the event
 * @param config {Object} the prototype definition for the new event (see above)
 * @param force {Boolean} override an existing event (use with caution)
 * @return {SyntheticEvent} the subclass implementation instance created to
 *              handle event subscriptions of this type
 * @static
 * @for Event
 * @since 3.1.0
 * @in event-synthetic
 */
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 787);
Y.Event.define = function (type, config, force) {
    _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "define", 787);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 788);
var eventDef, Impl, synth;

    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 790);
if (type && type.type) {
        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 791);
eventDef = type;
        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 792);
force = config;
    } else {_yuitest_coverline("build/event-synthetic/event-synthetic.js", 793);
if (config) {
        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 794);
eventDef = Y.merge({ type: type }, config);
    }}

    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 797);
if (eventDef) {
        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 798);
if (force || !Y.Node.DOM_EVENTS[eventDef.type]) {
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 799);
Impl = function () {
                _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "Impl", 799);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 800);
SyntheticEvent.apply(this, arguments);
            };
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 802);
Y.extend(Impl, SyntheticEvent, eventDef);
            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 803);
synth = new Impl();

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 805);
type = synth.type;

            _yuitest_coverline("build/event-synthetic/event-synthetic.js", 807);
Y.Node.DOM_EVENTS[type] = Y.Env.evt.plugins[type] = {
                eventDef: synth,

                on: function () {
                    _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "on", 810);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 811);
return synth._on(toArray(arguments));
                },

                delegate: function () {
                    _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "delegate", 814);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 815);
return synth._on(toArray(arguments), true);
                },

                detach: function () {
                    _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "detach", 818);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 819);
return synth._detach(toArray(arguments));
                }
            };

        }
    } else {_yuitest_coverline("build/event-synthetic/event-synthetic.js", 824);
if (isString(type) || isArray(type)) {
        _yuitest_coverline("build/event-synthetic/event-synthetic.js", 825);
Y.Array.each(toArray(type), function (t) {
            _yuitest_coverfunc("build/event-synthetic/event-synthetic.js", "(anonymous 4)", 825);
_yuitest_coverline("build/event-synthetic/event-synthetic.js", 826);
Y.Node.DOM_EVENTS[t] = 1;
        });
    }}

    _yuitest_coverline("build/event-synthetic/event-synthetic.js", 830);
return synth;
};


}, '@VERSION@', {"requires": ["node-base", "event-custom-complex"]});
