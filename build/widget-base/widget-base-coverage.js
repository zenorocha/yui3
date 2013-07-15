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
_yuitest_coverage["build/widget-base/widget-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-base/widget-base.js",
    code: []
};
_yuitest_coverage["build/widget-base/widget-base.js"].code=["YUI.add('widget-base', function (Y, NAME) {","","/**"," * Provides the base Widget class, with HTML Parser support"," *"," * @module widget"," * @main widget"," */","","/**"," * Provides the base Widget class"," *"," * @module widget"," * @submodule widget-base"," */","var L = Y.Lang,","    Node = Y.Node,","","    ClassNameManager = Y.ClassNameManager,","","    _getClassName = ClassNameManager.getClassName,","    _getWidgetClassName,","","    _toInitialCap = Y.cached(function(str) {","        return str.substring(0, 1).toUpperCase() + str.substring(1);","    }),","","    // K-Weight, IE GC optimizations","    CONTENT = \"content\",","    VISIBLE = \"visible\",","    HIDDEN = \"hidden\",","    DISABLED = \"disabled\",","    FOCUSED = \"focused\",","    WIDTH = \"width\",","    HEIGHT = \"height\",","    BOUNDING_BOX = \"boundingBox\",","    CONTENT_BOX = \"contentBox\",","    PARENT_NODE = \"parentNode\",","    OWNER_DOCUMENT = \"ownerDocument\",","    AUTO = \"auto\",","    SRC_NODE = \"srcNode\",","    BODY = \"body\",","    TAB_INDEX = \"tabIndex\",","    ID = \"id\",","    RENDER = \"render\",","    RENDERED = \"rendered\",","    DESTROYED = \"destroyed\",","    STRINGS = \"strings\",","    DIV = \"<div></div>\",","    CHANGE = \"Change\",","    LOADING = \"loading\",","","    _UISET = \"_uiSet\",","","    EMPTY_STR = \"\",","    EMPTY_FN = function() {},","","    TRUE = true,","    FALSE = false,","","    UI,","    ATTRS = {},","    UI_ATTRS = [VISIBLE, DISABLED, HEIGHT, WIDTH, FOCUSED, TAB_INDEX],","","    WEBKIT = Y.UA.webkit,","","    // Widget nodeid-to-instance map.","    _instances = {};","","/**"," * A base class for widgets, providing:"," * <ul>"," *    <li>The render lifecycle method, in addition to the init and destroy"," *        lifecycle methods provide by Base</li>"," *    <li>Abstract methods to support consistent MVC structure across"," *        widgets: renderer, renderUI, bindUI, syncUI</li>"," *    <li>Support for common widget attributes, such as boundingBox, contentBox, visible,"," *        disabled, focused, strings</li>"," * </ul>"," *"," * @param config {Object} Object literal specifying widget configuration properties."," *"," * @class Widget"," * @constructor"," * @extends Base"," */","function Widget(config) {","","    // kweight","    var widget = this,","        parentNode,","        render,","        constructor = widget.constructor;","","    widget._strs = {};","    widget._cssPrefix = constructor.CSS_PREFIX || _getClassName(constructor.NAME.toLowerCase());","","    // We need a config for HTML_PARSER to work.","    config = config || {};","","    Widget.superclass.constructor.call(widget, config);","","    render = widget.get(RENDER);","","    if (render) {","        // Render could be a node or boolean","        if (render !== TRUE) {","            parentNode = render;","        }","        widget.render(parentNode);","    }","}","","/**"," * Static property provides a string to identify the class."," * <p>"," * Currently used to apply class identifiers to the bounding box"," * and to classify events fired by the widget."," * </p>"," *"," * @property NAME"," * @type String"," * @static"," */","Widget.NAME = \"widget\";","","/**"," * Constant used to identify state changes originating from"," * the DOM (as opposed to the JavaScript model)."," *"," * @property UI_SRC"," * @type String"," * @static"," * @final"," */","UI = Widget.UI_SRC = \"ui\";","","/**"," * Static property used to define the default attribute"," * configuration for the Widget."," *"," * @property ATTRS"," * @type Object"," * @static"," */","Widget.ATTRS = ATTRS;","","// Trying to optimize kweight by setting up attrs this way saves about 0.4K min'd","","/**"," * @attribute id"," * @writeOnce"," * @default Generated using guid()"," * @type String"," */","","ATTRS[ID] = {","    valueFn: \"_guid\",","    writeOnce: TRUE","};","","/**"," * Flag indicating whether or not this Widget"," * has been through the render lifecycle phase."," *"," * @attribute rendered"," * @readOnly"," * @default false"," * @type boolean"," */","ATTRS[RENDERED] = {","    value:FALSE,","    readOnly: TRUE","};","","/**"," * @attribute boundingBox"," * @description The outermost DOM node for the Widget, used for sizing and positioning"," * of a Widget as well as a containing element for any decorator elements used"," * for skinning."," * @type String | Node"," * @writeOnce"," */","ATTRS[BOUNDING_BOX] = {","    value:null,","    setter: \"_setBB\",","    writeOnce: TRUE","};","","/**"," * @attribute contentBox"," * @description A DOM node that is a direct descendant of a Widget's bounding box that"," * houses its content."," * @type String | Node"," * @writeOnce"," */","ATTRS[CONTENT_BOX] = {","    valueFn:\"_defaultCB\",","    setter: \"_setCB\",","    writeOnce: TRUE","};","","/**"," * @attribute tabIndex"," * @description Number (between -32767 to 32767) indicating the widget's"," * position in the default tab flow.  The value is used to set the"," * \"tabIndex\" attribute on the widget's bounding box.  Negative values allow"," * the widget to receive DOM focus programmatically (by calling the focus"," * method), while being removed from the default tab flow.  A value of"," * null removes the \"tabIndex\" attribute from the widget's bounding box."," * @type Number"," * @default null"," */","ATTRS[TAB_INDEX] = {","    value: null,","    validator: \"_validTabIndex\"","};","","/**"," * @attribute focused"," * @description Boolean indicating if the Widget, or one of its descendants,"," * has focus."," * @readOnly"," * @default false"," * @type boolean"," */","ATTRS[FOCUSED] = {","    value: FALSE,","    readOnly:TRUE","};","","/**"," * @attribute disabled"," * @description Boolean indicating if the Widget should be disabled. The disabled implementation"," * is left to the specific classes extending widget."," * @default false"," * @type boolean"," */","ATTRS[DISABLED] = {","    value: FALSE","};","","/**"," * @attribute visible"," * @description Boolean indicating whether or not the Widget is visible."," * @default TRUE"," * @type boolean"," */","ATTRS[VISIBLE] = {","    value: TRUE","};","","/**"," * @attribute height"," * @description String with units, or number, representing the height of the Widget. If a number is provided,"," * the default unit, defined by the Widgets DEF_UNIT, property is used."," * @default EMPTY_STR"," * @type {String | Number}"," */","ATTRS[HEIGHT] = {","    value: EMPTY_STR","};","","/**"," * @attribute width"," * @description String with units, or number, representing the width of the Widget. If a number is provided,"," * the default unit, defined by the Widgets DEF_UNIT, property is used."," * @default EMPTY_STR"," * @type {String | Number}"," */","ATTRS[WIDTH] = {","    value: EMPTY_STR","};","","/**"," * @attribute strings"," * @description Collection of strings used to label elements of the Widget's UI."," * @default null"," * @type Object"," */","ATTRS[STRINGS] = {","    value: {},","    setter: \"_strSetter\",","    getter: \"_strGetter\"","};","","/**"," * Whether or not to render the widget automatically after init, and optionally, to which parent node."," *"," * @attribute render"," * @type boolean | Node"," * @writeOnce"," */","ATTRS[RENDER] = {","    value:FALSE,","    writeOnce:TRUE","};","","/**"," * The css prefix which the static Widget.getClassName method should use when constructing class names"," *"," * @property CSS_PREFIX"," * @type String"," * @default Widget.NAME.toLowerCase()"," * @private"," * @static"," */","Widget.CSS_PREFIX = _getClassName(Widget.NAME.toLowerCase());","","/**"," * Generate a standard prefixed classname for the Widget, prefixed by the default prefix defined"," * by the <code>Y.config.classNamePrefix</code> attribute used by <code>ClassNameManager</code> and"," * <code>Widget.NAME.toLowerCase()</code> (e.g. \"yui-widget-xxxxx-yyyyy\", based on default values for"," * the prefix and widget class name)."," * <p>"," * The instance based version of this method can be used to generate standard prefixed classnames,"," * based on the instances NAME, as opposed to Widget.NAME. This method should be used when you"," * need to use a constant class name across different types instances."," * </p>"," * @method getClassName"," * @param {String*} args* 0..n strings which should be concatenated, using the default separator defined by ClassNameManager, to create the class name"," */","Widget.getClassName = function() {","    // arguments needs to be array'fied to concat","    return _getClassName.apply(ClassNameManager, [Widget.CSS_PREFIX].concat(Y.Array(arguments), true));","};","","_getWidgetClassName = Widget.getClassName;","","/**"," * Returns the widget instance whose bounding box contains, or is, the given node."," * <p>"," * In the case of nested widgets, the nearest bounding box ancestor is used to"," * return the widget instance."," * </p>"," * @method getByNode"," * @static"," * @param node {Node | String} The node for which to return a Widget instance. If a selector"," * string is passed in, which selects more than one node, the first node found is used."," * @return {Widget} Widget instance, or null if not found."," */","Widget.getByNode = function(node) {","    var widget,","        widgetMarker = _getWidgetClassName();","","    node = Node.one(node);","    if (node) {","        node = node.ancestor(\".\" + widgetMarker, true);","        if (node) {","            widget = _instances[Y.stamp(node, true)];","        }","    }","","    return widget || null;","};","","Y.extend(Widget, Y.Base, {","","    /**","     * Returns a class name prefixed with the the value of the","     * <code>YUI.config.classNamePrefix</code> attribute + the instances <code>NAME</code> property.","     * Uses <code>YUI.config.classNameDelimiter</code> attribute to delimit the provided strings.","     * e.g.","     * <code>","     * <pre>","     *    // returns \"yui-slider-foo-bar\", for a slider instance","     *    var scn = slider.getClassName('foo','bar');","     *","     *    // returns \"yui-overlay-foo-bar\", for an overlay instance","     *    var ocn = overlay.getClassName('foo','bar');","     * </pre>","     * </code>","     *","     * @method getClassName","     * @param {String}+ One or more classname bits to be joined and prefixed","     */","    getClassName: function () {","        return _getClassName.apply(ClassNameManager, [this._cssPrefix].concat(Y.Array(arguments), true));","    },","","    /**","     * Initializer lifecycle implementation for the Widget class. Registers the","     * widget instance, and runs through the Widget's HTML_PARSER definition.","     *","     * @method initializer","     * @protected","     * @param  config {Object} Configuration object literal for the widget","     */","    initializer: function(config) {","","        var bb = this.get(BOUNDING_BOX);","","        if (bb instanceof Node) {","            this._mapInstance(Y.stamp(bb));","        }","","        /**","         * Notification event, which widget implementations can fire, when","         * they change the content of the widget. This event has no default","         * behavior and cannot be prevented, so the \"on\" or \"after\"","         * moments are effectively equivalent (with on listeners being invoked before","         * after listeners).","         *","         * @event widget:contentUpdate","         * @preventable false","         * @param {EventFacade} e The Event Facade","         */","    },","","    /**","     * Utility method used to add an entry to the boundingBox id to instance map.","     *","     * This method can be used to populate the instance with lazily created boundingBox Node references.","     *","     * @method _mapInstance","     * @param {String} The boundingBox id","     * @protected","     */","    _mapInstance : function(id) {","        _instances[id] = this;","    },","","    /**","     * Destructor lifecycle implementation for the Widget class. Purges events attached","     * to the bounding box and content box, removes them from the DOM and removes","     * the Widget from the list of registered widgets.","     *","     * @method destructor","     * @protected","     */","    destructor: function() {","","        var boundingBox = this.get(BOUNDING_BOX),","            bbGuid;","","        if (boundingBox instanceof Node) {","            bbGuid = Y.stamp(boundingBox,true);","","            if (bbGuid in _instances) {","                delete _instances[bbGuid];","            }","","            this._destroyBox();","        }","    },","","    /**","     * <p>","     * Destroy lifecycle method. Fires the destroy","     * event, prior to invoking destructors for the","     * class hierarchy.","     *","     * Overrides Base's implementation, to support arguments to destroy","     * </p>","     * <p>","     * Subscribers to the destroy","     * event can invoke preventDefault on the event object, to prevent destruction","     * from proceeding.","     * </p>","     * @method destroy","     * @param destroyAllNodes {Boolean} If true, all nodes contained within the Widget are","     * removed and destroyed. Defaults to false due to potentially high run-time cost.","     * @return {Widget} A reference to this object","     * @chainable","     */","    destroy: function(destroyAllNodes) {","        this._destroyAllNodes = destroyAllNodes;","        return Widget.superclass.destroy.apply(this);","    },","","    /**","     * Removes and destroys the widgets rendered boundingBox, contentBox,","     * and detaches bound UI events.","     *","     * @method _destroyBox","     * @protected","     */","    _destroyBox : function() {","","        var boundingBox = this.get(BOUNDING_BOX),","            contentBox = this.get(CONTENT_BOX),","            deep = this._destroyAllNodes,","            same;","","        same = boundingBox && boundingBox.compareTo(contentBox);","","        if (this.UI_EVENTS) {","            this._destroyUIEvents();","        }","","        this._unbindUI(boundingBox);","","        if (contentBox) {","            if (deep) {","                contentBox.empty();","            }","            contentBox.remove(TRUE);","        }","","        if (!same) {","            if (deep) {","                boundingBox.empty();","            }","            boundingBox.remove(TRUE);","        }","    },","","    /**","     * Establishes the initial DOM for the widget. Invoking this","     * method will lead to the creating of all DOM elements for","     * the widget (or the manipulation of existing DOM elements","     * for the progressive enhancement use case).","     * <p>","     * This method should only be invoked once for an initialized","     * widget.","     * </p>","     * <p>","     * It delegates to the widget specific renderer method to do","     * the actual work.","     * </p>","     *","     * @method render","     * @chainable","     * @final","     * @param  parentNode {Object | String} Optional. The Node under which the","     * Widget is to be rendered. This can be a Node instance or a CSS selector string.","     * <p>","     * If the selector string returns more than one Node, the first node will be used","     * as the parentNode. NOTE: This argument is required if both the boundingBox and contentBox","     * are not currently in the document. If it's not provided, the Widget will be rendered","     * to the body of the current document in this case.","     * </p>","     */","    render: function(parentNode) {","","        if (!this.get(DESTROYED) && !this.get(RENDERED)) {","             /**","              * Lifecycle event for the render phase, fired prior to rendering the UI","              * for the widget (prior to invoking the widget's renderer method).","              * <p>","              * Subscribers to the \"on\" moment of this event, will be notified","              * before the widget is rendered.","              * </p>","              * <p>","              * Subscribers to the \"after\" moment of this event, will be notified","              * after rendering is complete.","              * </p>","              *","              * @event render","              * @preventable _defRenderFn","              * @param {EventFacade} e The Event Facade","              */","            this.publish(RENDER, {","                queuable:FALSE,","                fireOnce:TRUE,","                defaultTargetOnly:TRUE,","                defaultFn: this._defRenderFn","            });","","            this.fire(RENDER, {parentNode: (parentNode) ? Node.one(parentNode) : null});","        }","        return this;","    },","","    /**","     * Default render handler","     *","     * @method _defRenderFn","     * @protected","     * @param {EventFacade} e The Event object","     * @param {Node} parentNode The parent node to render to, if passed in to the <code>render</code> method","     */","    _defRenderFn : function(e) {","        this._parentNode = e.parentNode;","","        this.renderer();","        this._set(RENDERED, TRUE);","","        this._removeLoadingClassNames();","    },","","    /**","     * Creates DOM (or manipulates DOM for progressive enhancement)","     * This method is invoked by render() and is not chained","     * automatically for the class hierarchy (unlike initializer, destructor)","     * so it should be chained manually for subclasses if required.","     *","     * @method renderer","     * @protected","     */","    renderer: function() {","        // kweight","        var widget = this;","","        widget._renderUI();","        widget.renderUI();","","        widget._bindUI();","        widget.bindUI();","","        widget._syncUI();","        widget.syncUI();","    },","","    /**","     * Configures/Sets up listeners to bind Widget State to UI/DOM","     *","     * This method is not called by framework and is not chained","     * automatically for the class hierarchy.","     *","     * @method bindUI","     * @protected","     */","    bindUI: EMPTY_FN,","","    /**","     * Adds nodes to the DOM","     *","     * This method is not called by framework and is not chained","     * automatically for the class hierarchy.","     *","     * @method renderUI","     * @protected","     */","    renderUI: EMPTY_FN,","","    /**","     * Refreshes the rendered UI, based on Widget State","     *","     * This method is not called by framework and is not chained","     * automatically for the class hierarchy.","     *","     * @method syncUI","     * @protected","     *","     */","    syncUI: EMPTY_FN,","","    /**","     * @method hide","     * @description Hides the Widget by setting the \"visible\" attribute to \"false\".","     * @chainable","     */","    hide: function() {","        return this.set(VISIBLE, FALSE);","    },","","    /**","     * @method show","     * @description Shows the Widget by setting the \"visible\" attribute to \"true\".","     * @chainable","     */","    show: function() {","        return this.set(VISIBLE, TRUE);","    },","","    /**","     * @method focus","     * @description Causes the Widget to receive the focus by setting the \"focused\"","     * attribute to \"true\".","     * @chainable","     */","    focus: function () {","        return this._set(FOCUSED, TRUE);","    },","","    /**","     * @method blur","     * @description Causes the Widget to lose focus by setting the \"focused\" attribute","     * to \"false\"","     * @chainable","     */","    blur: function () {","        return this._set(FOCUSED, FALSE);","    },","","    /**","     * @method enable","     * @description Set the Widget's \"disabled\" attribute to \"false\".","     * @chainable","     */","    enable: function() {","        return this.set(DISABLED, FALSE);","    },","","    /**","     * @method disable","     * @description Set the Widget's \"disabled\" attribute to \"true\".","     * @chainable","     */","    disable: function() {","        return this.set(DISABLED, TRUE);","    },","","    /**","     * @method _uiSizeCB","     * @protected","     * @param {boolean} expand","     */","    _uiSizeCB : function(expand) {","        this.get(CONTENT_BOX).toggleClass(_getWidgetClassName(CONTENT, \"expanded\"), expand);","    },","","    /**","     * Helper method to collect the boundingBox and contentBox and append to the provided parentNode, if not","     * already a child. The owner document of the boundingBox, or the owner document of the contentBox will be used","     * as the document into which the Widget is rendered if a parentNode is node is not provided. If both the boundingBox and","     * the contentBox are not currently in the document, and no parentNode is provided, the widget will be rendered","     * to the current document's body.","     *","     * @method _renderBox","     * @private","     * @param {Node} parentNode The parentNode to render the widget to. If not provided, and both the boundingBox and","     * the contentBox are not currently in the document, the widget will be rendered to the current document's body.","     */","    _renderBox: function(parentNode) {","","        // TODO: Performance Optimization [ More effective algo to reduce Node refs, compares, replaces? ]","","        var widget = this, // kweight","            contentBox = widget.get(CONTENT_BOX),","            boundingBox = widget.get(BOUNDING_BOX),","            srcNode = widget.get(SRC_NODE),","            defParentNode = widget.DEF_PARENT_NODE,","","            doc = (srcNode && srcNode.get(OWNER_DOCUMENT)) || boundingBox.get(OWNER_DOCUMENT) || contentBox.get(OWNER_DOCUMENT);","","        // If srcNode (assume it's always in doc), have contentBox take its place (widget render responsible for re-use of srcNode contents)","        if (srcNode && !srcNode.compareTo(contentBox) && !contentBox.inDoc(doc)) {","            srcNode.replace(contentBox);","        }","","        if (!boundingBox.compareTo(contentBox.get(PARENT_NODE)) && !boundingBox.compareTo(contentBox)) {","            // If contentBox box is already in the document, have boundingBox box take it's place","            if (contentBox.inDoc(doc)) {","                contentBox.replace(boundingBox);","            }","            boundingBox.appendChild(contentBox);","        }","","        parentNode = parentNode || (defParentNode && Node.one(defParentNode));","","        if (parentNode) {","            parentNode.appendChild(boundingBox);","        } else if (!boundingBox.inDoc(doc)) {","            Node.one(BODY).insert(boundingBox, 0);","        }","    },","","    /**","     * Setter for the boundingBox attribute","     *","     * @method _setBB","     * @private","     * @param Node/String","     * @return Node","     */","    _setBB: function(node) {","        return this._setBox(this.get(ID), node, this.BOUNDING_TEMPLATE, true);","    },","","    /**","     * Setter for the contentBox attribute","     *","     * @method _setCB","     * @private","     * @param {Node|String} node","     * @return Node","     */","    _setCB: function(node) {","        return (this.CONTENT_TEMPLATE === null) ? this.get(BOUNDING_BOX) : this._setBox(null, node, this.CONTENT_TEMPLATE, false);","    },","","    /**","     * Returns the default value for the contentBox attribute.","     *","     * For the Widget class, this will be the srcNode if provided, otherwise null (resulting in","     * a new contentBox node instance being created)","     *","     * @method _defaultCB","     * @protected","     */","    _defaultCB : function(node) {","        return this.get(SRC_NODE) || null;","    },","","    /**","     * Helper method to set the bounding/content box, or create it from","     * the provided template if not found.","     *","     * @method _setBox","     * @private","     *","     * @param {String} id The node's id attribute","     * @param {Node|String} node The node reference","     * @param {String} template HTML string template for the node","     * @param {boolean} true if this is the boundingBox, false if it's the contentBox","     * @return {Node} The node","     */","    _setBox : function(id, node, template, isBounding) {","","        node = Node.one(node);","","        if (!node) {","            node = Node.create(template);","","            if (isBounding) {","                this._bbFromTemplate = true;","            } else {","                this._cbFromTemplate = true;","            }","        }","","        if (!node.get(ID)) {","            node.set(ID, id || Y.guid());","        }","","        return node;","    },","","    /**","     * Initializes the UI state for the Widget's bounding/content boxes.","     *","     * @method _renderUI","     * @protected","     */","    _renderUI: function() {","        this._renderBoxClassNames();","        this._renderBox(this._parentNode);","    },","","    /**","     * Applies standard class names to the boundingBox and contentBox","     *","     * @method _renderBoxClassNames","     * @protected","     */","    _renderBoxClassNames : function() {","        var classes = this._getClasses(),","            cl,","            boundingBox = this.get(BOUNDING_BOX),","            i;","","        boundingBox.addClass(_getWidgetClassName());","","        // Start from Widget Sub Class","        for (i = classes.length-3; i >= 0; i--) {","            cl = classes[i];","            boundingBox.addClass(cl.CSS_PREFIX || _getClassName(cl.NAME.toLowerCase()));","        }","","        // Use instance based name for content box","        this.get(CONTENT_BOX).addClass(this.getClassName(CONTENT));","    },","","    /**","     * Removes class names representative of the widget's loading state from","     * the boundingBox.","     *","     * @method _removeLoadingClassNames","     * @protected","     */","    _removeLoadingClassNames: function () {","","        var boundingBox = this.get(BOUNDING_BOX),","            contentBox = this.get(CONTENT_BOX),","            instClass = this.getClassName(LOADING),","            widgetClass = _getWidgetClassName(LOADING);","","        boundingBox.removeClass(widgetClass)","                   .removeClass(instClass);","","        contentBox.removeClass(widgetClass)","                  .removeClass(instClass);","    },","","    /**","     * Sets up DOM and CustomEvent listeners for the widget.","     *","     * @method _bindUI","     * @protected","     */","    _bindUI: function() {","        this._bindAttrUI(this._UI_ATTRS.BIND);","        this._bindDOM();","    },","","    /**","     * @method _unbindUI","     * @protected","     */","    _unbindUI : function(boundingBox) {","        this._unbindDOM(boundingBox);","    },","","    /**","     * Sets up DOM listeners, on elements rendered by the widget.","     *","     * @method _bindDOM","     * @protected","     */","    _bindDOM : function() {","        var oDocument = this.get(BOUNDING_BOX).get(OWNER_DOCUMENT),","            focusHandle = Widget._hDocFocus;","","        // Shared listener across all Widgets.","        if (!focusHandle) {","            focusHandle = Widget._hDocFocus = oDocument.on(\"focus\", this._onDocFocus, this);","            focusHandle.listeners = {","                count: 0","            };","        }","","        focusHandle.listeners[Y.stamp(this, true)] = true;","        focusHandle.listeners.count++;","","        //	Fix for Webkit:","        //	Document doesn't receive focus in Webkit when the user mouses","        //	down on it, so the \"focused\" attribute won't get set to the","        //	correct value. Keeping this instance based for now, potential better performance.","        //  Otherwise we'll end up looking up widgets from the DOM on every mousedown.","        if (WEBKIT){","            this._hDocMouseDown = oDocument.on(\"mousedown\", this._onDocMouseDown, this);","        }","    },","","    /**","     * @method _unbindDOM","     * @protected","     */","    _unbindDOM : function(boundingBox) {","","        var focusHandle = Widget._hDocFocus,","            yuid = Y.stamp(this, true),","            focusListeners,","            mouseHandle = this._hDocMouseDown;","","        if (focusHandle) {","","            focusListeners = focusHandle.listeners;","","            if (focusListeners[yuid]) {","                delete focusListeners[yuid];","                focusListeners.count--;","            }","","            if (focusListeners.count === 0) {","                focusHandle.detach();","                Widget._hDocFocus = null;","            }","        }","","        if (WEBKIT && mouseHandle) {","            mouseHandle.detach();","        }","    },","","    /**","     * Updates the widget UI to reflect the attribute state.","     *","     * @method _syncUI","     * @protected","     */","    _syncUI: function() {","        this._syncAttrUI(this._UI_ATTRS.SYNC);","    },","","    /**","     * Sets the height on the widget's bounding box element","     *","     * @method _uiSetHeight","     * @protected","     * @param {String | Number} val","     */","    _uiSetHeight: function(val) {","        this._uiSetDim(HEIGHT, val);","        this._uiSizeCB((val !== EMPTY_STR && val !== AUTO));","    },","","    /**","     * Sets the width on the widget's bounding box element","     *","     * @method _uiSetWidth","     * @protected","     * @param {String | Number} val","     */","    _uiSetWidth: function(val) {","        this._uiSetDim(WIDTH, val);","    },","","    /**","     * @method _uiSetDim","     * @private","     * @param {String} dim The dimension - \"width\" or \"height\"","     * @param {Number | String} val The value to set","     */","    _uiSetDim: function(dimension, val) {","        this.get(BOUNDING_BOX).setStyle(dimension, L.isNumber(val) ? val + this.DEF_UNIT : val);","    },","","    /**","     * Sets the visible state for the UI","     *","     * @method _uiSetVisible","     * @protected","     * @param {boolean} val","     */","    _uiSetVisible: function(val) {","        this.get(BOUNDING_BOX).toggleClass(this.getClassName(HIDDEN), !val);","    },","","    /**","     * Sets the disabled state for the UI","     *","     * @method _uiSetDisabled","     * @protected","     * @param {boolean} val","     */","    _uiSetDisabled: function(val) {","        this.get(BOUNDING_BOX).toggleClass(this.getClassName(DISABLED), val);","    },","","    /**","     * Sets the focused state for the UI","     *","     * @method _uiSetFocused","     * @protected","     * @param {boolean} val","     * @param {string} src String representing the source that triggered an update to","     * the UI.","     */","    _uiSetFocused: function(val, src) {","         var boundingBox = this.get(BOUNDING_BOX);","         boundingBox.toggleClass(this.getClassName(FOCUSED), val);","","         if (src !== UI) {","            if (val) {","                boundingBox.focus();","            } else {","                boundingBox.blur();","            }","         }","    },","","    /**","     * Set the tabIndex on the widget's rendered UI","     *","     * @method _uiSetTabIndex","     * @protected","     * @param Number","     */","    _uiSetTabIndex: function(index) {","        var boundingBox = this.get(BOUNDING_BOX);","","        if (L.isNumber(index)) {","            boundingBox.set(TAB_INDEX, index);","        } else {","            boundingBox.removeAttribute(TAB_INDEX);","        }","    },","","    /**","     * @method _onDocMouseDown","     * @description \"mousedown\" event handler for the owner document of the","     * widget's bounding box.","     * @protected","     * @param {EventFacade} evt The event facade for the DOM focus event","     */","    _onDocMouseDown: function (evt) {","        if (this._domFocus) {","            this._onDocFocus(evt);","        }","    },","","    /**","     * DOM focus event handler, used to sync the state of the Widget with the DOM","     *","     * @method _onDocFocus","     * @protected","     * @param {EventFacade} evt The event facade for the DOM focus event","     */","    _onDocFocus: function (evt) {","        var widget = Widget.getByNode(evt.target),","            activeWidget = Widget._active;","","        if (activeWidget && (activeWidget !== widget)) {","            activeWidget._domFocus = false;","            activeWidget._set(FOCUSED, false, {src:UI});","","            Widget._active = null;","        }","","        if (widget) {","            widget._domFocus = true;","            widget._set(FOCUSED, true, {src:UI});","","            Widget._active = widget;","        }","    },","","    /**","     * Generic toString implementation for all widgets.","     *","     * @method toString","     * @return {String} The default string value for the widget [ displays the NAME of the instance, and the unique id ]","     */","    toString: function() {","        // Using deprecated name prop for kweight squeeze.","        return this.name + \"[\" + this.get(ID) + \"]\";","    },","","    /**","     * Default unit to use for dimension values","     *","     * @property DEF_UNIT","     * @type String","     */","    DEF_UNIT : \"px\",","","    /**","     * Default node to render the bounding box to. If not set,","     * will default to the current document body.","     *","     * @property DEF_PARENT_NODE","     * @type String | Node","     */","    DEF_PARENT_NODE : null,","","    /**","     * Property defining the markup template for content box. If your Widget doesn't","     * need the dual boundingBox/contentBox structure, set CONTENT_TEMPLATE to null,","     * and contentBox and boundingBox will both point to the same Node.","     *","     * @property CONTENT_TEMPLATE","     * @type String","     */","    CONTENT_TEMPLATE : DIV,","","    /**","     * Property defining the markup template for bounding box.","     *","     * @property BOUNDING_TEMPLATE","     * @type String","     */","    BOUNDING_TEMPLATE : DIV,","","    /**","     * @method _guid","     * @protected","     */","    _guid : function() {","        return Y.guid();","    },","","    /**","     * @method _validTabIndex","     * @protected","     * @param {Number} tabIndex","     */","    _validTabIndex : function (tabIndex) {","        return (L.isNumber(tabIndex) || L.isNull(tabIndex));","    },","","    /**","     * Binds after listeners for the list of attributes provided","     *","     * @method _bindAttrUI","     * @private","     * @param {Array} attrs","     */","    _bindAttrUI : function(attrs) {","        var i,","            l = attrs.length;","","        for (i = 0; i < l; i++) {","            this.after(attrs[i] + CHANGE, this._setAttrUI);","        }","    },","","    /**","     * Invokes the _uiSet&#61;ATTR NAME&#62; method for the list of attributes provided","     *","     * @method _syncAttrUI","     * @private","     * @param {Array} attrs","     */","    _syncAttrUI : function(attrs) {","        var i, l = attrs.length, attr;","        for (i = 0; i < l; i++) {","            attr = attrs[i];","            this[_UISET + _toInitialCap(attr)](this.get(attr));","        }","    },","","    /**","     * @method _setAttrUI","     * @private","     * @param {EventFacade} e","     */","    _setAttrUI : function(e) {","        if (e.target === this) {","            this[_UISET + _toInitialCap(e.attrName)](e.newVal, e.src);","        }","    },","","    /**","     * The default setter for the strings attribute. Merges partial sets","     * into the full string set, to allow users to partial sets of strings","     *","     * @method _strSetter","     * @protected","     * @param {Object} strings","     * @return {String} The full set of strings to set","     */","    _strSetter : function(strings) {","        return Y.merge(this.get(STRINGS), strings);","    },","","    /**","     * Helper method to get a specific string value","     *","     * @deprecated Used by deprecated WidgetLocale implementations.","     * @method getString","     * @param {String} key","     * @return {String} The string","     */","    getString : function(key) {","        return this.get(STRINGS)[key];","    },","","    /**","     * Helper method to get the complete set of strings for the widget","     *","     * @deprecated  Used by deprecated WidgetLocale implementations.","     * @method getStrings","     * @param {String} key","     * @return {String} The strings","     */","    getStrings : function() {","        return this.get(STRINGS);","    },","","    /**","     * The lists of UI attributes to bind and sync for widget's _bindUI and _syncUI implementations","     *","     * @property _UI_ATTRS","     * @type Object","     * @private","     */","    _UI_ATTRS : {","        BIND: UI_ATTRS,","        SYNC: UI_ATTRS","    }","});","","Y.Widget = Widget;","","","}, '@VERSION@', {","    \"requires\": [","        \"attribute\",","        \"base-base\",","        \"base-pluginhost\",","        \"classnamemanager\",","        \"event-focus\",","        \"node-base\",","        \"node-style\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/widget-base/widget-base.js"].lines = {"1":0,"16":0,"25":0,"87":0,"90":0,"95":0,"96":0,"99":0,"101":0,"103":0,"105":0,"107":0,"108":0,"110":0,"125":0,"136":0,"146":0,"157":0,"171":0,"184":0,"197":0,"214":0,"227":0,"239":0,"249":0,"260":0,"271":0,"281":0,"294":0,"308":0,"323":0,"325":0,"328":0,"342":0,"343":0,"346":0,"347":0,"348":0,"349":0,"350":0,"354":0,"357":0,"378":0,"391":0,"393":0,"394":0,"420":0,"433":0,"436":0,"437":0,"439":0,"440":0,"443":0,"467":0,"468":0,"480":0,"485":0,"487":0,"488":0,"491":0,"493":0,"494":0,"495":0,"497":0,"500":0,"501":0,"502":0,"504":0,"536":0,"553":0,"560":0,"562":0,"574":0,"576":0,"577":0,"579":0,"593":0,"595":0,"596":0,"598":0,"599":0,"601":0,"602":0,"645":0,"654":0,"664":0,"674":0,"683":0,"692":0,"701":0,"720":0,"729":0,"730":0,"733":0,"735":0,"736":0,"738":0,"741":0,"743":0,"744":0,"745":0,"746":0,"759":0,"771":0,"784":0,"802":0,"804":0,"805":0,"807":0,"808":0,"810":0,"814":0,"815":0,"818":0,"828":0,"829":0,"839":0,"844":0,"847":0,"848":0,"849":0,"853":0,"865":0,"870":0,"873":0,"884":0,"885":0,"893":0,"903":0,"907":0,"908":0,"909":0,"914":0,"915":0,"922":0,"923":0,"933":0,"938":0,"940":0,"942":0,"943":0,"944":0,"947":0,"948":0,"949":0,"953":0,"954":0,"965":0,"976":0,"977":0,"988":0,"998":0,"1009":0,"1020":0,"1033":0,"1034":0,"1036":0,"1037":0,"1038":0,"1040":0,"1053":0,"1055":0,"1056":0,"1058":0,"1070":0,"1071":0,"1083":0,"1086":0,"1087":0,"1088":0,"1090":0,"1093":0,"1094":0,"1095":0,"1097":0,"1109":0,"1152":0,"1161":0,"1172":0,"1175":0,"1176":0,"1188":0,"1189":0,"1190":0,"1191":0,"1201":0,"1202":0,"1216":0,"1228":0,"1240":0,"1256":0};
_yuitest_coverage["build/widget-base/widget-base.js"].functions = {"(anonymous 2):24":0,"Widget:87":0,"getClassName:323":0,"getByNode:342":0,"getClassName:377":0,"initializer:389":0,"_mapInstance:419":0,"destructor:431":0,"destroy:466":0,"_destroyBox:478":0,"render:534":0,"_defRenderFn:573":0,"renderer:591":0,"hide:644":0,"show:653":0,"focus:663":0,"blur:673":0,"enable:682":0,"disable:691":0,"_uiSizeCB:700":0,"_renderBox:716":0,"_setBB:758":0,"_setCB:770":0,"_defaultCB:783":0,"_setBox:800":0,"_renderUI:827":0,"_renderBoxClassNames:838":0,"_removeLoadingClassNames:863":0,"_bindUI:883":0,"_unbindUI:892":0,"_bindDOM:902":0,"_unbindDOM:931":0,"_syncUI:964":0,"_uiSetHeight:975":0,"_uiSetWidth:987":0,"_uiSetDim:997":0,"_uiSetVisible:1008":0,"_uiSetDisabled:1019":0,"_uiSetFocused:1032":0,"_uiSetTabIndex:1052":0,"_onDocMouseDown:1069":0,"_onDocFocus:1082":0,"toString:1107":0,"_guid:1151":0,"_validTabIndex:1160":0,"_bindAttrUI:1171":0,"_syncAttrUI:1187":0,"_setAttrUI:1200":0,"_strSetter:1215":0,"getString:1227":0,"getStrings:1239":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-base/widget-base.js"].coveredLines = 191;
_yuitest_coverage["build/widget-base/widget-base.js"].coveredFunctions = 52;
_yuitest_coverline("build/widget-base/widget-base.js", 1);
YUI.add('widget-base', function (Y, NAME) {

/**
 * Provides the base Widget class, with HTML Parser support
 *
 * @module widget
 * @main widget
 */

/**
 * Provides the base Widget class
 *
 * @module widget
 * @submodule widget-base
 */
_yuitest_coverfunc("build/widget-base/widget-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-base/widget-base.js", 16);
var L = Y.Lang,
    Node = Y.Node,

    ClassNameManager = Y.ClassNameManager,

    _getClassName = ClassNameManager.getClassName,
    _getWidgetClassName,

    _toInitialCap = Y.cached(function(str) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "(anonymous 2)", 24);
_yuitest_coverline("build/widget-base/widget-base.js", 25);
return str.substring(0, 1).toUpperCase() + str.substring(1);
    }),

    // K-Weight, IE GC optimizations
    CONTENT = "content",
    VISIBLE = "visible",
    HIDDEN = "hidden",
    DISABLED = "disabled",
    FOCUSED = "focused",
    WIDTH = "width",
    HEIGHT = "height",
    BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    PARENT_NODE = "parentNode",
    OWNER_DOCUMENT = "ownerDocument",
    AUTO = "auto",
    SRC_NODE = "srcNode",
    BODY = "body",
    TAB_INDEX = "tabIndex",
    ID = "id",
    RENDER = "render",
    RENDERED = "rendered",
    DESTROYED = "destroyed",
    STRINGS = "strings",
    DIV = "<div></div>",
    CHANGE = "Change",
    LOADING = "loading",

    _UISET = "_uiSet",

    EMPTY_STR = "",
    EMPTY_FN = function() {},

    TRUE = true,
    FALSE = false,

    UI,
    ATTRS = {},
    UI_ATTRS = [VISIBLE, DISABLED, HEIGHT, WIDTH, FOCUSED, TAB_INDEX],

    WEBKIT = Y.UA.webkit,

    // Widget nodeid-to-instance map.
    _instances = {};

/**
 * A base class for widgets, providing:
 * <ul>
 *    <li>The render lifecycle method, in addition to the init and destroy
 *        lifecycle methods provide by Base</li>
 *    <li>Abstract methods to support consistent MVC structure across
 *        widgets: renderer, renderUI, bindUI, syncUI</li>
 *    <li>Support for common widget attributes, such as boundingBox, contentBox, visible,
 *        disabled, focused, strings</li>
 * </ul>
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class Widget
 * @constructor
 * @extends Base
 */
_yuitest_coverline("build/widget-base/widget-base.js", 87);
function Widget(config) {

    // kweight
    _yuitest_coverfunc("build/widget-base/widget-base.js", "Widget", 87);
_yuitest_coverline("build/widget-base/widget-base.js", 90);
var widget = this,
        parentNode,
        render,
        constructor = widget.constructor;

    _yuitest_coverline("build/widget-base/widget-base.js", 95);
widget._strs = {};
    _yuitest_coverline("build/widget-base/widget-base.js", 96);
widget._cssPrefix = constructor.CSS_PREFIX || _getClassName(constructor.NAME.toLowerCase());

    // We need a config for HTML_PARSER to work.
    _yuitest_coverline("build/widget-base/widget-base.js", 99);
config = config || {};

    _yuitest_coverline("build/widget-base/widget-base.js", 101);
Widget.superclass.constructor.call(widget, config);

    _yuitest_coverline("build/widget-base/widget-base.js", 103);
render = widget.get(RENDER);

    _yuitest_coverline("build/widget-base/widget-base.js", 105);
if (render) {
        // Render could be a node or boolean
        _yuitest_coverline("build/widget-base/widget-base.js", 107);
if (render !== TRUE) {
            _yuitest_coverline("build/widget-base/widget-base.js", 108);
parentNode = render;
        }
        _yuitest_coverline("build/widget-base/widget-base.js", 110);
widget.render(parentNode);
    }
}

/**
 * Static property provides a string to identify the class.
 * <p>
 * Currently used to apply class identifiers to the bounding box
 * and to classify events fired by the widget.
 * </p>
 *
 * @property NAME
 * @type String
 * @static
 */
_yuitest_coverline("build/widget-base/widget-base.js", 125);
Widget.NAME = "widget";

/**
 * Constant used to identify state changes originating from
 * the DOM (as opposed to the JavaScript model).
 *
 * @property UI_SRC
 * @type String
 * @static
 * @final
 */
_yuitest_coverline("build/widget-base/widget-base.js", 136);
UI = Widget.UI_SRC = "ui";

/**
 * Static property used to define the default attribute
 * configuration for the Widget.
 *
 * @property ATTRS
 * @type Object
 * @static
 */
_yuitest_coverline("build/widget-base/widget-base.js", 146);
Widget.ATTRS = ATTRS;

// Trying to optimize kweight by setting up attrs this way saves about 0.4K min'd

/**
 * @attribute id
 * @writeOnce
 * @default Generated using guid()
 * @type String
 */

_yuitest_coverline("build/widget-base/widget-base.js", 157);
ATTRS[ID] = {
    valueFn: "_guid",
    writeOnce: TRUE
};

/**
 * Flag indicating whether or not this Widget
 * has been through the render lifecycle phase.
 *
 * @attribute rendered
 * @readOnly
 * @default false
 * @type boolean
 */
_yuitest_coverline("build/widget-base/widget-base.js", 171);
ATTRS[RENDERED] = {
    value:FALSE,
    readOnly: TRUE
};

/**
 * @attribute boundingBox
 * @description The outermost DOM node for the Widget, used for sizing and positioning
 * of a Widget as well as a containing element for any decorator elements used
 * for skinning.
 * @type String | Node
 * @writeOnce
 */
_yuitest_coverline("build/widget-base/widget-base.js", 184);
ATTRS[BOUNDING_BOX] = {
    value:null,
    setter: "_setBB",
    writeOnce: TRUE
};

/**
 * @attribute contentBox
 * @description A DOM node that is a direct descendant of a Widget's bounding box that
 * houses its content.
 * @type String | Node
 * @writeOnce
 */
_yuitest_coverline("build/widget-base/widget-base.js", 197);
ATTRS[CONTENT_BOX] = {
    valueFn:"_defaultCB",
    setter: "_setCB",
    writeOnce: TRUE
};

/**
 * @attribute tabIndex
 * @description Number (between -32767 to 32767) indicating the widget's
 * position in the default tab flow.  The value is used to set the
 * "tabIndex" attribute on the widget's bounding box.  Negative values allow
 * the widget to receive DOM focus programmatically (by calling the focus
 * method), while being removed from the default tab flow.  A value of
 * null removes the "tabIndex" attribute from the widget's bounding box.
 * @type Number
 * @default null
 */
_yuitest_coverline("build/widget-base/widget-base.js", 214);
ATTRS[TAB_INDEX] = {
    value: null,
    validator: "_validTabIndex"
};

/**
 * @attribute focused
 * @description Boolean indicating if the Widget, or one of its descendants,
 * has focus.
 * @readOnly
 * @default false
 * @type boolean
 */
_yuitest_coverline("build/widget-base/widget-base.js", 227);
ATTRS[FOCUSED] = {
    value: FALSE,
    readOnly:TRUE
};

/**
 * @attribute disabled
 * @description Boolean indicating if the Widget should be disabled. The disabled implementation
 * is left to the specific classes extending widget.
 * @default false
 * @type boolean
 */
_yuitest_coverline("build/widget-base/widget-base.js", 239);
ATTRS[DISABLED] = {
    value: FALSE
};

/**
 * @attribute visible
 * @description Boolean indicating whether or not the Widget is visible.
 * @default TRUE
 * @type boolean
 */
_yuitest_coverline("build/widget-base/widget-base.js", 249);
ATTRS[VISIBLE] = {
    value: TRUE
};

/**
 * @attribute height
 * @description String with units, or number, representing the height of the Widget. If a number is provided,
 * the default unit, defined by the Widgets DEF_UNIT, property is used.
 * @default EMPTY_STR
 * @type {String | Number}
 */
_yuitest_coverline("build/widget-base/widget-base.js", 260);
ATTRS[HEIGHT] = {
    value: EMPTY_STR
};

/**
 * @attribute width
 * @description String with units, or number, representing the width of the Widget. If a number is provided,
 * the default unit, defined by the Widgets DEF_UNIT, property is used.
 * @default EMPTY_STR
 * @type {String | Number}
 */
_yuitest_coverline("build/widget-base/widget-base.js", 271);
ATTRS[WIDTH] = {
    value: EMPTY_STR
};

/**
 * @attribute strings
 * @description Collection of strings used to label elements of the Widget's UI.
 * @default null
 * @type Object
 */
_yuitest_coverline("build/widget-base/widget-base.js", 281);
ATTRS[STRINGS] = {
    value: {},
    setter: "_strSetter",
    getter: "_strGetter"
};

/**
 * Whether or not to render the widget automatically after init, and optionally, to which parent node.
 *
 * @attribute render
 * @type boolean | Node
 * @writeOnce
 */
_yuitest_coverline("build/widget-base/widget-base.js", 294);
ATTRS[RENDER] = {
    value:FALSE,
    writeOnce:TRUE
};

/**
 * The css prefix which the static Widget.getClassName method should use when constructing class names
 *
 * @property CSS_PREFIX
 * @type String
 * @default Widget.NAME.toLowerCase()
 * @private
 * @static
 */
_yuitest_coverline("build/widget-base/widget-base.js", 308);
Widget.CSS_PREFIX = _getClassName(Widget.NAME.toLowerCase());

/**
 * Generate a standard prefixed classname for the Widget, prefixed by the default prefix defined
 * by the <code>Y.config.classNamePrefix</code> attribute used by <code>ClassNameManager</code> and
 * <code>Widget.NAME.toLowerCase()</code> (e.g. "yui-widget-xxxxx-yyyyy", based on default values for
 * the prefix and widget class name).
 * <p>
 * The instance based version of this method can be used to generate standard prefixed classnames,
 * based on the instances NAME, as opposed to Widget.NAME. This method should be used when you
 * need to use a constant class name across different types instances.
 * </p>
 * @method getClassName
 * @param {String*} args* 0..n strings which should be concatenated, using the default separator defined by ClassNameManager, to create the class name
 */
_yuitest_coverline("build/widget-base/widget-base.js", 323);
Widget.getClassName = function() {
    // arguments needs to be array'fied to concat
    _yuitest_coverfunc("build/widget-base/widget-base.js", "getClassName", 323);
_yuitest_coverline("build/widget-base/widget-base.js", 325);
return _getClassName.apply(ClassNameManager, [Widget.CSS_PREFIX].concat(Y.Array(arguments), true));
};

_yuitest_coverline("build/widget-base/widget-base.js", 328);
_getWidgetClassName = Widget.getClassName;

/**
 * Returns the widget instance whose bounding box contains, or is, the given node.
 * <p>
 * In the case of nested widgets, the nearest bounding box ancestor is used to
 * return the widget instance.
 * </p>
 * @method getByNode
 * @static
 * @param node {Node | String} The node for which to return a Widget instance. If a selector
 * string is passed in, which selects more than one node, the first node found is used.
 * @return {Widget} Widget instance, or null if not found.
 */
_yuitest_coverline("build/widget-base/widget-base.js", 342);
Widget.getByNode = function(node) {
    _yuitest_coverfunc("build/widget-base/widget-base.js", "getByNode", 342);
_yuitest_coverline("build/widget-base/widget-base.js", 343);
var widget,
        widgetMarker = _getWidgetClassName();

    _yuitest_coverline("build/widget-base/widget-base.js", 346);
node = Node.one(node);
    _yuitest_coverline("build/widget-base/widget-base.js", 347);
if (node) {
        _yuitest_coverline("build/widget-base/widget-base.js", 348);
node = node.ancestor("." + widgetMarker, true);
        _yuitest_coverline("build/widget-base/widget-base.js", 349);
if (node) {
            _yuitest_coverline("build/widget-base/widget-base.js", 350);
widget = _instances[Y.stamp(node, true)];
        }
    }

    _yuitest_coverline("build/widget-base/widget-base.js", 354);
return widget || null;
};

_yuitest_coverline("build/widget-base/widget-base.js", 357);
Y.extend(Widget, Y.Base, {

    /**
     * Returns a class name prefixed with the the value of the
     * <code>YUI.config.classNamePrefix</code> attribute + the instances <code>NAME</code> property.
     * Uses <code>YUI.config.classNameDelimiter</code> attribute to delimit the provided strings.
     * e.g.
     * <code>
     * <pre>
     *    // returns "yui-slider-foo-bar", for a slider instance
     *    var scn = slider.getClassName('foo','bar');
     *
     *    // returns "yui-overlay-foo-bar", for an overlay instance
     *    var ocn = overlay.getClassName('foo','bar');
     * </pre>
     * </code>
     *
     * @method getClassName
     * @param {String}+ One or more classname bits to be joined and prefixed
     */
    getClassName: function () {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "getClassName", 377);
_yuitest_coverline("build/widget-base/widget-base.js", 378);
return _getClassName.apply(ClassNameManager, [this._cssPrefix].concat(Y.Array(arguments), true));
    },

    /**
     * Initializer lifecycle implementation for the Widget class. Registers the
     * widget instance, and runs through the Widget's HTML_PARSER definition.
     *
     * @method initializer
     * @protected
     * @param  config {Object} Configuration object literal for the widget
     */
    initializer: function(config) {

        _yuitest_coverfunc("build/widget-base/widget-base.js", "initializer", 389);
_yuitest_coverline("build/widget-base/widget-base.js", 391);
var bb = this.get(BOUNDING_BOX);

        _yuitest_coverline("build/widget-base/widget-base.js", 393);
if (bb instanceof Node) {
            _yuitest_coverline("build/widget-base/widget-base.js", 394);
this._mapInstance(Y.stamp(bb));
        }

        /**
         * Notification event, which widget implementations can fire, when
         * they change the content of the widget. This event has no default
         * behavior and cannot be prevented, so the "on" or "after"
         * moments are effectively equivalent (with on listeners being invoked before
         * after listeners).
         *
         * @event widget:contentUpdate
         * @preventable false
         * @param {EventFacade} e The Event Facade
         */
    },

    /**
     * Utility method used to add an entry to the boundingBox id to instance map.
     *
     * This method can be used to populate the instance with lazily created boundingBox Node references.
     *
     * @method _mapInstance
     * @param {String} The boundingBox id
     * @protected
     */
    _mapInstance : function(id) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_mapInstance", 419);
_yuitest_coverline("build/widget-base/widget-base.js", 420);
_instances[id] = this;
    },

    /**
     * Destructor lifecycle implementation for the Widget class. Purges events attached
     * to the bounding box and content box, removes them from the DOM and removes
     * the Widget from the list of registered widgets.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {

        _yuitest_coverfunc("build/widget-base/widget-base.js", "destructor", 431);
_yuitest_coverline("build/widget-base/widget-base.js", 433);
var boundingBox = this.get(BOUNDING_BOX),
            bbGuid;

        _yuitest_coverline("build/widget-base/widget-base.js", 436);
if (boundingBox instanceof Node) {
            _yuitest_coverline("build/widget-base/widget-base.js", 437);
bbGuid = Y.stamp(boundingBox,true);

            _yuitest_coverline("build/widget-base/widget-base.js", 439);
if (bbGuid in _instances) {
                _yuitest_coverline("build/widget-base/widget-base.js", 440);
delete _instances[bbGuid];
            }

            _yuitest_coverline("build/widget-base/widget-base.js", 443);
this._destroyBox();
        }
    },

    /**
     * <p>
     * Destroy lifecycle method. Fires the destroy
     * event, prior to invoking destructors for the
     * class hierarchy.
     *
     * Overrides Base's implementation, to support arguments to destroy
     * </p>
     * <p>
     * Subscribers to the destroy
     * event can invoke preventDefault on the event object, to prevent destruction
     * from proceeding.
     * </p>
     * @method destroy
     * @param destroyAllNodes {Boolean} If true, all nodes contained within the Widget are
     * removed and destroyed. Defaults to false due to potentially high run-time cost.
     * @return {Widget} A reference to this object
     * @chainable
     */
    destroy: function(destroyAllNodes) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "destroy", 466);
