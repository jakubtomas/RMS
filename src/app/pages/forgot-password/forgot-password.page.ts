import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';


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
        message: 'Provide email.'
      },
      {
        type: 'pattern',
        message: 'Email is not valid.'
      }
    ],
    password: [
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

  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      // password: new FormControl('', Validators.compose([
      //   Validators.minLength(6),
      //   Validators.required
      // ])),
    });

  }

  resetEmail(input): void {

    this.authService.forgotPassword(input.email)
      .then((result) => {

        if (result === null) {// null is success
          this.showToast('Email with reset link has been sent');
        }

        if (typeof result === 'string') {
          this.showToast(result);
        }
      });

  }

  private async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle',
      cssClass: 'alertMsg'
    });

    toast.onDidDismiss();
    await toast.present();
  }
}

