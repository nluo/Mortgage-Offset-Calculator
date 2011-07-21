// For serializeObject
(function($,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  $.fn.serializeObject = function(){
    var obj = {};
    
    $.each( this.serializeArray(), function(i,o){
      var n = o.name,
        v = o.value;
        if(v!=''){
			obj[n] = obj[n] === undefined ? [v]
			  : $.isArray( obj[n] ) ? obj[n].concat( v )
			  : [ obj[n], v ];
		}
    });
    
    return obj;
  };
  
})(jQuery);

// UI tabs
$(function() {
		$( "#tabs" ).tabs();
	});

$(document).ready(function(){
	// Initialise variables
	$("#loan_amount").val('600000');
	$("#offset_amount").val('10000');
	$("#monthly_income").val('8000');
	$("#loan_term").val('30');
	$("#normal_interest").val('6');
	$("#offset_interest").val('7');
	
	// initialise variables
 	var loan_amount=$("#loan_amount").val();
	var monthly_income=$("#monthly_income").val();
	var loan_term=$("#loan_term").val();
	var frequency=$("#loan_repaymentFrequency").val();
	var normal_interest=$("#normal_interest").val();
	var offset_interest=$("#offset_interest").val();
	var data;
	
	// Temp: fill the blank of input
	for (var date=1;date<=20;date++){
		//$("#input_date"+date).val(date);
		$("#input_amount"+date).val(date);
		}
	$("#input_date1").val('13/07/2011');
	
	// UI datepicker
	$(".datepicker").datepicker();
	
	// Main function, after button "submit" is click
	$("form").submit(function(){
		// clean up the div first
		$("#result_selector").html('');
		
		//console.log($(this).serializeObject());
		
		// Store input to data as json
		data=$(this).serializeObject();
		
		//update the form value
		loan_amount=$("#loan_amount").val();
		monthly_income=$("#monthly_income").val();
		loan_term=$("#loan_term").val();
		frequency=$("#loan_repaymentFrequency").val();
		normal_interest=$("#normal_interest").val();
		offset_interest=$("#offset_interest").val();
		//window.location.reload("#page2");
		
		//call the function again
		displayRepayment(loan_amount,loan_term,frequency,normal_interest);
		calculateRepayment(loan_amount,monthly_income,loan_term,frequency,normal_interest,offset_interest,data);	
		return false;
	});
});

// Function for calculating the repayment amount in different period
function displayRepayment(loan_amount,loan_term,frequency,normal_interest){
	if (frequency=="Weekly"){
			period=52;
		}
		else if (frequency=="Fortnightly"){
			period=26;
		}
		else if (frequency=="Monthly"){
			period=12;
	}
	
	var term_normal_interest = normal_interest/(period*100);
	var power = loan_term*period;
	var term_normal_payment = loan_amount*term_normal_interest*Math.pow((1+term_normal_interest),power)/(Math.pow((1+term_normal_interest),power)-1); 
	
	$("#period_repayment").html(function(){
		return frequency+" Repayment:<br /> $ <b><span class='_blue'>"+(Math.round(term_normal_payment*100)/100)+"</span></b>.";
	});
}

// Function for calculating monthly and yearly expenses
function calculateRepayment(loan_amount,monthly_income,loan_term,frequency,normal_interest,offset_interest,data){
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
	//alert(loan_amount+"+"+monthly_income+"+"+loan_term+"+"+frequency+"+"+normal_interest+"+"+offset_interest);
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
	drawGraph1(loan_amount,monthly_income,loan_term,normal_interest,offset_interest,term_normal_payment,data);
	$("#yearly_spending").html(function(){
		return "Yearly Spending:<br /> $ <b><span class='_blue'>"+(Math.round(yearly_spending*100)/100)+"</span></b>";
	});
	$("#monthly_spending").html(function(){
		return "Average Monthly Spending: <br />$ <b><span class='_blue'>"+(Math.round(monthly_spending*100)/100)+"</span></b>";
	});
	
}

