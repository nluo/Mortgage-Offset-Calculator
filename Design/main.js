(function($,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  $.fn.serializeObject = function(){
    var obj = {};
    
    $.each( this.serializeArray(), function(i,o){
      var n = o.name,
        v = o.value;
     
			obj[n] = obj[n] === undefined ? v
			  : $.isArray( obj[n] ) ? obj[n].concat( v )
			  : [ obj[n], v ];
		
    });
    
    return obj;
  };
  
})(jQuery);

$(document).ready(function(){
	$("#button1").click(function(){
		$("#page2").animate({marginLeft:"200px"},1);
		$("#page1").animate({marginLeft:"0px",opacity:0},500);
		$("#page2").animate({marginLeft:"100px",opacity:1},500);
	});
	$("#button2").click(function(){
		$("#page2").animate({marginLeft:"200px",opacity:0},500);
		$("#page2").animate({marginLeft:"-2000px",opacity:0},1);
		$("#page1").animate({marginLeft:"100px",opacity:1},500);
	});
	// Fill the blank of input
	for (var date=1;date<=20;date++){
		//$("#input_date"+date).val(date);
		$("#input_amount"+date).val(date);
		}
	// Select and display dates
	$( ".datepicker" ).datepicker();



	$("#loan_amount").val('600000');
	$("#offset_amount").val('10000');
	$("#monthly_earning").val('8000');
	$("#loan_year").val('30');
	$("#loan_repaymentFrequency").val('1');
	$("#normal_interest").val('0.06');
	$("#offset_interest").val('0.07');
	
	
	//initialise options
	var option='<option> Monthly </option>'+'<option> Quarterly </option>'+'<option> Yearly </option>';
	$(".repayment").append(option);
	//initialise spendings
	$("#month1").val('1');$("#month2").val('7');$("#month3").val('3');$("#month4").val('2');$("#month5").val('2');
	$("#month6").val('12');$("#month7").val('3');$("#month8").val('6');$("#month9").val('8');$("#month10").val('1');
	$("#day1").val('2');$("#day2").val('29');$("#day3").val('1');$("#day4").val('29');$("#day5").val('4');
	$("#day6").val('17');$("#day7").val('21');$("#day8").val('22');$("#day9").val('10');$("#day10").val('17');
	$("#amount1").val('210');$("#amount2").val('700');$("#amount3").val('140');$("#amount4").val('100');$("#amount5").val('30');
	$("#amount6").val('250');$("#amount7").val('40');$("#amount8").val('1000');$("#amount9").val('75');$("#amount10").val('2000');
	$("#frequency1").val("Monthly");$("#frequency2").val("Quarterly");$("#frequency3").val("Monthly");$("#frequency4").val("Monthly");$("#frequency5").val("Monthly");$("#frequency6").val("Quarterly");$("#frequency7").val("Monthly");$("#frequency8").val("Quarterly");$("#frequency9").val("Monthly");$("#frequency10").val("Yearly");
	
	// initialise variables
 	var loan_amount=$("#loan_amount").val();
	var offset_amount=$("#offset_amount").val();
	var monthly_earning=$("#monthly_earning").val();
	var loan_term=$("#loan_year").val();
	var frequency=$("#loan_repaymentFrequency").val();
	var normal_interest=$("#normal_interest").val();
	var offset_interest=$("#offset_interest").val();
	var data;
	
	
	$("form").submit(function(){
		console.log($(this).serializeObject());
		//console.log($(this).serializeArray());
		data=$(this).serializeObject();
		$("#placeholder1").fadeOut(1);
		$("#placeholder2").fadeOut(1);
		//update the form value
		loan_amount=$("#loan_amount").val();
		offset_amount=$("#offset_amount").val();
		monthly_earning=$("#monthly_earning").val();
		loan_term=$("#loan_year").val();
		frequency=$("#loan_repaymentFrequency").val();
		normal_interest=$("#normal_interest").val();
		offset_interest=$("#offset_interest").val();
		//call the function again
		calculateRepayment(loan_amount,offset_amount,monthly_earning,loan_term,frequency,normal_interest,offset_interest,data);	
		
		
			$("#page2").animate({marginLeft:"200px"},1);
			$("#page1").animate({marginLeft:"0px",opacity:0},500);
			$("#page2").animate({marginLeft:"100px",opacity:1},500);
		
		
		$("#placeholder1").show(1000);
		$("#placeholder2").show(1000);
		return false;
	});

	/*$("#button1").click(function(){
		$("#placeholder1").fadeOut(1);
		//update the form value
		loan_amount=$("#loan_amount").val();
		offset_amount=$("#offset_amount").val();
		loan_year=$("#loan_year").val();
		frequency=$("#loan_repaymentFrequency").val();
		normal_interest=$("#normal_interest").val();
		offset_interest=$("#offset_interest").val();
		//call the function again
		calculateRepayment(loan_amount,offset_amount,loan_year,frequency,normal_interest,offset_interest);	
		$("#placeholder1").show(1000);
	});*/
});

