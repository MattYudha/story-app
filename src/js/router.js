import HomeView from "./views/home.js";
import AddStoryView from "./views/add-story.js";
import DetailView from "./views/detail.js";
import LoginView from "./views/login.js";
import RegisterView from "./views/register.js";
import NotFoundView from "./views/not-found.js";
import { navigateWithTransition } from "./utils/transition.js";
import { getToken, removeToken } from "./utils/auth.js";

const routes = {
  "#/home": HomeView,
  "#/add-story": AddStoryView,
  "#/detail/:id": DetailView,
  "#/login": LoginView,
  "#/register": RegisterView,
  "#/not-found": NotFoundView,
};

let currentView = null;

export function initRouter() {
  updateNavLinks();
  window.addEventListener("hashchange", () => {
    if (currentView && typeof currentView.cleanup === "function") {
      currentView.cleanup();
    }
    updateNavLinks();
    renderPage();
  });
  window.addEventListener("load", () => {
    updateNavLinks();
    renderPage();
  });

  document.getElementById("logout-link").addEventListener("click", (e) => {
    e.preventDefault();
    if (currentView && typeof currentView.cleanup === "function") {
      currentView.cleanup();
    }
    removeToken();
    updateNavLinks();
    window.location.hash = "#/login";
  });
}

function updateNavLinks() {
  const token = getToken();
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");
  if (token) {
    loginLink.style.display = "none";
    logoutLink.style.display = "inline";
  } else {
    loginLink.style.display = "inline";
    logoutLink.style.display = "none";
  }
}

function renderPage() {
  const hash = window.location.hash || "#/home";
  const route = Object.keys(routes).find((key) => {
    const regex = new RegExp(`^${key.replace(":id", "([^/]+)")}$`);
    return regex.test(hash);
  });

  if (route) {
    const ViewClass = routes[route];
    currentView = new ViewClass();

    if (route === "#/detail/:id") {
      const match = hash.match(
        new RegExp(`^${route.replace(":id", "([^/]+)")}$`)
      );
      const id = match ? match[1] : null;
      navigateWithTransition(() => currentView.init({ id }));
    } else {
      navigateWithTransition(() => currentView.init());
    }
  } else {
    currentView = new NotFoundView();
    navigateWithTransition(() => currentView.init());
  }
}
