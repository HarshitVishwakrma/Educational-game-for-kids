const loginBtn = document.getElementById('checkbox');
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

const loginForm = document.getElementById('loginForm');



let clicked;

loginBtn.addEventListener('click',()=>{
    if(clicked){
        return ;
    }
    clicked = true;
    const timer = setTimeout(()=>{
        loginForm.submit();
        clicked = false
    }, 1000)
})