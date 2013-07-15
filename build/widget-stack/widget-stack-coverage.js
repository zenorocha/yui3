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
_yuitest_coverage["build/widget-stack/widget-stack.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-stack/widget-stack.js",
    code: []
};
_yuitest_coverage["build/widget-stack/widget-stack.js"].code=["YUI.add('widget-stack', function (Y, NAME) {","","/**"," * Provides stackable (z-index) support for Widgets through an extension."," *"," * @module widget-stack"," */","    var L = Y.Lang,","        UA = Y.UA,","        Node = Y.Node,","        Widget = Y.Widget,","","        ZINDEX = \"zIndex\",","        SHIM = \"shim\",","        VISIBLE = \"visible\",","","        BOUNDING_BOX = \"boundingBox\",","","        RENDER_UI = \"renderUI\",","        BIND_UI = \"bindUI\",","        SYNC_UI = \"syncUI\",","","        OFFSET_WIDTH = \"offsetWidth\",","        OFFSET_HEIGHT = \"offsetHeight\",","        PARENT_NODE = \"parentNode\",","        FIRST_CHILD = \"firstChild\",","        OWNER_DOCUMENT = \"ownerDocument\",","","        WIDTH = \"width\",","        HEIGHT = \"height\",","        PX = \"px\",","","        // HANDLE KEYS","        SHIM_DEFERRED = \"shimdeferred\",","        SHIM_RESIZE = \"shimresize\",","","        // Events","        VisibleChange = \"visibleChange\",","        WidthChange = \"widthChange\",","        HeightChange = \"heightChange\",","        ShimChange = \"shimChange\",","        ZIndexChange = \"zIndexChange\",","        ContentUpdate = \"contentUpdate\",","","        // CSS","        STACKED = \"stacked\";","","    /**","     * Widget extension, which can be used to add stackable (z-index) support to the","     * base Widget class along with a shimming solution, through the","     * <a href=\"Base.html#method_build\">Base.build</a> method.","     *","     * @class WidgetStack","     * @param {Object} User configuration object","     */","    function Stack(config) {}","","    // Static Properties","    /**","     * Static property used to define the default attribute","     * configuration introduced by WidgetStack.","     *","     * @property ATTRS","     * @type Object","     * @static","     */","    Stack.ATTRS = {","        /**","         * @attribute shim","         * @type boolean","         * @default false, for all browsers other than IE6, for which a shim is enabled by default.","         *","         * @description Boolean flag to indicate whether or not a shim should be added to the Widgets","         * boundingBox, to protect it from select box bleedthrough.","         */","        shim: {","            value: (UA.ie == 6)","        },","","        /**","         * @attribute zIndex","         * @type number","         * @default 0","         * @description The z-index to apply to the Widgets boundingBox. Non-numerical values for","         * zIndex will be converted to 0","         */","        zIndex: {","            value : 0,","            setter: '_setZIndex'","        }","    };","","    /**","     * The HTML parsing rules for the WidgetStack class.","     *","     * @property HTML_PARSER","     * @static","     * @type Object","     */","    Stack.HTML_PARSER = {","        zIndex: function (srcNode) {","            return this._parseZIndex(srcNode);","        }","    };","","    /**","     * Default class used to mark the shim element","     *","     * @property SHIM_CLASS_NAME","     * @type String","     * @static","     * @default \"yui3-widget-shim\"","     */","    Stack.SHIM_CLASS_NAME = Widget.getClassName(SHIM);","","    /**","     * Default class used to mark the boundingBox of a stacked widget.","     *","     * @property STACKED_CLASS_NAME","     * @type String","     * @static","     * @default \"yui3-widget-stacked\"","     */","    Stack.STACKED_CLASS_NAME = Widget.getClassName(STACKED);","","    /**","     * Default markup template used to generate the shim element.","     *","     * @property SHIM_TEMPLATE","     * @type String","     * @static","     */","    Stack.SHIM_TEMPLATE = '<iframe class=\"' + Stack.SHIM_CLASS_NAME + '\" frameborder=\"0\" title=\"Widget Stacking Shim\" src=\"javascript:false\" tabindex=\"-1\" role=\"presentation\"></iframe>';","","    Stack.prototype = {","","        initializer : function() {","            this._stackNode = this.get(BOUNDING_BOX);","            this._stackHandles = {};","","            // WIDGET METHOD OVERLAP","            Y.after(this._renderUIStack, this, RENDER_UI);","            Y.after(this._syncUIStack, this, SYNC_UI);","            Y.after(this._bindUIStack, this, BIND_UI);","        },","","        /**","         * Synchronizes the UI to match the Widgets stack state. This method in","         * invoked after syncUI is invoked for the Widget class using YUI's aop infrastructure.","         *","         * @method _syncUIStack","         * @protected","         */","        _syncUIStack: function() {","            this._uiSetShim(this.get(SHIM));","            this._uiSetZIndex(this.get(ZINDEX));","        },","","        /**","         * Binds event listeners responsible for updating the UI state in response to","         * Widget stack related state changes.","         * <p>","         * This method is invoked after bindUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _bindUIStack","         * @protected","         */","        _bindUIStack: function() {","            this.after(ShimChange, this._afterShimChange);","            this.after(ZIndexChange, this._afterZIndexChange);","        },","","        /**","         * Creates/Initializes the DOM to support stackability.","         * <p>","         * This method in invoked after renderUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _renderUIStack","         * @protected","         */","        _renderUIStack: function() {","            this._stackNode.addClass(Stack.STACKED_CLASS_NAME);","        },","","        /**","        Parses a `zIndex` attribute value from this widget's `srcNode`.","","        @method _parseZIndex","        @param {Node} srcNode The node to parse a `zIndex` value from.","        @return {Mixed} The parsed `zIndex` value.","        @protected","        **/","        _parseZIndex: function (srcNode) {","            var zIndex;","","            // Prefers how WebKit handles `z-index` which better matches the","            // spec:","            //","            // * http://www.w3.org/TR/CSS2/visuren.html#z-index","            // * https://bugs.webkit.org/show_bug.cgi?id=15562","            //","            // When a node isn't rendered in the document, and/or when a","            // node is not positioned, then it doesn't have a context to derive","            // a valid `z-index` value from.","            if (!srcNode.inDoc() || srcNode.getStyle('position') === 'static') {","                zIndex = 'auto';","            } else {","                // Uses `getComputedStyle()` because it has greater accuracy in","                // more browsers than `getStyle()` does for `z-index`.","                zIndex = srcNode.getComputedStyle('zIndex');","            }","","            // This extension adds a stacking context to widgets, therefore a","            // `srcNode` witout a stacking context (i.e. \"auto\") will return","            // `null` from this DOM parser. This way the widget's default or","            // user provided value for `zIndex` will be used.","            return zIndex === 'auto' ? null : zIndex;","        },","","        /**","         * Default setter for zIndex attribute changes. Normalizes zIndex values to","         * numbers, converting non-numerical values to 0.","         *","         * @method _setZIndex","         * @protected","         * @param {String | Number} zIndex","         * @return {Number} Normalized zIndex","         */","        _setZIndex: function(zIndex) {","            if (L.isString(zIndex)) {","                zIndex = parseInt(zIndex, 10);","            }","            if (!L.isNumber(zIndex)) {","                zIndex = 0;","            }","            return zIndex;","        },","","        /**","         * Default attribute change listener for the shim attribute, responsible","         * for updating the UI, in response to attribute changes.","         *","         * @method _afterShimChange","         * @protected","         * @param {EventFacade} e The event facade for the attribute change","         */","        _afterShimChange : function(e) {","            this._uiSetShim(e.newVal);","        },","","        /**","         * Default attribute change listener for the zIndex attribute, responsible","         * for updating the UI, in response to attribute changes.","         *","         * @method _afterZIndexChange","         * @protected","         * @param {EventFacade} e The event facade for the attribute change","         */","        _afterZIndexChange : function(e) {","            this._uiSetZIndex(e.newVal);","        },","","        /**","         * Updates the UI to reflect the zIndex value passed in.","         *","         * @method _uiSetZIndex","         * @protected","         * @param {number} zIndex The zindex to be reflected in the UI","         */","        _uiSetZIndex: function (zIndex) {","            this._stackNode.setStyle(ZINDEX, zIndex);","        },","","        /**","         * Updates the UI to enable/disable the shim. If the widget is not currently visible,","         * creation of the shim is deferred until it is made visible, for performance reasons.","         *","         * @method _uiSetShim","         * @protected","         * @param {boolean} enable If true, creates/renders the shim, if false, removes it.","         */","        _uiSetShim: function (enable) {","            if (enable) {","                // Lazy creation","                if (this.get(VISIBLE)) {","                    this._renderShim();","                } else {","                    this._renderShimDeferred();","                }","","                // Eagerly attach resize handlers","                //","                // Required because of Event stack behavior, commit ref: cd8dddc","                // Should be revisted after Ticket #2531067 is resolved.","                if (UA.ie == 6) {","                    this._addShimResizeHandlers();","                }","            } else {","                this._destroyShim();","            }","        },","","        /**","         * Sets up change handlers for the visible attribute, to defer shim creation/rendering","         * until the Widget is made visible.","         *","         * @method _renderShimDeferred","         * @private","         */","        _renderShimDeferred : function() {","","            this._stackHandles[SHIM_DEFERRED] = this._stackHandles[SHIM_DEFERRED] || [];","","            var handles = this._stackHandles[SHIM_DEFERRED],","                createBeforeVisible = function(e) {","                    if (e.newVal) {","                        this._renderShim();","                    }","                };","","            handles.push(this.on(VisibleChange, createBeforeVisible));","            // Depending how how Ticket #2531067 is resolved, a reversal of","            // commit ref: cd8dddc could lead to a more elagent solution, with","            // the addition of this line here:","            //","            // handles.push(this.after(VisibleChange, this.sizeShim));","        },","","        /**","         * Sets up event listeners to resize the shim when the size of the Widget changes.","         * <p>","         * NOTE: This method is only used for IE6 currently, since IE6 doesn't support a way to","         * resize the shim purely through CSS, when the Widget does not have an explicit width/height","         * set.","         * </p>","         * @method _addShimResizeHandlers","         * @private","         */","        _addShimResizeHandlers : function() {","","            this._stackHandles[SHIM_RESIZE] = this._stackHandles[SHIM_RESIZE] || [];","","            var sizeShim = this.sizeShim,","                handles = this._stackHandles[SHIM_RESIZE];","","            handles.push(this.after(VisibleChange, sizeShim));","            handles.push(this.after(WidthChange, sizeShim));","            handles.push(this.after(HeightChange, sizeShim));","            handles.push(this.after(ContentUpdate, sizeShim));","        },","","        /**","         * Detaches any handles stored for the provided key","         *","         * @method _detachStackHandles","         * @param String handleKey The key defining the group of handles which should be detached","         * @private","         */","        _detachStackHandles : function(handleKey) {","            var handles = this._stackHandles[handleKey],","                handle;","","            if (handles && handles.length > 0) {","                while((handle = handles.pop())) {","                    handle.detach();","                }","            }","        },","","        /**","         * Creates the shim element and adds it to the DOM","         *","         * @method _renderShim","         * @private","         */","        _renderShim : function() {","            var shimEl = this._shimNode,","                stackEl = this._stackNode;","","            if (!shimEl) {","                shimEl = this._shimNode = this._getShimTemplate();","                stackEl.insertBefore(shimEl, stackEl.get(FIRST_CHILD));","","                this._detachStackHandles(SHIM_DEFERRED);","                this.sizeShim();","            }","        },","","        /**","         * Removes the shim from the DOM, and detaches any related event","         * listeners.","         *","         * @method _destroyShim","         * @private","         */","        _destroyShim : function() {","            if (this._shimNode) {","                this._shimNode.get(PARENT_NODE).removeChild(this._shimNode);","                this._shimNode = null;","","                this._detachStackHandles(SHIM_DEFERRED);","                this._detachStackHandles(SHIM_RESIZE);","            }","        },","","        /**","         * For IE6, synchronizes the size and position of iframe shim to that of","         * Widget bounding box which it is protecting. For all other browsers,","         * this method does not do anything.","         *","         * @method sizeShim","         */","        sizeShim: function () {","            var shim = this._shimNode,","                node = this._stackNode;","","            if (shim && UA.ie === 6 && this.get(VISIBLE)) {","                shim.setStyle(WIDTH, node.get(OFFSET_WIDTH) + PX);","                shim.setStyle(HEIGHT, node.get(OFFSET_HEIGHT) + PX);","            }","        },","","        /**","         * Creates a cloned shim node, using the SHIM_TEMPLATE html template, for use on a new instance.","         *","         * @method _getShimTemplate","         * @private","         * @return {Node} node A new shim Node instance.","         */","        _getShimTemplate : function() {","            return Node.create(Stack.SHIM_TEMPLATE, this._stackNode.get(OWNER_DOCUMENT));","        }","    };","","    Y.WidgetStack = Stack;","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"widget\"], \"skinnable\": true});"];
_yuitest_coverage["build/widget-stack/widget-stack.js"].lines = {"1":0,"8":0,"56":0,"67":0,"100":0,"102":0,"114":0,"124":0,"133":0,"135":0,"138":0,"139":0,"142":0,"143":0,"144":0,"155":0,"156":0,"170":0,"171":0,"184":0,"196":0,"207":0,"208":0,"212":0,"219":0,"232":0,"233":0,"235":0,"236":0,"238":0,"250":0,"262":0,"273":0,"285":0,"287":0,"288":0,"290":0,"297":0,"298":0,"301":0,"314":0,"316":0,"318":0,"319":0,"323":0,"343":0,"345":0,"348":0,"349":0,"350":0,"351":0,"362":0,"365":0,"366":0,"367":0,"379":0,"382":0,"383":0,"384":0,"386":0,"387":0,"399":0,"400":0,"401":0,"403":0,"404":0,"416":0,"419":0,"420":0,"421":0,"433":0,"437":0};
_yuitest_coverage["build/widget-stack/widget-stack.js"].functions = {"Stack:56":0,"zIndex:101":0,"initializer:137":0,"_syncUIStack:154":0,"_bindUIStack:169":0,"_renderUIStack:183":0,"_parseZIndex:195":0,"_setZIndex:231":0,"_afterShimChange:249":0,"_afterZIndexChange:261":0,"_uiSetZIndex:272":0,"_uiSetShim:284":0,"createBeforeVisible:317":0,"_renderShimDeferred:312":0,"_addShimResizeHandlers:341":0,"_detachStackHandles:361":0,"_renderShim:378":0,"_destroyShim:398":0,"sizeShim:415":0,"_getShimTemplate:432":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-stack/widget-stack.js"].coveredLines = 72;
_yuitest_coverage["build/widget-stack/widget-stack.js"].coveredFunctions = 21;
_yuitest_coverline("build/widget-stack/widget-stack.js", 1);
YUI.add('widget-stack', function (Y, NAME) {

/**
 * Provides stackable (z-index) support for Widgets through an extension.
 *
 * @module widget-stack
 */
    _yuitest_coverfunc("build/widget-stack/widget-stack.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-stack/widget-stack.js", 8);
var L = Y.Lang,
        UA = Y.UA,
        Node = Y.Node,
        Widget = Y.Widget,

        ZINDEX = "zIndex",
        SHIM = "shim",
        VISIBLE = "visible",

        BOUNDING_BOX = "boundingBox",

        RENDER_UI = "renderUI",
        BIND_UI = "bindUI",
        SYNC_UI = "syncUI",

        OFFSET_WIDTH = "offsetWidth",
        OFFSET_HEIGHT = "offsetHeight",
        PARENT_NODE = "parentNode",
        FIRST_CHILD = "firstChild",
        OWNER_DOCUMENT = "ownerDocument",

        WIDTH = "width",
        HEIGHT = "height",
        PX = "px",

        // HANDLE KEYS
        SHIM_DEFERRED = "shimdeferred",
        SHIM_RESIZE = "shimresize",

        // Events
        VisibleChange = "visibleChange",
        WidthChange = "widthChange",
        HeightChange = "heightChange",
        ShimChange = "shimChange",
        ZIndexChange = "zIndexChange",
        ContentUpdate = "contentUpdate",

        // CSS
        STACKED = "stacked";

    /**
     * Widget extension, which can be used to add stackable (z-index) support to the
     * base Widget class along with a shimming solution, through the
     * <a href="Base.html#method_build">Base.build</a> method.
     *
     * @class WidgetStack
     * @param {Object} User configuration object
     */
    _yuitest_coverline("build/widget-stack/widget-stack.js", 56);
function Stack(config) {}

    // Static Properties
    /**
     * Static property used to define the default attribute
     * configuration introduced by WidgetStack.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    _yuitest_coverline("build/widget-stack/widget-stack.js", 67);
Stack.ATTRS = {
        /**
         * @attribute shim
         * @type boolean
         * @default false, for all browsers other than IE6, for which a shim is enabled by default.
         *
         * @description Boolean flag to indicate whether or not a shim should be added to the Widgets
         * boundingBox, to protect it from select box bleedthrough.
         */
        shim: {
            value: (UA.ie == 6)
        },

        /**
         * @attribute zIndex
         * @type number
         * @default 0
         * @description The z-index to apply to the Widgets boundingBox. Non-numerical values for
         * zIndex will be converted to 0
         */
        zIndex: {
            value : 0,
            setter: '_setZIndex'
        }
    };

    /**
     * The HTML parsing rules for the WidgetStack class.
     *
     * @property HTML_PARSER
     * @static
     * @type Object
     */
    _yuitest_coverline("build/widget-stack/widget-stack.js", 100);
Stack.HTML_PARSER = {
        zIndex: function (srcNode) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "zIndex", 101);
_yuitest_coverline("build/widget-stack/widget-stack.js", 102);
return this._parseZIndex(srcNode);
        }
    };

    /**
     * Default class used to mark the shim element
     *
     * @property SHIM_CLASS_NAME
     * @type String
     * @static
     * @default "yui3-widget-shim"
     */
    _yuitest_coverline("build/widget-stack/widget-stack.js", 114);
