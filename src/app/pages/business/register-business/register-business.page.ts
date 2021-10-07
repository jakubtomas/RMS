import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-register-business',
  templateUrl: './register-business.page.html',
  styleUrls: ['./register-business.page.scss'],
})
export class RegisterBusinessPage implements OnInit {

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




  constructor() { }

  ngOnInit() {
  }

}
