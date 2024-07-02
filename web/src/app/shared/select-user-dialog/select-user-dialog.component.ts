import { filter } from 'rxjs';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { UserTableColumn } from '../utility/table';

export class SelectUserDialogTableColumn extends UserTableColumn {
  selected?: boolean;
}

@Component({
  selector: 'app-select-user-dialog',
  templateUrl: './select-user-dialog.component.html',
  styleUrls: ['./select-user-dialog.component.scss']
})
export class  SelectUserDialogComponent {
  displayedColumns = ["selected", "userCode", "name", "mobileNumber"]
  dataSource = new MatTableDataSource<SelectUserDialogTableColumn>();
  selected: SelectUserDialogTableColumn;
  doneSelect = new EventEmitter();
  total = 0;
  pageIndex = 0;
  pageSize = 10
  order = { userCode: "ASC" } as any;
  filterUserCode = "";
  filterName = "";
  filterContact = "";
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  userType: "STAFF" | "ADMIN" | "CLIENT";

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SelectUserDialogComponent>
    ) {
  }

  ngAfterViewInit(): void {
    this.init();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe((event: PageEvent)=> {
      const { pageIndex, pageSize } = event;
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.init();
    });
    this.dataSource.sort.sortChange.subscribe((event: MatSort)=> {
      const { active, direction } = event;
      if(active === "name") {
        this.order = { name: direction.toUpperCase()}
      } else if(active === "mobileNumber") {
        this.order = { mobileNumber: direction.toUpperCase()}
      } else {
        this.order = { userCode: direction.toUpperCase()}
      }
      this.init();
    });
  }

  init() {
    const filter: any[] = [
      {
        apiNotation: "userCode",
        filter: this.filterUserCode,
      },
      {
        apiNotation: "name",
        filter: this.filterName,
      },
      {
        apiNotation: "mobileNumber",
        filter: this.filterContact,
      },
      {
        apiNotation: "userType",
        filter: this.userType,
      },
    ];
    try {
      this.userService.getUsersByAdvanceSearch({
        order: this.order,
        columnDef: filter,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).subscribe(res=> {
        this.dataSource = new MatTableDataSource(res.data.results.map(x=> {
          return {
            userCode: x.userCode,
            name: x.name,
            userProfilePic:  x.userProfilePic?.file?.url,
            selected: this.selected?.userCode === x.userCode
          }
        }));
        this.total = res.data.total;
      });
    }catch(ex) {

    }
  }

  isSelected(item: SelectUserDialogTableColumn) {
    return this.dataSource.data.find(x=>x.userCode === item.userCode && x.selected) ? true : false;
  }

  selectionChange(currentItem: SelectUserDialogTableColumn, selected) {
    const items = this.dataSource.data;
    if(selected) {
      for(var item of items) {
        item.selected = currentItem.userCode === item.userCode;
      }
    }
    else {
      const items = this.dataSource.data;
      for(var item of items) {
        item.selected = false;
      }
    }
    this.dataSource = new MatTableDataSource<SelectUserDialogTableColumn>(items);
    this.selected = this.dataSource.data.find(x=>x.selected);
  }

  async doneSelection() {
    try {
      // this.spinner.show();
      const res = await this.userService.getByCode(this.selected.userCode).toPromise();
      // this.spinner.hide();
      if(res.success) {
        this.dialogRef.close(res.data);
      } else {
        const error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.snackBar.open(error, 'close', {panelClass: ['style-error']});
      }
    } catch(ex) {
      const error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(error, 'close', {panelClass: ['style-error']});
      // this.spinner.hide();
    }
  }
}
