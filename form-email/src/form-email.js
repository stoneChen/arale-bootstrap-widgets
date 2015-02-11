define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var FormText = require("value-form-text");

    var template = require("./email.handlebars");
    var FormEmail = FormText.extend({
        attrs:{
            template:template,
            emailTip:false,
            explain:""
        },
        setModel:function(){
            var model = this.get("model");
            FormEmail.superclass.setModel.call(this);
            model.emailTip = this.get("emailTip");
            model.explain = this.get("explain");
        }
    })

    module.exports = FormEmail;
});
