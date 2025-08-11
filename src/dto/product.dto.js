class ProductDTO {
    constructor({ title, description, price, code, stock, category, thumbnails }) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails;
    }
}

module.exports = ProductDTO;