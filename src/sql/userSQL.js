module.exports = {
    queryActiveUserByID: `SELECT active FROM user WHERE user_id=? `,
    getUserById: `SELECT *  FROM user WHERE deleted_at is null AND user_id=?`,
    getUserQuerySQL: `select * from user where  phone=?`,
    insertUserSQL: `insert into user set ?`,
    getUserAdminQuerySQL: `select * from user where deleted_at is null and phone=? and permission	='admin'`,
    getUserSupperAdminQuerySQL: `select * from user where phone=? and permission	='super admin'`,
    updatePasswordUserSQL: `update user set password=? where phone=?`,
    updateUserSQL: `UPDATE user SET user_name=? , gender=? , date_of_birth=? , avatar=? , address=? , updated_at=? WHERE  user_id=?`,
    getAddressUserById: `SELECT address FROM user WHERE user_id=? `,
    updateAddressUser: `update user set address=? where user_id=?`,
    queryAllUser: `SELECT *FROM user `,
    getLengthListUser: `SELECT * FROM user`,
    queryAllUserId: `SELECT user_id FROM user WHERE deleted_at IS null`,
    queryPermissionUser: `SELECT permission FROM user WHERE user_id=?`,
    queryDetailUserByID: `SELECT user.user_id, user.phone, user.user_name , user.gender ,user.address, user.avatar ,user.date_of_birth , COUNT(bill.bill_id) AS number_of_orders  , SUM(bill.total_price) AS money_spent  FROM user , bill 
    WHERE
    user.user_id = bill.user_id 
    AND bill.status="Hoàn Thành"
    AND user.user_id=?`
};
