var messageContainer;
var inputWindow;
var typingWindow;

var myClientId = "";
var typingusers = {};

var socket = new io();

let latestCreatedMessage = null;
let messageBar = null;
let members = {};

function init()
{
    messageBar = document.getElementById('ui-input-field');
    messageBar.focus();

    messageContainer = document.getElementById("msg-container");

    if(messageContainer === null)
    {
        alert("error: messageContainer seems to not have been found?!");
        return;
    }
    
    inputWindow = document.getElementById("ui-input-field")
    if(inputWindow === null) 
    {
        alert("error: inputWindow seems to not have been found?!");
        return;
    }

    typingWindow = document.getElementById("ui-typing");
    if(inputWindow === null) 
    {
        alert("error: typingWindow seems to not have been found?!");
        return;
    }

    document.onkeypress = () => {
        if(document.activeElement != messageBar) {
            messageBar.focus();
        }
    };

    inputWindow.onkeypress = function(e) 
    {
        SendTypingState();
        TrySendMessage(e);
    };
}

socket.on('usr-edit', user => {
    members[user.userid] = user;
});

socket.on('usr-msg', function(msg) 
{
    const newMessage = CreateMessage(msg)
    if (newMessage) {
        messageContainer.appendChild(newMessage);
    }
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
});

socket.on('sys-join', function(user) 
{
    members.push(user);
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
});

socket.on('sys-leave', function(user) 
{
    delete members[user.userid];
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
});

socket.on('sys-typ', function(msg) 
{
    typingusers[msg.id].id = msg.id;
    typingusers[msg.id].name = msg.name;

    var currentTime = new Date().getTime();

    typingusers[msg.id].lastTyped = currentTime;

    var currentTypingUsers = {};

    typingusers.array.forEach(function(element) {
        if(element.lastTyped < currentTime - 1000 * 10)
        {
            delete typingusers[element.id];
            return;
        }

        currentTypingUsers.push(element.name);
    }, this);

    var typingMessage = "";

    if(currentTypingUsers.length > 3)
    {
        typingMessage = "calm down everyone.";
    }
    else if(currentTypingUsers.length == 1)
    {
        typingMessage = typingusers[0] + " is typing...";
    }
    else
    {
        for(var i = 0; i < typingusers.length; i++)
        {
            typingMessage += typingusers[i] + ", ";
        }
        typingMessage = typingMessage.slice(0, -2) + " are typing...";
    }

    typingWindow.textContent = typingMessage;
});

function SendTypingState()
{
    socket.emit('usr-typ');
    setTimeout(() => { socket.emit('usr-styp') }, 100)
}

function TrySendMessage(e) 
{
    var charCode = e.keyCode;

    if (charCode == 13) 
    {
        if(inputWindow.value.trim() != "")
        {
            socket.emit('usr-msg', inputWindow.value);
            inputWindow.value = "";
        }
    }
}

function CreateMessage(msg)
{    
    if (latestCreatedMessage && latestCreatedMessage.uid === msg.userid) {
        var addedMessageInstance = document.createElement("p");
        addedMessageInstance.className = "msg-instance";
        addedMessageInstance.textContent = msg.message;
        latestCreatedMessage.el.appendChild(addedMessageInstance)
        return
    }

    var messageInstanceContainer = document.createElement("div");
    messageInstanceContainer.className = "msg-instance-container fadein";

    var messageInstanceAvatar = document.createElement("div");
    messageInstanceAvatar.className = "msg-instance-avatar";
    messageInstanceAvatar.style = "background: url('" + msg.avatarurl + "'); background-position: center; background-size: cover;";
    messageInstanceContainer.appendChild(messageInstanceAvatar);

    var messageContentWrapper = document.createElement("div");
    messageContentWrapper.className = "msg-content-wrapper"

    var messageInstanceTitle = document.createElement("span");
    messageInstanceTitle.className = "msg-instance-title";
    messageInstanceTitle.textContent = msg.name;
    messageContentWrapper.appendChild(messageInstanceTitle);

    var messageInstance = document.createElement("p");
    messageInstance.className = "msg-instance";
    messageInstance.textContent = msg.message;
    messageContentWrapper.appendChild(messageInstance);

    messageInstanceContainer.appendChild(messageContentWrapper);

    latestCreatedMessage = {
        el: messageContentWrapper,
        uid: msg.userid
    };

    return messageInstanceContainer;
}

function CreateSystemMessage(msg, isJoin)
{
    var messageInstanceContainer = document.createElement("div");
    messageInstanceContainer.className = "msg-instance-container fadein";

    var messageInstanceAvatar = document.createElement("div");
    messageInstanceAvatar.className = "msg-instance-avatar";
    messageInstanceAvatar.textContent = isJoin ? "👋" : "🚪";
    messageInstanceAvatar.style = "font-size: 38px; text-align: center;"
    messageInstanceContainer.appendChild(messageInstanceAvatar);

    var messageContentWrapper = document.createElement("div");
    messageContentWrapper.className = "msg-content-wrapper"

    var messageInstanceTitle = document.createElement("span");
    messageInstanceTitle.className = "msg-instance-title";
    messageInstanceTitle.textContent = "system";
    messageContentWrapper.appendChild(messageInstanceTitle);

    var messageInstance = document.createElement("p");
    messageInstance.className = "msg-instance";
    messageInstance.textContent = `${msg} ${isJoin ? 'joined' : 'left'} the chat server`;
    messageContentWrapper.appendChild(messageInstance);

    messageInstanceContainer.appendChild(messageContentWrapper)

    return messageInstanceContainer;
}
