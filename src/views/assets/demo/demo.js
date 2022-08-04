const { data } = require('jquery');

demo = {
    initDocChart: function () {
        chartColor = '#FFFFFF';

        ctx = document.getElementById('chartHours').getContext('2d');

        myChart = new Chart(ctx, {
            type: 'line',

            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [
                    {
                        borderColor: '#6bd098',
                        backgroundColor: '#6bd098',
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        borderWidth: 3,
                        data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354],
                    },
                    {
                        borderColor: '#f17e5d',
                        backgroundColor: '#f17e5d',
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        borderWidth: 3,
                        data: [320, 340, 365, 360, 370, 385, 390, 384, 408, 420],
                    },
                    {
                        borderColor: '#fcc468',
                        backgroundColor: '#fcc468',
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        borderWidth: 3,
                        data: [370, 394, 415, 409, 425, 445, 460, 450, 478, 484],
                    },
                ],
            },
            options: {
                legend: {
                    display: false,
                },

                tooltips: {
                    enabled: false,
                },

                scales: {
                    yAxes: [
                        {
                            ticks: {
                                fontColor: '#9f9f9f',
                                beginAtZero: false,
                                maxTicksLimit: 5,
                                //padding: 20
                            },
                            gridLines: {
                                drawBorder: false,
                                zeroLineColor: '#ccc',
                                color: 'rgba(255,255,255,0.05)',
                            },
                        },
                    ],

                    xAxes: [
                        {
                            barPercentage: 1.6,
                            gridLines: {
                                drawBorder: false,
                                color: 'rgba(255,255,255,0.1)',
                                zeroLineColor: 'transparent',
                                display: false,
                            },
                            ticks: {
                                padding: 20,
                                fontColor: '#9f9f9f',
                            },
                        },
                    ],
                },
            },
        });
    },

    initChartsPages: function (list) {
        chartColor = '#FFFFFF';
        console.log(list, 'truyen vao rooooooooo');
        ctx = document.getElementById('chartHours').getContext('2d');

        // var xValues = ListDoanhThu.month;
        // var yValues = ListDoanhThu.DanhThu;
        // var barColors = ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080'];

        // myChart = new Chart(ctx, {
        //   type: 'bar',
        //   data: {
        //     labels: xValues,
        //     datasets: [
        //       {
        //         backgroundColor: barColors,
        //         data: yValues,
        //       },
        //     ],
        //   },
        // });

        ctx = document.getElementById('chartEmail').getContext('2d');

        myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [1, 2, 3],
                datasets: [
                    {
                        label: 'Emails',
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        backgroundColor: ['#e3e3e3', '#4acccd', '#fcc468', '#ef8157'],
                        borderWidth: 0,
                        data: [342, 480, 530, 120],
                    },
                ],
            },

            options: {
                legend: {
                    display: false,
                },

                pieceLabel: {
                    render: 'percentage',
                    fontColor: ['white'],
                    precision: 2,
                },

                tooltips: {
                    enabled: false,
                },

                scales: {
                    yAxes: [
                        {
                            ticks: {
                                display: false,
                            },
                            gridLines: {
                                drawBorder: false,
                                zeroLineColor: 'transparent',
                                color: 'rgba(255,255,255,0.05)',
                            },
                        },
                    ],

                    xAxes: [
                        {
                            barPercentage: 1.6,
                            gridLines: {
                                drawBorder: false,
                                color: 'rgba(255,255,255,0.1)',
                                zeroLineColor: 'transparent',
                            },
                            ticks: {
                                display: false,
                            },
                        },
                    ],
                },
            },
        });

        var speedCanvas = document.getElementById('speedChart');

        var dataFirst = {
            data: [0, 19, 15, 20, 30, 40, 40, 50, 25, 30, 50, 70],
            fill: false,
            borderColor: '#fbc658',
            backgroundColor: 'transparent',
            pointBorderColor: '#fbc658',
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBorderWidth: 8,
        };

        var dataSecond = {
            data: [0, 5, 10, 12, 20, 27, 30, 34, 42, 45, 55, 63],
            fill: false,
            borderColor: '#51CACF',
            backgroundColor: 'transparent',
            pointBorderColor: '#51CACF',
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBorderWidth: 8,
        };

        var speedData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [dataFirst, dataSecond],
        };

        var chartOptions = {
            legend: {
                display: false,
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
        console.log('DU LIEU CUA DATA', data);
        return data;
    },

    async confirmStatusBill(id, status) {
        console.log(id, status);
        let method = 'POST';
        var params = JSON.stringify({
            id: id,
        });
        let url = 'http://localhost:5000' + status;
        const res = await this.callAPI(url, params, method);
        this.showNotification('top', 'right', res.message);
        setTimeout(function () {
            document.location.reload();
        }, 1500);
    },
};
