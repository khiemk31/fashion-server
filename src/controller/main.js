const billSQL = require('../sql/billSQL');
const { getConnection, query } = require('../utils/database');
const { formatMoney } = require('../utils/formatMoney');
//API THONG KE
const listRevenueByYear = async (req, res) => {
    try {
        const { year } = req.body;
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
const billStatistics = async (req, res) => {
    try {
        const connection = await getConnection(req);
        const billWaiting = await query(connection, billSQL.queryBillWaiting);
        const billDelivering = await query(connection, billSQL.queryBillDelivering);
        const billDone = await query(connection, billSQL.queryDonHoanThanh);
        const billRequestCancellationORRefund = await query(connection, billSQL.queryBillRequestCancellationORRefund);
        const billFail = await query(connection, billSQL.queryDonThatBai);
        return res.status(200).json({
            billWaiting: billWaiting[0].billWaiting,
            billDelivering: billDelivering[0].billDelivering,
            billDone: billDone[0].DonDaGiao,
            billRequestCancellationORRefund: billRequestCancellationORRefund[0].billRequestCancellationORRefund,
            billFail: billFail[0].DonThatBai,
        });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
const billDetailStatistics = async (req, res) => {
    try {
        const connection = await getConnection(req);
        var listBillDetailStatistics = [
            {
                Month: 1,
                billWaiting: 0,
                billDelivering: 0,
                billDone: 0,
                billRequestCancellationORRefund: 0,
                billFail: 0,
            },
            {
                Month: 2,
                billWaiting: 0,
                billDelivering: 0,
                billDone: 0,
                billRequestCancellationORRefund: 0,
                billFail: 0,
            },
            {
                Month: 3,
                billWaiting: 0,
                billDelivering: 0,
                billDone: 0,
                billRequestCancellationORRefund: 0,
                billFail: 0,
            },
            {
                Month: 4,
                billWaiting: 0,
                billDelivering: 0,
                billDone: 0,
                billRequestCancellationORRefund: 0,
                billFail: 0,
            },
            {
                Month: 5,
                billWaiting: 0,
                billDelivering: 0,
                billDone: 0,
                billRequestCancellationORRefund: 0,
                billFail: 0,
            },
            {
                Month: 6,
                billWaiting: 0,
                billDelivering: 0,
                billDone: 0,
                billRequestCancellationORRefund: 0,
                billFail: 0,
            },
            {
                Month: 7,
                billWaiting: 0,
                billDelivering: 0,
                billDone: 0,
                billRequestCancellationORRefund: 0,
                billFail: 0,
            },
            {
                Month: 8,
                billWaiting: 0,
                billDelivering: 0,
                billDone: 0,
                billRequestCancellationORRefund: 0,
                billFail: 0,
            },
            {
                Month: 9,
                billWaiting: 0,
                billDelivering: 0,
                billDone: 0,
                billRequestCancellationORRefund: 0,
                billFail: 0,
            },
            {
                Month: 10,
                billWaiting: 0,
                billDelivering: 0,
                billDone: 0,
                billRequestCancellationORRefund: 0,
                billFail: 0,
            },
            {
                Month: 11,
                billWaiting: 0,
                billDelivering: 0,
                billDone: 0,
                billRequestCancellationORRefund: 0,
                billFail: 0,
            },
            {
                Month: 12,
                billWaiting: 0,
                billDelivering: 0,
                billDone: 0,
                billRequestCancellationORRefund: 0,
                billFail: 0,
            },
        ];
        const listBillWaiting = await query(connection, billSQL.queryListBillWaitingByMonth);
        const listBillDelivering = await query(connection, billSQL.queryListBillDeliveringByMonth);
        const listBillDone = await query(connection, billSQL.queryListBillDoneByMonth);
        const listBillRequestCancellationORRefund = await query(
            connection,
            billSQL.queryListBillRequestCancellationORRefundByMonth,
        );
        const listBillFail = await query(connection, billSQL.queryListBillFailByMonth);

        for (const billDetailStatistics of listBillDetailStatistics) {
            for (const billWaiting of listBillWaiting) {
                if (billDetailStatistics.Month == billWaiting.Month) {
                    billDetailStatistics.billWaiting = billWaiting.billWaiting;
                }
            }
            for (const billDelivering of listBillDelivering) {
                if (billDetailStatistics.Month == billDelivering.Month) {
                    billDetailStatistics.billDelivering = billDelivering.billDelivering;
                }
            }
            for (const billDone of listBillDone) {
                if (billDetailStatistics.Month == billDone.Month) {
                    billDetailStatistics.billDone = billDone.billDone;
                }
            }
            for (const billRequestCancellationORRefund of listBillRequestCancellationORRefund) {
                if (billDetailStatistics.Month == billRequestCancellationORRefund.Month) {
                    billDetailStatistics.billRequestCancellationORRefund =
                        billRequestCancellationORRefund.billRequestCancellationORRefund;
                }
            }
            for (const billFail of listBillFail) {
                if (billDetailStatistics.Month == billFail.Month) {
                    billDetailStatistics.billFail = billFail.billFail;
                }
            }
        }
        return res.status(200).json({ listBillDetailStatistics: listBillDetailStatistics });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
const queryTop10User = async (req, res) => {
    try {
        const connection = await getConnection(req);
        const listUser = await query(connection, billSQL.queryTop10User);
        for (user of listUser) {
            user.totalAmountSpent = formatMoney(user.totalAmountSpent) + 'đ';
        }
        return res.status(200).json({ listUser: listUser });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
//WEB VIEW
const main = async (req, res) => {
    const connection = await getConnection(req);
    const tongDoanhThu = await query(connection, billSQL.queryTongDoanhThu);
    tongDoanhThu[0].TongDoanhThu = formatMoney(tongDoanhThu[0].TongDoanhThu);
    const donDaGiao = await query(connection, billSQL.queryDonHoanThanh);
    const donDangXuLy = await query(connection, billSQL.queryDonDangXuLy);
    const donThatBai = await query(connection, billSQL.queryDonThatBai);

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
    billStatistics,
    billDetailStatistics,
    queryTop10User,
};
