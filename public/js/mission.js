//return 分辨Option
//1. getMissionStepsSelected (Id轉文字)
//2. renderMissionDecidewhenLoading (文字轉Id)
//3. stepsSelectOption -> selectedStep (選擇策略後，Id轉文字)
function switchOptionName(Id) {
    if (Id.length > 1) {
        switch (Id) {
            case "環境結構":
                return "1"
            case '學習策略':
                return "2"
            case '時間管理':
                return "3"
            case '尋求協助':
                return "4"
            case '自我評估':
                return "5"
        }
    } else {
        switch (Id) {
            case '1':
                return "環境結構"
            case '2':
                return "學習策略"
            case '3':
                return "時間管理"
            case '4':
                return "尋求協助"
            case '5':
                return "自我評估"
        }
    }
}
//return Option 轉 SVG
function switchOptionIcon(option) {
    switch (option) {
        case "環境結構":
            return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40px" height="50px"><path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5v39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9v39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7v-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1H257c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zm48 0c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256z"/></svg>'
        case '學習策略':
            return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="40px" height="50px"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm64 64v64h64V96h64v64h64V96h64v64H320v64h64v64H320v64h64v64H320V352H256v64H192V352H128v64H64V352h64V288H64V224h64V160H64V96h64zm64 128h64V160H192v64zm0 64V224H128v64h64zm64 0H192v64h64V288zm0 0h64V224H256v64z"/></svg>'
        case '時間管理':
            return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40px" height="50px"><path d="M256 512C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>'
        case '尋求協助':
            return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="40px" height="50px"><path d="M543.9 251.4c0-1.1 .1-2.2 .1-3.4c0-48.6-39.4-88-88-88l-40 0H320l-16 0 0 0v16 72c0 22.1-17.9 40-40 40s-40-17.9-40-40V128h.4c4-36 34.5-64 71.6-64H408c2.8 0 5.6 .2 8.3 .5l40.1-40.1c21.9-21.9 57.3-21.9 79.2 0l78.1 78.1c21.9 21.9 21.9 57.3 0 79.2l-69.7 69.7zM192 128V248c0 39.8 32.2 72 72 72s72-32.2 72-72V192h80l40 0c30.9 0 56 25.1 56 56c0 27.2-19.4 49.9-45.2 55c8.2 8.6 13.2 20.2 13.2 33c0 26.5-21.5 48-48 48h-2.7c1.8 5 2.7 10.4 2.7 16c0 26.5-21.5 48-48 48H224c-.9 0-1.8 0-2.7-.1l-37.7 37.7c-21.9 21.9-57.3 21.9-79.2 0L26.3 407.6c-21.9-21.9-21.9-57.3 0-79.2L96 258.7V224c0-53 43-96 96-96z"/></svg>'
        case '自我評估':
            return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40px" height="50px"><path d="M3.5 3.75a.25.25 0 01.25-.25h13.5a.25.25 0 01.25.25v10a.75.75 0 001.5 0v-10A1.75 1.75 0 0017.25 2H3.75A1.75 1.75 0 002 3.75v16.5c0 .966.784 1.75 1.75 1.75h7a.75.75 0 000-1.5h-7a.25.25 0 01-.25-.25V3.75z"></path><path d="M6.25 7a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm-.75 4.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm16.28 4.53a.75.75 0 10-1.06-1.06l-4.97 4.97-1.97-1.97a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l5.5-5.5z"></path></svg>'
    }
}
//return Option 解釋
function switchOptionText(option) {
    switch (option) {
        case '1':
            return '<h3 style="font-weight:bolder">結構性問題</h3><p>環境結構即是你是在甚麼樣的環境下讀書並完成這件事。</p>'
        case '2':
            return '<h3 style="font-weight:bolder">中華碩能考台大博</h3><p>學習策略即是你是如何規畫你的學習方式。</p>'
        case '3':
            return '<h3 style="font-weight:bolder">時間管理大師</h3><p>時間管理即是你是如何規劃你的學習時間。</p>'
        case '4':
            return '<h3 style="font-weight:bolder">酒肉朋友</h3><p>尋求協助即是你是如何尋求朋友、老師、助教或是上網查資料等等。</p>'
        case '5':
            return '<h3 style="font-weight:bolder">贖罪審判</h3><p>自我評估即是你是對於規劃是如何評估的。</p>'
    }
}
//return Option 數量是否符合規範
function checkStatusisFinish(counting, posititon) {
    const statusCount = {}
    $(".missionStep").find('.optionBox').map((index, value) => {
        if (statusCount[value.id.split("_")[1]] == undefined) {
            statusCount[value.id.split("_")[1]] = 0
        }
        ++statusCount[value.id.split("_")[1]]
    })
    for (const [key, value] of Object.entries(statusCount)) {
        if (posititon == 'end') {
            if (value < counting) {
                return false
            }
        } else if (posititon == 'add') {
            if (value >= counting) {
                return false
            }
        }

    }
    return true
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
    return Object.values(selectedMissionObj)
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
        'display': 'flex',
        'overflow-x': 'auto'
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

        setTimeout(async (e) => {
            $(optionDelete.currentTarget).remove()
            //刪除完後上傳
            await uploadStudentDecideSteps()
        }, 500)
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
                    innerHTML: switchOptionIcon(value),
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
                }).hover((e) => {
                    stepBox.html('<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 320 512"><path d="M294.6 166.6L317.3 144 272 98.7l-22.6 22.6L160 210.7 70.6 121.4 48 98.7 2.7 144l22.6 22.6L114.7 256 25.4 345.4 2.7 368 48 413.3l22.6-22.6L160 301.3l89.4 89.4L272 413.3 317.3 368l-22.6-22.6L205.3 256l89.4-89.4z"/></svg>')
                    stepBox.css({
                        'transition-duration': '0.3s',
                        'background-color': 'rgba(255, 0, 0, 0.5)'
                    })
                }, (e) => {
                    stepBox.html(switchOptionIcon(value))
                    stepBox.css({
                        'transition-duration': '0.3s',
                        'background-color': 'rgba(255,255,255,0.4)'
                    })
                })
                stepBox.insertBefore($(`#mission_${aryIndex}`))
            }
        })
    })
    //綁定Click事件
    stepsSelectOption()
}

