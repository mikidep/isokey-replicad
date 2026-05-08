// Partly derived from:
// https://www.grandye-switch.com/product/replace-cherry-mx-red-analog-mechanical-keyboard-switch/

// /** @type {function(replicadLib, typeof defaultParams): any} */
// const main = (rc, par) => {
//   let shape = rc.sketchRectangle(20, 20)
//     .extrude(-par.plateTh)
//     ;
//   let face = new rc.FaceFinder()
//     .when(({ normal }) => {
//       let up = new rc.Vector([0, 0, 1]);
//       let ndot = normal.dot(up);
//       return Math.abs(ndot - 1) < 1e-6;
//     })
//     .find(shape, { unique: true });
//   let hole = switchHole(rc, par, dr => dr.sketchOnFace(face));
//   return shape.cut(hole);
//
// };

import { replicadLib, parType } from "./prelude"

export default (rc: replicadLib, par: parType) => {
  const {
    drawRectangle,
  } = rc;

  const {
    plateTh,
    snapTh,
    snapD,
    snapW,
    switchSide
  } = par;

  const mkSwitchHole = (sketchFn = (dr: any) => dr.sketchOnPlane("XY")) => {
    let box = sketchFn(
      drawRectangle(switchSide, switchSide)
    ).extrude(-plateTh - 1)
      ;
    let snapBox = sketchFn(
      drawRectangle(switchSide + 2 * snapD, snapW)
    ).extrude(-plateTh - 1)
      .translateZ(-snapTh)
      ;
    return box.fuse(snapBox);
  };

  return mkSwitchHole;
}
