import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
//import {AccountService} from '/app/services/account.service';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: '.s/signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  registerForm: FormGroup;


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
    ],
    'password2': [
      {
        type: 'required',
        message: 'Password is required.'
      },

    ]
  };


  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
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

  goToLogin() {
    this.router.navigateByUrl('login');
  }


}
