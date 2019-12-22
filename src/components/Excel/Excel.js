import React from "react";
import ReactExport from "react-export-excel";
import moment from "moment";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Excel = ({ summary, format, download, excelData, analysisId }) => {
  const summaryText = summary[analysisId].map(e => e.data).join("");
  const summaryDataset = [
    {
      columns: ["Analysed Date"],
      data: [[moment().format("YYYY-MM-DD")]]
    },
    {
      columns: ["WT Sequence"],
      data: [[summaryText]]
    },
    {
      columns: ["crRNA sequence"],
      data: [[format[analysisId].seq_RGEN]]
    }
  ].concat(excelData.main);
  const filename = `EUN-${moment().format("YYYY-MM-DD")}`;
  return (
    <ExcelFile hideElement={download} filename={filename}>
      <ExcelSheet name="Summary" dataSet={summaryDataset} />
      <ExcelSheet name="Sequence" dataSet={excelData.sequence} />
      {excelData.dataset.map((e, i) => (
        <ExcelSheet key={i} name={e.id} dataSet={e.data} />
      ))}
    </ExcelFile>
  );
};

export default Excel;
