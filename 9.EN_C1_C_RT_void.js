function makeCirc(x,y,r){
	makeOval(x-r,y-r,2*r,2*r);
}
function pad (a, left) { 
	while (lengthOf(""+a)<left) a="0"+a; 
	return ""+a; 
}	 
function drawCirc(cord){
	makeOval(cord[0]+1,cord[1]+1,cord[2]-1,cord[3]-1);
	run("Draw", "stack");
}

code = 'EN_C1_C_RT_TIFF';
cordpin = newArray(454, 463, 94, 94);
cordsep = newArray(273, 258, 487, 487);

setForegroundColor(255, 255, 255);
setBackgroundColor(0,0,0);

makeOval(cordsep[0],cordsep[1],cordsep[2],cordsep[3]);
run("Clear Outside","stack");

run("ROI Manager...");
roiManager("Add");
roiManager("Select", 0);
roiManager("Rename", "0");

makeOval(cordpin[0],cordpin[1],cordpin[2],cordpin[3]);
run("Clear","stack");
run("ROI Manager...");
roiManager("Add");
roiManager("Select", 1);
roiManager("Rename", "1");

fdir1 = '/Users/andrewkim/Documents/AA_Discharge/TIFFS/' + code +'/';
run("Set Measurements...", "area mean min area_fraction display add redirect=None decimal=3");
run("Set Scale...", "distance=1 known=1 pixel=1 unit=mm");
setSlice(1);	
run("8-bit");
run("Auto Local Threshold", "method=Phansalkar radius=5 parameter_1=.10 parameter_2=0.9 white stack");

//drawCirc(cordsep);
// drawCirc(cordpin);

roiManager("Select", newArray(0,1));
roiManager("XOR");
roiManager("Save", fdir1+code+"_roi.zip");

fdir2 = '/Users/andrewkim/Documents/AA_Discharge/TIFFS/' + code +'/Void/';
saveAs("Tiff", fdir2+code+"_Porosity.tif");