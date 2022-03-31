import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;
import { getAuth, updateProfile, User } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BusinessService } from './business.service';
import { UserService } from './user.service';
import { UserDetails } from '../interfaces/userDetails';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userId: any;
  userId$ = new BehaviorSubject(null);

  constructor(
    private afAuth: AngularFireAuth,
    private businessService: BusinessService,
    private userService: UserService,
    private toastCtrl: ToastController,

    // private User: User
  ) {//todo maybe is better use localStorage


    console.log(this.afAuth.authState);
    console.log('chekc this ');
    // this.afAuth.user.
    //


    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log('priradenie localStorage ');
        console.log(user.emailVerified);
        console.log('prihlasovacie id  ' + user.uid);

        this.userId$.next(user.uid);
        console.log(user.toJSON());

      } else {
        this.setNullLocalStorage();
      }
    });
  }
  setUser(userCredential: UserCredential): void {
    if (userCredential.user.uid) {
      console.log('nastavujem idecko ' + userCredential.user.uid);
      localStorage.setItem('idUser', userCredential.user.uid);

      this.userId$.next(userCredential.user.uid);
      this.userId = userCredential.user.uid;
    }
  }

  getUser(): string {
    return this.userId;
  }

  setNullLocalStorage(): void {
    localStorage.setItem('idUser', null);
    localStorage.setItem('email', null);
    localStorage.setItem('emailVerified', null);
  }

  forgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // googleAuth() {
  //   return this.AuthLogin(new auth.GoogleAuthProvider());
  // }

  // string , validacia
  createUser(email: string, password: string, firstName: string, lastName: string): Promise<null | any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential: UserCredential) => {

        console.log('result after  registration done');

        console.log(userCredential);
        console.log(userCredential.user);
        console.log(userCredential.user.uid);

        console.log('moje idecko pre pridanie dat ' + userCredential.user.uid);

        this.setUser(userCredential);
        const user: UserDetails = {
          idUser: userCredential.user.uid,
          firstName,
          lastName,
        };

        console.log(user);
        userCredential.user.sendEmailVerification();

        return this.userService.addUser(user).then(data => {
          console.log('detail information has been created ');
          console.log(data);


        });

        return null;
      }).catch((error) => {
        console.log(' error' + error);

        if (error.code) {
          //return one object from array [0]
          return this.createErrorMessage(error.code)[0];
        }

        return { code: 'problem', message: 'Something is wrong from server' };
      });
  }

  createErrorMessage(errorCode: string): object[] {
    //pretriedy a da vysledok
    const messages: { code: string; message: string }[] = [
      { code: 'auth/email-already-in-use', message: 'The email address is already in use by another account' },
      { code: 'auth/invalid-email', message: 'The email address is not valid.' },
      { code: 'auth/operation-not-allowed', message: 'Email/password accounts are not enabled' },
      { code: 'auth/weak-password', message: 'The password is not strong enough' },
      { code: 'auth/user-disabled', message: 'The user corresponding to the given email has been disabled.' },
      { code: 'auth/user-not-found', message: 'User/Email not found ' },
      { code: 'auth/wrong-password', message: 'The password is invalid ' },
      // eslint-disable-next-line max-len
      { code: 'auth/too-many-requests', message: 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later' },
    ]; /*todo osetrit moznu result a pozri dalsie dokumentaciu
         auth/too-many-requests*/
    //return the array only with one object
    return messages.filter(object => object.code === errorCode);


  }

  //Login
  login(email: string, password: string): Promise<any> {//observable

    const myIdUser = localStorage.getItem('idUser');
    console.log('localStorage pred prihlasenim  ' + myIdUser);

    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential: UserCredential) => {
        console.log('Auth Service: loginUser: success');
        console.log('----------------------------');
        console.log(userCredential.user);
        console.log(userCredential.user.email);
        console.log(userCredential.user.emailVerified);
        console.log(userCredential.user.uid);
        console.log('----------------------------');

        this.setUser(userCredential);
        this.userService.setUserId(userCredential.user.uid);

        localStorage.setItem('idUser', userCredential.user.uid);
        localStorage.setItem('email', userCredential.user.email);
        localStorage.setItem('emailVerified', userCredential.user.emailVerified + '');



        // localStorage.setItem("",,JSON.stringify(result.user))
        // this.router.navigate(['dashboard']);
        return null;
      })
      .catch(error => {
        console.log('Auth Service: login error...');
        console.log('error code', error.code);
        console.log('error', error);


        if (error.code) {
          //return one object from array [0]
          return this.createErrorMessage(error.code)[0];
        }

        return { code: 'problem', message: 'Something is wrong from server' };


        /*
         if (error.code)
         return {isValid: false, message: error.message};*/
      });

  }

  /*SendVerificationMail() {
   return this.afAuth.currentUser.then(u => u.sendEmailVerification())
   .then(() => {
   //this.router.navigate(['email-verification']);

   //this.router.navigate(['dashboard']);
   });
   }*/

  signOut(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        // localStorage.removeItem('user');
        //    this.router.navigate(['/login']);
        console.log('user logout successfully ');
        this.setNullLocalStorage();
        // todo create message user has benn successfully log out ci ako
        this.businessService.updateBusinessMode(false);

      }).catch(error => {
        console.log('Auth service Logout , error');
        console.log('error code ,', error.code);
        console.log('error  ,', error);

        if (error) {
          return error;
        }
      });
  }

  userDetails() {
    return this.afAuth.user;
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


