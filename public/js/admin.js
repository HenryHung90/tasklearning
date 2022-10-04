//return 等待畫面loadingPage
function loadingPage(isOpen) {
    let loadingDiv = $('.loading')
    if (isOpen) {
        loadingDiv.fadeIn(400)
    } else {
        loadingDiv.fadeOut(400)
    }
}
//logoutBtn
function logoutFunc() {
    axios({
        method: 'get',
        url: '/logout'
    }).then(response => {
        window.location.href = response.data
    })
}
//取得學生Detail
function loadingStudentDetail() {
    return (axios({
        method: 'post',
        url: '/admin/readStudentStatus',
        withCredentials: true,
    }))
}
//return ProgressBar中文
function switchIdtoName(Id) {
    let text
    switch (Id.split("_")[1]) {
        case 'Data':
            text = "教學資料"
            break
        case 'Mission':
            text = "準備階段"
            break
        case 'Manage':
            text = "執行階段"
            break
        case 'Minding':
            text = "省思階段"
            break
        case 'Response':
            text = "師生回饋"
            break
        case 'Score':
            text= ""
            break
    }
    return text
}
//return 現在是第幾周
function weekCount() {
    return 2
}
//return 最多到第幾屆
function sessionCount(){
    return 111
}
//return status count外框
function renderStatusCountDiv(status) {
    return ($('<div>').prop({
        className: status
    }).css({
        'margin': '0 auto',
        'margin-top': '20px',
        'width': '95%',
        'height': '200px',
        'display': 'flex',
        'justify-content': 'space-around'
    }))
}
//return ProgressBar外框
function renderProgressBarContainer(statusName) {
    return ($('<div>').prop({
        className: 'statusProgressDiv',
        id: statusName,
        innerHTML: `<h4>${switchIdtoName(statusName)}</h4>`
    }))
}
//return ProgressBar生成
function renderProgressBar(name, index, total, count) {
    const targetContainer = document.querySelector(name)
    const percentageBar = new ProgressBar.SemiCircle(targetContainer, {
        id: name,
        strokeWidth: 6,
        color: '#F75000',
        trailColor: '#ADADAD',
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1000,
        svgStyle: null,
        text: {
            value: '',
            alignToBottom: false
        },
        from: { color: '#4B0091' },
        to: { color: '#F75000' },
        // Set default step function for all animate calls
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
            let value = Math.round(bar.value() * 100);

            bar.setText(value + '%');

            bar.text.style.color = state.color;
        }
    });
    percentageBar.text.style.fontFamily = '"Silkscreen",cursive';
    percentageBar.text.style.fontSize = '2rem';

    if (name.split("_")[0] == '#mission') {
        //for mission 生成 因為各個任務有個自的母數
        if (count[index] == 0 && total[index] == 0) {
            percentageBar.animate(0)
        } else {
            percentageBar.animate(count[index] / total[index])
        }
    }else if (name.split("_")[0] == '#minding'){
        //自我評分僅有一項
        if (count == 0 && total == 0) {
            percentageBar.animate(0)
        }else{
            percentageBar.animate(count / total)
        }
    } else {
        //for status 生成
        percentageBar.animate(count[index] / total)
    }
}
//return 周status的Selection
function renderWeekStatusSelection(Id, target, appendTarget) {
    const weekStatusSwitch = $('<select>').prop({
        className: "form-select",
        id: Id,
        ariaLabel: "Default select example"
    }).css({
        'width': '20%',
        'margin': '0'
    }).change((e) => {
        changeWeektoRenderProgressBar(weekStatusSwitch.val())
    }).appendTo($(appendTarget))
    for (let i = 1; i <= 5; i++) {
        $('<option>').prop({
            value: i,
            innerHTML: `Week ${i}`
        }).appendTo(weekStatusSwitch)

    }
    //設定Select到本周
    weekStatusSwitch.val(weekCount())

    //選擇Week後重新生成ProgressBar
    function changeWeektoRenderProgressBar(week) {
        loadingPage(true)
        $(target).fadeOut(100)
        weekStatusSwitch.prop('disabled', 'disabled')
        setTimeout(() => {
            $(target).remove()
            weekStatusSwitch.prop('disabled', false)

            switch (Id) {
                case 'week_Status':
                    $('.weekStatus_div').append(renderWeek_StatusCompletePercentage())
                    loadingStudentDetail().then(response => {
                        weekStatusProgress(response.data.studentsStatus, week)
                        loadingPage(false)
                    })
                    break
                case 'week_MissionConut':
                    loadingStudentDetail().then(response => {
                        $('.weekMission_div').append(renderWeek_MissionCompletePercentage(response.data.studentsMission, week))
                        return response
                    }).then(response => {
                        weekMissionProgress(response.data.studentsMission, response.data.studentsMinding, week)
                        loadingPage(false)
                    })
                    break
                case 'week_mindingSelf':
                    $('.weekMindingScore_div').append(renderWeek_MindingSelfEvaluationAveraged())
                    loadingStudentDetail().then(response => {
                        weekMindingScoreProgress(response.data.studentsMinding, week)
                        loadingPage(false)
                    })
                    break
            }

        }, 300)
    }
}
////////////////////////////////////
//render 總Status完成度
function renderTotal_StatusCompletePercentage() {
    //總Status Container
    const totalStatusContainer = renderStatusCountDiv('total_StatusCompletePercentage')
    //Status
    const statusId = ['total_Data', 'total_Mission', 'total_Manage', 'total_Minding', 'total_Response']
    statusId.map((statusName) => {
        renderProgressBarContainer(statusName).appendTo(totalStatusContainer)
    })
    return totalStatusContainer
}
//render 周Status完成度框架
function renderWeek_StatusCompletePercentage() {
    //總Status Container
    const weekStatusContainer = renderStatusCountDiv('week_StatusCompletePercentage')
    //Select部分
    if ($('#week_Status').html() == undefined) {
        renderWeekStatusSelection('week_Status', '.week_StatusCompletePercentage', '#weekStatusSelect')
    }
    //Status
    const statusId = ['week_Data', 'week_Mission', 'week_Manage', 'week_Minding', 'week_Response']
    statusId.map((statusName) => {
        renderProgressBarContainer(statusName).appendTo(weekStatusContainer)
    })

    return weekStatusContainer
}
//render 周任務完成度框架
function renderWeek_MissionCompletePercentage(Mission, Week) {
    const weekMissionContainer = renderStatusCountDiv('week_MissionCompletePercentage')

    if ($('#week_MissionConut').html() == undefined) {
        renderWeekStatusSelection('week_MissionConut', '.week_MissionCompletePercentage', '#weekMissionSelect')
    }
    Mission.map((missionValue, missionIndex) => {
        if (missionValue.week == Week) {
            missionValue.mission.map((value, index) => {
                $('<div>').prop({
                    className: 'statusProgressDiv',
                    id: `mission_${index}`,
                    innerHTML: `<h5>${value.title}</h5>`
                }).appendTo(weekMissionContainer)
            })
        }
    })

    return weekMissionContainer
}
//render 周自我評價均分框架
function renderWeek_MindingSelfEvaluationAveraged() {
    //總MindingSelf Container
    const mindingSelfContainer = renderStatusCountDiv('week_MindingSelfEvaluationAveraged')
    //Select部分
    if ($('#week_mindingSelf').html() == undefined) {
        renderWeekStatusSelection('week_mindingSelf', '.week_MindingSelfEvaluationAveraged', '#weekMindingScoreSelect')
    }
    //MindingSelf
    renderProgressBarContainer('minding_Score').appendTo(mindingSelfContainer)

    return mindingSelfContainer
}
////////////////////////////////////
//TotalStatus ProgressBar
function totalStatusProgress(Status) {
    const statusId = ['#total_Data', '#total_Mission', '#total_Manage', '#total_Minding', '#total_Response']

    let studentStatusTotal = 0
    //[0]Data [1]Mission [2]Manage [3]Minding [4]Response
    let studentCompleteCount = new Array(5).fill(0)

    Status.map((studentValue, studentIndex) => {
        //總數 為所有周次*學生數量
        studentStatusTotal += studentValue.length

        studentValue.map((detailValue, detailIndex) => {
            const status = detailValue.Status

            if (status.Data == true) studentCompleteCount[0]++
            if (status.Mission == true) studentCompleteCount[1]++
            if (status.Manage == true) studentCompleteCount[2]++
            if (status.Minding == true) studentCompleteCount[3]++
            if (status.Response == '2') studentCompleteCount[4]++
        })
    })

    statusId.map((statusName, statusIndex) => {
        renderProgressBar(statusName, statusIndex, studentStatusTotal, studentCompleteCount)
    })
}
//WeekStatus ProgressBar
function weekStatusProgress(Status, Week) {
    const statusId = ['#week_Data', '#week_Mission', '#week_Manage', '#week_Minding', '#week_Response']

    let studentTotal = 0
    //[0]Data [1]Mission [2]Manage [3]Minding [4]Response
    let studentCompleteCount = new Array(5).fill(0)

    Status.map((studentValue, studentIndex) => {
        //單周總數 為 學生數量
        studentTotal++
        if (studentValue[Week - 1].Status.Data == true) studentCompleteCount[0]++
        if (studentValue[Week - 1].Status.Mission == true) studentCompleteCount[1]++
        if (studentValue[Week - 1].Status.Manage == true) studentCompleteCount[2]++
        if (studentValue[Week - 1].Status.Minding == true) studentCompleteCount[3]++
        if (studentValue[Week - 1].Status.Response == true) studentCompleteCount[4]++
    })
    statusId.map((statusName, statusIndex) => {
        renderProgressBar(statusName, statusIndex, studentTotal, studentCompleteCount)
    })
}
//WeekMission ProgressBar
function weekMissionProgress(Mission, Minding, Week) {
    //紀錄mission數量及Id
    let missionId = []
    //紀錄mission被選次數
    let missionSelectCount = []
    //紀錄最後mission完成數量
    let missionCompleteCount = []

    //建立Model
    Mission.map((missionValue, missionIndex) => {
        if (missionValue.week == Week) {
            missionValue.mission.map((value, index) => {
                missionId.push(`#mission_${index}`)
                missionSelectCount.push(0)
                missionCompleteCount.push(0)
            })
        }
    })
    //計算數量
    Minding.map((mindingValue, mindingIndex) => {
        if (mindingValue.week == Week) {
            //原studentMinding為Object 轉 Array
            const targetValue = Object.values(mindingValue.studentMinding)
            targetValue.map((value, index) => {
                missionSelectCount[parseInt(value.missionName)]++
                if (value.missionComplete == true) {
                    missionCompleteCount[parseInt(value.missionName)]++
                }
            })
        }
    })
    missionId.map((missionName, missionIndex) => {
        renderProgressBar(missionName, missionIndex, missionSelectCount, missionCompleteCount)
    })


}
//WeekMindingScore ProgressBar
function weekMindingScoreProgress(Minding,Week) {
    let mindingTotal = 0
    let studentMindingTotal = 0
    Minding.map((mindingValue,mindingIndex)=>{
        if(mindingValue.week == Week){
            mindingTotal += 5
            if(mindingValue.studentRanking !== undefined){
                studentMindingTotal += parseInt(mindingValue.studentRanking)
            }
        }
    })
    renderProgressBar('#minding_Score',0,mindingTotal,studentMindingTotal)
}
////////////////////////////////////
//render AdminMainPage main function
function renderAdminMainPage(studentData) {
    //總Status完成度
    $('.totalStatus_div').append(renderTotal_StatusCompletePercentage())
    //周Status完成度
    $('.weekStatus_div').append(renderWeek_StatusCompletePercentage())
    //周任務完成度
    $('.weekMission_div').append(renderWeek_MissionCompletePercentage(studentData.studentsMission, weekCount()))
    //周自我評價均分
    $('.weekMindingScore_div').append(renderWeek_MindingSelfEvaluationAveraged())
}
//loading AdminMainPage main function
function loadingAdminPage() {
    loadingStudentDetail()
        .then(response => {
            renderAdminMainPage(response.data)
            return response.data
        }).then(response => {
            const nowWeek = weekCount()

            totalStatusProgress(response.studentsStatus)
            weekStatusProgress(response.studentsStatus, nowWeek)
            weekMissionProgress(response.studentsMission, response.studentsMinding, nowWeek)
            weekMindingScoreProgress(response.studentsMinding, nowWeek)

            loadingPage(false)
        })
}
$(window).ready((e) => {
    loadingAdminPage()

})
$(`#logoutBtn`).click(() => {
    logoutFunc()
})
$(`#Home`).click((e)=>{
    location.reload()
})