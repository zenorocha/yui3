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
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-custom-complex/event-custom-complex.js",
    code: []
};
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].code=["YUI.add('event-custom-complex', function (Y, NAME) {","","","/**"," * Adds event facades, preventable default behavior, and bubbling."," * events."," * @module event-custom"," * @submodule event-custom-complex"," */","","var FACADE,","    FACADE_KEYS,","    YObject = Y.Object,","    key,","    EMPTY = {},","    CEProto = Y.CustomEvent.prototype,","    ETProto = Y.EventTarget.prototype,","","    mixFacadeProps = function(facade, payload) {","        var p;","","        for (p in payload) {","            if (!(FACADE_KEYS.hasOwnProperty(p))) {","                facade[p] = payload[p];","            }","        }","    };","","/**"," * Wraps and protects a custom event for use when emitFacade is set to true."," * Requires the event-custom-complex module"," * @class EventFacade"," * @param e {Event} the custom event"," * @param currentTarget {HTMLElement} the element the listener was attached to"," */","","Y.EventFacade = function(e, currentTarget) {","","    if (!e) {","        e = EMPTY;","    }","","    this._event = e;","","    /**","     * The arguments passed to fire","     * @property details","     * @type Array","     */","    this.details = e.details;","","    /**","     * The event type, this can be overridden by the fire() payload","     * @property type","     * @type string","     */","    this.type = e.type;","","    /**","     * The real event type","     * @property _type","     * @type string","     * @private","     */","    this._type = e.type;","","    //////////////////////////////////////////////////////","","    /**","     * Node reference for the targeted eventtarget","     * @property target","     * @type Node","     */","    this.target = e.target;","","    /**","     * Node reference for the element that the listener was attached to.","     * @property currentTarget","     * @type Node","     */","    this.currentTarget = currentTarget;","","    /**","     * Node reference to the relatedTarget","     * @property relatedTarget","     * @type Node","     */","    this.relatedTarget = e.relatedTarget;","","};","","Y.mix(Y.EventFacade.prototype, {","","    /**","     * Stops the propagation to the next bubble target","     * @method stopPropagation","     */","    stopPropagation: function() {","        this._event.stopPropagation();","        this.stopped = 1;","    },","","    /**","     * Stops the propagation to the next bubble target and","     * prevents any additional listeners from being exectued","     * on the current target.","     * @method stopImmediatePropagation","     */","    stopImmediatePropagation: function() {","        this._event.stopImmediatePropagation();","        this.stopped = 2;","    },","","    /**","     * Prevents the event's default behavior","     * @method preventDefault","     */","    preventDefault: function() {","        this._event.preventDefault();","        this.prevented = 1;","    },","","    /**","     * Stops the event propagation and prevents the default","     * event behavior.","     * @method halt","     * @param immediate {boolean} if true additional listeners","     * on the current target will not be executed","     */","    halt: function(immediate) {","        this._event.halt(immediate);","        this.prevented = 1;","        this.stopped = (immediate) ? 2 : 1;","    }","","});","","CEProto.fireComplex = function(args) {","","    var es,","        ef,","        q,","        queue,","        ce,","        ret = true,","        events,","        subs,","        ons,","        afters,","        afterQueue,","        postponed,","        prevented,","        preventedFn,","        defaultFn,","        self = this,","        host = self.host || self,","        next,","        oldbubble,","        stack = self.stack,","        yuievt = host._yuievt,","        hasPotentialSubscribers;","","    if (stack) {","","        // queue this event if the current item in the queue bubbles","        if (self.queuable && self.type !== stack.next.type) {","","            if (!stack.queue) {","                stack.queue = [];","            }","            stack.queue.push([self, args]);","","            return true;","        }","    }","","    hasPotentialSubscribers = self.hasSubs() || yuievt.hasTargets || self.broadcast;","","    self.target = self.target || host;","    self.currentTarget = host;","","    self.details = args.concat();","","    if (hasPotentialSubscribers) {","","        es = stack || {","","           id: self.id, // id of the first event in the stack","           next: self,","           silent: self.silent,","           stopped: 0,","           prevented: 0,","           bubbling: null,","           type: self.type,","           // defaultFnQueue: new Y.Queue(),","           defaultTargetOnly: self.defaultTargetOnly","","        };","","        subs = self.getSubs();","        ons = subs[0];","        afters = subs[1];","","        self.stopped = (self.type !== es.type) ? 0 : es.stopped;","        self.prevented = (self.type !== es.type) ? 0 : es.prevented;","","        if (self.stoppedFn) {","            // PERF TODO: Can we replace with callback, like preventedFn. Look into history","            events = new Y.EventTarget({","                fireOnce: true,","                context: host","            });","            self.events = events;","            events.on('stopped', self.stoppedFn);","        }","","","        self._facade = null; // kill facade to eliminate stale properties","","        ef = self._createFacade(args);","","        if (ons) {","            self._procSubs(ons, args, ef);","        }","","        // bubble if this is hosted in an event target and propagation has not been stopped","        if (self.bubbles && host.bubble && !self.stopped) {","            oldbubble = es.bubbling;","","            es.bubbling = self.type;","","            if (es.type !== self.type) {","                es.stopped = 0;","                es.prevented = 0;","            }","","            ret = host.bubble(self, args, null, es);","","            self.stopped = Math.max(self.stopped, es.stopped);","            self.prevented = Math.max(self.prevented, es.prevented);","","            es.bubbling = oldbubble;","        }","","        prevented = self.prevented;","","        if (prevented) {","            preventedFn = self.preventedFn;","            if (preventedFn) {","                preventedFn.apply(host, args);","            }","        } else {","            defaultFn = self.defaultFn;","","            if (defaultFn && ((!self.defaultTargetOnly && !es.defaultTargetOnly) || host === ef.target)) {","                defaultFn.apply(host, args);","            }","        }","","        // broadcast listeners are fired as discreet events on the","        // YUI instance and potentially the YUI global.","        if (self.broadcast) {","            self._broadcast(args);","        }","","        if (afters && !self.prevented && self.stopped < 2) {","","            // Queue the after","            afterQueue = es.afterQueue;","","            if (es.id === self.id || self.type !== yuievt.bubbling) {","","                self._procSubs(afters, args, ef);","","                if (afterQueue) {","                    while ((next = afterQueue.last())) {","                        next();","                    }","                }","            } else {","                postponed = afters;","","                if (es.execDefaultCnt) {","                    postponed = Y.merge(postponed);","","                    Y.each(postponed, function(s) {","                        s.postponed = true;","                    });","                }","","                if (!afterQueue) {","                    es.afterQueue = new Y.Queue();","                }","","                es.afterQueue.add(function() {","                    self._procSubs(postponed, args, ef);","                });","            }","","        }","","        self.target = null;","","        if (es.id === self.id) {","","            queue = es.queue;","","            if (queue) {","                while (queue.length) {","                    q = queue.pop();","                    ce = q[0];","                    // set up stack to allow the next item to be processed","                    es.next = ce;","                    ce._fire(q[1]);","                }","            }","","            self.stack = null;","        }","","        ret = !(self.stopped);","","        if (self.type !== yuievt.bubbling) {","            es.stopped = 0;","            es.prevented = 0;","            self.stopped = 0;","            self.prevented = 0;","        }","","    } else {","        defaultFn = self.defaultFn;","","        if(defaultFn) {","            ef = self._createFacade(args);","","            if ((!self.defaultTargetOnly) || (host === ef.target)) {","                defaultFn.apply(host, args);","            }","        }","    }","","    // Kill the cached facade to free up memory.","    // Otherwise we have the facade from the last fire, sitting around forever.","    self._facade = null;","","    return ret;","};","","/**"," * @method _hasPotentialSubscribers"," * @for CustomEvent"," * @private"," * @return {boolean} Whether the event has potential subscribers or not"," */","CEProto._hasPotentialSubscribers = function() {","    return this.hasSubs() || this.host._yuievt.hasTargets || this.broadcast;","};","","/**"," * Internal utility method to create a new facade instance and"," * insert it into the fire argument list, accounting for any payload"," * merging which needs to happen."," *"," * This used to be called `_getFacade`, but the name seemed inappropriate"," * when it was used without a need for the return value."," *"," * @method _createFacade"," * @private"," * @param fireArgs {Array} The arguments passed to \"fire\", which need to be"," * shifted (and potentially merged) when the facade is added."," * @return {EventFacade} The event facade created."," */","","// TODO: Remove (private) _getFacade alias, once synthetic.js is updated.","CEProto._createFacade = CEProto._getFacade = function(fireArgs) {","","    var userArgs = this.details,","        firstArg = userArgs && userArgs[0],","        firstArgIsObj = (firstArg && (typeof firstArg === \"object\")),","        ef = this._facade;","","    if (!ef) {","        ef = new Y.EventFacade(this, this.currentTarget);","    }","","    if (firstArgIsObj) {","        // protect the event facade properties","        mixFacadeProps(ef, firstArg);","","        // Allow the event type to be faked http://yuilibrary.com/projects/yui3/ticket/2528376","        if (firstArg.type) {","            ef.type = firstArg.type;","        }","","        if (fireArgs) {","            fireArgs[0] = ef;","        }","    } else {","        if (fireArgs) {","            fireArgs.unshift(ef);","        }","    }","","    // update the details field with the arguments","    ef.details = this.details;","","    // use the original target when the event bubbled to this target","    ef.target = this.originalTarget || this.target;","","    ef.currentTarget = this.currentTarget;","    ef.stopped = 0;","    ef.prevented = 0;","","    this._facade = ef;","","    return this._facade;","};","","/**"," * Utility method to manipulate the args array passed in, to add the event facade,"," * if it's not already the first arg."," *"," * @method _addFacadeToArgs"," * @private"," * @param {Array} The arguments to manipulate"," */","CEProto._addFacadeToArgs = function(args) {","    var e = args[0];","","    // Trying not to use instanceof, just to avoid potential cross Y edge case issues.","    if (!(e && e.halt && e.stopImmediatePropagation && e.stopPropagation && e._event)) {","        this._createFacade(args);","    }","};","","/**"," * Stop propagation to bubble targets"," * @for CustomEvent"," * @method stopPropagation"," */","CEProto.stopPropagation = function() {","    this.stopped = 1;","    if (this.stack) {","        this.stack.stopped = 1;","    }","    if (this.events) {","        this.events.fire('stopped', this);","    }","};","","/**"," * Stops propagation to bubble targets, and prevents any remaining"," * subscribers on the current target from executing."," * @method stopImmediatePropagation"," */","CEProto.stopImmediatePropagation = function() {","    this.stopped = 2;","    if (this.stack) {","        this.stack.stopped = 2;","    }","    if (this.events) {","        this.events.fire('stopped', this);","    }","};","","/**"," * Prevents the execution of this event's defaultFn"," * @method preventDefault"," */","CEProto.preventDefault = function() {","    if (this.preventable) {","        this.prevented = 1;","        if (this.stack) {","            this.stack.prevented = 1;","        }","    }","};","","/**"," * Stops the event propagation and prevents the default"," * event behavior."," * @method halt"," * @param immediate {boolean} if true additional listeners"," * on the current target will not be executed"," */","CEProto.halt = function(immediate) {","    if (immediate) {","        this.stopImmediatePropagation();","    } else {","        this.stopPropagation();","    }","    this.preventDefault();","};","","/**"," * Registers another EventTarget as a bubble target.  Bubble order"," * is determined by the order registered.  Multiple targets can"," * be specified."," *"," * Events can only bubble if emitFacade is true."," *"," * Included in the event-custom-complex submodule."," *"," * @method addTarget"," * @param o {EventTarget} the target to add"," * @for EventTarget"," */","ETProto.addTarget = function(o) {","    var etState = this._yuievt;","","    if (!etState.targets) {","        etState.targets = {};","    }","","    etState.targets[Y.stamp(o)] = o;","    etState.hasTargets = true;","};","","/**"," * Returns an array of bubble targets for this object."," * @method getTargets"," * @return EventTarget[]"," */","ETProto.getTargets = function() {","    var targets = this._yuievt.targets;","    return targets ? YObject.values(targets) : [];","};","","/**"," * Removes a bubble target"," * @method removeTarget"," * @param o {EventTarget} the target to remove"," * @for EventTarget"," */","ETProto.removeTarget = function(o) {","    var targets = this._yuievt.targets;","","    if (targets) {","        delete targets[Y.stamp(o, true)];","","        if (YObject.size(targets) === 0) {","            this._yuievt.hasTargets = false;","        }","    }","};","","/**"," * Propagate an event.  Requires the event-custom-complex module."," * @method bubble"," * @param evt {CustomEvent} the custom event to propagate"," * @return {boolean} the aggregated return value from Event.Custom.fire"," * @for EventTarget"," */","ETProto.bubble = function(evt, args, target, es) {","","    var targs = this._yuievt.targets,","        ret = true,","        t,","        ce,","        i,","        bc,","        ce2,","        type = evt && evt.type,","        originalTarget = target || (evt && evt.target) || this,","        oldbubble;","","    if (!evt || ((!evt.stopped) && targs)) {","","        for (i in targs) {","            if (targs.hasOwnProperty(i)) {","","                t = targs[i];","","                ce = t._yuievt.events[type];","","                if (t._hasSiblings) {","                    ce2 = t.getSibling(type, ce);","                }","","                if (ce2 && !ce) {","                    ce = t.publish(type);","                }","","                oldbubble = t._yuievt.bubbling;","                t._yuievt.bubbling = type;","","                // if this event was not published on the bubble target,","                // continue propagating the event.","                if (!ce) {","                    if (t._yuievt.hasTargets) {","                        t.bubble(evt, args, originalTarget, es);","                    }","                } else {","","                    if (ce2) {","                        ce.sibling = ce2;","                    }","","                    // set the original target to that the target payload on the facade is correct.","                    ce.target = originalTarget;","                    ce.originalTarget = originalTarget;","                    ce.currentTarget = t;","                    bc = ce.broadcast;","                    ce.broadcast = false;","","                    // default publish may not have emitFacade true -- that","                    // shouldn't be what the implementer meant to do","                    ce.emitFacade = true;","","                    ce.stack = es;","","                    // TODO: See what's getting in the way of changing this to use","                    // the more performant ce._fire(args || evt.details || []).","","                    // Something in Widget Parent/Child tests is not happy if we","                    // change it - maybe evt.details related?","                    ret = ret && ce.fire.apply(ce, args || evt.details || []);","","                    ce.broadcast = bc;","                    ce.originalTarget = null;","","                    // stopPropagation() was called","                    if (ce.stopped) {","                        break;","                    }","                }","","                t._yuievt.bubbling = oldbubble;","            }","        }","    }","","    return ret;","};","","/**"," * @method _hasPotentialSubscribers"," * @for EventTarget"," * @private"," * @param {String} fullType The fully prefixed type name"," * @return {boolean} Whether the event has potential subscribers or not"," */","ETProto._hasPotentialSubscribers = function(fullType) {","","    var etState = this._yuievt,","        e = etState.events[fullType];","","    if (e) {","        return e.hasSubs() || etState.hasTargets  || e.broadcast;","    } else {","        return false;","    }","};","","FACADE = new Y.EventFacade();","FACADE_KEYS = {};","","// Flatten whitelist","for (key in FACADE) {","    FACADE_KEYS[key] = true;","}","","","}, '@VERSION@', {\"requires\": [\"event-custom-base\"]});"];
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].lines = {"1":0,"11":0,"20":0,"22":0,"23":0,"24":0,"37":0,"39":0,"40":0,"43":0,"50":0,"57":0,"65":0,"74":0,"81":0,"88":0,"92":0,"99":0,"100":0,"110":0,"111":0,"119":0,"120":0,"131":0,"132":0,"133":0,"138":0,"140":0,"163":0,"166":0,"168":0,"169":0,"171":0,"173":0,"177":0,"179":0,"180":0,"182":0,"184":0,"186":0,"200":0,"201":0,"202":0,"204":0,"205":0,"207":0,"209":0,"213":0,"214":0,"218":0,"220":0,"222":0,"223":0,"227":0,"228":0,"230":0,"232":0,"233":0,"234":0,"237":0,"239":0,"240":0,"242":0,"245":0,"247":0,"248":0,"249":0,"250":0,"253":0,"255":0,"256":0,"262":0,"263":0,"266":0,"269":0,"271":0,"273":0,"275":0,"276":0,"277":0,"281":0,"283":0,"284":0,"286":0,"287":0,"291":0,"292":0,"295":0,"296":0,"302":0,"304":0,"306":0,"308":0,"309":0,"310":0,"311":0,"313":0,"314":0,"318":0,"321":0,"323":0,"324":0,"325":0,"326":0,"327":0,"331":0,"333":0,"334":0,"336":0,"337":0,"344":0,"346":0,"355":0,"356":0,"375":0,"377":0,"382":0,"383":0,"386":0,"388":0,"391":0,"392":0,"395":0,"396":0,"399":0,"400":0,"405":0,"408":0,"410":0,"411":0,"412":0,"414":0,"416":0,"427":0,"428":0,"431":0,"432":0,"441":0,"442":0,"443":0,"444":0,"446":0,"447":0,"456":0,"457":0,"458":0,"459":0,"461":0,"462":0,"470":0,"471":0,"472":0,"473":0,"474":0,"486":0,"487":0,"488":0,"490":0,"492":0,"508":0,"509":0,"511":0,"512":0,"515":0,"516":0,"524":0,"525":0,"526":0,"535":0,"536":0,"538":0,"539":0,"541":0,"542":0,"554":0,"556":0,"567":0,"569":0,"570":0,"572":0,"574":0,"576":0,"577":0,"580":0,"581":0,"584":0,"585":0,"589":0,"590":0,"591":0,"595":0,"596":0,"600":0,"601":0,"602":0,"603":0,"604":0,"608":0,"610":0,"617":0,"619":0,"620":0,"623":0,"624":0,"628":0,"633":0,"643":0,"645":0,"648":0,"649":0,"651":0,"655":0,"656":0,"659":0,"660":0};
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].functions = {"mixFacadeProps:19":0,"EventFacade:37":0,"stopPropagation:98":0,"stopImmediatePropagation:109":0,"preventDefault:118":0,"halt:130":0,"(anonymous 2):286":0,"(anonymous 3):295":0,"fireComplex:138":0,"_hasPotentialSubscribers:355":0,"_getFacade:375":0,"_addFacadeToArgs:427":0,"stopPropagation:441":0,"stopImmediatePropagation:456":0,"preventDefault:470":0,"halt:486":0,"addTarget:508":0,"getTargets:524":0,"removeTarget:535":0,"bubble:554":0,"_hasPotentialSubscribers:643":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].coveredLines = 215;
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].coveredFunctions = 22;
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 1);
YUI.add('event-custom-complex', function (Y, NAME) {


/**
 * Adds event facades, preventable default behavior, and bubbling.
 * events.
 * @module event-custom
 * @submodule event-custom-complex
 */

_yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 11);
var FACADE,
    FACADE_KEYS,
    YObject = Y.Object,
    key,
    EMPTY = {},
    CEProto = Y.CustomEvent.prototype,
    ETProto = Y.EventTarget.prototype,

    mixFacadeProps = function(facade, payload) {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "mixFacadeProps", 19);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 20);
