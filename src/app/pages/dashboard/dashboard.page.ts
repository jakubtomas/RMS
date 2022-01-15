import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from 'rxjs';
import {AuthService} from "../../services/auth.service";
import {BusinessService} from "../../services/business.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

    user: Observable<any>;
    emailVerified: boolean = false;
    email: string = ' ';
    isActiveMode: boolean = false;
    businessMode = this.businessService.businessMode$;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private afAuth: AngularFireAuth,
        private businessService: BusinessService
    ) {
        this.user = null;
    }

    ngOnInit() {

        this.isActiveMode = this.businessService.isActiveMode;
        this.afAuth.authState.subscribe(user => {
            console.log('Dashboard: user', user);

            if (user) {
                this.email = user.email.toLowerCase();
                this.emailVerified = user.emailVerified;
            } else {
                this.email = null;
                this.emailVerified = null
            }
        });

/*
        if (this.route.snapshot.paramMap.get('createdBusiness')) {
            this.messageFirebase = 'Business successfully created'
        }*///todo how to do with subscribe caching parameter
        /*this.route.params.subscribe((params: Params) => {
                    console.log('Parameter  ' + params);
                    console.log('Parameter  ' + params['createdBusiness']);
                });*/
    }


    logout(): void {
        console.log("function logout dashbouard.page .ts ");
        this.authService.signOut();
    }

    doRedirect(address:string){
        console.log('clikc');
        console.log(event);
        
    }
    
}
