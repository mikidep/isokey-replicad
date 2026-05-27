import { replicadLib, parType } from "./prelude"
import utilsM from "./utils"

import modCommonM from "./modCommon"
import { ModExport } from "./modCommon"

export default (rc: replicadLib, par: parType): ModExport => {
  let { fusedCopies3D, align2D, project2D } = utilsM(rc, par);
  let { Vector, drawRectangle } = rc;
  let { plateTh } = par;
  let { pinL, pinW } = par.ucParams;
  let {
    plateScrewPos,
    plateScrewNeg,
    boardScrewPos,
    boardScrewNeg,
  } = modCommonM(rc, par);

  let screws = [
    new Vector([-10, 0]),
    new Vector([-40, 0]),
  ];
  let plateShPos = fusedCopies3D(plateScrewPos, screws);
  let plateShNeg = fusedCopies3D(plateScrewNeg, screws);
  let boardShPos = fusedCopies3D(boardScrewPos, screws);
  let boardShNeg = fusedCopies3D(boardScrewNeg, screws);

  let headerCutout = align2D("right",
    drawRectangle(
      2.54 * pinL + 1,
      2.54 + 0.5
    ));
  // cutting from drawing is broken
  let plateDrawing = align2D("right",
    drawRectangle(
      2.54 * pinL + 10,
      2.54 * pinW + 10
    ))
    .cut(headerCutout.clone().translate(-2,
      2.54 * (pinW - 1) / 2
    ))
    .cut(headerCutout.clone().translate(-2,
      -2.54 * (pinW - 1) / 2
    ))
    ;

  let plateBase = plateDrawing
    .sketchOnPlane("XY").extrude(-plateTh)
    .asShape3D()
    ;
  let plateModule = () => plateBase.asShape3D()
    .fuse(plateShPos)
    .cut(plateShNeg);
  let boardModule = () => plateBase.asShape3D()
    .fuse(boardShPos)
    .cut(boardShNeg);

  return {
    boardModule, plateModule, plateDrawing,
    screws: screws.map(project2D)
  }
};
