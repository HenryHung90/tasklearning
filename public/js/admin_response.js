//axios function--------------------------------
//取得該學生當週學習狀態
function getStudentStatusDetail(studentId, week) {
    return (axios({
        method: 'post',
        url: '/admin/readstudentstatusdetail',
        data: {
            studentId: studentId,
            week: week
        },
        withCredentials: true
    }))
}
//return function-------------------------------
function isDoneThisWeek(studentCheck) {
    return studentCheck.Status.Minding
}
//render function-------------------------------
//render 學生學習狀況
function renderStudentStatus(studentId, week) {
    getStudentStatusDetail(studentId, week).then(response => {
        console.log(response.data)
        const studentStatusContainer = $('<div>').prop({
            className: 'container'
        }).css({
            'position': 'absolute',
            'height': '80vh',
            'left': '15vw',
            'top': '10vh',
            'z-index': '9999',
            'background-color': 'white',
            'border-color': 'black',
            'border': '5px solid black',
            'border-radius': '20px',
            'display': 'none',
            'text-align': 'center',
            'overflow-y': 'auto',
        })

        //標頭
        $('<div>').prop({
            className: `studentStatus_${studentId}`,
            innerHTML: `<h2>Student File</h2><h5>${studentId}</h5>`
        }).css({
            'background-color': 'rgba(255,200,200,0.5)',
            'height': '130px',
            'font-family': "Silkscreen, cursive",
            'padding-top': '30px',
        }).appendTo(studentStatusContainer)
        //大標題
        $('<div>').prop({
            className:'missionTitle',
            innerHTML:'<h1>任務執行狀況</h1>'
        }).css({
            'margin-top':'10px',
        }).appendTo(studentStatusContainer)
        //任務Row外框
        const studentMissionRow = $('<div>').prop({
            className: 'row justify-content-center'
        }).css({
            'display': 'flex',
        }).appendTo(studentStatusContainer)
        //框架css
        const lessThenFour = {
            'padding': '10px 30px',
            'margin': '10px',
            'border-radius': '10px',
            'background-color': 'rgba(245,245,79,0.5)',
            'width': '500px'
        }
        const moreThenFour = {
            'padding': '10px 25px',
            'margin': '10px',
            'border-radius': '10px',
            'background-color': 'rgba(245,245,79,0.5)',
            'width': '280px'
        }
        response.data.missionContent.map((studentMission, missionIndex) => {
            //任務外框
            const missionDiv = $('<div>').prop({
                className: 'missionDiv',
                id: `mission_${missionIndex}`
            }).css(response.data.missionName.length >= 4 ? moreThenFour : lessThenFour).appendTo(studentMissionRow)
            //任務名稱
            $('<h3>').prop({
                className: `missionTitle_${missionIndex}`,
                innerHTML:`${response.data.missionName[studentMission[0]]}`
            }).css({
                'border-bottom': '1px solid black',
                'padding':'30px 0',
                'font-weight': 'bolder',
            }).appendTo(missionDiv)

            response.data.missionName[studentMission[0]] = ''
            //任務內容 (包含任務步驟 執行內容)
            const missionText = $('<div>').prop({
                className: `missionText_${missionIndex}`,
            }).css({
                'margin-top': '20px'
            }).appendTo(missionDiv)
            studentMission.map((contentValue, contentIndex) => {
                //index 0 為辯識 mission 的 Id
                if (contentIndex > 0) {
                    //missionStep 外框
                    const missionStep = $('<div>').prop({
                        className: `missionStep_${contentIndex}`,
                        innerHTML: `<h5><strong>${contentIndex}、${contentValue}</strong></h5>`
                    }).css({
                        'margin': '20px 0'
                    }).appendTo(missionText)
                    //mission執行內容˙
                    $('<span>').prop({
                        className: `missionCotent_${contentIndex}`,
                        innerHTML: response.data.manageContent[missionIndex][contentIndex]
                    }).appendTo(missionStep)
                    if (contentIndex < studentMission.length -1) {
                        $('<div>').prop({
                            className: 'arrowDown',
                            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>'
                        }).css({
                            'margin-top':'10px',
                        }).appendTo(missionStep)

                    }
                }
            })
        })
        //補上未選擇任務
        response.data.missionName.map((missionName) => {
            if (missionName != '') {
                //任務外框
                const missionDiv = $('<div>').prop({
                    className: 'missionDiv',
                    id: `mission_noSelect`
                }).css(response.data.missionName.length >= 4 ? moreThenFour : lessThenFour).appendTo(studentMissionRow)
                //任務名稱
                $('<h3>').prop({
                    className: `missionTitle_noSelect`,
                    innerHTML: missionName,
                }).css({
                    'border-bottom': '1px solid black',
                    'padding': '30px 0',
                    'font-weight': 'bolder',
                }).appendTo(missionDiv)
                $('<h4>').prop({
                    className: 'missionText_noSelect',
                    innerHTML: "<strong>未選擇該任務</strong>"
                }).appendTo(missionDiv)
            }
        })



        const studentStatusBlock = $('<div>').prop({
            className: 'container-fluid'
        }).css({
            'position': 'absolute',
            'background-color': 'rgba(0,0,0,0.5)',
            'overflow': 'hidden',
            'z-index': '9998',
            'display': 'none',
            'width': '100vw',
            'height': '100vh'
        }).click((e) => {
            studentStatusBlock.fadeOut(200)
            studentStatusContainer.fadeOut(200)
            setTimeout((e) => {
                studentStatusBlock.remove()
                studentStatusContainer.remove()
            }, 200)
        })


        //動畫顯現
        $('body').prepend(studentStatusBlock).prepend(studentStatusContainer)
        studentStatusBlock.fadeIn(200)
        studentStatusContainer.fadeIn(200)
        loadingPage(false)
    })
}
//變換月份
function weekSwitchClickBtn(week, studentData) {
    $('.weekSwitchBtn').removeClass('Selecting')
    $(`#week_${week}`).addClass('Selecting')
    $('.studentListDiv').fadeOut(200)
    setTimeout(() => {
        $('.studentListDiv').remove()
        $('.adminContainer').append(renderResponseStudentList(studentData, week))
        loadingPage(false)
    }, 200)
}

