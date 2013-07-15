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
_yuitest_coverage["build/selector-css2/selector-css2.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/selector-css2/selector-css2.js",
    code: []
};
_yuitest_coverage["build/selector-css2/selector-css2.js"].code=["YUI.add('selector-css2', function (Y, NAME) {","","/**"," * The selector module provides helper methods allowing CSS2 Selectors to be used with DOM elements."," * @module dom"," * @submodule selector-css2"," * @for Selector"," */","","/*"," * Provides helper methods for collecting and filtering DOM elements."," */","","var PARENT_NODE = 'parentNode',","    TAG_NAME = 'tagName',","    ATTRIBUTES = 'attributes',","    COMBINATOR = 'combinator',","    PSEUDOS = 'pseudos',","","    Selector = Y.Selector,","","    SelectorCSS2 = {","        _reRegExpTokens: /([\\^\\$\\?\\[\\]\\*\\+\\-\\.\\(\\)\\|\\\\])/,","        SORT_RESULTS: true,","","        // TODO: better detection, document specific","        _isXML: (function() {","            var isXML = (Y.config.doc.createElement('div').tagName !== 'DIV');","            return isXML;","        }()),","","        /**","         * Mapping of shorthand tokens to corresponding attribute selector ","         * @property shorthand","         * @type object","         */","        shorthand: {","            '\\\\#(-?[_a-z0-9]+[-\\\\w\\\\uE000]*)': '[id=$1]',","            '\\\\.(-?[_a-z]+[-\\\\w\\\\uE000]*)': '[className~=$1]'","        },","","        /**","         * List of operators and corresponding boolean functions. ","         * These functions are passed the attribute and the current node's value of the attribute.","         * @property operators","         * @type object","         */","        operators: {","            '': function(node, attr) { return Y.DOM.getAttribute(node, attr) !== ''; }, // Just test for existence of attribute","            '~=': '(?:^|\\\\s+){val}(?:\\\\s+|$)', // space-delimited","            '|=': '^{val}-?' // optional hyphen-delimited","        },","","        pseudos: {","           'first-child': function(node) { ","                return Y.DOM._children(node[PARENT_NODE])[0] === node; ","            } ","        },","","        _bruteQuery: function(selector, root, firstOnly) {","            var ret = [],","                nodes = [],","                visited,","                tokens = Selector._tokenize(selector),","                token = tokens[tokens.length - 1],","                rootDoc = Y.DOM._getDoc(root),","                child,","                id,","                className,","                tagName,","                isUniversal;","","            if (token) {","                // prefilter nodes","                id = token.id;","                className = token.className;","                tagName = token.tagName || '*';","","                if (root.getElementsByTagName) { // non-IE lacks DOM api on doc frags","                    // try ID first, unless no root.all && root not in document","                    // (root.all works off document, but not getElementById)","                    if (id && (root.all || (root.nodeType === 9 || Y.DOM.inDoc(root)))) {","                        nodes = Y.DOM.allById(id, root);","                    // try className","                    } else if (className) {","                        nodes = root.getElementsByClassName(className);","                    } else { // default to tagName","                        nodes = root.getElementsByTagName(tagName);","                    }","","                } else { // brute getElementsByTagName()","                    visited = [];","                    child = root.firstChild;","                    isUniversal = tagName === \"*\";","                    while (child) {","                        while (child) {","                            // IE 6-7 considers comment nodes as element nodes, and gives them the tagName \"!\".","                            // We can filter them out by checking if its tagName is > \"@\". ","                            // This also avoids a superflous nodeType === 1 check.","                            if (child.tagName > \"@\" && (isUniversal || child.tagName === tagName)) {","                                nodes.push(child);","                            }","","                            // We may need to traverse back up the tree to find more unvisited subtrees.","                            visited.push(child);","                            child = child.firstChild;","                        }","","                        // Find the most recently visited node who has a next sibling.","                        while (visited.length > 0 && !child) {","                            child = visited.pop().nextSibling;","                        }","                    }","                }","","                if (nodes.length) {","                    ret = Selector._filterNodes(nodes, tokens, firstOnly);","                }","            }","","            return ret;","        },","        ","        _filterNodes: function(nodes, tokens, firstOnly) {","            var i = 0,","                j,","                len = tokens.length,","                n = len - 1,","                result = [],","                node = nodes[0],","                tmpNode = node,","                getters = Y.Selector.getters,","                operator,","                combinator,","                token,","                path,","                pass,","                value,","                tests,","                test;","","            for (i = 0; (tmpNode = node = nodes[i++]);) {","                n = len - 1;","                path = null;","                ","                testLoop:","                while (tmpNode && tmpNode.tagName) {","                    token = tokens[n];","                    tests = token.tests;","                    j = tests.length;","                    if (j && !pass) {","                        while ((test = tests[--j])) {","                            operator = test[1];","                            if (getters[test[0]]) {","                                value = getters[test[0]](tmpNode, test[0]);","                            } else {","                                value = tmpNode[test[0]];","                                if (test[0] === 'tagName' && !Selector._isXML) {","                                    value = value.toUpperCase();    ","                                }","                                if (typeof value != 'string' && value !== undefined && value.toString) {","                                    value = value.toString(); // coerce for comparison","                                } else if (value === undefined && tmpNode.getAttribute) {","                                    // use getAttribute for non-standard attributes","                                    value = tmpNode.getAttribute(test[0], 2); // 2 === force string for IE","                                }","                            }","","                            if ((operator === '=' && value !== test[2]) ||  // fast path for equality","                                (typeof operator !== 'string' && // protect against String.test monkey-patch (Moo)","                                operator.test && !operator.test(value)) ||  // regex test","                                (!operator.test && // protect against RegExp as function (webkit)","                                        typeof operator === 'function' && !operator(tmpNode, test[0], test[2]))) { // function test","","                                // skip non element nodes or non-matching tags","                                if ((tmpNode = tmpNode[path])) {","                                    while (tmpNode &&","                                        (!tmpNode.tagName ||","                                            (token.tagName && token.tagName !== tmpNode.tagName))","                                    ) {","                                        tmpNode = tmpNode[path]; ","                                    }","                                }","                                continue testLoop;","                            }","                        }","                    }","","                    n--; // move to next token","                    // now that we've passed the test, move up the tree by combinator","                    if (!pass && (combinator = token.combinator)) {","                        path = combinator.axis;","                        tmpNode = tmpNode[path];","","                        // skip non element nodes","                        while (tmpNode && !tmpNode.tagName) {","                            tmpNode = tmpNode[path]; ","                        }","","                        if (combinator.direct) { // one pass only","                            path = null; ","                        }","","                    } else { // success if we made it this far","                        result.push(node);","                        if (firstOnly) {","                            return result;","                        }","                        break;","                    }","                }","            }","            node = tmpNode = null;","            return result;","        },","","        combinators: {","            ' ': {","                axis: 'parentNode'","            },","","            '>': {","                axis: 'parentNode',","                direct: true","            },","","","            '+': {","                axis: 'previousSibling',","                direct: true","            }","        },","","        _parsers: [","            {","                name: ATTRIBUTES,","                re: /^\\uE003(-?[a-z]+[\\w\\-]*)+([~\\|\\^\\$\\*!=]=?)?['\"]?([^\\uE004'\"]*)['\"]?\\uE004/i,","                fn: function(match, token) {","                    var operator = match[2] || '',","                        operators = Selector.operators,","                        escVal = (match[3]) ? match[3].replace(/\\\\/g, '') : '',","                        test;","","                    // add prefiltering for ID and CLASS","                    if ((match[1] === 'id' && operator === '=') ||","                            (match[1] === 'className' &&","                            Y.config.doc.documentElement.getElementsByClassName &&","                            (operator === '~=' || operator === '='))) {","                        token.prefilter = match[1];","","","                        match[3] = escVal; ","","                        // escape all but ID for prefilter, which may run through QSA (via Dom.allById)","                        token[match[1]] = (match[1] === 'id') ? match[3] : escVal;","","                    }","","                    // add tests","                    if (operator in operators) {","                        test = operators[operator];","                        if (typeof test === 'string') {","                            match[3] = escVal.replace(Selector._reRegExpTokens, '\\\\$1');","                            test = new RegExp(test.replace('{val}', match[3]));","                        }","                        match[2] = test;","                    }","                    if (!token.last || token.prefilter !== match[1]) {","                        return match.slice(1);","                    }","                }","            },","            {","                name: TAG_NAME,","                re: /^((?:-?[_a-z]+[\\w-]*)|\\*)/i,","                fn: function(match, token) {","                    var tag = match[1];","","                    if (!Selector._isXML) {","                        tag = tag.toUpperCase();","                    }","","                    token.tagName = tag;","","                    if (tag !== '*' && (!token.last || token.prefilter)) {","                        return [TAG_NAME, '=', tag];","                    }","                    if (!token.prefilter) {","                        token.prefilter = 'tagName';","                    }","                }","            },","            {","                name: COMBINATOR,","                re: /^\\s*([>+~]|\\s)\\s*/,","                fn: function(match, token) {","                }","            },","            {","                name: PSEUDOS,","                re: /^:([\\-\\w]+)(?:\\uE005['\"]?([^\\uE005]*)['\"]?\\uE006)*/i,","                fn: function(match, token) {","                    var test = Selector[PSEUDOS][match[1]];","                    if (test) { // reorder match array and unescape special chars for tests","                        if (match[2]) {","                            match[2] = match[2].replace(/\\\\/g, '');","                        }","                        return [match[2], test]; ","                    } else { // selector token not supported (possibly missing CSS3 module)","                        return false;","                    }","                }","            }","            ],","","        _getToken: function(token) {","            return {","                tagName: null,","                id: null,","                className: null,","                attributes: {},","                combinator: null,","                tests: []","            };","        },","","        /*","            Break selector into token units per simple selector.","            Combinator is attached to the previous token.","         */","        _tokenize: function(selector) {","            selector = selector || '';","            selector = Selector._parseSelector(Y.Lang.trim(selector)); ","            var token = Selector._getToken(),     // one token per simple selector (left selector holds combinator)","                query = selector, // original query for debug report","                tokens = [],    // array of tokens","                found = false,  // whether or not any matches were found this pass","                match,         // the regex match","                test,","                i, parser;","","            /*","                Search for selector patterns, store, and strip them from the selector string","                until no patterns match (invalid selector) or we run out of chars.","","                Multiple attributes and pseudos are allowed, in any order.","                for example:","                    'form:first-child[type=button]:not(button)[lang|=en]'","            */","            outer:","            do {","                found = false; // reset after full pass","                for (i = 0; (parser = Selector._parsers[i++]);) {","                    if ( (match = parser.re.exec(selector)) ) { // note assignment","                        if (parser.name !== COMBINATOR ) {","                            token.selector = selector;","                        }","                        selector = selector.replace(match[0], ''); // strip current match from selector","                        if (!selector.length) {","                            token.last = true;","                        }","","                        if (Selector._attrFilters[match[1]]) { // convert class to className, etc.","                            match[1] = Selector._attrFilters[match[1]];","                        }","","                        test = parser.fn(match, token);","                        if (test === false) { // selector not supported","                            found = false;","                            break outer;","                        } else if (test) {","                            token.tests.push(test);","                        }","","                        if (!selector.length || parser.name === COMBINATOR) {","                            tokens.push(token);","                            token = Selector._getToken(token);","                            if (parser.name === COMBINATOR) {","                                token.combinator = Y.Selector.combinators[match[1]];","                            }","                        }","                        found = true;","                    }","                }","            } while (found && selector.length);","","            if (!found || selector.length) { // not fully parsed","                tokens = [];","            }","            return tokens;","        },","","        _replaceMarkers: function(selector) {","            selector = selector.replace(/\\[/g, '\\uE003');","            selector = selector.replace(/\\]/g, '\\uE004');","","            selector = selector.replace(/\\(/g, '\\uE005');","            selector = selector.replace(/\\)/g, '\\uE006');","            return selector;","        },","","        _replaceShorthand: function(selector) {","            var shorthand = Y.Selector.shorthand,","                re;","","            for (re in shorthand) {","                if (shorthand.hasOwnProperty(re)) {","                    selector = selector.replace(new RegExp(re, 'gi'), shorthand[re]);","                }","            }","","            return selector;","        },","","        _parseSelector: function(selector) {","            var replaced = Y.Selector._replaceSelector(selector),","                selector = replaced.selector;","","            // replace shorthand (\".foo, #bar\") after pseudos and attrs","            // to avoid replacing unescaped chars","            selector = Y.Selector._replaceShorthand(selector);","","            selector = Y.Selector._restore('attr', selector, replaced.attrs);","            selector = Y.Selector._restore('pseudo', selector, replaced.pseudos);","","            // replace braces and parens before restoring escaped chars","            // to avoid replacing ecaped markers","            selector = Y.Selector._replaceMarkers(selector);","            selector = Y.Selector._restore('esc', selector, replaced.esc);","","            return selector;","        },","","        _attrFilters: {","            'class': 'className',","            'for': 'htmlFor'","        },","","        getters: {","            href: function(node, attr) {","                return Y.DOM.getAttribute(node, attr);","            },","","            id: function(node, attr) {","                return Y.DOM.getId(node);","            }","        }","    };","","Y.mix(Y.Selector, SelectorCSS2, true);","Y.Selector.getters.src = Y.Selector.getters.rel = Y.Selector.getters.href;","","// IE wants class with native queries","if (Y.Selector.useNative && Y.config.doc.querySelector) {","    Y.Selector.shorthand['\\\\.(-?[_a-z]+[-\\\\w]*)'] = '[class~=$1]';","}","","","}, '@VERSION@', {\"requires\": [\"selector-native\"]});"];
_yuitest_coverage["build/selector-css2/selector-css2.js"].lines = {"1":0,"14":0,"28":0,"29":0,"49":0,"56":0,"61":0,"73":0,"75":0,"76":0,"77":0,"79":0,"82":0,"83":0,"85":0,"86":0,"88":0,"92":0,"93":0,"94":0,"95":0,"96":0,"100":0,"101":0,"105":0,"106":0,"110":0,"111":0,"116":0,"117":0,"121":0,"125":0,"142":0,"143":0,"144":0,"146":0,"147":0,"148":0,"149":0,"150":0,"151":0,"152":0,"153":0,"154":0,"155":0,"157":0,"158":0,"159":0,"161":0,"162":0,"163":0,"165":0,"169":0,"176":0,"177":0,"181":0,"184":0,"189":0,"191":0,"192":0,"193":0,"196":0,"197":0,"200":0,"201":0,"205":0,"206":0,"207":0,"209":0,"213":0,"214":0,"239":0,"245":0,"249":0,"252":0,"255":0,"260":0,"261":0,"262":0,"263":0,"264":0,"266":0,"268":0,"269":0,"277":0,"279":0,"280":0,"283":0,"285":0,"286":0,"288":0,"289":0,"303":0,"304":0,"305":0,"306":0,"308":0,"310":0,"317":0,"332":0,"333":0,"334":0,"350":0,"351":0,"352":0,"353":0,"354":0,"355":0,"356":0,"358":0,"359":0,"360":0,"363":0,"364":0,"367":0,"368":0,"369":0,"370":0,"371":0,"372":0,"375":0,"376":0,"377":0,"378":0,"379":0,"382":0,"387":0,"388":0,"390":0,"394":0,"395":0,"397":0,"398":0,"399":0,"403":0,"406":0,"407":0,"408":0,"412":0,"416":0,"421":0,"423":0,"424":0,"428":0,"429":0,"431":0,"441":0,"445":0,"450":0,"451":0,"454":0,"455":0};
_yuitest_coverage["build/selector-css2/selector-css2.js"].functions = {"(anonymous 2):27":0,"\'\':49":0,"\'first-child\':55":0,"_bruteQuery:60":0,"_filterNodes:124":0,"fn:238":0,"fn:276":0,"fn:302":0,"_getToken:316":0,"_tokenize:331":0,"_replaceMarkers:393":0,"_replaceShorthand:402":0,"_parseSelector:415":0,"href:440":0,"id:444":0,"(anonymous 1):1":0};
_yuitest_coverage["build/selector-css2/selector-css2.js"].coveredLines = 152;
_yuitest_coverage["build/selector-css2/selector-css2.js"].coveredFunctions = 16;
_yuitest_coverline("build/selector-css2/selector-css2.js", 1);
YUI.add('selector-css2', function (Y, NAME) {

/**
 * The selector module provides helper methods allowing CSS2 Selectors to be used with DOM elements.
 * @module dom
 * @submodule selector-css2
 * @for Selector
 */

/*
 * Provides helper methods for collecting and filtering DOM elements.
 */

_yuitest_coverfunc("build/selector-css2/selector-css2.js", "(anonymous 1)", 1);
_yuitest_coverline("build/selector-css2/selector-css2.js", 14);
var PARENT_NODE = 'parentNode',
    TAG_NAME = 'tagName',
    ATTRIBUTES = 'attributes',
    COMBINATOR = 'combinator',
    PSEUDOS = 'pseudos',

    Selector = Y.Selector,

    SelectorCSS2 = {
        _reRegExpTokens: /([\^\$\?\[\]\*\+\-\.\(\)\|\\])/,
        SORT_RESULTS: true,

        // TODO: better detection, document specific
        _isXML: (function() {
            _yuitest_coverfunc("build/selector-css2/selector-css2.js", "(anonymous 2)", 27);
_yuitest_coverline("build/selector-css2/selector-css2.js", 28);
var isXML = (Y.config.doc.createElement('div').tagName !== 'DIV');
            _yuitest_coverline("build/selector-css2/selector-css2.js", 29);
return isXML;
        }()),

        /**
         * Mapping of shorthand tokens to corresponding attribute selector 
         * @property shorthand
         * @type object
         */
        shorthand: {
            '\\#(-?[_a-z0-9]+[-\\w\\uE000]*)': '[id=$1]',
            '\\.(-?[_a-z]+[-\\w\\uE000]*)': '[className~=$1]'
        },

        /**
         * List of operators and corresponding boolean functions. 
         * These functions are passed the attribute and the current node's value of the attribute.
         * @property operators
         * @type object
         */
        operators: {
            '': function(node, attr) { _yuitest_coverfunc("build/selector-css2/selector-css2.js", "\'\'", 49);
_yuitest_coverline("build/selector-css2/selector-css2.js", 49);
return Y.DOM.getAttribute(node, attr) !== ''; }, // Just test for existence of attribute
            '~=': '(?:^|\\s+){val}(?:\\s+|$)', // space-delimited
            '|=': '^{val}-?' // optional hyphen-delimited
        },

        pseudos: {
           'first-child': function(node) { 
                _yuitest_coverfunc("build/selector-css2/selector-css2.js", "\'first-child\'", 55);
_yuitest_coverline("build/selector-css2/selector-css2.js", 56);
return Y.DOM._children(node[PARENT_NODE])[0] === node; 
            } 
        },

        _bruteQuery: function(selector, root, firstOnly) {
            _yuitest_coverfunc("build/selector-css2/selector-css2.js", "_bruteQuery", 60);
_yuitest_coverline("build/selector-css2/selector-css2.js", 61);
var ret = [],
                nodes = [],
                visited,
                tokens = Selector._tokenize(selector),
                token = tokens[tokens.length - 1],
                rootDoc = Y.DOM._getDoc(root),
                child,
                id,
                className,
                tagName,
                isUniversal;

            _yuitest_coverline("build/selector-css2/selector-css2.js", 73);
if (token) {
                // prefilter nodes
                _yuitest_coverline("build/selector-css2/selector-css2.js", 75);
id = token.id;
                _yuitest_coverline("build/selector-css2/selector-css2.js", 76);
className = token.className;
                _yuitest_coverline("build/selector-css2/selector-css2.js", 77);
tagName = token.tagName || '*';

                _yuitest_coverline("build/selector-css2/selector-css2.js", 79);
if (root.getElementsByTagName) { // non-IE lacks DOM api on doc frags
                    // try ID first, unless no root.all && root not in document
                    // (root.all works off document, but not getElementById)
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 82);
if (id && (root.all || (root.nodeType === 9 || Y.DOM.inDoc(root)))) {
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 83);
nodes = Y.DOM.allById(id, root);
                    // try className
                    } else {_yuitest_coverline("build/selector-css2/selector-css2.js", 85);
if (className) {
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 86);
nodes = root.getElementsByClassName(className);
                    } else { // default to tagName
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 88);
nodes = root.getElementsByTagName(tagName);
                    }}

                } else { // brute getElementsByTagName()
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 92);
visited = [];
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 93);
child = root.firstChild;
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 94);
isUniversal = tagName === "*";
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 95);
while (child) {
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 96);
while (child) {
                            // IE 6-7 considers comment nodes as element nodes, and gives them the tagName "!".
                            // We can filter them out by checking if its tagName is > "@". 
                            // This also avoids a superflous nodeType === 1 check.
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 100);
if (child.tagName > "@" && (isUniversal || child.tagName === tagName)) {
                                _yuitest_coverline("build/selector-css2/selector-css2.js", 101);
nodes.push(child);
                            }

                            // We may need to traverse back up the tree to find more unvisited subtrees.
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 105);
visited.push(child);
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 106);
child = child.firstChild;
                        }

                        // Find the most recently visited node who has a next sibling.
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 110);
while (visited.length > 0 && !child) {
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 111);
child = visited.pop().nextSibling;
                        }
                    }
                }

                _yuitest_coverline("build/selector-css2/selector-css2.js", 116);
