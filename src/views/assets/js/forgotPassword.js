forgotPassword = {
    recoveryPass() {
        let token;
        const btnGetOTP = document.querySelector("#getOTP");
        const divOTP = document.querySelector("#divOTP");
        const btnVerifyOTP = document.querySelector("#verifyOTP");
        const btnChangePass = document.querySelector("#changePass");
        const divChangePass = document.querySelector("#divChangePass");
        const title1 = document.querySelector("#title1");
        const title2 = document.querySelector("#title2");
        btnGetOTP.onclick = async function () {
            let phone = document.querySelector("#phone");
            var re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
            if (!re.test(phone.value)) {
                color = "primary";
                return $.notify(
                    {
                        icon: 'nc-icon nc-bell-55',
                        message: "Số điện thoại không hợp lệ",
                    },
                    {
                        type: color,
                        timer: 8000,
                        placement: {
                            from: 'top',
                            align: 'right',
                        },
                    },
                );
            }
            let method = 'POST';
            let params = JSON.stringify({
                phone: phone.value,
            });
            let url = 'http://modelfashion.store/user/send-otp';
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
                    let data = JSON.parse(result);
                    token = data.otp_token
                    btnGetOTP.style.display = "none";
                    phone.style.display = "none";
                    divOTP.style.display = 'block';
                    btnVerifyOTP.style.display = 'block';
                    var timeleft = 120;
                    var downloadTimer = setInterval(function () {
                        if (timeleft <= 0) {
                            clearInterval(downloadTimer);
                            document.getElementById("countdown").innerHTML = "OTP hết hạn";
                        } else {
                            document.getElementById("countdown").innerHTML = "OTP thời gian hiệu lực còn " + timeleft + "giây";
                        }
                        timeleft -= 1;
                    }, 1000);
                })
                .catch((error) => console.log('error', error));
        }
        btnVerifyOTP.onclick = async function () {
            const otp = document.querySelector("#otp").value;
            let method = 'POST';
            let params = JSON.stringify({
                otp_token: token,
                otp: otp,
            });
            let url = 'http://modelfashion.store/user/verify-otp';
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
                    let data = JSON.parse(result);
                    color = "primary";
                    $.notify(
                        {
                            icon: 'nc-icon nc-bell-55',
                            message: data.message,
                        },
                        {
                            type: color,
                            timer: 8000,
                            placement: {
                                from: 'top',
                                align: 'right',
                            },
                        },
                    );
                    if (data.message == 'success') {
                        divOTP.style.display = 'none';
                        btnVerifyOTP.style.display = 'none';
                        btnChangePass.style.display = 'block';
                        divChangePass.style.display = 'block';
                        title1.style.display = 'none';
                        title2.style.display = 'block';
                    }
                })
                .catch((error) => console.log('error', error));
        };
        btnChangePass.onclick = async function () {
            let phone = document.querySelector("#phone").value;
            console.log("MK Trong fun", phone)
            const password = document.querySelector("#newPass").value;
            const rePassword = document.querySelector("#rePass").value;
            if (password.indexOf(" ") >= 0 || rePassword.indexOf(" ") >= 0) {
                color = "primary";
                return $.notify(
                    {
                        icon: 'nc-icon nc-bell-55',
                        message: "Password không đc có khoảng trắng",
                    },
                    {
                        type: color,
                        timer: 8000,
                        placement: {
                            from: 'top',
                            align: 'right',
                        },
                    },
                );
            }
            if (password.length == 0 || rePassword.length == 0) {
                color = "primary";
                return $.notify(
                    {
                        icon: 'nc-icon nc-bell-55',
                        message: "Password không đc để trống",
                    },
                    {
                        type: color,
                        timer: 8000,
                        placement: {
                            from: 'top',
                            align: 'right',
                        },
                    },
                );
            }
            if (password.length < 6) {
                color = "primary";
                return $.notify(
                    {
                        icon: 'nc-icon nc-bell-55',
                        message: "Password phải từ 6 ký tự trở lên",
                    },
                    {
                        type: color,
                        timer: 8000,
                        placement: {
                            from: 'top',
                            align: 'right',
                        },
                    },
                );
            }
            if (password === rePassword) {
                let method = 'PUT';
                let params = JSON.stringify({
                    password: password,
                    phone: phone,
                });
                let url = 'http://modelfashion.store/user/recoveryPass';
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
                        let data = JSON.parse(result);
                        color = "primary";
                        $.notify(
                            {
                                icon: 'nc-icon nc-bell-55',
                                message: data.message,
                            },
                            {
                                type: color,
                                timer: 8000,
                                placement: {
                                    from: 'top',
                                    align: 'right',
                                },
                            },
                        );
                        setTimeout(() => {
                            location.replace(
                                "http://modelfashion.store/login"
                            );
                        }, 2000);
                    })
                    .catch((error) => console.log('error', error));
            } else {
                color = "primary";
                return $.notify(
                    {
                        icon: 'nc-icon nc-bell-55',
                        message: "Nhập lại mật khẩu không trùng với mật khẩu",
                    },
                    {
                        type: color,
                        timer: 8000,
                        placement: {
                            from: 'top',
                            align: 'right',
                        },
                    },
                );
            }
        }
    }
};