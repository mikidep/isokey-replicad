import { replicadLib, parType } from "./prelude"
import { alignBack, alignFront, alignTop } from "./utils"

const SHEET_TH = 0.318;
const HOLE_DEPTH_SHEET = 1.5 * SHEET_TH;
const HOLE_DEPTH = 1.8;
const HOLE_H = 7.3;
const HOLE_H2 = 8.7;
const HOLE_W = 3;
const HOLDER_Z = 5.5;
const HOLE_W2 = 1.4;
const SHELL_TH = 0.8;

export default (rc: replicadLib, { }: parType) => {
  let {
    makeBaseBox,
    draw,
    drawRectangle
  } = rc;

  let hole = alignBack(makeBaseBox(HOLE_W2, HOLE_DEPTH, HOLE_H))
    .fuse(alignBack(
      makeBaseBox(HOLE_W, HOLE_DEPTH_SHEET, HOLE_H)
    ))
    .fuse(alignBack(
      makeBaseBox(HOLE_W, HOLE_DEPTH, HOLE_H2 - HOLE_H)
    ))
    ;
  let wedge = draw()
    .lineTo([-SHELL_TH, 0])
    .lineTo([0, -2])
    .close()
    .sketchOnPlane("YZ")
    .extrude(HOLE_W2)
    .translateX(-HOLE_W2 / 2)
    .translateY(-HOLE_DEPTH)
    .asShape3D()
    ;

  hole = alignTop(hole)
    .fuse(alignFront(
      makeBaseBox(1, 3 * SHELL_TH, 2.5)
        .translateZ(-HOLDER_Z)
    ))
    .fuse(wedge)
    .translateY(HOLE_DEPTH / 2)
    ;

  let posFace1 = drawRectangle(
    HOLE_W + 2 * SHELL_TH,
    HOLE_DEPTH + 2 * SHELL_TH
  );
  let posFace2 = posFace1.clone().scale(1.4);
  let pos = posFace2.sketchOnPlane("XY")
    // @ts-ignore
    .loftWith(posFace1.sketchOnPlane("XY", -HOLE_H))
    ;

  return {
    hole,
    pos
  };
}
