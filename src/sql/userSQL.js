module.exports = {
    queryActiveUserByID: `SELECT active FROM user WHERE user_id=? `,
    getUserById: `SELECT *  FROM user WHERE deleted_at is null AND user_id=?`,
    getUserQuerySQL: `select * from user where  phone=?`,
    insertUserSQL: `insert into user set ?`,
    getUserAdminQuerySQL: `select * from user where deleted_at is null and phone=? and permission	='admin'`,
    getUserSupperAdminQuerySQL: `select * from user where phone=? and permission	='super admin'`,
    updatePasswordUserSQL: `update user set password=? where phone=?`,
    updateUserSQL: `UPDATE user SET user_name=? , gender=? , date_of_birth=? , avatar=? , address=? , updated_at=? WHERE  user_id=?`,
    getUserIDWithPhoneQuerySQL: `select *from user_id where deleted_at is null and phone=?`,
    getAddressUserById: `SELECT address FROM user WHERE user_id=? `,
    updateAddressUser: `update user set address=? where user_id=?`,
    queryAllUser: `SELECT *FROM user `,
    queryListUser: `SELECT * FROM user WHERE deleted_at is null AND permission='user'`,
    queryListAdmin: `SELECT * FROM user WHERE deleted_at is null AND permission='admin' OR permission='super admin'`,
    getSupperAdmin: `SELECT * FROM user WHERE deleted_at is null AND  permission='super admin'`,
    getAllUserBlock: `SELECT * FROM user WHERE deleted_at = 1`,
    getLengthListUser: `SELECT * FROM user`,
};
