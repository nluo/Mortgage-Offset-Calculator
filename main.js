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
		//without offset
		var loan_amount1=[],interest_payment=[],actual_loan_payment1=[],result1=[];
		var N=initial_loan_term*period;
		for(var n=0;n<N;n++){
			if(n==0){
				interest_payment.push(initial_loan_amount*term_normal_interest);
			}
			else{
				interest_payment.push(loan_amount1[n-1]*term_normal_interest);
			}
			actual_loan_payment1.push(term_normal_payment-interest_payment[n]);
			if(n==0){
				loan_amount1.push(initial_loan_amount-actual_loan_payment1[n]);
			}
			else{
				loan_amount1.push(loan_amount1[n-1]-actual_loan_payment1[n]);
			}
		}
		loan_amount1[N-1]=0; 
		
		//with offset
		var loan_amount2=[],interested_amount=[],after_offset_interest_payment=[],actual_loan_payment2=[],result2=[];
		var n2=0;
		while(n2==0||loan_amount2[n2-1]>0){
			if(n2==0){
				interested_amount.push(initial_loan_amount-offset_amount);
			}
			else{
				interested_amount.push(loan_amount2[n2-1]-offset_amount);
			}
			if(interested_amount[n2]<0){
				interested_amount[n2]=0;
			}
			after_offset_interest_payment.push(interested_amount[n2]*term_offset_interest);
			actual_loan_payment2.push(term_offset_payment-after_offset_interest_payment[n2]);
			if(n2==0){
				loan_amount2.push(initial_loan_amount-actual_loan_payment2[n2]);
			}
			else{
				loan_amount2.push(loan_amount2[n2-1]-actual_loan_payment2[n2]);
			}
			n2++;
		}
		var remainder = -1*loan_amount2[n2-1];
		var account_result=[];
		account_result.push(N);
		account_result.push(term_normal_payment);
		account_result.push(n2);
		account_result.push(term_offset_payment);
		account_result.push(remainder);
		loan_amount2[n2]=0;
		var i=0;
		result1.push([0,initial_loan_amount]); 
		for(i=0;i<N;i++){
			result1.push([(i+1)/period,loan_amount1[i]]);
		}
		result2.push([0,initial_loan_amount]);
		for(i=0;i<n2;i++){
			result2.push([(i+1)/period,loan_amount2[i]]);
		}
		$("#_estimate_interest1").html(function(){
			return "Normal loan repayment: $ <b><span class='_blue'>"+(Math.round(account_result[1]*account_result[0]*100)/100)+"</span></b><br />With offset loan repayment:  $ <b><span class='_blue'>"+(Math.round(((account_result[3]*account_result[2])-account_result[4])*100)/100)+"</span></b>";
		});
		$("#_estimate_time1").html(function(){
			return "Estimate of normal loan term: <br /><b><span class='_blue'>"+(parseInt(account_result[0]/period))+"</span></b> year(s) <b><span class='_blue'>"+Math.round((account_result[0]%period)*12)+ "</span></b> month(s).<br />Estimate of with offset loan term: <br /><b><span class='_blue'>"+(parseInt(account_result[2]/period))+"</span></b> year(s) <b><span class='_blue'>"+Math.round(((account_result[2]/period)*12)%12)+ "</span></b> month(s).";
		});
		$("#_estimate_difference1").html(function(){
			var payment_difference = Math.round(((account_result[1]*account_result[0])-((account_result[3]*account_result[2])-account_result[4]))*100)/100;
			var term_difference = Math.round((account_result[0]-account_result[2])/period*100)/100;
			if(payment_difference<0){
				return "Difference in loan repayments: $ <b><span class='_red'>"+(-1*payment_difference)+"</span></b><br />Difference in loan terms: <b><span class='_green'>"+(parseInt(term_difference))+"</span></b> year(s) <b><span class='_green'>"+(Math.round(((term_difference)*12)%12))+"</span></b> month(s)";
			}
			else{
				return "Difference in loan repayments: $ <b><span class='_green'>"+(payment_difference)+"</span></b><br />Difference in loan terms: <b><span class='_green'>"+(parseInt(term_difference))+"</span></b> year(s) <b><span class='_green'>"+(Math.round(((term_difference)*12)%12))+"</span></b> month(s)";
			}
		});
		plot=$.plot($("#placeholder1"), 
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