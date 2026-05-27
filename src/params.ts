// Partly derived from:
// https://www.grandye-switch.com/product/replace-cherry-mx-red-analog-mechanical-keyboard-switch/

const cherryParams = {
  switchSide: 14,
  snapTh: 1.4,
  snapW: 8,
  snapD: 1,
  belowPlate: 5
}

const picoParams = {
  pinL: 20, // pins on the long sides
  pinW: 8   // pins on the short side
}

export const defaultParams = {
  kkd: 21.5,
  plateTh: 2,
  switchParams: cherryParams,
  modSize: {
    rows: 4,
    cols: 6
  },
  screwD: 3,
  pegD: 3,
  insert: {
    d: 4.1,
    h: 4
  },
  contactH: 11.481,
  ucParams: picoParams,
  kbPad: 8,
  boxTh: 1.5,
  innRnd: 3.5
};
