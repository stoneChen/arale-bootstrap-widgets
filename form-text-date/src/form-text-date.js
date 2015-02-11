define(function (require, exports, module) {
    var $ = require("$");
    require("datetimepicker");
    var template = require("./text-date.handlebars");
    var FormText = require("value-form-text");
    var FormTextDate =  FormText.extend({
        attrs:{
            template:template,
            emailTip:false,
            explain:""
        },
        setup: function () {
            this.$("input").datetimepicker({
                lang:'zh-cn',
                format:'YYYY-MM-DD HH:mm:ss'
            });
            FormTextDate.superclass.setup.call(this);
        }
    })
    module.exports = FormTextDate;
});
