export class Canvas {
    static get Ctx() { return this.ctx; }
    static set Ctx(ctx) { this.ctx = ctx; }
    static get Canvas() { return this.canvas; }
    static set Canvas(canvas) { this.canvas = canvas; }
    static GetMousePosition(clickEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            X: clickEvent.clientX - rect.left,
            Y: clickEvent.clientY - rect.top
        };
    }
}