Stack.SHIM_CLASS_NAME = Widget.getClassName(SHIM);

    /**
     * Default class used to mark the boundingBox of a stacked widget.
     *
     * @property STACKED_CLASS_NAME
     * @type String
     * @static
     * @default "yui3-widget-stacked"
     */
    _yuitest_coverline("build/widget-stack/widget-stack.js", 124);
Stack.STACKED_CLASS_NAME = Widget.getClassName(STACKED);

    /**
     * Default markup template used to generate the shim element.
     *
     * @property SHIM_TEMPLATE
     * @type String
     * @static
     */
    _yuitest_coverline("build/widget-stack/widget-stack.js", 133);
Stack.SHIM_TEMPLATE = '<iframe class="' + Stack.SHIM_CLASS_NAME + '" frameborder="0" title="Widget Stacking Shim" src="javascript:false" tabindex="-1" role="presentation"></iframe>';

    _yuitest_coverline("build/widget-stack/widget-stack.js", 135);
Stack.prototype = {

        initializer : function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "initializer", 137);
_yuitest_coverline("build/widget-stack/widget-stack.js", 138);
this._stackNode = this.get(BOUNDING_BOX);
            _yuitest_coverline("build/widget-stack/widget-stack.js", 139);
this._stackHandles = {};

            // WIDGET METHOD OVERLAP
            _yuitest_coverline("build/widget-stack/widget-stack.js", 142);
