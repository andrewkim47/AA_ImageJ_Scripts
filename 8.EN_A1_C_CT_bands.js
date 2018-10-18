function makeCirc(x,y,r){
	makeOval(x-r,y-r,2*r,2*r);
}
function makebands(cord1,nums){
	xf = cord1[0]; 	yf = cord1[1]; 	wf = cord1[2]; 	hf = cord1[3];
	
	xc = xf+wf/2;
	yc = yf+hf/2;
	
	ri = 10;
	rf = (wf+hf)/4;
	
	dr = round((rf-ri)/numbands);

	r = ri;
	
	for (i = 0; i < numbands; i++) {
		makeCirc(xc,yc,r);
		bandstring = "band=" + dr;
		run("Make Band...", bandstring);
		run("ROI Manager...");
		roiManager("Add");
		roiManager("Select", i);
		roiManager("Rename", ""+i);	
		r = r + dr;	
	}	
}

function pad (a, left) { 
	while (lengthOf(""+a)<left) a="0"+a; 
	return ""+a; 
}	 

code = 'EN_A1_C_CT_TIFF';
cord1 = newArray(71, 70, 894, 894);
numbands=50;
fdir = '/Users/andrewkim/Documents/AA_Discharge/TIFFS/' + code +'/';

setSlice(1);	
run("8-bit");
run("Auto Local Threshold", "method=Phansalkar radius=5 parameter_1=.15 parameter_2=0 white stack");
saveAs("Tiff",fdir+"Raw/Processed/"+ code + "_BandPorosity.tif");		


run("Image Sequence...", "open="+fdir+"Raw sort");
run("8-bit");
imageCalculator("AND create stack", "Raw",code + "_BandPorosity.tif");
selectWindow("Result of Raw");
run("Set Scale...", "distance=1 known=1 pixel=1 unit=mm");
setBackgroundColor(0, 0, 0);

fdir = '/Users/andrewkim/Documents/AA_Discharge/TIFFS/' + code +'/Histogram/';
makebands(cord1,numbands);
 