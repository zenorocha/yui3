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
_yuitest_coverage["build/widget-position-align/widget-position-align.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-position-align/widget-position-align.js",
    code: []
};
_yuitest_coverage["build/widget-position-align/widget-position-align.js"].code=["YUI.add('widget-position-align', function (Y, NAME) {","","/**","Provides extended/advanced XY positioning support for Widgets, through an","extension.","","It builds on top of the `widget-position` module, to provide alignment and","centering support. Future releases aim to add constrained and fixed positioning","support.","","@module widget-position-align","**/","var Lang = Y.Lang,","","    ALIGN        = 'align',","    ALIGN_ON     = 'alignOn',","","    VISIBLE      = 'visible',","    BOUNDING_BOX = 'boundingBox',","","    OFFSET_WIDTH    = 'offsetWidth',","    OFFSET_HEIGHT   = 'offsetHeight',","    REGION          = 'region',","    VIEWPORT_REGION = 'viewportRegion';","","/**","Widget extension, which can be used to add extended XY positioning support to","the base Widget class, through the `Base.create` method.","","**Note:** This extension requires that the `WidgetPosition` extension be added","to the Widget (before `WidgetPositionAlign`, if part of the same extension list","passed to `Base.build`).","","@class WidgetPositionAlign","@param {Object} config User configuration object.","@constructor","**/","function PositionAlign (config) {}","","PositionAlign.ATTRS = {","","    /**","    The alignment configuration for this widget.","","    The `align` attribute is used to align a reference point on the widget, with","    the reference point on another `Node`, or the viewport. The object which","    `align` expects has the following properties:","","      * __`node`__: The `Node` to which the widget is to be aligned. If set to","        `null`, or not provided, the widget is aligned to the viewport.","","      * __`points`__: A two element Array, defining the two points on the widget","        and `Node`/viewport which are to be aligned. The first element is the","        point on the widget, and the second element is the point on the","        `Node`/viewport. Supported alignment points are defined as static","        properties on `WidgetPositionAlign`.","","    @example Aligns the top-right corner of the widget with the top-left corner","    of the viewport:","","        myWidget.set('align', {","            points: [Y.WidgetPositionAlign.TR, Y.WidgetPositionAlign.TL]","        });","","    @attribute align","    @type Object","    @default null","    **/","    align: {","        value: null","    },","","    /**","    A convenience Attribute, which can be used as a shortcut for the `align`","    Attribute.","","    If set to `true`, the widget is centered in the viewport. If set to a `Node`","    reference or valid selector String, the widget will be centered within the","    `Node`. If set to `false`, no center positioning is applied.","","    @attribute centered","    @type Boolean|Node","    @default false","    **/","    centered: {","        setter : '_setAlignCenter',","        lazyAdd:false,","        value  :false","    },","","    /**","    An Array of Objects corresponding to the `Node`s and events that will cause","    the alignment of this widget to be synced to the DOM.","","    The `alignOn` Attribute is expected to be an Array of Objects with the","    following properties:","","      * __`eventName`__: The String event name to listen for.","","      * __`node`__: The optional `Node` that will fire the event, it can be a","        `Node` reference or a selector String. This will default to the widget's","        `boundingBox`.","","    @example Sync this widget's alignment on window resize:","","        myWidget.set('alignOn', [","            {","                node     : Y.one('win'),","                eventName: 'resize'","            }","        ]);","","    @attribute alignOn","    @type Array","    @default []","    **/","    alignOn: {","        value    : [],","        validator: Y.Lang.isArray","    }","};","","/**","Constant used to specify the top-left corner for alignment","","@property TL","@type String","@value 'tl'","@static","**/","PositionAlign.TL = 'tl';","","/**","Constant used to specify the top-right corner for alignment","","@property TR","@type String","@value 'tr'","@static","**/","PositionAlign.TR = 'tr';","","/**","Constant used to specify the bottom-left corner for alignment","","@property BL","@type String","@value 'bl'","@static","**/","PositionAlign.BL = 'bl';","","/**","Constant used to specify the bottom-right corner for alignment","","@property BR","@type String","@value 'br'","@static","**/","PositionAlign.BR = 'br';","","/**","Constant used to specify the top edge-center point for alignment","","@property TC","@type String","@value 'tc'","@static","**/","PositionAlign.TC = 'tc';","","/**","Constant used to specify the right edge, center point for alignment","","@property RC","@type String","@value 'rc'","@static","**/","PositionAlign.RC = 'rc';","","/**","Constant used to specify the bottom edge, center point for alignment","","@property BC","@type String","@value 'bc'","@static","**/","PositionAlign.BC = 'bc';","","/**","Constant used to specify the left edge, center point for alignment","","@property LC","@type String","@value 'lc'","@static","**/","PositionAlign.LC = 'lc';","","/**","Constant used to specify the center of widget/node/viewport for alignment","","@property CC","@type String","@value 'cc'","@static","*/","PositionAlign.CC = 'cc';","","PositionAlign.prototype = {","    // -- Protected Properties -------------------------------------------------","","","    initializer : function() {","        if (!this._posNode) {","            Y.error('WidgetPosition needs to be added to the Widget, ' +","                'before WidgetPositionAlign is added');","        }","","        Y.after(this._bindUIPosAlign, this, 'bindUI');","        Y.after(this._syncUIPosAlign, this, 'syncUI');","    },","","    /**","    Holds the alignment-syncing event handles.","","    @property _posAlignUIHandles","    @type Array","    @default null","    @protected","    **/","    _posAlignUIHandles: null,","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function() {","        if ( ! this._posNode) {","            Y.error('WidgetPosition needs to be added to the Widget, ' +","                'before WidgetPositionAlign is added');","        }","","        Y.after(this._bindUIPosAlign, this, 'bindUI');","        Y.after(this._syncUIPosAlign, this, 'syncUI');","    },","","    destructor: function () {","        this._detachPosAlignUIHandles();","    },","","    /**","    Bind event listeners responsible for updating the UI state in response to","    the widget's position-align related state changes.","","    This method is invoked after `bindUI` has been invoked for the `Widget`","    class using the AOP infrastructure.","","    @method _bindUIPosAlign","    @protected","    **/","    _bindUIPosAlign: function () {","        this.after('alignChange', this._afterAlignChange);","        this.after('alignOnChange', this._afterAlignOnChange);","        this.after('visibleChange', this._syncUIPosAlign);","    },","","    /**","    Synchronizes the current `align` Attribute value to the DOM.","","    This method is invoked after `syncUI` has been invoked for the `Widget`","    class using the AOP infrastructure.","","    @method _syncUIPosAlign","    @protected","    **/","    _syncUIPosAlign: function () {","        var align = this.get(ALIGN);","","        this._uiSetVisiblePosAlign(this.get(VISIBLE));","","        if (align) {","            this._uiSetAlign(align.node, align.points);","        }","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Aligns this widget to the provided `Node` (or viewport) using the provided","    points. This method can be invoked with no arguments which will cause the","    widget's current `align` Attribute value to be synced to the DOM.","","    @example Aligning to the top-left corner of the `<body>`:","","        myWidget.align('body',","            [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.TR]);","","    @method align","    @param {Node|String|null} [node] A reference (or selector String) for the","      `Node` which with the widget is to be aligned. If null is passed in, the","      widget will be aligned with the viewport.","    @param {Array[2]} [points] A two item array specifying the points on the","      widget and `Node`/viewport which will to be aligned. The first entry is","      the point on the widget, and the second entry is the point on the","      `Node`/viewport. Valid point references are defined as static constants on","      the `WidgetPositionAlign` extension.","    @chainable","    **/","    align: function (node, points) {","        if (arguments.length) {","            // Set the `align` Attribute.","            this.set(ALIGN, {","                node  : node,","                points: points","            });","        } else {","            // Sync the current `align` Attribute value to the DOM.","            this._syncUIPosAlign();","        }","","        return this;","    },","","    /**","    Centers the widget in the viewport, or if a `Node` is passed in, it will","    be centered to that `Node`.","","    @method centered","    @param {Node|String} [node] A `Node` reference or selector String defining","      the `Node` which the widget should be centered. If a `Node` is not  passed","      in, then the widget will be centered to the viewport.","    @chainable","    **/","    centered: function (node) {","        return this.align(node, [PositionAlign.CC, PositionAlign.CC]);","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Returns coordinates realative to the passed `Node` alignment.","","    @method _getAlignToXY","    @param {Node} 'Node' The node to align to.","    @param {Array} [point] The node alignment points.","    @param {Number} 'Node' x coordinate.","    @param {Number} 'Node' y coordinate.","    @return {Array} the coordinates.","    @private","    **/","    _getAlignToXY: function (node, point, x, y) {","        var xy;","","        switch (point) {","        case PositionAlign.TL:","            xy = [x, y];","            break;","","        case PositionAlign.TR:","            xy = [","                x - node.get(OFFSET_WIDTH),","                y","            ];","            break;","","        case PositionAlign.BL:","            xy = [","                x,","                y - node.get(OFFSET_HEIGHT)","            ];","            break;","","        case PositionAlign.BR:","            xy = [","                x - node.get(OFFSET_WIDTH),","                y - node.get(OFFSET_HEIGHT)","            ];","            break;","","        case PositionAlign.TC:","            xy = [","                x - (node.get(OFFSET_WIDTH) / 2),","                y","            ];","            break;","","        case PositionAlign.BC:","            xy = [","                x - (node.get(OFFSET_WIDTH) / 2),","                y - node.get(OFFSET_HEIGHT)","            ];","            break;","","        case PositionAlign.LC:","            xy = [","                x,","                y - (node.get(OFFSET_HEIGHT) / 2)","            ];","            break;","","        case PositionAlign.RC:","            xy = [","                x - node.get(OFFSET_WIDTH),","                y - (node.get(OFFSET_HEIGHT) / 2)","            ];","            break;","","        case PositionAlign.CC:","            xy = [","                x - (node.get(OFFSET_WIDTH) / 2),","                y - (node.get(OFFSET_HEIGHT) / 2)","            ];","            break;","","        default:","            break;","","        }","","        return xy;","    },","","    /**","    Returns `Widget` alignment coordinates realative to the given `Node`.","","    @method _getAlignedXY","    @param {Node|String|null} [node] The node to align to, or null to indicate","      the viewport.","    @param {Array} points The alignment points.","    @return {Array} the coordinates.","    @protected","    **/","    _getAlignedXY: function (node, points) {","        if ( ! Lang.isArray(points) || points.length !== 2) {","            Y.error('align: Invalid Points Arguments');","            return;","        }","","        var nodeRegion = this._getRegion(node), nodePoint, xy;","","        if ( ! nodeRegion) {","            // No-op, nothing to align to.","            return;","        }","","        nodePoint   = points[1];","","        // TODO: Optimize KWeight - Would lookup table help?","        switch (nodePoint) {","        case PositionAlign.TL:","            xy = [nodeRegion.left, nodeRegion.top];","            break;","","        case PositionAlign.TR:","            xy = [nodeRegion.right, nodeRegion.top];","            break;","","        case PositionAlign.BL:","            xy = [nodeRegion.left, nodeRegion.bottom];","            break;","","        case PositionAlign.BR:","            xy = [nodeRegion.right, nodeRegion.bottom];","            break;","","        case PositionAlign.TC:","            xy = [","                nodeRegion.left + Math.floor(nodeRegion.width / 2),","                nodeRegion.top","            ];","            break;","","        case PositionAlign.BC:","            xy = [","                nodeRegion.left + Math.floor(nodeRegion.width / 2),","                nodeRegion.bottom","            ];","            break;","","        case PositionAlign.LC:","            xy = [","                nodeRegion.left,","                nodeRegion.top + Math.floor(nodeRegion.height / 2)","            ];","            break;","","        case PositionAlign.RC:","            xy = [","                nodeRegion.right,","                nodeRegion.top + Math.floor(nodeRegion.height / 2)","            ];","            break;","","        case PositionAlign.CC:","            xy = [","                nodeRegion.left + Math.floor(nodeRegion.width / 2),","                nodeRegion.top + Math.floor(nodeRegion.height / 2)","            ];","            break;","","        default:","            break;","","        }","","        return this._getAlignToXY(this._posNode, points[0], xy[0], xy[1]);","    },","","    /**","    Default setter for `center` Attribute changes. Sets up the appropriate","    value, and passes it through the to the align attribute.","","    @method _setAlignCenter","    @param {Boolean|Node} val The Attribute value being set.","    @return {Boolean|Node} the value passed in.","    @protected","    **/","    _setAlignCenter: function (val) {","        if (val) {","            this.set(ALIGN, {","                node  : val === true ? null : val,","                points: [PositionAlign.CC, PositionAlign.CC]","            });","        }","","        return val;","    },","","    /**","    Updates the UI to reflect the `align` value passed in.","","    **Note:** See the `align` Attribute documentation, for the Object structure","    expected.","","    @method _uiSetAlign","    @param {Node|String|null} [node] The node to align to, or null to indicate","      the viewport.","    @param {Array} points The alignment points.","    @protected","    **/","    _uiSetAlign: function (node, points) {","        var xy = this._getAlignedXY(node, points);","","        if (xy) {","            this._doAlign(xy);","        }","    },","","    /**","    Attaches or detaches alignment-syncing event handlers based on the widget's","    `visible` Attribute state.","","    @method _uiSetVisiblePosAlign","    @param {Boolean} visible The current value of the widget's `visible`","      Attribute.","    @protected","    **/","    _uiSetVisiblePosAlign: function (visible) {","        if (visible) {","            this._attachPosAlignUIHandles();","        } else {","            this._detachPosAlignUIHandles();","        }","    },","","    /**","    Attaches the alignment-syncing event handlers.","","    @method _attachPosAlignUIHandles","    @protected","    **/","    _attachPosAlignUIHandles: function () {","        if (this._posAlignUIHandles) {","            // No-op if we have already setup the event handlers.","            return;","        }","","        var bb        = this.get(BOUNDING_BOX),","            syncAlign = Y.bind(this._syncUIPosAlign, this),","            handles   = [];","","        Y.Array.each(this.get(ALIGN_ON), function (o) {","            var event = o.eventName,","                node  = Y.one(o.node) || bb;","","            if (event) {","                handles.push(node.on(event, syncAlign));","            }","        });","","        this._posAlignUIHandles = handles;","    },","","    /**","    Detaches the alignment-syncing event handlers.","","    @method _detachPosAlignUIHandles","    @protected","    **/","    _detachPosAlignUIHandles: function () {","        var handles = this._posAlignUIHandles;","        if (handles) {","            new Y.EventHandle(handles).detach();","            this._posAlignUIHandles = null;","        }","    },","","    // -- Private Methods ------------------------------------------------------","","    /**","    Helper method, used to align the given point on the widget, with the XY page","    coordinates provided.","","    @method _doAlign","    @param {Array} xy XY page coordinates to align to.","    @private","    **/","    _doAlign: function(xy) {","        if (xy) {","            this.move(xy);","        }","    },","","    /**","    Returns the region of the passed-in `Node`, or the viewport region if","    calling with passing in a `Node`.","","    @method _getRegion","    @param {Node} [node] The node to get the region of.","    @return {Object} The node's region.","    @private","    **/","    _getRegion: function (node) {","        var nodeRegion;","","        if ( ! node) {","            nodeRegion = this._posNode.get(VIEWPORT_REGION);","        } else {","            node = Y.Node.one(node);","            if (node) {","                nodeRegion = node.get(REGION);","            }","        }","","        return nodeRegion;","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `alignChange` events by updating the UI in response to `align`","    Attribute changes.","","    @method _afterAlignChange","    @param {EventFacade} e","    @protected","    **/","    _afterAlignChange: function (e) {","        var align = e.newVal;","        if (align) {","            this._uiSetAlign(align.node, align.points);","        }","    },","","    /**","    Handles `alignOnChange` events by updating the alignment-syncing event","    handlers.","","    @method _afterAlignOnChange","    @param {EventFacade} e","    @protected","    **/","    _afterAlignOnChange: function(e) {","        this._detachPosAlignUIHandles();","","        if (this.get(VISIBLE)) {","            this._attachPosAlignUIHandles();","        }","    }","};","","Y.WidgetPositionAlign = PositionAlign;","","","}, '@VERSION@', {\"requires\": [\"widget-position\"]});"];
_yuitest_coverage["build/widget-position-align/widget-position-align.js"].lines = {"1":0,"13":0,"38":0,"40":0,"131":0,"141":0,"151":0,"161":0,"171":0,"181":0,"191":0,"201":0,"211":0,"213":0,"218":0,"219":0,"223":0,"224":0,"240":0,"241":0,"245":0,"246":0,"250":0,"264":0,"265":0,"266":0,"279":0,"281":0,"283":0,"284":0,"312":0,"314":0,"320":0,"323":0,"337":0,"354":0,"356":0,"358":0,"359":0,"362":0,"366":0,"369":0,"373":0,"376":0,"380":0,"383":0,"387":0,"390":0,"394":0,"397":0,"401":0,"404":0,"408":0,"411":0,"415":0,"418":0,"422":0,"436":0,"437":0,"438":0,"441":0,"443":0,"445":0,"448":0,"451":0,"453":0,"454":0,"457":0,"458":0,"461":0,"462":0,"465":0,"466":0,"469":0,"473":0,"476":0,"480":0,"483":0,"487":0,"490":0,"494":0,"497":0,"501":0,"504":0,"508":0,"521":0,"522":0,"528":0,"544":0,"546":0,"547":0,"561":0,"562":0,"564":0,"575":0,"577":0,"580":0,"584":0,"585":0,"588":0,"589":0,"593":0,"603":0,"604":0,"605":0,"606":0,"621":0,"622":0,"636":0,"638":0,"639":0,"641":0,"642":0,"643":0,"647":0,"661":0,"662":0,"663":0,"676":0,"678":0,"679":0,"684":0};
_yuitest_coverage["build/widget-position-align/widget-position-align.js"].functions = {"PositionAlign:38":0,"initializer:217":0,"initializer:239":0,"destructor:249":0,"_bindUIPosAlign:263":0,"_syncUIPosAlign:278":0,"align:311":0,"centered:336":0,"_getAlignToXY:353":0,"_getAlignedXY:435":0,"_setAlignCenter:520":0,"_uiSetAlign:543":0,"_uiSetVisiblePosAlign:560":0,"(anonymous 2):584":0,"_attachPosAlignUIHandles:574":0,"_detachPosAlignUIHandles:602":0,"_doAlign:620":0,"_getRegion:635":0,"_afterAlignChange:660":0,"_afterAlignOnChange:675":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-position-align/widget-position-align.js"].coveredLines = 122;
_yuitest_coverage["build/widget-position-align/widget-position-align.js"].coveredFunctions = 21;
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 1);
YUI.add('widget-position-align', function (Y, NAME) {

/**
Provides extended/advanced XY positioning support for Widgets, through an
extension.

It builds on top of the `widget-position` module, to provide alignment and
centering support. Future releases aim to add constrained and fixed positioning
support.

@module widget-position-align
**/
_yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 13);
var Lang = Y.Lang,

    ALIGN        = 'align',
    ALIGN_ON     = 'alignOn',

    VISIBLE      = 'visible',
    BOUNDING_BOX = 'boundingBox',

    OFFSET_WIDTH    = 'offsetWidth',
    OFFSET_HEIGHT   = 'offsetHeight',
    REGION          = 'region',
    VIEWPORT_REGION = 'viewportRegion';

/**
Widget extension, which can be used to add extended XY positioning support to
the base Widget class, through the `Base.create` method.

**Note:** This extension requires that the `WidgetPosition` extension be added
to the Widget (before `WidgetPositionAlign`, if part of the same extension list
passed to `Base.build`).

@class WidgetPositionAlign
@param {Object} config User configuration object.
@constructor
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 38);
function PositionAlign (config) {}

_yuitest_coverline("build/widget-position-align/widget-position-align.js", 40);
PositionAlign.ATTRS = {

    /**
    The alignment configuration for this widget.

    The `align` attribute is used to align a reference point on the widget, with
    the reference point on another `Node`, or the viewport. The object which
    `align` expects has the following properties:

      * __`node`__: The `Node` to which the widget is to be aligned. If set to
        `null`, or not provided, the widget is aligned to the viewport.

      * __`points`__: A two element Array, defining the two points on the widget
        and `Node`/viewport which are to be aligned. The first element is the
        point on the widget, and the second element is the point on the
        `Node`/viewport. Supported alignment points are defined as static
        properties on `WidgetPositionAlign`.

    @example Aligns the top-right corner of the widget with the top-left corner
    of the viewport:

        myWidget.set('align', {
            points: [Y.WidgetPositionAlign.TR, Y.WidgetPositionAlign.TL]
        });

    @attribute align
    @type Object
    @default null
    **/
    align: {
        value: null
    },

    /**
    A convenience Attribute, which can be used as a shortcut for the `align`
    Attribute.

    If set to `true`, the widget is centered in the viewport. If set to a `Node`
    reference or valid selector String, the widget will be centered within the
    `Node`. If set to `false`, no center positioning is applied.

    @attribute centered
    @type Boolean|Node
    @default false
    **/
    centered: {
        setter : '_setAlignCenter',
        lazyAdd:false,
        value  :false
    },

    /**
    An Array of Objects corresponding to the `Node`s and events that will cause
    the alignment of this widget to be synced to the DOM.

    The `alignOn` Attribute is expected to be an Array of Objects with the
    following properties:

      * __`eventName`__: The String event name to listen for.

      * __`node`__: The optional `Node` that will fire the event, it can be a
        `Node` reference or a selector String. This will default to the widget's
        `boundingBox`.

    @example Sync this widget's alignment on window resize:

        myWidget.set('alignOn', [
            {
                node     : Y.one('win'),
                eventName: 'resize'
            }
        ]);

    @attribute alignOn
    @type Array
    @default []
    **/
    alignOn: {
        value    : [],
        validator: Y.Lang.isArray
    }
};

