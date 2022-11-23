//variáveis

const modalBtn = document.querySelector('.modal-btn');
const modal = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.close-btn');



//CRUD - CREATE READ UPDATE DELETE

//getters and setters
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [];
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient));


//CRUD - Create
const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStorage(dbClient);
};

//CRUD - read
const readClient = () => getLocalStorage();

//CRUD - update 
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient)
};

//CRUD - delete
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
};


const isValidFields = ()=>{
   return document.getElementById('form').reportValidity();
};


//interação com o layout
const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        };
        const index = document.getElementById('nome').dataset.index;
        if (document.getElementById('nome').classList.contains('newClient')) { 
            createClient(client);
            updateTable();
            closeModal();
        }else {
            updateClient(index, client);
            updateTable();
            closeModal();
        }
    }
}

const updateTable = ()=> {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
}



//eventos
modalBtn.addEventListener('click', openModal);

modalClose.addEventListener('click', closeModal);

document.getElementById('salvar').addEventListener('click', saveClient);

document.querySelector('#tableClient>tbody').addEventListener('click', editDelete);

    


//funções 

function openModal() {
    document.getElementById('nome').classList.add('newClient');
    modal.classList.add('open-modal');
}

function editModal() {
    document.querySelector('.title-modal').innerHTML = 'Editar cliente'
    document.getElementById('nome').classList.remove('newClient');
    modal.classList.add('open-modal');
}

function closeModal() {
   modal.classList.remove('open-modal');
   clearFields();
}

function clearFields() {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value ='');
}

function createRow(client, index) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
        <button type="button" class="btn btn-green" id="edit-${index}">Editar</button>
        <button type="button" class="btn btn-red" id="delete-${index}">Excluir</button>
    </td>    
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow);
}

function clearTable() {
    const rows = document.querySelectorAll('#tableClient>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
}

function fillFields(client) {
    document.getElementById('nome').value =client.nome;
    document.getElementById('email').value =client.email;
    document.getElementById('celular').value =client.celular;
    document.getElementById('cidade').value =client.cidade;
    document.getElementById('nome').dataset.index = client.index;
}

function editClient(index) {
    const client = readClient()[index];
    client.index = index;
    fillFields(client);
    editModal();
}

function editDelete(e) {
    if (e.target.type === 'button') {
        
        const [action, index] = e.target.id.split('-');

        if (action == 'edit') {
            editClient(index);
        }else {
            const client = readClient()[index];
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`);
            if (response) {
                deleteClient(index);
                updateTable();
            }
        }
    }
}