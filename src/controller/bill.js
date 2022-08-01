const { getConnection, query } = require('../utils/database');
const { isEmpty } = require('../utils/validate');
const userSQL = require('../sql/userSQL');
const billSQL = require('../sql/billSQL');
const moment = require('moment');
const { formatMoney } = require('../utils/formatMoney');
//Bill API
//Tạo hóa đơn
const add = async (req, res) => {
    try {
        let {
            user_id,
            product_list,
            total_price,
            list_quantity,
            list_size,
            list_price,
            list_price_sale,
            discount_voucher_price,
            address,
            payment_status,
        } = req.body;
        const connection = await getConnection(req);
        const user = await query(connection, userSQL.getUserById, [user_id]);
        if (isEmpty(user)) return res.status(404).json({ message: 'User not found' });
        const listID = await query(connection, billSQL.queryListID);
        const id = 'HD' + (listID.length + 1);
        console.log(payment_status, 'Terang thaio thanh toan ');
        await query(connection, billSQL.insertBill, {
            bill_id: id,
            user_id: user_id,
            status: 'Chờ Xác Nhận',
            total_price: total_price,
            total_product: product_list.length,
            address: address,
            discount_voucher_price: discount_voucher_price,
            payment_status: payment_status,
            created_at: new Date(),
        });
        for (const [index, product] of product_list.entries()) {
            await query(connection, billSQL.insertBillDetails, {
                bill_id: id,
                product_name: product,
                price: list_price[index],
                price_sale: list_price_sale[index],
                size: list_size[index],
                quantity: list_quantity[index],
            });
        }
        return res.status(200).json({ message: 'success' });
    } catch (e) {
        return res.status(500).json({ message: `${e}` });
    }
};
//Lấy danh sách bill
const getListBill = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection(req);
        const user = await query(connection, userSQL.getUserById, [id]);
        if (isEmpty(user)) {
            return res.status(404).json({ message: 'User not found' });
        }
        const listBill = await query(connection, billSQL.queryListBillByUserID, [id]);
        var listData = [];
        for (var bill of listBill) {
            bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
            var product = await query(connection, billSQL.queryProductListBillUser, [bill.bill_id]);
            bill = { ...bill, ...product[0] };
            listData.push(bill);
        }
        return res.status(200).json(listData);
    } catch (e) {
        return res.status(500).json({ message: `${e}` });
    }
};
//Lấy thông tin chi tiết bill
const getBillDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection(req);
        const bill = await query(connection, billSQL.queryBillByBillID, [id]);
        if (isEmpty(bill)) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        if (bill[0].created_at) {
            bill[0].created_at = moment(bill[0].created_at).format('DD-MM-YYYY');
        }
        if (bill[0].updated_at) {
            bill[0].updated_at = moment(bill[0].updated_at).format('DD-MM-YYYY');
        }
        const listProduct = await query(connection, billSQL.queryBillDetailByBillID, [id]);
        return res.status(200).json({ bill, listProduct });
    } catch (e) {
        return res.status(500).json({ message: `${e}` });
    }
};
// Yêu Cầu Hủy Đơn
const cancelOrder = async (req, res) => {
    try {
        const { bill_id, cancellation_reason } = req.body;
        const connection = await getConnection(req);
        const bill = await query(connection, billSQL.queryBill, [bill_id]);
        if (isEmpty(bill)) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        await query(connection, billSQL.updateBill, ['Yêu Cầu Hủy Đơn', cancellation_reason, bill_id]);
        return res.status(200).json({ message: 'success' });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};

//Phản Hồi , Đánh Giá Đơn Hàng
const feedback = async (req, res) => {
    try {
        const { bill_id, feedback } = req.body;
        const connection = await getConnection(req);
        const bill = await query(connection, billSQL.queryBill, [bill_id]);
        if (isEmpty(bill)) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        await query(connection, billSQL.updateFeedBack, [feedback, bill_id]);
        return res.status(200).json({ message: 'success' });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
//Yêu Cầu Hoàn Đơn
const returnRequest = async (req, res) => {
    try {
        const { bill_id, return_request } = req.body;
        const connection = await getConnection(req);
        const bill = await query(connection, billSQL.queryBill, [bill_id]);
        if (isEmpty(bill)) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        await query(connection, billSQL.updateReturnRequest, ['Yêu Cầu Trả Đơn', return_request, bill_id]);
        return res.status(200).json({ message: 'success' });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};

//Bill Web View
//Chi Tiết Bill
const getBillDetailWeb = async (req, res) => {
    const bill_id = req.params.id;
    const connection = await getConnection(req);
    const bill = await query(connection, billSQL.queryBillByBillID, [bill_id]);
    const listProduct = await query(connection, billSQL.queryBillDetailByBillID, [bill_id]);
    if (bill.length > 0) {
        bill[0].created_at = moment(bill[0].created_at).format('DD-MM-YYYY');
        if (bill[0].updated_at) {
            bill[0].updated_at = moment(bill[0].updated_at).format('DD-MM-YYYY');
        }

        var total_price_no_voucher = bill[0].total_price + bill[0].discount_voucher_price;
        bill[0].total_price = formatMoney(bill[0].total_price);
        bill[0].discount_voucher_price = formatMoney(bill[0].discount_voucher_price);
        total_price_no_voucher = formatMoney(total_price_no_voucher);
        for (const p of listProduct) {
            p.price = formatMoney(p.price);
            p.price_sale = formatMoney(p.price_sale);
        }
    }
    res.render('bill_detail', {
        bill: bill[0],
        total_price_no_voucher: total_price_no_voucher,
        listProduct: listProduct,
    });
};
// Lấy tất cả bill
const getAll = async (req, res) => {
    const connection = await getConnection(req);
    const queryBill = 'SELECT * FROM bill order by created_at DESC';
    const listBill = await query(connection, queryBill);
    for (const bill of listBill) {
        bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
        bill.total_price = formatMoney(bill.total_price);
    }

    res.render('bill', { listBill: listBill });
};
// Lọc các đơn đang chờ
const getWaiting = async (req, res) => {
    const connection = await getConnection(req);
    const queryBill = 'SELECT * FROM bill WHERE status="Chờ Xác Nhận" order by created_at DESC ';
    const listBill = await query(connection, queryBill);
    for (const bill of listBill) {
        bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
        bill.total_price = formatMoney(bill.total_price);
    }
    res.render('bill', { listBill: listBill });
};
// Lọc các đơn đang giao
const getDelivering = async (req, res) => {
    const connection = await getConnection(req);
    const queryBill = 'SELECT * FROM bill WHERE status="Đang Giao" order by created_at DESC ';
    const listBill = await query(connection, queryBill);
    for (const bill of listBill) {
        bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
        bill.total_price = formatMoney(bill.total_price);
    }
    res.render('bill', { listBill: listBill });
};
//Lọc đơn đã giao
const getDelivered = async (req, res) => {
    const connection = await getConnection(req);
    const queryBill = 'SELECT * FROM bill WHERE status="Hoàn Thành" order by created_at DESC ';
    const listBill = await query(connection, queryBill);
    for (const bill of listBill) {
        bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
        bill.total_price = formatMoney(bill.total_price);
    }
    res.render('bill', { listBill: listBill });
};
//Lọc đơn y/c hủy
const getRequestCancellation = async (req, res) => {
    const connection = await getConnection(req);
    const queryBill = 'SELECT * FROM bill WHERE status="Yêu Cầu Hủy Đơn" order by created_at DESC ';
    const listBill = await query(connection, queryBill);
    for (const bill of listBill) {
        bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
        bill.total_price = formatMoney(bill.total_price);
    }
    res.render('bill', { listBill: listBill });
};
// Lọc đơn đã hủy
const getCancelled = async (req, res) => {
    const connection = await getConnection(req);
    const queryBill = 'SELECT * FROM bill WHERE status="Đã Hủy" order by created_at DESC ';
    const listBill = await query(connection, queryBill);
    for (const bill of listBill) {
        bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
        bill.total_price = formatMoney(bill.total_price);
    }
    res.render('bill', { listBill: listBill });
};
// Lọc đơn từ chối
const getRefuse = async (req, res) => {
    const connection = await getConnection(req);
    const queryBill = 'SELECT * FROM bill WHERE status="Từ Chối Đơn" order by created_at DESC ';
    const listBill = await query(connection, queryBill);
    for (const bill of listBill) {
        bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
        bill.total_price = formatMoney(bill.total_price);
    }
    res.render('bill', { listBill: listBill });
};
//getView
const bill = async (req, res) => {
    const connection = await getConnection(req);
    const listBill = await query(connection, billSQL.queryAllBill);
    for (const bill of listBill) {
        bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
        bill.total_price = formatMoney(bill.total_price);
    }
    res.render('bill', { listBill: listBill });
};
// Nhận đơn
const billConfirm = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.params;
        const connection = await getConnection(req);
        const bill = await query(connection, billSQL.queryBillById, [id]);
        if (isEmpty(bill)) return res.status(404).json({ message: 'Bill not found' });
        await query(connection, billSQL.updateStatusBillWeb, ['Đang Giao', id]);
        const listBill = await query(connection, billSQL.queryAllBill);
        for (const bill of listBill) {
            bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
            bill.total_price = formatMoney(bill.total_price);
        }
        res.render('bill', { listBill: listBill });
    } catch (error) {
        return res.status(500).json({ message: `${e}` });
    }
};
//Hoàn Thành
const billDone = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection(req);
        const bill = await query(connection, billSQL.queryBillById, [id]);
        if (isEmpty(bill)) return res.status(404).json({ message: 'Không tìm thấy bill' });
        const queryListBillDetail = 'SELECT product_name ,size ,quantity FROM bill_detail WHERE bill_id=?';
        const listBillDetail = await query(connection, queryListBillDetail, [id]);
        const queryProduct = 'SELECT product_id ,quantity_sold FROM product WHERE product_name =?';
        const updateProduct = 'UPDATE product SET quantity_sold=? WHERE product_id=?';
        const querySize = 'SELECT size, quantity,size_id FROM size WHERE product_id=? AND size=?';
        const updateSize = 'UPDATE size SET quantity=? WHERE size_id=?';
        for (const billDetail of listBillDetail) {
            const product = await query(connection, queryProduct, [billDetail.product_name]);
            const newQuantity = product[0].quantity_sold + billDetail.quantity;
            await query(connection, updateProduct, [newQuantity, product[0].product_id]);
            const size = await query(connection, querySize, [product[0].product_id, billDetail.size]);
            if (size[0].quantity > 0) {
                if (size[0].quantity >= billDetail.quantity) {
                    const newSizeQuantity = size[0].quantity - billDetail.quantity;
                    await query(connection, updateSize, [newSizeQuantity, size[0].size_id]);
                } else {
                    return res.status(404).json({
                        message: `Số lượng hàng của size ${size[0].size} không đủ so với đặt hàng ! Còn ${size[0].quantity} sp size ${size[0].size}`,
                    });
                }
            } else {
                return res.status(404).json({
                    message: `Size ${size[0].size} hết hàng`,
                });
            }
        }
        await query(connection, billSQL.updateStatusBillWeb, ['Hoàn Thành', id]);
        const listBill = await query(connection, billSQL.queryAllBill);
        for (const bill of listBill) {
            bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
            bill.total_price = formatMoney(bill.total_price);
        }
        res.render('bill', { listBill: listBill });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};
// Từ chối đơn
const billCancel = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection(req);
        const bill = await query(connection, billSQL.queryBillById, [id]);
        if (isEmpty(bill)) return res.status(404).json({ message: 'Bill not found' });
        await query(connection, billSQL.updateStatusBillWeb, ['Từ Chối Đơn', id]);
        const listBill = await query(connection, billSQL.queryAllBill);
        for (const bill of listBill) {
            bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
            bill.total_price = formatMoney(bill.total_price);
        }
        res.render('bill', { listBill: listBill });
    } catch (error) {
        return res.status(500).json({ message: `${e}` });
    }
};
//Đồng ý hủy
const billCancelDone = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection(req);
        const bill = await query(connection, billSQL.queryBillById, [id]);
        if (isEmpty(bill)) return res.status(404).json({ message: 'Bill not found' });
        await query(connection, billSQL.updateStatusBillWeb, ['Đã Hủy', id]);
        const listBill = await query(connection, billSQL.queryAllBill);
        for (const bill of listBill) {
            bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
            bill.total_price = formatMoney(bill.total_price);
        }
        res.render('bill', { listBill: listBill });
    } catch (error) {
        return res.status(500).json({ message: `${e}` });
    }
};
//Từ Chối Hủy
const refuseToCancelBill = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection(req);
        const bill = await query(connection, billSQL.queryBillById, [id]);
        if (isEmpty(bill)) return res.status(404).json({ message: 'Bill not found' });
        await query(connection, billSQL.updateBill, ['Đang Giao', 'Cửa Hàng Đã Từ Chối Yêu Cầu Hủy Của Bạn ', id]);
        const listBill = await query(connection, billSQL.queryAllBill);
        for (const bill of listBill) {
            bill.created_at = moment(bill.created_at).format('DD-MM-YYYY');
            bill.total_price = formatMoney(bill.total_price);
        }
        res.render('bill', { listBill: listBill });
    } catch (error) {
        return res.status(500).json({ message: `${e}` });
    }
};

module.exports = {
    billConfirm,
    billDone,
    billCancel,
    billCancelDone,
    refuseToCancelBill,
    bill,
    add,
    getListBill,
    getBillDetail,
    cancelOrder,
    feedback,
    returnRequest,
    getAll,
    getWaiting,
    getDelivering,
    getDelivered,
    getRequestCancellation,
    getCancelled,
    getRefuse,
    getBillDetailWeb,
};
