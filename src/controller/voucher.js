const { getConnection, query } = require('../utils/database');
const voucerSQL = require('../sql/voucherSQL');
const moment = require('moment');

const getVoucherUser = async (req, res) => {
    try {
        const { id } = req.query;
        const connection = await getConnection(req);
        const listVoucher = await query(connection, voucerSQL.queryVoucherByUser, [id]);
        if (listVoucher.length > 0) {
            for (voucher of listVoucher) {
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
        await query(connection, voucerSQL.updateVoucher, [id]);
        return res.status(200).json({ message: 'Áp dụng voucher thành công' });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
module.exports = {
    getVoucherUser,
    useVoucher,
};
