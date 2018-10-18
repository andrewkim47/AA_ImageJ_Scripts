run("8-bit");
code = 'ER_A1_D_RT_TIFF';
fdir = '/Users/andrewkim/Documents/AA_Discharge/TIFFS/' + code +'/Linescan/';
//center coordinate

cent = getCenter(278, 282, 452, 452);
x0 = cent[0]; 
y0 = cent[1];
ra = 500;
lw = 60;
nlines = 16;

function getCenter(x1,y1,w1,h1){
	xc = x1+w1/2;
	yc = y1+h1/2;
	rc = (w1+h1)/4;
	return newArray(xc,yc,rc);
	
}
function drawLines(x0,y0,ra,lw){
// 	angles = newArray(-1.0,-0.75,-0.5,-0.25,0,0.25,0.50,0.75,1.0);
	
	dx = 2.0/nlines;
	angles = newArray(nlines+1);
	angles[0] = -1;

	for (i=1; i<=nlines; i++){
		angles[i] = angles[i-1]+dx;
	}

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

Lname = fdir + "pre_Linescans_Sep16.csv";
Lfil = File.open(Lname);

profile = getProfile();
header = "bin";
numpoints = profile.length;
for (i=0; i<numpoints; i++){
	header = header +'\t'+i;
}
print(Lfil,header);

for (n = 1; n <= nSlices(); n++) {
	for(k=0; k<nlines; k++){
		roiManager("Select", k);
		setSlice(n);
		entry = "N"+(n-1)+"L"+k;	
		profile = getProfile();
		numpoints = profile.length;
		for (i=0; i<numpoints; i++){
			entry = entry + '\t' + profile[i];
		}
		print(Lfil,entry);
	}	
}
File.close(Lfil);

roiManager("Show All");
run("Flatten","slice");
saveAs("PNG", fdir + "lines_sep.png");