_yuitest_coverline("build/widget-base/widget-base.js", 467);
this._destroyAllNodes = destroyAllNodes;
        _yuitest_coverline("build/widget-base/widget-base.js", 468);
return Widget.superclass.destroy.apply(this);
    },

    /**
     * Removes and destroys the widgets rendered boundingBox, contentBox,
     * and detaches bound UI events.
     *
     * @method _destroyBox
     * @protected
     */
    _destroyBox : function() {

        _yuitest_coverfunc("build/widget-base/widget-base.js", "_destroyBox", 478);
_yuitest_coverline("build/widget-base/widget-base.js", 480);
var boundingBox = this.get(BOUNDING_BOX),
            contentBox = this.get(CONTENT_BOX),
            deep = this._destroyAllNodes,
            same;

        _yuitest_coverline("build/widget-base/widget-base.js", 485);
same = boundingBox && boundingBox.compareTo(contentBox);

        _yuitest_coverline("build/widget-base/widget-base.js", 487);
if (this.UI_EVENTS) {
            _yuitest_coverline("build/widget-base/widget-base.js", 488);
this._destroyUIEvents();
        }

        _yuitest_coverline("build/widget-base/widget-base.js", 491);
this._unbindUI(boundingBox);

        _yuitest_coverline("build/widget-base/widget-base.js", 493);
if (contentBox) {
            _yuitest_coverline("build/widget-base/widget-base.js", 494);
if (deep) {
                _yuitest_coverline("build/widget-base/widget-base.js", 495);
contentBox.empty();
            }
            _yuitest_coverline("build/widget-base/widget-base.js", 497);
contentBox.remove(TRUE);
        }

        _yuitest_coverline("build/widget-base/widget-base.js", 500);
if (!same) {
            _yuitest_coverline("build/widget-base/widget-base.js", 501);
if (deep) {
                _yuitest_coverline("build/widget-base/widget-base.js", 502);
boundingBox.empty();
            }
            _yuitest_coverline("build/widget-base/widget-base.js", 504);
boundingBox.remove(TRUE);
        }
    },

    /**
     * Establishes the initial DOM for the widget. Invoking this
     * method will lead to the creating of all DOM elements for
     * the widget (or the manipulation of existing DOM elements
     * for the progressive enhancement use case).
     * <p>
     * This method should only be invoked once for an initialized
     * widget.
     * </p>
     * <p>
     * It delegates to the widget specific renderer method to do
     * the actual work.
     * </p>
     *
     * @method render
     * @chainable
     * @final
     * @param  parentNode {Object | String} Optional. The Node under which the
     * Widget is to be rendered. This can be a Node instance or a CSS selector string.
     * <p>
     * If the selector string returns more than one Node, the first node will be used
     * as the parentNode. NOTE: This argument is required if both the boundingBox and contentBox
     * are not currently in the document. If it's not provided, the Widget will be rendered
     * to the body of the current document in this case.
     * </p>
     */
    render: function(parentNode) {

        _yuitest_coverfunc("build/widget-base/widget-base.js", "render", 534);
_yuitest_coverline("build/widget-base/widget-base.js", 536);
if (!this.get(DESTROYED) && !this.get(RENDERED)) {
             /**
              * Lifecycle event for the render phase, fired prior to rendering the UI
              * for the widget (prior to invoking the widget's renderer method).
              * <p>
              * Subscribers to the "on" moment of this event, will be notified
              * before the widget is rendered.
              * </p>
              * <p>
              * Subscribers to the "after" moment of this event, will be notified
              * after rendering is complete.
              * </p>
              *
              * @event render
              * @preventable _defRenderFn
              * @param {EventFacade} e The Event Facade
              */
            _yuitest_coverline("build/widget-base/widget-base.js", 553);
this.publish(RENDER, {
                queuable:FALSE,
                fireOnce:TRUE,
                defaultTargetOnly:TRUE,
                defaultFn: this._defRenderFn
            });

            _yuitest_coverline("build/widget-base/widget-base.js", 560);
this.fire(RENDER, {parentNode: (parentNode) ? Node.one(parentNode) : null});
        }
        _yuitest_coverline("build/widget-base/widget-base.js", 562);
return this;
    },

    /**
     * Default render handler
     *
     * @method _defRenderFn
     * @protected
     * @param {EventFacade} e The Event object
     * @param {Node} parentNode The parent node to render to, if passed in to the <code>render</code> method
     */
    _defRenderFn : function(e) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_defRenderFn", 573);
