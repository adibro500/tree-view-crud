import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, ViewChild, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatTreeNestedDataSource, MatTree } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../services/data-service';
import { MatDialog } from '@angular/material';
import { AddDialogComponent } from '../dialogs/add-dialog/add-dialog.component';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { EditDialogComponent } from '../dialogs/edit-dialog/edit-dialog.component';
import {CdkTree} from '@angular/cdk/tree';
/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
export enum LocationConstants {
  WAREHOUSE = "WAREHOUSE", ROOM = "ROOM", SECTION = "SECTION"
}

export class FileNode {
  id: number;
  parentId: number;
  filename: string;
  type: LocationConstants;
  level: number;
  children: FileNode[];
  input_type: string;
  code: string;
  desc: string;
  item_group: number;
  active: boolean;
  effective_date:string;
}

/**
 * The Json tree data in string. The data could be parsed into Json object
 */
const TREE_DATA = {
  Location: {
    level1_sl1: {
      level2_sl1: {
        compiler: 'ts',
        core: 'ts'
      }
    },
    level1_sl2: {
      level2_sl1: {
        button: 'ts',
        checkbox: 'ts',
        input: 'ts'
      }
    }
  }
}

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */

@Injectable()
export class FileDatabase {

  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  parentNodeMap = new Map<FileNode, FileNode>();

  constructor() {
    // this.initialize();
  }



  // treeData = [{ "id": 0, "type": LocationConstants.WAREHOUSE, "level": 0, "filename": "Location", "parentId": null, "children": [{ "filename": "new item 1", "children": [], "level": 1, "parentId": 0, "id": 1.1 }] }] as FileNode[];
  initialize(treeData) {
    // Parse the string to json object.
    const dataObject = TREE_DATA;
    const fakeDataObjecct = { Location: {} }

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    // input as array

    //const data = this.buildFileTree(fakeDataObjecct, 0);
    const data = treeData;
    console.log(this.data);

    //this.populateParentMap(this.treeData);

    // Notify the change.
    this.dataChange.next(data);
  }


  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: object, level: number): FileNode[] {
    // @pankaj This should recive Root node of Tree of Type FileNode
    // so we dont have to create a new node and use it as it is
    //console.log(obj);
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      // console.log(key);
      const value = obj[key];
      const node = new FileNode();
      node.id = level;

      node.level = level;
      node.filename = key;
      node.parentId = null;
      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item Tree node */
  public insertItem(parent: FileNode, nNode: FileNode) {
    if (parent.children) {
      //console.log("insert ")

      //if (parent.type !== 'SECTION') {
        let newNode = new FileNode();
        newNode.filename = nNode.filename;
        newNode.children = [];
        newNode.level = parent.level + 1;
        console.log(newNode.level);
        newNode.parentId = parent.id;
        newNode.id = newNode.level + ((parent.children.length + 1) / 10.0);
        newNode.input_type = nNode.input_type;
        newNode.code = nNode.code;
        newNode.desc = nNode.desc;
        newNode.item_group = nNode.item_group;
        newNode.active = nNode.active;
        newNode.effective_date = nNode.effective_date;

        console.log(parent.children.length);
        console.log(newNode.id);

        parent.children.push(newNode);
        this.parentNodeMap.set(newNode, parent);
        //console.log(newNode);

      //} else {
        console.log("No More Nodes can be inserted");
      //}
      //this.dataChange.next(this.data);
    }

  }
  public removeItem(currentNode: FileNode, root: FileNode) {
    //const parentNode = this.parentNodeMap.get(currentNode);
    const parentNode = this.findParent(currentNode.parentId, root);
    console.log("parentNode " + JSON.stringify(parentNode))
    const index = parentNode.children.indexOf(currentNode);
    if (index !== -1) {
      parentNode.children.splice(index, 1);
      this.dataChange.next(this.data);
      this.parentNodeMap.delete(currentNode);
    }
    console.log("currentNode" + index);

  }
  updateItem(node: FileNode) {
    // node.input_type = node.input_type;
    node = node;
    console.log(this.data)
    this.dataChange.next(this.data);
  }
  public findParent(id: number, node: any): any {

    console.log("id " + id + " node" + node.id);
    if (node != undefined && node.id === id) {
      return node;
    } else {
      console.log("ELSE " + JSON.stringify(node.children));
      for (let element in node.children) {
        console.log("Recursive " + JSON.stringify(node.children[element].children));
        if (node.children[element].children != undefined && node.children[element].children.length > 0) {
          return this.findParent(id, node.children[element]);
        } else {
          continue;
        }


      }

    }


  }

}

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'app-tree-nested',
  templateUrl: './tree-nested.component.html',
  styleUrls: ['./tree-nested.component.css']
})
export class TreeNestedComponent implements OnInit{
  @ViewChild('treeSelector') tree: MatTree<any>;
  @ViewChild('treeSelector2') tree2: any;

  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;
  nestedDataSource2: MatTreeNestedDataSource<FileNode>;
  nestedTreeControl2: NestedTreeControl<FileNode>;

  //
  locationType = Object.keys(LocationConstants);
@Input()
treeData:FileNode[] = [];

  constructor(public database: FileDatabase,public dialog: MatDialog,
    public dataService: DataService,
    private changeDetectorRefs: ChangeDetectorRef) {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.nestedTreeControl2 = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource2 = new MatTreeNestedDataSource();

    database.dataChange.subscribe(data => this.nestedDataSource.data = data);
    
    console.log(this.locationType);

  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;
  /** Select the category so we can insert the new item. */
  addNewItem(node: FileNode) {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: {node: node}
    });



    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.database.insertItem(node, this.dataService.getDialogData());
        //this.tree.renderNodeChanges(this.database.data);
        this.nestedTreeControl.expand(node);
        //console.log(this.nestedTreeControl);
    
        this.renderChanges()
        this.getTree();
      }})
    
  }

  public remove(node: FileNode) {
    console.log("currentNode");
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {node: node}
    });



    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.database.removeItem(node, this.database.data[0]);
        this.renderChanges()
        this.getTree();
      }})
   

  }

  editItem(node:FileNode) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {node: node}
    });



    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
    //  let idx = this.database.dataChange.value.findIndex(x => x.id === node.id);
    this.database.updateItem(this.dataService.getDialogData()) 
    this.renderChanges();
    this.getTree(); 
    // this.tree.renderNodeChanges(this.nestedDataSource.data);
    }})
  }

  renderChanges() {
    let data = this.nestedDataSource.data;
    this.nestedDataSource.data = null;
    this.nestedDataSource.data = data;
    // this.changeDetectorRefs.detectChanges();

  }

  getTree() {
    console.log(JSON.stringify(this.database.data));


  }

  check() {
    console.log("parent ", JSON.stringify(this.database.findParent(1.1, this.database.data[0])));
  }

  public getArr(node: FileNode) {
    let arr = [];
    if (node.level === 0)
      arr = [LocationConstants.WAREHOUSE];

    else {
      // console.log("locarr" + this.locationType);

      arr = this.locationType.slice(node.level)
      //console.log("arr");


    }
    console.log(arr);
    return arr;
  }

  ngOnInit() {
    this.database.initialize(this.treeData);
  }

}

