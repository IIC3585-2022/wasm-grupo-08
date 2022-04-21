#!/usr/bin/env bash

emcc -sEXPORTED_FUNCTIONS=_partition,_malloc,_free -sEXPORTED_RUNTIME_METHODS=ccall -sWASM_ASYNC_COMPILATION=1 -O3 -o main_async.js main.cpp
emcc -sEXPORTED_FUNCTIONS=_partition,_malloc,_free -sEXPORTED_RUNTIME_METHODS=ccall -sWASM_ASYNC_COMPILATION=0 -O3 -o main_sync.js  main.cpp
mv *.{js,wasm} ../js