_yuitest_coverline("build/widget-base/widget-base.js", 574);
this._parentNode = e.parentNode;

        _yuitest_coverline("build/widget-base/widget-base.js", 576);
this.renderer();
        _yuitest_coverline("build/widget-base/widget-base.js", 577);
this._set(RENDERED, TRUE);

        _yuitest_coverline("build/widget-base/widget-base.js", 579);
this._removeLoadingClassNames();
    },

    /**
     * Creates DOM (or manipulates DOM for progressive enhancement)
     * This method is invoked by render() and is not chained
     * automatically for the class hierarchy (unlike initializer, destructor)
     * so it should be chained manually for subclasses if required.
     *
     * @method renderer
     * @protected
     */
    renderer: function() {
        // kweight
        _yuitest_coverfunc("build/widget-base/widget-base.js", "renderer", 591);
_yuitest_coverline("build/widget-base/widget-base.js", 593);
var widget = this;

        _yuitest_coverline("build/widget-base/widget-base.js", 595);
widget._renderUI();
        _yuitest_coverline("build/widget-base/widget-base.js", 596);
widget.renderUI();

        _yuitest_coverline("build/widget-base/widget-base.js", 598);
widget._bindUI();
        _yuitest_coverline("build/widget-base/widget-base.js", 599);
widget.bindUI();

        _yuitest_coverline("build/widget-base/widget-base.js", 601);
widget._syncUI();
        _yuitest_coverline("build/widget-base/widget-base.js", 602);
widget.syncUI();
    },

    /**
     * Configures/Sets up listeners to bind Widget State to UI/DOM
     *
     * This method is not called by framework and is not chained
     * automatically for the class hierarchy.
     *
     * @method bindUI
     * @protected
     */
    bindUI: EMPTY_FN,

    /**
     * Adds nodes to the DOM
     *
     * This method is not called by framework and is not chained
     * automatically for the class hierarchy.
     *
     * @method renderUI
     * @protected
     */
    renderUI: EMPTY_FN,

    /**
     * Refreshes the rendered UI, based on Widget State
     *
     * This method is not called by framework and is not chained
     * automatically for the class hierarchy.
     *
     * @method syncUI
     * @protected
     *
     */
    syncUI: EMPTY_FN,

    /**
     * @method hide
     * @description Hides the Widget by setting the "visible" attribute to "false".
     * @chainable
     */
    hide: function() {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "hide", 644);
