const user = require('./controller/user');
const category = require('./controller/category');
const product = require('./controller/product');
const bill = require('./controller/bill');
const main = require('./controller/main');
const voucher = require('./controller/voucher');
const middleware = require('../src/utils/middleware/authenToken.middleware');
const profile = require('./controller/profile');

module.exports = (router) => {
    //Main Router
    router.get('/main', middleware.requireAuth, main.main);
    //Main API
    router.post('/revenue', middleware.requireAuth, main.listRevenueByYear);
    router.get('/billStatistics', middleware.requireAuth, main.billStatistics);
    router.get('/billDetailStatistics', middleware.requireAuth, main.billDetailStatistics);
    router.get('/top10User', middleware.requireAuth, main.queryTop10User);
    router.get('/top10Product', middleware.requireAuth, main.queryTop10Product);
    //
    router.get('/test', main.test);
    //category API
    router.get('/category/getAll', category.getAll);
    //category Web View
    router.get('/category/', middleware.requireAuth, category.category);
    router.get('/insertCategory', middleware.requireAuth, category.getAddCategory);
    router.post('/addCategory', middleware.requireAuth, category.addCategory);
    router.get('/category/update/:id', middleware.requireAuth, category.getUpdateCategory);
    router.post('/category/update', middleware.requireAuth, category.update);
    router.get('/category/remove/:id', middleware.requireAuth, category.removeCategory);
    router.get('/category/deleted', middleware.requireAuth, category.getCategoryDeleted);
    router.get('/category/updated', middleware.requireAuth, category.getCategoryUpdated);
    router.get('/category/created', middleware.requireAuth, category.getCategoryCreated);
    //Product API
    router.get('/product/getAllProductByCategory', product.getAllProductByCategory);
    router.get('/product/getProductByCategory', product.getProductByCategory);
    router.get('/product/getProductDiscount', product.getProductDiscount);
    router.get('/product/detail/:id', product.getProductDetail);
    router.get('/product/getAllProductDiscount', product.getAllProductDiscount);
    //Product Web View
    router.get('/updateProduct/:id', middleware.requireAuth, product.getUpdate);
    router.post('/product/update', middleware.requireAuth, product.update);
    router.post('/product/search', middleware.requireAuth, product.search);
    router.get('/product/productDetail/:id', middleware.requireAuth, product.productDetail);
    router.get('/product/listProductCreated', middleware.requireAuth, product.listProductCreated);
    router.get('/product/listProductDeleted', middleware.requireAuth, product.listProductDeleted);
    router.post('/product/addProduct', middleware.requireAuth, product.add);
    router.get('/product/insertProduct', middleware.requireAuth, product.insertProduct);
    router.get('/product', middleware.requireAuth, product.product);
    router.get('/product/remove/:id', middleware.requireAuth, product.removeProduct);
    router.get('/product/getAll', product.getAll);
    //User API
    router.get('/user/getUser', user.getUser);
    router.post('/user/checkActive', user.checkActive);
    router.post('/user/checkUser', user.checkUser);
    router.get('/user/getAddress/:id', user.getAddress);
    router.put('/user/updateAddress', user.updateAddress);
    router.post('/user/register', user.register);
    router.post('/user/login', user.login);
    router.put('/user/recoveryPass', user.recoveryPassword);
    router.put('/user/update', user.update);
    router.get('/user/detail/:id', user.detail);
    router.post('/user/send-otp', user.apiSendOTP);
    router.post('/user/verify-otp', user.verifyOTP);
    //User Web View
    router.get('/user/logout', user.getLogOut);
    router.post('/user/searchUser', middleware.requireAuth, user.searchUser);
    router.get('/user/insertUser', middleware.requireAuth, user.getInsertUser);
    router.post('/user/insertUser', middleware.requireAuth, user.postInsertUser);
    router.get('/user/remove/:id', middleware.requireAuth, user.blockUser);
    router.get('/user/active/:id', middleware.requireAuth, user.activeUser);
    router.get('/login', user.loginWeb);
    router.post('/login', user.loginAdmin);
    router.get('/user/userDetail', middleware.requireAuth, user.userDetail);
    router.get('/user', middleware.requireAuth, user.getAll);
    router.get('/getUser', middleware.requireAuth, user.getAllUser);
    router.get('/getAllAdmin', middleware.requireAuth, user.getAllAdmin);
    router.get('/getSupperAdmin', middleware.requireAuth, user.getSupperAdmin);
    router.get('/getUserBlock', middleware.requireAuth, user.getUserBlock);
    //Bill API
    router.post('/bill/add', bill.add);
    router.get('/bill/getListBill/:id', bill.getListBill);
    router.get('/bill/getBillDetail/:id', bill.getBillDetail);
    router.put('/bill/cancelOrder', bill.cancelOrder);
    router.put('/bill/feedback', bill.feedback);
    router.put('/bill/returnRequest', bill.returnRequest);
    //Bill Web View
    router.get('/bill', middleware.requireAuth, bill.bill);
    router.get('/bill/getBillDetailWeb/:id', middleware.requireAuth, bill.getBillDetailWeb);
    router.get('/bill/getAll', middleware.requireAuth, bill.getAll);

    router.post('/bill/billConfirm', middleware.requireAuth, bill.billConfirm);
    router.post('/bill/billCancel', middleware.requireAuth, bill.billCancel);
    router.post('/bill/billCancellationConfirmation', middleware.requireAuth, bill.billCancellationConfirmation);
    router.post('/bill/rejectCancellationRequest', middleware.requireAuth, bill.rejectCancellationRequest);
    router.post('/bill/confirmReturnRequest', middleware.requireAuth, bill.confirmReturnRequest);
    router.post('/bill/rejectReturnRequest', middleware.requireAuth, bill.rejectReturnRequest);
    router.post('/bill/billDone', middleware.requireAuth, bill.billDone);
    router.post('/bill/billFail', middleware.requireAuth, bill.billFail);
    //Web Profile
    router.get('/profile', profile.profile);
    router.get('/profile/edit', profile.edit);
    router.post('/profile/update', profile.update);
    //Voucher API
    router.get('/getVoucherUser', voucher.getVoucherUser);
    router.post('/useVoucher', voucher.useVoucher);
};