if (nodes.length) {
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 117);
ret = Selector._filterNodes(nodes, tokens, firstOnly);
                }
            }

            _yuitest_coverline("build/selector-css2/selector-css2.js", 121);
return ret;
        },
        
        _filterNodes: function(nodes, tokens, firstOnly) {
            _yuitest_coverfunc("build/selector-css2/selector-css2.js", "_filterNodes", 124);
_yuitest_coverline("build/selector-css2/selector-css2.js", 125);
var i = 0,
                j,
                len = tokens.length,
                n = len - 1,
                result = [],
                node = nodes[0],
                tmpNode = node,
                getters = Y.Selector.getters,
                operator,
                combinator,
                token,
                path,
                pass,
                value,
                tests,
                test;

            _yuitest_coverline("build/selector-css2/selector-css2.js", 142);
for (i = 0; (tmpNode = node = nodes[i++]);) {
                _yuitest_coverline("build/selector-css2/selector-css2.js", 143);
n = len - 1;
                _yuitest_coverline("build/selector-css2/selector-css2.js", 144);
path = null;
                
                _yuitest_coverline("build/selector-css2/selector-css2.js", 146);
testLoop:
                _yuitest_coverline("build/selector-css2/selector-css2.js", 147);
while (tmpNode && tmpNode.tagName) {
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 148);
token = tokens[n];
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 149);
tests = token.tests;
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 150);
j = tests.length;
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 151);
if (j && !pass) {
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 152);
while ((test = tests[--j])) {
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 153);
operator = test[1];
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 154);
if (getters[test[0]]) {
                                _yuitest_coverline("build/selector-css2/selector-css2.js", 155);
value = getters[test[0]](tmpNode, test[0]);
                            } else {
                                _yuitest_coverline("build/selector-css2/selector-css2.js", 157);
value = tmpNode[test[0]];
                                _yuitest_coverline("build/selector-css2/selector-css2.js", 158);
if (test[0] === 'tagName' && !Selector._isXML) {
                                    _yuitest_coverline("build/selector-css2/selector-css2.js", 159);
value = value.toUpperCase();    
                                }
                                _yuitest_coverline("build/selector-css2/selector-css2.js", 161);
if (typeof value != 'string' && value !== undefined && value.toString) {
                                    _yuitest_coverline("build/selector-css2/selector-css2.js", 162);
value = value.toString(); // coerce for comparison
                                } else {_yuitest_coverline("build/selector-css2/selector-css2.js", 163);
if (value === undefined && tmpNode.getAttribute) {
                                    // use getAttribute for non-standard attributes
                                    _yuitest_coverline("build/selector-css2/selector-css2.js", 165);
value = tmpNode.getAttribute(test[0], 2); // 2 === force string for IE
                                }}
                            }

                            _yuitest_coverline("build/selector-css2/selector-css2.js", 169);
