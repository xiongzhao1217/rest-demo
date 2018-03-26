/**
 * add by xiongzhao 2016.06.06
 * 常青藤前端页面提示库1.0-beta版
 * 1.Confirm确认框
 * (1)参数介绍
 * msg:提示信息,$obj触发事件的对象
 * (2)用法举例
 * html:
 * <button class="btn" id="delete" href="http://localhost:8080/news/newsDelete/10086">添加</button>
 * js:
 * $(document).on('click','#delete',function(){
 *     $.JYDMsgBox.Confirm($(this),"确定继续吗?");
 * });
 *
 *  2.Tips提示信息(在目标元素的右侧显示tips提示信息)
 *  (1)参数介绍
 *  msg:提示信息,$obj触发事件的对象
 *
 *  3.Alert提示框
 *  介绍:一个美观的alert提示
 *  
 *  4.DialogTips浮动提示框
 */
$(document).ready(function(){

    (function () {
    $.JYDMsgBox = {
        Confirm:function (msg,$obj) {
            jyd_confirm(msg, function () {
            var href = $obj.attr("href");
            window.location.href = href
        });
        },
        Tips:function (msg,$obj) {
            $obj.attr("data-placement", "right");
            $obj.attr("data-original-title", msg);
            $obj.tooltip("show");
            $obj.removeAttr("data-placement");
            $obj.removeAttr("data-original-title");
        },
        layerTips:function (msg,$obj) {
            layer.tips(msg, $obj, {
                time: 4000,
                tipsMore: true
            });
        },
        Alert:function (msg) {
            bootbox.dialog(msg, [
                {
                    label: "确定",
                    "class": "btn-danger"
                }
            ]);
        },
        DialogTips:function (msg) {
            $.jGrowl(msg);
        }

    };

    var jyd_confirm = function (msg, callback) {
        GenerateHtml(msg);
        $('#jydConfirm').click();
        btnOk(callback);
        btnNo();
    }

    //生成Html
    var GenerateHtml = function (msg) {

        var _html = "";

        _html = '<div class="modal hide fade" id="jyd_msg_model" role="dialog" tabindex="-1" aria-hidden="true" style="display: none;">'+
            '<div class="modal-header" style="height: 60px;">'+
            '<button aria-hidden="true" id="close_jyd_model" class="close" data-dismiss="modal" type="button">×</button>'+
            '<h3 style="margin-top: 16px;margin-left: 16px;">'+msg+'</h3>'+
            '</div>'+
            '<div class="modal-footer">'+
            '<a class="btn" id="jyd_mb_cancel" href="javascript:void(0)">取消</a>'+
            '<a class="btn btn-danger" id="jyd_mb_ok" href="#">继续</a>'+
            '</div>'+
            '<a style="display:none;" id="prettyClose" class="close" data-dismiss="modal" href="javascript:void(0)">取消</a>'+
            '</div>'+
            '<input id="jydConfirm" data-toggle="modal" href="#jyd_msg_model" type="hidden">';

        //将_html添加到body
        $("body").append(_html);
    };

    //确定按钮事件
    var btnOk = function (callback) {
        $("#jyd_mb_ok").click(function () {
            //$('#prettyClose').click();
            $("#jyd_msg_model,#jydConfirm,.modal-backdrop").remove();
            if (typeof (callback) == 'function') {
                callback();
            }
        });
    };

    //取消按钮事件
    var btnNo = function () {
        $("#jyd_mb_cancel,#jyd_msg_model").click(function () {
            //$('#prettyClose').click();
            $("#jyd_msg_model,#jydConfirm,.modal-backdrop").remove();
        });
    }
    })();

});