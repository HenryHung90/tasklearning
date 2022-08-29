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
function loadingStudentDetail(){
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
            text = "目標制定"
            break
        case 'Manage':
            text = "任務管理"
            break
        case 'Minding':
            text = "自我省思"
            break
        case 'Response':
            text = "師生回饋"
            break
    }
    return text
}
//return 現在是第幾周
function weekCount() {
    return 2
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
function renderProgressBar(statusName, statusIndex, total, count) {
    const targetContainer = document.querySelector(statusName)
    const percentageBar = new ProgressBar.SemiCircle(targetContainer, {
        id:statusName,
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

    percentageBar.animate(count[statusIndex] / total)
}
//return 周status的Selection
function renderWeekStatusSelection() {
    const weekStatusSwitch = $('<select>').prop({
        className: "form-select",
        ariaLabel: "Default select example"
    }).css({
        'width': '20%',
        'margin': '0'
    }).change((e) => {
        changeWeektoRenderProgressBar(weekStatusSwitch.val())
    }).appendTo($('.weekSelect'))
    for (let i = 1; i <= 5; i++) {
            $('<option>').prop({
                value: i,
                innerHTML: `Week ${i}`
            }).appendTo(weekStatusSwitch)

    }
    //設定Select到本周
    weekStatusSwitch.val(weekCount())

    //選擇Week後重新生成ProgressBar
    function changeWeektoRenderProgressBar(week){
        loadingPage(true)
        $('.week_StatusCompletePercentage').fadeOut(100)
        weekStatusSwitch.prop('disabled', 'disabled')

        setTimeout(() => {
            $('.week_StatusCompletePercentage').remove()
            weekStatusSwitch.prop('disabled', false)
            $('.weekStatus_div').append(renderWeek_StatusCompletePercentage())
            loadingStudentDetail().then(response=>{
                weekStatusProgress(response.data.studentsStatus,week)
                loadingPage(false)
            })
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
//render 周Status完成度
function renderWeek_StatusCompletePercentage() {
    //總Status Container
    const weekStatusContainer = renderStatusCountDiv('week_StatusCompletePercentage')
    //Select部分
    if($('.form-select').html() == undefined){
        renderWeekStatusSelection()
    }
    //Status
    const statusId = ['week_Data', 'week_Mission', 'week_Manage', 'week_Minding', 'week_Response']
    statusId.map((statusName) => {
        renderProgressBarContainer(statusName).appendTo(weekStatusContainer)
    })

    return weekStatusContainer
}
//render 周任務完成度
function renderWeek_MissionCompletePercentage() {

}
//render 周自我評價均分
function renderWeek_MindingSelfEvaluationAveraged() {

}
//render Response
function renderResponse() {

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
function weekMissionProgress(Minding) {

}
//WeekMindingScore ProgressBar
function weekMindingScoreProgress(Minding) {

}
////////////////////////////////////
//render AdminMainPage main function
function renderAdminMainPage(studentData) {
    console.log(studentData)
    //總Status完成度
    $('.totalStatus_div').append(renderTotal_StatusCompletePercentage())
    //周Status完成度
    $('.weekStatus_div').append(renderWeek_StatusCompletePercentage())
    //周任務完成度
    //totalStatus.append(renderWeek_MissionCompletePercentage())
    //周自我評價均分
    //totalStatus.append(renderWeek_MindingSelfEvaluationAveraged())
    //Response
    //totalStatus.append(renderResponse())
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
        weekMissionProgress(response.studentsMinding, nowWeek)
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