
const User = require("../modals/user");
// ✅ Define functions
const renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

const signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome back to the wanderlust");
      res.redirect(res.locals.redirectUrl || "/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

const renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

const login = async (req, res) => {
  req.flash("success", "Welcome to wanderlust! You are logged in.");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logout now");
    res.redirect("/listings");
  });
};

// ✅ Export everything at once
module.exports = {
  renderSignupForm,
  signup,
  renderLoginForm,
  login,
  logout,
};
