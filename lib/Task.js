import { EventModel } from "@bryntum/scheduler";

// Simple task class with an extra due field
export default class Task extends EventModel {
  static get fields() {
    return [
      { name: "due" },
    ];
  }
}
