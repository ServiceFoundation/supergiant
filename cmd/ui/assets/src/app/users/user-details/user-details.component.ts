
import {timer as observableTimer,  Subscription ,  Observable } from 'rxjs';

import {switchMap} from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Supergiant } from '../../shared/supergiant/supergiant.service';
import { Notifications } from '../../shared/notifications/notifications.service';
import { SystemModalService } from '../../shared/system-modal/system-modal.service';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  id: number;
  subscriptions = new Subscription();
  user: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supergiant: Supergiant,
    private notifications: Notifications,
    private systemModalService: SystemModalService,
    public loginComponent: LoginComponent
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getUser();
  }

  openSystemModal(message) {
    this.systemModalService.openSystemModal(message);
  }

  getUser() {
    this.subscriptions.add(observableTimer(0, 5000).pipe(
      switchMap(() => this.supergiant.Users.get(this.id))).subscribe(
      (user) => { this.user = user; },
      (err) => { this.notifications.display('warn', 'Connection Issue.', err); }));
  }

  goBack() {
    this.router.navigate(['/users']);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
