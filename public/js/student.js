const renderWeekTaskManager = (week, stage) => {
    let Model = ""


    let taskStage_final

    //外圈收尾
    const taskEnd = '</div>'

    //task之間連接線
    const taskArrow = '<svg xmlns="http://www.w3.org/2000/svg" width="70px" height="80%" fill="currentColor" class="bi bi-arrow-right-square" viewBox="0 0 16 16">' +
        '<path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />' +
        '</svg>'

    //task外圈
    const taskOutlineStart = '<div class="taskTitle">'

    //task之week
    const taskWeekTitle = `<h1> Week ${week}</h1>`

    //task 進度stage外圈
    const taskStageStart = '<div class="taskStage">'

    //task 完成Icon
    const taskCompleteIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">' +
        '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />' +
        '<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />' +
        '</svg>'

    //Stage 1教學資料
    const taskStage_Data_uncomplete =
        '<div class="taskStage_Box" id="Data">' +
        '<h4>教學資料</h4>' + taskEnd

    const taskStage_Data_complete =
        '<div class="taskStage_Box_Complete" id="Data">' +
        '<h4>教學資料</h4>' + taskCompleteIcon + taskEnd

    //Stage 2本周目標
    const taskStage_Mission_uncomplete =
        '<div class="taskStage_Box" id="Mission">' +
        '<h4>本周目標</h4>' + taskEnd

    const taskStage_Mission_complete =
        '<div class="taskStage_Box_Complete" id="Mission">' +
        '<h4>本周目標</h4>' + taskCompleteIcon + taskEnd

    //Stage 3學習計畫
    const taskStage_Manage_uncomplete =
        '<div class="taskStage_Box" id="Manage">' +
        '<h4>學習計畫</h4>' + taskEnd

    const taskStage_Manage_complete =
        '<div class="taskStage_Box_Complete" id="Manage">' +
        '<h4>學習計畫</h4>' + taskCompleteIcon + taskEnd

    //Stage 4自我反思
    const taskStage_Minding_uncomplete =
        '<div class="taskStage_Box" id="Minding">' +
        '<h4>自我反思</h4>' + taskEnd

    const taskStage_Minding_complete =
        '<div class="taskStage_Box_Complete" id="Minding">' +
        '<h4>自我反思</h4>' + taskCompleteIcon + taskEnd

    //Stage 5老師回饋
    const taskStage_Response_uncomplete =
        '<div class="taskStage_Box" id="Response">' +
        '<h4>老師回饋</h4>' + taskEnd

    const taskStage_Response_teacherComplete =
        '<div class="taskStage_Box_teacherComplete" id="Response">' +
        '<h4>老師回饋</h4>' + taskEnd

    const taskStage_Response_studentComplete =
        '<div class="taskStage_Box_Complete" id="Response">' +
        '<h4>老師回饋</h4>' + taskCompleteIcon + taskEnd

    Model += taskOutlineStart + taskWeekTitle + taskStageStart

    for (let i = 0; i < stage.length; i++) {
        if (stage[i]) {
            switch (i) {
                case 1:
                    Model += taskStage_Data_complete
                    break
                case 2:
                    Model += taskStage_Mission_complete
                    break
                case 3:
                    Model += taskStage_Manage_complete
                    break
                case 4:
                    Model += taskStage_Minding_complete
                    break
            }
        } else if (!stage[i]) {
            switch (i) {
                case 1:
                    Model += taskStage_Data_uncomplete
                    break
                case 2:
                    Model += taskStage_Mission_uncomplete
                    break
                case 3:
                    Model += taskStage_Manage_uncomplete
                    break
                case 4:
                    Model += taskStage_Minding_uncomplete
                    break
            }
        }
    }
    if(!stage[4]){
        Model+=taskStage_Response_uncomplete
    }
    if (stage[4] === 1) {
        Model += taskStage_Response_teacherComplete
    } else if (stage[4] === 2) {
        Model += taskStage_Response_studentComplete
    }

    Model += taskEnd + taskEnd


    $('.taskContainer').append(Model);
}

const LogoutFunc = (e) =>{
    axios({
        method: "GET",
        url: '/logout',
        withCredentials: true,
    }).then(res => {
        window.location.href = res.data
    })
}

$(window).ready(() => {
    let taskStage = [false, false, false, false, false]
    for (let i = 1; i <= 10; i++) {
        taskStage = [false, false, false, false, false]
        if (i == 1 || i == 2) {
            taskStage = [true, true, true, true, 1]
        }
        if (i == 3) {
            taskStage = [true, true, true, true, 2]
        }
        renderWeekTaskManager(i, taskStage);
    }
})

$('#logoutBtn').click((e)=>LogoutFunc(e))