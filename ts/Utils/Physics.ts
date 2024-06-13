import { Vector, IVector } from "./Vector.js";

export interface IPhysicsObject extends IVector
{
    Mass: number,
    DragForce: IVector,
    Velocity: IVector,
    AddForce(force: IVector): void,
    UpdatePosition(): void,
}

export class Physics
{
    public static AddForce(obj: IPhysicsObject, force: IVector)
    {
        obj.AddForce(force);
    }

    public static UpdatePosition(obj: IPhysicsObject)
    {
        obj.UpdatePosition();
    }
}