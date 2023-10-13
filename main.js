import { Container, Scheduler, StringHelper } from "@bryntum/scheduler";
import "@bryntum/scheduler/scheduler.stockholm.css";
import "./style.css";
import Task from "./lib/Task";

const colorOnTime = "#4e79a7",
  colorLate = "#f28e2b";

const scheduler = new Scheduler({
  appendTo: document.body,
  date: new Date(2024, 4, 20),
  viewPreset: "year",
  features: {
    // Customize the event editor
    eventEdit: {
      editorConfig: {
        autoUpdateRecord: true,
        items: {
          dueField: {
            type: "date",
            label: "Due",
            name: "due",
            weight: 100,
          },
        },
      },
    },
    summary: {
      summaries: [
        { label: "Total", renderer: ({ events }) => events.length || 0 },
        {
          label: "Late",
          renderer: ({ events }) => {
            const value =
              events.filter((event) => {
                return new Date(event.endDate) > new Date(event.due);
              }).length || 0;
            return `<span style="color: ${colorLate}; font-weight: bold">${value}</span>`;
          },
        },
        {
          label: "On Time",
          renderer: ({ events }) => {
            const value =
              events.filter((event) => {
                return new Date(event.endDate) <= new Date(event.due);
              }).length || 0;
            return `<span style="color: ${colorOnTime}; font-weight: bold">${value}</span>`;
          },
        },
      ],
    },
  },
  crudManager: {
    autoLoad: true,
    eventStore: {
      modelClass: Task,
    },
    transport: {
      load: {
        url: "http://localhost:3000/api/download",
      },
    },
  },
  columns: [
    {
      type: "resourceInfo",
      text: "Workers",
      width: 160,
      editor: false,
      sum: "count",
      summaryRenderer: ({ sum }) => "Workers: " + sum,
    },
  ],
  eventRenderer({ renderData, eventRecord }) {
    const { endDate, due } = eventRecord.data;
    const late = new Date(endDate) > new Date(due);
    if (late) {
      renderData.eventColor = colorLate;
    } else {
      renderData.eventColor = colorOnTime;
    }
    return StringHelper.xss`${eventRecord.name}`;
  },
});

const container = new Container({
  appendTo: document.body,
  cls: "legend",
  width: 120,
  items: {
    late: {
      type: "displayfield",
      label: "Late",
      value: "",
      cls: "legendItemLate",
    },
    onTime: {
      type: "displayfield",
      label: "On Time",
      value: "",
      cls: "legendItemOnTime",
    },
  },
});
