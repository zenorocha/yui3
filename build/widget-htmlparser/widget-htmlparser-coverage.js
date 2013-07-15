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
_yuitest_coverage["build/widget-htmlparser/widget-htmlparser.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-htmlparser/widget-htmlparser.js",
    code: []
};
_yuitest_coverage["build/widget-htmlparser/widget-htmlparser.js"].code=["YUI.add('widget-htmlparser', function (Y, NAME) {","","/**"," * Adds HTML Parser support to the base Widget class"," *"," * @module widget"," * @submodule widget-htmlparser"," * @for Widget"," */","","var Widget = Y.Widget,","    Node = Y.Node,","    Lang = Y.Lang,","","    SRC_NODE = \"srcNode\",","    CONTENT_BOX = \"contentBox\";","","/**"," * Object hash, defining how attribute values are to be parsed from"," * markup contained in the widget's content box. e.g.:"," * <pre>"," *   {"," *       // Set single Node references using selector syntax"," *       // (selector is run through node.one)"," *       titleNode: \"span.yui-title\","," *       // Set NodeList references using selector syntax"," *       // (array indicates selector is to be run through node.all)"," *       listNodes: [\"li.yui-item\"],"," *       // Set other attribute types, using a parse function."," *       // Context is set to the widget instance."," *       label: function(contentBox) {"," *           return contentBox.one(\"span.title\").get(\"innerHTML\");"," *       }"," *   }"," * </pre>"," *"," * @property HTML_PARSER"," * @type Object"," * @static"," */","Widget.HTML_PARSER = {};","","/**"," * The build configuration for the Widget class."," * <p>"," * Defines the static fields which need to be aggregated,"," * when this class is used as the main class passed to"," * the <a href=\"Base.html#method_build\">Base.build</a> method."," * </p>"," * @property _buildCfg"," * @type Object"," * @static"," * @final"," * @private"," */","Widget._buildCfg = {","    aggregates : [\"HTML_PARSER\"]","};","","/**"," * The DOM node to parse for configuration values, passed to the Widget's HTML_PARSER definition"," *"," * @attribute srcNode"," * @type String | Node"," * @writeOnce"," */","Widget.ATTRS[SRC_NODE] = {","    value: null,","    setter: Node.one,","    getter: \"_getSrcNode\",","    writeOnce: true","};","","Y.mix(Widget.prototype, {","","    /**","     * @method _getSrcNode","     * @protected","     * @return {Node} The Node to apply HTML_PARSER to","     */","    _getSrcNode : function(val) {","        return val || this.get(CONTENT_BOX);","    },","","    /**","     * Implement the BaseCore _preAddAttrs method hook, to add","     * the srcNode and related attributes, so that HTML_PARSER","     * (which relies on `this.get(\"srcNode\")`) can merge in it's","     * results before the rest of the attributes are added.","     *","     * @method _preAddAttrs","     * @protected","     *","     * @param attrs {Object} The full hash of statically defined ATTRS","     * attributes being added for this instance","     *","     * @param userVals {Object} The hash of user values passed to","     * the constructor","     *","     * @param lazy {boolean} Whether or not to add the attributes lazily","     */","    _preAddAttrs : function(attrs, userVals, lazy) {","","        var preAttrs = {","            id : attrs.id,","            boundingBox : attrs.boundingBox,","            contentBox : attrs.contentBox,","            srcNode : attrs.srcNode","        };","","        this.addAttrs(preAttrs, userVals, lazy);","","        delete attrs.boundingBox;","        delete attrs.contentBox;","        delete attrs.srcNode;","        delete attrs.id;","","        if (this._applyParser) {","            this._applyParser(userVals);","        }","    },","","    /**","     * @method _applyParsedConfig","     * @protected","     * @return {Object} The merged configuration literal","     */","    _applyParsedConfig : function(node, cfg, parsedCfg) {","        return (parsedCfg) ? Y.mix(cfg, parsedCfg, false) : cfg;","    },","","    /**","     * Utility method used to apply the <code>HTML_PARSER</code> configuration for the","     * instance, to retrieve config data values.","     *","     * @method _applyParser","     * @protected","     * @param config {Object} User configuration object (will be populated with values from Node)","     */","    _applyParser : function(config) {","","        var widget = this,","            srcNode = this._getNodeToParse(),","            schema = widget._getHtmlParser(),","            parsedConfig,","            val;","","        if (schema && srcNode) {","            Y.Object.each(schema, function(v, k, o) {","                val = null;","","                if (Lang.isFunction(v)) {","                    val = v.call(widget, srcNode);","                } else {","                    if (Lang.isArray(v)) {","                        val = srcNode.all(v[0]);","                        if (val.isEmpty()) {","                            val = null;","                        }","                    } else {","                        val = srcNode.one(v);","                    }","                }","","                if (val !== null && val !== undefined) {","                    parsedConfig = parsedConfig || {};","                    parsedConfig[k] = val;","                }","            });","        }","        config = widget._applyParsedConfig(srcNode, config, parsedConfig);","    },","","    /**","     * Determines whether we have a node reference which we should try and parse.","     *","     * The current implementation does not parse nodes generated from CONTENT_TEMPLATE,","     * only explicitly set srcNode, or contentBox attributes.","     *","     * @method _getNodeToParse","     * @return {Node} The node reference to apply HTML_PARSER to.","     * @private","     */","    _getNodeToParse : function() {","        var srcNode = this.get(\"srcNode\");","        return (!this._cbFromTemplate) ? srcNode : null;","    },","","    /**","     * Gets the HTML_PARSER definition for this instance, by merging HTML_PARSER","     * definitions across the class hierarchy.","     *","     * @private","     * @method _getHtmlParser","     * @return {Object} HTML_PARSER definition for this instance","     */","    _getHtmlParser : function() {","        // Removed caching for kweight. This is a private method","        // and only called once so don't need to cache HTML_PARSER","        var classes = this._getClasses(),","            parser = {},","            i, p;","","        for (i = classes.length - 1; i >= 0; i--) {","            p = classes[i].HTML_PARSER;","            if (p) {","                Y.mix(parser, p, true);","            }","        }","        return parser;","    }","});","","","}, '@VERSION@', {\"requires\": [\"widget-base\"]});"];
_yuitest_coverage["build/widget-htmlparser/widget-htmlparser.js"].lines = {"1":0,"11":0,"41":0,"56":0,"67":0,"74":0,"82":0,"104":0,"111":0,"113":0,"114":0,"115":0,"116":0,"118":0,"119":0,"129":0,"142":0,"148":0,"149":0,"150":0,"152":0,"153":0,"155":0,"156":0,"157":0,"158":0,"161":0,"165":0,"166":0,"167":0,"171":0,"185":0,"186":0,"200":0,"204":0,"205":0,"206":0,"207":0,"210":0};
_yuitest_coverage["build/widget-htmlparser/widget-htmlparser.js"].functions = {"_getSrcNode:81":0,"_preAddAttrs:102":0,"_applyParsedConfig:128":0,"(anonymous 2):149":0,"_applyParser:140":0,"_getNodeToParse:184":0,"_getHtmlParser:197":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-htmlparser/widget-htmlparser.js"].coveredLines = 39;
_yuitest_coverage["build/widget-htmlparser/widget-htmlparser.js"].coveredFunctions = 8;
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 1);
YUI.add('widget-htmlparser', function (Y, NAME) {

/**
 * Adds HTML Parser support to the base Widget class
 *
 * @module widget
 * @submodule widget-htmlparser
 * @for Widget
 */

_yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 11);
var Widget = Y.Widget,
    Node = Y.Node,
    Lang = Y.Lang,

    SRC_NODE = "srcNode",
    CONTENT_BOX = "contentBox";

/**
 * Object hash, defining how attribute values are to be parsed from
 * markup contained in the widget's content box. e.g.:
 * <pre>
 *   {
 *       // Set single Node references using selector syntax
 *       // (selector is run through node.one)
 *       titleNode: "span.yui-title",
 *       // Set NodeList references using selector syntax
 *       // (array indicates selector is to be run through node.all)
 *       listNodes: ["li.yui-item"],
 *       // Set other attribute types, using a parse function.
 *       // Context is set to the widget instance.
 *       label: function(contentBox) {
 *           return contentBox.one("span.title").get("innerHTML");
 *       }
 *   }
 * </pre>
 *
 * @property HTML_PARSER
 * @type Object
 * @static
 */
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 41);
Widget.HTML_PARSER = {};