if ((operator === '=' && value !== test[2]) ||  // fast path for equality
                                (typeof operator !== 'string' && // protect against String.test monkey-patch (Moo)
                                operator.test && !operator.test(value)) ||  // regex test
                                (!operator.test && // protect against RegExp as function (webkit)
                                        typeof operator === 'function' && !operator(tmpNode, test[0], test[2]))) { // function test

                                // skip non element nodes or non-matching tags
                                _yuitest_coverline("build/selector-css2/selector-css2.js", 176);
if ((tmpNode = tmpNode[path])) {
                                    _yuitest_coverline("build/selector-css2/selector-css2.js", 177);
while (tmpNode &&
                                        (!tmpNode.tagName ||
                                            (token.tagName && token.tagName !== tmpNode.tagName))
                                    ) {
                                        _yuitest_coverline("build/selector-css2/selector-css2.js", 181);
tmpNode = tmpNode[path]; 
                                    }
                                }
                                _yuitest_coverline("build/selector-css2/selector-css2.js", 184);
continue testLoop;
                            }
                        }
                    }

                    _yuitest_coverline("build/selector-css2/selector-css2.js", 189);
n--; // move to next token
                    // now that we've passed the test, move up the tree by combinator
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 191);
if (!pass && (combinator = token.combinator)) {
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 192);
path = combinator.axis;
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 193);
tmpNode = tmpNode[path];

                        // skip non element nodes
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 196);
while (tmpNode && !tmpNode.tagName) {
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 197);
tmpNode = tmpNode[path]; 
                        }

                        _yuitest_coverline("build/selector-css2/selector-css2.js", 200);
