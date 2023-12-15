import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.getInitialDarkModeState());
  public darkMode$ = this.darkModeSubject.asObservable();

  toggleDarkMode() {
    const newDarkModeState = !this.darkModeSubject.value;
    this.darkModeSubject.next(newDarkModeState);
    this.saveDarkModeState(newDarkModeState);
  }

  private getInitialDarkModeState(): boolean {
    const savedDarkModeState = localStorage.getItem('darkMode');
    return savedDarkModeState ? JSON.parse(savedDarkModeState) : false;
  }

  private saveDarkModeState(state: boolean): void {
    localStorage.setItem('darkMode', JSON.stringify(state));
  }
}