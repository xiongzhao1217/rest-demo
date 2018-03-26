/**
 * @author lipengfei
 * @date 2016-05-18
 * @time 23:19
 *
 */

define(function(require,exports,module){

    var apiHelper = require("apiHelper");

    exports.validate=function(){



        var $form = $("#myForm");

        var validate = $form.validate(validateRule);



    };
    //
    // exports.test=function (myStr) {
    //         alert("");
    // };


    //表单校验规则
    var validateRule={
        // debug: true,
        errorElement: "span",
        errorClass: "help-block error",
        errorPlacement: function(e, t) {
            //校验不成功，则放开pwd
                $("#pwd").prop( "disabled", false );
                $("#password").val("");
            return t.parents(".controls").append(e);

        },
        highlight: function(e) {
            return $(e).closest(".control-group").removeClass("error success").addClass("error");
        },
        //设置提交动作
        submitHandler: function(form) {
            var $form = $(form);

            var pwdValue =$("#pwd").val();
            // 对pwd进行加密操作
            $("#pwd").prop( "disabled", true );
            $("#password").val(MD5(pwdValue));

            $.ajax({
                url:$form.attr('action'),
                type:"POST",
                data:$form.serialize(),
                success: function(data) {
                    if(data.resultCode == '1'){

                        layer.msg(data.resultMessage);
                        window.location.href=popBerry.context.getBasePath()+"user/security/sys/adminList.html";

                    }else {
                        layer.msg(data.resultMessage);
                    }
                }
            });
        },
        success: function(e) {
            return e.closest(".control-group").removeClass("error");
        },
        rules:{
            email: {
                required: true,
                email: true
            },
            mobile:{
                required:true,
                mobileCh:true
            },
            pwd:{
                required:true,
                minWordsLength:8
            },
            lastName:{
                required:true
            },
            firstName:{
                required:true
            },
            sex:{
                required:true
            }
        },
        messages:{

            email:{
                required:"请输入邮箱",
                email:"请输入正确的email地址"
            },
            mobile:{
                required:"请输入手机号",
                mobileCh:"请输入正确的手机号"
            },
            pwd:{
                required:"请输入密码",
                minWordsLength:"密码长度不得低于8个字符"
            },
            lastName:{
                required:"姓氏不能为空",
            },
            firstName:{
                required:"名字不能为空",
            },
            sex:{
                required:"性别不能为空",
            }
        }
    }

});