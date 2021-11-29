import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {catchError} from 'rxjs/operators';
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";
import {AlertController, ToastController} from '@ionic/angular';
import {async} from 'rxjs';
import {errorObject} from "rxjs/internal-compatibility";
import {CalendarService} from "../../../services/calendar.service";
import {Calendar} from "../../../interfaces/calendar";
import {object} from "@angular/fire/database";

@Component({
    selector: 'app-detail-business',
    templateUrl: './detail-business.page.html',
    styleUrls: ['./detail-business.page.scss'],
})
export class DetailBusinessPage implements OnInit {
    messageFirebase: string;
    business: Business;
    selectedBusinessId: string;
    calendar: Calendar;
    calendars: Calendar[];
    myId: string  ;

    constructor(private route: ActivatedRoute,
        private businessService: BusinessService,
        private router: Router,
        private toastCtrl: ToastController,
        public alertController: AlertController,
        private calendarService: CalendarService,
    ) {
    }


    ngOnInit() {

        this.route.queryParams.subscribe((params: Params) => {

            if (params['businessId'] != undefined) {
                this.selectedBusinessId = params['businessId'];
                this.getOneBusiness(params['businessId']);
                // this.getCalendar();
                this.getCalendars();

                // todo check am I owner this business?? for update,delete

            }
            if (params["updateDone"]) {
                this.messageFirebase = "Business successfully updated"
            }
        });

    }

    async showToast(msg: string) {
        let toast = await this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'middle'
        });

        toast.onDidDismiss();
        await toast.present();
    }


    getOneBusiness(documentID: string) {

        this.businessService.getOneBusiness(documentID).subscribe((business) => {
                this.business = business;
            }, error => {
                console.log(error);
            }
        );
    }

    editBusiness(): void {
        //this.router.navigate(['/register-business', {businessId: this.selectedBusinessId}]);
        this.router.navigate(['/register-business'], { queryParams: {businessId: this.selectedBusinessId}})

    }

    deleteBusiness(): void {
        this.businessService.deleteBusiness(this.selectedBusinessId).then(() => {
         //   this.router.navigate(['/list-business', {deletedBusiness: true}]);
            this.router.navigate(['/list-business'], {queryParams: {deletedBusiness: true}});

            this.business = null;
            this.selectedBusinessId = null;

        }).catch((error) => {
            console.log("error you got error ");
            console.log(error);
            this.messageFirebase = "Something is wrong";
        });
    }

    async showAlertForDelete(input:string): Promise<any> {
        console.log("show alert");
        let deleteBusiness: boolean = null;

        if (input === "business") {
            deleteBusiness = true;
        } else {
            deleteBusiness = false;
        }

        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Confirm Deletion',
            animated: true,
            backdropDismiss: true,
            message: 'Are you sure you want to permanently remove this item?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        if (deleteBusiness) {
                            this.deleteBusiness();
                        }
                        if (!deleteBusiness) {
                            this.deleteCalendar();
                        }

                    }
                }]
        });

        await alert.present();
    }

    deleteCalendar(): void {
        this.calendarService.deleteCalendar(this.calendar.id).then(() => {
            this.showToast("Calendar has been deleted");
            this.calendar = null;

        }).catch((error) => {
            console.log("error you got error ");
            console.log(error);
            this.messageFirebase = "Something is wrong";
        });
    }

    getCalendars(): void {
        this.calendarService.getCalendars().subscribe(calendars => {
            console.log("details busines calendar");
            console.log(calendars);

            this.calendars = calendars;
            if (this.calendars.length > 0) {
                this.calendars.forEach(calendar => {
                    if (calendar.idBusiness === this.selectedBusinessId) {
                        this.calendar = calendar;
                    }
                });
            }
        }, error => {
            console.log("you got error ");
            console.log(error);
        })
    }

    editCalendar(): void {
        console.log("click edit calendar");

        //  this.router.navigate(['/register-business', {businessId: this.selectedBusinessId}])
      //  this.router.navigate(['/create-calendar', {docCalendarId: this.calendar.id, updateCalendar: true}]);
        this.router.navigate(['/create-calendar'], { queryParams: { docCalendarId: this.calendar.id}})


    }


    createCalendar(): void {
    //    this.router.navigate(['/create-calendar', {businessId: this.selectedBusinessId}]);
        this.router.navigate(['/create-calendar'], { queryParams: { businessId: this.selectedBusinessId}})

    }

    createMeeting(): void {
        //    this.router.navigate(['/create-calendar', {businessId: this.selectedBusinessId}]);
        console.log("go to another page ");
        
        //this.router.navigate(['/create-calendar'], { queryParams: { businessId: this.selectedBusinessId}})

    }


}