//render 上方搜尋列表
function renderResponseSearch(studentData) {
    const responseBarContainer = $('<div>').prop({
        className: 'btnContainer'
    }).css({
        'margin-top': '50px',
        'width': '100%',
        'height': '50px',
        'display': 'flex',
        'justify-content': 'space-around',
    })

    for (let i = 1; i <= 5; i++) {
        const weekSwitchBtn = $('<div>').prop({
            className: 'weekSwitchBtn',
            id: `week_${i}`,
            innerHTML: `<h1>Week ${i}</h1>`
        }).css({
            'width': '15%',
            'height': '50px',
            'line-height': '50px',
            'text-align': 'center',
            'background-color': '#6c757d',
            'border-radius': '20px',
            'transition-duration': '0.2s',
            'color': 'white',
            'user-select': 'none'
        }).hover((e) => {
            weekSwitchBtn.css({
                'transition-duration': '0.2s',
                'background-color': 'purple',
            })
        }, (e) => {
            weekSwitchBtn.css({
                'transition-duration': '0.2s',
                'background-color': '#6c757d',
            })
        }).click((e) => {
            loadingPage(true)
            weekSwitchClickBtn(i, studentData)
        }).appendTo(responseBarContainer)
        if (i == weekCount()) {
            weekSwitchBtn.addClass('Selecting')
        }
    }

    //Btn 外框
    const responseSearchDiv = $('<div>').prop({
        className: 'responseSearchDiv',
        innerHTML: '<h1>Student Feedback</h1>'
    }).css({
        'background-color': 'rgba(255, 255, 255, 0.5)',
        'width': '95vw',
        'height': '160px',
        'text-align': 'center',
        'margin': '0 auto'
    }).append(responseBarContainer)

    return responseSearchDiv
}
//render 下方學生列表
function renderResponseStudentList(studentDetail, Week) {
    //學生資料外框
    const studentListDiv = $('<div>').prop({
        className: 'studentListDiv',
    }).css({
        'width': '100vw',
        'margin': '0 auto',
        'margin-top': '30px',
    })

    let noOneDownYet = true
    studentDetail.map((studentData, studentIndex) => {
        if (isDoneThisWeek(studentData.studentDetail[Week - 1])) {
            noOneDownYet = false
            //學生序號
            const studentNumber = $('<div>').prop({
                className: 'studentData_Number',
                id: `studentNumber_${studentIndex}`,
                innerHTML: `S-${studentIndex}`
            })
            //學生ID
            const studentId = $('<div>').prop({
                className: 'studentData_Id',
                id: `studentId_${studentIndex}`,
                innerHTML: studentData.studentId
            })
            //學生姓名
            const studentName = $('<div>').prop({
                className: 'studentData_Name',
                id: `studentName_${studentIndex}`,
                innerHTML: studentData.studentName
            })

            //設定狀態
            const studentDetail = $('<button>').prop({
                className: 'btn btn-outline-primary',
                id: 'checkStudentStatus',
                innerHTML: '學習狀況'
            }).css({
                'width': '30%',
                'height': '40px',
            }).click((e) => {
                loadingPage(true)
                renderStudentStatus(studentData.studentId, Week)
            })
            const teacherResponse = $('<button>').prop({
                className: 'btn btn-outline-success',
                id: 'teacherResponse',
                innerHTML: '給予回饋'
            }).css({
                'width': '30%',
                'height': '40px',
            })
            const studentResponse = $('<button>').prop({
                className: 'btn btn-outline-success',
                id: 'studentResponse',
                innerHTML: '查看學生回覆'
            }).css({
                'width': '35%',
                'height': '40px',
            })

            //設定學生//
            const studentSetting = $('<div>').prop({
                className: 'studentData_Setting',
                id: 'responseSetting'
            }).append(studentDetail).append(teacherResponse).append(studentResponse)

            //學生資料表格框
            $('<div>').prop({
                className: 'studentDataContainer',
                id: `student_${studentIndex}`
            }).css({
                'width': '95vw',
                'background-color': 'rgba(255,255,255,0.9)',
                'border': '3px solid rgb(161, 160, 158)',
                'border-radius': '20px',
                'height': '70px',
                'display': 'flex',
                'justify-content': 'space-around',
                'margin': '0 auto',
                'margin-bottom': '15px',
                'text-align': 'center',
                'user-select': 'none'
            })
                .append(studentNumber)
                .append(studentId)
                .append(studentName)
                .append(studentSetting)
                .appendTo(studentListDiv)
        }
    })
    if (noOneDownYet) {
        //學生資料表格框
        $('<div>').prop({
            className: 'studentDataContainer',
            id: `student_no_down_yet`,
            innerHTML: '<h1>還沒有人完成該週進度</h1>'
        }).css({
            'width': '95vw',
            'background-color': 'rgba(255,255,255,0.9)',
            'border': '3px solid rgb(161, 160, 158)',
            'border-radius': '20px',
            'height': '70px',
            'display': 'flex',
            'justify-content': 'space-around',
            'margin': '0 auto',
            'margin-bottom': '15px',
            'text-align': 'center',
            'user-select': 'none'
        }).appendTo(studentListDiv)
    }
    return studentListDiv
}
//----------------------------------------------
//main function---------------------------------
//render stundetList main function
function renderResponsePage(studentData) {
    console.log(studentData)
    const pageContainer = $('.adminContainer')

    pageContainer.append(renderResponseSearch(studentData))

    pageContainer.append(renderResponseStudentList(studentData, weekCount()))
}
//loading stundetList main function
function loadingResponse() {
    loadingPage(true)

    loadingAllStudent().then(response => {
        renderResponsePage(response.data)
    }).then(() => {
        loadingPage(false)
        $('.adminContainer').fadeIn(300)
    })
}

$('#Response').click((e) => {
    $('.adminContainer').fadeOut(300)
    setTimeout(() => {
        $('.adminContainer').empty()
        loadingResponse()
    }, 300)

})
//-----------------------------------------------