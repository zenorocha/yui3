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
_yuitest_coverage["build/tabview/tabview.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/tabview/tabview.js",
    code: []
};
_yuitest_coverage["build/tabview/tabview.js"].code=["YUI.add('tabview', function (Y, NAME) {","","/**"," * The TabView module"," *"," * @module tabview"," */","","var DOT = '.',","","    /**","     * Provides a tabbed widget interface","     * @param config {Object} Object literal specifying tabview configuration properties.","     *","     * @class TabView","     * @constructor","     * @extends Widget","     * @uses WidgetParent","     */","    TabView = Y.Base.create('tabView', Y.Widget, [Y.WidgetParent], {","","    _afterChildAdded: function() {","        this.get('contentBox').focusManager.refresh();","    },","","    _defListNodeValueFn: function() {","        var node = Y.Node.create(this.LIST_TEMPLATE);","","        node.addClass(Y.TabviewBase._classNames.tabviewList);","","        return node;","    },","","    _defPanelNodeValueFn: function() {","        var node = Y.Node.create(this.PANEL_TEMPLATE);","","        node.addClass(Y.TabviewBase._classNames.tabviewPanel);","","        return node;","    },","","    _afterChildRemoved: function(e) { // update the selected tab when removed","        var i = e.index,","            selection = this.get('selection');","","        if (!selection) { // select previous item if selection removed","            selection = this.item(i - 1) || this.item(0);","            if (selection) {","                selection.set('selected', 1);","            }","        }","","        this.get('contentBox').focusManager.refresh();","    },","","    _initAria: function() {","        var contentBox = this.get('contentBox'),","            tablist = contentBox.one(Y.TabviewBase._queries.tabviewList);","","        if (tablist) {","            tablist.setAttrs({","                //'aria-labelledby':","                role: 'tablist'","            });","        }","    },","","    bindUI: function() {","        //  Use the Node Focus Manager to add keyboard support:","        //  Pressing the left and right arrow keys will move focus","        //  among each of the tabs.","","        this.get('contentBox').plug(Y.Plugin.NodeFocusManager, {","                        descendants: DOT + Y.TabviewBase._classNames.tabLabel,","                        keys: { next: 'down:39', // Right arrow","                                previous: 'down:37' },  // Left arrow","                        circular: true","                    });","","        this.after('render', this._setDefSelection);","        this.after('addChild', this._afterChildAdded);","        this.after('removeChild', this._afterChildRemoved);","    },","","    renderUI: function() {","        var contentBox = this.get('contentBox');","        this._renderListBox(contentBox);","        this._renderPanelBox(contentBox);","        this._childrenContainer = this.get('listNode');","        this._renderTabs(contentBox);","    },","","    _setDefSelection: function() {","        //  If no tab is selected, select the first tab.","        var selection = this.get('selection') || this.item(0);","","        this.some(function(tab) {","            if (tab.get('selected')) {","                selection = tab;","                return true;","            }","        });","        if (selection) {","            // TODO: why both needed? (via widgetParent/Child)?","            this.set('selection', selection);","            selection.set('selected', 1);","        }","    },","","    _renderListBox: function(contentBox) {","        var node = this.get('listNode');","        if (!node.inDoc()) {","            contentBox.append(node);","        }","    },","","    _renderPanelBox: function(contentBox) {","        var node = this.get('panelNode');","        if (!node.inDoc()) {","            contentBox.append(node);","        }","    },","","    _renderTabs: function(contentBox) {","        var _classNames = Y.TabviewBase._classNames,","            _queries = Y.TabviewBase._queries,","            tabs = contentBox.all(_queries.tab),","            panelNode = this.get('panelNode'),","            panels = (panelNode) ? this.get('panelNode').get('children') : null,","            tabview = this;","","        if (tabs) { // add classNames and fill in Tab fields from markup when possible","            tabs.addClass(_classNames.tab);","            contentBox.all(_queries.tabLabel).addClass(_classNames.tabLabel);","            contentBox.all(_queries.tabPanel).addClass(_classNames.tabPanel);","","            tabs.each(function(node, i) {","                var panelNode = (panels) ? panels.item(i) : null;","                tabview.add({","                    boundingBox: node,","                    contentBox: node.one(DOT + _classNames.tabLabel),","                    panelNode: panelNode","                });","            });","        }","    }","}, {","    ATTRS: {","        defaultChildType: {","            value: 'Tab'","        },","","        listNode: {","            setter: function(node) {","                node = Y.one(node);","                if (node) {","                    node.addClass(Y.TabviewBase._classNames.tabviewList);","                }","                return node;","            },","","            valueFn: '_defListNodeValueFn'","        },","","        panelNode: {","            setter: function(node) {","                node = Y.one(node);","                if (node) {","                    node.addClass(Y.TabviewBase._classNames.tabviewPanel);","                }","                return node;","            },","","            valueFn: '_defPanelNodeValueFn'","        },","","        tabIndex: {","            value: null","            //validator: '_validTabIndex'","        }","    },","","    HTML_PARSER: {","        listNode: function(srcNode) {","            return srcNode.one(Y.TabviewBase._queries.tabviewList);","        },","        panelNode: function(srcNode) {","            return srcNode.one(Y.TabviewBase._queries.tabviewPanel);","        }","    },","","    // Static for legacy support.","    LIST_TEMPLATE: '<ul></ul>',","    PANEL_TEMPLATE: '<div></div>'","});","","// Map to static values by default.","TabView.prototype.LIST_TEMPLATE = TabView.LIST_TEMPLATE;","TabView.prototype.PANEL_TEMPLATE = TabView.PANEL_TEMPLATE;","","Y.TabView = TabView;","/**"," * Provides Tab instances for use with TabView"," * @param config {Object} Object literal specifying tabview configuration properties."," *"," * @class Tab"," * @constructor"," * @extends Widget"," * @uses WidgetChild"," */","Y.Tab = Y.Base.create('tab', Y.Widget, [Y.WidgetChild], {","    BOUNDING_TEMPLATE: '<li></li>',","    CONTENT_TEMPLATE: '<a></a>',","    PANEL_TEMPLATE: '<div></div>',","","    _uiSetSelectedPanel: function(selected) {","        this.get('panelNode').toggleClass(Y.TabviewBase._classNames.selectedPanel, selected);","    },","","    _afterTabSelectedChange: function(event) {","       this._uiSetSelectedPanel(event.newVal);","    },","","    _afterParentChange: function(e) {","        if (!e.newVal) {","            this._remove();","        } else {","            this._add();","        }","    },","","    _initAria: function() {","        var anchor = this.get('contentBox'),","            id = anchor.get('id'),","            panel = this.get('panelNode');","","        if (!id) {","            id = Y.guid();","            anchor.set('id', id);","        }","        //  Apply the ARIA roles, states and properties to each tab","        anchor.set('role', 'tab');","        anchor.get('parentNode').set('role', 'presentation');","","        //  Apply the ARIA roles, states and properties to each panel","        panel.setAttrs({","            role: 'tabpanel',","            'aria-labelledby': id","        });","    },","","    syncUI: function() {","        var _classNames = Y.TabviewBase._classNames;","","        this.get('boundingBox').addClass(_classNames.tab);","        this.get('contentBox').addClass(_classNames.tabLabel);","        this.set('label', this.get('label'));","        this.set('content', this.get('content'));","        this._uiSetSelectedPanel(this.get('selected'));","    },","","    bindUI: function() {","       this.after('selectedChange', this._afterTabSelectedChange);","       this.after('parentChange', this._afterParentChange);","    },","","    renderUI: function() {","        this._renderPanel();","        this._initAria();","    },","","    _renderPanel: function() {","        this.get('parent').get('panelNode')","            .appendChild(this.get('panelNode'));","    },","","    _add: function() {","        var parent = this.get('parent').get('contentBox'),","            list = parent.get('listNode'),","            panel = parent.get('panelNode');","","        if (list) {","            list.appendChild(this.get('boundingBox'));","        }","","        if (panel) {","            panel.appendChild(this.get('panelNode'));","        }","    },","","    _remove: function() {","        this.get('boundingBox').remove();","        this.get('panelNode').remove();","    },","","    _onActivate: function(e) {","         if (e.target === this) {","             //  Prevent the browser from navigating to the URL specified by the","             //  anchor's href attribute.","             e.domEvent.preventDefault();","             e.target.set('selected', 1);","         }","    },","","    initializer: function() {","       this.publish(this.get('triggerEvent'), {","           defaultFn: this._onActivate","       });","    },","","    _defLabelGetter: function() {","        return this.get('contentBox').getHTML();","    },","","    _defLabelSetter: function(label) {","        var labelNode = this.get('contentBox');","        if (labelNode.getHTML() !== label) { // Avoid rewriting existing label.","            labelNode.setHTML(label);","        }","        return label;","    },","","    _defContentSetter: function(content) {","        var panel = this.get('panelNode');","        if (panel.getHTML() !== content) { // Avoid rewriting existing content.","            panel.setHTML(content);","        }","        return content;","    },","","    _defContentGetter: function() {","        return this.get('panelNode').getHTML();","    },","","    // find panel by ID mapping from label href","    _defPanelNodeValueFn: function() {","        var _classNames = Y.TabviewBase._classNames,","            href = this.get('contentBox').get('href') || '',","            parent = this.get('parent'),","            hashIndex = href.indexOf('#'),","            panel;","","        href = href.substr(hashIndex);","","        if (href.charAt(0) === '#') { // in-page nav, find by ID","            panel = Y.one(href);","            if (panel) {","                panel.addClass(_classNames.tabPanel);","            }","        }","","        // use the one found by id, or else try matching indices","        if (!panel && parent) {","            panel = parent.get('panelNode')","                    .get('children').item(this.get('index'));","        }","","        if (!panel) { // create if none found","            panel = Y.Node.create(this.PANEL_TEMPLATE);","            panel.addClass(_classNames.tabPanel);","        }","        return panel;","    }","}, {","    ATTRS: {","        /**","         * @attribute triggerEvent","         * @default \"click\"","         * @type String","         */","        triggerEvent: {","            value: 'click'","        },","","        /**","         * @attribute label","         * @type HTML","         */","        label: {","            setter: '_defLabelSetter',","            getter: '_defLabelGetter'","        },","","        /**","         * @attribute content","         * @type HTML","         */","        content: {","            setter: '_defContentSetter',","            getter: '_defContentGetter'","        },","","        /**","         * @attribute panelNode","         * @type Y.Node","         */","        panelNode: {","            setter: function(node) {","                node = Y.one(node);","                if (node) {","                    node.addClass(Y.TabviewBase._classNames.tabPanel);","                }","                return node;","            },","            valueFn: '_defPanelNodeValueFn'","        },","","        tabIndex: {","            value: null,","            validator: '_validTabIndex'","        }","","    },","","    HTML_PARSER: {","        selected: function() {","            var ret = (this.get('boundingBox').hasClass(Y.TabviewBase._classNames.selectedTab)) ?","                        1 : 0;","            return ret;","        }","    }","","});","","","}, '@VERSION@', {","    \"requires\": [","        \"widget\",","        \"widget-parent\",","        \"widget-child\",","        \"tabview-base\",","        \"node-pluginhost\",","        \"node-focusmanager\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/tabview/tabview.js"].lines = {"1":0,"9":0,"23":0,"27":0,"29":0,"31":0,"35":0,"37":0,"39":0,"43":0,"46":0,"47":0,"48":0,"49":0,"53":0,"57":0,"60":0,"61":0,"73":0,"80":0,"81":0,"82":0,"86":0,"87":0,"88":0,"89":0,"90":0,"95":0,"97":0,"98":0,"99":0,"100":0,"103":0,"105":0,"106":0,"111":0,"112":0,"113":0,"118":0,"119":0,"120":0,"125":0,"132":0,"133":0,"134":0,"135":0,"137":0,"138":0,"139":0,"155":0,"156":0,"157":0,"159":0,"167":0,"168":0,"169":0,"171":0,"185":0,"188":0,"198":0,"199":0,"201":0,"211":0,"217":0,"221":0,"225":0,"226":0,"228":0,"233":0,"237":0,"238":0,"239":0,"242":0,"243":0,"246":0,"253":0,"255":0,"256":0,"257":0,"258":0,"259":0,"263":0,"264":0,"268":0,"269":0,"273":0,"278":0,"282":0,"283":0,"286":0,"287":0,"292":0,"293":0,"297":0,"300":0,"301":0,"306":0,"312":0,"316":0,"317":0,"318":0,"320":0,"324":0,"325":0,"326":0,"328":0,"332":0,"337":0,"343":0,"345":0,"346":0,"347":0,"348":0,"353":0,"354":0,"358":0,"359":0,"360":0,"362":0,"399":0,"400":0,"401":0,"403":0,"417":0,"419":0};
_yuitest_coverage["build/tabview/tabview.js"].functions = {"_afterChildAdded:22":0,"_defListNodeValueFn:26":0,"_defPanelNodeValueFn:34":0,"_afterChildRemoved:42":0,"_initAria:56":0,"bindUI:68":0,"renderUI:85":0,"(anonymous 2):97":0,"_setDefSelection:93":0,"_renderListBox:110":0,"_renderPanelBox:117":0,"(anonymous 3):137":0,"_renderTabs:124":0,"setter:154":0,"setter:166":0,"listNode:184":0,"panelNode:187":0,"_uiSetSelectedPanel:216":0,"_afterTabSelectedChange:220":0,"_afterParentChange:224":0,"_initAria:232":0,"syncUI:252":0,"bindUI:262":0,"renderUI:267":0,"_renderPanel:272":0,"_add:277":0,"_remove:291":0,"_onActivate:296":0,"initializer:305":0,"_defLabelGetter:311":0,"_defLabelSetter:315":0,"_defContentSetter:323":0,"_defContentGetter:331":0,"_defPanelNodeValueFn:336":0,"setter:398":0,"selected:416":0,"(anonymous 1):1":0};
_yuitest_coverage["build/tabview/tabview.js"].coveredLines = 125;
_yuitest_coverage["build/tabview/tabview.js"].coveredFunctions = 37;
_yuitest_coverline("build/tabview/tabview.js", 1);
YUI.add('tabview', function (Y, NAME) {

/**
 * The TabView module
 *
 * @module tabview
 */

_yuitest_coverfunc("build/tabview/tabview.js", "(anonymous 1)", 1);
_yuitest_coverline("build/tabview/tabview.js", 9);
var DOT = '.',

    /**
     * Provides a tabbed widget interface
     * @param config {Object} Object literal specifying tabview configuration properties.
     *
     * @class TabView
     * @constructor
     * @extends Widget
     * @uses WidgetParent
     */
    TabView = Y.Base.create('tabView', Y.Widget, [Y.WidgetParent], {

    _afterChildAdded: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_afterChildAdded", 22);
_yuitest_coverline("build/tabview/tabview.js", 23);
this.get('contentBox').focusManager.refresh();
    },

    _defListNodeValueFn: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defListNodeValueFn", 26);
_yuitest_coverline("build/tabview/tabview.js", 27);
var node = Y.Node.create(this.LIST_TEMPLATE);

        _yuitest_coverline("build/tabview/tabview.js", 29);
node.addClass(Y.TabviewBase._classNames.tabviewList);

        _yuitest_coverline("build/tabview/tabview.js", 31);
return node;
    },

    _defPanelNodeValueFn: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defPanelNodeValueFn", 34);
_yuitest_coverline("build/tabview/tabview.js", 35);
var node = Y.Node.create(this.PANEL_TEMPLATE);

        _yuitest_coverline("build/tabview/tabview.js", 37);
node.addClass(Y.TabviewBase._classNames.tabviewPanel);

        _yuitest_coverline("build/tabview/tabview.js", 39);
return node;
    },

    _afterChildRemoved: function(e) { // update the selected tab when removed
        _yuitest_coverfunc("build/tabview/tabview.js", "_afterChildRemoved", 42);
_yuitest_coverline("build/tabview/tabview.js", 43);
var i = e.index,
            selection = this.get('selection');

        _yuitest_coverline("build/tabview/tabview.js", 46);
if (!selection) { // select previous item if selection removed
            _yuitest_coverline("build/tabview/tabview.js", 47);
selection = this.item(i - 1) || this.item(0);
            _yuitest_coverline("build/tabview/tabview.js", 48);
if (selection) {
                _yuitest_coverline("build/tabview/tabview.js", 49);
selection.set('selected', 1);
            }
        }

        _yuitest_coverline("build/tabview/tabview.js", 53);
this.get('contentBox').focusManager.refresh();
    },

    _initAria: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_initAria", 56);
_yuitest_coverline("build/tabview/tabview.js", 57);
var contentBox = this.get('contentBox'),
            tablist = contentBox.one(Y.TabviewBase._queries.tabviewList);

        _yuitest_coverline("build/tabview/tabview.js", 60);
if (tablist) {
            _yuitest_coverline("build/tabview/tabview.js", 61);
tablist.setAttrs({
                //'aria-labelledby':
                role: 'tablist'
            });
        }
    },

    bindUI: function() {
        //  Use the Node Focus Manager to add keyboard support:
        //  Pressing the left and right arrow keys will move focus
        //  among each of the tabs.

        _yuitest_coverfunc("build/tabview/tabview.js", "bindUI", 68);
_yuitest_coverline("build/tabview/tabview.js", 73);
this.get('contentBox').plug(Y.Plugin.NodeFocusManager, {
                        descendants: DOT + Y.TabviewBase._classNames.tabLabel,
                        keys: { next: 'down:39', // Right arrow
                                previous: 'down:37' },  // Left arrow
                        circular: true
                    });

        _yuitest_coverline("build/tabview/tabview.js", 80);
this.after('render', this._setDefSelection);
        _yuitest_coverline("build/tabview/tabview.js", 81);
this.after('addChild', this._afterChildAdded);
        _yuitest_coverline("build/tabview/tabview.js", 82);
this.after('removeChild', this._afterChildRemoved);
    },

    renderUI: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "renderUI", 85);
