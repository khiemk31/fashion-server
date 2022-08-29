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
        let data;
        await fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                data = JSON.parse(result);
            })
            .catch((error) => console.log('error', error));
        return data;
    },async confirmStatusBill(id, status) {
        let method = 'POST';
        let url = 'http://modelfashion.store' + status;
        const params = JSON.stringify({
            id: id,
        });
        const data = await this.callAPI(url, params, method);
        if (data.result) {
            this.showNotification('top', 'right', data.message);
            setTimeout(() => {
                location.reload();
            }, 5000);
        } else {
            this.showNotification('top', 'right', data.message);
        }},showNotification: function (from, align, message, color) {
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
