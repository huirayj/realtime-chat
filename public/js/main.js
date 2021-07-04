const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

const socket = io();

// get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// join chatroom
socket.emit('joinRoom', { username, room });

// get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// message from server
socket.on('message', message => {
    outputMessage(message);

    // scroll to top
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get message text
    let msg = e.target.elements.msg.value;
    msg = msg.trim();

    if (!msg) {
        return false;
    }

    // emit message to server
    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// output message to dom
const outputMessage = ({ username, text, time }) => {
    const div = document.createElement('div');

    div.classList.add('message');
    div.innerHTML = `<p class="meta">${username} <span>${time}</span></p>
    <p class="text">
        ${text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to dom
const outputRoomName = (room) => {
    roomName.innerText = room;
}

// add users to dom
const outputUsers = (users) => {
    userList.innerHTML = `${users.map(user => `<li>${user.username}<li>`).join('')}`;
}