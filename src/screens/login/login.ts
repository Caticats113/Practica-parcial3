import { dispatch } from "../../store";
import { navigate } from "../../store/actions";
import { Screens } from "../../types/navigation";
import { appState } from "../../store";
import Firebase from "../../utils/firebase";

const credentials2 = { email: "", password: "" };

export default class Login extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    console.log('AppState',appState.user);
  }

  connectedCallback() {
    this.render();
  }

  async handleLoginButton() {
    Firebase.loginUser(credentials2);
  }

  render() {
    const title = this.ownerDocument.createElement("h1");
    title.innerText = "Login";
    this.shadowRoot?.appendChild(title);

    const email = this.ownerDocument.createElement("input");
    email.placeholder = "Email";
    email.type = "email";
    email.addEventListener(
      "change",
      (e: any) => (credentials2.email = e.target.value)
    );
    this.shadowRoot?.appendChild(email);

    const password = this.ownerDocument.createElement("input");
    password.placeholder = "Password";
    password.type = "password";
    password.addEventListener(
      "change",
      (e: any) => (credentials2.password = e.target.value)
    );
    this.shadowRoot?.appendChild(password);

    const loginBtn = this.ownerDocument.createElement("button");
    loginBtn.innerText = "login";
    loginBtn.addEventListener("click", this.handleLoginButton);
    this.shadowRoot?.appendChild(loginBtn);
  }
}

customElements.define("app-login", Login);
