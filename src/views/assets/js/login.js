login = {
    loginAdmin: function () {
        const login = "http://modelfashion.store/login";
        let phone = document.querySelector("#phone").value;
        let password = document.querySelector("#password").value;

        var re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (password.indexOf(" ") >= 0) {
            return this.showNotification('top', 'right', "Password không đc có khoảng trắng");
        }
        if (password.length == 0) {
            return this.showNotification('top', 'right', "Password không đc để trống");
        }
        if (!re.test(phone)) {
            return this.showNotification('top', 'right', "Số điện thoại không hợp lệ");
        }
        fetch(login, {
            method: "POST",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phone: phone,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message);
                if (data.error) {
                    this.showNotification('top', 'right', data.error)
                } else {
                    this.showNotification('top', 'right', data.message)
                    setTimeout(() => {
                        location.replace(
                            "http://modelfashion.store/main"
                        );
                    }, 2000);
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }, showNotification: function (from, align, message, color) {
        this.color ? color = color : color = "primary";
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
