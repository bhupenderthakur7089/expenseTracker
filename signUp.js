let form = document.getElementById('signup');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    name = e.target.name.value;
    email = e.target.email.value;
    password = e.target.password.value;
    let user = {
        name,
        email,
        password
    }
    axios
        .post("./signUp", user)
        .then(res => {
            console.log(res.data.userExists);
            if (res.data.userExists == true) {
                let div = document.getElementById('alert');
                let p = document.createElement('p');
                p.classList = 'bg-danger-subtle';
                p.innerHTML = 'User Already Exists with the Email ID';
                div.appendChild(p);
            } else {
                alert('User Registered Successfully...Proceed to login');
                window.location.href = './login.html';
            }
        });
});