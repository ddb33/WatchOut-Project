const jwt = require("jsonwebtoken");

function verify(req, res, next) {
  const authHeader = req.headers.token; // Expects token in the 'token' header

  if (authHeader) {
    // The token may be "Bearer [JWT]", so we split it to get the raw JWT
    const token = authHeader.split(" ")[1]; 

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      // Attach the decoded user data (including ID) to the request object
      req.user = user; 
      next(); // Proceed to the next middleware or route handler
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
}

module.exports = verify;
