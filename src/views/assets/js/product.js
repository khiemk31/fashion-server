product = {
    async callAPI(url, params, method) {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        let requestOptions = {
            method: method,
            headers: myHeaders,
            body: params,
            redirect: 'follow',
        };
        var data;
        await fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                data = JSON.parse(result);
            })
            .catch((error) => console.log('error', error));
        return data;
    },
    async getListProduct() {
        let method = 'GET';
        let params;
        let url = 'http://modelfashion.store/getListProduct';
        const res = await this.callAPI(url, params, method);
        if (res.listProduct.length > 0) {
            var p = '';
            res.listProduct.forEach((product) => {
                if(product.deleted_at){
                    p += `<div id="delete" class="filterDiv ${product.category_id}" style="display :none">`
                }else{
                    p += `<div class="filterDiv ${product.category_id}">`
                }
                p += '<div class="col-md-3 pl-2" > ';
                p += `<div class="card"  style="width: 17.5rem; height : 30rem ;">`;
                p += '<h6 class="card-header">' + product.product_id + '</h6>';
                p +=
                    '<img src="' +
                    product.product_image +
                    '" class="card-img-top mb-2" style="width: 17.5rem; height: 300px;"/> ';
                if (product.discount) {
                    p += '<div class="note on-sale">Đang sale ' + product.discount + '%</div>';
                }
                p += '<card-body class="text-center">';
                p +=
                    '<a href="/product/productDetail/' +
                    product.product_id +
                    '">' +
                    '<p id="productName" class="card-title p-1 text-info" style=" height: 2.5rem ; font-size:16px">' +
                    product.product_name +
                    '</p> </a>';
                if (product.sale_price) {
                    p += '<p class="card-text mt-2 mb-2  font-weight-bold">Giá: <del>' + product.price + 'đ<del/></p> ';
                    p +=
                        '<p class="card-text mt-2 mb-2 text-danger font-weight-bold"> Giảm giá: ' +
                        product.sale_price +
                        'đ</p> ';
                } else {
                    p += '  <p class="card-text mt-4 mb-4 font-weight-bold">Giá: ' + product.price + 'đ</p> ';
                }

                p += ' </card-body> </div></div></div>';
            });
            document.getElementById('dataAllProduct').innerHTML = p;
        } else {
            p += '<h2>Không có dữ liệu</h2>'
        }
    },
};