/**
 * The build configuration for the Widget class.
 * <p>
 * Defines the static fields which need to be aggregated,
 * when this class is used as the main class passed to
 * the <a href="Base.html#method_build">Base.build</a> method.
 * </p>
 * @property _buildCfg
 * @type Object
 * @static
 * @final
 * @private
 */
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 56);
Widget._buildCfg = {
    aggregates : ["HTML_PARSER"]
};

/**
 * The DOM node to parse for configuration values, passed to the Widget's HTML_PARSER definition
 *
 * @attribute srcNode
 * @type String | Node
 * @writeOnce
 */
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 67);
Widget.ATTRS[SRC_NODE] = {
    value: null,
    setter: Node.one,
    getter: "_getSrcNode",
    writeOnce: true
};

_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 74);
Y.mix(Widget.prototype, {

    /**
     * @method _getSrcNode
     * @protected
     * @return {Node} The Node to apply HTML_PARSER to
     */
    _getSrcNode : function(val) {
        _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "_getSrcNode", 81);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 82);
return val || this.get(CONTENT_BOX);
    },

    /**
     * Implement the BaseCore _preAddAttrs method hook, to add
     * the srcNode and related attributes, so that HTML_PARSER
     * (which relies on `this.get("srcNode")`) can merge in it's
     * results before the rest of the attributes are added.
     *
     * @method _preAddAttrs
     * @protected
     *
     * @param attrs {Object} The full hash of statically defined ATTRS
     * attributes being added for this instance
     *
     * @param userVals {Object} The hash of user values passed to
     * the constructor
     *
     * @param lazy {boolean} Whether or not to add the attributes lazily
     */
    _preAddAttrs : function(attrs, userVals, lazy) {

        _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "_preAddAttrs", 102);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 104);
