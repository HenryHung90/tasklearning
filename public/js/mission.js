//return 分辨Option
//1. getMissionStepsSelected (Id轉文字)
//2. renderMissionDecidewhenLoading (文字轉Id)
//3. stepsSelectOption -> selectedStep (選擇策略後，Id轉文字)
function switchOptionName(Id) {
    if (Id.length > 1) {
        switch (Id) {
            case "處理程序":
                return "1"
            case '尋求協助':
                return "2"
            case '環境結構':
                return "3"
            case '作筆記':
                return "4"
            case '問題紀錄':
                return "5"
            case '監控過程':
                return "6"
        }
    } else {
        switch (Id) {
            case '1':
                return "處理程序"
            case '2':
                return "尋求協助"
            case '3':
                return "環境結構"
            case '4':
                return "作筆記"
            case '5':
                return "問題紀錄"
            case '6':
                return "監控過程"
        }
    }
}
//return 執行策略
//1. uploadStudentDecideSteps (上傳策略使用)
function getMissionStepsSelected() {
    const selectedMission = $('.dragMissionDecide').find('.missionText')
    const selectedSteps = $('.stepsSelect').find('.optionBox')

    let selectedMissionObj = {}

    selectedMission.map((index, val) => {
        //missionId[1] = missionId
        const missionId = val.id.split("_")[1]
        selectedMissionObj[missionId] = [missionId]
    })
    selectedSteps.map((index, val) => {
        //stepsId[1] = missionId
        //stepsId[3] = stepsId
        const missionId = val.id.split("_")[1]
        const stepsName = switchOptionName(val.id.split("_")[3])

        selectedMissionObj[missionId].push(stepsName)
    })
    return selectedMissionObj
}

//return Steps進度條
//1. renderMissionDecidewhenLoading (進入頁面時使用)
//2. dragMission -> renderMissionDecideSteps (拖動任務後使用)
function stepsSelectBox(missionId) {
    let SelectTemp = $('<div>')
    const standardSelect = $('<div>').prop({
        className: 'standardSelect',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg"  width="50px" height="80px" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"/></svg>',
        id: `mission_${missionId}`
    }).css({
        'transition-duration': '0.3s',
        'width': '80px',
        'height': '80px',
        'border-radius': '20px',
        'margin-top': '10px',
        'margin-left': '10px',
        'background-color': 'rgba(255,255,255,0.4)'
    })
    SelectTemp.append(standardSelect)
    const stepsSelectDiv = $('<div>').prop({
        className: 'missionStep',
        innerHTML: SelectTemp.html(),
    }).css({
        'width': '100%',
        'margin-top': '15px',
        'height': '100px',
        'background-color': 'rgba(255,255,255,0.3)',
        'border-radius': '0 40px 40px 0',
        'display': 'flex'
    })

    return stepsSelectDiv
}

//綁定optionBox 刪除click事件
//1. dragMission-> renderMissionDecideSteps (拖動後重新綁定)
//2. stepsSelectOption -> selectedStep      (選擇新策略後綁定)
//3. rendeMissionPage                       (進入頁面時綁定)
function deleteSelectOption() {
    $('.optionBox').click((optionDelete) => {
        $(optionDelete.currentTarget).animate({
            opacity: 0
        }, 300)

        setTimeout((e) => {
            $(optionDelete.currentTarget).remove()
            //刪除完後上傳
            uploadStudentDecideSteps()
        }, 800)
    })
}

//Click 確認是否已經完成過
async function stageBtnEnterForMission() {
    const dataWeek = parseInt($('.WeekTitle').html().split(" ")[1]) - 1

    let isDone = false
    await axios({
        method: "POST",
        url: '/studentstage/checkstage',
        data: {
            week: dataWeek
        },
        withCredentials: true,
    }).then((response) => {
        isDone = response.data[dataWeek].Status.Mission
    })
    return isDone
}

