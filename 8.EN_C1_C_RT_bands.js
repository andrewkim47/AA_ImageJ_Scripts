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
numbands=50;
cord1 = newArray(67, 52, 894, 894);

run("8-bit");
run("Set Scale...", "distance=1 known=1 pixel=1 unit=mm");
setBackgroundColor(0, 0, 0);
makebands(cord1,numbands);
 
