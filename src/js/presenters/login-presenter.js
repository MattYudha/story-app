export default class LoginPresenter {
  constructor(view) {
    this.view = view;
    this.apiUrl = "https://story-api.dicoding.dev/v1/login";
  }

  async login({ email, password }) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Login gagal. Periksa email atau password Anda."
        );
      }

      // Simpan token ke localStorage
      const token = data.loginResult?.token;
      if (!token) {
        throw new Error("Token tidak ditemukan dalam respons API.");
      }

      localStorage.setItem("auth", JSON.stringify({ token }));

      // Perbarui UI di index.html (tampilkan Logout, sembunyikan Login)
      const loginLink = document.getElementById("login-link");
      const logoutLink = document.getElementById("logout-link");
      if (loginLink && logoutLink) {
        loginLink.style.display = "none";
        logoutLink.style.display = "block";
      }

      // Arahkan ke halaman utama
      window.location.hash = "#/home";
    } catch (error) {
      console.error("Login error:", error.message);
      throw error; // Lempar error ke view untuk ditampilkan
    }
  }
}