//本周目標
function renderThisWeekMission(mission) {
    let missionDiv = $('<div>').prop({
        className: 'dragMission',
        id: 'dragContainer'
    }).css({
        'height': '100%',
    })

    mission.map((val, index) => {
        const missionText = $('<div>').prop({
            className: 'missionText',
            innerHTML: `<div style="margin-left:20px;width:80%"><h3>${val.title}</h3><p>${val.content}</p></div>`,
            id: `targetMission_${index}`
        }).attr({
            'draggable': 'true',
        }).css({
            'display': 'flex',
            'text-align': 'left',
            'margin-top': '15px',
            'padding': '10px',
            'padding-bottom': '0',
            'background-color': 'rgba(255,255,255,0.5)',
            'cursor': 'move',
            'user-select': 'none',
        }).hover((e) => {
            missionText.css({
                'background-color': 'rgb(200,200,200)',
                'transition-duration': '0.3s'
            })
        }, (e) => {
            missionText.css({
                'background-color': 'rgba(255,255,255,0.5)',
                'transition-duration': '0.3s'
            })
        })

        missionDiv.append(missionText)
    })

    return missionDiv
}

//本周已選項目(Loading後載入)
function renderMissionDecidewhenLoading(studentSelect) {
    //標記任務拖曳區 + 策略區
    const dragMissionDecide = $('.dragMissionDecide')
    const stepsSelect = $('.stepsSelect')

    //依序放入資訊
    Object.values(studentSelect).map((aryValue, aryIndex) => {
        aryValue.map((value, index) => {
            //index 0 => 第幾項任務
            //index > 0 => 任務策略
            if (index === 0) {
                // 暫存 mission的格式
                const missionSelect = $(`#targetMission_${value}`)
                //刪除在本周目標欄的目標
                missionSelect.remove()

                //塞入策略區空格
                stepsSelect.append(stepsSelectBox(aryIndex))
                //塞入本周目標到任務欄
                dragMissionDecide.append(missionSelect)
            }
            if (index >= 1) {
                //塞入Steps
                const optionId = switchOptionName(value)
                const stepBox = $('<div>').prop({
                    className: 'optionBox',
                    innerHTML: value,
                    id: `targetMission_${aryValue[0]}_options_${optionId}`
                }).css({
                    'transition-duration': '0.3s',
                    'width': '80px',
                    'height': '80px',
                    'border-radius': '20px',
                    'margin-top': '10px',
                    'margin-left': '10px',
                    'background-color': 'rgba(255,255,255,0.4)',
                    'padding-top': '15px',
                    'font-size': '15px',
                    'user-select': 'none'
                })
                stepBox.insertBefore($(`#mission_${aryIndex}`))
            }
        })
    })
    //綁定Click事件
    stepsSelectOption()
}

//上傳策略暫存
function uploadStudentDecideSteps() {
    const userId = $('#userId').html()
    const week = $('.WeekTitle').html().split(" ")[1]
    loadingPage(true)

    axios({
        method: "POST",
        url: '/studentstage/missionuncomplete',
        data: {
            week: week
        },
        withCredentials: true,
    }).then(response =>{
        if(response.data == false){
            window.alert('網路錯誤，請重新整理')
        }
    })
    axios({
        method: 'post',
        url: '/student/addmission',
        data: {
            studentId: userId,
            week: week,
            studentSelect: getMissionStepsSelected(),
        },
        withCredentials: true
    }).then((response) => {
        if (!response.data) {
            window.alert('網路錯誤，請重新整理')
        } else if (response.data === 'data error') {
            window.alert('資料錯誤，請重新整理')
        } else {
            loadingPage(false)
        }
    })
}
//確定整體策略後 調整Manage區域
function uploadManage() {
    const userId = $('#userId').html()
    const week = $('.WeekTitle').html().split(" ")[1]
    loadingPage(true)

    axios({
        method: "POST",
        url: '/studentstage/missioncomplete',
        data: {
            studentId: userId,
            week: $('.WeekTitle').html()
        },
        withCredentials: true,
    }).then((response) => {
        axios({
            method: 'post',
            url: '/student/addmission',
            data: {
                studentId: userId,
                week: week,
                studentSelect: getMissionStepsSelected(),
                manageCheck: true
            },
            withCredentials: true
        }).then((response) => {
            if (!response.data) {
                window.alert('網路錯誤，請重新上傳')
            } else {
                window.location.href = `/dashboard/${userId}`
            }
        })
    })
}

