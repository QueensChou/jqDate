//设置点击日期外围元素隐藏日期选择框
$("body").on("click",function(ev){
	var evt = ev.srcElement ? ev.srcElement : ev.target;
	if(!$(evt).parents().hasClass("date")){
		$(".date_select").removeClass("date_select_on");
		$(".date_calendar").hide();
	}
});
(function($){
	var oDate = new Date();
	var nowYear = oDate.getFullYear();
	var nowMonth = oDate.getMonth()+1;
	var nowDay = oDate.getDate();
	var firstWeek;
	var selectDay = true;
	var n;
	var dates = {
		init:function(obj,args){
			return (function(){
				args.SetYear = args.ThisYear;
				args.SetMonth = args.ThisMonth;
				//显示初始日期
				obj.find(".date_value").html(args.SetYear + '年' + args.SetMonth + '月' + args.ThisDay + '日');
				dates.drawDate(obj,args);
				dates.bindEvent(obj,args);
			})();
		},
		//生成日历框
		drawDate:function(obj,args){
			return (function(){
				var lastDay = dates.getMonth(args.ThisMonth,args.ThisYear);
				var prevMonth = args.ThisMonth - 1;
				var prevMonthYear = args.ThisYear;
				if(prevMonth < 1){
					prevMonth = 12;
					prevMonthYear--;
				}
				firstWeek = new Date(args.ThisYear,args.ThisMonth-1,1).getDay();
				obj.find(".date_days_list td").removeClass();
				obj.find(".date_year_value").html(args.ThisYear + '年');
				obj.find(".date_month_value").html(args.ThisMonth + '月');
				n = dates.getMonth(prevMonth,prevMonthYear) - firstWeek + 1;
				obj.find(".date_days_list tr").show();
				for (var i=0;i<firstWeek;i++) {
					obj.find(".date_days_list").find("tr:eq(0)").find("td:eq("+i+")").html(n);
					obj.find(".date_days_list").find("tr:eq(0)").find("td:eq("+i+")").addClass("day_gray");
					n++;
				}
				n = 1;
				for (var i=firstWeek;i<7;i++) {
					obj.find(".date_days_list").find("tr:eq(0)").find("td:eq("+i+")").html(n);
					if(n == args.ThisDay && selectDay){
						obj.find(".date_days_list").find("tr:eq(0)").find("td:eq("+i+")").addClass("day_select");
					}
					if(args.ThanDay){
						if (args.ThisYear > nowYear) {
							obj.find(".date_days_list").find("tr:eq(0)").find("td:eq("+i+")").addClass("day_gray");
						}else if(args.ThisYear === nowYear){
							if(args.ThisMonth > nowMonth){
								obj.find(".date_days_list").find("tr:eq(0)").find("td:eq("+i+")").addClass("day_gray");
							}else if(args.ThisMonth === nowMonth){
								if(n > nowDay){
									obj.find(".date_days_list").find("tr:eq(0)").find("td:eq("+i+")").addClass("day_gray");
								}
							}
						}
					}
					n++;
				}
				for (var j=1;j<7;j++) {
					for (var i=0;i<7;i++) {
						if(n > lastDay){
							obj.find(".date_days_list").find("tr:eq("+j+")").find("td:eq("+i+")").html(n%lastDay);
							obj.find(".date_days_list").find("tr:eq("+j+")").find("td:eq("+i+")").addClass("day_gray");
						}else{
							obj.find(".date_days_list").find("tr:eq("+j+")").find("td:eq("+i+")").html(n);
						}
						if(n == args.ThisDay && selectDay){
							obj.find(".date_days_list").find("tr:eq("+j+")").find("td:eq("+i+")").addClass("day_select");
						}
						if(args.ThanDay){
							if (args.ThisYear > nowYear) {
								obj.find(".date_days_list").find("tr:eq("+j+")").find("td:eq("+i+")").addClass("day_gray");
							}else if(args.ThisYear === nowYear){
								if(args.ThisMonth > nowMonth){
									obj.find(".date_days_list").find("tr:eq("+j+")").find("td:eq("+i+")").addClass("day_gray");
								}else if(args.ThisMonth === nowMonth){
									if(n > nowDay){
										obj.find(".date_days_list").find("tr:eq("+j+")").find("td:eq("+i+")").addClass("day_gray");
									}
								}
							}
						}
						n++;
					}
				}
				if((lastDay + firstWeek) / 7 <= 5){
					obj.find(".date_days_list tr:gt(4)").hide();
				}
				if((lastDay + firstWeek) / 7 == 4){
					obj.find(".date_days_list tr:gt(3)").hide();
				}
			})();
		},
		//绑定各种事件
		bindEvent:function(obj,args){
			return (function(){
				//点击日期框显示日期,选择过程中再次点击日历变回初始时间
				obj.on(args.Event,".date_select",function(){
					$(".date_calendar").hide();
					$(this).addClass("date_select_on");
					obj.find(".date_calendar").show();
					if(obj.find(".date_calendar").offset().left < 0){
						obj.find(".date_calendar").css("left",0);
					}
					selectDay = true;
					args.ThisYear = args.SetYear;
					args.ThisMonth = args.SetMonth;
					dates.drawDate(obj,args);
				});
				//选择日期
				obj.on("click","td",function(){
					if($(this).hasClass("day_gray")){
						return ;
					}
					args.ThisDay = $(this).html();
					args.SetYear = args.ThisYear;
					args.SetMonth = args.ThisMonth;
					obj.find(".date_select").removeClass("date_select_on");
					obj.find("td").removeClass("day_select");
					$(this).addClass("day_select");
					obj.find(".date_value").html(args.ThisYear + '年' + args.ThisMonth + '月' + args.ThisDay + '日');
					obj.find(".date_calendar").hide();
				});
				//上一年按钮
				obj.on("click",".date_year .arrow_prev",function(){
					selectDay = false;
					args.ThisYear--;
					if(args.ThisYear == args.SetYear && args.ThisMonth == args.SetMonth){
						selectDay = true;
					}
					dates.drawDate(obj,args);
				})
				//下一年按钮
				obj.on("click",".date_year .arrow_next",function(){
					selectDay = false;
					args.ThisYear++;
					if(args.ThisYear == args.SetYear && args.ThisMonth == args.SetMonth){
						selectDay = true;
					}
					dates.drawDate(obj,args);
				})
				//上一月按钮
				obj.on("click",".date_month .arrow_prev",function(){
					selectDay = false;
					args.ThisMonth--;
					if(args.ThisMonth < 1){
						args.ThisMonth = 12;
						args.ThisYear--;
					}
					if(args.ThisYear == args.SetYear && args.ThisMonth == args.SetMonth){
						selectDay = true;
					}
					dates.drawDate(obj,args);
				})
				//下一月按钮
				obj.on("click",".date_month .arrow_next",function(){
					selectDay = false;
					args.ThisMonth++;
					if(args.ThisMonth > 12){
						args.ThisMonth = 1;
						args.ThisYear++;
					}
					if(args.ThisYear == args.SetYear && args.ThisMonth == args.SetMonth){
						selectDay = true;
					}
					dates.drawDate(obj,args);
				})
			})();
		},
		//获取当月有多少天
		getMonth:function(month,year){
			var thisMonth = month - 1;
		    var LeapYear = ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? true: false;
		    var monthNum;
		    switch (parseInt(thisMonth)) {
		    case 0:
		    case 2:
		    case 4:
		    case 6:
		    case 7:
		    case 9:
		    case 11:
		        monthNum = 31;
		        break;
		    case 3:
		    case 5:
		    case 8:
		    case 10:
		        monthNum = 30;
		        break;
		    case 1:
		        monthNum = LeapYear ? 29: 28;
		    }
		    return monthNum;
		}
	}
	$.fn.dateSelect = function(options){
		var args = $.extend({
			Event : "click",
			ThisYear : nowYear,
			ThisMonth : nowMonth,
			ThisDay : nowDay,
			SetYear : nowYear,
			SetMonth : nowMonth,
			ThanDay : false,
			backFn : function(){}
		},options);
		dates.init(this,args);
	}
})(jQuery);
