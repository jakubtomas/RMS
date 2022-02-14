import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Params, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BusinessService } from '../services/business.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OwnerBusinessGuard implements CanActivate {

  // http://localhost:4200/register-business?businessId=t3oJjMXEXu9TXXbAake2
  constructor(
    private router: Router,
    private businessService: BusinessService,
  ) {
  }
  // ifflfzGx1qHnIlRkNPQH
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const businessId = route.queryParamMap.get('businessId');

    if (businessId !== null) {
      const myId = localStorage.getItem('idUser');

      return this.businessService.getBusinessPermission(businessId).pipe(
        take(1),
        map(value => value?.idUser === myId)
      ); // todo  when false redirect with message you dont have permission to edit this data

    } else {
      return true;
    }
  }
}
