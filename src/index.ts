import { replicadLib, parType } from "./prelude"
import { defaultParams } from "./params";
import keyboardModuleM from "./keyboardModule";
import picoModuleM from "./picoModule";
import utilsM from "./utils";
import { translateMod } from "./modCommon";

function main(rc: replicadLib, par: parType) {
  let {
    Vector, FaceFinder, EdgeFinder, drawRectangle,
    drawCircle
  } = rc;
  let { kbPad, boxTh, innRnd, contactH, jackD } = par;
  let { overPlate, belowPlate } = par.switchParams;
  let { usbHole, pcbTh } = par.ucParams;
  let {
    alignWithOffs2D, fusedCopies2D, align2D,
    alignWith3D,
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
  let picoModPlate = picoModPlaced.plateModule();

  let boxPeriBds = picoModPlaced.plateDrawing.fuse(kbrect)
    .boundingBox.bounds;
  let boxPeri = drawRectBounds(
    project2D(new Vector(boxPeriBds[0]).sub(new Vector([0, innRnd]))),
    project2D(new Vector(boxPeriBds[1]).add(new Vector([0, innRnd]))),
    innRnd
  )

  let innH = overPlate + belowPlate + contactH;
  let boxTop = boxPeri
    .offset(boxTh)
    .sketchOnPlane("XY")
    .extrude(-innH - boxTh)
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

  let usbHoleCut = align2D("bot",
    drawRectangle(usbHole.w, usbHole.h, 1))
    .translate(0, pcbTh)
    .sketchOnPlane("YZ")
    .extrude(4 * boxTh)
    .translateX(-boxTh)
    .translateZ(-boxTh - overPlate)
    .translate(picoModOffs)
    .asShape3D()

  let jackHoleCut =
    alignWith3D("left", "right", picoModPlate,
      alignWith3D("back", "back", boxTop,
        drawCircle(jackD / 2)
          .translate(0, pcbTh)
          .sketchOnPlane("XZ")
          .extrude(2 * boxTh)
          .translateZ(-0.5 * boxTh)
          .asShape3D()))
      .translateX(-20)
      .translateZ(-innH / 2 - boxTh)

  let topShell = totKb.punchHole(
    boxTop, new FaceFinder().inPlane("XY"),
    { origin: [0, 0] }
  ).asShape3D()
    .cut(usbHoleCut)
    .cut(jackHoleCut.clone())
    .cut(jackHoleCut.translateX(-30))
    ;

  console.log(topShell.boundingBox.width)

  return [
    topShell,
    picoModPlaced.plateModule()
      .translateZ(-boxTh - overPlate),
  ]
};

export {
  main,
  defaultParams
}
