export default class User {
  constructor() {
    this.username = localStorage.getItem("username");
    this.userRole = localStorage.getItem("userRole");
  }

  authenticated(){
    return this.username !== null && this.userRole !== null;
  }

  login(event, username, userRole) {
    if (event) {
      event.preventDefault();
    }
    localStorage.setItem("username", username);
    localStorage.setItem("userRole", userRole);
    this.username = username;
    this.userRole = userRole;
  }

  logout(event) {
    if (event) {
      event.preventDefault();
    }
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    this.username = null;
    this.userRole = null;
  }
}
