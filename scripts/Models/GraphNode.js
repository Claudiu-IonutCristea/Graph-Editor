import { Canvas } from "../Utils/Canvas.js";
export class GraphNode {
    constructor(vector, value) {
        this.x = vector.X;
        this.y = vector.Y;
        this.value = value;
        this.radius = 0;
        this.fixed = false;
        this.forces = new Array;
    }
    get X() { return this.x; }
    set X(value) { this.x = value; }
    get Y() { return this.y; }
    set Y(value) { this.y = value; }
    get Radius() { return this.radius; }
    set Radius(value) { this.radius = value; }
    get Value() { return this.value; }
    set Value(value) { this.value = value; }
    get Fixed() { return this.fixed; }
    set Fixed(value) { this.fixed = value; }
    get Forces() { return this.forces; }
    Draw() {
        Canvas.Ctx.beginPath();
        Canvas.Ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        Canvas.Ctx.fillStyle = "white";
        Canvas.Ctx.fill();
        Canvas.Ctx.lineWidth = this.radius * GraphNode.strokeFactor * (this.fixed ? GraphNode.strokeFixedNodeFactor : 1);
        Canvas.Ctx.strokeStyle = "black";
        Canvas.Ctx.stroke();
        Canvas.Ctx.beginPath();
        Canvas.Ctx.fillStyle = "black";
        Canvas.Ctx.font = `${this.radius}px Courier-New`;
        Canvas.Ctx.textAlign = "center";
        Canvas.Ctx.textBaseline = "middle";
        Canvas.Ctx.fillText(this.value, this.x, this.y);
        //Velocity
        // Canvas.Ctx.beginPath();
        // Canvas.Ctx.moveTo(this.x, this.y);
        // Canvas.Ctx.lineTo(this.X + this.velocity.X, this.Y + this.velocity.Y);
        // Canvas.Ctx.lineWidth = 3;
        // Canvas.Ctx.strokeStyle = "green";
        // Canvas.Ctx.stroke();
        // Canvas.Ctx.beginPath();
        // Canvas.Ctx.fillStyle = "green";
        // Canvas.Ctx.font = `24px Courier-New`;
        // Canvas.Ctx.textAlign = "left";
        // Canvas.Ctx.textBaseline = "middle";
        // Canvas.Ctx.fillText(MyMath.RoundTo(Vector.Magnitude(this.Velocity), 1).toString(), this.x + this.radius, this.y);
        // //drag
        // Canvas.Ctx.beginPath();
        // Canvas.Ctx.moveTo(this.x, this.y);
        // Canvas.Ctx.lineTo(this.X + this.DragForce.X, this.Y + this.DragForce.Y);
        // Canvas.Ctx.lineWidth = 3;
        // Canvas.Ctx.strokeStyle = "red";
        // Canvas.Ctx.stroke();
        // Canvas.Ctx.beginPath();
        // Canvas.Ctx.fillStyle = "red";
        // Canvas.Ctx.font = `24px Courier-New`;
        // Canvas.Ctx.textAlign = "right";
        // Canvas.Ctx.textBaseline = "middle";
        // Canvas.Ctx.fillText(MyMath.RoundTo(Vector.Magnitude(this.DragForce), 1).toString(), this.x - this.radius, this.y);
    }
}
GraphNode.strokeFixedNodeFactor = 2;
GraphNode.strokeFactor = 0.15;
