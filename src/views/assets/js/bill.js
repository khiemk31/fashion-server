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
        console.log('KET QUA CALL', res.result);
        // if (res.result) {
        //     this.showNotification('top', 'right', res.message);
        //     document.location.reload();
        // }

        // setTimeout(function () {
        //     document.location.reload();
        // }, 1500);
    },
};
const feedBackBtn = document.querySelector('#feedback-form');
const feedBackClose = document.querySelector('#feedback-close');

feedBackBtn.addEventListener('click', function () {
    document.querySelector('.feedback-form').style.display = 'flex';
});

feedBackClose.addEventListener('click', function () {
    document.querySelector('.feedback-form').style.display = 'none';
});
