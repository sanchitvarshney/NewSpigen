import printJS from 'print-js';
import fileDownload from "js-file-download";
import { TimeRangePickerProps } from 'antd';
import dayjs from 'dayjs';

export const printFunction = (buffer: ArrayBuffer) => {
  // Create a Blob with the correct type and data
  const file = new Blob([new Uint8Array(buffer)], { type: 'application/pdf' });

  // Create an object URL from the Blob
  const url = URL.createObjectURL(file);

  // Use printJS to print the document
  printJS(url);

  // Optionally, revoke the object URL after printing
  URL.revokeObjectURL(url);
};

export const downloadFunction = (buffer:any, filename:string) => {
  const file = new Blob([new Uint8Array(buffer)], {
    type: "application/pdf",
  });
  // const url = URL.createObjectURL(file);
  // return url;
  console.log(filename);
  fileDownload(file, `${filename}.pdf`);
};

export const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Today", value: [dayjs().startOf("day"), dayjs()] },
  { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs()] },
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];
