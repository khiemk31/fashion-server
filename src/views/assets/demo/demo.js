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

    async confirmStatusBill(id, status) {
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
    test(string) {
        console.log(string);
    },
    async chartRevenue() {
        var xValues = [];
        var yValues = ['100.000.000'];
        let method = 'POST';
        var params = JSON.stringify({
            year: 2022,
        });
        let url = 'http://localhost:5000/revenue';
        const res = await this.callAPI(url, params, method);

        const listRevenue = res.listRevenue;
        chartColor = '#FFFFFF';

        ctx = document.getElementById('chartHours').getContext('2d');
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
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.yLabel;
                        },
                    },
                },
            },
        });
    },
    async initChartsPages() {
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
};