var p;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 22);
for (p in payload) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 23);
if (!(FACADE_KEYS.hasOwnProperty(p))) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 24);
facade[p] = payload[p];
            }
        }
    };

/**
 * Wraps and protects a custom event for use when emitFacade is set to true.
 * Requires the event-custom-complex module
 * @class EventFacade
 * @param e {Event} the custom event
 * @param currentTarget {HTMLElement} the element the listener was attached to
 */

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 37);
Y.EventFacade = function(e, currentTarget) {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "EventFacade", 37);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 39);
if (!e) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 40);
e = EMPTY;
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 43);
this._event = e;

    /**
     * The arguments passed to fire
     * @property details
     * @type Array
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 50);
this.details = e.details;

    /**
     * The event type, this can be overridden by the fire() payload
     * @property type
     * @type string
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 57);
this.type = e.type;

    /**
     * The real event type
     * @property _type
     * @type string
     * @private
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 65);
this._type = e.type;

    //////////////////////////////////////////////////////

    /**
     * Node reference for the targeted eventtarget
     * @property target
     * @type Node
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 74);
this.target = e.target;

    /**
     * Node reference for the element that the listener was attached to.
     * @property currentTarget
     * @type Node
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 81);
this.currentTarget = currentTarget;

    /**
     * Node reference to the relatedTarget
     * @property relatedTarget
     * @type Node
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 88);
this.relatedTarget = e.relatedTarget;

};

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 92);
Y.mix(Y.EventFacade.prototype, {

    /**
     * Stops the propagation to the next bubble target
     * @method stopPropagation
     */
    stopPropagation: function() {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "stopPropagation", 98);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 99);
