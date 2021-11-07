import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {catchError} from 'rxjs/operators';
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";
import {AlertController} from '@ionic/angular';
import {async} from 'rxjs';
import {errorObject} from "rxjs/internal-compatibility";
import {CalendarService} from "../../../services/calendar.service";
import {Calendar} from "../../../interfaces/calendar";

@Component({
    selector: 'app-detail-business',
    templateUrl: './detail-business.page.html',
    styleUrls: ['./detail-business.page.scss'],
})
export class DetailBusinessPage implements OnInit {
    messageFirebase: string;
    business: Business;
    selectedBusinessId: string;
    calendar : Calendar;
    daysOfWeek: any;
    pole: any;

    constructor(private route: ActivatedRoute,
        private businessService: BusinessService,
        private router: Router,
        public alertController: AlertController,
        private calendarService: CalendarService,
    ) {
    }


    ngOnInit() {
        console.log(this.route.snapshot.paramMap.get('businessId'));

        this.route.params.subscribe((params: Params) => {
            if (params['businessId'] != undefined) {
                this.selectedBusinessId = params['businessId'];
                this.getOneBusiness(params['businessId']);
               // this.getCalendar();
                this.getCalendar();
            }
            if (params["updateDone"]) {
                this.messageFirebase = "Business successfully updated"
            }
        });

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
        console.log("clikc edit busines " + this.selectedBusinessId);
        this.router.navigate(['/register-business', {businessId: this.selectedBusinessId}])

    }

    deleteBusiness(): void {
        this.businessService.deleteBusiness(this.selectedBusinessId).then(() => {
            this.router.navigate(['/list-business', {deletedBusiness: true}]);
            this.business = null;
            this.selectedBusinessId = null;

        }).catch((error) => {
            console.log("error you got error ");
            console.log(error);
            this.messageFirebase = "Something is wrong";
        });

    }


    async showAlert(): Promise<any> {
        console.log("show alert");

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
                        console.log('Confirm Okay');
                        this.deleteBusiness();
                    }
                }]
        });

        await alert.present();
    }

    getCalendar() {
       /* this.calendarService.findCalendar(this.selectedBusinessId).subscribe((calendars)=> {

            this.calendar = calendars[0];

            console.log(calendars);

            console.log(this.calendar);
            console.log("----------------------------------------");

            if (this.calendar.week !== undefined) {
                console.log(this.calendar.week);
                console.log("som in claendar");
                

            }
            
           // this.daysOfWeek = calendars[0].week;
        } )*/



        this.calendarService.clearData(this.selectedBusinessId)




    }

   /* getCalendar(): void {
        this.calendarService.getOneCalendar(this.selectedBusinessId).subscribe((value) => {
            /!*   this.router.navigate(['/list-business', {deletedBusiness: true}]);
             this.business = null;
             this.selectedBusinessId = null;*!/
            console.log(value);
            console.log("yeeeah you got calendar");
        }, error => {
            console.log(error);
        })
    }*/

    createCalendar(): void {
        this.router.navigate(['/create-calendar', {businessId: this.selectedBusinessId}]);
    }


}
