//確認stage完成並發送至資料庫
function stageChecktoServer(name) {
    return (axios({
        method: "POST",
        url: `../../../student/stage/${name}complete`,
        data: {
            studentId: $('#userId').html(),
            Week: $('.WeekTitle').html(),
        },
        withCredentials: true,
    }))
}
//確認是否將完成Stage
function confirmFinishStage(stage) {
    return window.confirm(`確定完成 ${stage} 進度嗎?`) ? true : false
}
//抓取錯誤
function catchError(){
    window.alert("更新失敗，請稍後重試或連繫管理員")
}

//上傳stage完整function
function uploadStage(stage){
    loadingPage(true)
    stageChecktoServer(stage).then(res => {
        if (res.data === "upload failed") {
            catchError()
            loadingPage(false)
        }
        window.location.href = res.data
    })
}
//等待畫面loadingPage
function loadingPage(isOpen) {
    let loadingDiv = $('.loading')
    loadingDiv.css('display', isOpen ? 'block' : 'none')
}

$("#stageDataCheck").click((e) => {
    if (confirmFinishStage("觀看教學文件")) {
        uploadStage("data")
    }
})
$("#stageMissionCheck").click((e) => {
    if (confirmFinishStage("確定本周目標")) {
        uploadStage("mission")
    }
})
$("#stageManageCheck").click((e) => {
    if (confirmFinishStage("完成學習計畫")) {
        uploadStage("manage")
    }
})
$("#stageMindingCheck").click((e) => {
    if (confirmFinishStage("完成自我反思")) {
        uploadStage("minding")
    }
})
$("#stageResponseCheck").click((e) => {
    if (confirmFinishStage("閱讀完老師回饋")) {
        uploadStage("response")
    }

})
$('#backBtn').click((e)=>{
    const userId = $('#userId').html()

    window.location.href = `/dashboard/${userId}`
}) 

$(window).ready(()=>{
    loadingPage(false)
})