class Vector extends Array {
  constructor(...components) {
    super(...components);
  }

  // Obtener la magnitud del vector
  magnitude() {
    return Math.sqrt(this.reduce((sum, component) => sum + component ** 2, 0));
  }

  // Sumar otro vector
  static add(...vectors) {
      if (vectors.length === 0) {
        throw new Error("Se requiere al menos un vector para sumar");
      }
  

      const dimension = vectors[0].length;
      if (!vectors.every(vector => vector.length === dimension)) {
        throw new Error("Todos los vectores deben tener la misma dimensión");
      }

      if(!vectors.every(element => element instanceof Vector)){
          throw new Error("Todos los elementos deben ser vectores");
      }
  
      const result = new Array(dimension).fill(0); // Crear un array de ceros con la misma longitud
  
      for (let vector of vectors) {
        for (let i = 0; i < dimension; i++) {
          result[i] += vector[i]; 
        }
      }
  
      return new Vector(...result);
    }

  // Restar otro vector
  static subtract(v,w) {
    if (v.length !== w.length) {
      throw new Error("Los vectores deben tener la misma dimensión");
    }
    return new Vector(...v.map((component, index) => component - w[index]));
  }

  // Producto escalar (dot product)
  static dot(v, w) {
    if (v.length !== w.length) {
      throw new Error("Los vectores deben tener la misma dimensión");
    }
    return v.reduce((sum, component, index) => sum + component * w[index], 0);
  }

  // Producto por un escalar
  scale(scalar) {
    return new Vector(...this.map(component => component * scalar));
  }

  // Normalizar el vector
  normalize() {
    const magnitude = this.magnitude();
    if (magnitude === 0) {
      throw new Error("No se puede normalizar un vector de magnitud cero");
    }
    return this.scale(1 / magnitude);
  }

  // Obtener el ángulo entre dos vectores
  angleTo(vector) {
    const dotProduct = this.dot(vector);
    const magnitudes = this.magnitude() * vector.magnitude();
    if (magnitudes === 0) {
      throw new Error("No se puede calcular el ángulo con un vector de magnitud cero");
    }
    return Math.acos(dotProduct / magnitudes);
  }

  // Mostrar el vector en forma de string
  toString() {
    return `Vector(${this.join(', ')})`;
  }
}
  
  