undefinedimport { Component, Input, OnInit } from '@angular/core';
import { TranslationsService } from '../translations/translations.service';

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

  private dayNamesHe = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  private dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(private translationService: TranslationsService) {}

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
        'ראשון': 0, 'שני': 1, 'שלישי': 2, 'רביעי': 3, 'חמישי': 4, 'שישי': 5, 'שבת': 6
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
}
