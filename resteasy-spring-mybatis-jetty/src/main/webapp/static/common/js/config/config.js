
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl:  popBerry.context.getBasePath()+'static/common/js/module',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since

    //the paths config could be for a directory.
    paths: {
        category:'category',
        countLect:'countLect',
        lectureList:'lectureList',
        sysSetting: 'sys',
        lecture: 'lecture',
        commonJs:'common',
        validateMethod:'common/validate_addtion_method',
        md5:'../lib/encryption/md5.min',
        ajaxForm:'../lib/ajaxForm/jquery.form.min',
        layerDir:'../lib/layer-v2.3/layer',
        layer:'../lib/layer-v2.3/layer/layer',
        popberryContext:'../lib/popBerry/_src/popBerry-context-1.0',
        popberryHelper:'../lib/popBerry/_src/popBerry-helper',
        apiConfig:'common/apiConfig',
        apiHelper:'common/apiHelper',
        wangEditor:'../lib/wangEditor_2.1.21/dist/js/wangEditor',
        jquery:'../lib/jquery/jquery.min',
        ZeroClipboard: "../lib/ueditor/third-party/zeroclipboard/ZeroClipboard",
        ueditor:'../lib/ueditor/ueditor.all',
        ueditorConfig:'../lib/ueditor/ueditor.config'
    },
    waitSeconds: 15
});

// require("layer");

//添加popBerry的包
require(["popberryContext","popberryHelper"]);

//加载md5
require(["md5","ajaxForm"]);




