import { Shape3D, Drawing, Point2D, Vector } from "replicad"

// yeesh
export const range = (n: number) => [...Array(n).keys()];

function align(s: Shape3D, pn: 0 | 1, dim: 0 | 1 | 2): Shape3D {
  let delta = s.boundingBox.bounds[pn][dim];
  let tr = [0, 0, 0];
  tr[dim] = -delta;

  // @ts-ignore
  return s.translate(tr);
}

export const alignLeft = (s: Shape3D) => align(s, 0, 0);
export const alignRight = (s: Shape3D) => align(s, 1, 0);
export const alignFront = (s: Shape3D) => align(s, 0, 1);
export const alignBack = (s: Shape3D) => align(s, 1, 1);
export const alignBot = (s: Shape3D) => align(s, 0, 2);
export const alignTop = (s: Shape3D) => align(s, 1, 2);

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


