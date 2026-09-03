// Service worker Firebase Cloud Messaging — requis pour que
// firebase.messaging().getToken() fonctionne dans le navigateur,
// et pour recevoir des notifications quand l'onglet n'est pas au premier plan.
//
// Remplace les valeurs ci-dessous par TA config Firebase — les mêmes
// valeurs que celles collées dans firebaseConfig au sein de index.html.
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAzzSSeIuoASs-rFETmG_yILVQ4ewDZ8u8",
  authDomain: "tabifly.firebaseapp.com",
  projectId: "tabifly",
  storageBucket: "tabifly.firebasestorage.app",
  messagingSenderId: "299925233483",
  appId: "1:299925233483:web:cd94631b4368d66a0dd2ce"
});

const messaging = firebase.messaging();

// Affiche une notification quand un message arrive alors que l'app
// n'est pas au premier plan (ou complètement fermée, une fois ce
// service worker bien enregistré et actif).
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Tabifly';
  const options = {
    body: payload.notification?.body || '',
    icon: './icon.svg'
  };
  self.registration.showNotification(title, options);
});
