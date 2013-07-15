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
_yuitest_coverage["build/base-core/base-core.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/base-core/base-core.js",
    code: []
};
_yuitest_coverage["build/base-core/base-core.js"].code=["YUI.add('base-core', function (Y, NAME) {","","    /**","     * The base module provides the Base class, which objects requiring attribute and custom event support can extend.","     * The module also provides two ways to reuse code - It augments Base with the Plugin.Host interface which provides","     * plugin support and also provides the BaseCore.build method which provides a way to build custom classes using extensions.","     *","     * @module base","     */","","    /**","     * <p>The base-core module provides the BaseCore class, the lightest version of Base,","     * which provides Base's basic lifecycle management and ATTRS construction support,","     * but doesn't fire init/destroy or attribute change events.</p>","     *","     * <p>It mixes in AttributeCore, which is the lightest version of Attribute</p>","     *","     * @module base","     * @submodule base-core","     */","    var O = Y.Object,","        L = Y.Lang,","        DOT = \".\",","        INITIALIZED = \"initialized\",","        DESTROYED = \"destroyed\",","        INITIALIZER = \"initializer\",","        VALUE = \"value\",","        OBJECT_CONSTRUCTOR = Object.prototype.constructor,","        DEEP = \"deep\",","        SHALLOW = \"shallow\",","        DESTRUCTOR = \"destructor\",","","        AttributeCore = Y.AttributeCore,","","        _wlmix = function(r, s, wlhash) {","            var p;","            for (p in s) {","                if(wlhash[p]) {","                    r[p] = s[p];","                }","            }","            return r;","        };","","    /**","     * The BaseCore class, is the lightest version of Base, and provides Base's","     * basic lifecycle management and ATTRS construction support, but doesn't","     * fire init/destroy or attribute change events.","     *","     * BaseCore also handles the chaining of initializer and destructor methods across","     * the hierarchy as part of object construction and destruction. Additionally, attributes","     * configured through the static <a href=\"#property_BaseCore.ATTRS\">ATTRS</a>","     * property for each class in the hierarchy will be initialized by BaseCore.","     *","     * Classes which require attribute support, but don't intend to use/expose attribute","     * change events can extend BaseCore instead of Base for optimal kweight and","     * runtime performance.","     *","     * **3.11.0 BACK COMPAT NOTE FOR COMPONENT DEVELOPERS**","     *","     * Prior to version 3.11.0, ATTRS would get added a class at a time. That is:","     *","     * <pre>","     *    for each (class in the hierarchy) {","     *       Call the class Extension constructors.","     *","     *       Add the class ATTRS.","     *","     *       Call the class initializer","     *       Call the class Extension initializers.","     *    }","     * </pre>","     *","     * As of 3.11.0, ATTRS from all classes in the hierarchy are added in one `addAttrs` call","     * before **any** initializers are called. That is, the flow becomes:","     *","     * <pre>","     *    for each (class in the hierarchy) {","     *       Call the class Extension constructors.","     *    }","     *","     *    Add ATTRS for all classes","     *","     *    for each (class in the hierarchy) {","     *       Call the class initializer.","     *       Call the class Extension initializers.","     *    }","     * </pre>","     *","     * Adding all ATTRS at once fixes subtle edge-case issues with subclass ATTRS overriding","     * superclass `setter`, `getter` or `valueFn` definitions and being unable to get/set attributes","     * defined by the subclass. It also leaves us with a cleaner order of operation flow moving","     * forward.","     *","     * However, it may require component developers to upgrade their components, for the following","     * scenarios:","     *","     * 1. It impacts components which may have `setter`, `getter` or `valueFn` code which","     * expects a superclass' initializer to have run.","     *","     * This is expected to be rare, but to support it, Base now supports a `_preAddAttrs()`, method","     * hook (same signature as `addAttrs`). Components can implement this method on their prototype","     * for edge cases which do require finer control over the order in which attributes are added","     * (see widget-htmlparser for example).","     *","     * 2. Extension developers may need to move code from Extension constructors to `initializer`s","     *","     * Older extensions, which were written before `initializer` support was added, had a lot of","     * initialization code in their constructors. For example, code which acccessed superclass","     * attributes. With the new flow this code would not be able to see attributes. The recommendation","     * is to move this initialization code to an `initializer` on the Extension, which was the","     * recommendation for anything created after `initializer` support for Extensions was added.","     *","     * @class BaseCore","     * @constructor","     * @uses AttributeCore","     * @param {Object} cfg Object with configuration property name/value pairs.","     * The object can be used to provide initial values for the objects published","     * attributes.","     */","    function BaseCore(cfg) {","        if (!this._BaseInvoked) {","            this._BaseInvoked = true;","","            this._initBase(cfg);","        }","    }","","    /**","     * The list of properties which can be configured for each attribute","     * (e.g. setter, getter, writeOnce, readOnly etc.)","     *","     * @property _ATTR_CFG","     * @type Array","     * @static","     * @private","     */","    BaseCore._ATTR_CFG = AttributeCore._ATTR_CFG.concat(\"cloneDefaultValue\");","","    /**","     * The array of non-attribute configuration properties supported by this class.","     *","     * For example `BaseCore` defines a \"plugins\" configuration property which","     * should not be set up as an attribute. This property is primarily required so","     * that when <a href=\"#property__allowAdHocAttrs\">`_allowAdHocAttrs`</a> is enabled by a class,","     * non-attribute configuration properties don't get added as ad-hoc attributes.","     *","     * @property _NON_ATTRS_CFG","     * @type Array","     * @static","     * @private","     */","    BaseCore._NON_ATTRS_CFG = [\"plugins\"];","","    /**","     * This property controls whether or not instances of this class should","     * allow users to add ad-hoc attributes through the constructor configuration","     * hash.","     *","     * AdHoc attributes are attributes which are not defined by the class, and are","     * not handled by the MyClass._NON_ATTRS_CFG","     *","     * @property _allowAdHocAttrs","     * @type boolean","     * @default undefined (false)","     * @protected","     */","","    /**","     * The string to be used to identify instances of this class.","     *","     * Classes extending BaseCore, should define their own","     * static NAME property, which should be camelCase by","     * convention (e.g. MyClass.NAME = \"myClass\";).","     *","     * @property NAME","     * @type String","     * @static","     */","    BaseCore.NAME = \"baseCore\";","","    /**","     * The default set of attributes which will be available for instances of this class, and","     * their configuration. In addition to the configuration properties listed by","     * AttributeCore's <a href=\"AttributeCore.html#method_addAttr\">addAttr</a> method,","     * the attribute can also be configured with a \"cloneDefaultValue\" property, which","     * defines how the statically defined value field should be protected","     * (\"shallow\", \"deep\" and false are supported values).","     *","     * By default if the value is an object literal or an array it will be \"shallow\"","     * cloned, to protect the default value.","     *","     * @property ATTRS","     * @type Object","     * @static","     */","    BaseCore.ATTRS = {","        /**","         * Flag indicating whether or not this object","         * has been through the init lifecycle phase.","         *","         * @attribute initialized","         * @readonly","         * @default false","         * @type boolean","         */","        initialized: {","            readOnly:true,","            value:false","        },","","        /**","         * Flag indicating whether or not this object","         * has been through the destroy lifecycle phase.","         *","         * @attribute destroyed","         * @readonly","         * @default false","         * @type boolean","         */","        destroyed: {","            readOnly:true,","            value:false","        }","    };","","    /**","    Provides a way to safely modify a `Y.BaseCore` subclass' static `ATTRS`","    after the class has been defined or created.","","    BaseCore-based classes cache information about the class hierarchy in order","    to efficiently create instances. This cache includes includes the aggregated","    `ATTRS` configs. If the static `ATTRS` configs need to be modified after the","    class has been defined or create, then use this method which will make sure","    to clear any cached data before making any modifications.","","    @method modifyAttrs","    @param {Function} [ctor] The constructor function whose `ATTRS` should be","        modified. If a `ctor` function is not specified, then `this` is assumed","        to be the constructor which hosts the `ATTRS`.","    @param {Object} configs The collection of `ATTRS` configs to mix with the","        existing attribute configurations.","    @static","    @since 3.10.0","    **/","    BaseCore.modifyAttrs = function (ctor, configs) {","        // When called without a constructor, assume `this` is the constructor.","        if (typeof ctor !== 'function') {","            configs = ctor;","            ctor    = this;","        }","","        var attrs, attr, name;","","        // Eagerly create the `ATTRS` object if it doesn't already exist.","        attrs = ctor.ATTRS || (ctor.ATTRS = {});","","        if (configs) {","            // Clear cache because it has ATTRS aggregation data which is about","            // to be modified.","            ctor._CACHED_CLASS_DATA = null;","","            for (name in configs) {","                if (configs.hasOwnProperty(name)) {","                    attr = attrs[name] || (attrs[name] = {});","                    Y.mix(attr, configs[name], true);","                }","            }","        }","    };","","    BaseCore.prototype = {","","        /**","         * Internal construction logic for BaseCore.","         *","         * @method _initBase","         * @param {Object} config The constructor configuration object","         * @private","         */","        _initBase : function(config) {","","            Y.stamp(this);","","            this._initAttribute(config);","","            // If Plugin.Host has been augmented [ through base-pluginhost ], setup it's","            // initial state, but don't initialize Plugins yet. That's done after initialization.","            var PluginHost = Y.Plugin && Y.Plugin.Host;","            if (this._initPlugins && PluginHost) {","                PluginHost.call(this);","            }","","            if (this._lazyAddAttrs !== false) { this._lazyAddAttrs = true; }","","            /**","             * The string used to identify the class of this object.","             *","             * @deprecated Use this.constructor.NAME","             * @property name","             * @type String","             */","            this.name = this.constructor.NAME;","","            this.init.apply(this, arguments);","        },","","        /**","         * Initializes AttributeCore","         *","         * @method _initAttribute","         * @private","         */","        _initAttribute: function() {","            AttributeCore.call(this);","        },","","        /**","         * Init lifecycle method, invoked during construction. Sets up attributes","         * and invokes initializers for the class hierarchy.","         *","         * @method init","         * @chainable","         * @param {Object} cfg Object with configuration property name/value pairs","         * @return {BaseCore} A reference to this object","         */","        init: function(cfg) {","","            this._baseInit(cfg);","","            return this;","        },","","        /**","         * Internal initialization implementation for BaseCore","         *","         * @method _baseInit","         * @private","         */","        _baseInit: function(cfg) {","            this._initHierarchy(cfg);","","            if (this._initPlugins) {","                // Need to initPlugins manually, to handle constructor parsing, static Plug parsing","                this._initPlugins(cfg);","            }","            this._set(INITIALIZED, true);","        },","","        /**","         * Destroy lifecycle method. Invokes destructors for the class hierarchy.","         *","         * @method destroy","         * @return {BaseCore} A reference to this object","         * @chainable","         */","        destroy: function() {","            this._baseDestroy();","            return this;","        },","","        /**","         * Internal destroy implementation for BaseCore","         *","         * @method _baseDestroy","         * @private","         */","        _baseDestroy : function() {","            if (this._destroyPlugins) {","                this._destroyPlugins();","            }","            this._destroyHierarchy();","            this._set(DESTROYED, true);","        },","","        /**","         * Returns the class hierarchy for this object, with BaseCore being the last class in the array.","         *","         * @method _getClasses","         * @protected","         * @return {Function[]} An array of classes (constructor functions), making up the class hierarchy for this object.","         * This value is cached the first time the method, or _getAttrCfgs, is invoked. Subsequent invocations return the","         * cached value.","         */","        _getClasses : function() {","            if (!this._classes) {","                this._initHierarchyData();","            }","            return this._classes;","        },","","        /**","         * Returns an aggregated set of attribute configurations, by traversing","         * the class hierarchy.","         *","         * @method _getAttrCfgs","         * @protected","         * @return {Object} The hash of attribute configurations, aggregated across classes in the hierarchy","         * This value is cached the first time the method, or _getClasses, is invoked. Subsequent invocations return","         * the cached value.","         */","        _getAttrCfgs : function() {","            if (!this._attrs) {","                this._initHierarchyData();","            }","            return this._attrs;","        },","","        /**","         * A helper method used to isolate the attrs config for this instance to pass to `addAttrs`,","         * from the static cached ATTRS for the class.","         *","         * @method _getInstanceAttrCfgs","         * @private","         *","         * @param {Object} allCfgs The set of all attribute configurations for this instance.","         * Attributes will be removed from this set, if they belong to the filtered class, so","         * that by the time all classes are processed, allCfgs will be empty.","         *","         * @return {Object} The set of attributes to be added for this instance, suitable","         * for passing through to `addAttrs`.","         */","        _getInstanceAttrCfgs : function(allCfgs) {","","            var cfgs = {},","                cfg,","                val,","                subAttr,","                subAttrs,","                subAttrPath,","                attr,","                attrCfg,","                allSubAttrs = allCfgs._subAttrs,","                attrCfgProperties = this._attrCfgHash();","","            for (attr in allCfgs) {","","                if (allCfgs.hasOwnProperty(attr) && attr !== \"_subAttrs\") {","","                    attrCfg = allCfgs[attr];","","                    // Need to isolate from allCfgs, because we're going to set values etc.","                    cfg = cfgs[attr] = _wlmix({}, attrCfg, attrCfgProperties);","","                    val = cfg.value;","","                    if (val && (typeof val === \"object\")) {","                        this._cloneDefaultValue(attr, cfg);","                    }","","                    if (allSubAttrs && allSubAttrs.hasOwnProperty(attr)) {","                        subAttrs = allCfgs._subAttrs[attr];","","                        for (subAttrPath in subAttrs) {","                            subAttr = subAttrs[subAttrPath];","","                            if (subAttr.path) {","                                O.setValue(cfg.value, subAttr.path, subAttr.value);","                            }","                        }","                    }","                }","            }","","            return cfgs;","        },","","        /**","         * @method _filterAdHocAttrs","         * @private","         *","         * @param {Object} allAttrs The set of all attribute configurations for this instance.","         * Attributes will be removed from this set, if they belong to the filtered class, so","         * that by the time all classes are processed, allCfgs will be empty.","         * @param {Object} userVals The config object passed in by the user, from which adhoc attrs are to be filtered.","         * @return {Object} The set of adhoc attributes passed in, in the form","         * of an object with attribute name/configuration pairs.","         */","        _filterAdHocAttrs : function(allAttrs, userVals) {","            var adHocs,","                nonAttrs = this._nonAttrs,","                attr;","","            if (userVals) {","                adHocs = {};","                for (attr in userVals) {","                    if (!allAttrs[attr] && !nonAttrs[attr] && userVals.hasOwnProperty(attr)) {","                        adHocs[attr] = {","                            value:userVals[attr]","                        };","                    }","                }","            }","","            return adHocs;","        },","","        /**","         * A helper method used by _getClasses and _getAttrCfgs, which determines both","         * the array of classes and aggregate set of attribute configurations","         * across the class hierarchy for the instance.","         *","         * @method _initHierarchyData","         * @private","         */","        _initHierarchyData : function() {","","            var ctor = this.constructor,","                cachedClassData = ctor._CACHED_CLASS_DATA,","                c,","                i,","                l,","                attrCfg,","                attrCfgHash,","                needsAttrCfgHash = !ctor._ATTR_CFG_HASH,","                nonAttrsCfg,","                nonAttrs = {},","                classes = [],","                attrs = [];","","            // Start with `this` instance's constructor.","            c = ctor;","","            if (!cachedClassData) {","","                while (c) {","                    // Add to classes","                    classes[classes.length] = c;","","                    // Add to attributes","                    if (c.ATTRS) {","                        attrs[attrs.length] = c.ATTRS;","                    }","","                    // Aggregate ATTR cfg whitelist.","                    if (needsAttrCfgHash) {","                        attrCfg     = c._ATTR_CFG;","                        attrCfgHash = attrCfgHash || {};","","                        if (attrCfg) {","                            for (i = 0, l = attrCfg.length; i < l; i += 1) {","                                attrCfgHash[attrCfg[i]] = true;","                            }","                        }","                    }","","                    // Commenting out the if. We always aggregate, since we don't","                    // know if we'll be needing this on the instance or not.","                    // if (this._allowAdHocAttrs) {","                        nonAttrsCfg = c._NON_ATTRS_CFG;","                        if (nonAttrsCfg) {","                            for (i = 0, l = nonAttrsCfg.length; i < l; i++) {","                                nonAttrs[nonAttrsCfg[i]] = true;","                            }","                        }","                    //}","","                    c = c.superclass ? c.superclass.constructor : null;","                }","","                // Cache computed `_ATTR_CFG_HASH` on the constructor.","                if (needsAttrCfgHash) {","                    ctor._ATTR_CFG_HASH = attrCfgHash;","                }","","                cachedClassData = ctor._CACHED_CLASS_DATA = {","                    classes : classes,","                    nonAttrs : nonAttrs,","                    attrs : this._aggregateAttrs(attrs)","                };","","            }","","            this._classes = cachedClassData.classes;","            this._attrs = cachedClassData.attrs;","            this._nonAttrs = cachedClassData.nonAttrs;","        },","","        /**","         * Utility method to define the attribute hash used to filter/whitelist property mixes for","         * this class for iteration performance reasons.","         *","         * @method _attrCfgHash","         * @private","         */","        _attrCfgHash: function() {","            return this.constructor._ATTR_CFG_HASH;","        },","","        /**","         * This method assumes that the value has already been checked to be an object.","         * Since it's on a critical path, we don't want to re-do the check.","         *","         * @method _cloneDefaultValue","         * @param {Object} cfg","         * @private","         */","        _cloneDefaultValue : function(attr, cfg) {","","            var val = cfg.value,","                clone = cfg.cloneDefaultValue;","","            if (clone === DEEP || clone === true) {","                cfg.value = Y.clone(val);","            } else if (clone === SHALLOW) {","                cfg.value = Y.merge(val);","            } else if ((clone === undefined && (OBJECT_CONSTRUCTOR === val.constructor || L.isArray(val)))) {","                cfg.value = Y.clone(val);","            }","            // else if (clone === false), don't clone the static default value.","            // It's intended to be used by reference.","        },","","        /**","         * A helper method, used by _initHierarchyData to aggregate","         * attribute configuration across the instances class hierarchy.","         *","         * The method will protect the attribute configuration value to protect the statically defined","         * default value in ATTRS if required (if the value is an object literal, array or the","         * attribute configuration has cloneDefaultValue set to shallow or deep).","         *","         * @method _aggregateAttrs","         * @private","         * @param {Array} allAttrs An array of ATTRS definitions across classes in the hierarchy","         * (subclass first, Base last)","         * @return {Object} The aggregate set of ATTRS definitions for the instance","         */","        _aggregateAttrs : function(allAttrs) {","","            var attr,","                attrs,","                subAttrsHash,","                cfg,","                path,","                i,","                cfgPropsHash = this._attrCfgHash(),","                aggAttr,","                aggAttrs = {};","","            if (allAttrs) {","                for (i = allAttrs.length-1; i >= 0; --i) {","","                    attrs = allAttrs[i];","","                    for (attr in attrs) {","                        if (attrs.hasOwnProperty(attr)) {","","                            // PERF TODO: Do we need to merge here, since we're merging later in getInstanceAttrCfgs","                            // Should we move this down to only merge if we hit the path or valueFn ifs below?","                            cfg = _wlmix({}, attrs[attr], cfgPropsHash);","","                            path = null;","                            if (attr.indexOf(DOT) !== -1) {","                                path = attr.split(DOT);","                                attr = path.shift();","                            }","","                            aggAttr = aggAttrs[attr];","","                            if (path && aggAttr && aggAttr.value) {","","                                subAttrsHash = aggAttrs._subAttrs;","","                                if (!subAttrsHash) {","                                    subAttrsHash = aggAttrs._subAttrs = {};","                                }","","                                if (!subAttrsHash[attr]) {","                                    subAttrsHash[attr] = {};","                                }","","                                subAttrsHash[attr][path.join(DOT)] = {","                                    value: cfg.value,","                                    path : path","                                };","","                            } else if (!path) {","","                                if (!aggAttr) {","                                    aggAttrs[attr] = cfg;","                                } else {","                                    if (aggAttr.valueFn && VALUE in cfg) {","                                        aggAttr.valueFn = null;","                                    }","","                                    // Mix into existing config.","                                    _wlmix(aggAttr, cfg, cfgPropsHash);","                                }","                            }","                        }","                    }","                }","            }","","            return aggAttrs;","        },","","        /**","         * Initializes the class hierarchy for the instance, which includes","         * initializing attributes for each class defined in the class's","         * static <a href=\"#property_BaseCore.ATTRS\">ATTRS</a> property and","         * invoking the initializer method on the prototype of each class in the hierarchy.","         *","         * @method _initHierarchy","         * @param {Object} userVals Object with configuration property name/value pairs","         * @private","         */","        _initHierarchy : function(userVals) {","","            var lazy = this._lazyAddAttrs,","                constr,","                constrProto,","                i,","                l,","                ci,","                ei,","                el,","                ext,","                extProto,","                exts,","                instanceAttrs,","                initializers = [],","                classes = this._getClasses(),","                attrCfgs = this._getAttrCfgs(),","                cl = classes.length - 1;","","            // Constructors","            for (ci = cl; ci >= 0; ci--) {","","                constr = classes[ci];","                constrProto = constr.prototype;","                exts = constr._yuibuild && constr._yuibuild.exts;","","                // Using INITIALIZER in hasOwnProperty check, for performance reasons (helps IE6 avoid GC thresholds when","                // referencing string literals). Not using it in apply, again, for performance \".\" is faster.","","                if (constrProto.hasOwnProperty(INITIALIZER)) {","                    // Store initializer while we're here and looping","                    initializers[initializers.length] = constrProto.initializer;","                }","","                if (exts) {","                    for (ei = 0, el = exts.length; ei < el; ei++) {","","                        ext = exts[ei];","","                        // Ext Constructor","                        ext.apply(this, arguments);","","                        extProto = ext.prototype;","                        if (extProto.hasOwnProperty(INITIALIZER)) {","                            // Store initializer while we're here and looping","                            initializers[initializers.length] = extProto.initializer;","                        }","                    }","                }","            }","","            // ATTRS","            instanceAttrs = this._getInstanceAttrCfgs(attrCfgs);","","            if (this._preAddAttrs) {","                this._preAddAttrs(instanceAttrs, userVals, lazy);","            }","","            if (this._allowAdHocAttrs) {","                this.addAttrs(this._filterAdHocAttrs(attrCfgs, userVals), userVals, lazy);","            }","","            this.addAttrs(instanceAttrs, userVals, lazy);","","            // Initializers","            for (i = 0, l = initializers.length; i < l; i++) {","                initializers[i].apply(this, arguments);","            }","        },","","        /**","         * Destroys the class hierarchy for this instance by invoking","         * the destructor method on the prototype of each class in the hierarchy.","         *","         * @method _destroyHierarchy","         * @private","         */","        _destroyHierarchy : function() {","            var constr,","                constrProto,","                ci, cl, ei, el, exts, extProto,","                classes = this._getClasses();","","            for (ci = 0, cl = classes.length; ci < cl; ci++) {","                constr = classes[ci];","                constrProto = constr.prototype;","                exts = constr._yuibuild && constr._yuibuild.exts;","","                if (exts) {","                    for (ei = 0, el = exts.length; ei < el; ei++) {","                        extProto = exts[ei].prototype;","                        if (extProto.hasOwnProperty(DESTRUCTOR)) {","                            extProto.destructor.apply(this, arguments);","                        }","                    }","                }","","                if (constrProto.hasOwnProperty(DESTRUCTOR)) {","                    constrProto.destructor.apply(this, arguments);","                }","            }","        },","","        /**","         * Default toString implementation. Provides the constructor NAME","         * and the instance guid, if set.","         *","         * @method toString","         * @return {String} String representation for this object","         */","        toString: function() {","            return this.name + \"[\" + Y.stamp(this, true) + \"]\";","        }","    };","","    // Straightup augment, no wrapper functions","    Y.mix(BaseCore, AttributeCore, false, null, 1);","","    // Fix constructor","    BaseCore.prototype.constructor = BaseCore;","","    Y.BaseCore = BaseCore;","","","}, '@VERSION@', {\"requires\": [\"attribute-core\"]});"];
_yuitest_coverage["build/base-core/base-core.js"].lines = {"1":0,"21":0,"36":0,"37":0,"38":0,"39":0,"42":0,"121":0,"122":0,"123":0,"125":0,"138":0,"153":0,"180":0,"197":0,"246":0,"248":0,"249":0,"250":0,"253":0,"256":0,"258":0,"261":0,"263":0,"264":0,"265":0,"266":0,"272":0,"283":0,"285":0,"289":0,"290":0,"291":0,"294":0,"303":0,"305":0,"315":0,"329":0,"331":0,"341":0,"343":0,"345":0,"347":0,"358":0,"359":0,"369":0,"370":0,"372":0,"373":0,"386":0,"387":0,"389":0,"403":0,"404":0,"406":0,"425":0,"436":0,"438":0,"440":0,"443":0,"445":0,"447":0,"448":0,"451":0,"452":0,"454":0,"455":0,"457":0,"458":0,"465":0,"480":0,"484":0,"485":0,"486":0,"487":0,"488":0,"495":0,"508":0,"522":0,"524":0,"526":0,"528":0,"531":0,"532":0,"536":0,"537":0,"538":0,"540":0,"541":0,"542":0,"550":0,"551":0,"552":0,"553":0,"558":0,"562":0,"563":0,"566":0,"574":0,"575":0,"576":0,"587":0,"600":0,"603":0,"604":0,"605":0,"606":0,"607":0,"608":0,"630":0,"640":0,"641":0,"643":0,"645":0,"646":0,"650":0,"652":0,"653":0,"654":0,"655":0,"658":0,"660":0,"662":0,"664":0,"665":0,"668":0,"669":0,"672":0,"677":0,"679":0,"680":0,"682":0,"683":0,"687":0,"695":0,"710":0,"728":0,"730":0,"731":0,"732":0,"737":0,"739":0,"742":0,"743":0,"745":0,"748":0,"750":0,"751":0,"753":0,"760":0,"762":0,"763":0,"766":0,"767":0,"770":0,"773":0,"774":0,"786":0,"791":0,"792":0,"793":0,"794":0,"796":0,"797":0,"798":0,"799":0,"800":0,"805":0,"806":0,"819":0,"824":0,"827":0,"829":0};
_yuitest_coverage["build/base-core/base-core.js"].functions = {"_wlmix:35":0,"BaseCore:121":0,"modifyAttrs:246":0,"_initBase:281":0,"_initAttribute:314":0,"init:327":0,"_baseInit:340":0,"destroy:357":0,"_baseDestroy:368":0,"_getClasses:385":0,"_getAttrCfgs:402":0,"_getInstanceAttrCfgs:423":0,"_filterAdHocAttrs:479":0,"_initHierarchyData:506":0,"_attrCfgHash:586":0,"_cloneDefaultValue:598":0,"_aggregateAttrs:628":0,"_initHierarchy:708":0,"_destroyHierarchy:785":0,"toString:818":0,"(anonymous 1):1":0};
_yuitest_coverage["build/base-core/base-core.js"].coveredLines = 173;
_yuitest_coverage["build/base-core/base-core.js"].coveredFunctions = 21;
_yuitest_coverline("build/base-core/base-core.js", 1);
YUI.add('base-core', function (Y, NAME) {

    /**
     * The base module provides the Base class, which objects requiring attribute and custom event support can extend.
     * The module also provides two ways to reuse code - It augments Base with the Plugin.Host interface which provides
     * plugin support and also provides the BaseCore.build method which provides a way to build custom classes using extensions.
     *
     * @module base
     */

    /**
     * <p>The base-core module provides the BaseCore class, the lightest version of Base,
     * which provides Base's basic lifecycle management and ATTRS construction support,
     * but doesn't fire init/destroy or attribute change events.</p>
     *
     * <p>It mixes in AttributeCore, which is the lightest version of Attribute</p>
     *
     * @module base
     * @submodule base-core
     */
    _yuitest_coverfunc("build/base-core/base-core.js", "(anonymous 1)", 1);
_yuitest_coverline("build/base-core/base-core.js", 21);
var O = Y.Object,
        L = Y.Lang,
        DOT = ".",
        INITIALIZED = "initialized",
        DESTROYED = "destroyed",
        INITIALIZER = "initializer",
        VALUE = "value",
        OBJECT_CONSTRUCTOR = Object.prototype.constructor,
        DEEP = "deep",
        SHALLOW = "shallow",
        DESTRUCTOR = "destructor",

        AttributeCore = Y.AttributeCore,

        _wlmix = function(r, s, wlhash) {
            _yuitest_coverfunc("build/base-core/base-core.js", "_wlmix", 35);
_yuitest_coverline("build/base-core/base-core.js", 36);
var p;
            _yuitest_coverline("build/base-core/base-core.js", 37);
for (p in s) {
                _yuitest_coverline("build/base-core/base-core.js", 38);
if(wlhash[p]) {
                    _yuitest_coverline("build/base-core/base-core.js", 39);
r[p] = s[p];
                }
            }
            _yuitest_coverline("build/base-core/base-core.js", 42);
return r;
        };

    /**
     * The BaseCore class, is the lightest version of Base, and provides Base's
     * basic lifecycle management and ATTRS construction support, but doesn't
     * fire init/destroy or attribute change events.
     *
     * BaseCore also handles the chaining of initializer and destructor methods across
     * the hierarchy as part of object construction and destruction. Additionally, attributes
     * configured through the static <a href="#property_BaseCore.ATTRS">ATTRS</a>
     * property for each class in the hierarchy will be initialized by BaseCore.
     *
     * Classes which require attribute support, but don't intend to use/expose attribute
     * change events can extend BaseCore instead of Base for optimal kweight and
     * runtime performance.
     *
     * **3.11.0 BACK COMPAT NOTE FOR COMPONENT DEVELOPERS**
     *
     * Prior to version 3.11.0, ATTRS would get added a class at a time. That is:
     *
     * <pre>
     *    for each (class in the hierarchy) {
     *       Call the class Extension constructors.
     *
     *       Add the class ATTRS.
     *
     *       Call the class initializer
     *       Call the class Extension initializers.
     *    }
     * </pre>
     *
     * As of 3.11.0, ATTRS from all classes in the hierarchy are added in one `addAttrs` call
     * before **any** initializers are called. That is, the flow becomes:
     *
     * <pre>
     *    for each (class in the hierarchy) {
     *       Call the class Extension constructors.
     *    }
     *
     *    Add ATTRS for all classes
     *
     *    for each (class in the hierarchy) {
     *       Call the class initializer.
     *       Call the class Extension initializers.
     *    }
     * </pre>
     *
     * Adding all ATTRS at once fixes subtle edge-case issues with subclass ATTRS overriding
     * superclass `setter`, `getter` or `valueFn` definitions and being unable to get/set attributes
     * defined by the subclass. It also leaves us with a cleaner order of operation flow moving
     * forward.
     *
     * However, it may require component developers to upgrade their components, for the following
     * scenarios:
     *
     * 1. It impacts components which may have `setter`, `getter` or `valueFn` code which
     * expects a superclass' initializer to have run.
     *
     * This is expected to be rare, but to support it, Base now supports a `_preAddAttrs()`, method
     * hook (same signature as `addAttrs`). Components can implement this method on their prototype
     * for edge cases which do require finer control over the order in which attributes are added
     * (see widget-htmlparser for example).
     *
     * 2. Extension developers may need to move code from Extension constructors to `initializer`s
     *
     * Older extensions, which were written before `initializer` support was added, had a lot of
     * initialization code in their constructors. For example, code which acccessed superclass
     * attributes. With the new flow this code would not be able to see attributes. The recommendation
     * is to move this initialization code to an `initializer` on the Extension, which was the
     * recommendation for anything created after `initializer` support for Extensions was added.
     *
     * @class BaseCore
     * @constructor
     * @uses AttributeCore
     * @param {Object} cfg Object with configuration property name/value pairs.
     * The object can be used to provide initial values for the objects published
     * attributes.
     */
    _yuitest_coverline("build/base-core/base-core.js", 121);
function BaseCore(cfg) {
        _yuitest_coverfunc("build/base-core/base-core.js", "BaseCore", 121);
_yuitest_coverline("build/base-core/base-core.js", 122);
if (!this._BaseInvoked) {
            _yuitest_coverline("build/base-core/base-core.js", 123);
this._BaseInvoked = true;

            _yuitest_coverline("build/base-core/base-core.js", 125);
this._initBase(cfg);
        }
    }

    /**
     * The list of properties which can be configured for each attribute
     * (e.g. setter, getter, writeOnce, readOnly etc.)
     *
     * @property _ATTR_CFG
     * @type Array
     * @static
     * @private
     */
    _yuitest_coverline("build/base-core/base-core.js", 138);
BaseCore._ATTR_CFG = AttributeCore._ATTR_CFG.concat("cloneDefaultValue");

    /**
     * The array of non-attribute configuration properties supported by this class.
     *
     * For example `BaseCore` defines a "plugins" configuration property which
     * should not be set up as an attribute. This property is primarily required so
     * that when <a href="#property__allowAdHocAttrs">`_allowAdHocAttrs`</a> is enabled by a class,
     * non-attribute configuration properties don't get added as ad-hoc attributes.
     *
     * @property _NON_ATTRS_CFG
     * @type Array
     * @static
     * @private
     */
    _yuitest_coverline("build/base-core/base-core.js", 153);
BaseCore._NON_ATTRS_CFG = ["plugins"];

    /**
     * This property controls whether or not instances of this class should
     * allow users to add ad-hoc attributes through the constructor configuration
     * hash.
     *
     * AdHoc attributes are attributes which are not defined by the class, and are
     * not handled by the MyClass._NON_ATTRS_CFG
     *
     * @property _allowAdHocAttrs
     * @type boolean
     * @default undefined (false)
     * @protected
     */

    /**
     * The string to be used to identify instances of this class.
     *
     * Classes extending BaseCore, should define their own
     * static NAME property, which should be camelCase by
     * convention (e.g. MyClass.NAME = "myClass";).
     *
     * @property NAME
     * @type String
     * @static
     */
    _yuitest_coverline("build/base-core/base-core.js", 180);
BaseCore.NAME = "baseCore";

    /**
     * The default set of attributes which will be available for instances of this class, and
     * their configuration. In addition to the configuration properties listed by
     * AttributeCore's <a href="AttributeCore.html#method_addAttr">addAttr</a> method,
     * the attribute can also be configured with a "cloneDefaultValue" property, which
     * defines how the statically defined value field should be protected
     * ("shallow", "deep" and false are supported values).
     *
     * By default if the value is an object literal or an array it will be "shallow"
     * cloned, to protect the default value.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    _yuitest_coverline("build/base-core/base-core.js", 197);
BaseCore.ATTRS = {
        /**
         * Flag indicating whether or not this object
         * has been through the init lifecycle phase.
         *
         * @attribute initialized
         * @readonly
         * @default false
         * @type boolean
         */
        initialized: {
            readOnly:true,
            value:false
        },

        /**
         * Flag indicating whether or not this object
         * has been through the destroy lifecycle phase.
         *
         * @attribute destroyed
         * @readonly
         * @default false
         * @type boolean
         */
        destroyed: {
            readOnly:true,
            value:false
        }
    };

    /**
    Provides a way to safely modify a `Y.BaseCore` subclass' static `ATTRS`
    after the class has been defined or created.

    BaseCore-based classes cache information about the class hierarchy in order
    to efficiently create instances. This cache includes includes the aggregated
    `ATTRS` configs. If the static `ATTRS` configs need to be modified after the
    class has been defined or create, then use this method which will make sure
    to clear any cached data before making any modifications.

    @method modifyAttrs
    @param {Function} [ctor] The constructor function whose `ATTRS` should be
        modified. If a `ctor` function is not specified, then `this` is assumed
        to be the constructor which hosts the `ATTRS`.
    @param {Object} configs The collection of `ATTRS` configs to mix with the
        existing attribute configurations.
    @static
    @since 3.10.0
    **/
    _yuitest_coverline("build/base-core/base-core.js", 246);
BaseCore.modifyAttrs = function (ctor, configs) {
        // When called without a constructor, assume `this` is the constructor.
        _yuitest_coverfunc("build/base-core/base-core.js", "modifyAttrs", 246);
_yuitest_coverline("build/base-core/base-core.js", 248);
if (typeof ctor !== 'function') {
            _yuitest_coverline("build/base-core/base-core.js", 249);
configs = ctor;
            _yuitest_coverline("build/base-core/base-core.js", 250);
ctor    = this;
        }

        _yuitest_coverline("build/base-core/base-core.js", 253);
var attrs, attr, name;

        // Eagerly create the `ATTRS` object if it doesn't already exist.
        _yuitest_coverline("build/base-core/base-core.js", 256);
attrs = ctor.ATTRS || (ctor.ATTRS = {});

        _yuitest_coverline("build/base-core/base-core.js", 258);
if (configs) {
            // Clear cache because it has ATTRS aggregation data which is about
            // to be modified.
            _yuitest_coverline("build/base-core/base-core.js", 261);
ctor._CACHED_CLASS_DATA = null;

            _yuitest_coverline("build/base-core/base-core.js", 263);
for (name in configs) {
                _yuitest_coverline("build/base-core/base-core.js", 264);
if (configs.hasOwnProperty(name)) {
                    _yuitest_coverline("build/base-core/base-core.js", 265);
attr = attrs[name] || (attrs[name] = {});
                    _yuitest_coverline("build/base-core/base-core.js", 266);
Y.mix(attr, configs[name], true);
                }
            }
        }
    };

    _yuitest_coverline("build/base-core/base-core.js", 272);
BaseCore.prototype = {

        /**
         * Internal construction logic for BaseCore.
         *
         * @method _initBase
         * @param {Object} config The constructor configuration object
         * @private
         */
        _initBase : function(config) {

            _yuitest_coverfunc("build/base-core/base-core.js", "_initBase", 281);
_yuitest_coverline("build/base-core/base-core.js", 283);
Y.stamp(this);

            _yuitest_coverline("build/base-core/base-core.js", 285);
this._initAttribute(config);

            // If Plugin.Host has been augmented [ through base-pluginhost ], setup it's
            // initial state, but don't initialize Plugins yet. That's done after initialization.
            _yuitest_coverline("build/base-core/base-core.js", 289);
var PluginHost = Y.Plugin && Y.Plugin.Host;
            _yuitest_coverline("build/base-core/base-core.js", 290);
if (this._initPlugins && PluginHost) {
                _yuitest_coverline("build/base-core/base-core.js", 291);
PluginHost.call(this);
            }

            _yuitest_coverline("build/base-core/base-core.js", 294);
if (this._lazyAddAttrs !== false) { this._lazyAddAttrs = true; }

            /**
             * The string used to identify the class of this object.
             *
             * @deprecated Use this.constructor.NAME
             * @property name
             * @type String
             */
            _yuitest_coverline("build/base-core/base-core.js", 303);
this.name = this.constructor.NAME;

            _yuitest_coverline("build/base-core/base-core.js", 305);
this.init.apply(this, arguments);
        },

        /**
         * Initializes AttributeCore
         *
         * @method _initAttribute
         * @private
         */
        _initAttribute: function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_initAttribute", 314);
_yuitest_coverline("build/base-core/base-core.js", 315);
AttributeCore.call(this);
        },

        /**
         * Init lifecycle method, invoked during construction. Sets up attributes
         * and invokes initializers for the class hierarchy.
         *
         * @method init
         * @chainable
         * @param {Object} cfg Object with configuration property name/value pairs
         * @return {BaseCore} A reference to this object
         */
        init: function(cfg) {

            _yuitest_coverfunc("build/base-core/base-core.js", "init", 327);
_yuitest_coverline("build/base-core/base-core.js", 329);
this._baseInit(cfg);

            _yuitest_coverline("build/base-core/base-core.js", 331);
return this;
        },

        /**
         * Internal initialization implementation for BaseCore
         *
         * @method _baseInit
         * @private
         */
        _baseInit: function(cfg) {
            _yuitest_coverfunc("build/base-core/base-core.js", "_baseInit", 340);
_yuitest_coverline("build/base-core/base-core.js", 341);
this._initHierarchy(cfg);

            _yuitest_coverline("build/base-core/base-core.js", 343);
if (this._initPlugins) {
                // Need to initPlugins manually, to handle constructor parsing, static Plug parsing
                _yuitest_coverline("build/base-core/base-core.js", 345);
this._initPlugins(cfg);
            }
            _yuitest_coverline("build/base-core/base-core.js", 347);
this._set(INITIALIZED, true);
        },

        /**
         * Destroy lifecycle method. Invokes destructors for the class hierarchy.
         *
         * @method destroy
         * @return {BaseCore} A reference to this object
         * @chainable
         */
        destroy: function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "destroy", 357);
