bill = {
    async callAPI(url, params, method) {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        let requestOptions = {
            method: method,
            headers: myHeaders,
            body: params,
            redirect: 'follow',
        };
        console.log("URRL : " + url, requestOptions)
        let data;
        await fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
                data = JSON.parse(result);
            })
            .catch((error) => console.log('error', error));
        return data;
    },
    async getBill() {
        let method = 'GET';
        var params;
        let url = 'http://modelfashion.store/bill/getAll';
        let listBill = '';
        const data = await this.callAPI(url, params, method);
        if (data.listBill.length > 0) {
            data.listBill.forEach((bill, index) => {
                listBill += `<tr>`
                listBill += `<td>${index + 1}</td>`
                listBill += `<td><a href="/bill/getBillDetailWeb/${bill.bill_id}">${bill.bill_id}</a></td>`
                listBill += `<td><a href="/user/userDetail/?user_id=${bill.user_id}">${bill.user_name}</a></td>`
                listBill += `<td>${bill.phone}</td>`
                listBill += `<td>${bill.total_price}</td>`
                listBill += `<td>${bill.created_at}</td>`
                listBill += `<td>${bill.status}</td>`
                if (bill.status == "Chờ Xác Nhận") {
                    listBill += `<td><div class="row">
                         <button class="btn btn-outline-primary btn-round" onclick="bill.confirmStatusBill('${bill.bill_id}','/bill/billConfirm')"><i class="nc-icon nc-check-2" style="font-size : 14px ;"></i></button>
                         <button class="btn btn-outline-danger btn-round" onclick="bill.onClickForm('Chờ Xác Nhận','${bill.bill_id}');"><i class="nc-icon nc-simple-remove" style="font-size : 14px ;"></i></button></div></td>`
                }
                if (bill.status == "Yêu Cầu Hủy Đơn") {
                    listBill += `<td><div class="row">
                         <button class="btn btn-outline-primary btn-round" onclick="bill.confirmStatusBill('${bill.bill_id}','/bill/billCancellationConfirmation')"><i class="nc-icon nc-check-2" style="font-size : 14px ;"></i></button>
                         <button class="btn btn-outline-danger btn-round" onclick="bill.onClickForm('Yêu Cầu Hủy Đơn','${bill.bill_id}');"><i class="nc-icon nc-simple-remove" style="font-size : 14px ;"></i></button></div></td>`
                }
                if (bill.status == "Yêu Cầu Hoàn Đơn") {
                    listBill += `<td><div class="row">
                         <button class="btn btn-outline-primary btn-round" onclick="bill.confirmStatusBill('${bill.bill_id}','/bill/confirmReturnRequest')"><i class="nc-icon nc-check-2" style="font-size : 14px ;"></i></button>
                         <button class="btn btn-outline-danger btn-round" onclick="bill.onClickForm('Yêu Cầu Hoàn Đơn','${bill.bill_id}');"><i class="nc-icon nc-simple-remove" style="font-size : 14px ;"></i></button></div></td>`
                }
                if (bill.status == "Đang Giao") {
                    listBill += `<td><div class="row">
                         <button class="btn btn-outline-primary btn-round" onclick="bill.confirmStatusBill('${bill.bill_id}','/bill/billDone')"><i class="nc-icon nc-check-2" style="font-size : 14px ;"></i></button>
                         <button class="btn btn-outline-danger btn-round" onclick="bill.onClickForm('Đang Giao','${bill.bill_id}');"><i class="nc-icon nc-simple-remove" style="font-size : 14px ;"></i></button></div></td>`
                }
                listBill += `</tr>`;
            })
            document.getElementById('listBill').innerHTML = listBill;
        } else {
            listBill += "<h5>Chưa có data</h5>"
            document.getElementById('listBill').innerHTML = listBill;
        }
    }, async confirmStatusBill(id, status) {
        console.log("MÃ BILL", id);
        let method = 'POST';
        let url = 'http://modelfashion.store' + status;
        const params = JSON.stringify({
            id: id,
        });
        console.log("URL", url);
        const data = await this.callAPI(url, params, method);
        console.log(typeof data);
        if (data.result) {
            this.showNotification('top', 'right', data.message);
            setTimeout(() => {
                location.reload();
            }, 5000);
        } else {
            this.showNotification('top', 'right', data.message);
        }
    }, onClickForm(status, bill_id) {
        document.querySelector('.feedback-form').style.display = 'flex';
        console.log(status, bill_id)
        var formFeedback = '';
        if (status == 'Chờ Xác Nhận') {
            formFeedback =
                '<h2>Nhập lý do từ chối đơn<span id="feedback-close">X Đóng</span></h2>' +
                '<div class="card-body">' +
                '<form action="/bill/billCancel" method="POST" role="form">' +
                '<input type="text" name="page" hidden="hidden" value="bill"/>' +
                `<input type="text" name="bill_id" hidden="hidden" value="${bill_id}"/>` +
                '<div class="row">' +
                '<div class="col-md-12 mh-2">' +
                '<div class="form-group">' +
                '<input class="form-control" type="text" required="" name="feedback_by_store" placeholder="Vui Lòng nhập lý do"/>' +
                '</div></div></div>' +
                `<button class="btn btn-warning btn-round" onclick="bill.showNotification('top', 'right', 'Cập nhật thành công')">Cập nhật thông tin</button>` +
                ' </form></div>';
            document.getElementById('formFeedback').innerHTML = formFeedback;
            const feedBackClose = document.querySelector('#feedback-close');
            feedBackClose.addEventListener('click', function () {
                document.querySelector('.feedback-form').style.display = 'none';
            });
        } else if (status == 'Yêu Cầu Hủy Đơn') {
            formFeedback =
                '<h2>Nhập lý do từ chối yêu cầu<span id="feedback-close">X Đóng</span></h2>' +
                '<div class="card-body">' +
                '<form action="/bill/rejectCancellationRequest" method="POST" role="form">' +
                '<input type="text" name="page" hidden="hidden" value="bill"/>' +
                `<input type="text" name="bill_id" hidden="hidden" value="${bill_id}"/>` +
                '<div class="row">' +
                '<div class="col-md-12 mh-2">' +
                '<div class="form-group">' +
                '<input class="form-control" type="text" required="" name="feedback_by_store" placeholder="Vui Lòng nhập lý do"/>' +
                '</div></div></div>' +
                `<button class="btn btn-warning btn-round" onclick="bill.showNotification('top', 'right', 'Cập nhật thành công')">Cập nhật thông tin</button>` +
                ' </form></div>';
            document.getElementById('formFeedback').innerHTML = formFeedback;
            const feedBackClose = document.querySelector('#feedback-close');
            feedBackClose.addEventListener('click', function () {
                document.querySelector('.feedback-form').style.display = 'none';
            });
        } else if (status == 'Yêu Cầu Hoàn Đơn') {
            formFeedback =
                '<h2>Nhập lý do từ chối yêu cầu<span id="feedback-close">X Đóng</span></h2>' +
                '<div class="card-body">' +
                '<form action="/bill/rejectReturnRequest" method="POST" role="form">' +
                '<input type="text" name="page" hidden="hidden" value="bill"/>' +
                `<input type="text" name="bill_id" hidden="hidden" value="${bill_id}"/>` +
                '<div class="row">' +
                '<div class="col-md-12 mh-2">' +
                '<div class="form-group">' +
                '<input class="form-control" type="text" required="" name="feedback_by_store" placeholder="Vui Lòng nhập lý do"/>' +
                '</div></div></div>' +
                `<button class="btn btn-warning btn-round" onclick="bill.showNotification('top', 'right', 'Cập nhật thành công')">Cập nhật thông tin</button>` +
                ' </form></div>';
            document.getElementById('formFeedback').innerHTML = formFeedback;
            const feedBackClose = document.querySelector('#feedback-close');
            feedBackClose.addEventListener('click', function () {
                document.querySelector('.feedback-form').style.display = 'none';
            });
        } else if (status == 'Đang Giao') {
            formFeedback =
                '<h2>Nhập lý do giao hàng thất bại<span id="feedback-close">X Đóng</span></h2>' +
                '<div class="card-body">' +
                '<form action="/bill/billFail" method="POST" role="form">' +
                '<input type="text" name="page" hidden="hidden" value="bill"/>' +
                `<input type="text" name="bill_id" hidden="hidden" value="${bill_id}"/>` +
                '<div class="row">' +
                '<div class="col-md-12 mh-2">' +
                '<div class="form-group">' +
                '<input class="form-control" type="text" required="" name="feedback_by_store" placeholder="Vui Lòng nhập lý do"/>' +
                '</div></div></div>' +
                `<button class="btn btn-warning btn-round" onclick="bill.showNotification('top', 'right', 'Cập nhật thành công')">Cập nhật thông tin</button>` +
                ' </form></div>';
            document.getElementById('formFeedback').innerHTML = formFeedback;
            const feedBackClose = document.querySelector('#feedback-close');
            feedBackClose.addEventListener('click', function () {
                document.querySelector('.feedback-form').style.display = 'none';
            });
        }
    }, showNotification: function (from, align, message, color) {
        this.color ? color = color : color = "primary";
        color = color;
        $.notify(
            {
                icon: 'nc-icon nc-bell-55',
                message: message,
            },
            {
                type: color,
                timer: 8000,
                placement: {
                    from: from,
                    align: align,
                },
            },
        );
    }
};
