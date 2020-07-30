const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const CHANNELS_URL = `${BASE_URL}/channels`
const MESSAGES_URL = `${BASE_URL}/messages`

//this will be set to the current logged in User
let currentUser;
//this will be set to most recently clicked Channel
let currentChannel;


document.addEventListener("DOMContentLoaded", () => {
    console.log('%c DOM Content Loaded and Parsed!', 'color: magenta');

    //function to open new WebSocket via ActionCable
    function openConnection() {
        return new WebSocket("ws://localhost:3000/cable")
    }

    //opening WebSocket for chat
    const chatWebSocket = openConnection();
    chatWebSocket.onopen = (event) => {
        const subscribeMsg = { "command": "subscribe", "identifier": "{\"channel\":\"ChatMessagesChannel\"}" }
        chatWebSocket.send(JSON.stringify(subscribeMsg))
    }

    liveChatSocket(chatWebSocket);

    //global variables for elements we'll be using
    loginContainer = document.getElementById('login-container');
    channelList = document.getElementById('channel-list');
    messageList = document.getElementById('message-list');
    chatInput = document.getElementById('chat-input');
    chatField = document.getElementById('chat-field');
    sendBtn = document.getElementById('sendBtn');

    //send Message to chatWebSocket upon clicking send button
    sendBtn.onclick = () => {
        event.preventDefault();

        const msg = {
            "command": "message",
            "identifier": "{\"channel\":\"ChatMessagesChannel\"}",
            "data": `{
            \"action\": \"send_text\",
            \"content\": \"${chatField.value}\",
            \"user\": {
                \"name\": \"${currentUser.name}\"
            }
        }`
        }

        chatWebSocket.send(JSON.stringify(msg))
        chatField.value = ""
    }

    //send array of all Users to logIn function
    fetch(USERS_URL).then(res => res.json()).then(users => logIn(users))
})

//chatWebSocket receives Message from chatField
function liveChatSocket(chatWebSocket) {
    chatWebSocket.onmessage = event => {
        const result = JSON.parse(event.data);
        //postNewMessage(result["message"])
        if (result["message"]["content"]) {
            //renderNewMessage(result["message"]["content"])
            postNewMessage(result["message"])
        }
    }
}



//upon clicking Log In, find the User by name and set to currentUser, then renderHomePage for currentUser
function logIn(users) {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let nameInput = event.target.name.value;
        let returnArray = users.filter(user => user.name === nameInput);

        //users.filter returns an array so we must pull the User object from that array
        currentUser = returnArray[0];

        renderHomePage(currentUser);
    })
}


//render the home page for current User
function renderHomePage(currentUser) {
    //hide login form and display chat input form
    loginContainer.style.display = "none";
    chatInput.style.display = "inline";


    //render channels the currentUser has messages in
    for (const channel of currentUser.channels) {
        const channelItem = document.createElement('li');
        channelItem.innerText = channel.title
        channelItem.addEventListener("click", (event) => {
            //fetch all messages, filter to channel clicked, then render
            currentChannel = channel;
            fetchAllMessages(channel);
        })
        //appending currentUser's channels
        channelList.appendChild(channelItem)
    }
}


//fetching all messages, then send to filterMessagesToChannel function
function fetchAllMessages(currentChannel) {
    fetch(MESSAGES_URL)
        .then(res => res.json())
        .then(allMessages => filterMessagesToChannel(allMessages, currentChannel))
};


//filter all messages down to messages in current channel, then send to renderMessages function
function filterMessagesToChannel(allMessages, channel) {
    //clear message list
    messageList.innerHTML = "";

    let channelMessages = allMessages.filter(message => message.channel_id == currentChannel.id);
    renderMessages(channelMessages);
}


//render filtered messages
function renderMessages(channelMessages) {
    for (const message of channelMessages) {
        //const messageUser = channelMessages.filter(message => message.user_id == currentUser.id)

        const messageItem = document.createElement('p')
        messageItem.innerHTML = `${message.content} -${message.user.name}`
        messageList.appendChild(messageItem);
    }
}







function postNewMessage(message){
    fetch(MESSAGES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            content: message.content,
            user_id: currentUser.id,
            channel_id: currentChannel.id
        })
    }).then(currentChannel => fetchAllMessages(currentChannel));
}

// function renderNewMessage(content) {
//     const msg = `${currentUser.name}: ${content}`
//     const newMsg = document.createElement("p")
//     newMsg.innerHTML = msg
//     console.log(newMsg)
//     messageList.appendChild(newMsg)
// }

//POST NEW MESSAGE THEN FETCH ALL instead of render ^

// function fetchAllChannels() {
//     fetch(CHANNELS_URL)
//         .then(res => res.json())
//         .then(channels => {
//             console.log(channels)
//             let uniqueChannels = [...new Set(channels)]
//             console.log(uniqueChannels)
//             renderChannels(channels)
//         })
// }

// function renderChannels(channels) {
//     console.log(channels)
//     const channelDiv = document.getElementById('channel-display')
//     const channelList = document.createElement('ul')
//     channels.forEach(channel => {
//         const channelListItem = document.createElement('li')
//         channelListItem.innerText = channel.title;
//         channelListItem.addEventListener("click", (event) => {
//             renderMessages(channel)
//         })
//         channelList.appendChild(channelListItem)
//     })
//     channelDiv.appendChild(channelList)
// }

// function renderMessages(channel){
//     const messageDiv = document.getElementById('message-display');
//     messageDiv.innerHTML = "";
//     const messageList = document.createElement('ul');
//     console.log(channel)
//     console.log(channel.messages)
//     channel.messages.forEach(message => {
//         const messageListItem = document.createElement('li')
//         messageListItem.innerHTML = `${message.content} <br> -${message.user}`
//         messageList.appendChild(messageListItem);
//     })
//     messageDiv.appendChild(messageList)
// }
