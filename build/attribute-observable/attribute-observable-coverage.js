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
_yuitest_coverage["build/attribute-observable/attribute-observable.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/attribute-observable/attribute-observable.js",
    code: []
};
_yuitest_coverage["build/attribute-observable/attribute-observable.js"].code=["YUI.add('attribute-observable', function (Y, NAME) {","","    /*For log lines*/","    /*jshint maxlen:200*/","","","    /**","     * The attribute module provides an augmentable Attribute implementation, which","     * adds configurable attributes and attribute change events to the class being","     * augmented. It also provides a State class, which is used internally by Attribute,","     * but can also be used independently to provide a name/property/value data structure to","     * store state.","     *","     * @module attribute","     */","","    /**","     * The `attribute-observable` submodule provides augmentable attribute change event support","     * for AttributeCore based implementations.","     *","     * @module attribute","     * @submodule attribute-observable","     */","    var EventTarget = Y.EventTarget,","","        CHANGE = \"Change\",","        BROADCAST = \"broadcast\";","","    /**","     * Provides an augmentable implementation of attribute change events for","     * AttributeCore.","     *","     * @class AttributeObservable","     * @extensionfor AttributeCore","     * @uses EventTarget","     */","    function AttributeObservable() {","        // Perf tweak - avoid creating event literals if not required.","        this._ATTR_E_FACADE = {};","","        EventTarget.call(this, {emitFacade:true});","    }","","    AttributeObservable._ATTR_CFG = [BROADCAST];","","    AttributeObservable.prototype = {","","        /**","         * Sets the value of an attribute.","         *","         * @method set","         * @chainable","         *","         * @param {String} name The name of the attribute. If the","         * current value of the attribute is an Object, dot notation can be used","         * to set the value of a property within the object (e.g. <code>set(\"x.y.z\", 5)</code>).","         *","         * @param {Any} value The value to set the attribute to.","         *","         * @param {Object} opts (Optional) Optional event data to be mixed into","         * the event facade passed to subscribers of the attribute's change event. This","         * can be used as a flexible way to identify the source of a call to set, allowing","         * the developer to distinguish between set called internally by the host, vs.","         * set called externally by the application developer.","         *","         * @return {Object} A reference to the host object.","         */","        set : function(name, val, opts) {","            return this._setAttr(name, val, opts);","        },","","        /**","         * Allows setting of readOnly/writeOnce attributes. See <a href=\"#method_set\">set</a> for argument details.","         *","         * @method _set","         * @protected","         * @chainable","         *","         * @param {String} name The name of the attribute.","         * @param {Any} val The value to set the attribute to.","         * @param {Object} opts (Optional) Optional event data to be mixed into","         * the event facade passed to subscribers of the attribute's change event.","         * @return {Object} A reference to the host object.","         */","        _set : function(name, val, opts) {","            return this._setAttr(name, val, opts, true);","        },","","        /**","         * Sets multiple attribute values.","         *","         * @method setAttrs","         * @param {Object} attrs  An object with attributes name/value pairs.","         * @param {Object} opts  Properties to mix into the event payload. These are shared and mixed into each set","         * @return {Object} A reference to the host object.","         * @chainable","         */","        setAttrs : function(attrs, opts) {","            return this._setAttrs(attrs, opts);","        },","","        /**","         * Implementation behind the public setAttrs method, to set multiple attribute values.","         *","         * @method _setAttrs","         * @protected","         * @param {Object} attrs  An object with attributes name/value pairs.","         * @param {Object} opts  Properties to mix into the event payload. These are shared and mixed into each set","         * @return {Object} A reference to the host object.","         * @chainable","         */","        _setAttrs : function(attrs, opts) {","            var attr;","            for (attr in attrs) {","                if ( attrs.hasOwnProperty(attr) ) {","                    this.set(attr, attrs[attr], opts);","                }","            }","            return this;","        },","","        /**","         * Utility method to help setup the event payload and fire the attribute change event.","         *","         * @method _fireAttrChange","         * @private","         * @param {String} attrName The name of the attribute","         * @param {String} subAttrName The full path of the property being changed,","         * if this is a sub-attribute value being change. Otherwise null.","         * @param {Any} currVal The current value of the attribute","         * @param {Any} newVal The new value of the attribute","         * @param {Object} opts Any additional event data to mix into the attribute change event's event facade.","         * @param {Object} [cfg] The attribute config stored in State, if already available.","         */","        _fireAttrChange : function(attrName, subAttrName, currVal, newVal, opts, cfg) {","            var host = this,","                eventName = this._getFullType(attrName + CHANGE),","                state = host._state,","                facade,","                broadcast,","                e;","","            if (!cfg) {","                cfg = state.data[attrName] || {};","            }","","            if (!cfg.published) {","","                // PERF: Using lower level _publish() for","                // critical path performance","                e = host._publish(eventName);","","                e.emitFacade = true;","                e.defaultTargetOnly = true;","                e.defaultFn = host._defAttrChangeFn;","","                broadcast = cfg.broadcast;","                if (broadcast !== undefined) {","                    e.broadcast = broadcast;","                }","","                cfg.published = true;","            }","","            if (opts) {","                facade = Y.merge(opts);","                facade._attrOpts = opts;","            } else {","                facade = host._ATTR_E_FACADE;","            }","","            // Not using the single object signature for fire({type:..., newVal:...}), since","            // we don't want to override type. Changed to the fire(type, {newVal:...}) signature.","","            facade.attrName = attrName;","            facade.subAttrName = subAttrName;","            facade.prevVal = currVal;","            facade.newVal = newVal;","","            if (host._hasPotentialSubscribers(eventName)) {","                host.fire(eventName, facade);","            } else {","                this._setAttrVal(attrName, subAttrName, currVal, newVal, opts, cfg);","            }","        },","","        /**","         * Default function for attribute change events.","         *","         * @private","         * @method _defAttrChangeFn","         * @param {EventFacade} e The event object for attribute change events.","         * @param {boolean} eventFastPath Whether or not we're using this as a fast path in the case of no listeners or not","         */","        _defAttrChangeFn : function(e, eventFastPath) {","","            var opts = e._attrOpts;","            if (opts) {","                delete e._attrOpts;","            }","","            if (!this._setAttrVal(e.attrName, e.subAttrName, e.prevVal, e.newVal, opts)) {","","","                if (!eventFastPath) {","                    // Prevent \"after\" listeners from being invoked since nothing changed.","                    e.stopImmediatePropagation();","                }","","            } else {","                if (!eventFastPath) {","                    e.newVal = this.get(e.attrName);","                }","            }","        }","    };","","    // Basic prototype augment - no lazy constructor invocation.","    Y.mix(AttributeObservable, EventTarget, false, null, 1);","","    Y.AttributeObservable = AttributeObservable;","","    /**","    The `AttributeEvents` class extension was deprecated in YUI 3.8.0 and is now","    an alias for the `AttributeObservable` class extension. Use that class","    extnesion instead. This alias will be removed in a future version of YUI.","","    @class AttributeEvents","    @uses EventTarget","    @deprecated Use `AttributeObservable` instead.","    @see AttributeObservable","    **/","    Y.AttributeEvents = AttributeObservable;","","","}, '@VERSION@', {\"requires\": [\"event-custom\"]});"];
_yuitest_coverage["build/attribute-observable/attribute-observable.js"].lines = {"1":0,"24":0,"37":0,"39":0,"41":0,"44":0,"46":0,"69":0,"86":0,"99":0,"113":0,"114":0,"115":0,"116":0,"119":0,"136":0,"143":0,"144":0,"147":0,"151":0,"153":0,"154":0,"155":0,"157":0,"158":0,"159":0,"162":0,"165":0,"166":0,"167":0,"169":0,"175":0,"176":0,"177":0,"178":0,"180":0,"181":0,"183":0,"197":0,"198":0,"199":0,"202":0,"205":0,"207":0,"211":0,"212":0,"219":0,"221":0,"233":0};
_yuitest_coverage["build/attribute-observable/attribute-observable.js"].functions = {"AttributeObservable:37":0,"set:68":0,"_set:85":0,"setAttrs:98":0,"_setAttrs:112":0,"_fireAttrChange:135":0,"_defAttrChangeFn:195":0,"(anonymous 1):1":0};
_yuitest_coverage["build/attribute-observable/attribute-observable.js"].coveredLines = 49;
_yuitest_coverage["build/attribute-observable/attribute-observable.js"].coveredFunctions = 8;
_yuitest_coverline("build/attribute-observable/attribute-observable.js", 1);
YUI.add('attribute-observable', function (Y, NAME) {

    /*For log lines*/
    /*jshint maxlen:200*/


    /**
     * The attribute module provides an augmentable Attribute implementation, which
     * adds configurable attributes and attribute change events to the class being
     * augmented. It also provides a State class, which is used internally by Attribute,
     * but can also be used independently to provide a name/property/value data structure to
     * store state.
     *
     * @module attribute
     */

    /**
     * The `attribute-observable` submodule provides augmentable attribute change event support
     * for AttributeCore based implementations.
     *
     * @module attribute
     * @submodule attribute-observable
     */
    _yuitest_coverfunc("build/attribute-observable/attribute-observable.js", "(anonymous 1)", 1);
_yuitest_coverline("build/attribute-observable/attribute-observable.js", 24);
var EventTarget = Y.EventTarget,

        CHANGE = "Change",
        BROADCAST = "broadcast";

    /**
     * Provides an augmentable implementation of attribute change events for
     * AttributeCore.
     *
     * @class AttributeObservable
     * @extensionfor AttributeCore
     * @uses EventTarget
     */
    _yuitest_coverline("build/attribute-observable/attribute-observable.js", 37);
function AttributeObservable() {
        // Perf tweak - avoid creating event literals if not required.
        _yuitest_coverfunc("build/attribute-observable/attribute-observable.js", "AttributeObservable", 37);
_yuitest_coverline("build/attribute-observable/attribute-observable.js", 39);
this._ATTR_E_FACADE = {};

        _yuitest_coverline("build/attribute-observable/attribute-observable.js", 41);
EventTarget.call(this, {emitFacade:true});
    }

    _yuitest_coverline("build/attribute-observable/attribute-observable.js", 44);
AttributeObservable._ATTR_CFG = [BROADCAST];

    _yuitest_coverline("build/attribute-observable/attribute-observable.js", 46);
AttributeObservable.prototype = {

        /**
         * Sets the value of an attribute.
         *
         * @method set
         * @chainable
         *
         * @param {String} name The name of the attribute. If the
         * current value of the attribute is an Object, dot notation can be used
         * to set the value of a property within the object (e.g. <code>set("x.y.z", 5)</code>).
         *
         * @param {Any} value The value to set the attribute to.
         *
         * @param {Object} opts (Optional) Optional event data to be mixed into
         * the event facade passed to subscribers of the attribute's change event. This
         * can be used as a flexible way to identify the source of a call to set, allowing
         * the developer to distinguish between set called internally by the host, vs.
         * set called externally by the application developer.
         *
         * @return {Object} A reference to the host object.
         */
        set : function(name, val, opts) {
            _yuitest_coverfunc("build/attribute-observable/attribute-observable.js", "set", 68);
_yuitest_coverline("build/attribute-observable/attribute-observable.js", 69);
return this._setAttr(name, val, opts);
        },

        /**
         * Allows setting of readOnly/writeOnce attributes. See <a href="#method_set">set</a> for argument details.
         *
         * @method _set
         * @protected
         * @chainable
         *
         * @param {String} name The name of the attribute.
         * @param {Any} val The value to set the attribute to.
         * @param {Object} opts (Optional) Optional event data to be mixed into
         * the event facade passed to subscribers of the attribute's change event.
         * @return {Object} A reference to the host object.
         */
        _set : function(name, val, opts) {
            _yuitest_coverfunc("build/attribute-observable/attribute-observable.js", "_set", 85);
_yuitest_coverline("build/attribute-observable/attribute-observable.js", 86);
return this._setAttr(name, val, opts, true);
        },

        /**
         * Sets multiple attribute values.
         *
         * @method setAttrs
         * @param {Object} attrs  An object with attributes name/value pairs.
         * @param {Object} opts  Properties to mix into the event payload. These are shared and mixed into each set
         * @return {Object} A reference to the host object.
         * @chainable
         */
        setAttrs : function(attrs, opts) {
            _yuitest_coverfunc("build/attribute-observable/attribute-observable.js", "setAttrs", 98);
_yuitest_coverline("build/attribute-observable/attribute-observable.js", 99);
return this._setAttrs(attrs, opts);
        },

        /**
         * Implementation behind the public setAttrs method, to set multiple attribute values.
         *
         * @method _setAttrs
         * @protected
         * @param {Object} attrs  An object with attributes name/value pairs.
         * @param {Object} opts  Properties to mix into the event payload. These are shared and mixed into each set
         * @return {Object} A reference to the host object.
         * @chainable
         */
        _setAttrs : function(attrs, opts) {
            _yuitest_coverfunc("build/attribute-observable/attribute-observable.js", "_setAttrs", 112);
_yuitest_coverline("build/attribute-observable/attribute-observable.js", 113);
var attr;
            _yuitest_coverline("build/attribute-observable/attribute-observable.js", 114);
for (attr in attrs) {
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 115);
if ( attrs.hasOwnProperty(attr) ) {
                    _yuitest_coverline("build/attribute-observable/attribute-observable.js", 116);
this.set(attr, attrs[attr], opts);
                }
            }
            _yuitest_coverline("build/attribute-observable/attribute-observable.js", 119);
return this;
        },

        /**
         * Utility method to help setup the event payload and fire the attribute change event.
         *
         * @method _fireAttrChange
         * @private
         * @param {String} attrName The name of the attribute
         * @param {String} subAttrName The full path of the property being changed,
         * if this is a sub-attribute value being change. Otherwise null.
         * @param {Any} currVal The current value of the attribute
         * @param {Any} newVal The new value of the attribute
         * @param {Object} opts Any additional event data to mix into the attribute change event's event facade.
         * @param {Object} [cfg] The attribute config stored in State, if already available.
         */
        _fireAttrChange : function(attrName, subAttrName, currVal, newVal, opts, cfg) {
            _yuitest_coverfunc("build/attribute-observable/attribute-observable.js", "_fireAttrChange", 135);
_yuitest_coverline("build/attribute-observable/attribute-observable.js", 136);
var host = this,
                eventName = this._getFullType(attrName + CHANGE),
                state = host._state,
                facade,
                broadcast,
                e;

            _yuitest_coverline("build/attribute-observable/attribute-observable.js", 143);
if (!cfg) {
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 144);
cfg = state.data[attrName] || {};
            }

            _yuitest_coverline("build/attribute-observable/attribute-observable.js", 147);
if (!cfg.published) {

                // PERF: Using lower level _publish() for
                // critical path performance
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 151);
e = host._publish(eventName);

                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 153);
e.emitFacade = true;
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 154);
e.defaultTargetOnly = true;
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 155);
e.defaultFn = host._defAttrChangeFn;

                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 157);