_yuitest_coverline("build/base-core/base-core.js", 358);
this._baseDestroy();
            _yuitest_coverline("build/base-core/base-core.js", 359);
return this;
        },

        /**
         * Internal destroy implementation for BaseCore
         *
         * @method _baseDestroy
         * @private
         */
        _baseDestroy : function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_baseDestroy", 368);
_yuitest_coverline("build/base-core/base-core.js", 369);
if (this._destroyPlugins) {
                _yuitest_coverline("build/base-core/base-core.js", 370);
this._destroyPlugins();
            }
            _yuitest_coverline("build/base-core/base-core.js", 372);
this._destroyHierarchy();
            _yuitest_coverline("build/base-core/base-core.js", 373);
this._set(DESTROYED, true);
        },

        /**
         * Returns the class hierarchy for this object, with BaseCore being the last class in the array.
         *
         * @method _getClasses
         * @protected
         * @return {Function[]} An array of classes (constructor functions), making up the class hierarchy for this object.
         * This value is cached the first time the method, or _getAttrCfgs, is invoked. Subsequent invocations return the
         * cached value.
         */
        _getClasses : function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_getClasses", 385);
_yuitest_coverline("build/base-core/base-core.js", 386);
if (!this._classes) {
                _yuitest_coverline("build/base-core/base-core.js", 387);
this._initHierarchyData();
            }
            _yuitest_coverline("build/base-core/base-core.js", 389);