_yuitest_coverline("build/widget-base/widget-base.js", 645);
return this.set(VISIBLE, FALSE);
    },

    /**
     * @method show
     * @description Shows the Widget by setting the "visible" attribute to "true".
     * @chainable
     */
    show: function() {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "show", 653);
_yuitest_coverline("build/widget-base/widget-base.js", 654);
return this.set(VISIBLE, TRUE);
    },

    /**
     * @method focus
     * @description Causes the Widget to receive the focus by setting the "focused"
     * attribute to "true".
     * @chainable
     */
    focus: function () {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "focus", 663);
_yuitest_coverline("build/widget-base/widget-base.js", 664);
return this._set(FOCUSED, TRUE);
    },

    /**
     * @method blur
     * @description Causes the Widget to lose focus by setting the "focused" attribute
     * to "false"
     * @chainable
     */
    blur: function () {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "blur", 673);
_yuitest_coverline("build/widget-base/widget-base.js", 674);
return this._set(FOCUSED, FALSE);
    },

    /**
     * @method enable
     * @description Set the Widget's "disabled" attribute to "false".
     * @chainable
     */
    enable: function() {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "enable", 682);
_yuitest_coverline("build/widget-base/widget-base.js", 683);
return this.set(DISABLED, FALSE);
    },

    /**
     * @method disable
     * @description Set the Widget's "disabled" attribute to "true".
     * @chainable
     */
    disable: function() {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "disable", 691);
