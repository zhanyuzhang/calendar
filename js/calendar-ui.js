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

		//辅助数组，存放日期信息
		var solarInfo = new Array(42), //每个日期的新历信息
			lunarInfo = new Array(42); //每个日期的农历信息

		var className = ".week-content .dates",
			dates = document.querySelectorAll(className),
			index = Calendar.core.getFirstDayOfMonth(year, month) - 1,
			monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			solarDate = 0,
			lunarDate = 0,
			lunarObj = {};

		//html字符串
		var	solarDiv = '<div class="solar-date">',
			lunarDiv = '<div class="lunar-date">',
			endDiv = '</div>',
			html = '';

		//清空上一次的日历内容以及样式
		for(var i = 0, len = dates.length; i < len; i++) {
			dates[i].innerHTML = "";
			dates[i].className = "col-xs-one-of-seven dates";
		}
		
		index = (index < 0) ? 6 : index; //是否为星期日		
		monthDays[1] = Calendar.core.isLeapYear(year) ? 29 : 28; //是否为闰年

		//填充当前月份的日期
		for(var i = index, date = 1 ; i <  monthDays[month - 1] + index; i++) {
			solarDate = date++;
			lunarObj = Calendar.core.getLunarDay(year, month, solarDate);
			lunarDate = (lunarObj.date === "初一") ? lunarObj.month : lunarObj.date;
			html = solarDiv + solarDate + endDiv +  lunarDiv + lunarDate + endDiv;

			solarInfo[i] = month + "," + solarDate;
			lunarInfo[i] = lunarObj.month + "," + lunarObj.date;
			
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
			solarDate = date--;
			lunarObj = Calendar.core.getLunarDay(lastYear, lastMonth, solarDate);
			lunarDate = (lunarObj.date === "初一") ? lunarObj.month : lunarObj.date;
			html = solarDiv + solarDate + endDiv +  lunarDiv + lunarDate + endDiv;
			solarInfo[i] = lastMonth + "," + solarDate;
			lunarInfo[i] = lunarObj.month + "," + lunarObj.date;
			dates[i].classList.add("last-month");
			dates[i].innerHTML = html;
		}

		//下个月的
		var start = monthDays[month - 1] + index;
		for(var i = start, len =  dates.length, date = 1; i < len; i++) {
			solarDate = date++;
			lunarObj = Calendar.core.getLunarDay(nextYear, nextMonth, solarDate);
			lunarDate = (lunarObj.date === "初一") ? lunarObj.month : lunarObj.date;
			html = solarDiv + solarDate + endDiv +  lunarDiv + lunarDate + endDiv;
			solarInfo[i] = nextMonth + "," + solarDate;
			lunarInfo[i] = lunarObj.month + "," + lunarObj.date;
			dates[i].classList.add("next-month");
			dates[i].innerHTML = html;
		}

		console.log(solarInfo);
		Calendar.ui.addTermStyle(solarInfo, year, month);
		Calendar.ui.addSolarFestival(solarInfo);

	};

	//为节气日期添加样式
	Calendar.ui.addTermStyle = function(solarInfo, year, month) {

		var lastMonth = (month === 1) ? 12 : month - 1,
			nextMonth = (month === 12) ? 1 : month + 1,
			lastYear = (month === 1) ? year - 1 : year,
			nextYear = (month === 12) ? year + 1 : year,
			termsInfo = [],
			lunarDates = document.querySelectorAll(".lunar-date");

		termsInfo = Calendar.core.getDateOfSolarTerm(year, month);
		termsInfo = termsInfo.concat(Calendar.core.getDateOfSolarTerm(lastYear, lastMonth));
		termsInfo = termsInfo.concat(Calendar.core.getDateOfSolarTerm(nextYear, nextMonth));

		for(var i = 0, len = solarInfo.length; i < len; i++) {
			for(var j = 0; j < termsInfo.length; j++) {
				if(solarInfo[i] === termsInfo[j].date ) {
					lunarDates[i].innerHTML = termsInfo[j].termName;
					lunarDates[i].classList.add("term-date");
				}
			}
		}
	};

	Calendar.ui.addSolarFestival = function(solarInfo) {

		var lunarDates = document.querySelectorAll(".lunar-date");

		var solarFestival = [
			{date: "1,1", fName: "元旦"},
			{date: "1,14", fName: "情人节"},
			{date: "3,8", fName: "妇女节"},
			{date: "3,12", fName: "植树节"},
			{date: "3,15", fName: "消费者权益日"},
			{date: "4,1", fName: "愚人节"},
			{date: "5,1", fName: "劳动节"},
			{date: "5,4", fName: "青年节"},
			{date: "5,12", fName: "护士节"},
			{date: "6,1", fName: "儿童节"},
			{date: "7,1", fName: "建党节"},
			{date: "8,1", fName: "建军节"},
			{date: "9,10", fName: "教师节"},
			{date: "9,18", fName: "孔子诞辰"},
			{date: "10,1", fName: "国庆节"},
			{date: "10,6", fName: "老人节"},
			{date: "10,24", fName: "联合国日"},
			{date: "12,24", fName: "平安夜"},
			{date: "12,25", fName: "圣诞节"}
		];

		for(var i = 0; i < solarInfo.length; i++) {
			for(var  j = 0; j < solarFestival.length; j++) {
				if(solarInfo[i] === solarFestival[j].date) {
					lunarDates[i].innerHTML = solarFestival[j].fName;
					lunarDates[i].classList.add("solar-festival-date");
				}
			}
		};






	};


})();