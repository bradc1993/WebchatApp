const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const CHANNELS_URL = `${BASE_URL}/channels`
const MESSAGES_URL = `${BASE_URL}/messages`

//this will be set to logged in User
let currentUser;

//fetch User db after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log('%c DOM Content Loaded and Parsed!', 'color: magenta');
    
    //global variables for elements we'll be using
    loginContainer = document.getElementById('login-container')
    channelList = document.getElementById('channel-list');
    messageList = document.getElementById('message-list');
    
    fetchUsers();
})


//fetch all Users
function fetchUsers() {
    fetch(USERS_URL).then(res => res.json()).then(users => logIn(users));
};


//upon clicking Log In, find the User by name and set to currentUser, then renderHomePage for currentUser
function logIn(users) {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let nameInput = event.target.name.value;
        let returnArray = users.filter(user => user.name === nameInput);
        
        //.filter returns an array so we must pull the User object from that array
        currentUser = returnArray[0];

        renderHomePage(currentUser);
    })
}


function renderHomePage(currentUser) {
    //hide login form
    loginContainer.style.display = "none";
    
    //render channels the currentUser has messages in
    for (const channel of currentUser.channels) {
        const channelItem = document.createElement('li');
        channelItem.innerText = channel.title
        channelItem.addEventListener("click", (event) => {
            //fetch all messages, filter to channel clicked, then render
            fetchAllMessages(channel)
        })
        //appending currentUser's channels
        channelList.appendChild(channelItem)
    }
}


//fetching all messages, then send to filterMessagesToChannel function
function fetchAllMessages(channel){
    fetch(MESSAGES_URL)
    .then(res => res.json())
    .then(allMessages => filterMessagesToChannel(allMessages, channel))
};


//filter messages to current channel, then send to renderMessages function
function filterMessagesToChannel(allMessages, channel){
    //clear message list
    messageList.innerHTML = "";

    let channelMessages = allMessages.filter(message => message.channel_id == channel.id);
    renderMessages(channelMessages);
}


//render filtered messages to HTML
function renderMessages(channelMessages){
    for (const message of channelMessages) {
        //const messageUser = channelMessages.filter(message => message.user_id == currentUser.id)
        
        const messageItem = document.createElement('li')
        messageItem.innerHTML = `${message.content} -${message.user.name}`
        messageList.appendChild(messageItem);
    }
}



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

