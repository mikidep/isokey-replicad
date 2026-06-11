import { replicadLib, parType } from "./prelude"
import { defaultParams } from "./params";
import keybM from "./keyboardModule"

function main(rc: replicadLib, par: parType) {
  let { boardModule, plateModule } = keybM(rc, par);

  return [
    boardModule()
  ]
};

export {
  main,
  defaultParams
}
