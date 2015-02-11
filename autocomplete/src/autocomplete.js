define(function(require, exports, module) {
    "use strict";
    var $ = require("$");
    var AutoComplete = require("arale-autocomplete");
    var ValueAutoComplete = AutoComplete.extend({
        parseElement: function () {
            var that = this;
            this.templatePartials || (this.templatePartials = {});
            $.each(['header', 'footer', 'html'], function (index, item) {
                that.templatePartials[item] = that.get(item);
            });
            AutoComplete.superclass.parseElement.call(this);
        }
    })
    module.exports = ValueAutoComplete;
});
