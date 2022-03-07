export default [
  {
    path: '/login',
    layout: false,
    component: './Login',
  },
  {
    name: '工作台',
    icon: 'dashboard',
    path: '/dashboard',
    component: './Dashboard',
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    name: '用户管理',
    icon: 'user',
    path: '/user',
    component: './User',
  },
  {
    name: '分类管理',
    icon: 'container',
    path: '/category',
    component: './Category',
  },
  {
    name: '标签管理',
    icon: 'rocket',
    path: '/tag',
    component: './Tag',
  },
  {
    name: '博客管理',
    icon: 'book',
    path: '/blog',
    routes: [
      {
        path: '/blog/create',
        name: '写博客',
        component: './blog/Create',
      },
      {
        path: '/blog/list',
        name: '博客列表',
        component: './blog/List',
      },
    ],
  },

  {
    component: './404',
  },
];
