forgotPassword = {
    async callAPI(url, params, method) {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        let requestOptions = {
            method: method,
            headers: myHeaders,
            body: params,
            redirect: 'follow',
        };
        let data;
        await fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
                data = JSON.parse(result);
            })
            .catch((error) => console.log('error', error));
        return data;
    }, async recoveryPass() {
        let phone = document.querySelector("#phone").value;
        let token;
        const btnGetOTP = document.querySelector("#getOTP");
        btnGetOTP.onclick = function () {
            var re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
            if (!re.test(phone)) {
                return this.showNotification('top', 'right', "Số điện thoại không hợp lệ");
            }
            let method = 'POST';
            let params = JSON.stringify({
                phone: phone,
            });
            let url = 'http://modelfashion.store/user/send-otp';
            const data = await this.callAPI(url, params, method);
            token = data.otp_token
        }
        document.querySelector("#phone").style.display = "none";
        document.querySelector("#divOTP").style.display = "block";
        document.querySelector("#verifyOTP").onclick = function () {
            alert("button was clicked");
        };

        method = 'POST';
        params = JSON.stringify({
            phone: phone,
        });
        url = 'http://modelfashion.store/user/verify-otp';

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