Y.after(this._renderUIStack, this, RENDER_UI);
            _yuitest_coverline("build/widget-stack/widget-stack.js", 143);
Y.after(this._syncUIStack, this, SYNC_UI);
            _yuitest_coverline("build/widget-stack/widget-stack.js", 144);
Y.after(this._bindUIStack, this, BIND_UI);
        },

        /**
         * Synchronizes the UI to match the Widgets stack state. This method in
         * invoked after syncUI is invoked for the Widget class using YUI's aop infrastructure.
         *
         * @method _syncUIStack
         * @protected
         */
        _syncUIStack: function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_syncUIStack", 154);
_yuitest_coverline("build/widget-stack/widget-stack.js", 155);
this._uiSetShim(this.get(SHIM));
            _yuitest_coverline("build/widget-stack/widget-stack.js", 156);
this._uiSetZIndex(this.get(ZINDEX));
        },

        /**
         * Binds event listeners responsible for updating the UI state in response to
         * Widget stack related state changes.
         * <p>
         * This method is invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _bindUIStack
         * @protected
         */
        _bindUIStack: function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_bindUIStack", 169);
_yuitest_coverline("build/widget-stack/widget-stack.js", 170);
this.after(ShimChange, this._afterShimChange);
            _yuitest_coverline("build/widget-stack/widget-stack.js", 171);
