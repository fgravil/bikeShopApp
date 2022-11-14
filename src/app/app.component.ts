import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { BikeService } from './services/bike.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Bike } from './models/bike';
import { forkJoin, zip } from 'rxjs';
import { Lookup } from './models/lookup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'bikeShop';
  displayedColumns: string[] = ['model', 'manufacturer', 'frameSize', 'price', 'action'];
  dataSource!: MatTableDataSource<Bike>;
  bikeManufacturers!: Lookup[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private bikeService: BikeService) {
  
  }
  ngOnInit() {
    this.getBikes();
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: {
        manufacturers: this.bikeManufacturers,
      }
    }).afterClosed().subscribe(val => {
      if(val === 'save') {
        this.getBikes();
      }
    });
  }

  editBike(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: {
        manufacturers: this.bikeManufacturers,
        bike: row
      }
    }).afterClosed().subscribe(val => {
      if(val === 'save') {
        this.getBikes();
      }
    });
  }
  getBikes() {
    forkJoin({
      bikes: this.bikeService.getBikes(),
      manufacturers: this.bikeService.getManufacturers()
    }).subscribe({
      next: (res) => {
          this.dataSource = new MatTableDataSource(res.bikes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.bikeManufacturers = res.manufacturers;
          console.log(res);
      },
        error: (err) => {
          console.log('ERR');
        }
    })
  }

  deleteBike(row: Bike) {
    this.bikeService.deleteBike(row.bikeId).subscribe({
      next: (res) => {
        this.getBikes();
      },
      error: (err) => {
        console.log('ERR');
      }
  });
  }
}
