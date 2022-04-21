importScripts('main.js');

this.onmessage = (m) => {
  const randomArray = m.data;
  const t0 = Date.now();

  const ptr = Module._malloc(randomArray.byteLength);
  Module.HEAPU32.set(randomArray, ptr>>2);

  const result = Module.ccall("partition", "boolean",
    ["number", "number", "number"],
    [ptr, randomArray.length, 3]);

  Module._free(ptr);
  console.log(`Result: ${result}`);

  const t1 = Date.now();
  this.postMessage((t1 - t0) / 1000);
};