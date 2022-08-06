function stageChecktoServer(name){
    return (axios({
        method: "POST",
        url: `../../../student/stage/${name}complete`,
        data: {
            Id: $('#userId').html()
        },
        withCredentials: true,
    }))
}



$("#stageDataCheck").click((e)=>{
    stageChecktoServer("data").then(res=>{
        window.location.href = res.data
    })
})

$("#stageMissionCheck").click((e) => {
    stageChecktoServer("mission").then(res => {
        window.location.href = res.data
    })
})

$("#stageManageCheck").click((e) => {
    stageChecktoServer("manage").then(res => {
        window.location.href = res.data
    })
})

$("#stageMindingCheck").click((e) => {
    stageChecktoServer("minding").then(res => {
        window.location.href = res.data
    })
})

$("#stageReponseCheck").click((e) => {
    stageChecktoServer("response").then(res => {
        window.location.href = res.data
    })
})  