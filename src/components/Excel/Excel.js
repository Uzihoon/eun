import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Excel = ({ summary, analysisList, format, resultList, excelList }) => {
  const summaryText = summary.map(e => e.data).join("");
  const analysis = Object.keys(analysisList);

  const dataset = (item, title) => {
    const resultData = resultList.map(e => item[e.value]);
    const sequenceData = item.table.map(k => {
      const data = excelList.map(j => {
        return j.render ? j.render(k[j.key]) : k[j.key];
      });
      return data;
    });

    const test = []
    for(let i = 0; i < 2; i++) {
      test.push(item.table[i])
    }
    
    return [
      {
        columns: ["WT Sequence", "crRNA sequence"],
        data: [[summaryText, format.seq_RGEN]]
      },
      {
        columns: resultList.map(e => e.title),
        data: [resultData]
      },
      {
        ySteps: 1,
        columns: excelList.map(e => e.title),
        data: [sequenceData, "aaa"]
      }
    ];
  };

  return (
    <ExcelFile element={<button>Download</button>}>
      {/*<ExcelSheet name="Summary">
        <ExcelColumn label="WT Sequence" value={summaryText} />
        <ExcelColumn label="crRNA sequence" value={format.seq_RGEN} />
      </ExcelSheet>*/}
      {analysis.map((e, i) => {
        const dataSet = dataset(analysisList[e], e);
        console.log(dataSet);
        return <ExcelSheet key={i} name={e} dataSet={dataSet} />;
      })}
    </ExcelFile>
  );
};

export default Excel;
