import * as fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.loadFile();
  }

  async addProduct(producto) {
    producto.id = this.idIncrement;
    // Validamos que todos los campos esten rellenados
    if (!this.validateDataProduct(producto)) return {code: 400, status: 'Bad Request', message: 'Todos los campos son requeridos'};

    const prodsJSON = await fs.promises.readFile(this.path, 'utf-8');
    const prods = JSON.parse(prodsJSON);
    // Validamos que no exista otro producto con el mismo codigo
    if (prods.some(prod => prod.code === producto.code)) return {code: 400, status: 'Bad Request', message: 'Codigo existente'};

    prods.push(producto);
    await fs.promises.writeFile(this.path, JSON.stringify(prods));
    this.idIncrement++;
    return {code: 201, status: 'Created', message: 'Producto agregado'};
  }

  async getProducts() {
    const prodsJSON = await fs.promises.readFile(this.path, 'utf-8');
    return JSON.parse(prodsJSON);
  }

  async getProductById(id) {
    const prodsJSON = await fs.promises.readFile(this.path, 'utf-8');
    const prods = JSON.parse(prodsJSON);
    if (prods.some(prod => prod.id === parseInt(id))) {
      return {code: 200, status: 'Ok', products: prods.find(prod => prod.id === parseInt(id))};
    }
    return {code: 400, status: 'Bad Request', message: 'Producto no encontrado'};
  }

  async updateProduct(id, {title, description, price, thumbnail, code, stock}) {
    // Validamos que todos los campos esten rellenados
    if (!this.validateDataProduct({title, description, price, thumbnail, code, stock})) return {code: 400, status: 'Bad Request', message: 'Todos los campos son requeridos'};

    const prodsJSON = await fs.promises.readFile(this.path, 'utf-8');
    const prods = JSON.parse(prodsJSON);

    if (prods.some(prod => prod.id === parseInt(id))) {
      const idx = prods.findIndex(prod => prod.id === parseInt(id));
      // Validamos que no exista otro producto con el mismo codigo
      if (prods.some(prod => prod.code === code) && prods[idx].code !== code) return {code: 400, status: 'Bad Request', message: 'Codigo existente'};

      prods[idx].title = title;
      prods[idx].description = description;
      prods[idx].price = price;
      prods[idx].thumbnail = thumbnail;
      prods[idx].code = code;
      prods[idx].stock = stock;

      await fs.promises.writeFile(this.path, JSON.stringify(prods));
      return {code: 200, status: 'Ok', message: 'Producto actualizado'};
    }
    return {code: 400, status: 'Bad Request', message: 'Producto no encontrado'};
  }

  async deleteProduct(id) {
    const prodsJSON = await fs.promises.readFile(this.path, 'utf-8');
    const prods = JSON.parse(prodsJSON);
    if (prods.some(prod => prod.id === parseInt(id))) {
      const prodsFilter = prods.filter(prod => prod.id !== parseInt(id));
      await fs.promises.writeFile(this.path, JSON.stringify(prodsFilter));
      return {code: 200, status: 'Ok', message: 'Producto eliminado'};
    }
    return {code: 400, status: 'Bad Request', message: 'Producto no encontrado'};
  }

  validateDataProduct = (product) => {
    let valid = true;
    Object.values(product).forEach((val) => {
      if (val === null || val === undefined) {
        valid = false;
      }
    });
    return valid;
  }

  loadFile = async() => {
    if (!fs.existsSync(this.path)) {
      fs.promises.writeFile(this.path, "[]");
      this.idIncrement = 1;
    } else {
      const prodsJSON = await fs.promises.readFile(this.path, 'utf-8');
      const prods = JSON.parse(prodsJSON);
      this.idIncrement = prods.length + 1;
    }
  }
}

export default ProductManager;
