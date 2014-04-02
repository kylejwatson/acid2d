acid.init = function(){
	acid.debug = true;
	ground = new Image();
	ground.src = "ground.png";
	ground.ys = 400;
	acid.addChild(ground);
	acid.addPhysics(ground, false, 0.5, false, 5, true);
	wall = acid.rect("fill", 10, 500, "blue");
	wall.xs = 400;
	acid.addChild(wall);
	acid.addPhysics(wall, false, 0.5, false, 5, true);
	box = acid.rect("line", 20, 20, "red");
	acid.addChild(box);
	acid.addPhysics(box, true, 0.1);
}

acid.update = function(){
}

acid.keydown = function(evt){
	switch(evt){
		case 37:
			box.velX -= 5;
		break;
		case 39:
			box.velX += 5;
		break;
		case 38:
			box.velY -= 5;
		break;
		default:
			//
	}
}