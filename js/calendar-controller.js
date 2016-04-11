window.onload = function() {
	"use strict";
	// console.log(Calendar.core.getLunarDay(2016, 04, 15));

	//创建菜单栏
	var year = document.getElementById("select-year"),
		month = document.getElementById("select-month");
		
	Calendar.ui.createOptions(year, 1901, 2050, "年");
	Calendar.ui.createOptions(month, 1, 12, "月");

	//创建日历表
	var week = document.getElementById("week");
	Calendar.ui.createWeekGrid(week);

	//填充日期
	Calendar.ui.fillDate(parseInt(year.value), parseInt(month.value));

	//月份和年份变化时，刷新日历表
	year.addEventListener("change", function() {
		Calendar.ui.fillDate(parseInt(year.value), parseInt(month.value));
	}, false);

	month.addEventListener("change", function() {
		Calendar.ui.fillDate(parseInt(year.value), parseInt(month.value));
	}, false);

};