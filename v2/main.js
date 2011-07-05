$(document).ready(function(){
	$("#loan_amount").val('600000');
	$("#offset_amount").val('10000');
	
	// initialise variables
 	var loan_amount=$("#loan_amount").val();
	var offset_amount=$("#offset_amount").val();
	var loan_year=$("#loan_year").val();
	var frequency=$("#loan_repaymentFrequency").val();
	var normal_interest=$("#normal_interest").val();
	var offset_interest=$("#offset_interest").val();
	
	calculateRepayment(loan_amount,offset_amount,loan_year,frequency,normal_interest,offset_interest);

	$("#button1").click(function(){
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
	});
});

function calculateRepayment(loan_amount,offset_amount,loan_year,frequency,normal_interest,offset_interest){
	var period=0; var power=0; 
	var term_interest1=0,term_interest2=0;
	var payment1=0,payment2=0;	
	if (frequency=="Weekly"){
		period=52;
		}
	if (frequency=="Fortnightly"){
		period=26;
		}
	if (frequency=="Monthly"){
		period=12;
		}
	
	power=loan_year*period;
	
	term_interest1=normal_interest/(period*100);
	term_interest2=offset_interest/(period*100);
	payment1=Math.round(loan_amount*term_interest1*Math.pow((1+term_interest1),power)/(Math.pow((1+term_interest1),power)-1));
	payment2=Math.round(loan_amount*term_interest2*Math.pow((1+term_interest2),power)/(Math.pow((1+term_interest2),power)-1));

	/*$text = "{\n".'"amount": "'.$amount.'",'."\n".'"mortgage": "'.$mortgage.'",'."\n".'"interest": "'.$interest.'",'."\n".'"frequency": "'.$frequency.'",'."\n".'"rtype": "'.$rtype.'",'."\n".'"payment": "'.$payment.'"'."\n}";

	file_put_contents('Result.json', $text);
	*/
	drawGraph1(loan_amount,offset_amount,loan_year,normal_interest,offset_interest,frequency);
	drawGraph2(loan_amount,offset_amount,loan_year,normal_interest,offset_interest,frequency);
	//echo "Your ".strtolower(frequency)." mortgage repayment<br /><h2>$".payment."</h2>";
}
					
