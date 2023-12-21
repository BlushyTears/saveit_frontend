import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
  .then(function(registration) {
    console.log('Service Worker Registered!', registration);
  })
  .catch(function(error) {
    console.log('Service Worker Registration Failed!', error);
  });
}



export default app
