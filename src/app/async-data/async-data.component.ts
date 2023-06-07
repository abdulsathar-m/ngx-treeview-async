import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import {
  TreeviewItem, TreeviewConfig, TreeviewComponent
} from 'ngx-treeview';
import { AsyncDataService } from './async-data.service';


@Component({
  selector: 'ngx-async-data',
  styleUrls: ['./async-data.component.scss'],
  templateUrl: './async-data.component.html',
  providers: [
    AsyncDataService
  ]
})
export class AsyncDataComponent implements OnInit {
  @ViewChild(TreeviewComponent, { static: false }) treeviewComponent: TreeviewComponent;
  items: TreeviewItem[];
  values: string[] = [];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  _loadChildren: (item: TreeviewItem) => Promise<TreeviewItem[]>;
  constructor(
    private service: AsyncDataService
  ) { 
    this._loadChildren = this.loadChildren.bind(this);
  }

  async ngOnInit(): Promise<void> {
    this.items = await this.service.getData(null);
  }

  async loadChildren(item: TreeviewItem) {
    return this.service.getData(item);
  }

}
