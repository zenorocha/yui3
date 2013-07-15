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
_yuitest_coverage["build/widget-position-constrain/widget-position-constrain.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-position-constrain/widget-position-constrain.js",
    code: []
};
_yuitest_coverage["build/widget-position-constrain/widget-position-constrain.js"].code=["YUI.add('widget-position-constrain', function (Y, NAME) {","","/**"," * Provides constrained xy positioning support for Widgets, through an extension."," *"," * It builds on top of the widget-position module, to provide constrained positioning support."," *"," * @module widget-position-constrain"," */","var CONSTRAIN = \"constrain\",","    CONSTRAIN_XYCHANGE = \"constrain|xyChange\",","    CONSTRAIN_CHANGE = \"constrainChange\",","","    PREVENT_OVERLAP = \"preventOverlap\",","    ALIGN = \"align\",","","    EMPTY_STR = \"\",","","    BINDUI = \"bindUI\",","","    XY = \"xy\",","    X_COORD = \"x\",","    Y_COORD = \"y\",","","    Node = Y.Node,","","    VIEWPORT_REGION = \"viewportRegion\",","    REGION = \"region\",","","    PREVENT_OVERLAP_MAP;","","/**"," * A widget extension, which can be used to add constrained xy positioning support to the base Widget class,"," * through the <a href=\"Base.html#method_build\">Base.build</a> method. This extension requires that"," * the WidgetPosition extension be added to the Widget (before WidgetPositionConstrain, if part of the same"," * extension list passed to Base.build)."," *"," * @class WidgetPositionConstrain"," * @param {Object} User configuration object"," */","function PositionConstrain(config) {}","","/**"," * Static property used to define the default attribute"," * configuration introduced by WidgetPositionConstrain."," *"," * @property ATTRS"," * @type Object"," * @static"," */","PositionConstrain.ATTRS = {","","    /**","     * @attribute constrain","     * @type boolean | Node","     * @default null","     * @description The node to constrain the widget's bounding box to, when setting xy. Can also be","     * set to true, to constrain to the viewport.","     */","    constrain : {","        value: null,","        setter: \"_setConstrain\"","    },","","    /**","     * @attribute preventOverlap","     * @type boolean","     * @description If set to true, and WidgetPositionAlign is also added to the Widget,","     * constrained positioning will attempt to prevent the widget's bounding box from overlapping","     * the element to which it has been aligned, by flipping the orientation of the alignment","     * for corner based alignments","     */","    preventOverlap : {","        value:false","    }","};","","/**"," * @property _PREVENT_OVERLAP"," * @static"," * @protected"," * @type Object"," * @description The set of positions for which to prevent"," * overlap."," */","PREVENT_OVERLAP_MAP = PositionConstrain._PREVENT_OVERLAP = {","    x: {","        \"tltr\": 1,","        \"blbr\": 1,","        \"brbl\": 1,","        \"trtl\": 1","    },","    y : {","        \"trbr\": 1,","        \"tlbl\": 1,","        \"bltl\": 1,","        \"brtr\": 1","    }","};","","PositionConstrain.prototype = {","","    initializer : function() {","        if (!this._posNode) {","            Y.error(\"WidgetPosition needs to be added to the Widget, before WidgetPositionConstrain is added\");","        }","        Y.after(this._bindUIPosConstrained, this, BINDUI);","    },","","    /**","     * Calculates the constrained positions for the XY positions provided, using","     * the provided node argument is passed in. If no node value is passed in, the value of","     * the \"constrain\" attribute is used.","     *","     * @method getConstrainedXY","     * @param {Array} xy The xy values to constrain","     * @param {Node | boolean} node Optional. The node to constrain to, or true for the viewport","     * @return {Array} The constrained xy values","     */","    getConstrainedXY : function(xy, node) {","        node = node || this.get(CONSTRAIN);","","        var constrainingRegion = this._getRegion((node === true) ? null : node),","            nodeRegion = this._posNode.get(REGION);","","        return [","            this._constrain(xy[0], X_COORD, nodeRegion, constrainingRegion),","            this._constrain(xy[1], Y_COORD, nodeRegion, constrainingRegion)","        ];","    },","","    /**","     * Constrains the widget's bounding box to a node (or the viewport). If xy or node are not","     * passed in, the current position and the value of \"constrain\" will be used respectively.","     *","     * The widget's position will be changed to the constrained position.","     *","     * @method constrain","     * @param {Array} xy Optional. The xy values to constrain","     * @param {Node | boolean} node Optional. The node to constrain to, or true for the viewport","     */","    constrain : function(xy, node) {","        var currentXY,","            constrainedXY,","            constraint = node || this.get(CONSTRAIN);","","        if (constraint) {","            currentXY = xy || this.get(XY);","            constrainedXY = this.getConstrainedXY(currentXY, constraint);","","            if (constrainedXY[0] !== currentXY[0] || constrainedXY[1] !== currentXY[1]) {","                this.set(XY, constrainedXY, { constrained:true });","            }","        }","    },","","    /**","     * The setter implementation for the \"constrain\" attribute.","     *","     * @method _setConstrain","     * @protected","     * @param {Node | boolean} val The attribute value","     */","    _setConstrain : function(val) {","        return (val === true) ? val : Node.one(val);","    },","","    /**","     * The method which performs the actual constrain calculations for a given axis (\"x\" or \"y\") based","     * on the regions provided.","     *","     * @method _constrain","     * @protected","     *","     * @param {Number} val The value to constrain","     * @param {String} axis The axis to use for constrainment","     * @param {Region} nodeRegion The region of the node to constrain","     * @param {Region} constrainingRegion The region of the node (or viewport) to constrain to","     *","     * @return {Number} The constrained value","     */","    _constrain: function(val, axis, nodeRegion, constrainingRegion) {","        if (constrainingRegion) {","","            if (this.get(PREVENT_OVERLAP)) {","                val = this._preventOverlap(val, axis, nodeRegion, constrainingRegion);","            }","","            var x = (axis == X_COORD),","","                regionSize    = (x) ? constrainingRegion.width : constrainingRegion.height,","                nodeSize      = (x) ? nodeRegion.width : nodeRegion.height,","                minConstraint = (x) ? constrainingRegion.left : constrainingRegion.top,","                maxConstraint = (x) ? constrainingRegion.right - nodeSize : constrainingRegion.bottom - nodeSize;","","            if (val < minConstraint || val > maxConstraint) {","                if (nodeSize < regionSize) {","                    if (val < minConstraint) {","                        val = minConstraint;","                    } else if (val > maxConstraint) {","                        val = maxConstraint;","                    }","                } else {","                    val = minConstraint;","                }","            }","        }","","        return val;","    },","","    /**","     * The method which performs the preventOverlap calculations for a given axis (\"x\" or \"y\") based","     * on the value and regions provided.","     *","     * @method _preventOverlap","     * @protected","     *","     * @param {Number} val The value being constrain","     * @param {String} axis The axis to being constrained","     * @param {Region} nodeRegion The region of the node being constrained","     * @param {Region} constrainingRegion The region of the node (or viewport) we need to constrain to","     *","     * @return {Number} The constrained value","     */","    _preventOverlap : function(val, axis, nodeRegion, constrainingRegion) {","","        var align = this.get(ALIGN),","            x = (axis === X_COORD),","            nodeSize,","            alignRegion,","            nearEdge,","            farEdge,","            spaceOnNearSide,","            spaceOnFarSide;","","        if (align && align.points && PREVENT_OVERLAP_MAP[axis][align.points.join(EMPTY_STR)]) {","","            alignRegion = this._getRegion(align.node);","","            if (alignRegion) {","                nodeSize        = (x) ? nodeRegion.width : nodeRegion.height;","                nearEdge        = (x) ? alignRegion.left : alignRegion.top;","                farEdge         = (x) ? alignRegion.right : alignRegion.bottom;","                spaceOnNearSide = (x) ? alignRegion.left - constrainingRegion.left : alignRegion.top - constrainingRegion.top;","                spaceOnFarSide  = (x) ? constrainingRegion.right - alignRegion.right : constrainingRegion.bottom - alignRegion.bottom;","            }","","            if (val > nearEdge) {","                if (spaceOnFarSide < nodeSize && spaceOnNearSide > nodeSize) {","                    val = nearEdge - nodeSize;","                }","            } else {","                if (spaceOnNearSide < nodeSize && spaceOnFarSide > nodeSize) {","                    val = farEdge;","                }","            }","        }","","        return val;","    },","","    /**","     * Binds event listeners responsible for updating the UI state in response to","     * Widget constrained positioning related state changes.","     * <p>","     * This method is invoked after bindUI is invoked for the Widget class","     * using YUI's aop infrastructure.","     * </p>","     *","     * @method _bindUIPosConstrained","     * @protected","     */","    _bindUIPosConstrained : function() {","        this.after(CONSTRAIN_CHANGE, this._afterConstrainChange);","        this._enableConstraints(this.get(CONSTRAIN));","    },","","    /**","     * After change listener for the \"constrain\" attribute, responsible","     * for updating the UI, in response to attribute changes.","     *","     * @method _afterConstrainChange","     * @protected","     * @param {EventFacade} e The event facade","     */","    _afterConstrainChange : function(e) {","        this._enableConstraints(e.newVal);","    },","","    /**","     * Updates the UI if enabling constraints, and sets up the xyChange event listeners","     * to constrain whenever the widget is moved. Disabling constraints removes the listeners.","     *","     * @method enable or disable constraints listeners","     * @private","     * @param {boolean} enable Enable or disable constraints","     */","    _enableConstraints : function(enable) {","        if (enable) {","            this.constrain();","            this._cxyHandle = this._cxyHandle || this.on(CONSTRAIN_XYCHANGE, this._constrainOnXYChange);","        } else if (this._cxyHandle) {","            this._cxyHandle.detach();","            this._cxyHandle = null;","        }","    },","","    /**","     * The on change listener for the \"xy\" attribute. Modifies the event facade's","     * newVal property with the constrained XY value.","     *","     * @method _constrainOnXYChange","     * @protected","     * @param {EventFacade} e The event facade for the attribute change","     */","    _constrainOnXYChange : function(e) {","        if (!e.constrained) {","            e.newVal = this.getConstrainedXY(e.newVal);","        }","    },","","    /**","     * Utility method to normalize region retrieval from a node instance,","     * or the viewport, if no node is provided.","     *","     * @method _getRegion","     * @private","     * @param {Node} node Optional.","     */","    _getRegion : function(node) {","        var region;","        if (!node) {","            region = this._posNode.get(VIEWPORT_REGION);","        } else {","            node = Node.one(node);","            if (node) {","                region = node.get(REGION);","            }","        }","        return region;","    }","};","","Y.WidgetPositionConstrain = PositionConstrain;","","","}, '@VERSION@', {\"requires\": [\"widget-position\"]});"];
_yuitest_coverage["build/widget-position-constrain/widget-position-constrain.js"].lines = {"1":0,"10":0,"41":0,"51":0,"86":0,"101":0,"104":0,"105":0,"107":0,"121":0,"123":0,"126":0,"143":0,"147":0,"148":0,"149":0,"151":0,"152":0,"165":0,"183":0,"185":0,"186":0,"189":0,"196":0,"197":0,"198":0,"199":0,"200":0,"201":0,"204":0,"209":0,"228":0,"237":0,"239":0,"241":0,"242":0,"243":0,"244":0,"245":0,"246":0,"249":0,"250":0,"251":0,"254":0,"255":0,"260":0,"275":0,"276":0,"288":0,"300":0,"301":0,"302":0,"303":0,"304":0,"305":0,"318":0,"319":0,"332":0,"333":0,"334":0,"336":0,"337":0,"338":0,"341":0,"345":0};
_yuitest_coverage["build/widget-position-constrain/widget-position-constrain.js"].functions = {"PositionConstrain:41":0,"initializer:103":0,"getConstrainedXY:120":0,"constrain:142":0,"_setConstrain:164":0,"_constrain:182":0,"_preventOverlap:226":0,"_bindUIPosConstrained:274":0,"_afterConstrainChange:287":0,"_enableConstraints:299":0,"_constrainOnXYChange:317":0,"_getRegion:331":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-position-constrain/widget-position-constrain.js"].coveredLines = 65;
_yuitest_coverage["build/widget-position-constrain/widget-position-constrain.js"].coveredFunctions = 13;
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 1);
YUI.add('widget-position-constrain', function (Y, NAME) {

/**
 * Provides constrained xy positioning support for Widgets, through an extension.
 *
 * It builds on top of the widget-position module, to provide constrained positioning support.
 *
 * @module widget-position-constrain
 */
_yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 10);
var CONSTRAIN = "constrain",
    CONSTRAIN_XYCHANGE = "constrain|xyChange",
    CONSTRAIN_CHANGE = "constrainChange",

    PREVENT_OVERLAP = "preventOverlap",
    ALIGN = "align",

    EMPTY_STR = "",

    BINDUI = "bindUI",

    XY = "xy",
    X_COORD = "x",
    Y_COORD = "y",

    Node = Y.Node,

    VIEWPORT_REGION = "viewportRegion",
    REGION = "region",

    PREVENT_OVERLAP_MAP;

/**
 * A widget extension, which can be used to add constrained xy positioning support to the base Widget class,
 * through the <a href="Base.html#method_build">Base.build</a> method. This extension requires that
 * the WidgetPosition extension be added to the Widget (before WidgetPositionConstrain, if part of the same
 * extension list passed to Base.build).
 *
 * @class WidgetPositionConstrain
 * @param {Object} User configuration object
 */
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 41);
function PositionConstrain(config) {}

