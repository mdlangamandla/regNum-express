document.addEventListener('DOMContentLoaded',  ()=> {
    let errorMessageElem = document.querySelector('.error');
    let infoElem = document.querySelector('.info')
    if (infoElem.innerHTML !== '' || errorMessageElem.innerHTML !== '') {
        setTimeout(() => {
            infoElem.innerHTML = '';
            errorMessageElem.innerHTML = '';   
            
        }, 5000);
    }
});