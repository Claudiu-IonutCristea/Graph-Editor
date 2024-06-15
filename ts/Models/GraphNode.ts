import { ICircle, MyMath } from "../Utils/MyMath.js";
import { Canvas } from "../Utils/Canvas.js";
import { IPhysicsObject } from "../Utils/Physics.js";
import { Vector, IVector } from "../Utils/Vector.js";
import { Time } from "../Utils/Time.js";

export class GraphNode implements ICircle, IPhysicsObject
{
    private static strokeFixedNodeFactor = 2;
    private static strokeFactor = 0.15;
    
    private x: number;
    private y: number;
    private radius: number;
    private value: string;
    private fixed: boolean;
    private mass: number;
    private dragCoef: number;
    private velocity: IVector;
    private forces: Array<IVector>;

    constructor(vector: IVector, value: string)
    {
        this.x = vector.X;
        this.y = vector.Y;
        this.value = value;

        this.radius = 0;
        this.fixed = false;
        this.mass = 1;
        this.dragCoef = 8e-2;
        this.velocity = Vector.Zero;
        this.forces = new Array<IVector>();
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

    public get Mass() { return this.mass }
    public set Mass(value: number) { this.mass = value; }

    public get Velocity() 
    { 
        const mag = Vector.Magnitude(this.velocity);

        if(mag < 5)
        {
            this.velocity = Vector.Zero;
        }

        return this.velocity 
    }

    public get Direction() { return Vector.Normalize(this.velocity) }

    public get DragForce()
    {  
        const dragForce: IVector = 
        {
            X: this.dragCoef * this.Velocity.X * this.Velocity.X * -Math.sign(this.Velocity.X),
            Y: this.dragCoef * this.Velocity.Y * this.Velocity.Y * -Math.sign(this.Velocity.Y),
        };

        return dragForce;
    }

    public AddForce(force: IVector)
    {
        this.forces.push(force);
    }

    public UpdatePosition()
    {
        this.AddForce(this.DragForce);

        let force = Vector.Zero;

        let f = this.forces.pop();
        while(f)
        {
            force = Vector.Add(force, f);
            f = this.forces.pop();
        }

        const acceleration: IVector =
        {
            X: force.X / this.mass,
            Y: force.Y / this.mass
        };

        this.Velocity.X += acceleration.X * Time.FixedDeltaTime;
        this.Velocity.Y += acceleration.Y * Time.FixedDeltaTime;

        this.X += this.Velocity.X * Time.FixedDeltaTime;
        this.Y += this.Velocity.Y * Time.FixedDeltaTime;
    }

    public ResetVelocity()
    {
        this.velocity = Vector.Zero;
    }

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