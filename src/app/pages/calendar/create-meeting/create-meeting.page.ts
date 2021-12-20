import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BusinessService} from "../../../services/business.service";
import {AlertController, ToastController} from "@ionic/angular";
import {CalendarService} from "../../../services/calendar.service";
import {CalendarMode, Step} from "ionic2-calendar/calendar";
import {Observable} from "rxjs";
import {Business} from "../../../interfaces/business";

@Component({
    selector: 'app-create-meeting',
    templateUrl: './create-meeting.page.html',
    styleUrls: ['./create-meeting.page.scss'],
})
export class CreateMeetingPage implements OnInit {

    selectedDay;
    eventSource = [];
    isToday: boolean;
    businesses$ = [{}];
        calendar = {
        mode: 'month' as CalendarMode,
        step: 30 as Step,
        currentDate: new Date(),
    };

    selectedBusinessId: string;

    constructor(private route: ActivatedRoute,
        private businessService: BusinessService,
        private router: Router,
        private toastCtrl: ToastController,
        public alertController: AlertController,
        private calendarService: CalendarService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: Params) => {

            if (params['businessId'] != undefined) {
                this.selectedBusinessId = params['businessId'];
                console.log("I got business id " + this.selectedBusinessId);

            }
        })
    }

    onCurrentDateChanged(event: Date) {
        console.log('click');
        console.log(event);

        this.selectedDay = 'hello';
        // var today = new Date();
        // today.setHours(0, 0, 0, 0);
        // event.setHours(0, 0, 0, 0);
        // this.isToday = today.getTime() === event.getTime();
    }

    // add calendar plugin
    //take data for generate calendar
    // show calendar


    // 1 GUI
    // maybe set default day actually day with list
    //functionality click on day and show list of free
    // 2 create collection Firestore for meeting

}
