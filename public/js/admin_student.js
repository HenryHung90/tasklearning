
function renderStudentPageBtn(){

}

function renderStudentList(studentData){
    console.log(studentData)
}

function renderAdminStudentPage(studentData){
    const pageContainer = $('.adminContainer')

    //產生按鈕欄位
    pageContainer.append(renderStudentPageBtn())
    //產生學生列表
    pageContainer.append(renderStudentList(studentData))
}

function loadingStudent(){
    loadingPage(true)

    axios({
        method: 'POST',
        url:'/admin/readstudents'
    }).then(response=>{
        renderAdminStudentPage(response.data)
    }).then(()=>{ 
        loadingPage(false)
        $('.adminContainer').fadeIn(300)
    })
}

$('#Student').click((e)=>{
    $('.adminContainer').fadeOut(300)
    $('.adminContainer').empty()
    loadingStudent()
})