/**
Constant used to specify the top-left corner for alignment

@property TL
@type String
@value 'tl'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 131);
PositionAlign.TL = 'tl';

/**
Constant used to specify the top-right corner for alignment

@property TR
@type String
@value 'tr'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 141);
PositionAlign.TR = 'tr';

/**
Constant used to specify the bottom-left corner for alignment

@property BL
@type String
@value 'bl'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 151);
PositionAlign.BL = 'bl';

/**
Constant used to specify the bottom-right corner for alignment

@property BR
@type String
@value 'br'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 161);
PositionAlign.BR = 'br';

/**
Constant used to specify the top edge-center point for alignment

@property TC
@type String
@value 'tc'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 171);
PositionAlign.TC = 'tc';

/**
Constant used to specify the right edge, center point for alignment

@property RC
@type String
@value 'rc'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 181);
PositionAlign.RC = 'rc';

/**
Constant used to specify the bottom edge, center point for alignment

@property BC
@type String
@value 'bc'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 191);
PositionAlign.BC = 'bc';

/**
Constant used to specify the left edge, center point for alignment

@property LC
@type String
@value 'lc'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 201);
PositionAlign.LC = 'lc';

/**
Constant used to specify the center of widget/node/viewport for alignment

@property CC
@type String
@value 'cc'
@static
*/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 211);
PositionAlign.CC = 'cc';

