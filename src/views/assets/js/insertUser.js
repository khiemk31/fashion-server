
const btnAddUser = document.querySelector("#btnAddUser");
const name = document.querySelector("#name")
const phone = document.querySelector("#phone")
const gender = document.querySelector("#gender")
const permission = document.querySelector("#permission")
const address = document.querySelector("#address")
const password = document.querySelector("#password")
const rePassword = document.querySelector("#rePassword")
btnAddUser.onclick = async function () {
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
    if (password.value.indexOf(" ") >= 0 || rePassword.value.indexOf(" ") >= 0) {
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
    if (password.value.length == 0 || rePassword.value.length == 0) {
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
    if (password.value.length < 6) {
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
    if (password.value === rePassword.value) {
        let method = 'POST';
        let params = JSON.stringify({
            phone: phone.value,
            password: password.value,
            user_name: name.value,
            gender: gender.value,
            address: address.value,
            permission: permission.value,
        });
        let url = 'http://modelfashion.store/user/insertUser';
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
                        "http://modelfashion.store/user"
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



