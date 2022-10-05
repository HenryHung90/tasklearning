//axios function -------------------
//return studentStatus Data
function loadingAllStudent(studentSession) {
    return (axios({
        method: 'POST',
        url: '/admin/readstudents',
        data: {
            studentSession: studentSession
        }
    }))
}
//return ManageStatus Data
function loadingAllManageStatus() {
    return (axios({
        method: 'POST',
        url: '/admin/readmanagestatus'
    }))
}
//return MindingStatus Data
function loadingAllMindingStatus() {
    return (axios({
        method: 'POST',
        url: '/admin/readmindingstatus'
    }))
}
//return deleteStudent
async function uploadDeleteStudent(studentId) {
    return (
        axios({
            method: 'POST',
            url: '/admin/deleteStudent',
            data: {
                studentSession: $('.form-select').val(),
                studentId: studentId
            },
            withCredentials: true
        })
    )
}
//return addStudent
function uploadSingleStudent(studentData) {
    return (axios({
        method: 'POST',
        url: '/admin/addstudent',
        data: studentData
    }))
}
//return addManyStudents
async function uploadManyStudents(studentsData) {
    return (
        axios({
            method: 'post',
            url: '/admin/uploadmanystudents',
            data: {
                studentList: studentsData
            },
            withCredentials: true
        })
    )
}
//----------------------------------
//return Download xlsx
async function downloadDatatoExcel(workbookTitle, worksheetData, worksheetName) {
    const workbook = XLSX.utils.book_new();
    worksheetData.map((dataValue, dataIndex) => {
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dataValue), worksheetName[dataIndex]);
        //Binary string
        // XLSX.write(workbook, { book_type: "xlsx", type: "binary" });
        if (dataIndex == worksheetData.length - 1) {
            const Month = new Date().getMonth();
            const Today = new Date().getDate();
            XLSX.writeFile(workbook, `Student_${workbookTitle}_${Month}\/${Today}.xls`);
        }
    })
}
//return window cofirm
function comfirmClick(Name) {
    return (
        window.confirm(`確定 ${Name} ?`)
    )
}
//return stundentList
function studentListGenerate(studentList) {
    let member = []
    studentList.map((listValue, listIndex) => {
        let data = {
            "屆數": listValue.studentSession,
            "新學號(若要更新再輸入)": '',
            "當前學號": listValue.studentId,
            "姓名": listValue.studentName,
            "密碼(若要更新再輸入)": '',
            "是否激活": listValue.studentAccess
        }
        listValue.studentDetail.map((statusValue, statusIndex) => {
            data[`周 ${statusValue.Week} 進度`] = 'unchecked'
            if (statusValue.Status.Data == true) {
                data[`周 ${statusValue.Week} 進度`] = 'Task'
            }
            if (statusValue.Status.Mission == true) {
                data[`周 ${statusValue.Week} 進度`] = 'Plane'
            }
            if (statusValue.Status.Manage == true) {
                data[`周 ${statusValue.Week} 進度`] = 'Reflection'
            }
            if (statusValue.Status.Minding == true) {
                data[`周 ${statusValue.Week} 進度`] = 'Feedback'
            }
            if (statusValue.Status.Response == 1) {
                data[`周 ${statusValue.Week} 進度`] = 'Done'
            }
        })
        member.push(data)
    })
    return member
}
//Click Function----------------------------------
//下載所有任務資料
const downloadManageStatus = (manageStatus) => {
    //每周資料個別推入
    let generateData = []
    //每周資料表頭名稱(週數)推入
    let generateTitle = []

    manageStatus.mission.map((missionValue, missionIndex) => {
        generateData.push(studentManageStatusGenerate(missionValue, manageStatus.manage))
        generateTitle.push(`周 ${missionValue.week}`)
    })
    downloadDatatoExcel("Task", generateData, generateTitle)
}
//下載單一學員資料
const downloadStudentDetail = (studentId) => {
    axios({
        method: 'POST',
        url: '/admin/readstudentdata',
        data: {
            studentId: studentId
        },
        withCredentials: true
    }).then(response => {
        downloadDatatoExcel(studentId, response.data.studentData, response.data.dataTitle)
    })
}
const downloadStudentUsingRecord = (studentId) => {

}
//批量下載學員
const DownloadMember = (studentList, studentSession) => {
    downloadDatatoExcel(`Detail_${studentSession}`, [studentListGenerate(studentList)], ["學生資料"])
};
//批量上傳學員
const UploadMember = async (e) => {
    if (e.target.files[0].name.split('_')[1] != 'Detail') {
        window.alert("檔案錯誤")
        return
    }
    loadingPage(true)
    const [file] = e.target.files;
    const reader = new FileReader();

    reader.onload = async (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        const session = $('.form-select').val()

        let SPdata = data.split("\n");

        let DataContainer = [];
        let DataUpdate = [];
        for (let i = 1; i < SPdata.length; i++) {
            DataContainer[i - 1] = SPdata[i].split(",");
        }
        for (let i = 0; i < DataContainer.length - 1; i++) {
            if (DataContainer[i][0] != session) {
                if (!window.confirm("上傳屆數似乎與目前選擇屆數不相同，是否繼續上傳?")) {
                    loadingPage(false)
                    return
                }
            }
            const UploadData = {
                studentSession: DataContainer[i][0],
                newStudentId: DataContainer[i][1],
                currentStudentId: DataContainer[i][2],
                studentName: DataContainer[i][3],
                studentPassword: DataContainer[i][4],
                studentAccess: DataContainer[i][5]
            };
            DataUpdate.push(UploadData);
        }
        await uploadManyStudents(DataUpdate).then(async res => {
            setTimeout((e) => {
                loadingAllStudent(session).then(response => {
                    reloadStudentList(response.data, "success")
                    loadingPage(false)
                })
            }, 500)
        })
    }
    reader.readAsBinaryString(file);
}
//新增學生頁面
function addNewStudentPage() {

    let studentId = window.prompt("新增學生學號", '')
    if (studentId == null) {
        window.alert("取消")
        return
    }
    let studentPassword = window.prompt("新增學生密碼", '')
    if (studentPassword == null) {
        window.alert("取消")
        return
    }
    let studentName = window.prompt("新增學生姓名", '')
    if (studentName == null) {
        window.alert("取消")
        return
    }
    let studentAccess = window.prompt("是否激活帳號(true or false)", '')
    if (studentAccess == null) {
        window.alert("取消")
        return
    }



    if (studentId == null ||
        studentPassword == null ||
        studentName == null ||
        studentAccess == null) {
        window.alert("有值為空值")
        return
    }
    if (isNaN(studentId)) {
        window.alert("學生學號應為純數字")
        return
    }
    const session = $('.form-select').val()
    const studentData = {
        studentSession: session,
        studentId: studentId,
        studentName: studentName,
        studentPassword: studentPassword,
        studentAccess: studentAccess
    }

    uploadSingleStudent(studentData).then(response => {
        loadingPage(true)
        if (response.data == 'user exist') {
            window.alert(`學生 ${studentName} 已存在`)
            return
        }
        let alertText = "新增完成\n" + `學號 : ${studentId}\n` +
            `姓名 : ${studentName}\n` + `密碼 : ${studentPassword}\n` +
            `信箱 : ${studentAccess}`

        loadingAllStudent(session).then(response => {
            reloadStudentList(response.data, alertText)
        })
    })
}
//新增 / 修改 / 刪除 後重整StudentList
function reloadStudentList(studentData, alertText) {
    $('.studentListDiv').fadeOut(100)
    loadingPage(true)
    setTimeout(() => {
        $('.studentListDiv').remove()
        $('.adminContainer').append(renderStudentList(studentData))
        $('.studentListDiv').css({ 'display': 'none' })
        $('.studentListDiv').fadeIn(200)
        setTimeout(() => {
            window.alert(alertText)
            loadingPage(false)
        }, 200)
    }, 200)
}
//修改密碼
function changeStudentPassword(Id) {
    let newPassword = window.prompt("請輸入新密碼", '')
    if (newPassword == null) {
        window.alert("密碼不得為空")
        return
    }
    let checkPassword = window.prompt("再次輸入新密碼", '')
    if (checkPassword != newPassword) {
        window.alert("兩次輸入不一")
        return
    }
    if (comfirmClick(`新密碼 : ${newPassword}`)) {
        axios({
            method: 'POST',
            url: '/admin/changepassword',
            data: {
                studentId: Id,
                studentPassword: newPassword
            },
            withCredentials: true
        }).then(response => {
            window.alert(response.data)
        })
    }
}
//修改學生資料
function changeStudentConfig(Id) {
    const studentId = window.prompt(`學生原學號 : ${Id.studentId}\n請輸入新學號`, Id.studentId)
    if (studentId == null) {
        window.alert("取消")
        return
    }
    const studentName = window.prompt(`學生原姓名 : ${Id.studentName}\n請輸入新學號`, Id.studentName)
    if (studentName == null) {
        window.alert("取消")
        return
    }
    const studentAccess = window.prompt("請輸入是否開通(true or false)","true")
    if(studentAccess == null){
        window.alert("取消")
        return
    }
    if (comfirmClick(`\n學生新學號 : ${studentId}\n學生新姓名 : ${studentName}\n是否開通 : ${studentAccess}`)) {
        axios({
            method: 'POST',
            url: '/admin/updatestudentconfig',
            data: {
                studentSession: $('.form-select').val(),
                originStudentId: Id.studentId,
                studentId: studentId,
                studentName: studentName,
                studentAccess:studentAccess,
            },
            withCredentials: true
        }).then(response => {
            let changeStudentMsg = "狀態\n" +
                `學生資料 : ${response.data.studentConfig}\n` +
                `學生Task : ${response.data.studentMission}\n` +
                `學生Plan : ${response.data.studentManage}\n` +
                `學生Reflection : ${response.data.studentMinding}\n` +
                `學生Feedback : ${response.data.studentResponse}`

            reloadStudentList(response.data.newStudentData, changeStudentMsg)
        })
    } else {
        window.alert("取消")
        return
    }
}
//轉換學生屆數
async function changeStudentList(studentSession) {
    loadingPage(true)
    await loadingAllStudent(studentSession).then(response => {
        reloadStudentList(response.data, studentSession)
    }).then(() => {
    })
    loadingPage(false)
}
//-----------------------------------------------
//render 上層按鈕列表
function renderStudentPageBtn() {
    //上傳學生名單
    const uploadStudents = $('<div>').prop({
        className: 'input-group mb-3',
        innerHTML: '<input type="file" class="form-control" id="uploadStudents">'
    }).css({
        'width': '60%',
        'line-height': '100px',
    }).change((e) => {
        UploadMember(e)
    })
    //下載學生名單
    const downloadStudents = $('<button>').prop({
        className: 'btn btn-secondary',
        innerHTML: '下載學生資料'
    }).css({
        'width': '40%'
    }).click((e) => {
        const session = $('.form-select').val()
        loadingAllStudent(session).then(response => {
            DownloadMember(response.data, session)
        })
    })
    //學生名單上下載區
    const uploadandDownloadStudentContainer = $('<div>').prop({
        className: 'uploadandDownloadStudentContainer'
    }).css({
        'width': '35%',
        'display': 'flex'
    }).append(downloadStudents).append(uploadStudents)

    //新增學生
    const addNewStudent = $('<button>').prop({
        className: 'btn btn-secondary',
        innerHTML: '新增學生'
    }).css({
        'width': '10%'
    }).click((e) => {
        addNewStudentPage()
    })

    //選擇屆數
    const changeStudentsSession = $('<select>').prop({
        className: "form-select",
        ariaLabel: "Default select example"
    }).css({
        'width': '20%',
        'margin': '0'
    }).change((e) => {
        changeStudentList(e.target.value)
    })
    //108~111屆 (暫定 可以再做更改 )
    for (let i = 108; i < sessionCount(); i++) {
        $('<option>').prop({
            value: i,
            innerHTML: `第 ${i} 屆`
        }).appendTo(changeStudentsSession)
    }
    //Btn Container
    const btnContainer = $('<div>').prop({
        className: 'btnContainer'
    }).css({
        'margin-top': '50px',
        'width': '100%',
        'height': '38px',
        'display': 'flex',
        'justify-content': 'space-around',
    }).append(changeStudentsSession).append(addNewStudent).append(uploadandDownloadStudentContainer)
    //Btn 外框
    const studentBtnDiv = $('<div>').prop({
        className: 'studentBtnContainer',
        innerHTML: '<h1>Student List</h1>'
    }).css({
        'background-color': 'rgba(0, 0, 0, 0.3)',
        'border-radius': '20px',
        'width': '95vw',
        'height': '160px',
        'text-align': 'center',
        'margin': '0 auto'
    }).append(btnContainer)

    return studentBtnDiv
}
//render Student各自的框框
function renderStudentList(studentDetail) {
    //學生資料外框
    const studentListDiv = $('<div>').prop({
        className: 'studentListDiv',
    }).css({
        'width': '100vw',
        'margin': '0 auto',
        'margin-top': '30px',
    })
    studentDetail.map((studentData, studentIndex) => {
        //學生序號
        const studentNumber = $('<div>').prop({
            className: 'studentData_Number',
            id: `studentNumber_${studentIndex}`,
            innerHTML: `${studentIndex}`
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
        //學生資料狀態
        const studentDetail = $('<div>').prop({
            className: 'studentData_Detail'
        })
        //學習檔案
        $('<button>').prop({
            className: 'btn btn-primary',
            innerHTML: "學習檔案"
        }).css({
            'width': '45%',
            'height': '40px',
            'background-color': 'purple'
        }).click(e => {
            downloadStudentDetail(studentData.studentId)
        }).appendTo(studentDetail)
        //事件紀錄
        $('<button>').prop({
            className: 'btn btn-primary',
            innerHTML: "事件紀錄"
        }).css({
            'width': '45%',
            'margin-left': '5px',
            'height': '40px',
            'background-color': 'purple'
        }).click(e => {
            downloadStudentUsingRecord(studentData.studentId)
        }).appendTo(studentDetail)


        const studentPassword = $('<button>').prop({
            className: 'btn btn-primary',
            innerHTML: "變更密碼"
        }).css({
            'width': '35%',
            'height': '40px',
        }).click((e) => {
            changeStudentPassword(studentData.studentId)
        })
        const studentEdit = $('<button>').prop({
            className: 'btn btn-secondary',
            innerHTML: '修改'
        }).css({
            'width': '30%',
            'height': '40px',
        }).click((e) => {
            changeStudentConfig(studentData)
        })

        const studentDelete = $('<button>').prop({
            className: 'btn btn-danger',
            innerHTML: '刪除'
        }).css({
            'width': '30%',
            'height': '40px',
        }).click((e) => {
            if (comfirmClick(`刪除 ${studentData.studentName}`)) {
                uploadDeleteStudent(studentData.studentId).then(response => {
                    let deleteStatusMsg = "資料刪除狀態\n" +
                        "學生帳號 : " + response.data.deleteStatus["學生帳號"] +
                        "\n學生Task : " + response.data.deleteStatus["學生Task"] +
                        "\n學生Plan : " + response.data.deleteStatus["學生Plan"] +
                        "\n學生Reflection : " + response.data.deleteStatus["學生Reflection"] +
                        "\n學生Feedback : " + response.data.deleteStatus["學生Feedback"]

                    reloadStudentList(response.data.newStudentData, deleteStatusMsg)
                })
            }
        })
        //設定學生//
        const studentSetting = $('<div>').prop({
            className: 'studentData_Setting'
        }).append(studentPassword).append(studentEdit).append(studentDelete)

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
            'text-align': 'center'
        })
            .append(studentNumber)
            .append(studentId)
            .append(studentName)
            .append(studentDetail)
            .append(studentSetting)
            .appendTo(studentListDiv)
    })

    return studentListDiv
}
//main function---------------------------------
//render stundetList main function
function renderAdminStudentPage(studentData) {
    const pageContainer = $('.adminContainer')

    //產生按鈕欄位
    pageContainer.append(renderStudentPageBtn())
    //產生學生列表
    pageContainer.append(renderStudentList(studentData))
}
//loading stundetList main function
function loadingStudent() {
    loadingPage(true)

    //預設Loading 108 屆學生
    loadingAllStudent(108)
        .then(response => {
            renderAdminStudentPage(response.data)
        }).then(() => {
            loadingPage(false)
            $('.adminContainer').fadeIn(300)
        })
}

$('#Student').click((e) => {
    $('.adminContainer').fadeOut(300)
    setTimeout(() => {
        $('.adminContainer').empty()
        loadingStudent()
    }, 300)

})
//-----------------------------------------------