this.after(ZIndexChange, this._afterZIndexChange);
        },

        /**
         * Creates/Initializes the DOM to support stackability.
         * <p>
         * This method in invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _renderUIStack
         * @protected
         */
        _renderUIStack: function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_renderUIStack", 183);
_yuitest_coverline("build/widget-stack/widget-stack.js", 184);
this._stackNode.addClass(Stack.STACKED_CLASS_NAME);
        },

        /**
        Parses a `zIndex` attribute value from this widget's `srcNode`.

        @method _parseZIndex
        @param {Node} srcNode The node to parse a `zIndex` value from.
        @return {Mixed} The parsed `zIndex` value.
        @protected
        **/
        _parseZIndex: function (srcNode) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_parseZIndex", 195);
_yuitest_coverline("build/widget-stack/widget-stack.js", 196);
var zIndex;

            // Prefers how WebKit handles `z-index` which better matches the
            // spec:
            //
            // * http://www.w3.org/TR/CSS2/visuren.html#z-index
            // * https://bugs.webkit.org/show_bug.cgi?id=15562
            //
            // When a node isn't rendered in the document, and/or when a
            // node is not positioned, then it doesn't have a context to derive
            // a valid `z-index` value from.
            _yuitest_coverline("build/widget-stack/widget-stack.js", 207);
