import LoginPresenter from "../presenters/login-presenter.js";
import { createElement } from "../utils/dom.js";

export default class LoginView {
  constructor() {
    this.presenter = new LoginPresenter(this);
  }

  async init() {
    const content = createElement("div", { class: "auth-container" });
    content.innerHTML = `
      <h2>Login</h2>
      <form id="login-form" role="form" aria-labelledby="login-title">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required aria-required="true" placeholder="Masukkan email Anda">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required aria-required="true" placeholder="Masukkan kata sandi Anda">
        </div>
        <button type="submit" aria-label="Masuk ke akun">Login</button>
      </form>
      <p>Belum punya akun? <a href="#/register" aria-label="Daftar akun baru">Register di sini</a></p>
      <div id="error-message" role="alert" style="color: red; display: none;"></div>
    `;
    document.getElementById("content").innerHTML = "";
    document.getElementById("content").appendChild(content);

    document
      .getElementById("login-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
          this.showMessage("Email dan password tidak boleh kosong.");
          return;
        }

        try {
          await this.presenter.login({ email, password });
        } catch (error) {
          this.showMessage(error.message);
        }
      });
  }

  showMessage(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";

    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 5000); // Sembunyikan pesan setelah 5 detik
  }
}