_yuitest_coverline("build/widget-position-align/widget-position-align.js", 213);
PositionAlign.prototype = {
    // -- Protected Properties -------------------------------------------------


    initializer : function() {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "initializer", 217);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 218);
if (!this._posNode) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 219);
Y.error('WidgetPosition needs to be added to the Widget, ' +
                'before WidgetPositionAlign is added');
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 223);
Y.after(this._bindUIPosAlign, this, 'bindUI');
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 224);
Y.after(this._syncUIPosAlign, this, 'syncUI');
    },

    /**
    Holds the alignment-syncing event handles.

    @property _posAlignUIHandles
    @type Array
    @default null
    @protected
    **/
    _posAlignUIHandles: null,

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function() {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "initializer", 239);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 240);
if ( ! this._posNode) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 241);
Y.error('WidgetPosition needs to be added to the Widget, ' +
                'before WidgetPositionAlign is added');
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 245);
Y.after(this._bindUIPosAlign, this, 'bindUI');
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 246);
Y.after(this._syncUIPosAlign, this, 'syncUI');
    },

    destructor: function () {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "destructor", 249);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 250);
this._detachPosAlignUIHandles();
    },

    /**
    Bind event listeners responsible for updating the UI state in response to
    the widget's position-align related state changes.

    This method is invoked after `bindUI` has been invoked for the `Widget`
    class using the AOP infrastructure.

    @method _bindUIPosAlign
    @protected
    **/
    _bindUIPosAlign: function () {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_bindUIPosAlign", 263);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 264);
this.after('alignChange', this._afterAlignChange);
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 265);
this.after('alignOnChange', this._afterAlignOnChange);
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 266);
this.after('visibleChange', this._syncUIPosAlign);
    },

    /**
    Synchronizes the current `align` Attribute value to the DOM.

    This method is invoked after `syncUI` has been invoked for the `Widget`
    class using the AOP infrastructure.

    @method _syncUIPosAlign
    @protected
    **/
    _syncUIPosAlign: function () {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_syncUIPosAlign", 278);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 279);
var align = this.get(ALIGN);

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 281);
this._uiSetVisiblePosAlign(this.get(VISIBLE));

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 283);
if (align) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 284);
this._uiSetAlign(align.node, align.points);
        }
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Aligns this widget to the provided `Node` (or viewport) using the provided
    points. This method can be invoked with no arguments which will cause the
    widget's current `align` Attribute value to be synced to the DOM.

    @example Aligning to the top-left corner of the `<body>`:

        myWidget.align('body',
            [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.TR]);

    @method align
    @param {Node|String|null} [node] A reference (or selector String) for the
      `Node` which with the widget is to be aligned. If null is passed in, the
      widget will be aligned with the viewport.
    @param {Array[2]} [points] A two item array specifying the points on the
      widget and `Node`/viewport which will to be aligned. The first entry is
      the point on the widget, and the second entry is the point on the
      `Node`/viewport. Valid point references are defined as static constants on
      the `WidgetPositionAlign` extension.
    @chainable
    **/
    align: function (node, points) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "align", 311);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 312);
