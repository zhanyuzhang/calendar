// 命名为Calendar.controller
// 日历的交互操作以及初始化
(function() {

	// alert(window.innerWidth);

	"use strict";

	Calendar.namespace("controller");

	// @method init: 初始化方法
	// @param {object} container: dom对象，动态生成的日历表将会插入到该对象
	Calendar.controller.init = function(container) {

		//调用Calendar.ui.createFrame生成日历所依赖的HTML骨架
		Calendar.ui.createFrame(container);

		// 把document.getElementById.bind绑定到变量getDom上面
		// 调用的时候可以直接getDom("id");
		var getDom = document.getElementById.bind(document);

		// 获取各个节点的dom
		var 	selectYear = getDom("select-year"),
			selectMonth = getDom("select-month"),
			preYear =getDom("pre-year"),
			nextYear = getDom("next-year"),
			preMonth = getDom("pre-month"),
			nextMonth = getDom("next-month"),
			week = getDom("week"),
			backTodayBtn = getDom("back-today");
		
		//动态为年份和月份的下拉选择框添加option子元素
		Calendar.ui.createOptions( selectYear, 1901, 2050, "年");
		Calendar.ui.createOptions(selectMonth, 1, 12, "月");

		//创建一个空白的日历表
		Calendar.ui.createWeekGrid(week);

		//调用goToToday，使用当前月份填充日历
		goToToday(selectYear, selectMonth);

		//通过下拉框改变年月
		//改变年份
		 selectYear.addEventListener("change", function() {
			Calendar.ui.fillDate(parseInt( selectYear.value), parseInt(selectMonth.value));
		}, false);
		//改变月份
		selectMonth.addEventListener("change", function() {
			Calendar.ui.fillDate(parseInt( selectYear.value), parseInt(selectMonth.value));
		}, false);
		
		//通过下拉框旁边的按钮切换年月

		//上一年
		preYear.addEventListener("click", function() {
			switchYearOrMonth(1, selectYear, selectMonth, -1, 1901);
		}, false);
		//下一年
		nextYear.addEventListener("click", function() {
			switchYearOrMonth(1, selectYear, selectMonth, 1, 2050);
		}, false);

		//上个月
		preMonth.addEventListener("click", function() {
			switchYearOrMonth(2, selectYear, selectMonth, -1);
		}, false);
		//下个月
		nextMonth.addEventListener("click", function() {
			switchYearOrMonth(2, selectYear, selectMonth, 1);
		}, false);

		//通过事件委托，监听日期的点击事件，显示选中的日期的
		week.addEventListener("click", function(e) {
			var target = e.target.parentNode;
			clickDate(target, selectYear, selectMonth);
		}, false);

		//通过点击按钮返回今天
		backTodayBtn.addEventListener("click", function() {
			goToToday(selectYear, selectMonth);
		}, false);

		// @method clickDate: 鼠标单击日期时触发的函数
		// @param {object} target: 鼠标选中的日期dom对象
		// @param {object} selectYear: 年份选择下拉框的dom对象
		// @param {object} selectYearMonth: 月份选择下拉框的dom对象
		function clickDate(target, selectYear, selectMonth) {
			var	y = parseInt(selectYear.value),
				m = parseInt(selectMonth.value),
				sign = 0;

			// 如果选中的不是日期，则退出
			if(!target.classList.contains("dates")) {
				return;
			}

			// 如果选中的是上个月的日期，则进行判断
			if(target.classList.contains("last-month")) {
				// 如果当前月份是1月，则上个月是去年的12月
				if(m === 1) {
					y -= 1;
					m = 12;
				} else {
					m -= 1;
				}
				sign = -1;
			
			// 如果选中的是下个月的日期，则进行判断
			} else if(target.classList.contains("next-month")) {
				// 如果当前月份是12月，则下个月是明年的1月
				if(m === 12)  {
					y += 1;
					m = 1;
				} else {
					m += 1;
				}
				sign = 1;
			}

			// 显示选中的日期信息
			Calendar.ui.showDetails(target, y, m);

			// 切换年份
			if(sign !== 0) {
				switchYearOrMonth(2, selectYear, selectMonth, sign);
			}
		}


		// @method switchYearOrMonth: 切换年份或月份
		// @param {number} type: 可选值为1或2，1表示切换年份，2表示切换月份
		// @param {object} selectYear: 年份选择下拉框的dom对象
		// @param {object} selectYearMonth: 月份选择下拉框的dom对象
		// @param {number} sign: 可选值为1或-1，1为递增，-1为递减
		// @param {number} edge: 临界值，比如年份递增的临界值为2050
		function switchYearOrMonth(type, selectYear, selectMonth, sign, edge) {
			var args = [].slice.call(arguments, 0),
				value = parseInt(args[type].value);

			//如果有临界值，并且当前值等于临界值，则退出
			if(edge && value === edge) {
				return;
			}

			// 如果是递减月份，并且当前为1月，则跳转到上一年的12月
			if(type === 2) {
				if(value === 1 && sign === -1) {
					// 如果当前年份为1901年，则退出
					if( parseInt(selectYear.value) === 1901) {
						return;
					}
					args[1].value = parseInt(args[1].value) - 1;
					args[2].value =12;

				// 如果是递增月份，并且当前为12月，则跳转到下一年的1月
				} else if(value === 12 && sign === 1) {
					if(parseInt(selectYear.value) === 2050) {
						return;
					}
					args[1].value = parseInt(args[1].value) + 1;
					args[2].value =1;
				} else {
					args[type].value = value + sign;
				}	

			} else {
				args[type].value = value + sign;
			}
			Calendar.ui.fillDate(parseInt(selectYear.value), parseInt(selectMonth.value));
		}

		// @method goToToday: 返回今天
		// @param {object} selectYear: 年份选择下拉框的dom对象
		// @param {object} selectYearMonth: 月份选择下拉框的dom对象
		function goToToday(selectYear, selectMonth) {

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
})();