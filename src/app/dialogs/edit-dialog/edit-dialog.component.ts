import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/services/data-service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit, OnChanges {

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataService) {
      this.data = this.data.node;
      // this.data. = this.data.data;
      // this.data['id'] = this.data.node.id;
     }

  ngOnInit() {
  }

  save(){
    this.dataService.updateIssue(this.data)
  }

  ngOnChanges() {
    this.dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.data = {};
      }})
  }
  
}
