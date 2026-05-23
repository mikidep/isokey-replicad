import {
  Shape3D, Drawing, Point2D, SimplePoint, Vector
} from "replicad"

// yeesh
export const range = (n: number) => [...Array(n).keys()];

type Side2D = "left" | "right" | "bot" | "top";
type Side3D = Side2D | "front" | "back";

function compBdsIdx2D(side: Side2D): [number, number] {
  switch (side) {
    case "left": return [0, 0];
    case "right": return [1, 0];
    case "bot": return [0, 1];
    case "top": return [1, 1];
  }
}

function compBdsIdx3D(side: Side3D): [number, number] {
  switch (side) {
    case "left": return [0, 0];
    case "right": return [1, 0];
    case "front": return [0, 1];
    case "back": return [1, 1];
    case "bot": return [0, 2];
    case "top": return [1, 2];
  }
}

function alignOffs2D(side: Side2D, s: Drawing): Point2D {
  let [i, j] = compBdsIdx2D(side);
  let delta = s.boundingBox.bounds[i][j];
  let tr: Point2D = [0, 0];
  tr[j] = -delta;
  return tr;
}

function alignOffs3D(side: Side3D, s: Shape3D): SimplePoint {
  let [i, j] = compBdsIdx3D(side);
  let delta = s.boundingBox.bounds[i][j];
  let tr: SimplePoint = [0, 0, 0];
  tr[j] = -delta;
  return tr;
}

export function alignOffs(side: Side2D, s: Drawing): Point2D;
export function alignOffs(side: Side3D, s: Shape3D): SimplePoint;
export function alignOffs
  (side: Side2D | Side3D, s: Drawing | Shape3D):
  Point2D | SimplePoint {
  if (s instanceof Drawing) {
    return alignOffs2D(side as Side2D, s);
  } else {
    return alignOffs3D(side as Side3D, s);
  }
}

export function align(side: Side2D, s: Drawing): Drawing;
export function align(side: Side3D, s: Shape3D): Shape3D;
export function align
  (side: Side2D | Side3D, s: Drawing | Shape3D):
  Drawing | Shape3D {
  console.log(s.constructor)
  if (s instanceof Drawing) {
    return s.translate(alignOffs(side as Side2D, s));
  } else {
    return s.translate(alignOffs(side as Side3D, s));
  }
}

export const project2D = (v: Vector): Point2D => [v.x, v.y];

export function fuseAll(ss: Drawing[]): Drawing;
export function fuseAll(ss: Shape3D[]): Shape3D;
export function fuseAll(ss: Drawing[] | Shape3D[]):
  Drawing | Shape3D {
  if (ss.length == 0)
    throw "fuseAll must be called with non-empty array";
  //@ts-expect-error
  return ss.reduce((r, x) => r.fuse(x));
};

export function fusedCopies(s: Drawing, ps: Vector[]): Drawing;
export function fusedCopies(s: Shape3D, ps: Vector[]): Shape3D;
export function fusedCopies(s: Drawing | Shape3D, ps: Vector[])
  : Drawing | Shape3D {
  if (s instanceof Drawing) {
    return fuseAll(ps.map(v => s.clone().translate(project2D(v))));
  } else {
    return fuseAll(ps.map(v => s.clone().translate(v)));
  }
}
