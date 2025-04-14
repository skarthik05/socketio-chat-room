const users = [];

//Join user to chat
function userJoin(id, username, room) {
  const user = { 
    id, 
    username, 
    room, 
    status: 'online',
    lastActive: new Date(),
    joinTime: new Date()
  };

  users.push(user);

  return user;
}

//Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//User leave chat
function userLeave(id) {
  let index = users.findIndex((user) => user.id === id);
  if (index != -1) {
    return users.splice(index, 1)[0];
  }
}

//Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

//Update user status
function updateUserStatus(id, status) {
  const user = users.find((user) => user.id === id);
  if (user) {
    user.status = status;
    user.lastActive = new Date();
  }
  return user;
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers, updateUserStatus };
