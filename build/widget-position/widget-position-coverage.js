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
_yuitest_coverage["build/widget-position/widget-position.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-position/widget-position.js",
    code: []
};
_yuitest_coverage["build/widget-position/widget-position.js"].code=["YUI.add('widget-position', function (Y, NAME) {","","/**"," * Provides basic XY positioning support for Widgets, though an extension"," *"," * @module widget-position"," */","    var Lang = Y.Lang,","        Widget = Y.Widget,","","        XY_COORD = \"xy\",","","        POSITION = \"position\",","        POSITIONED = \"positioned\",","        BOUNDING_BOX = \"boundingBox\",","        RELATIVE = \"relative\",","","        RENDERUI = \"renderUI\",","        BINDUI = \"bindUI\",","        SYNCUI = \"syncUI\",","","        UI = Widget.UI_SRC,","","        XYChange = \"xyChange\";","","    /**","     * Widget extension, which can be used to add positioning support to the base Widget class,","     * through the <a href=\"Base.html#method_build\">Base.build</a> method.","     *","     * @class WidgetPosition","     * @param {Object} config User configuration object","     */","    function Position(config) {","    }","","    /**","     * Static property used to define the default attribute","     * configuration introduced by WidgetPosition.","     *","     * @property ATTRS","     * @static","     * @type Object","     */","    Position.ATTRS = {","","        /**","         * @attribute x","         * @type number","         * @default 0","         *","         * @description Page X co-ordinate for the widget. This attribute acts as a facade for the","         * xy attribute. Changes in position can be monitored by listening for xyChange events.","         */","        x: {","            setter: function(val) {","                this._setX(val);","            },","            getter: function() {","                return this._getX();","            },","            lazyAdd:false","        },","","        /**","         * @attribute y","         * @type number","         * @default 0","         *","         * @description Page Y co-ordinate for the widget. This attribute acts as a facade for the","         * xy attribute. Changes in position can be monitored by listening for xyChange events.","         */","        y: {","            setter: function(val) {","                this._setY(val);","            },","            getter: function() {","                return this._getY();","            },","            lazyAdd: false","        },","","        /**","         * @attribute xy","         * @type Array","         * @default [0,0]","         *","         * @description Page XY co-ordinate pair for the widget.","         */","        xy: {","            value:[0,0],","            validator: function(val) {","                return this._validateXY(val);","            }","        }","    };","","    /**","     * Default class used to mark the boundingBox of a positioned widget.","     *","     * @property POSITIONED_CLASS_NAME","     * @type String","     * @default \"yui-widget-positioned\"","     * @static","     */","    Position.POSITIONED_CLASS_NAME = Widget.getClassName(POSITIONED);","","    Position.prototype = {","","        initializer : function() {","            this._posNode = this.get(BOUNDING_BOX);","","            // WIDGET METHOD OVERLAP","            Y.after(this._renderUIPosition, this, RENDERUI);","            Y.after(this._syncUIPosition, this, SYNCUI);","            Y.after(this._bindUIPosition, this, BINDUI);","        },","","        /**","         * Creates/Initializes the DOM to support xy page positioning.","         * <p>","         * This method in invoked after renderUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _renderUIPosition","         * @protected","         */","        _renderUIPosition : function() {","            this._posNode.addClass(Position.POSITIONED_CLASS_NAME);","        },","","        /**","         * Synchronizes the UI to match the Widgets xy page position state.","         * <p>","         * This method in invoked after syncUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _syncUIPosition","         * @protected","         */","        _syncUIPosition : function() {","            var posNode = this._posNode;","            if (posNode.getStyle(POSITION) === RELATIVE) {","                this.syncXY();","            }","            this._uiSetXY(this.get(XY_COORD));","        },","","        /**","         * Binds event listeners responsible for updating the UI state in response to","         * Widget position related state changes.","         * <p>","         * This method in invoked after bindUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _bindUIPosition","         * @protected","         */","        _bindUIPosition :function() {","            this.after(XYChange, this._afterXYChange);","        },","","        /**","         * Moves the Widget to the specified page xy co-ordinate position.","         *","         * @method move","         *","         * @param {Number} x The new x position","         * @param {Number} y The new y position","         * <p>Or</p>","         * @param {Array} x, y values passed as an array ([x, y]), to support","         * simple pass through of Node.getXY results","         */","        move: function () {","            var args = arguments,","                coord = (Lang.isArray(args[0])) ? args[0] : [args[0], args[1]];","                this.set(XY_COORD, coord);","        },","","        /**","         * Synchronizes the Panel's \"xy\", \"x\", and \"y\" properties with the","         * Widget's position in the DOM.","         *","         * @method syncXY","         */","        syncXY : function () {","            this.set(XY_COORD, this._posNode.getXY(), {src: UI});","        },","","        /**","         * Default validator for the XY attribute","         *","         * @method _validateXY","         * @protected","         * @param {Array} val The XY page co-ordinate value which is being set.","         * @return {boolean} true if valid, false if not.","         */","        _validateXY : function(val) {","            return (Lang.isArray(val) && Lang.isNumber(val[0]) && Lang.isNumber(val[1]));","        },","","        /**","         * Default setter for the X attribute. The setter passes the X value through","         * to the XY attribute, which is the sole store for the XY state.","         *","         * @method _setX","         * @protected","         * @param {Number} val The X page co-ordinate value","         */","        _setX : function(val) {","            this.set(XY_COORD, [val, this.get(XY_COORD)[1]]);","        },","","        /**","         * Default setter for the Y attribute. The setter passes the Y value through","         * to the XY attribute, which is the sole store for the XY state.","         *","         * @method _setY","         * @protected","         * @param {Number} val The Y page co-ordinate value","         */","        _setY : function(val) {","            this.set(XY_COORD, [this.get(XY_COORD)[0], val]);","        },","","        /**","         * Default getter for the X attribute. The value is retrieved from","         * the XY attribute, which is the sole store for the XY state.","         *","         * @method _getX","         * @protected","         * @return {Number} The X page co-ordinate value","         */","        _getX : function() {","            return this.get(XY_COORD)[0];","        },","","        /**","         * Default getter for the Y attribute. The value is retrieved from","         * the XY attribute, which is the sole store for the XY state.","         *","         * @method _getY","         * @protected","         * @return {Number} The Y page co-ordinate value","         */","        _getY : function() {","            return this.get(XY_COORD)[1];","        },","","        /**","         * Default attribute change listener for the xy attribute, responsible","         * for updating the UI, in response to attribute changes.","         *","         * @method _afterXYChange","         * @protected","         * @param {EventFacade} e The event facade for the attribute change","         */","        _afterXYChange : function(e) {","            if (e.src != UI) {","                this._uiSetXY(e.newVal);","            }","        },","","        /**","         * Updates the UI to reflect the XY page co-ordinates passed in.","         *","         * @method _uiSetXY","         * @protected","         * @param {String} val The XY page co-ordinates value to be reflected in the UI","         */","        _uiSetXY : function(val) {","            this._posNode.setXY(val);","        }","    };","","    Y.WidgetPosition = Position;","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"node-screen\", \"widget\"]});"];
_yuitest_coverage["build/widget-position/widget-position.js"].lines = {"1":0,"8":0,"33":0,"44":0,"56":0,"59":0,"74":0,"77":0,"92":0,"105":0,"107":0,"110":0,"113":0,"114":0,"115":0,"128":0,"141":0,"142":0,"143":0,"145":0,"159":0,"174":0,"176":0,"186":0,"198":0,"210":0,"222":0,"234":0,"246":0,"258":0,"259":0,"271":0,"275":0};
_yuitest_coverage["build/widget-position/widget-position.js"].functions = {"Position:33":0,"setter:55":0,"getter:58":0,"setter:73":0,"getter:76":0,"validator:91":0,"initializer:109":0,"_renderUIPosition:127":0,"_syncUIPosition:140":0,"_bindUIPosition:158":0,"move:173":0,"syncXY:185":0,"_validateXY:197":0,"_setX:209":0,"_setY:221":0,"_getX:233":0,"_getY:245":0,"_afterXYChange:257":0,"_uiSetXY:270":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-position/widget-position.js"].coveredLines = 33;
_yuitest_coverage["build/widget-position/widget-position.js"].coveredFunctions = 20;
_yuitest_coverline("build/widget-position/widget-position.js", 1);
YUI.add('widget-position', function (Y, NAME) {

/**
 * Provides basic XY positioning support for Widgets, though an extension
 *
 * @module widget-position
 */
    _yuitest_coverfunc("build/widget-position/widget-position.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-position/widget-position.js", 8);
var Lang = Y.Lang,
        Widget = Y.Widget,

        XY_COORD = "xy",

        POSITION = "position",
        POSITIONED = "positioned",
        BOUNDING_BOX = "boundingBox",
        RELATIVE = "relative",

        RENDERUI = "renderUI",
        BINDUI = "bindUI",
        SYNCUI = "syncUI",

        UI = Widget.UI_SRC,

        XYChange = "xyChange";

    /**
     * Widget extension, which can be used to add positioning support to the base Widget class,
     * through the <a href="Base.html#method_build">Base.build</a> method.
     *
     * @class WidgetPosition
     * @param {Object} config User configuration object
     */
    _yuitest_coverline("build/widget-position/widget-position.js", 33);
function Position(config) {
    }

    /**
     * Static property used to define the default attribute
     * configuration introduced by WidgetPosition.
     *
     * @property ATTRS
     * @static
     * @type Object
     */
    _yuitest_coverline("build/widget-position/widget-position.js", 44);
Position.ATTRS = {

        /**
         * @attribute x
         * @type number
         * @default 0
         *
         * @description Page X co-ordinate for the widget. This attribute acts as a facade for the
         * xy attribute. Changes in position can be monitored by listening for xyChange events.
         */
        x: {
            setter: function(val) {
                _yuitest_coverfunc("build/widget-position/widget-position.js", "setter", 55);
_yuitest_coverline("build/widget-position/widget-position.js", 56);
this._setX(val);
            },
            getter: function() {
                _yuitest_coverfunc("build/widget-position/widget-position.js", "getter", 58);
_yuitest_coverline("build/widget-position/widget-position.js", 59);
return this._getX();
            },
            lazyAdd:false
        },

        /**
         * @attribute y
         * @type number
         * @default 0
         *
         * @description Page Y co-ordinate for the widget. This attribute acts as a facade for the
         * xy attribute. Changes in position can be monitored by listening for xyChange events.
         */
        y: {
            setter: function(val) {
                _yuitest_coverfunc("build/widget-position/widget-position.js", "setter", 73);
_yuitest_coverline("build/widget-position/widget-position.js", 74);
this._setY(val);
            },
            getter: function() {
                _yuitest_coverfunc("build/widget-position/widget-position.js", "getter", 76);
_yuitest_coverline("build/widget-position/widget-position.js", 77);
return this._getY();
            },
            lazyAdd: false
        },

        /**
         * @attribute xy
         * @type Array
         * @default [0,0]
         *
         * @description Page XY co-ordinate pair for the widget.
         */
        xy: {
            value:[0,0],
            validator: function(val) {
                _yuitest_coverfunc("build/widget-position/widget-position.js", "validator", 91);
_yuitest_coverline("build/widget-position/widget-position.js", 92);
return this._validateXY(val);
            }
        }
    };

    /**
     * Default class used to mark the boundingBox of a positioned widget.
     *
     * @property POSITIONED_CLASS_NAME
     * @type String
     * @default "yui-widget-positioned"
     * @static
     */
    _yuitest_coverline("build/widget-position/widget-position.js", 105);
Position.POSITIONED_CLASS_NAME = Widget.getClassName(POSITIONED);

    _yuitest_coverline("build/widget-position/widget-position.js", 107);
Position.prototype = {

        initializer : function() {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "initializer", 109);
_yuitest_coverline("build/widget-position/widget-position.js", 110);
this._posNode = this.get(BOUNDING_BOX);

            // WIDGET METHOD OVERLAP
            _yuitest_coverline("build/widget-position/widget-position.js", 113);
Y.after(this._renderUIPosition, this, RENDERUI);
            _yuitest_coverline("build/widget-position/widget-position.js", 114);
Y.after(this._syncUIPosition, this, SYNCUI);
            _yuitest_coverline("build/widget-position/widget-position.js", 115);
Y.after(this._bindUIPosition, this, BINDUI);
        },

        /**
         * Creates/Initializes the DOM to support xy page positioning.
         * <p>
         * This method in invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _renderUIPosition
         * @protected
         */
        _renderUIPosition : function() {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_renderUIPosition", 127);
_yuitest_coverline("build/widget-position/widget-position.js", 128);
this._posNode.addClass(Position.POSITIONED_CLASS_NAME);
        },

        /**
         * Synchronizes the UI to match the Widgets xy page position state.
         * <p>
         * This method in invoked after syncUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _syncUIPosition
         * @protected
         */
        _syncUIPosition : function() {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_syncUIPosition", 140);
_yuitest_coverline("build/widget-position/widget-position.js", 141);
var posNode = this._posNode;
            _yuitest_coverline("build/widget-position/widget-position.js", 142);
if (posNode.getStyle(POSITION) === RELATIVE) {
                _yuitest_coverline("build/widget-position/widget-position.js", 143);
this.syncXY();
            }
            _yuitest_coverline("build/widget-position/widget-position.js", 145);
this._uiSetXY(this.get(XY_COORD));
        },

        /**
         * Binds event listeners responsible for updating the UI state in response to
         * Widget position related state changes.
         * <p>
         * This method in invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _bindUIPosition
         * @protected
         */
        _bindUIPosition :function() {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_bindUIPosition", 158);
_yuitest_coverline("build/widget-position/widget-position.js", 159);
this.after(XYChange, this._afterXYChange);
        },

        /**
         * Moves the Widget to the specified page xy co-ordinate position.
         *
         * @method move
         *
         * @param {Number} x The new x position
         * @param {Number} y The new y position
         * <p>Or</p>
         * @param {Array} x, y values passed as an array ([x, y]), to support
         * simple pass through of Node.getXY results
         */
        move: function () {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "move", 173);
_yuitest_coverline("build/widget-position/widget-position.js", 174);
var args = arguments,
                coord = (Lang.isArray(args[0])) ? args[0] : [args[0], args[1]];
                _yuitest_coverline("build/widget-position/widget-position.js", 176);
this.set(XY_COORD, coord);
        },

        /**
         * Synchronizes the Panel's "xy", "x", and "y" properties with the
         * Widget's position in the DOM.
         *
         * @method syncXY
         */
        syncXY : function () {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "syncXY", 185);
_yuitest_coverline("build/widget-position/widget-position.js", 186);
this.set(XY_COORD, this._posNode.getXY(), {src: UI});
        },

        /**
         * Default validator for the XY attribute
         *
         * @method _validateXY
         * @protected
         * @param {Array} val The XY page co-ordinate value which is being set.
         * @return {boolean} true if valid, false if not.
         */
        _validateXY : function(val) {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_validateXY", 197);
_yuitest_coverline("build/widget-position/widget-position.js", 198);
return (Lang.isArray(val) && Lang.isNumber(val[0]) && Lang.isNumber(val[1]));
        },

        /**
         * Default setter for the X attribute. The setter passes the X value through
         * to the XY attribute, which is the sole store for the XY state.
         *
         * @method _setX
         * @protected
         * @param {Number} val The X page co-ordinate value
         */
        _setX : function(val) {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_setX", 209);
_yuitest_coverline("build/widget-position/widget-position.js", 210);
this.set(XY_COORD, [val, this.get(XY_COORD)[1]]);
        },

        /**
         * Default setter for the Y attribute. The setter passes the Y value through
         * to the XY attribute, which is the sole store for the XY state.
         *
         * @method _setY
         * @protected
         * @param {Number} val The Y page co-ordinate value
         */
        _setY : function(val) {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_setY", 221);
_yuitest_coverline("build/widget-position/widget-position.js", 222);
this.set(XY_COORD, [this.get(XY_COORD)[0], val]);
        },

        /**
         * Default getter for the X attribute. The value is retrieved from
         * the XY attribute, which is the sole store for the XY state.
         *
         * @method _getX
         * @protected
         * @return {Number} The X page co-ordinate value
         */
        _getX : function() {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_getX", 233);
_yuitest_coverline("build/widget-position/widget-position.js", 234);
return this.get(XY_COORD)[0];
        },

        /**
         * Default getter for the Y attribute. The value is retrieved from
         * the XY attribute, which is the sole store for the XY state.
         *
         * @method _getY
         * @protected
         * @return {Number} The Y page co-ordinate value
         */
        _getY : function() {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_getY", 245);
_yuitest_coverline("build/widget-position/widget-position.js", 246);
return this.get(XY_COORD)[1];
        },

        /**
         * Default attribute change listener for the xy attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterXYChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterXYChange : function(e) {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_afterXYChange", 257);
_yuitest_coverline("build/widget-position/widget-position.js", 258);
if (e.src != UI) {
                _yuitest_coverline("build/widget-position/widget-position.js", 259);
this._uiSetXY(e.newVal);
            }
        },

        /**
         * Updates the UI to reflect the XY page co-ordinates passed in.
         *
         * @method _uiSetXY
         * @protected
         * @param {String} val The XY page co-ordinates value to be reflected in the UI
         */
        _uiSetXY : function(val) {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_uiSetXY", 270);
_yuitest_coverline("build/widget-position/widget-position.js", 271);
this._posNode.setXY(val);
        }
    };

    _yuitest_coverline("build/widget-position/widget-position.js", 275);
Y.WidgetPosition = Position;


}, '@VERSION@', {"requires": ["base-build", "node-screen", "widget"]});
