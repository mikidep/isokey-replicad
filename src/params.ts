// Partly derived from:
// https://www.grandye-switch.com/product/replace-cherry-mx-red-analog-mechanical-keyboard-switch/

const mxParams = {
  switchSide: 14,
  snapTh: 1.4,
  snapW: 8,
  snapD: 1,
  belowPlate: 5,
  overPlate: 6
}

const chocV1Params = {
  switchSide: 14,
  snapTh: 1.2,
  snapW: 14,
  snapD: 1,
  belowPlate: 2.2,
  overPlate: 5
}

const picoParams = {
  pinL: 20, // pins on the long sides
  pinW: 8,  // pins on the short side
  usbHole: { w: 10, h: 4 },
  pcbTh: 1
}

const contactMTA100 = {
  sheetTh: 0.318,
  shellTh: 0.8,
  holeDepth: 1.8,
  holeW: 3,
  holeW2: 1.4,
  holeH: 7.3,
  holeH2: 8.7,
  holderZ: 5.5,
  contactH: 11.481
}

export const defaultParams = {
  kkd: 21.5,
  plateTh: 2,
  switches: { mxParams, chocV1Params },
  switchParams: chocV1Params,
  modSize: {
    rows: 4,
    cols: 6
  },
  screwD: 3.2,
  screwCS: 1.2,
  pegD: 3,
  insert: {
    d: 4.4,
    h: 4
  },
  contact: contactMTA100,
  ucParams: picoParams,
  kbPad: 8,
  boxTh: 1.5,
  innRnd: 3.5,
  jackD: 6.2
};
