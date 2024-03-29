const { encodePassword, comparePassword } = require('../utils/password');
const { getConnection, query } = require('../utils/database');
const { isEmpty } = require('../utils/validate');
const { uploadImage } = require('../utils/image');
const { decodeOTP, encodeOTP, generateOTP, sendOTP } = require('../utils/otp');
const moment = require('moment');
let jwt = require('jsonwebtoken');
const twilio = require('twilio');
const { accountSid, authToken } = require('../config');
const userSQL = require('../sql/userSQL');
const { formatMoney } = require('../utils/formatMoney');
const { getTotalPage } = require('../utils');
const client = twilio(accountSid, authToken);
//MOBILE API
const checkUser = async (req, res) => {
    try {
        const { phone } = req.body;
        const connection = await getConnection(req);
        const user = await query(connection, userSQL.getUserQuerySQL, [phone]);
        if (!isEmpty(user)) return res.status(409).json({ message: 'Số điện thoại đã được sử dụng !' });
        return res.status(200).json({ message: 'SĐT hợp lệ' });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
const register = async (req, res) => {
    try {
        const { phone, password, user_name } = req.body;
        const connection = await getConnection(req);
        const lengthListUser = (await query(connection, userSQL.queryAllUser)).length;
        let id = 'USER' + (lengthListUser + 1);
        const newPassword = await encodePassword(password);
        const newUser = {
            user_id: id,
            phone: phone,
            password: newPassword,
            user_name: user_name,
            gender: 1,
            date_of_birth: new Date(),
            permission: 'user',
            active: 0,
            created_at: new Date(),
        };
        await query(connection, userSQL.insertUserSQL, newUser);
        return res.status(200).json({ message: 'Đăng Ký Thành Công!' });
    } catch (e) {
        return res.status(500).json({ message: `${e}` });
    }
};

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const connection = await getConnection(req);
        const user = await query(connection, userSQL.getUserQuerySQL, [phone]);
        if (isEmpty(user)) {
            return res.status(404).json({ message: 'Số điện thoại chưa được đăng ký' });
        } else {
            await comparePassword(user[0], password);
            return res.status(200).json({ message: 'Đăng nhập thành công', data: user[0].user_id });
        }
    } catch (e) {
        return res.status(500).json({ message: `${e}` });
    }
};

