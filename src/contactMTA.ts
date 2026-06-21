import { replicadLib, parType } from "./prelude"
import utilsM from "./utils"

export default (rc: replicadLib, par: parType) => {
  let {
    makeBaseBox,
    draw,
    drawRectangle
  } = rc;
  let { align3D } = utilsM(rc, par);

  let {
    sheetTh,
    shellTh,
    holeDepth,
    holeW,
    holeW2,
    holeH,
    holeH2,
    holderZ
  } = par.contact;

  let holeDepthSheet = 1.5 * sheetTh;
  let hole = align3D("back", makeBaseBox(holeW2, holeDepth, holeH))
    .fuse(align3D("back",
      makeBaseBox(holeW, holeDepthSheet, holeH)))
    .fuse(align3D("back",
      makeBaseBox(holeW, holeDepth, holeH2 - holeH)))
    ;
  let wedge = draw()
    .lineTo([-shellTh, 0])
    .lineTo([0, -2])
    .close()
    .sketchOnPlane("YZ")
    .extrude(holeW2)
    .translateX(-holeW2 / 2)
    .translateY(-holeDepth)
    .asShape3D()
    ;

  hole = align3D("top", hole)
    .fuse(align3D("front",
      makeBaseBox(1, 3 * shellTh, 2.5).translateZ(-holderZ)))
    .fuse(wedge)
    .translateY(holeDepth / 2)
    ;

  let posFace1 = drawRectangle(
    holeW + 2 * shellTh,
    holeDepth + 2 * shellTh
  );
  let posFace2 = posFace1.clone().scale(1.4);
  let pos = posFace2.sketchOnPlane("XY")
    // @ts-ignore
    .loftWith(posFace1.sketchOnPlane("XY", -holeH))
    ;

  return {
    hole,
    pos
  };
}
