//return 換好名稱的studentSelect
function switchMissionName(switchData) {
    const switchStudentSelect = Object.values(switchData.studentSelect)
    switchStudentSelect.map((value, index) => {
        switchStudentSelect[index][0] = switchData.mission[value[0]].title
    })

    return switchStudentSelect
}
//return 從資料庫抓下的計畫內容
async function loadingManageDetailFromData(mission) {
    const dataWeek = $(".WeekTitle").html().split(" ")

    const missionId = mission[1]
    const missionStep = mission[3]
    let data = []
    await axios({
        method: "post",
        url: "/student/readmanage",
        data: {
            week: dataWeek,
        },
    }).then(response => {
        data = response.data.studentManage
    })
    return data[missionId][missionStep]
}

//upload計畫內容
function uploadManageData(currentStepId, isDisabled) {
    if (currentStepId === null) {
        return true
    }
    const curretnStepTemp = currentStepId.split("_")

    if (isDisabled) {
        return true
    }
    const dataWeek = $(".WeekTitle").html().split(" ")[1]
    const manageId = curretnStepTemp[1]
    const manageStep = curretnStepTemp[3]
    const manageContent = $(".manageDecideContent").val()

    //event Listener
    optionText(manageId, $(`#${currentStepId}`).html())

    axios({
        method: "post",
        url: "/student/addmanage",
        data: {
            week: dataWeek,
            manageId: manageId,
            manageStep: manageStep,
            manageContent: manageContent,
        },
        withCredentials: true,
    })

    return true
}

//render 左側計畫選項欄
function renderManageSchedule(manageData) {
    //任務執行外框
    let manageScheduleDiv = $("<div>")
        .prop({
            className: "missionSchedule",
        })
        .css({
            width: "100%",
            height: "90%",
            padding: "10px",
            "overflow-y": "auto",
        })
    //render 各Mission Step框框
    function renderMissionData(data, index) {
        let returnData = ""
        for (let i = 1; i < data.length; i++) {
            returnData += `<div class="options" id="targetMission_${index}_option_${i}">${i}- ${data[i]}</div>`
        }
        return returnData
    }

    manageData.map((manageValue, manageIndex) => {
        //選擇之Mission名稱
        const missionTitle = $("<h4>").prop({
            className: "missionBox_Title",
            id: `targetMission_${manageIndex}`,
            innerHTML: manageValue[0],
        })
        //選擇之Steps
        const missionData = $("<div>")
            .prop({
                className: "missionBox_Data",
                innerHTML: renderMissionData(manageValue, manageIndex),
            })
            .css({
                display: "flex",
                "justify-content": "space-around",
            })

        //任務外框
        let missionDiv = $("<div>")
            .prop({
                className: `mission_${manageIndex}`,
            })
            .css({
                width: "90%",
                "background-color": "rgba(255,2555,255,0.5)",
                "border-radius": "10px",
                padding: "10px",
                margin: "10px",
            })
            .append(missionTitle)
            .append(missionData)

        manageScheduleDiv.append(missionDiv)
    })

    return manageScheduleDiv
}
//render 右側寫入執行計畫欄
function renderManageDecide(
    currentStepId,
    currentStepTitle,
    currentContent,
    isDisabled
) {
    const missionName = $(
        `#targetMission_${currentStepId.split("_")[1]}`
    ).html()

    //標頭
    const missionDecideTitle = $("<h3>")
        .prop({
            className: "manageDecideTitle",
            innerHTML: missionName + "<br>" + currentStepTitle,
        })
        .css({
            margin: "10px 0 30px 0",
        })

    //解釋文字區
    const missionExplainContent = $("<h5>").prop({
        className: "manageExpainText",
    })
    switch (currentStepTitle.split(" ")[1]) {
        case "環境結構":
            missionExplainContent.html("能夠選擇合適的學習環境進行學習，或是選擇合適的軟體硬體進行學習")
            break
        case "學習策略":
            missionExplainContent.html("能夠根據任務挑選合適的學習策略，例如作筆記、重點整理、畫流程圖或是心智圖、上網尋找資料、上網尋找相關問題、從範例中學習、額外尋找相關資料補充")
            break
        case "時間管理":
            missionExplainContent.html("能夠規劃多久時間內完成任務、規劃每天花多久時間學習、或是在固定時段學習")
            break
        case "尋求協助":
            missionExplainContent.html("找助教幫忙、請教老師問題、尋找學長姊幫忙、請教朋友或是同儕共同解決、線上尋找網友協助、網路上發貼詢問問題")
            break
        case "自我評估":
            missionExplainContent.html("能夠自我檢視或是評量自己的學習狀況，例如: 從筆記重點整理、與同學討論過程中、從實作成果中、與同學交換心得或是作品中、從老師給予的評量中")
            break
    }

    //內文輸入區
    const missionDecideContent = $("<textarea>")
        .prop({
            className: "manageDecideContent",
            innerHTML: currentContent,
            placeholder: "請說明你在該任務計畫做了什麼，越詳細越好",
        })
        .css({
            width: "100%",
            height: "70%",
            padding: "15px",
            border: "1px dashed rgba(0,0,0,0.3)",
            "border-radius": "20px",
            "transition-duration": "0.5s",
            resize: "none",
        })
        .hover(
            e => {
                missionDecideContent.css({
                    "transition-duration": "0.5s",
                    border: "1.5px dashed rgba(0,0,0)",
                })
            },
            e => {
                missionDecideContent.css({
                    border: "1px dashed rgba(0,0,0,0.3)",
                })
            }
        )
    if (isDisabled) missionDecideContent.attr("disabled", "disabled")

    const manageDecideDiv = $("<div>")
        .prop({
            className: "manageDecide",
        })
        .css({
            width: "100%",
            height: "100%",
            padding: "10px",
            "background-color": "rgba(255,255,255,0.5)",
            "border-radius": "20px",
        })
        .append(missionDecideTitle)
        .append(missionExplainContent)
        .append(missionDecideContent)

    return manageDecideDiv
}

