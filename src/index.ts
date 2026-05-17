import { replicadLib, parType } from "./prelude"
import { defaultParams } from "./params";
import keyboardModuleM from "./keyboardModule";

function main(rc: replicadLib, par: parType) {
  let { boardModule, plateModule } = keyboardModuleM(rc, par);
  return [boardModule()];
};

export {
  main,
  defaultParams
}
