import { replicadLib, parType } from "./prelude"
import { fusedCopies2D, fusedCopies3D, project2D } from "./utils"
import { Shape3D } from "replicad"

import layoutM from "./layout"
import switchM from "./switch"
import modCommonM from "./modCommon"

export default (rc: replicadLib, par: parType) => {
  let { Vector } = rc;
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

  let stile = tile.clone().sketchOnPlane("XY")
    .extrude(-plateTh).asShape3D();
  let kmcontacts = stile.clone()
    .fuse(swCPos)
    .cut(swCHoles);
  let kmplate = stile.clone()
    .cut(mkSwitchHole());
  let rcuv = (c: number, r: number) => fromUV(c - Math.floor(r / 2), r);
  let offsscr = new Vector([0, 8]);
  // Masochism
  let screws = [
    new Vector(rcuv(
      Math.ceil(cols / 2) + 0.5,
      Math.ceil(rows / 2) - 1)
    ).add(offsscr),
    new Vector(rcuv(
      Math.floor(cols / 2) - 1.5,
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

  let plateModule = () => fusedCopies3D(kmplate as Shape3D, keyPositions)
    .fuse(plateShPos)
    .cut(plateShNeg);
  let boardModule = () => fusedCopies3D(kmcontacts, keyPositions)
    .fuse(boardShPos)
    .cut(boardShNeg);
  let offs = {
    right: project2D(rcuv(cols, 0)),
    up: project2D(rcuv(0, rows)),
  }

  return { boardModule, plateModule, plateDrawing, screws, offs }
};
