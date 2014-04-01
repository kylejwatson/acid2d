acid.init = function(){
	acid.debug = true;
	ground = new Image();
	ground.src = "ground.png";
	ground.ys = 400;
	acid.addChild(ground);//, grav, fric, isSolid, bounce, isStatic
	acid.addPhysics(ground, false, 0, false, 0, true);
	box = acid.rect("line", 20, 20, "red");
	acid.addChild(box);
	acid.addPhysics(box, true, 20);
}

acid.update = function(){
}

acid.keypress = function(evt){
	switch(evt.keyCode){
		case 97:
			box2.velX -= 20;
		break;
		case 37:
			box2.velX -= 20;
		break;
		case 100:
			box2.velX += 20;
		break;
		case 39:
			box2.velX += 20;
		break;
		case 119:
			box2.velY -= 5;
		break;
		case 38:
			box2.velY -= 5;
		break;
		default:
			//
	}
	acid.output(evt.keyCode);
}