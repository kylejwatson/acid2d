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
	frame.save();
	acid.debug = false;
	acid.keyboard = {right:false, left:false, up:false, down:false};
	document.body.onkeydown = keydown;
	document.body.onkeyup = keyup;
	acid.camera = {xs:0, ys:0, id:-1, margin:10};
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

function keydown(evt){
	switch(evt.keyCode){
		case 39:
			acid.keyboard.right = true;
		break;
		case 37:
			acid.keyboard.left = true;
		break;
		case 38:
			acid.keyboard.up = true;
		break;
		case 40:
			acid.keyboard.down = true;
		break;
		default:
			//
	}
	if(typeof acid.keydown == 'function') { 
		acid.keydown(evt.keyCode); 
	}
}

function keyup(evt){
	switch(evt.keyCode){
		case 39:
			acid.keyboard.right = false;
		break;
		case 37:
			acid.keyboard.left = false;
		break;
		case 38:
			acid.keyboard.up = false;
		break;
		case 40:
			acid.keyboard.down = false;
		break;
		default:
			//
	}
	if(typeof acid.keyup == 'function') { 
		acid.keyup(evt.keyCode); 
	}
}

acid.rect = function(ftype, wid, hig, col, platform){
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
	return imageNull;
}

function updateThings(){
	frame.canvas.width = frame.canvas.width;	
	if(typeof acid.update == 'function') { 
		acid.update(); 
	}
	
	for(var i=0;i<physicsList.length;i++){
		if(!physicsList[i].freeze){			
			if(physicsList[i].hasOwnProperty("onGround")){
				physicsList[i].onGround = false;
			}
			if(physicsList[i].gravity){
				physicsList[i].velY += 0.1;
			}
			for(var i2=0;i2<physicsList.length;i2++){
				if(i2 != i){
					if(acid.checkcol(physicsList[i], physicsList[i2], true, true)){
						if(physicsList[i].velX == Math.abs(physicsList[i].velX)){
							physicsList[i].velX -= physicsList[i].friction + physicsList[i2].friction;
							if(physicsList[i].velX < 0.1 && physicsList[i].velX != 0){
								physicsList[i].velX = 0;
							}
						}
						else{
							physicsList[i].velX += physicsList[i].friction + physicsList[i2].friction;		
							if(physicsList[i].velX > 0.1 && physicsList[i].velX != 0){
								physicsList[i].velX = 0;
							}						
						}
					}
					if(acid.checkcol(physicsList[i], physicsList[i2], true, false)){
						if(physicsList[i].velY == Math.abs(physicsList[i].velY)){
							physicsList[i].velY -= physicsList[i].friction + physicsList[i2].friction;
							if(physicsList[i].hasOwnProperty("onGround")){
								physicsList[i].onGround = true;
							}
							if(physicsList[i].velY < 0.1 && physicsList[i].velY != 0){
								physicsList[i].velY = 0;
							}
						}
						else{
							physicsList[i].velY += physicsList[i].friction + physicsList[i2].friction;
							if(physicsList[i].velY > 0.1 && physicsList[i].velY != 0){
								physicsList[i].velY = 0;
							}
						}
					}
					if(physicsList[i2].solid && physicsList[i].solid){
						if(acid.checkcol(physicsList[i], physicsList[i2], false, true)){
							physicsList[i].velX = -physicsList[i].velX/(100/(physicsList[i].bounce+physicsList[i2].bounce));
						}
						if(acid.checkcol(physicsList[i], physicsList[i2], false, false)){
							physicsList[i].velY = -physicsList[i].velY/(100/(physicsList[i].bounce+physicsList[i2].bounce));
						}
					}
				}
				
			}
			physicsList[i].xs += physicsList[i].velX;
			physicsList[i].ys += physicsList[i].velY;
		}
	}
	
	for(var i=0;i<displayList.length;i++){
		if(acid.camera.id == i && (!(displayList[i].nwidth > acid.width - 2 * acid.camera.margin) || !(displayList[i].nheight > acid.height - 2 * acid.camera.margin))){
			if(displayList[i].xs + displayList[i].nwidth + acid.camera.margin > acid.width){
				acid.camera.xs -= displayList[i].xs + displayList[i].nwidth + acid.camera.margin - acid.width;
				displayList[i].xs = acid.width - displayList[i].nwidth - acid.camera.margin;				
			}
			else if(displayList[i].xs - acid.camera.margin < 0){
				acid.camera.xs -= displayList[i].xs - acid.camera.margin;
				displayList[i].xs = acid.camera.margin;				
			}
			if(displayList[i].ys + displayList[i].nheight + acid.camera.margin > acid.height){
				acid.camera.ys -= displayList[i].ys + displayList[i].nheight + acid.camera.margin - acid.height;
				displayList[i].ys = acid.height - displayList[i].nheight - acid.camera.margin;				
			}
			else if(displayList[i].ys - acid.camera.margin < 0){
				acid.camera.ys -= displayList[i].ys - acid.camera.margin;
				displayList[i].ys = acid.camera.margin;	
			}
			frame.save();
			frame.translate(displayList[i].xs + displayList[i].nwidth/2, displayList[i].ys + displayList[i].nheight/2);
			frame.rotate(displayList[i].rotation*(Math.PI/180));
			frame.scale(displayList[i].scaleX, displayList[i].scaleY);
			frame.drawImage(displayList[i], -(displayList[i].nwidth/2), -(displayList[i].nheight/2));
			frame.restore();
			if(acid.debug){
				frame.strokeRect(acid.camera.margin, acid.camera.margin, acid.width - 2*acid.camera.margin, acid.height - 2*acid.camera.margin);
			}
		}
		else{
			frame.save();
			frame.translate(displayList[i].xs + acid.camera.xs + displayList[i].nwidth/2, displayList[i].ys + acid.camera.ys + displayList[i].nheight/2);
			frame.rotate(displayList[i].rotation*(Math.PI/180));
			frame.scale(displayList[i].scaleX, displayList[i].scaleY);
			frame.drawImage(displayList[i], -(displayList[i].nwidth/2), -(displayList[i].nheight/2));
			frame.restore();
		}
	}
}

