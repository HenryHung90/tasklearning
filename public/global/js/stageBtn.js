//確認stage完成並發送至資料庫
function stageChecktoServer(name) {
    return (axios({
        method: "POST",
        url: `/studentstage/${name}complete`,
        data: {
            studentId: $('#userId').html(),
            week: $('.WeekTitle').html(),
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

function stageBtnEnter(stage,stageName){
    const dataWeek = parseInt($('.WeekTitle').html().split(" ")[1]) - 1
    const userId = $('#userId').html()

    axios({
        method: "POST",
        url: '/studentstage/checkstage',
        data: {
            week: dataWeek
        },
        withCredentials: true,
    }).then(async (response) => {
        const data = response.data[dataWeek]

        if (data.Status[stage] == true) {
            window.location.href = `/dashboard/${userId}`
        } else {
            if (confirmFinishStage(stageName)) {
                uploadStage(stage)
            }
        }
    })
}

//return 等待畫面loadingPage
function loadingPage(isOpen) {
    let loadingDiv = $('.loading')
    if (isOpen) {
        loadingDiv.fadeIn(400)
    } else {
        loadingDiv.fadeOut(400)
    }
}

$("#stageDataCheck").click((e) => {
    stageBtnEnter("Data", "觀看教學文件")
})
//遷移至mission.js
// $("#stageMissionCheck").click((e) => {
//     if (confirmFinishStage("確定本周目標")) {
//         uploadStage("mission")
//     }
// })
$("#stageManageCheck").click((e) => {
    stageBtnEnter("Manage", "完成學習計畫")
})
//遷移至minding.js
// $("#stageMindingCheck").click((e) => {
//     stageBtnEnter("Minding", "完成自我反思")
// })
//遷移至response.js
// $("#stageResponseCheck").click((e) => {
//     stageBtnEnter("Response", "閱讀完老師回饋")
// })

$('#backBtn').click((e)=>{
    const userId = $('#userId').html()

    window.location.href = `/dashboard/${userId}`
}) 