function noNeedOfCookiesForSignupAndSignin(cookieName, route) {
  return (req, res, next) => {
    const isCookiePresent = req.cookies[cookieName];
    if (isCookiePresent) {
      return res
        .status(200)
        .render(`${route}`, {
          cookieIsPresent: "First log out from current account",
        });
    }
    next();
  };
}

module.exports = {
  noNeedOfCookiesForSignupAndSignin,
};