_yuitest_coverline("build/tabview/tabview.js", 86);
var contentBox = this.get('contentBox');
        _yuitest_coverline("build/tabview/tabview.js", 87);
this._renderListBox(contentBox);
        _yuitest_coverline("build/tabview/tabview.js", 88);
this._renderPanelBox(contentBox);
        _yuitest_coverline("build/tabview/tabview.js", 89);
this._childrenContainer = this.get('listNode');
        _yuitest_coverline("build/tabview/tabview.js", 90);
this._renderTabs(contentBox);
    },

    _setDefSelection: function() {
        //  If no tab is selected, select the first tab.
        _yuitest_coverfunc("build/tabview/tabview.js", "_setDefSelection", 93);
_yuitest_coverline("build/tabview/tabview.js", 95);
var selection = this.get('selection') || this.item(0);

        _yuitest_coverline("build/tabview/tabview.js", 97);
this.some(function(tab) {
            _yuitest_coverfunc("build/tabview/tabview.js", "(anonymous 2)", 97);
_yuitest_coverline("build/tabview/tabview.js", 98);
if (tab.get('selected')) {
                _yuitest_coverline("build/tabview/tabview.js", 99);
selection = tab;
                _yuitest_coverline("build/tabview/tabview.js", 100);
return true;
            }
        });
        _yuitest_coverline("build/tabview/tabview.js", 103);
if (selection) {
            // TODO: why both needed? (via widgetParent/Child)?
            _yuitest_coverline("build/tabview/tabview.js", 105);
this.set('selection', selection);
            _yuitest_coverline("build/tabview/tabview.js", 106);
selection.set('selected', 1);
        }
    },

    _renderListBox: function(contentBox) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_renderListBox", 110);
