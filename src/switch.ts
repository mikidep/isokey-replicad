import { Shape3D } from "replicad"
import { replicadLib, parType } from "./prelude"
import contactM from "./contactMTA"

export default (rc: replicadLib, par: parType) => {
  const {
    drawRectangle,
    drawCircle,
    Vector
  } = rc;

  let { hole, pos } = contactM(rc, par);

  const {
    plateTh,
  } = par;

  const {
    snapTh,
    snapD,
    snapW,
    switchSide
  } = par.switchParams;

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

  let c1p = new Vector([0, 5.9]);
  let c2p = new Vector([5, 3.8]);
  let c3p = new Vector([-3, -5.9]);

  let place = (s: Shape3D) => s.clone().translate(c1p)
    .fuse(s.clone().translate(c2p))
    .fuse(s.clone().rotate(90, [0, 0, 0], [0, 0, 1]).translate(c3p))
    ;
  let holeDr = (d: number) => drawCircle(d / 2);

  let stemHole = holeDr(3.2)
    .fuse(holeDr(1.5).translate(5.5, 0))
    .fuse(holeDr(1.5).translate(-5.5, 0))
    .sketchOnPlane("XY")
    .extrude(-20)
    ;

  let swCHoles = place(hole)
    // @ts-ignore
    .fuse(stemHole);
  let swCPos = place(pos);

  return {
    mkSwitchHole: mkSwitchHole,
    swCHoles: swCHoles,
    swCPos: swCPos
  };
}
