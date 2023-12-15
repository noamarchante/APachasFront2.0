import {Component, OnInit} from '@angular/core';
import {NotificationService} from '@modules/notification/services/notification.service';
import {NotificationsService} from 'angular2-notifications';
import {Severity} from '@modules/notification/entities';
import {AuthenticationService} from '@services/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {UserEventService} from "@services/userEvent.service";
import {UserUserService} from "@services/userUser.service";
import { DarkModeService } from '@services/darkMode.service';

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
  darkMode = false;
  constructor(
    private notificationService: NotificationService,
    private notificationsService: NotificationsService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private userEventService: UserEventService,
    private userUserService: UserUserService,
    private route: ActivatedRoute,
    private darkModeService: DarkModeService
  ) {
  }

  ngOnInit() {

    this.darkModeService.darkMode$.subscribe((mode) => {
      this.darkMode = mode;
      this.toggleBodyClass();
    });
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

  private toggleBodyClass() {
    const body = document.body;
    if (this.darkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  isSelected(routeName: string): boolean {
    return this.route.snapshot.routeConfig?.path === routeName;
  }

  getEventNotifications() {
    this.userEventService.getNotifications(this.authenticationService.getUser()?.id).subscribe(
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

processEventNotifications(events: any[]) {
    events.forEach((event) => {
        this.notifications.push("Invitación a evento " + event);
    });
}

getUserNotifications() {
      this.userUserService.getNotifications(this.authenticationService.getUser()?.id).subscribe(
          (userNotifications) => {
              this.processUserNotifications(userNotifications);
              this.setBadge();
          },
          (error) => {
              console.error('Error fetching user notifications:', error);
          }
      );
    
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
    this.router.navigate(['login']);
  }
  logIn(){
    this.router.navigate(['login']);
  }
}
