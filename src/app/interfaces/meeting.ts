import {TimeMeeting} from "./timeMeeting";
export interface Meeting{
    id?: string;
    time : TimeMeeting,
    date: string,
    idBusiness : string,
    idUser:string,
}
