code = 'EN_C1_C_RT_TIFF';

function makeCirc(x,y,r){
	makeOval(x-r,y-r,2*r,2*r);
}
function makebands(cord1,cord2,nums){
	x1 = cord1[0]; 	y1 = cord1[1]; 	w1 = cord1[2]; 	h1 = cord1[3];
	x2 = cord2[0]; 	y2 = cord2[1]; 	w2 = cord2[2]; 	h2 = cord2[3];
	
	xi = x1+w1/2;
	yi = y1+h1/2;
	ri = (w1+h1)/4;
	
	xf = x2+w2/2;
	yf = y2+h2/2;
	rf = (w2+h2)/4
	
	dx = round((xf-xi)/numbands);
	dy = round((yf-yi)/numbands);
	dr = round((rf-ri)/numbands);

	x = xi;
	y = yi;
	r = ri;
	
	for (i = 0; i < numbands; i++) {
		makeCirc(x,y,r);
		bandstring = "band=" + dr;
		run("Make Band...", bandstring);
		run("ROI Manager...");
		roiManager("Add");
		roiManager("Select", i);
		roiManager("Rename", ""+i);	
		x = x + dx;
		y = y + dy;
		r = r + dr;	
	}	
}

run("8-bit");
run("Set Scale...", "distance=1 known=1 pixel=1 unit=mm");
setBackgroundColor(0, 0, 0);
fdir = '/Users/andrewkim/Documents/AA_Discharge/TIFFS/' + code +'/Histogram/';
numbands=5;


cord1 = newArray(451, 466, 92, 92); //center pin
cord2 = newArray(276.0,291.0,442.0,442.0); //largest center pin

makebands(cord1,cord2,numbands);
 
nBins = 256;
sname = fdir + "Stat_Pin_Band.csv";
sfil = File.open(sname);	
print(sfil, "b\tn\t"+"area\t"+"mean\t"+"std");
File.close(sfil);	 	

for (b = 0; b < 5; b++) {
	roiManager("Select", b);
	for (n = 1; n <= nSlices(); n++) {
		setSlice(n);
		hname = fdir + "Hist_Pin_Band_B" + b + "_N" + (n-1) +".csv";
		hfil = File.open(hname);
	
		getHistogram(values, counts, nBins);
		getStatistics(area, mean, min, max, std);
		print(hfil, "area:"+area+",mean:"+mean+",std:"+std);
		print(hfil, "bin\tcounts"); 
		for (k=0; k<nBins; k++) { 
        	print(hfil, k +"\t" + counts[k]); 
		} 
		File.close(hfil);
		File.append(b+"\t"+n+"\t"+area+"\t"+mean+"\t"+std, sname) 
	}

}
roiManager("Show All");
run("Flatten");
saveAs("PNG", fdir + "bandpin.png");

