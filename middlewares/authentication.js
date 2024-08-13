const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return res.status(400).redirect("/user/signin");
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {
      return res.status(401).redirect("/user/signup");
    }
    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
