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
_yuitest_coverage["build/paginator-url/paginator-url.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/paginator-url/paginator-url.js",
    code: []
};
_yuitest_coverage["build/paginator-url/paginator-url.js"].code=["YUI.add('paginator-url', function (Y, NAME) {","","/**"," Adds in URL options for paginator links.",""," @module paginator"," @submodule paginator-url"," @class Paginator.Url"," @since 3.10.0"," */","","function PaginatorUrl () {}","","PaginatorUrl.ATTRS = {","    /**","    URL to return formatted with the page number. URL uses `Y.Lang.sub` for page number stubstitutions.","","    For example, if the page number is `3`, setting the `pageUrl` to `\"?pg={page}\"`, will result in `?pg=3`","","    @attribute pageUrl","    @type String","    **/","    pageUrl: {}","};","","PaginatorUrl.prototype = {","    /**","     Returns a formated URL for the previous page.","     @method prevPageUrl","     @return {String | null} Formatted URL for the previous page, or `null` if there is no previous page.","     */","    prevPageUrl: function () {","        return (this.hasPrevPage() && this.formatPageUrl(this.get('page') - 1)) || null;","    },","","    /**","     Returns a formated URL for the next page.","     @method nextPageUrl","     @return {String | null} Formatted URL for the next page or `null` if there is no next page.","     */","    nextPageUrl: function () {","        return (this.hasNextPage() && this.formatPageUrl(this.get('page') + 1)) || null;","    },","","    /**","     Returns a formated URL for the provided page number.","     @method formatPageUrl","     @param {Number} [page] Page value to be used in the formatted URL. If empty, page will be the value of the `page` ATTRS.","     @return {String | null} Formatted URL for the page or `null` if there is not a `pageUrl` set.","     */","    formatPageUrl: function (page) {","        var pageUrl = this.get('pageUrl');","        if (pageUrl) {","            return Y.Lang.sub(pageUrl, {","                page: page || this.get('page')","            });","        }","        return null;","    }","};","","Y.namespace('Paginator').Url = PaginatorUrl;","","Y.Base.mix(Y.Paginator, [PaginatorUrl]);","","","}, '@VERSION@', {\"requires\": [\"paginator\"]});"];
_yuitest_coverage["build/paginator-url/paginator-url.js"].lines = {"1":0,"12":0,"14":0,"26":0,"33":0,"42":0,"52":0,"53":0,"54":0,"58":0,"62":0,"64":0};
_yuitest_coverage["build/paginator-url/paginator-url.js"].functions = {"PaginatorUrl:12":0,"prevPageUrl:32":0,"nextPageUrl:41":0,"formatPageUrl:51":0,"(anonymous 1):1":0};
_yuitest_coverage["build/paginator-url/paginator-url.js"].coveredLines = 12;
_yuitest_coverage["build/paginator-url/paginator-url.js"].coveredFunctions = 5;
_yuitest_coverline("build/paginator-url/paginator-url.js", 1);
YUI.add('paginator-url', function (Y, NAME) {

/**
 Adds in URL options for paginator links.

 @module paginator
 @submodule paginator-url
 @class Paginator.Url
 @since 3.10.0
 */

_yuitest_coverfunc("build/paginator-url/paginator-url.js", "(anonymous 1)", 1);
_yuitest_coverline("build/paginator-url/paginator-url.js", 12);
function PaginatorUrl () {}

_yuitest_coverline("build/paginator-url/paginator-url.js", 14);
PaginatorUrl.ATTRS = {
    /**
    URL to return formatted with the page number. URL uses `Y.Lang.sub` for page number stubstitutions.

    For example, if the page number is `3`, setting the `pageUrl` to `"?pg={page}"`, will result in `?pg=3`

    @attribute pageUrl
    @type String
    **/
    pageUrl: {}
};

_yuitest_coverline("build/paginator-url/paginator-url.js", 26);
PaginatorUrl.prototype = {
    /**
     Returns a formated URL for the previous page.
     @method prevPageUrl
     @return {String | null} Formatted URL for the previous page, or `null` if there is no previous page.
     */
    prevPageUrl: function () {
        _yuitest_coverfunc("build/paginator-url/paginator-url.js", "prevPageUrl", 32);
_yuitest_coverline("build/paginator-url/paginator-url.js", 33);
return (this.hasPrevPage() && this.formatPageUrl(this.get('page') - 1)) || null;
    },

    /**
     Returns a formated URL for the next page.
     @method nextPageUrl
     @return {String | null} Formatted URL for the next page or `null` if there is no next page.
     */
    nextPageUrl: function () {
        _yuitest_coverfunc("build/paginator-url/paginator-url.js", "nextPageUrl", 41);
_yuitest_coverline("build/paginator-url/paginator-url.js", 42);
return (this.hasNextPage() && this.formatPageUrl(this.get('page') + 1)) || null;
    },

    /**
     Returns a formated URL for the provided page number.
     @method formatPageUrl
     @param {Number} [page] Page value to be used in the formatted URL. If empty, page will be the value of the `page` ATTRS.
     @return {String | null} Formatted URL for the page or `null` if there is not a `pageUrl` set.
     */
    formatPageUrl: function (page) {
        _yuitest_coverfunc("build/paginator-url/paginator-url.js", "formatPageUrl", 51);
_yuitest_coverline("build/paginator-url/paginator-url.js", 52);
var pageUrl = this.get('pageUrl');
        _yuitest_coverline("build/paginator-url/paginator-url.js", 53);
if (pageUrl) {
            _yuitest_coverline("build/paginator-url/paginator-url.js", 54);
return Y.Lang.sub(pageUrl, {
                page: page || this.get('page')
            });
        }
        _yuitest_coverline("build/paginator-url/paginator-url.js", 58);
return null;
    }
};

_yuitest_coverline("build/paginator-url/paginator-url.js", 62);
Y.namespace('Paginator').Url = PaginatorUrl;

_yuitest_coverline("build/paginator-url/paginator-url.js", 64);
Y.Base.mix(Y.Paginator, [PaginatorUrl]);


}, '@VERSION@', {"requires": ["paginator"]});
