import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/WorkspaceView.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

const navDirections = {
  isBack: null,
  isFoward: null,
  isBackOrForward: null,
  escapeLocation: null,
};

window.addEventListener('popstate', (e) => {
  // router.beforeEach 보다 먼저 실행
  navDirections.isBackOrForward = true;

  // router.beforeEach 실행 후 실행
  setTimeout(() => {
    console.log('popstate::', e.target.location.pathname);
    console.log(navDirections);
    navDirections.isBackOrForward = false;
  }, 0);

  if ('/workspace' === e.target.location.pathname) {
    navDirections.isBack = !navDirections.isBack;
    navDirections.isFoward = !navDirections.isFoward;
  }
});

router.beforeEach((to, from, next) => {
  if (navDirections.isBackOrForward) {
    console.log('isBackOrForward::', navDirections.isBackOrForward);
    console.log('from::', from.path, ' | ', 'to::', to.path);

    const isHome = from.path === '/workspace' && !from.hash; // workspace의 isHomeScreen 으로 대체

    const isBack = from.path === '/workspace';
    const isFoward =
      from.path === '/workspace' && to.path === '/workspace' && isHome;

    navDirections.isBack = isBack;
    navDirections.isFoward = isFoward;

    if (isBack) {
      if (!isHome && !navDirections.escapeLocation) {
        navDirections.escapeLocation = to;
        next();
        next({ path: '/workspace' });
      } else {
        navDirections.escapeLocation = null;
        next();
      }
    }
  }

  next();
});

export default router;
