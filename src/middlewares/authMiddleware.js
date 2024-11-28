const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
    // res.status(401).json({ error: "Unauthorized" });
  }
};

export default isLoggedIn;