return this._classes;
        },

        /**
         * Returns an aggregated set of attribute configurations, by traversing
         * the class hierarchy.
         *
         * @method _getAttrCfgs
         * @protected
         * @return {Object} The hash of attribute configurations, aggregated across classes in the hierarchy
         * This value is cached the first time the method, or _getClasses, is invoked. Subsequent invocations return
         * the cached value.
         */
        _getAttrCfgs : function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_getAttrCfgs", 402);
_yuitest_coverline("build/base-core/base-core.js", 403);
if (!this._attrs) {
                _yuitest_coverline("build/base-core/base-core.js", 404);
this._initHierarchyData();
            }
            _yuitest_coverline("build/base-core/base-core.js", 406);
return this._attrs;
        },

        /**
         * A helper method used to isolate the attrs config for this instance to pass to `addAttrs`,
         * from the static cached ATTRS for the class.
         *
         * @method _getInstanceAttrCfgs
         * @private
         *
         * @param {Object} allCfgs The set of all attribute configurations for this instance.
         * Attributes will be removed from this set, if they belong to the filtered class, so
         * that by the time all classes are processed, allCfgs will be empty.
         *
         * @return {Object} The set of attributes to be added for this instance, suitable
         * for passing through to `addAttrs`.
         */
        _getInstanceAttrCfgs : function(allCfgs) {

            _yuitest_coverfunc("build/base-core/base-core.js", "_getInstanceAttrCfgs", 423);
_yuitest_coverline("build/base-core/base-core.js", 425);
var cfgs = {},
                cfg,
                val,
                subAttr,
                subAttrs,
                subAttrPath,
                attr,
                attrCfg,
                allSubAttrs = allCfgs._subAttrs,
                attrCfgProperties = this._attrCfgHash();

            _yuitest_coverline("build/base-core/base-core.js", 436);
for (attr in allCfgs) {

                _yuitest_coverline("build/base-core/base-core.js", 438);
if (allCfgs.hasOwnProperty(attr) && attr !== "_subAttrs") {

                    _yuitest_coverline("build/base-core/base-core.js", 440);
attrCfg = allCfgs[attr];

                    // Need to isolate from allCfgs, because we're going to set values etc.
                    _yuitest_coverline("build/base-core/base-core.js", 443);
cfg = cfgs[attr] = _wlmix({}, attrCfg, attrCfgProperties);

                    _yuitest_coverline("build/base-core/base-core.js", 445);
val = cfg.value;

                    _yuitest_coverline("build/base-core/base-core.js", 447);
if (val && (typeof val === "object")) {
                        _yuitest_coverline("build/base-core/base-core.js", 448);
this._cloneDefaultValue(attr, cfg);
                    }

                    _yuitest_coverline("build/base-core/base-core.js", 451);
if (allSubAttrs && allSubAttrs.hasOwnProperty(attr)) {
                        _yuitest_coverline("build/base-core/base-core.js", 452);
subAttrs = allCfgs._subAttrs[attr];

                        _yuitest_coverline("build/base-core/base-core.js", 454);
for (subAttrPath in subAttrs) {
                            _yuitest_coverline("build/base-core/base-core.js", 455);
subAttr = subAttrs[subAttrPath];

                            _yuitest_coverline("build/base-core/base-core.js", 457);
if (subAttr.path) {
                                _yuitest_coverline("build/base-core/base-core.js", 458);
O.setValue(cfg.value, subAttr.path, subAttr.value);
                            }
                        }
                    }
                }
            }

            _yuitest_coverline("build/base-core/base-core.js", 465);
return cfgs;
        },

        /**
         * @method _filterAdHocAttrs
         * @private
         *
         * @param {Object} allAttrs The set of all attribute configurations for this instance.
         * Attributes will be removed from this set, if they belong to the filtered class, so
         * that by the time all classes are processed, allCfgs will be empty.
         * @param {Object} userVals The config object passed in by the user, from which adhoc attrs are to be filtered.
         * @return {Object} The set of adhoc attributes passed in, in the form
         * of an object with attribute name/configuration pairs.
         */
        _filterAdHocAttrs : function(allAttrs, userVals) {
            _yuitest_coverfunc("build/base-core/base-core.js", "_filterAdHocAttrs", 479);
_yuitest_coverline("build/base-core/base-core.js", 480);
var adHocs,
                nonAttrs = this._nonAttrs,
                attr;

            _yuitest_coverline("build/base-core/base-core.js", 484);
if (userVals) {
                _yuitest_coverline("build/base-core/base-core.js", 485);
adHocs = {};
                _yuitest_coverline("build/base-core/base-core.js", 486);
for (attr in userVals) {
                    _yuitest_coverline("build/base-core/base-core.js", 487);
if (!allAttrs[attr] && !nonAttrs[attr] && userVals.hasOwnProperty(attr)) {
                        _yuitest_coverline("build/base-core/base-core.js", 488);
adHocs[attr] = {
                            value:userVals[attr]
                        };
                    }
                }
            }

            _yuitest_coverline("build/base-core/base-core.js", 495);
return adHocs;
        },

        /**
         * A helper method used by _getClasses and _getAttrCfgs, which determines both
         * the array of classes and aggregate set of attribute configurations
         * across the class hierarchy for the instance.
         *
         * @method _initHierarchyData
         * @private
         */
        _initHierarchyData : function() {

            _yuitest_coverfunc("build/base-core/base-core.js", "_initHierarchyData", 506);
_yuitest_coverline("build/base-core/base-core.js", 508);
var ctor = this.constructor,
                cachedClassData = ctor._CACHED_CLASS_DATA,
                c,
                i,
                l,
                attrCfg,
                attrCfgHash,
                needsAttrCfgHash = !ctor._ATTR_CFG_HASH,
                nonAttrsCfg,
                nonAttrs = {},
                classes = [],
                attrs = [];

            // Start with `this` instance's constructor.
            _yuitest_coverline("build/base-core/base-core.js", 522);
c = ctor;

            _yuitest_coverline("build/base-core/base-core.js", 524);
if (!cachedClassData) {

                _yuitest_coverline("build/base-core/base-core.js", 526);
while (c) {
                    // Add to classes
                    _yuitest_coverline("build/base-core/base-core.js", 528);
classes[classes.length] = c;

                    // Add to attributes
                    _yuitest_coverline("build/base-core/base-core.js", 531);
if (c.ATTRS) {
                        _yuitest_coverline("build/base-core/base-core.js", 532);
attrs[attrs.length] = c.ATTRS;
                    }

                    // Aggregate ATTR cfg whitelist.
                    _yuitest_coverline("build/base-core/base-core.js", 536);
if (needsAttrCfgHash) {
                        _yuitest_coverline("build/base-core/base-core.js", 537);
attrCfg     = c._ATTR_CFG;
                        _yuitest_coverline("build/base-core/base-core.js", 538);
attrCfgHash = attrCfgHash || {};

                        _yuitest_coverline("build/base-core/base-core.js", 540);
if (attrCfg) {
                            _yuitest_coverline("build/base-core/base-core.js", 541);
for (i = 0, l = attrCfg.length; i < l; i += 1) {
                                _yuitest_coverline("build/base-core/base-core.js", 542);
attrCfgHash[attrCfg[i]] = true;
                            }
                        }
                    }

                    // Commenting out the if. We always aggregate, since we don't
                    // know if we'll be needing this on the instance or not.
                    // if (this._allowAdHocAttrs) {
                        _yuitest_coverline("build/base-core/base-core.js", 550);
nonAttrsCfg = c._NON_ATTRS_CFG;
                        _yuitest_coverline("build/base-core/base-core.js", 551);
if (nonAttrsCfg) {
                            _yuitest_coverline("build/base-core/base-core.js", 552);
for (i = 0, l = nonAttrsCfg.length; i < l; i++) {
                                _yuitest_coverline("build/base-core/base-core.js", 553);
nonAttrs[nonAttrsCfg[i]] = true;
                            }
                        }
                    //}

                    _yuitest_coverline("build/base-core/base-core.js", 558);
c = c.superclass ? c.superclass.constructor : null;
                }

                // Cache computed `_ATTR_CFG_HASH` on the constructor.
                _yuitest_coverline("build/base-core/base-core.js", 562);
if (needsAttrCfgHash) {
                    _yuitest_coverline("build/base-core/base-core.js", 563);
ctor._ATTR_CFG_HASH = attrCfgHash;
                }

                _yuitest_coverline("build/base-core/base-core.js", 566);
cachedClassData = ctor._CACHED_CLASS_DATA = {
                    classes : classes,
                    nonAttrs : nonAttrs,
                    attrs : this._aggregateAttrs(attrs)
                };

            }

            _yuitest_coverline("build/base-core/base-core.js", 574);
this._classes = cachedClassData.classes;
            _yuitest_coverline("build/base-core/base-core.js", 575);
this._attrs = cachedClassData.attrs;
            _yuitest_coverline("build/base-core/base-core.js", 576);
this._nonAttrs = cachedClassData.nonAttrs;
        },

        /**
         * Utility method to define the attribute hash used to filter/whitelist property mixes for
         * this class for iteration performance reasons.
         *
         * @method _attrCfgHash
         * @private
         */
        _attrCfgHash: function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_attrCfgHash", 586);
