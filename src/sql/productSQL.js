module.exports = {
    categoryQuery: `select * from category where category_id =? and deleted_at is null`,
    productQuery: `select * from product where deleted_at is null and product_name =? `,
    insertProductQuery: `insert into product set ?`,
    productIDQuery: `select * from product where deleted_at is null and product_id=?`,
    updateQuery: `UPDATE product SET deleted_at= ? WHERE product_id= ?`,
    getLengthListProduct: `SELECT * FROM product`,
    getAllProduct: `SELECT product.product_id ,product.product_name, product.product_image , product.price  from  product , category WHERE  product.category_id = category.category_id and  product.deleted_at is NULL and category.deleted_at is NULL`,
    getNewProduct: `SELECT product.product_id ,product.product_name, product.product_image , product.price  from  product , category WHERE  product.category_id = category.category_id and  product.deleted_at is NULL and category.deleted_at is NULL  ORDER BY product.created_at DESC`,
    getProductDeleted: `SELECT product.product_id ,product.product_name, product.product_image , product.price  from  product , category WHERE  product.category_id = category.category_id and  product.deleted_at is not NULL OR category.deleted_at is not NULL`,
    insertListImage: `INSERT INTO product_detail_image set ?`,
    getDetailProduct: `SELECT  product_id, product_name ,price ,discount ,product_image ,product_bgr1 ,product_bgr2 ,product_bgr3    FROM  product  WHERE product.product_id = ?`,
    getListSizeDetailProduct: `select size , quantity from size where  product_id=?`,
<<<<<<< HEAD
    queryProductByCategory: `SELECT category.category_name , category.category_id , product.product_id ,product.product_name, product.product_image , product.price , product.discount  from  product , category WHERE  product.category_id = category.category_id and  product.deleted_at is NULL and category.deleted_at is NULL and category.category_id=? ORDER BY product.discount DESC LIMIT 5`,
=======
    queryProductByCategory: `SELECT category.category_name , category.category_id , product.product_id ,product.product_name, product.product_image , product.price , product.discount  from  product , category WHERE  product.category_id = category.category_id and  product.deleted_at is NULL and category.deleted_at is NULL and category.category_id=? ORDER BY discount DESC LIMIT 5 `,
>>>>>>> 2cb57b148037dc948397853ac6afcd1db0ea8cff
    querySearchProductByName: `SELECT product.product_id ,product.product_name, product.product_image , product.price  from  product , category WHERE  product.category_id = category.category_id and  product.deleted_at is NULL and category.deleted_at is NULL and product.product_name LIKE % =? `,
    getAllProductByCategory: `SELECT category.category_id, category.category_name , product.product_id ,product.product_name, product.product_image , product.price , product.discount FROM product , category WHERE product.category_id = category.category_id and product.deleted_at is NULL and category.deleted_at is NULL ORDER BY category.category_id ASC , product.discount DESC`,
};
