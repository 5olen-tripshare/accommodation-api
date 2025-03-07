require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const FUSIONAUTH_PORT = process.env.FUSIONAUTH_URI;

const client = jwksClient({
  jwksUri: `${FUSIONAUTH_PORT}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token requis" });
  }

  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }
    console.log("Utilisateur authentifié :", decoded);
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;
