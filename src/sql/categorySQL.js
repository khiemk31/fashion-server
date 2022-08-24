module.exports = {
  queryListCategory: `SELECT * FROM category WHERE deleted_at IS null`,
  categoryQueryByNameSQL: `select * from category where deleted_at is null and category_name=?`,
  insertCategorySQL: `insert into category set ?`,
  listCategoryQuerySQL: `SELECT * FROM category`,
  updateHiddenCategory: `update category set deleted_at=? where category_id=?`,
  updateShowCategory: `update category set deleted_at=null where category_id=?`,
  listNameCategoryQuerySQL: `SELECT category_name FROM category WHERE deleted_at IS null ORDER BY category_name ASC`,
};
