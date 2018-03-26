/*
 *@author lipenfei
 *@Date 2014-6-11
 *菜单的模块，需要bootstrap的支持
 *@support Google Chrome,Safari,FireFox
 *@version 1.0 beta
 * popBerry.context.getBasePath
 */
window.popBerry = window.popBerry || {};
(function() {
	window.popBerry.context = {
			//配置整个全局的工程目录名称
		getBasePath: function() {
			return "/crmAdmin/";
		},
		getQueryString : function(name, type) {
			//通过name来获取参数的值，如果第二个参数不是code，则需要解码
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) {
				if (type == "code") {
					return r[2];
				} else {
					return decodeURIComponent(r[2]);
				}
			} else {
				return null;
			}
		}
	}
})();