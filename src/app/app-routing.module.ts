import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { OwnerBusinessGuard } from './guards/owner-business.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/welcome/home',
    // redirectTo: 'signup',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  /*{
   path: 'signup',
   loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
   },*/

  {
    path: 'registration',
    loadChildren: () =>
      import('./pages/registration/registration.module').then(
        (m) => m.RegistrationPageModule
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'search-business',
    loadChildren: () =>
      import('./pages/business/search-business/search-business.module').then(
        (m) => m.SearchBusinessPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'calendar-meetings',
    loadChildren: () =>
      import(
        './pages/calendar/calendar-meetings/calendar-meetings.module'
      ).then((m) => m.CalendarMeetingsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'list-business',
    loadChildren: () =>
      import('./pages/business/list-business/list-business.module').then(
        (m) => m.ListBusinessPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'register-business',
    loadChildren: () =>
      import(
        './pages/business/register-business/register-business.module'
      ).then((m) => m.RegisterBusinessPageModule),

    canActivate: [AuthGuard, OwnerBusinessGuard],
  },
  {
    path: 'detail-business',
    loadChildren: () =>
      import('./pages/business/detail-business/detail-business.module').then(
        (m) => m.DetailBusinessPageModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'create-calendar',
    loadChildren: () =>
      import('./pages/calendar/create-calendar/create-calendar.module').then(
        (m) => m.CreateCalendarPageModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'create-meeting',
    loadChildren: () =>
      import('./pages/calendar/create-meeting/create-meeting.module').then(
        (m) => m.CreateMeetingPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'meetings',
    loadChildren: () =>
      import('./pages/calendar/meetings/meetings.module').then(
        (m) => m.MeetingsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'detail-meeting',
    loadChildren: () =>
      import('./pages/calendar/detail-meeting/detail-meeting.module').then(
        (m) => m.DetailMeetingPageModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
