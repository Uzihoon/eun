export default () => {
  onmessage = e => {
    if (!e) return;
    const data = e.data;
    const { analysisList, resultList, sequenceCharList, format } = data;
    const excelList = [
      {
        title: "ID",
        key: "id"
      },
      {
        title: "WT Sequence",
        key: "origin"
      },
      {
        title: "Treated Sequence",
        key: "change"
      },
      {
        title: "Length",
        key: "length"
      },
      {
        title: "Count",
        key: "count"
      },
      {
        title: "Type",
        key: "type",
        render: text => {
          if (+text === 0) return "WT or Sub";
          if (+text === 1) return "INS";
          return "DEL";
        }
      },
      {
        title: "HDR",
        key: "hdr",
        render: text => {
          if (text < -1) return "N/A";
          if (text === -1) return "X";
          return "O";
        }
      }
    ];

    const mainColList = [
      {
        title: "ID",
        key: "fileId"
      },
      {
        title: "More than minimum frequency",
        key: "tot_count"
      },
      {
        title: "Insertions",
        key: "cnt_ins"
      },
      {
        title: "Deletions",
        key: "cnt_del"
      },
      {
        title: "Substitution frequency",
        key: "",
        render: item => {
          const changed = item.changed || 0;
          const total = item.tot_count;

          return +((changed / total) * 100).toFixed(2);
        }
      }
    ];

    const analysis = Object.keys(analysisList).sort((a, b) => {
      const findNumber = new RegExp(/[0-9]+/);
      const firstNumber = a.match(findNumber);
      const lastNumber = b.match(findNumber);
      const prev = firstNumber && firstNumber.length > 0 ? +firstNumber[0] : a;
      const next = lastNumber && lastNumber.length > 0 ? +lastNumber[0] : b;

      return prev - next;
    });

    const mainData = [];
    const sequenceExcelData = [];

    const dataset = analysis.map(id => {
      const item = analysisList[id];
      const total = item.tot_count;

      mainData.push(
        mainColList.map(main => {
          return main.render ? main.render(item) : item[main.key];
        })
      );

      const resultData = resultList.map(e => item[e.value]);
      const sequenceCount = sequenceCharList.map(e => {
        const data = item.chartIndex.map(k => {
          return k[e] > 0 ? ((k[e] / total) * 100).toFixed(1) : 0;
        });
        data.unshift(e);
        return data;
      });

      const sequenceData = item.table.map(k => {
        const data = excelList.map(j => {
          return j.render ? j.render(k[j.key]) : k[j.key];
        });
        return data;
      });
      const changeCol = [];
      for (let i = 0; i <= item.chartIndex; i++) {
        changeCol.push(String(i));
      }

      sequenceExcelData.push({ ySteps: 2, columns: [item.fileId], data: [] });
      sequenceExcelData.push({ columns: changeCol, data: sequenceCount });

      const changeValue =
        item.changed > 0
          ? ((item.changed / item.tot_count) * 100).toFixed(2) + "%"
          : 0;
      const itemData = [
        {
          columns: resultList.map(e => e.title),
          data: [resultData]
        },
        {
          ySteps: 2,
          columns: excelList.map(e => e.title),
          data: sequenceData
        },
        {
          ySteps: 2,
          columns: changeCol,
          data: sequenceCount
        },
        {
          ySteps: 2,
          columns: ["Original", "Change", "Value"],
          data: [[format.targetSeq, format.changeSeq, changeValue]]
        }
      ];
      return { id, data: itemData };
    });

    const main = {
      columns: mainColList.map(e => e.title),
      data: mainData,
      ySteps: 2,
      xSteps: 1
    };
    console.log(dataset);
    postMessage({ dataset, main, sequence: sequenceExcelData });
  };
};
