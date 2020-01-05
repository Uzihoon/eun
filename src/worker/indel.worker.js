export default () => {
  onmessage = e => {
    const data = e.data;
    let seq = "";
    let seq_type = "";
    let target_rna = "";

    const result = [];
    const dataLen = data.length;

    data.forEach(d =>
      Object.keys(d.value).forEach(v => {
        const target = d.value[v];
        const isOver = seq.length < target.standard_seq.length;
        seq = isOver ? target.standard_seq : seq;
        target_rna = isOver ? target.seq_target : target_rna;
      })
    );

    console.log(seq);
    for (let i = 0; i < dataLen; i++) {
      const label = data[i].key;
      const value = data[i].value;
      if (!value) {
        postMessage({ error: true });
        return;
      }

      const valList = Object.keys(value);
      const finalIndel = [];

      // default sp-cas9
      seq_type = value.seq_type || 1;

      let seq_target = "";
      let standard_seq = "";
      for (let i in value) {
        const target = value[i];
        const total = target.tot_count;
        const target_seq = target.standard_seq;

        if (!target_seq) {
          postMessage({ error: true });
          return;
        }

        standard_seq = target_seq;
        seq_target = target.seq_target;

        target.table
          .filter(table => table.type !== 0)
          .map(t => {
            const origin = t.origin.split("").slice(0, seq.length);
            const change = t.change.split("").slice(0, seq.length);
            const count = t.count;

            const inputIndel = (isINDEL, index) => {
              const x = index + 1;
              const dataset = finalIndel[index] || {};
              const prev = dataset.y || 0;
              const data = (count / total) * 100;
              const y = isINDEL ? data / valList.length + prev : prev;
              finalIndel[index] = { x, y };
            };

            if (origin.length === change.length) {
              for (let j = 0; j < origin.length; j++) {
                const isINDEL = origin[j] === "-" || change[j] === "-";
                inputIndel(isINDEL, j);
              }
            } else {
              const list = [origin, change];
              list.map(l =>
                l.map((s, k) => {
                  const isINDEL = s === "-";
                  inputIndel(isINDEL, k);
                })
              );
            }
          });
      }

      result.push({ indel: finalIndel, label, standard_seq, seq_target });
    }

    postMessage({ result, seq, seq_type, target_rna });
  };
};
