const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const CHANNELS_URL = `${BASE_URL}/channels`
const MESSAGES_URL = `${BASE_URL}/messages`

document.addEventListener("DOMContentLoaded", () => {
    console.log('%c DOM Content Loaded and Parsed!', 'color: magenta');
    test()
    fetch(USERS_URL).then(res => res.json()).then(users => console.log(users));
})