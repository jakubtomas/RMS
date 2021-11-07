import {Day} from "./day";

export interface Calendar {
    id?: string;
    idBusiness: string;
    nameCalendar: string;
    week: Day[];
    break: any;
}
