var messageContainer;
var inputWindow;
var typingWindow;

var myClientId = "";
var typingusers = {};

var debug = false;
/*
    var socket = new io("37.97.187.157:1234");
/*/
    var socket = new io();
    debug = true;
//*/

function Init() 
{
    messageContainer = document.getElementById("msg-container");

    messageContainer.appendChild(CreateSystemMessage("casual reminder you're in debug mode.."));

    console.log(messageContainer);
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

    inputWindow.onkeypress = function(e) 
    {
        SendTypingState();
        TrySendMessage(e);
    };
}

socket.on('usr-msg', function(msg) 
{
    messageContainer.appendChild(CreateMessage(msg));
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
});

socket.on('sys-msg', function(msg) 
{
    messageContainer.appendChild(CreateSystemMessage(msg));
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
            continue;
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
    setTimeout(() => { socket.emit('usr-styp') }, milliseconds)
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
    var messageInstanceContainer = document.createElement("ul");
    messageInstanceContainer.className = "msg-instance-container fadein";

    var messageInstanceAvatar = document.createElement("div");
    messageInstanceAvatar.className = "msg-instance-avatar";
    messageInstanceAvatar.style = "background: url('" + msg.avatarurl + "'); background-position: center; background-size: contain;";
    messageInstanceContainer.appendChild(messageInstanceAvatar);

    var messageInstanceTitle = document.createElement("div");
    messageInstanceTitle.className = "msg-instance-title";
    messageInstanceTitle.textContent = msg.name;
    messageInstanceContainer.appendChild(messageInstanceTitle);

    var messageInstance = document.createElement("div");
    messageInstance.className = "msg-instance";
    messageInstance.textContent = msg.message;
    messageInstanceContainer.appendChild(messageInstance);

    return messageInstanceContainer;
}

function CreateSystemMessage(msg)
{
    var messageInstanceContainer = document.createElement("ul");
    messageInstanceContainer.className = "msg-instance-container fadein";

    var messageInstanceTitle = document.createElement("div");
    messageInstanceTitle.className = "msg-instance-title";
    messageInstanceTitle.textContent = "system";
    messageInstanceContainer.appendChild(messageInstanceTitle);

    var messageInstance = document.createElement("div");
    messageInstance.className = "msg-instance";
    messageInstance.textContent = msg;
    messageInstanceContainer.appendChild(messageInstance);

    return messageInstanceContainer;
}





