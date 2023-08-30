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
    currentDate: new Date(),
  };

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(
    private router: Router,
    private meetingService: MeetingService,
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      console.log(params);

      this.business = null;

      this.meetingWithBusiness = [];

      if (params.businessId !== undefined) {
        console.log('no undefined');

        this.selectedBusinessId = params.businessId;
        this.controlBusinessPermission(params.businessId);

        // information about business address
        this.getOneBusiness(this.selectedBusinessId);
      } else {
        this.selectedBusinessId = null;
      }

      if (this.selectedDateEvent !== null) {
        this.onCurrentDateChanged(this.selectedDateEvent);
      }
    });
  }

  controlBusinessPermission(documentID: string): void {
    this.businessService.getBusinessPermission(documentID).subscribe(
      (permissions) => {
        const myId = localStorage.getItem('idUser');
        if (permissions.idUser === myId) {
          this.ownerPermissionBusiness = true;
        } else {
          this.ownerPermissionBusiness = false;
        }
      },
      (error) => {
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
    console.log('onCurrentDateChanged');
    console.log(event);

    this.selectedDateEvent = event;

    this.selectedDateByCalendar = event;
    this.selectedDayByCalendar = event.toString().substring(0, 3);

    const dateForFirestore = moment(this.selectedDateByCalendar).format('L');

    this.meetingWithBusiness = [];

    if (this.selectedBusinessId && dateForFirestore) {
      this.getMeetingsByIdBusinessByDate(
        this.selectedBusinessId,
        dateForFirestore
      );
    } else {
      this.getMeetingsByIdUserByDate(this.idUser, dateForFirestore);
    }
  }

  onViewTittleChanged(title: string): void {
    console.log(title);

    this.viewTitle = title;
  }

  private getMeetingsByIdUserByDate(
    idUser: string,
    dateForCalendar: string
  ): void {
    this.meetingService
      .getMeetingsByIdUserForOneDay(idUser, dateForCalendar)
      .subscribe(
        (meetings) => {
          this.meetingWithBusiness = meetings;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private getMeetingsByIdBusinessByDate(
    idBusiness: string,
    dateForCalendar: string
  ): void {
    this.meetingService
      .getMeetingsByIdBusinessByOneDay(idBusiness, dateForCalendar)
      .subscribe(
        (meetings) => {
          this.timeMeeting = meetings;
          const helpArray = [];

          meetings.map((meeting) => {
            helpArray.push({ meeting });
          });

          this.meetingWithBusiness = helpArray;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  selectMeeting(meeting: Meeting): void {
    this.router.navigate(['/detail-meeting'], {
      queryParams: {
        docIdMeeting: meeting.id,
        idBusiness: meeting.idBusiness,
        redirectFromCalendar: true,
      },
    });
  }

  getOneBusiness(documentID: string): void {
    this.businessService.getOneBusiness(documentID).subscribe(
      (business) => {
        this.business = business;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.selectedBusinessId = null;
  }
}