this._event.stopPropagation();
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 100);
this.stopped = 1;
    },

    /**
     * Stops the propagation to the next bubble target and
     * prevents any additional listeners from being exectued
     * on the current target.
     * @method stopImmediatePropagation
     */
    stopImmediatePropagation: function() {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "stopImmediatePropagation", 109);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 110);
this._event.stopImmediatePropagation();
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 111);
this.stopped = 2;
    },

    /**
     * Prevents the event's default behavior
     * @method preventDefault
     */
    preventDefault: function() {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "preventDefault", 118);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 119);
this._event.preventDefault();
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 120);
this.prevented = 1;
    },

    /**
     * Stops the event propagation and prevents the default
     * event behavior.
     * @method halt
     * @param immediate {boolean} if true additional listeners
     * on the current target will not be executed
     */
    halt: function(immediate) {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "halt", 130);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 131);
this._event.halt(immediate);
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 132);
this.prevented = 1;
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 133);
this.stopped = (immediate) ? 2 : 1;
    }

});

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 138);
CEProto.fireComplex = function(args) {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "fireComplex", 138);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 140);
var es,
        ef,
        q,
        queue,
        ce,
        ret = true,
        events,
        subs,
        ons,
        afters,
        afterQueue,
        postponed,
        prevented,
        preventedFn,
        defaultFn,
        self = this,
        host = self.host || self,
        next,
        oldbubble,
        stack = self.stack,
        yuievt = host._yuievt,
        hasPotentialSubscribers;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 163);
