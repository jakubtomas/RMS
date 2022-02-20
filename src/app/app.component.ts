/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { BusinessService } from './services/business.service';
import { Subject, Subscription } from 'rxjs';
import { UserService } from './services/user.service';
import { UserDetails } from './interfaces/userDetails';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  appPages = [
    {
      title: 'Search Business',
      url: '/search-business',
      icon: 'search'
    },
    {
      title: 'Schedule',
      url: '/calendar-meetings',
      icon: 'calendar'
    },
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'clipboard'
    },

    {
      title: 'My Meetings',
      url: '/meetings',
      icon: 'people'
    }
  ];

  subscription: Subscription;
  businessMode = this.businessService.businessMode$;
  loggedIn = false;
  dark = false;
  firebaseErrorMessage: void;
  userDetails: UserDetails;


  constructor(
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    private businessService: BusinessService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    //this.getUserDetails();
  }

  getUserDetails(): void {
    this.userService.getUserDetailsInformation().subscribe((userDetails) => {
      console.log('userDetails');

      console.log(userDetails);

      this.userDetails = userDetails[0];
    });
  }



  signOut(): void {
    console.log('logout function run');

    this.authService.signOut().then((result) => {
      if (result == null) {// null is success, false means there was an error
        console.log('user successfully  singOut');
        this.userDetails = null;

        //todo message successfully signOut
        // this.router.navigate(['/login']);

      } else {
        console.log('user unsuccessfully singOut');
        console.log(result);
        this.firebaseErrorMessage = result;
      }
    });

  }

  clickToggle(toggle) {
    console.log(toggle);
    console.log(toggle.detail.checked);

    if (toggle.detail.checked) {
      //this.subject$.next(true);
      this.businessService.updateBusinessMode(true);
      this.businessService.isActiveMode = true;
    } else {

      this.businessService.updateBusinessMode(false);
      //  this.subject$.next(false);
      this.businessService.isActiveMode = false;
    }
    //this.subject$.complete();
  }
  ngOnDestroy(): void {
    //  this.subscription.unsubscribe();
    this.userDetails = null;
  }

}
