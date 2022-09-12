//axios function--------------------------------
//取得該學生當週學習狀態
function getStudentStatusDetail(studentId,week){
    return(axios({
        method:'post',
        url:'/admin/readstudentstatusdetail',
        data:{
            studentId: studentId,
            week:week
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
function renderStudentStatus(studentId,week){
    getStudentStatusDetail(studentId,week).then(response=>{

    })
}

//render 上方搜尋列表
function renderResponseSearch() {
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
            innerHTML: `<h1>${i}</h1>`
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
            weekSwitchClickBtn(i)
        }).appendTo(responseBarContainer)
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
function renderResponseStudentList(studentDetail) {
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
        if (isDoneThisWeek(studentData.studentDetail[weekCount() - 1])) {
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
                id:'checkStudentStatus',
                innerHTML: '學習狀況'
            }).css({
                'width': '30%',
                'height': '40px',
            }).click((e)=>{
                renderStudentStatus(studentData.studentId,weekCount() - 1)
            })
            const teacherResponse = $('<button>').prop({
                className: 'btn btn-outline-success',
                id:'teacherResponse',
                innerHTML: '給予回饋'
            }).css({
                'width': '30%',
                'height': '40px',
            })
            const studentResponse = $('<button>').prop({
                className: 'btn btn-outline-success',
                id:'studentResponse',
                innerHTML: '查看學生回覆'
            }).css({
                'width': '35%',
                'height': '40px',
            })

            //設定學生//
            const studentSetting = $('<div>').prop({
                className: 'studentData_Setting',
                id:'responseSetting'
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
            id: `student_${studentIndex}`,
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

    pageContainer.append(renderResponseSearch())

    pageContainer.append(renderResponseStudentList(studentData))
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