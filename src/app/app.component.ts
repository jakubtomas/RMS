import { Component } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";

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

  businessMode: boolean = false;
  loggedIn = false;
  dark = false;
  firebaseErrorMessage: void;


  constructor(public afAuth: AngularFireAuth,
              private authService: AuthService,
              private router: Router) {

    
  }


  signOut() {
    console.log("logout function run");

    this.authService.signOut().then((result) => {
      if (result == null) {// null is success, false means there was an error
        console.log("user successfully  singOut");
        //todo message successfully signOut
       // this.router.navigate(['/login']);

      } else {
        console.log("user unsuccessfully singOut");
        console.log(result);
        this.firebaseErrorMessage = result;
      }
    })

  }

  update(value) {
    console.log(value);
    
  }
  

}
