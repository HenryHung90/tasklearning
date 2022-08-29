//render老師回饋
function renderTeacherResponse(teacherResponse){
    
    //teacherResponse內文
    const teacherResponseContent = $('<span>').prop({
        className:'teacherResponseContent',
        innerHTML: teacherResponse
    }).css({
        'word-wrap':'break-word',
        'white-space': 'pre-wrap',
        'line-height':'50px',
        'font-size':'20px',
        'border-radius':'10px',
        'background-color':'rgba(255, 255, 255, 0.5)',
        'padding-bottom':'2px',
        'border-bottom':'1px dashed rgba(0, 0, 0, 0.4)',
    })

    //teacherResponse外框
    const teacherResponseDiv = $('<div>').prop({
        className:'teacherResponseContainer',
    }).css({
        'margin-top':'2%',
        'width': '100%',
        'height': '90%',
        'text-align': 'left',
        'border-radius': '20px',
        'padding':'20px',
        'background-color': 'rgba(255, 255, 255, 0.5)',
        'overflow': 'auto',
    }).append(teacherResponseContent)

    return teacherResponseDiv
}
//render學生回饋
function renderStudentResponse(studentResponse){
    
    const studentResponseContent = $('<div>').prop({
        className:'studentResponseContent',
        innerHTML:"有需要問或是想告訴老師的都可以留言喔!"
    }).css({
        'margin':'0 auto',
        'width': '90%',
        'text-align': 'left',
        'font-size': '20px',
        'font-weight': 'bold'
    })
    //studentResponse回覆區
    const studentResponseTextarea = $('<textarea>').prop({
        className:'studentResponseTextarea',
        value: studentResponse
    }).css({
        'margin-top':'5%',
        'width': '90%',
        'height': '70%',
        'padding': '15px',
        'border': '1px dashed rgba(0,0,0,0.3)',
        'border-radius': '20px',
        'transition-duration': '0.5s',
        'resize': 'none'
    }).hover((e) => {
        studentResponseTextarea.css({
            'transition-duration': '0.5s',
            'border': '1.5px dashed rgba(0,0,0)'
        })
    }, (e) => {
        studentResponseTextarea.css({
            'border': '1px dashed rgba(0,0,0,0.3)'
        })
    })
    //studentResponse外框
    const studentResponseDiv = $('<div>').prop({
        className: 'studentResponseContainer',
    }).css({
        'margin-top': '2%',
        'width': '100%',
        'height': '90%',
        'border-radius': '20px',
        'background-color': 'rgba(255, 255, 255, 0.5)'
    }).append(studentResponseTextarea).append(studentResponseContent)

    return studentResponseDiv
}


//render response page main function
function renderResponsePage(data){
    const responseTeacher = $('.responseTeacher')
    const responseStudent = $('.responseStudent')

    responseTeacher.append(renderTeacherResponse(data.teacherResponse))
    responseStudent.append(renderStudentResponse(data.studentResponse))
}
//Click 確認是否已經完成過
async function stageBtnEnterForResponse() {
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
        isDone = response.data[dataWeek].Status.Response
    })
    return isDone
}
//檢視完畢後上傳學生回覆
async function uploadResponse(){
    const dataWeek = $('.WeekTitle').html().split(" ")[1]
    const userId = $('#userId').html()
    loadingPage(true)
    axios({
        method: "POST",
        url: '/studentstage/responsecomplete',
        data: {
            studentId: $('#userId').html(),
            week: $('.WeekTitle').html()
        },
        withCredentials: true,
    }).then((response)=>{
        axios({
            method: 'post',
            url: '/student/addresponse',
            data: {
                week: dataWeek,
                studentId: userId,
                studentResponse: $('.studentResponseTextarea').val()
            },
            withCredentials: true
        }).then(response => {
            if (!response.data) {
                window.alert('網路錯誤，請重新上傳')
            } else {
                window.location.href = `/dashboard/${userId}`
            }
        })
    })
   
}

//loading response page main function
function loadResponse(){
    loadingPage(true)
    const dataWeek = $('.WeekTitle').html().split(" ")[1]
    const userId = $('#userId').html()

    axios({
        method:'post',
        url:'/student/readresponse',
        data:{
            week:dataWeek,
            studentId:userId
        },
        withCredentials:true
    }).then(response=>{
        console.log(response.data)
        if(response.data == null || response.data == ""){
            window.alert("老師尚未給予回饋")
            window.location.href = `/dashboard/${userId}`
        }
        renderResponsePage(response.data)
        //綁定完成Click事件
        $("#stageResponseCheck").click(async (e) => {
            await stageBtnEnterForResponse().then(res => {
                if (res != 2) {
                    if (window.confirm("確定完成 師生回饋 進度嗎?")) {
                        uploadResponse()
                    }
                } else {
                    uploadResponse()
                }
            })
        })
    }).then(()=>{
        loadingPage(false)
    })
}

$(window).ready(e=>{
    loadResponse()
})