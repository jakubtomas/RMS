import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;
import { getAuth, updateProfile, User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BusinessService } from './business.service';
import { UserService } from './user.service';
import { UserDetails } from '../interfaces/userDetails';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any;

  constructor(
    private afAuth: AngularFireAuth,
    private businessService: BusinessService,
    private userService: UserService
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
        console.log(user.uid);

        console.log(user.toJSON());


        this.user = user;
        localStorage.setItem('idUser', user.uid);
        localStorage.setItem('email', user.email);
        localStorage.setItem('emailVerified', user.emailVerified + '');

      } else {
        localStorage.setItem('idUser', null);
        localStorage.setItem('email', null);
      }
    });
  }


  // string , validacia
  createUser(email: string, password: string, firstName: string, lastName: string): Promise<null | { code: string; message: string }> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential: UserCredential) => {

        console.log('result after  registration done');

        console.log(userCredential);
        console.log(userCredential.user);
        console.log(userCredential.user.uid);
        //console.log(r);
        /*this.afs.collection('users').doc(result.user.uid).set({displayName: 'mockString'}).then(
         (value => {
         console.log('ulozenie mena');
         console.log(value);

         })
         );*/

        //todo take data from Form firstName Second Name  na save to mock String
        // eslint-disable-next-line @typescript-eslint/no-shadow


        // this.afAuth.currentUser.then(user =>
        // {
        //   user.updateProfile({ displayName: firstName + lastName }).then(value =>
        //   {
        //     console.log(value);
        //     console.log('profile information has been updated ');

        //   });
        // });

        console.log('moje idecko pre pridanie dat ' + userCredential.user.uid);


        const user: UserDetails = {
          id: userCredential.user.uid,
          firstName,
          lastName,
        };

        console.log(user);


        this.userService.addUser(user).then(data => {
          console.log('detail information has been created ');
          console.log(data);

        });


        // todo create collection for saving FirstName LastName with id User ,
        // Try is possible to take displayName from user by id ??
        // this will be very good
        // than create function which send request for save this data
        // response maybe create message or something like this

        // what happend when do not save this data
        // show message for again saving data in form


        userCredential.user.sendEmailVerification();

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
    ]; /*todo osetrit moznu result a pozri dalsie dokumentaciu
         auth/too-many-requests*/
    //return the array only with one object
    return messages.filter(object => object.code === errorCode);


  }

  //Login
  login(email: string, password: string): Promise<any> {//observable
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('Auth Service: loginUser: success');
        console.log(result);

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
}


