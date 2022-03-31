/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import { MeetingService } from '../../../services/meeting.service';
import { TimeMeeting } from '../../../interfaces/timeMeeting';
import { Meeting } from '../../../interfaces/meeting';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { CalendarComponent } from 'ionic2-calendar';
import { Business } from '../../../interfaces/business';
import { BusinessService } from '../../../services/business.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-calendar-meetings',
  templateUrl: './calendar-meetings.page.html',
  styleUrls: ['./calendar-meetings.page.scss'],
})
export class CalendarMeetingsPage implements OnInit, OnDestroy {

  timeMeeting: Meeting[] = [];
  meetingsByDateBusiness: Meeting[] = [];
  selectedDayByCalendar: string;
  selectedDateByCalendar: Date;
  selectedBusinessId: string;
  meetingWithBusiness = [];
  ownerPermissionBusiness = false;
  selectedDateEvent = null;


  private idUser = localStorage.getItem('idUser');
  business: Business;
  subscription: Subscription;

  viewTitle: string;
  eventSource = [];
  calendar = {
    mode: 'month' as CalendarMode,
    step: 30 as Step,
    currentDate: new Date()
  };

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(
    private router: Router,
    private meetingService: MeetingService,
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    console.log('ng on init calendar meetings ');

    this.route.queryParams.subscribe((params: Params) => {

      console.log('queraParameter');
      console.log(this.selectedDateEvent);
      this.business = null;

      this.meetingWithBusiness = [];

      if (params.businessId !== undefined) {
        this.selectedBusinessId = params.businessId;
        this.controlBusinessPermission(params.businessId);

        // information about business address
        this.getOneBusiness(this.selectedBusinessId);


      } else {
        this.selectedBusinessId = null;
      }

      if (this.selectedDateEvent !== null) {
        console.log('your selected date');
        console.log(this.selectedDateEvent);
        this.onCurrentDateChanged(this.selectedDateEvent);
      }
    });
  }

  controlBusinessPermission(documentID: string): void {

    this.businessService.getBusinessPermission(documentID).subscribe((permissions) => {
      const myId = localStorage.getItem('idUser');
      if (permissions.idUser === myId) {
        console.log('business Permissions true ');

        this.ownerPermissionBusiness = true;
      } else {
        this.ownerPermissionBusiness = false;
      }

    }, error => {
      console.log(error);
    }
    );
  }

  next(): void {
    this.myCal.slideNext();
  }

  back(): void {
    this.myCal.slidePrev();
  }

  reverseTimeList(): void {
    this.meetingWithBusiness.reverse();
  }

  onCurrentDateChanged(event: Date): void {
    this.selectedDateEvent = event;


    console.log('---------------------------');
    console.log('click');

    console.log(event);
    console.log(event.getDay());
    console.log('---------------------------');

    this.selectedDateByCalendar = event;
    this.selectedDayByCalendar = event.toString().substring(0, 3);

    const dateForFirestore = moment(this.selectedDateByCalendar).format('L');

    this.meetingWithBusiness = [];


    if (this.selectedBusinessId && dateForFirestore) {
      // this.ownerPermissionBusiness = true;
      //111 Owner business
      this.getMeetingsByIdBusinessByDate(this.selectedBusinessId, dateForFirestore);
    } else {
      // this.ownerPermissionBusiness = false;
      this.getMeetingsByIdUserByDate(this.idUser, dateForFirestore);
      console.log('you are not owner ');
    }

  }

  onViewTittleChanged(title: string): void {
    console.log(title + ' this is tittle');
    this.viewTitle = title;
  }


  private getMeetingsByIdUserByDate(idUser: string, dateForCalendar: string): void {

    // dany den minus 24 hodin
    // rovnasa dany datum

    const helpTime = moment(dateForCalendar).format('YYYY-MM-DDT00:00:00+01:00');

    console.log('zmeneny time ');
    console.log('2222222222222222222222222222222');

    console.log(helpTime);
    // this.meetingService.getMeetingsByIdUserForOneDay(idUser, dateForCalendar).subscribe();

    this.meetingService.getMeetingsByIdUserForOneDay(idUser, dateForCalendar)
      .subscribe(meetings => {
        console.log('-----------------------');
        console.log(' your meetings by User by Date ');
        console.log(meetings);
        console.log('-----------------------');

        this.meetingWithBusiness = meetings;

        //this.meetingsByDateBusiness = meetings;
        // this.filterReservedHours(this.defaultOpeningHours, meetings)

      }, error => {
        // todo set ErrorMessage Something is wrong
        console.log('you got error ');
        console.log(error);
      });
  }

  // For Business with name
  private getMeetingsByIdBusinessByDate(idBusiness: string, dateForCalendar: string): void {
    console.log('11111111111111111111111111111111111111111');

    this.meetingService.getMeetingsByIdBusinessByOneDay(idBusiness, dateForCalendar).subscribe(meetings => {
      //this.meetingService.getMeetingByIdBusinessByDateWithUserDetails(idBusiness, dateForCalendar).subscribe(meetings => {
      //this.userService.getUserDetailsInformation('Rd6uOzjsi6X3hHQISa2zS7T90mt2').subscribe(meetings => {

      console.log('Meeting');
      console.log(meetings);

      this.timeMeeting = meetings;

      const helpArray = [];

      meetings.map(meeting => {
        helpArray.push({ meeting });
      });

      this.meetingWithBusiness = helpArray;

      console.log('????????????');
      console.log(this.meetingWithBusiness);
      console.log('????????????');


    }, error => {
      // todo set ErrorMessage Something is wrong
      console.log('you got error ');
      console.log(error);
    });
  }

  selectMeeting(meeting: Meeting): void {

    this.router.navigate(['/detail-meeting'], {
      queryParams: {
        docIdMeeting: meeting.id,
        idBusiness: meeting.idBusiness,
        redirectFromCalendar: true,
        //todo add parametaer calendar link after delete and change should redirect to back
        // on this url calendar meetints
      }
    });
  }

  getOneBusiness(documentID: string): void {

    this.businessService.getOneBusiness(documentID).subscribe((business) => {
      this.business = business;
    }, error => {
      console.log(error);
    }
    );
  }

  ngOnDestroy(): void {
    this.selectedBusinessId = null;
    // this.subscription.unsubscribe();
  }
}
