const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
//Room name
const roomName = document.getElementById("room-name");
const userLists = document.getElementById("users");
const socket = io();
//Join Chatroom
socket.emit("joinRoom", { username, room });

//Get room and users

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//Message from the server
socket.on("message", (message) => {
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message Submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get message text
  const msg = e.target.elements.msg.value;

  //emit  message to server
  socket.emit("chatMessage", msg);

  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Output nessage to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
  <p class='meta'>${message.username} <span>${message.time}</span></p>
  <p class='text'>${message.text}</p>
  `;
  document.querySelector(".chat-messages").appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

//Add user to room
function outputUsers(users) {
  userLists.innerHTML = `
${users.map((user) => `<li>${user.username}</li>`).join("")}
`;
}
