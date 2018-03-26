/**
 * Created by feifei on 2016/5/19.
 */

/**
 * 附加的公共校验方法
 */
(function() {



    //中国的手机号校验
    jQuery.validator.addMethod("mobileCh", function(value, element) {
        var validateValue = removeAllSpace(value);
        return this.optional(element) || /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/i.test(validateValue);
    }, "Please specify a valid mobile number");


    //字符最小长度
    jQuery.validator.addMethod("minWordsLength", function(value, element,param) {
        return this.optional(element) || value.length>=param;
    }, "");


    //去除字符串中的所有空格
    function removeAllSpace(str) {
        return str.replace(/\s+/g, "");
    }
}());

