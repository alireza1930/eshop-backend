const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked

  }).unless({
      path: [
        /*{url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
        {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
        {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
        //{url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
        `${api}/users/login`,
        `${api}/users/register`,*/
        { url: /(.*)/ }
      ]
    }
  );
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}

/*function authJwt(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;

    next();
  });
}*/

module.exports = authJwt;
