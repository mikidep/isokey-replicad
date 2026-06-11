import { replicadLib, parType } from "./prelude"
import keyboardModuleM from "./keyboardModule";
import picoModuleM from "./picoModule";
import utilsM from "./utils";
import { translateMod } from "./modCommon";
import modCommonM from "./modCommon";

export default (rc: replicadLib, par: parType) => {
  let {
    FaceFinder, EdgeFinder, drawRectangle, drawCircle
  } = rc;
  let { kbPad, boxTh, innRnd, contactH,
    jackD, insert, screwD, screwCS } = par;
  let { overPlate, belowPlate } = par.switchParams;
  let { usbHole, pcbTh } = par.ucParams;
  let {
    V, alignWithOffs2D, fusedCopies2D, align2D,
    alignWith3D, fusedCopies3D,
    drawRectBounds, project2D, faceFinderByNormal
  } = utilsM(rc, par);
  let pico = picoModuleM(rc, par);
  let keym = keyboardModuleM(rc, par);
  let { insScrewPos, insScrewNeg, thrScrewNeg } = modCommonM(rc, par);

  let picodr = pico.plateDrawing;
  let keymdr = keym.plateDrawing;
  // TODO: move to params
  let keymOffs = [
    V([0, 0, 0]),
    V(keym.offs.up),
    V(keym.offs.right),
    V(keym.offs.up)
      .add(V(keym.offs.right))
  ];

  ////////////////////////////////
  //  BOX CONTENT 2D FOOTPRINT  //
  ////////////////////////////////

  let totKb = fusedCopies2D(
    keymdr,
    keymOffs
  );
  let kbbb = totKb.boundingBox;
  let kbrect = drawRectBounds(
    project2D(V(kbbb.bounds[0]).sub(V([kbPad, kbPad]))),
    project2D(V(kbbb.bounds[1]).add(V([kbPad, 0])))

  );
  let picoModOffs = V(alignWithOffs2D(
    "top", "bot", totKb, picodr
  )).add(
    V(alignWithOffs2D(
      "right", "right", kbrect, picodr
    ))
  ).add(V([0, 0, 0]));

  let picoModPlaced = translateMod(pico, picoModOffs);
  let picoModPlate = picoModPlaced.plateModule();

  let innBds = picoModPlaced.plateDrawing.fuse(kbrect)
    .boundingBox.bounds;
  let boxPeri = drawRectBounds(
    project2D(V(innBds[0]).sub(V([0, innRnd]))),
    project2D(V(innBds[1]).add(V([0, innRnd]))),
    innRnd
  );

  ///////////////
  //  BOX TOP  //
  ///////////////

  let innH = overPlate + belowPlate + contactH;
  let boxTopSolid = boxPeri
    .offset(boxTh)
    .sketchOnPlane("XY")
    .extrude(-innH - boxTh)
    .asShape3D()
    .chamfer({
      radius: innRnd,
      filter: new EdgeFinder()
        .inPlane("XY")
    });
  let boxTop = boxTopSolid.clone()
    .shell({
      filter: faceFinderByNormal(V([0, 0, -1])),
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

  let bb = boxPeri.offset(-insert.d / 2 - 1).boundingBox;
  let spc = 20;
  let boxScrews = [
    V([spc, bb.height]), V([bb.width, spc]),
    V([-spc, bb.height]), V([-bb.width, spc]),
    V([-spc, -bb.height]), V([-bb.width, -spc]),
    V([spc, -bb.height]), V([bb.width, -spc]),
  ].map(v => v.multiply(0.5).add(V(bb.center)));

  let tsScrewPos = insScrewPos(innH).translateZ(-boxTh);
  let tsScrewNeg = insScrewNeg(innH).translateZ(-boxTh);

  let topShell = totKb.punchHole(
    boxTop, new FaceFinder().inPlane("XY"),
    { origin: [0, 0] }
  ).asShape3D()
    .cut(usbHoleCut)
    .cut(jackHoleCut.clone())
    .cut(jackHoleCut.translateX(-30))
    .fuse(fusedCopies3D(tsScrewPos.cut(tsScrewNeg), boxScrews)
      .intersect(boxTopSolid))
    ;

  //////////////////
  //  BOX BOTTOM  //
  //////////////////

  let allKeyms = keymOffs.map(o => translateMod(keym, o));
  let allScrews = boxScrews
    .concat(picoModPlaced.screws.map(V))
    .concat(allKeyms.flatMap(k => k.screws).map(V));
  let botShell1 = boxPeri
    .offset(boxTh)
    .sketchOnPlane("XY")
    .extrude(-boxTh - innRnd + screwCS).asShape3D()
    .cut(fusedCopies3D(thrScrewNeg(boxTh + innRnd - screwCS), allScrews))
    ;
  let botShell2 = boxPeri
    .offset(boxTh)
    .sketchOnPlane("XY")
    .extrude(-screwCS - 0.1).asShape3D()
    .cut(fusedCopies3D(thrScrewNeg(boxTh + innRnd), allScrews))
    .chamfer({
      radius: screwCS,
      filter: new EdgeFinder()
        .inPlane("XY", -screwCS - 0.1)
    });

  return {
    topShell,
    botShell1,
    botShell2
  }
};
