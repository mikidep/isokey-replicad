import { Shape3D } from "replicad"

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

