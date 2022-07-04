window.onload = function () {
    displayContactList();
};

const submitData = (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const id = document.getElementById("button-submit").value;
    if (!formValidator(name, phone, email)) {
        return false;
    }
    const isNew = id.length == 0;
    let inputData = {
        id: Math.random().toString(),
        name: name,
        phone: phone,
        email: email,
        date: new Date().toLocaleString("en-GB"),
    };
    if (isNew) {
        storeContact(inputData);
    } else {
        inputData.id = id;
        modifyContact(inputData);
    }
    document.getElementById("name").value = null;
    document.getElementById("phone").value = null;
    document.getElementById("email").value = null;
    displayContactList();
};

const storeContact = (inputData) => {
    const inputDatas = [inputData, ...getDataObjectFromStorage()];
    localStorage.setItem("contacts", JSON.stringify(inputDatas));
};

const modifyContact = (inputData) => {
    let contacts = getDataObjectFromStorage();
    let contactsUpdated = contacts.map((contact) => {
        if (contact.id == inputData.id) {
            return inputData;
        }

        return contact;
    });
    localStorage.setItem("contacts", JSON.stringify(contactsUpdated));
    displayContactList();
};

const removeContact = (id) => {
    let contacts = getDataObjectFromStorage();
    let contacstAfterRemove = contacts.filter((contact) => {
        return contact.id !== id.toString();
    });

    localStorage.setItem("contacts", JSON.stringify(contacstAfterRemove));
    displayContactList();
};

const displayContactList = () => {
    let contacts = getDataObjectFromStorage();
    let tbody = document
        .getElementById("data-lists")
        .getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    contacts.forEach((contact, key) => {
        tbody.innerHTML += renderTableRow(contact, key);
    });
};

const renderTableRow = (contact, key) => {
    return `<tr>
        <th>${key + 1}</th>
        <td>${contact.name}</td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td>${contact.date}</td>
        <td>
          <button class='btn btn-success' type='button'  onClick='getEditData(${JSON.stringify(
        contact
    )})'>Edit</button>
          <button class='btn btn-danger' type='button' onClick='removeContact(${contact.id
        })'> Delete </button>
        </td>
      </tr>
      `;
};

const getEditData = (contact) => {
    document.getElementById("name").value = contact.name;
    document.getElementById("phone").value = contact.phone;
    document.getElementById("email").value = contact.email;
    document.getElementById("button-submit").value = contact.id;
};

const getDataObjectFromStorage = () => {
    let inputObjectString = localStorage.getItem("contacts");
    if (inputObjectString == null) {
        inputObjectString = "[]";
    }

    return JSON.parse(inputObjectString);
};

const formValidator = (name, phone, email) => {
    const error = document.getElementById("error-message");
    if (error) {
        error.remove();
    }
    let isFormEmpty = true;
    let isInvalidEmail = true;
    let isInvalidPhone = true;
    let error_message = "";
    if (name.length == 0 || phone.length == 0 || email == 0) {
        error_message = "Input filed is require!";
        isFormEmpty = true;
    } else {
        isFormEmpty = false;
    }

    if (email.length > 0 && !isValidEmail(email)) {
        error_message = "Email address invalid!";
        isInvalidEmail = true;
    } else {
        isInvalidEmail = false;
    }

    if (phone.length > 0 && !isValidPhone(phone)) {
        error_message = "Phone number invalid!";
        isInvalidPhone = true;
    } else {
        isInvalidPhone = false;
    }

    if (isFormEmpty || isInvalidEmail || isInvalidPhone) {
        showErrorMessage(error_message);

        return false;
    }

    return true;
};

const showErrorMessage = (message) => {
    const form = document.getElementById("contact-form");
    const error_div = document.createElement("div");
    error_div.id = "error-message";
    error_div.classList.add("alert", "alert-danger");
    error_div.innerHTML = message;
    form.prepend(error_div);
};

const isValidEmail = (email) => {
    const req = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    return email.match(req);
};

const isValidPhone = (phone) => {
    const req = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    return req.test(phone);
};

form = document.getElementById("contact-form");
form.addEventListener("submit", submitData);