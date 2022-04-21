
// Generate random array.
let _randomArray;
let _length = 0;
const MIN = 1;
const MAX = 1000;
const getRandomArray = () => {
  const newLength = document.getElementById('benchmark-value').value;
  if (newLength !== _length) {
    _length = newLength
    _randomArray = Uint32Array.from({length:_length}, () => Math.floor(Math.random() * (MAX - MIN) + MIN))
  }
  return _randomArray
};


// Update HTML value.
const replaceValue = (which, value) => {
  document
    .getElementById(which)
    .getElementsByClassName('value')[0].innerHTML = `${value}s`;
};


//---------//
// PURE JS //
//---------//
document.getElementById('js').onclick = () => {
  const randomArray = getRandomArray();
  const t0 = Date.now();

  const result = partition(randomArray, randomArray.length, 3);
  console.log(`Result: ${result}`);

  const t1 = Date.now();
  replaceValue('js', (t1 - t0) / 1000);
};


// Wait for WASM compilation.
Module.onRuntimeInitialized = () => {
  const { partition } = Module;

  //------//
  // WASM //
  //------//
  document.getElementById('wasm').onclick = () => {
    const randomArray = getRandomArray();
    const t0 = Date.now();

    const ptr = Module._malloc(randomArray.byteLength);
    Module.HEAPU32.set(randomArray, ptr>>2);

    const result = Module.ccall("partition", "boolean",
      ["number", "number", "number"],
      [ptr, randomArray.length, 3]);

    Module._free(ptr);
    console.log(`Result: ${result}`);

    const t1 = Date.now();
    replaceValue('wasm', (t1 - t0) / 1000);
  };

  //-------------------//
  // WASM + WEB WORKER //
  //-------------------//
  const worker = new Worker('./js/worker.js');
  worker.onmessage = (e) => {
    replaceValue('wasmworker', e.data);
  };
  document.getElementById('wasmworker').onclick = () => {
    worker.postMessage(getRandomArray());
  };
};




//-------------------//
// JS IMPLEMENTATION //
//-------------------//


// Check if the partitions have the same sum.
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


// Asign numbers to different partitions recursively.
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


// Check if the numbers can be partitioned into <num_partitions> sets with equal sum.
function partition(numbers, size, num_partitions) {
  if (num_partitions < 1) return false;
  if (size < num_partitions) return false;

  console.log(`JS Numbers: ${numbers}`);

  const asignment = new Array(size);
  return partition_rec(numbers, size, num_partitions, asignment, 0);
}