/**
 * Static property used to define the default attribute
 * configuration introduced by WidgetPositionConstrain.
 *
 * @property ATTRS
 * @type Object
 * @static
 */
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 51);
PositionConstrain.ATTRS = {

    /**
     * @attribute constrain
     * @type boolean | Node
     * @default null
     * @description The node to constrain the widget's bounding box to, when setting xy. Can also be
     * set to true, to constrain to the viewport.
     */
    constrain : {
        value: null,
        setter: "_setConstrain"
    },

    /**
     * @attribute preventOverlap
     * @type boolean
     * @description If set to true, and WidgetPositionAlign is also added to the Widget,
     * constrained positioning will attempt to prevent the widget's bounding box from overlapping
     * the element to which it has been aligned, by flipping the orientation of the alignment
     * for corner based alignments
     */
    preventOverlap : {
        value:false
    }
};

/**
 * @property _PREVENT_OVERLAP
 * @static
 * @protected
 * @type Object
 * @description The set of positions for which to prevent
 * overlap.
 */
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 86);
PREVENT_OVERLAP_MAP = PositionConstrain._PREVENT_OVERLAP = {
    x: {
        "tltr": 1,
        "blbr": 1,
        "brbl": 1,
        "trtl": 1
    },
    y : {
        "trbr": 1,
        "tlbl": 1,
        "bltl": 1,
        "brtr": 1
    }
};

