import { replicadLib, parType } from "./prelude"
import { defaultParams } from "./params";
import toolM from "./contactMTA100Tool"

function main(rc: replicadLib, par: parType) {
  let { tool } = toolM(rc, par);

  return [
    tool
  ]
};

export {
  main,
  defaultParams
}
