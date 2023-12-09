$(async function () {
    await authUser();
})

async function authUser() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');

    let temp = '';
    const auth = document.querySelector('#auth');
    await fetch('api/user', {
        method: 'GET',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
    })
        .then(res => res.json())
        .then(u => {
            temp += `
             <span class="fw-bold">${u.email}</span>
             <span>with roles</span>
             <span class="fw-bold">${u.roles.map(e => " " + e.role)}</span>
            `;
        });
    auth.innerHTML = temp;
}

async function getUser() {
    let temp = '';
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');

    const table = document.querySelector('#tableOnlyOneUser');
    await fetch('api/user', {
        method: 'GET',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
    })
        .then(response => response.json())
        .then(user => {
            temp = `
                <tr class="border-top bg-light">
                    <td>${user.id}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(e => " " + e.role)}</td>
                </tr>   
            `;
            table.innerHTML = temp;
        })
}