broadcast = cfg.broadcast;
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 158);
if (broadcast !== undefined) {
                    _yuitest_coverline("build/attribute-observable/attribute-observable.js", 159);
e.broadcast = broadcast;
                }

                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 162);
cfg.published = true;
            }

            _yuitest_coverline("build/attribute-observable/attribute-observable.js", 165);
if (opts) {
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 166);
facade = Y.merge(opts);
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 167);
facade._attrOpts = opts;
            } else {
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 169);
facade = host._ATTR_E_FACADE;
            }

            // Not using the single object signature for fire({type:..., newVal:...}), since
            // we don't want to override type. Changed to the fire(type, {newVal:...}) signature.

            _yuitest_coverline("build/attribute-observable/attribute-observable.js", 175);
facade.attrName = attrName;
            _yuitest_coverline("build/attribute-observable/attribute-observable.js", 176);
facade.subAttrName = subAttrName;
            _yuitest_coverline("build/attribute-observable/attribute-observable.js", 177);
facade.prevVal = currVal;
            _yuitest_coverline("build/attribute-observable/attribute-observable.js", 178);
facade.newVal = newVal;

            _yuitest_coverline("build/attribute-observable/attribute-observable.js", 180);
if (host._hasPotentialSubscribers(eventName)) {
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 181);
host.fire(eventName, facade);
            } else {
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 183);
this._setAttrVal(attrName, subAttrName, currVal, newVal, opts, cfg);
            }
        },

        /**
         * Default function for attribute change events.
         *
         * @private
         * @method _defAttrChangeFn
         * @param {EventFacade} e The event object for attribute change events.
         * @param {boolean} eventFastPath Whether or not we're using this as a fast path in the case of no listeners or not
         */
        _defAttrChangeFn : function(e, eventFastPath) {

            _yuitest_coverfunc("build/attribute-observable/attribute-observable.js", "_defAttrChangeFn", 195);
_yuitest_coverline("build/attribute-observable/attribute-observable.js", 197);
var opts = e._attrOpts;
            _yuitest_coverline("build/attribute-observable/attribute-observable.js", 198);
if (opts) {
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 199);
delete e._attrOpts;
            }

            _yuitest_coverline("build/attribute-observable/attribute-observable.js", 202);
