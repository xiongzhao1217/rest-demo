/**
 * 描述：左侧菜单栏js
 * 作者：xiongzhao
 * 时间：2016-08-23
 */
define(function (require, exports, module) {

    var apiHelper = require("apiHelper");


    /**
     * 左侧菜单栏的js
     */
    exports.initLeftBar = function () {

        /**
         * 启用系统优惠券
         */
        $(document).on('click', '#downloadYZTrade', function () {

            var url = $(this).attr('url');

            //询问框
            layer.confirm('确定手动同步有赞订单？',{

                btn: ['确定','取消'] //按钮

            }, function(){

                layer.closeAll('dialog');

                var html = "";
                html += '<div id="loaderModel" class="modal-backdrop fade in" style="margin:0 auto;">';
                html += '<table style="width: 100%;height: 80%" >';
                html += '<tr><td align="center">';
                html += '<font color="#00acec" size="5px"><i class="icon-2x icon-spinner icon-spin"></i></font>';
                html += '</td></tr>';
                html += '</table>';
                html += '</div>';

                $("#main-nav").after(html);

                /** 发送ajax请求 **/

                var url = '/exploiterAdmin/' + 'user/security/handleSynYZOrder';

                $.ajax({
                    async: true, //是否异步
                    cache: false, //是否使用缓存
                    type: 'post', //请求方式,post
                    dataType: "json", //传输数据格式
                    url: url, //请求链接
                    error: function () {
                        $('#loaderModel').remove();
                        $.JYDMsgBox.Alert('下载有赞订单失败');
                    },
                    success: function (data) {

                        $('#loaderModel').remove();

                        if(data.status == '1'){
                            $.JYDMsgBox.DialogTips(data.message);
                        }else {
                            $.JYDMsgBox.Alert(data.message);
                        }


                    }
                });

            });
        });



    };

});

