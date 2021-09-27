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
    /*userForm = new FormGroup({
        email: new FormControl("jasnko@gmail.com"),
        password: new FormControl("45612398798")
    });*/



    successMsg: string = '';
    errorMsg: string = '';
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

        //todo only for developing /testing app
        this.userForm.setValue({email: this.generateEmail(), password: '465489'})
    }

     private generateEmail() {
        let result           = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( let i = 0; i < 5; i++ ) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result+"@gmail.com";
    }

    signUps(value) {
        console.log(value);

    }


    createUser(userFormValues: {email,password}) {
        //const email:string = this.userForm.get('email').value;
        //const password:string =this.userForm.get('password').value;

        console.log("email and password are " + userFormValues.email + " password  " + userFormValues.email);


        this.authService.createUser(userFormValues.email, userFormValues.password).then((result) => {
            if (result == null) {// null is success, false means there was an error
                console.log("successful registration createUser.ts");
            } else {
                console.log("unsuccessful registration account createUser.ts  ");
                this.firebaseErrorMessage = result.message;

                console.log(result);
                console.log(result.message);

                console.log(result.isValid);
                console.log('resut message ');
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
