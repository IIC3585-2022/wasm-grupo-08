#include <emscripten/bind.h>
#include <math.h>

int expTime(int n) {
  int result = 0;
  for (int i = 0; i < pow(2, n); i++) result++;
  return result;
}
// emcc -lembind -o main.js main.cpp -s WASM_ASYNC_COMPILATION=0
EMSCRIPTEN_BINDINGS(module) {
    emscripten::function("expTime", &expTime);
}


