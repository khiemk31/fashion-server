module.exports = {
    queryVoucherByUser: `SELECT * FROM voucher WHERE user_id =? AND active=1 AND expired > CURDATE() `,
    updateVoucher: `UPDATE voucher SET active=0  WHERE id=?`,
    insertVoucher: `insert into voucher set ?`,
};