if (!srcNode.inDoc() || srcNode.getStyle('position') === 'static') {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 208);
zIndex = 'auto';
            } else {
                // Uses `getComputedStyle()` because it has greater accuracy in
                // more browsers than `getStyle()` does for `z-index`.
                _yuitest_coverline("build/widget-stack/widget-stack.js", 212);
zIndex = srcNode.getComputedStyle('zIndex');
            }

            // This extension adds a stacking context to widgets, therefore a
            // `srcNode` witout a stacking context (i.e. "auto") will return
            // `null` from this DOM parser. This way the widget's default or
            // user provided value for `zIndex` will be used.
            _yuitest_coverline("build/widget-stack/widget-stack.js", 219);
return zIndex === 'auto' ? null : zIndex;
        },

        /**
         * Default setter for zIndex attribute changes. Normalizes zIndex values to
         * numbers, converting non-numerical values to 0.
         *
         * @method _setZIndex
         * @protected
         * @param {String | Number} zIndex
         * @return {Number} Normalized zIndex
         */
        _setZIndex: function(zIndex) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_setZIndex", 231);
_yuitest_coverline("build/widget-stack/widget-stack.js", 232);
if (L.isString(zIndex)) {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 233);
zIndex = parseInt(zIndex, 10);
            }
            _yuitest_coverline("build/widget-stack/widget-stack.js", 235);
