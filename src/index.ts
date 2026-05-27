import { replicadLib, parType } from "./prelude"
import { defaultParams } from "./params";
import keyboardModuleM from "./keyboardModule";
import picoModuleM from "./picoModule";
import utilsM from "./utils";
import { translateMod } from "./modCommon";

function main(rc: replicadLib, par: parType) {
  let { Vector, EdgeFinder } = rc;
  let { kbPad, boxTh, innRnd } = par;
  let {
    alignWithOffs2D, fusedCopies2D,
    drawRectBounds, project2D, faceFinderByNormal
  } = utilsM(rc, par);
  let pico = picoModuleM(rc, par);
  let keym = keyboardModuleM(rc, par);
  let picodr = pico.plateDrawing;
  let keymdr = keym.plateDrawing;
  let totKb = fusedCopies2D(
    keymdr,
    // TODO: move to params
    [
      new Vector([0, 0, 0]),
      new Vector(keym.offs.up),
      new Vector(keym.offs.right),
      new Vector(keym.offs.up)
        .add(new Vector(keym.offs.right))
    ]
  );
  let kbbb = totKb.boundingBox;
  let kbrect = drawRectBounds(
    project2D(new Vector(kbbb.bounds[0]).sub(new Vector([kbPad, kbPad]))),
    project2D(new Vector(kbbb.bounds[1]).add(new Vector([kbPad, 0])))

  );

  let picoModOffs = new Vector(alignWithOffs2D(
    "top", "bot", totKb, picodr
  )).add(
    new Vector(alignWithOffs2D(
      "right", "right", kbrect, picodr
    ))
  ).add(new Vector([0, 0, 0]));

  let picoModPlaced = translateMod(pico, picoModOffs);

  let boxPeriBds = picoModPlaced.plateDrawing.fuse(kbrect)
    .boundingBox.bounds;
  let boxPeri = drawRectBounds(
    project2D(new Vector(boxPeriBds[0]).sub(new Vector([0, innRnd]))),
    project2D(new Vector(boxPeriBds[1]).add(new Vector([0, innRnd]))),
    innRnd
  )

  let innH = 30;
  let boxTop = boxPeri
    .offset(boxTh)
    .sketchOnPlane("XY")
    .extrude(-innH + boxTh)
    .asShape3D()
    .chamfer({
      radius: innRnd,
      filter: new EdgeFinder()
        .inPlane("XY")
    })
    .shell({
      filter: faceFinderByNormal(new Vector([0, 0, -1])),
      thickness: boxTh
    })

  return boxTop;

  // return [
  //   totKb,
  //   picoModPlaced.plateDrawing,
  //   kbrect,
  //   boxPeri
  // ];
};

export {
  main,
  defaultParams
}
