define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var Countdown = require("value-countdown");
    var FormText = require("value-form-text");
    var template = require("./form-text-mobile.handlebars");
    var MobileText = FormText.extend({
        attrs:{
            url:"",
            colWidth:5,
            mobileTip:false,
            explain:"",
            template:template
        },
        events:{
            "click .fetch-valicode-btn":function(ev){
                if(this.valid()){
                    this.fetch();
                }
            }
        },
        setModel:function(){
            MobileText.superclass.setModel.call(this);
            var model = this.get("model");
            model.mobileTip = this.get("mobileTip");
            model.explain = this.get("explain");
        },
        fetch:function(){
            var url = this.get("url");
            var $self=this;
            var mobileName = this.get("mobileName");
            var data = this.getValue();
            $.eduAjax({
                url:url,
                data:data,
                done:function(){
                    $self.startCountdown();
                }
            })
        },
        startCountdown:function(){
            var $fetchValicodeBtn = this.$(".fetch-valicode-btn");
            var $countdownWrapper = $fetchValicodeBtn.find("span")
            $fetchValicodeBtn.prop("disabled",true);
            new Countdown({
                element:$countdownWrapper,
                totalRemain:60*1000,
                format:function(hours,mins,seconds){
                    return "(" + seconds + ")";
                },
                onTimeup:function(){
                    $fetchValicodeBtn.prop("disabled",false);
                    $countdownWrapper.text("")
                }
            })
        }
    })
    module.exports = MobileText;
});