if (arguments.length) {
            // Set the `align` Attribute.
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 314);
this.set(ALIGN, {
                node  : node,
                points: points
            });
        } else {
            // Sync the current `align` Attribute value to the DOM.
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 320);
this._syncUIPosAlign();
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 323);
return this;
    },

    /**
    Centers the widget in the viewport, or if a `Node` is passed in, it will
    be centered to that `Node`.

    @method centered
    @param {Node|String} [node] A `Node` reference or selector String defining
      the `Node` which the widget should be centered. If a `Node` is not  passed
      in, then the widget will be centered to the viewport.
    @chainable
    **/
    centered: function (node) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "centered", 336);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 337);
return this.align(node, [PositionAlign.CC, PositionAlign.CC]);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Returns coordinates realative to the passed `Node` alignment.

    @method _getAlignToXY
    @param {Node} 'Node' The node to align to.
    @param {Array} [point] The node alignment points.
    @param {Number} 'Node' x coordinate.
    @param {Number} 'Node' y coordinate.
    @return {Array} the coordinates.
    @private
    **/
    _getAlignToXY: function (node, point, x, y) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_getAlignToXY", 353);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 354);
var xy;

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 356);
switch (point) {
        case PositionAlign.TL:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 358);
xy = [x, y];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 359);
break;

        case PositionAlign.TR:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 362);