const recoveryPassword = async (req, res) => {
    try {
        const { password, phone } = req.body;
        const connection = await getConnection(req);
        const user = await query(connection, userSQL.getUserQuerySQL, [phone]);
        if (isEmpty(user)) {
            return res.status(404).json({ message: 'Số điện thoại chưa được đăng ký' });
        } else {
            const newPassword = await encodePassword(password);
            await query(connection, userSQL.updatePasswordUserSQL, [newPassword, phone]);
            return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
        }
    } catch (e) {
        return res.status(500).json({ message: `${e}` });
    }
};
const update = async (req, res) => {
    try {
        let { user_name, date_of_birth, avatar, gender, address } = req.body;
        let { user_id } = req?.query;
        if (req?.query?.user_id) user_id = req.query.user_id;
        let newDateOfBirth = null;
        let newAvatar = null;
        if (date_of_birth) {
            const date = date_of_birth.split('-');
            newDateOfBirth = `${date[2]}-${date[1]}-${date[0]}`;
        }
        const connection = await getConnection(req);
        const user = await query(connection, userSQL.getUserById, [user_id]);
        if (isEmpty(user)) return res.status(404).json({ message: 'Không tìm thấy User' });
        await query(connection, userSQL.updateUserSQL, [
            user_name || user[0].user_name || null,
            gender || user[0].gender,
            newDateOfBirth || user[0].date_of_birth,
            newAvatar?.url || avatar || user[0].avatar,
            address || user[0].address,
            new Date(),
            user_id,
        ]);
        return res.status(200).json({ message: 'Sửa thành công !' });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
const detail = async (req, res) => {
    try {
        const user_id = req.params.id;
        const connection = await getConnection(req);
        const user = await query(connection, userSQL.queryDetailUserByID, [user_id]);
        if (isEmpty(user)) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user[0].date_of_birth) {
            user[0].date_of_birth = moment(user[0].date_of_birth).format('DD-MM-YYYY');
        }
        return res.status(200).json({ data: user[0] });
    } catch (e) {
        return res.status(500).json({ message: `${e}` });
    }
};

// API delete
const blockUser = async (req, res) => {
    try {
        const user_id = req.params.id;
        const connection = await getConnection(req);
        const removeUser = `update user set deleted_at =? , active=? where user_id=?`;
        await query(connection, removeUser, [new Date(), 1, user_id]);
        detailUserQuery = 'select *  from user where  user_id=?';
        queryDonDaDat = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đang Giao" OR status="Hoàn Thành" OR status="Chờ Xác Nhận") AND user_id=?`;
        queryDonDaHuy = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đã Hủy" OR status="Đã Hoàn") AND user_id=?`;
        queryDoanhThu = `SELECT SUM(total_price) AS doanhThu FROM bill WHERE status="Hoàn Thành" AND user_id=?`;
        const donDaDat = await query(connection, queryDonDaDat, [user_id]);
        const donDaHuy = await query(connection, queryDonDaHuy, [user_id]);
        const doanhThu = await query(connection, queryDoanhThu, [user_id]);
        const user = await query(connection, detailUserQuery, [user_id]);
        if (user[0].date_of_birth) {
            user[0].date_of_birth = moment(user[0].date_of_birth).format('DD-MM-YYYY');
        }
        if (user[0].created_at) {
            user[0].created_at = moment(user[0].created_at).format('DD-MM-YYYY');
        }
        if (doanhThu[0].doanhThu) {
            doanhThu[0].doanhThu = formatMoney(doanhThu[0].doanhThu);
        }
    const adminID = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;
    const permission = await query(connection, userSQL.queryPermissionUser, [adminID])
    res.render('detail_user', {
        user: user[0],
        donDaDat: donDaDat[0].soDon,
        donDaHuy: donDaHuy[0].soDon,
        doanhThu: doanhThu[0].doanhThu,
        permission : permission[0].permission
    });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
const activeUser = async (req, res) => {
    try {
        const user_id = req.params.id;
        const connection = await getConnection(req);
        const activeUser = `update user set deleted_at =null, active=0 where user_id=?`;
        await query(connection, activeUser, [user_id]);
        detailUserQuery = 'select *  from user where  user_id=?';
        queryDonDaDat = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đang Giao" OR status="Hoàn Thành" OR status="Chờ Xác Nhận") AND user_id=?`;
        queryDonDaHuy = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đã Hủy" OR status="Đã Hoàn") AND user_id=?`;
        queryDoanhThu = `SELECT SUM(total_price) AS doanhThu FROM bill WHERE status="Hoàn Thành" AND user_id=?`;
        const donDaDat = await query(connection, queryDonDaDat, [user_id]);
        const donDaHuy = await query(connection, queryDonDaHuy, [user_id]);
        const doanhThu = await query(connection, queryDoanhThu, [user_id]);
        const user = await query(connection, detailUserQuery, [user_id]);
        if (user[0].date_of_birth) {
            user[0].date_of_birth = moment(user[0].date_of_birth).format('DD-MM-YYYY');
        }
        if (user[0].created_at) {
            user[0].created_at = moment(user[0].created_at).format('DD-MM-YYYY');
        }
        if (doanhThu[0].doanhThu) {
            doanhThu[0].doanhThu = formatMoney(doanhThu[0].doanhThu);
        }
    const adminID = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;
    const permission = await query(connection, userSQL.queryPermissionUser, [adminID])
    res.render('detail_user', {
        user: user[0],
        donDaDat: donDaDat[0].soDon,
        donDaHuy: donDaHuy[0].soDon,
        doanhThu: doanhThu[0].doanhThu,
        permission : permission[0].permission
    });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};

const apiSendOTP = async (req, res) => {
    const { phone } = req.body;
    const OTP = generateOTP();
    await sendOTP(client, OTP, phone);
    const otp_token = encodeOTP(OTP, new Date());
    return res.json({ message: 'success', otp_token: otp_token });
};

const verifyOTP = async (req, res) => {
    const { otp_token, otp } = req.body;
    const data = await decodeOTP(otp_token);
    if (new Date() > data.expire) return res.status(500).json({ message: 'OTP has expired'});
    if (otp != data.otp) return res.status(409).json({ message: 'OTP not match' });
    return res.status(200).json({ message: 'success' });
};
const getAddress = async (req, res) => {
    try {
        const user_id = req.params.id;
        const connection = await getConnection(req);
        const user = await query(connection, userSQL.getUserById, [user_id]);
        const address = await query(connection, userSQL.getAddressUserById, [user_id]);
        if (isEmpty(user)) return res.status(404).json({ message: 'User not found' });
        if (isEmpty(address[0]?.address)) return res.status(406).json({ message: 'Address not found' });
        return res.status(200).json(address[0]);
    } catch (error) {
        return res.json({ message: `${error}` });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { user_id, address } = req.body;
        const connection = await getConnection(req);
        const user = await query(connection, userSQL.getUserById, [user_id]);
        if (isEmpty(user)) return res.status(404).json({ message: 'User not found' });

        await query(connection, userSQL.updateAddressUser, [address, user_id]);
        return res.status(200).json({ message: 'success' });
    } catch (error) {
        return res.json({ message: `${error}` });
    }
};

const getUser = async (req, res) => {
    try {
        const connection = await getConnection(req);
        const listUser = await query(connection, userSQL.queryAllUser);
        return res.status(200).json({ message: 'success', listUser: listUser });
    } catch (error) {
        return res.json({ message: `${error}` });
    }
};
const checkActive = async (req, res) => {
    try {
        const { user_id } = req.body;
        const connection = await getConnection(req);
        const user = await query(connection, userSQL.queryActiveUserByID, [user_id]);
        if (user[0].active == 0) {
            return res.status(200).json({ active: true });
        } else {
            return res.status(200).json({ active: false });
        }
    } catch (error) {
        return res.json({ message: `${error}` });
    }
};
//WEB VIEW
const getAll = async (req, res) => {
    const connection = await getConnection(req);
    const user_id = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;
    const permission = await query(connection, userSQL.queryPermissionUser, [user_id])
    const listUser = await query(connection, userSQL.queryAllUser);
    res.render('user', { listUser: listUser, permission: permission[0].permission });
};
const loginWeb = async (req, res) => {
    res.render('login');
};
const getInsertUser = async (req, res) => {
    res.render('insert_user');
};
const postInsertUser = async (req, res) => {
    try {
        const data = req.body;
        const connection = await getConnection(req);
        const user = await query(connection, userSQL.getUserQuerySQL, [data.phone]);
        const lengthListUser = (await query(connection, userSQL.getLengthListUser)).length;
        const id = 'USER' + (lengthListUser + 1);
        if (!isEmpty(user)) return res.status(409).json({ message: 'Số điện thoại đã được sử dụng !' });
        const newPassword = await encodePassword(data.password);
        const newUser = {
            user_id: id,
            phone: data.phone,
            password: newPassword,
            user_name: data.user_name,
            gender: data.gender,
            address: data?.address || null,
            permission: data.permission,
            date_of_birth: data?.date_of_birth || new Date(),
            active: 0,
            created_at: new Date(),
        };
        await query(connection, userSQL.insertUserSQL, newUser);
        return res.status(200).json({ message: "Thêm người dùng thành công" });
    } catch (e) {
        return res.status(500).json({ message: `${e}` });
    }
};
//WEB loginAdmin
const loginAdmin = async (req, res) => {
    try {
        const data = req.body;
        const connection = await getConnection(req);
        const admin = await query(connection, userSQL.getUserAdminQuerySQL, [data.phone.trim()]);
        const superAdmin = await query(connection, userSQL.getUserSupperAdminQuerySQL, [data.phone]);
        if (isEmpty(admin) && isEmpty(superAdmin)) {
            return res.status(404).json({ message: 'Số điện thoại chưa được đăng ký Admin' });
        } else if (isEmpty(superAdmin)) {
            await comparePassword(admin[0], data.password);
            const token = jwt.sign({ user_id: admin[0].user_id }, process.env.ACCESS_TOKEN_SECRET);
            await res.cookie('token', token);
            return res.status(200).json({ message: 'Đăng nhập thành công' })
        } else {
            await comparePassword(superAdmin[0], data.password);
            const token = jwt.sign({ user_id: superAdmin[0].user_id }, process.env.ACCESS_TOKEN_SECRET);
            await res.cookie('token', token);
            return res.status(200).json({ message: 'Đăng nhập thành công' })
        }
    } catch (e) {
        return res.status(500).json({ message: `${e}` });
    }
};

const getAllUser = async (req, res) => {
    let { pageNumber } = req.query;
    const connection = await getConnection(req);
    if (pageNumber) {
        let offset = 0;
        if (pageNumber == 1) {
            offset = 0;
        } else if (pageNumber > 1) {
            offset = (pageNumber - 1) * 10;
        }
        queryLimitUser = `SELECT * FROM user WHERE deleted_at is null AND permission='user' LIMIT 10  OFFSET  ${offset}`;
        const listUserLimit = await query(connection, queryLimitUser);
        const listUser = await query(connection, userSQL.queryListUser);
        let totalPage = getTotalPage(listUser.length, 10);
        let listPage = [];
        let i = 1;
        while (i <= totalPage) {
            listPage.push(i);
            i++;
        }
        res.render('user', { listUser: listUserLimit, listPage: listPage, pageNumber: pageNumber });
    } else {
        pageNumber = 1;
        let offset = 0;
        if (pageNumber == 1) {
            offset = 0;
        } else if (pageNumber > 1) {
            offset = (pageNumber - 1) * 10;
        }
        queryLimitUser = `SELECT * FROM user WHERE deleted_at is null AND permission='user' LIMIT 10  OFFSET  ${offset}`;
        const listUserLimit = await query(connection, queryLimitUser);
        const listUser = await query(connection, userSQL.queryListUser);
        let totalPage = getTotalPage(listUser.length, 10);
        let listPage = [];
        let i = 1;
        while (i <= totalPage) {
            listPage.push(i);
            i++;
        }
        res.render('user', { listUser: listUserLimit, listPage: listPage, pageNumber: pageNumber });
    }
};
const userDetail = async (req, res) => {
    const user_id = req.query.user_id;
    const connection = await getConnection(req);
    detailUserQuery = 'SELECT * FROM user WHERE user_id=?';
    queryDonDaDat = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đang Giao" OR status="Hoàn Thành" OR status="Chờ Xác Nhận") AND user_id=?`;
    queryDonDaHuy = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đã Hủy" OR status="Đã Hoàn") AND user_id=?`;
    queryDoanhThu = `SELECT SUM(total_price) AS doanhThu FROM bill WHERE status="Hoàn Thành" AND user_id=?`;
    const donDaDat = await query(connection, queryDonDaDat, [user_id]);
    const donDaHuy = await query(connection, queryDonDaHuy, [user_id]);
    const doanhThu = await query(connection, queryDoanhThu, [user_id]);
    const user = await query(connection, detailUserQuery, [user_id]);
    if (user[0]?.date_of_birth) {
        user[0].date_of_birth = moment(user[0].date_of_birth).format('DD-MM-YYYY');
    }
    if (user[0].created_at) {
        user[0].created_at = moment(user[0].created_at).format('DD-MM-YYYY');
    }
    if (doanhThu[0].doanhThu) {
        doanhThu[0].doanhThu = formatMoney(doanhThu[0].doanhThu);
    }
    const adminID = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;
    const permission = await query(connection, userSQL.queryPermissionUser, [adminID])
    res.render('detail_user', {
        user: user[0],
        donDaDat: donDaDat[0].soDon,
        donDaHuy: donDaHuy[0].soDon,
        doanhThu: doanhThu[0].doanhThu,
        permission : permission[0].permission
    });
};
const removeAdmin =async(req,res)=>{
    const user_id = req.params.id;
    const connection = await getConnection(req);
    const removeAdmin = `update user set permission ='user' where user_id=?`;
    await query(connection, removeAdmin, [user_id]);
    detailUserQuery = 'select *  from user where  user_id=?';
    queryDonDaDat = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đang Giao" OR status="Hoàn Thành" OR status="Chờ Xác Nhận") AND user_id=?`;
    queryDonDaHuy = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đã Hủy" OR status="Đã Hoàn") AND user_id=?`;
    queryDoanhThu = `SELECT SUM(total_price) AS doanhThu FROM bill WHERE status="Hoàn Thành" AND user_id=?`;
    const donDaDat = await query(connection, queryDonDaDat, [user_id]);
    const donDaHuy = await query(connection, queryDonDaHuy, [user_id]);
    const doanhThu = await query(connection, queryDoanhThu, [user_id]);
    const user = await query(connection, detailUserQuery, [user_id]);
    if (user[0].date_of_birth) {
        user[0].date_of_birth = moment(user[0].date_of_birth).format('DD-MM-YYYY');
    }
    if (user[0].created_at) {
        user[0].created_at = moment(user[0].created_at).format('DD-MM-YYYY');
    }
    if (doanhThu[0].doanhThu) {
        doanhThu[0].doanhThu = formatMoney(doanhThu[0].doanhThu);
    }
    const adminID = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;
    const permission = await query(connection, userSQL.queryPermissionUser, [adminID])
    res.render('detail_user', {
        user: user[0],
        donDaDat: donDaDat[0].soDon,
        donDaHuy: donDaHuy[0].soDon,
        doanhThu: doanhThu[0].doanhThu,
        permission : permission[0].permission
    });
}


const getLogOut = async (req, res) => {
    res.clearCookie('token');
    res.render('login');
    res.end();
};

module.exports = {
    getUser,
    getInsertUser,
    postInsertUser,
    userDetail,
    getAddress,
    updateAddress,
    register,
    login,
    recoveryPassword,
    update,
    detail,
    blockUser,
    apiSendOTP,
    verifyOTP,
    checkUser,
    activeUser,
    loginWeb,
    getAll,
    getAllUser,
    loginAdmin,
    checkActive,
    getLogOut,
    removeAdmin,
};
