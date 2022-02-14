import {TimeMeeting} from './timeMeeting';
export interface Meeting{
    id?: string;
    time: TimeMeeting;
    dateForCalendar: string;
    date: string;
    idBusiness: string;
    idUser: string;
    minutes?: number;
}
