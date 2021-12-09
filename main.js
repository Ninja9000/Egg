class Vec2 {
    constructor(x = 0, y = 0) { this.x = x; this.y = y;}

    mul(o) { return new Vec2(this.x * o.x, this.y * o.y); }
    div(o) { return new Vec2(this.x / o.x, this.y / o.y); }
    add(o) { return new Vec2(this.x + o.x, this.y + o.y); }
    sub(o) { return new Vec2(this.x - o.x, this.y - o.y); }

    mulf(f) { return new Vec2(this.x * f, this.y * f); }
    divf(f) { return new Vec2(this.x / f, this.y / f); }
    addf(f) { return new Vec2(this.x + f, this.y + f); }
    subf(f) { return new Vec2(this.x - f, this.y - f); }

    maxf(f) { return new Vec2(Math.max(f, this.x), Math.max(f, this.y)); }
    minf(f) { return new Vec2(Math.min(f, this.x), Math.min(f, this.y)); }

    dot(o) { return this.x * o.x + this.y * o.y; }
    mag() { return Math.sqrt(this.dot(this)); }
    norm() { return this.divf(this.mag() || 1); }
}

window.onload = () => {
	const canvas = document.getElementById("egg");
	const ctx = canvas.getContext("2d");
	(window.onresize = () => {
		canvas.width = window.innerWidth;
    	canvas.height = window.innerHeight;
	})();
	const width = canvas.width
	const height = canvas.height
	
	let pos = new Vec2();
	let vel = new Vec2();

	let mousePos = new Vec2();
	window.onmousemove = ev => mousePos = new Vec2(ev.pageX - width/2, ev.pageY - height/2);

	const keys = new Set();
	window.onkeydown = ev => keys.add(ev.key);
	window.onkeyup = ev => keys.delete(ev.key);

	(function frame() {
    	let mov = new Vec2();
    	
		if (keys.has('w')) mov.y -= 1;
    	if (keys.has('a')) mov.x -= 1;
    	if (keys.has('s')) mov.y += 1;
    	if (keys.has('d')) mov.x += 1;
    	mov = mov.norm().mulf(2.1);
    	vel = vel.add(mov).mulf(0.8);
    	pos = pos.add(vel);

    	ctx.clearRect(0, 0, canvas.width, canvas.height);

    	const stretch = Math.abs(Math.sin(Date.now() * 0.002));

    	function fillSlime(scale, up, color) {
    		ctx.fillStyle = color;
    		ctx.beginPath();
    		const s = 1.1 + 0.25 * stretch;
			scale *= 50;
    		ctx.ellipse(pos.x + width / 2, pos.y + height / 2 - up, scale, scale * s, 0, Math.PI, 0);
    		ctx.ellipse(pos.x + width / 2, pos.y + height / 2 - up, scale, scale * 0.45, 0, Math.PI * 2, 0);
    		ctx.fill();
    	}
    	fillSlime(1.0, 0, "rgb(225, 92, 160)");
    	fillSlime(0.8, 2, "rgb(245, 105, 180)");

		let eyePos = pos.sub(new Vec2(0, 15 - stretch * 5));
    	function fillEye(xSize, ySize, color) {
    		ctx.fillStyle = color;
    		ctx.beginPath();
    		ctx.ellipse(eyePos.x + width / 2, eyePos.y + height / 2 - stretch * 8, xSize, ySize, 0, Math.PI * 2, 0);
    		ctx.fill();
    	}
		let deltaLen = mousePos.sub(eyePos).mag();
		let delta = mousePos.sub(eyePos).norm();
		eyePos = eyePos.add(delta.mulf(Math.min(deltaLen * 0.25, 8)));
    	fillEye(22 * (-stretch / 6 + 1), 22 * (stretch / 8 + 0.8), "rgb(205, 98, 170)");
    	fillEye(18 * (-stretch / 6 + 1), 18 * (stretch / 8 + 0.8), "rgb(255, 235, 240)");
		eyePos = eyePos.add(delta.mulf(Math.min(deltaLen * 0.5, 6) * (-stretch / 6 + 1.4)));
    	fillEye(10, 10, "rgb(255, 185, 240)");
    	fillEye(6, 6, "rgb(80, 50, 50)");

    	ctx.save();
    		ctx.translate(pos.x + width / 2, pos.y + height / 2);
    		ctx.beginPath();
    		ctx.moveTo(27, 0);
    		ctx.lineTo(20, 9);
			ctx.lineTo(30, 6);
    		ctx.lineTo(35, 2);
    		ctx.lineTo(35, -8 - stretch * 2);
			ctx.lineTo(33, -15 - stretch * 2);
    		ctx.fillStyle = "rgb(255, 127, 190)";
    		ctx.fill();
    	ctx.restore();

    	requestAnimationFrame(frame);
	})();
};