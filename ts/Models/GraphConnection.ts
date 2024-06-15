import { Canvas } from "../Utils/Canvas.js";
import { GraphNode } from "./GraphNode.js";
import { Vector, IVector } from "../Utils/Vector.js";
import { IPhysicsSpring } from "../Utils/Physics.js";

export class GraphConnection implements IPhysicsSpring
{
    private nodeA: GraphNode;
    private nodeB: GraphNode;
    private directed: boolean;
    private idealLength: number;

    constructor(nodeA: GraphNode, nodeB: GraphNode)
    {
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.directed = false;
        this.idealLength = 200;
    }

    public get Directed() { return this.directed; }
    public set Directed(value: boolean) { this.directed = value; }
    
    public get NodeA() { return this.nodeA; }
    public get NodeB() { return this.nodeB; }

    public get SpringFrom() { return this.nodeA; }
    public get SpringTo() { return this.nodeB; }

    public get IdealLength() { return this.idealLength; }
    public set IdealLength(value: number) { this.idealLength = value; }

    public get Distance() { return Vector.Distance(this.nodeA, this.nodeB); }
    
    public Draw()
    {
        Canvas.Ctx.beginPath();
        
        Canvas.Ctx.moveTo(this.nodeA.X, this.nodeA.Y);
        Canvas.Ctx.lineTo(this.nodeB.X, this.nodeB.Y);

        Canvas.Ctx.strokeStyle = "black";
        Canvas.Ctx.lineWidth = 8;

        Canvas.Ctx.stroke();

        if(this.directed)
        {
            
        }

        const lineCenter: IVector = 
        {
            X: (this.nodeA.X + this.nodeB.X) / 2,
            Y: (this.nodeA.Y + this.nodeB.Y) / 2,
        };

        Canvas.Ctx.beginPath();
        Canvas.Ctx.fillStyle = "white";
        Canvas.Ctx.font = "24px Courier-New";
        Canvas.Ctx.textAlign = "center";
        Canvas.Ctx.textBaseline = "middle";
        Canvas.Ctx.fillText(Math.round(this.Distance).toString(), lineCenter.X, lineCenter.Y);
    }
}