xy = [
                x - node.get(OFFSET_WIDTH),
                y
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 366);
break;

        case PositionAlign.BL:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 369);
xy = [
                x,
                y - node.get(OFFSET_HEIGHT)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 373);
break;

        case PositionAlign.BR:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 376);
xy = [
                x - node.get(OFFSET_WIDTH),
                y - node.get(OFFSET_HEIGHT)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 380);
break;

        case PositionAlign.TC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 383);
xy = [
                x - (node.get(OFFSET_WIDTH) / 2),
                y
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 387);
break;

        case PositionAlign.BC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 390);
xy = [
                x - (node.get(OFFSET_WIDTH) / 2),
                y - node.get(OFFSET_HEIGHT)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 394);
break;

        case PositionAlign.LC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 397);
xy = [
                x,
                y - (node.get(OFFSET_HEIGHT) / 2)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 401);
break;

        case PositionAlign.RC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 404);
xy = [
                x - node.get(OFFSET_WIDTH),
                y - (node.get(OFFSET_HEIGHT) / 2)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 408);
break;

        case PositionAlign.CC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 411);
xy = [
                x - (node.get(OFFSET_WIDTH) / 2),
                y - (node.get(OFFSET_HEIGHT) / 2)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 415);
break;

        default:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 418);
break;

        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 422);
