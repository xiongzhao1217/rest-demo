/**
 * 描述：地区二维码分享js
 * 作者：qinquan
 * 时间：2017-05-09
 */
define(function (require, exports, module) {

    var apiHelper = require("apiHelper");

     function loading() {

        var val = $('#provinceId option:selected').val();
        $.ajax({
            type : "post",
            url : popBerry.context.getBasePath()+"user/security/institution/"+val+"/linkage",
            dataType : "json",
            success : function (data) {
                if(data.status != 1){
                    $.JYDMsgBox.Alert(data.msg);
                }
                if (data.list != null){
                    var sel = $("#prefectureLevelCityId");
                    var option = "<option value=''>-- 请选择 （此项不选怎默认是省）--</option>";
                    for(var i=0;i<data.list.length;i++){
                        option += "<option value='"+data.list[i].id+"'>"+data.list[i].regionName+"</option>"
                    }
                    sel.html(option);

                    var city = $("#cityId");
                    var optionCity = "<option value=''>-- 请选择（此项不选怎默认是地级市） --</option>";
                    city.html(optionCity);
                }
            }

        });


    };

    exports.initAdd = function () {
        loading();
        /***
         * 二级联动
         */
        $(document).on('change','#provinceId',function () {
            var val = $('#provinceId option:selected').val();
            $.ajax({
                type : "post",
                url : popBerry.context.getBasePath()+"user/security/institution/"+val+"/linkage",
                dataType : "json",
                success : function (data) {
                    if(data.status != 1){
                        $.JYDMsgBox.Alert(data.msg);
                    }
                    if (data.list != null){
                        var sel = $("#prefectureLevelCityId");
                        var option = "<option value=''>-- 请选择 请选择 （此项不选怎默认是省）--</option>";
                        for(var i=0;i<data.list.length;i++){
                            option += "<option value='"+data.list[i].id+"'>"+data.list[i].regionName+"</option>"
                        }
                        sel.html(option);

                        var sel2 = $("#cityId");
                        var option = "<option value=''>-- 请选择 请选择 （此项不选怎默认是地级市）--</option>";
                        sel2.html(option);
                    }
                }

            });

        });

        /***
         * 三级联动
         */
        $(document).on('change','#prefectureLevelCityId',function () {
            var val = $('#prefectureLevelCityId option:selected').val();
            $.ajax({
                type : "post",
                url : popBerry.context.getBasePath()+"user/security/institution/"+val+"/linkage",
                dataType : "json",
                success : function (data) {
                    if(data.status != 1){
                        $.JYDMsgBox.Alert(data.msg);
                    }
                    if (data.list != null){
                        var sel = $("#cityId");
                        var option = "<option value=''>-- 请选择 请选择 （此项不选怎默认是地级市）--</option>";
                        for(var i=0;i<data.list.length;i++){
                            option += "<option value='"+data.list[i].id+"'>"+data.list[i].regionName+"</option>"
                        }
                        sel.html(option);
                    }
                }
            });

        });

        /**
         * 提交表单
         */
        $(document).on('click', '#submitForm', function () {

            $("#myForm").validate(validateRule);

            $('#myForm').submit();

        });

        /**
         * 取消提交表单,回到列表页面
         */
        $(document).on('click', '#cancelSubmit', function () {
            window.location.href = $(this).attr('url').toString();
        });


    };






    /**
     * 列表页js
     */
    exports.innit = function () {

        $(document).on('click','#objOpen',function () {

            var url = $(this).attr("url");

            var institutonName = $(this).attr("data-instituton");

            var objOpen = $(this).attr("objOpne");

            var institutionType = "";

            if (objOpen == 0){
                 institutionType = "确认冻结以下机构：";
            }else {
                institutionType = "确认取消冻结以下机构："
            }
            //询问框
            layer.confirm(institutionType+institutonName,{

                btn: ['确定','取消'] //按钮

            }, function(){
                 layer.load(1,{
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                })
                $.ajax({
                    type : "post",
                    url : url,
                    dataType : "json",
                    success : function (data) {
                        if(data.status == 1){
                            layer.close();
                            // $.JYDMsgBox.Alert(data.msg);
                            layer.msg(data.msg,{time:10000});
                        }else {
                            layer.close();
                            // $.JYDMsgBox.Alert(data.msg);
                            layer.msg(data.msg,{time:10000});
                        }
                        window.location.href=popBerry.context.getBasePath()+"user/security/institution/institutionList";
                    }
                });
            });

        });
    };

    exports.edit = function () {
        /**
         * 提交表单
         */
        $(document).on('click', '#submitForm', function () {

            $("#myForm").validate(validateRule);

            $('#myForm').submit();

        });

    };

    //表单校验规则
    var validateRule = {
        /// debug: true,
        errorElement: "span",
        errorClass: "help-block error",
        ignore: "",
        errorPlacement: function (e, t) {
            //校验不成功，则放开pwd
            $("#pwd").prop("disabled", false);
            $("#password").val("");
            return t.parents(".controls").append(e);

        },
        highlight: function (e) {
            return $(e).closest(".control-group").removeClass("error info").addClass("error");
        },
        success: function(e) {
            return e.closest(".control-group").removeClass("error");
        },
        errorPlacement: function (e, t) {
            return t.parents(".controls").append(e);
        },
        rules: {
            institutionName: {
                required: true
            },
            headName: {
                required: true
            },
            telephone: {
                checkTelephone: true
            },
            address: {
                required: true
            },
            cityId:{
                required:true
            },
            rate: {
                required: true
            }
        },
        messages: {
            institutionName: {
                required: "请输入机构名称"
            },
            headName: {
                required: "请输入负责人姓名"
            },
            telephone:{
                checkTelephone:"请输入正确的手机号码"
            },
            address: {
                required: "请输入地址"
            },
            cityId:{
                required:"请选择城市"
            },
            rate: {
                required: "请输入转化率"
            }
        }
    };

    jQuery.validator.addMethod("checkTelephone", function (value, element) {
        var value = $('#telephone').val();
        var flag = false;
        var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(myreg.test(value)){
            flag = true;
        }
        return flag;

    }, "");

});

