import fs from 'fs';

class Archivos {

    #fileName = "content.txt";

    constructor(fileName) {
        if (fileName) {
            this.#fileName = fileName;
        }
    }

    async leer() {
        try {
            let content = await fs.promises.readFile(this.#fileName, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            if (error.errno == "-4058") {
                await fs.promises.writeFile(this.#fileName, "[]");
                return [];
            }
        }
    }

    async guardar(product) {
        try {
            let content = await this.leer();
            product.id = content.length + 1;
            content.push(product);
            content = JSON.stringify(content);
            await fs.promises.writeFile(this.#fileName, content);
            return product;
        } catch (error) {
            return "El producto no fue guardado.";
        }
    }

    async borrar() {
        try{
            await fs.promises.unlink(this.#fileName);
            return "Archivo eliminado";
        } catch(error){
            return "Archivo no fue eliminado.";
        }
    }
}

export default Archivos;