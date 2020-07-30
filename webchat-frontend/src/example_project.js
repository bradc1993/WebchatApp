document.addEventListener("DOMContentLoaded", () => {
    const chatWebSocket = openConnection()
    chatWebSocket.onopen = (event) => {
      const subscribeMsg = {"command":"subscribe","identifier":"{\"channel\":\"ChatMessagesChannel\"}"}
      chatWebSocket.send(JSON.stringify(subscribeMsg))
    }
  
    const userWebSocket = openConnection()
    userWebSocket.onopen = (event) => {
      const subscribeUser = {"command":"subscribe","identifier":"{\"channel\":\"UsersOnlineChannel\"}"}
      userWebSocket.send(JSON.stringify(subscribeUser))
    }
  
    liveChatSocket(chatWebSocket)
    liveUserSocket(userWebSocket)
  
    toggleLoginLogout()
  
    const logoutBtn = document.querySelector("#logout-button")
    logoutBtn.onclick = () => {
      destroyCurrentUser(userWebSocket)
      toggleLoginLogout()
    }
  
    const userBtn = document.querySelector('#submitUser')
    userBtn.onclick = () => {
      event.preventDefault()
      createCurrentUser(userWebSocket)
      toggleLoginLogout()
    }
  
    const sendBtn = document.querySelector("#sendBtn")
    sendBtn.onclick = () => {
      event.preventDefault()
  
      let currentUser = "Anonymous"
      if(isLoggedIn()) {
        currentUser = sessionStorage.getItem('username')
      }
  
      // console.log(currentUser)
      const chatField = document.querySelector("#chat-field")
      const newMsg = new Lol(chatField.value)
      const effect = newMsg.randomEffectName()
  
      // console.log(effect)
  
      const msg = {
        "command":"message",
        "identifier":"{\"channel\":\"ChatMessagesChannel\"}",
        "data":`{
          \"action\": \"send_text\",
          \"content\": \"${chatField.value}\",
          \"username\": \"${currentUser}\",
          \"color\": \"${sessionStorage.getItem('color')}\",
          \"effect\": \"${effect}\"
        }`
      }
  
      chatWebSocket.send(JSON.stringify(msg))
      chatField.value = ""
    }
  })
  //END DOMCONTENTLOADED
  
  function isLoggedIn() {
    if(sessionStorage.getItem('username')) {
      return sessionStorage.getItem('username')
    } else {
      return undefined
    }
  }
  
  function liveChatSocket(chatWebSocket) {
    chatWebSocket.onmessage = event => {
      const result = JSON.parse(event.data)
      // console.log("chatsocket", result)
  
      let username = ""
      if(result["message"]["content"]) {
  
        if(result["message"]["username"] === "null") {
          username = "Anonymous"
        }
        else {
          username = result["message"]["username"]
        }
        const color = result["message"]["color"]
        const newText = new Lol(result["message"]["content"])
        const styledText = newText.applyEffect(result["message"]["effect"])
        // const styledText = newText.message
        // console.log(result["message"]["effect"], styledText)
        renderChatMessage(`<span style="color: ${color}">${username}</span>`, styledText)
        audioMsgNotify(username)
      }
  
      if(result["message"]["history"]) {
        renderChatHistory(result["message"]["history"])
      }
    }
  }
  
  function liveUserSocket(userWebSocket) {
    userWebSocket.onmessage = event => {
      const result = JSON.parse(event.data)
      // console.log("usersocket", result)
      if (result["message"]["username"]) {
        // console.log(result["message"]["username"])
        const userArray = [...result["message"]["username"]]
        // console.log(userArray)
        renderOnlineUsers(userArray)
        onlineCheck(userArray)
      }
  
      if(result["message"]["new_user"]) {
        renderJoinedMessage(result["message"]["new_user"])
        audioJoin()
      }
  
      if(result["message"]["bye_user"]) {
        renderLeftMessage(result["message"]["bye_user"])
        audioLeave()
      }
    }
  }
  
  function renderJoinedMessage(username) {
    const text = `${username} has joined the channel.`
    const chatContent = document.querySelector("#chat-content")
    const newMessage = document.createElement("p")
    newMessage.innerText = text
    chatContent.append(newMessage)
    scrollDown()
  }
  
  function renderLeftMessage(username) {
    const text = `${username} has left the channel.`
    const chatContent = document.querySelector("#chat-content")
    const newMessage = document.createElement("p")
    newMessage.innerText = text
    chatContent.append(newMessage)
    scrollDown()
  }
  
  function renderChatMessage(username, text) {
    const msg = `${username}: ${text}`
    const chatContent = document.querySelector("#chat-content")
    const newMessage = document.createElement("p")
    newMessage.innerHTML = msg
    chatContent.append(newMessage)
    scrollDown()
  }
  
  function renderChatHistory(msgArray) {
    msgArray.forEach(msg => {
      const newText = new Lol(msg.content)
      renderChatMessage(msg.username, newText.applyEffect(msg.effect))
      // renderChatMessage(msg.username, newText.message)
    })
    scrollDown()
  }
  
  function renderOnlineUsers(userArray) {
    const onlineList = document.getElementById('online-list')
    let usernameArray = []
    onlineList.innerHTML = ""
    userArray.forEach(user => {
      usernameArray = usernameArray.concat(user.username)
    })
    usernameArray.sort().forEach(username => {
      const onlineNow = document.createElement('li')
      onlineNow.innerHTML = `
        <span style="color: #FC388E" class="user-list-text">
            <img src='./imgs/ducky.svg' class="user-icon"/> ${username}
        </span>
        `
      onlineList.append(onlineNow)
    })
  }
  
  
  
  function createCurrentUser(webSocket) {
    const userInput = document.querySelector("#user-field")
    sessionStorage.setItem('username', userInput.value)
    sessionStorage.setItem('identifier', makeId())
    sessionStorage.setItem('color', Color.getRandomColor())
  
    const msg = {
      "command":"message",
      "identifier":"{\"channel\":\"UsersOnlineChannel\"}",
      "data":`{
        \"action\": \"user_join\",
        \"username\": \"${sessionStorage.getItem('username')}\",
        \"identifier\": \"${sessionStorage.getItem('identifier')}\"
      }`
    }
    webSocket.send(JSON.stringify(msg))
  }
  
  function destroyCurrentUser(webSocket) {
    const msg = {
      "command":"message",
      "identifier":"{\"channel\":\"UsersOnlineChannel\"}",
      "data":`{
        \"action\": \"user_leave\",
        \"identifier\": \"${sessionStorage.getItem('identifier')}\"
      }`
    }
  
    webSocket.send(JSON.stringify(msg))
    sessionStorage.clear();
    localStorage.clear();
  }
  
  function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
  function toggleLoginLogout() {
    const loginDiv = document.querySelector("#login")
    const logoutDiv = document.querySelector("#logout")
  
    if(isLoggedIn()) {
      loginDiv.style.display = "none"
      logoutDiv.style.display = "block"
      document.getElementById('welcome').innerText = `Welcome ${sessionStorage.getItem('username')}!`
    }
    else {
      loginDiv.style.display = "block"
      logoutDiv.style.display = "none"
      document.getElementById('welcome').innerText = "Enter a username!"
    }
  }
  
  function scrollDown() {
    const chatContent = document.querySelector("#chat-content")
    chatContent.scrollTop = chatContent.scrollHeight
  }
  
  function audioJoin() {
    const audio = new Audio("./audio/dooropen.wav")
    audio.play()
  }
  
  function audioLeave() {
    const audio = new Audio("./audio/doorslam.wav")
    audio.play()
  }
  
  function audioMsgNotify(username) {
    if(username === sessionStorage.getItem['username']) {
      const audio = new Audio("./audio/imsend.wav")
      audio.play()
    } else {
      const audio = new Audio("./audio/imrcv.wav")
      audio.play()
    }
  
  }
  
  function onlineCheck(userArray) {
    const onlineTitle = document.getElementById('online-title')
    if(userArray.length === 0) {
      onlineTitle.innerText = "No one is online!"
    } else {
      onlineTitle.innerText = "Currently Online"
    }
  }