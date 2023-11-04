import 'dotenv/config';
export default {
  "expo": {
    "name": "ElderAppDev",
    "slug": "ElderAppDev",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID
    }
  }
}

// API_KEY: "AIzaSyDCL6Su1xuwRAgHNZIYc5XsUkQ9HNoMOhc"
// AUTH_DOMAIN: "elderapp-55680.firebaseapp.com"
// PROJECT_ID: "elderapp-55680"
// STORAGE_BUCKET: "elderapp-55680.appspot.com"
// MESSAGING_SENDER_ID: "165262409239"
// APP_ID: "1:165262409239:web:b4cb3ba64250db5266e652"
