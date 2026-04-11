// Central export file for all pages with lazy loading
import { lazyLoad } from '@/components/LazyLoad';

// Auth Pages
export const LoginPage = lazyLoad(() => import('./auth/login/LoginPage'));

// Example Pages
export const ExamplePage = lazyLoad(() => import('./example/example/ExamplePage'));
export const ExampleDetailPage = lazyLoad(() => import('./example/exampleDetail/ExampleDetailPage'));
export const ExampleItemPage = lazyLoad(() => import('./example/exampleItem/ExampleItemPage'));
export const ExampleSubItemPage = lazyLoad(() => import('./example/exampleSubItem/ExampleSubItemPage'));
