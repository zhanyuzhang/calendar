window.onload = function() {
	"use strict";
	// console.log(Calendar.core.getLunarDay(2016, 04, 15));

	//创建菜单栏
	var selectYear = document.getElementById("select-year"),
		selectMonth = document.getElementById("select-month");
	
	//创建年份的月份的下拉选择框
	Calendar.ui.createOptions( selectYear, 1901, 2050, "年");
	Calendar.ui.createOptions(selectMonth, 1, 12, "月");

	//创建日历表
	var week = document.getElementById("week");
	Calendar.ui.createWeekGrid(week);

	//填充日期
	goToToday();

	//月份和年份变化时，刷新日历表
	 selectYear.addEventListener("change", function() {
		Calendar.ui.fillDate(parseInt( selectYear.value), parseInt(selectMonth.value));
	}, false);

	selectMonth.addEventListener("change", function() {
		Calendar.ui.fillDate(parseInt( selectYear.value), parseInt(selectMonth.value));
	}, false);

	//返回今天
	var backTodayBtn = document.getElementById("backToday");
	backTodayBtn.addEventListener("click", goToToday, false);

	function goToToday() {

		var today = new Date(),
			currentYear = today.getFullYear(),
			currentMonth = today.getMonth() + 1,
			currentDate = today.getDate();
			
		selectYear.value = currentYear;
		selectMonth.value = currentMonth;	

		//重绘日历表
		Calendar.ui.fillDate(currentYear, currentMonth);
	}



};