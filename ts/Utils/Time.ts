

export class Time
{
    private static deltaTime: number;
    private static oldTime: number;

    public static get DeltaTime() { return this.deltaTime; }
    public static get FixedDeltaTime() { return 0.002; }
    public static get FPS() { return Math.round(1/this.deltaTime); }

    public static Start(currentTime: number)
    {
        this.oldTime = currentTime;
    }

    public static Update(currentTime: number)
    {
        this.deltaTime = (currentTime - this.oldTime) / 1000;
        this.oldTime = currentTime;
    }
}