function drawGraph1(initial_loan_amount,offset_amount,initial_loan_term,normal_interest,offset_interest,frequency){
	var plot;
	var result1=[],result2=[],result3=[];
	var initial_loan_amount=600000,loan_amount=initial_loan_amount;
	var saving_amount=3000,initial_offset_amount=3000,offset_amount=initial_offset_amount,visa_amount=0;
	var monthly_earning=3000,monthly_payment=1000;
	var p1_interest=0.06,p2_interest=0.06,p3_interest=0.06;
	var month=[];day=[],frequency=[],amount=[];			
	month[0]=1;month[1]=7;month[2]=3;month[3]=2;month[4]=2;month[5]=12;month[6]=3;month[7]=26;month[8]=8;month[9]=1;
	day[0]=2;day[1]=29;day[2]=1;day[3]=29;day[4]=4;day[5]=17;day[6]=21;day[7]=22;day[8]=10;day[9]=17;
	frequency[0]="Monthly";frequency[1]="Quarterly";frequency[2]="Monthly";frequency[3]="Monthly";frequency[4]="Monthly";frequency[5]="Quarterly";frequency[6]="Monthly";frequency[7]="Quarterly";frequency[8]="Monthly";frequency[9]="Yearly";
	amount[0]=210;amount[1]=700;amount[2]=140;amount[3]=100;amount[4]=30;amount[5]=250;amount[6]=40;amount[7]=1000;amount[8]=75;amount[9]=2000;
	var daily_interest=p1_interest/365; 					
	var yearly_accumulated_interest=0,monthly_accumulated_interest=0;
	$(function(){
		// saving
		result1.push([0,yearly_accumulated_interest]);				//alert("5");
		for(var m=1;m<13;m++){		//alert("m="+m);
			saving_amount+=monthly_earning; //alert("sa="+saving_amount+"\nme="+monthly_earning);
			for(var d=1;d<31;d++){	//alert("d="+d);
				for(var i=0;i<10;i++){	//alert("i="+i);alert("freqency="+frequency[i]);
					if(frequency[i]=="Monthly"){
						if(d==day[i]){
							saving_amount-=amount[i]; //alert("bam1");
						}
					}
					else if(frequency[i]=="Quarterly"){
						if((m==month[i]||m==month[i]+3||m==month[i]+6||m==month[i]+9||m==month[i]-3||m==month[i]-6||m==month[i]-9)&&(d==day[i])){	
							saving_amount-=amount[i];  //alert("bam2");
						}
					}
					else{
						if(m==month[i]&&d==day[i]){
							saving_amount-=amount[i];   //alert("bam3");
						}
					}
				}
				//alert("la="+loan_amount);
				//alert("di="+daily_interest);
				//alert("mai="+monthly_accumulated_interest);
				monthly_accumulated_interest+=loan_amount*daily_interest; //alert("mai="+monthly_accumulated_interest);
				if(d==30){
					saving_amount-=monthly_payment;
					yearly_accumulated_interest+=monthly_accumulated_interest;
					result1.push([(((m-1)*30)+d),yearly_accumulated_interest]); //alert("sa "+(((m-1)*30)+d)+" "+yearly_accumulated_interest);
					loan_amount+=monthly_accumulated_interest;
					loan_amount-=monthly_payment;
					monthly_accumulated_interest=0;
				}
			}
		}
		$("#_estimate_interest1").html(function(){
			return "Saving account: $ <b><span class='_blue'>"+(Math.round(yearly_accumulated_interest*100)/100)+"</span></b>";
		});
		yearly_accumulated_interest=0;			//alert("6");
		loan_amount=initial_loan_amount;
		
		// with offset
		result2.push([0,yearly_accumulated_interest]);
		for(var m=1;m<13;m++){
			offset_amount+=monthly_earning;
			for(var d=1;d<31;d++){
				for(var i=0;i<10;i++){
					if(frequency[i]=="Monthly"){
						if(d==day[i]){
							offset_amount-=amount[i];
						}
					}
					else if(frequency[i]=="Quarterly"){
						if((m==month[i]||m==month[i]+3||m==month[i]+6||m==month[i]+9||m==month[i]-3||m==month[i]-6||m==month[i]-9)&&(d==day[i])){	
							offset_amount-=amount[i];
						}
					}
					else{
						if(m==month[i]&&d==day[i]){
							offset_amount-=amount[i];
						}
					}
				}
				monthly_accumulated_interest+=(loan_amount-offset_amount)*daily_interest;
				if(d==30){
					offset_amount-=monthly_payment;
					yearly_accumulated_interest+=monthly_accumulated_interest;
					result2.push([(((m-1)*30)+d),yearly_accumulated_interest]); //alert("wo "+(((m-1)*30)+d)+" "+yearly_accumulated_interest);
					loan_amount+=monthly_accumulated_interest;
					loan_amount-=monthly_payment;
					monthly_accumulated_interest=0;
				}
			}
		}
		$("#_estimate_time1").html(function(){
			return "With offset: $ <b><span class='_blue'>"+(Math.round(yearly_accumulated_interest*100)/100)+"</span></b>";
		});
		yearly_accumulated_interest=0;				//alert("7");
		loan_amount=initial_loan_amount;
		offset_amount=initial_offset_amount;
		// with offset and visa
		result3.push([0,yearly_accumulated_interest]);
		for(var m=1;m<13;m++){
			offset_amount+=monthly_earning;
			for(var d=1;d<31;d++){
				for(var i=0;i<10;i++){
					if(frequency[i]=="Monthly"){
						if(d==day[i]){
							visa_amount-=amount[i];
						}
					}
					else if(frequency[i]=="Quarterly"){
						if((m==month[i]||m==month[i]+3||m==month[i]+6||m==month[i]+9||m==month[i]-3||m==month[i]-6||m==month[i]-9)&&(d==day[i])){	
							visa_amount-=amount[i];
						}
					}
					else{
						if(m==month[i]&&d==day[i]){
							visa_amount-=amount[i];
						}
					}
				}
				monthly_accumulated_interest+=(loan_amount-offset_amount)*daily_interest;
				if(d==30){
					offset_amount+=visa_amount;
					visa_amount=0;
					offset_amount-=monthly_payment;
					yearly_accumulated_interest+=monthly_accumulated_interest;
					result3.push([(((m-1)*30)+d),yearly_accumulated_interest]); //alert("wo "+(((m-1)*30)+d)+" "+yearly_accumulated_interest);
					loan_amount+=monthly_accumulated_interest;
					loan_amount-=monthly_payment;
					monthly_accumulated_interest=0;
				}
			}
		}
		$("#_estimate_difference1").html(function(){
			return "With offset & visa: $ <b><span class='_blue'>"+(Math.round(yearly_accumulated_interest*100)/100)+"</span></b>";
		});
		yearly_accumulated_interest=0;				//alert("8");
		loan_amount=initial_loan_amount;
		offset_amount=initial_offset_amount;
		
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
		    color:"#336633",
		}
		],   
		{ 
			series:{
				lines: { show:true}
			},
		
			crosshair: { mode: "x", lineWidth:10 },
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
					else if(val>1000&val<1000000)
						return (val/1000).toFixed(0)+"K";
					else
						return val;									
				}
			}
		});
		
		var legends = $("#placeholder1.legendLabel");
    	legends.each(function () {
			// fix the widths so they don't jump around
			$(this).css('width', $(this).width());
		});						
		var updateLegendTimeout = null;
		var latestPosition = null;
		
    	function updateLegend() {

        					updateLegendTimeout = null;
        					var pos = latestPosition;
        
							var axes = plot.getAxes();

        					//if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||pos.y < axes.yaxis.min || pos.y > axes.yaxis.max)

            				//return;
							
							
							var value1=result1[Math.round(pos.x)][1];
							var value2=result2[Math.round(pos.x)][1];
							var value3=mortgage-Math.round(pos.x);
							
							if (value2<=0||value1<=0){
								value1=1;
								value2=1;}
							var test=value2/value1*100;
							var value=value2/value1*250;
							if (rtype=="Principal & Interest"){
								$("#x").text(Math.round(test)+"% home laon");
								$("#y").text(Math.round(100-test)+"% interest");
								$("#_box").width(value);
							}
							else if(rtype=="Interest Only"){
								$("#x").text("0% home loan");
								$("#y").text("100% interest");
								$("#_box").width(0);
								}
							$("#_remain_year").text(value3);
						}
						
						
						
						
						$("#placeholder1").bind("plothover", function (event, pos, item) {							
							latestPosition = pos;
							   /*if (item) {
									  highlight(item.series, item.datapoint);
									  alert("You clicked a point!");
									}*/
							if (!updateLegendTimeout)
            					updateLegendTimeout = setTimeout(updateLegend, 50);
						});
						});
						
				}
