const isEqual = require("lodash/isEqual");
const { findCardapioByDate, todosOsCardpio } = require("../databases/querys");

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
  const getAllCardapio = await todosOsCardpio((e)=>e);
  if(date != null ){
    const isToContainer = isEqual(date, getAllCardapio);
    return next(isToContainer);
  } 

}

module.exports = { isItNeedToNotify, isNeedToDrop };
