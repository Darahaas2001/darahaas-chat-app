const users = [];
// addUser
const addUser = ({ id, username, room }) => {
  // Clean the Data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: "Username and Room are required",
    };
  }
  // Check for exisiting user
  const exisitingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate Username

  if (exisitingUser) {
    return {
      error: "Username is in Use",
    };
  }
  // Store user
  const user = { id, username, room };
  users.push(user);
  return {
    user,
  };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1);
  }
};

const getUser = (id) => {
  return users.find((user) => user.id == id);
};
const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
