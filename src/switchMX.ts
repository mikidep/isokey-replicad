import { Shape3D } from "replicad"
import { replicadLib, parType } from "./prelude"
import contactM from "./contactMTA"
import utilsM from "./utils"

export default (rc: replicadLib, par: parType) => {
  const {
    drawRectangle,
    drawCircle,
  } = rc;

  let { hole, pos } = contactM(rc, par);
  let { V } = utilsM(rc, par);

  const {
    plateTh,
  } = par;

  const {
    snapTh,
    snapD,
    snapW,
    switchSide
  } = par.switches.mxParams;

  const mkSwitchHole = (sketchFn = (dr: any) => dr.sketchOnPlane("XY")) => {
    let box = sketchFn(
      drawRectangle(switchSide, switchSide)
    ).extrude(-plateTh - 1)
      ;
    let snapBox = sketchFn(
      drawRectangle(switchSide + 2 * snapD, snapW)
    ).extrude(-plateTh - 1)
      .translateZ(-snapTh)
      ;
    return box.fuse(snapBox);
  };

  let c1p = V([0, 5.9]);
  let c2p = V([5, 3.8]);
  let c3p = V([-3, -5.9]);

  let place = (s: Shape3D) => s.clone().translate(c1p)
    .fuse(s.clone().translate(c2p))
    .fuse(s.clone().rotate(90, [0, 0, 0], [0, 0, 1]).translate(c3p))
    ;
  let holeDr = (d: number) => drawCircle(d / 2);

  // Looks like the holes layout for the choc v1
  let stemHole = holeDr(3.2)
    .fuse(holeDr(1.5).translate(5.5, 0))
    .fuse(holeDr(1.5).translate(-5.5, 0))
    .sketchOnPlane("XY")
    .extrude(-20)
    .asShape3D()
    ;

  let swCHoles = place(hole)
    .fuse(stemHole);
  let swCPos = place(pos);

  return {
    mkSwitchHole,
    swCHoles,
    swCPos
  };
}
