// Include this script (after api.js) at the top of every admin page except
// login.html. Redirects to login if there's no token, and exposes the
// current admin's profile for the page to use.
(function guard() {
  const token = IkoctAPI.getToken();
  if (!token) {
    location.href = 'login.html';
  }
})();
