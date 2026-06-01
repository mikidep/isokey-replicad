import { replicadLib, parType } from "./prelude"
import {
  Shape3D, Drawing, Point2D, SimplePoint, Vector, FaceFinder,
  Point
} from "replicad"

export default (rc: replicadLib, par: parType) => {
  let { Vector, drawRectangle, FaceFinder } = rc;

  // yeesh
  const range = (n: number) => [...Array(n).keys()];

  const V = (v: Point) => new Vector(v)

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

  /// The offset to apply to csh to align its cside with psh's pside.
  function alignWithOffs2D(
    pside: Side2D,
    cside: Side2D,
    psh: Drawing,
    csh: Drawing): Point2D {
    let poff = alignOffs2D(pside, psh);
    let coff = alignOffs2D(cside, csh);
    return project2D(V(coff).sub(V(poff)));
  }

  /// The offset to apply to csh to align its cside with psh's pside.
  function alignWithOffs3D(
    pside: Side3D,
    cside: Side3D,
    psh: Shape3D,
    csh: Shape3D): SimplePoint {
    let poff = alignOffs3D(pside, psh);
    let coff = alignOffs3D(cside, csh);
    return V(coff).sub(V(poff)).toTuple();
  }

  function align2D(side: Side2D, s: Drawing): Drawing {
    return s.translate(alignOffs2D(side, s));
  }
  function align3D(side: Side3D, s: Shape3D): Shape3D {
    return s.translate(alignOffs3D(side, s));
  }

  function alignWith2D(
    pside: Side2D,
    cside: Side2D,
    psh: Drawing,
    csh: Drawing): Drawing {
    return csh.translate(alignWithOffs2D(pside, cside, psh, csh));
  }

  function alignWith3D(
    pside: Side3D,
    cside: Side3D,
    psh: Shape3D,
    csh: Shape3D): Shape3D {
    return csh.translate(alignWithOffs3D(pside, cside, psh, csh));
  }

  const project2D = (v: Vector): Point2D => [v.x, v.y];

  function fuseAll2D(ss: Drawing[]): Drawing {
    if (ss.length == 0)
      throw "fuseAll must be called with non-empty array";
    return ss.reduce((r, x) => r.fuse(x));
  }
  function fuseAll3D(ss: Shape3D[]): Shape3D {
    if (ss.length == 0)
      throw "fuseAll must be called with non-empty array";
    return ss.reduce((r, x) => r.fuse(x));
  }

  function fusedCopies2D(s: Drawing, ps: Vector[]): Drawing {
    return fuseAll2D(ps.map(v => s.clone().translate(project2D(v))));
  }
  function fusedCopies3D(s: Shape3D, ps: Vector[]): Shape3D {
    return fuseAll3D(ps.map(v => s.clone().translate(v)));
  }
  function drawRectBounds(b1: Point2D, b2: Point2D,
    r: number = 0): Drawing {
    let size = project2D(V(b2).sub(V(b1)));
    return align2D("bot", align2D("left",
      drawRectangle(size[0], size[1], r)))
      .translate(b1[0], b1[1])
      ;
  }

  function faceFinderByNormal(v: Vector): FaceFinder {
    return new FaceFinder()
      .when(({ normal }) => {
        let ndot = normal!.dot(v);
        return Math.abs(ndot - 1) < 1e-6;
      });
  }

  return {
    range,
    alignOffs2D,
    alignWithOffs2D,
    align2D,
    alignWith2D,
    alignOffs3D,
    alignWithOffs3D,
    align3D,
    alignWith3D,
    project2D,
    fuseAll2D,
    fusedCopies2D,
    fuseAll3D,
    fusedCopies3D,
    drawRectBounds,
    faceFinderByNormal,
    V
  }
}

