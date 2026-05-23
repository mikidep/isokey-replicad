import { Shape3D, Drawing, Point2D, Vector } from "replicad"
import { replicadLib, parType } from "./prelude"

export type ModExport = {
  boardModule: () => Shape3D,
  plateModule: () => Shape3D,
  plateDrawing: Drawing,
  screws: Point2D[]
}

export function translateMod(mod: ModExport, offs: Vector)
  : ModExport {
  return {
    boardModule: () => mod.boardModule().translate(offs),
    plateModule: () => mod.plateModule().translate(offs),
    plateDrawing: mod.plateDrawing.translate(offs.x, offs.y),
    screws: mod.screws.map(v => [v[0] + offs.x, v[1] + offs.y])
  }
}

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
