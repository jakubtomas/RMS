import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
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
  userId;
  emailVerified = false;
  email = ' ';
  isActiveMode = false;
  businessMode = this.businessService.businessMode$;
  userDetails: UserDetails;

  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private businessService: BusinessService,
    private userService: UserService,
  ) {
    this.user = null;
  }


  //  ionViewWillEnter  ionViewWillLeave
  ionViewWillEnter() {
    console.log('ionViewWillENter');
    console.log('-----------1--------------------');
    this.getUserId();

  }

  ngOnInit() {
    console.log('all details');
    // this.getUserDetails();


    // this.userService.getAllUsersDetails().subscribe((value) => {
    //   console.log(value);
    // });





    // this.userService.getUserDetailsInformation().subscribe((value) => {
    //   console.log('user information ');
    //   console.log(value);
    // });

  }
  resetUserDetails(): void {
    this.userDetails = null;
  }

  getUserId(): void {

    this.authService.userId$.subscribe(userId => {
      console.log('subject');
      console.log(userId);
      if (userId) {
        this.getUserDetails(userId);
      }
    });

    // this.authService.userId$.pipe(
    //   mergeMap(async (value) => this.getUserDetails(value))
    // );
  }

  getUserDetails(idUser: string): void {

    this.subscription = this.userService.getUserDetailsInformation(idUser).subscribe((userDetails) => {
      console.log('userDetails');

      console.log(userDetails);

      this.userDetails = userDetails[0];
      console.log(this.userDetails);

    });
  }


  logout(): void {
    console.log('function logout dashbouard.page .ts ');
    // this.authService.signOut();
    // const idUserStorage = localStorage.getItem('idUser');
    // console.log('id pred odhlasen    ' + idUserStorage);


    this.authService.signOut().then((result) => {
      if (result == null) {// null is success, false means there was an error
        this.userDetails = null;
        console.log('user successfully  singOut/odhlaseny ');

        // const podOdhlaseni = localStorage.getItem('idUser');
        // console.log('id po odhlaseny   ' + podOdhlaseni);

        //todo message successfully signOut
        // this.router.navigate(['/login']);

      } else {
        console.log('user unsuccessfully singOut');
        console.log(result);
      }
    });
  }

  doRedirect(address: string) {
    console.log('clikc');
    console.log(address);

  }

  ionViewDidLeave() {
    console.log('ionViewWIll leave -------------------------------------');
    this.userDetails = null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
