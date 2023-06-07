import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';

export class AsyncDataService {
  async getData(parent: TreeviewItem): Promise<TreeviewItem[]> {
    let items = [];
    let levelPrefix = '';
    if(parent) {
      levelPrefix = parent.text.replace('Level', '');
    }
    for (let i = 0; i < 10; i++) {
      items.push(new TreeviewItem({
        text: `Level${levelPrefix}_${i}`,
        value: `Level${levelPrefix}_${i}`,
        loadChildrenAsync: true,
        checked: false
      }));
    }
    return items;
  }
}
