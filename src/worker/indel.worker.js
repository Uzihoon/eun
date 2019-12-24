export default () => {
  onmessage = e => {
    const data = e.data;
    const regex = /[^|]/g;
    let seq = "";

    const result = [];

    for (let i = 0; i < data.length; i++) {
      let dataLen = 0;
      const label = data[i].key;
      const value = data[i].value;
      const finalIndel = [];
      const store = {};
      let seq_target = "";
      let standard_seq = "";
      console.log(value);

      for (let i in value) {
        ++dataLen;
        const target = value[i];
        const total = target.tot_count;
        const target_seq = target.standard_seq;

        if (!target_seq) {
          postMessage({ error: true });
          return;
        }

        seq = seq.length < target_seq.length ? target_seq : seq;
        standard_seq = target_seq;
        seq_target = target.seq_target;

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
          const dataset = finalIndel[g] || {};
          const prev = dataset.y || 0;
          const x = +g + 1;

          // seq 보다 많을 경우 멈춘다
          if (finalIndel.length >= seq.length) continue;

          if (target !== "|") {
            finalIndel[g] = { x, y: prev + store[i] / dataLen };
          } else {
            finalIndel[g] = { x, y: prev };
          }
        }
      }
      console.log(finalIndel);
      result.push({ indel: finalIndel, label, standard_seq, seq_target });
    }

    postMessage({ result, seq });
  };
};
