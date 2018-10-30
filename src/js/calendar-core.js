// 这是Calendar的核心代码
// 里面定义了Calendar.namespace()方法，用来生成相应的命名空间的
// 此外，这里还生成了Calendar.core命名空间
// 该命名空间主要包含了一些进行日期计算的工具类方法

(function (window, undefined) {

	"use strict";

	//创建命名空间Calendar.core，日历的核心方法都定义在该命名空间之上
	Calendar.namespace("Calendar.core");

	// @method getChinaDate: 传入阿拉伯数字形式的农历日获取中文日期名字 
	// @param {number} d: 农历日的阿拉伯数字，初一到三十用1-30表示
	// @return {string} 得到的农历日中文格式
	Calendar.core.getChinaDate = function(d) {
		//农历日后面位
		var nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
		//农历日前面位
		var nStr2 = ['初', '十', '廿', '卅', '　'];

		var s = ""; //存放中文日期
		console.log(d);
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
	};

	// @method getChinaMonth: 传入阿拉伯数字形式的农历日获取中文日期名字 
	// @param {number} m: 农历日的阿拉伯数字，初一到三十用1-30表示
	// @return {string} 得到的农历日中文格式
	Calendar.core.getChinaMonth = function(m) {
		var months = ['正月', '二月', '三月', '四月', '五月', '六月',
					 	'七月', '八月', '九月',  '十月', '十一月', '十二月'];	
		return months[m - 1];
	};

	// @method getLunarDay: 通过传入公历的年月日返回农历的信息对象
	// @param {number} y: 公历年，如2014
	// @param {number} m: 公历月份，1-12
	// @param {number} d: 公历日期，1-30
	// @return {obj} d: 返回一个包含农历信息的对象 
	Calendar.core.getLunarDay = function(year, month, day) { 

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

		//下面是闭包私有方法

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
			this.day = Math.floor( offset + 1);
		} 

		 // 实例化一个Date的实例
		 //通过公历日期对象求出农历日期，并将其返回 
		var sDObj = new Date(year, month-1, day);
		var lDObj = new Lunar(sDObj) 

		var lunarDate = {
			month: Calendar.core.getChinaMonth(lDObj.month + 1),
			date: Calendar.core.getChinaDate(lDObj.day)
		}; 

		return lunarDate; 
	};

	// @method getFirstDayOfMonth: 获取某年某月的第一天是星期几
	// @param {number} year: 4位数字的年份
	// @param {number} month: 月份1-12
	// @return {number} : 0-6，表示周一到周六
	Calendar.core.getFirstDayOfMonth = function(year, month) {
		var date = new Date(year, month - 1, 1);
		return parseInt( date.getDay() );
	};

	// @method isLeapYear: 判断某年是否为闰年
	// @param {number} year: 4位数字的年份
	// @return {boolean} : true or false
	Calendar.core.isLeapYear = function(year) {
		year = parseInt(year, 10);
		return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0); 
	};

	// @method getDateOfSolarTerm: 获取某年某月的两个节气对应的日期
	// @param {number} year: 4位数字的年份
	// @param {number} month: 月份1-12
	// @return {array} : 长度为2的数组，存放该月的两个节气的信息
	Calendar.core.getDateOfSolarTerm = function(y, m) {
		//二十四节气名字
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

		//某月的两个节气的序号
		var index1 = 2 * m - 2, //某月第一个节气的日期
			index2 = 2 * m -1;  //某月第二个节气的日期

		 var offDate1 = new Date((31556925974.7 * (y - 1900) + 
		 			    sTermInfo[index1] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
		 var offDate2 = new Date((31556925974.7 * (y - 1900) + 
		 			    sTermInfo[index2] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
		
		 //返回一个某月的节气日期和名字
		 var terms = [
		 	{
		 		date:  m + "," + offDate1.getUTCDate(),
		 		termName: solarTerm[index1]
		 	},
		 	{
		 		date: m + "," + offDate2.getUTCDate(),
		 		termName: solarTerm[index2]
		 	}
		 ];	

   		return(terms);
	};

	// @method getSolarFestival: 获取所有公历的节日
	// @return {array} : 返回节日信息数组
	Calendar.core.getSolarFestival = function() {
		var solarFestival = [
			{date: "1,1", fName: "元旦"},
			{date: "2,14", fName: "情人节"},
			{date: "3,8", fName: "妇女节"},
			{date: "3,12", fName: "植树节"},
			{date: "3,15", fName: "消费者权益日"},
			{date: "4,1", fName: "愚人节"},
			{date: "4,22", fName: "世界地球日"},
			{date: "5,1", fName: "劳动节"},
			{date: "5,4", fName: "青年节"},
			{date: "5,12", fName: "护士节"},
			{date: "5,18", fName: "国际博物馆日"},
			{date: "6,1", fName: "儿童节"},
			{date: "6,5", fName: "世界环境日"},
			{date: "6,24", fName: "国际奥林匹克日"},
			{date: "6,23", fName: "世界骨质疏松日"},
			{date: "7,1", fName: "建党节"},
			{date: "8,1", fName: "建军节"},
			{date: "9,3", fName: "抗战胜利纪念日"},
			{date: "9,10", fName: "教师节"},
			{date: "9,18", fName: "孔子诞辰"},
			{date: "10,1", fName: "国庆节"},
			{date: "10,6", fName: "老人节"},
			{date: "10,24", fName: "联合国日"},
			{date: "11,17", fName: "世界学生日"},
			{date: "12,24", fName: "平安夜"},
			{date: "12,25", fName: "圣诞节"}
		];	
		return solarFestival;	
	};

	// @method getLunarFestival: 获取一年中的所有农历节日
	// @return {array} : 返回包含所有农历节日的数组
	Calendar.core.getLunarFestival = function() {
		var lunarFestival = [
			{date: "十二月,三十", fName: "除夕"},
			{date: "正月,初一", fName: "春节"},
			{date: "正月,十五", fName: "元宵节"},
			{date: "二月,初二", fName: "龙抬头"},
			{date: "五月,初五", fName: "端午节"},
			{date: "七月,初七", fName: "七夕节"},
			{date: "七月,十五", fName: "中元节"},
			{date: "八月,十五", fName: "中秋节"},
			{date: "九月,初九", fName: "重阳节"},
			{date: "十月,初一", fName: "寒衣节"},
			{date: "十月,十五", fName: "下元节"}
		];
		return lunarFestival;
	};

	// @method getFirstDayOfMonth: 传入数字获取对应的星期几
	// @param {number} index: 0-41的数字
	// @return {string} : 中文星期
	Calendar.core.getDay = function(index) {
		var days = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日" ];
		return (days[index % 7]);
	};

	// @method getAnimal: 传入公历年份，获取对应的生肖
	// @param {number} year: 公历年份
	// @return {string} : 中文生肖
	Calendar.core.getAnimal = function(year) {
		var animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
		return animals[(year - 1900) % 12];
	}
})(window);
