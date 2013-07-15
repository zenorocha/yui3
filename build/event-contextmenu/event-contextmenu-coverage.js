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
_yuitest_coverage["build/event-contextmenu/event-contextmenu.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-contextmenu/event-contextmenu.js",
    code: []
};
_yuitest_coverage["build/event-contextmenu/event-contextmenu.js"].code=["YUI.add('event-contextmenu', function (Y, NAME) {","","/**"," * Provides extended keyboard support for the \"contextmenu\" event such that:"," * <ul>"," * <li>The browser's default context menu is suppressed regardless of how the event is triggered.</li>"," * <li>On Windows the \"contextmenu\" event is fired consistently regardless of whether the user"," * pressed the Menu key or Shift + F10.</li>"," * <li>When the \"contextmenu\" event is fired via the keyboard, the pageX, pageY, clientX and clientY"," * properties reference the center of the event target. This makes it easy for \"contextmenu\" event listeners"," * to position an overlay in response to the event by not having to worry about special handling of the x"," * and y coordinates based on the device that fired the event.</li>"," * <li>For Webkit and Gecko on the Mac it enables the use of the Shift + Control + Option + M keyboard"," * shortcut to fire the \"contextmenu\" event, which (by default) is only available when VoiceOver"," * (the screen reader on the Mac) is enabled.</li>"," * <li>For Opera on the Mac it ensures the \"contextmenu\" event is fired when the user presses"," * Shift + Command + M (Opera's context menu keyboard shortcut).</li>"," * </ul>"," * @module event-contextmenu"," * @requires event"," */","","var Event = Y.Event,","    DOM = Y.DOM,","    UA = Y.UA,","    OS = Y.UA.os,","","    ie = UA.ie,","    gecko = UA.gecko,","    webkit = UA.webkit,","    opera = UA.opera,","","    isWin = (OS === \"windows\"),","    isMac = (OS === \"macintosh\"),","","    eventData = {},","","    conf = {","","        on: function (node, subscription, notifier, filter) {","","            var handles = [];","","            handles.push(Event._attach([\"contextmenu\", function (e) {","","                // Any developer listening for the \"contextmenu\" event is likely","                // going to call preventDefault() to prevent the display of","                // the browser's context menu. So, you know, save them a step.","                e.preventDefault();","","                var id = Y.stamp(node),","                    data = eventData[id];","","                if (data) {","                    e.clientX = data.clientX;","                    e.clientY = data.clientY;","                    e.pageX = data.pageX;","                    e.pageY = data.pageY;","                    delete eventData[id];","                }","","                notifier.fire(e);","","            }, node]));","","","            handles.push(node[filter ? \"delegate\" : \"on\"](\"keydown\", function (e) {","","                var target = this.getDOMNode(),","                    shiftKey = e.shiftKey,","                    keyCode = e.keyCode,","                    shiftF10 = (shiftKey && keyCode == 121),","                    menuKey = (isWin && keyCode == 93),","                    ctrlKey = e.ctrlKey,","                    mKey = (keyCode === 77),","                    macWebkitAndGeckoShortcut = (isMac && (webkit || gecko) && ctrlKey && shiftKey && e.altKey && mKey),","","                    // Note: The context menu keyboard shortcut for Opera on the Mac is Shift + Cmd (metaKey) + M,","                    // but e.metaKey is false for Opera, and Opera sets e.ctrlKey to true instead.","                    macOperaShortcut = (isMac && opera && ctrlKey && shiftKey && mKey),","","                    clientX = 0,","                    clientY = 0,","                    scrollX,","                    scrollY,","                    pageX,","                    pageY,","                    xy,","                    x,","                    y;","","","                if ((isWin && (shiftF10 || menuKey)) ||","                        (macWebkitAndGeckoShortcut || macOperaShortcut)) {","","                    // Need to call preventDefault() here b/c:","                    // 1) To prevent IE's menubar from gaining focus when the","                    // user presses Shift + F10","                    // 2) In Firefox and Opera for Win, Shift + F10 will display a","                    // context menu, but won't fire the \"contextmenu\" event. So, need","                    // to call preventDefault() to prevent the display of the","                    // browser's context menu","                    // 3) For Opera on the Mac the context menu keyboard shortcut","                    // (Shift + Cmd + M) will display a context menu, but like Firefox","                    // and Opera on windows, Opera doesn't fire a \"contextmenu\" event,","                    // so preventDefault() is just used to supress Opera's","                    // default context menu.","                    if (((ie || (isWin && (gecko || opera))) && shiftF10) || macOperaShortcut) {","                        e.preventDefault();","                    }","","                    xy = DOM.getXY(target);","                    x = xy[0];","                    y = xy[1];","                    scrollX = DOM.docScrollX();","                    scrollY = DOM.docScrollY();","","                    // Protect against instances where xy and might not be returned,","                    // for example if the target is the document.","                    if (!Y.Lang.isUndefined(x)) {","                        clientX = (x + (target.offsetWidth/2)) - scrollX;","                        clientY = (y + (target.offsetHeight/2)) - scrollY;","                    }","","                    pageX = clientX + scrollX;","                    pageY = clientY + scrollY;","","                    // When the \"contextmenu\" event is fired from the keyboard","                    // clientX, clientY, pageX or pageY aren't set to useful","                    // values. So, we follow Safari's model here of setting","                    // the x & x coords to the center of the event target.","","                    if (menuKey || (isWin && webkit && shiftF10)) {","                        eventData[Y.stamp(node)] = {","                            clientX: clientX,","                            clientY: clientY,","                            pageX: pageX,","                            pageY: pageY","                        };","                    }","","                    // Don't need to call notifier.fire(e) when the Menu key","                    // is pressed as it fires the \"contextmenu\" event by default.","                    //","                    // In IE the call to preventDefault() for Shift + F10","                    // prevents the \"contextmenu\" event from firing, so we need","                    // to call notifier.fire(e)","                    //","                    // Need to also call notifier.fire(e) for Gecko and Opera since","                    // neither Shift + F10 or Shift + Cmd + M fire the \"contextmenu\" event.","                    //","                    // Lastly, also need to call notifier.fire(e) for all Mac browsers","                    // since neither Shift + Ctrl + Option + M (Webkit and Gecko) or","                    // Shift + Command + M (Opera) fire the \"contextmenu\" event.","","                    if (((ie || (isWin && (gecko || opera))) && shiftF10) || isMac) {","","                        e.clientX = clientX;","                        e.clientY = clientY;","                        e.pageX = pageX;","                        e.pageY = pageY;","","                        notifier.fire(e);","                    }","","                }","","            }, filter));","","            subscription._handles = handles;","","        },","","        detach: function (node, subscription, notifier) {","","            Y.each(subscription._handles, function (handle) {","                handle.detach();","            });","","        }","","    };","","","conf.delegate = conf.on;","conf.detachDelegate = conf.detach;","","","Event.define(\"contextmenu\", conf, true);","","","}, '@VERSION@', {\"requires\": [\"event-synthetic\", \"dom-screen\"]});"];
_yuitest_coverage["build/event-contextmenu/event-contextmenu.js"].lines = {"1":0,"23":0,"42":0,"44":0,"49":0,"51":0,"54":0,"55":0,"56":0,"57":0,"58":0,"59":0,"62":0,"67":0,"69":0,"93":0,"108":0,"109":0,"112":0,"113":0,"114":0,"115":0,"116":0,"120":0,"121":0,"122":0,"125":0,"126":0,"133":0,"134":0,"156":0,"158":0,"159":0,"160":0,"161":0,"163":0,"170":0,"176":0,"177":0,"185":0,"186":0,"189":0};
_yuitest_coverage["build/event-contextmenu/event-contextmenu.js"].functions = {"(anonymous 2):44":0,"(anonymous 3):67":0,"on:40":0,"(anonymous 4):176":0,"detach:174":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-contextmenu/event-contextmenu.js"].coveredLines = 42;
_yuitest_coverage["build/event-contextmenu/event-contextmenu.js"].coveredFunctions = 6;
_yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 1);
YUI.add('event-contextmenu', function (Y, NAME) {

/**
 * Provides extended keyboard support for the "contextmenu" event such that:
 * <ul>
 * <li>The browser's default context menu is suppressed regardless of how the event is triggered.</li>
 * <li>On Windows the "contextmenu" event is fired consistently regardless of whether the user
 * pressed the Menu key or Shift + F10.</li>
 * <li>When the "contextmenu" event is fired via the keyboard, the pageX, pageY, clientX and clientY
 * properties reference the center of the event target. This makes it easy for "contextmenu" event listeners
 * to position an overlay in response to the event by not having to worry about special handling of the x
 * and y coordinates based on the device that fired the event.</li>
 * <li>For Webkit and Gecko on the Mac it enables the use of the Shift + Control + Option + M keyboard
 * shortcut to fire the "contextmenu" event, which (by default) is only available when VoiceOver
 * (the screen reader on the Mac) is enabled.</li>
 * <li>For Opera on the Mac it ensures the "contextmenu" event is fired when the user presses
 * Shift + Command + M (Opera's context menu keyboard shortcut).</li>
 * </ul>
 * @module event-contextmenu
 * @requires event
 */

_yuitest_coverfunc("build/event-contextmenu/event-contextmenu.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 23);
var Event = Y.Event,
    DOM = Y.DOM,
    UA = Y.UA,
    OS = Y.UA.os,

    ie = UA.ie,
    gecko = UA.gecko,
    webkit = UA.webkit,
    opera = UA.opera,

    isWin = (OS === "windows"),
    isMac = (OS === "macintosh"),

    eventData = {},

    conf = {

        on: function (node, subscription, notifier, filter) {

            _yuitest_coverfunc("build/event-contextmenu/event-contextmenu.js", "on", 40);
_yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 42);
var handles = [];

            _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 44);
handles.push(Event._attach(["contextmenu", function (e) {

                // Any developer listening for the "contextmenu" event is likely
                // going to call preventDefault() to prevent the display of
                // the browser's context menu. So, you know, save them a step.
                _yuitest_coverfunc("build/event-contextmenu/event-contextmenu.js", "(anonymous 2)", 44);
_yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 49);
e.preventDefault();

                _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 51);
var id = Y.stamp(node),
                    data = eventData[id];

                _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 54);
if (data) {
                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 55);
e.clientX = data.clientX;
                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 56);
e.clientY = data.clientY;
                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 57);
e.pageX = data.pageX;
                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 58);
e.pageY = data.pageY;
                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 59);