var preAttrs = {
            id : attrs.id,
            boundingBox : attrs.boundingBox,
            contentBox : attrs.contentBox,
            srcNode : attrs.srcNode
        };

        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 111);
this.addAttrs(preAttrs, userVals, lazy);

        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 113);
delete attrs.boundingBox;
        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 114);
delete attrs.contentBox;
        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 115);
delete attrs.srcNode;
        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 116);
delete attrs.id;

        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 118);
if (this._applyParser) {
            _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 119);
this._applyParser(userVals);
        }
    },

    /**
     * @method _applyParsedConfig
     * @protected
     * @return {Object} The merged configuration literal
     */
    _applyParsedConfig : function(node, cfg, parsedCfg) {
        _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "_applyParsedConfig", 128);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 129);
return (parsedCfg) ? Y.mix(cfg, parsedCfg, false) : cfg;
    },

    /**
     * Utility method used to apply the <code>HTML_PARSER</code> configuration for the
     * instance, to retrieve config data values.
     *
     * @method _applyParser
     * @protected
     * @param config {Object} User configuration object (will be populated with values from Node)
     */
    _applyParser : function(config) {

        _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "_applyParser", 140);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 142);
var widget = this,
            srcNode = this._getNodeToParse(),
            schema = widget._getHtmlParser(),
            parsedConfig,
            val;

        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 148);
if (schema && srcNode) {
            _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 149);
Y.Object.each(schema, function(v, k, o) {
                _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "(anonymous 2)", 149);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 150);
val = null;

                _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 152);
if (Lang.isFunction(v)) {
                    _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 153);
val = v.call(widget, srcNode);
                } else {
                    _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 155);
if (Lang.isArray(v)) {
                        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 156);
val = srcNode.all(v[0]);
                        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 157);
if (val.isEmpty()) {
                            _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 158);
val = null;
                        }
                    } else {
                        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 161);
val = srcNode.one(v);
                    }
                }

                _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 165);
if (val !== null && val !== undefined) {
                    _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 166);
parsedConfig = parsedConfig || {};
                    _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 167);
parsedConfig[k] = val;
                }
            });
        }
        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 171);
config = widget._applyParsedConfig(srcNode, config, parsedConfig);
    },

    /**
     * Determines whether we have a node reference which we should try and parse.
     *
     * The current implementation does not parse nodes generated from CONTENT_TEMPLATE,
     * only explicitly set srcNode, or contentBox attributes.
     *
     * @method _getNodeToParse
     * @return {Node} The node reference to apply HTML_PARSER to.
     * @private
     */
    _getNodeToParse : function() {
        _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "_getNodeToParse", 184);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 185);
var srcNode = this.get("srcNode");
        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 186);
return (!this._cbFromTemplate) ? srcNode : null;
    },

    /**
     * Gets the HTML_PARSER definition for this instance, by merging HTML_PARSER
     * definitions across the class hierarchy.
     *
     * @private
     * @method _getHtmlParser
     * @return {Object} HTML_PARSER definition for this instance
     */
    _getHtmlParser : function() {
        // Removed caching for kweight. This is a private method
        // and only called once so don't need to cache HTML_PARSER
        _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "_getHtmlParser", 197);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 200);
var classes = this._getClasses(),
            parser = {},
            i, p;

        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 204);
for (i = classes.length - 1; i >= 0; i--) {
            _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 205);
p = classes[i].HTML_PARSER;
            _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 206);
if (p) {
                _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 207);
Y.mix(parser, p, true);
            }
        }
        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 210);
return parser;
    }
});


}, '@VERSION@', {"requires": ["widget-base"]});
