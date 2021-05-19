
const serverAddress = serverAdress()
const socket = io(serverAddress);
const roomReg = /^[A-Za-z0-9]{8}$/g
const usernameReg = /^[A-Za-zа-шА-ШčČćĆžŽšŠđĐђјљњћџЂЈЉЊЋЏ ]{4,30}$/g
const tokenReg = /^[A-Za-z0-9/+]{48}$/g
let pridruziBtn = document.getElementById('pridruzi')
let usernameInput = document.getElementById('txb_username')
let roomCodeInput = document.getElementById('txb_roomCode')
let roundTimeDDL = document.getElementById('roundTimeLimit')
let playerNumberDDL = document.getElementById('playerNumber')
let napraviBtn = document.getElementById('napravi')
let vratiBtn = document.getElementById('vrati')
function disableButtons(){
    $(pridruziBtn).prop("disabled", true )
    $(napraviBtn).prop("disabled", true )
    $(vratiBtn).prop("disabled", true )

}
function enableButtons(){
    $(pridruziBtn).prop("disabled", true )
    $(napraviBtn).prop("disabled", true )
    $(vratiBtn).prop("disabled", true )

}
socket.on('createRoomSQLResponse',response =>{
    
    enableButtons()
    if(response["Success"] == false)
        myAlert('Doslo je do problema u kreiranju sobe, pokusajte ponovo!')
    else
    {
        localStorage.setItem('sessionToken',response['sessionToken'])
        console.log(response['sessionToken'])
        window.location.href = `/game?roomCode=${response['roomCode']}&username=${response['username']}`;

    }
})
socket.on('joinRoomSQLResponse' , response=>{
    enableButtons()
    if(response["Success"] == false)
        //make this more robust
        myAlert(response["ERR_MSG"])
    else
    {
        localStorage.setItem('sessionToken',response['sessionToken'])
        window.location.href = `/game?roomCode=${response['roomCode']}&username=${response['username']}`
    }
    
})
socket.on('returnRoomResponse', message=>{
    disableButtons()
    if(message['Success'] == false){
        myAlert(message["ERR_MSG"])
    }else if(message['Success'] == true){
        window.location.href = `/game?roomCode=${message['roomCode']}&username=${message['username']}`
    }
})
function myAlert(test){
    $("#danger-alert").html(`<a href="#" class="close" data-dismiss="alert">&times;</a><strong>Failure</strong> ${test}`)
    $("#danger-alert").fadeTo(7000, 500).slideUp(500, () =>{
        $("#danger-alert").slideUp(500);
    });   
}
pridruziBtn.addEventListener('click',(e)=>{  
    e.preventDefault();
    let username = usernameInput.value.trim()
    let room = roomCodeInput.value.trim()
    disableButtons()
    if(roomReg.test(room) && usernameReg.test(username)){                      
        socket.emit('joinRoomSQL',{username,room})                
        //pop alert
    }else{
        if(!roomReg.test(room) && !usernameReg.test(username)){
            //mylaertuj za o
            myAlert('Korisnicko ime mora da bude barem 4 karaktera dugacko, dozvoljena pisma su sprska latinica,cirilica i engleski alfabet!\nSoba se sastoji od 8 alfanumerickih karaktetra!')
        }else if(!roomReg.test(room)){
            // ako je soba invalidnog formata
            myAlert('Soba se sastoji od 8 alfanumerickih karaktetra!')
        }
        else{
            //ako je useranme invalidnog formnata
            myAlert('Korisnicko ime mora da bude barem 4 karaktera dugacko, dozvoljena pisma su sprska latinica, cirilica i engleski alfabet!')
        }
        enableButtons()
    }
})
       
napraviBtn.addEventListener('click',(e)=>{
    e.preventDefault(); 
    let username =usernameInput.value.trim()
    disableButtons()  
    if(usernameReg.test(username)){
        let playerCount = playerNumberDDL.value
        let roundTimeLimit = roundTimeDDL.value
        socket.emit('createRoom',{username,playerCount,roundTimeLimit})
    }else{
        myAlert("Korisnicko ime mora da bude barem 4 karaktera dugacko, dozvoljena pisma su sprska latinica, cirilica i engleski alfabet!")
        enableButtons()
    }
})
vratiBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    disableButtons()
    let sessionToken = localStorage.getItem('sessionToken')
    if(tokenReg.test(sessionToken)){
        socket.emit("returnRoom",sessionToken)
    }else{
        myAlert("Nije se moguće vratiti u sobu, napravite novu ili se pridružite drugoj sobi!")
    }      
    enableButtons()
})