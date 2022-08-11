demo = {
    async callAPI(url, params, method) {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        let requestOptions = {
            method: method,
            headers: myHeaders,
            body: params,
            redirect: 'follow',
        };
        await fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                data = JSON.parse(result);
            })
            .catch((error) => console.log('error', error));
        return data;
    },
    onClickForm(status, bill_id) {
        console.log('adsfasdfdfasd');
        document.querySelector('.feedback-form').style.display = 'flex';
        addressclose.addEventListener('click', function () {
            document.querySelector('.feedback-form').style.display = 'none';
        });
        // if (status == 'Chờ Xác Nhận') {
        // } else if (status == 'Yêu Cầu Hủy Đơn') {
        // } else if (status == 'Yêu Cầu Hoàn Đơn') {
        // } else if (status == 'Đang Giao') {
        // }
    },
    async confirmStatusBill(id, status) {
        let method = 'POST';
        var params = JSON.stringify({
            id: id,
        });
        let url = 'http://modelfashion.store' + status;
        const res = await this.callAPI(url, params, method);
        if (res.result) {
            this.showNotification('top', 'right', res.message);
            document.location.reload();
        }

        // setTimeout(function () {
        //     document.location.reload();
        // }, 1500);
    },
    async getListProduct() {
        let method = 'GET';
        var params;
        let url = 'http://modelfashion.store/getListProduct';
        const res = await this.callAPI(url, params, method);
        if (res.listProduct.length > 0) {
            var p = '';
            res.listProduct.forEach((product) => {
                p += '<div class="col-md-3 pl-2" > ';
                p += '<div class="card" style="width: 17.5rem; height : 30rem ;">';
                p +=
                    '<img src="' +
                    product.product_image +
                    '" class="card-img-top mb-2" style="width: 16rem; height: 300px;"/> ';
                if (product.discount) {
                    p += '<div class="note on-sale">Đang sale ' + product.discount + '%</div>';
                }
                p += '<card-body class="text-center"> <a href="#"> ';
                p +=
                    '<p class="card-title p-1 text-info" style=" height: 2.5rem ; font-size:16px"></p></a>' +
                    product.product_name;
                if (product.sale_price) {
                    p += '<p class="card-text mt-2 mb-2  font-weight-bold">Giá: <del>' + product.price + 'đ<del/></p> ';
                    p +=
                        '<p class="card-text mt-2 mb-2 text-danger font-weight-bold"> Giảm giá: ' +
                        product.sale_price +
                        'đ</p> ';
                } else {
                    p += '  <p class="card-text mt-4 mb-4 font-weight-bold">Giá: ' + product.price + 'đ</p> ';
                }

                p += ' </card-body> </div> </div>';
            });
            document.getElementById('dataAllProduct').innerHTML = p;
        }
    },
    async top10User() {
        let method = 'GET';
        var params;
        let url = 'http://modelfashion.store/top10User';
        const res = await this.callAPI(url, params, method);
        if (res.listUser.length > 0) {
            var temp = '';
            res.listUser.forEach((user) => {
                temp += '<tr>';
                temp += '<td>' + user.user_id + '</td>';
                temp += '<td>' + user.user_name + '</td>';
                temp += '<td>' + user.billCount + '</td>';
                temp += '<td>' + user.totalAmountSpent + '</td></tr>';
            });
            document.getElementById('dataUser').innerHTML = temp;
        }
    },
    async top10Product() {
        let method = 'GET';
        var params;
        let url = 'http://modelfashion.store/top10Product';
        const res = await this.callAPI(url, params, method);

        if (res.listProduct.length > 0) {
            var temp = '';
            res.listProduct.forEach((product) => {
                temp += '<tr>';
                temp += '<td>' + product.product_id + '</td>';
                temp += '<td>' + product.product_name + '</td>';
                temp += '<td>' + product.category_name + '</td>';
                temp += '<td>' + product.quantity_sold + '</td>';
                temp += '<td>' + product.quantity_stock + '</td></tr>';
            });
            document.getElementById('dataProduct').innerHTML = temp;
        }
    },
    async initChartsPages() {
        //Biểu đồ doanh thu theo tháng
        var xValues = [];
        var yValues = [];
        let method = 'POST';
        var params = JSON.stringify({
            year: 2022,
        });
        let url = 'http://modelfashion.store/revenue';
        const res = await this.callAPI(url, params, method);

        const listRevenue = res.listRevenue;
        chartColor = '#FFFFFF';

        ctx = document.getElementById('chartRevenue').getContext('2d');
        for (const revenue of listRevenue) {
            xValues.push('Tháng ' + revenue.Month);
            yValues.push(revenue.Revenue);
        }

        var barColors = [
            '#ff0000',
            '#ff8000',
            '#ffff00',
            '#80ff00',
            '#00ff00',
            '#00ff80',
            '#00ffff',
            '#0080ff',
            '#0000ff',
            '#8000ff',
            '#ff00ff',
            '#ff0080',
        ];

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: xValues,
                datasets: [
                    {
                        backgroundColor: barColors,
                        data: yValues,
                    },
                ],
            },
            options: {
                legend: {
                    display: false,
                },
            },
        });
        //Biểu đồ tổng các đơn theo trạng thái
        ctx = document.getElementById('chartBill').getContext('2d');
        let method2 = 'GET';
        var params2;
        let url2 = 'http://modelfashion.store/billStatistics';
        const res2 = await this.callAPI(url2, params2, method2);

        myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Yêu cầu hủy,hoàn', 'Đã hủy,hoàn'],
                datasets: [
                    {
                        label: 'My First Dataset',
                        data: [
                            res2.billWaiting,
                            res2.billDelivering,
                            res2.billDone,
                            res2.billRequestCancellationORRefund,
                            res2.billFail,
                        ],
                        backgroundColor: ['#00ffff', '#0080ff', '#00ff00', '#ffff00', '#ff0000'],
                        hoverOffset: 4,
                    },
                ],
            },
        });
        //Biểu đồ thống kê đơn theo tháng
        var speedCanvas = document.getElementById('speedChart');
        let method3 = 'GET';
        var params3;
        let url3 = 'http://modelfashion.store/billDetailStatistics';
        const res3 = await this.callAPI(url3, params3, method3);
        const listBillDetailStatistics = res3.listBillDetailStatistics;
        var listBillWaiting = [];
        var listBillDelivering = [];
        var listBillDone = [];
        var listBillRequestCancellationORRefund = [];
        var listBillFail = [];
        for (const billDetailStatistics of listBillDetailStatistics) {
            listBillWaiting.push(billDetailStatistics.billWaiting);
            listBillDelivering.push(billDetailStatistics.billDelivering);
            listBillDone.push(billDetailStatistics.billDone);
            listBillRequestCancellationORRefund.push(billDetailStatistics.billRequestCancellationORRefund);
            listBillFail.push(billDetailStatistics.billFail);
        }
        var data1 = {
            label: 'Chờ xác nhận',
            data: listBillWaiting,
            fill: false,
            borderColor: '#00ffff',
            backgroundColor: 'transparent',
            pointBorderColor: '#00ffff',
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBorderWidth: 8,
        };

        var data2 = {
            label: 'Đang giao',
            data: listBillDelivering,
            fill: false,
            borderColor: '#0080ff',
            backgroundColor: 'transparent',
            pointBorderColor: '#0080ff',
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBorderWidth: 8,
        };
        var data3 = {
            label: 'Hoàn thành',
            data: listBillDone,
            fill: false,
            borderColor: '#00ff00',
            backgroundColor: 'transparent',
            pointBorderColor: '#00ff00',
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBorderWidth: 8,
        };
        var data4 = {
            label: 'Yêu cầu hủy,hoàn',
            data: listBillRequestCancellationORRefund,
            fill: false,
            borderColor: '#ffff00',
            backgroundColor: 'transparent',
            pointBorderColor: '#ffff00',
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBorderWidth: 8,
        };
        var data5 = {
            label: 'Đã hủy,hoàn',
            data: listBillFail,
            fill: false,
            borderColor: '#ff0000',
            backgroundColor: 'transparent',
            pointBorderColor: '#ff0000',
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBorderWidth: 8,
        };

        var speedData = {
            labels: [
                'Tháng 1',
                'Tháng 2',
                'Tháng 3',
                'Tháng 4',
                'Tháng 5',
                'Tháng 6',
                'Tháng 7',
                'Tháng 8',
                'Tháng 9',
                'Tháng 10',
                'Tháng 11',
                'Tháng 12',
            ],
            datasets: [data1, data2, data3, data4, data5],
        };

        var chartOptions = {
            legend: {
                position: 'top',
            },
        };

        var lineChart = new Chart(speedCanvas, {
            type: 'line',
            hover: false,
            data: speedData,
            options: chartOptions,
        });
    },

    showNotification: function (from, align, message, color) {
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
};
