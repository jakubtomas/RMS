import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { delay, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { UserDetails } from 'src/app/interfaces/userDetails';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../services/auth.service';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  user$: Observable<any>;
  emailVerified = false;
  isActiveMode = false;
  userDetails: UserDetails;

  businessMode$ = this.businessService.businessMode$;
  userDetails$: Observable<UserDetails>;
  userDetailsMessage: string = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private businessService: BusinessService,
    private userService: UserService
  ) {
    this.user$ = null;
  }

  ionViewWillEnter(): void {
    this.getUserDetails();
  }

  ngOnInit() {}

  getUserDetails() {
    this.userDetails$ = this.authService.userId$.pipe(
      take(1),
      switchMap((userId) => {
        return this.userService.getUserDetailsInformation(userId).pipe(
          tap({
            next: (userDetails) => {
              if (userDetails === null) {
                this.userDetailsMessage =
                  'No user details found for this user.';
              }
            },
            error: () => {
              this.userDetailsMessage =
                'Something is wrong from server. Please try again';
            },
          })
        );
      })
    );
  }

  logout(): void {
    this.authService.signOut().then((result) => {
      if (result == null) {
        // null is success, false means there was an error
        this.userDetails = null;
      }
    });
  }

  resetUserDetails(): void {
    this.userDetails = null;
    this.userDetailsMessage = null;
  }

  ionViewDidLeave() {
    this.userDetails = null;
  }
}