delete eventData[id];
                }

                _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 62);
notifier.fire(e);

            }, node]));


            _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 67);
handles.push(node[filter ? "delegate" : "on"]("keydown", function (e) {

                _yuitest_coverfunc("build/event-contextmenu/event-contextmenu.js", "(anonymous 3)", 67);
_yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 69);
var target = this.getDOMNode(),
                    shiftKey = e.shiftKey,
                    keyCode = e.keyCode,
                    shiftF10 = (shiftKey && keyCode == 121),
                    menuKey = (isWin && keyCode == 93),
                    ctrlKey = e.ctrlKey,
                    mKey = (keyCode === 77),
                    macWebkitAndGeckoShortcut = (isMac && (webkit || gecko) && ctrlKey && shiftKey && e.altKey && mKey),

                    // Note: The context menu keyboard shortcut for Opera on the Mac is Shift + Cmd (metaKey) + M,
                    // but e.metaKey is false for Opera, and Opera sets e.ctrlKey to true instead.
                    macOperaShortcut = (isMac && opera && ctrlKey && shiftKey && mKey),

                    clientX = 0,
                    clientY = 0,
                    scrollX,
                    scrollY,
                    pageX,
                    pageY,
                    xy,
                    x,
                    y;


                _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 93);
if ((isWin && (shiftF10 || menuKey)) ||
                        (macWebkitAndGeckoShortcut || macOperaShortcut)) {

                    // Need to call preventDefault() here b/c:
                    // 1) To prevent IE's menubar from gaining focus when the
                    // user presses Shift + F10
                    // 2) In Firefox and Opera for Win, Shift + F10 will display a
                    // context menu, but won't fire the "contextmenu" event. So, need
                    // to call preventDefault() to prevent the display of the
                    // browser's context menu
                    // 3) For Opera on the Mac the context menu keyboard shortcut
                    // (Shift + Cmd + M) will display a context menu, but like Firefox
                    // and Opera on windows, Opera doesn't fire a "contextmenu" event,
                    // so preventDefault() is just used to supress Opera's
                    // default context menu.
                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 108);
if (((ie || (isWin && (gecko || opera))) && shiftF10) || macOperaShortcut) {
                        _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 109);
e.preventDefault();
                    }

                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 112);
