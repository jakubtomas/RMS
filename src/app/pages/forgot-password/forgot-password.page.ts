import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  [x: string]: any;

  userForm: FormGroup;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  error_msg = {
    email: [
      {
        type: 'required',
        message: 'Provide email.',
      },
      {
        type: 'pattern',
        message: 'Email is not valid.',
      },
    ],
  };

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
    });
  }

  resetEmail(input: { email: string }): void {
    this.authService.forgotPassword(input.email).then((result) => {
      if (result === null) {
        // null is success
        this.toastService.showToast('Email with reset link has been sent');
      } else {
        if (result.message) {
          this.toastService.showToast(result.message);
        } else {
          this.toastService.showToast('Something is wrong');
        }
      }
    });
  }
}
