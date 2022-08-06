const billSQL = require('../sql/billSQL');
const { getConnection, query } = require('../utils/database');
const { formatMoney } = require('../utils/formatMoney');
//API THONG KE
const listRevenueByYear = async (req, res) => {
    try {
        const { year } = req.body;
        console.log(req);
        const connection = await getConnection(req);

        var listRevenue = [
            { Month: 1, Revenue: 0 },
            { Month: 2, Revenue: 0 },
            { Month: 3, Revenue: 0 },
            { Month: 4, Revenue: 0 },
            { Month: 5, Revenue: 0 },
            { Month: 6, Revenue: 0 },
            { Month: 7, Revenue: 0 },
            { Month: 8, Revenue: 0 },
            { Month: 9, Revenue: 0 },
            { Month: 10, Revenue: 0 },
            { Month: 11, Revenue: 0 },
            { Month: 12, Revenue: 0 },
        ];
        const listRevenue2 = await query(connection, billSQL.queryListRevenueByYear, [year]);
        for (const revenue of listRevenue) {
            for (const revenue2 of listRevenue2) {
                if (revenue.Month == revenue2.Month) {
                    revenue.Revenue = revenue2.Revenue;
                }
            }
        }
        return res.status(200).json({ listRevenue: listRevenue });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};

//WEB VIEW
const main = async (req, res) => {
    const connection = await getConnection(req);
    queryTongDoanhThu = `SELECT SUM(total_price) as TongDoanhThu FROM bill WHERE status="Hoàn Thành" `;
    queryDonHoanThanh = `SELECT COUNT(bill_id) as DonDaGiao FROM bill WHERE status="Hoàn Thành" `;
    queryDonDangXuLy = `SELECT COUNT(bill_id) as DonDangXuLy FROM bill WHERE status="Chờ Xác Nhận" OR status="Yêu Cầu Hủy Đơn" OR status="Yêu Cầu Trả Đơn" OR status="Đang Giao"`;
    queryDonThatBai = `SELECT COUNT(bill_id) as DonThatBai FROM bill WHERE status="Đã Hủy" OR status="Đã Hoàn" OR status="Thất Bại" OR status="Từ Chối"`;
    const tongDoanhThu = await query(connection, queryTongDoanhThu);
    tongDoanhThu[0].TongDoanhThu = formatMoney(tongDoanhThu[0].TongDoanhThu);
    const donDaGiao = await query(connection, queryDonHoanThanh);
    const donDangXuLy = await query(connection, queryDonDangXuLy);
    const donThatBai = await query(connection, queryDonThatBai);

    res.render('main', {
        tongDoanhThu: tongDoanhThu[0].TongDoanhThu,
        donDaGiao: donDaGiao[0].DonDaGiao,
        donDangXuLy: donDangXuLy[0].DonDangXuLy,
        donThatBai: donThatBai[0].DonThatBai,
    });
};

module.exports = {
    main,
    listRevenueByYear,
};
