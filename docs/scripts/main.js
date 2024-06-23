"use strict";
define("Utils/Vector", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector = void 0;
    class Vector {
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
        static Subtract(a, b) {
            return {
                X: a.X - b.X,
                Y: a.Y - b.Y,
            };
        }
        static Negate(vector) {
            return {
                X: -vector.X,
                Y: -vector.Y
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
    exports.Vector = Vector;
});
define("Utils/Canvas", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Canvas = void 0;
    class Canvas {
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
    exports.Canvas = Canvas;
});
define("Utils/Time", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Time = void 0;
    class Time {
        static get DeltaTime() { return this.deltaTime; }
        static get FixedDeltaTime() { return 0.002; }
        static get FPS() { return Math.round(1 / this.deltaTime); }
        static Start(currentTime) {
            this.oldTime = currentTime;
        }
        static Update(currentTime) {
            this.deltaTime = (currentTime - this.oldTime) / 1000;
            this.oldTime = currentTime;
        }
    }
    exports.Time = Time;
});
define("Utils/Physics", ["require", "exports", "Models/GraphManager", "Utils/Canvas", "Utils/Time", "Utils/Vector"], function (require, exports, GraphManager_1, Canvas_1, Time_1, Vector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Physics = void 0;
    class Physics {
        static Update() {
            const objects = GraphManager_1.GraphManager.Instance.Nodes;
            const springs = GraphManager_1.GraphManager.Instance.Connections;
            const gravityPosition = {
                X: Canvas_1.Canvas.Canvas.width / 2,
                Y: Canvas_1.Canvas.Canvas.height / 2,
            };
            this.AddSpringForces(springs);
            this.AddGravityForces(objects, gravityPosition);
            this.AddRepulsiveForces(objects);
            this.SolveForces(objects);
        }
        static SolveForces(objects) {
            objects.forEach((obj) => {
                let finalForce = Vector_1.Vector.Zero;
                let force = obj.Forces.pop();
                while (force) {
                    finalForce = Vector_1.Vector.Add(finalForce, force);
                    force = obj.Forces.pop();
                }
                obj.X += finalForce.X * Time_1.Time.FixedDeltaTime * Time_1.Time.FixedDeltaTime;
                obj.Y += finalForce.Y * Time_1.Time.FixedDeltaTime * Time_1.Time.FixedDeltaTime;
            });
        }
        static AddForce(obj, force) {
            if (obj.IsAffectedByPhysics) {
                obj.Forces.push(force);
            }
        }
        static AddSpringForces(springs) {
            springs.forEach((spring) => {
                const distance = Vector_1.Vector.Distance(spring.Source, spring.Target);
                const direction = Vector_1.Vector.Normalize(Vector_1.Vector.Subtract(spring.Source, spring.Target));
                const force = {
                    X: direction.X * this.springConstant * (spring.IdealLength - distance),
                    Y: direction.Y * this.springConstant * (spring.IdealLength - distance)
                };
                this.AddForce(spring.Source, force);
                this.AddForce(spring.Target, Vector_1.Vector.Negate(force));
            });
        }
        static AddGravityForces(objects, gravityPosition) {
            objects.forEach((obj) => {
                const distanceSqr = Vector_1.Vector.DistanceSquared(gravityPosition, obj);
                const direction = Vector_1.Vector.Normalize(Vector_1.Vector.Subtract(gravityPosition, obj));
                const force = {
                    X: direction.X * this.gravityConstant * distanceSqr,
                    Y: direction.Y * this.gravityConstant * distanceSqr
                };
                this.AddForce(obj, force);
            });
        }
        static AddRepulsiveForces(objects) {
            objects.forEach((affected) => {
                objects.filter((obj) => affected !== obj).forEach((other) => {
                    const distance = Vector_1.Vector.Distance(affected, other);
                    const direction = Vector_1.Vector.Normalize(Vector_1.Vector.Subtract(affected, other));
                    const force = {
                        X: direction.X * this.repulsiveConstatnt / distance,
                        Y: direction.Y * this.repulsiveConstatnt / distance
                    };
                    this.AddForce(affected, force);
                });
            });
        }
    }
    exports.Physics = Physics;
    Physics.springConstant = 5e4;
    Physics.gravityConstant = 1e1;
    Physics.repulsiveConstatnt = 5e7;
});
define("Models/GraphNode", ["require", "exports", "Utils/Canvas"], function (require, exports, Canvas_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GraphNode = void 0;
    class GraphNode {
        constructor(vector, value) {
            this.x = vector.X;
            this.y = vector.Y;
            this.value = value;
            this.radius = 0;
            this.fixed = false;
            this.forces = new Array;
            this.isAffectedByPhysics = true;
        }
        get X() { return this.x; }
        set X(value) { this.x = value; }
        get Y() { return this.y; }
        set Y(value) { this.y = value; }
        get Position() { return { X: this.x, Y: this.y }; }
        set Position(value) { this.x = value.X; this.y = value.Y; }
        get Radius() { return this.radius; }
        set Radius(value) { this.radius = value; }
        get Value() { return this.value; }
        set Value(value) { this.value = value; }
        get Fixed() { return this.fixed; }
        set Fixed(value) { this.fixed = value; }
        get IsAffectedByPhysics() { return this.isAffectedByPhysics && !this.fixed; }
        set IsAffectedByPhysics(value) { this.isAffectedByPhysics = value; }
        get Forces() { return this.forces; }
        Draw() {
            Canvas_2.Canvas.Ctx.beginPath();
            Canvas_2.Canvas.Ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            Canvas_2.Canvas.Ctx.fillStyle = "white";
            Canvas_2.Canvas.Ctx.fill();
            Canvas_2.Canvas.Ctx.lineWidth = this.radius * GraphNode.strokeFactor * (this.fixed ? GraphNode.strokeFixedNodeFactor : 1);
            Canvas_2.Canvas.Ctx.strokeStyle = "black";
            Canvas_2.Canvas.Ctx.stroke();
            Canvas_2.Canvas.Ctx.beginPath();
            Canvas_2.Canvas.Ctx.fillStyle = "black";
            Canvas_2.Canvas.Ctx.font = `${this.radius}px Courier-New`;
            Canvas_2.Canvas.Ctx.textAlign = "center";
            Canvas_2.Canvas.Ctx.textBaseline = "middle";
            Canvas_2.Canvas.Ctx.fillText(this.value, this.x, this.y);
        }
    }
    exports.GraphNode = GraphNode;
    GraphNode.strokeFixedNodeFactor = 2;
    GraphNode.strokeFactor = 0.15;
});
define("Models/GraphConnection", ["require", "exports", "Utils/Canvas", "Utils/Vector"], function (require, exports, Canvas_3, Vector_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GraphConnection = void 0;
    class GraphConnection {
        constructor(source, target) {
            this.source = source;
            this.target = target;
            this.directed = false;
            this.idealLength = 200 + this.source.Radius + this.target.Radius;
            this.weight = 0;
        }
        get Directed() { return this.directed; }
        set Directed(value) { this.directed = value; }
        get Source() { return this.source; }
        get Target() { return this.target; }
        get IdealLength() { return this.idealLength; }
        set IdealLength(value) { this.idealLength = value + this.source.Radius + this.target.Radius; }
        get Weight() { return this.weight; }
        set Weight(value) { this.weight = this.weight; }
        get Distance() { return Vector_2.Vector.Distance(this.source, this.target); }
        Draw() {
            Canvas_3.Canvas.Ctx.beginPath();
            Canvas_3.Canvas.Ctx.moveTo(this.source.X, this.source.Y);
            Canvas_3.Canvas.Ctx.lineTo(this.target.X, this.target.Y);
            Canvas_3.Canvas.Ctx.strokeStyle = "black";
            Canvas_3.Canvas.Ctx.lineWidth = 8;
            Canvas_3.Canvas.Ctx.stroke();
            if (this.directed) {
            }
        }
    }
    exports.GraphConnection = GraphConnection;
});
define("Utils/MyMath", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MyMath = void 0;
    class MyMath {
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
    exports.MyMath = MyMath;
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
});
define("Models/GraphManager", ["require", "exports", "Utils/MyMath", "Models/GraphNode", "Utils/Canvas", "Models/GraphConnection", "Utils/Vector"], function (require, exports, MyMath_1, GraphNode_1, Canvas_4, GraphConnection_1, Vector_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GraphManager = void 0;
    class GraphManager {
        constructor() {
            this.nodes = new Array();
            this.connections = new Array();
            this.nodeRadius = 0;
            this.directedGraph = false;
            this.isMouseMoving = false;
            this.mouseOffsetFromNodePos = { X: 0, Y: 0 };
            Canvas_4.Canvas.Canvas.addEventListener("mousedown", (ev) => this.OnCanvasMouseDown(ev));
            Canvas_4.Canvas.Canvas.addEventListener("mouseup", (ev) => this.OnCanvasMouseUp(ev));
            Canvas_4.Canvas.Canvas.addEventListener("mousemove", (ev) => this.OnCanvasMouseMove(ev));
            Canvas_4.Canvas.Canvas.addEventListener("mouseleave", (ev) => this.OnCanvasMouseLeave(ev));
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
        CreateNode(vector, value) {
            const node = new GraphNode_1.GraphNode(vector, value);
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
            return this.nodes.find(node => MyMath_1.MyMath.IsPointInsideCircle(position, node));
        }
        AddConnection(nodeA, nodeB) {
            const connection = new GraphConnection_1.GraphConnection(nodeA, nodeB);
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
            return this.connections.find((conn) => (conn.Source === a && conn.Target === b) ||
                (conn.Source === b && conn.Target === a));
        }
        Draw() {
            this.connections.forEach((conn) => {
                conn.Draw();
            });
            this.nodes.forEach((node) => {
                node.Draw();
            });
        }
        OnCanvasMouseDown(event) {
            event.preventDefault();
            const mousePos = Canvas_4.Canvas.GetMousePosition(event);
            this.selectedNode = this.GetNodeAt(mousePos);
            if (!this.selectedNode)
                return;
            this.mouseOffsetFromNodePos =
                {
                    X: this.selectedNode.X - mousePos.X,
                    Y: this.selectedNode.Y - mousePos.Y
                };
            this.selectedNode.IsAffectedByPhysics = false;
            console.log(`Clicked on node at ${Vector_3.Vector.String(this.selectedNode)}`);
        }
        OnCanvasMouseUp(event) {
            event.preventDefault();
            if (!this.selectedNode)
                return;
            if (this.isMouseMoving) {
                console.log(`Dropped node at ${Vector_3.Vector.String(this.selectedNode)}`);
            }
            else {
                this.selectedNode.Fixed = !this.selectedNode.Fixed;
            }
            this.selectedNode.IsAffectedByPhysics = true;
            this.isMouseMoving = false;
            this.selectedNode = undefined;
        }
        OnCanvasMouseMove(event) {
            event.preventDefault();
            if (!this.selectedNode)
                return;
            const mousePos = Canvas_4.Canvas.GetMousePosition(event);
            this.selectedNode.X = mousePos.X + this.mouseOffsetFromNodePos.X;
            this.selectedNode.Y = mousePos.Y + this.mouseOffsetFromNodePos.Y;
            this.isMouseMoving = true;
        }
        OnCanvasMouseLeave(event) {
            event.preventDefault();
            this.OnCanvasMouseUp(event);
        }
    }
    exports.GraphManager = GraphManager;
});
define("main", ["require", "exports", "Utils/Canvas", "Models/GraphManager", "Utils/Time", "Utils/Physics"], function (require, exports, Canvas_5, GraphManager_2, Time_2, Physics_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const canvasQ = document.querySelector("#canvas");
    const nodeRadiusQ = document.querySelector("#nodeRadius");
    const showFpsQ = document.querySelector("#showFps");
    const saveGraphQ = document.querySelector("#saveGraph");
    const stepPhysicsQ = document.querySelector("#stepPhysics");
    const ctxQ = canvasQ === null || canvasQ === void 0 ? void 0 : canvasQ.getContext("2d");
    if (!canvasQ || !ctxQ) {
        throw new Error("Canvas or 2DContext not found!");
    }
    if (!nodeRadiusQ) {
        throw new Error("Node radius range input not found!");
    }
    if (!showFpsQ) {
        throw new Error("Show FPS checkbox input not found!");
    }
    if (!saveGraphQ) {
        throw new Error("Save Graph button not found!");
    }
    if (!stepPhysicsQ) {
        throw new Error("Step Physics button not found!");
    }
    nodeRadiusQ.addEventListener("change", (e) => {
        console.log(`Set new node radius value at ${nodeRadiusQ.valueAsNumber}`);
        GraphManager_2.GraphManager.Instance.NodeRadius = nodeRadiusQ.valueAsNumber;
    });
    saveGraphQ.addEventListener("click", (e) => {
        GraphManager_2.GraphManager.Instance.SaveGraph();
    });
    stepPhysicsQ.addEventListener("click", (e) => {
        Physics_1.Physics.Update();
    });
    Canvas_5.Canvas.Canvas = canvasQ;
    Canvas_5.Canvas.Ctx = ctxQ;
    window.requestAnimationFrame(Start);
    function Start(time) {
        Time_2.Time.Start(time);
        GraphManager_2.GraphManager.Instance.NodeRadius = nodeRadiusQ.valueAsNumber;
        GraphManager_2.GraphManager.Instance.DirectedGraph = false;
        const a = GraphManager_2.GraphManager.Instance.CreateNode({ X: 225, Y: 225 }, "A");
        const b = GraphManager_2.GraphManager.Instance.CreateNode({ X: 675, Y: 225 }, "B");
        const c = GraphManager_2.GraphManager.Instance.CreateNode({ X: 225, Y: 675 }, "C");
        const d = GraphManager_2.GraphManager.Instance.CreateNode({ X: 675, Y: 675 }, "D");
        const e = GraphManager_2.GraphManager.Instance.CreateNode({ X: 50, Y: 50 }, "E");
        GraphManager_2.GraphManager.Instance.AddConnection(a, e);
        GraphManager_2.GraphManager.Instance.AddConnection(a, c);
        GraphManager_2.GraphManager.Instance.AddConnection(c, b);
    }
    function Update(time) {
        Time_2.Time.Update(time);
        Canvas_5.Canvas.Ctx.clearRect(0, 0, Canvas_5.Canvas.Canvas.width, Canvas_5.Canvas.Canvas.height);
        if (showFpsQ === null || showFpsQ === void 0 ? void 0 : showFpsQ.checked) {
            Canvas_5.Canvas.Ctx.beginPath();
            Canvas_5.Canvas.Ctx.fillStyle = "white";
            Canvas_5.Canvas.Ctx.font = "24px Courier-New";
            Canvas_5.Canvas.Ctx.textAlign = "start";
            Canvas_5.Canvas.Ctx.textBaseline = "top";
            Canvas_5.Canvas.Ctx.fillText(Time_2.Time.FPS.toString(), 0, 0);
        }
        GraphManager_2.GraphManager.Instance.Draw();
        window.requestAnimationFrame(Update);
    }
    function FixedUpdate() {
        Physics_1.Physics.Update();
        setTimeout(() => {
            FixedUpdate();
        }, Time_2.Time.FixedDeltaTime * 1000);
    }
});
const modeRadioGroup = document.querySelector("#modeRadioGroup");
const infoArea = document.querySelector("#infoArea");
const areas = [
    { input: modeRadioGroup.querySelector("#force"), area: infoArea.querySelector("#force") },
    { input: modeRadioGroup.querySelector("#edit"), area: infoArea.querySelector("#edit") },
    { input: modeRadioGroup.querySelector("#config"), area: infoArea.querySelector("#config") },
];
SetNewMode();
modeRadioGroup.addEventListener("change", (e) => {
    SetNewMode();
});
function SetNewMode() {
    areas.forEach((pair) => pair.area.hidden = !pair.input.checked);
}