if (stack) {

        // queue this event if the current item in the queue bubbles
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 166);
if (self.queuable && self.type !== stack.next.type) {

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 168);
if (!stack.queue) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 169);
stack.queue = [];
            }
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 171);
stack.queue.push([self, args]);

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 173);
return true;
        }
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 177);
hasPotentialSubscribers = self.hasSubs() || yuievt.hasTargets || self.broadcast;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 179);
self.target = self.target || host;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 180);
self.currentTarget = host;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 182);
self.details = args.concat();

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 184);
if (hasPotentialSubscribers) {

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 186);
es = stack || {

           id: self.id, // id of the first event in the stack
           next: self,
           silent: self.silent,
           stopped: 0,
           prevented: 0,
           bubbling: null,
           type: self.type,
           // defaultFnQueue: new Y.Queue(),
           defaultTargetOnly: self.defaultTargetOnly

        };

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 200);
subs = self.getSubs();
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 201);
ons = subs[0];
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 202);
afters = subs[1];

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 204);
self.stopped = (self.type !== es.type) ? 0 : es.stopped;
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 205);
self.prevented = (self.type !== es.type) ? 0 : es.prevented;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 207);
if (self.stoppedFn) {
            // PERF TODO: Can we replace with callback, like preventedFn. Look into history
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 209);
events = new Y.EventTarget({
                fireOnce: true,
                context: host
            });
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 213);
self.events = events;
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 214);
events.on('stopped', self.stoppedFn);
        }


        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 218);
