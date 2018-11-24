import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material';
import { DataService } from 'src/app/services/data-service';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataService) {
      // this.data = this.data.node;
      // this.data. = this.data.data;
      // this.data['id'] = this.data.node.id;
     }

  ngOnInit() {
  }

  save(){
    this.dataService.addIssue(this.data)
  }
}