//render manage main function
function renderManagePage(data) {
    const studentSelect = switchMissionName(data)

    const manageScheduleDiv = $(".manageComponents")

    manageScheduleDiv.append(renderManageSchedule(studentSelect))
}
//點擊option後生成安排區域
function optionsClick() {
    const options = $(".options")

    options.click(async e => {
        e.preventDefault()
        const PrevOption = $(".Clicking")[0]
        //阻止重複點按
        if (e.currentTarget.className == "options Clicking") {
            $(".manageDecide")
                .animate(
                    {
                        width: "90%",
                        height: "90%",
                        margin: "5% 5% 5% 5%",
                    },
                    100
                )
                .animate(
                    {
                        width: "100%",
                        height: "100%",
                        margin: "0",
                    },
                    100
                )
            return
        }
        let isDisabled = false
        await preventEditAfterWellDone().then(
            response => (isDisabled = response)
        )

        //防止使用者點了忘記儲存
        if (uploadManageData(PrevOption ? PrevOption.id : null, isDisabled)) {
            const targetId = e.currentTarget.id
            const targetTitle = e.currentTarget.innerHTML
            let targetContent = ""

            loadingManageDetailFromData(targetId.split("_"))
                .then(res => {
                    targetContent = res
                })
                .then(() => {
                    //任務安排區域
                    const manageDecide = $(".manageUserDecide")
                    manageDecide.fadeOut(100)

                    setTimeout(e => {
                        manageDecide.empty()
                        manageDecide.append(
                            renderManageDecide(
                                targetId,
                                targetTitle,
                                targetContent,
                                isDisabled
                            )
                        )
                        manageDecide.fadeIn(200)
                    }, 100)
                })
            //option highlighting select
            $(".options")
                .css({ "background-color": "rgb(200,200,200)" })
                .removeClass("Clicking")
            $(`#${targetId}`)
                .css({ "background-color": "rgba(255, 0, 0, 0.5)" })
                .addClass("Clicking")
        }
    })
}
//loading Manage main function
function loadingManage() {
    loadingPage(true)
    const dataWeek = $(".WeekTitle").html().split(" ")[1]
    const userId = $("#userId").html()

    //讀取已選任務
    axios({
        method: "post",
        url: "/studentstage/checkstage",
        withCredentials: true,
    }).then(response => {
        if (!response.data[dataWeek - 1].Status.Mission) {
            window.alert(
                "尚未完成本周目標與策略制定\n請在變更本周目標後再次按下 安排完畢"
            )
            window.location.href = `/dashboard/${userId}`
        }
    })
    axios({
        method: "post",
        url: "/student/readmission",
        data: {
            week: dataWeek,
        },
        withCredentials: true,
    })
        .then(response => {
            if (response.data.studentSelect == null) {
                window.alert("尚未完成本周目標與策略制定")
                window.location.href = `/dashboard/${userId}`
            }
            renderManagePage(response.data)
        })
        .then(() => {
            loadingPage(false)
            //options Click 事件
            optionsClick()
        })
}

//檢查是否完成Manage
const checkManageDetail = async Week => {
    let allCheck = false
    await axios({
        method: "post",
        url: "/student/readmanage",
        data: {
            week: Week,
        },
        withCredentials: true,
    }).then(response => {
        const checkData = response.data.studentManage
        for (let value of checkData) {
            for (let checkingIndex in value) {
                if (checkingIndex > 0) {
                    if (value[checkingIndex].length < 10) {
                        window.alert("各項策略至少需填入10個字喔")
                        return allCheck
                    }
                }
            }
        }
        allCheck = true
    })
    return allCheck
}

$(window).ready(() => {
    //取得當周所有資料
    loadingManage()

    $("#stageManageCheck").click(e => {
        const dataWeek = parseInt($(".WeekTitle").html().split(" ")[1]) - 1
        const userId = $("#userId").html()
        loadingPage(true)
        axios({
            method: "POST",
            url: "/studentstage/checkstage",
            withCredentials: true,
        }).then(async response => {
            const data = response.data[`${dataWeek}`]

            if (data.Status.Manage == true) {
                window.location.href = `/dashboard/${userId}`
            } else {
                await checkManageDetail(dataWeek + 1).then(response => {
                    console.log(response)
                    if (response) {
                        if (window.confirm("確定完成 執行階段 嗎?")) {
                            axios({
                                method: "POST",
                                url: `/studentstage/managecomplete`,
                                data: {
                                    week: $(".WeekTitle").html(),
                                },
                                withCredentials: true,
                            }).then(response => {
                                if (response.data === "upload failed") {
                                    window.alert(
                                        "更新失敗，請稍後重試或連繫管理員"
                                    )
                                    loadingPage(false)
                                }
                                window.location.href = response.data
                            })
                        }
                    }
                    loadingPage(false)
                })
            }
        })
    })
})

async function preventEditAfterWellDone() {
    let isPrevent = false
    const dataWeek = parseInt($(".WeekTitle").html().split(" ")[1]) - 1
    await axios({
        method: "POST",
        url: "/studentstage/checkstage",
        data: {
            week: dataWeek,
        },
        withCredentials: true,
    }).then(response => {
        response.data[dataWeek].Status.Response == 2 ? (isPrevent = true) : null
    })
    return isPrevent
}
