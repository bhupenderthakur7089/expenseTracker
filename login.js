let form = document.getElementById('login');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    email = e.target.email.value;
    password = e.target.password.value;
    let credentials = {
        email,
        password
    }
    axios
        .post('http://localhost:3000/login', credentials)
        .then(res => {
            if (res.data.loginStatus == true) {
                alert('login successful');
                localStorage.setItem("token", res.data.token);
                window.location.href = './index.html';
            } else if (res.data.loginStatus == false) {
                let div = document.getElementById('alert');
                div.innerHTML = "";
                let p = document.createElement('p');
                p.classList = 'bg-danger-subtle';
                p.innerHTML = 'Wrong Password. Please Enter the Password again...';
                div.appendChild(p);
            } else if (res.data.loginStatus == 'User Not Found') {
                alert(res.data.loginStatus);
            }
        })
})