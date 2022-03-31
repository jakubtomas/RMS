import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {


  userForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  resetEmail(email: string) {
    console.log('clikc');
    this.authService.forgotPassword(email)
      .then((result) => {
        console.log('result');
        console.log(result);

        if (result == null) {// null is success
          console.log('reset password okey');

          //
          // this.router.navigate(['/dashboard']);

        } else {
          console.log('problem ');
          console.log(result);


          // todo cdr change for new message
          //   this.firebaseErrorMessage = result.message;
          // this.showToast(result.message);
        }
      });

  }

}
