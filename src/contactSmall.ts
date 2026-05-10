import { replicadLib, parType } from "./prelude"

export default ({ drawRectangle, drawCircle }: replicadLib, { }: parType) => {
  function drawRectangleBL(w: number, h: number) {
    return drawRectangle(w, h)
      .translate(w / 2, h / 2);
  }
  function contact() {
    let rectThin = drawRectangleBL(3, 0.4);
    let rtkw = 1.5;
    let rtkh = 1;
    let rectThick = drawRectangleBL(rtkw, rtkh);
    return rectThin.fuse(rectThick).translate(-rtkw / 2, -rtkh / 2);
  }
  function hole(d: number) {
    return drawCircle(d / 2);
  }

  let cutout = contact().translate(0, 5.9)
    .fuse(contact().translate(5, 3.8))
    .fuse(contact().translate(-3, -5.9))
    .fuse(hole(1.5).translate(-5.5, 0))
    .fuse(hole(1.5).translate(5.5, 0))
    .fuse(hole(3.2))
    ;
  return drawRectangle(20, 20)
    .sketchOnPlane("XY")
    .extrude(2)
    // @ts-ignore
    .cut(
      cutout
        .sketchOnPlane("XY")
        .extrude(3)
    )
    ;
}
