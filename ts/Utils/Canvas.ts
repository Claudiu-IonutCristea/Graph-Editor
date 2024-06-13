import { IVector } from "./Vector.js";

export class Canvas
{
    private static ctx: CanvasRenderingContext2D;
    private static canvas: HTMLCanvasElement;

    public static get Ctx() { return this.ctx; }
    public static set Ctx(ctx: CanvasRenderingContext2D) { this.ctx = ctx; }

    public static get Canvas() { return this.canvas; }
    public static set Canvas(canvas: HTMLCanvasElement) { this.canvas = canvas; }

    public static GetMousePosition(clickEvent: MouseEvent): IVector
    {
        const rect = this.canvas.getBoundingClientRect();
        return {
            X: clickEvent.clientX - rect.left,
            Y: clickEvent.clientY - rect.top
        };
    }
}