YUI.add("event",function(E){var A=E.UA.ie?"focusin":"focus",B=E.UA.ie?"focusout":"blur",C="capture_";E.Env.eventAdaptors={focus:{on:function(){var F=E.Array(arguments,0,true);F[0]=C+A;return E.Event.attach.apply(E.Event,F);},detach:function(){var F=E.Array(arguments,0,true);F[0]=C+A;return E.Event.detach.apply(E.Event,F);}},blur:{on:function(){var F=E.Array(arguments,0,true);F[0]=C+B;return E.Event.attach.apply(E.Event,F);},detach:function(){var F=E.Array(arguments,0,true);F[0]=C+B;return E.Event.detach.apply(E.Event,F);}},available:{on:function(J,I,L,K){var H=E.Array(arguments,1,true),G=I;H.splice(1,1);H.unshift(L);if(K){var F=H.slice(1);G=E.bind.apply(E,F);}return E.Event.onAvailable.apply(E.Event,H);},detach:function(){}},contentready:{on:function(J,I,L,K){var H=E.Array(arguments,1,true),G=I;H.splice(1,1);H.unshift(L);if(K){var F=H.slice(1);G=E.bind.apply(E,F);}return E.Event.onContentReady.apply(E.Event,H);},detach:function(){}}};E.on=function(G,H,I){var F=E.Env.eventAdaptors[G];if(F){return F.on.apply(E,arguments);}else{if(G.indexOf(":")>-1){return E.subscribe.apply(E,arguments);}else{return E.Event.attach.apply(E.Event,arguments);}}};E.detach=function(G,H,I){var F=E.Env.eventAdaptors[G];if(E.Lang.isObject(G)&&G.detach){return G.detach();}else{if(F){F.detach.apply(E,arguments);}else{if(G.indexOf(":")>-1){return E.unsubscribe.apply(E,arguments);}else{return E.Event.detach.apply(E.Event,arguments);}}}};E.before=function(F,G,H){if(E.Lang.isFunction(F)){return E.Do.before.apply(E.Do,arguments);}else{return E.on.apply(E,arguments);}};var D=E.after;E.after=function(F,G,H){if(E.Lang.isFunction(F)){return E.Do.after.apply(E.Do,arguments);}else{return D.apply(E,arguments);}};},"3.0.0",{use:["aop","event-custom","event-target","event-ready","event-dom","event-facade","event-simulate"]});YUI.add("aop",function(C){var A=0,B=1;C.Do={objs:{},before:function(E,G,H,I){var F=E;if(I){var D=[E,I].concat(C.Array(arguments,4,true));F=C.bind.apply(C,D);}return this._inject(A,F,G,H);},after:function(E,G,H,I){var F=E;if(I){var D=[E,I].concat(C.Array(arguments,4,true));F=C.bind.apply(C,D);}return this._inject(B,F,G,H);},_inject:function(D,F,G,I){var J=C.stamp(G);if(!this.objs[J]){this.objs[J]={};}var H=this.objs[J];if(!H[I]){H[I]=new C.Do.Method(G,I);G[I]=function(){return H[I].exec.apply(H[I],arguments);};}var E=J+C.stamp(F)+I;H[I].register(E,F,D);return E;},detach:function(D){delete this.before[D];delete this.after[D];},_unload:function(E,D){}};C.Do.Method=function(D,E){this.obj=D;this.methodName=E;this.method=D[E];this.before={};this.after={};};C.Do.Method.prototype.register=function(E,F,D){if(D){this.after[E]=F;}else{this.before[E]=F;}};C.Do.Method.prototype.exec=function(){var F=C.Array(arguments,0,true),G,E,I,H=this.before,D=this.after;for(G in H){if(H.hasOwnProperty(G)){E=H[G].apply(this.obj,F);if(E&&E.constructor==C.Do.Error){return E.retVal;}else{if(E&&E.constructor==C.Do.AlterArgs){F=E.newArgs;}}}}E=this.method.apply(this.obj,F);for(G in D){if(D.hasOwnProperty(G)){I=D[G].apply(this.obj,F);if(I&&I.constructor==C.Do.Error){return I.retVal;}else{if(I&&I.constructor==C.Do.AlterReturn){E=I.newRetVal;}}}}return E;};C.Do.Error=function(E,D){this.msg=E;this.retVal=D;};C.Do.AlterArgs=function(E,D){this.msg=E;this.newArgs=D;};C.Do.AlterReturn=function(E,D){this.msg=E;this.newRetVal=D;};},"3.0.0");YUI.add("event-custom",function(E){var B="_event:onsub",D="after",A=["broadcast","bubbles","context","configured","currentTarget","defaultFn","details","emitFacade","fireOnce","host","preventable","preventedFn","queuable","silent","stoppedFn","target","type"],C=9;E.EventHandle=function(F,G){this.evt=F;this.sub=G;};E.EventHandle.prototype={detach:function(){if(this.evt){this.evt._delete(this.sub);}}};E.CustomEvent=function(F,G){G=G||{};this.id=E.stamp(this);this.type=F;this.context=E;this.broadcast=0;this.queuable=false;this.subscribers={};this.afters={};this.fired=false;this.fireOnce=false;this.stopped=0;this.prevented=0;this.host=null;this.defaultFn=null;this.stoppedFn=null;this.preventedFn=null;this.preventable=true;this.bubbles=true;this.signature=C;this.emitFacade=false;this.applyConfig(G,true);if(F!==B){this.subscribeEvent=new E.CustomEvent(B,{context:this,silent:true});}};E.CustomEvent.prototype={_YUI_EVENT:true,applyConfig:function(G,F){if(G){E.mix(this,G,F,A);}},_subscribe:function(I,K,G,F){if(!I){E.fail("Invalid callback for CE: "+this.type);}var J=this.subscribeEvent;if(J){J.fire.apply(J,G);}var H=new E.Subscriber(I,K,G,F);if(this.fireOnce&&this.fired){E.later(0,this,this._notify,H);}if(F==D){this.afters[H.id]=H;}else{this.subscribers[H.id]=H;}return new E.EventHandle(this,H);},subscribe:function(F,G){return this._subscribe(F,G,E.Array(arguments,2,true));},after:function(F,G){return this._subscribe(F,G,E.Array(arguments,2,true),D);},unsubscribe:function(I,K){if(I&&I.detach){return I.detach();}if(!I){return this.unsubscribeAll();}var J=false,G=this.subscribers;for(var F in G){if(G.hasOwnProperty(F)){var H=G[F];if(H&&H.contains(I,K)){this._delete(H);J=true;}}}return J;},_getFacade:function(G){var F=this._facade;if(!F){F=new E.Event.Facade(this,this.currentTarget);}var H=G&&G[0];if(E.Lang.isObject(H,true)&&!H._yuifacade){E.mix(F,H,true);}F.details=this.details;F.target=this.target;F.currentTarget=this.currentTarget;F.stopped=0;F.prevented=0;this._facade=F;return this._facade;},_notify:function(I,H,F){var G;if(this.emitFacade){if(!F){F=this._getFacade(H);H[0]=F;}}G=I.notify(this.context,H,this);if(false===G||this.stopped>1){return false;}return true;},log:function(I,F){var H=E.Env._eventstack,G=H&&H.logging;if(!this.silent){}},fire:function(){var O=E.Env._eventstack;if(O){if(this.queuable&&this.type!=O.next.type){O.queue.push([this,arguments]);return true;}}else{E.Env._eventstack={id:this.id,next:this,silent:this.silent,logging:(this.type==="yui:log"),stopped:0,prevented:0,queue:[]};O=E.Env._eventstack;}var M=true;if(this.fireOnce&&this.fired){}else{var H=E.merge(this.subscribers),P,N=E.Array(arguments,0,true),I;
this.stopped=0;this.prevented=0;this.target=this.target||this.host;this.currentTarget=this.host||this.currentTarget;this.fired=true;this.details=N.slice();var L=false;O.lastLogState=O.logging;var J=null;if(this.emitFacade){J=this._getFacade(N);N[0]=J;}for(I in H){if(H.hasOwnProperty(I)){if(!L){O.logging=(O.logging||(this.type==="yui:log"));L=true;}if(this.stopped==2){break;}P=H[I];if(P&&P.fn){M=this._notify(P,N,J);if(false===M){this.stopped=2;}}}}O.logging=(O.lastLogState);if(this.bubbles&&this.host&&!this.stopped){O.stopped=0;O.prevented=0;M=this.host.bubble(this);this.stopped=Math.max(this.stopped,O.stopped);this.prevented=Math.max(this.prevented,O.prevented);}if(this.defaultFn&&!this.prevented){this.defaultFn.apply(this.host||this,N);}if(!this.prevented&&this.stopped<2){H=E.merge(this.afters);for(I in H){if(H.hasOwnProperty(I)){if(!L){O.logging=(O.logging||(this.type==="yui:log"));L=true;}if(this.stopped==2){break;}P=H[I];if(P&&P.fn){M=this._notify(P,N,J);if(false===M){this.stopped=2;}}}}}}if(O.id===this.id){var K=O.queue;while(K.length){var F=K.pop(),G=F[0];O.stopped=0;O.prevented=0;O.next=G;M=G.fire.apply(G,F[1]);}E.Env._eventstack=null;}return(M!==false);},unsubscribeAll:function(){var G=this.subscribers,F;for(F in G){if(G.hasOwnProperty(F)){this._delete(G[F]);}}this.subscribers={};return F;},_delete:function(F){if(F){delete F.fn;delete F.obj;delete this.subscribers[F.id];delete this.afters[F.id];}},toString:function(){return this.type;},stopPropagation:function(){this.stopped=1;E.Env._eventstack.stopped=1;if(this.stoppedFn){this.stoppedFn.call(this.host||this,this);}},stopImmediatePropagation:function(){this.stopped=2;E.Env._eventstack.stopped=2;if(this.stoppedFn){this.stoppedFn.call(this.host||this,this);}},preventDefault:function(){if(this.preventable){this.prevented=1;E.Env._eventstack.prevented=1;}if(this.preventedFn){this.preventedFn.call(this.host||this,this);}}};E.Subscriber=function(I,J,H){this.fn=I;this.obj=J;this.id=E.stamp(this);var F=I;if(J){var G=(H)?E.Array(H):[];G.unshift(I,J);F=E.bind.apply(E,G);}this.wrappedFn=F;};E.Subscriber.prototype={notify:function(F,H,J){var K=this.obj||F,G=true;try{switch(J.signature){case 0:G=this.fn.call(K,J.type,H,this.obj);break;case 1:G=this.fn.call(K,H[0]||null,this.obj);break;default:G=this.wrappedFn.apply(K,H||[]);}}catch(I){E.fail(this+" failed: "+I.message,I);}return G;},contains:function(F,G){if(G){return((this.fn==F)&&this.obj==G);}else{return(this.fn==F);}},toString:function(){return"Subscriber "+this.id;}};},"3.0.0");YUI.add("event-target",function(C){var A={"yui:log":true};C.EventTarget=function(D){var E=(C.Lang.isObject(D))?D:{};this._yuievt={events:{},targets:{},config:E,defaults:{context:this,host:this,emitFacade:E.emitFacade||false,bubbles:("bubbles" in E)?E.bubbles:true}};};var B=C.EventTarget;B.prototype={subscribe:function(J,K,D){if(C.Lang.isObject(J)){var F=K,I=D,H=C.Array(arguments,0,true),G={};C.each(J,function(N,M){if(N){F=N.fn||F;I=N.context||I;}H[0]=M;H[1]=F;H[2]=I;G[M]=this.subscribe.apply(this,H);},this);return G;}var E=this._yuievt.events[J]||this.publish(J),L=C.Array(arguments,1,true);return E.subscribe.apply(E,L);},unsubscribe:function(I,H,G){if(C.Lang.isObject(I)&&I.detach){return I.detach();}var D=this._yuievt.events;if(I){var J=D[I];if(J){return J.unsubscribe(H,G);}}else{var E=true;for(var F in D){if(C.Object.owns(D,F)){E=E&&D[F].unsubscribe(H,G);}}return E;}return false;},unsubscribeAll:function(D){return this.unsubscribe(D);},publish:function(F,G){if(C.Lang.isObject(F)){var D={};C.each(F,function(K,J){D[J]=this.publish(J,K||G);},this);return D;}var E=this._yuievt.events,H=E[F];if(H){H.applyConfig(G,true);}else{var I=G||{};C.mix(I,this._yuievt.defaults);H=new C.CustomEvent(F,I);E[F]=H;if(I.onSubscribeCallback){H.subscribeEvent.subscribe(I.onSubscribeCallback);}}return E[F];},addTarget:function(D){this._yuievt.targets[C.stamp(D)]=D;this._yuievt.hasTargets=true;},removeTarget:function(D){delete this._yuievt.targets[C.stamp(D)];},fire:function(G){var I=C.Lang.isString(G),F=(I)?G:(G&&G.type);var H=this.getEvent(F);if(!H){if(this._yuievt.hasTargets){H=this.publish(F);H.details=C.Array(arguments,(I)?1:0,true);return this.bubble(H);}return true;}var D=C.Array(arguments,(I)?1:0,true);var E=H.fire.apply(H,D);H.target=null;return E;},getEvent:function(D){var E=this._yuievt.events;return(E&&D in E)?E[D]:null;},bubble:function(E){var J=this._yuievt.targets,F=true;if(!E.stopped&&J){for(var H in J){if(J.hasOwnProperty(H)){var G=J[H],I=E.type,K=G.getEvent(I),D=E.target||this;if(!K){K=G.publish(I,E);K.context=(E.host===E.context)?G:E.context;K.host=G;K.defaultFn=null;K.preventedFn=null;K.stoppedFn=null;}K.target=D;K.currentTarget=G;F=F&&K.fire.apply(K,E.details);if(K.stopped){break;}}}}return F;},after:function(F,E){var G=this._yuievt.events[F]||this.publish(F),D=C.Array(arguments,1,true);return G.after.apply(G,D);}};C.mix(C,B.prototype,false,false,{bubbles:false});B.call(C);},"3.0.0");(function(){var E=YUI.Env,G=YUI.config,F=G.doc,B=G.pollInterval||20;if(!E._ready){E.windowLoaded=false;E._ready=function(){if(!E.DOMReady){E.DOMReady=true;if(F.removeEventListener){F.removeEventListener("DOMContentLoaded",A,false);}}};var A=function(C){YUI.Env._ready();};if(navigator.userAgent.match(/MSIE/)){E._dri=setInterval(function(){try{document.documentElement.doScroll("left");clearInterval(E._dri);E._dri=null;A();}catch(C){}},B);}else{F.addEventListener("DOMContentLoaded",A,false);}}YUI.add("event-ready",function(D){if(D===YUI){return;}D.publish("event:ready",{fireOnce:true});var C=function(){D.fire("event:ready");};if(E.DOMReady){C();}else{D.before(C,E,"_ready");}},"3.0.0");})();(function(){var E=function(J,I,H,G){if(J.addEventListener){J.addEventListener(I,H,!!G);}else{if(J.attachEvent){J.attachEvent("on"+I,H);}}},A=function(J,I,H,G){if(J.removeEventListener){J.removeEventListener(I,H,!!G);}else{if(J.detachEvent){J.detachEvent("on"+I,H);}}},B=function(){YUI.Env.windowLoaded=true;A(window,"load",B);},F="event:ready",D="~yui|2|compat~",C="capture_";
E(window,"load",B);YUI.add("event-dom",function(H){H.Event=function(){var K=false;var L=0;var J=[];var M={};var I=null;var N={};return{POLL_RETRYS:2000,POLL_INTERVAL:20,lastError:null,_interval:null,_dri:null,DOMReady:false,startInterval:function(){var O=H.Event;if(!O._interval){O._interval=setInterval(H.bind(O._tryPreloadAttach,O),O.POLL_INTERVAL);}},onAvailable:function(V,R,U,T,S,P){var O=H.Array(V);for(var Q=0;Q<O.length;Q=Q+1){J.push({id:O[Q],fn:R,obj:U,override:T,checkReady:S,compat:P});}L=this.POLL_RETRYS;setTimeout(H.bind(H.Event._tryPreloadAttach,H.Event),0);return new H.EventHandle();},onContentReady:function(S,P,R,Q,O){return this.onAvailable(S,P,R,Q,true,O);},attach:function(U,W,P,X){var T=H.Array(arguments,0,true),S=T.slice(1),V,Y=H.Event,b=false;if(U.indexOf(C)>-1){U=U.substr(C.length);b=true;}if(S[S.length-1]===D){V=true;S.pop();}if(!W||!W.call){return false;}if(this._isValidCollection(P)){var O=[],d,c;H.each(P,function(h,g){T[2]=h;O.push(Y.attach.apply(Y,T));});return O;}else{if(H.Lang.isString(P)){var a=(V)?H.DOM.byId(P):H.all(P);if(a&&(a instanceof H.Node)){var Z=a.size();if(Z>1){T[2]=a;return Y.attach.apply(Y,T);}else{P=a.item(0);}}else{if(a){P=a;}else{return this.onAvailable(P,function(){Y.attach.apply(Y,T);},Y,true,false,V);}}}}if(!P){return false;}var Q=H.stamp(P),f="event:"+Q+U,e=M[f];if(!e){e=H.publish(f,{silent:true,bubbles:false});e.el=P;e.type=U;e.fn=function(g){e.fire(Y.getEvent(g,P,V));};if(P==H.config.win&&U=="load"){e.fireOnce=true;I=f;if(YUI.Env.windowLoaded){e.fire();}}M[f]=e;N[Q]=N[Q]||{};N[Q][f]=e;E(P,U,e.fn,b);}var R=S[2]||((V)?P:H.get(P));S[1]=R;S.splice(2,1);return e.subscribe.apply(e,S);},detach:function(V,X,Q,R){var U=H.Array(arguments,0,true),Z;if(U[U.length-1]===D){Z=true;}if(V&&V.detach){return V.detach();}var S,T,Y;if(typeof Q=="string"){Q=(Z)?H.DOM.byId(Q):H.all(Q);}else{if(this._isValidCollection(Q)){var W=true;for(S=0,T=Q.length;S<T;++S){U[2]=Q[S];W=(H.Event.detach.apply(H.Event,U)&&W);}return W;}}if(!X||!X.call){return this.purgeElement(Q,false,V);}var O="event:"+H.stamp(Q)+V,P=M[O];if(P){return P.unsubscribe(X);}else{return false;}},getEvent:function(R,P,O){var Q=R||window.event;return(O)?Q:new H.Event.Facade(Q,P,M["event:"+H.stamp(P)+R.type]);},generateId:function(O){var P=O.id;if(!P){P=H.stamp(O);O.id=P;}return P;},_isValidCollection:function(P){try{return(P&&typeof P!=="string"&&(P.length&&((!P.size)||(P.size()>1)))&&!P.tagName&&!P.alert&&(P.item||typeof P[0]!=="undefined"));}catch(O){return false;}},_load:function(O){if(!K){K=true;if(H.fire){H.fire(F);}H.Event._tryPreloadAttach();}},_tryPreloadAttach:function(){if(this.locked){return;}if(H.UA.ie&&!YUI.Env.DOMReady){this.startInterval();return;}this.locked=true;var T=!K;if(!T){T=(L>0);}var S=[];var U=function(W,X){var V;if(X.override){if(X.override===true){V=X.obj;}else{V=X.override;}}else{V=(X.compat)?W:H.get(W);}X.fn.call(V,X.obj);};var P,O,R,Q;for(P=0,O=J.length;P<O;++P){R=J[P];if(R&&!R.checkReady){Q=(R.compat)?H.DOM.byId(R.id):H.get(R.id);if(Q){U(Q,R);J[P]=null;}else{S.push(R);}}}for(P=0,O=J.length;P<O;++P){R=J[P];if(R&&R.checkReady){Q=(R.compat)?H.DOM.byId(R.id):H.get(R.id);if(Q){if(K||(Q.get&&Q.get("nextSibling"))||Q.nextSibling){U(Q,R);J[P]=null;}}else{S.push(R);}}}L=(S.length===0)?0:L-1;if(T){this.startInterval();}else{clearInterval(this._interval);this._interval=null;}this.locked=false;return;},purgeElement:function(T,U,S){var Q=(H.Lang.isString(T))?H.get(T):T,V=H.stamp(Q);var P=this.getListeners(Q,S),R,O;if(P){for(R=0,O=P.length;R<O;++R){P[R].unsubscribeAll();}}if(U&&Q&&Q.childNodes){for(R=0,O=Q.childNodes.length;R<O;++R){this.purgeElement(Q.childNodes[R],U,S);}}},getListeners:function(S,R){var T=H.stamp(S),O=N[T];if(!O){return null;}var Q=[],P=(R)?"event:"+R:null;if(P){if(O[P]){Q.push(O[P]);}}else{H.each(O,function(V,U){Q.push(V);});}return(Q.length)?Q:null;},_unload:function(P){var O=H.Event;H.each(M,function(R,Q){R.unsubscribeAll();A(R.el,R.type,R.fn);delete M[Q];});A(window,"load",O._load);A(window,"unload",O._unload);},nativeAdd:E,nativeRemove:A};}();var G=H.Event;if(H.UA.ie&&H.on){H.on(F,G._tryPreloadAttach,G,true);}G.Custom=H.CustomEvent;G.Subscriber=H.Subscriber;G.Target=H.EventTarget;E(window,"load",G._load);E(window,"unload",G._unload);G._tryPreloadAttach();},"3.0.0");})();YUI.add("event-facade",function(E){var C={"altKey":1,"cancelBubble":1,"ctrlKey":1,"clientX":1,"clientY":1,"detail":1,"keyCode":1,"metaKey":1,"shiftKey":1,"type":1,"x":1,"y":1};var B=E.UA,A={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9},D=function(G){if(!G){return null;}try{if(B.webkit&&3==G.nodeType){G=G.parentNode;}}catch(F){}return E.Node.get(G);};E.Event.Facade=function(P,H,G,F){var L=P,J=H,M=E.config.doc,Q=M.body,R=L.pageX,O=L.pageY,I=(P._YUI_EVENT);for(var K in C){if(C.hasOwnProperty(K)){this[K]=L[K];}}if(!R&&0!==R){R=L.clientX||0;O=L.clientY||0;if(B.ie){R+=Math.max(M.documentElement.scrollLeft,Q.scrollLeft);O+=Math.max(M.documentElement.scrollTop,Q.scrollTop);}}this._yuifacade=true;this.pageX=R;this.pageY=O;var N=L.keyCode||L.charCode||0;if(B.webkit&&(N in A)){N=A[N];}this.keyCode=N;this.charCode=N;this.button=L.which||L.button;this.which=this.button;this.details=F;this.time=L.time||new Date().getTime();this.target=(I)?L.target:D(L.target||L.srcElement);this.currentTarget=(I)?J:D(J);var S=L.relatedTarget;if(!S){if(L.type=="mouseout"){S=L.toElement;}else{if(L.type=="mouseover"){S=L.fromElement;}}}this.relatedTarget=(I)?S:D(S);this.stopPropagation=function(){if(L.stopPropagation){L.stopPropagation();}else{L.cancelBubble=true;}if(G){G.stopPropagation();}};this.stopImmediatePropagation=function(){if(L.stopImmediatePropagation){L.stopImmediatePropagation();}else{this.stopPropagation();}if(G){G.stopImmediatePropagation();}};this.preventDefault=function(){if(L.preventDefault){L.preventDefault();}else{L.returnValue=false;}if(G){G.preventDefault();}};this.halt=function(T){if(T){this.stopImmediatePropagation();}else{this.stopPropagation();}this.preventDefault();};};},"3.0.0");YUI.add("event-simulate",function(B){var H=B.Lang,G=B.Array,D=H.isFunction,C=H.isString,E=H.isBoolean,K=H.isObject,J=H.isNumber,M=["click","dblclick","mouseover","mouseout","mousedown","mouseup","mousemove"],I=["keydown","keyup","keypress"];
function F(R,V,Q,O,X,N,L,W,T,Z,Y){if(!R){B.fail("simulateKeyEvent(): Invalid target.");}if(C(V)){V=V.toLowerCase();switch(V){case"textevent":V="keypress";case"keyup":case"keydown":case"keypress":break;default:B.fail("simulateKeyEvent(): Event type '"+V+"' not supported.");}}else{B.fail("simulateKeyEvent(): Event type must be a string.");}if(!E(Q)){Q=true;}if(!E(O)){O=true;}if(!K(X)){X=window;}if(!E(N)){N=false;}if(!E(L)){L=false;}if(!E(W)){W=false;}if(!E(T)){T=false;}if(!J(Z)){Z=0;}if(!J(Y)){Y=0;}var U=null;if(D(document.createEvent)){try{U=document.createEvent("KeyEvents");U.initKeyEvent(V,Q,O,X,N,L,W,T,Z,Y);}catch(S){try{U=document.createEvent("Events");}catch(P){U=document.createEvent("UIEvents");}finally{U.initEvent(V,Q,O);U.view=X;U.altKey=L;U.ctrlKey=N;U.shiftKey=W;U.metaKey=T;U.keyCode=Z;U.charCode=Y;}}R.dispatchEvent(U);}else{if(K(document.createEventObject)){U=document.createEventObject();U.bubbles=Q;U.cancelable=O;U.view=X;U.ctrlKey=N;U.altKey=L;U.shiftKey=W;U.metaKey=T;U.keyCode=(Y>0)?Y:Z;R.fireEvent("on"+V,U);}else{B.fail("simulateKeyEvent(): No event simulation framework present.");}}}function A(W,b,T,Q,c,V,S,R,P,N,O,L,a,Y,U,X){if(!W){B.fail("simulateMouseEvent(): Invalid target.");}if(C(b)){b=b.toLowerCase();if(G.indexOf(M,b)==-1){B.fail("simulateMouseEvent(): Event type '"+b+"' not supported.");}}else{B.fail("simulateMouseEvent(): Event type must be a string.");}if(!E(T)){T=true;}if(!E(Q)){Q=(b!="mousemove");}if(!K(c)){c=window;}if(!J(V)){V=1;}if(!J(S)){S=0;}if(!J(R)){R=0;}if(!J(P)){P=0;}if(!J(N)){N=0;}if(!E(O)){O=false;}if(!E(L)){L=false;}if(!E(a)){a=false;}if(!E(Y)){Y=false;}if(!J(U)){U=0;}var Z=null;if(D(document.createEvent)){Z=document.createEvent("MouseEvents");if(Z.initMouseEvent){Z.initMouseEvent(b,T,Q,c,V,S,R,P,N,O,L,a,Y,U,X);}else{Z=document.createEvent("UIEvents");Z.initEvent(b,T,Q);Z.view=c;Z.detail=V;Z.screenX=S;Z.screenY=R;Z.clientX=P;Z.clientY=N;Z.ctrlKey=O;Z.altKey=L;Z.metaKey=Y;Z.shiftKey=a;Z.button=U;Z.relatedTarget=X;}if(X&&!Z.relatedTarget){if(b=="mouseout"){Z.toElement=X;}else{if(b=="mouseover"){Z.fromElement=X;}}}W.dispatchEvent(Z);}else{if(K(document.createEventObject)){Z=document.createEventObject();Z.bubbles=T;Z.cancelable=Q;Z.view=c;Z.detail=V;Z.screenX=S;Z.screenY=R;Z.clientX=P;Z.clientY=N;Z.ctrlKey=O;Z.altKey=L;Z.metaKey=Y;Z.shiftKey=a;switch(U){case 0:Z.button=1;break;case 1:Z.button=4;break;case 2:break;default:Z.button=0;}Z.relatedTarget=X;W.fireEvent("on"+b,Z);}else{B.fail("simulateMouseEvent(): No event simulation framework present.");}}}G.each(M,function(L){B.Event[L]=function(O,N){N=N||{};A(O,L,N.bubbles,N.cancelable,N.view,N.detail,N.screenX,N.screenY,N.clientX,N.clientY,N.ctrlKey,N.altKey,N.shiftKey,N.metaKey,N.button,N.relatedTarget);};});G.each(I,function(L){B.Event[L]=function(O,N){N=N||{};F(O,L,N.bubbles,N.cancelable,N.view,N.ctrlKey,N.altKey,N.shiftKey,N.metaKey,N.keyCode,N.charCode);};});B.Event.simulate=function(O,N,L){if(D(B.Event[N])){B.Event[N](O,L);}};},"@VERSION@",{requires:["lang","event-dom"]});