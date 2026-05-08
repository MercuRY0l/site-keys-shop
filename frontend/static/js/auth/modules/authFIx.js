

export function authFix() {  

    const cart = document.querySelector('.js-auth');
    const modal = document.getElementById('authModal');
    const closeAuthBtn = document.getElementById('closeAuthModal');

    const getscrollbarWidth = () => {
        
        let div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '100px';
        div.style.overflowY = 'scroll';
        div.style.visibility = 'hidden';
        document.body.append(div);
        let scrollbarWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        return scrollbarWidth;
    };

    const scroll = getscrollbarWidth();

    cart.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scroll}px`;
    }); 

    closeAuthBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '0px';
    });

    window.addEventListener('click', (event) => {  
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

}


