import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from "./store";
import config from "../package.json";
import { createI18n } from 'vue-i18n';
import messages from './i18n';
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import axios from 'axios';
// import { Service } from 'axios-middleware';
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers["Authorization"] = $c.getCookie("APP_ACC_TKN");
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
const i18n = createI18n({
    locale: 'ko',
    fallbackLocale: 'en',
    messages
});
const app = createApp(App);
import '../public/css/common.css';
const $c = {
  formatDate: function(date, type) {
    date = new Date(date);
    let month = date.getMonth() + 1;
    month = month > 10 ? month : `0${month}`;
    let day = date.getDate();
    day = day > 10 ? day : `0${day}`;
    if(type == 'date') {
      return `${date.getFullYear()}-${month}-${day}`; 
    } else if (type == 'date_ko') {
      return `${date.getFullYear()}년 ${month}월 ${day}일`; 
    } else if (type == 'date_2') {
      return `${month}.${day}`; 
    }
  },
  setError(form, error) {
    for(var k in error) {
      if(Object.prototype.hasOwnProperty.call(form, k)) {
        form[k] = error[k];
      }
    }
  },
  getCookie: function (name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
  },
}
app.config.globalProperties.$store = store;
app.config.globalProperties.$c = $c;
app.config.globalProperties.$config = config;
app.config.globalProperties.$axios = axios;
console.error(`ybr version: ${config.version}`);

app.use(Quasar);
app.use(router);
app.use(store);
app.use(i18n);
app.mount('#app');


