class Particle2D{
    constructor(origin, cellSize, position, velocity = new Vector(0,0)){
        this.origin = origin;
        this.cellSize = cellSize;
        this.position = position;
        this.velocity = velocity;
        this.trail = new Array(16);
        this.trail.fill(new Vector(0,0));
        this.trail[this.trail.length - 1] = this.position;
    }

    draw(ctx, index, radius, opacity){
        ctx.fillStyle = `rgba(178, 34, 34,${opacity})`;
        ctx.beginPath();
        ctx.arc(this.origin.x + this.trail[index][0] * this.cellSize, this.origin.y - this.trail[index][1] * this.cellSize, radius, 0, Math.PI*2);
        ctx.fill();
    }
}