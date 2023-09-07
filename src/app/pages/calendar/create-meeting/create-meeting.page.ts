/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { CalendarService } from '../../../services/calendar.service';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import * as moment from 'moment';
import { TimeMeeting } from '../../../interfaces/timeMeeting';
import { CalendarComponent } from 'ionic2-calendar';
import { MeetingService } from '../../../services/meeting.service';
import { Meeting } from '../../../interfaces/meeting';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.page.html',
  styleUrls: ['./create-meeting.page.scss'],
})
export class CreateMeetingPage implements OnInit {
  selectedDay: string;
  timeMeeting: TimeMeeting[] = [];
  selectedDayByCalendar: string;
  selectedDateByCalendar: Date;
  meetingsByDateBusiness: Meeting[] = [];
  defaultOpeningHours: TimeMeeting[] = [];
  businessCalendar = true;
  selectedBusinessId: string;
  pastDay = false;
  calendarTimeZone: string;

  viewTitle: string;
  eventSource = [];

  calendar = {
    mode: 'month' as CalendarMode,
    step: 30 as Step,
    currentDate: new Date(),
  };

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    public alertController: AlertController,
    private meetingService: MeetingService,
    private calendarService: CalendarService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params.businessId !== undefined) {
        this.selectedBusinessId = params.businessId;
      }
    });
  }

  next(): void {
    this.myCal.slideNext();
  }

  back(): void {
    this.myCal.slidePrev();
  }

  onViewTittleChanged(title: string): void {
    this.viewTitle = title;
  }

  // click on the date in calendar
  onCurrentDateChanged(event: Date): void {
    const yesterday = moment().subtract(1, 'day').format();
    const selectedDay = moment(event).format();

    if (selectedDay > yesterday) {
      this.pastDay = false;
    } else {
      this.pastDay = true;
    }

    this.selectedDateByCalendar = event;
    this.selectedDayByCalendar = event.toString().substring(0, 3);

    this.selectedDay = 'hello';

    this.getOpeningHoursByIdBusiness(this.selectedBusinessId);
  }

  private getOpeningHoursByIdBusiness(idBusiness: string): void {
    this.calendarService.getOpeningHoursByIdBusiness(idBusiness).subscribe(
      (calendar) => {
        if (calendar.length < 1) {
          this.businessCalendar = false;
          return;
        }
        this.calendarTimeZone = calendar[0].timeZone;

        let open;
        let close;
        switch (this.selectedDayByCalendar) {
          case 'Mon':
            open = calendar[0].week[0]?.openingHours;
            close = calendar[0].week[0]?.closingHours;
            break;
          case 'Tue':
            open = calendar[0].week[1]?.openingHours;
            close = calendar[0].week[1]?.closingHours;
            break;
          case 'Wed':
            open = calendar[0].week[2]?.openingHours;
            close = calendar[0].week[2]?.closingHours;
            break;
          case 'Thu':
            open = calendar[0].week[3]?.openingHours;
            close = calendar[0].week[3]?.closingHours;
            break;
          case 'Fri':
            open = calendar[0].week[4]?.openingHours;
            close = calendar[0].week[4]?.closingHours;
            break;
          case 'Sat':
            open = calendar[0].week[5]?.openingHours;
            close = calendar[0].week[5]?.closingHours;
            break;
          case 'Sun':
            open = calendar[0].week[6]?.openingHours;
            close = calendar[0].week[6]?.closingHours;
            break;
          default:
            break;
        }

        // create logaritmus
        const realEnd = moment(close, 'HH:mm');

        let isCalculate = true;
        let starts = moment(open, 'HH:mm');
        const ends = moment(open, 'HH:mm');

        let timeMeeting;
        if (calendar[0].timeMeeting) {
          timeMeeting = calendar[0].timeMeeting;
        } else {
          timeMeeting = 15;
        }

        this.defaultOpeningHours = [];
        while (isCalculate) {
          ends.add(timeMeeting, 'minutes');

          if (ends <= realEnd) {
            this.defaultOpeningHours.push({
              start: starts.format('HH:mm'),
              end: ends.format('HH:mm'),
            });
            starts = moment(ends);
          } else {
            isCalculate = false;
          }
        }

        this.timeMeeting = [];

        if (this.defaultOpeningHours.length > 0) {
          const dateForFirestore = moment(this.selectedDateByCalendar).format(
            'L'
          );

          this.getMeetingsByIdBusinessByDate(idBusiness, dateForFirestore);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  selectTime(time: any): void {
    if (this.selectedDateByCalendar && time) {
      this.showAlertForConfirmMeeting(this.selectedDateByCalendar, time);
    }
  }

  private async showAlertForConfirmMeeting(date: Date, time): Promise<any> {
    const confirmDay = moment(date).format('D.M.YYYY');
    let upravenyCas = moment(date).format('YYYY-MM-DD');
    upravenyCas = upravenyCas + 'T00:00:00';

    const modifyDate = upravenyCas;

    const message =
      'Are you sure you want to create appointment?' +
      '\n' +
      '' +
      confirmDay +
      '\n' +
      ' Start  ' +
      time.start +
      '\n\n\n\n\n' +
      '\n' +
      'End  ' +
      time.end;

    const result = await this.toastService.showAlertMessage(
      message,
      'Confirm Meeting'
    );

    if (result) {
      this.saveMeeting(time, modifyDate);
    }
  }

  private saveMeeting(time, modifyDate): void {
    const userId = localStorage.getItem('idUser');

    const minutesFromHour = moment(time.start, 'HH:mm').hours() * 60;
    const minutesFromMinutes = moment(time.start, 'HH:mm').minutes();
    const startInMinutes = minutesFromHour + minutesFromMinutes;

    const meetingDate = moment(modifyDate)
      .add(startInMinutes, 'minutes')
      .format();

    let meetingDateWithCalendarTimeZone = meetingDate.substring(0, 19);

    meetingDateWithCalendarTimeZone =
      meetingDateWithCalendarTimeZone + this.calendarTimeZone;

    const meetingData: Meeting = {
      dateForCalendar: moment(this.selectedDateByCalendar).format('L'),
      date: meetingDateWithCalendarTimeZone,
      nameDay: moment(this.selectedDateByCalendar).format('dddd'),
      time: {
        end: time.end,
        start: time.start,
      },
      minutes: startInMinutes,
      idBusiness: this.selectedBusinessId,
      idUser: userId,
    };

    this.meetingService
      .getExistMeeting(
        meetingData.idBusiness,
        meetingData.minutes,
        meetingData.dateForCalendar
      )
      .subscribe(
        (existMeeting) => {
          if (!existMeeting) {
            //create Meeting
            this.meetingService
              .addMeeting(meetingData)
              .then(() => {
                this.toastService.showToast(
                  'A meeting has been created successfully.'
                );
              })
              .catch((error) => {
                this.toastService.showAlertMessage(
                  'A meeting has not been created. Try again. Something is wrong'
                );
              });
          } else {
            // its not available termin
            this.toastService.showAlertMessage(
              'Please select another time, because this time has been used by another customer.'
            );
          }
        },
        (error) => {
          this.toastService.showAlertMessage(
            'A meeting has not been created. Try again. Something is wrong'
          );
          console.error(error);
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
          this.timeMeeting = [];
          this.meetingsByDateBusiness = meetings;
          this.filterReservedHours(this.defaultOpeningHours, meetings);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  private filterReservedHours(
    openingHour: TimeMeeting[],
    reservedHours: Meeting[]
  ): void {
    this.timeMeeting = [];
    openingHour.forEach((time) => {
      let permissionForSave = true;
      reservedHours.forEach((timeDB) => {
        if (time.start === timeDB.time.start && time.end === timeDB.time.end) {
          permissionForSave = false;
        }
      });

      if (permissionForSave) {
        this.timeMeeting.push({
          start: time.start,
          end: time.end,
          isAvailable: true,
        });
      } else {
        this.timeMeeting.push({
          start: time.start,
          end: time.end,
          isAvailable: false,
        });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  reverseTimeList(): void {
    this.timeMeeting.reverse();
  }
}
