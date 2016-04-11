// 这个是Calendar的核心代码
(function (window, undefined) {

	"use strict";

	// 创建一个全局对象Calendar
	//在该文件的末尾处暴露到全局window
	var Calendar = Calendar || {}; 

	//下面定义闭包的私有变量

	// 农历信息表
	// 使用十六进制数值表示
	// 0x04bd8转成二进制就是0100 1011 1101 1000 
	// 其中左边12位对应农历12个月大小月，1为大月，0为小月
	// 右边4位表示当年的闰月，比如1000表示闰8月，如果是0000则没有闰月
	// 下面列出了1900年到2050年150年之间的月份信息
	var lunarInfo = [
		0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2, 
		0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977, 
		0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970, 
		0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950, 
		0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557, 
		0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0, 
		0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0, 
		0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6, 
		0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570, 
		0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0, 
		0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5, 
		0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930, 
		0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530, 
		0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45, 
		0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0
	]; 

	// 公历年的12个月对应天数，二月默认是28天，后面solarDays()函数会判断，如果是闰年，则29天
	var solarMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	//支干纪年
	var	Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
	var	Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

	//十二生肖
	var	Animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

	//二十四节气
	var	solarTerm = [
		"小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨",
		"立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", 
		"白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
	];

	//这是什么？？
	var sTermInfo = [
		0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149,
		195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350,
		375494, 397447, 419210, 440795, 462224, 483532, 504758
	]; 

	//农历日后面位
	var nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

	//农历日前面位
	var nStr2 = ['初', '十', '廿', '卅', '　'];

	//各月份的英文名
	var monthName = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]; 


	//闭包私有方法

	//传回农历 y年的总天数 
	function lYearDays(y) { 
		var i, sum = 348; 
		for(i = 0x8000; i > 0x8; i >>= 1) { 
			sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
		} 
			
		return sum + leapDays(y);
	} 

	//传回农历 y年闰月的天数 
	function leapDays(y) { 
		if(leapMonth(y)) {
			 return (lunarInfo[y - 1900] & 0x10000) ? 30: 29;
		}  
		else {				
			return 0;
		}
	} 

	//传回农历 y年闰哪个月 1-12 , 没闰传回 0 
	function leapMonth(y) { 
		return(lunarInfo[y - 1900] & 0xf);
	} 

	//传回农历 y年m月的总天数 
	function monthDays(y, m) { 
		return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
	} 


	// 该函数通过传入Date实例对象，返回一个包含当年农历信息的对象的
	// 返回对象的属性包括：
	// .year:查询年份
	// .month: 月份总数
	// .day: 总天数
	// .isLeap: 是否闰年
	// .yearCyl .dayCyl .monCyl 
	function Lunar(objDate) { 

		var i, //年份变量
			leap = 0, //闰哪个月
			temp = 0, //农历年的总天数
			baseDate = new Date(1900,0,31), //参考日期
			offset   = (objDate - baseDate) / 86400000; //时间差

		this.dayCyl = offset + 40 ;
		this.monCyl = 14 ;

		for(i = 1900; i < 2050 && offset > 0; i++) { 
			temp = lYearDays(i); 
			offset -= temp ;
			this.monCyl += 12; 
		} 

		if(offset < 0) { 
			offset += temp; 
			i--; 
			this.monCyl -= 12; 
		} 

		this.year = i;
		this.yearCyl = i - 1864;

		leap = leapMonth(i); //闰哪个月 
		this.isLeap = false ;

		for(i = 1; i < 13 && offset > 0; i++) { 
			//闰月 
			if(leap > 0 && i == (leap + 1) && this.isLeap == false) {
				--i; 
				this.isLeap = true; 
				temp = leapDays(this.year); 
			} 
			else { 
				temp = monthDays(this.year, i); 
			} 

			//解除闰月 
			if(this.isLeap == true && i == (leap + 1)) {
				this.isLeap = false;
			} 

			offset -= temp; 

			if(this.isLeap == false) {
				this.monCyl++;
			} 
		} 

		if(offset == 0 && leap > 0 && i == leap + 1) {
			if(this.isLeap) { 
				this.isLeap = false; 
			} 
		} 
		
		else { 
			this.isLeap = true; 
			--i; 
			--this.monCyl;
		} 

		if(offset < 0) { 
			offset += temp; 
			--i; 
			--this.monCyl; 
		} 

		this.month = i; 
		this.day = offset + 1;
	} 

	//获取公历 y年某m+1月的总天数 
	function solarDays(y, m) { 
		if(m == 1)  {
			return ((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29: 28;
		} else {
			return solarMonth[m];
		}		
	} 

	//传入 offset 返回干支, 0=甲子 
	function cyclical(num) { 
		return Gan[num % 10] + Zhi[num % 12];
	} 

	//中文日期 
	function cDay(d) { 

		var s = ""; //存放中文日期

		switch (d) { 
			case 10: 
				s = '初十'; break; 
			case 20: 
				s = '二十'; break; 
			case 30: 
				s = '三十'; break;  
			default : 
				s = nStr2[Math.floor(d / 10)]; 
				s += nStr1[d % 10]; 
		} 
		return s; 
	} 

	//中文月份 
	function cMonth(m) { 

		var s; 

		switch (m) { 
			case 1: 
				s = '正月'; break; 
			case 2: 
				s = '二月'; break; 
			case 3: 
				s = '三月'; break; 
			case 4: 
				s = '四月'; break; 
			case 5: 
				s = '五月'; break; 
			case 6: 
				s = '六月'; break; 
			case 7: 
				s = '七月'; break; 
			case 8: 
				s = '八月'; break; 
			case 9: 
				s = '九月'; break; 
			case 10: 
				s = '十月'; break; 
			case 11: 
				s = '十一月'; break; 
			case 12: 
				s = '十二月'; break; 
			default : 
			break; 
		} 
		return s; 
	} 

	// Calendar对象的命名空间方法
	// 传入点隔开的字符串便可以返回相应的命名空间
	Calendar.namespace = function(ns_string) {

		var parts = ns_string.split("."),
			parent = Calendar;

		//如果有前缀Calendar，则去掉
		if(parts[0] === "Calendar") {
			parts = parts.slice(1); 
		}

		for(var i = 0, len = parts.length; i < len; i++) {
			if(typeof parent[parts[i]] === "undefined") {
				parent[parts[i]] = {};
			}
			parent = parent[parts[i]];
		}

		return parent;		
	};

	//创建命名空间Calendar.core
	Calendar.namespace("Calendar.core");

	//传入公历年的数值类型的年，月，日，返回对应的农历月、日
	Calendar.core.getLunarDay = function(year, month, day) { 
		var sDObj = new Date(year, month-1, day); // 实例化一个Date的实例
		var lDObj = new Lunar(sDObj)     //通过公历日期对象求出农历日期 

		var lunarDate = (cDay(lDObj.day) === "初一") ? 
						 cMonth(lDObj.month + 1) : cDay(lDObj.day) ;
		return lunarDate; 
	};

	//获取某年某月的第一天是星期几
	Calendar.core.getFirstDayOfMonth = function(year, month) {
		var keystr = "622503514624",
			deltdate = 0,
			deltmonth = parseInt(keystr.substr(month - 1, 1)),
			deltyear = (year - 2000) + Math.ceil((year - 2000) /4);

		deltyear += (year - Math.floor(year / 4) * 4 == 0 && month > 2 ? 1 : 0);
		console.log(deltdate + " " + deltmonth + " " + deltyear);

		return (deltmonth + deltyear + deltdate) - Math.floor((deltmonth + deltyear + deltdate) / 7) * 7;

	};

	//判断某年是否为闰年
	Calendar.core.isLeapYear = function(year) {
		year = parseInt(year, 10);
		return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0); 
	}


	//把Calendar暴露到window全局对象
	window.Calendar = Calendar; 

})(window);
