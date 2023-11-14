function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showPremiumuserMessage() {
    document.getElementById('premiumBtn').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user "
}

function showLeaderboard() {
    const inputElement = document.createElement("input");
    inputElement.type = "button";
    inputElement.value = 'Show Leaderboard';
    inputElement.onclick = () => {
        const token = localStorage.getItem('token');
        axios
            .get('http://localhost:3000/showLeaderBoard', { headers: { "authorization": token } })
            .then((res) => {
                console.log(res.data);
                let leaderboardElem = document.getElementById('leaderboard');
                leaderboardElem.innerHTML = "";
                leaderboardElem.innerHTML += '<h1> Leader Board </<h1>';
                res.data.forEach((userDetails) => {
                    leaderboardElem.innerHTML += `<li>Name - ${userDetails.name}, Total Expense - ${userDetails.totalExpense || 0} </li>`;
                    console.log(userDetails);
                })
            })
            .catch((err) => console.log(err));

    }
    document.getElementById("message").appendChild(inputElement);
}

function buyPremium() {
    const token = localStorage.getItem('token');
    axios
        .get("http://localhost:3000/buyPremium", { headers: { "authorization": token } })
        .then(res => {
            var options = {
                "key": res.data.key_id,
                "order_id": res.data.order.id,
                "handler": function (res) {
                    axios
                        .post('http://localhost:3000/updatetransactionstatus', { order_id: options.order_id, payment_id: res.razorpay_payment_id }, { headers: { "authorization": token } })
                        .then((res) => {
                            console.log(res);
                            alert('You are a Premium User Now');
                            document.getElementById('premiumBtn').style.visibility = "hidden";
                            document.getElementById('message').innerHTML = "You are a premium user ";
                            localStorage.setItem('token', res.data.token);
                            showLeaderboard();
                        })
                },
            };
            const rzp1 = new Razorpay(options);
            rzp1.open();
            rzp1.on('payment.failed', function (response) {
                console.log(response)
                alert('Something went wrong')
            });
        });
}

function displayExpense(expense) {
    let items = document.querySelector('#items');
    let list = document.createElement('li');
    list.name = expense.id;
    list.classList = 'list-group-item';
    list.textContent = expense.amount + '-' + expense.description + '-' + expense.category;
    let deleteBtn = document.createElement('input');
    deleteBtn.type = 'button';
    deleteBtn.name = 'Delete';
    deleteBtn.classList = 'btn btn-outline-dark btn-inline btn-sm';
    deleteBtn.value = 'Delete Expense';
    deleteBtn.onclick = function () { deleteList(this); };
    let btnUlist = document.createElement('ul');
    btnUlist.classList = 'list-inline';
    let btnList = document.createElement('li');
    btnList.classList = 'list-inline-item';
    btnList.appendChild(deleteBtn);
    btnUlist.appendChild(btnList);

    list.appendChild(btnUlist);
    items.appendChild(list);
}

function deleteList(deleteBtn) {
    let items = deleteBtn.parentElement.parentElement.parentElement.parentElement;
    let list = deleteBtn.parentElement.parentElement.parentElement;
    listName = list.name;
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3000/deleteExpense/${listName}`, { headers: { "authorization": token } })
        .then(res => {
            console.log(res);
            items.removeChild(list);
        })
        .catch(err => console.log(err))
}


function getExpenses(page) {
    const token = localStorage.getItem('token');
    axios
        .get(`http://localhost:3000/expenses/${page}`, { headers: { "authorization": token } })
        .then(res => {
            console.log('List of Expenses:', res);
            let items = document.querySelector('#items');
            items.innerHTML = '';

            for (let i = 0; i < res.data.expenses.length; i++) {
                displayExpense(res.data.expenses[i]);
            }
            showPageNumbers(res.data);
        })
}


function showPageNumbers({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage }) {
    const pagination = document.getElementById('pageNumberDiv');
    pagination.innerHTML = '';
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage;
        btn2.addEventListener('click', () => {
            getExpenses(previousPage);
        })
        pagination.appendChild(btn2);
    }
    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3> ${currentPage}</h3 > `;
    btn1.addEventListener('click', () => getExpenses(currentPage))
    pagination.appendChild(btn1);
    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = previousPage;
        btn3.addEventListener('click', () => {
            getExpenses(nextPage);
        })
        pagination.appendChild(btn3);
    }
}

let form = document.querySelector('#myForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    amount = e.target.amount.value;
    description = e.target.description.value;
    category = e.target.category.value;
    let expense = {
        amount,
        description,
        category
    }
    const token = localStorage.getItem('token');
    axios
        .post("http://localhost:3000/addExpense", expense, { headers: { "authorization": token } })
        .then(res => {
            console.log(res.data);
            displayExpense(res.data);
        });

});

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const page = 1;
    axios
        .get("http://localhost:3000/checkPremium", { headers: { "authorization": token } })
        .then((res) => {
            console.log('User Data', res.data.data.ispremiumuser);
            if (res.data.data.ispremiumuser == true) {
                showPremiumuserMessage();
                showLeaderboard();
            }
        })
    axios
        .get(`http://localhost:3000/expenses/${page}`, { headers: { "authorization": token } })
        .then(res => {
            console.log('List of Expenses:', res);
            for (let i = 0; i < res.data.expenses.length; i++) {
                displayExpense(res.data.expenses[i]);
            }
            showPageNumbers(res.data);
        })
})