_yuitest_coverline("build/tabview/tabview.js", 111);
var node = this.get('listNode');
        _yuitest_coverline("build/tabview/tabview.js", 112);
if (!node.inDoc()) {
            _yuitest_coverline("build/tabview/tabview.js", 113);
contentBox.append(node);
        }
    },

    _renderPanelBox: function(contentBox) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_renderPanelBox", 117);
_yuitest_coverline("build/tabview/tabview.js", 118);
var node = this.get('panelNode');
        _yuitest_coverline("build/tabview/tabview.js", 119);
if (!node.inDoc()) {
            _yuitest_coverline("build/tabview/tabview.js", 120);
contentBox.append(node);
        }
    },

    _renderTabs: function(contentBox) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_renderTabs", 124);
_yuitest_coverline("build/tabview/tabview.js", 125);
var _classNames = Y.TabviewBase._classNames,
            _queries = Y.TabviewBase._queries,
            tabs = contentBox.all(_queries.tab),
            panelNode = this.get('panelNode'),
            panels = (panelNode) ? this.get('panelNode').get('children') : null,
            tabview = this;

        _yuitest_coverline("build/tabview/tabview.js", 132);
if (tabs) { // add classNames and fill in Tab fields from markup when possible
            _yuitest_coverline("build/tabview/tabview.js", 133);
tabs.addClass(_classNames.tab);
            _yuitest_coverline("build/tabview/tabview.js", 134);
contentBox.all(_queries.tabLabel).addClass(_classNames.tabLabel);
            _yuitest_coverline("build/tabview/tabview.js", 135);
contentBox.all(_queries.tabPanel).addClass(_classNames.tabPanel);

            _yuitest_coverline("build/tabview/tabview.js", 137);
tabs.each(function(node, i) {
                _yuitest_coverfunc("build/tabview/tabview.js", "(anonymous 3)", 137);
_yuitest_coverline("build/tabview/tabview.js", 138);
var panelNode = (panels) ? panels.item(i) : null;
                _yuitest_coverline("build/tabview/tabview.js", 139);
tabview.add({
                    boundingBox: node,
                    contentBox: node.one(DOT + _classNames.tabLabel),
                    panelNode: panelNode
                });
            });
        }
    }
}, {
    ATTRS: {
        defaultChildType: {
            value: 'Tab'
        },

        listNode: {
            setter: function(node) {
                _yuitest_coverfunc("build/tabview/tabview.js", "setter", 154);
_yuitest_coverline("build/tabview/tabview.js", 155);
node = Y.one(node);
                _yuitest_coverline("build/tabview/tabview.js", 156);
if (node) {
                    _yuitest_coverline("build/tabview/tabview.js", 157);
node.addClass(Y.TabviewBase._classNames.tabviewList);
                }
                _yuitest_coverline("build/tabview/tabview.js", 159);
return node;
            },

            valueFn: '_defListNodeValueFn'
        },

        panelNode: {
            setter: function(node) {
                _yuitest_coverfunc("build/tabview/tabview.js", "setter", 166);
_yuitest_coverline("build/tabview/tabview.js", 167);
node = Y.one(node);
                _yuitest_coverline("build/tabview/tabview.js", 168);
if (node) {
                    _yuitest_coverline("build/tabview/tabview.js", 169);
node.addClass(Y.TabviewBase._classNames.tabviewPanel);
                }
                _yuitest_coverline("build/tabview/tabview.js", 171);
return node;
            },

            valueFn: '_defPanelNodeValueFn'
        },

        tabIndex: {
            value: null
            //validator: '_validTabIndex'
        }
    },

    HTML_PARSER: {
        listNode: function(srcNode) {
            _yuitest_coverfunc("build/tabview/tabview.js", "listNode", 184);
_yuitest_coverline("build/tabview/tabview.js", 185);
return srcNode.one(Y.TabviewBase._queries.tabviewList);
        },
        panelNode: function(srcNode) {
            _yuitest_coverfunc("build/tabview/tabview.js", "panelNode", 187);
_yuitest_coverline("build/tabview/tabview.js", 188);
return srcNode.one(Y.TabviewBase._queries.tabviewPanel);
        }
    },

    // Static for legacy support.
    LIST_TEMPLATE: '<ul></ul>',
    PANEL_TEMPLATE: '<div></div>'
});

