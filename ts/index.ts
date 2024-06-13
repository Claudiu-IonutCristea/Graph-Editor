import { Canvas } from "./Utils/Canvas.js";
import { GraphManager } from "./Models/GraphManager.js";
import { Time } from "./Utils/Time.js";
import { IGraph } from "./Utils/MyMath.js";
import { Vector } from "./Utils/Vector.js";

const canvasQ = document.querySelector<HTMLCanvasElement>("#canvas");
const nodeRadiusQ = document.querySelector<HTMLInputElement>("#nodeRadius");
const showFpsQ = document.querySelector<HTMLInputElement>("#showFps");
const saveGraphQ = document.querySelector<HTMLButtonElement>("#saveGraph");
const ctxQ = canvasQ?.getContext("2d");

if(!canvasQ || !ctxQ) { throw new Error("Canvas or 2DContext not found!"); }
if(!nodeRadiusQ) { throw new Error("Node radius range input not found!"); }
if(!showFpsQ) { throw new Error("Show FPS checkbox input not found!")}
if(!saveGraphQ) { throw new Error("Save Graph button not found!")}

nodeRadiusQ.addEventListener("change", (e) => 
{
    console.log(`Set new node radius value at ${nodeRadiusQ.valueAsNumber}`);
    GraphManager.Instance.NodeRadius = nodeRadiusQ.valueAsNumber;
});

saveGraphQ.addEventListener("click", (e) => 
{
    GraphManager.Instance.SaveGraph();
});

Canvas.Canvas = canvasQ;
Canvas.Ctx = ctxQ;

Canvas.Canvas.width = 900;
Canvas.Canvas.height = 900;

window.requestAnimationFrame((time) => 
{
   Start(time);
});

function Start(time: number)
{
    Time.Start(time);

    GraphManager.Instance.NodeRadius = nodeRadiusQ!.valueAsNumber;
    GraphManager.Instance.DirectedGraph = true;

    const a = GraphManager.Instance.CreateNode({X: 225, Y: 225}, "A");
    const b = GraphManager.Instance.CreateNode({X: 675, Y: 225}, "B");
    const c = GraphManager.Instance.CreateNode({X: 225, Y: 675}, "C");
    const d = GraphManager.Instance.CreateNode({X: 675, Y: 675}, "D");
    const e = GraphManager.Instance.CreateNode({X: 50, Y: 50}, "E");

    GraphManager.Instance.AddConnection(a, b);
    GraphManager.Instance.AddConnection(a, c);
    GraphManager.Instance.AddConnection(c, d);
    GraphManager.Instance.AddConnection(a, d);

    const graphString = undefined; //= localStorage.getItem("debugGraph");
    if(graphString)
    {
        const graph = JSON.parse(graphString);

        graph.nodes.forEach((node: any) =>
        {
            const n = GraphManager.Instance.CreateNode({X: node.x, Y: node.y}, node.value);
            n.Fixed = node.fixed;
        });

        graph.connections.forEach((conn: any) => 
        {
            const nodeA = GraphManager.Instance.GetNodeAt({X: conn.nodeA.x, Y: conn.nodeA.y});
            const nodeB = GraphManager.Instance.GetNodeAt({X: conn.nodeB.x, Y: conn.nodeB.y});

            GraphManager.Instance.AddConnection(nodeA!, nodeB!);
        });
    }
        
    window.requestAnimationFrame((time) =>
    {
        Update(time);
    });
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

    GraphManager.Instance.UpdateGraph();

    // Canvas.Ctx.beginPath();
    // Canvas.Ctx.arc(450, 450, 5, 0, 2 * Math.PI);
    // Canvas.Ctx.fillStyle = "red";
    // Canvas.Ctx.fill();

    window.requestAnimationFrame(Update);
}