self._facade = null; // kill facade to eliminate stale properties

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 220);
ef = self._createFacade(args);

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 222);
if (ons) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 223);
self._procSubs(ons, args, ef);
        }

        // bubble if this is hosted in an event target and propagation has not been stopped
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 227);
if (self.bubbles && host.bubble && !self.stopped) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 228);
oldbubble = es.bubbling;

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 230);
es.bubbling = self.type;

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 232);
if (es.type !== self.type) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 233);
es.stopped = 0;
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 234);
es.prevented = 0;
            }

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 237);
ret = host.bubble(self, args, null, es);

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 239);
self.stopped = Math.max(self.stopped, es.stopped);
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 240);
self.prevented = Math.max(self.prevented, es.prevented);

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 242);
es.bubbling = oldbubble;
        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 245);
prevented = self.prevented;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 247);
if (prevented) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 248);
preventedFn = self.preventedFn;
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 249);
if (preventedFn) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 250);
preventedFn.apply(host, args);
            }
        } else {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 253);
defaultFn = self.defaultFn;

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 255);
if (defaultFn && ((!self.defaultTargetOnly && !es.defaultTargetOnly) || host === ef.target)) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 256);
defaultFn.apply(host, args);
            }
        }

        // broadcast listeners are fired as discreet events on the
        // YUI instance and potentially the YUI global.
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 262);
if (self.broadcast) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 263);
self._broadcast(args);
        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 266);