// Map to static values by default.
_yuitest_coverline("build/tabview/tabview.js", 198);
TabView.prototype.LIST_TEMPLATE = TabView.LIST_TEMPLATE;
_yuitest_coverline("build/tabview/tabview.js", 199);
TabView.prototype.PANEL_TEMPLATE = TabView.PANEL_TEMPLATE;

_yuitest_coverline("build/tabview/tabview.js", 201);
Y.TabView = TabView;
/**
 * Provides Tab instances for use with TabView
 * @param config {Object} Object literal specifying tabview configuration properties.
 *
 * @class Tab
 * @constructor
 * @extends Widget
 * @uses WidgetChild
 */
_yuitest_coverline("build/tabview/tabview.js", 211);
Y.Tab = Y.Base.create('tab', Y.Widget, [Y.WidgetChild], {
    BOUNDING_TEMPLATE: '<li></li>',
    CONTENT_TEMPLATE: '<a></a>',
    PANEL_TEMPLATE: '<div></div>',

    _uiSetSelectedPanel: function(selected) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_uiSetSelectedPanel", 216);
_yuitest_coverline("build/tabview/tabview.js", 217);
this.get('panelNode').toggleClass(Y.TabviewBase._classNames.selectedPanel, selected);
    },

    _afterTabSelectedChange: function(event) {
       _yuitest_coverfunc("build/tabview/tabview.js", "_afterTabSelectedChange", 220);
_yuitest_coverline("build/tabview/tabview.js", 221);
this._uiSetSelectedPanel(event.newVal);
    },

    _afterParentChange: function(e) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_afterParentChange", 224);
_yuitest_coverline("build/tabview/tabview.js", 225);
if (!e.newVal) {
            _yuitest_coverline("build/tabview/tabview.js", 226);
this._remove();
        } else {
            _yuitest_coverline("build/tabview/tabview.js", 228);
this._add();
        }
    },

    _initAria: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_initAria", 232);
