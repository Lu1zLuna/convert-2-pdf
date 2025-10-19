const fs = require('fs'); // importa file system para ler e escrever arquivos no computador (manipula o db.json)
const path = require('path'); // permite que os caminhos de arquivos funcionem em qualquer sistema operacional
const crypto = require('crypto'); // usado para gerar um ID único aleatório

const dbPath = path.join(__dirname, '..', 'db.json');

// Lê o banco de dados transformando o json em string
const readUsers = () => {
    if(!fs.existsSync(dbPath)) {
        return { users: [] }
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};

// transforma a string de volta em json;
const writeUsers = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

const buscar = () => {
    const { users } = readUsers;
    return users;
};

const buscarPorEmail = (email) => {
    const data = readUsers();
    return users.find(user => user.email === email);
}

// Função para criar novo usuário
const create = (newUser) => {
    const data = readUsers();

    // Gera um id único pro novo usuário
    const userWithId = { id: crypto.randomUUID(), ...newUser };

    data.users.push(userWithId);
    writeUsers(data);

    return userWithId;
} 


// exporta as funções para usar nos controllesrs
module.exports = {
    find,
    findByEmail,
    create,
};