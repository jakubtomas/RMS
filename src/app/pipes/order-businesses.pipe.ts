import {Pipe, PipeTransform} from '@angular/core';
import {Business} from "../interfaces/business";

@Pipe({
    name: 'orderBusinesses'
})
export class OrderBusinessesPipe implements PipeTransform {

    transform(businesses: Business[], args: any[]): Business[] {

        if (businesses == null) {
            return [];
        }

        // let direction = 'asc';
        const orderBy = args[0];
        const direction = args[1];


        businesses.sort((a: any, b: any) => {
            if (a[orderBy] < b[orderBy]) {

                return direction === 'asc' ? -1 : 1;
                // return -1;
            } else if (a[orderBy] > b[orderBy]) {
                return direction === 'asc' ? 1 : -1;
            } else {
                return 0;
            }
        });

        return businesses;


    }

}
