import { replicadLib, parType } from "./prelude"
import { defaultParams } from "./params";
import keyboardModuleM from "./keyboardModule";
import picoModuleM from "./picoModule";
import { alignOffs2D, fusedCopies2D } from "./utils";
import { translateMod } from "./modCommon";

function main(rc: replicadLib, par: parType) {
  let { Vector } = rc;
  let pico = picoModuleM(rc, par);
  let keym = keyboardModuleM(rc, par);
  let picodr = pico.plateDrawing;
  let keymdr = keym.plateDrawing;
  let totKb = fusedCopies2D(
    keymdr,
    [
      new Vector([0, 0, 0]),
      new Vector(keym.offs.up),
      new Vector(keym.offs.right),
      new Vector(keym.offs.up)
        .add(new Vector(keym.offs.right))
    ]
  );
  let kboffstr =
    new Vector(alignOffs2D("top", totKb))
      .add(new Vector(alignOffs2D("right", totKb)))
      .multiply(-1);
  let picooffsb = new Vector(alignOffs2D("bot", picodr));
  let picoModOffs =
    kboffstr.add(picooffsb)
      .add(new Vector([0, 5, 0]));

  let picoModPlaced = translateMod(pico, picoModOffs);

  return [
    totKb,
    picoModPlaced.plateDrawing,
  ];
};

export {
  main,
  defaultParams
}
