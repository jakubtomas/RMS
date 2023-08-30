import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { UserDetails } from 'src/app/interfaces/userDetails';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../services/auth.service';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  user: Observable<any>;
  userId: any;
  emailVerified = false;
  email = ' ';
  isActiveMode = false;
  businessMode$ = this.businessService.businessMode$;
  userDetails: UserDetails;

  subscription: Subscription;

  userDetails$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private businessService: BusinessService,
    private userService: UserService
  ) {
    this.user = null;
  }

  ionViewWillEnter(): void {
    this.getUserId();
    this.getUserDetails2();
  }

  ngOnInit() {}
  resetUserDetails(): void {
    this.userDetails = null;
  }

  getUserId(): void {
    this.authService.userId$
      .pipe(
        take(1),
        tap((userId) => {
          if (userId) {
            this.getUserDetails(userId);
          }
        })
      )
      .subscribe();
  }

  getUserDetails(idUser: string): void {
    this.subscription = this.userService
      .getUserDetailsInformation(idUser)
      .subscribe((userDetails) => {
        this.userDetails = userDetails[0];
      });
  }

  getUserDetails2() {
    this.userDetails$ = this.authService.userId$.pipe(
      tap((data) => {
        console.log(data);
      }),
      take(1),
      switchMap((userId) => {
        if (userId) {
          return this.userService.getUserDetailsInformation(userId);
        } else {
          // If userId is not available, return an empty observable or handle as needed
          return EMPTY; // Import EMPTY from 'rxjs'
          // return of(null)
        }
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

  ionViewDidLeave() {
    this.userDetails = null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