if (!this._setAttrVal(e.attrName, e.subAttrName, e.prevVal, e.newVal, opts)) {


                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 205);
if (!eventFastPath) {
                    // Prevent "after" listeners from being invoked since nothing changed.
                    _yuitest_coverline("build/attribute-observable/attribute-observable.js", 207);
e.stopImmediatePropagation();
                }

            } else {
                _yuitest_coverline("build/attribute-observable/attribute-observable.js", 211);
if (!eventFastPath) {
                    _yuitest_coverline("build/attribute-observable/attribute-observable.js", 212);
e.newVal = this.get(e.attrName);
                }
            }
        }
    };

    // Basic prototype augment - no lazy constructor invocation.
    _yuitest_coverline("build/attribute-observable/attribute-observable.js", 219);
Y.mix(AttributeObservable, EventTarget, false, null, 1);

    _yuitest_coverline("build/attribute-observable/attribute-observable.js", 221);
Y.AttributeObservable = AttributeObservable;

    /**
    The `AttributeEvents` class extension was deprecated in YUI 3.8.0 and is now
    an alias for the `AttributeObservable` class extension. Use that class
    extnesion instead. This alias will be removed in a future version of YUI.

    @class AttributeEvents
    @uses EventTarget
    @deprecated Use `AttributeObservable` instead.
    @see AttributeObservable
    **/
    _yuitest_coverline("build/attribute-observable/attribute-observable.js", 233);
Y.AttributeEvents = AttributeObservable;


}, '@VERSION@', {"requires": ["event-custom"]});
