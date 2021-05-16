
const serverAddress = serverAdress()
const socket = io(serverAddress);
const userReg = RegExp("[0-9A-Za-z]{4,30}\g");
const roomReg = RegExp("[0-9A-Za-z]{8}\g")
socket.on('message', message =>{
    console.log(message)
})
//TODO dodaj type reconnect 
socket.on('createRoomSQLResponse',response =>{
    console.log(response)
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
    
    if(response["Success"] == false)
        //make this more robust
        myAlert(response["ERR_MSG"])
    else
    {
        localStorage.setItem('sessionToken',response['sessionToken'])
        window.location.href = `/game?roomCode=${response['roomCode']}&username=${response['username']}`
    }
    
})
function myAlert(test){
    $("#danger-alert").html(`<a href="#" class="close" data-dismiss="alert">&times;</a><strong>Failure</strong> ${test}`)
    $("#danger-alert").fadeTo(7000, 500).slideUp(500, () =>{
        $("#danger-alert").slideUp(500);
    });   
}
        

        //dodaj ova govna
document.getElementById('pridruzi').addEventListener('click',(e)=>{
    let roomReg = /^[A-Za-z0-9]{8}$/g
    const usernameReg = /^[A-Za-zа-шА-ШčČćĆžŽšŠđĐђјљњћџЂЈЉЊЋЏ ]{4,30}$/g
    e.preventDefault();
    let username = document.getElementById('txb_username').value.trim()
    let room = document.getElementById('txb_roomCode').value.trim()
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
            myAlert('Korisnicko ime mora da bude barem 4 karaktera dugacko, dozvoljena pisma su sprska latinica i engleski alfabet!')
        }
    }
})
       
document.getElementById('napravi').addEventListener('click',(e)=>{
    e.preventDefault(); 
    let username = document.getElementById('txb_username').value.trim()
    let reg = /^[A-Za-zа-шА-ШčČćĆžŽšŠđĐђјљњћџЂЈЉЊЋЏ ]{4,30}$/g
    if(reg.test(username)){
        let playerCount = document.getElementById('playerNumber').value

        console.log(typeof(playerCount));
        let roundTimeLimit = document.getElementById('roundTimeLimit').value
        /*if(userReg.test(username))
            console.log("Napravi")
            //socket.emit('createRoom',username)
        else
            myAlert("Username must be longer than 4 and shorter than 30 characters, only numbers and letters")
            //pop awlert
        */
        socket.emit('createRoom',{username,playerCount,roundTimeLimit})
    }else{
        myAlert("Korisnicko ime mora da bude barem 4 karaktera dugacko, dozvoljena pisma su sprska latinica,cirilica i engleski alfabet!")
    }
})
document.getElementById('vrati').addEventListener('click',(e)=>{
    e.preventDefault();
    let room = document.getElementById('txb_roomCode').value.trim()
    let username = document.getElementById('txb_username').value.trim()
    let roomReg = /^[A-Za-z0-9]{8}$/g
    const usernameReg = /^[A-Za-zа-шА-ШčČćĆžŽšŠđĐђјљњћџЂЈЉЊЋЏ ]{4,30}$/g
    if(roomReg.test(room) && usernameReg.test(username)){   
        window.location.href = `/game?roomCode=${room}&username=${username}`;
    }else{
        if(!roomReg.test(room) && !usernameReg.test(username)){
            //mylaertuj za o
            myAlert('Korisnicko ime mora da bude barem 4 karaktera dugacko, dozvoljena pisma su sprska latinica i engleski alfabet!\nSoba se sastoji od 8 alfanumerickih karaktetra!')
        }else if(!roomReg.test(room)){
            // ako je soba invalidnog formata
            myAlert('Soba se sastoji od 8 alfanumerickih karaktetra!')
        }
        else{
            //ako je useranme invalidnog formnata
            myAlert('Korisnicko ime mora da bude barem 4 karaktera dugacko, dozvoljena pisma su sprska latinica i engleski alfabet!')
        }
    }
})