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
	acid.width = mainCanvas.width;
	acid.height = mainCanvas.height;
	frame = mainCanvas.getContext("2d");
	var shapeCanvas = document.createElement("canvas");
	shapeCanvas.width = 800;
	shapeCanvas.height = 600;
	acid.shape = shapeCanvas.getContext("2d");
	acid.debug = false;
	acid.init();
	if(acid.debug){
		textBoxes = document.getElementsByTagName("textarea");
		if(textBoxes.length > 0 && textBoxes.namedItem("console")){
			outputBox = textBoxes.namedItem("console");
		}
		else{
			outputBox = document.createElement("textarea");
			outputBox.id = "console";
			document.body.appendChild(outputBox);
		}	
	}
	window.setInterval(drawChildren,20);
	document.body.onkeypress = acid.keyPress;
}

function drawChildren(){
	frame.canvas.width = frame.canvas.width;
	acid.update();
	
	for(var i=0;i<physicsList.length;i++){
		if(physicsList[i].gravity){
			physicsList[i].velY += 0.1;
		}
		physicsList[i].xs += physicsList[i].velX;
		physicsList[i].ys += physicsList[i].velY;
	}
	
	for(var i=0;i<displayList.length;i++){
		frame.drawImage(displayList[i], displayList[i].xs, displayList[i].ys);
	}
}

acid.addChild = function(theChild){
	if(theChild.canvas){
		imageNull = new Image();
		imageNull.src = theChild.canvas.toDataURL("image/png");
		imageNull.xs = theChild.xs;
		imageNull.ys = theChild.ys;
		displayList.push(imageNull);
		theChild.canvas.width = theChild.canvas.width;
		return imageNull;
	}
	else if(theChild.hasAttribute("src")){
		displayList.push(theChild);
	}
}
acid.addPhysics = function(thePhysics, grav, fric, isStatic){
	physicsList.push(thePhysics);
	thePhysics.freeze = isStatic;
	thePhysics.gravity = grav;
	thePhysics.friction = fric
	thePhysics.velX = 0;
	thePhysics.velY = 0;
}

acid.output = function(theText){
	if(acid.debug){
		outputBox.value += "Output> '" + theText + "' \n";
	}
}
}());