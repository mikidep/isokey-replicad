import { Shape3D, SimplePoint } from "replicad";
import { replicadLib, parType } from "./prelude"
import { defaultParams } from "./params";

import contactM from "./contactMTA"

function main(rc: replicadLib, par: parType) {

  let { hole, pos } = contactM(rc, par);
  return pos.cut(hole);
};

export {
  main,
  defaultParams
}
