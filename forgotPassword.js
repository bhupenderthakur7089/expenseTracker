let form = document.getElementById('signup');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    eMail = e.target.email.value;
    const token = localStorage.getItem('token');
    axios
        .post("./forgotPassword", { email: eMail })
        .then(res => {
            console.log(res.data);
        });
});