define("value/base/1.0.0/base",["arale/templatable/0.9.2/templatable","$","gallery/handlebars/1.0.2/handlebars","arale/widget/1.1.1/widget","arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events"],function(a,b,c){"use strict";var d=a("arale/templatable/0.9.2/templatable"),e=a("arale/widget/1.1.1/widget"),f=[],g=e.extend({Implements:d,attrs:{parentNode:null},initAttrs:function(a,b){g.superclass.initAttrs.call(this,a,b),f.push(this)},setup:function(){this.render()},getOuterHTML:function(){return this.element[0].outerHTML},hide:function(){this.element.hide()},show:function(){this.element.show()}});g.destroyAll=function(){f.forEach(function(a){a.destroy()})},c.exports=g});