acid.checkcol = function(obj1, obj2, fric, p){
	if(physicsList.indexOf(obj1) > -1 && physicsList.indexOf(obj2) > -1 ){
		if(displayList.indexOf(obj1) == acid.camera.id){
			left1 = obj1.xs + obj1.boundBox[0];
			top1 = obj1.ys + obj1.boundBox[1];
			right1 = obj1.xs + obj1.boundBox[2];
			bottom1 = obj1.ys + obj1.boundBox[3];
		}
		else{
			left1 = obj1.xs + obj1.boundBox[0] + acid.camera.xs;
			top1 = obj1.ys + obj1.boundBox[1] + acid.camera.ys;
			right1 = obj1.xs + obj1.boundBox[2] + acid.camera.xs;
			bottom1 = obj1.ys + obj1.boundBox[3] + acid.camera.ys;
		}
		left2 = obj2.xs + obj2.boundBox[0] + acid.camera.xs;
		top2 = obj2.ys + obj2.boundBox[1] + acid.camera.ys;
		right2 = obj2.xs + obj2.boundBox[2] + acid.camera.xs;
		bottom2 = obj2.ys + obj2.boundBox[3] + acid.camera.ys;
		
		if(obj2.platform){
			if(p &! fric){
				return false;
			}
			else if(!(right1 < left2 || left1 > right2 || bottom1 + obj1.velY < top2 || top1 + obj1.velY > bottom2) && Math.abs(obj1.velY) == obj1.velY && bottom1 < top2){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			if(p){
				if(!fric){
					if(!(right1 + obj1.velX	< left2 || left1 + obj1.velX > right2 || bottom1 < top2 || top1 > bottom2)){
						return true;
					}
					else if(right1 < left2 && left1 + obj1.velX > right2 || left1 > right2 && right1 + obj1.velX < left2){
						return true;			
					}
					else{
						return false;
					}
				}
				else{
					if(!(right1 + obj1.velX	< left2 || left1 + obj1.velX > right2 || bottom1 + 1 < top2 || top1 - 1 > bottom2)){
						return true;
					}
					else{
						return false;
					}
				}
			}
			else{
				if(!fric){
					if(!(right1 < left2 || left1 > right2 || bottom1 + obj1.velY < top2 || top1 + obj1.velY > bottom2)){
						return true;
					}
					else if(bottom1 < top2 && top1 + obj1.velY > bottom2 || top1 > bottom2 && bottom1 + obj1.velY < top2){
						return true;			
					}
					else{
						return false;
					}
				}
				else{
					if(!(right1 + 1 < left2 || left1 - 1 > right2 || bottom1 + obj1.velY < top2 || top1 + obj1.velY > bottom2)){
						return true;
					}
					else{
						return false;
					}
				}		
			}
		}
	}
}

acid.addChild = function(theChild, camera){
	if(theChild.hasAttribute("src")){
		if(!theChild.hasOwnProperty("xs")){theChild.xs = 0;}
		if(!theChild.hasOwnProperty("ys")){theChild.ys = 0;}
		if(!theChild.hasOwnProperty("scaleX")){theChild.scaleX = 1;}
		if(!theChild.hasOwnProperty("scaleY")){theChild.scaleY = 1;}
		if(!theChild.hasOwnProperty("rotation")){theChild.rotation = 0;}
		theChild.onload = function(){
			if(!theChild.nwidth){
				theChild.nwidth = theChild.naturalWidth;
				theChild.nheight = theChild.naturalHeight;
			}
			displayList.push(theChild);
			if(typeof camera == "boolean" && camera && (!(theChild.nwidth > acid.width - 2 * acid.camera.margin) || !(theChild.nheight > acid.height - 2 * acid.camera.margin))){
				acid.camera.id = displayList.indexOf(theChild);
			}
		};
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
acid.removeChild = function(theChild){
	if(displayList.indexOf(theChild) > -1){
		if(displayList.indexOf(theChild) == acid.camera.id){
			acid.camera.id = -1;
		}
		displayList.splice(displayList.indexOf(theChild),1);
	}
}
acid.removePhysics = function(theChild){
	if(physicsList.indexOf(theChild) > -1){
		physicsList.splice(physicsList.indexOf(theChild),1);
	}
}

acid.addPhysics = function(thePhysics, grav, fric, isSolid, bounce, isStatic, plat){
	if(thePhysics.hasAttribute("src")){
		thePhysics.gravity = true;
		thePhysics.friction = 0.08;
		thePhysics.solid = true;
		thePhysics.bounce = 5;
		thePhysics.freeze = false;
		thePhysics.platform = false;
		physicsList.push(thePhysics);
		if(typeof grav == "boolean"){thePhysics.gravity = grav;}
		if(typeof fric == "number"){thePhysics.friction = fric;}
		if(typeof isSolid == "boolean"){thePhysics.solid = isSolid;}
		if(typeof bounce == "number"){thePhysics.bounce = bounce;}
		if(typeof isStatic == "boolean"){thePhysics.freeze = isStatic;}
		if(typeof plat == "boolean"){thePhysics.platform = plat;}
		thePhysics.velX = 0;
		thePhysics.velY = 0;
		thePhysics.boundBox = [0,0,thePhysics.nwidth,thePhysics.nheight];
	}
}

acid.output = function(theText,clear){
	if(clear){
		outputBox.value = "";
	}
	if(acid.debug){
		outputBox.value += "Output> '" + theText + "' \n";
	}
	else{
		alert("acid.debug is declared false, you cannot output to console");
	}
}
}());