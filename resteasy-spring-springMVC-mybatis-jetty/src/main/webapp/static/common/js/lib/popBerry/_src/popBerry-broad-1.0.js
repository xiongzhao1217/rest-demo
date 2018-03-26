/*
 *@author lipenfei
 *@Date 2014-6-11
 *主要用于添加消息通知机制，类似于观察者模式
 *属于函数扩充
 *@support IE8+，Google Chrome,Safari,FireFox
 *
 *@version 1.0
 */
window.popBerry = window.popBerry || {};

(function($) {
	window.popBerry.broad = function() {
		// 通知外部
		this.broad = function(listeners) {
			switch (arguments.length) {
			case 1:
				for ( var i = 0; i < listeners.length; i++)
					listeners[i]();
				break;
			case 2:
				for ( var i = 0; i < listeners.length; i++)
					listeners[i](arguments[1]);
				break;
			case 3:
				for ( var i = 0; i < listeners.length; i++)
					listeners[i](arguments[1], arguments[2]);
				break;
			case 4:
				for ( var i = 0; i < listeners.length; i++)
					listeners[i](arguments[1], arguments[2], arguments[3]);
				break;
			case 5:
				for ( var i = 0; i < listeners.length; i++)
					listeners[i](arguments[1], arguments[2], arguments[3],
							arguments[4]);
				break;
			default:// 多于五个参数请使用对象传递
				for ( var i = 0; i < listeners.length; i++)
					listeners[i]();
				break;
			}
		};
	};
})(jQuery);