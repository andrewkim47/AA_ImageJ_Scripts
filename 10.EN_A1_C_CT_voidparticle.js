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

code = 'EN_A1_C_CT_TIFF';
cordpin = newArray(456, 464, 94, 94);
cordsep = newArray(272, 277, 493, 493);

setForegroundColor(255, 255, 255);
setBackgroundColor(0,0,0);

Table.reset();

fdir1 = '/Users/andrewkim/Documents/AA_Discharge/TIFFS/' + code +'/';
fdir2 = '/Users/andrewkim/Documents/AA_Discharge/TIFFS/' + code +'/Void/';
saveAs("Tiff", fdir2+code+"_Raw.tif");

setSlice(1);	
run("8-bit");
run("Auto Local Threshold", "method=Phansalkar radius=5 parameter_1=.15 parameter_2=0 white stack");

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
roiManager("Save", fdir1+code+"_roi.zip");


saveAs("Tiff", fdir2+code+"_VoidThreshold.tif");

roiManager("Select", newArray(0,1));
roiManager("XOR");
run("Analyze Particles...", "size=3-Infinity pixel show=Masks display clear in_situ slice");
run("Revert");

roiManager("Select", newArray(0,1));
roiManager("XOR");
run("Analyze Particles...", "size=3-Infinity pixel show=Masks display clear in_situ stack");
Table.save(fdir2+code+'_VoidParticleSize.csv');

saveAs("Tiff", fdir2+code+"_VoidParticle.tif");

Table.reset();

setOption("Stack position", true);
for (n=1; n<=nSlices; n++) {
  setSlice(n);
  run("Measure");
}
Table.save(fdir2+code+'_VoidAreaFraction.csv');

roiManager("deselect");
roiManager("delete");

rename("Threshold");
run("Invert", "stack");

open(fdir2+code+"_Raw.tif")
rename("Raw");
run("8-bit");
run("Interleave", "stack_1=Raw stack_2=Threshold");

saveAs("Tiff", fdir2+code+"_VoidInterleave.tif");
