import { MyMath } from "../Utils/MyMath.js";
import { GraphNode } from "./GraphNode.js";
import { Canvas } from "../Utils/Canvas.js";
import { GraphConnection } from "./GraphConnection.js";
import { Vector } from "../Utils/Vector.js";
export class GraphManager {
    constructor() {
        this.nodes = new Array();
        this.connections = new Array();
        this.nodeRadius = 0;
        this.directedGraph = false;
        this.isMouseMoving = false;
        this.mouseOffsetFromNodePos = { X: 0, Y: 0 };
        Canvas.Canvas.addEventListener("mousedown", (ev) => this.OnCanvasMouseDown(ev));
        Canvas.Canvas.addEventListener("mouseup", (ev) => this.OnCanvasMouseUp(ev));
        Canvas.Canvas.addEventListener("mousemove", (ev) => this.OnCanvasMouseMove(ev));
        Canvas.Canvas.addEventListener("mouseleave", (ev) => this.OnCanvasMouseLeave(ev));
    }
    static get Instance() {
        if (!this.instance) {
            this.instance = new GraphManager();
        }
        return this.instance;
    }
    get NodeRadius() { return this.nodeRadius; }
    set NodeRadius(value) {
        this.nodeRadius = value;
        this.nodes.forEach((node) => node.Radius = value);
    }
    get DirectedGraph() { return this.directedGraph; }
    set DirectedGraph(value) {
        this.directedGraph = value;
        this.connections.forEach((conn) => conn.Directed = value);
    }
    get Nodes() { return this.nodes; }
    get Connections() { return this.connections; }
    SaveGraph() {
        const graph = {
            nodes: this.nodes,
            connections: this.connections
        };
        localStorage.setItem("debugGraph", JSON.stringify(graph));
        console.log("Saved graph to local storage");
        console.debug(graph);
    }
    //#region Node CRUD
    CreateNode(vector, value) {
        const node = new GraphNode(vector, value);
        node.Radius = this.nodeRadius;
        this.nodes.push(node);
        console.log("Created node!");
        console.debug(node);
        return node;
    }
    RemoveNode(node) {
        const index = this.nodes.indexOf(node);
        if (index > -1) {
            this.nodes.splice(index, 1);
        }
        console.log("Removed node!");
        console.debug(node);
    }
    GetNodeAt(position) {
        return this.nodes.find(node => MyMath.IsPointInsideCircle(position, node));
    }
    //#endregion
    //#region Connection CRUD
    AddConnection(nodeA, nodeB) {
        const connection = new GraphConnection(nodeA, nodeB);
        this.connections.push(connection);
        console.log("Created connection!");
        console.debug(connection);
        return connection;
    }
    RemoveConnection(connection) {
        const index = this.connections.indexOf(connection);
        if (index > -1) {
            this.connections.splice(index, 1);
        }
        console.log("Removed connection!");
        console.debug(connection);
    }
    GetConnection(a, b) {
        return this.connections.find((conn) => (conn.NodeA === a && conn.NodeB === b) ||
            (conn.NodeA === b && conn.NodeB === a));
    }
    //#endregion
    Draw() {
        this.connections.forEach((conn) => {
            conn.Draw();
        });
        this.nodes.forEach((node) => {
            node.Draw();
        });
    }
    //#region Mouse Events
    OnCanvasMouseDown(event) {
        event.preventDefault();
        const mousePos = Canvas.GetMousePosition(event);
        this.selectedNode = this.GetNodeAt(mousePos);
        if (!this.selectedNode)
            return; //not clicked on node
        this.mouseOffsetFromNodePos =
            {
                X: this.selectedNode.X - mousePos.X,
                Y: this.selectedNode.Y - mousePos.Y
            };
        console.log(`Clicked on node at ${Vector.String(this.selectedNode)}`);
    }
    OnCanvasMouseUp(event) {
        event.preventDefault();
        if (!this.selectedNode)
            return; //there is no node selected
        if (this.isMouseMoving) {
            //mouse stopped dragging a node
            console.log(`Dropped node at ${Vector.String(this.selectedNode)}`);
        }
        else {
            //a node has been clicked (but NOT moved)
            this.selectedNode.Fixed = !this.selectedNode.Fixed;
        }
        this.isMouseMoving = false;
        this.selectedNode = undefined;
    }
    OnCanvasMouseMove(event) {
        event.preventDefault();
        if (!this.selectedNode)
            return; //there is no node selected
        const mousePos = Canvas.GetMousePosition(event);
        this.selectedNode.X = mousePos.X + this.mouseOffsetFromNodePos.X;
        this.selectedNode.Y = mousePos.Y + this.mouseOffsetFromNodePos.Y;
        this.isMouseMoving = true;
    }
    OnCanvasMouseLeave(event) {
        event.preventDefault();
        this.OnCanvasMouseUp(event);
    }
}
