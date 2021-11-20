import {Day} from "./day";

export interface Calendar {
    id?: string;
    idBusiness: string;

    week: Day[];
    break: any;
}
