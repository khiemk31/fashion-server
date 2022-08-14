const { getConnection, query } = require('../utils/database');
const voucherSQL = require('../sql/voucherSQL');
const moment = require('moment');
const userSQL = require('../sql/userSQL');
const billSQL = require('../sql/billSQL');

//WEB API
const voucher = async (req, res) => {
    res.render('voucher');
};
//API Lấy tất cả user_id còn hoạt động
const getAllUserID = async (req, res) => {
    try {
        const connection = await getConnection(req);
        const listUserID = await query(connection, userSQL.queryAllUserId);
        var listID = [];
        for (var user of listUserID) {
            listID.push(user.user_id);
        }
        return res.status(200).json({ listUserID: listID });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
//API add voucher cho 1 người
const addVoucher = async (req, res) => {
    try {
        const data = req.body;
        const connection = await getConnection(req);
        await query(connection, voucherSQL.insertVoucher, {
            title: data.title,
            code: data.code,
            user_id: data.user_id,
            price_discount: data.price_discount,
            active: 1,
            expired: data.expired,
        });
        res.render('voucher');
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
//API Add Voucher toàn bộ
const addVoucherAll = async (req, res) => {
    try {
        const data = req.body;
        const connection = await getConnection(req);
        const listUserID = await query(connection, userSQL.queryAllUserId);
        for (var user of listUserID) {
            await query(connection, voucherSQL.insertVoucher, {
                title: data.title,
                code: data.code,
                user_id: user.user_id,
                price_discount: data.price_discount,
                active: 1,
                expired: data.expired,
            });
        }

        res.render('voucher');
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
//Tang Voucher 10 khach hang than thiet
const addVoucherTop10User = async (req, res) => {
    try {
        const data = req.body;
        const connection = await getConnection(req);
        const listUser = await query(connection, billSQL.queryTop10User);
        for (var user of listUser) {
            await query(connection, voucherSQL.insertVoucher, {
                title: data.title,
                code: data.code,
                user_id: user.user_id,
                price_discount: data.price_discount,
                active: 1,
                expired: data.expired,
            });
        }
        res.render('voucher');
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
//API Mobile
const getVoucherUser = async (req, res) => {
    try {
        const { id } = req.query;
        const connection = await getConnection(req);
        var listVoucher = await query(connection, voucherSQL.queryVoucherByUser, [id]);
        if (listVoucher.length > 0) {
            for (const voucher of listVoucher) {
                voucher.expired = moment(voucher.expired).format('DD-MM-YY');
            }
        }
        return res.status(200).json({ listVoucher: listVoucher });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
const useVoucher = async (req, res) => {
    try {
        const { id } = req.body;
        const connection = await getConnection(req);
        await query(connection, voucherSQL.updateVoucher, [id]);
        return res.status(200).json({ message: 'Áp dụng voucher thành công' });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
module.exports = {
    voucher,
    getVoucherUser,
    useVoucher,
    getAllUserID,
    addVoucher,
    addVoucherAll,
    addVoucherTop10User,
};
