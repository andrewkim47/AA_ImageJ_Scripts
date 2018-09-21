run("8-bit");
code = 'EN_C1_C_RT_TIFF';
fdir = '/Users/andrewkim/Documents/AA_Discharge/TIFFS/' + code +'/Linescan/';
//center coordinate

cent = getCenter(451, 466, 92, 92);
x0 = cent[0]; 
y0 = cent[1];
ra = 475;
lw = 60;

function getCenter(x1,y1,w1,h1){
	xc = x1+w1/2;
	yc = y1+h1/2;
	rc = (w1+h1)/4;
	return newArray(xc,yc,rc);
	
}

function drawLines(x0,y0,ra,lw){
	angles = newArray(-1.0,-0.75,-0.5,-0.25,0,0.25,0.50,0.75,1.0);

	for (i=0; i<angles.length; i++) {
		th = PI*angles[i];
		x1 = ra * sin(th);
		y1 = ra * cos(th);
		makeLine(x0,y0,x0+x1,y0+y1,lw);
		run("ROI Manager...");
		roiManager("Add");
		roiManager("Select", i);
		roiManager("Rename", ""+i);
	}
}

drawLines(x0,y0,ra,lw);

Lname = fdir + "pre_Linescans_Pin.csv";
Lfil = File.open(Lname);

profile = getProfile();
header = "bin";
numpoints = profile.length
for (i=0; i<numpoints; i++){
	header = header +'\t'+i;
}
print(Lfil,header);

for (n = 1; n <= nSlices(); n++) {
	setSlice(n);
	for(k=0; k<8; k++){
		roiManager("Select", k);
		entry = "N"+(n-1)+"L"+k;	
		profile = getProfile();
		for (i=0; i<numpoints; i++){
			entry = entry + '\t' + profile[i];
		}
		print(Lfil,entry);
	}	
}
File.close(Lfil);

roiManager("Show All");
run("Flatten");
saveAs("PNG", fdir + "lines_pin.png");

