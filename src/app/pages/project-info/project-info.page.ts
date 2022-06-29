import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import * as tz from 'moment-timezone';
import { Project } from 'src/app/models/project';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.page.html',
  styleUrls: ['./project-info.page.scss'],
})
export class ProjectInfoPage implements OnInit {

  project: Project;
  formProject: FormGroup;
  error = false;

  constructor(
    private localStorageService: LocalStorageService,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private projectsService: ProjectsService,
  ) { }

  async ngOnInit() {
    this.project = await this.localStorageService.getProjectData();
    this.initForm();
  }

  initForm() {
    this.formProject = this.formBuilder.group(
      {
        newFinalDate: new FormControl('', [
          Validators.required
        ]),
      }
    );
  }

  formatDateString(date: string) {
    return moment(date).format('dddd, D MMMM YYYY');
  }

  formatDateStringCalendar(date: string) {
    return moment(date).format('YYYY-MM-DD').toString();
  }

  retroceder() {
    this.navController.navigateBack(['/tabs/tab1']);
  }

  async updateProject(){
    if (this.formProject.valid) {
      const newFinalDate =  new Date(tz.tz(this.formProject.get('newFinalDate').value, 'America/Bogota').format());
      console.log(newFinalDate.toDateString());
      console.log(moment(newFinalDate.toUTCString()).format('dddd, D MMMM YYYY'));
      if (newFinalDate > new Date(this.project.finalDate)) {
        let dates: string[] = [];
        if (this.project.extensionHistory) {
          dates = this.project.extensionHistory;
        }
        dates.push(newFinalDate.toISOString());
        await this.projectsService.updateProjectValue(this.project.id, {finalDate: newFinalDate.toISOString()});
        await this.projectsService.updateProjectValue(this.project.id, {extensionHistory: dates});
      } else {
        this.error = true;
        console.log('');
      }
    } else {
      this.error = true;
    }
  }
}
