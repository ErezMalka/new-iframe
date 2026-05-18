import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslationsService } from '../../translations/translations.service';
import { AppStorageService } from '../../../app.storage.service';
import { MessagePopupComponent } from '../../components/message-popup/message-popup.component';
import { DialogSignInComponent } from '../../../components/sign-in/popup/dialog-sign-in.component';

interface DaySchedule {
  dayIndex: number; // 0=Sunday .. 6=Saturday
  dayName: string;
  open: string;
  close: string;
  closed: boolean;
}

@Component({
  selector: 'info-menu',
  templateUrl: './info-menu.component.html',
  styleUrls: ['./info-menu.component.scss']
})
export class InfoMenuComponent implements OnInit {
  /** Branch object (passed from parent). Must have WorkingHours / IsClosedToday etc. */
  @Input() currentBranch: any;

  public isOpen = false;
  public lang: string = 'he';
  public today: number = new Date().getDay();

  private dayNamesHe = ['\u05e8\u05d0\u05e9\u05d5\u05df', '\u05e9\u05e0\u05d9', '\u05e9\u05dc\u05d9\u05e9\u05d9', '\u05e8\u05d1\u05d9\u05e2\u05d9', '\u05d7\u05de\u05d9\u05e9\u05d9', '\u05e9\u05d9\u05e9\u05d9', '\u05e9\u05d1\u05ea'];
  private dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(
    private translationService: TranslationsService,
    private dialog: MatDialog,
    public appStorageService: AppStorageService
  ) {}

  ngOnInit() {
    try { this.lang = this.translationService.language() || 'he'; } catch (e) {}
  }

  public toggle() {
    this.isOpen = !this.isOpen;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }
  }

  public close() {
    if (this.isOpen) this.toggle();
  }

  public get isHebrew(): boolean {
    return (this.lang || 'he') === 'he';
  }

  public get schedule(): DaySchedule[] {
    const dayNames = this.isHebrew ? this.dayNamesHe : this.dayNamesEn;
    const empty: DaySchedule[] = dayNames.map((n, i) => ({
      dayIndex: i,
      dayName: n,
      open: '',
      close: '',
      closed: true
    }));

    const wh = this.currentBranch && this.currentBranch.WorkingHours;
    if (!wh) return empty;

    if (Array.isArray(wh)) {
      wh.forEach((d: any, i: number) => {
        if (i < 0 || i > 6 || !d) return;
        const open = this.pickTime(d.Open || d.OpenTime || d.From || d.OpenHour || d.OpeningTime);
        const close = this.pickTime(d.Close || d.CloseTime || d.To || d.CloseHour || d.ClosingTime);
        const closed = d.IsClosed === true || d.Closed === true || (!open && !close);
        empty[i] = { dayIndex: i, dayName: dayNames[i], open, close, closed };
      });
      return empty;
    }

    if (typeof wh === 'object') {
      const keyMap: any = {
        '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
        sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
        'ÃÂ¨ÃÂÃÂ©ÃÂÃÂ': 0, 'ÃÂ©ÃÂ ÃÂ': 1, 'ÃÂ©ÃÂÃÂÃÂ©ÃÂ': 2, 'ÃÂ¨ÃÂÃÂÃÂ¢ÃÂ': 3, 'ÃÂÃÂÃÂÃÂ©ÃÂ': 4, 'ÃÂ©ÃÂÃÂ©ÃÂ': 5, 'ÃÂ©ÃÂÃÂª': 6
      };
      Object.keys(wh).forEach(k => {
        const idx = keyMap[String(k).toLowerCase()];
        if (idx === undefined) return;
        const d = wh[k] || {};
        const open = this.pickTime(d.Open || d.OpenTime || d.From || d.OpenHour || d.OpeningTime);
        const close = this.pickTime(d.Close || d.CloseTime || d.To || d.CloseHour || d.ClosingTime);
        const closed = d.IsClosed === true || d.Closed === true || (!open && !close);
        empty[idx] = { dayIndex: idx, dayName: dayNames[idx], open, close, closed };
      });
      return empty;
    }

    return empty;
  }

  public get isClosedToday(): boolean {
    return !!(this.currentBranch && this.currentBranch.IsClosedToday);
  }

  public get closedTodayMessage(): string {
    return (this.currentBranch && this.currentBranch.IsClosedTodayComment) || '';
  }

  private pickTime(val: any): string {
    if (!val && val !== 0) return '';
    if (typeof val === 'string') {
      const m = val.match(/^(\d{1,2}):(\d{2})/);
      if (m) return m[1].padStart(2, '0') + ':' + m[2];
      return val;
    }
    if (typeof val === 'number') {
      const h = Math.floor(val);
      const m = Math.round((val - h) * 60);
      return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
    }
    return '';
  }

  /** Open the About / Description dialog */
  public openAbout(): void {
    this.close();
    const ss: any = this.appStorageService || {};
    const franchise: any = ss.franchise || {};
    const info = franchise.Description || ss.Info || '';
    const header = this.isHebrew ? '\u05d0\u05d5\u05d3\u05d5\u05ea\u05d9\u05e0\u05d5' : 'About Us';
    this.dialog.open(MessagePopupComponent, {
      data: { header, desc: info, isAbout: true, withoutTimeout: true },
      minWidth: '345px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-popup'
    });
  }

  public openTerms(): void {
    this.close();
    const ss: any = this.appStorageService || {};
    const terms = ss.Terms || (ss.franchise && ss.franchise.Terms) || '';
    const header = this.isHebrew ? '\u05ea\u05e7\u05e0\u05d5\u05df' : 'Terms';
    this.dialog.open(MessagePopupComponent, {
      data: { header, desc: terms, isAbout: true, withoutTimeout: true },
      minWidth: '345px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-popup'
    });
  }

  public openPrivacy(): void {
    this.close();
    const ss: any = this.appStorageService || {};
    const privacy = ss.privacyPolicy || (ss.franchise && ss.franchise.PrivacyPolicy) || '';
    const header = this.isHebrew ? '\u05de\u05d3\u05d9\u05e0\u05d9\u05d5\u05ea \u05e4\u05e8\u05d8\u05d9\u05d5\u05ea' : 'Privacy Policy';
    this.dialog.open(MessagePopupComponent, {
      data: { header, desc: privacy, isAbout: true, withoutTimeout: true },
      minWidth: '345px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-popup'
    });
  }

  public openContact(): void {
    this.close();
    const branch: any = this.currentBranch || (this.appStorageService && (this.appStorageService as any).branch) || {};
    const phoneNumber = branch.BranchPhone || branch.ManagerPhone || branch.Phone || ((this.appStorageService as any).franchise && (this.appStorageService as any).franchise.ManagerPhone) || '';
    const address = branch.Address || '';
    const header = this.isHebrew ? '\u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8' : 'Contact Us';
    this.dialog.open(MessagePopupComponent, {
      data: { header, isContact: true, phoneNumber, address, withoutTimeout: true },
      minWidth: '345px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-popup'
    });
  }

  public openLogin(): void {
    this.close();
    this.dialog.open(DialogSignInComponent, {
      panelClass: 'info-menu-dialog'
    });
  }
}