_yuitest_coverline("build/widget-base/widget-base.js", 692);
return this.set(DISABLED, TRUE);
    },

    /**
     * @method _uiSizeCB
     * @protected
     * @param {boolean} expand
     */
    _uiSizeCB : function(expand) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_uiSizeCB", 700);
_yuitest_coverline("build/widget-base/widget-base.js", 701);
this.get(CONTENT_BOX).toggleClass(_getWidgetClassName(CONTENT, "expanded"), expand);
    },

    /**
     * Helper method to collect the boundingBox and contentBox and append to the provided parentNode, if not
     * already a child. The owner document of the boundingBox, or the owner document of the contentBox will be used
     * as the document into which the Widget is rendered if a parentNode is node is not provided. If both the boundingBox and
     * the contentBox are not currently in the document, and no parentNode is provided, the widget will be rendered
     * to the current document's body.
     *
     * @method _renderBox
     * @private
     * @param {Node} parentNode The parentNode to render the widget to. If not provided, and both the boundingBox and
     * the contentBox are not currently in the document, the widget will be rendered to the current document's body.
     */
    _renderBox: function(parentNode) {

        // TODO: Performance Optimization [ More effective algo to reduce Node refs, compares, replaces? ]

        _yuitest_coverfunc("build/widget-base/widget-base.js", "_renderBox", 716);
_yuitest_coverline("build/widget-base/widget-base.js", 720);
var widget = this, // kweight
            contentBox = widget.get(CONTENT_BOX),
            boundingBox = widget.get(BOUNDING_BOX),
            srcNode = widget.get(SRC_NODE),
            defParentNode = widget.DEF_PARENT_NODE,

            doc = (srcNode && srcNode.get(OWNER_DOCUMENT)) || boundingBox.get(OWNER_DOCUMENT) || contentBox.get(OWNER_DOCUMENT);

        // If srcNode (assume it's always in doc), have contentBox take its place (widget render responsible for re-use of srcNode contents)
        _yuitest_coverline("build/widget-base/widget-base.js", 729);
if (srcNode && !srcNode.compareTo(contentBox) && !contentBox.inDoc(doc)) {
            _yuitest_coverline("build/widget-base/widget-base.js", 730);
srcNode.replace(contentBox);
        }

        _yuitest_coverline("build/widget-base/widget-base.js", 733);
if (!boundingBox.compareTo(contentBox.get(PARENT_NODE)) && !boundingBox.compareTo(contentBox)) {
            // If contentBox box is already in the document, have boundingBox box take it's place
            _yuitest_coverline("build/widget-base/widget-base.js", 735);
if (contentBox.inDoc(doc)) {
                _yuitest_coverline("build/widget-base/widget-base.js", 736);
contentBox.replace(boundingBox);
            }
            _yuitest_coverline("build/widget-base/widget-base.js", 738);
boundingBox.appendChild(contentBox);
        }

        _yuitest_coverline("build/widget-base/widget-base.js", 741);
parentNode = parentNode || (defParentNode && Node.one(defParentNode));

        _yuitest_coverline("build/widget-base/widget-base.js", 743);
if (parentNode) {
            _yuitest_coverline("build/widget-base/widget-base.js", 744);
parentNode.appendChild(boundingBox);
        } else {_yuitest_coverline("build/widget-base/widget-base.js", 745);
if (!boundingBox.inDoc(doc)) {
            _yuitest_coverline("build/widget-base/widget-base.js", 746);
Node.one(BODY).insert(boundingBox, 0);
        }}
    },

    /**
     * Setter for the boundingBox attribute
     *
     * @method _setBB
     * @private
     * @param Node/String
     * @return Node
     */
    _setBB: function(node) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_setBB", 758);