_yuitest_coverline("build/tabview/tabview.js", 233);
var anchor = this.get('contentBox'),
            id = anchor.get('id'),
            panel = this.get('panelNode');

        _yuitest_coverline("build/tabview/tabview.js", 237);
if (!id) {
            _yuitest_coverline("build/tabview/tabview.js", 238);
id = Y.guid();
            _yuitest_coverline("build/tabview/tabview.js", 239);
anchor.set('id', id);
        }
        //  Apply the ARIA roles, states and properties to each tab
        _yuitest_coverline("build/tabview/tabview.js", 242);
anchor.set('role', 'tab');
        _yuitest_coverline("build/tabview/tabview.js", 243);
anchor.get('parentNode').set('role', 'presentation');

        //  Apply the ARIA roles, states and properties to each panel
        _yuitest_coverline("build/tabview/tabview.js", 246);
panel.setAttrs({
            role: 'tabpanel',
            'aria-labelledby': id
        });
    },

    syncUI: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "syncUI", 252);
_yuitest_coverline("build/tabview/tabview.js", 253);
var _classNames = Y.TabviewBase._classNames;

        _yuitest_coverline("build/tabview/tabview.js", 255);
this.get('boundingBox').addClass(_classNames.tab);
        _yuitest_coverline("build/tabview/tabview.js", 256);
