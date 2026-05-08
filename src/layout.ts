import { Vector, Drawing, Point2D } from "replicad"
import { replicadLib, parType } from "./prelude"
import switchHoleM from "./switchHole";

export default (rc: replicadLib, par: parType) => {
  const {
    drawPolysides,
    drawRectangle,
    Vector
  } = rc;

  const {
    kkd,
    plateTh,
    snapTh,
    snapD,
    snapW,
    switchSide
  } = par;

  const mkSwitchHole = switchHoleM(rc, par);

  const project2D = (vector: Vector): Point2D => {
    let [x, y, _] = vector.toTuple();
    return [x, y];
  };


  function fuseAll(shapes: Drawing[]): Drawing {
    if (shapes.length == 0) throw "fuseAll must be called with non-empty array";
    let result = shapes[0];
    shapes.slice(1).forEach((shape: any) => {
      result = result.fuse(shape);
    });
    return result;
  };

  const fusedCopies = (shape: Drawing, ps: Vector[]) =>
    fuseAll(ps.map(v => shape.clone().translate(project2D(v))))

  let tile = drawPolysides(
    kkd / Math.sqrt(3),
    6
  );

  let u = new Vector([1, 0]).multiply(kkd);
  let v = new Vector([0.5, Math.sqrt(3) / 2])
    .multiply(kkd);
  let row = [0, 1, 2, 3, 4, 5]
    .map(i => u.multiply(i));
  let twoRows = row.concat(row.map(p => p.add(v)));
  let fourRows = twoRows.concat(
    twoRows.map(p => p.add(v).add(v).sub(u))
  );
  let plateDrawing = fusedCopies(tile, fourRows);

  let hole = mkSwitchHole();
  let holes = fuseAll(fourRows
    .map(p => hole.clone().translate(p)))
    ;


  return plateDrawing
    .sketchOnPlane("XY")
    .extrude(-plateTh)
    // @ts-ignore
    .cut(holes)
    ;
}
