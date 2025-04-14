const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const msgInput = document.getElementById("msg");
let typingTimer;

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

// Handle typing events
socket.on("userTyping", (username) => {
  showTypingIndicator(username);
});

socket.on("userStoppedTyping", (username) => {
  hideTypingIndicator(username);
});

// Add typing indicator event listeners
msgInput.addEventListener("keypress", () => {
  socket.emit("typing");
  
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    socket.emit("stopTyping");
  }, 1000);
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

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
  <p class='meta'>${message.username} <span>${message.time}</span></p>
  <p class='text'>${message.text}</p>
  `;
  document.querySelector(".chat-messages").appendChild(div);
}

// Show typing indicator
function showTypingIndicator(username) {
  let typingDiv = document.getElementById("typing-indicator");
  if (!typingDiv) {
    typingDiv = document.createElement("div");
    typingDiv.id = "typing-indicator";
    typingDiv.classList.add("typing-indicator");
    document.querySelector(".chat-messages").appendChild(typingDiv);
  }
  typingDiv.innerHTML = `<p class="meta">${username} is typing...</p>`;
}

// Hide typing indicator
function hideTypingIndicator(username) {
  const typingDiv = document.getElementById("typing-indicator");
  if (typingDiv) {
    typingDiv.remove();
  }
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
