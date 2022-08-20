function loadingPage(isOpen) {
    let loadingDiv = $('.loading')
    if (isOpen) {
        loadingDiv.fadeIn(400)
    } else {
        loadingDiv.fadeOut(400)
    }
}

const LoginFunc = (e) => {
  
    const Account = $('#Account').val()
    const Password = $('#Password').val()

    if(Account === ""){
        window.alert("請輸入帳號")
        return
    }
    if(Password === ""){
        window.alert("請輸入密碼")
        return
    }

    axios({
        method: "POST",
        data: {
            username: Account,
            password: Password,
        },
        url: '/login',
        withCredentials: true,
    }).then(res=>{
        if(res.data === 'login failed'){
            window.alert('帳號或密碼錯誤')
            loadingPage(false)
            return
        }
        window.location.href = res.data
    })
}

$('#loginNormal').click(e => {
    loadingPage(true)
    LoginFunc(e)
})

$(document).ready(e =>{
    loadingPage(false)
})