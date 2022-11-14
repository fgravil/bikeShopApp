import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Bike } from '../models/bike';
import { BikeService } from '../services/bike.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  bikeForm !: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private bikeService: BikeService, 
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit(): void {
    this.bikeForm = this.formBuilder.group({
      model: ['', Validators.required],
      manufacturerId: ['', Validators.required],
      frameSize: ['', Validators.required],
      price: ['', Validators.required]
    });

    if(this.dialogData.bike) {
      this.bikeForm.controls['model'].setValue(this.dialogData.bike.model);
      this.bikeForm.controls['manufacturerId'].setValue(this.dialogData.bike.manufacturerId);
      this.bikeForm.controls['frameSize'].setValue(this.dialogData.bike.frameSize);
      this.bikeForm.controls['price'].setValue(this.dialogData.bike.price);
    }
  }
  closeDialog(dialogResult: any = null) {
    this.bikeForm.reset();
    this.dialogRef.close(dialogResult);
  }
  
  editBike() {
    if(this.bikeForm.valid) {
      let bike = new Bike(this.bikeForm.value);
      bike.manufacturerId = Number(bike.manufacturerId);

      this.bikeService.editBike(this.dialogData.bike.bikeId, bike)
        .subscribe({
          next: (res) => {
            this.closeDialog("save");
          },
          error: () => {
            alert("Error while adding product");
          }
        })
    }
  }
  upsertBike() {
    if(this.dialogData.bike) {
      this.editBike();
      return;
    }

    if(this.bikeForm.valid) {
      let bike = new Bike(this.bikeForm.value);
      bike.manufacturerId = Number(bike.manufacturerId);

      this.bikeService.addBike(bike)
        .subscribe({
          next: (res) => {
            this.closeDialog("save");
          },
          error: () => {
            alert("Error while adding product");
          }
        })
    }
  }
}
