const self = this; // FAKE

const worker = () => {
  const postMessage = msg => self.postMessage(msg);

  self.onmessage = e => {
    if (!e) return;
    const data = e.data;

    const {
      rgen_type,
      seq_RGEN,
      seq_RGEN2,
      seq_wt,
      seq_hdr,
      end_range,
      filt_n,
      filt_r,
      files
    } = data;
  };
};

export default worker;
// const self = this;
// const worker = () => {
//   self.onmessage = e => {
//     console.log(e);
//   };
// };
// export default worker;
