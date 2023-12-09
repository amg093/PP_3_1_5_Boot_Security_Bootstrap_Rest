let headers = new Headers();
headers.append('Content-Type', 'application/json; charset=utf-8');
$(async function () {
    await getUser();
    await getAdminPanel();
    await createUser();
    await getModalForm();
})

async function getAdminPanel() {
    let temp = '';
    const admin = document.querySelector('#tableAllUsers');
    await fetch('api/admin/users', {
        method: 'GET',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
    })
        .then(responseGet => responseGet.json())
        .then(users => {
            users.forEach(user => {
                temp += `
                  <tr class="border-top bg-light">
                      <td>${user.id}</td>
                      <td>${user.firstname}</td>
                      <td>${user.lastname}</td>
                      <td>${user.age}</td>
                      <td>${user.email}</td> 
                      <td>${user.roles.map(e => e.role)}</td>  
                      <td>
                          <button type="button" class="btn btn-info" data-action="edit"  data-id="${user.id}" data-target="#editModal"> Edit </button>
                      </td>    
                      <td>
                          <button type="button" class="btn btn-danger" data-action="delete"  data-id="${user.id}" data-target="#deleteModal"> Delete
                          </button>
                      </td>
                  </tr>
            `;
            })
            admin.innerHTML = temp;
        })
    $("#tableAllUsers").find('button').on('click', (event) => {
        let modalForm = $('#modalForm');
        let target = $(event.target);
        let buttonUserId = target.attr('data-id');
        let buttonAction = target.attr('data-action');
        modalForm.attr('data-id', buttonUserId);
        modalForm.attr('data-action', buttonAction);
        modalForm.modal('show');
    })
}

async function createUser() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    $('#createUser').click(async () => {
        let createUserForm = $('#newUserForm');
        let role = () => {
            let options = document.getElementById('roleNew').options;
            let values = $('#roleNew').val();
            return [{id: options.selectedIndex + 1, role: values}];
        };
        let user = {
            'firstname': createUserForm.find('#firstnameNew').val(),
            'lastname': createUserForm.find('#lastnameNew').val(),
            'age': createUserForm.find('#ageNew').val(),
            'email': createUserForm.find('#emailNew').val(),
            'password': createUserForm.find('#passwordNew').val(),
            'roles': role()
        };
        await fetch('api/admin/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify(user)
        }).then(res => {
            if (res.ok) {
                getAdminPanel();
                $('.nav-tabs button[data-bs-target="#tableForm"]');
            }
        })
    });
}

async function deleteUser(modal, id) {
    modal.find('#model-title').html('Delete user');
    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(deleteButton);
    await fetch('api/admin/users/' + id, {
        method: 'GET',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
    }).then(res => res.json())
        .then(user => {
            let form = `
        <form class="text-center" id="deleteUser">
                    <div class="m-3">
                        <label for="idDelete" class="col-form-label">ID</label>
                        <input type="text" class="form-control" id="idDelete" name="id" value="${user.id}"
                               disabled/>
                    </div>
                    <div class="m-3">
                        <label for="firstNameDelete" class="col-form-label">First name</label>
                        <input type="text" class="form-control" id="firstNameDelete" name="firstname"
                               value="${user.firstname}" disabled/>
                    </div>
                    <div class="m-3">
                        <label for="lastNameDelete" class="col-form-label">Last name</label>
                        <input type="text" class="form-control" id="lastNameDelete" name="lastname"
                               value="${user.lastname}" disabled/>
                    </div>
                    <div class="m-3">
                        <label for="ageDelete" class="col-form-label">Age</label>
                        <input type="number" class="form-control" id="ageDelete" name="age"
                               value="${user.age}" disabled/>
                    </div>
                    <div class="m-3">
                        <label for="emailDelete" class="col-form-label">Email</label>
                        <input type="text" class="form-control" id="emailDelete" name="email"
                               value="${user.email}" disabled/>
                    </div>
                    <div class="m-3">
                        <label for="roleDelete">Role</label>
                        <select class="form-select " size="2" id="roleDelete" name="role" disabled>
                            <option>${user.roles.map(e => e.role)}</option>
                        </select>
                    </div>
                </form>
       `;
            modal.find('.modal-body').append(form);
        })
    $("#deleteButton").on('click', async () => {
        await fetch('api/admin/users/' + id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
        }).then(res => {
            if (res.ok) {
                getAdminPanel();
                modal.modal('hide');
            }
        })

    })
}

async function getModalForm() {
    $('#modalForm').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let id = thisModal.attr('data-id');
        let action = thisModal.attr('data-action');
        if (action === 'delete') {
            deleteUser(thisModal, id);
        } else {
            editUser(thisModal, id);
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    modal.find('#model-title').html('Edit user');
    let editButton = `<button  class="btn btn-danger" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(editButton);
    await fetch('api/admin/users/' + id, {
        method: 'GET',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
    }).then(res => res.json())
        .then(user => {
            let form = `
         <form class="text-center" id="editForm">
                    <div class="m-3">
                        <label for="idEdit" class="col-form-label">ID</label>
                        <input type="text" class="form-control" id="idEdit" name="id" value="${user.id}"
                               disabled/>
                    </div>
                    <div class="m-3">
                        <label for="firstNameEdit" class="col-form-label">First name</label>
                        <input type="text" class="form-control" id="firstNameEdit" name="firstname"
                               value="${user.firstname}"/>
                    </div>
                    <div class="m-3">
                        <label for="lastNameEdit" class="col-form-label">Last name</label>
                        <input type="text" class="form-control" id="lastNameEdit" name="lastname"
                               value="${user.lastname}"/>
                    </div>
                    <div class="m-3">
                        <label for="ageEdit" class="col-form-label">Age</label>
                        <input type="number" class="form-control" id="ageEdit" name="age"
                               value="${user.age}"/>
                    </div>
                    <div class="m-3">
                        <label for="emailEdit" class="col-form-label">Email</label>
                        <input type="text" class="form-control" id="emailEdit" name="email"
                               value="${user.email}"/>
                    </div>
                    <div class="m-3">
                        <label for="passwordEdit" class="col-form-label">Password</label>
                        <input type="text" class="form-control" id="passwordEdit" name="password"
                               required/>
                    </div>
                     <div class="form-group m-3" readonly="readonly">
                            <label for="roleEdit">Role</label>
                            <select class="form-select w-100 " size="2" id="roleEdit" name="role" required>
                            <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                            <option value="ROLE_USER">ROLE_USER</option>
                        </select>
                    </div>
                </form>
       `;
            modal.find('.modal-body').append(form);
        })
    $("#editButton").on('click', async () => {
        let role = () => {
            let options = document.getElementById('roleEdit').options;
            let values = $('#roleEdit').val();
            return [{id: options.selectedIndex + 1, role: values}];
        }
        let user = {
            'id': modal.find('#idEdit').val(),
            'firstname': modal.find('#firstNameEdit').val(),
            'lastname': modal.find('#lastNameEdit').val(),
            'age': modal.find('#ageEdit').val(),
            'email': modal.find('#emailEdit').val(),
            'password': modal.find('#passwordEdit').val(),
            'roles': role()
        }
        console.log(user)
        await fetch('api/admin/users', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify(user)
        }).then(res => {
            if (res.ok) {
                getAdminPanel();
                modal.modal('hide');
            }
        })
    })
}
