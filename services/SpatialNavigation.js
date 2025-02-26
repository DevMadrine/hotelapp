!function(e){"use strict";var t={selector:"",straightOnly:!1,straightOverlapThreshold:.5,rememberSource:!1,disabled:!1,defaultElement:"",enterTo:"",leaveFor:null,restrict:"self-first",tabIndexIgnoreList:"a, input, select, textarea, button, iframe, [contentEditable=true]",navigableFilter:null},r={37:"left",38:"up",39:"right",40:"down"},n={left:"right",up:"down",right:"left",down:"up"},o="sn:",i=0,a=!1,u=!1,c={},s=0,f="",l="",d=!1,v=Element.prototype.matches||Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.webkitMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||function(e){var t=(this.parentNode||this.document).querySelectorAll(e);return[].slice.call(t).indexOf(this)>=0};function p(e){var t=e.getBoundingClientRect(),r={left:t.left,top:t.top,right:t.right,bottom:t.bottom,width:t.width,height:t.height};return r.element=e,r.center={x:r.left+Math.floor(r.width/2),y:r.top+Math.floor(r.height/2)},r.center.left=r.center.right=r.center.x,r.center.top=r.center.bottom=r.center.y,r}function g(e,t,r){for(var n=[[],[],[],[],[],[],[],[],[]],o=0;o<e.length;o++){var i,a,u=e[o],c=u.center;if(i=c.x<t.left?0:c.x<=t.right?1:2,n[a=3*(c.y<t.top?0:c.y<=t.bottom?1:2)+i].push(u),-1!==[0,2,6,8].indexOf(a)){var s=r;u.left<=t.right-t.width*s&&(2===a?n[1].push(u):8===a&&n[7].push(u)),u.right>=t.left+t.width*s&&(0===a?n[1].push(u):6===a&&n[7].push(u)),u.top<=t.bottom-t.height*s&&(6===a?n[3].push(u):8===a&&n[5].push(u)),u.bottom>=t.top+t.height*s&&(0===a?n[3].push(u):2===a&&n[5].push(u))}}return n}function h(e,t,r,n){if(!(e&&t&&r&&r.length))return null;for(var o=[],i=0;i<r.length;i++){var a=p(r[i]);a&&o.push(a)}if(!o.length)return null;var u=p(e);if(!u)return null;var c,s=function(e){return{nearPlumbLineIsBetter:function(t){var r;return(r=t.center.x<e.center.x?e.center.x-t.right:t.left-e.center.x)<0?0:r},nearHorizonIsBetter:function(t){var r;return(r=t.center.y<e.center.y?e.center.y-t.bottom:t.top-e.center.y)<0?0:r},nearTargetLeftIsBetter:function(t){var r;return(r=t.center.x<e.center.x?e.left-t.right:t.left-e.left)<0?0:r},nearTargetTopIsBetter:function(t){var r;return(r=t.center.y<e.center.y?e.top-t.bottom:t.top-e.top)<0?0:r},topIsBetter:function(e){return e.top},bottomIsBetter:function(e){return-1*e.bottom},leftIsBetter:function(e){return e.left},rightIsBetter:function(e){return-1*e.right}}}(u),f=g(o,u,n.straightOverlapThreshold),l=g(f[4],u.center,n.straightOverlapThreshold);switch(t){case"left":c=[{group:l[0].concat(l[3]).concat(l[6]),distance:[s.nearPlumbLineIsBetter,s.topIsBetter]},{group:f[3],distance:[s.nearPlumbLineIsBetter,s.topIsBetter]},{group:f[0].concat(f[6]),distance:[s.nearHorizonIsBetter,s.rightIsBetter,s.nearTargetTopIsBetter]}];break;case"right":c=[{group:l[2].concat(l[5]).concat(l[8]),distance:[s.nearPlumbLineIsBetter,s.topIsBetter]},{group:f[5],distance:[s.nearPlumbLineIsBetter,s.topIsBetter]},{group:f[2].concat(f[8]),distance:[s.nearHorizonIsBetter,s.leftIsBetter,s.nearTargetTopIsBetter]}];break;case"up":c=[{group:l[0].concat(l[1]).concat(l[2]),distance:[s.nearHorizonIsBetter,s.leftIsBetter]},{group:f[1],distance:[s.nearHorizonIsBetter,s.leftIsBetter]},{group:f[0].concat(f[2]),distance:[s.nearPlumbLineIsBetter,s.bottomIsBetter,s.nearTargetLeftIsBetter]}];break;case"down":c=[{group:l[6].concat(l[7]).concat(l[8]),distance:[s.nearHorizonIsBetter,s.leftIsBetter]},{group:f[7],distance:[s.nearHorizonIsBetter,s.leftIsBetter]},{group:f[6].concat(f[8]),distance:[s.nearPlumbLineIsBetter,s.topIsBetter,s.nearTargetLeftIsBetter]}];break;default:return null}n.straightOnly&&c.pop();var d=function(e){for(var t=null,r=0;r<e.length;r++)if(e[r].group.length){t=e[r];break}if(!t)return null;var n=t.distance;return t.group.sort((function(e,t){for(var r=0;r<n.length;r++){var o=n[r],i=o(e)-o(t);if(i)return i}return 0})),t.group}(c);if(!d)return null;var v=null;if(n.rememberSource&&n.previous&&n.previous.destination===e&&n.previous.reverse===t)for(var h=0;h<d.length;h++)if(d[h].element===n.previous.target){v=d[h].element;break}return v||(v=d[0].element),v}function b(t){var r=[];try{t&&(e?r=e(t).get():"string"==typeof t?r=[].slice.call(document.querySelectorAll(t)):"object"==typeof t&&t.length?r=[].slice.call(t):"object"==typeof t&&1===t.nodeType&&(r=[t]))}catch(e){console.error(e)}return r}function m(t,r){return e?e(t).is(r):"string"==typeof r?v.call(t,r):"object"==typeof r&&r.length?r.indexOf(t)>=0:"object"==typeof r&&1===r.nodeType&&t===r}function y(){var e=document.activeElement;if(e&&e!==document.body)return e}function w(e){e=e||{};for(var t=1;t<arguments.length;t++)if(arguments[t])for(var r in arguments[t])arguments[t].hasOwnProperty(r)&&void 0!==arguments[t][r]&&(e[r]=arguments[t][r]);return e}function I(e,t){Array.isArray(t)||(t=[t]);for(var r,n=0;n<t.length;n++)(r=e.indexOf(t[n]))>=0&&e.splice(r,1);return e}function B(e,r,n){if(!e||!r||!c[r]||c[r].disabled)return!1;if(e.offsetWidth<=0&&e.offsetHeight<=0||e.hasAttribute("disabled"))return!1;if(n&&!m(e,c[r].selector))return!1;if("function"==typeof c[r].navigableFilter){if(!1===c[r].navigableFilter(e,r))return!1}else if("function"==typeof t.navigableFilter&&!1===t.navigableFilter(e,r))return!1;return!0}function E(e){for(var t in c)if(!c[t].disabled&&m(e,c[t].selector))return t}function x(e){return b(c[e].selector).filter((function(t){return B(t,e)}))}function L(e){var t=b(c[e].defaultElement).find((function(t){return B(t,e,!0)}));return t||null}function k(e){var t=c[e].lastFocusedElement;return B(t,e,!0)?t:null}function S(e,t,r,n){arguments.length<4&&(n=!0);var i=document.createEvent("CustomEvent");return i.initCustomEvent(o+t,!0,n,r),e.dispatchEvent(i)}function T(e,t,r){if(!e)return!1;var n=y(),o=function(){n&&n.blur(),e.focus(),F(e,t)};if(d)return o(),!0;if(d=!0,u)return o(),d=!1,!0;if(n){var i={nextElement:e,nextSectionId:t,direction:r,native:!1};if(!S(n,"willunfocus",i))return d=!1,!1;n.blur(),S(n,"unfocused",i,!1)}var a={previousElement:n,sectionId:t,direction:r,native:!1};return S(e,"willfocus",a)?(e.focus(),S(e,"focused",a,!1),d=!1,F(e,t),!0):(d=!1,!1)}function F(e,t){t||(t=E(e)),t&&(c[t].lastFocusedElement=e,l=t)}function O(e,t){if("@"==e.charAt(0))return 1==e.length?j():j(e.substr(1));var r=b(e)[0];if(r){var n=E(r);if(B(r,n))return T(r,n,t)}return!1}function j(e){var t=[],r=function(e){e&&t.indexOf(e)<0&&c[e]&&!c[e].disabled&&t.push(e)};e?r(e):(r(f),r(l),Object.keys(c).map(r));for(var n=0;n<t.length;n++){var o,i=t[n];if(o="last-focused"==c[i].enterTo?k(i)||L(i)||x(i)[0]:L(i)||k(i)||x(i)[0])return T(o,i)}return!1}function P(e,t){S(e,"navigatefailed",{direction:t},!1)}function A(t,r){if(c[t].leaveFor&&void 0!==c[t].leaveFor[r]){var n=c[t].leaveFor[r];if("string"==typeof n)return""===n?null:O(n,r);e&&n instanceof e&&(n=n.get(0));var o=E(n);if(B(n,o))return T(n,o,r)}return!1}function z(e,r,o){var i=r.getAttribute("data-sn-"+e);if("string"==typeof i)return!(""===i||!O(i,e))||(P(r,e),!1);var a={},u=[];for(var s in c)a[s]=x(s),u=u.concat(a[s]);var f,l=w({},t,c[o]);if("self-only"==l.restrict||"self-first"==l.restrict){var d=a[o];(f=h(r,e,I(d,r),l))||"self-first"!=l.restrict||(f=h(r,e,I(u,d),l))}else f=h(r,e,I(u,r),l);if(f){c[o].previous={target:r,destination:f,reverse:n[e]};var v=E(f);if(o!=v){var p,g=A(o,e);if(g)return!0;if(null===g)return P(r,e),!1;switch(c[v].enterTo){case"last-focused":p=k(v)||L(v);break;case"default-element":p=L(v)}p&&(f=p)}return T(f,v,e)}return!!A(o,e)||(P(r,e),!1)}function H(e){if(!(!s||u||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)){var t,n=function(){return e.preventDefault(),e.stopPropagation(),!1},o=r[e.keyCode];if(!o)return 13==e.keyCode&&(t=y())&&E(t)&&!S(t,"enter-down")?n():void 0;if(!(t=y())&&(l&&(t=k(l)),!t))return j(),n();var i=E(t);if(i)return S(t,"willmove",{direction:o,sectionId:i,cause:"keydown"})&&z(o,t,i),n()}}function K(e){if(!(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)&&!u&&s&&13==e.keyCode){var t=y();t&&E(t)&&(S(t,"enter-up")||(e.preventDefault(),e.stopPropagation()))}}function C(e){var t=e.target;if(t!==window&&t!==document&&s&&!d){var r=E(t);if(r){if(u)return void F(t,r);var n={sectionId:r,native:!0};S(t,"willfocus",n)?(S(t,"focused",n,!1),F(t,r)):(d=!0,t.blur(),d=!1)}}}function M(e){var t=e.target;if(t!==window&&t!==document&&!u&&s&&!d&&E(t)){var r={native:!0};S(t,"willunfocus",r)?S(t,"unfocused",r,!1):(d=!0,setTimeout((function(){t.focus(),d=!1})))}}var N={init:function(){a||(window.addEventListener("keydown",H),window.addEventListener("keyup",K),window.addEventListener("focus",C,!0),window.addEventListener("blur",M,!0),a=!0)},uninit:function(){window.removeEventListener("blur",M,!0),window.removeEventListener("focus",C,!0),window.removeEventListener("keyup",K),window.removeEventListener("keydown",H),N.clear(),i=0,a=!1},clear:function(){c={},s=0,f="",l="",d=!1},set:function(){var e,r;if("object"==typeof arguments[0])r=arguments[0];else{if("string"!=typeof arguments[0]||"object"!=typeof arguments[1])return;if(r=arguments[1],!c[e=arguments[0]])throw new Error('Section "'+e+"\" doesn't exist!")}for(var n in r)void 0!==t[n]&&(e?c[e][n]=r[n]:void 0!==r[n]&&(t[n]=r[n]));e&&(c[e]=w({},c[e]))},add:function(){var e,t={};if("object"==typeof arguments[0]?t=arguments[0]:"string"==typeof arguments[0]&&"object"==typeof arguments[1]&&(e=arguments[0],t=arguments[1]),e||(e="string"==typeof t.id?t.id:function(){for(var e;e="section-"+String(++i),c[e];);return e}()),c[e])throw new Error('Section "'+e+'" has already existed!');return c[e]={},s++,N.set(e,t),e},remove:function(e){if(!e||"string"!=typeof e)throw new Error('Please assign the "sectionId"!');return!!c[e]&&(c[e]=void 0,c=w({},c),s--,l===e&&(l=""),!0)},disable:function(e){return!!c[e]&&(c[e].disabled=!0,!0)},enable:function(e){return!!c[e]&&(c[e].disabled=!1,!0)},pause:function(){u=!0},resume:function(){u=!1},focus:function(t,r){var n=!1;void 0===r&&"boolean"==typeof t&&(r=t,t=void 0);var o=!u&&r;if(o&&N.pause(),t)if("string"==typeof t)n=c[t]?j(t):O(t);else{e&&t instanceof e&&(t=t.get(0));var i=E(t);B(t,i)&&(n=T(t,i))}else n=j();return o&&N.resume(),n},move:function(e,t){if(e=e.toLowerCase(),!n[e])return!1;var r=t?b(t)[0]:y();if(!r)return!1;var o=E(r);return!!o&&(!!S(r,"willmove",{direction:e,sectionId:o,cause:"api"})&&z(e,r,o))},makeFocusable:function(e){var r=function(e){var r=void 0!==e.tabIndexIgnoreList?e.tabIndexIgnoreList:t.tabIndexIgnoreList;b(e.selector).forEach((function(e){m(e,r)||e.getAttribute("tabindex")||e.setAttribute("tabindex","-1")}))};if(e){if(!c[e])throw new Error('Section "'+e+"\" doesn't exist!");r(c[e])}else for(var n in c)r(c[n])},setDefaultSection:function(e){if(e){if(!c[e])throw new Error('Section "'+e+"\" doesn't exist!");f=e}else f=""}};window.SpatialNavigation=N,"object"==typeof module&&(module.exports=N),e&&(e.SpatialNavigation=function(){if(N.init(),arguments.length>0){if(e.isPlainObject(arguments[0]))return N.add(arguments[0]);if("string"===e.type(arguments[0])&&e.isFunction(N[arguments[0]]))return N[arguments[0]].apply(N,[].slice.call(arguments,1))}return e.extend({},N)},e.fn.SpatialNavigation=function(){var t;return(t=e.isPlainObject(arguments[0])?arguments[0]:{id:arguments[0]}).selector=this,N.init(),t.id&&N.remove(t.id),N.add(t),N.makeFocusable(t.id),this})}(window.jQuery);