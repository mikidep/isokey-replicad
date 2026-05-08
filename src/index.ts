import { replicadLib, parType } from "./prelude"
import { defaultParams } from "./params";

import contactM from "./contact"
import layoutM from "./layout"

function main(rc: replicadLib, par: parType) {
  let contact = contactM(rc, par);
  let layout = layoutM(rc, par);
  return layout;
};

export { main, defaultParams }
