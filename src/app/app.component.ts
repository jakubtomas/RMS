import { Component } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent
{
  appPages = [
    {
      title: 'Schedule',
      url: '/tabs/tab1',
      icon: 'calendar'
    },
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'people'
    },

    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information-circle'
    }
  ];

  loggedIn = false;
  dark = false;


  constructor(public afAuth: AngularFireAuth) {}
}