function drawGraph2(initial_loan_amount,initial_offset_amount,initial_loan_term,normal_interest,offset_interest,frequency){
	var plot;
	$(function(){
		var period=0; 
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
		var term_offset_interest = offset_interest/(period*100);
		var power = initial_loan_term*period;
		var term_normal_payment = initial_loan_amount*term_normal_interest*Math.pow((1+term_normal_interest),power)/(Math.pow((1+term_normal_interest),power)-1);
		var term_offset_payment = initial_loan_amount*term_offset_interest*Math.pow((1+term_offset_interest),power)/(Math.pow((1+term_offset_interest),power)-1);
		var min_amount=-1,min_id=0;
		//without offset
		var result1=[];
		var N=initial_loan_term*period;
		var total_normal_payment=N*term_normal_payment;
		//with offset
		var total_offset_payment=[],result2=[];
		for(var offset_amount=0;offset_amount<=initial_loan_amount;offset_amount++){
			var interested_amount=initial_loan_amount-offset_amount;
			loan_term = (Math.log(term_offset_payment/(term_offset_payment-(interested_amount*term_offset_interest))))/(Math.log(1+(term_offset_interest)));
			loan_term += offset_amount/term_offset_payment;
			total_offset_payment.push(loan_term*term_offset_payment);
			if((min_amount==-1)&&((total_normal_payment-total_offset_payment[offset_amount])>=0)){
				min_amount=total_offset_payment[offset_amount];
				min_id=offset_amount;
			}
		}
		var scale = 10000;
		for(var i=0;i<=parseInt(initial_loan_amount/scale);i++){
			result1.push([(i*scale),total_normal_payment]);
			result2.push([(i*scale),total_offset_payment[(i*scale)]]);
		}
		$("#_estimate_interest2").html(function(){
			return "Normal loan amount: $ <b><span class='_blue'>"+initial_loan_amount+"</span></b><br />Normal loan repayment: $ <b><span class='_blue'>"+Math.round(total_normal_payment*100)/100+"</span></b>";
		});
		$("#_estimate_time2").html(function(){
			return "Offset amount varies:<br />$ <b><span class='_blue'>0</span></b> ~ $ <b><span class='_blue'>"+initial_loan_amount+"</span></b><br />Offset loan repayment varies:<br />$ <b><span class='_blue'>"+Math.round(total_offset_payment[0]*100)/100+"</span></b> ~ $ <b><span class='_blue'>"+initial_loan_amount;
		});
		$("#_estimate_difference2").html(function(){
			return "As long as there is more than $ <b><span class='_blue'>"+min_id+"</span></b> in the offset account, the total repayment will be less than total repayment of normal loan.";
		});
		plot=$.plot($("#placeholder2"), 
		[ {
			data: result1,
		    color: "#06f206",
		},
		{
			data: result2,
		    color:"#028802",
		}
		],   
		{ 
			series:{
				lines: { show:true}
			},
		
			crosshair: { mode: "x", lineWidth:10 },
			grid: { hoverable:true, autoHighlight: false},
			xaxis: {
				min: 0, 
				position:"bottom" ,
				tickFormatter: function(val,axis){
					if(val>=1000000)
						return (val/1000000).toFixed(2)+"M";
					else if(val==0)
						return val;					
					else if(val>1000&val<1000000)
						return (val/1000).toFixed(0)+"K";
					else
						return val;									
				}
			},
			yaxis: {
				min: 0, 
				position:"left" ,
				tickFormatter: function(val,axis){
					if(val>=1000000)
						return (val/1000000).toFixed(2)+"M";
					else if(val==0)
						return val;					
					else if(val>1000&val<1000000)
						return (val/1000).toFixed(0)+"K";
					else
						return val;									
				}
			}
		});
		
		var legends = $("#placeholder2.legendLabel");
    	legends.each(function () {
			// fix the widths so they don't jump around
			$(this).css('width', $(this).width());
		});						
		var updateLegendTimeout = null;
		var latestPosition = null;
		
    	function updateLegend() {

        					updateLegendTimeout = null;
        					var pos = latestPosition;
        
							var axes = plot.getAxes();

        					//if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||pos.y < axes.yaxis.min || pos.y > axes.yaxis.max)

            				//return;
							
							
							var value1=result1[Math.round(pos.x)][1];
							var value2=result2[Math.round(pos.x)][1];
							var value3=mortgage-Math.round(pos.x);
							
							if (value2<=0||value1<=0){
								value1=1;
								value2=1;}
							var test=value2/value1*100;
							var value=value2/value1*250;
							if (rtype=="Principal & Interest"){
								$("#x").text(Math.round(test)+"% home laon");
								$("#y").text(Math.round(100-test)+"% interest");
								$("#_box").width(value);
							}
							else if(rtype=="Interest Only"){
								$("#x").text("0% home loan");
								$("#y").text("100% interest");
								$("#_box").width(0);
								}
							$("#_remain_year").text(value3);
						}
						
						
						
						
						$("#placeholder2").bind("plothover", function (event, pos, item) {							
							latestPosition = pos;
							   /*if (item) {
									  highlight(item.series, item.datapoint);
									  alert("You clicked a point!");
									}*/
							if (!updateLegendTimeout)
            					updateLegendTimeout = setTimeout(updateLegend, 50);
						});
						});
						
				}