bill = {
    showNotification: function (from, align, message, color) {
        this.color ? color =color : color = "primary";
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
    },
 async   confirmStatusBill(id, status) {
        let myHeaders = new Headers();
        const params = JSON.stringify({
             id: id,
         });
        myHeaders.append('Content-Type', 'application/json');
        let requestOptions = {
            method:  'POST',
            headers: myHeaders,
            body: params,
            redirect: 'follow',
        };
        let url = 'http://modelfashion.store' + status;
      await  fetch(url, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                const  data = JSON.parse(result);
                if (data.result) {
                    this.showNotification('top', 'right', data.message);
                    setTimeout(() => {
                         document.location.reload();  
                    }, 5000);
                }else{
                    this.showNotification('top', 'right', data.message);
                }
                }).catch((error) => console.log('error', error));
    },
    onClickForm(status, bill_id) {
        document.querySelector('.feedback-form').style.display = 'flex';

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
    },
};
