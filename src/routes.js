import {Login, Home} from 'pages';
import {GoogleSign} from 'components/molecules';

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
  {
    key: 3,
    name: 'GoogleSign',
    component: GoogleSign,
    options: {headerShown: false},
  },
];
