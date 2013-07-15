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
_yuitest_coverage["build/paginator-core/paginator-core.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/paginator-core/paginator-core.js",
    code: []
};
_yuitest_coverage["build/paginator-core/paginator-core.js"].code=["YUI.add('paginator-core', function (Y, NAME) {","","/**"," Paginator's core functionality consists of keeping track of the current page"," being displayed and providing information for previous and next pages.",""," @module paginator"," @submodule paginator-core"," @since 3.11.0"," */","","/**"," _API docs for this extension are included in the Paginator class._",""," Class extension providing the core API and structure for the Paginator module.",""," Use this class extension with Widget or another Base-based superclass to"," create the basic Paginator model API and composing class structure.",""," @class Paginator.Core"," @for Paginator"," @since 3.11.0"," */","","var PaginatorCore = Y.namespace('Paginator').Core = function () {};","","PaginatorCore.ATTRS = {","    /**","     Current page count. First page is 1.","","     @attribute page","     @type Number","     @default 1","     **/","    page: {","        value: 1","    },","","    /**","     Total number of pages to display","","     @readOnly","     @attribute totalPages","     @type Number","     **/","    totalPages: {","        readOnly: true,","        getter: '_getTotalPagesFn'","    },","","    /**","     Maximum number of items per page. A value of negative one (-1) indicates","         all items on one page.","","     @attribute itemsPerPage","     @type Number","     @default 10","     **/","    itemsPerPage: {","        value: 10","    },","","    /**","     Total number of items in all pages.","","     @attribute totalItems","     @type Number","     @default 0","     **/","    totalItems: {","        value: 0","    }","};","","Y.mix(PaginatorCore.prototype, {","    /**","     Sets the page to the previous page in the set, if there is a previous page.","     @method prevPage","     @chainable","     */","    prevPage: function () {","        if (this.hasPrevPage()) {","            this.set('page', this.get('page') - 1);","        }","","        return this;","    },","","    /**","     Sets the page to the next page in the set, if there is a next page.","","     @method nextPage","     @chainable","     */","    nextPage: function () {","        if (this.hasNextPage()) {","            this.set('page', this.get('page') + 1);","        }","","        return this;","    },","","    /**","     Returns True if there is a previous page in the set.","","     @method hasPrevPage","     @return {Boolean} `true` if there is a previous page, `false` otherwise.","     */","    hasPrevPage: function () {","        return this.get('page') > 1;","    },","","    /**","     Returns True if there is a next page in the set.","","     If totalItems isn't set, assume there is always next page.","","     @method hasNextPage","     @return {Boolean} `true` if there is a next page, `false` otherwise.","     */","    hasNextPage: function () {","        return (!this.get('totalItems') || this.get('page') < this.get('totalPages'));","    },","","","    //--- P R O T E C T E D","","    /**","     Returns the total number of pages based on the total number of","       items provided and the number of items per page","","     @protected","     @method _getTotalPagesFn","     @return {Number} Total number of pages based on total number of items and","       items per page or one if itemsPerPage is less than one","     */","    _getTotalPagesFn: function () {","        var itemsPerPage = this.get('itemsPerPage');","","        return (itemsPerPage < 1) ? 1 : Math.ceil(this.get('totalItems') / itemsPerPage);","    }","});","","","","}, '@VERSION@', {\"requires\": [\"base\"]});"];
_yuitest_coverage["build/paginator-core/paginator-core.js"].lines = {"1":0,"25":0,"27":0,"75":0,"82":0,"83":0,"86":0,"96":0,"97":0,"100":0,"110":0,"122":0,"138":0,"140":0};
_yuitest_coverage["build/paginator-core/paginator-core.js"].functions = {"prevPage:81":0,"nextPage:95":0,"hasPrevPage:109":0,"hasNextPage:121":0,"_getTotalPagesFn:137":0,"(anonymous 1):1":0};
_yuitest_coverage["build/paginator-core/paginator-core.js"].coveredLines = 14;
_yuitest_coverage["build/paginator-core/paginator-core.js"].coveredFunctions = 6;
_yuitest_coverline("build/paginator-core/paginator-core.js", 1);
YUI.add('paginator-core', function (Y, NAME) {

/**
 Paginator's core functionality consists of keeping track of the current page
 being displayed and providing information for previous and next pages.

 @module paginator
 @submodule paginator-core
 @since 3.11.0
 */

/**
 _API docs for this extension are included in the Paginator class._

 Class extension providing the core API and structure for the Paginator module.

 Use this class extension with Widget or another Base-based superclass to
 create the basic Paginator model API and composing class structure.

 @class Paginator.Core
 @for Paginator
 @since 3.11.0
 */

_yuitest_coverfunc("build/paginator-core/paginator-core.js", "(anonymous 1)", 1);
_yuitest_coverline("build/paginator-core/paginator-core.js", 25);
var PaginatorCore = Y.namespace('Paginator').Core = function () {};

_yuitest_coverline("build/paginator-core/paginator-core.js", 27);
PaginatorCore.ATTRS = {
    /**
     Current page count. First page is 1.

     @attribute page
     @type Number
     @default 1
     **/
    page: {
        value: 1
    },

    /**
     Total number of pages to display

     @readOnly
     @attribute totalPages
     @type Number
     **/
    totalPages: {
        readOnly: true,
        getter: '_getTotalPagesFn'
    },

    /**
     Maximum number of items per page. A value of negative one (-1) indicates
         all items on one page.

     @attribute itemsPerPage
     @type Number
     @default 10
     **/
    itemsPerPage: {
        value: 10
    },

    /**
     Total number of items in all pages.

     @attribute totalItems
     @type Number
     @default 0
     **/
    totalItems: {
        value: 0
    }
};

_yuitest_coverline("build/paginator-core/paginator-core.js", 75);
Y.mix(PaginatorCore.prototype, {
    /**
     Sets the page to the previous page in the set, if there is a previous page.
     @method prevPage
     @chainable
     */
    prevPage: function () {
        _yuitest_coverfunc("build/paginator-core/paginator-core.js", "prevPage", 81);
_yuitest_coverline("build/paginator-core/paginator-core.js", 82);
if (this.hasPrevPage()) {
            _yuitest_coverline("build/paginator-core/paginator-core.js", 83);
this.set('page', this.get('page') - 1);
        }

        _yuitest_coverline("build/paginator-core/paginator-core.js", 86);
return this;
    },

    /**
     Sets the page to the next page in the set, if there is a next page.

     @method nextPage
     @chainable
     */
    nextPage: function () {
        _yuitest_coverfunc("build/paginator-core/paginator-core.js", "nextPage", 95);
_yuitest_coverline("build/paginator-core/paginator-core.js", 96);
if (this.hasNextPage()) {
            _yuitest_coverline("build/paginator-core/paginator-core.js", 97);
this.set('page', this.get('page') + 1);
        }

        _yuitest_coverline("build/paginator-core/paginator-core.js", 100);
return this;
    },

    /**
     Returns True if there is a previous page in the set.

     @method hasPrevPage
     @return {Boolean} `true` if there is a previous page, `false` otherwise.
     */
    hasPrevPage: function () {
        _yuitest_coverfunc("build/paginator-core/paginator-core.js", "hasPrevPage", 109);
_yuitest_coverline("build/paginator-core/paginator-core.js", 110);
return this.get('page') > 1;
    },

    /**
     Returns True if there is a next page in the set.

     If totalItems isn't set, assume there is always next page.

     @method hasNextPage
     @return {Boolean} `true` if there is a next page, `false` otherwise.
     */
    hasNextPage: function () {
        _yuitest_coverfunc("build/paginator-core/paginator-core.js", "hasNextPage", 121);
_yuitest_coverline("build/paginator-core/paginator-core.js", 122);
return (!this.get('totalItems') || this.get('page') < this.get('totalPages'));
    },


    //--- P R O T E C T E D

    /**
     Returns the total number of pages based on the total number of
       items provided and the number of items per page

     @protected
     @method _getTotalPagesFn
     @return {Number} Total number of pages based on total number of items and
       items per page or one if itemsPerPage is less than one
     */
    _getTotalPagesFn: function () {
        _yuitest_coverfunc("build/paginator-core/paginator-core.js", "_getTotalPagesFn", 137);
_yuitest_coverline("build/paginator-core/paginator-core.js", 138);
var itemsPerPage = this.get('itemsPerPage');

        _yuitest_coverline("build/paginator-core/paginator-core.js", 140);
return (itemsPerPage < 1) ? 1 : Math.ceil(this.get('totalItems') / itemsPerPage);
    }
});



}, '@VERSION@', {"requires": ["base"]});
