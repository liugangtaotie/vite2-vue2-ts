export default [
  // 首页
  {
    path: "/",
    redirect: "/home",
  },
  // 首页
  {
    path: "/home",
    meta: {
      requiresAuth: true,
      keepAlive: false,
      title: "home",
    },
    component: () => import("@VIE/home/index.vue"),
  },
  // 关于
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
