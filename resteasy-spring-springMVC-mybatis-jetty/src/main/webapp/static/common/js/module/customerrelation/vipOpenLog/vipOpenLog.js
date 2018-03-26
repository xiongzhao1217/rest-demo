/**
 * 描述：会员开通记录js
 * 作者：yd
 * 时间：2017-03-29
 */
define(function (require, exports, module) {

    var apiHelper = require("apiHelper");

    var parserDate = function (date) {
        var t = Date.parse(date);
        if (!isNaN(t)) {
            return new Date(Date.parse(date.replace(/-/g, "/")));
        } else {
            return new Date();
        }
    };
    var isFalse = 0;

    /**
     * 列表页面的js
     */
    exports.initList = function () {

        /**
         * 提交表单
         */
        $(document).on('click', '#submitBtn', function () {

            var beginStr = $("#timeBeginStr").val();
            var endStr = $("#timeEndStr").val();

            var begin = new Date(beginStr);
            var end = new Date(endStr);
            if(begin.getTime() - end.getTime() > 0){
                layer.msg("开始时间不能大于结束时间");
                return;
            }

            var form = $("#queryForm");
            form.submit();
        });
    }



});

