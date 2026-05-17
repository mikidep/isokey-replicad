import { replicadLib, parType } from "./prelude"

import layoutM from "./layout"
import switchM from "./switch"
import { fusedCopies3D, fusedCopiesDrawing } from "./utils"

export default (rc: replicadLib, par: parType) => {
  let { Vector, makeCylinder } = rc;
  let { plateTh, screwD, insert, contactH, pegD } = par;
  let { belowPlate } = par.switchParams;
  let { rows, cols } = par.modSize;
  let { fromUV, mkKeyPositions, tile } = layoutM(rc, par);
  let { swCHoles, swCPos, mkSwitchHole } = switchM(rc, par);

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
  // TODO: improve
  let screws = [
    new Vector(fromUV(1.5, Math.floor((rows - 1) / 2))).add(new Vector([0, 8])),
    new Vector(fromUV(3.5, Math.floor((rows - 1) / 2))).add(new Vector([0, 8]))
  ];
  let pegs = [
    fromUV(0.5, 0),
    fromUV(cols - 1.5, 0),
    fromUV(0.5 - Math.floor((rows - 1) / 2), rows - 1),
    fromUV(cols - 1.5 - Math.floor((rows - 1) / 2), rows - 1),
  ];
  const cylBelow = (r: number, h: number) =>
    makeCylinder(r, h, [0, 0, 0], [0, 0, -1])
  let plateShPos = fusedCopies3D(
    cylBelow(insert.d / 2 + 1, belowPlate),
    screws
  ).fuse(
    fusedCopies3D(
      cylBelow(pegD / 2, belowPlate),
      pegs
    )
  );
  let plateShNeg = fusedCopies3D(
    cylBelow(insert.d / 2, belowPlate),
    screws
  );
  let boardShPos = fusedCopies3D(
    cylBelow(screwD / 2 + 1, contactH),
    screws
  ).fuse(
    fusedCopies3D(
      cylBelow(pegD / 2, contactH),
      pegs
    )
  );
  let boardShNeg = fusedCopies3D(
    cylBelow(screwD / 2, contactH),
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
