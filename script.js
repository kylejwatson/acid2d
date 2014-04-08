acid.init = function(){
	acid.debug = true;
	ground = acid.rect("line",442,33,"red");
	ground.ys = 400;
	acid.addChild(ground);
	acid.addPhysics(ground, false, 0.08, true, 5, true, true);
	wall = acid.rect("fill", 10, 500, "blue");
	wall.xs = 400;
	acid.addChild(wall);
	acid.addPhysics(wall, false, 0.08, false, 5, true);
	box = acid.rect("line", 20, 20, "red");
	acid.addChild(box, true);
	acid.addPhysics(box, true);
	acid.camera.margin = 30;
}

acid.update = function(){
	if(acid.keyboard.right){
		box.velX += 0.4;
	}
	if(acid.keyboard.left){
		box.velX -= 0.3;
	}
	if(acid.keyboard.up){
		box.velY -= 0.4;
	}
	if(acid.keyboard.down){
		box.velY += 0.3;
	}
}