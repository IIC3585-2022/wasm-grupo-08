# Tarea 3 WASM - Grupo 8
## Instrucciones
- `git clone https://github.com/IIC3585-2022/wasm-grupo-08.git`
- `cd wasm-grupo-08`
- `python -m http.server`
- Abrir [`http://0.0.0.0:8000/`](http://0.0.0.0:8000/) en un navegador

## Compilar main.cpp
- Instalar y activar [Emscripten](https://emscripten.org/docs/getting_started/downloads.html).
- `cd cpp`
- `./compile.bash`
- El comando anterior compila `main.cpp` y deja los archivos `.js` y `.wasm` en la carpeta `wasm-grupo-08/js`.
- Si la página sigue utilizando una versión anterior del código se arregla con borrar la caché del navegador.
