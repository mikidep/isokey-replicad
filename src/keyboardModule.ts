import { replicadLib, parType } from "./prelude"
import { fusedCopies3D, fusedCopiesDrawing } from "./utils"

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

  let plateDrawing = fusedCopiesDrawing(tile, keyPositions);

  let stile = tile.clone().sketchOnPlane("XY").extrude(-plateTh);
  let kmcontacts = stile.clone()
    // @ts-ignore
    .fuse(swCPos)
    .cut(swCHoles);
  let kmplate = stile.clone()
    // @ts-ignore
    .cut(mkSwitchHole());
  let rcuv = (c: number, r: number) => fromUV(c - Math.floor(r / 2), r);
  let offs = new Vector([0, 8]);
  // Masochism
  let screws = [
    new Vector(rcuv(
      Math.ceil(cols / 2) + 0.5,
      Math.ceil(rows / 2) - 1)
    ).add(offs),
    new Vector(rcuv(
      Math.floor(cols / 2) - 1.5,
      Math.floor(rows / 2) - 1)
    ).add(offs)
  ];
  let pegs = [
    rcuv(0.5, 0),
    rcuv(cols - 1.5, 0),
    rcuv(0.5, rows - 1),
    rcuv(cols - 1.5, rows - 1),
  ];
  let plateShPos = fusedCopies3D(
    plateScrewPos,
    screws
  ).fuse(
    fusedCopies3D(
      platePegPos,
      pegs
    )
  );
  let plateShNeg = fusedCopies3D(
    plateScrewNeg,
    screws
  );
  let boardShPos = fusedCopies3D(
    boardScrewPos,
    screws
  ).fuse(
    fusedCopies3D(
      boardPegPos,
      pegs
    )
  );
  let boardShNeg = fusedCopies3D(
    boardScrewNeg,
    screws
  );

  let plateModule = () => fusedCopies3D(kmplate, keyPositions)
    .fuse(plateShPos)
    .cut(plateShNeg);
  let boardModule = () => fusedCopies3D(kmcontacts, keyPositions)
    .fuse(boardShPos)
    .cut(boardShNeg);

  return { boardModule, plateModule, plateDrawing, screws }
};
