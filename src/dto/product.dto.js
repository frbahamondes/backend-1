export default class ProductDTO {
    constructor(product) {
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.code = product.code;
        this.category = product.category;
        this.stock = product.stock;
        this.status = product.status;
        this.thumbnails = product.thumbnails || [];
    }
}
