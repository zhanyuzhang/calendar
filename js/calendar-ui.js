// 生成Calendar.ui命名空间，主要包含了跟UI有关的方法
(function() {
	
	"use strict";

	Calendar.namespace("ui");

	// @method createFrame: 创建整体的HTML目骨架
	// @param {object} parentNode: 容器节点
	// 注意：父节点应该为一个空的dom元素，否则内容会被清空
	// 因为是通过parentNode.innerHTML进行插入的
	Calendar.ui.createFrame = function(parentNode) {
		var html = "" 
			+ '<div class="container">'					
				+ '<div class="row">'
					+ '<div class="col-xs-12">'
						+ '<div class="row menu">'							
							+ '<div id="pre-year" class="btn">&lt;</div>'
							+ '<select id="select-year"></select>'
							+ '<div id="next-year" class="btn">&gt;</div> '
							+ '<div id="pre-month" class="btn">&lt;</div>'
							+ '<select id="select-month"></select>'
							+ '<div id="next-month" class="btn">&gt;</div> '
							+ '<div id="back-today" class="btn">今天</div> '
						+ '</div>'
						+ '<div class="row week" id="week">'
							+ '<!-- 这里生成日历表 -->'
						+ '</div>'
					+ '</div>'
				+ '</div>'
			+ '</div>';

		parentNode.innerHTML = html;
	};

	// @method createWeekGrid: 创建空白的日历表
	// @param {object} container: 父容器
	Calendar.ui.createWeekGrid = function(container) {

		var weeks = ["一", "二", "三", "四", "五", "六", "日"],
			index = 0,
			headTpl = '<div class="col-xs-one-of-seven days">{$week}</div>',
			cellTpl = '<div class="col-xs-one-of-seven dates" data-index={$index}></div>',
			weekHtml = "";

		//创建日历的表头
		weekHtml += '<div class="row week-header">';
		for(var i = 0; i < 7; i++) {
			weekHtml += Calendar.tpl.replace(headTpl, {week: weeks[i]});
		}
		weekHtml += "</div>";

		//创建日历内容
		for(var i = 0; i < 6; i++) {
			weekHtml += '<div class="row week-content">';
			for(var  j = 0; j < 7; j++) {
				weekHtml += Calendar.tpl.replace(cellTpl, {index: index++});
			}
			weekHtml += '</div>';
		}

		//添加日期详情
		weekHtml += '	<div class="row details" id="details"></div>';

		//把日历表放到容器里面
		container.innerHTML = weekHtml;
	};	

	// @method createOptions: 为select元素生成option子元素
	// @param {object} select: select元素的dom对象
	// @param {number} start: 起始值，如月份起始为1
	// @param {number} end: 结束值，如月份结束为12
	// @param {string} unit: 显示的单位，如月份的为"月" 
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

	// @method fillDate: 更新日历表，往日历里面填充新的月份的日期
	// @param {number} year: 4位数字的年份
	// @param {number} month: 月份数字，1-12
	Calendar.ui.fillDate = function(year, month) {

		//辅助数组，存放日期信息
		var solarInfo = new Array(42), //每个日期的新历信息
			lunarInfo = new Array(42); //每个日期的农历信息

		var classes = ["current-month", "last-month", "next-month"],
			dates = document.querySelectorAll(".week-content .dates"),
			index = Calendar.core.getFirstDayOfMonth(year, month) - 1,
			end = 0,
			monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


		// 清空上一次的日历内容以及样式
		for(var i = 0, len = dates.length; i < len; i++) {
			dates[i].innerHTML = "";
			dates[i].className = "col-xs-one-of-seven dates";
		}
		
		index = (index < 0) ? 6 : index; //是否为星期日		
		monthDays[1] = Calendar.core.isLeapYear(year) ? 29 : 28; //是否为闰年

		// 添加当前月份的日期
		end = monthDays[month - 1] + index;
		addDates(year, month, index, end, 1, classes[0]);

		// 在头部剩余格子添加上个月的日期
		var lastMonth = (month === 1) ? 12 : month - 1,
			lastYear = (month === 1) ? year - 1 : year,
			minDate = monthDays[lastMonth - 1] - index + 1;
		addDates(lastYear, lastMonth, 0, index, minDate, classes[1]);

		// 在尾部剩余格子添加下个月的日期
		var nextMonth = (month === 12) ? 1 : month + 1,
			nextYear = (month === 12) ? year + 1 : year,
			start = index + monthDays[month - 1];
		addDates(nextYear, nextMonth, start, 42, 1, classes[2]);


		function addDates(year, month, start, end, minDate, className) {
			var lunarObj,
				lunarDate,
				html = "",
				tpl = '<div class="solar-date">{$solarDate}</div>'
					  +'<div class="lunar-date">{$lunarDate}</div>';

			for( ; start < end; start++, minDate++) {
				lunarObj = Calendar.core.getLunarDay(year, month, minDate);
				lunarDate = (lunarObj.date === "初一") ? lunarObj.month : lunarObj.date;
				html = Calendar.tpl.replace(tpl, {solarDate: minDate, lunarDate: lunarDate});
				
				dates[start].classList.add(className);
				dates[start].innerHTML = html;

				//更新辅助数组.
				solarInfo[start] = month + "," + minDate;
				lunarInfo[start] = lunarObj.month + "," + lunarObj.date;

			}
		}

		// 显示24节气
		Calendar.ui.addTermStyle(solarInfo, year, month);
		// 显示公历节日
		Calendar.ui.addSolarFestival(solarInfo);
		// 显示农历节日
		Calendar.ui.addLunarFestival(lunarInfo);
		// 显示父亲节、母亲节、感恩节
		Calendar.ui.addWeekFestival(solarInfo, month);
		// 高亮显示今天
		Calendar.ui.setToday(year, month, solarInfo);
		// 显示2016放假年的法定假日
		Calendar.ui.addRestStyle(year, month);
	};

	// @method addTermStyle: 为节气日期添加样式
	// @param {array} 存放当前月份的公历信息的数组
	// @param {number} year: 4位数字的年份
	// @param {number} month: 月份数字，1-12
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

	// @method addSolarFestival: 为公历节日添加样式
	// @param {array} solarInfo: 存放当前月份的公历信息的数组
	Calendar.ui.addSolarFestival = function(solarInfo) {

		var lunarDates = document.querySelectorAll(".lunar-date"),
			solarFestival = Calendar.core.getSolarFestival();

		for(var i = 0; i < solarInfo.length; i++) {
			for(var  j = 0; j < solarFestival.length; j++) {
				if(solarInfo[i] === solarFestival[j].date) {
					lunarDates[i].innerHTML = solarFestival[j].fName;
					lunarDates[i].classList.add("festival-date");
				}
			}
		}
	};

	// @method addLunarFestival: 农历节日添加样式
	// @param {array} lunarInfo: 存放当前月份的农历信息的数组
	Calendar.ui.addLunarFestival = function(lunarInfo) {
		var lunarDates = document.querySelectorAll(".lunar-date"),
			lunarFestival = Calendar.core.getLunarFestival();
		for(var i = 0; i < lunarInfo.length; i++) {
			for(var  j = 0; j < lunarFestival.length; j++) {
				if(lunarInfo[i] === lunarFestival[j].date) {
					lunarDates[i].innerHTML = lunarFestival[j].fName;
					lunarDates[i].classList.add("festival-date");
				}
			}
		}
	};

	// @method addWeekFestival: 添加母亲节，父亲节，感恩节
	// @param {array} solarInfo: 存放当前月份的农历信息的数组
	Calendar.ui.addWeekFestival = function(solarInfo, month) {

		//母亲节
		addFestival(5, 2, 6, "母亲节");
		//父亲节
		addFestival(6, 3, 6, "父亲节");
		//加拿大感恩节
		addFestival(10, 2, 0, "感恩节（加拿大）");
		//美国感恩节
		addFestival(11, 4, 3, "感恩节（美国）");

		//m: 节日在几月
		//order: 第几个
		//index: 星期几，用0-6表示周一到周日
		//FName: 节日名称
		//如：addFestival(5, 2, 6, "母亲节"); 表示五月第二个星期天是母亲节
		function addFestival(m, order, index, fName) {
			var repeat = 0,
				lunarDates = document.querySelectorAll(".lunar-date");

			if(month === m) {
				while(index < 42) {
					if(parseInt(solarInfo[index]) === m) {					
						if(++repeat === order) {
							lunarDates[index].innerHTML = fName;
							lunarDates[index].classList.add("festival-date");
							break;
						}
					} 
					index += 7;
				}
			}
		}

	};

	// @method setToday: 高亮显示今天
	// @param {number} year: 4位数字的年份
	// @param {number} month: 月份数字，1-12
	// @param {array} solarInfo: 存放当前月份的公历信息的数组
	Calendar.ui.setToday = function(year, month, solarInfo) {
		var today = new Date(),
			currentYear = today.getYear() + 1900,
			currentMonth = today.getMonth() + 1,
			currentDate = today.getDate(),
			dates = document.querySelectorAll(".week-content .dates");

		if(year === currentYear && month === currentMonth) {
			var date = currentMonth + "," + currentDate;
			for(var i = 0; i < solarInfo.length; i++) {
				if(solarInfo[i] === date) {
					dates[i].classList.add("today");
					Calendar.ui.showDetails(dates[i], year, month);
				} 
			}

		}

	};

	// @method showDetails: 显示选中的日期的详细信息
	// @param {object} dateDom: 选中的日期的dom对象
	// @param {number} year: 4位数字的年份
	// @param {number} month: 月份数字，1-12
	Calendar.ui.showDetails = function(dateDom, year, month) {
		var day = Calendar.core.getDay(dateDom.dataset.index),
			solarDate = dateDom.querySelector(".solar-date").innerHTML,
			lunarDate = dateDom.querySelector(".lunar-date").innerHTML,
			animal = Calendar.core.getAnimal(parseInt(year)),
			detailsDom = document.getElementById("details");

		var innerText = year +"年 " + month + "月 "+ solarDate 
						+ "日 " + day + " 【" + animal + "年】" + lunarDate;
		detailsDom.innerHTML = innerText;
	};

	// @method addRestStyle: 为2016年添加放假日期的样式
	// @param {number} year: 4位数字的年份
	// @param {number} month: 月份数字，1-12
	Calendar.ui.addRestStyle = function(year, month) {

		//如果不是2016年，则退出
		if(year !== 2016) {
			return ;
		}

		var restDays = [
			"4,5,6,41", 
			"6,7,8,9,10,11,12",
			 "33,34,35",
			 "5, 6,7,33,34,35",
			 "5,6,7",
			 "10,11,12",
			 "",
			 "",
			 "17,18,19,33,34,35,36,37,38,39",
			 "5,6,7,8,9,10,11",
			 "",
			 ""
		];

		var days = restDays[month - 1].split(","),
			dateDiv = document.querySelectorAll("#week .dates");

		for(var i = 0; i < days.length && days[i] !== ""; i++) {
			dateDiv[parseInt(days[i])].classList.add("rest-dates");
		}

	}

})();