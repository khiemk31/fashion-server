module.exports = {
    categoryQuery: `select * from category where category_id =? and deleted_at is null`,
    productQuery: `select * from product where deleted_at is null and product_name =? `,
    insertProductQuery: `insert into product set ?`,
    productIDQuery: `select * from product where deleted_at is null and product_id=?`,
    showProductQuery: `select * from product where product_id=?`,
    updateQuery: `UPDATE product SET deleted_at= ? WHERE product_id= ?`,
    getLengthListProduct: `SELECT * FROM product`,
    getAllProduct: `SELECT product.product_id ,product.product_name,category.category_id, product.product_image , product.price , product.discount , product.deleted_at  from  product , category WHERE  product.category_id = category.category_id and category.deleted_at is NULL ORDER BY product.discount DESC`,
    getDetailProduct: `SELECT  product_id, product_name ,price ,discount ,product_image ,product_bgr1 ,product_bgr2 ,product_bgr3 FROM  product  WHERE product.product_id = ?`,
    getDetailProductWeb: `SELECT product.product_id, product.product_name ,product.price ,product.discount ,product.product_image ,product.product_bgr1 ,product.product_bgr2 ,product.product_bgr3 ,product.quantity_sold , product.created_at ,product.updated_at ,product.deleted_at ,category.category_name FROM  product ,category  WHERE category.category_id=product.category_id AND product.product_id = ?`,
    getListSizeDetailProduct: `select size , quantity from size where  product_id=?`,
    queryProductByCategory: `SELECT category.category_name , category.category_id , product.product_id ,product.product_name, product.product_image , product.price , product.discount  from  product , category WHERE  product.category_id = category.category_id and  product.deleted_at is NULL and category.deleted_at is NULL and category.category_id=? ORDER BY product.discount DESC LIMIT 5`,
    getAllProductByCategory: `SELECT category.category_id, category.category_name , product.product_id ,product.product_name, product.product_image , product.price , product.discount FROM product , category WHERE product.category_id = category.category_id and product.deleted_at is NULL and category.deleted_at is NULL and category.category_id=?`,
    queryTop10Product: `SELECT product.product_id ,product.product_name, category.category_name, product.product_image , product.quantity_sold ,SUM(size.quantity) as quantity_stock FROM category INNER JOIN product ON category.category_id= product.category_id INNER JOIN size ON product.product_id = size.product_id WHERE category.deleted_at is NULL GROUP BY product.product_id ORDER BY product.quantity_sold DESC LIMIT 10`,
    updateProduct: `UPDATE product SET price= ? , discount=? , product_image=? ,product_bgr1=? ,product_bgr2=? ,product_bgr3=? , updated_at=? WHERE product_id=?`,
};
