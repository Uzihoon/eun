const self = this;

export default () => {
  self.onmessage = e => {
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
    const analysis = Object.keys(analysisList).sort((a, b) =>
      b.localeCompare(a)
    );
    const dataset = analysis.map(id => {
      const item = analysisList[id];
      const total = item.tot_count;
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

    self.postMessage(dataset);
  };
};
