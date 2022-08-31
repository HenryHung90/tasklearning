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
//----------------------------------
//return stundetList
function studentListGenerate(studentList){
    let member = []
    studentList.map((listValue, listIndex) => {
        let data = {
            "學號": listValue.studentId,
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
function studentManageStatusGenerate(Mission,Manage){
    console.log(Mission,Manage)
    //最終回傳陣列
    let returnWorkSheet = []
    //每周資料格式
    let manageStatusWorkSheet = {
        studentId: ''
    }
    //建立每周資料格式後續格子
    Mission.mission.map((missionValue,missionIndex)=>{
        manageStatusWorkSheet[missionValue.title] = ''
    })
    console.log(Mission.week,manageStatusWorkSheet)


}
//return Download xlsx
function downloadDatatoExcel(workbookTitle, worksheetData, worksheetName){
    worksheetData.map((dataValue,dataIndex)=>{
        const worksheet = XLSX.utils.json_to_sheet(dataValue);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName[dataIndex]);
        //Buffer
        let buffer = XLSX.write(workbook, { book_type: "xlsx", type: "buffer" });
        //Binary string
        XLSX.write(workbook, { book_type: "xlsx", type: "binary" });
        const Month = new Date().getMonth();
        const Today = new Date().getDate();
        XLSX.writeFile(workbook, `Student_${workbookTitle}_${Month}\/${Today}.xlsx`);
    })
}

//下載學員任務資料
const downloadManageStatus = (manageStatus) =>{
    //每周資料個別推入
    let generateData = []
    //每周資料表頭名稱(週數)推入
    let generateTitle = []

    manageStatus.mission.map((missionValue,missionIndex)=>{
        generateData.push(studentManageStatusGenerate(missionValue,manageStatus.manage))
        generateTitle.push(`周 ${missionValue.week}`)
    })

    // downloadDatatoExcel("Task",generateData,generateTitle)
}
//批量下載學員
const DownloadMember = (studentList) => {
    downloadDatatoExcel('Detail',[studentListGenerate(studentList)],["學生資料"])
};
//批量上傳學員
const UploadMember = (e) => {
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

        console.log(DataContainer)
    };
    reader.readAsBinaryString(file);
};

function renderStudentPageBtn() {
    //下載學生Manage資料
    const downloadManageStatusBtn = $('<button>').prop({
        className: 'btn btn-secondary',
        id: '',
        innerHTML: '下載Task'
    }).css({
        'width': '10%'
    }).click((e) => {
        loadingAllManageStatus().then(response=>{
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
        className:'uploadandDownloadStudentContainer'
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
    }).append(addNewStudent).append(uploadandDownloadStudentContainer).append(downloadManageStatusBtn)

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

function renderStudentList(studentData) {
    console.log(studentData)
}

function renderAdminStudentPage(studentData) {
    const pageContainer = $('.adminContainer')

    //產生按鈕欄位
    pageContainer.append(renderStudentPageBtn())
    //產生學生列表
    pageContainer.append(renderStudentList(studentData))
}

function loadingStudent() {
    loadingPage(true)

    loadingAllStudent().then(response => {
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