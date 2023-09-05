// toast.service.ts
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular'; // Adjust this import based on your setup

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private toastCtrl: ToastController,
    private alertController: AlertController
  ) {}

  async showToast(msg: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle',
    });

    toast.onDidDismiss();
    await toast.present();
  }

  async showAlertMessage(
    alertMessage: string,
    headerMessage: string = 'Warning'
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        cssClass: 'alertForm',
        header: headerMessage,
        message: alertMessage,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(false); // Resolve with false on Cancel
            },
          },
          {
            text: 'OK',
            handler: () => {
              resolve(true); // Resolve with true on OK
            },
          },
        ],
      });
      await alert.present();
    });
  }

  // async showAlertAndCallUpdateCalendar() {
  //   const result = await this.alertService.showAlertMessage(
  //     'This is a global alert message.'
  //   );

  //   if (result) {
  //     this.updateCalendar(); // Call the updateCalendar function on OK
  //   } else {
  //     // Handle the Cancel action (optional)
  //     console.log('Cancel button clicked in Component A');
  //   }
  // }
}
