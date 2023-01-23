const isEqual = require("lodash/isEqual");
const { findCardapioByDate } = require("../databases/querys");

async function isItNeedToNotify(a, date, next) {
  if (a != null) {
    const b = await findCardapioByDate(date, (e) => e);
    const almoco = isEqual(a.amoco, b.amoco);
    const jantar = isEqual(a.jantar, b.jantar);
    const nomeDaRefei = isEqual(a.nomeDaRefei, b.nomeDaRefei);
    // console.log(almoco);
    return next({ almoco, jantar, nomeDaRefei });
  }
}

async function isNeedToDrop(date, next) {

}

module.exports = { isItNeedToNotify, isNeedToDrop };