//上傳策略暫存
async function uploadStudentDecideSteps() {
    const week = $('.WeekTitle').html().split(" ")[1]
    loadingPage(true)


    await axios.all([uploadDecide(), uncompleteNext()])
        .then(axios.spread((acct, perms) => {
            if (!perms) {
                window.alert("網路錯誤，請重新整理")
            }
            loadingPage(false)
        }))

    function uploadDecide() {
        return axios({
            method: 'post',
            url: '/student/addmission',
            data: {
                week: week,
                studentSelect: getMissionStepsSelected(),
            },
            withCredentials: true
        }).then((response) => {
            return response.data
        })
    }

    function uncompleteNext() {
        return axios({
            method: "POST",
            url: '/studentstage/missionuncomplete',
            data: {
                week: week
            },
            withCredentials: true,
        }).then(response => {
            return response.data
        })
    }


}

//確定整體策略後 調整Manage區域
function uploadManage() {
    const week = $('.WeekTitle').html().split(" ")[1]
    loadingPage(true)

    axios({
        method: "POST",
        url: '/studentstage/missioncomplete',
        data: {
            week: $('.WeekTitle').html()
        },
        withCredentials: true,
    }).then((response) => {
        axios({
            method: 'post',
            url: '/student/addmission',
            data: {
                week: week,
                studentSelect: getMissionStepsSelected(),
                manageCheck: true
            },
            withCredentials: true
        }).then((response) => {
            if (!response.data) {
                window.alert('網路錯誤，請重新上傳')
            } else {
                window.location.href = `/dashboard/${$('#userId').html()}`
            }
        })
    })
}

