// 这是模板类

(function() {

	"use strict";

	// 定义新的命名空间Calendar.tpl
	Calendar.namespace("Calendar.tpl");

	// 在命名空间Calendar.tpl上面添加新的方法repalce
	// 它用来模板替换的的，接受两个参数，第一个是需要替换的模板字符串
	// 第二个是提供替换值的对象
	Calendar.tpl.replace = function(tpl, data) {

		var reg = /\{\$[\w]+\}/g, //匹配正则
			afterReplace;

		// 字符串模板里面的{$str}替换成data[str]
		afterReplace = tpl.replace(reg, function(match) {
			var property = match.slice(2, match.length-1);
			return data[property];
		});

		//返回替换后的字符串
		return afterReplace;
	};
})();