return xy;
    },

    /**
    Returns `Widget` alignment coordinates realative to the given `Node`.

    @method _getAlignedXY
    @param {Node|String|null} [node] The node to align to, or null to indicate
      the viewport.
    @param {Array} points The alignment points.
    @return {Array} the coordinates.
    @protected
    **/
    _getAlignedXY: function (node, points) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_getAlignedXY", 435);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 436);
if ( ! Lang.isArray(points) || points.length !== 2) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 437);
Y.error('align: Invalid Points Arguments');
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 438);
return;
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 441);
var nodeRegion = this._getRegion(node), nodePoint, xy;

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 443);
if ( ! nodeRegion) {
            // No-op, nothing to align to.
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 445);
return;
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 448);
nodePoint   = points[1];

        // TODO: Optimize KWeight - Would lookup table help?
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 451);
switch (nodePoint) {
        case PositionAlign.TL:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 453);
xy = [nodeRegion.left, nodeRegion.top];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 454);
break;

        case PositionAlign.TR:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 457);
xy = [nodeRegion.right, nodeRegion.top];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 458);
break;

        case PositionAlign.BL:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 461);
xy = [nodeRegion.left, nodeRegion.bottom];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 462);
break;

        case PositionAlign.BR:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 465);
xy = [nodeRegion.right, nodeRegion.bottom];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 466);
break;

        case PositionAlign.TC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 469);
