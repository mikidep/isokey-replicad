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
  let { screwD, pegD, insert } = par;
  let { contactH } = par.contact;
  let { belowPlate } = par.switchParams;

  const cylBelow = (r: number, h: number) =>
    makeCylinder(r, h, [0, 0, 0], [0, 0, -1])

  const insScrewPos = (h: number) => cylBelow(insert.d / 2 + 1.25, h);
  const insScrewNeg = (h: number) => makeCylinder(insert.d / 2, insert.h, [0, 0, -h], [0, 0, 1]);
  const thrScrewPos = (h: number) => cylBelow(screwD / 2 + 1, h);
  const thrScrewNeg = (h: number) => cylBelow(screwD / 2, h);
  const pegPos = (h: number) => cylBelow(pegD / 2, h);

  let plateScrewPos = insScrewPos(belowPlate);
  let platePegPos = pegPos(belowPlate);
  let plateScrewNeg = insScrewNeg(belowPlate);
  let boardScrewPos = thrScrewPos(contactH);
  let boardPegPos = pegPos(contactH);
  let boardScrewNeg = thrScrewNeg(contactH);

  return {
    plateScrewPos,
    plateScrewNeg,
    platePegPos,
    boardScrewPos,
    boardScrewNeg,
    boardPegPos,
    insScrewPos,
    insScrewNeg,
    thrScrewPos,
    thrScrewNeg,
    pegPos
  }
};
