const LoginFunc = (e) => {
  
    const Account = $('#Account').val()
    const Password = $('#Password').val()

    axios({
        method: "POST",
        data: {
            Account: Account,
            Password: Password,
        },
        url: '/login',
        withCredentials: true,
    }).then(res=>{
        window.location.href = res.data
    })
}

$('#loginNormal').click(e => LoginFunc(e))