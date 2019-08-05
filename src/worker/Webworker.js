export default class Webworker {
  constructor(worker) {
    const code = worker.toString();
    const blob = new Blob(["(" + code + ")"]);
    return new Webworker(URL.createObjectURL(blob));
  }
}
