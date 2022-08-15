const feedBackBtn = document.querySelector('#feedback-form');
const feedBackClose = document.querySelector('#feedback-close');

feedBackBtn.addEventListener('click', function () {
    document.querySelector('.feedback-form').style.display = 'flex';
});

feedBackClose.addEventListener('click', function () {
    document.querySelector('.feedback-form').style.display = 'none';
});
