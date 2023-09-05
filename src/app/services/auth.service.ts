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
import { NewUser } from '../interfaces/auth-user';
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

  async forgotPassword(passwordResetEmail: string): Promise<any> {
    try {
      await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
      return null;
    } catch (error) {
      if (error.code) {
        return this.createErrorMessage(error.code, error.message);
      }
      return 'Something is wrong';
    }
  }

  async createUser(
    newUser: NewUser
  ): Promise<null | { code: string; message: string }> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        newUser.email,
        newUser.password
      );

      this.setUser(userCredential);

      const user: UserDetails = {
        idUser: userCredential.user.uid,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      };

      await this.userService.addUser(user);
      await userCredential.user.sendEmailVerification();

      return null; // Success
    } catch (error) {
      // console.log(error);
      // console.log(error.code);
      // console.log(error.message);

      if (error.code) {
        return this.createErrorMessage(error.code, error.message);
      }

      return {
        code: 'problem',
        message:
          'Something is wrong from the server ,User has not been created successfully',
      };
    }
  }

  createErrorMessage(
    errorCode: string,
    errorMessage: string
  ): { code: string; message: string } {
    return { code: errorCode, message: errorMessage };

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
      {
        code: 'auth/missing-android-pkg-name',
        message:
          'An Android package name must be provided if the Android app is required to be installed',
      },
      {
        code: 'auth/missing-continue-uri',
        message: 'A continue URL must be provided in the request',
      },
      {
        code: 'auth/missing-ios-bundle-id',
        message:
          'An iOS Bundle ID must be provided if an App Store ID is provided',
      },
      {
        code: 'auth/invalid-continue-uri',
        message: 'The continue URL provided in the request is invalid',
      },
      {
        code: 'auth/unauthorized-continue-uri',
        message:
          'The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase console',
      },
      {
        code: 'auth/user-not-found',
        message: 'User not found',
      },
    ];
    return messages.filter((object) => object.code === errorCode)[0];
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );

      this.setUser(userCredential);
      this.userService.setUserId(userCredential.user.uid);

      localStorage.setItem('idUser', userCredential.user.uid);
      localStorage.setItem('email', userCredential.user.email);
      localStorage.setItem(
        'emailVerified',
        userCredential.user.emailVerified + ''
      );
      return null;
    } catch (error) {
      if (error.code) {
        return this.createErrorMessage(error.code, error.message);
      }
      return { code: 'problem', message: 'Something is wrong from server' };
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.setNullLocalStorage();
      this.businessService.updateBusinessMode(false);
    } catch (error) {
      if (error) {
        return error;
      }
    }
  }

  userDetails() {
    return this.afAuth.user;
  }
}
