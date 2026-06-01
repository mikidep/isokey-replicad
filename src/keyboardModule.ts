import { replicadLib, parType } from "./prelude"
import utilsM from "./utils"

import layoutM from "./layout"
import switchM from "./switch"
import modCommonM from "./modCommon"

export default (rc: replicadLib, par: parType) => {
  let { V, fusedCopies2D, fusedCopies3D, project2D } = utilsM(rc, par);
  let { plateTh } = par;
  let { rows, cols } = par.modSize;
  let { fromUV, mkKeyPositions, tile } = layoutM(rc, par);
  let { swCHoles, swCPos, mkSwitchHole } = switchM(rc, par);
  let {
    plateScrewPos,
    plateScrewNeg,
    platePegPos,
    boardScrewPos,
    boardScrewNeg,
    boardPegPos,
  } = modCommonM(rc, par);

  let keyPositions = mkKeyPositions(rows, cols);
  let plateDrawing = fusedCopies2D(tile, keyPositions);

  let rcuv = (c: number, r: number) => fromUV(c - Math.floor(r / 2), r);
  let offsscr = V([0, 8]);
  // Masochism
  let screws = [
    V(rcuv(
      Math.round(cols / 3) - 0.5,
      Math.ceil(rows / 2) - 1)
    ).add(offsscr),
    V(rcuv(
      Math.round(cols * 2 / 3) - 0.5,
      Math.floor(rows / 2) - 1)
    ).add(offsscr)
  ];
  let pegs = [
    rcuv(0.5, 0),
    rcuv(cols - 1.5, 0),
    rcuv(0.5, rows - 1),
    rcuv(cols - 1.5, rows - 1),
  ];
  let plateShPos = fusedCopies3D(plateScrewPos, screws)
    .fuse(fusedCopies3D(platePegPos, pegs));
  let plateShNeg = fusedCopies3D(plateScrewNeg, screws);
  let boardShPos = fusedCopies3D(boardScrewPos, screws)
    .fuse(fusedCopies3D(boardPegPos, pegs)
    );
  let boardShNeg = fusedCopies3D(boardScrewNeg, screws);

  let plateExtr = plateDrawing
    .offset(-0.2, { lineJoinType: "miter" })
    .sketchOnPlane("XY")
    .extrude(-plateTh).asShape3D()
    ;
  let plateModule = () => plateExtr
    .cut(fusedCopies3D(mkSwitchHole(), keyPositions))
    .fuse(plateShPos)
    .cut(plateShNeg);
  let boardModule = () => plateExtr
    .fuse(fusedCopies3D(swCPos, keyPositions))
    .cut(fusedCopies3D(swCHoles, keyPositions))
    .fuse(boardShPos)
    .cut(boardShNeg);
  let offs = {
    right: project2D(rcuv(cols, 0)),
    up: project2D(rcuv(0, rows)),
  }

  return {
    boardModule, plateModule,
    plateDrawing, screws: screws.map(project2D), offs
  }
};
