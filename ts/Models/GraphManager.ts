import { IGraph, MyMath } from "../Utils/MyMath.js";
import { GraphNode } from "./GraphNode.js";
import { Canvas } from "../Utils/Canvas.js";
import { GraphConnection } from "./GraphConnection.js";
import { Time } from "../Utils/Time.js";
import { Physics } from "../Utils/Physics.js";
import { IVector, Vector } from "../Utils/Vector.js";

export class GraphManager
{
    private static instance: GraphManager;

    private nodes = new Array<GraphNode>();
    private connections = new Array<GraphConnection>();
    private nodeRadius = 0;
    private directedGraph = false;

    private isMouseMoving = false;
    private selectedNode: GraphNode | undefined;
    private mouseOffsetFromNodePos: IVector = {X:0, Y:0}

    private constructor()
    { 
        Canvas.Canvas.addEventListener("mousedown", (ev) => this.OnCanvasMouseDown(ev));
        Canvas.Canvas.addEventListener("mouseup", (ev) => this.OnCanvasMouseUp(ev));
        Canvas.Canvas.addEventListener("mousemove", (ev) => this.OnCanvasMouseMove(ev));
        Canvas.Canvas.addEventListener("mouseleave", (ev) => this.OnCanvasMouseLeave(ev));
    }

    public static get Instance(): GraphManager
    {
        if(!this.instance)
        {
            this.instance = new GraphManager();
        }

        return this.instance;
    }

    public get NodeRadius() { return this.nodeRadius; }
    public set NodeRadius(value: number)
    {
        this.nodeRadius = value;
        this.nodes.forEach((node) => node.Radius = value);
    }

    public get DirectedGraph() { return this.directedGraph; }
    public set DirectedGraph(value: boolean)
    {
        this.directedGraph = value;
        this.connections.forEach((conn) => conn.Directed = value);
    }

    public get Nodes() { return this.nodes; }
    public get Connections() { return this.connections; }

    public SaveGraph()
    {
        const graph: IGraph =
        {
            nodes: this.nodes,
            connections: this.connections
        };

        localStorage.setItem("debugGraph", JSON.stringify(graph));

        console.log("Saved graph to local storage");
        console.debug(graph);
    }

    //#region Node CRUD
    public CreateNode(vector: IVector, value: string): GraphNode
    {
        const node = new GraphNode(vector, value);
        node.Radius = this.nodeRadius;
        this.nodes.push(node);
        
        console.log("Created node!");
        console.debug(node);
        
        return node;
    }

    public RemoveNode(node: GraphNode)
    {
        const index = this.nodes.indexOf(node);
        if(index > -1)
        {
            this.nodes.splice(index, 1);
        }

        console.log("Removed node!");
        console.debug(node);
    }

    public GetNodeAt(position: IVector): GraphNode | undefined
    {
        return this.nodes.find(node => MyMath.IsPointInsideCircle(position, node));
    }
    //#endregion
    //#region Connection CRUD
    public AddConnection(nodeA: GraphNode, nodeB: GraphNode): GraphConnection
    {
        const connection = new GraphConnection(nodeA, nodeB);
        this.connections.push(connection);

        console.log("Created connection!");
        console.debug(connection);
        return connection;
    }

    public RemoveConnection(connection: GraphConnection)
    {
        const index = this.connections.indexOf(connection);
        if(index > -1)
        {
            this.connections.splice(index, 1);
        }

        console.log("Removed connection!");
        console.debug(connection);
    }

    public GetConnection(a: GraphNode, b: GraphNode): GraphConnection | undefined
    {
        return this.connections.find((conn) => 
            (conn.Source === a && conn.Target === b) ||
            (conn.Source === b && conn.Target === a)
        );
    }
    //#endregion

    public Draw()
    {
        this.connections.forEach((conn) =>
        {
            conn.Draw();
        });

        this.nodes.forEach((node) => 
        {
            node.Draw();
        });
    }

    //#region Mouse Events
    private OnCanvasMouseDown(event: MouseEvent)
    {
        event.preventDefault();
        const mousePos = Canvas.GetMousePosition(event);
        this.selectedNode = this.GetNodeAt(mousePos);

        if(!this.selectedNode) return; //not clicked on node
        
        this.mouseOffsetFromNodePos = 
        { 
            X: this.selectedNode.X - mousePos.X,
            Y: this.selectedNode.Y - mousePos.Y
        };

        this.selectedNode.IsAffectedByPhysics = false;
        console.log(`Clicked on node at ${Vector.String(this.selectedNode)}`);
    }

    private OnCanvasMouseUp(event: MouseEvent)
    {
        event.preventDefault();
        if(!this.selectedNode) return; //there is no node selected

        if(this.isMouseMoving) 
        {
            //mouse stopped dragging a node
            console.log(`Dropped node at ${Vector.String(this.selectedNode)}`);
        }
        else
        {
            //a node has been clicked (but NOT moved)
            this.selectedNode.Fixed = !this.selectedNode.Fixed;
        }

        this.selectedNode.IsAffectedByPhysics = true;
        this.isMouseMoving = false;
        this.selectedNode = undefined;
    }

    private OnCanvasMouseMove(event: MouseEvent)
    {
        event.preventDefault();
        if(!this.selectedNode) return; //there is no node selected
        const mousePos = Canvas.GetMousePosition(event);

        this.selectedNode.X = mousePos.X + this.mouseOffsetFromNodePos.X;
        this.selectedNode.Y = mousePos.Y + this.mouseOffsetFromNodePos.Y;

        this.isMouseMoving = true;
    }

    private OnCanvasMouseLeave(event: MouseEvent)
    {
        event.preventDefault();
        this.OnCanvasMouseUp(event);
    }
    //#endregion
}