_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 101);
PositionConstrain.prototype = {

    initializer : function() {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "initializer", 103);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 104);
if (!this._posNode) {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 105);
Y.error("WidgetPosition needs to be added to the Widget, before WidgetPositionConstrain is added");
        }
        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 107);
Y.after(this._bindUIPosConstrained, this, BINDUI);
    },

    /**
     * Calculates the constrained positions for the XY positions provided, using
     * the provided node argument is passed in. If no node value is passed in, the value of
     * the "constrain" attribute is used.
     *
     * @method getConstrainedXY
     * @param {Array} xy The xy values to constrain
     * @param {Node | boolean} node Optional. The node to constrain to, or true for the viewport
     * @return {Array} The constrained xy values
     */
    getConstrainedXY : function(xy, node) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "getConstrainedXY", 120);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 121);
node = node || this.get(CONSTRAIN);

        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 123);
var constrainingRegion = this._getRegion((node === true) ? null : node),
            nodeRegion = this._posNode.get(REGION);

        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 126);
return [
            this._constrain(xy[0], X_COORD, nodeRegion, constrainingRegion),
            this._constrain(xy[1], Y_COORD, nodeRegion, constrainingRegion)
        ];
    },

    /**
     * Constrains the widget's bounding box to a node (or the viewport). If xy or node are not
     * passed in, the current position and the value of "constrain" will be used respectively.
     *
     * The widget's position will be changed to the constrained position.
     *
     * @method constrain
     * @param {Array} xy Optional. The xy values to constrain
     * @param {Node | boolean} node Optional. The node to constrain to, or true for the viewport
     */
    constrain : function(xy, node) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "constrain", 142);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 143);