//Steps Select Box function
function stepsSelectOption() {
    //取消block and Options
    function disableBlockandOptions() {
        $('.missionBlock').fadeOut(200)
        $('.missionOptions').fadeOut(200)
        setTimeout(() => {
            $('.missionBlock').remove()
            $('.missionOptions').remove()
        }, 500)
    }
    //return Option選擇並生成磚塊
    function selectedStep(option, missionId) {
        //option => 選擇之策略
        //missionId => 選擇策略之任務
        const optionsId = option.split("_")[1]
        //經過switch成中文
        const optionsText = switchOptionName(optionsId)
        //標記已選任務
        const missionPostion = $('.dragMissionDecide').find('.missionText')

        //找到Option所屬Mission位置並打上Id
        const newMissionId = missionPostion[missionId.split("_")[1]].id

        const stepBox = $('<div>').prop({
            className: 'optionBox',
            innerHTML: `${optionsText}`,
            id: newMissionId + "_" + option
        }).css({
            'transition-duration': '0.3s',
            'width': '80px',
            'height': '80px',
            'border-radius': '20px',
            'margin-top': '10px',
            'margin-left': '10px',
            'background-color': 'rgba(255,255,255,0.4)',
            'padding-top': '15px',
            'font-size': '15px',
            'user-select': 'none'
        })

        //從加號前生成
        stepBox.insertBefore($(`#${missionId}`))
        //關閉Option Page
        disableBlockandOptions()
        //設定刪除執行策略click事件
        deleteSelectOption()
    }
    $('.standardSelect').click((e) => {
        e.stopPropagation()
        // console.log(e.currentTarget.id)
        Options(e.currentTarget.id)
    })

    //生成Options Page
    function Options(id) {
        const options = $('<div>').prop({
            className: 'missionOptions',
            innerHTML: '<div>' +
                '<h1>策略選擇</h1>' +
                '<div style="height:70%;display:flex;padding-left:5%;">' +
                '<div class="options" id="options_1">處理程序</div>' +
                '<div class="options" id="options_2">尋求協助</div>' +
                '<div class="options" id="options_3">環境結構</div>' +
                '<div class="options" id="options_4">作筆記</div>' +
                '<div class="options" id="options_5">問題紀錄</div>' +
                '<div class="options" id="options_6">監控過程</div>' +
                '</div>' +
                '</div>'
        }).css({
            'text-align': 'center',
            'width': '50vw',
            'height': '30vh',
            'position': 'absolute',
            'left': '20%',
            'top': '30%',
            'background-color': 'white',
            'z-index': '10001',
            'border-radius': '10px',
            'display': 'none'
        })
        const block = $('<div>').prop({
            className: 'missionBlock',
            innerHTML: ''
        }).css({
            'width': '100vw',
            'height': '100vh',
            'position': 'absolute',
            'background-color': 'rgba(0,0,0,0.3)',
            'z-index': '10000',
            'display': 'none'
        }).click((e) => {
            e.stopPropagation()
            disableBlockandOptions()
        })

        $('body').prepend(block).prepend(options)

        $(block).fadeIn(300)
        $(options).fadeIn(300)
        //建立Option 點擊偵測
        $('.options').mousedown((e) => {
            //確定選擇Option以及所屬Mission
            selectedStep(e.target.id, id)
            //上傳Steps
            uploadStudentDecideSteps()
        })
    }
}

