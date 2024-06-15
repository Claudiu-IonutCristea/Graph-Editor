import { GraphManager } from "../Models/GraphManager.js";
import { Canvas } from "./Canvas.js";
import { Time } from "./Time.js";
import { Vector, IVector } from "./Vector.js";

export interface IPhysicsObject extends IVector
{
    Forces: Array<IVector>,
    IsAffectedByPhysics: boolean,
    Position: IVector,
}

export interface IPhysicsSpring
{
    Source: IPhysicsObject,
    Target: IPhysicsObject,
    IdealLength: number,
}

export class Physics
{
    private static springConstant = 5e4;
    private static gravityConstant = 1e1;
    private static repulsiveConstatnt = 5e7;

    public static Update()
    {
        const objects = GraphManager.Instance.Nodes as Array<IPhysicsObject>;
        const springs = GraphManager.Instance.Connections as Array<IPhysicsSpring>;
        const gravityPosition: IVector = 
        {
            X: Canvas.Canvas.width / 2,
            Y: Canvas.Canvas.height / 2,
        }

        this.AddSpringForces(springs)
        this.AddGravityForces(objects, gravityPosition);
        this.AddRepulsiveForces(objects);

        this.SolveForces(objects);
    }

    private static SolveForces(objects: Array<IPhysicsObject>)
    {
        objects.forEach((obj) => 
        {
            let finalForce = Vector.Zero;
            let force = obj.Forces.pop();
            while(force)
            {
                finalForce = Vector.Add(finalForce, force);
                force = obj.Forces.pop();
            }

            obj.X += finalForce.X * Time.FixedDeltaTime * Time.FixedDeltaTime;
            obj.Y += finalForce.Y * Time.FixedDeltaTime * Time.FixedDeltaTime;
        });
    }

    private static AddForce(obj: IPhysicsObject, force: IVector)
    {
        if(obj.IsAffectedByPhysics)
        {
            obj.Forces.push(force);
        }
    }

    private static AddSpringForces(springs: Array<IPhysicsSpring>)
    {
        springs.forEach((spring) => 
        {
            const distance = Vector.Distance(spring.Source, spring.Target);
            const direction = Vector.Normalize(Vector.Subtract(spring.Source, spring.Target));

            const force: IVector =
            {
                X: direction.X * this.springConstant * (spring.IdealLength - distance),
                Y: direction.Y * this.springConstant * (spring.IdealLength - distance)
            }

            this.AddForce(spring.Source, force);
            this.AddForce(spring.Target, Vector.Negate(force));
        });
    }

    private static AddGravityForces(objects: Array<IPhysicsObject>, gravityPosition: IVector)
    {
        objects.forEach((obj) => 
        {
            const distanceSqr = Vector.DistanceSquared(gravityPosition, obj);
            const direction = Vector.Normalize(Vector.Subtract(gravityPosition, obj));
            const force: IVector =
            {
                X: direction.X * this.gravityConstant * distanceSqr,
                Y: direction.Y * this.gravityConstant * distanceSqr
            }
            
            this.AddForce(obj, force);
        });
    }

    private static AddRepulsiveForces(objects: Array<IPhysicsObject>)
    {
        objects.forEach((affected) =>
        {
            objects.filter((obj) => affected !== obj).forEach((other) =>
            {
                const distance = Vector.Distance(affected, other);
                const direction = Vector.Normalize(Vector.Subtract(affected, other));
                const force: IVector = 
                {
                    X: direction.X * this.repulsiveConstatnt / distance,
                    Y: direction.Y * this.repulsiveConstatnt / distance
                }

                this.AddForce(affected, force);
            });
        });
    }
}