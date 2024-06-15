export interface IVector
{
    X: number,
    Y: number,
}

export class Vector
{
    public static get Zero()    { return {X: 0, Y: 0} }
    public static get One()     { return {X: 1, Y: 1} }

    public static get Up()      { return {X: 0, Y: -1} }
    public static get Down()    { return {X: 0, Y: 1} }
    public static get Left()    { return {X: -1, Y: 0} }
    public static get Right()   { return {X: 0, Y: 1} }

    public static Add(a: IVector, b: IVector): IVector
    {
        return {
            X: a.X + b.X,
            Y: a.Y + b.Y
        }
    }

    public static Subtract(a: IVector, b:IVector): IVector
    {
        return {
            X: a.X - b.X,
            Y: a.Y - b.Y,
        }
    }

    public static Negate(vector: IVector): IVector
    {
        return {
            X: -vector.X,
            Y: -vector.Y
        }
    }

    public static Distance(a: IVector, b: IVector): number
    {
        return Math.sqrt(this.DistanceSquared(a, b));
    }

    public static DistanceSquared(a: IVector, b:IVector): number
    {
        return (a.X - b.X) * (a.X - b.X) + (a.Y - b.Y) * (a.Y - b.Y);
    }

    public static Magnitude(v: IVector): number
    {
        return Math.sqrt(this.MagnitudeSquared(v));
    }

    public static MagnitudeSquared(v: IVector): number
    {
        return v.X * v.X + v.Y * v.Y;
    }

    public static Normalize(v: IVector): IVector
    {
        const mag = this.Magnitude(v);
        return {X: v.X / mag, Y: v.Y / mag};
    }

    public static String(vector: IVector): string
    {
        return `(${vector.X}, ${vector.Y})`;
    }
}