import { replicadLib, parType } from "./prelude"
import utilsM from "./utils"

export default (rc: replicadLib, par: parType) => {
  const {
    drawRectangle,
    makeBaseBox
  } = rc;

  let { V, align2D, alignWith2D } = utilsM(rc, par);

  const {
    holeW, holeDepth
  } = par.contact;

  let toolHoleH = 4;
  let toolWedgeH = 3;
  let toolWedgeW = 1.4;

  let holeRect = align2D("bot", drawRectangle(holeW, toolHoleH));
  let wedgeRect = alignWith2D(
    "top", "top", holeRect, drawRectangle(toolWedgeW, toolWedgeH)
  );
  let neg = holeRect
    .cut(wedgeRect)
    .sketchOnPlane("XZ")
    .extrude(holeDepth)
    .asShape3D()
    .translateY(holeDepth / 2)
    ;

  let xyMargin = 2;
  let topMargin = 10;
  let pos = makeBaseBox(
    holeW + 2 * xyMargin,
    holeDepth + 2 * xyMargin,
    toolHoleH + topMargin
  );
  let tool = pos.cut(neg);

  return {
    tool
  };
}
