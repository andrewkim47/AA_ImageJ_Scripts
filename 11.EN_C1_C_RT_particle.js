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

Table.reset();

fdir1 = '/Users/andrewkim/Documents/AA_Discharge/TIFFS/' + code +'/';
fdir2 = '/Users/andrewkim/Documents/AA_Discharge/TIFFS/' + code +'/Void/';
// saveAs("Tiff", fdir2+code+"_Raw.tif");

setSlice(1);	
run("8-bit");
run("Invert", "stack");
run("Auto Local Threshold", "method=Bernsen radius=3 parameter_1=30 parameter_2=0 stack");
run("Invert", "stack");

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


run("Set Measurements...", "area mean min area_fraction display add redirect=None decimal=3");
run("Set Scale...", "distance=1 known=1 pixel=1 unit=mm");
//drawCirc(cordsep);
// drawCirc(cordpin);

roiManager("Select", newArray(0,1));
roiManager("XOR");
// roiManager("Save", fdir1+code+"_roi.zip");


saveAs("Tiff", fdir2+code+"_BernsenThreshold.tif");

roiManager("Select", newArray(0,1));
roiManager("XOR");
run("Analyze Particles...", "size=3-Infinity pixel show=Masks display clear in_situ slice");
// run("Analyze Particles...", "size=3-Infinity pixel show=Overlay display clear in_situ");
run("Revert");

roiManager("Select", newArray(0,1));
roiManager("XOR");
run("Analyze Particles...", "size=3-Infinity pixel show=Masks display clear in_situ stack");
// run("Analyze Particles...", "size=3-Infinity pixel show=Mask display clear in_situ");
Table.save(fdir2+code+'_BernsenParticleSize.csv');

saveAs("Tiff", fdir2+code+"_BernsenParticle.tif");

Table.reset();

setOption("Stack position", true);
for (n=1; n<=nSlices; n++) {
  setSlice(n);
  run("Measure");
}
Table.save(fdir2+code+'_BernsenAreaFraction.csv');

roiManager("deselect");
roiManager("delete");

rename("Threshold");
// run("Invert", "stack");

open(fdir2+code+"_Raw.tif")
rename("Raw");
run("8-bit");
run("Interleave", "stack_1=Raw stack_2=Threshold");

saveAs("Tiff", fdir2+code+"_BernsenInterleave.tif");
