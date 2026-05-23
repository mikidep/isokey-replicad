import { replicadLib, parType } from "./prelude"
import { defaultParams } from "./params";
import keyboardModuleM from "./keyboardModule";
import picoModuleM from "./picoModule";
import { alignOffs, fusedCopiesDrawing } from "./utils";
import { translateMod } from "./modCommon";

function main(rc: replicadLib, par: parType) {
  let { Vector } = rc;
  let pico = picoModuleM(rc, par);
  let keym = keyboardModuleM(rc, par);
  let picodr = pico.plateDrawing;
  let keymdr = keym.plateDrawing;
  let totKb = fusedCopiesDrawing(
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
    new Vector(alignOffs("2D", totKb, "top"))
      .add(new Vector(alignOffs("2D", totKb, "right")))
      .multiply(-1);
  let picooffsb = new Vector(alignOffs("2D", picodr, "bot"));
  let picoModOffs =
    kboffstr
      .add(picooffsb)
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