if (afters && !self.prevented && self.stopped < 2) {

            // Queue the after
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 269);
afterQueue = es.afterQueue;

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 271);
if (es.id === self.id || self.type !== yuievt.bubbling) {

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 273);
self._procSubs(afters, args, ef);

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 275);
if (afterQueue) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 276);
while ((next = afterQueue.last())) {
                        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 277);
next();
                    }
                }
            } else {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 281);
postponed = afters;

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 283);
if (es.execDefaultCnt) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 284);
postponed = Y.merge(postponed);

                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 286);
Y.each(postponed, function(s) {
                        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "(anonymous 2)", 286);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 287);
s.postponed = true;
                    });
                }

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 291);
if (!afterQueue) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 292);
es.afterQueue = new Y.Queue();
                }

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 295);
es.afterQueue.add(function() {
                    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "(anonymous 3)", 295);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 296);
self._procSubs(postponed, args, ef);
                });
            }

        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 302);
self.target = null;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 304);
if (es.id === self.id) {

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 306);
queue = es.queue;

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 308);
if (queue) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 309);
while (queue.length) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 310);
q = queue.pop();
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 311);
ce = q[0];
                    // set up stack to allow the next item to be processed
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 313);
es.next = ce;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 314);
ce._fire(q[1]);
                }
            }

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 318);
self.stack = null;
        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 321);
ret = !(self.stopped);

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 323);
if (self.type !== yuievt.bubbling) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 324);
es.stopped = 0;
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 325);
es.prevented = 0;
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 326);
self.stopped = 0;
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 327);
self.prevented = 0;
        }

    } else {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 331);
