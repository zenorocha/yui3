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
_yuitest_coverage["build/color-base/color-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/color-base/color-base.js",
    code: []
};
_yuitest_coverage["build/color-base/color-base.js"].code=["YUI.add('color-base', function (Y, NAME) {","","/**","Color provides static methods for color conversion.","","    Y.Color.toRGB('f00'); // rgb(255, 0, 0)","","    Y.Color.toHex('rgb(255, 255, 0)'); // #ffff00","","@module color","@submodule color-base","@class Color","@since 3.8.0","**/","","var REGEX_HEX = /^#?([\\da-fA-F]{2})([\\da-fA-F]{2})([\\da-fA-F]{2})(\\ufffe)?/,","    REGEX_HEX3 = /^#?([\\da-fA-F]{1})([\\da-fA-F]{1})([\\da-fA-F]{1})(\\ufffe)?/,","    REGEX_RGB = /rgba?\\(([\\d]{1,3}), ?([\\d]{1,3}), ?([\\d]{1,3}),? ?([.\\d]*)?\\)/,","    TYPES = { 'HEX': 'hex', 'RGB': 'rgb', 'RGBA': 'rgba' },","    CONVERTS = { 'hex': 'toHex', 'rgb': 'toRGB', 'rgba': 'toRGBA' };","","","Y.Color = {","    /**","    @static","    @property KEYWORDS","    @type Object","    @since 3.8.0","    **/","    KEYWORDS: {","        'black': '000', 'silver': 'c0c0c0', 'gray': '808080', 'white': 'fff',","        'maroon': '800000', 'red': 'f00', 'purple': '800080', 'fuchsia': 'f0f',","        'green': '008000', 'lime': '0f0', 'olive': '808000', 'yellow': 'ff0',","        'navy': '000080', 'blue': '00f', 'teal': '008080', 'aqua': '0ff'","    },","","    /**","        NOTE: `(\\ufffe)?` is added to the Regular Expression to carve out a","        place for the alpha channel that is returned from toArray","        without compromising any usage of the Regular Expression","","    @static","    @property REGEX_HEX","    @type RegExp","    @default /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})(\\ufffe)?/","    @since 3.8.0","    **/","    REGEX_HEX: REGEX_HEX,","","    /**","        NOTE: `(\\ufffe)?` is added to the Regular Expression to carve out a","        place for the alpha channel that is returned from toArray","        without compromising any usage of the Regular Expression","","    @static","    @property REGEX_HEX3","    @type RegExp","    @default /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})(\\ufffe)?/","    @since 3.8.0","    **/","    REGEX_HEX3: REGEX_HEX3,","","    /**","    @static","    @property REGEX_RGB","    @type RegExp","    @default /rgba?\\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}),? ?([.0-9]{1,3})?\\)/","    @since 3.8.0","    **/","    REGEX_RGB: REGEX_RGB,","","    re_RGB: REGEX_RGB,","","    re_hex: REGEX_HEX,","","    re_hex3: REGEX_HEX3,","","    /**","    @static","    @property STR_HEX","    @type String","    @default #{*}{*}{*}","    @since 3.8.0","    **/","    STR_HEX: '#{*}{*}{*}',","","    /**","    @static","    @property STR_RGB","    @type String","    @default rgb({*}, {*}, {*})","    @since 3.8.0","    **/","    STR_RGB: 'rgb({*}, {*}, {*})',","","    /**","    @static","    @property STR_RGBA","    @type String","    @default rgba({*}, {*}, {*}, {*})","    @since 3.8.0","    **/","    STR_RGBA: 'rgba({*}, {*}, {*}, {*})',","","    /**","    @static","    @property TYPES","    @type Object","    @default {'rgb':'rgb', 'rgba':'rgba'}","    @since 3.8.0","    **/","    TYPES: TYPES,","","    /**","    @static","    @property CONVERTS","    @type Object","    @default {}","    @since 3.8.0","    **/","    CONVERTS: CONVERTS,","","    /**","     Converts the provided string to the provided type.","     You can use the `Y.Color.TYPES` to get a valid `to` type.","     If the color cannot be converted, the original color will be returned.","","     @public","     @method convert","     @param {String} str","     @param {String} to","     @return {String}","     @since 3.8.0","     **/","    convert: function (str, to) {","        var convert = Y.Color.CONVERTS[to.toLowerCase()],","            clr = str;","","        if (convert && Y.Color[convert]) {","            clr = Y.Color[convert](str);","        }","","        return clr;","    },","","    /**","    Converts provided color value to a hex value string","","    @public","    @method toHex","    @param {String} str Hex or RGB value string","    @return {String} returns array of values or CSS string if options.css is true","    @since 3.8.0","    **/","    toHex: function (str) {","        var clr = Y.Color._convertTo(str, 'hex'),","            isTransparent = clr.toLowerCase() === 'transparent';","","        if (clr.charAt(0) !== '#' && !isTransparent) {","            clr = '#' + clr;","        }","","        return isTransparent ? clr.toLowerCase() : clr.toUpperCase();","    },","","    /**","    Converts provided color value to an RGB value string","    @public","    @method toRGB","    @param {String} str Hex or RGB value string","    @return {String}","    @since 3.8.0","    **/","    toRGB: function (str) {","        var clr = Y.Color._convertTo(str, 'rgb');","        return clr.toLowerCase();","    },","","    /**","    Converts provided color value to an RGB value string","    @public","    @method toRGBA","    @param {String} str Hex or RGB value string","    @return {String}","    @since 3.8.0","    **/","    toRGBA: function (str) {","        var clr = Y.Color._convertTo(str, 'rgba' );","        return clr.toLowerCase();","    },","","    /**","    Converts the provided color string to an array of values where the","        last value is the alpha value. Will return an empty array if","        the provided string is not able to be parsed.","","        NOTE: `(\\ufffe)?` is added to `HEX` and `HEX3` Regular Expressions to","        carve out a place for the alpha channel that is returned from","        toArray without compromising any usage of the Regular Expression","","        Y.Color.toArray('fff');              // ['ff', 'ff', 'ff', 1]","        Y.Color.toArray('rgb(0, 0, 0)');     // ['0', '0', '0', 1]","        Y.Color.toArray('rgba(0, 0, 0, 0)'); // ['0', '0', '0', 1]","","","","    @public","    @method toArray","    @param {String} str","    @return {Array}","    @since 3.8.0","    **/","    toArray: function(str) {","        // parse with regex and return \"matches\" array","        var type = Y.Color.findType(str).toUpperCase(),","            regex,","            arr,","            length,","            lastItem;","","        if (type === 'HEX' && str.length < 5) {","            type = 'HEX3';","        }","","        if (type.charAt(type.length - 1) === 'A') {","            type = type.slice(0, -1);","        }","","        regex = Y.Color['REGEX_' + type];","","        if (regex) {","            arr = regex.exec(str) || [];","            length = arr.length;","","            if (length) {","","                arr.shift();","                length--;","","                if (type === 'HEX3') {","                    arr[0] += arr[0];","                    arr[1] += arr[1];","                    arr[2] += arr[2];","                }","","                lastItem = arr[length - 1];","                if (!lastItem) {","                    arr[length - 1] = 1;","                }","            }","        }","","        return arr;","","    },","","    /**","    Converts the array of values to a string based on the provided template.","    @public","    @method fromArray","    @param {Array} arr","    @param {String} template","    @return {String}","    @since 3.8.0","    **/","    fromArray: function(arr, template) {","        arr = arr.concat();","","        if (typeof template === 'undefined') {","            return arr.join(', ');","        }","","        var replace = '{*}';","","        template = Y.Color['STR_' + template.toUpperCase()];","","        if (arr.length === 3 && template.match(/\\{\\*\\}/g).length === 4) {","            arr.push(1);","        }","","        while ( template.indexOf(replace) >= 0 && arr.length > 0) {","            template = template.replace(replace, arr.shift());","        }","","        return template;","    },","","    /**","    Finds the value type based on the str value provided.","    @public","    @method findType","    @param {String} str","    @return {String}","    @since 3.8.0","    **/","    findType: function (str) {","        if (Y.Color.KEYWORDS[str]) {","            return 'keyword';","        }","","        var index = str.indexOf('('),","            key;","","        if (index > 0) {","            key = str.substr(0, index);","        }","","        if (key && Y.Color.TYPES[key.toUpperCase()]) {","            return Y.Color.TYPES[key.toUpperCase()];","        }","","        return 'hex';","","    }, // return 'keyword', 'hex', 'rgb'","","    /**","    Retrives the alpha channel from the provided string. If no alpha","        channel is present, `1` will be returned.","    @protected","    @method _getAlpha","    @param {String} clr","    @return {Number}","    @since 3.8.0","    **/","    _getAlpha: function (clr) {","        var alpha,","            arr = Y.Color.toArray(clr);","","        if (arr.length > 3) {","            alpha = arr.pop();","        }","","        return +alpha || 1;","    },","","    /**","    Returns the hex value string if found in the KEYWORDS object","    @protected","    @method _keywordToHex","    @param {String} clr","    @return {String}","    @since 3.8.0","    **/","    _keywordToHex: function (clr) {","        var keyword = Y.Color.KEYWORDS[clr];","","        if (keyword) {","            return keyword;","        }","    },","","    /**","    Converts the provided color string to the value type provided as `to`","    @protected","    @method _convertTo","    @param {String} clr","    @param {String} to","    @return {String}","    @since 3.8.0","    **/","    _convertTo: function(clr, to) {","","        if (clr === 'transparent') {","            return clr;","        }","","        var from = Y.Color.findType(clr),","            originalTo = to,","            needsAlpha,","            alpha,","            method,","            ucTo;","","        if (from === 'keyword') {","            clr = Y.Color._keywordToHex(clr);","            from = 'hex';","        }","","        if (from === 'hex' && clr.length < 5) {","            if (clr.charAt(0) === '#') {","                clr = clr.substr(1);","            }","","            clr = '#' + clr.charAt(0) + clr.charAt(0) +","                        clr.charAt(1) + clr.charAt(1) +","                        clr.charAt(2) + clr.charAt(2);","        }","","        if (from === to) {","            return clr;","        }","","        if (from.charAt(from.length - 1) === 'a') {","            from = from.slice(0, -1);","        }","","        needsAlpha = (to.charAt(to.length - 1) === 'a');","        if (needsAlpha) {","            to = to.slice(0, -1);","            alpha = Y.Color._getAlpha(clr);","        }","","        ucTo = to.charAt(0).toUpperCase() + to.substr(1).toLowerCase();","        method = Y.Color['_' + from + 'To' + ucTo ];","","        // check to see if need conversion to rgb first","        // check to see if there is a direct conversion method","        // convertions are: hex <-> rgb <-> hsl","        if (!method) {","            if (from !== 'rgb' && to !== 'rgb') {","                clr = Y.Color['_' + from + 'ToRgb'](clr);","                from = 'rgb';","                method = Y.Color['_' + from + 'To' + ucTo ];","            }","        }","","        if (method) {","            clr = ((method)(clr, needsAlpha));","        }","","        // process clr from arrays to strings after conversions if alpha is needed","        if (needsAlpha) {","            if (!Y.Lang.isArray(clr)) {","                clr = Y.Color.toArray(clr);","            }","            clr.push(alpha);","            clr = Y.Color.fromArray(clr, originalTo.toUpperCase());","        }","","        return clr;","    },","","    /**","    Processes the hex string into r, g, b values. Will return values as","        an array, or as an rgb string.","    @protected","    @method _hexToRgb","    @param {String} str","    @param {Boolean} [toArray]","    @return {String|Array}","    @since 3.8.0","    **/","    _hexToRgb: function (str, toArray) {","        var r, g, b;","","        /*jshint bitwise:false*/","        if (str.charAt(0) === '#') {","            str = str.substr(1);","        }","","        str = parseInt(str, 16);","","        r = str >> 16;","        g = str >> 8 & 0xFF;","        b = str & 0xFF;","","        if (toArray) {","            return [r, g, b];","        }","","        return 'rgb(' + r + ', ' + g + ', ' + b + ')';","    },","","    /**","    Processes the rgb string into r, g, b values. Will return values as","        an array, or as a hex string.","    @protected","    @method _rgbToHex","    @param {String} str","    @param {Boolean} [toArray]","    @return {String|Array}","    @since 3.8.0","    **/","    _rgbToHex: function (str) {","        /*jshint bitwise:false*/","        var rgb = Y.Color.toArray(str),","            hex = rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);","","        hex = (+hex).toString(16);","","        while (hex.length < 6) {","            hex = '0' + hex;","        }","","        return '#' + hex;","    }","","};","","","","}, '@VERSION@', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/color-base/color-base.js"].lines = {"1":0,"16":0,"23":0,"136":0,"139":0,"140":0,"143":0,"156":0,"159":0,"160":0,"163":0,"175":0,"176":0,"188":0,"189":0,"215":0,"221":0,"222":0,"225":0,"226":0,"229":0,"231":0,"232":0,"233":0,"235":0,"237":0,"238":0,"240":0,"241":0,"242":0,"243":0,"246":0,"247":0,"248":0,"253":0,"267":0,"269":0,"270":0,"273":0,"275":0,"277":0,"278":0,"281":0,"282":0,"285":0,"297":0,"298":0,"301":0,"304":0,"305":0,"308":0,"309":0,"312":0,"326":0,"329":0,"330":0,"333":0,"345":0,"347":0,"348":0,"363":0,"364":0,"367":0,"374":0,"375":0,"376":0,"379":0,"380":0,"381":0,"384":0,"389":0,"390":0,"393":0,"394":0,"397":0,"398":0,"399":0,"400":0,"403":0,"404":0,"409":0,"410":0,"411":0,"412":0,"413":0,"417":0,"418":0,"422":0,"423":0,"424":0,"426":0,"427":0,"430":0,"444":0,"447":0,"448":0,"451":0,"453":0,"454":0,"455":0,"457":0,"458":0,"461":0,"476":0,"479":0,"481":0,"482":0,"485":0};
_yuitest_coverage["build/color-base/color-base.js"].functions = {"convert:135":0,"toHex:155":0,"toRGB:174":0,"toRGBA:187":0,"toArray:213":0,"fromArray:266":0,"findType:296":0,"_getAlpha:325":0,"_keywordToHex:344":0,"_convertTo:361":0,"_hexToRgb:443":0,"_rgbToHex:474":0,"(anonymous 1):1":0};
_yuitest_coverage["build/color-base/color-base.js"].coveredLines = 108;
_yuitest_coverage["build/color-base/color-base.js"].coveredFunctions = 13;
_yuitest_coverline("build/color-base/color-base.js", 1);
YUI.add('color-base', function (Y, NAME) {

/**
Color provides static methods for color conversion.

    Y.Color.toRGB('f00'); // rgb(255, 0, 0)

    Y.Color.toHex('rgb(255, 255, 0)'); // #ffff00

@module color
@submodule color-base
@class Color
@since 3.8.0
**/

_yuitest_coverfunc("build/color-base/color-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/color-base/color-base.js", 16);
var REGEX_HEX = /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})(\ufffe)?/,
    REGEX_HEX3 = /^#?([\da-fA-F]{1})([\da-fA-F]{1})([\da-fA-F]{1})(\ufffe)?/,
    REGEX_RGB = /rgba?\(([\d]{1,3}), ?([\d]{1,3}), ?([\d]{1,3}),? ?([.\d]*)?\)/,
    TYPES = { 'HEX': 'hex', 'RGB': 'rgb', 'RGBA': 'rgba' },
    CONVERTS = { 'hex': 'toHex', 'rgb': 'toRGB', 'rgba': 'toRGBA' };


