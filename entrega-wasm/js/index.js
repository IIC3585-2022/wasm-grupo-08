const expTimeJS = (n) => {
  let result = 0;
  const limit = Math.pow(2, n);
  for (let i = 0; i < limit; i++) result++;
  return result;
};


function check_sums(numbers, size, num_partitions, asignment) {
  let sums = new Array(num_partitions).fill(0);

  for (let i = 0; i < size; i++) {
    sums[asignment[i]] += numbers[i];
  }

  const sum = sums[0];
  for (let i = 1; i < num_partitions; i++) {
    if (sum !== sums[i]) {
      return false;
    }
  }

  return true;
}


function partition_rec(numbers, size, num_partitions, asignment, position) {
  // Base case
  if (position === size) {
    return check_sums(numbers, size, num_partitions, asignment);
  }

  for (let choice = 0; choice < num_partitions; choice++) {
    asignment[position] = choice;
    if (partition_rec(numbers, size, num_partitions, asignment, position+1)) return true;
  }

  return false;
}


function partition(numbers, size, num_partitions) {
  if (num_partitions < 1) return false;
  if (size < num_partitions) return false;

  let asignment = new Array(size);
  return partition_rec(numbers, size, num_partitions, asignment, 0);
}


const getBenchmarkValue = () => {
  const length = document.getElementById('benchmark-value').value;
  const min = 1;
  const max = 1000;
  return Uint32Array.from({length}, () => Math.floor(Math.random() * (max - min) + min))
};


const replaceValue = (which, value) => {
  document
    .getElementById(which)
    .getElementsByClassName('value')[0].innerHTML = `${value}s`;
};


document.getElementById('js').onclick = () => {
  let randomArray = getBenchmarkValue();
  const t0 = Date.now();
  randomArray = Uint32Array.from([2, 2, 2]);
  console.log(randomArray)
  console.log(partition(randomArray, randomArray.length, 3));
  const t1 = Date.now();
  replaceValue('js', (t1 - t0) / 1000);
};


Module.onRuntimeInitialized = () => {
  const { partition } = Module;
  document.getElementById('wasm').onclick = () => {
    let randomArray = getBenchmarkValue();
    const t0 = Date.now();
    randomArray = Uint32Array.from([2, 2, 2]);
    const ptr = Module._malloc(randomArray.byteLength);
    Module.HEAPU32.set(randomArray, ptr>>2);

    result = Module.ccall("partition", "boolean",
      ["number", "number", "number"],
      [ptr, randomArray.length, 3]);

    console.log(result);
    Module._free(ptr);
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
