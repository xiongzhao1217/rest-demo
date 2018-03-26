/**
 * 描述：处理审批js
 * 作者：qinquan
 * 时间：2017-06-07
 */
define(function (require, exports, module) {

    var apiHelper = require("apiHelper");


    exports.initAdd = function () {
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
            remark: {
                required: true
            }
        },
        messages: {
            remark: {
                required: "请输入申请审核理由"
            }
        }
    };
});