_yuitest_coverline("build/widget-base/widget-base.js", 759);
return this._setBox(this.get(ID), node, this.BOUNDING_TEMPLATE, true);
    },

    /**
     * Setter for the contentBox attribute
     *
     * @method _setCB
     * @private
     * @param {Node|String} node
     * @return Node
     */
    _setCB: function(node) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_setCB", 770);
_yuitest_coverline("build/widget-base/widget-base.js", 771);
return (this.CONTENT_TEMPLATE === null) ? this.get(BOUNDING_BOX) : this._setBox(null, node, this.CONTENT_TEMPLATE, false);
    },

    /**
     * Returns the default value for the contentBox attribute.
     *
     * For the Widget class, this will be the srcNode if provided, otherwise null (resulting in
     * a new contentBox node instance being created)
     *
     * @method _defaultCB
     * @protected
     */
    _defaultCB : function(node) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_defaultCB", 783);
_yuitest_coverline("build/widget-base/widget-base.js", 784);
return this.get(SRC_NODE) || null;
    },

    /**
     * Helper method to set the bounding/content box, or create it from
     * the provided template if not found.
     *
     * @method _setBox
     * @private
     *
     * @param {String} id The node's id attribute
     * @param {Node|String} node The node reference
     * @param {String} template HTML string template for the node
     * @param {boolean} true if this is the boundingBox, false if it's the contentBox
     * @return {Node} The node
     */
    _setBox : function(id, node, template, isBounding) {

        _yuitest_coverfunc("build/widget-base/widget-base.js", "_setBox", 800);
_yuitest_coverline("build/widget-base/widget-base.js", 802);
node = Node.one(node);

        _yuitest_coverline("build/widget-base/widget-base.js", 804);
if (!node) {
            _yuitest_coverline("build/widget-base/widget-base.js", 805);
node = Node.create(template);

            _yuitest_coverline("build/widget-base/widget-base.js", 807);
if (isBounding) {
                _yuitest_coverline("build/widget-base/widget-base.js", 808);
this._bbFromTemplate = true;
            } else {
                _yuitest_coverline("build/widget-base/widget-base.js", 810);
this._cbFromTemplate = true;
            }
        }

        _yuitest_coverline("build/widget-base/widget-base.js", 814);
if (!node.get(ID)) {
            _yuitest_coverline("build/widget-base/widget-base.js", 815);
node.set(ID, id || Y.guid());
        }

        _yuitest_coverline("build/widget-base/widget-base.js", 818);
return node;
    },

    /**
     * Initializes the UI state for the Widget's bounding/content boxes.
     *
     * @method _renderUI
     * @protected
     */
    _renderUI: function() {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_renderUI", 827);
_yuitest_coverline("build/widget-base/widget-base.js", 828);
this._renderBoxClassNames();
        _yuitest_coverline("build/widget-base/widget-base.js", 829);
this._renderBox(this._parentNode);
    },

    /**
     * Applies standard class names to the boundingBox and contentBox
     *
     * @method _renderBoxClassNames
     * @protected
     */
    _renderBoxClassNames : function() {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_renderBoxClassNames", 838);
_yuitest_coverline("build/widget-base/widget-base.js", 839);
var classes = this._getClasses(),
            cl,
            boundingBox = this.get(BOUNDING_BOX),
            i;

        _yuitest_coverline("build/widget-base/widget-base.js", 844);
boundingBox.addClass(_getWidgetClassName());

        // Start from Widget Sub Class
        _yuitest_coverline("build/widget-base/widget-base.js", 847);
for (i = classes.length-3; i >= 0; i--) {
            _yuitest_coverline("build/widget-base/widget-base.js", 848);
cl = classes[i];
            _yuitest_coverline("build/widget-base/widget-base.js", 849);
boundingBox.addClass(cl.CSS_PREFIX || _getClassName(cl.NAME.toLowerCase()));
        }

        // Use instance based name for content box
        _yuitest_coverline("build/widget-base/widget-base.js", 853);
this.get(CONTENT_BOX).addClass(this.getClassName(CONTENT));
    },

    /**
     * Removes class names representative of the widget's loading state from
     * the boundingBox.
     *
     * @method _removeLoadingClassNames
     * @protected
     */
    _removeLoadingClassNames: function () {

        _yuitest_coverfunc("build/widget-base/widget-base.js", "_removeLoadingClassNames", 863);
_yuitest_coverline("build/widget-base/widget-base.js", 865);
var boundingBox = this.get(BOUNDING_BOX),
            contentBox = this.get(CONTENT_BOX),
            instClass = this.getClassName(LOADING),
            widgetClass = _getWidgetClassName(LOADING);

        _yuitest_coverline("build/widget-base/widget-base.js", 870);
boundingBox.removeClass(widgetClass)
                   .removeClass(instClass);

        _yuitest_coverline("build/widget-base/widget-base.js", 873);
contentBox.removeClass(widgetClass)
                  .removeClass(instClass);
    },

    /**
     * Sets up DOM and CustomEvent listeners for the widget.
     *
     * @method _bindUI
     * @protected
     */
    _bindUI: function() {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_bindUI", 883);
_yuitest_coverline("build/widget-base/widget-base.js", 884);
this._bindAttrUI(this._UI_ATTRS.BIND);
        _yuitest_coverline("build/widget-base/widget-base.js", 885);
this._bindDOM();
    },

    /**
     * @method _unbindUI
     * @protected
     */
    _unbindUI : function(boundingBox) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_unbindUI", 892);