if (combinator.direct) { // one pass only
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 201);
path = null; 
                        }

                    } else { // success if we made it this far
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 205);
result.push(node);
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 206);
if (firstOnly) {
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 207);
return result;
                        }
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 209);
break;
                    }
                }
            }
            _yuitest_coverline("build/selector-css2/selector-css2.js", 213);
node = tmpNode = null;
            _yuitest_coverline("build/selector-css2/selector-css2.js", 214);
return result;
        },

        combinators: {
            ' ': {
                axis: 'parentNode'
            },

            '>': {
                axis: 'parentNode',
                direct: true
            },


            '+': {
                axis: 'previousSibling',
                direct: true
            }
        },

        _parsers: [
            {
                name: ATTRIBUTES,
                re: /^\uE003(-?[a-z]+[\w\-]*)+([~\|\^\$\*!=]=?)?['"]?([^\uE004'"]*)['"]?\uE004/i,
                fn: function(match, token) {
                    _yuitest_coverfunc("build/selector-css2/selector-css2.js", "fn", 238);
_yuitest_coverline("build/selector-css2/selector-css2.js", 239);
var operator = match[2] || '',
                        operators = Selector.operators,
                        escVal = (match[3]) ? match[3].replace(/\\/g, '') : '',
                        test;

                    // add prefiltering for ID and CLASS
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 245);
if ((match[1] === 'id' && operator === '=') ||
                            (match[1] === 'className' &&
                            Y.config.doc.documentElement.getElementsByClassName &&
                            (operator === '~=' || operator === '='))) {
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 249);
token.prefilter = match[1];


                        _yuitest_coverline("build/selector-css2/selector-css2.js", 252);
match[3] = escVal; 

                        // escape all but ID for prefilter, which may run through QSA (via Dom.allById)
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 255);
token[match[1]] = (match[1] === 'id') ? match[3] : escVal;

                    }

                    // add tests
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 260);
if (operator in operators) {
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 261);
test = operators[operator];
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 262);
if (typeof test === 'string') {
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 263);
match[3] = escVal.replace(Selector._reRegExpTokens, '\\$1');
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 264);
test = new RegExp(test.replace('{val}', match[3]));
                        }
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 266);
match[2] = test;
                    }
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 268);
if (!token.last || token.prefilter !== match[1]) {
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 269);
return match.slice(1);
                    }
                }
            },
            {
                name: TAG_NAME,
                re: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
                fn: function(match, token) {
                    _yuitest_coverfunc("build/selector-css2/selector-css2.js", "fn", 276);
_yuitest_coverline("build/selector-css2/selector-css2.js", 277);
var tag = match[1];

                    _yuitest_coverline("build/selector-css2/selector-css2.js", 279);
if (!Selector._isXML) {
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 280);
tag = tag.toUpperCase();
                    }

                    _yuitest_coverline("build/selector-css2/selector-css2.js", 283);
token.tagName = tag;

                    _yuitest_coverline("build/selector-css2/selector-css2.js", 285);
if (tag !== '*' && (!token.last || token.prefilter)) {
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 286);
return [TAG_NAME, '=', tag];
                    }
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 288);
if (!token.prefilter) {
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 289);
token.prefilter = 'tagName';
                    }
                }
            },
            {
                name: COMBINATOR,
                re: /^\s*([>+~]|\s)\s*/,
                fn: function(match, token) {
                }
            },
            {
                name: PSEUDOS,
                re: /^:([\-\w]+)(?:\uE005['"]?([^\uE005]*)['"]?\uE006)*/i,
                fn: function(match, token) {
                    _yuitest_coverfunc("build/selector-css2/selector-css2.js", "fn", 302);
_yuitest_coverline("build/selector-css2/selector-css2.js", 303);
var test = Selector[PSEUDOS][match[1]];
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 304);
if (test) { // reorder match array and unescape special chars for tests
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 305);
if (match[2]) {
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 306);
match[2] = match[2].replace(/\\/g, '');
                        }
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 308);
return [match[2], test]; 
                    } else { // selector token not supported (possibly missing CSS3 module)
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 310);
return false;
                    }
                }
            }
            ],

        _getToken: function(token) {
            _yuitest_coverfunc("build/selector-css2/selector-css2.js", "_getToken", 316);
_yuitest_coverline("build/selector-css2/selector-css2.js", 317);
return {
                tagName: null,
                id: null,
                className: null,
                attributes: {},
                combinator: null,
                tests: []
            };
        },

        /*
            Break selector into token units per simple selector.
            Combinator is attached to the previous token.
         */
        _tokenize: function(selector) {
            _yuitest_coverfunc("build/selector-css2/selector-css2.js", "_tokenize", 331);
_yuitest_coverline("build/selector-css2/selector-css2.js", 332);
selector = selector || '';
            _yuitest_coverline("build/selector-css2/selector-css2.js", 333);
selector = Selector._parseSelector(Y.Lang.trim(selector)); 
            _yuitest_coverline("build/selector-css2/selector-css2.js", 334);
var token = Selector._getToken(),     // one token per simple selector (left selector holds combinator)
                query = selector, // original query for debug report
                tokens = [],    // array of tokens
                found = false,  // whether or not any matches were found this pass
                match,         // the regex match
                test,
                i, parser;

            /*
                Search for selector patterns, store, and strip them from the selector string
                until no patterns match (invalid selector) or we run out of chars.

                Multiple attributes and pseudos are allowed, in any order.
                for example:
                    'form:first-child[type=button]:not(button)[lang|=en]'
            */
            _yuitest_coverline("build/selector-css2/selector-css2.js", 350);
outer:
            _yuitest_coverline("build/selector-css2/selector-css2.js", 351);
do {
                _yuitest_coverline("build/selector-css2/selector-css2.js", 352);
found = false; // reset after full pass
                _yuitest_coverline("build/selector-css2/selector-css2.js", 353);
for (i = 0; (parser = Selector._parsers[i++]);) {
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 354);
if ( (match = parser.re.exec(selector)) ) { // note assignment
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 355);
if (parser.name !== COMBINATOR ) {
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 356);
token.selector = selector;
                        }
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 358);
selector = selector.replace(match[0], ''); // strip current match from selector
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 359);
if (!selector.length) {
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 360);
token.last = true;
                        }

                        _yuitest_coverline("build/selector-css2/selector-css2.js", 363);
