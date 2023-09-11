export const isPushNotificationSupported = () => {
  return navigator.serviceWorker && window.PushManager
}

export const askUserPermission = async () => {
  return await Notification.requestPermission()
}
// /**
//  * shows a notification
//  */
// function sendNotification() {
//   const img = '/images/jason-leung-HM6TMmevbZQ-unsplash.jpg'
//   const text = 'Take a look at this brand new t-shirt!'
//   const title = 'New Product Available'
//   const options = {
//     body: text,
//     icon: '/images/jason-leung-HM6TMmevbZQ-unsplash.jpg',
//     vibrate: [200, 100, 200],
//     tag: 'new-product',
//     image: img,
//     badge: 'https://spyna.it/icons/android-icon-192x192.png',
//     actions: [
//       {
//         action: 'Detail',
//         title: 'View',
//         icon: 'https://via.placeholder.com/128/ff0000',
//       },
//     ],
//   }
//   navigator.serviceWorker.ready.then(function (serviceWorker) {
//     serviceWorker.showNotification(title, options)
//   })
// }

export const registerServiceWorker = () => {
  return navigator.serviceWorker.register('/sw.js')
}

export const createNotificationSubscription = async () => {
  const serviceWorker = await navigator.serviceWorker.ready

  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_ENV_VAPID_PUBLIC_KEY,
  })
}

export const getUserSubscription = () => {
  return navigator.serviceWorker.ready
    .then((serviceWorker) => {
      return serviceWorker.pushManager.getSubscription()
    })
    .then((pushSubscription) => {
      return pushSubscription
    })
}
