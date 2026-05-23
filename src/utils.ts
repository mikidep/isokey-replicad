import {
  Shape3D, Drawing, Point2D, SimplePoint, Vector
} from "replicad"

// yeesh
export const range = (n: number) => [...Array(n).keys()];

type Dim = "2D" | "3D";

type CaseDim<L extends Dim, Case2, Case3>
  = L extends "2D" ? Case2 : Case3;

type Side2D =
  "left" | "right" | "bot" | "top";

type Side3D =
  Side2D | "front" | "back";

type Side<L extends Dim> = CaseDim<L, Side2D, Side3D>;
type PointR<L extends Dim> = CaseDim<L, Point2D, SimplePoint>;
type Shp<L extends Dim> = CaseDim<L, Drawing, Shape3D>

function compBdsIdx2D(side: Side<"2D">): [number, number] {
  switch (side) {
    case "left": return [0, 0];
    case "right": return [1, 0];
    case "bot": return [0, 1];
    case "top": return [1, 1];
  }
}

function compBdsIdx3D(side: Side<"3D">): [number, number] {
  switch (side) {
    case "left": return [0, 0];
    case "right": return [1, 0];
    case "front": return [0, 1];
    case "back": return [1, 1];
    case "bot": return [0, 2];
    case "top": return [1, 2];
  }
}

export function alignOffs<L extends Dim>
  (dim: L, s: Shp<L>, side: Side<L>): PointR<L> {
  let [i, j] = [0, 0];
  if (dim == "2D") {
    //@ts-expect-error: does TS not restrict L?
    [i, j] = compBdsIdx2D(side);
  }
  else {
    [i, j] = compBdsIdx3D(side);
  }
  let delta = s.boundingBox.bounds[i][j];
  if (dim == "2D") {
    let tr: Point2D = [0, 0];
    tr[j] = -delta;
    //@ts-expect-error
    return tr;
  }
  else {
    let tr: SimplePoint = [0, 0, 0];
    tr[j] = -delta;
    //@ts-expect-error
    return tr;
  }
}

export function align<L extends Dim>
  (dim: L, s: Shp<L>, side: Side<L>): Shp<L> {
  //@ts-expect-error
  return s.translate(alignOffs(dim, s, side));
}

export const project2D = (v: Vector): Point2D => [v.x, v.y];

export function fuseAllDrawings(drws: Drawing[]): Drawing {
  if (drws.length == 0)
    throw "fuseAllDrawings must be called with non-empty array";
  return drws.reduce((r, x) => r.fuse(x));
};

export const fusedCopiesDrawing = (shape: Drawing, ps: Vector[]) =>
  fuseAllDrawings(
    ps.map(v => shape.clone().translate(project2D(v)))
  );

export function fuseAll3D(drws: Shape3D[]): Shape3D {
  if (drws.length == 0)
    throw "fuseAll3D must be called with non-empty array";
  return drws.reduce((r, x) => r.fuse(x));
};

export const fusedCopies3D = (shape: Shape3D, ps: Vector[]) =>
  fuseAll3D(
    ps.map(v => shape.clone().translate(v))
  );


