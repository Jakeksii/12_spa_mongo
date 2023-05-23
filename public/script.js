var mode = 0;

window.onload = function(){
    createForm();
    getContactList();
}

createForm = () => {
    let root = document.getElementById("root");
    let form = document.createElement("form");
    root.setAttribute("class", "m-3")
    
    //First name input and label
    let firstNameInput = document.createElement("input");
    firstNameInput.setAttribute("type","text");
    firstNameInput.setAttribute("id","firstname");
    firstNameInput.setAttribute("name","firstname");
    firstNameInput.setAttribute("class","form-control");
    firstNameInput.setAttribute("required", true);
    let firstNameLabel = document.createElement("label");
    firstNameLabel.setAttribute("for", "firstname");
    firstNameLabel.setAttribute("class","form-label");
    let firstNameText = document.createTextNode("First Name");
    firstNameLabel.appendChild(firstNameText);

    //Last name input and label
    let lastNameInput = document.createElement("input");
    lastNameInput.setAttribute("type","text");
    lastNameInput.setAttribute("id","lastName");
    lastNameInput.setAttribute("name","lastName");
    lastNameInput.setAttribute("class","form-control");
    lastNameInput.setAttribute("required", true);
    let lastNameLabel = document.createElement("label");
    lastNameLabel.setAttribute("for", "lastName");
    lastNameLabel.setAttribute("class","form-label");
    let lastNameText = document.createTextNode("Last Name");
    lastNameLabel.appendChild(lastNameText);

    //Email input and label
    let emailInput = document.createElement("input");
    emailInput.setAttribute("type","email");
    emailInput.setAttribute("id","email");
    emailInput.setAttribute("name","email");
    emailInput.setAttribute("class","form-control");
    emailInput.setAttribute("required", true);
    let emailLabel = document.createElement("label");
    emailLabel.setAttribute("for", "email");
    emailLabel.setAttribute("class","form-label");
    let emailText = document.createTextNode("Email");
    emailLabel.appendChild(emailText);

    //Phone input and label
    let phoneInput = document.createElement("input");
    phoneInput.setAttribute("type","tel");
    phoneInput.setAttribute("id","phone");
    phoneInput.setAttribute("name","phone");
    phoneInput.setAttribute("class","form-control");
    phoneInput.setAttribute("required", true);
    let phoneLabel = document.createElement("label");
    phoneLabel.setAttribute("for", "phone");
    phoneLabel.setAttribute("class","form-label");
    let phoneText = document.createTextNode("Phone");
    phoneLabel.appendChild(phoneText);

    //Submit button
    let submitButton = document.createElement("input");
    submitButton.setAttribute("type","submit");
    submitButton.setAttribute("id", "submitButton");
    submitButton.setAttribute("class","btn btn-success");
    submitButton.setAttribute("value", "Add");

    //Append to form
    form.append(
        firstNameLabel,
        firstNameInput,
        lastNameLabel,
        lastNameInput,
        emailLabel,
        emailInput,
        phoneLabel,
        phoneInput,
        submitButton
        );
    form.addEventListener("submit",function(e){
        e.preventDefault();
        addContact();
    })

    root.appendChild(form);

}

function populateTable(list){
    const root = document.getElementById("root");
    const oldTable = document.getElementById("table");
    if(oldTable){
        root.removeChild(oldTable);
    }
    const table = document.createElement("table");
    table.setAttribute("id", "table");
    table.setAttribute("class", "table table-stripped");


    //TABLE HEADERS
    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");

    let items = ["First Name", "Last Name", "Email", "Phone", "Remove", "Edit"]

    items.forEach(item => {
        let itemHeader = document.createElement("th");
        let itemText = document.createTextNode(item);
        itemHeader.appendChild(itemText);
        headerRow.appendChild(itemHeader);
    })
    header.appendChild(headerRow);
    table.appendChild(header);


    //TABLE BODY
    const body = document.createElement("tbody");
    for (let i=0; i<list.length; i++){
        const tableRow = document.createElement("tr");
        for(x in list[i]){
            if(x === "_id" || x === "__v"){
                continue;
            }
            const column = document.createElement("td");
            console.log(list[i][x])
            const info = document.createTextNode(list[i] [x]);
            column.appendChild(info);
            tableRow.append(column);
        }


        //REMOVE BUTTON
        const removeColumn = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.setAttribute("class", "btn btn-danger");
        const removeButtonText = document.createTextNode("Remove");
        removeButton.appendChild(removeButtonText);
        removeButton.addEventListener("click",function(e){
            if(confirm("You sure?")){
                removeContact(list[i]._id);
            }
        })


        //EDIT BUTTON
        const editColumn = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.setAttribute("class", "btn btn-secondary");
        const editButtonText = document.createTextNode("Edit");
        editButton.appendChild(editButtonText);
        editButton.addEventListener("click",function(e){
            editContact(list[i]);
        })
        removeColumn.appendChild(removeButton);
        editColumn.appendChild(editButton);
        tableRow.append(removeColumn,editColumn);
        body.appendChild(tableRow);
        }


    table.appendChild(body);
    root.appendChild(table);
}

//REST API CALLS
addContact = async () => {
    const firstName = document.getElementById("firstname");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    let contact = {
        "firstname":firstName.value,
        "lastname":lastName.value,
        "email":email.value,
        "phone":phone.value
    }
    let url = "/api/contact";
    let req = {
        "method":"POST",
        "headers":{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(contact)
    }

    if(mode){
        url = "/api/contact/"+mode;
        req = {
            "method":"PUT",
            "headers":{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(contact)
        }
    }

    const response = await fetch(url, req);
    if(response.ok){
        firstName.value = "";
        lastName.value = "";
        email.value = "";
        phone.value = "";
        mode = 0;
        const submitButton = document.getElementById("submitButton");
        submitButton.value = "Add";
        getContactList();
    }else{
        console.log("Server responded with a status "+response.status+" "+response.statusText);
    }
}
getContactList = async () => {
    const response = await fetch("/api/contact");
    if(response.ok){
        let list = await response.json();
        if(list){
            console.log(list);
            populateTable(list);
        }
    }else{
        console.log("Server responded with a status "+response.status+" "+response.statusText);
    }
}
removeContact = async (id) => {
    let request = {
        "method":"DELETE"
    }
    const response = await fetch("/api/contact/"+id,request);
    if(response.ok){
        getContactList();
    }else{
        console.log("Server responded with a status "+response.status+" "+ response.statusText);
    }
}
editContact = (contact) => {
    const firstName = document.getElementById("firstname");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");

    firstName.value = contact.firstname;
    lastName.value = contact.lastname;
    email.value = contact.email;
    phone.value = contact.phone;
    mode = contact._id;

    let submitButton = document.getElementById("submitButton");
    submitButton.value = "Save";
}