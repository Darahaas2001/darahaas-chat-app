const socket = io();
/////Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#sendLocation");
const $messages = document.querySelector("#messages");

///// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
////Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // New msg element
  const $newMessage = $messages.lastElementChild;

  /// Height of the new msg
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible Height
  const visibleHeight = $messages.offsetHeight;
  // Height of messages container
  const containerHeight = $messages.scrollHeight;
  //How far have i scrolled
  const scrollOffSet = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffSet) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

//////////////////////////////////////////////////

socket.on("greetings", (greet) => {
  const html = Mustache.render(messageTemplate, {
    username: greet.username,
    message: greet.text,
    createdAt: moment(greet.createdAt).format("h:mm:A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

//////////////////////////////////////////////////////
socket.on("location", (url) => {
  console.log(url);
  const html = Mustache.render(locationMessageTemplate, {
    username: url.username,
    url: url.url,
    createdAt: moment(url.createdAt).format("h:mm:A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

//////////////////////////////////////////////////////

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  /// Disable
  $messageFormButton.setAttribute("disabled", "disabled");
  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    /// Enable
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    /////////////Profanity/////////////
    if (error) {
      return console.log(error);
    }
    console.log("Message was delivered");
  });
});
// socket.on("countUpdated", (count) => {
//   console.log("Count has been updated!", count);
// });

// document.querySelector("#inc").addEventListener("click", () => {
//   console.log("Clicked");
//   socket.emit("increment");
// });
document.querySelector("#sendLocation").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("GeoLocation is not supported by your browser.");
  }
  $locationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    const Position = `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;

    socket.emit("sendLocation", Position, (callback) => {
      console.log(callback);
    });

    $locationButton.removeAttribute("disabled");
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
