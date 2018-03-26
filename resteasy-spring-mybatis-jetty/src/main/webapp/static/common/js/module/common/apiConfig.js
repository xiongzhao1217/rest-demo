/**
 * API接口配置的js
 * @author lipengfei
 * @email lipengfei217@163.com
 * @date 2015-06-16
 */

define(function(require, exports, module) {


    exports.getApiTargetConfig=function(apiName){
        return exports.config.api_list[apiName];
    }

    exports.config ={
        base_url: popBerry.context.getBasePath()+"/jsonapi/",
        base_upload_url: popBerry.context.getBasePath()+"/uploader/",
        cookie_user_token : '',
        cookie_user_phone: '',
        // API列表
        api_list : {
            sysSignupAdmin:{
                api_name:"api_signupAdmin",
                flag_token : true
            }
        }
    }
});