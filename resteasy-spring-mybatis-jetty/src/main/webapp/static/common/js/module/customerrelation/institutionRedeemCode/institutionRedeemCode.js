/**
 * 描述：机构兑换码js
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
         * 更多分页
         */
        $(document).on('change', '#morePage', function () {
            var pageSize = $("#morePage option:selected").val();
            $("#pageSize").val(pageSize);
        });

        /**
         * 启用
         */
        $(document).on('click', '#objOpen', function () {

            var url = $(this).attr('url');

            //询问框
            layer.confirm('确定开启？',{

                btn: ['确定','取消'] //按钮

            }, function(){

                layer.closeAll('dialog');

                window.location.href = url;

            });
        });

        /**
         * 停用
         */
        $(document).on('click', '#objClose', function () {

            var url = $(this).attr('url');

            //询问框
            layer.confirm('确定取消？',{

                btn: ['确定','取消'] //按钮

            }, function(){

                layer.closeAll('dialog');



                window.location.href = url;

            });
        });

        /**
         * 删除
         */
        $(document).on('click', '#objDelete', function () {

            var url = $(this).attr('url');

            //询问框
            layer.confirm('确定删除？',{

                btn: ['确定','取消'] //按钮

            }, function(){

                layer.closeAll('dialog');

                window.location.href = url;

            });
        });

        /**
         * 机构号批次号级联
         */
        $(document).on('change', '#institutionCode', function () {
            var code = $("#institutionCode option:selected").val();
            var sel = $("#batchNumber");
            if(code != null && code != ""){
                $.ajax({
                    url:popBerry.context.getBasePath() + "user/security/institutionRedeem/queryBatchNumber",
                    type:"POST",
                    data:{
                        "institutionCode":code
                    },
                    success: function(data) {
                        if(data.status = 1){
                            var numbers = data.obj;
                            var op = "<option value=''>请先选择机构号</option>";
                            for(var i=0;i<numbers.length;i++){
                                op += "<option value='"+numbers[i]+"'>"+numbers[i]+"</option>";
                            }
                            sel.html(op);
                        }
                        layer.msg(data.msg);
                    }
                });
            }else{
                sel.html("<option value=''>请先选择机构号</option>");
            }

        });

        /**
         * 入库点击
         */
        $(document).on('click', '#storageBtn', function () {
            var uuid = $(this).attr("data-content");
            $("#categoryUUid").val(uuid);
            $("#modal_storage").modal("show");
        });

        /**
         * 入库提交
         */
        $(document).on('click', '#submitButton', function () {
            if(isFalse == 0){
                layer.load(2);
                isFalse = 1;
                var skuUUid = $("#categoryUUid").val();
                var quantity = $("#quantityNum").val();
                var url = popBerry.context.getBasePath() + "user/security/redeemCodeStock/doStorage";
                $.ajax({
                    url:url,
                    type:"POST",
                    data:{
                        "skuUUid":skuUUid,
                        "quantity":quantity
                    },
                    success: function(data) {
                        layer.closeAll('loading');
                        layer.msg(data.msg);
            }
                });
                isFalse = 0;
            }
            $("#modal_storage").modal("hide");
        });

        /**
         * 全选点击
         */
        $(document).on('click', '#checkAll', function () {
            var checked = $(this).attr("checked");
            if(checked){
                $(".check-box").attr("checked","checked");
            }else{
                $(".check-box").removeAttr("checked");
            }

        });

        /**
         * 批量冻结/解冻
         */
        $(document).on('click', '#checkFreeze', function () {
            var checkeds = $(".no_sorting input:checked");
            var operateType = $(this).attr("data-content");
            var checkIds = new Array();
            if(checkeds.length <= 0){
                layer.msg("请选择需要冻结的兑换码！")
                return;
            }

            for(var i = 0; i<checkeds.length;i++){
                var id = $(checkeds[i]).attr("value");
                checkIds.push(Number(id));
            }

            var param = {
                ids:checkIds,
                operateType:operateType
            }

            $.ajax({
                type: "post",
                url:popBerry.context.getBasePath() + "user/security/institutionRedeem/doBatchFreeze",
                data:param,
                dataType: "json",
                traditional:true,//传递数组
                success: function (data) {
                    if(data.status == 1){
                        document.location.reload();
                    }else{
                        layer.msg(data.msg);
                    }
                }
            });

        });

        /**
         * 批量废弃
         */
        $(document).on('click', '#checkDisCard', function () {
            var checkeds = $(".no_sorting input:checked");
            var checkIds = new Array();
            if(checkeds.length <= 0){
                layer.msg("请选择需要冻结的兑换码！")
                return;
            }

            for(var i = 0; i<checkeds.length;i++){
                var id = $(checkeds[i]).attr("value");
                checkIds.push(Number(id));
            }

            var param = {
                ids:checkIds
            }

            $.ajax({
                type: "post",
                url:popBerry.context.getBasePath() + "user/security/institutionRedeem/doBatchDisCard",
                data:param,
                dataType: "json",
                traditional:true,//传递数组
                success: function (data) {
                    if(data.status == 1){
                        document.location.reload();
                    }else{
                        layer.msg(data.msg);
                    }
                }
            });

        });

        /**
         * 全部导出
         */
        $(document).on('click', '#exportAll', function () {
            var checkeds = $(".no_sorting input:checked");
            var checkIds = new Array();
            if(checkeds.length <= 0){
                layer.msg("请选择需要导出兑换码！")
                return;
            }
            for(var i = 0; i<checkeds.length;i++){
                var id = $(checkeds[i]).attr("value");
                checkIds.push(Number(id));
            }

            var param = {
                ids:checkIds
            }

            $.ajax({
                type: "post",
                url:popBerry.context.getBasePath() + "user/security/institutionRedeem/bachExportAll",
                data:param,
                dataType: "json",
                traditional:true,//传递数组
                success: function (data) {
                    if(data.status == 1){
                        var dataJson = data.obj;
                        if(dataJson == '')
                            return;

                        JSONToExcelConvertor(dataJson.data, dataJson.name, dataJson.title);

                        document.location.reload();
                    }else{
                        layer.msg(data.msg);
                    }
                }
            });

        });

        function JSONToExcelConvertor(JSONData, FileName, ShowLabel) {
            //先转化json
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var excel = '<table>';

            //设置表头
            var row = "<tr>";
            for (var i = 0, l = ShowLabel.length; i < l; i++) {
                row += "<td>" + ShowLabel[i].value + '</td>';
            }


            //换行
            excel += row + "</tr>";

            //设置数据
            for (var i = 0; i < arrData.length; i++) {
                var row = "<tr>";

                for (var index in arrData[i]) {
                    var value = arrData[i][index].value === "." ? "" : arrData[i][index].value;
                    row += '<td>' + value + '</td>';
                }

                excel += row + "</tr>";
            }

            excel += "</table>";

            var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
            excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
            excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
            excelFile += '; charset=UTF-8">';
            excelFile += "<head>";
            excelFile += "<!--[if gte mso 9]>";
            excelFile += "<xml>";
            excelFile += "<x:ExcelWorkbook>";
            excelFile += "<x:ExcelWorksheets>";
            excelFile += "<x:ExcelWorksheet>";
            excelFile += "<x:Name>";
            excelFile += "{worksheet}";
            excelFile += "</x:Name>";
            excelFile += "<x:WorksheetOptions>";
            excelFile += "<x:DisplayGridlines/>";
            excelFile += "</x:WorksheetOptions>";
            excelFile += "</x:ExcelWorksheet>";
            excelFile += "</x:ExcelWorksheets>";
            excelFile += "</x:ExcelWorkbook>";
            excelFile += "</xml>";
            excelFile += "<![endif]-->";
            excelFile += "</head>";
            excelFile += "<body>";
            excelFile += excel;
            excelFile += "</body>";
            excelFile += "</html>";


            var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

            var link = document.createElement("a");
            link.href = uri;

            link.style = "visibility:hidden";
            link.download = FileName + ".xls";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    };

    /**
     * 添加/修改页面的js
     */
    exports.initEdit = function () {
        // editLoading();

        /**
         *  兑换码类型切换
         */
        $(document).on('change', '#codeCategory', function () {
            var value = $("#codeCategory option:selected").val();
            if(value == 2){
                $("#price").removeAttr("style");
                $("#price").removeAttr("disabled");
            }else{
                $("#price").attr("style","display: none");
                $("#price").attr("disabled",true);
            }
        });

        /**
         * 机构兑换码数量切换
         */
        $(document).on('change', '#codeNum', function () {
            var value = $("#codeNum option:selected").val();
            if(value == 0){
                $("#otherNum").removeAttr("style");
                $("#otherNum").removeAttr("disabled");
            }else{
                $("#otherNum").attr("style","display: none");
                $("#otherNum").attr("disabled",true);
            }
        });

        /**
         * 机构切换
         */
        $(document).on('change', '#institutionCode', function () {
            var value = $("#institutionCode option:selected").val();
            if(value == 0){
                $("#otherCode").removeAttr("style");
                $("#otherCode").removeAttr("disabled");
            }else{
                $("#otherCode").attr("style","display: none");
                $("#otherCode").attr("disabled",true);
            }
        });

        /**
         * 提交表单
         */
        $(document).on('click', '#submitForm', function () {

            var beginStr = $("#beginTime").val();
            var endStr = $("#endTime").val();

            if(beginStr == null || beginStr == "" || endStr == null || endStr == "" || beginStr == undefined || endStr == undefined){
                layer.msg("请填写正确有效期！");
                return;
            }
            layer.load(2);
            var begin = new Date(beginStr);
            var end = new Date(endStr);
            if(begin.getTime() - end.getTime() > 0){
                layer.msg("开始时间不能大于结束时间");
                return;
            }
            $.ajax({
                type: "POST",
                url:popBerry.context.getBasePath() + "user/security/institutionRedeem/doInstitutionRedeemCodeAdd",
                data:$('#myForm').serialize(),
                success: function(data) {
                    layer.closeAll('loading');
                    if(data.status == 1005){
                        layer.msg(data.msg, {
                            time: 10000, //20s后自动关闭
                            btn: ['添加库存', '取消']
                        },function () {
                            window.location.href = popBerry.context.getBasePath() + "user/security/institutionRedeem/toRedeemCodeCategoryList";
                        });
                    }else{
                        window.location.href = popBerry.context.getBasePath() + "user/security/institutionOrder/toInstitutionOrderList";
                    }

                }
            });
        });

        /**
         * 提交兑换码种类表单
         */
        $(document).on('click', '#submitCatForm', function () {
             $("#catForm").submit();
        });


    };

    //表单校验规则
    var validateRule = {
        // debug: true,
        errorElement: "span",
        errorClass: "help-block error",
        ignore: "",
        errorPlacement: function (e, t) {
            return t.parents(".controls").append(e);
        },
        highlight: function (e) {
            return $(e).closest(".control-group").removeClass("error info").addClass("error");
        },
        success: function (e) {
            return e.closest(".control-group").removeClass("error");
        },
        rules: {
            title: {
                required: true
            }
        },
        messages: {
            title: {
                required: "请输入标题"
            }

        }
    };

});