if (!L.isNumber(zIndex)) {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 236);
zIndex = 0;
            }
            _yuitest_coverline("build/widget-stack/widget-stack.js", 238);
return zIndex;
        },

        /**
         * Default attribute change listener for the shim attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterShimChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterShimChange : function(e) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_afterShimChange", 249);
_yuitest_coverline("build/widget-stack/widget-stack.js", 250);
this._uiSetShim(e.newVal);
        },

        /**
         * Default attribute change listener for the zIndex attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterZIndexChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterZIndexChange : function(e) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_afterZIndexChange", 261);
_yuitest_coverline("build/widget-stack/widget-stack.js", 262);
this._uiSetZIndex(e.newVal);
        },

        /**
         * Updates the UI to reflect the zIndex value passed in.
         *
         * @method _uiSetZIndex
         * @protected
         * @param {number} zIndex The zindex to be reflected in the UI
         */
        _uiSetZIndex: function (zIndex) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_uiSetZIndex", 272);
_yuitest_coverline("build/widget-stack/widget-stack.js", 273);
this._stackNode.setStyle(ZINDEX, zIndex);
        },

        /**
         * Updates the UI to enable/disable the shim. If the widget is not currently visible,
         * creation of the shim is deferred until it is made visible, for performance reasons.
         *
         * @method _uiSetShim
         * @protected
         * @param {boolean} enable If true, creates/renders the shim, if false, removes it.
         */
        _uiSetShim: function (enable) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_uiSetShim", 284);
