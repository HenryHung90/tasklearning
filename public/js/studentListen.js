$(document).ready(e => {
    setTimeout(e => {
        console.log($(".taskStage_Box_Complete"))

        //student Dashboard Listener
        $(".taskStage_Box_Complete").mousedown(e => {
            taskStageBoxClick(e)
        })
        $(".taskStage_Box").mousedown(e => {
            taskStageBoxClick(e)
        })
        $(".taksStage_Box_teacherComplete").mousedown(e => {
            taskStageBoxClick(e)
        })
    }, 500)

    function taskStageBoxClick(e) {
        const stageType = e.currentTarget.id.split("_")[0]
        const stageWeek = "周次 " + e.currentTarget.id.split("_")[1]

        let item = stageWeek


       switch(stageType){
            case "Data":
                item += ' 教學資料'
                break
            case "Mission":
                item += " 準備階段"
                break
            case "Manage":
                item += " 執行階段"
                break
            case "Minding":
                item += " 反思階段"
                break
            case "Response":
                item += " 老師回饋"
                
       }

        const clickTemp = {
            time:getNowTime(),
            operation:"進入",
            item: item,
            description: "在 " + getNowTime() + " 進入 " + item
        }

        axios({
            method:'post',
            url:'/student/addlistener',
            data:{clickTemp}
        }).then(response=>{
            if(response.data != 'success'){
                window.alert("儲存出現問題，請重整網頁")
            }
        })
        
    }
})


function getNowTime(){
    const time = new Date()
    return time.getFullYear() + "/" + time.getMonth() + "/" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()
}