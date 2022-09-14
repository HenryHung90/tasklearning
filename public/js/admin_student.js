//axios function -------------------
//return studentStatus Data
function loadingAllStudent() {
    return (axios({
        method: 'POST',
        url: '/admin/readstudents'
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
                studentId: studentId
            },
            withCredentials: true
        })
    )
}
//return addStudent
function uploadSingleStudent(studentData) {
    {
        return (axios({
            method: 'POST',
            url: '/admin/addstudent',
            data: studentData
        }))
    }
}
//----------------------------------
//return stundentList
function studentListGenerate(studentList) {
    let member = []
    studentList.map((listValue, listIndex) => {
        let data = {
            "新學號(若要更新再輸入)": '',
            "當前學號": listValue.studentId,
            "姓名": listValue.studentName,
            "密碼(若要更新再輸入)": '',
            "電子郵件": listValue.studentEmail
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
//return studentManage Data
function studentManageStatusGenerate(Mission, Manage) {
    //最終回傳陣列
    let returnWorkSheet = []
    Manage.map((studentValue, studentIndex) => {
        //每周資料格式
        let manageStatusWorkSheet = {
            "學號": ''
        }
        //Manage資料對位使用
        let missionPostion = []
        //建立每周資料格式後續格子
        Mission.mission.map((missionValue, missionIndex) => {
            manageStatusWorkSheet[missionValue.title] = ''
            missionPostion.push(missionValue.title)
        })

        if (studentValue.week == Mission.week) {
            manageStatusWorkSheet["學號"] = studentValue.studentId

            const manageData = Object.values(studentValue.manage)
            manageData.map((dataValue, dataIndex) => {
                const insertData = dataValue.join("").split("\n").join(" -> ")

                manageStatusWorkSheet[missionPostion[dataValue[0]]] = insertData
            })

            returnWorkSheet.push(manageStatusWorkSheet)
        }
    })
    return returnWorkSheet
}
//return Download xlsx
async function downloadDatatoExcel(workbookTitle, worksheetData, worksheetName) {
    const workbook = XLSX.utils.book_new();
    worksheetData.map((dataValue, dataIndex) => {
        console.log(dataValue)
        if(dataIndex == 1){
            let worksheet = XLSX.utils.json_to_sheet(dataValue);
            console.log(worksheet)
            let result = XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName[dataIndex]);
            // console.log(result);
            //Binary string
            XLSX.write(workbook, { book_type: "csv", type: "binary" });
            if (dataIndex == worksheetData.length - 1) {
                const Month = new Date().getMonth();
                const Today = new Date().getDate();
                XLSX.writeFile(workbook, `Student_${workbookTitle}_${Month}\/${Today}.csv`);
            }
        }
       
    })
}
//return window cofirm
function comfirmClick(Name) {
    return (
        window.confirm(`確定 ${Name} ?`)
    )
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
//批量下載學員
const DownloadMember = (studentList) => {
    downloadDatatoExcel('Detail', [studentListGenerate(studentList)], ["學生資料"])
};
//批量上傳學員
const UploadMember = (e) => {
    if (e.target.files[0].name.split('_')[1] != 'Detail') {
        window.alert("檔案錯誤")
        return
    }
    loadingPage(true)
    const [file] = e.target.files;
    const reader = new FileReader();

    reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });

        let SPdata = data.split("\n");

        let DataContainer = [];
        let DataUpdate = [];
        for (let i = 1; i < SPdata.length; i++) {
            DataContainer[i - 1] = SPdata[i].split(",");
        }

        for (let i = 0; i < DataContainer.length; i++) {
            const UploadData = {
                studentId: DataContainer[i][1],
                StudentName: DataContainer[i][2],
                StudentPassword: DataContainer[i][3],
                studentEmail: DataContainer[i][4]
            };
            DataUpdate.push(UploadData);
        }

        axios({
            method: 'post',
            url: '/admin/uploadmanystudents',
            data: {
                studentList: DataContainer
            },
            withCredentials: true
        }).then(response => {
            reloadStudentList(response.data, "success")
        }).then(response => {
            loadingPage(false)
        })
    };
    reader.readAsBinaryString(file);
};
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
    let studentEmail = window.prompt("新增學生Email", '')
    if (studentEmail == null) {
        window.alert("取消")
        return
    }

    if (studentId == null ||
        studentPassword == null ||
        studentName == null ||
        studentEmail == null) {
        window.alert("有值為空值")
        return
    }
    if (isNaN(studentId)) {
        window.alert("學生學號應為純數字")
        return
    }
    const studentData = {
        studentId: studentId,
        studentName: studentName,
        studentPassword: studentPassword,
        studentEmail: studentEmail
    }

    uploadSingleStudent(studentData).then(response => {
        if (response.data == 'user exist') {
            window.alert(`學生 ${studentName} 已存在`)
            return
        }
        let alertText = "新增完成\n" + `學號 : ${studentId}\n` +
            `姓名 : ${studentName}\n` + `密碼 : ${studentPassword}\n` +
            `信箱 : ${studentEmail}`

        loadingAllStudent().then(response => {
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
    if (comfirmClick(`\n學生新學號 : ${studentId}\n學生新姓名 : ${studentName}`)) {
        axios({
            method: 'POST',
            url: '/admin/updatestudentconfig',
            data: {
                originStudentId: Id.studentId,
                studentId: studentId,
                studentName: studentName
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
//-----------------------------------------------
//render 上層按鈕列表
function renderStudentPageBtn() {
    //下載學生Minding資料
    const downloadMindingStatusBtn = $('<button>').prop({
        className: 'btn btn-secondary',
        id: '',
        innerHTML: '下載Reflection'
    }).css({
        'width': '10%'
    }).click((e) => {
        loadingAllMindingStatus().then(response => {
            downloadMindingStatus(response.data)
        })
    })
    //下載學生Manage資料
    const downloadManageStatusBtn = $('<button>').prop({
        className: 'btn btn-secondary',
        id: '',
        innerHTML: '下載Plan'
    }).css({
        'width': '10%'
    }).click((e) => {
        loadingAllManageStatus().then(response => {
            downloadManageStatus(response.data)
        })
    })

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
        loadingAllStudent().then(response => {
            DownloadMember(response.data)
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
        'width': '8%'
    }).click((e) => {
        addNewStudentPage()
    })

    //Btn Container
    const btnContainer = $('<div>').prop({
        className: 'btnContainer'
    }).css({
        'margin-top': '50px',
        'width': '100%',
        'height': '38px',
        'display': 'flex',
        'justify-content': 'space-between',
    }).append(addNewStudent).append(uploadandDownloadStudentContainer).append(downloadManageStatusBtn).append(downloadMindingStatusBtn)

    //Btn 外框
    const studentBtnDiv = $('<div>').prop({
        className: 'studentBtnContainer',
        innerHTML: '<h1>Student List</h1>'
    }).css({
        'background-color': 'rgba(255, 255, 255, 0.5)',
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
        //學生資料狀態
        const studentDetail = $('<div>').prop({
            className: 'studentData_Detail'
        })
        $('<button>').prop({
            className: 'btn btn-primary',
            innerHTML: "學習檔案"
        }).css({
            'width': '100%',
            'height': '40px',
            'background-color': 'purple'
        }).click((e) => {
            downloadStudentDetail(studentData.studentId)
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
            'text-align': 'center',
            'user-select': 'none'
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

    loadingAllStudent()
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