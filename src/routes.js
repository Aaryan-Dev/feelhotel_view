import {Login, Home} from 'pages';

export const allRoutes = [
  {
    key: 1,
    name: 'Home',
    component: Home,
    options: {headerShown: false},
  },
  {
    key: 2,
    name: 'Login',
    component: Login,
    options: {headerShown: false},
  },
];
