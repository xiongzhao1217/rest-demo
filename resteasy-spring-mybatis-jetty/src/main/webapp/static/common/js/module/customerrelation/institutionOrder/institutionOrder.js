/**
 * 描述：机构兑换码订单js
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
        $(document).on('click', '#submitQueryBtn', function () {

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

        // /**
        //  * 机构号批次号级联
        //  */
        // $(document).on('change', '#institutionCode', function () {
        //     var code = $("#institutionCode option:selected").val();
        //     var sel = $("#batchNumber");
        //     if(code != null && code != ""){
        //         $.ajax({
        //             url:popBerry.context.getBasePath() + "user/security/institutionOrder/queryBatchNumber",
        //             type:"POST",
        //             data:{
        //                 "institutionCode":code
        //             },
        //             success: function(data) {
        //                 if(data.status = 1){
        //                     var numbers = data.obj;
        //                     var op = "";
        //                     for(var i=0;i<numbers.length;i++){
        //                         op += "<option value='"+numbers[i]+"'>"+numbers[i]+"</option>";
        //                     }
        //                     sel.html(op);
        //                 }
        //                 layer.msg(data.msg);
        //             }
        //         });
        //     }else{
        //         sel.html("<option value=''>请先选择机构号</option>");
        //     }
        //
        // });

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
         * 取消订单
         */
        $(document).on('click', '#objCancel', function () {

            var url = $(this).attr('url');

            //询问框
            layer.confirm('确定取消订单吗？',{

                btn: ['确定','取消'] //按钮

            }, function(){

                layer.closeAll('dialog');

                window.location.href = url;

            });
        });

        /**
         * 发码点击
         */
        $(document).on('click', '#grantBtn', function () {
            var obj = $(this).attr("data-content");
            var oJson = JSON.parse(obj);

            $("#codeNumber").text(oJson.institutionCode);
            $("#skuId").val(oJson.skuId);
            $("#skuName").text(oJson.skuName);
            $("#quantity").text(oJson.redeemCodeNum);
            $("#orderId").val(oJson.id);


            var beginDate = new Date();
            beginDate.setTime(oJson.timeBegin);

            var endDate = new Date();
            endDate.setTime(oJson.timeEnd);

            $("#beginStr").html(beginDate.toLocaleDateString());
            $("#endStr").html(endDate.toLocaleDateString());

            $("#beginDate").val(oJson.timeBegin);
            $("#endDate").val(oJson.timeEnd);

            $("#modal_grant").modal("show");
        });

        /**
         * 发码提交
         */
        $(document).on('click', '#submitButton', function () {
            if(isFalse == 0){
                isFalse = 1;

                var skuId = $("#skuId").val();
                var institutionCode = $("#codeNumber").text();
                var skuName = $("#skuName").text();
                var redeemCodeNum = $("#quantity").text();
                var timeBegin = $("#beginDate").val();
                var timeEnd = $("#endDate").val();
                var orderId = $("#orderId").val();

                var url = popBerry.context.getBasePath() + "user/security/institutionOrder/doGrantCode";
                $.ajax({
                    url:url,
                    type:"POST",
                    data:{
                        "id":orderId,
                        "skuId":skuId,
                        "institutionCode":institutionCode,
                        "skuName":skuName,
                        "redeemCodeNum":redeemCodeNum,
                        "timeBeginLongStr":timeBegin,
                        "timeEndLongStr":timeEnd
                    },
                    success: function(data) {
                        $("#modal_grant").modal("hide");
                        if(data.status ==1){
                            //询问框
                            layer.confirm('发码数量：'+data.obj.redeemCodeNum+',批次号：'+data.obj.batchNumber+',总金额：'+data.obj.totalAmount,{

                                btn: ['确定','取消'] //按钮

                            }, function(){
                                layer.closeAll('dialog');
                                window.location.href = popBerry.context.getBasePath() + "user/security/institutionOrder/toInstitutionOrderList";
                            });
                        }else{
                            layer.msg(data.msg);
                        }
                    }
                });
                isFalse = 0;
            }

        });

        /**
         * 付款
         */
        $(document).on('click', '#payBtn', function () {

            var orderUUid = $(this).attr('data-content');
            var orderPrice = $(this).attr('data-value');

            $("#orderUUid").val(orderUUid);
            $("#orderPrice").val(orderPrice);

            $("#modal_amount").modal("show");

        });

        /**
         * 付款提交
         */
        $(document).on('click', '#submitPayButton', function () {
            if(isFalse == 0){
                isFalse = 1;
                var uuid = $("#orderUUid").val();
                var actualAmount = $("#actualAmount").val();
                var price = $("#orderPrice").val();
                if(actualAmount > price){
                    layer.msg('付款金额不能大于订单金额');
                    return;
                }
                var url = popBerry.context.getBasePath() + "user/security/institutionOrder/doPay";
                $.ajax({
                    url:url,
                    type:"POST",
                    data:{
                        "uuid":uuid,
                        "actualAmount":actualAmount
                    },
                    success: function(data) {
                        layer.msg(data.msg);
                        window.location.href = popBerry.context.getBasePath() + "user/security/institutionOrder/toInstitutionOrderList";
                    }
                });
                isFalse = 0;
            }
            $("#modal_amount").modal("hide");
        });

        /**
         * 导出
         */
        $(document).on('click', '#exportBtn', function () {
            var id = $(this).attr("data-content");
            if(id == null || id == 0 || id == undefined){
                layer.msg("请选择订单！")
                return;
            }

            var param = {
                id:id
            }

            $.ajax({
                type: "post",
                url:popBerry.context.getBasePath() + "user/security/institutionOrder/exportOrder",
                data:param,
                dataType: "json",
                // traditional:true,//传递数组
                success: function (data) {
                    if(data.status == 1){
                        var dataJson = data.obj;
                        if(dataJson == '')
                            return;

                        JSONToExcelConvertor(dataJson.data, data.obj.name, dataJson.title);

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
        editLoading();

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

            // $("#myForm").validate(validateRule);
            $.ajax({
                type: "POST",
                url:popBerry.context.getBasePath() + "user/security/institutionRedeem/doInstitutionRedeemCodeAdd",
                data:$('#myForm').serialize(),
                success: function(data) {
                    layer.msg(data.msg);
                }
            });
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

