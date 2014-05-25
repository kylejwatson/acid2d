acid.init = function(){
	acid.debug = true;
	ground = acid.rect("line",400,30,"red");
	ground.ys = 400;
	acid.addChild(ground);
	//thePhysics, grav, fric, isSolid, bounce, isStatic, plat
	acid.addPhysics(ground, false, 0.08, true, 5, true, false);
	box = acid.rect("line", 20, 20, "red");
	box.rotation = 45;
	box.xs =160;
	box.ys =-50;
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
//	acid.output(k);
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
	if(k==70){
		acid.camera.id = 3;
	}
}