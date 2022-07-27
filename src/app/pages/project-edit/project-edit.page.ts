import { NavController } from '@ionic/angular';
import { Project } from 'src/app/models/project';
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import * as tz from 'moment-timezone';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.page.html',
  styleUrls: ['./project-edit.page.scss'],
})
export class ProjectEditPage implements OnInit {

  project: Project;
  newProject: Project;
  formProject: FormGroup;
  error = false;
  areEqualsFlag = true;

  alert = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: true,
    timer: 3000,
    timerProgressBar: true,
  });

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private navController: NavController,
    private projectsService: ProjectsService,
  ) { }

  async ngOnInit() {
    this.project = await this.localStorageService.getProjectData();
    this.newProject = this.project;
    this.initForm();
  }

  initForm() {
    this.formProject = this.formBuilder.group(
      {
        newName: new FormControl(this.project.name, [
          Validators.required
        ]),
        newContractNumber: new FormControl(this.project.contractNumber, [
          Validators.required,
        ]),
        newNIT: new FormControl(this.project.NIT, [
          Validators.required
        ]),
        newAddress: new FormControl(this.project.address, [
          Validators.required
        ]),
        newInitialDate: new FormControl(this.project.initialDate, [
          Validators.required
        ]),
        newFinalDate: new FormControl(this.project.finalDate, [
          Validators.required
        ]),
      }
    );
  }

  reestablecer() {
    this.formProject.get('newName').setValue(this.project.name);
    this.formProject.get('newContractNumber').setValue(this.project.contractNumber);
    this.formProject.get('newNIT').setValue(this.project.NIT);
    this.formProject.get('newAddress').setValue(this.project.address);
    this.formProject.get('newInitialDate').setValue(this.formatDateStringCalendar(this.project.initialDate));
    this.formProject.get('newFinalDate').setValue(this.formatDateStringCalendar(this.project.finalDate));
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

  async updateProject() {
    console.log(this.formProject.valid && !this.areEquals());
    if (this.areEquals()) {
      this.alert.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No haz realizado ningún cambio!',
      });
    } else {
      if (this.formProject.valid) {
        if (this.project.initialDate !== this.formProject.get('newName').value) {
          this.newProject.name = this.formProject.get('newName').value;
        }

        if (this.project.initialDate !== this.formProject.get('newContractNumber').value) {
          this.newProject.contractNumber = this.formProject.get('newContractNumber').value;
        }

        if (this.project.initialDate !== this.formProject.get('newNIT').value) {
          this.newProject.NIT = this.formProject.get('newNIT').value;
        }

        if (this.project.initialDate !== this.formProject.get('newAddress').value) {
          this.newProject.address = this.formProject.get('newAddress').value;
        }

        if (this.project.initialDate !== this.formProject.get('newInitialDate').value) {
          const initialDate = new Date(tz.tz(this.formProject.get('newInitialDate').value, 'America/Bogota').format());
          this.newProject.initialDate = initialDate.toISOString();
        }

        if (this.project.initialDate !== this.formProject.get('newFinalDate').value) {
          const finalDate = new Date(tz.tz(this.formProject.get('newFinalDate').value, 'America/Bogota').format());
          this.newProject.finalDate = finalDate.toISOString();
        }

        const resp = await this.projectsService.updateProject(this.project.id, this.newProject);
        console.log('resp', resp);

        if (resp !== 'error') {
          this.alert.fire({
            icon: 'success',
            title: 'Bien!!!',
            text: 'Proyecto actualizado correctamente',
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(
            async (result) => {
              if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                this.localStorageService.setProjectData(
                  this.newProject
                );
                this.retroceder();
              }
            }
          );
        } else {
          this.error = true;
          this.alert.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Parece que algo salió mal!',
          });
          console.log('');
        }
      }
    }
  }

  areEquals() {
    return (
      this.project.name === this.formProject.get('newName').value &&
      this.project.contractNumber === this.formProject.get('newContractNumber').value &&
      this.project.NIT === this.formProject.get('newNIT').value &&
      this.project.address === this.formProject.get('newAddress').value &&
      (this.project.initialDate === this.formProject.get('newInitialDate').value ||
        this.formProject.get('newInitialDate').value === this.formatDateStringCalendar(this.project.initialDate)) &&
      (this.project.finalDate === this.formProject.get('newFinalDate').value ||
        this.formProject.get('newFinalDate').value === this.formatDateStringCalendar(this.project.finalDate))
    );
  }

  async print() {
    console.log('form', this.formProject);
  }

  // nuevos

  initialMin() {
    const value = this.project.initialDate;
    const date = new Date(tz.tz(value, 'America/Bogota').format());
    this.finalMin();
    return moment(date).format('yyyy-MM-DD');
  }

  finalMin() {
    if (this.verifyDates()) {
      this.formProject.get('newFinalDate').setValue('');
      return '';
    } else {
      const value = this.formProject.get('newInitialDate').value;

      let initialDate = new Date();
      if (value) {
        initialDate = new Date(tz.tz(value, 'America/Bogota').format());
      }
      initialDate.setDate(initialDate.getDate() + 1);
      const a = moment(initialDate).format('yyyy-MM-DD');
      return a;
    }

    /*
    if (this.project.initialDate !== this.formProject.get('newFinalDate').value) {
      const finalDate = new Date(tz.tz(this.formProject.get('newFinalDate').value, 'America/Bogota').format());
      this.newProject.finalDate = finalDate.toISOString();
    }
    */
  }

  verifyDates() {
    const initialValue = this.formProject.get('newInitialDate').value;
    const finalValue = this.formProject.get('newFinalDate').value;
    if (initialValue !== '' && finalValue !== '') {
      const initialDate = new Date(tz.tz(initialValue, 'America/Bogota').format());
      const finalDate = new Date(tz.tz(finalValue, 'America/Bogota').format());
      if (finalDate <= initialDate) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

}