var currentXY,
            constrainedXY,
            constraint = node || this.get(CONSTRAIN);

        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 147);
if (constraint) {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 148);
currentXY = xy || this.get(XY);
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 149);
constrainedXY = this.getConstrainedXY(currentXY, constraint);

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 151);
if (constrainedXY[0] !== currentXY[0] || constrainedXY[1] !== currentXY[1]) {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 152);
this.set(XY, constrainedXY, { constrained:true });
            }
        }
    },

    /**
     * The setter implementation for the "constrain" attribute.
     *
     * @method _setConstrain
     * @protected
     * @param {Node | boolean} val The attribute value
     */
    _setConstrain : function(val) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_setConstrain", 164);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 165);
return (val === true) ? val : Node.one(val);
    },

    /**
     * The method which performs the actual constrain calculations for a given axis ("x" or "y") based
     * on the regions provided.
     *
     * @method _constrain
     * @protected
     *
     * @param {Number} val The value to constrain
     * @param {String} axis The axis to use for constrainment
     * @param {Region} nodeRegion The region of the node to constrain
     * @param {Region} constrainingRegion The region of the node (or viewport) to constrain to
     *
     * @return {Number} The constrained value
     */
    _constrain: function(val, axis, nodeRegion, constrainingRegion) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_constrain", 182);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 183);
