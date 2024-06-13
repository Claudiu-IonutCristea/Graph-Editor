import { Canvas } from "../Utils/Canvas.js";
import { Vector } from "../Utils/Vector.js";
export class GraphConnection {
    constructor(nodeA, nodeB) {
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.directed = false;
    }
    get Directed() { return this.directed; }
    set Directed(value) { this.directed = value; }
    get NodeA() { return this.nodeA; }
    get NodeB() { return this.nodeB; }
    get Distance() { return Vector.Distance(this.nodeA, this.nodeB); }
    Draw() {
        Canvas.Ctx.beginPath();
        Canvas.Ctx.moveTo(this.nodeA.X, this.nodeA.Y);
        Canvas.Ctx.lineTo(this.nodeB.X, this.nodeB.Y);
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
        // Canvas.Ctx.fillText(MyMath.RoundTo(this.Distance, 1).toString(), lineCenter.X, lineCenter.Y);
    }
}
