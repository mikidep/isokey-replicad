import { replicadLib, parType } from "./prelude"
import utilsM from "./utils"
import contactBlob from "./contactMTA100Blob"

export default (rc: replicadLib, par: parType) => {
  const {
    drawRectangle,
    drawCircle,
  } = rc;

  let { V } = utilsM(rc, par);

  const {
    plateTh,
  } = par;

  let contact = rc.importSTEP(contactBlob);

  return {
    contact
  };
}
