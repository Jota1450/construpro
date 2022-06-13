import { Project } from 'src/app/models/project';
import { NotesService } from './../../services/notes.service';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import * as moment from 'moment';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Note } from 'src/app/models/note';
registerLocaleData(localeEs);

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  eventSource;
  viewTitle;
  date: Date;

  notes: Note[];
  project: Project;

  isToday: boolean;
  calendar = {
    locale: 'es-ES',
    mode: 'month' as CalendarMode,
    step: 30 as Step,
    currentDate: new Date(),
    dateFormatter: {
      formatMonthViewDay: function (date: Date) {
        return date.getDate().toString();
      },
      formatMonthViewDayHeader: function (date: Date) {
        return 'MonMH';
      },
      formatMonthViewTitle: function (date: Date) {
        return 'testMT';
      },
      formatWeekViewDayHeader: function (date: Date) {
        return 'MonWH';
      },
      formatWeekViewTitle: function (date: Date) {
        return 'testWT';
      },
      formatWeekViewHourColumn: function (date: Date) {
        return 'testWH';
      },
      formatDayViewHourColumn: function (date: Date) {
        return 'testDH';
      },
      formatDayViewTitle: function (date: Date) {
        return 'testDT';
      }
    }
  };

  constructor(
    private localStorageService: LocalStorageService,
    private notesService: NotesService
  ) {
    this.onInit();
  }

  async onInit() {
    await this.getNotes();
    await this.localStorageService.getProjectData().then(
      (project) => this.project = project
    );
  }

  async getNotes() {
    // En este metodo todos los proyectos.
    const id: string = (await this.localStorageService.getProjectData()).id;
    if (id) {
      await this.notesService.getNotesByDate(id, this.date).subscribe(
        notes => {
          this.notes = notes;
          console.log(notes);
        }
      );
    }
  }

  onTimeSelected(ev) {
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
      (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);

    this.date = new Date(ev.selectedTime);

    console.log('aaa', this.date.toUTCString());

    this.getNotes();
  }

  onCurrentDateChanged(event: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }

  /*
  loadEvents() {
    this.eventSource = this.createRandomEvents();
  }
  */

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onRangeChanged(ev) {
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }

  markDisabled = (date: Date) => {
    const current = new Date();
    current.setHours(0, 0, 0);
    return date < current;
  };

  formatDate(date) {
    return moment(date.toDate().toString()).format('dddd, D MMMM YYYY');
  }
}
