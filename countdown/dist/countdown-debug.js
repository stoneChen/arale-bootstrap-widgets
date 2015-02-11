define("value/countdown/1.0.0/countdown-debug", [ "$-debug", "gallery/moment/2.8.3/moment-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var Moment = require("gallery/moment/2.8.3/moment-debug");
    var BaseWidget = require("value/base/1.0.0/base-debug");
    var Countdown = BaseWidget.extend({
        attrs: {
            element: null,
            totalRemain: 0,
            interval: 1e3,
            onTimeup: function() {},
            format: function() {}
        },
        timer: null,
        setup: function() {
            Countdown.superclass.setup.call(this);
            this.start();
        },
        start: function() {
            var self = this;
            var interval = this.get("interval");
            var totalRemain = this.get("totalRemain");
            if (!totalRemain || totalRemain < 0) {
                self.trigger("timeup");
                return;
            }
            var duration = Moment.duration(totalRemain, "milliseconds");
            var doCount = function() {
                duration = Moment.duration(duration.asMilliseconds() - interval, "milliseconds");
                var remain = duration.asMilliseconds();
                if (remain < 0) {
                    clearInterval(self.timer);
                    self.trigger("timeup");
                    return;
                }
                self.setTimerText(duration);
            };
            doCount();
            self.timer = setInterval(doCount, interval);
        },
        setTimerText: function(d) {
            var self = this;
            var days = d.days(), hours = d.hours(), mins = d.minutes(), seconds = d.seconds();
            if (days > 0) {
                hours += days * 24;
            }
            hours = this.fillZero(hours);
            mins = this.fillZero(mins);
            seconds = this.fillZero(seconds);
            var format = self.get("format");
            var ret = format && format.call(self, hours, mins, seconds);
            this.element.text(ret);
        },
        fillZero: function(num, digit) {
            digit = digit || 2;
            num = num + "";
            var len = num.length;
            var diff = digit - len;
            if (diff <= 0) {
                return num;
            } else {
                return new Array(diff + 1).join("0") + num;
            }
        }
    });
    return Countdown;
});