function calculateRepayment(loan_amount,offset_amount,monthly_earning,loan_term,frequency,normal_interest,offset_interest,data){
	var period=12;
	/*	if (frequency=="Weekly"){
			period=52;
		}
		else if (frequency=="Fortnightly"){
			period=26;
		}
		else if (frequency=="Monthly"){
			period=12;
	}*/
	var term_normal_interest = normal_interest/(period*100);
	var power = loan_term*period;
	var term_normal_payment = loan_amount*term_normal_interest*Math.pow((1+term_normal_interest),power)/(Math.pow((1+term_normal_interest),power)-1); 
	var yearly_spending=0,monthly_spending=0;
	for(var i=0;i<data.date.length;i++){
		if(data.frequency[i]=="Monthly"){
			yearly_spending+=data.amount[i]*12;
		}
		else if(data.frequency[i]=="Quarterly"){
			yearly_spending+=data.amount[i]*4;
		}
		else{
			yearly_spending+=data.amount[i]*1;
		}
	}
	
	monthly_spending=yearly_spending/12;
	drawGraph1(loan_amount,offset_amount,monthly_earning,loan_term,normal_interest,offset_interest,term_normal_payment,data);
	$("#_estimate_interest1").html(function(){
		return "Yearly Spending: $ <b><span class='_blue'>"+(Math.round(yearly_spending*100)/100)+"</span></b>";
	});
	$("#_estimate_time1").html(function(){
		return "Average Monthly Spending: $ <b><span class='_blue'>"+(Math.round(monthly_spending*100)/100)+"</span></b>";
	});
	$("#_estimate_difference1").html(function(){
		return "Monthly Repayment: $ <b><span class='_blue'>"+(Math.round(term_normal_payment*100)/100)+"</span></b>.";
	});
}
					
