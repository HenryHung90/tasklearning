$(document).ready(e => {
    setTimeout(e => {
        // console.log(window.location.pathname.split("/"))
        //student Dashboard Listener
        if (window.location.pathname.split("/")[1] == "dashboard") {
            $(".taskStage_Box_Complete").mousedown(e => {
                taskStageBoxClick(e)
            })
            $(".taskStage_Box").mousedown(e => {
                taskStageBoxClick(e)
            })
            $(".taksStage_Box_teacherComplete").mousedown(e => {
                taskStageBoxClick(e)
            })
        }
        //student Data Listener
        if (window.location.pathname.split("/")[4] == "data") {
            $(".dataDownload").click(e => {
                dataBoxClick(e, "O")
            })
            $(".dataVideo").click(e => {
                dataBoxClick(e, "O")
            })
            //data PDF / Video Close event listener in data.js

            $("#backBtn").click(e => {
                uploadClick("教學資料", "L")
            })
            $("#stageDataCheck").click(e => {
                uploadClick("教學資料", "F")
            })
        }
        //student mission Listener
        if (window.location.pathname.split("/")[4] == "mission") {
            //
            $(".missionText").on("dragend", e => {
                missionDrag(e)
            })

            //option click function in mission.js

            $("#backBtn").click(e => {
                uploadClick("準備階段", "L")
            })
            $("#stageMissionCheck").click(e => {
                uploadClick("準備階段", "F")
            })
        }

        if (window.location.pathname.split("/")[4] == "manage") {
            $("#backBtn").click(e => {
                uploadClick("執行階段", "L")
            })
            $("#stageManageCheck").click(e => {
                uploadClick("執行階段", "F")
            })
        }
    }, 500)
})
// window.addEventListener('beforeunload', (event) => {
//     // Cancel the event as stated by the standard.
//     event.preventDefault();
//     // Chrome requires returnValue to be set.
//     axios({
//         method: "GET",
//         url: "/logout",
//         withCredentials: true,
//     })
//   });
//dashboard
function taskStageBoxClick(e) {
    const stageType = e.currentTarget.id.split("_")[0]
    const stageWeek = "周次 " + e.currentTarget.id.split("_")[1]

    let item = stageWeek

    switch (stageType) {
        case "Data":
            item += " 教學資料"
            break
        case "Mission":
            item += " 準備階段"
            break
        case "Manage":
            item += " 執行階段"
            break
        case "Minding":
            item += " 反思階段"
            break
        case "Response":
            item += " 老師回饋"
    }

    uploadClick(item, "E")
}

//data
function dataBoxClick(e, operation) {
    const dataInfo = operation == "B" ? e.currentTarget.name : e

    // console.log(dataInfo.name)
    uploadClick(dataInfo.toString(), operation)
}

//---------------------------------------------------------------------------
//mission
function missionDrag(e) {
    const missionName = e.originalEvent.path[0].name
    const missionOperation =
        e.originalEvent.path[1].className == "dragMission" ? "CS" : "DS"

    uploadClick(missionName, missionOperation)
}

function optionClick(e, option) {
    let optionName = e.currentTarget.name
    if (e.currentTarget.name == undefined) {
        optionName = switchOptionName(e.currentTarget.id.split("_")[3])
    }
    uploadClick("策略 " + optionName, option)
}
//----------------------------------------------------------------------------

//manage
function optionText(missionId, optionName) {
    uploadClick(`任務${missionId} 的 ${optionName}`, "U")
}

//----------------------------------------------------------------------------
//minding

//response

//upload fcuntion
function uploadClick(item, operation) {
    let operationText = ""
    switch (operation) {
        case "E":
            operationText = "進入"
            break
        case "O":
            operationText = "打開"
            break
        case "C":
            operationText = "關閉"
            break
        case "L":
            operationText = "離開"
            break
        case "F":
            operationText = "完成"
            break
        case "DS":
            operationText = "選擇"
            break
        case "CS":
            operationText = "取消選擇"
            break
        case "U":
            operationText = "更新"
            break
    }

    const clickTemp = {
        time: getNowTime(),
        operation: operationText,
        item: item,
        description: "在 " + getNowTime() + ` ${operationText} ` + item,
    }

    axios({
        method: "post",
        url: "/student/addlistener",
        data: { clickTemp },
    }).then(response => {
        if (response.data != "success") {
            window.alert("儲存出現問題，請重整網頁")
        }
    })
}

//get Time function
function getNowTime() {
    const time = new Date()
    return (
        time.getFullYear() +
        "/" +
        (time.getMonth() + 1) +
        "/" +
        time.getDate() +
        " " +
        time.getHours() +
        ":" +
        time.getMinutes() +
        ":" +
        time.getSeconds()
    )
}
