<html >
<head>

    <#--<!--#parse("/common/common_head_title.vm")&ndash;&gt;-->
    <#--<!--#parse("/common/common_head_meta.vm")&ndash;&gt;-->
	<#--<!--#parse("/common/common_head_ref.vm")&ndash;&gt;-->
    <#--<!--#leftBarActive("home")&ndash;&gt;-->
    <meta charset="utf-8">
    <meta content="IE=Edge" http-equiv="X-UA-Compatible">
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport' />
</head>
<body class='$!{themeStyle}'>
	<!--#parse("/common/common_head.vm")-->

<div id='wrapper'>

    <div id='main-nav-bg'></div>

    <#--<!--#parse("/common/common_leftbar.vm")&ndash;&gt;-->
    欢迎[${user.userTelephone}]!

    <br>
    当前时间(yyyy-MM-dd):${nowTime?string('yyyy-MM-dd')}
    <br>
    当前时间(yyyy-MM-dd hh:mm:ss):${nowTime?string('yyyy-MM-dd HH:mm:ss')}
    <br>
${date1}
    <section id='content'>
        <div class='container-fluid'>
            <div class='row-fluid' id='content-wrapper'>
                <div class='span12'>
                    <div class='page-header'>
                        <h1 class='pull-left'>
                            <i class='icon-home'></i>
                            <span>首页</span>
                        </h1>
                    </div>
                    <div class='alert alert-info'>
                        <a class='close' data-dismiss='alert' href='#'>&times;</a>
                        欢迎来到
                        <strong>[常青藤爸爸]</strong>
                        - 希望你会喜欢他. 温馨提示 - 你可以通过点击左上方
                        <strong>[ <i class='icon-reorder'></i> ]</strong>
                        图标隐藏左侧菜单栏.
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

</body>
</html>
