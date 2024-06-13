import { GraphConnection } from "../Models/GraphConnection.js";
import { GraphNode } from "../Models/GraphNode.js";
import { IVector } from "./Vector";

export interface IGraph
{
    nodes: Array<GraphNode>,
    connections: Array<GraphConnection>
}

export interface ICircle extends IVector
{
    Radius: number,
}

export class MyMath
{
    public static IsPointInsideCircle(point: IVector, circle: ICircle): boolean
    {
        return Math.abs(point.X - circle.X) <= circle.Radius &&
            Math.abs(point.Y - circle.Y) <= circle.Radius;
    }

    public static Hysteresis(value: number, upperBound: number, lowerBound: number)
    {
        return new HysteresisObject(value, upperBound, lowerBound);
    }

    public static RoundTo(value: number, decimalPlaces: number)
    {
        const decimalPlacesConst = Math.pow(10, decimalPlaces);

        return Math.round((value + Number.EPSILON) * decimalPlacesConst) / decimalPlacesConst;
    }
}

class HysteresisObject
{
    private value: number;
    private upperBound: number;
    private lowerBound: number;

    constructor(value: number, upperBound: number, lowerBound: number)
    {
        this.value = value;
        this.upperBound = upperBound;
        this.lowerBound = lowerBound;
    }

    public Over(callback: Function): HysteresisObject
    {
        if(this.value > this.upperBound)
        {
            callback.call(this);
        }

        return this;
    }

    public Middle(callback: Function): HysteresisObject
    {
        if(this.lowerBound <= this.value && this.value <= this.upperBound)
        {
            callback.call(this);
        }

        return this;
    }

    public Under(callback: Function): HysteresisObject
    {
        if(this.value < this.lowerBound)
        {
            callback.call(this);
        }

        return this;
    }
}
