const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const msgInput = document.getElementById("msg");
let typingTimer;
let isOnline = navigator.onLine;

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Check if username and room are provided
if (!username || !room) {
  window.location.href = "index.html";
}

//Room name
const roomName = document.getElementById("room-name");
const userLists = document.getElementById("users");
const socket = io();

// Check internet connectivity
function updateOnlineStatus() {
  isOnline = navigator.onLine;

  // If we're in the chat and go offline, show a notification
  if (socket && !isOnline) {
    showOfflineNotification();
  }
}

// Show offline notification
function showOfflineNotification() {
  const notification = document.createElement("div");
  notification.className = "offline-notification";
  notification.innerHTML = `
    <div class="notification-content">
      <p>You are offline. Please check your internet connection.</p>
      <button id="reconnect-btn">Reconnect</button>
    </div>
  `;

  document.body.appendChild(notification);

  // Add event listener to reconnect button
  document.getElementById("reconnect-btn").addEventListener("click", () => {
    if (navigator.onLine) {
      notification.remove();
      socket.connect();
    } else {
      alert("Still offline. Please check your connection and try again.");
    }
  });
}

// Add event listeners for online/offline events
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

// Set initial online status
updateOnlineStatus();
socket.emit("setOnlineStatus", "online");

// Handle visibility change for online status
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    socket.emit("setOnlineStatus", "away");
  } else {
    socket.emit("setOnlineStatus", "online");
  }
});

// Handle socket connection events
socket.on("connect", () => {
  console.log("Connected to server");
  if (document.querySelector(".offline-notification")) {
    document.querySelector(".offline-notification").remove();
  }
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
  if (navigator.onLine) {
    showOfflineNotification();
  }
});

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
${users
  .map(
    (user) => `
  <li>
    ${user.username}
    <span class="status-indicator ${user.status}" data-tooltip="${user.status}" data-username="${user.username}" data-join-time="${user.joinTime}" data-last-active="${user.lastActive}"></span>
  </li>
`
  )
  .join("")}
`;

  // Add tooltip event listeners
  const statusIndicators = document.querySelectorAll(".status-indicator");
  statusIndicators.forEach((indicator) => {
    indicator.addEventListener("mouseenter", showTooltip);
    indicator.addEventListener("mouseleave", hideTooltip);
  });
}

// Show tooltip
function showTooltip(e) {
  const status = e.target.getAttribute("data-tooltip");
  const username = e.target.getAttribute("data-username");
  const joinTime = new Date(e.target.getAttribute("data-join-time"));
  const lastActive = new Date(e.target.getAttribute("data-last-active"));

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";

  // Format the join time and last active time
  const joinTimeStr = joinTime.toLocaleTimeString();
  const lastActiveStr = lastActive.toLocaleTimeString();

  tooltip.innerHTML = `
    <div class="tooltip-header">${username}</div>
    <div class="tooltip-content">
      <div>Status: <span class="status-${status}">${status}</span></div>
      <div>Joined: ${joinTimeStr}</div>
      <div>Last active: ${lastActiveStr}</div>
    </div>
  `;

  document.body.appendChild(tooltip);

  const rect = e.target.getBoundingClientRect();
  tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
  tooltip.style.left = `${
    rect.left + rect.width / 2 - tooltip.offsetWidth / 2
  }px`;
}

// Hide tooltip
function hideTooltip() {
  const tooltip = document.querySelector(".tooltip");
  if (tooltip) {
    tooltip.remove();
  }
}
