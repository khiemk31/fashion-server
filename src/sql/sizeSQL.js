module.exports = {
    insertSizeSQL: `insert into size set ?`,
    queryListSizeByProductId: `SELECT *FROM size WHERE product_id=?`,
    updateSizeProduct: 'UPDATE size SET quantity=? where size=? and product_id=?',
};
