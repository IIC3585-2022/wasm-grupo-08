#!/usr/bin/env bash

emcc -sEXPORTED_FUNCTIONS=_partition,_malloc,_free -sEXPORTED_RUNTIME_METHODS=ccall -O3 -o main.js main.cpp
mv main.js main.wasm ../js