//dragMission main function
function dragMission() {
    const dragMissionDiv = document.querySelectorAll('.missionText')
    const dragContainer = document.querySelectorAll('#dragContainer')


    dragMissionDiv.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.stopPropagation()
            draggable.classList.add('dragging')
        })
        draggable.addEventListener('dragend', (e) => {
            e.stopPropagation()
            draggable.classList.remove('dragging')
            renderMissionDecideSteps()
        })
    })
    //drag container arrangement
    function getDragAfterElement(container, y) {
        const draggableDiv = [...container.querySelectorAll('.missionText:not(.dragging)')]

        return draggableDiv.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            } else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    }
    dragContainer.forEach(container => {
        container.addEventListener('dragover', (e) => {
            e.preventDefault()
            const afterElement = getDragAfterElement(container, e.clientY)
            const draggable = document.querySelector('.dragging')
            if (afterElement == null) {
                container.appendChild(draggable)
            } else {
                container.insertBefore(draggable, afterElement)
            }
        })

    })

    //本周已選項目(拉動任務欄後)
    function renderMissionDeicdewhenDragging(currentStepOptions, currentMissions) {
        currentMissions.map((missionIndex, mission) => {
            currentStepOptions.map((stepIndex, step) => {
                if (mission.id.split("_")[1] === step.id.split("_")[1]) {
                    $(step).insertBefore($(`#mission_${missionIndex}`))
                }
            })
        })
    }
    //將執行目標與策略
    function renderMissionDecideSteps() {
        //查閱有幾項任務進入任務
        const decidedMissions = $('.dragMissionDecide').find('.missionText')
        //標記要塞入Step的class
        const stepsSelect = $('.stepsSelect')

        //Step 外框
        let stepsSelectTemp = ""
        //依照內容數量增加進度條
        for (let i = 0; i < decidedMissions.length; i++) {
            let DivTemp = $(`<div>`).append(stepsSelectBox(i))
            stepsSelectTemp += DivTemp.html()
            //清空Select暫存 避免重複生成Add icon
            SelectTemp = $('<div>')
        }

        $('.missionStep').fadeOut(100)

        setTimeout(() => {
            const step = $('.stepsSelect').find('.optionBox')
            //初始化StepsBox
            stepsSelect.empty().prepend(stepsSelectTemp)
            //重新將已選step塞入各自任務內
            renderMissionDeicdewhenDragging(step, decidedMissions)
            $('.missionStep').fadeIn(300)
            //綁定click事件
            stepsSelectOption()
            //上傳Steps
            uploadStudentDecideSteps()
            //設定刪除執行策略click事件
            deleteSelectOption()
        }, 300)
    }
}

//render Mission main function
function renderMissionPage(data) {
    const thisWeekMission = $('.missionThisWeekContainer')

    thisWeekMission.append(renderThisWeekMission(data.mission))
    data.studentSelect ? renderMissionDecidewhenLoading(data.studentSelect) : null

    //設定刪除執行策略click事件
    deleteSelectOption()
}

//loading mission function
function loadingMission() {
    loadingPage(true)
    const dataWeek = $('.WeekTitle').html().split(" ")
    const userId = $('#userId').html()

    axios({
        method: 'post',
        url: '/student/readmission',
        data: {
            week: dataWeek,
            studentId: userId
        },
        withCredentials: true
    }).then((response) => {
        if (response.data === "no found") {
            window.alert("尚未新增該周資訊!")
            window.location.href = `/dashboard/${userId}`
        }
        renderMissionPage(response.data)
    }).then(() => {
        loadingPage(false)
        dragMission()
    })
}

$(window).ready(() => {
    //取得當周所有資料
    loadingMission()
    //若當周有資料 要預先載入執行步驟
    stepsSelectOption()
})

$("#stageMissionCheck").click(async (e) => {
    await stageBtnEnterForMission().then(response => {
        if (response == false) {
            if (window.confirm("確定完成 設定目標 進度嗎?")) {
                uploadManage()
            }
        } else {
            uploadManage()
        }
    })
})