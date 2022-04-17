importScripts('main_sync.js');
const { expTime } = Module;

this.onmessage = (m) => {
  const t0 = Date.now();
  expTime(m.data.value);
  const t1 = Date.now();
  this.postMessage((t1 - t0) / 1000);
};
