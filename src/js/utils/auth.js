export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

// Tambahkan fungsi login
export async function login({ email, password }) {
  try {
    const response = await fetch("https://story-api.dicoding.dev/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    // Simpan token jika login berhasil
    saveToken(data.loginResult.token);
    return data; // Kembalikan data untuk keperluan lain jika diperlukan
  } catch (error) {
    throw new Error(error.message);
  }
}
