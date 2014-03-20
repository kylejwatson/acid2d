var acid = new Object();
(function() {
var displayList = new Array();
var physicsList = new Array();
var frame;
var outputBox;

window.onload = function(){
	canvases = document.getElementsByTagName("canvas");
	if(canvases.length > 0 && canvases.namedItem("main")){
		var mainCanvas = canvases.namedItem("main");
	}
	else{
		var mainCanvas = document.createElement("canvas");
		mainCanvas.width = 800;
		mainCanvas.height = 600;
		mainCanvas.id = "main";
		document.body.appendChild(mainCanvas);
	}
	textBoxes = document.getElementsByTagName("textarea");
	if(textBoxes.length > 0 && textBoxes.namedItem("console")){
		outputBox = textBoxes.namedItem("console");
	}
	else{
		outputBox = document.createElement("textarea");
		outputBox.id = "console";
		document.body.appendChild(outputBox);
	}
	acid.width = mainCanvas.width;
	acid.height = mainCanvas.height;
	frame = mainCanvas.getContext("2d");
	acid.debug = false;
	document.body.onkeypress = acid.keypress;
	acid.init();
	if(!acid.debug){
		document.body.removeChild(outputBox);
		outputBox = null;
		outputBox = undefined;
		textBoxes = null;
		textBoxes = undefined;
	}
	window.setInterval(updateThings,20);
}

acid.rect = function(ftype, wid, hig, col){
	shapeCanvas = document.createElement("canvas");
	shapeCanvas.width = wid;
	shapeCanvas.height = hig;
	newShape = shapeCanvas.getContext("2d");
	if(ftype == "fill"){
		newShape.fillStyle = col;
		newShape.fillRect(0,0,wid,hig);
	}
	else if(ftype == "line"){
		newShape.strokeStyle = col;
		newShape.strokeRect(0,0,wid,hig);
	}
	imageNull = new Image();
	imageNull.src = shapeCanvas.toDataURL("image/png");
	imageNull.nwidth = wid;
	imageNull.nheight = hig;
	imageNull.xs = 0;
	imageNull.ys = 0;
	return imageNull;
}

function updateThings(){
	frame.canvas.width = frame.canvas.width;
	acid.update();
	
	for(var i=0;i<physicsList.length;i++){
		if(!physicsList[i].freeze){
			if(physicsList[i].gravity){
				physicsList[i].velY += 0.1;
			}
			if(physicsList[i].isSolid){
				for(var i2=0;i2<physicsList.length;i2++){
					if(i2 != i && physicsList[i2].isSolid){
						if(acid.checkcolX(physicsList[i], physicsList[i2])){
							physicsList[i].velX = -physicsList[i].velX/3;
						}
						if(acid.checkcolY(physicsList[i], physicsList[i2])){
							physicsList[i].velY = -physicsList[i].velY/3;
						}
					}
				}
			}
			physicsList[i].xs += physicsList[i].velX;
			physicsList[i].ys += physicsList[i].velY;
		}
	}
	
	for(var i=0;i<displayList.length;i++){
		frame.drawImage(displayList[i], displayList[i].xs, displayList[i].ys);
	}
}

acid.checkcolX = function(obj1, obj2){
	if(physicsList.indexOf(obj1) > -1 && physicsList.indexOf(obj2) > -1 ){
		if(obj1.xs + obj1.boundBox[0] + obj1.velX < obj2.xs + obj2.boundBox[2] + obj2.velX &&
		obj2.xs + obj2.boundBox[0] + obj2.velX < obj1.xs + obj1.boundBox[2] + obj1.velX && 
		obj1.ys + obj1.boundBox[1] < obj2.ys + obj2.boundBox[3] && 
		obj2.ys + obj2.boundBox[1] < obj1.ys + obj1.boundBox[3]){
			return true;
		}
		else{
			return false;
		}
	}
}
acid.checkcolY = function(obj1, obj2){
	if(physicsList.indexOf(obj1) > -1 && physicsList.indexOf(obj2) > -1 ){
		if(obj1.xs + obj1.boundBox[0] < obj2.xs + obj2.boundBox[2] &&
		obj2.xs + obj2.boundBox[0] < obj1.xs + obj1.boundBox[2] && 
		obj1.ys + obj1.boundBox[1] + obj1.velY < obj2.ys + obj2.boundBox[3] + obj2.velY && 
		obj2.ys + obj2.boundBox[1] + obj2.velY < obj1.ys + obj1.boundBox[3] + obj1.velY){
			return true;
		}
		else{
			return false;
		}
	}
}

acid.addChild = function(theChild){
	if(theChild.hasAttribute("src")){
		displayList.push(theChild);
	}
/*	else if(theChild.canvas){
		imageNull = new Image();
		imageNull.src = theChild.canvas.toDataURL("image/png");
		imageNull.xs = theChild.xs;
		imageNull.ys = theChild.ys;
		displayList.push(imageNull);
		theChild.canvas.width = theChild.canvas.width;
		return imageNull;
	}*/
}


acid.addPhysics = function(thePhysics, grav, fric, isSolid, isStatic){
	thePhysics.gravity = true;
	thePhysics.friction = true;
	thePhysics.isSolid = true;
	thePhysics.freeze = false;
	physicsList.push(thePhysics);
	if(grav != undefined){thePhysics.gravity = grav;}
	if(fric != undefined){thePhysics.friction = fric;}
	if(isSolid != undefined){thePhysics.solid = isSolid;}
	if(isStatic != undefined){thePhysics.freeze = isStatic;}
	thePhysics.velX = 0;
	thePhysics.velY = 0;
	thePhysics.boundBox = [0,0,thePhysics.nwidth,thePhysics.nheight];
}

acid.output = function(theText){
	if(acid.debug){
		outputBox.value += "Output> '" + theText + "' \n";
	}
	else{
		alert("acid.debug is declared false, you cannot output to console");
	}
}
}());