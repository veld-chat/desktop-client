var messageContainer;
var inputWindow;

//*
    var socket = new io("37.97.187.157:1234");
/*/
    var socket = new io();
//*/

function Init() 
{
    messageContainer = document.getElementById("msg-container");
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

    inputWindow.onkeypress = function(e) {
        TrySendMessage(e);
    };
}

socket.on('usr-msg', function(msg) {
    messageContainer.appendChild(CreateMessage(msg));
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
});

socket.on('sys-msg', function(msg) {
    messageContainer.appendChild(CreateSystemMessage(msg));
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
});

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