_yuitest_coverline("build/base-core/base-core.js", 587);
return this.constructor._ATTR_CFG_HASH;
        },

        /**
         * This method assumes that the value has already been checked to be an object.
         * Since it's on a critical path, we don't want to re-do the check.
         *
         * @method _cloneDefaultValue
         * @param {Object} cfg
         * @private
         */
        _cloneDefaultValue : function(attr, cfg) {

            _yuitest_coverfunc("build/base-core/base-core.js", "_cloneDefaultValue", 598);
_yuitest_coverline("build/base-core/base-core.js", 600);
var val = cfg.value,
                clone = cfg.cloneDefaultValue;

            _yuitest_coverline("build/base-core/base-core.js", 603);
if (clone === DEEP || clone === true) {
                _yuitest_coverline("build/base-core/base-core.js", 604);
cfg.value = Y.clone(val);
            } else {_yuitest_coverline("build/base-core/base-core.js", 605);
if (clone === SHALLOW) {
                _yuitest_coverline("build/base-core/base-core.js", 606);
cfg.value = Y.merge(val);
            } else {_yuitest_coverline("build/base-core/base-core.js", 607);
if ((clone === undefined && (OBJECT_CONSTRUCTOR === val.constructor || L.isArray(val)))) {
                _yuitest_coverline("build/base-core/base-core.js", 608);
cfg.value = Y.clone(val);
            }}}
            // else if (clone === false), don't clone the static default value.
            // It's intended to be used by reference.
        },

        /**
         * A helper method, used by _initHierarchyData to aggregate
         * attribute configuration across the instances class hierarchy.
         *
         * The method will protect the attribute configuration value to protect the statically defined
         * default value in ATTRS if required (if the value is an object literal, array or the
         * attribute configuration has cloneDefaultValue set to shallow or deep).
         *
         * @method _aggregateAttrs
         * @private
         * @param {Array} allAttrs An array of ATTRS definitions across classes in the hierarchy
         * (subclass first, Base last)
         * @return {Object} The aggregate set of ATTRS definitions for the instance
         */
        _aggregateAttrs : function(allAttrs) {

            _yuitest_coverfunc("build/base-core/base-core.js", "_aggregateAttrs", 628);
_yuitest_coverline("build/base-core/base-core.js", 630);
var attr,
                attrs,
                subAttrsHash,
                cfg,
                path,
                i,
                cfgPropsHash = this._attrCfgHash(),
                aggAttr,
                aggAttrs = {};

            _yuitest_coverline("build/base-core/base-core.js", 640);
if (allAttrs) {
                _yuitest_coverline("build/base-core/base-core.js", 641);
for (i = allAttrs.length-1; i >= 0; --i) {

                    _yuitest_coverline("build/base-core/base-core.js", 643);
attrs = allAttrs[i];

                    _yuitest_coverline("build/base-core/base-core.js", 645);
for (attr in attrs) {
                        _yuitest_coverline("build/base-core/base-core.js", 646);
if (attrs.hasOwnProperty(attr)) {

                            // PERF TODO: Do we need to merge here, since we're merging later in getInstanceAttrCfgs
                            // Should we move this down to only merge if we hit the path or valueFn ifs below?
                            _yuitest_coverline("build/base-core/base-core.js", 650);
cfg = _wlmix({}, attrs[attr], cfgPropsHash);

                            _yuitest_coverline("build/base-core/base-core.js", 652);
path = null;
                            _yuitest_coverline("build/base-core/base-core.js", 653);
if (attr.indexOf(DOT) !== -1) {
                                _yuitest_coverline("build/base-core/base-core.js", 654);
path = attr.split(DOT);
                                _yuitest_coverline("build/base-core/base-core.js", 655);
attr = path.shift();
                            }

                            _yuitest_coverline("build/base-core/base-core.js", 658);
aggAttr = aggAttrs[attr];

                            _yuitest_coverline("build/base-core/base-core.js", 660);
if (path && aggAttr && aggAttr.value) {

                                _yuitest_coverline("build/base-core/base-core.js", 662);
subAttrsHash = aggAttrs._subAttrs;

                                _yuitest_coverline("build/base-core/base-core.js", 664);
if (!subAttrsHash) {
                                    _yuitest_coverline("build/base-core/base-core.js", 665);
subAttrsHash = aggAttrs._subAttrs = {};
                                }

                                _yuitest_coverline("build/base-core/base-core.js", 668);
if (!subAttrsHash[attr]) {
                                    _yuitest_coverline("build/base-core/base-core.js", 669);
subAttrsHash[attr] = {};
                                }

                                _yuitest_coverline("build/base-core/base-core.js", 672);
subAttrsHash[attr][path.join(DOT)] = {
                                    value: cfg.value,
                                    path : path
                                };

                            } else {_yuitest_coverline("build/base-core/base-core.js", 677);
if (!path) {

                                _yuitest_coverline("build/base-core/base-core.js", 679);
if (!aggAttr) {
                                    _yuitest_coverline("build/base-core/base-core.js", 680);
aggAttrs[attr] = cfg;
                                } else {
                                    _yuitest_coverline("build/base-core/base-core.js", 682);
if (aggAttr.valueFn && VALUE in cfg) {
                                        _yuitest_coverline("build/base-core/base-core.js", 683);
aggAttr.valueFn = null;
                                    }

                                    // Mix into existing config.
                                    _yuitest_coverline("build/base-core/base-core.js", 687);
_wlmix(aggAttr, cfg, cfgPropsHash);
                                }
                            }}
                        }
                    }
                }
            }

            _yuitest_coverline("build/base-core/base-core.js", 695);
return aggAttrs;
        },

        /**
         * Initializes the class hierarchy for the instance, which includes
         * initializing attributes for each class defined in the class's
         * static <a href="#property_BaseCore.ATTRS">ATTRS</a> property and
         * invoking the initializer method on the prototype of each class in the hierarchy.
         *
         * @method _initHierarchy
         * @param {Object} userVals Object with configuration property name/value pairs
         * @private
         */
        _initHierarchy : function(userVals) {

            _yuitest_coverfunc("build/base-core/base-core.js", "_initHierarchy", 708);
_yuitest_coverline("build/base-core/base-core.js", 710);
var lazy = this._lazyAddAttrs,
                constr,
                constrProto,
                i,
                l,
                ci,
                ei,
                el,
                ext,
                extProto,
                exts,
                instanceAttrs,
                initializers = [],
                classes = this._getClasses(),
                attrCfgs = this._getAttrCfgs(),
                cl = classes.length - 1;

            // Constructors
            _yuitest_coverline("build/base-core/base-core.js", 728);
for (ci = cl; ci >= 0; ci--) {

                _yuitest_coverline("build/base-core/base-core.js", 730);
constr = classes[ci];
                _yuitest_coverline("build/base-core/base-core.js", 731);
constrProto = constr.prototype;
                _yuitest_coverline("build/base-core/base-core.js", 732);
exts = constr._yuibuild && constr._yuibuild.exts;

                // Using INITIALIZER in hasOwnProperty check, for performance reasons (helps IE6 avoid GC thresholds when
                // referencing string literals). Not using it in apply, again, for performance "." is faster.

                _yuitest_coverline("build/base-core/base-core.js", 737);
if (constrProto.hasOwnProperty(INITIALIZER)) {
                    // Store initializer while we're here and looping
                    _yuitest_coverline("build/base-core/base-core.js", 739);
initializers[initializers.length] = constrProto.initializer;
                }

                _yuitest_coverline("build/base-core/base-core.js", 742);
if (exts) {
                    _yuitest_coverline("build/base-core/base-core.js", 743);
for (ei = 0, el = exts.length; ei < el; ei++) {

                        _yuitest_coverline("build/base-core/base-core.js", 745);
ext = exts[ei];

                        // Ext Constructor
                        _yuitest_coverline("build/base-core/base-core.js", 748);
ext.apply(this, arguments);

                        _yuitest_coverline("build/base-core/base-core.js", 750);
extProto = ext.prototype;
                        _yuitest_coverline("build/base-core/base-core.js", 751);
if (extProto.hasOwnProperty(INITIALIZER)) {
                            // Store initializer while we're here and looping
                            _yuitest_coverline("build/base-core/base-core.js", 753);
initializers[initializers.length] = extProto.initializer;
                        }
                    }
                }
            }

            // ATTRS
            _yuitest_coverline("build/base-core/base-core.js", 760);
instanceAttrs = this._getInstanceAttrCfgs(attrCfgs);

            _yuitest_coverline("build/base-core/base-core.js", 762);
if (this._preAddAttrs) {
                _yuitest_coverline("build/base-core/base-core.js", 763);
this._preAddAttrs(instanceAttrs, userVals, lazy);
            }

            _yuitest_coverline("build/base-core/base-core.js", 766);
if (this._allowAdHocAttrs) {
                _yuitest_coverline("build/base-core/base-core.js", 767);
this.addAttrs(this._filterAdHocAttrs(attrCfgs, userVals), userVals, lazy);
            }

            _yuitest_coverline("build/base-core/base-core.js", 770);
this.addAttrs(instanceAttrs, userVals, lazy);

            // Initializers
            _yuitest_coverline("build/base-core/base-core.js", 773);
for (i = 0, l = initializers.length; i < l; i++) {
                _yuitest_coverline("build/base-core/base-core.js", 774);
initializers[i].apply(this, arguments);
            }
        },

        /**
         * Destroys the class hierarchy for this instance by invoking
         * the destructor method on the prototype of each class in the hierarchy.
         *
         * @method _destroyHierarchy
         * @private
         */
        _destroyHierarchy : function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_destroyHierarchy", 785);
