var jwt = require('jsonwebtoken');
const {getConnection, query} = require('../database');

const user_id = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;

const profile = async (req, res) => {
  const connection = await getConnection(req);
  const listProduct = await query(connection, productSQL.getAllProduct);
  for (const product of listProduct) {
    product.price = formatMoney(product.price);
  }
  res.render('profile', {listProduct: listProduct});
};

module.exports = {
  profile,
};
