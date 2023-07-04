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
  providedIn: 'root',
})
export class AuthService {
  userId: any;
  userId$ = new BehaviorSubject(null);

  constructor(
    private afAuth: AngularFireAuth,
    private businessService: BusinessService,
    private userService: UserService,
    private toastCtrl: ToastController
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId$.next(user.uid);
      } else {
        this.setNullLocalStorage();
      }
    });
  }
  setUser(userCredential: UserCredential): void {
    if (userCredential.user.uid) {
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
      .then(() => null)
      .catch((error) => {
        if (error.code) {
          return this.createErrMessage(error.code);
        }
        return 'Something is wrong';
      });
  }

  createUser({
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<null | any> {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential: UserCredential) => {
        this.setUser(userCredential);
        const user: UserDetails = {
          idUser: userCredential.user.uid,
          firstName,
          lastName,
        };

        userCredential.user.sendEmailVerification();

        return this.userService.addUser(user).then((data) => {});

        return null;
      })
      .catch((error) => {
        if (error.code) {
          //return one object from array [0]
          return this.createErrorMessage(error.code)[0];
        }

        return { code: 'problem', message: 'Something is wrong from server' };
      });
  }

  createErrorMessage(errorCode: string): object[] {
    const messages: { code: string; message: string }[] = [
      {
        code: 'auth/email-already-in-use',
        message: 'The email address is already in use by another account',
      },
      {
        code: 'auth/invalid-email',
        message: 'The email address is not valid.',
      },
      {
        code: 'auth/invalid-value-(email),-starting-an-object-on-a-scalar-field',
        message: 'The email address is not valid. Invalid value',
      },
      {
        code: 'auth/operation-not-allowed',
        message: 'Email/password accounts are not enabled',
      },
      {
        code: 'auth/weak-password',
        message: 'The password is not strong enough',
      },
      {
        code: 'auth/user-disabled',
        message: 'The user corresponding to the given email has been disabled.',
      },
      { code: 'auth/user-not-found', message: 'User/Email not found ' },
      { code: 'auth/wrong-password', message: 'The password is invalid ' },
      // eslint-disable-next-line max-len
      {
        code: 'auth/too-many-requests',
        message:
          'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later',
      },
    ];
    return messages.filter((object) => object.code === errorCode);
  }

  createErrMessage(errorCode: string): string {
    //pretriedy a da vysledok
    const messages: { code: string; message: string }[] = [
      {
        code: 'auth/email-already-in-use',
        message: 'The email address is already in use by another account',
      },
      {
        code: 'auth/invalid-email',
        message: 'The email address is not valid.',
      },
      {
        code: 'auth/invalid-value-(email),-starting-an-object-on-a-scalar-field',
        message: 'The email address is not valid. Invalid value',
      },
      {
        code: 'auth/operation-not-allowed',
        message: 'Email/password accounts are not enabled',
      },
      {
        code: 'auth/weak-password',
        message: 'The password is not strong enough',
      },
      {
        code: 'auth/user-disabled',
        message: 'The user corresponding to the given email has been disabled.',
      },
      { code: 'auth/user-not-found', message: 'User/Email not found ' },
      { code: 'auth/wrong-password', message: 'The password is invalid ' },
      // eslint-disable-next-line max-len
      {
        code: 'auth/too-many-requests',
        message:
          'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later',
      },
    ];
    return messages
      .filter((object) => object.code === errorCode)
      .map((object) => object.message)[0];
  }
  //Login
  login(email: string, password: string): Promise<any> {
    //observable

    const myIdUser = localStorage.getItem('idUser');

    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential: UserCredential) => {
        this.setUser(userCredential);
        this.userService.setUserId(userCredential.user.uid);

        localStorage.setItem('idUser', userCredential.user.uid);
        localStorage.setItem('email', userCredential.user.email);
        localStorage.setItem(
          'emailVerified',
          userCredential.user.emailVerified + ''
        );

        return null;
      })
      .catch((error) => {
        if (error.code) {
          return this.createErrorMessage(error.code)[0];
        }

        return { code: 'problem', message: 'Something is wrong from server' };
      });
  }

  signOut(): Promise<void> {
    return this.afAuth
      .signOut()
      .then(() => {
        this.setNullLocalStorage();
        this.businessService.updateBusinessMode(false);
      })
      .catch((error) => {
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
      cssClass: 'alertMsg',
    });

    toast.onDidDismiss();
    await toast.present();
  }
}
