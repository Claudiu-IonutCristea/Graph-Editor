export class Time {
    static get DeltaTime() { return this.deltaTime; }
    static get FixedDeltaTime() { return 0.005; }
    static get FPS() { return Math.round(1 / this.deltaTime); }
    static Start(currentTime) {
        this.oldTime = currentTime;
    }
    static Update(currentTime) {
        this.deltaTime = (currentTime - this.oldTime) / 1000;
        this.oldTime = currentTime;
    }
}
