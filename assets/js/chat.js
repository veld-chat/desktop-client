var messageContainer;
var inputWindow;

var socket = new io();

socket.on('usr-msg', function(msg) {
    messageContainer.innerHTML += CreateMessage("anon", msg);
});

socket.on('sys-msg', function(msg) {
    messageContainer.innerHTML += CreateSystemMessage(msg);
});

function Init() 
{
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

    inputWindow.onkeypress = function(e) {
        TrySendMessage(e);
    };
}

function TrySendMessage(e) 
{
    var charCode = e.keyCode;

    if (charCode == 13) 
    {
        socket.emit('usr-msg', inputWindow.value);
        inputWindow.value = "";
    }
}

function CreateMessage(name, msg)
{
    return "<ul class='msg-instance-container'><div class='msg-instance-avatar'></div><div class='msg-instance-title'>" + name + "</div><div class='msg-instance'>" + msg + "</div></ul>";
}

function CreateSystemMessage(msg)
{
    return "<ul class='msg-instance-container'><div class='msg-instance-title'>system</div><div class='msg-instance'>" + msg + "</div></ul>";
}





