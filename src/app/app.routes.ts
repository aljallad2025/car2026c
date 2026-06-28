import { Routes } from '@angular/router';
import { browsingGuard, actionGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },

  { path: 'splash', loadComponent: () => import('./features/splash/splash.page').then((m) => m.SplashPage) },
  { path: 'onboarding', loadComponent: () => import('./features/onboarding/onboarding.page').then((m) => m.OnboardingPage) },

  { path: 'auth/login', loadComponent: () => import('./features/auth/login/login.page').then((m) => m.LoginPage) },
  { path: 'auth/register', loadComponent: () => import('./features/auth/register/register.page').then((m) => m.RegisterPage) },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.page').then((m) => m.ForgotPasswordPage),
  },

  {
    path: 'tabs',
    loadComponent: () => import('./features/tabs/tabs.page').then((m) => m.TabsPage),
    canActivate: [browsingGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage) },
      { path: 'cars', loadComponent: () => import('./features/cars/car-list/car-list.page').then((m) => m.CarListPage) },
      {
        path: 'bookings',
        loadComponent: () => import('./features/my-bookings/my-bookings.page').then((m) => m.MyBookingsPage),
        canActivate: [actionGuard],
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.page').then((m) => m.ProfilePage),
        canActivate: [actionGuard],
      },
    ],
  },

  {
    path: 'cars/:id',
    loadComponent: () => import('./features/cars/car-detail/car-detail.page').then((m) => m.CarDetailPage),
    canActivate: [browsingGuard],
  },
  {
    path: 'booking/rental/:id',
    loadComponent: () => import('./features/booking/rental-booking/rental-booking.page').then((m) => m.RentalBookingPage),
    canActivate: [actionGuard],
  },
  {
    path: 'booking/purchase/:id',
    loadComponent: () => import('./features/booking/purchase-booking/purchase-booking.page').then((m) => m.PurchaseBookingPage),
    canActivate: [actionGuard],
  },
  {
    path: 'payments',
    loadComponent: () => import('./features/payments/payments.page').then((m) => m.PaymentsPage),
    canActivate: [actionGuard],
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites.page').then((m) => m.FavoritesPage),
    canActivate: [actionGuard],
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/chat.page').then((m) => m.ChatPage),
    canActivate: [actionGuard],
  },

  { path: '**', redirectTo: 'splash' },
];