//Steps Select Box function
function stepsSelectOption() {
    //取消block and Options
    function disableBlockandOptions() {
        $('.container-fluid').fadeOut(200)
        $('.container-sm').fadeOut(200)
        setTimeout(() => {
            $('.container-fluid').remove()
            $('.container-sm').remove()
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
            innerHTML: switchOptionIcon(optionsText),
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
        }).hover((e) => {
            stepBox.html('<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 320 512"><path d="M294.6 166.6L317.3 144 272 98.7l-22.6 22.6L160 210.7 70.6 121.4 48 98.7 2.7 144l22.6 22.6L114.7 256 25.4 345.4 2.7 368 48 413.3l22.6-22.6L160 301.3l89.4 89.4L272 413.3 317.3 368l-22.6-22.6L205.3 256l89.4-89.4z"/></svg>')
            stepBox.css({
                'transition-duration': '0.3s',
                'background-color': 'rgba(255, 0, 0, 0.5)'
            })
        }, (e) => {
            stepBox.html(switchOptionIcon(optionsText))
            stepBox.css({
                'transition-duration': '0.3s',
                'background-color': 'rgba(255,255,255,0.4)'
            })
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
        if (!checkStatusisFinish(7, 'add')) {
            window.alert("一項任務最多七項策略")
            return
        }
        Options(e.currentTarget.id)
    })

    //生成Options Page
    function Options(id) {
        const options = $('<div>').prop({
            className: 'container-sm',
            innerHTML: '<h1>策略選擇</h1>'
        }).css({
            'text-align': 'center',
            'padding': '20px',
            'position': 'absolute',
            'top': '30%',
            'left': '12%',
            'translate': 'transform(50%,50%)',
            'background-color': 'white',
            'z-index': '10001',
            'border-radius': '10px',
            'display': 'none'
        })

        const optionList = $('<div>').prop({
            className: 'optionsList',
        }).css({
            'height': '100px',
            'display': 'flex',
            'justify-content': 'space-around',
        }).appendTo(options)

        for (let i = 1; i <= 5; i++) {
            const optionsText = $('<div>').prop({
                className: 'optionsText',
                id: `optionsText_${i}`,
                innerHTML: switchOptionText(`${i}`)
            }).css({
                'margin-top': '15px',
                'height': '70px',
                'display': 'none',
            }).appendTo(options)

            const option = $('<div>').prop({
                className: 'options',
                id: `options_${i}`,
                innerHTML: switchOptionName(`${i}`)
            }).hover((e) => {
                optionsText.slideDown(200)
                option.html(switchOptionIcon(switchOptionName(`${i}`)))
                option.css({
                    'transition-duration': '0.3s',
                    'background-color': 'rgba(80, 186, 247, 0.431)',
                })
            }, (e) => {
                optionsText.slideUp(50)
                option.html(switchOptionName(`${i}`))
                option.css({
                    'background-color': 'rgba(23, 102, 135, 0.3)',
                })
            }).appendTo(optionList)
        }

        const block = $('<div>').prop({
            className: 'container-fluid',
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
        $('.options').mousedown(async (e) => {
            //確定選擇Option以及所屬Mission
            selectedStep(e.currentTarget.id, id)
            //上傳Steps
            await uploadStudentDecideSteps()
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

        setTimeout(async () => {
            const step = $('.stepsSelect').find('.optionBox')
            //初始化StepsBox
            stepsSelect.empty().prepend(stepsSelectTemp)
            //重新將已選step塞入各自任務內
            renderMissionDeicdewhenDragging(step, decidedMissions)
            $('.missionStep').fadeIn(300)
            //綁定click事件
            stepsSelectOption()
            //上傳Steps
            await uploadStudentDecideSteps()
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
    if(!checkStatusisFinish(2,'end')){
        window.alert("每項任務至少需安排兩項策略")
        return
    }
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