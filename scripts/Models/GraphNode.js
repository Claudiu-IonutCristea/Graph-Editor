import { Canvas } from "../Utils/Canvas.js";
export class GraphNode {
    constructor(vector, value) {
        this.x = vector.X;
        this.y = vector.Y;
        this.value = value;
        this.radius = 0;
        this.fixed = false;
        this.forces = new Array;
        this.isAffectedByPhysics = true;
    }
    get X() { return this.x; }
    set X(value) { this.x = value; }
    get Y() { return this.y; }
    set Y(value) { this.y = value; }
    get Position() { return { X: this.x, Y: this.y }; }
    set Position(value) { this.x = value.X; this.y = value.Y; }
    get Radius() { return this.radius; }
    set Radius(value) { this.radius = value; }
    get Value() { return this.value; }
    set Value(value) { this.value = value; }
    get Fixed() { return this.fixed; }
    set Fixed(value) { this.fixed = value; }
    get IsAffectedByPhysics() { return this.isAffectedByPhysics && !this.fixed; }
    set IsAffectedByPhysics(value) { this.isAffectedByPhysics = value; }
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
    }
}
GraphNode.strokeFixedNodeFactor = 2;
GraphNode.strokeFactor = 0.15;
