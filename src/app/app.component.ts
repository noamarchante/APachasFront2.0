import {Component, OnInit} from '@angular/core';
import {NotificationService} from '@modules/notification/services/notification.service';
import {NotificationsService} from 'angular2-notifications';
import {Severity} from '@modules/notification/entities';
import {AuthenticationService} from '@services/authentication.service';
import {Router} from '@angular/router';
import {UserEventService} from "@services/userEvent.service";
import {UserUserService} from "@services/userUser.service";

declare var paypal;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'APachas';
  defaultImage: string = 'assets/user16.jpg';
  notifications: string[] = [];
  badge: string ="";
  constructor(
    private notificationService: NotificationService,
    private notificationsService: NotificationsService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private userEventService: UserEventService,
    private userUserService: UserUserService
  ) {
  }

  ngOnInit() {
    this.notificationService.getMessages().subscribe(
      message => {
        switch (message.severity) {
          case Severity.ERROR:
            this.notificationsService.error(message.summary, message.detail);
            break;
          case Severity.SUCCESS:
            this.notificationsService.success(message.summary, message.detail);
            break;
          case Severity.INFO:
            this.notificationsService.info(message.summary, message.detail);
            break;
          case Severity.WARNING:
            this.notificationsService.warn(message.summary, message.detail);
            break;
        }
      }
    );
    this.getEventNotifications();
    this.getUserNotifications();
  }

  getEventNotifications() {
    const userId = this.authenticationService.getUser()?.id;
    if(userId != null){
    this.userEventService.getNotifications(userId).subscribe(
        (events) => {
            this.processEventNotifications(events);
            this.setBadge();
        },
        (error) => {
            console.error('Error fetching event notifications:', error);
            // Handle the error appropriately
        }
    );
      }
}

processEventNotifications(events: any[]) {
    events.forEach((event) => {
        this.notifications.push("Invitación a evento " + event);
    });
}

getUserNotifications() {
    const userId = this.authenticationService.getUser().id;
    if(userId != null){
      this.userUserService.getNotifications(userId).subscribe(
          (userNotifications) => {
              this.processUserNotifications(userNotifications);
              this.setBadge();
          },
          (error) => {
              console.error('Error fetching user notifications:', error);
          }
      );
    }
}

processUserNotifications(userNotifications: any[]) {
    userNotifications.forEach((notification) => {
        this.notifications.push("Solicitud de amistad de " + notification);
    });
}

  setBadge(){
    if (this.notifications.length != 0) {
      this.badge = "bg-danger";
    }else{
      this.badge = "";
    }
  }

  logOut() {
    this.authenticationService.logOut();
    this.router.navigateByUrl('/login');
  }
  logIn(){
    this.router.navigateByUrl('/login');
  }
}
