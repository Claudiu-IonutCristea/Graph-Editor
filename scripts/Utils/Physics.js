import { GraphManager } from "../Models/GraphManager.js";
import { Canvas } from "./Canvas.js";
import { Time } from "./Time.js";
import { Vector } from "./Vector.js";
export class Physics {
    static Update() {
        const objects = GraphManager.Instance.Nodes;
        const springs = GraphManager.Instance.Connections;
        const gravityPosition = {
            X: Canvas.Canvas.width / 2,
            Y: Canvas.Canvas.height / 2,
        };
        this.AddSpringForces(springs);
        this.AddGravityForces(objects, gravityPosition);
        this.AddRepulsiveForces(objects);
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
            obj.X += finalForce.X * Time.FixedDeltaTime * Time.FixedDeltaTime;
            obj.Y += finalForce.Y * Time.FixedDeltaTime * Time.FixedDeltaTime;
        });
    }
    static AddForce(obj, force) {
        if (obj.IsAffectedByPhysics) {
            obj.Forces.push(force);
        }
    }
    static AddSpringForces(springs) {
        springs.forEach((spring) => {
            const distance = Vector.Distance(spring.Source, spring.Target);
            const direction = Vector.Normalize(Vector.Subtract(spring.Source, spring.Target));
            const force = {
                X: direction.X * this.springConstant * (spring.IdealLength - distance),
                Y: direction.Y * this.springConstant * (spring.IdealLength - distance)
            };
            this.AddForce(spring.Source, force);
            this.AddForce(spring.Target, Vector.Negate(force));
        });
    }
    static AddGravityForces(objects, gravityPosition) {
        objects.forEach((obj) => {
            const distanceSqr = Vector.DistanceSquared(gravityPosition, obj);
            const direction = Vector.Normalize(Vector.Subtract(gravityPosition, obj));
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
                const distance = Vector.Distance(affected, other);
                const direction = Vector.Normalize(Vector.Subtract(affected, other));
                const force = {
                    X: direction.X * this.repulsiveConstatnt / distance,
                    Y: direction.Y * this.repulsiveConstatnt / distance
                };
                this.AddForce(affected, force);
            });
        });
    }
}
Physics.springConstant = 5e4;
Physics.gravityConstant = 1e1;
Physics.repulsiveConstatnt = 5e7;
