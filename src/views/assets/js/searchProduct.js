function searchProduct() {
  let input, filter, listProduct, filterDiv, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  listProduct = document.getElementById('dataAllProduct');
  filterDiv= listProduct.getElementsByClassName('filterDiv');
  for (i = 0; i < filterDiv.length; i++) {
    title = filterDiv[i].getElementsByTagName('p')[0];
    if(title){
      txtValue = title.textContent || title.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        filterDiv[i].style.display = '';
      } else {
        filterDiv[i].style.display = 'none';
      }
    }
  }
}
function allProductHidden() {
  let  listProduct, filterDiv, i ;
  listProduct = document.getElementById('dataAllProduct');
  filterDiv= listProduct.getElementsByClassName('filterDiv');
  for (i = 0; i < filterDiv.length; i++) {
    console.log( document.querySelector('filterDiv').id)
  }
}
