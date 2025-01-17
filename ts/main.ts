import { Canvas } from "./Utils/Canvas";
import { GraphManager } from "./Models/GraphManager";
import { Time } from "./Utils/Time";
import { Physics } from "./Utils/Physics";

const canvasQ = document.querySelector<HTMLCanvasElement>("#canvas");
const nodeRadiusQ = document.querySelector<HTMLInputElement>("#nodeRadius");
const showFpsQ = document.querySelector<HTMLInputElement>("#showFps");
const saveGraphQ = document.querySelector<HTMLButtonElement>("#saveGraph");
const stepPhysicsQ = document.querySelector<HTMLButtonElement>("#stepPhysics");
const ctxQ = canvasQ?.getContext("2d");

if(!canvasQ || !ctxQ) { throw new Error("Canvas or 2DContext not found!"); }
if(!nodeRadiusQ) { throw new Error("Node radius range input not found!"); }
if(!showFpsQ) { throw new Error("Show FPS checkbox input not found!")}
if(!saveGraphQ) { throw new Error("Save Graph button not found!")}
if(!stepPhysicsQ) { throw new Error("Step Physics button not found!")}

nodeRadiusQ.addEventListener("change", (e) => 
{
    console.log(`Set new node radius value at ${nodeRadiusQ.valueAsNumber}`);
    GraphManager.Instance.NodeRadius = nodeRadiusQ.valueAsNumber;
});

saveGraphQ.addEventListener("click", (e) => 
{
    GraphManager.Instance.SaveGraph();
});

stepPhysicsQ.addEventListener("click", (e) =>
{
    Physics.Update();
});

Canvas.Canvas = canvasQ;
Canvas.Ctx = ctxQ;

Canvas.Canvas.width = 900;
Canvas.Canvas.height = 900;

window.requestAnimationFrame(Start);

function Start(time: number)
{
    Time.Start(time);

    GraphManager.Instance.NodeRadius = nodeRadiusQ!.valueAsNumber;
    GraphManager.Instance.DirectedGraph = false;

    const a = GraphManager.Instance.CreateNode({X: 225, Y: 225}, "A");
    const b = GraphManager.Instance.CreateNode({X: 675, Y: 225}, "B");
    const c = GraphManager.Instance.CreateNode({X: 225, Y: 675}, "C");
    const d = GraphManager.Instance.CreateNode({X: 675, Y: 675}, "D");
    const e = GraphManager.Instance.CreateNode({X: 50, Y: 50}, "E");

    GraphManager.Instance.AddConnection(a, e);
    GraphManager.Instance.AddConnection(a, c);
    GraphManager.Instance.AddConnection(c, b);
        
    //window.requestAnimationFrame(Update);
    //FixedUpdate();
}

function Update(time: number)
{
    Time.Update(time);
    Canvas.Ctx.clearRect(0, 0, Canvas.Canvas.width, Canvas.Canvas.height);
    
    if(showFpsQ?.checked)
    {
        Canvas.Ctx.beginPath();
        Canvas.Ctx.fillStyle = "white";
        Canvas.Ctx.font = "24px Courier-New";
        Canvas.Ctx.textAlign = "start";
        Canvas.Ctx.textBaseline = "top";
        Canvas.Ctx.fillText(Time.FPS.toString(), 0, 0);
    }

        
    GraphManager.Instance.Draw();
    
    // Canvas.Ctx.beginPath();
    // Canvas.Ctx.arc(450, 450, 5, 0, 2 * Math.PI);
    // Canvas.Ctx.fillStyle = "red";
    // Canvas.Ctx.fill();
    
    window.requestAnimationFrame(Update);
}

function FixedUpdate()
{
    Physics.Update();

    setTimeout(() => {
        FixedUpdate()
    }, Time.FixedDeltaTime * 1000);
}