// Function for drawing the graph with input details
function drawGraph1(ILA,ME,LT,NI,OI,MP,data){
	// Initialize variable, times 1 to convert string to int
	var plot;
	var result1=[],result2=[],result3=[],result11=[],result12=[],result13=[];
	var initial_loan_amount=ILA*1,loan_amount=initial_loan_amount;
	var initial_offset_amount=0,saving_amount=initial_offset_amount,offset_amount=initial_offset_amount,visa_amount=0;
	var monthly_income=ME*1;
	var loan_term=LT*1;
	var normal_interest=NI*1,offset_interest=OI*1;
	var monthly_payment=MP*1;
	var daily_interest1=normal_interest/36000,daily_interest2=offset_interest/36000,daily_interest3=offset_interest/36000;		
	var accumulated_interest=0,monthly_accumulated_interest=0;
	
	$(function(){
		
		//Actual length of the input
		var actural_length;
		for(var i=1; i<=data.date.length;i++){
			if(!data.date[i]){
				actural_length=i;
				break;
			}
		}
		console.log(actural_length);
		
		//Transaction
		result1.push([0,accumulated_interest]);
		for(var y=1;y<=loan_term;y++){
			for(var m=1;m<=12;m++){
				saving_amount+=monthly_income;
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
		$("#transaction_account_result").html(function(){
			return "Transaction account: <br />$ <b><span class='_blue'>"+(Math.round(accumulated_interest*100)/100)+"</span></b><br />in <b><span class='_blue'>"+(y-1)+"</span></b> years <b><span class='_blue'>"+(m-1)+"</span></b> month.";
		});
		
		
		loan_amount = initial_loan_amount;
		accumulated_interest=0;
		saving_amount=0;
		
		
		// with offset
		result2.push([0,accumulated_interest]);
		var y=1,m=1,d=1;
		while(loan_amount>0&&y<(loan_term+1)){
			if(d==1){
				offset_amount+=monthly_income;
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
		$("#offset_account_result").html(function(){
			if(y>loan_term){
				return "With offset: <br />$ <b><span class='_blue'>"+(Math.round(accumulated_interest*100)/100)+"</span></b><br />in <b>more than <span class='_blue'>"+(y-1)+"</span></b> years <b><span class='_blue'>"+12+"</span></b> month.";
			}
			else{
				return "With offset: <br />$ <b><span class='_blue'>"+(Math.round(accumulated_interest*100)/100)+"</span></b><br />in <b><span class='_blue'>"+y+"</span></b> years <b><span class='_blue'>"+m+"</span></b> month.";
			}
		});
		
		accumulated_interest=0;
		loan_amount=initial_loan_amount*1;
		offset_amount=initial_offset_amount*1;
		saving_amount=0;
		y=1;m=1;d=1;
		
		
		// with offset and visa
		result3.push([0,accumulated_interest]);
		while(loan_amount>0&&y<(loan_term+1)){
			if(d==1){
				offset_amount+=monthly_income;
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
		$("#offset_visa_account_result").html(function(){
			if(y>loan_term){
				return "With offset & Visa:<br /> $ <b><span class='_blue'>"+(Math.round(accumulated_interest*100)/100)+"</span></b><br />in <b>more than <span class='_blue'>"+(y-1)+"</span></b> years <b><span class='_blue'>"+12+"</span></b> month.";
			}
			else{
				return "With offset & Visa: <br />$ <b><span class='_blue'>"+(Math.round(accumulated_interest*100)/100)+"</span></b><br />in <b><span class='_blue'>"+y+"</span></b> years <b><span class='_blue'>"+m+"</span></b> month.";
			}
		});
		accumulated_interest=0;
		loan_amount=initial_loan_amount*1;
		offset_amount=initial_offset_amount*1;
		saving_amount=0;
		y=1;m=1;d=1;
		
		// Passing data to draw graph
		var datasets={
			"transaction":{
				label: "Transaction",
				data: result11
			},
			"offset":{
				label: "Offset",
				data: result12
			},
			"offset_visa":{
				label: "Offset_visa",
				data: result13
			}
		};
		
		var i=0;
		$.each(datasets, function(key,val){
			val.color=i;
			++i;
		});
		
		var choiceContainer = $("#result_selector");
	
			
		$.each(datasets,function(key,val){
			choiceContainer.append('<br/><input type="checkbox" name="' + key +
                               '" checked="checked" id="id' + key + '">' +
                               '<label for="id' + key + '">'
                                + val.label + '</label>');
		});
		
		choiceContainer.find("input").click(plotAccordingToChoices);
		
		function plotAccordingToChoices(){
			var data=new Array();
			choiceContainer.find("input:checked").each(function(){
				var key = $(this).attr("name");
			
				if(key&&datasets[key]){
				
					data.push(datasets[key]);
				}
			});
			
		
			if(data.length>0){
			
				var plot=$.plot($("#placeholder"),data, {
					yaxis:{ min: 0, 
							position:"left" ,
							tickFormatter: function(val,axis){
							if(val>=1000000)
								return (val/1000000).toFixed(2)+"M";
							else if(val==0)
								return val;					
							else if(val>=1000&val<1000000)
								return (val/1000).toFixed(0)+"K";
							else
								return val;	
							}
						},
					xaxis:{ tickDecimals:0}
				});
			}
			
		}
		plotAccordingToChoices();
		
	});
}