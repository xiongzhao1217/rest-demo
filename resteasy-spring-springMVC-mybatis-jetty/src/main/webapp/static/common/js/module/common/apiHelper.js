/**
 * TrainingHub公用的js模块
 * @author lipengfei
 * @email lipengfei217@163.com
 * @date 2015-06-16
 */

define(function(require, exports, module) {
    
    require('popberryHelper');

    require('layer');

    require("ajaxForm");

    var apiConfig = require("apiConfig");

    exports.api_call=function(apiName,o_map_params,options){
        var defaultOptions={
            success:function(data){
                alert(data.resultMessage);
            },
            complete:function(data){
                //layer.closeAll("loading");
            },
            failed:function(data){
                exports.openMsg(data.resultMessage,0);
            },
            error:function(data){
            }

        };
        $.extend( true,defaultOptions,options);
        //-------getApiTarget---start---
        var userToken="";

        var targetConfig = apiConfig.getApiTargetConfig(apiName);

        if (targetConfig.flag_token) {
            userToken = "token";
        }
        //-------getApiTarget---end---
        popBerryHelper.call_api({
            base_url:apiConfig.config.base_url,
            target:targetConfig.api_name,
            token:userToken,
            params:o_map_params
        },defaultOptions);
    };

    /**
     * 初始化为AjaxForm，且同时注册Api框架
     * @param options
     */
    exports.api_ajaxSubmitForm=function($formObj,apiName,options){

        var defaultOptions={
            formType:"common",
            beforeSerialize:function(arr, $form, options){

            },
            failed:function(data){
                exports.openMsg(data.resultMessage,0);
            },
            beforeSubmit:function(arr, $form, options) {
                //alert("提交前")
            },
            success:function(data) {
                //alert("成功了，呵呵")
            },
            error: function (data) {
                alert("呀！出错了!");
            },
            complete:function(data){
                //alert("已完成，呵呵")
            }
        };
        $.extend( true,defaultOptions,options);
        //-------getApiTarget---start---
        var userToken="";

        var targetConfig = apiConfig.getApiTargetConfig(apiName);

        if (targetConfig.flag_token) {
            userToken = "token";
        }
        //-------getApiTarget---end---


        $formObj.ajaxSubmit({
            beforeSerialize:function(arr, $form, options){//用于表单序列化之前修改内容
                //表单的url加上参数
                //var url = $form.url;
                var url;
                //一个是普通的表单，一个是上传附件的表单
                if(defaultOptions.formType=="common"){
                    url = apiConfig.config.base_url+targetConfig.api_name;
                }else if(defaultOptions.formType=="upload"){
                    url = apiConfig.config.base_upload_url+targetConfig.api_name;
                }
                var extendParam="";
                $form.url=url;

                defaultOptions.beforeSerialize(arr, $form, options);
                //查看表单是否已经在传参数。
            },
            beforeSubmit : function(arr, $form, options) {
                var inputParam = getInputParamJson($form);
                return defaultOptions.beforeSubmit(arr, $form, options);
            },
            success : function(data) {
                if(data.valid.toString()=="true"){
                    defaultOptions.success(data);

                }else{
                    defaultOptions.failed(data);
                }
            },
            error : function(data) {
                defaultOptions.error(data);
            },
            complete:function(){
                defaultOptions.complete();
            }

        });
    }

    /**
     * 将form表单的数据转变成json
     * @param $form
     * @returns {*|{name, value}}
     */
    function getInputParamJson($form){
        var o = {};
        var a =  $form.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        //转成字符串
        var jsonStr = JSON.stringify(o);
        return jsonStr;
    }


    /**
     *
     * @param infoMsg 展示的信息
     * @param type 1：正确的操作提示 0：错误的操作提示
     * @param options 对应于layer组件的相应参数。具体参考layer官网http://layer.layui.com/
     */
    //弹窗方法
    exports.openMsg = function(infoMsg,type,options){
        var msg = "";
        if(type!=0 && !type){
            //如果type没有，则默认为1
            type=1;
        }
        if(type == 1){
            //type为1表示正确操作的提示
            msg = '<div class="tips-pop2" style="display:block;"><span>'+infoMsg+'</span></div>';
        }else if(type == 0){
            //type为0表示错误操作的提示
            msg = '<div class="tips-pop1" style="display:block;"><span>'+infoMsg+'</span></div>';
        }
        var defaultOptions={
            type:1,
            title: false,
            offset:'130px',
            closeBtn: false,
            shade: false,
            time:4000,
            content:msg,
            shift:5
        };
        $.extend( true,defaultOptions,options);
        var index = layer.open(defaultOptions);
        return index;
    };


});