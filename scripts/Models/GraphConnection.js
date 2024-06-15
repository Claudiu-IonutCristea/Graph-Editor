import { Canvas } from "../Utils/Canvas.js";
import { Vector } from "../Utils/Vector.js";
export class GraphConnection {
    constructor(source, target) {
        this.source = source;
        this.target = target;
        this.directed = false;
        this.idealLength = 200 + this.source.Radius + this.target.Radius;
    }
    get Directed() { return this.directed; }
    set Directed(value) { this.directed = value; }
    get Source() { return this.source; }
    get Target() { return this.target; }
    get IdealLength() { return this.idealLength; }
    set IdealLength(value) { this.idealLength = value + this.source.Radius + this.target.Radius; }
    get Distance() { return Vector.Distance(this.source, this.target); }
    Draw() {
        Canvas.Ctx.beginPath();
        Canvas.Ctx.moveTo(this.source.X, this.source.Y);
        Canvas.Ctx.lineTo(this.target.X, this.target.Y);
        Canvas.Ctx.strokeStyle = "black";
        Canvas.Ctx.lineWidth = 8;
        Canvas.Ctx.stroke();
        if (this.directed) {
        }
        // const lineCenter: IVector = 
        // {
        //     X: (this.nodeA.X + this.nodeB.X) / 2,
        //     Y: (this.nodeA.Y + this.nodeB.Y) / 2,
        // };
        // Canvas.Ctx.beginPath();
        // Canvas.Ctx.fillStyle = "white";
        // Canvas.Ctx.font = "24px Courier-New";
        // Canvas.Ctx.textAlign = "center";
        // Canvas.Ctx.textBaseline = "middle";
        // Canvas.Ctx.fillText((Math.round(this.Distance) - this.NodeA.Radius - this.NodeB.Radius).toString(), lineCenter.X, lineCenter.Y);
    }
}
