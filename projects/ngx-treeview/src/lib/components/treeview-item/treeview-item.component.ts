import { ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { isNil } from 'lodash';
import { TreeviewItem } from '../../models/treeview-item';
import { TreeviewConfig } from '../../models/treeview-config';
import { TreeviewItemTemplateContext } from '../../models/treeview-item-template-context';

@Component({
  selector: 'ngx-treeview-item',
  templateUrl: './treeview-item.component.html',
  styleUrls: ['./treeview-item.component.scss']
})
export class TreeviewItemComponent {
  @Input() config: TreeviewConfig;
  @Input() template: TemplateRef<TreeviewItemTemplateContext>;
  @Input() item: TreeviewItem;
  @Input() loadChildren: (item: TreeviewItem) => Promise<TreeviewItem[]>;
  @Output() checkedChange = new EventEmitter<boolean>();

  isLoadingChildren = false;

  constructor(
    private defaultConfig: TreeviewConfig
  ) {
    this.config = this.defaultConfig;
  }

  onCollapseExpand = async () => {
    if (this.isLoadingChildren) return;
    this.item.collapsed = !this.item.collapsed;
    try {
      if (!this.item.children && this.item.loadChildrenAsync && this.loadChildren) {
        this.isLoadingChildren = true;
        this.item.children = await this.loadChildren(this.item);
        this.isLoadingChildren = false;
      }
    } catch (error) {
      console.error(error);
      this.item.children = [];
      this.isLoadingChildren = false;
    }
  }

  onCheckedChange = () => {
    const checked = this.item.checked;
    if (!isNil(this.item.children) && !this.config.decoupleChildFromParent) {
      this.item.children.forEach(child => child.setCheckedRecursive(checked));
    }
    this.checkedChange.emit(checked);
  }

  onChildCheckedChange(child: TreeviewItem, checked: boolean): void {
    if (!this.config.decoupleChildFromParent) {
      let itemChecked: boolean = null;
      for (const childItem of this.item.children) {
        if (itemChecked === null) {
          itemChecked = childItem.checked;
        } else if (itemChecked !== childItem.checked) {
          itemChecked = undefined;
          break;
        }
      }

      if (itemChecked === null) {
        itemChecked = false;
      }

      if (this.item.checked !== itemChecked) {
        this.item.checked = itemChecked;
      }

    }

    this.checkedChange.emit(checked);
  }
}
