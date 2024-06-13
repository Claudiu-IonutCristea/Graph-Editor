export class Vector {
    static get Zero() { return { X: 0, Y: 0 }; }
    static get One() { return { X: 1, Y: 1 }; }
    static get Up() { return { X: 0, Y: -1 }; }
    static get Down() { return { X: 0, Y: 1 }; }
    static get Left() { return { X: -1, Y: 0 }; }
    static get Right() { return { X: 0, Y: 1 }; }
    static Add(a, b) {
        return {
            X: a.X + b.X,
            Y: a.Y + b.Y
        };
    }
    static Distance(a, b) {
        return Math.sqrt(this.DistanceSquared(a, b));
    }
    static DistanceSquared(a, b) {
        return (a.X - b.X) * (a.X - b.X) + (a.Y - b.Y) * (a.Y - b.Y);
    }
    static Magnitude(v) {
        return Math.sqrt(this.MagnitudeSquared(v));
    }
    static MagnitudeSquared(v) {
        return v.X * v.X + v.Y * v.Y;
    }
    static Normalize(v) {
        const mag = this.Magnitude(v);
        return { X: v.X / mag, Y: v.Y / mag };
    }
    static String(vector) {
        return `(${vector.X}, ${vector.Y})`;
    }
}
