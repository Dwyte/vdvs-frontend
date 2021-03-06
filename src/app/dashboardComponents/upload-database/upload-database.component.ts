import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-upload-database',
  templateUrl: './upload-database.component.html',
  styleUrls: ['./upload-database.component.scss']
})
export class UploadDatabaseComponent implements OnInit {

  private filesToUpload = null;

  constructor(private http: HttpClient, private auth: AuthService,  private notifier: NotifierService) { }

  ngOnInit() { }

  files(files) {
    this.filesToUpload = files;
  }

  upload(uploadForm: NgForm) {
    const authToken = this.auth.returnToken();
    const formData = new FormData();
    const files = this.filesToUpload;
    for (let i = 0; i < files.length; i++) {
      formData.append(`file${i}`, files.item(i), files.item(i).name);
    }
    const httpOption = {
      headers: new HttpHeaders({
        'Authorization': authToken
      })
    }
    this.notifier.notify('info', 'Please wait for a moment...');
    this.http.post<any>('http://localhost:3000/api/voters/import', formData, httpOption)
      .subscribe(
        data => { 
          //console.log(data.result);
          this.notifier.notify('success', 'Voters data successfully uploaded');
      }, err => {
          this.notifier.notify('error', err.error.message);
      }
    ); 
    uploadForm.resetForm();
  }

}
