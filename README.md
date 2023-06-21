# Coder Desafio N° 3

### `node run dev`

Ejecuta el servidor express el cual esta corriendo en el puerto 8080.

**http://localhost:8080/**

El proyecto ya cuenta con 10 registros de productos.

### `Peticiones GET`

#### `http://localhost:8080/products`

Devuelve los 10 productos.

#### `http://localhost:8080/products?limit=5`

Devuelve los 5 primeros productos de los 10 que se encuentran registrados.

#### `http://localhost:8080/products/2`

Devuelve el producto con el **id = 2**.

#### `http://localhost:8080/products/234123123`

Al no existir el **id** del producto, devuelve un objeto de error indicando que el producto no existe.