if (Selector._attrFilters[match[1]]) { // convert class to className, etc.
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 364);
match[1] = Selector._attrFilters[match[1]];
                        }

                        _yuitest_coverline("build/selector-css2/selector-css2.js", 367);
test = parser.fn(match, token);
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 368);
if (test === false) { // selector not supported
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 369);
found = false;
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 370);
break outer;
                        } else {_yuitest_coverline("build/selector-css2/selector-css2.js", 371);
if (test) {
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 372);
token.tests.push(test);
                        }}

                        _yuitest_coverline("build/selector-css2/selector-css2.js", 375);
if (!selector.length || parser.name === COMBINATOR) {
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 376);
tokens.push(token);
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 377);
token = Selector._getToken(token);
                            _yuitest_coverline("build/selector-css2/selector-css2.js", 378);
if (parser.name === COMBINATOR) {
                                _yuitest_coverline("build/selector-css2/selector-css2.js", 379);
token.combinator = Y.Selector.combinators[match[1]];
                            }
                        }
                        _yuitest_coverline("build/selector-css2/selector-css2.js", 382);
found = true;
                    }
                }
            }while (found && selector.length);

            _yuitest_coverline("build/selector-css2/selector-css2.js", 387);
if (!found || selector.length) { // not fully parsed
                _yuitest_coverline("build/selector-css2/selector-css2.js", 388);
tokens = [];
            }
            _yuitest_coverline("build/selector-css2/selector-css2.js", 390);
