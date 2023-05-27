import { Product } from "../../types/products";
import Firebase from "../../utils/firebase";
import { appState, addObserver, dispatch } from "../../store";
import DashboardStyle from "./dashboard.css"
import { navigate } from "../../store/actions";
import { setUserCredentials } from "../../store/actions";
import { Screens } from "../../types/navigation";

const formData: Omit<Product, "id"> = {
  name: "",
  price: 0,
  createdAt: "",
};

export default class Dashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    addObserver(this);
  }

  connectedCallback() {
    this.render();
  }

  validateLogin(){
    console.log('juu',appState.user);
    if(appState.user !== ''){
      console.log(formData);
      Firebase.addProduct(formData);
    } else {
      console.error("No está loggeado");
      dispatch(navigate(Screens.SIGNUP));
    }
    
  }

  logOutUser(){
    if(appState.user !== null || ''){
      dispatch(setUserCredentials(''));
      sessionStorage.clear();
      dispatch(navigate(Screens.LOGIN));
      location.reload();
    }
    
  }
  
  changeName(e: any) {
    formData.name = e?.target?.value;
  }

  changePrice(e: any) {
    formData.price = Number(e?.target?.value);
  }

  async render() {
    const welcome = this.ownerDocument.createElement("h1");
    welcome.innerText = "Bienvenido " + appState.user;
    this.shadowRoot?.appendChild(welcome);

    const logOut = this.ownerDocument.createElement("button");
    logOut.innerText = "Log Out";
    logOut.className = "ButtonLogOut"
    logOut.addEventListener("click", this.logOutUser)
    this.shadowRoot?.appendChild(logOut);

    const title = this.ownerDocument.createElement("h1");
    title.innerText = "Añade producto";
    this.shadowRoot?.appendChild(title);

    const pName = this.ownerDocument.createElement("input");
    pName.placeholder = "nombre del producto";
    pName.addEventListener("change", this.changeName);
    this.shadowRoot?.appendChild(pName);

    const pPrice = this.ownerDocument.createElement("input");
    pPrice.placeholder = "price";
    pPrice.addEventListener("change", this.changePrice);
    this.shadowRoot?.appendChild(pPrice);

    const save = this.ownerDocument.createElement("button");
    save.innerText = "New Post";
    save.className = "ButtonNewPost"
    save.addEventListener("click", this.validateLogin)
    this.shadowRoot?.appendChild(save);
    const productsList = this.ownerDocument.createElement("section");
    this.shadowRoot?.appendChild(productsList);
    
    

    Firebase.getProductsListener((products) => {
      // productsList.innerHTML = "";
      const oldOnesIds: String[] = [];
      productsList.childNodes.forEach((i) => {
        if (i instanceof HTMLElement) oldOnesIds.push(i.dataset.pid || "");
      });
      const newOnes = products.filter((prod) => !oldOnesIds.includes(prod.id));

      newOnes.forEach((p: Product) => {
        const container = this.ownerDocument.createElement("section");
        container.className = "post"
        container.setAttribute("data-pid", p.id);
        const name = this.ownerDocument.createElement("h3");
        name.className = "namePost"
        name.innerText = p.name;
        container.appendChild(name);

        const createdAt = this.ownerDocument.createElement("h3");
        createdAt.className = "createdAtPost"
        createdAt.innerText = String(new Date(Number(p.createdAt)*1000));
        container.appendChild(createdAt);

        const price = this.ownerDocument.createElement("h3");
        price.className = "pricePost"
        price.innerText = String(p.price);
        container.appendChild(price);

        

        productsList.prepend(container);

        const css = this.ownerDocument.createElement("style");
        css.innerHTML = DashboardStyle;
        this.shadowRoot?.appendChild(css);
      });

    });
  }
}

customElements.define("app-dashboard", Dashboard);

