define("value/countdown/1.0.0/countdown",["$","gallery/moment/2.8.3/moment","value/base/1.0.0/base","arale/templatable/0.9.2/templatable","gallery/handlebars/1.0.2/handlebars","arale/widget/1.1.1/widget","arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events"],function(a){"use strict";a("$");var b=a("gallery/moment/2.8.3/moment"),c=a("value/base/1.0.0/base"),d=c.extend({attrs:{element:null,totalRemain:0,interval:1e3,onTimeup:function(){},format:function(){}},timer:null,setup:function(){d.superclass.setup.call(this),this.start()},start:function(){var a=this,c=this.get("interval"),d=this.get("totalRemain");if(!d||0>d)return a.trigger("timeup"),void 0;var e=b.duration(d,"milliseconds"),f=function(){e=b.duration(e.asMilliseconds()-c,"milliseconds");var d=e.asMilliseconds();return 0>d?(clearInterval(a.timer),a.trigger("timeup"),void 0):(a.setTimerText(e),void 0)};f(),a.timer=setInterval(f,c)},setTimerText:function(a){var b=this,c=a.days(),d=a.hours(),e=a.minutes(),f=a.seconds();c>0&&(d+=24*c),d=this.fillZero(d),e=this.fillZero(e),f=this.fillZero(f);var g=b.get("format"),h=g&&g.call(b,d,e,f);this.element.text(h)},fillZero:function(a,b){b=b||2,a+="";var c=a.length,d=b-c;return 0>=d?a:new Array(d+1).join("0")+a}});return d});