defaultFn = self.defaultFn;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 333);
if(defaultFn) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 334);
ef = self._createFacade(args);

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 336);
if ((!self.defaultTargetOnly) || (host === ef.target)) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 337);
defaultFn.apply(host, args);
            }
        }
    }

    // Kill the cached facade to free up memory.
    // Otherwise we have the facade from the last fire, sitting around forever.
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 344);
self._facade = null;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 346);
return ret;
};

/**
 * @method _hasPotentialSubscribers
 * @for CustomEvent
 * @private
 * @return {boolean} Whether the event has potential subscribers or not
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 355);
CEProto._hasPotentialSubscribers = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "_hasPotentialSubscribers", 355);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 356);
return this.hasSubs() || this.host._yuievt.hasTargets || this.broadcast;
};

/**
 * Internal utility method to create a new facade instance and
 * insert it into the fire argument list, accounting for any payload
 * merging which needs to happen.
 *
 * This used to be called `_getFacade`, but the name seemed inappropriate
 * when it was used without a need for the return value.
 *
 * @method _createFacade
 * @private
 * @param fireArgs {Array} The arguments passed to "fire", which need to be
 * shifted (and potentially merged) when the facade is added.
 * @return {EventFacade} The event facade created.
 */

// TODO: Remove (private) _getFacade alias, once synthetic.js is updated.
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 375);
CEProto._createFacade = CEProto._getFacade = function(fireArgs) {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "_getFacade", 375);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 377);
var userArgs = this.details,
        firstArg = userArgs && userArgs[0],
        firstArgIsObj = (firstArg && (typeof firstArg === "object")),
        ef = this._facade;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 382);
if (!ef) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 383);
ef = new Y.EventFacade(this, this.currentTarget);
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 386);
if (firstArgIsObj) {
        // protect the event facade properties
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 388);
mixFacadeProps(ef, firstArg);

        // Allow the event type to be faked http://yuilibrary.com/projects/yui3/ticket/2528376
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 391);
if (firstArg.type) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 392);
ef.type = firstArg.type;
        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 395);
if (fireArgs) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 396);
fireArgs[0] = ef;
        }
    } else {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 399);
if (fireArgs) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 400);
fireArgs.unshift(ef);
        }
    }

    // update the details field with the arguments
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 405);
ef.details = this.details;

    // use the original target when the event bubbled to this target
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 408);
ef.target = this.originalTarget || this.target;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 410);
ef.currentTarget = this.currentTarget;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 411);
ef.stopped = 0;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 412);
ef.prevented = 0;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 414);
this._facade = ef;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 416);
return this._facade;
};

