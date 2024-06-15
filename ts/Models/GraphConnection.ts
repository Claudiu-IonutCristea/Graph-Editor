import { Canvas } from "../Utils/Canvas.js";
import { GraphNode } from "./GraphNode.js";
import { Vector, IVector } from "../Utils/Vector.js";
import { IPhysicsSpring } from "../Utils/Physics.js";

export class GraphConnection implements IPhysicsSpring
{
    private source: GraphNode;
    private target: GraphNode;
    private directed: boolean;
    private idealLength: number;

    constructor(source: GraphNode, target: GraphNode)
    {
        this.source = source;
        this.target = target;
        this.directed = false;
        this.idealLength = 200 + this.source.Radius + this.target.Radius;
    }

    public get Directed() { return this.directed; }
    public set Directed(value: boolean) { this.directed = value; }
    
    public get Source() { return this.source; }
    public get Target() { return this.target; }

    public get IdealLength() { return this.idealLength; }
    public set IdealLength(value: number) { this.idealLength = value + this.source.Radius + this.target.Radius; }

    public get Distance() { return Vector.Distance(this.source, this.target); }
    
    public Draw()
    {
        Canvas.Ctx.beginPath();
        
        Canvas.Ctx.moveTo(this.source.X, this.source.Y);
        Canvas.Ctx.lineTo(this.target.X, this.target.Y);

        Canvas.Ctx.strokeStyle = "black";
        Canvas.Ctx.lineWidth = 8;

        Canvas.Ctx.stroke();

        if(this.directed)
        {
            
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