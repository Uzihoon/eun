export default () => {
  onmessage = e => {
    const data = e.data;
    const regex = /[^|]/g;
    let seq = "";

    const result = [];

    function handleINDLE(seq, index) {}

    for (let i = 0; i < data.length; i++) {
      const dataLen = data.length;
      const label = data[i].key;
      const value = data[i].value;
      const finalIndel = [];
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

        seq = seq.length < target_seq.length ? target_seq : seq;
        standard_seq = target_seq;
        seq_target = target.seq_target;
        target.table
          .filter(table => table.type !== 0)
          .map(t => {
            const origin = t.origin.split("");
            const change = t.change.split("");
            const count = t.count;

            const inputIndel = (isINDEL, index) => {
              const x = index + 1;
              const dataset = finalIndel[index] || {};
              const prev = dataset.y || 0;
              const data = (count / total) * 100;
              const y = isINDEL ? data + prev : prev;

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

    postMessage({ result, seq });
  };
};
