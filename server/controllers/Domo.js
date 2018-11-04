const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred ' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};

const deleteDomo = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.deleteByName(req.session.account._id, req.body.name, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ message: 'Domo deleted successfully' });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.city) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    city: req.body.city,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.deleteDomo = deleteDomo;
