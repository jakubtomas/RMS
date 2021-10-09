import {Component, OnInit} from '@angular/core';

import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {user} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {AuthService} from "/../services/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    userForm: FormGroup;
    firebaseErrorMessage: string;

    error_msg = {
        'email': [
            {
                type: 'required',
                message: 'Provide email.'
            },
            {
                type: 'pattern',
                message: 'Email is not valid.'
            }
        ],
        'password': [
            {
                type: 'required',
                message: 'Password is required.'
            },
            {
                type: 'minlength',
                message: 'Password length should be 6 characters long.'
            }
        ]
    };

    constructor(
        private router: Router,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.userForm = this.fb.group({
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            password: new FormControl('', Validators.compose([
                Validators.minLength(6),
                Validators.required
            ])),
        });

        this.userForm.setValue({email: "macka@gmail.com", password: '465489'})
    }

    loginUser(userFormObject: { email, password }) {
        this.authService.login(userFormObject.email, userFormObject.password).then((result) => {
            if (result == null) {// null is success
                console.log("login successfully login.page");
                this.router.navigate(['/dashboard']);

            } else {
                console.log("neprihalsesnz ");
                console.log(result);

                this.firebaseErrorMessage = result.message;
            }
        })
    }
}
