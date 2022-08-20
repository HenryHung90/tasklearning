//return 等待畫面loadingPage
function loadingPage(isOpen) {
    let loadingDiv = $('.loading')
    if (isOpen) {
        loadingDiv.fadeIn(400)
    } else {
        loadingDiv.fadeOut(400)
    }
}
//return 換好名稱的studentSelect
function switchMissionName(switchData) {
    const switchStudentSelect = Object.values(switchData.studentSelect)
    switchStudentSelect.map((value, index) => {
        switchStudentSelect[index][0] = switchData.mission[value[0]].title
    })

    return switchStudentSelect
}
//return 從資料庫抓下的計畫內容
function loadingManageDetailFromData(mission){
    const dataWeek = $('.WeekTitle').html().split(" ")
    const userId = $('#userId').html()

    const missionId = mission[1]
    const missionStep = mission[3]
    axios({
        method: 'post',
        url:'/student/readmanage',
        data:{
            week: dataWeek,
            studentId: userId
        }
    }).then((response)=>{

    })

}

//render 左側計畫選項欄
function renderManageSchedule(manageData) {
    let manageScheduleDiv = $('<div>').prop({
        className: 'missionSchedule',
    }).css({
        'width': '100%',
        'height': '90%',
        'padding': '10px',
        'overflow-y': 'auto',
    })
    function renderMissionData(data, index) {
        let returnData = ""
        for (let i = 1; i < data.length; i++) {
            returnData += `<div class="options" id="targetMission_${index}_option_${i}">${i}、${data[i]}</div>`
        }
        return returnData
    }

    manageData.map((manageValue, manageIndex) => {
        const missionTitle = $('<h4>').prop({
            className: 'missionBox_Title',
            id: `targetMission_${manageIndex}`,
            innerHTML: manageValue[0]
        })
        const missionData = $('<div>').prop({
            className: 'missionBox_Data',
            innerHTML: renderMissionData(manageValue, manageIndex)
        }).css({
            'display': 'flex',
            'justify-content': 'space-around',
        })

        let missionDiv = $('<div>').prop({
            className: `mission_${manageIndex}`
        }).css({
            'width': '90%',
            'background-color': 'rgba(255,2555,255,0.5)',
            'border-radius': '10px',
            'padding': '10px',
            'margin': '10px',
        }).append(missionTitle).append(missionData)

        manageScheduleDiv.append(missionDiv)
    })

    return manageScheduleDiv
}
//render 右側寫入執行計畫欄
function renderManageDecide(currentStepId, currentStepTitle) {
    const missionName = $(`#targetMission_${currentStepId.split('_')[1]}`).html()

    //標頭
    const missionDecideTitle = $('<h3>').prop({
        className:'manageDecideTitle',
        innerHTML:missionName + "<br>" + currentStepTitle
    }).css({
        'margin':'10px 0 30px 0'
    })

    //內文輸入區
    const missionDecideContent = $('<textarea>').prop({
        className:'manageDecideContent',
        placeholder: '寫下你的學習計畫內容'
    }).css({
        'width':'100%',
        'height':'70%',
        'padding':'15px',
        'border':'1px dashed rgba(0,0,0,0.3)',
        'border-radius':'20px',
        'transition-duration':'0.5s'
    }).hover((e)=>{
        missionDecideContent.css({
            'transition-duration': '0.5s',
            'border': '1.5px dashed rgba(0,0,0)'
        })
    },(e)=>{
        missionDecideContent.css({
            'border': '1px dashed rgba(0,0,0,0.3)'
        })
    })

    //儲存該項安排
    const missionDecideSubmit = $('<div>').prop({
        className:'manageDecideSubmit',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg"  width="25px" height="25px" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/></svg>' +
                   '確認該項安排'
    }).css({
        'user-select':'none',
        'margin':'0 auto',
        'margin-top':'15px',
        'width':'150px',
        'height':'50px',
        'line-height':'50px',
        'border-radius':'10px',
        'transition-duration': '0.3s',
        'background-color':'#0dcaf0'
    }).hover((e)=>{
        missionDecideSubmit.css({
            'transition-duration': '0.3s',
            'background-color': 'rgb(33, 222, 260)'
        })
    },(e)=>{
        missionDecideSubmit.css({
            'background-color': '#0dcaf0'
        })
    })

    const manageDecideDiv = $('<div>').prop({
        className: 'manageDecide',
    }).css({
        'width': '100%',
        'height': '100%',
        'padding': '10px',
        'background-color': 'rgba(255,255,255,0.5)',
        'border-radius': '20px',
    }).append(missionDecideTitle).append(missionDecideContent).append(missionDecideSubmit)

    return manageDecideDiv
}

//render manage main function
function renderManagePage(data) {
    const studentSelect = switchMissionName(data)

    const manageScheduleDiv = $('.manageComponents')

    manageScheduleDiv.append(renderManageSchedule(studentSelect))
}
//點擊option後生成安排區域
function optionsClick() {
    const options = $('.options')
    options.click((e) => {
        const targetId = e.currentTarget.id
        const targetTitle = e.currentTarget.innerHTML
        const targetContent = loadingManageDetailFromData(targetId.split("_"))
        //option highlighting select
        $('.options').css({'background-color': 'rgb(200,200,200)'})
        $(`#${targetId}`).css({'background-color': 'rgba(255, 0, 0, 0.5)'})

        //任務安排區域
        const manageDecide = $('.manageUserDecide')
        manageDecide.fadeOut(100)
        setTimeout((e)=>{
            manageDecide.empty()
            manageDecide.append(renderManageDecide(targetId, targetTitle, targetContent))
            manageDecide.fadeIn(300)
        },300)
        
    })
}
//loading Manage main function
function loadingManage() {
    loadingPage(true)
    const dataWeek = $('.WeekTitle').html().split(" ")
    const userId = $('#userId').html()

    //讀取已選任務
    axios({
        method: 'post',
        url: '/student/readmission',
        data: {
            week: dataWeek,
            studentId: userId,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.studentSelect == null) {
            window.alert("尚未完成本周目標與策略制定")
            window.location.href = `/dashboard/${userId}`
        }
        renderManagePage(response.data)
    }).then(() => {
        loadingPage(false)
        //options Click 事件
        optionsClick()
    })

}


$(window).ready(() => {
    //取得當周所有資料
    loadingManage()
})