/**
 * Utility method to manipulate the args array passed in, to add the event facade,
 * if it's not already the first arg.
 *
 * @method _addFacadeToArgs
 * @private
 * @param {Array} The arguments to manipulate
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 427);
CEProto._addFacadeToArgs = function(args) {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "_addFacadeToArgs", 427);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 428);
var e = args[0];

    // Trying not to use instanceof, just to avoid potential cross Y edge case issues.
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 431);
if (!(e && e.halt && e.stopImmediatePropagation && e.stopPropagation && e._event)) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 432);
this._createFacade(args);
    }
};

/**
 * Stop propagation to bubble targets
 * @for CustomEvent
 * @method stopPropagation
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 441);
CEProto.stopPropagation = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "stopPropagation", 441);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 442);
this.stopped = 1;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 443);
if (this.stack) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 444);
this.stack.stopped = 1;
    }
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 446);
if (this.events) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 447);
this.events.fire('stopped', this);
    }
};

/**
 * Stops propagation to bubble targets, and prevents any remaining
 * subscribers on the current target from executing.
 * @method stopImmediatePropagation
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 456);
CEProto.stopImmediatePropagation = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "stopImmediatePropagation", 456);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 457);
this.stopped = 2;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 458);
if (this.stack) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 459);
this.stack.stopped = 2;
    }
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 461);
if (this.events) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 462);
this.events.fire('stopped', this);
    }
};

/**
 * Prevents the execution of this event's defaultFn
 * @method preventDefault
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 470);
CEProto.preventDefault = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "preventDefault", 470);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 471);
if (this.preventable) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 472);
this.prevented = 1;
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 473);
if (this.stack) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 474);
this.stack.prevented = 1;
        }
    }
};

/**
 * Stops the event propagation and prevents the default
 * event behavior.
 * @method halt
 * @param immediate {boolean} if true additional listeners
 * on the current target will not be executed
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 486);
CEProto.halt = function(immediate) {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "halt", 486);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 487);
if (immediate) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 488);
this.stopImmediatePropagation();
    } else {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 490);
this.stopPropagation();
    }
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 492);
this.preventDefault();
};

/**
 * Registers another EventTarget as a bubble target.  Bubble order
 * is determined by the order registered.  Multiple targets can
 * be specified.
 *
 * Events can only bubble if emitFacade is true.
 *
 * Included in the event-custom-complex submodule.
 *
 * @method addTarget
 * @param o {EventTarget} the target to add
 * @for EventTarget
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 508);
ETProto.addTarget = function(o) {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "addTarget", 508);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 509);
var etState = this._yuievt;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 511);
if (!etState.targets) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 512);
etState.targets = {};
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 515);
etState.targets[Y.stamp(o)] = o;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 516);
etState.hasTargets = true;
};

/**
 * Returns an array of bubble targets for this object.
 * @method getTargets
 * @return EventTarget[]
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 524);
ETProto.getTargets = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "getTargets", 524);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 525);
var targets = this._yuievt.targets;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 526);
return targets ? YObject.values(targets) : [];
};

/**
 * Removes a bubble target
 * @method removeTarget
 * @param o {EventTarget} the target to remove
 * @for EventTarget
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 535);
ETProto.removeTarget = function(o) {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "removeTarget", 535);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 536);
var targets = this._yuievt.targets;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 538);
if (targets) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 539);
delete targets[Y.stamp(o, true)];

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 541);
if (YObject.size(targets) === 0) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 542);
this._yuievt.hasTargets = false;
        }
    }
};

/**
 * Propagate an event.  Requires the event-custom-complex module.
 * @method bubble
 * @param evt {CustomEvent} the custom event to propagate
 * @return {boolean} the aggregated return value from Event.Custom.fire
 * @for EventTarget
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 554);
ETProto.bubble = function(evt, args, target, es) {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "bubble", 554);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 556);
var targs = this._yuievt.targets,
        ret = true,
        t,
        ce,
        i,
        bc,
        ce2,
        type = evt && evt.type,
        originalTarget = target || (evt && evt.target) || this,
        oldbubble;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 567);
if (!evt || ((!evt.stopped) && targs)) {

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 569);
for (i in targs) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 570);
if (targs.hasOwnProperty(i)) {

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 572);
t = targs[i];

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 574);
ce = t._yuievt.events[type];

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 576);
if (t._hasSiblings) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 577);
ce2 = t.getSibling(type, ce);
                }

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 580);
if (ce2 && !ce) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 581);
ce = t.publish(type);
                }

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 584);
oldbubble = t._yuievt.bubbling;
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 585);
t._yuievt.bubbling = type;

                // if this event was not published on the bubble target,
                // continue propagating the event.
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 589);
if (!ce) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 590);
if (t._yuievt.hasTargets) {
                        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 591);
t.bubble(evt, args, originalTarget, es);
                    }
                } else {

                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 595);
if (ce2) {
                        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 596);
ce.sibling = ce2;
                    }

                    // set the original target to that the target payload on the facade is correct.
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 600);
ce.target = originalTarget;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 601);
ce.originalTarget = originalTarget;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 602);
ce.currentTarget = t;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 603);
bc = ce.broadcast;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 604);
ce.broadcast = false;

                    // default publish may not have emitFacade true -- that
                    // shouldn't be what the implementer meant to do
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 608);
ce.emitFacade = true;

                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 610);
ce.stack = es;

                    // TODO: See what's getting in the way of changing this to use
                    // the more performant ce._fire(args || evt.details || []).

                    // Something in Widget Parent/Child tests is not happy if we
                    // change it - maybe evt.details related?
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 617);
ret = ret && ce.fire.apply(ce, args || evt.details || []);

                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 619);
ce.broadcast = bc;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 620);
ce.originalTarget = null;

                    // stopPropagation() was called
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 623);
if (ce.stopped) {
                        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 624);
break;
                    }
                }

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 628);
t._yuievt.bubbling = oldbubble;
            }
        }
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 633);
return ret;
};

/**
 * @method _hasPotentialSubscribers
 * @for EventTarget
 * @private
 * @param {String} fullType The fully prefixed type name
 * @return {boolean} Whether the event has potential subscribers or not
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 643);
ETProto._hasPotentialSubscribers = function(fullType) {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "_hasPotentialSubscribers", 643);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 645);
var etState = this._yuievt,
        e = etState.events[fullType];

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 648);
if (e) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 649);
return e.hasSubs() || etState.hasTargets  || e.broadcast;
    } else {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 651);
return false;
    }
};

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 655);
FACADE = new Y.EventFacade();
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 656);
FACADE_KEYS = {};

// Flatten whitelist
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 659);
for (key in FACADE) {
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 660);
FACADE_KEYS[key] = true;
}


}, '@VERSION@', {"requires": ["event-custom-base"]});