function drawGraph1(ILA,IOA,ME,LT,NI,OI,MP,data){
	var plot;
	var result1=[],result2=[],result3=[],result11=[],result12=[],result13=[];
	var initial_loan_amount=ILA*1,loan_amount=initial_loan_amount;
	var initial_offset_amount=IOA*1,saving_amount=initial_offset_amount,offset_amount=initial_offset_amount,visa_amount=0;
	var monthly_earning=ME*1;
	var loan_term=LT*1;
	var normal_interest=NI*1,offset_interest=OI*1;
	var monthly_payment=MP*1;
	var daily_interest1=normal_interest/36000,daily_interest2=offset_interest/36000,daily_interest3=offset_interest/36000;		
	var accumulated_interest=0,monthly_accumulated_interest=0;
	
	$(function(){
		//actual length of the input
		var actural_length;
		for(var i=1; i<=data.date.length;i++){
			if(data.date[i]==""){
				actural_length=i;
				break;
			}
		}
		console.log(actural_length);
		
		//saving
		result1.push([0,accumulated_interest]);
				
		for(var y=1;y<=loan_term;y++){
			for(var m=1;m<=12;m++){
				saving_amount+=monthly_earning;
				
				for(var d=1;d<=30;d++){
					for(var i=0;i<actural_length;i++){
						var month=new Date(data.date[i]).getMonth();
						var day=new Date(data.date[i]).getDate();
						
						
						if(data.frequency[i]=="Monthly"){
						
							if(d==day){
								saving_amount-=data.amount[i];
							}
						}
						else if(data.frequency[i]=="Quarterly"){
							if((m==month||m==month+3||m==month+6||m==month+9||m==month-3||m==month-6||m==month-9)&&(d==day)){	
								
								saving_amount-=data.amount[i];
							}
						}
						else{
							if(m==month&&d==day){
								saving_amount-=data.amount[i];
							}
						}
					}
					monthly_accumulated_interest+=loan_amount*daily_interest1; 
				}
				saving_amount-=monthly_payment;
				accumulated_interest+=monthly_accumulated_interest; 
				result1.push([(((y-1)*12)+m)/12,accumulated_interest]);
				loan_amount+=monthly_accumulated_interest;
				loan_amount-=monthly_payment;
				result11.push([(((y-1)*12)+m)/12,loan_amount]);
				monthly_accumulated_interest=0;
			}
		}
		
		$("#_estimate_interest2").html(function(){
			return "Saving account: $ <b><span class='_blue'>"+(Math.round(accumulated_interest*100)/100)+"</span></b>";
		});

		loan_amount = initial_loan_amount;
		accumulated_interest=0;
		saving_amount=0;
		// with offset
		result2.push([0,accumulated_interest]);
		var y=1,m=1,d=1;
		while(loan_amount>0&&y<30){
			if(d==1){
				offset_amount+=monthly_earning;
				if(offset_amount>loan_amount){
					saving_amount+=offset_amount-loan_amount;
					offset_amount=loan_amount;
				}
			}
			
			for(var i=0;i<actural_length;i++){
				// get the month of the data
				var month=new Date(data.date[i]).getMonth();
				var day=new Date(data.date[i]).getDate();
				
				
				if(data.frequency[i]=="Monthly"){
					if(d==day){
						offset_amount-=data.amount[i];
					}
				}
				else if(data.frequency[i]=="Quarterly"){
					
					if((m==month||m==month+3||m==month+6||m==month+9||m==month-3||m==month-6||m==month-9)&&(d==day)){	
							//alert("hello");
						offset_amount-=data.amount[i];
					}
				}
				else{
					if(m==month&&d==day){
						offset_amount-=data.amount[i];
					}
				}
			}
			monthly_accumulated_interest+=(loan_amount-offset_amount)*daily_interest2;
			if(d==30){
				offset_amount-=monthly_payment;
				accumulated_interest+=monthly_accumulated_interest;
				result2.push([(((y-1)*12)+m)/12,accumulated_interest]);
				loan_amount+=monthly_accumulated_interest;
				loan_amount-=monthly_payment;
				result12.push([(((y-1)*12)+m)/12,loan_amount]);
				monthly_accumulated_interest=0;
			}
			d++;
			if(d>30){
				m++;
				d=1;
			}
			if(m>12){
				y++;
				m=1;
			}
		}
		/*
		$("#_estimate_time2").html(function(){
			return "With offset: $ <b><span class='_blue'>"+(Math.round(accumulated_interest*100)/100)+"</span></b><br />in <b><span class='_blue'>"+y+"</span></b> years <b><span class='_blue'>"+m+"</span></b> month.";
		});
		*/
		accumulated_interest=0;
		loan_amount=initial_loan_amount*1;
		offset_amount=initial_offset_amount*1;
		saving_amount=0;
		y=1;m=1;d=1;
		// with offset and visa
		result3.push([0,accumulated_interest]);
		while(loan_amount>0&&y<30){
			if(d==1){
				offset_amount+=monthly_earning;
				if(offset_amount>loan_amount){
					saving_amount+=offset_amount-loan_amount;
					offset_amount=loan_amount;
				}
			}
			for(var i=0;i<actural_length;i++){
			
				var month=new Date(data.date[i]).getMonth();
				var day=new Date(data.date[i]).getDate();
				
				if(data.frequency[i]=="Monthly"){
					if(d==day){
						visa_amount-=data.amount[i];
					}
				}
				else if(data.frequency[i]=="Quarterly"){
					if((m==month||m==month+3||m==month+6||m==month+9||m==month-3||m==month-6||m==month-9)&&(d==day)){	
						
						visa_amount-=data.amount[i];
					}
				}
				else{
					if(m==month&&d==day){
						visa_amount-=data.amount[i];
					}
				}
			}
			monthly_accumulated_interest+=(loan_amount-offset_amount)*daily_interest3;
			if(d==30){
				offset_amount+=visa_amount;
				visa_amount=0;
				offset_amount-=monthly_payment;
				accumulated_interest+=monthly_accumulated_interest;
				result3.push([(((y-1)*12)+m)/12,accumulated_interest]);
				loan_amount+=monthly_accumulated_interest;
				loan_amount-=monthly_payment;
				result13.push([(((y-1)*12)+m)/12,loan_amount]);
				monthly_accumulated_interest=0;
			}
			d++;
			if(d>30){
				m++;
				d=1;
			}
			if(m>12){
				y++;
				m=1;
			}
		}
		
		/*
		$("#_estimate_difference2").html(function(){
			return "With offset & Visa: $ <b><span class='_blue'>"+(Math.round(accumulated_interest*100)/100)+"</span></b><br />in <b><span class='_blue'>"+y+"</span></b> years <b><span class='_blue'>"+m+"</span></b> month.";
		});
		*/
		accumulated_interest=0;
		loan_amount=initial_loan_amount*1;
		offset_amount=initial_offset_amount*1;
		saving_amount=0;
		y=1;m=1;d=1;
			
		plot=$.plot($("#placeholder1"), 
		[ {
			data: result1,
		    color: "#06f206",
		},
		{
			data: result2,
		    color:"#028802",
		},
		{
			data: result3,
		    color:"#00a2e8",
		}
		],   
		{ 
			series:{
				lines: { show:true}
			},
		
			//crosshair: { mode: "x", lineWidth:10 },
			grid: { hoverable:true, autoHighlight: false},
			//xaxis: { min: 0},
			
			yaxis: {
				min: 0, 
				position:"left" ,
				tickFormatter: function(val,axis){
					if(val>=1000000)
						return (val/1000000).toFixed(2)+"M";
					else if(val==0)
						return val;					
					else if(val>1000&&val<1000000)
						return (val/1000).toFixed(0)+"K";
					else
						return val;									
				}
			}
		});
		
	
	});
	
	
}