this.get('contentBox').addClass(_classNames.tabLabel);
        _yuitest_coverline("build/tabview/tabview.js", 257);
this.set('label', this.get('label'));
        _yuitest_coverline("build/tabview/tabview.js", 258);
this.set('content', this.get('content'));
        _yuitest_coverline("build/tabview/tabview.js", 259);
this._uiSetSelectedPanel(this.get('selected'));
    },

    bindUI: function() {
       _yuitest_coverfunc("build/tabview/tabview.js", "bindUI", 262);
_yuitest_coverline("build/tabview/tabview.js", 263);
this.after('selectedChange', this._afterTabSelectedChange);
       _yuitest_coverline("build/tabview/tabview.js", 264);
this.after('parentChange', this._afterParentChange);
    },

    renderUI: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "renderUI", 267);
_yuitest_coverline("build/tabview/tabview.js", 268);
this._renderPanel();
        _yuitest_coverline("build/tabview/tabview.js", 269);
this._initAria();
    },

    _renderPanel: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_renderPanel", 272);
_yuitest_coverline("build/tabview/tabview.js", 273);
this.get('parent').get('panelNode')
            .appendChild(this.get('panelNode'));
    },

    _add: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_add", 277);
_yuitest_coverline("build/tabview/tabview.js", 278);
var parent = this.get('parent').get('contentBox'),
            list = parent.get('listNode'),
            panel = parent.get('panelNode');

        _yuitest_coverline("build/tabview/tabview.js", 282);
