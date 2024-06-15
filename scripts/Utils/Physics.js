import { GraphManager } from "../Models/GraphManager.js";
import { Time } from "./Time.js";
import { Vector } from "./Vector.js";
export class Physics {
    static Update() {
        const objects = GraphManager.Instance.Nodes;
        const springs = GraphManager.Instance.Connections;
        this.AddSpringForces(springs);
        this.SolveForces(objects);
    }
    static SolveForces(objects) {
        objects.forEach((obj) => {
            let finalForce = Vector.Zero;
            let force = obj.Forces.pop();
            while (force) {
                finalForce = Vector.Add(finalForce, force);
                force = obj.Forces.pop();
            }
            obj.X = finalForce.X * Time.FixedDeltaTime * Time.FixedDeltaTime;
            obj.Y = finalForce.Y * Time.FixedDeltaTime * Time.FixedDeltaTime;
        });
    }
    static AddForce(obj, force) {
        obj.Forces.push(force);
    }
    static AddSpringForces(springs) {
        springs.forEach((spring) => {
            const distance = Vector.Distance(spring.SpringFrom, spring.SpringTo);
            const force = {
                X: -this.springConstant * (spring.IdealLength - spring.SpringFrom.X - spring.SpringTo.X),
                Y: -this.springConstant * (spring.IdealLength - spring.SpringFrom.Y - spring.SpringTo.Y),
            };
            this.AddForce(spring.SpringFrom, force);
            //this.AddForce(spring.SpringTo, {X: -force.X, Y: -force.Y});
        });
    }
}
Physics.springConstant = 1;
