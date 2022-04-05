let socket = io();
let form = document.getElementById('productForm');
let productTable = document.getElementById('productTable');
let chatBox = document.getElementById("chatBox");
let chatLog = document.getElementById("chatLog");
let user;

Swal.fire({
    title: "Ingresa tu email",
    input: "text",
    allowOutsideClick: false,
    inputValidator: (value) => {
        return !value && 'Necesitas ingresar tu email.';
    }
}).then(result => {
    user = result.value;
});

chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length) {
            let dt = new Date();
            let currentDate = `${dt.getDate()}-${(dt.getMonth()+1)}-${dt.getFullYear()} ${dt.getHours()}:${dt.getMinutes()}`;
            socket.emit('newMessage', { user, message: chatBox.value, dateTime: currentDate });
            chatBox.value = "";
        }
    }
});

form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let data = new FormData(form);
    let obj = {};
    data.forEach((value, key) => obj[key] = value);
    socket.emit('newProduct', obj);
});

socket.on('productLog',data=>{
    let products = "<tr><th>Nombre</th><th>Precio</th><th>Foto</th></tr>";
    data.forEach(product => {
        products = products+`<tr><td>${product.product_name}</td><td>${product.product_price}</td><td><img src="${product.product_image}"></td></tr>`
    });
    productTable.innerHTML = products;
})

socket.on('chatLog',data=>{
    let messages = "";
    data.forEach(log => {
        messages = messages+`<span style="font-weight:bold;color:blue">${log.user}</span> <span style="color:brown">(${log.dateTime})</span>: <span style=" font-style: italic;color:green">${log.message}</span></br>`
    });
    chatLog.innerHTML = messages;
});