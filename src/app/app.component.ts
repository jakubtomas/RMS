import {Component} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {BusinessService} from "./services/business.service";
import {Subject} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    appPages = [
        {
            title: 'Search Business',
            url: '/search-business',
            icon: 'search'
        },
        {
            title: 'Schedule',
            //    url: '/tabs/tab1',
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

    businessMode = this.businessService.businessMode$;
    loggedIn = false;
    dark = false;
    firebaseErrorMessage: void;
    subject$ = new Subject();


    constructor(
        public afAuth: AngularFireAuth,
        private authService: AuthService,
        private businessService: BusinessService,
        private router: Router) {
    }

    ngOnInit() {
        this.subject$.subscribe(val => {
            console.log('subject');

            console.log(val);
        });

        // this.businessService.businessMode$.subscribe(value => {
        //     console.log('business mode ');
        //
        //     console.log(value);
        //
        // })
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


}