_yuitest_coverline("build/widget-base/widget-base.js", 893);
this._unbindDOM(boundingBox);
    },

    /**
     * Sets up DOM listeners, on elements rendered by the widget.
     *
     * @method _bindDOM
     * @protected
     */
    _bindDOM : function() {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_bindDOM", 902);
_yuitest_coverline("build/widget-base/widget-base.js", 903);
var oDocument = this.get(BOUNDING_BOX).get(OWNER_DOCUMENT),
            focusHandle = Widget._hDocFocus;

        // Shared listener across all Widgets.
        _yuitest_coverline("build/widget-base/widget-base.js", 907);
if (!focusHandle) {
            _yuitest_coverline("build/widget-base/widget-base.js", 908);
focusHandle = Widget._hDocFocus = oDocument.on("focus", this._onDocFocus, this);
            _yuitest_coverline("build/widget-base/widget-base.js", 909);
focusHandle.listeners = {
                count: 0
            };
        }

        _yuitest_coverline("build/widget-base/widget-base.js", 914);
focusHandle.listeners[Y.stamp(this, true)] = true;
        _yuitest_coverline("build/widget-base/widget-base.js", 915);
focusHandle.listeners.count++;

        //	Fix for Webkit:
        //	Document doesn't receive focus in Webkit when the user mouses
        //	down on it, so the "focused" attribute won't get set to the
        //	correct value. Keeping this instance based for now, potential better performance.
        //  Otherwise we'll end up looking up widgets from the DOM on every mousedown.
        _yuitest_coverline("build/widget-base/widget-base.js", 922);
if (WEBKIT){
            _yuitest_coverline("build/widget-base/widget-base.js", 923);
this._hDocMouseDown = oDocument.on("mousedown", this._onDocMouseDown, this);
        }
    },

    /**
     * @method _unbindDOM
     * @protected
     */
    _unbindDOM : function(boundingBox) {

        _yuitest_coverfunc("build/widget-base/widget-base.js", "_unbindDOM", 931);
_yuitest_coverline("build/widget-base/widget-base.js", 933);
var focusHandle = Widget._hDocFocus,
            yuid = Y.stamp(this, true),
            focusListeners,
            mouseHandle = this._hDocMouseDown;

        _yuitest_coverline("build/widget-base/widget-base.js", 938);
if (focusHandle) {

            _yuitest_coverline("build/widget-base/widget-base.js", 940);
focusListeners = focusHandle.listeners;

            _yuitest_coverline("build/widget-base/widget-base.js", 942);
if (focusListeners[yuid]) {
                _yuitest_coverline("build/widget-base/widget-base.js", 943);
delete focusListeners[yuid];
                _yuitest_coverline("build/widget-base/widget-base.js", 944);
focusListeners.count--;
            }

            _yuitest_coverline("build/widget-base/widget-base.js", 947);
if (focusListeners.count === 0) {
                _yuitest_coverline("build/widget-base/widget-base.js", 948);
focusHandle.detach();
                _yuitest_coverline("build/widget-base/widget-base.js", 949);
Widget._hDocFocus = null;
            }
        }

        _yuitest_coverline("build/widget-base/widget-base.js", 953);
if (WEBKIT && mouseHandle) {
            _yuitest_coverline("build/widget-base/widget-base.js", 954);
mouseHandle.detach();
        }
    },

    /**
     * Updates the widget UI to reflect the attribute state.
     *
     * @method _syncUI
     * @protected
     */
    _syncUI: function() {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_syncUI", 964);
_yuitest_coverline("build/widget-base/widget-base.js", 965);
this._syncAttrUI(this._UI_ATTRS.SYNC);
    },

    /**
     * Sets the height on the widget's bounding box element
     *
     * @method _uiSetHeight
     * @protected
     * @param {String | Number} val
     */
    _uiSetHeight: function(val) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_uiSetHeight", 975);
