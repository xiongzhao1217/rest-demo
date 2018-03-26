/**
 *
 * 公用的js模块
 * @author lipengfei
 * @email lipengfei217@163.com
 * @date 2015-06-16
 */
//本系统的命名空间
window.popBerryHelper = window.popBerryHelper || {};

/**
 * 这种写法为了屏蔽掉可能的命名重复导致页面js冲突的问题
 * 同时从外部引入jQuery
 */
(
    function (factory) {
        "use strict";
            // no AMD; invoke directly
            factory((typeof(jQuery) != 'undefined') ? jQuery : window.Zepto);
    }

    (function ($) {
        /**
         * 获得url中的参数，以json对象输出
         * @param url
         */
        function getParametersFromUrl(url) {
            var paramters = {};
            //        获取到url参数
            var queryString = getQueryString(url);
        }

        /**
         * 获得url中的参数串
         * @param url
         */
            //function getQueryString(url){
            //	var arry = url.split("?");
            //	var queryString="";
            //	if(arry.length>1){
            //		var queryString = arry[1];
            //	}
            //	return queryString;
            //}

            //建立popBerryHelper全局对象
        popBerryHelper = {
            call_api:function(s_set,options){
                var defaultOptions={
                    beforeSubmit:function(data) {
                        //alert("提交前");
                    },
                    success:function(data) {
                        //alert("成功了，呵呵")
                    },
                    error: function (data) {
                        alert("呀！出错了!");
                    },
                    faild:function(data){
                        //默认走一个方法
                        this.success(data);
                    },
                    complete:function(data){
                        //alert("已完成，呵呵")
                    }
                };

                $.extend( true,defaultOptions,options);

                var defaultParams={
                    apiTarget:s_set.target,
                    token:"",
                };

                $.extend(true,defaultParams,s_set.params);

                // 定义链接地址
                var s_url = s_set.base_url + s_set.target;

                $.ajax({
                    type:"POST",
                    dataType:"json",
                    url:s_url,
                    data:defaultParams,
                    beforeSend:function(){
                        defaultOptions.beforeSubmit(s_set);
                    },
                    success : function(data) {

                        if(data.valid=="true"){
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
                })
            },
            /**
             * 出去所有参数的url
             * @param url
             * @returns {*}
             */
            getCleanUrl: function (url) {
                var arry = url.split("?");
                return arry[0];
            },
            getQueryString: function (url) {
                var arry = url.split("?");
                var queryString = "";
                if (arry.length > 1) {
                    var queryString = arry[1];
                }
                return queryString;
            },
            /**
             * 获得url中的参数，以json对象输出
             * @param url
             */
            getParametersFromUrl: function (url) {
                var parameters = {};
                var queryString = this.getQueryString(url);
                var keyValue = queryString.split("&");
                for (var i = 0; i < keyValue.length; i++) {
                    var strings = keyValue[i].split("=");
                    var value = "";
                    if (strings.length > 1) {
                        value = strings[1];
                    }
                    parameters[strings[0]] = value;
                }
                return parameters;
            },
            /**
             * 绑定checkbox的事件，即当点击
             * 该checkbox时，将联动点击target所指属性为targetBoxName的checkbox组件
             * @param targetBoxName
             */
            bindCheckboxRegion: function (options) {

                var defaultOptions = {
                    doCheck: function (jqueryArray, thisObj) {
                        jqueryArray.attr('checked', true);
                        jqueryArray.prop('checked', true);
                    },
                    cancel: function (jqueryArray, thisObj) {
                        jqueryArray.attr('checked', false);
                        jqueryArray.prop('checked', false);
                    }
                };

                $.extend(true, defaultOptions, options);

                $(":checkbox[targetBox]").on('click', "", function () {
                    var targetBoxName = $(this).attr("targetBox");
                    var jqueryArray = $("[targetName='" + targetBoxName + "']");

                    if ($(this).is(":checked")) {
                        defaultOptions.doCheck(jqueryArray, $(this));
                    } else {
                        defaultOptions.cancel(jqueryArray, $(this));
                    }

                });
            },
            /**
             * 字符串转换成json对象
             * @Author lipengfei
             * @Date 2015-6-16
             * @Email lipengfei217@163.com
             * @param strJson json的字符串，注意，如果是数组，两边需要加[],如果已经有，则不需要。
             * @returns
             */
            str2JsonObj: function (strJson) {
                var jsonObj = $.parseJSON(strJson);
                return jsonObj;
            },
            /**
             *
             * @Author lipengfei
             * @Date 2015-6-16
             * @Email lipengfei217@163.com
             * @param inputObject 需要检查的组件的jQuery对象
             * @param forName 错误提示信息的forName,错误提示信息的组件中会有tip-message-for=‘forName’ 的属性，
             *                  其中forName是指针对那个元素进行判断（指定一个唯一的名称即可）
             * @param message 如果成功后的显示消息。
             * @param options 自定义配置。
             * @returns {Boolean} true:校验通过，false：校验不通过,即该元素为空
             */
            checkIfNull: function (inputObject, forName, message, options) {

                var that = this;

                var defaultOptions = {
                    isNull: function (forName, message) {
                        that.addErrorMessage(forName, message);
                    },
                    notNull: function (forName, message) {

                    }
                };

                $.extend(true, defaultOptions, options);

                var isValid = true;


                if (inputObject.val().replace(/\s/g, '').length == 0) {

                    defaultOptions.isNull(forName, message);

                    isValid = false;

                } else {
                    defaultOptions.notNull(forName, message);
                }
                return isValid;
            },

            /**
             * 检查数字大小,如果值为-999999,则不需要检查大小
             * @Author lipengfei
             * @Date 2015-6-16
             * @Email lipengfei217@163.com
             * @param max
             * @param min
             * @param content
             * @returns {Boolean}
             */
            checkNumber: function (content, options) {
                var that = this;
                var isValid = true;

                var defaultOptions = {
                    max: -999999,
                    min: -999999,
                    //检查字数之前
                    before: function (content) {

                    },
                    /**
                     * 如果不是数字
                     * @param content
                     */
                    notNum: function (content) {

                    },
                    bigger: function (content) {
                        //大于最数
                    },
                    smaller: function (content) {
                        //小于最小数
                    },
                    success: function (content) {

                    }
                };

                $.extend(true, defaultOptions, options);

                if (isNaN(content)) {//如果不是数字
                    isValid = false;
                    defaultOptions.notNum(content);
                } else {
                    var contentToNum = parseInt(content);

                    if (defaultOptions.max != -999999) {
                        if (contentToNum > defaultOptions.max) {
                            isValid = false;
                            defaultOptions.bigger(content);
                        }
                    }

                    if (defaultOptions.min != -999999) {
                        if (contentToNum <= defaultOptions.min) {
                            isValid = false;
                            defaultOptions.smaller(content);
                        }
                    }
                }
                if (isValid) {
                    defaultOptions.success(content);
                }
                return isValid;
            },
            /**
             * 检查字数,如果max 和min为0,则代表无此限制
             * @Author lipengfei
             * @Date 2015-6-16
             * @Email lipengfei217@163.com
             * @param max
             * @param min
             * @param content
             * @returns {Boolean}
             */
            checkWordNumber: function (content, options) {
                var that = this;
                var isValid = true;

                var defaultOptions = {
                    max: 400,
                    min: 10,
                    //检查字数之前
                    before: function (content) {

                    },
                    //取得长度，默认为直接字符的长度
                    getContentLength: function (content) {
                        return content.length;
                    },
                    bigger: function (content) {
                        //大于最数
                    },
                    smaller: function (content) {
                        //小于最小数
                    },
                    success: function (content) {

                    }
                };
                $.extend(true, defaultOptions, options);

                var length = defaultOptions.getContentLength(content);

                if (defaultOptions.max > 0) {
                    if (length > defaultOptions.max) {
                        isValid = false;
                        defaultOptions.bigger(content);
                    }
                }

                if (defaultOptions.min > 0) {
                    if (length < defaultOptions.min) {
                        isValid = false;
                        defaultOptions.smaller(content);
                    }
                }

                if (isValid) {
                    defaultOptions.success(content);
                }
                return isValid;
            },
            /**
             * 在含有tip-message-for的属性的元素上加html值
             * @param forName 定位是属于哪一个元素
             * @param message 要展示的信息
             * @param options
             */
            addMessage: function (forName, message, options) {
                var tipsObj = $('[tip-message-for="' + forName + '"]');

                var defaultOptions = {
                    success: function () {

                    }
                };

                $.extend(true, defaultOptions, options);

                tipsObj.html(message);
                defaultOptions.success();

            },
            /**
             * 在含有tip-message-for的属性的元素上加html值,加错误信息，
             * 默认显示该元素
             * @param forName 定位是属于哪一个元素
             * @param message 要展示的信息
             * @param options
             */
            addErrorMessage: function (forName, message, options) {
                var that = this;
                var tipsObj = $('[tip-message-for="' + forName + '"]');

                var defaultOptions = {
                    success: function () {
                        tipsObj.fadeIn();
                    }
                };

                $.extend(true, defaultOptions, options);

                that.addMessage(forName, message, defaultOptions);
            },
            /**
             * 在含有tip-message-for的属性的元素上加html值,加错误信息，
             * 默认执行完，隐藏该元素
             * @param forName 定位是属于哪一个元素
             * @param message 要展示的信息
             * @param options
             */
            addSuccessMessage: function (forName, message, options) {
                var that = this;
                var tipsObj = $('[tip-message-for="' + forName + '"]');

                var defaultOptions = {
                    success: function () {
                        tipsObj.fadeOut();
                    }
                };

                $.extend(true, defaultOptions, options);

                that.addMessage(forName, message, defaultOptions);
            }
        };
    })
);