const {gql} = require("apollo-server");


module.exports = gql`
type Book {
    title: String
    author: String
}
input StoreInput {
    store_name: String
    price: String
    url: String
    currency: String
}
type Stores {
    store_name: String
    price: String
    url: String
    currency: String
}
type Product {
    barcode: Int!
    barcode_type: String!
    barcode_formats: String
    mpn: String
    model: String
    asin: String
    product_name: String
    title: String
    category: String
    manufacturer: String
    brand: String
    label: String
    author: String
    publisher: String
    artist: String
    actor: String
    director: String
    studio: String
    genre: String
    audience_rating: String
    ingredients: String
    nutrition_facts: String
    color: String
    package_quantity: String
    size: String
    length: String
    width: String
    height: String
    weight: String
    release_date: String
    description: String
    features: [String]
    images: [String]
    stores: [Stores]
}
type Subscription {
    bookAdded: Book!
    productAdded: Product!
}
type status_response{
    status: String!
}
type Query {
    books: [Book]
    products: [Product]
}
type Mutation {
    addBook(title: String!, author: String!): Book!
    deleteBook(title: String!, author: String!): status_response!
    addProduct(barcode: Int!,
        barcode_type: String!,
        barcode_formats: String,
        mpn: String,
        model: String,
        asin: String,
        product_name: String,
        title: String,
        category: String,
        manufacturer: String,
        brand: String,
        label: String,
        author: String,
        publisher: String,
        artist: String,
        actor: String,
        director: String,
        studio: String,
        genre: String,
        audience_rating: String,
        ingredients: String,
        nutrition_facts: String,
        color: String,
        package_quantity: String,
        size: String,
        length: String,
        width: String,
        height: String,
        weight: String,
        release_date: String,
        description: String,
        features: [String],
        images: [String],
        stores: [StoreInput]
    ): Product!
}
`;