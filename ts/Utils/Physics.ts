import { GraphConnection } from "../Models/GraphConnection.js";
import { GraphManager } from "../Models/GraphManager.js";
import { Time } from "./Time.js";
import { Vector, IVector } from "./Vector.js";

export interface IPhysicsObject extends IVector
{
    Forces: Array<IVector>,
}

export interface IPhysicsSpring
{
    SpringFrom: IPhysicsObject,
    SpringTo: IPhysicsObject,
    IdealLength: number,
}

export class Physics
{
    private static springConstant = 1;

    public static Update()
    {
        const objects = GraphManager.Instance.Nodes as Array<IPhysicsObject>;
        const springs = GraphManager.Instance.Connections as Array<IPhysicsSpring>;

        this.AddSpringForces(springs)

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

            obj.X = finalForce.X * Time.FixedDeltaTime * Time.FixedDeltaTime;
            obj.Y = finalForce.Y * Time.FixedDeltaTime * Time.FixedDeltaTime;
        });
    }

    private static AddForce(obj: IPhysicsObject, force: IVector)
    {
        obj.Forces.push(force);
    }

    private static AddSpringForces(springs: Array<IPhysicsSpring>)
    {
        springs.forEach((spring) => 
        {
            const distance = Vector.Distance(spring.SpringFrom, spring.SpringTo);
            const force: IVector =
            {
                X: -this.springConstant * (spring.IdealLength - spring.SpringFrom.X - spring.SpringTo.X),
                Y: -this.springConstant * (spring.IdealLength - spring.SpringFrom.Y - spring.SpringTo.Y),
            }

            this.AddForce(spring.SpringFrom, force);
            //this.AddForce(spring.SpringTo, {X: -force.X, Y: -force.Y});
        });
    }
}