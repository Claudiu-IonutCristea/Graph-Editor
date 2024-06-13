import { MyMath } from "../Utils/MyMath.js";
import { GraphNode } from "./GraphNode.js";
import { Canvas } from "../Utils/Canvas.js";
import { GraphConnection } from "./GraphConnection.js";
import { Physics } from "../Utils/Physics.js";
import { Vector } from "../Utils/Vector.js";
export class GraphManager {
    constructor() {
        this.nodes = new Array();
        this.connections = new Array();
        this.nodeRadius = 0;
        this.directedGraph = false;
        this.idealConnectionDistance = 200 + 100; //this.nodeRadius * 2;
        this.idealConnectionDistanceFactor = 0.2;
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
    UpdateGraph() {
        this.ApplyForces();
        this.ApplyGravity();
        this.nodes.forEach((node) => Physics.UpdatePosition(node));
        this.connections.forEach((conn) => {
            conn.Draw();
        });
        this.nodes.forEach((node) => {
            node.Draw();
        });
    }
    FixedUpdate() {
    }
    ApplyGravity() {
        const centerPos = { X: Canvas.Canvas.width / 2, Y: Canvas.Canvas.height / 2 };
        const gravityFactor = 7e1;
        this.nodes.forEach((affectedNode) => {
            if (affectedNode.Fixed || affectedNode === this.selectedNode) {
                return;
            }
            const dl = {
                X: centerPos.X - affectedNode.X,
                Y: centerPos.Y - affectedNode.Y,
            };
            const force = {
                X: gravityFactor * dl.X,
                Y: gravityFactor * dl.Y
            };
            Physics.AddForce(affectedNode, force);
        });
    }
    ApplyForces() {
        const attractionFactor = 5e2;
        const repulsionFactor = 2e8;
        this.nodes.forEach((affectedNode) => {
            if (affectedNode.Fixed || affectedNode === this.selectedNode) {
                return;
            }
            //pull away from other nodes
            this.nodes.filter((node) => node !== affectedNode).forEach((otherNode) => {
                const repulsionVector = Vector.Normalize({
                    X: affectedNode.X - otherNode.X,
                    Y: affectedNode.Y - otherNode.Y
                });
                const attractionVector = Vector.Normalize({
                    X: otherNode.X - affectedNode.X,
                    Y: otherNode.Y - affectedNode.Y
                });
                const distanceSquared = Vector.DistanceSquared(affectedNode, otherNode);
                const connection = this.GetConnection(affectedNode, otherNode);
                if (connection) {
                    const dl = this.idealConnectionDistance - connection.Distance;
                    const attractionForce = {
                        X: repulsionVector.X * attractionFactor * dl,
                        Y: repulsionVector.Y * attractionFactor * dl,
                    };
                    Physics.AddForce(affectedNode, attractionForce);
                }
                const repulsionForce = {
                    X: (repulsionVector.X * repulsionFactor) / distanceSquared,
                    Y: (repulsionVector.Y * repulsionFactor) / distanceSquared,
                };
                Physics.AddForce(affectedNode, repulsionForce);
            });
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
        this.selectedNode.ResetVelocity();
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
            Physics.AddForce(this.selectedNode, { X: 5, Y: 10 });
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
