import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { i18n, swapLocale } from './locales';
import { registerComponents } from './components';

import './css/styles.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

registerComponents({ app });

app.mount('#app');

const [lang] = (navigator.language || navigator.userLanguage || 'en-us').split('-');
swapLocale({ lang });