if (constrainingRegion) {

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 185);
if (this.get(PREVENT_OVERLAP)) {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 186);
val = this._preventOverlap(val, axis, nodeRegion, constrainingRegion);
            }

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 189);
var x = (axis == X_COORD),

                regionSize    = (x) ? constrainingRegion.width : constrainingRegion.height,
                nodeSize      = (x) ? nodeRegion.width : nodeRegion.height,
                minConstraint = (x) ? constrainingRegion.left : constrainingRegion.top,
                maxConstraint = (x) ? constrainingRegion.right - nodeSize : constrainingRegion.bottom - nodeSize;

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 196);
if (val < minConstraint || val > maxConstraint) {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 197);
if (nodeSize < regionSize) {
                    _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 198);
if (val < minConstraint) {
                        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 199);
val = minConstraint;
                    } else {_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 200);
if (val > maxConstraint) {
                        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 201);
val = maxConstraint;
                    }}
                } else {
                    _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 204);
val = minConstraint;
                }
            }
        }

        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 209);
return val;
    },

    /**
     * The method which performs the preventOverlap calculations for a given axis ("x" or "y") based
     * on the value and regions provided.
     *
     * @method _preventOverlap
     * @protected
     *
     * @param {Number} val The value being constrain
     * @param {String} axis The axis to being constrained
     * @param {Region} nodeRegion The region of the node being constrained
     * @param {Region} constrainingRegion The region of the node (or viewport) we need to constrain to
     *
     * @return {Number} The constrained value
     */
    _preventOverlap : function(val, axis, nodeRegion, constrainingRegion) {

        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_preventOverlap", 226);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 228);
var align = this.get(ALIGN),
            x = (axis === X_COORD),
            nodeSize,
            alignRegion,
            nearEdge,
            farEdge,
            spaceOnNearSide,
            spaceOnFarSide;

        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 237);