_yuitest_coverline("build/widget-stack/widget-stack.js", 285);
if (enable) {
                // Lazy creation
                _yuitest_coverline("build/widget-stack/widget-stack.js", 287);
if (this.get(VISIBLE)) {
                    _yuitest_coverline("build/widget-stack/widget-stack.js", 288);
this._renderShim();
                } else {
                    _yuitest_coverline("build/widget-stack/widget-stack.js", 290);
this._renderShimDeferred();
                }

                // Eagerly attach resize handlers
                //
                // Required because of Event stack behavior, commit ref: cd8dddc
                // Should be revisted after Ticket #2531067 is resolved.
                _yuitest_coverline("build/widget-stack/widget-stack.js", 297);
if (UA.ie == 6) {
                    _yuitest_coverline("build/widget-stack/widget-stack.js", 298);
this._addShimResizeHandlers();
                }
            } else {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 301);
this._destroyShim();
            }
        },

        /**
         * Sets up change handlers for the visible attribute, to defer shim creation/rendering
         * until the Widget is made visible.
         *
         * @method _renderShimDeferred
         * @private
         */
        _renderShimDeferred : function() {

            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_renderShimDeferred", 312);
_yuitest_coverline("build/widget-stack/widget-stack.js", 314);
this._stackHandles[SHIM_DEFERRED] = this._stackHandles[SHIM_DEFERRED] || [];

            _yuitest_coverline("build/widget-stack/widget-stack.js", 316);
var handles = this._stackHandles[SHIM_DEFERRED],
                createBeforeVisible = function(e) {
                    _yuitest_coverfunc("build/widget-stack/widget-stack.js", "createBeforeVisible", 317);
_yuitest_coverline("build/widget-stack/widget-stack.js", 318);
if (e.newVal) {
                        _yuitest_coverline("build/widget-stack/widget-stack.js", 319);
this._renderShim();
                    }
                };

            _yuitest_coverline("build/widget-stack/widget-stack.js", 323);
handles.push(this.on(VisibleChange, createBeforeVisible));
            // Depending how how Ticket #2531067 is resolved, a reversal of
            // commit ref: cd8dddc could lead to a more elagent solution, with
            // the addition of this line here:
            //
            // handles.push(this.after(VisibleChange, this.sizeShim));
        },

        /**
         * Sets up event listeners to resize the shim when the size of the Widget changes.
         * <p>
         * NOTE: This method is only used for IE6 currently, since IE6 doesn't support a way to
         * resize the shim purely through CSS, when the Widget does not have an explicit width/height
         * set.
         * </p>
         * @method _addShimResizeHandlers
         * @private
         */
        _addShimResizeHandlers : function() {

            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_addShimResizeHandlers", 341);
_yuitest_coverline("build/widget-stack/widget-stack.js", 343);
this._stackHandles[SHIM_RESIZE] = this._stackHandles[SHIM_RESIZE] || [];

            _yuitest_coverline("build/widget-stack/widget-stack.js", 345);
var sizeShim = this.sizeShim,
                handles = this._stackHandles[SHIM_RESIZE];

            _yuitest_coverline("build/widget-stack/widget-stack.js", 348);
handles.push(this.after(VisibleChange, sizeShim));
            _yuitest_coverline("build/widget-stack/widget-stack.js", 349);
handles.push(this.after(WidthChange, sizeShim));
            _yuitest_coverline("build/widget-stack/widget-stack.js", 350);
handles.push(this.after(HeightChange, sizeShim));
            _yuitest_coverline("build/widget-stack/widget-stack.js", 351);
handles.push(this.after(ContentUpdate, sizeShim));
        },

        /**
         * Detaches any handles stored for the provided key
         *
         * @method _detachStackHandles
         * @param String handleKey The key defining the group of handles which should be detached
         * @private
         */
        _detachStackHandles : function(handleKey) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_detachStackHandles", 361);
