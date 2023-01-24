const { User, Cardapio, Reclama, Feedback, UsersTokens } = require("./schema");

async function postCardapio(dados, next) {
  const novoCardapio = new Cardapio({
    dia: dados.dia[0],
    data: dados.dia[1],
    amoco: {
      refeicao: "ALMOÇO",
      nomeDaRefei: dados.almoco[0],
      ingredintes: {
        amo1: dados.almoco[3],
        amo2: dados.almoco[4],
        amo3: dados.almoco[5],
        amo4: dados.almoco[6],
        amo5: dados.almoco[7],
      },
      vegetariano1: dados.almoco[2],
    },
    jantar: {
      refeicao: "JANTAR",
      nomeDaRefei: dados.jantar[0],
      ingredintes: {
        jan1: dados.jantar[3],
        jan2: dados.jantar[4],
        jan3: dados.jantar[5],
        jan4: dados.jantar[6],
        jan5: dados.jantar[7],
      },
      vegetariano2: dados.jantar[2],
    },
  });
  return next(novoCardapio);
}

//To put the cardapio into the database
async function saveCardapioIntoDatabase(novoCardapio, next) {
  const resolute = await novoCardapio.save((err, doc) => {
    if (err) {
      //updateCardapio(dados, next);
      //console.log(err);
      return err;
    }
    return doc;
  });
  // console.log("its not equal");
  return next(resolute);
}

async function todosOsReclameAqui(next) {
  const rs = await Reclama.find((e, d) => d).clone();
  return next(rs);
}

async function todosOsCardpio(next) {
  const rs = await Cardapio.find((e, d) => d).clone();
  return next(rs);
}

async function findCardapioByDate(data, next) {
  const cardapio = await Cardapio.findOne({ data: data });
  return next(cardapio);
}

async function updateCardapio(dados, next) {
  const toUpdate = {
    dia: dados.dia[0],
    data: dados.dia[1],
    amoco: {
      refeicao: "ALMOÇO",
      nomeDaRefei: dados.almoco[0],
      ingredintes: {
        amo1: dados.almoco[3],
        amo2: dados.almoco[4],
        amo3: dados.almoco[5],
        amo4: dados.almoco[6],
        amo5: dados.almoco[7],
      },
      vegetariano1: dados.almoco[2],
    },
    jantar: {
      refeicao: "JANTAR",
      nomeDaRefei: dados.jantar[0],
      ingredintes: {
        jan1: dados.jantar[3],
        jan2: dados.jantar[4],
        jan3: dados.jantar[5],
        jan4: dados.jantar[6],
        jan5: dados.jantar[7],
      },
      vegetariano2: dados.jantar[2],
    },
  };
  // console.log(toUpdate);
  await Cardapio.findOneAndUpdate(
    { data: dados.dia[1] },
    toUpdate,
    { upsert: true },
    (err, duc) => {
      if (err) {
        console.log(err);
        return false;
      }
      return true;
    }
  ).clone();
  return;
  //return next(duc);
}

async function postUsersTokens(req, next) {
  const token = req.body;
  const isOkToInsect = await UsersTokens.findOne(token);

  if (isOkToInsect == null) {
    const isToken = new UsersTokens(token);
    await isToken.save((err, duc) => {
      if (err) {
        return next(false);
      } else {
        // console.log(duc);
        return next(true);
      }
    });
  }
  return next("exiting");
}

async function getAllUsersTokens(next) {
  allTokens = [];
  const rs = await UsersTokens.find((err, d) => d).clone();
  rs.forEach((tk) => allTokens.push(tk.token));
  // console.log(allTokens);
  return next(allTokens);
}

async function crioReclamaAqui(req, res) {
  const { nome, email, curso, setor, msg } = req.body;
  const newReclamaAqui = new Reclama({
    nome: nome,
    email: email,
    curso: curso,
    setor: setor,
    msg: msg,
  });

  try {
    await newReclamaAqui.save().then((e) => {
      return res.status(200).json({ msy: "ok" });
    });
  } catch (err) {
    return res.status(404).json({ msy: "ok" });
  }
}

async function dropCollection(next) {
  // verify collection if new cardápio has ben added or not.
  // const toBeVerified = await todosOsCardpio((e) => e);
  // const isToBeDrop = toBeVerified.length;

  // console.log(isToBeDrop);

  await Cardapio.collection
    .drop()
    .then((e) => next(true))
    .catch((err) => {
      console.error(err);
      next(false);
    });

  // if (isToBeDrop > 6) {
  //   // notify all users
  // //  await novoCardapioDaSemana();
  //   // drop collection

  // } else {
  //   return next(false);
  // }
}

async function crioFeedback(req, res) {
  const { nome, email, msg } = req.body;
  const newFeedback = new Feedback({
    nome: nome,
    email: email,

    msg: msg,
  });

  try {
    await newFeedback.save().then((e) => {
      return res.status(200).json({ msy: "ok" });
    });
  } catch (err) {
    return res.status(404).json({ msy: "ok" });
  }
}

module.exports = {
  postCardapio,
  todosOsReclameAqui,
  todosOsCardpio,
  findCardapioByDate,
  crioReclamaAqui,
  crioFeedback,
  updateCardapio,
  dropCollection,
  postUsersTokens,
  getAllUsersTokens,
  saveCardapioIntoDatabase,
};
