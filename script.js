acid.init = function(){
	acid.debug = true;
	ground = acid.rect("line",442,33,"red");
	ground.ys = 400;
	acid.addChild(ground);
				  //thePhysics, grav, fric, isSolid, bounce, isStatic, plat
	acid.addPhysics(ground, false, 0.08, true, 5, true, true);
	wall = acid.rect("fill", 10, 500, "blue");
	wall.xs = 400;
	acid.addChild(wall);
	acid.addPhysics(wall, false, 0.00, true, 5, true);
	acid.output(wall.friction);
	nwall = acid.rect("fill", 10, 500, "blue");
	acid.addChild(nwall);
	acid.addPhysics(nwall, false, 0.08, false, 5, true);
	box = acid.rect("line", 20, 20, "red");
	box.rotation = 45;
	acid.addChild(box, true);
	acid.addPhysics(box, true);
	box.onGround = false;
	acid.camera.margin = 200;
}

acid.update = function(){
	box.rotation = 5*box.velX;
	if(acid.keyboard.right){
		box.velX += 0.4;
	}
	if(acid.keyboard.left){
		box.velX -= 0.3;
	}
}

acid.keydown = function(k){
	acid.output(k);
	if(k == 38 && box.onGround){
		box.velY -= 5;
	}
	if(k==65){
		acid.camera.id = 0;
	}
	if(k==83){
		acid.camera.id = 1;
	}
	if(k==68){
		acid.camera.id = 2;
	}
}