_yuitest_coverline("build/color-base/color-base.js", 23);
Y.Color = {
    /**
    @static
    @property KEYWORDS
    @type Object
    @since 3.8.0
    **/
    KEYWORDS: {
        'black': '000', 'silver': 'c0c0c0', 'gray': '808080', 'white': 'fff',
        'maroon': '800000', 'red': 'f00', 'purple': '800080', 'fuchsia': 'f0f',
        'green': '008000', 'lime': '0f0', 'olive': '808000', 'yellow': 'ff0',
        'navy': '000080', 'blue': '00f', 'teal': '008080', 'aqua': '0ff'
    },

    /**
        NOTE: `(\ufffe)?` is added to the Regular Expression to carve out a
        place for the alpha channel that is returned from toArray
        without compromising any usage of the Regular Expression

    @static
    @property REGEX_HEX
    @type RegExp
    @default /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})(\ufffe)?/
    @since 3.8.0
    **/
    REGEX_HEX: REGEX_HEX,

    /**
        NOTE: `(\ufffe)?` is added to the Regular Expression to carve out a
        place for the alpha channel that is returned from toArray
        without compromising any usage of the Regular Expression

    @static
    @property REGEX_HEX3
    @type RegExp
    @default /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})(\ufffe)?/
    @since 3.8.0
    **/
    REGEX_HEX3: REGEX_HEX3,

    /**
    @static
    @property REGEX_RGB
    @type RegExp
    @default /rgba?\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}),? ?([.0-9]{1,3})?\)/
    @since 3.8.0
    **/
    REGEX_RGB: REGEX_RGB,

    re_RGB: REGEX_RGB,

    re_hex: REGEX_HEX,

    re_hex3: REGEX_HEX3,

    /**
    @static
    @property STR_HEX
    @type String
    @default #{*}{*}{*}
    @since 3.8.0
    **/
    STR_HEX: '#{*}{*}{*}',

    /**
    @static
    @property STR_RGB
    @type String
    @default rgb({*}, {*}, {*})
    @since 3.8.0
    **/
    STR_RGB: 'rgb({*}, {*}, {*})',

    /**
    @static
    @property STR_RGBA
    @type String
    @default rgba({*}, {*}, {*}, {*})
    @since 3.8.0
    **/
    STR_RGBA: 'rgba({*}, {*}, {*}, {*})',

    /**
    @static
    @property TYPES
    @type Object
    @default {'rgb':'rgb', 'rgba':'rgba'}
    @since 3.8.0
    **/
    TYPES: TYPES,

    /**
    @static
    @property CONVERTS
    @type Object
    @default {}
    @since 3.8.0
    **/
    CONVERTS: CONVERTS,

    /**
     Converts the provided string to the provided type.
     You can use the `Y.Color.TYPES` to get a valid `to` type.
     If the color cannot be converted, the original color will be returned.

     @public
     @method convert
     @param {String} str
     @param {String} to
     @return {String}
     @since 3.8.0
     **/
    convert: function (str, to) {
        _yuitest_coverfunc("build/color-base/color-base.js", "convert", 135);
_yuitest_coverline("build/color-base/color-base.js", 136);
var convert = Y.Color.CONVERTS[to.toLowerCase()],
            clr = str;

        _yuitest_coverline("build/color-base/color-base.js", 139);
if (convert && Y.Color[convert]) {
            _yuitest_coverline("build/color-base/color-base.js", 140);
clr = Y.Color[convert](str);
        }

        _yuitest_coverline("build/color-base/color-base.js", 143);
return clr;
    },

    /**
    Converts provided color value to a hex value string

    @public
    @method toHex
    @param {String} str Hex or RGB value string
    @return {String} returns array of values or CSS string if options.css is true
    @since 3.8.0
    **/
    toHex: function (str) {
        _yuitest_coverfunc("build/color-base/color-base.js", "toHex", 155);
_yuitest_coverline("build/color-base/color-base.js", 156);
var clr = Y.Color._convertTo(str, 'hex'),
            isTransparent = clr.toLowerCase() === 'transparent';

        _yuitest_coverline("build/color-base/color-base.js", 159);
if (clr.charAt(0) !== '#' && !isTransparent) {
            _yuitest_coverline("build/color-base/color-base.js", 160);
clr = '#' + clr;
        }

        _yuitest_coverline("build/color-base/color-base.js", 163);
return isTransparent ? clr.toLowerCase() : clr.toUpperCase();
    },

    /**
    Converts provided color value to an RGB value string
    @public
    @method toRGB
    @param {String} str Hex or RGB value string
    @return {String}
    @since 3.8.0
    **/
    toRGB: function (str) {
        _yuitest_coverfunc("build/color-base/color-base.js", "toRGB", 174);
_yuitest_coverline("build/color-base/color-base.js", 175);
var clr = Y.Color._convertTo(str, 'rgb');
        _yuitest_coverline("build/color-base/color-base.js", 176);
return clr.toLowerCase();
    },

    /**
    Converts provided color value to an RGB value string
    @public
    @method toRGBA
    @param {String} str Hex or RGB value string
    @return {String}
    @since 3.8.0
    **/
    toRGBA: function (str) {
        _yuitest_coverfunc("build/color-base/color-base.js", "toRGBA", 187);
_yuitest_coverline("build/color-base/color-base.js", 188);
var clr = Y.Color._convertTo(str, 'rgba' );
        _yuitest_coverline("build/color-base/color-base.js", 189);
return clr.toLowerCase();
    },

    /**
    Converts the provided color string to an array of values where the
        last value is the alpha value. Will return an empty array if
        the provided string is not able to be parsed.

        NOTE: `(\ufffe)?` is added to `HEX` and `HEX3` Regular Expressions to
        carve out a place for the alpha channel that is returned from
        toArray without compromising any usage of the Regular Expression

        Y.Color.toArray('fff');              // ['ff', 'ff', 'ff', 1]
        Y.Color.toArray('rgb(0, 0, 0)');     // ['0', '0', '0', 1]
        Y.Color.toArray('rgba(0, 0, 0, 0)'); // ['0', '0', '0', 1]



    @public
    @method toArray
    @param {String} str
    @return {Array}
    @since 3.8.0
    **/
    toArray: function(str) {
        // parse with regex and return "matches" array
        _yuitest_coverfunc("build/color-base/color-base.js", "toArray", 213);
_yuitest_coverline("build/color-base/color-base.js", 215);
var type = Y.Color.findType(str).toUpperCase(),
            regex,
            arr,
            length,
            lastItem;

        _yuitest_coverline("build/color-base/color-base.js", 221);
if (type === 'HEX' && str.length < 5) {
            _yuitest_coverline("build/color-base/color-base.js", 222);
type = 'HEX3';
        }

        _yuitest_coverline("build/color-base/color-base.js", 225);
if (type.charAt(type.length - 1) === 'A') {
            _yuitest_coverline("build/color-base/color-base.js", 226);
type = type.slice(0, -1);
        }

        _yuitest_coverline("build/color-base/color-base.js", 229);
regex = Y.Color['REGEX_' + type];

        _yuitest_coverline("build/color-base/color-base.js", 231);
if (regex) {
            _yuitest_coverline("build/color-base/color-base.js", 232);
arr = regex.exec(str) || [];
            _yuitest_coverline("build/color-base/color-base.js", 233);
length = arr.length;

            _yuitest_coverline("build/color-base/color-base.js", 235);
if (length) {

                _yuitest_coverline("build/color-base/color-base.js", 237);
arr.shift();
                _yuitest_coverline("build/color-base/color-base.js", 238);
length--;

                _yuitest_coverline("build/color-base/color-base.js", 240);
if (type === 'HEX3') {
                    _yuitest_coverline("build/color-base/color-base.js", 241);
arr[0] += arr[0];
                    _yuitest_coverline("build/color-base/color-base.js", 242);
arr[1] += arr[1];
                    _yuitest_coverline("build/color-base/color-base.js", 243);
arr[2] += arr[2];
                }

                _yuitest_coverline("build/color-base/color-base.js", 246);
lastItem = arr[length - 1];
                _yuitest_coverline("build/color-base/color-base.js", 247);
if (!lastItem) {
                    _yuitest_coverline("build/color-base/color-base.js", 248);
arr[length - 1] = 1;
                }
            }
        }

        _yuitest_coverline("build/color-base/color-base.js", 253);
return arr;

    },

    /**
    Converts the array of values to a string based on the provided template.
    @public
    @method fromArray
    @param {Array} arr
    @param {String} template
    @return {String}
    @since 3.8.0
    **/
    fromArray: function(arr, template) {
        _yuitest_coverfunc("build/color-base/color-base.js", "fromArray", 266);
_yuitest_coverline("build/color-base/color-base.js", 267);
arr = arr.concat();

        _yuitest_coverline("build/color-base/color-base.js", 269);
if (typeof template === 'undefined') {
            _yuitest_coverline("build/color-base/color-base.js", 270);
return arr.join(', ');
        }

        _yuitest_coverline("build/color-base/color-base.js", 273);
var replace = '{*}';

        _yuitest_coverline("build/color-base/color-base.js", 275);
template = Y.Color['STR_' + template.toUpperCase()];

        _yuitest_coverline("build/color-base/color-base.js", 277);
if (arr.length === 3 && template.match(/\{\*\}/g).length === 4) {
            _yuitest_coverline("build/color-base/color-base.js", 278);
arr.push(1);
        }

        _yuitest_coverline("build/color-base/color-base.js", 281);
while ( template.indexOf(replace) >= 0 && arr.length > 0) {
            _yuitest_coverline("build/color-base/color-base.js", 282);
template = template.replace(replace, arr.shift());
        }

        _yuitest_coverline("build/color-base/color-base.js", 285);
return template;
    },

    /**
    Finds the value type based on the str value provided.
    @public
    @method findType
    @param {String} str
    @return {String}
    @since 3.8.0
    **/
    findType: function (str) {
        _yuitest_coverfunc("build/color-base/color-base.js", "findType", 296);
_yuitest_coverline("build/color-base/color-base.js", 297);
if (Y.Color.KEYWORDS[str]) {
            _yuitest_coverline("build/color-base/color-base.js", 298);
return 'keyword';
        }

        _yuitest_coverline("build/color-base/color-base.js", 301);
var index = str.indexOf('('),
            key;

        _yuitest_coverline("build/color-base/color-base.js", 304);
if (index > 0) {
            _yuitest_coverline("build/color-base/color-base.js", 305);
key = str.substr(0, index);
        }

        _yuitest_coverline("build/color-base/color-base.js", 308);
if (key && Y.Color.TYPES[key.toUpperCase()]) {
            _yuitest_coverline("build/color-base/color-base.js", 309);
return Y.Color.TYPES[key.toUpperCase()];
        }

        _yuitest_coverline("build/color-base/color-base.js", 312);
return 'hex';

    }, // return 'keyword', 'hex', 'rgb'

    /**
    Retrives the alpha channel from the provided string. If no alpha
        channel is present, `1` will be returned.
    @protected
    @method _getAlpha
    @param {String} clr
    @return {Number}
    @since 3.8.0
    **/
    _getAlpha: function (clr) {
        _yuitest_coverfunc("build/color-base/color-base.js", "_getAlpha", 325);
_yuitest_coverline("build/color-base/color-base.js", 326);
var alpha,
            arr = Y.Color.toArray(clr);

        _yuitest_coverline("build/color-base/color-base.js", 329);
if (arr.length > 3) {
            _yuitest_coverline("build/color-base/color-base.js", 330);
alpha = arr.pop();
        }

        _yuitest_coverline("build/color-base/color-base.js", 333);
return +alpha || 1;
    },

    /**
    Returns the hex value string if found in the KEYWORDS object
    @protected
    @method _keywordToHex
    @param {String} clr
    @return {String}
    @since 3.8.0
    **/
    _keywordToHex: function (clr) {
        _yuitest_coverfunc("build/color-base/color-base.js", "_keywordToHex", 344);
_yuitest_coverline("build/color-base/color-base.js", 345);
var keyword = Y.Color.KEYWORDS[clr];

        _yuitest_coverline("build/color-base/color-base.js", 347);
if (keyword) {
            _yuitest_coverline("build/color-base/color-base.js", 348);
return keyword;
        }
    },

    /**
    Converts the provided color string to the value type provided as `to`
    @protected
    @method _convertTo
    @param {String} clr
    @param {String} to
    @return {String}
    @since 3.8.0
    **/
    _convertTo: function(clr, to) {

        _yuitest_coverfunc("build/color-base/color-base.js", "_convertTo", 361);
_yuitest_coverline("build/color-base/color-base.js", 363);
if (clr === 'transparent') {
            _yuitest_coverline("build/color-base/color-base.js", 364);
return clr;
        }

        _yuitest_coverline("build/color-base/color-base.js", 367);
var from = Y.Color.findType(clr),
            originalTo = to,
            needsAlpha,
            alpha,
            method,
            ucTo;

        _yuitest_coverline("build/color-base/color-base.js", 374);
if (from === 'keyword') {
            _yuitest_coverline("build/color-base/color-base.js", 375);
clr = Y.Color._keywordToHex(clr);
            _yuitest_coverline("build/color-base/color-base.js", 376);
from = 'hex';
        }

        _yuitest_coverline("build/color-base/color-base.js", 379);
if (from === 'hex' && clr.length < 5) {
            _yuitest_coverline("build/color-base/color-base.js", 380);
if (clr.charAt(0) === '#') {
                _yuitest_coverline("build/color-base/color-base.js", 381);
clr = clr.substr(1);
            }

            _yuitest_coverline("build/color-base/color-base.js", 384);
clr = '#' + clr.charAt(0) + clr.charAt(0) +
                        clr.charAt(1) + clr.charAt(1) +
                        clr.charAt(2) + clr.charAt(2);
        }

        _yuitest_coverline("build/color-base/color-base.js", 389);
if (from === to) {
            _yuitest_coverline("build/color-base/color-base.js", 390);
return clr;
        }

        _yuitest_coverline("build/color-base/color-base.js", 393);
if (from.charAt(from.length - 1) === 'a') {
            _yuitest_coverline("build/color-base/color-base.js", 394);
from = from.slice(0, -1);
        }

        _yuitest_coverline("build/color-base/color-base.js", 397);
needsAlpha = (to.charAt(to.length - 1) === 'a');
        _yuitest_coverline("build/color-base/color-base.js", 398);
if (needsAlpha) {
            _yuitest_coverline("build/color-base/color-base.js", 399);
to = to.slice(0, -1);
            _yuitest_coverline("build/color-base/color-base.js", 400);
alpha = Y.Color._getAlpha(clr);
        }

        _yuitest_coverline("build/color-base/color-base.js", 403);
ucTo = to.charAt(0).toUpperCase() + to.substr(1).toLowerCase();
        _yuitest_coverline("build/color-base/color-base.js", 404);
method = Y.Color['_' + from + 'To' + ucTo ];

        // check to see if need conversion to rgb first
        // check to see if there is a direct conversion method
        // convertions are: hex <-> rgb <-> hsl
        _yuitest_coverline("build/color-base/color-base.js", 409);
if (!method) {
            _yuitest_coverline("build/color-base/color-base.js", 410);
if (from !== 'rgb' && to !== 'rgb') {
                _yuitest_coverline("build/color-base/color-base.js", 411);
clr = Y.Color['_' + from + 'ToRgb'](clr);
                _yuitest_coverline("build/color-base/color-base.js", 412);
from = 'rgb';
                _yuitest_coverline("build/color-base/color-base.js", 413);
method = Y.Color['_' + from + 'To' + ucTo ];
            }
        }

        _yuitest_coverline("build/color-base/color-base.js", 417);
if (method) {
            _yuitest_coverline("build/color-base/color-base.js", 418);
clr = ((method)(clr, needsAlpha));
        }

        // process clr from arrays to strings after conversions if alpha is needed
        _yuitest_coverline("build/color-base/color-base.js", 422);
if (needsAlpha) {
            _yuitest_coverline("build/color-base/color-base.js", 423);
if (!Y.Lang.isArray(clr)) {
                _yuitest_coverline("build/color-base/color-base.js", 424);
clr = Y.Color.toArray(clr);
            }
            _yuitest_coverline("build/color-base/color-base.js", 426);
clr.push(alpha);
            _yuitest_coverline("build/color-base/color-base.js", 427);
clr = Y.Color.fromArray(clr, originalTo.toUpperCase());
        }

        _yuitest_coverline("build/color-base/color-base.js", 430);
return clr;
    },

    /**
    Processes the hex string into r, g, b values. Will return values as
        an array, or as an rgb string.
    @protected
    @method _hexToRgb
    @param {String} str
    @param {Boolean} [toArray]
    @return {String|Array}
    @since 3.8.0
    **/
    _hexToRgb: function (str, toArray) {
        _yuitest_coverfunc("build/color-base/color-base.js", "_hexToRgb", 443);
_yuitest_coverline("build/color-base/color-base.js", 444);
var r, g, b;

        /*jshint bitwise:false*/
        _yuitest_coverline("build/color-base/color-base.js", 447);
if (str.charAt(0) === '#') {
            _yuitest_coverline("build/color-base/color-base.js", 448);
str = str.substr(1);
        }

        _yuitest_coverline("build/color-base/color-base.js", 451);
str = parseInt(str, 16);

        _yuitest_coverline("build/color-base/color-base.js", 453);
r = str >> 16;
        _yuitest_coverline("build/color-base/color-base.js", 454);
g = str >> 8 & 0xFF;
        _yuitest_coverline("build/color-base/color-base.js", 455);
b = str & 0xFF;

        _yuitest_coverline("build/color-base/color-base.js", 457);
if (toArray) {
            _yuitest_coverline("build/color-base/color-base.js", 458);
return [r, g, b];
        }

        _yuitest_coverline("build/color-base/color-base.js", 461);
return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    },

    /**
    Processes the rgb string into r, g, b values. Will return values as
        an array, or as a hex string.
    @protected
    @method _rgbToHex
    @param {String} str
    @param {Boolean} [toArray]
    @return {String|Array}
    @since 3.8.0
    **/
    _rgbToHex: function (str) {
        /*jshint bitwise:false*/
        _yuitest_coverfunc("build/color-base/color-base.js", "_rgbToHex", 474);
_yuitest_coverline("build/color-base/color-base.js", 476);
var rgb = Y.Color.toArray(str),
            hex = rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);

        _yuitest_coverline("build/color-base/color-base.js", 479);
hex = (+hex).toString(16);

        _yuitest_coverline("build/color-base/color-base.js", 481);
while (hex.length < 6) {
            _yuitest_coverline("build/color-base/color-base.js", 482);
hex = '0' + hex;
        }

        _yuitest_coverline("build/color-base/color-base.js", 485);
return '#' + hex;
    }

};



}, '@VERSION@', {"requires": ["yui-base"]});
