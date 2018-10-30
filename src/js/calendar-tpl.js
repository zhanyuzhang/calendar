// 命名空间Calendar.tpl
// 主要包含了模板替换的方法
(function() {

	"use strict";

	// 生成新的命名空间Calendar.tpl
	Calendar.namespace("Calendar.tpl");

	// @method replace: 用来进行模板替换
	// @param {string} tpl: 字符串形式的模板
	// @param {obj} data: 提供替换数据的对象
	// @return {string} : 替换后的字符串

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