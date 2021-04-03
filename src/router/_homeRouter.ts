export default [
  // router redirect
  {
    path: "/",
    redirect: "/home",
  },
  // home
  {
    path: "/home",
    meta: {
      requiresAuth: true,
      keepAlive: false,
      title: "home",
    },
    component: () => import("@VIE/home/index.vue"),
  },
  // about
  {
    path: "/about",
    meta: {
      requiresAuth: true,
      keepAlive: false,
      title: "about",
    },
    component: () => import("@VIE/about/index.vue"),
  },
];
