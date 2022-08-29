const feedBackBtn = document.querySelector('#feedback-form');
const feedBackClose = document.querySelector('#feedback-close');

feedBackBtn.addEventListener('click', function () {
    document.querySelector('.feedback-form').style.display = 'flex';
});

feedBackClose.addEventListener('click', function () {
    document.querySelector('.feedback-form').style.display = 'none';
});

confirmStatusBill = async function (id, status){
    let myHeaders = new Headers();
     const params = JSON.stringify({
            id: id,
        });
    let url = 'http://modelfashion.store' + status;
    myHeaders.append('Content-Type', 'application/json');
        let requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: params,
            redirect: 'follow',
        };
    await fetch(url, requestOptions)
        .then((response) => response.text())
        .then((result) => {
        let  data = JSON.parse(result);
        showNotification('top', 'right', data.message);
        
        if(status=="/bill/billDone"){
            location.replace('http://modelfashion.store/bill/billDoneView/'+id);
        }else{
            location.replace('http://modelfashion.store/bill/updateViewBill/'+id);
        }  
        })
        .catch((error) => console.log('error', error));
 };
showNotification= function (from, align, message, color) {
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
