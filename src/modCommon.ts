import { replicadLib, parType } from "./prelude"

export default (rc: replicadLib, par: parType) => {
  let { makeCylinder } = rc;
  let { screwD, contactH, pegD, insert } = par;
  let { belowPlate } = par.switchParams;

  const cylBelow = (r: number, h: number) =>
    makeCylinder(r, h, [0, 0, 0], [0, 0, -1])

  let plateScrewPos = cylBelow(insert.d / 2 + 1.25, belowPlate);
  let platePegPos = cylBelow(pegD / 2, belowPlate);
  let plateScrewNeg = cylBelow(insert.d / 2, belowPlate);
  let boardScrewPos = cylBelow(screwD / 2 + 1, contactH);
  let boardPegPos = cylBelow(pegD / 2, contactH);
  let boardScrewNeg = cylBelow(screwD / 2, contactH);

  return {
    plateScrewPos,
    plateScrewNeg,
    platePegPos,
    boardScrewPos,
    boardScrewNeg,
    boardPegPos,
  }
};
