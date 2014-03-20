acid.init = function(){
	acid.debug = true;
	box = acid.rect("line",800,20,"red");
	box.ys = 560;
	box3 = acid.rect("line",20,800,"red");
	box3.xs = 560;
	acid.addChild(box3);
	acid.addChild(box);
	acid.addPhysics(box,false,true,true,true);
	acid.addPhysics(box3,false,true,true,true);
	box2 = acid.rect("fill",40,40,"blue");
	box2.xs = 100;
	acid.addChild(box2);
	acid.addPhysics(box2, true);
}

acid.update = function(){
	box.xs += 0.1
}

acid.keypress = function(evt){
	switch(evt.keyCode){
		case 37:
			box2.velX -= 100;
		break;
		case 39:
			box2.velX += 100;
		break;
		default:
			//
	}
	acid.output(evt.keyCode);
}