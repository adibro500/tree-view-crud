import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "tree-view-crud";
  treeData: any[] = [
    {
      id: 0,
      input_type: "Assets",
      item_type: "checkbox",
      level: 0,
      filename: "Location",
      parentId: null,
      code: "checkbox",
      desc: "aditya",
      item_group: 2,
      active: 100155,
      effective_date: "12/05/1991",
      children: [
      { filename: "new item 1", 
        children: [], 
        level: 1, 
        parentId: 0, 
        id: 1.1,
        item_type: "checkbox",
        input_type: "checkbox",
        code: "checkbox",
        desc: "aditya",
        item_group: 2,
        active: 100155,
        effective_date: "12/05/1991"
       }
      ]
    },
    
  ];
  treeData2: any[] = [
    {
      id: 0,
      item_type: "Assets",
      level: 0,
      filename: "Location",
      parentId: null,
      children: [
        { filename: "new item 1", children: [], level: 1, parentId: 0, id: 1.1 }
      ]
    },
    
  ];
}
