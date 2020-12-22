
const socket=io();

let textarea=document.querySelector("#textarea");
let message_area=document.querySelector(".message_area");
let send=document.querySelector(".mdi-send");


send.addEventListener( 'click' ,(e)=>{

    if(textarea.value!='')
    {
        let user=send.attributes[2].value;
        let msg=textarea.value;
        textarea.value=''
        let message={
            user:user,
            text:msg.trim()
        }
        appendMessage(message,'outgoing');
        socket.emit('message',message);
        scrollToBottom();
    }
        

    
})

textarea.addEventListener( 'keyup' ,(e)=>{

    if(e.key == 'Enter' && textarea.value.trim()!='')
    {
        let user=send.attributes[2].value;
        let msg=textarea.value;
        textarea.value=''
        let message={
            user:user,
            text:msg.trim()
        }
        appendMessage(message,'outgoing');
        socket.emit('message',message);
        scrollToBottom();
    }
    
})

function appendMessage(message,type)
{
    let msg_div=document.createElement("div");
    msg_div.classList.add('message',type);
    msg_div.innerHTML=`<h6>${message.user}</h6><p class="mb-0">${message.text}</p>`;

    message_area.appendChild(msg_div);
}

function scrollToBottom()
{
    message_area.scrollTop=message_area.scrollHeight;
}
socket.on('message2',(msg)=>{
        appendMessage(msg,'incoming');
        scrollToBottom();
})
