import { Vector } from "replicad"
import { replicadLib, parType } from "./prelude"
import utilsM from "./utils"

export default (rc: replicadLib, par: parType) => {
  let { V, range } = utilsM(rc, par);
  const {
    makePolygon,
    drawFaceOutline,
  } = rc;

  const forSetUV = (u: Vector, v: Vector) => {
    const fromUV = (x: number, y: number) =>
      u.multiply(x).add(v.multiply(y));
    const mkKeyPositions = (nrows: number, ncols: number) => {
      let row = range(ncols)
        .map(i => u.multiply(i));
      let res = range(nrows).flatMap(r => row.map(
        p => p.add(v.multiply(r)).sub(u.multiply(Math.floor(r / 2)))
      ));
      return res;
    };
    let tilepts = [
      xi, u.sub(xi),
      xi.sub(v), xi.multiply(-1),
      xi.sub(u), v.sub(xi)
    ];
    let tileface = makePolygon(tilepts);
    let tiledrw = drawFaceOutline(tileface);
    return {
      fromUV,
      mkKeyPositions,
      tile: tiledrw
    }
  };

  const {
    kkd,
  } = par;

  let u = V([1, 0]).multiply(kkd);
  let v = V([0.5, Math.sqrt(3) / 2]).multiply(kkd);
  let xi = V([0.5, Math.sqrt(3) / 6]).multiply(kkd);

  return forSetUV(u, v);
}
