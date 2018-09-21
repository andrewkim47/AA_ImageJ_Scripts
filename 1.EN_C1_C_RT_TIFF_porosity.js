nBins = 256;
code = 'EN_C1_C_RT_TIFF';
fdir = '/Users/andrewkim/Documents/AA_Discharge/TIFFS/' + code +'/';

setSlice(1);	
saveAs("PNG", fdir + "Histogram/porosity_raw.png");

run("8-bit");
run("Auto Local Threshold", "method=Phansalkar radius=5 parameter_1=0.1 parameter_2=0 white stack");

//Clear inside pin
makeOval(451, 466, 92, 92);
run("ROI Manager...");
roiManager("Add");
roiManager("Select", 0);
roiManager("Rename", "0");	
run("Clear", "stack");

//clear outside MnO2
makeOval(275, 255, 500, 500);
run("ROI Manager...");
roiManager("Add");
roiManager("Select", 1);
roiManager("Rename", "1");	
run("Clear Outside", "stack");
run("Select None");

roiManager("Select", newArray(0,1));
roiManager("XOR");

for (n = 1; n <= nSlices(); n++) {
	setSlice(n);	
	getHistogram(values, counts, nBins);		

	hname = fdir + "Histogram/Hist_Porosity" +"_N" + (n-1) +".csv";
	hfil = File.open(hname);
	print(hfil, "bin\tcounts"); 
	for (k=0; k<nBins; k++) { 
		print(hfil, k +"\t" + counts[k]); 
	} 
	File.close(hfil);	
// 	changeValues(1,tlow,10);
}
run("Select None");
setSlice(1);	
saveAs("PNG", fdir + "Histogram/porosity.png");
saveAs("Tiff",fdir+"Raw/Processed/"+ code + "_Porosity.tif");		
