// src/js/utils/notification.js
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
        applicationServerKey: urlBase64ToUint8Array("YOUR_PUBLIC_VAPID_KEY"), // Ganti dengan VAPID key yang valid dari Dicoding
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
