//UI类
(function() {
	
	"use strict";

	Calendar.namespace("ui");

	//创建日历的表格
	Calendar.ui.createWeekGrid = function(container) {

		var weeks = ["一", "二", "三", "四", "五", "六", "日"],
			weekHtml = "";

		//创建日历的表头
		weekHtml += '<div class="row week-header">';
		for(var i = 0; i < 7; i++) {
			weekHtml += '<div class="col-xs-one-of-seven">' + weeks[i] +'</div>';
		}
		weekHtml += "</div>";

		//创建日历内容
		for(var i = 0; i < 6; i++) {
			weekHtml += '<div class="row week-content">';
			for(var  j = 0; j < 7; j++) {
				weekHtml += '<div class="col-xs-one-of-seven dates"></div>'
			}
			weekHtml += '</div>';
		}



		container.innerHTML = weekHtml;


		// for(var i = 0; i < 6; i++) {
		// 	weekHtml += '<div class="row">';
		// 	for(j = 0; j < 7; j++) {

		// 	}
		// }
	};	

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

	//往日历里面填充日期
	Calendar.ui.fillDate = function(year, month) {
		var className = ".week-content .dates",
			dates = document.querySelectorAll(className),
			index = Calendar.core.getFirstDayOfMonth(year, month) - 1,
			monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		//清空上一次的日历内容
		for(var i = 0, len = dates.length; i < len; i++) {
			dates[i].innerHTML = "";
		}
		
		index = (index < 0) ? 6 : index; //是否为星期日		
		monthDays[1] = Calendar.core.isLeapYear(year) ? 29 : 28; //是否为闰年

		//填充当月的
		for(var i = index, date = 1 ; i <  monthDays[month - 1] + index; i++) {
			var solarDate = date++,
				lunarDate = Calendar.core.getLunarDay(year, month, solarDate),
				html = '<div class="solarDate">' + solarDate + '</div>' + 
						'<div class="lunarDate">' + lunarDate + '</div>';
			dates[i].classList.add("current-month");
			dates[i].innerHTML = html;
		}

		//填充开头和结尾的日期
		var lastMonth = (month === 1) ? 12 : month - 1,
			nextMonth = (month === 12) ? 1 : month + 1,
			lastYear = (month === 1) ? year - 1 : year,
			nextYear = (month === 12) ? year + 1 : year;

		//上个月的
		for(var i = index - 1, date = monthDays[lastMonth - 1]; i >= 0; i--) {
			var solarDate = date--,
				lunarDate = Calendar.core.getLunarDay(lastYear, lastMonth, solarDate),
				html = '<div class="solarDate">' + solarDate + '</div>' + 
						'<div class="lunarDate">' + lunarDate + '</div>';
			dates[i].classList.add("last-month");
			dates[i].innerHTML = html;
		}

		//下个月的
		var start = monthDays[month - 1] + index;
		for(var i = start, len =  dates.length, date = 1; i < len; i++) {
			var solarDate = date++,
				lunarDate = Calendar.core.getLunarDay(nextYear, nextMonth, solarDate),
				html = '<div class="solarDate lastMonth">' + solarDate + '</div>' + 
						'<div class="lunarDate">' + lunarDate + '</div>';
			dates[i].classList.add("next-month");
			dates[i].innerHTML = html;
		}


	}

})();