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
		$("#placeholder").fadeOut(1);
		//update the form value
		loan_amount=$("#loan_amount").val();
		offset_amount=$("#offset_amount").val();
		loan_year=$("#loan_year").val();
		frequency=$("#loan_repaymentFrequency").val();
		normal_interest=$("#normal_interest").val();
		offset_interest=$("#offset_interest").val();
		//call the function again
		calculateRepayment(loan_amount,offset_amount,loan_year,frequency,normal_interest,offset_interest);	
		$("#placeholder").show(1000);
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
	drawGraph(loan_amount,offset_amount,loan_year,normal_interest,offset_interest,frequency);
	//echo "Your ".strtolower(frequency)." mortgage repayment<br /><h2>$".payment."</h2>";
}
					
function drawGraph(ILA,OA,ML,NI,OI,frequency){
	//Initial Loan Amount, Offset Amount, Mortgage Length, Normal Interest, Offset Interest
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
		var TNI=NI/(period*100); //Term Normal Interest
		var TOI=OI/(period*100); //Term Offset Interest
		var power=ML*period;
		var TNP=ILA*TNI*Math.pow((1+TNI),power)/(Math.pow((1+TNI),power)-1);
		var TOP=ILA*TOI*Math.pow((1+TOI),power)/(Math.pow((1+TOI),power)-1);
		
		//without offset
		var LA1=[],IP=[],ALP1=[],result1=[]; //Loan Amount1,Interest Payment,Actual Loan Payment1
		var N=ML*period;
		for(var n=0;n<N;n++){
			if(n==0){
				IP.push(ILA*TNI);
			}
			else{
				IP.push(LA1[n-1]*TNI);
			}
			ALP1.push(TNP-IP[n]);
			if(n==0){
				LA1.push(ILA-ALP1[n]);
			}
			else{
				LA1.push(LA1[n-1]-ALP1[n]);
			}
		}
		LA1[N-1]=0; 
		
		//with offset
		var LA2=[],IA=[],AOIP=[],ALP2=[],result2=[]; //Loan Amount2,Interested Amount,After Offset Interest Payment,Actual Loan Payment2
		var n2=0;
		while(n2==0||LA2[n2-1]>0){
			if(n2==0){
				IA.push(ILA-OA); //alert("IA="+IA);
			}
			else{
				IA.push(LA2[n2-1]-OA); //alert("IA="+IA);
			}
			if(IA[n2]<0){
				IA[n2]=0;
			}
			AOIP.push(IA[n2]*TOI); //alert("AOIP="+AOIP);
			ALP2.push(TOP-AOIP[n2]); //alert("ALP2="+ALP2);
			if(n2==0){
				LA2.push(ILA-ALP2[n2]); //alert("LA2="+LA2);
			}
			else{
				LA2.push(LA2[n2-1]-ALP2[n2]); //alert("LA2="+LA2);
			}
			n2++;
		}
		var remainder = -1*LA2[n2-1];
		var TP=[];
		TP.push(N);
		TP.push(TNP);
		TP.push(n2);
		TP.push(TOP);
		TP.push(remainder);
		LA2[n2]=0;
		
		var i=0;
		result1.push([0,ILA]);
		for(i=0;i<N;i++){
			result1.push([(i+1)/period,LA1[i]]);
		}
		
		result2.push([0,ILA]);
		for(i=0;i<n2;i++){
			result2.push([(i+1)/period,LA2[i]]);
		}
		
		$("#_estimate_interest").html(function(){
		return "Normal loan payment: <b>$<span class='_blue'>"+(Math.round(TP[1]*TP[0]*100)/100)+"</span></b><br />With offset loan payment: <b>$<span class='_blue'>"+(Math.round(((TP[3]*TP[2])-TP[4])*100)/100)+"</span></b>";
		});
		$("#_estimate_time").html(function(){
		return "Estimate of normal loan term: <b><span class='_blue'>"+(Math.round(TP[0]/period*100)/100)+"</span></b> years.<br />Estimate of with offset loan term: <b><span class='_blue'>"+(Math.round(TP[2]/period*100)/100)+"</span></b> years.";
		});
		$("#_estimate_difference").html(function(){
		var payment_difference = Math.round(((TP[1]*TP[0])-((TP[3]*TP[2])-TP[4]))*100)/100;
		var term_difference = Math.round((TP[0]-TP[2])/period*100)/100;
		if(payment_difference<0){
			return "Difference in payments: <b>$<span class='_red'>"+(-1*payment_difference)+"</span></b><br />Difference in loan terms: <b><span class='_green'>"+(term_difference)+"</span></b> years.";
		}
		else{
			return "Difference in loan payments: <b>$<span class='_green'>"+(payment_difference)+"</span></b><br />Difference in loan terms: <b><span class='_green'>"+(term_difference)+"</span></b> years.";
		}
		});
		plot=$.plot($("#placeholder"), 
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
		
		var legends = $("#placeholder.legendLabel");
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
						
						
						
						
						$("#placeholder").bind("plothover", function (event, pos, item) {							
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