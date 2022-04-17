const expTimeJS = (n) => {
  let result = 0;
  for (let i = 0; i < Math.pow(2, n); i++) result++;
  return result;
};

const getBenchmarkValue = () => {
  return {
    value: parseInt(document.getElementById('benchmark-value').value),
  };
};

const replaceValue = (which, value) => {
  document
    .getElementById(which)
    .getElementsByClassName('value')[0].innerHTML = `${value}s`;
};

document.getElementById('js').onclick = () => {
  const { value } = getBenchmarkValue();
  const t0 = Date.now();
  expTimeJS(value);
  const t1 = Date.now();
  replaceValue('js', (t1 - t0) / 1000);
};

Module.onRuntimeInitialized = () => {
  const { expTime } = Module;
  document.getElementById('wasm').onclick = () => {
    const { value } = getBenchmarkValue();
    const t0 = Date.now();
    expTime(value);
    const t1 = Date.now();
    replaceValue('wasm', (t1 - t0) / 1000);
  };
};

const worker = new Worker('./js/worker.js');
worker.onmessage = (e) => {
  replaceValue('wasmworker', e.data);
};
document.getElementById('wasmworker').onclick = () => {
  worker.postMessage(getBenchmarkValue());
};