if (list) {
            _yuitest_coverline("build/tabview/tabview.js", 283);
list.appendChild(this.get('boundingBox'));
        }

        _yuitest_coverline("build/tabview/tabview.js", 286);
if (panel) {
            _yuitest_coverline("build/tabview/tabview.js", 287);
panel.appendChild(this.get('panelNode'));
        }
    },

    _remove: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_remove", 291);
_yuitest_coverline("build/tabview/tabview.js", 292);
this.get('boundingBox').remove();
        _yuitest_coverline("build/tabview/tabview.js", 293);
this.get('panelNode').remove();
    },

    _onActivate: function(e) {
         _yuitest_coverfunc("build/tabview/tabview.js", "_onActivate", 296);
_yuitest_coverline("build/tabview/tabview.js", 297);
if (e.target === this) {
             //  Prevent the browser from navigating to the URL specified by the
             //  anchor's href attribute.
             _yuitest_coverline("build/tabview/tabview.js", 300);
e.domEvent.preventDefault();
             _yuitest_coverline("build/tabview/tabview.js", 301);
e.target.set('selected', 1);
         }
    },

    initializer: function() {
       _yuitest_coverfunc("build/tabview/tabview.js", "initializer", 305);
_yuitest_coverline("build/tabview/tabview.js", 306);
this.publish(this.get('triggerEvent'), {
           defaultFn: this._onActivate
       });
    },

    _defLabelGetter: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defLabelGetter", 311);
_yuitest_coverline("build/tabview/tabview.js", 312);
return this.get('contentBox').getHTML();
    },

    _defLabelSetter: function(label) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defLabelSetter", 315);
_yuitest_coverline("build/tabview/tabview.js", 316);
var labelNode = this.get('contentBox');
        _yuitest_coverline("build/tabview/tabview.js", 317);
