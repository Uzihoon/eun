export default () => {
  onmessage = e => {
    const data = e.data;
    console.log(data);
    const regex = /[^|]/g;
    let seq;

    const result = [];

    for (let i = 0; i < data.length; i++) {
      let dataLen = 0;
      const label = data[i].key;
      const value = data[i].value;
      const finalIndel = [];
      const store = {};

      for (let i in value) {
        ++dataLen;
        const target = value[i];
        const total = target.tot_count;
        seq = target.standard_seq;

        target.table
          .filter(table => table.type === 1 || table.type === 2)
          .map(t => {
            const g = t.graphic;
            const indelList = g.match(regex) || [];
            const indelCount = indelList.length * t.count;
            const avg = (indelCount / total) * 100;
            const prevValue = store[g] || 0;
            store[g] = prevValue + avg;
          });
      }

      for (let i in store) {
        const graphic = i;
        for (let g in graphic) {
          const target = graphic[g];
          const prev = finalIndel[g] || 0;
          if (target !== "|") {
            finalIndel[g] = prev + store[i] / dataLen;
          } else {
            finalIndel[g] = prev;
          }
        }
      }
      result.push({ indel: finalIndel, label });
    }

    postMessage({ result, seq });
  };
};
