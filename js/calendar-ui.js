//UI类
(function() {
	
	"use strict";

	Calendar.namespace("ui");

	// 方法名createOptions
	// 为select生成option子元素
	// 比如生成1-12月可以像下面调用
	// var select = document.getElementById("select-month");
	// Calendar.ui.createOptions(select, 1, 12, "月" );
	Calendar.ui.createOptions = function(select, start, end, unit) {
		var tpl = "<option  value={$value}>{$name}{$unit}</option>",
			opts = "",
			data = {
				unit: unit || ""
			};
		for(var  i = start; i <= end; i++) {
			data.value = i;
			data.name = i;
			opts += Calendar.tpl.replace(tpl, data);
		}
		select.innerHTML = opts;
	};
})();