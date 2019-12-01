export default () => {
  onmessage = e => {
    const store = [];
    const data = e.data;
    for(let i in data) {
      const target = data[i];
      const indelList = target.table.map(t => {
        if(t.type === 1 || t.type === 2) {
          const target_seq = target.change_target[t.id] || "";
          
        }
      })
    }
  }
}