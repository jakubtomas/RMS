import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {error} from "selenium-webdriver";
import auth from "firebase/compat";
//import {auth} from "firebase/compat";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
      private router: Router,
      public afAuth: AngularFireAuth
  ) {
      /*this.afAuth.authState.subscribe(user => {
          if (user){
              this.user = user;
              localStorage.setItem('user', JSON.stringify(this.user));
          } else {
              localStorage.setItem('user', null);
          }
      })*/
  }



  // string , validacia
    createUser(email, password ): Promise<any> {

        return this.afAuth.createUserWithEmailAndPassword(email, password)
            .then((result) => {
                console.log("create user function ");
          //this.afAuth.

                console.log(result);
                console.log(result.user.email);
                result.user.sendEmailVerification();
                //return result;
            }).catch((error) => {
                console.log('Auth Service: signup error auth.service', error);

                if (error.code)
                    return { isValid: false, message: error.message };
            });
    }
    //Login
    login(email, password): Promise<any> {//observable
        return this.afAuth.signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log('Auth Service: loginUser: success');
                console.log(result);

                // localStorage.setItem("",,JSON.stringify(result.user))
               // this.router.navigate(['dashboard']);
            })
            .catch(error => {
                console.log('Auth Service: login error...');
                console.log('error code', error.code);
                console.log('error', error);
                if (error.code)
                    return { isValid: false, message: error.message };
            });

    }

    SendVerificationMail() {
        return this.afAuth.currentUser.then(u => u.sendEmailVerification())
            .then(() => {
                //this.router.navigate(['email-verification']);

                //this.router.navigate(['dashboard']);
            });
    }

    signOut(): Promise<void> {
        return this.afAuth.signOut()
            .then(() => {
               // localStorage.removeItem('user');
            //    this.router.navigate(['/login']);
                console.log("user logout successfully  ");

            }).catch(error => {
                console.log("Auth service Logout , error");
                console.log("error code ," , error.code);
                console.log("error  ," , error);

                if (error) {
                    return error
                }
            })

    }
  userDetails() {
    return this.afAuth.user
  }
}