_yuitest_coverline("build/base-core/base-core.js", 786);
var constr,
                constrProto,
                ci, cl, ei, el, exts, extProto,
                classes = this._getClasses();

            _yuitest_coverline("build/base-core/base-core.js", 791);
for (ci = 0, cl = classes.length; ci < cl; ci++) {
                _yuitest_coverline("build/base-core/base-core.js", 792);
constr = classes[ci];
                _yuitest_coverline("build/base-core/base-core.js", 793);
constrProto = constr.prototype;
                _yuitest_coverline("build/base-core/base-core.js", 794);
exts = constr._yuibuild && constr._yuibuild.exts;

                _yuitest_coverline("build/base-core/base-core.js", 796);
if (exts) {
                    _yuitest_coverline("build/base-core/base-core.js", 797);
for (ei = 0, el = exts.length; ei < el; ei++) {
                        _yuitest_coverline("build/base-core/base-core.js", 798);
extProto = exts[ei].prototype;
                        _yuitest_coverline("build/base-core/base-core.js", 799);
if (extProto.hasOwnProperty(DESTRUCTOR)) {
                            _yuitest_coverline("build/base-core/base-core.js", 800);
extProto.destructor.apply(this, arguments);
                        }
                    }
                }

                _yuitest_coverline("build/base-core/base-core.js", 805);
if (constrProto.hasOwnProperty(DESTRUCTOR)) {
                    _yuitest_coverline("build/base-core/base-core.js", 806);
constrProto.destructor.apply(this, arguments);
                }
            }
        },

        /**
         * Default toString implementation. Provides the constructor NAME
         * and the instance guid, if set.
         *
         * @method toString
         * @return {String} String representation for this object
         */
        toString: function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "toString", 818);
_yuitest_coverline("build/base-core/base-core.js", 819);
return this.name + "[" + Y.stamp(this, true) + "]";
        }
    };

    // Straightup augment, no wrapper functions
    _yuitest_coverline("build/base-core/base-core.js", 824);
Y.mix(BaseCore, AttributeCore, false, null, 1);

    // Fix constructor
    _yuitest_coverline("build/base-core/base-core.js", 827);
BaseCore.prototype.constructor = BaseCore;

    _yuitest_coverline("build/base-core/base-core.js", 829);
Y.BaseCore = BaseCore;


}, '@VERSION@', {"requires": ["attribute-core"]});