_yuitest_coverline("build/widget-stack/widget-stack.js", 362);
var handles = this._stackHandles[handleKey],
                handle;

            _yuitest_coverline("build/widget-stack/widget-stack.js", 365);
if (handles && handles.length > 0) {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 366);
while((handle = handles.pop())) {
                    _yuitest_coverline("build/widget-stack/widget-stack.js", 367);
handle.detach();
                }
            }
        },

        /**
         * Creates the shim element and adds it to the DOM
         *
         * @method _renderShim
         * @private
         */
        _renderShim : function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_renderShim", 378);
_yuitest_coverline("build/widget-stack/widget-stack.js", 379);
var shimEl = this._shimNode,
                stackEl = this._stackNode;

            _yuitest_coverline("build/widget-stack/widget-stack.js", 382);
if (!shimEl) {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 383);
shimEl = this._shimNode = this._getShimTemplate();
                _yuitest_coverline("build/widget-stack/widget-stack.js", 384);
stackEl.insertBefore(shimEl, stackEl.get(FIRST_CHILD));

                _yuitest_coverline("build/widget-stack/widget-stack.js", 386);
this._detachStackHandles(SHIM_DEFERRED);
                _yuitest_coverline("build/widget-stack/widget-stack.js", 387);
this.sizeShim();
            }
        },

        /**
         * Removes the shim from the DOM, and detaches any related event
         * listeners.
         *
         * @method _destroyShim
         * @private
         */
        _destroyShim : function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_destroyShim", 398);
_yuitest_coverline("build/widget-stack/widget-stack.js", 399);
if (this._shimNode) {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 400);
this._shimNode.get(PARENT_NODE).removeChild(this._shimNode);
                _yuitest_coverline("build/widget-stack/widget-stack.js", 401);
this._shimNode = null;

                _yuitest_coverline("build/widget-stack/widget-stack.js", 403);
this._detachStackHandles(SHIM_DEFERRED);
                _yuitest_coverline("build/widget-stack/widget-stack.js", 404);
this._detachStackHandles(SHIM_RESIZE);
            }
        },

        /**
         * For IE6, synchronizes the size and position of iframe shim to that of
         * Widget bounding box which it is protecting. For all other browsers,
         * this method does not do anything.
         *
         * @method sizeShim
         */
        sizeShim: function () {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "sizeShim", 415);
_yuitest_coverline("build/widget-stack/widget-stack.js", 416);
var shim = this._shimNode,
                node = this._stackNode;

            _yuitest_coverline("build/widget-stack/widget-stack.js", 419);
if (shim && UA.ie === 6 && this.get(VISIBLE)) {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 420);
shim.setStyle(WIDTH, node.get(OFFSET_WIDTH) + PX);
                _yuitest_coverline("build/widget-stack/widget-stack.js", 421);
shim.setStyle(HEIGHT, node.get(OFFSET_HEIGHT) + PX);
            }
        },

        /**
         * Creates a cloned shim node, using the SHIM_TEMPLATE html template, for use on a new instance.
         *
         * @method _getShimTemplate
         * @private
         * @return {Node} node A new shim Node instance.
         */
        _getShimTemplate : function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_getShimTemplate", 432);
_yuitest_coverline("build/widget-stack/widget-stack.js", 433);
return Node.create(Stack.SHIM_TEMPLATE, this._stackNode.get(OWNER_DOCUMENT));
        }
    };

    _yuitest_coverline("build/widget-stack/widget-stack.js", 437);
Y.WidgetStack = Stack;


}, '@VERSION@', {"requires": ["base-build", "widget"], "skinnable": true});
