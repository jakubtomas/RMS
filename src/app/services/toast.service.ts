// toast.service.ts
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular'; // Adjust this import based on your setup

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  async showToast(msg: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle',
    });

    toast.onDidDismiss();
    await toast.present();
  }
}