_yuitest_coverline("build/widget-base/widget-base.js", 976);
this._uiSetDim(HEIGHT, val);
        _yuitest_coverline("build/widget-base/widget-base.js", 977);
this._uiSizeCB((val !== EMPTY_STR && val !== AUTO));
    },

    /**
     * Sets the width on the widget's bounding box element
     *
     * @method _uiSetWidth
     * @protected
     * @param {String | Number} val
     */
    _uiSetWidth: function(val) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_uiSetWidth", 987);
_yuitest_coverline("build/widget-base/widget-base.js", 988);
this._uiSetDim(WIDTH, val);
    },

    /**
     * @method _uiSetDim
     * @private
     * @param {String} dim The dimension - "width" or "height"
     * @param {Number | String} val The value to set
     */
    _uiSetDim: function(dimension, val) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_uiSetDim", 997);
_yuitest_coverline("build/widget-base/widget-base.js", 998);
this.get(BOUNDING_BOX).setStyle(dimension, L.isNumber(val) ? val + this.DEF_UNIT : val);
    },

    /**
     * Sets the visible state for the UI
     *
     * @method _uiSetVisible
     * @protected
     * @param {boolean} val
     */
    _uiSetVisible: function(val) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_uiSetVisible", 1008);
_yuitest_coverline("build/widget-base/widget-base.js", 1009);
this.get(BOUNDING_BOX).toggleClass(this.getClassName(HIDDEN), !val);
    },

    /**
     * Sets the disabled state for the UI
     *
     * @method _uiSetDisabled
     * @protected
     * @param {boolean} val
     */
    _uiSetDisabled: function(val) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_uiSetDisabled", 1019);
_yuitest_coverline("build/widget-base/widget-base.js", 1020);
this.get(BOUNDING_BOX).toggleClass(this.getClassName(DISABLED), val);
    },

    /**
     * Sets the focused state for the UI
     *
     * @method _uiSetFocused
     * @protected
     * @param {boolean} val
     * @param {string} src String representing the source that triggered an update to
     * the UI.
     */
    _uiSetFocused: function(val, src) {
         _yuitest_coverfunc("build/widget-base/widget-base.js", "_uiSetFocused", 1032);
_yuitest_coverline("build/widget-base/widget-base.js", 1033);
var boundingBox = this.get(BOUNDING_BOX);
         _yuitest_coverline("build/widget-base/widget-base.js", 1034);
boundingBox.toggleClass(this.getClassName(FOCUSED), val);

         _yuitest_coverline("build/widget-base/widget-base.js", 1036);
if (src !== UI) {
            _yuitest_coverline("build/widget-base/widget-base.js", 1037);
if (val) {
                _yuitest_coverline("build/widget-base/widget-base.js", 1038);
boundingBox.focus();
            } else {
                _yuitest_coverline("build/widget-base/widget-base.js", 1040);
boundingBox.blur();
            }
         }
    },

    /**
     * Set the tabIndex on the widget's rendered UI
     *
     * @method _uiSetTabIndex
     * @protected
     * @param Number
     */
    _uiSetTabIndex: function(index) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_uiSetTabIndex", 1052);
_yuitest_coverline("build/widget-base/widget-base.js", 1053);
var boundingBox = this.get(BOUNDING_BOX);

        _yuitest_coverline("build/widget-base/widget-base.js", 1055);
if (L.isNumber(index)) {
            _yuitest_coverline("build/widget-base/widget-base.js", 1056);
boundingBox.set(TAB_INDEX, index);
        } else {
            _yuitest_coverline("build/widget-base/widget-base.js", 1058);
boundingBox.removeAttribute(TAB_INDEX);
        }
    },

    /**
     * @method _onDocMouseDown
     * @description "mousedown" event handler for the owner document of the
     * widget's bounding box.
     * @protected
     * @param {EventFacade} evt The event facade for the DOM focus event
     */
    _onDocMouseDown: function (evt) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_onDocMouseDown", 1069);
_yuitest_coverline("build/widget-base/widget-base.js", 1070);
if (this._domFocus) {
            _yuitest_coverline("build/widget-base/widget-base.js", 1071);
this._onDocFocus(evt);
        }
    },

    /**
     * DOM focus event handler, used to sync the state of the Widget with the DOM
     *
     * @method _onDocFocus
     * @protected
     * @param {EventFacade} evt The event facade for the DOM focus event
     */
    _onDocFocus: function (evt) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_onDocFocus", 1082);
_yuitest_coverline("build/widget-base/widget-base.js", 1083);
var widget = Widget.getByNode(evt.target),
            activeWidget = Widget._active;

        _yuitest_coverline("build/widget-base/widget-base.js", 1086);
if (activeWidget && (activeWidget !== widget)) {
            _yuitest_coverline("build/widget-base/widget-base.js", 1087);
activeWidget._domFocus = false;
            _yuitest_coverline("build/widget-base/widget-base.js", 1088);
activeWidget._set(FOCUSED, false, {src:UI});

            _yuitest_coverline("build/widget-base/widget-base.js", 1090);
Widget._active = null;
        }

        _yuitest_coverline("build/widget-base/widget-base.js", 1093);
if (widget) {
            _yuitest_coverline("build/widget-base/widget-base.js", 1094);
widget._domFocus = true;
            _yuitest_coverline("build/widget-base/widget-base.js", 1095);
widget._set(FOCUSED, true, {src:UI});

            _yuitest_coverline("build/widget-base/widget-base.js", 1097);
Widget._active = widget;
        }
    },

    /**
     * Generic toString implementation for all widgets.
     *
     * @method toString
     * @return {String} The default string value for the widget [ displays the NAME of the instance, and the unique id ]
     */
    toString: function() {
        // Using deprecated name prop for kweight squeeze.
        _yuitest_coverfunc("build/widget-base/widget-base.js", "toString", 1107);
_yuitest_coverline("build/widget-base/widget-base.js", 1109);
return this.name + "[" + this.get(ID) + "]";
    },

    /**
     * Default unit to use for dimension values
     *
     * @property DEF_UNIT
     * @type String
     */
    DEF_UNIT : "px",

    /**
     * Default node to render the bounding box to. If not set,
     * will default to the current document body.
     *
     * @property DEF_PARENT_NODE
     * @type String | Node
     */
    DEF_PARENT_NODE : null,

    /**
     * Property defining the markup template for content box. If your Widget doesn't
     * need the dual boundingBox/contentBox structure, set CONTENT_TEMPLATE to null,
     * and contentBox and boundingBox will both point to the same Node.
     *
     * @property CONTENT_TEMPLATE
     * @type String
     */
    CONTENT_TEMPLATE : DIV,

    /**
     * Property defining the markup template for bounding box.
     *
     * @property BOUNDING_TEMPLATE
     * @type String
     */
    BOUNDING_TEMPLATE : DIV,

    /**
     * @method _guid
     * @protected
     */
    _guid : function() {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_guid", 1151);
_yuitest_coverline("build/widget-base/widget-base.js", 1152);
return Y.guid();
    },

    /**
     * @method _validTabIndex
     * @protected
     * @param {Number} tabIndex
     */
    _validTabIndex : function (tabIndex) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_validTabIndex", 1160);
_yuitest_coverline("build/widget-base/widget-base.js", 1161);
return (L.isNumber(tabIndex) || L.isNull(tabIndex));
    },

    /**
     * Binds after listeners for the list of attributes provided
     *
     * @method _bindAttrUI
     * @private
     * @param {Array} attrs
     */
    _bindAttrUI : function(attrs) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_bindAttrUI", 1171);
_yuitest_coverline("build/widget-base/widget-base.js", 1172);
var i,
            l = attrs.length;

        _yuitest_coverline("build/widget-base/widget-base.js", 1175);
for (i = 0; i < l; i++) {
            _yuitest_coverline("build/widget-base/widget-base.js", 1176);
this.after(attrs[i] + CHANGE, this._setAttrUI);
        }
    },

    /**
     * Invokes the _uiSet&#61;ATTR NAME&#62; method for the list of attributes provided
     *
     * @method _syncAttrUI
     * @private
     * @param {Array} attrs
     */
    _syncAttrUI : function(attrs) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_syncAttrUI", 1187);
_yuitest_coverline("build/widget-base/widget-base.js", 1188);
var i, l = attrs.length, attr;
        _yuitest_coverline("build/widget-base/widget-base.js", 1189);
for (i = 0; i < l; i++) {
            _yuitest_coverline("build/widget-base/widget-base.js", 1190);
attr = attrs[i];
            _yuitest_coverline("build/widget-base/widget-base.js", 1191);
this[_UISET + _toInitialCap(attr)](this.get(attr));
        }
    },

    /**
     * @method _setAttrUI
     * @private
     * @param {EventFacade} e
     */
    _setAttrUI : function(e) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_setAttrUI", 1200);
_yuitest_coverline("build/widget-base/widget-base.js", 1201);
if (e.target === this) {
            _yuitest_coverline("build/widget-base/widget-base.js", 1202);
this[_UISET + _toInitialCap(e.attrName)](e.newVal, e.src);
        }
    },

    /**
     * The default setter for the strings attribute. Merges partial sets
     * into the full string set, to allow users to partial sets of strings
     *
     * @method _strSetter
     * @protected
     * @param {Object} strings
     * @return {String} The full set of strings to set
     */
    _strSetter : function(strings) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "_strSetter", 1215);
_yuitest_coverline("build/widget-base/widget-base.js", 1216);
return Y.merge(this.get(STRINGS), strings);
    },

    /**
     * Helper method to get a specific string value
     *
     * @deprecated Used by deprecated WidgetLocale implementations.
     * @method getString
     * @param {String} key
     * @return {String} The string
     */
    getString : function(key) {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "getString", 1227);
_yuitest_coverline("build/widget-base/widget-base.js", 1228);
return this.get(STRINGS)[key];
    },

    /**
     * Helper method to get the complete set of strings for the widget
     *
     * @deprecated  Used by deprecated WidgetLocale implementations.
     * @method getStrings
     * @param {String} key
     * @return {String} The strings
     */
    getStrings : function() {
        _yuitest_coverfunc("build/widget-base/widget-base.js", "getStrings", 1239);
_yuitest_coverline("build/widget-base/widget-base.js", 1240);
return this.get(STRINGS);
    },

    /**
     * The lists of UI attributes to bind and sync for widget's _bindUI and _syncUI implementations
     *
     * @property _UI_ATTRS
     * @type Object
     * @private
     */
    _UI_ATTRS : {
        BIND: UI_ATTRS,
        SYNC: UI_ATTRS
    }
});

_yuitest_coverline("build/widget-base/widget-base.js", 1256);
Y.Widget = Widget;


}, '@VERSION@', {
    "requires": [
        "attribute",
        "base-base",
        "base-pluginhost",
        "classnamemanager",
        "event-focus",
        "node-base",
        "node-style"
    ],
    "skinnable": true
});