xy = DOM.getXY(target);
                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 113);
x = xy[0];
                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 114);
y = xy[1];
                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 115);
scrollX = DOM.docScrollX();
                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 116);
scrollY = DOM.docScrollY();

                    // Protect against instances where xy and might not be returned,
                    // for example if the target is the document.
                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 120);
if (!Y.Lang.isUndefined(x)) {
                        _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 121);
clientX = (x + (target.offsetWidth/2)) - scrollX;
                        _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 122);
clientY = (y + (target.offsetHeight/2)) - scrollY;
                    }

                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 125);
pageX = clientX + scrollX;
                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 126);
pageY = clientY + scrollY;

                    // When the "contextmenu" event is fired from the keyboard
                    // clientX, clientY, pageX or pageY aren't set to useful
                    // values. So, we follow Safari's model here of setting
                    // the x & x coords to the center of the event target.

                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 133);
if (menuKey || (isWin && webkit && shiftF10)) {
                        _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 134);
eventData[Y.stamp(node)] = {
                            clientX: clientX,
                            clientY: clientY,
                            pageX: pageX,
                            pageY: pageY
                        };
                    }

                    // Don't need to call notifier.fire(e) when the Menu key
                    // is pressed as it fires the "contextmenu" event by default.
                    //
                    // In IE the call to preventDefault() for Shift + F10
                    // prevents the "contextmenu" event from firing, so we need
                    // to call notifier.fire(e)
                    //
                    // Need to also call notifier.fire(e) for Gecko and Opera since
                    // neither Shift + F10 or Shift + Cmd + M fire the "contextmenu" event.
                    //
                    // Lastly, also need to call notifier.fire(e) for all Mac browsers
                    // since neither Shift + Ctrl + Option + M (Webkit and Gecko) or
                    // Shift + Command + M (Opera) fire the "contextmenu" event.

                    _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 156);
if (((ie || (isWin && (gecko || opera))) && shiftF10) || isMac) {

                        _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 158);
e.clientX = clientX;
                        _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 159);
e.clientY = clientY;
                        _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 160);
e.pageX = pageX;
                        _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 161);
e.pageY = pageY;

                        _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 163);
notifier.fire(e);
                    }

                }

            }, filter));

            _yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 170);
subscription._handles = handles;

        },

        detach: function (node, subscription, notifier) {

            _yuitest_coverfunc("build/event-contextmenu/event-contextmenu.js", "detach", 174);
_yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 176);
Y.each(subscription._handles, function (handle) {
                _yuitest_coverfunc("build/event-contextmenu/event-contextmenu.js", "(anonymous 4)", 176);
_yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 177);
handle.detach();
            });

        }

    };


_yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 185);
conf.delegate = conf.on;
_yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 186);
conf.detachDelegate = conf.detach;


_yuitest_coverline("build/event-contextmenu/event-contextmenu.js", 189);
Event.define("contextmenu", conf, true);


}, '@VERSION@', {"requires": ["event-synthetic", "dom-screen"]});