return tokens;
        },

        _replaceMarkers: function(selector) {
            _yuitest_coverfunc("build/selector-css2/selector-css2.js", "_replaceMarkers", 393);
_yuitest_coverline("build/selector-css2/selector-css2.js", 394);
selector = selector.replace(/\[/g, '\uE003');
            _yuitest_coverline("build/selector-css2/selector-css2.js", 395);
selector = selector.replace(/\]/g, '\uE004');

            _yuitest_coverline("build/selector-css2/selector-css2.js", 397);
selector = selector.replace(/\(/g, '\uE005');
            _yuitest_coverline("build/selector-css2/selector-css2.js", 398);
selector = selector.replace(/\)/g, '\uE006');
            _yuitest_coverline("build/selector-css2/selector-css2.js", 399);
return selector;
        },

        _replaceShorthand: function(selector) {
            _yuitest_coverfunc("build/selector-css2/selector-css2.js", "_replaceShorthand", 402);
_yuitest_coverline("build/selector-css2/selector-css2.js", 403);
var shorthand = Y.Selector.shorthand,
                re;

            _yuitest_coverline("build/selector-css2/selector-css2.js", 406);
for (re in shorthand) {
                _yuitest_coverline("build/selector-css2/selector-css2.js", 407);
if (shorthand.hasOwnProperty(re)) {
                    _yuitest_coverline("build/selector-css2/selector-css2.js", 408);
selector = selector.replace(new RegExp(re, 'gi'), shorthand[re]);
                }
            }

            _yuitest_coverline("build/selector-css2/selector-css2.js", 412);
return selector;
        },

        _parseSelector: function(selector) {
            _yuitest_coverfunc("build/selector-css2/selector-css2.js", "_parseSelector", 415);
_yuitest_coverline("build/selector-css2/selector-css2.js", 416);
var replaced = Y.Selector._replaceSelector(selector),
                selector = replaced.selector;

            // replace shorthand (".foo, #bar") after pseudos and attrs
            // to avoid replacing unescaped chars
            _yuitest_coverline("build/selector-css2/selector-css2.js", 421);
selector = Y.Selector._replaceShorthand(selector);

            _yuitest_coverline("build/selector-css2/selector-css2.js", 423);
selector = Y.Selector._restore('attr', selector, replaced.attrs);
            _yuitest_coverline("build/selector-css2/selector-css2.js", 424);
selector = Y.Selector._restore('pseudo', selector, replaced.pseudos);

            // replace braces and parens before restoring escaped chars
            // to avoid replacing ecaped markers
            _yuitest_coverline("build/selector-css2/selector-css2.js", 428);
selector = Y.Selector._replaceMarkers(selector);
            _yuitest_coverline("build/selector-css2/selector-css2.js", 429);
selector = Y.Selector._restore('esc', selector, replaced.esc);

            _yuitest_coverline("build/selector-css2/selector-css2.js", 431);
return selector;
        },

        _attrFilters: {
            'class': 'className',
            'for': 'htmlFor'
        },

        getters: {
            href: function(node, attr) {
                _yuitest_coverfunc("build/selector-css2/selector-css2.js", "href", 440);
_yuitest_coverline("build/selector-css2/selector-css2.js", 441);
return Y.DOM.getAttribute(node, attr);
            },

            id: function(node, attr) {
                _yuitest_coverfunc("build/selector-css2/selector-css2.js", "id", 444);
_yuitest_coverline("build/selector-css2/selector-css2.js", 445);
return Y.DOM.getId(node);
            }
        }
    };

_yuitest_coverline("build/selector-css2/selector-css2.js", 450);
Y.mix(Y.Selector, SelectorCSS2, true);
_yuitest_coverline("build/selector-css2/selector-css2.js", 451);
Y.Selector.getters.src = Y.Selector.getters.rel = Y.Selector.getters.href;

// IE wants class with native queries
_yuitest_coverline("build/selector-css2/selector-css2.js", 454);
if (Y.Selector.useNative && Y.config.doc.querySelector) {
    _yuitest_coverline("build/selector-css2/selector-css2.js", 455);
Y.Selector.shorthand['\\.(-?[_a-z]+[-\\w]*)'] = '[class~=$1]';
}


}, '@VERSION@', {"requires": ["selector-native"]});