if (labelNode.getHTML() !== label) { // Avoid rewriting existing label.
            _yuitest_coverline("build/tabview/tabview.js", 318);
labelNode.setHTML(label);
        }
        _yuitest_coverline("build/tabview/tabview.js", 320);
return label;
    },

    _defContentSetter: function(content) {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defContentSetter", 323);
_yuitest_coverline("build/tabview/tabview.js", 324);
var panel = this.get('panelNode');
        _yuitest_coverline("build/tabview/tabview.js", 325);
if (panel.getHTML() !== content) { // Avoid rewriting existing content.
            _yuitest_coverline("build/tabview/tabview.js", 326);
panel.setHTML(content);
        }
        _yuitest_coverline("build/tabview/tabview.js", 328);
return content;
    },

    _defContentGetter: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defContentGetter", 331);
_yuitest_coverline("build/tabview/tabview.js", 332);
return this.get('panelNode').getHTML();
    },

    // find panel by ID mapping from label href
    _defPanelNodeValueFn: function() {
        _yuitest_coverfunc("build/tabview/tabview.js", "_defPanelNodeValueFn", 336);
_yuitest_coverline("build/tabview/tabview.js", 337);
var _classNames = Y.TabviewBase._classNames,
            href = this.get('contentBox').get('href') || '',
            parent = this.get('parent'),
            hashIndex = href.indexOf('#'),
            panel;

        _yuitest_coverline("build/tabview/tabview.js", 343);
href = href.substr(hashIndex);

        _yuitest_coverline("build/tabview/tabview.js", 345);
if (href.charAt(0) === '#') { // in-page nav, find by ID
            _yuitest_coverline("build/tabview/tabview.js", 346);
panel = Y.one(href);
            _yuitest_coverline("build/tabview/tabview.js", 347);
if (panel) {
                _yuitest_coverline("build/tabview/tabview.js", 348);
panel.addClass(_classNames.tabPanel);
            }
        }

        // use the one found by id, or else try matching indices
        _yuitest_coverline("build/tabview/tabview.js", 353);
if (!panel && parent) {
            _yuitest_coverline("build/tabview/tabview.js", 354);
panel = parent.get('panelNode')
                    .get('children').item(this.get('index'));
        }

        _yuitest_coverline("build/tabview/tabview.js", 358);
if (!panel) { // create if none found
            _yuitest_coverline("build/tabview/tabview.js", 359);
panel = Y.Node.create(this.PANEL_TEMPLATE);
            _yuitest_coverline("build/tabview/tabview.js", 360);
panel.addClass(_classNames.tabPanel);
        }
        _yuitest_coverline("build/tabview/tabview.js", 362);
return panel;
    }
}, {
    ATTRS: {
        /**
         * @attribute triggerEvent
         * @default "click"
         * @type String
         */
        triggerEvent: {
            value: 'click'
        },

        /**
         * @attribute label
         * @type HTML
         */
        label: {
            setter: '_defLabelSetter',
            getter: '_defLabelGetter'
        },

        /**
         * @attribute content
         * @type HTML
         */
        content: {
            setter: '_defContentSetter',
            getter: '_defContentGetter'
        },

        /**
         * @attribute panelNode
         * @type Y.Node
         */
        panelNode: {
            setter: function(node) {
                _yuitest_coverfunc("build/tabview/tabview.js", "setter", 398);
_yuitest_coverline("build/tabview/tabview.js", 399);
node = Y.one(node);
                _yuitest_coverline("build/tabview/tabview.js", 400);
if (node) {
                    _yuitest_coverline("build/tabview/tabview.js", 401);
node.addClass(Y.TabviewBase._classNames.tabPanel);
                }
                _yuitest_coverline("build/tabview/tabview.js", 403);
return node;
            },
            valueFn: '_defPanelNodeValueFn'
        },

        tabIndex: {
            value: null,
            validator: '_validTabIndex'
        }

    },

    HTML_PARSER: {
        selected: function() {
            _yuitest_coverfunc("build/tabview/tabview.js", "selected", 416);
_yuitest_coverline("build/tabview/tabview.js", 417);
var ret = (this.get('boundingBox').hasClass(Y.TabviewBase._classNames.selectedTab)) ?
                        1 : 0;
            _yuitest_coverline("build/tabview/tabview.js", 419);
return ret;
        }
    }

});


}, '@VERSION@', {
    "requires": [
        "widget",
        "widget-parent",
        "widget-child",
        "tabview-base",
        "node-pluginhost",
        "node-focusmanager"
    ],
    "skinnable": true
});
