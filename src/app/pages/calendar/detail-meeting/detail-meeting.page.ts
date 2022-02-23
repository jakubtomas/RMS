import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BusinessService } from '../../../services/business.service';
import { Business } from '../../../interfaces/business';
import { AlertController, ToastController } from '@ionic/angular';
import { MeetingService } from 'src/app/services/meeting.service';
import { Meeting } from '../../../interfaces/meeting';
import { UserDetails } from 'src/app/interfaces/userDetails';

@Component({
  selector: 'app-detail-meeting',
  templateUrl: './detail-meeting.page.html',
  styleUrls: ['./detail-meeting.page.scss'],
})
export class DetailMeetingPage implements OnInit, OnDestroy {
  business: Business;
  subscription;
  docIdMeeting;
  meetingDetails: Meeting;
  userDetails: UserDetails;
  ownerPermissionBusiness = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController,
    public alertController: AlertController,
    private businessService: BusinessService,
    private meetingService: MeetingService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {

      if (params.ownerPermissionBusiness) {
        console.log('priradenie true ');

        this.ownerPermissionBusiness = true;
      } else {
        console.log('priradenie false  ');
        this.ownerPermissionBusiness = false;
      }

      if (params.docIdMeeting !== undefined) {
        this.docIdMeeting = params.docIdMeeting;

        console.log(params.docIdMeeting + '   ' + params.idBusiness);
        //this.getOneMeeting(this.docIdMeeting);
        this.getOneMeetingWithUserInformation(this.docIdMeeting);
      }

      if (params.idBusiness) {
        this.getOneBusiness(params.idBusiness);
      }
    });
  }


  getOneBusiness(documentID: string): void {
    // todo osetrit ked nenajde business
    this.subscription =
      this.businessService.getOneBusiness(documentID).subscribe((business) => {
        this.business = business;
        console.log(business);

      }, error => {
        console.error(error);

      }
      );
  }

  private async showAlertForDeleteMeeting(docIdMeeting: string): Promise<any> {


    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm Meeting',
      animated: true,
      backdropDismiss: true,
      message: 'Are you sure you want to delete appointment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('no');
            //todo back to detail meeting ts without change


          }
        }, {
          text: 'Yes',
          handler: () => {
            // todo show message succesfully deleted meeting
            this.deleteMeeting(docIdMeeting);
            //this.saveMeeting(time);

          }
        }]
    });

    await alert.present();
  }

  private async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss();
    await toast.present();
  }


  private getOneMeeting(docIdMeeting: string) {
    if (docIdMeeting) {
      this.meetingService.getOneMeeting(docIdMeeting).subscribe(meeting => {
        this.meetingDetails = meeting;
        console.log(meeting);
      });
    }
  }

  private getOneMeetingWithUserInformation(docIdMeeting: string) {
    if (docIdMeeting) {
      this.meetingService.getOneMeetingWithUserInformation(docIdMeeting).subscribe(meetingData => {

        if (meetingData.meeting !== null) {
          this.meetingDetails = meetingData.meeting;
        }

        if (meetingData.userDetails !== null) {
          this.userDetails = meetingData.userDetails[0];
        }
      });
    }
  }


  private deleteMeeting(docIdMeeting: string): void {
    if (docIdMeeting) {
      this.meetingService.deleteMeeting(docIdMeeting).then(value => {


        if (this.ownerPermissionBusiness) {

          this.router.navigate(['/calendar-meetings'], {
            queryParams: {
              businessId: this.business.id,
            }
          });
        }
        this.router.navigate(['/meetings']);
        this.showToast('Meeting have been successfully deleted ');

      }).catch((error) => {
        console.log('error you got error ');

        this.showToast('Meeting have been unsuccessfully deleted ');
        console.log(error);
        //todo Error Message something is wronh
      });
    } else {
      this.showToast('No possible to delete something is wrong');

    }
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