xy = [
                nodeRegion.left + Math.floor(nodeRegion.width / 2),
                nodeRegion.top
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 473);
break;

        case PositionAlign.BC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 476);
xy = [
                nodeRegion.left + Math.floor(nodeRegion.width / 2),
                nodeRegion.bottom
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 480);
break;

        case PositionAlign.LC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 483);
xy = [
                nodeRegion.left,
                nodeRegion.top + Math.floor(nodeRegion.height / 2)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 487);
break;

        case PositionAlign.RC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 490);
xy = [
                nodeRegion.right,
                nodeRegion.top + Math.floor(nodeRegion.height / 2)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 494);
break;

        case PositionAlign.CC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 497);
xy = [
                nodeRegion.left + Math.floor(nodeRegion.width / 2),
                nodeRegion.top + Math.floor(nodeRegion.height / 2)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 501);
break;

        default:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 504);
break;

        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 508);
return this._getAlignToXY(this._posNode, points[0], xy[0], xy[1]);
    },

    /**
    Default setter for `center` Attribute changes. Sets up the appropriate
    value, and passes it through the to the align attribute.

    @method _setAlignCenter
    @param {Boolean|Node} val The Attribute value being set.
    @return {Boolean|Node} the value passed in.
    @protected
    **/
    _setAlignCenter: function (val) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_setAlignCenter", 520);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 521);
