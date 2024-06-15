import { ICircle } from "../Utils/MyMath.js";
import { Canvas } from "../Utils/Canvas.js";
import { IPhysicsObject } from "../Utils/Physics.js";
import { Vector, IVector } from "../Utils/Vector.js";

export class GraphNode implements IVector, ICircle, IPhysicsObject
{
    private static strokeFixedNodeFactor = 2;
    private static strokeFactor = 0.15;
    
    private x: number;
    private y: number;
    private radius: number;
    private value: string;
    private fixed: boolean;
    private forces: Array<IVector>;

    constructor(vector: IVector, value: string)
    {
        this.x = vector.X;
        this.y = vector.Y;
        this.value = value;

        this.radius = 0;
        this.fixed = false;
        this.forces = new Array<IVector>;
    }

    public get X() { return this.x }
    public set X(value: number) { this.x = value; }

    public get Y() { return this.y }
    public set Y(value: number) { this.y = value; }

    public get Radius() { return this.radius }
    public set Radius(value: number) { this.radius = value; }

    public get Value() { return this.value }
    public set Value(value: string) { this.value = value; }

    public get Fixed() { return this.fixed }
    public set Fixed(value: boolean) { this.fixed = value; }

    public get Forces() { return this.forces; }

    public Draw()
    {
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