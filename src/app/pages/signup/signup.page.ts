import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {AccountService} from 'src/app/services/account.service';
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

    userForm: FormGroup;
    successMsg: string = '';
    errorMsg: string = '';

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
        //private ionicAuthService: IonicAuthService,
        // private accountService: AccountService,
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
    }

    signUp() {

        console.log(this.userForm);
        console.log(this.userForm.controls.email);
        console.log(this.userForm);
        console.log(this.userForm.value.email); ///oki
        console.log(this.userForm.value.password);

        //todo change this according the presentation from g
        // todo create newFORMGROUP new FormControl
        const email = this.userForm.value.email;
        const psswd = this.userForm.value.password;

        this.authService.createUser(email, psswd).then((result) => {
            if (result == null) {// null is success, false means there was an error
                console.log('result is null');
                console.log("som prihalsenz ");


            } else {
                console.log("chyba niesom prishalsenz ");

                console.log('result is not null');
                //console.log(result.isValid);
                console.log('resut message ');
                // console.log(result.message);


           //     this.firebaseErrorMessage = result.message;
            }
        }).catch((error) => {
            console.log("odchytavam error");
            console.log(error);


        });

        /*this.accountService.createUser(value)
          .then((response) =>
          {
            this.errorMsg = "";
            this.successMsg = "New user created.";
          }, error =>
          {
            this.errorMsg = error.message;
            this.successMsg = "";
          })*/
    }

    goToLogin() {
        this.router.navigateByUrl('login');
    }


}
