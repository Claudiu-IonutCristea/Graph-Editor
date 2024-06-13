export class MyMath {
    static IsPointInsideCircle(point, circle) {
        return Math.abs(point.X - circle.X) <= circle.Radius &&
            Math.abs(point.Y - circle.Y) <= circle.Radius;
    }
    static Hysteresis(value, upperBound, lowerBound) {
        return new HysteresisObject(value, upperBound, lowerBound);
    }
    static RoundTo(value, decimalPlaces) {
        const decimalPlacesConst = Math.pow(10, decimalPlaces);
        return Math.round((value + Number.EPSILON) * decimalPlacesConst) / decimalPlacesConst;
    }
}
class HysteresisObject {
    constructor(value, upperBound, lowerBound) {
        this.value = value;
        this.upperBound = upperBound;
        this.lowerBound = lowerBound;
    }
    Over(callback) {
        if (this.value > this.upperBound) {
            callback.call(this);
        }
        return this;
    }
    Middle(callback) {
        if (this.lowerBound <= this.value && this.value <= this.upperBound) {
            callback.call(this);
        }
        return this;
    }
    Under(callback) {
        if (this.value < this.lowerBound) {
            callback.call(this);
        }
        return this;
    }
}