if (align && align.points && PREVENT_OVERLAP_MAP[axis][align.points.join(EMPTY_STR)]) {

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 239);
alignRegion = this._getRegion(align.node);

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 241);
if (alignRegion) {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 242);
nodeSize        = (x) ? nodeRegion.width : nodeRegion.height;
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 243);
nearEdge        = (x) ? alignRegion.left : alignRegion.top;
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 244);
farEdge         = (x) ? alignRegion.right : alignRegion.bottom;
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 245);
spaceOnNearSide = (x) ? alignRegion.left - constrainingRegion.left : alignRegion.top - constrainingRegion.top;
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 246);
spaceOnFarSide  = (x) ? constrainingRegion.right - alignRegion.right : constrainingRegion.bottom - alignRegion.bottom;
            }

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 249);
if (val > nearEdge) {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 250);
if (spaceOnFarSide < nodeSize && spaceOnNearSide > nodeSize) {
                    _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 251);
val = nearEdge - nodeSize;
                }
            } else {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 254);
if (spaceOnNearSide < nodeSize && spaceOnFarSide > nodeSize) {
                    _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 255);
val = farEdge;
                }
            }
        }

        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 260);
return val;
    },

    /**
     * Binds event listeners responsible for updating the UI state in response to
     * Widget constrained positioning related state changes.
     * <p>
     * This method is invoked after bindUI is invoked for the Widget class
     * using YUI's aop infrastructure.
     * </p>
     *
     * @method _bindUIPosConstrained
     * @protected
     */
    _bindUIPosConstrained : function() {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_bindUIPosConstrained", 274);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 275);
this.after(CONSTRAIN_CHANGE, this._afterConstrainChange);
        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 276);
this._enableConstraints(this.get(CONSTRAIN));
    },

    /**
     * After change listener for the "constrain" attribute, responsible
     * for updating the UI, in response to attribute changes.
     *
     * @method _afterConstrainChange
     * @protected
     * @param {EventFacade} e The event facade
     */
    _afterConstrainChange : function(e) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_afterConstrainChange", 287);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 288);
this._enableConstraints(e.newVal);
    },

    /**
     * Updates the UI if enabling constraints, and sets up the xyChange event listeners
     * to constrain whenever the widget is moved. Disabling constraints removes the listeners.
     *
     * @method enable or disable constraints listeners
     * @private
     * @param {boolean} enable Enable or disable constraints
     */
    _enableConstraints : function(enable) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_enableConstraints", 299);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 300);
if (enable) {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 301);
this.constrain();
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 302);
this._cxyHandle = this._cxyHandle || this.on(CONSTRAIN_XYCHANGE, this._constrainOnXYChange);
        } else {_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 303);
if (this._cxyHandle) {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 304);
this._cxyHandle.detach();
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 305);
this._cxyHandle = null;
        }}
    },

    /**
     * The on change listener for the "xy" attribute. Modifies the event facade's
     * newVal property with the constrained XY value.
     *
     * @method _constrainOnXYChange
     * @protected
     * @param {EventFacade} e The event facade for the attribute change
     */
    _constrainOnXYChange : function(e) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_constrainOnXYChange", 317);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 318);
if (!e.constrained) {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 319);
e.newVal = this.getConstrainedXY(e.newVal);
        }
    },

    /**
     * Utility method to normalize region retrieval from a node instance,
     * or the viewport, if no node is provided.
     *
     * @method _getRegion
     * @private
     * @param {Node} node Optional.
     */
    _getRegion : function(node) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_getRegion", 331);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 332);
var region;
        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 333);
if (!node) {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 334);
region = this._posNode.get(VIEWPORT_REGION);
        } else {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 336);
node = Node.one(node);
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 337);
if (node) {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 338);
region = node.get(REGION);
            }
        }
        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 341);
return region;
    }
};

_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 345);
Y.WidgetPositionConstrain = PositionConstrain;


}, '@VERSION@', {"requires": ["widget-position"]});
