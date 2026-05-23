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

export function alignOffs2D(side: Side2D, s: Drawing): Point2D {
  let [i, j] = compBdsIdx2D(side);
  let delta = s.boundingBox.bounds[i][j];
  let tr: Point2D = [0, 0];
  tr[j] = -delta;
  return tr;
}

export function alignOffs3D(side: Side3D, s: Shape3D): SimplePoint {
  let [i, j] = compBdsIdx3D(side);
  let delta = s.boundingBox.bounds[i][j];
  let tr: SimplePoint = [0, 0, 0];
  tr[j] = -delta;
  return tr;
}


export function align2D(side: Side2D, s: Drawing): Drawing {
  return s.translate(alignOffs2D(side, s));
}
export function align3D(side: Side3D, s: Shape3D): Shape3D {
  return s.translate(alignOffs3D(side, s));
}

export const project2D = (v: Vector): Point2D => [v.x, v.y];

export function fuseAll2D(ss: Drawing[]): Drawing {
  if (ss.length == 0)
    throw "fuseAll must be called with non-empty array";
  return ss.reduce((r, x) => r.fuse(x));
}
export function fuseAll3D(ss: Shape3D[]): Shape3D {
  if (ss.length == 0)
    throw "fuseAll must be called with non-empty array";
  return ss.reduce((r, x) => r.fuse(x));
}

export function fusedCopies2D(s: Drawing, ps: Vector[]): Drawing {
  return fuseAll2D(ps.map(v => s.clone().translate(project2D(v))));
}
export function fusedCopies3D(s: Shape3D, ps: Vector[]): Shape3D {
  return fuseAll3D(ps.map(v => s.clone().translate(v)));
}