if (val) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 522);
this.set(ALIGN, {
                node  : val === true ? null : val,
                points: [PositionAlign.CC, PositionAlign.CC]
            });
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 528);
return val;
    },

    /**
    Updates the UI to reflect the `align` value passed in.

    **Note:** See the `align` Attribute documentation, for the Object structure
    expected.

    @method _uiSetAlign
    @param {Node|String|null} [node] The node to align to, or null to indicate
      the viewport.
    @param {Array} points The alignment points.
    @protected
    **/
    _uiSetAlign: function (node, points) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_uiSetAlign", 543);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 544);
var xy = this._getAlignedXY(node, points);

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 546);
if (xy) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 547);
this._doAlign(xy);
        }
    },

    /**
    Attaches or detaches alignment-syncing event handlers based on the widget's
    `visible` Attribute state.

    @method _uiSetVisiblePosAlign
    @param {Boolean} visible The current value of the widget's `visible`
      Attribute.
    @protected
    **/
    _uiSetVisiblePosAlign: function (visible) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_uiSetVisiblePosAlign", 560);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 561);
if (visible) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 562);
this._attachPosAlignUIHandles();
        } else {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 564);
this._detachPosAlignUIHandles();
        }
    },

    /**
    Attaches the alignment-syncing event handlers.

    @method _attachPosAlignUIHandles
    @protected
    **/
    _attachPosAlignUIHandles: function () {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_attachPosAlignUIHandles", 574);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 575);
if (this._posAlignUIHandles) {
            // No-op if we have already setup the event handlers.
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 577);
return;
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 580);
var bb        = this.get(BOUNDING_BOX),
            syncAlign = Y.bind(this._syncUIPosAlign, this),
            handles   = [];

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 584);
Y.Array.each(this.get(ALIGN_ON), function (o) {
            _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "(anonymous 2)", 584);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 585);
var event = o.eventName,
                node  = Y.one(o.node) || bb;

            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 588);
if (event) {
                _yuitest_coverline("build/widget-position-align/widget-position-align.js", 589);
handles.push(node.on(event, syncAlign));
            }
        });

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 593);
this._posAlignUIHandles = handles;
    },

    /**
    Detaches the alignment-syncing event handlers.

    @method _detachPosAlignUIHandles
    @protected
    **/
    _detachPosAlignUIHandles: function () {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_detachPosAlignUIHandles", 602);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 603);
var handles = this._posAlignUIHandles;
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 604);
if (handles) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 605);
new Y.EventHandle(handles).detach();
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 606);
this._posAlignUIHandles = null;
        }
    },

    // -- Private Methods ------------------------------------------------------

    /**
    Helper method, used to align the given point on the widget, with the XY page
    coordinates provided.

    @method _doAlign
    @param {Array} xy XY page coordinates to align to.
    @private
    **/
    _doAlign: function(xy) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_doAlign", 620);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 621);
if (xy) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 622);
this.move(xy);
        }
    },

    /**
    Returns the region of the passed-in `Node`, or the viewport region if
    calling with passing in a `Node`.

    @method _getRegion
    @param {Node} [node] The node to get the region of.
    @return {Object} The node's region.
    @private
    **/
    _getRegion: function (node) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_getRegion", 635);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 636);
var nodeRegion;

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 638);
if ( ! node) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 639);
nodeRegion = this._posNode.get(VIEWPORT_REGION);
        } else {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 641);
node = Y.Node.one(node);
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 642);
if (node) {
                _yuitest_coverline("build/widget-position-align/widget-position-align.js", 643);
nodeRegion = node.get(REGION);
            }
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 647);
return nodeRegion;
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `alignChange` events by updating the UI in response to `align`
    Attribute changes.

    @method _afterAlignChange
    @param {EventFacade} e
    @protected
    **/
    _afterAlignChange: function (e) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_afterAlignChange", 660);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 661);
var align = e.newVal;
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 662);
if (align) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 663);
this._uiSetAlign(align.node, align.points);
        }
    },

    /**
    Handles `alignOnChange` events by updating the alignment-syncing event
    handlers.

    @method _afterAlignOnChange
    @param {EventFacade} e
    @protected
    **/
    _afterAlignOnChange: function(e) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_afterAlignOnChange", 675);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 676);
this._detachPosAlignUIHandles();

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 678);
if (this.get(VISIBLE)) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 679);
this._attachPosAlignUIHandles();
        }
    }
};

_yuitest_coverline("build/widget-position-align/widget-position-align.js", 684);
Y.WidgetPositionAlign = PositionAlign;


}, '@VERSION@', {"requires": ["widget-position"]});
