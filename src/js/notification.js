export async function showStoryNotification(description) {
  if ("Notification" in window && Notification.permission === "granted") {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification("Cerita Baru Ditambahkan", {
      body: description,
      icon: "/favicon.ico",
    });
  }
}

export async function subscribeUser(token) {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"
        ),
      });

      await subscribeNotifications(subscription, token);
    } catch (error) {
      console.error("Failed to subscribe user:", error);
    }
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Fungsi placeholder untuk subscribeNotifications (sesuaikan dengan API)
async function subscribeNotifications(subscription, token) {
  try {
    await fetch("https://story-api.dicoding.dev/v1/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });
  } catch (error) {
    console.error("Failed to subscribe to notifications:", error);
  }
}
