import {Component, OnDestroy, OnInit} from '@angular/core';
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
// import * as moment from "../../calendar/create-calendar/create-calendar.page";
import * as moment from 'moment';

@Component({
    selector: 'app-detail-business',
    templateUrl: './detail-business.page.html',
    styleUrls: ['./detail-business.page.scss'],
})
export class DetailBusinessPage implements OnInit, OnDestroy {
    messageFirebase: string;
    business: Business;
    selectedBusinessId: string;
    calendar: Calendar;
    calendars: Calendar[];
    myId: string;
    isThisMyBusiness: boolean = false;
    subscription;
    hodina;
    timeZone = moment().format().toString().substring(19, 22);


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

                this.controlBusinessPermission(params['businessId']);
                this.getOneBusiness(params['businessId']);
                // this.getCalendar();
                this.getCalendars();

                // todo check am I owner this business?? for update,delete

            }
            if (params["updateDone"]) {
                this.messageFirebase = "Business successfully updated"
            }
        });

        /*
         * this.donorStore.getDonor(donorId).pipe(
         filter(donor => !!donor),
         take(1),
         switchMap(() => this.donorStore.updateDonorLang(lang))
         )*/

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


    getOneBusiness(documentID: string): void {

        this.subscription = this.businessService.getOneBusiness(documentID).subscribe((business) => {
                this.business = business;
            }, error => {
                console.log(error);
            }
        );
    }

    controlBusinessPermission(documentID: string): void {

        this.businessService.getBusinessPermission(documentID).subscribe((permissions) => {

                const myId = localStorage.getItem('idUser');
                if (permissions.idUser === myId) {

                    this.isThisMyBusiness = true;
                }

            }, error => {
                console.log(error);
            }
        );
    }

    editBusiness(): void {
        //this.router.navigate(['/register-business', {businessId: this.selectedBusinessId}]);
        this.router.navigate(['/register-business'], {queryParams: {businessId: this.selectedBusinessId}})

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

    async showAlertForDelete(input: string): Promise<any> {

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

    changeDateFormat(): void {

        // create mock Date and set value
        const newWeek = this.calendar.week.map((item, index) => {
            if (index == 6) {


                const basicTime = '10:25 AM';
                const date = moment();

                console.log(' what is date ');
                console.log(date);

                console.log(' what is date ');
                console.log('hello' + moment().format() + '    ' + this.timeZone);


                const newTime = moment('Mon 03-Jul-2017, 11:00 AM', 'ddd DD-MMM-YYYY, hh:mm A');
                console.log('newtime  ' + newTime);


                // const stringForFun = 'Mon 03-Jul-2017, ' + basicTime;
                const newTime2 = moment('Mon 03-Jul-2017, ' + basicTime, 'ddd DD-MMM-YYYY, hh:mm A');

                console.log('newtime 2  ' + newTime2);


                this.hodina = moment
                    .duration(moment(item.closingHours, 'HH:mm').add("70","minutes")
                        .diff(moment(item.openingHours, 'HH:mm'))
                    ).asMinutes();
                console.log(this.hodina);
                console.log('show me your time ');


                return {
                    day: item.day,
                    openingHours: item.openingHours ,
                    closingHours: item.closingHours
                };
            } else {
                return {
                    day: item.day,
                    openingHours: item.openingHours ,
                    closingHours: item.closingHours
                };
            }

        });

        this.calendar = {
            id: this.calendar.id,
            idBusiness: this.calendar.idBusiness,
            week: newWeek,
            break: 'no break',
            timeZone: this.timeZone
        };

    }

    getCalendars(): void {
        this.calendarService.getCalendars().subscribe(calendars => {

            this.calendars = calendars;
            if (this.calendars.length > 0) {
                this.calendars.forEach(calendar => {
                    if (calendar.idBusiness === this.selectedBusinessId) {
                        // set calendar

                        console.log('-----------------');
                        console.log('your calendar data are ');
                        console.log(calendar);
                        console.log('-----------------');


                        this.calendar = calendar;
                        //call function fore format date
                        this.changeDateFormat();
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
        this.router.navigate(['/create-calendar'], {queryParams: {docCalendarId: this.calendar.id}})


    }


    createCalendar(): void {
        //    this.router.navigate(['/create-calendar', {businessId: this.selectedBusinessId}]);
        this.router.navigate(['/create-calendar'], {queryParams: {businessId: this.selectedBusinessId}})

    }

    createMeeting(): void {
        //    this.router.navigate(['/create-calendar', {businessId: this.selectedBusinessId}]);
        console.log("go to another page ");

        this.router.navigate(['/create-meeting'], {queryParams: {businessId: this.selectedBusinessId}})

    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }


}
