//axios function--------------------------------
//取得該學生當週學習狀態
function getStudentStatusDetail(studentId, week) {
    return axios({
        method: "post",
        url: "/admin/readstudentstatusdetail",
        data: {
            studentSession: $("#response_session").val(),
            studentId: studentId,
            week: week,
        },
        withCredentials: true,
    })
}
//取得老師對學生當周學習狀態回復
function getTeacherResponse(studentId, week) {
    return axios({
        method: "post",
        url: "/admin/readteacherresponse",
        data: {
            studentId: studentId,
            week: week,
        },
        withCredentials: true,
    })
}
//上傳TeacherResponse
function uploadResponse(studentId, week) {
    return axios({
        method: "post",
        url: "/admin/addresponse",
        data: {
            session: $("#response_session").val(),
            studentId: studentId,
            week: week,
            teacherResponse: $(".teacherResponseText").val(),
            teacherResponseTime: getNowTime(),
        },
        withCredentials: true,
    })
}
//return function-------------------------------
//是否為WellDone
function isDoneThisWeek(studentCheck) {
    return studentCheck.Status.Response == 2
}
//是否為Feedback
function isFeedBackWeek(studentCheck) {
    return studentCheck.Status.Minding
}
//開啟 / 關閉該項學生列表
function openStudentList(listName, iconTraget) {
    if ($(listName).length == 0) {
        window.alert("該項目目前沒有人")
        return
    }
    if ($(listName).attr("class").split(" ")[1] == "Opening") {
        $(listName).removeClass("Opening")
        $(listName).fadeOut(100)
        $(iconTraget).css({
            "transition-duration": "0.5s",
            transform: "rotate(0deg)",
        })
    } else {
        $(listName).addClass("Opening")
        $(listName).fadeIn(100)
        $(listName).css({ display: "flex" })
        $(iconTraget).css({
            "transition-duration": "0.5s",
            transform: "rotate(180deg)",
        })
    }
}
//WellDone人數
function countingMembers(students, week, status) {
    let counting = 0
    for (let value of students) {
        if (status == "not yet") {
            isDoneThisWeek(value.studentDetail[week - 1]) ? null : counting++
        } else if (status == "feed back") {
            isFeedBackWeek(value.studentDetail[week - 1]) &&
            !isDoneThisWeek(value.studentDetail[week - 1])
                ? counting++
                : null
        } else if (status == "well done") {
            isDoneThisWeek(value.studentDetail[week - 1]) ? counting++ : null
        }
    }
    return `<h3> ${counting}</h3>`
}
//是否有回覆老師
async function isResendToTeacher(studentId, week) {
    let result = false
    await getTeacherResponse(studentId, week).then(response => {
        if (response.data.studentResponse != "") {
            result = true
        }
    })
    return result
}
//變換屆數
function changeResponsetList(Session) {
    $(".studentListDiv").fadeOut(200)
    setTimeout(e => {
        $(".studentListDiv").remove()
        loadingAllStudent(Session).then(response => {
            $(".adminContainer").append(
                renderResponseStudentList(
                    response.data,
                    $("#response_week").val()
                )
            )
            loadingPage(false)
        })
    }, 200)
}
//render function-------------------------------
//render 學生學習狀況
function renderStudentStatus(studentId, week) {
    getStudentStatusDetail(studentId, week).then(response => {
        if (response.data == "fall") {
            window.alert("該學生尚未開始任何動作")
            loadingPage(false)
            return
        }
        //備份任務名稱
        const missionName = [...response.data.missionName]

        const studentStatusContainer = $("<div>")
            .prop({
                className: "container",
            })
            .css({
                position: "absolute",
                height: "80vh",
                width: "80%",
                left: "10vw",
                top: "10vh",
                "z-index": "9999",
                "background-color": "white",
                "border-color": "black",
                border: "5px solid black",
                "border-radius": "20px",
                display: "none",
                "text-align": "center",
                "overflow-y": "auto",
            })

        //標頭
        $("<div>")
            .prop({
                className: `studentStatus_${studentId}`,
                innerHTML: `<h1>Student File</h1><h5>${studentId}</h5>`,
            })
            .css({
                "background-color": "rgba(255,200,200,0.5)",
                height: "130px",
                "font-family": "Silkscreen, cursive",
                "padding-top": "30px",
            })
            .appendTo(studentStatusContainer)
        //任務執行 大標題
        $("<div>")
            .prop({
                className: "missionTitle",
                innerHTML: "<h1>任務執行狀況</h1>",
            })
            .css({
                "margin-top": "10px",
            })
            .appendTo(studentStatusContainer)
        //任務Row外框
        const studentMissionRow = $("<div>")
            .prop({
                className: "row justify-content-center",
            })
            .css({
                display: "flex",
            })
            .appendTo(studentStatusContainer)
        //框架css
        const lessThenFour = {
            padding: "10px 30px",
            margin: "10px",
            "border-radius": "10px",
            "background-color": "rgba(245,245,79,0.5)",
            width: "500px",
        }
        const moreThenFour = {
            padding: "10px 25px",
            margin: "10px",
            "border-radius": "10px",
            "background-color": "rgba(245,245,79,0.5)",
            width: "280px",
        }
        response.data.missionContent.map((studentMission, missionIndex) => {
            //任務外框
            const missionDiv = $("<div>")
                .prop({
                    className: "missionDiv",
                    id: `mission_${missionIndex}`,
                })
                .css(
                    response.data.missionName.length >= 4
                        ? moreThenFour
                        : lessThenFour
                )
                .appendTo(studentMissionRow)
            //任務名稱
            $("<h3>")
                .prop({
                    className: `missionTitle_${missionIndex}`,
                    innerHTML: `${
                        response.data.missionName[studentMission[0]]
                    }`,
                })
                .css({
                    "border-bottom": "1px solid black",
                    padding: "30px 0",
                    "font-weight": "bolder",
                })
                .appendTo(missionDiv)

            response.data.missionName[studentMission[0]] = ""
            //任務內容 (包含任務步驟 執行內容)
            const missionText = $("<div>")
                .prop({
                    className: `missionText_${missionIndex}`,
                })
                .css({
                    "margin-top": "20px",
                })
                .appendTo(missionDiv)
            studentMission.map((contentValue, contentIndex) => {
                //index 0 為辯識 mission 的 Id
                if (contentIndex > 0) {
                    //missionStep 外框
                    const missionStep = $("<div>")
                        .prop({
                            className: `missionStep_${contentIndex}`,
                            innerHTML: `<h5><strong>${contentIndex}、${contentValue}</strong></h5>`,
                        })
                        .css({
                            margin: "20px 0",
                            padding: "10px",
                            border: "1px dashed rgba(0,0,0,0.4)",
                            "border-radius": "10px",
                        })
                        .appendTo(missionText)
                    //mission執行內容˙
                    if (
                        response.data.manageContent[missionIndex] != undefined
                    ) {
                        $("<p>")
                            .prop({
                                className: `missionCotent_${contentIndex}`,
                                innerHTML:
                                    response.data.manageContent[missionIndex][
                                        contentIndex
                                    ],
                            })
                            .css({
                                "word-break": "break-all",
                            })
                            .appendTo(missionStep)
                    }
                    if (contentIndex < studentMission.length - 1) {
                        $("<div>")
                            .prop({
                                className: "arrowDown",
                                innerHTML:
                                    '<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>',
                            })
                            .css({
                                "margin-top": "10px",
                            })
                            .insertAfter(missionStep)
                    }
                }
            })
        })
        //補上未選擇任務
        response.data.missionName.map(missionName => {
            if (missionName != "") {
                //任務外框
                const missionDiv = $("<div>")
                    .prop({
                        className: "missionDiv",
                        id: `mission_noSelect`,
                    })
                    .css(
                        response.data.missionName.length >= 4
                            ? moreThenFour
                            : lessThenFour
                    )
                    .appendTo(studentMissionRow)
                //任務名稱
                $("<h3>")
                    .prop({
                        className: `missionTitle_noSelect`,
                        innerHTML: missionName,
                    })
                    .css({
                        "border-bottom": "1px solid black",
                        padding: "30px 0",
                        "font-weight": "bolder",
                    })
                    .appendTo(missionDiv)
                $("<h2>")
                    .prop({
                        className: "missionText_noSelect",
                        innerHTML: "<strong>未選擇該任務</strong>",
                    })
                    .appendTo(missionDiv)
            }
        })
        //任務Row外框
        const studentMindingRow = $("<div>")
            .prop({
                className: "row justify-content-center",
            })
            .css({
                display: "flex",
            })
            .appendTo(studentStatusContainer)
        //執行結果 大標題
        $("<div>")
            .prop({
                className: "missionTitle",
                innerHTML: "<h1>自我評價</h1>",
            })
            .css({
                "margin-top": "10px",
            })
            .appendTo(studentMindingRow)
        if (response.data.mindingContent.studentMinding != undefined) {
            response.data.mindingContent.studentMinding.map(
                (mindingContent, mindingIndex) => {
                    console.log(missionName)
                    //任務外框
                    const mindingDiv = $("<div>")
                        .prop({
                            className: "mindingDiv",
                            id: `minding_${mindingIndex}`,
                        })
                        .css(
                            response.data.mindingContent.studentMinding
                                .length >= 4
                                ? moreThenFour
                                : lessThenFour
                        )
                        .appendTo(studentMindingRow)
                    //任務名稱
                    $("<h3>")
                        .prop({
                            className: `mindingTitle_${mindingIndex}`,
                            innerHTML: `${
                                missionName[
                                    parseInt(mindingContent.missionName)
                                ]
                            }`,
                        })
                        .css({
                            "border-bottom": "1px solid black",
                            padding: "30px 0",
                            "font-weight": "bolder",
                        })
                        .appendTo(mindingDiv)
                    //未完成原因 or 完成
                    mindingContent.missionComplete
                        ? mindingDiv.addClass("missionComplete")
                        : mindingDiv.addClass("missionUncomplete")
                    $("<h4>")
                        .prop({
                            className: `missionReason_${mindingIndex}`,
                            innerHTML: mindingContent.missionComplete
                                ? '<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="80px" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M634 276.8l-9.999-13.88L624 185.7c0-11.88-12.5-19.49-23.12-14.11c-10.88 5.375-19.5 13.5-26.38 23l-65.75-90.92C490.6 78.71 461.8 64 431 64H112C63.37 64 24 103.4 24 152v86.38C9.5 250.1 0 267.9 0 288v32h8c35.38 0 64-28.62 64-64L72 152c0-16.88 10.5-31.12 25.38-37C96.5 119.1 96 123.5 96 128l.0002 304c0 8.875 7.126 16 16 16h63.1c8.875 0 16-7.125 16-16l.0006-112c9.375 9.375 20.25 16.5 32 21.88V368c0 8.875 7.252 16 16 16c8.875 0 15.1-7.125 15.1-16v-17.25c9.125 1 12.88 2.25 32-.125V368c0 8.875 7.25 16 16 16c8.875 0 16-7.125 16-16v-26.12C331.8 336.5 342.6 329.2 352 320l-.0012 112c0 8.875 7.125 16 15.1 16h64c8.75 0 16-7.125 16-16V256l31.1 32l.0006 41.55c0 12.62 3.752 24.95 10.75 35.45l41.25 62C540.8 440.1 555.5 448 571.4 448c22.5 0 41.88-15.88 46.25-38l21.75-108.6C641.1 292.8 639.1 283.9 634 276.8zM377.3 167.4l-22.88 22.75C332.5 211.8 302.9 224 272.1 224S211.5 211.8 189.6 190.1L166.8 167.4C151 151.8 164.4 128 188.9 128h166.2C379.6 128 393 151.8 377.3 167.4zM576 352c-8.875 0-16-7.125-16-16s7.125-16 16-16s16 7.125 16 16S584.9 352 576 352z"/></svg>' +
                                  '<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="80px" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M432 96H384V64c0-17.67-14.33-32-32-32H64C46.33 32 32 46.33 32 64v352c0 35.35 28.65 64 64 64h224c35.35 0 64-28.65 64-64v-32.08l80.66-35.94C493.5 335.1 512 306.5 512 275V176C512 131.8 476.2 96 432 96zM160 368C160 376.9 152.9 384 144 384S128 376.9 128 368v-224C128 135.1 135.1 128 144 128S160 135.1 160 144V368zM224 368C224 376.9 216.9 384 208 384S192 376.9 192 368v-224C192 135.1 199.1 128 208 128S224 135.1 224 144V368zM288 368c0 8.875-7.125 16-16 16S256 376.9 256 368v-224C256 135.1 263.1 128 272 128S288 135.1 288 144V368zM448 275c0 6.25-3.75 12-9.5 14.62L384 313.9V160h48C440.9 160 448 167.1 448 176V275z"/></svg>'
                                : "未完成原因 : " +
                                  mindingContent.missionReason,
                        })
                        .appendTo(mindingDiv)
                }
            )
        }

        //未完成紀錄外框
        const uncompleteDiv = $("<div>")
            .prop({
                className: "minding_UncompleteRemark",
            })
            .css({
                padding: "10px 30px",
                margin: "10px",
                "border-radius": "10px",
                "background-color": "rgba(0,0,0,0.3)",
                width: "400px",
            })
            .appendTo(studentMindingRow)
        ////未完成紀錄Title
        $("<h3>")
            .prop({
                className: "mindingFixingTitle",
                innerHTML: "未完成紀錄",
            })
            .css({
                "border-bottom": "1px solid black",
                padding: "30px 0",
                "font-weight": "bolder",
            })
            .appendTo(uncompleteDiv)
        ////未完成紀錄Text
        $("<h4>")
            .prop({
                className: "mindingFixingText",
                innerHTML: response.data.mindingContent.studentFixing,
            })
            .appendTo(uncompleteDiv)
        ////自我評分分數
        $("<h4>")
            .prop({
                className: "mindingRanking",
                innerHTML:
                    "<strong>自我評分 : " +
                    response.data.mindingContent.studentRanking
                        ? response.data.mindingContent.studentRanking
                        : 0 + " 分</strong>",
            })
            .css({
                "margin-top": "10px",
                padding: "10px 0",
                "border-top": "1px dashed rgba(0,0,0,0.3)",
            })
            .appendTo(uncompleteDiv)

        const studentStatusBlock = $("<div>")
            .prop({
                className: "container-fluid",
            })
            .css({
                position: "absolute",
                "background-color": "rgba(0,0,0,0.5)",
                overflow: "hidden",
                "z-index": "9998",
                display: "none",
                width: "100vw",
                height: "100vh",
            })
            .click(e => {
                studentStatusBlock.fadeOut(200)
                studentStatusContainer.fadeOut(200)
                setTimeout(e => {
                    studentStatusBlock.remove()
                    studentStatusContainer.remove()
                }, 200)
            })

        //動畫顯現
        $("body").prepend(studentStatusBlock).prepend(studentStatusContainer)
        studentStatusBlock.fadeIn(200)
        studentStatusContainer.fadeIn(200)
        loadingPage(false)
    })
}
//render 回復學生狀態
function renderTeacherandStudentResponse(studentId, week) {
    getTeacherResponse(studentId, week).then(response => {
        console.log(response.data)
        const responseContainer = $("<div>")
            .prop({
                className: "container",
            })
            .css({
                position: "absolute",
                height: "80vh",
                left: "15vw",
                top: "10vh",
                "z-index": "9999",
                "background-color": "white",
                "border-color": "black",
                border: "5px solid black",
                "border-radius": "20px",
                display: "none",
                "text-align": "center",
                "overflow-y": "auto",
            })
        //標頭
        $("<div>")
            .prop({
                className: `studentStatus_${studentId}`,
                innerHTML: `<h1>Teacher Response</h1><h5>${studentId}</h5>`,
            })
            .css({
                "background-color": "rgba(255,200,200,0.5)",
                height: "130px",
                "font-family": "Silkscreen, cursive",
                "padding-top": "30px",
            })
            .appendTo(responseContainer)

        const responseTextDiv = $("<div>")
            .prop({
                className: "responseText",
            })
            .css({
                width: "100%",
                height: "60%",
                display: "flex",
                margin: "20px auto",
                "justify-content": "space-around",
            })
            .appendTo(responseContainer)

        $("<textarea>")
            .prop({
                className: "teacherResponseText",
                innerHTML: response.data.teacherResponse
                    ? response.data.teacherResponse
                    : "",
                placeholder: "請寫下對學生的回覆以及評價",
            })
            .css({
                width: "40%",
                height: "100%",
                padding: "15px",
                border: "1px dashed rgba(0,0,0,0.3)",
                "border-radius": "20px",
                "transition-duration": "0.5s",
                resize: "none",
            })
            .appendTo(responseTextDiv)

        $("<textarea>")
            .prop({
                className: "studentResponseText",
                innerHTML: response.data.studentResponse
                    ? response.data.studentResponse
                    : "學生無回覆",
                disabled: "disabled",
            })
            .css({
                width: "40%",
                height: "100%",
                padding: "15px",
                border: "1px solid rgba(0,0,0,0.3)",
                "border-radius": "20px",
                "transition-duration": "0.5s",
                resize: "none",
            })
            .appendTo(responseTextDiv)

        const responseTimeText = $("<div>")
            .prop({
                className: "responseTime",
                innerHTML: "時間戳記",
            })
            .css({
                "text-align": "left",
            })
            .appendTo(responseContainer)
        $("<div>")
            .prop({
                className: "responseTime_teacher",
                innerHTML:
                    "老師最後留言時間:" +
                    (response.data.teacherResponseTime
                        ? response.data.teacherResponseTime
                        : "無時間戳記"),
            })
            .appendTo(responseTimeText)
        $("<div>")
            .prop({
                className: "responseTime_student",
                innerHTML:
                    "學生最後留言時間:" +
                    (response.data.studentResponseTime
                        ? response.data.studentResponseTime
                        : "無時間戳記"),
            })
            .appendTo(responseTimeText)

        ////data儲存按鈕
        $("<button>")
            .prop({
                className: "btn btn-info",
                innerHTML: "儲存回覆",
            })
            .css({
                margin: "0 auto",
                "margin-bottom": "10px",
                width: "50%",
            })
            .click(e => {
                loadingPage(true)
                uploadResponse(studentId, week).then(response => {
                    window.alert(response.data)
                    loadingPage(false)
                    responseBlock.fadeOut(200)
                    responseContainer.fadeOut(200)
                    setTimeout(e => {
                        responseBlock.remove()
                        responseContainer.remove()
                    }, 200)
                })
            })
            .appendTo(responseContainer)

        const responseBlock = $("<div>")
            .prop({
                className: "container-fluid",
            })
            .css({
                position: "absolute",
                "background-color": "rgba(0,0,0,0.5)",
                overflow: "hidden",
                "z-index": "9998",
                display: "none",
                width: "100vw",
                height: "100vh",
            })
            .click(e => {
                responseBlock.fadeOut(200)
                responseContainer.fadeOut(200)
                setTimeout(e => {
                    responseBlock.remove()
                    responseContainer.remove()
                }, 200)
            })

        //動畫顯現
        $("body").prepend(responseBlock).prepend(responseContainer)
        responseBlock.fadeIn(200)
        responseContainer.fadeIn(200)
        loadingPage(false)
    })
}
// //render 學生回覆
// function renderStudentResponse(studentId, week) {
//     getTeacherResponse(studentId, week).then(response => {
//         const responseContainer = $("<div>")
//             .prop({
//                 className: "container",
//             })
//             .css({
//                 position: "absolute",
//                 height: "80vh",
//                 left: "15vw",
//                 top: "10vh",
//                 "z-index": "9999",
//                 "background-color": "white",
//                 "border-color": "black",
//                 border: "5px solid black",
//                 "border-radius": "20px",
//                 display: "none",
//                 "text-align": "center",
//                 "overflow-y": "auto",
//             })
//         //標頭
//         $("<div>")
//             .prop({
//                 className: `studentStatus_${studentId}`,
//                 innerHTML: `<h1>Student Response</h1><h5>${studentId}</h5>`,
//             })
//             .css({
//                 "background-color": "rgba(255,200,200,0.5)",
//                 height: "130px",
//                 "font-family": "Silkscreen, cursive",
//                 "padding-top": "30px",
//             })
//             .appendTo(responseContainer)

//         //任務執行 大標題
//         $("<div>")
//             .prop({
//                 className: "teacherResponseTitle",
//                 innerHTML: "<h1>學生回覆</h1>",
//             })
//             .css({
//                 "margin-top": "10px",
//             })
//             .appendTo(responseContainer)

//         $("<div>")
//             .prop({
//                 className: "teacherResponseText",
//                 innerHTML: response.data.studentResponse
//                     ? response.data.studentResponse
//                     : "學生無給予回饋",
//             })
//             .css({
//                 width: "100%",
//                 height: "60%",
//                 padding: "15px",
//                 border: "1px dashed rgba(0,0,0,0.3)",
//                 "border-radius": "20px",
//                 "transition-duration": "0.5s",
//                 "font-size": "20px",
//             })
//             .appendTo(responseContainer)

//         const responseBlock = $("<div>")
//             .prop({
//                 className: "container-fluid",
//             })
//             .css({
//                 position: "absolute",
//                 "background-color": "rgba(0,0,0,0.5)",
//                 overflow: "hidden",
//                 "z-index": "9998",
//                 display: "none",
//                 width: "100vw",
//                 height: "100vh",
//             })
//             .click(e => {
//                 responseBlock.fadeOut(200)
//                 responseContainer.fadeOut(200)
//                 setTimeout(e => {
//                     responseBlock.remove()
//                     responseContainer.remove()
//                 }, 200)
//             })

//         //動畫顯現
//         $("body").prepend(responseBlock).prepend(responseContainer)
//         responseBlock.fadeIn(200)
//         responseContainer.fadeIn(200)
//         loadingPage(false)
//     })
// }
//變換月份
function weekSwitchClickBtn(week) {
    $(".studentListDiv").fadeOut(200)
    setTimeout(() => {
        $(".studentListDiv").remove()
        loadingAllStudent($("#response_session").val()).then(response => {
            $(".adminContainer").append(
                renderResponseStudentList(response.data, week)
            )
            loadingPage(false)
        })
    }, 200)
}

//render 上方搜尋列表
function renderResponseSearch() {
    function renderQuestionData() {
        const closePage = e => {
            questionDataBlock.fadeOut(200)
            questionDataContainer.fadeOut(200)
            setTimeout(e => {
                questionDataContainer.remove()
                questionDataBlock.remove()
            }, 200)
        }
        const questionDataBlock = $("<div>")
            .prop({
                className: "questionDataBlock",
            })
            .css({
                overflow: "hidden",
                width: "100vw",
                height: "100vh",
                position: "fixed",
                "z-index": "1000",
                "background-color": "rgba(0,0,0,0.5)",
            })
            .click(e => closePage())

            .prependTo($("body"))

        const questionDataContainer = $("<div>")
            .prop({
                className: "questionDataContainer",
            })
            .css({
                margin: "0 25vw",
                "margin-top": `calc(${window.pageYOffset}px + 50px)`,
                overflow: "hidden",
                display: "flex",
                "align-items": "flex-end",
                "justify-content": "center",
                position: "fixed",
                width: "50vw",
                height: "80vh",
                "z-index": "1001",
            })
            .prependTo($("body"))

        //Main div for question
        const questionDataDiv = $("<div>")
            .prop({
                className: "questionDataDiv",
            })
            .css({
                "background-color": "white",
                "border-radius": "20px",
                height: "100%",
                width: "100%",
                "text-align": "center",
                padding:'24px'
            })
            .appendTo(questionDataContainer)

        $("<h1>")
            .prop({
                className: "question_title",
                innerHTML: "Questions",
            })
            .appendTo(questionDataDiv)

        //Well Done
        $("<h3>")
            .prop({
                className: "question_subtitle",
                innerHTML: "Well Done",
            })
            .appendTo(questionDataDiv)
        //Well Done Content
        $("<p>")
            .prop({
                className: "question_contents",
                innerHTML:
                    "<button class='btn btn-success'>師生回覆</button> : 學生有給予老師回覆<br/>" +
                    "<button class='btn btn-outline-success'>師生回覆</button> : 學生未給老師回覆但已閱讀老師回覆",
            })
            .appendTo(questionDataDiv)
        //Feed Back
        $("<h3>")
            .prop({
                className: "question_subtitle",
                innerHTML: "Feed Back",
            })
            .appendTo(questionDataDiv)
        //Feed Back Content
        $("<p>")
            .prop({
                className: "question_contents",
                innerHTML:
                "<button class='btn btn-success'>師生回覆</button> : 老師已完成對學生的回覆<br/>" +
                "<button class='btn btn-outline-success'>師生回覆</button> : 學生已完成且老師尚未給予回覆",
            })
            .appendTo(questionDataDiv)
        //Not Yet
        $("<h3>")
        .prop({
            className: "question_subtitle",
            innerHTML: "Not Yet",
        })
        .appendTo(questionDataDiv)
        //Not Yet Content
        $("<p>")
            .prop({
                className: "question_contents",
                innerHTML:
                "<button class='btn btn-success'>師生回覆</button> : 老師已完成對學生的回覆<br/>" +
                "<button class='btn btn-outline-success'>師生回覆</button> : 學生未完成且老師尚未給予回覆",
            })
            .appendTo(questionDataDiv)
    }

    const responseBarContainer = $("<div>")
        .prop({
            className: "btnContainer",
        })
        .css({
            "margin-top": "50px",
            width: "100%",
            height: "50px",
            display: "flex",
            "justify-content": "space-around",
        })
    //選擇屆數
    const changeStudentsSession = $("<select>")
        .prop({
            className: "form-select",
            id: "response_session",
            ariaLabel: "Default select example",
        })
        .css({
            width: "20%",
            margin: "0",
        })
        .change(e => {
            loadingPage(true)
            changeResponsetList(e.target.value)
        })
        .appendTo(responseBarContainer)
    //閱覽所有屆數
    sessionCount().then(response => {
        for (let sessionConfig of response.data) {
            if (sessionConfig.active) {
                $("<option selected>")
                    .prop({
                        value: sessionConfig.session,
                        innerHTML: `第 ${sessionConfig.session} 屆`,
                    })
                    .appendTo(changeStudentsSession)
            } else {
                $("<option>")
                    .prop({
                        value: sessionConfig.session,
                        innerHTML: `第 ${sessionConfig.session} 屆`,
                    })
                    .appendTo(changeStudentsSession)
            }
        }
    })

    //選擇星期
    const chanageWeekData = $("<select>")
        .prop({
            className: "form-select",
            id: "response_week",
            ariaLabel: "Default select example",
        })
        .css({
            width: "40%",
            margin: "0",
        })
        .change(e => {
            loadingPage(true)
            weekSwitchClickBtn(e.target.value)
        })
        .appendTo(responseBarContainer)
    for (let i = 1; i <= 5; i++) {
        if (i == weekCount()) {
            $("<option selected>")
                .prop({
                    value: i,
                    innerHTML: `<h2>Progress ${i}</h2>`,
                })
                .appendTo(chanageWeekData)
        } else {
            $("<option>")
                .prop({
                    value: i,
                    innerHTML: `<h2>Progress ${i}</h2>`,
                })
                .appendTo(chanageWeekData)
        }
    }

    //疑難問答區
    const questionData = $("<div>")
        .prop({
            className: "response_questionData",
            innerHTML:
                '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32z"/></svg>',
        })
        .css({
            width: "5%",
            margin: "0",
            "border-radius": "20px",
            "transition-duration": "0.5s",
        })
        .hover(
            e => {
                questionData.css({
                    "background-color": "rgba(255,255,255,0.5)",
                })
            },
            e => {
                questionData.css({
                    "background-color": "transparent",
                })
            }
        )
        .click(e => {
            renderQuestionData()
        })
        .appendTo(responseBarContainer)

    //Btn 外框
    const responseSearchDiv = $("<div>")
        .prop({
            className: "responseSearchDiv",
            innerHTML: "<h1>Student Feedback</h1>",
        })
        .css({
            "background-color": "rgba(0, 0, 0, 0.3)",
            "border-radius": "20px",
            width: "95vw",
            height: "160px",
            "text-align": "center",
            margin: "0 auto",
        })
        .append(responseBarContainer)

    return responseSearchDiv
}
//render 下方學生列表
function renderResponseStudentList(studentDetail, Week) {
    //學生資料外框
    const studentListDiv = $("<div>")
        .prop({
            className: "studentListDiv",
        })
        .css({
            width: "100vw",
            margin: "0 auto",
            "margin-top": "30px",
            height: "65vh",
            "overflow-y": "auto",
        })

    const studentStatusCss = {
        margin: "0 auto",
        "margin-bottom": "15px",
        "transition-duration": "0.3s",
        "border-bottom": "3px solid rgba(0,0,0,0.4)",
        width: "95%",
        "user-select": "none",
        display: "flex",
        "font-family": '"Silkscreen", cursive',
    }
    const studentOutline = (
        className,
        svgId,
        Name,
        countingData,
        countingWeek,
        countingName,
        listClass,
        listArrow
    ) => {
        return $("<div>")
            .prop({
                className: className,
                innerHTML:
                    `<svg id="${svgId}" xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" style="margin-right:15px" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>` +
                    `<h1 style="margin-right:20px;">${Name}</h1>` +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="30px" height="50px" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>' +
                    countingMembers(countingData, countingWeek, countingName),
            })
            .css(studentStatusCss)
            .hover(
                e => {
                    studentWellDone.css({
                        "transition-duration": "0.3s",
                        "background-color": "rgba(255,255,255,0.8)",
                    })
                },
                e => {
                    studentWellDone.css({
                        "transition-duration": "0.3s",
                        "background-color": "rgba(255,255,255,0)",
                    })
                }
            )
            .click(e => {
                openStudentList(listClass, listArrow)
            })
    }
    //學生已全部完成
    const studentWellDone = studentOutline(
        "studentWellDoneLine",
        "ArrowDownIcon_wellDone",
        "Well Done",
        studentDetail,
        Week,
        "well done",
        ".studentDataContainer_wellDone",
        "#ArrowDownIcon_wellDone"
    ).appendTo(studentListDiv)
    //學生待回覆
    const studentFeedBack = studentOutline(
        "studentFeedBackLine",
        "ArrowDownIcon_feedback",
        "Feedback",
        studentDetail,
        Week,
        "feed back",
        ".studentDataContainer_feedback",
        "#ArrowDownIcon_feedback"
    ).appendTo(studentListDiv)
    //學生未完成
    const studentNotYet = studentOutline(
        "studentNotYet",
        "ArrowDownIcon_notYet",
        "Not Yet",
        studentDetail,
        Week,
        "not yet",
        ".studentDataContainer_notYet",
        "#ArrowDownIcon_notYet"
    ).appendTo(studentListDiv)

    studentDetail.reverse()
    studentDetail.map(async (studentData, studentIndex) => {
        //學生序號
        const studentNumber = $("<div>").prop({
            className: "studentData_Number",
            id: `studentNumber_${studentIndex}`,
            innerHTML: `${studentDetail.length - studentIndex}`,
        })
        //學生ID
        const studentId = $("<div>").prop({
            className: "studentData_Id",
            id: `studentId_${studentIndex}`,
            innerHTML: studentData.studentId,
        })
        //學生姓名
        const studentName = $("<div>").prop({
            className: "studentData_Name",
            id: `studentName_${studentIndex}`,
            innerHTML: studentData.studentName,
        })
        //設定狀態
        const studentDetails = $("<button>")
            .prop({
                className: "btn btn-outline-primary",
                id: "checkStudentStatus",
                innerHTML: "學習狀況",
            })
            .css({
                width: "35%",
                height: "40px",
            })
            .click(e => {
                loadingPage(true)
                renderStudentStatus(studentData.studentId, Week)
            })
        //學生回覆
        let isResponse = false
        await isResendToTeacher(studentData.studentId, Week).then(response => {
            isResponse = response
        })
        const studentResponse = $("<button>")
            .prop({
                className: isResponse
                    ? "btn btn-success"
                    : "btn btn-outline-success",
                id: "studentResponse",
                innerHTML: "師生回覆",
            })
            .css({
                width: "35%",
                height: "40px",
            })
            .click(e => {
                loadingPage(true)
                renderTeacherandStudentResponse(studentData.studentId, Week)
            })
        //Well Done
        if (isDoneThisWeek(studentData.studentDetail[Week - 1])) {
            //設定學生//
            const studentSetting = $("<div>")
                .prop({
                    className: "studentData_Setting",
                    id: "responseSetting",
                })
                .append(studentDetails)
                .append(studentResponse)

            //學生資料表格框
            $("<div>")
                .prop({
                    className: "studentDataContainer_wellDone",
                    id: `student_${studentIndex}`,
                })
                .css({
                    width: "95vw",
                    "background-color": "rgba(255,255,255,0.9)",
                    border: "3px solid rgb(161, 160, 158)",
                    "border-radius": "20px",
                    height: "70px",
                    display: "none",
                    "justify-content": "space-around",
                    margin: "0 auto",
                    "margin-bottom": "15px",
                    "text-align": "center",
                    "user-select": "none",
                })
                .append(studentNumber)
                .append(studentId)
                .append(studentName)
                .append(studentSetting)
                .insertAfter(studentWellDone)
        }
        //FeedBack
        else if (isFeedBackWeek(studentData.studentDetail[Week - 1])) {
            //設定學生//
            const studentSetting = $("<div>")
                .prop({
                    className: "studentData_Setting",
                    id: "responseSetting",
                })
                .append(studentDetails)
                .append(studentResponse)

            //學生資料表格框
            $("<div>")
                .prop({
                    className: "studentDataContainer_feedback",
                    id: `student_${studentIndex}`,
                })
                .css({
                    width: "95vw",
                    "background-color": "rgba(255,255,255,0.9)",
                    border: "3px solid rgb(161, 160, 158)",
                    "border-radius": "20px",
                    height: "70px",
                    display: "none",
                    "justify-content": "space-around",
                    margin: "0 auto",
                    "margin-bottom": "15px",
                    "text-align": "center",
                    "user-select": "none",
                })
                .append(studentNumber)
                .append(studentId)
                .append(studentName)
                .append(studentSetting)
                .insertAfter(studentFeedBack)
        }
        //not Yet
        else {
            //設定學生//
            const studentSetting = $("<div>")
                .prop({
                    className: "studentData_Setting",
                    id: "responseSetting",
                })
                .append(studentDetails)
                .append(studentResponse)

            //學生資料表格框
            $("<div>")
                .prop({
                    className: "studentDataContainer_notYet",
                    id: `student_${studentIndex}`,
                })
                .css({
                    width: "95vw",
                    "background-color": "rgba(255,255,255,0.9)",
                    border: "3px solid rgb(161, 160, 158)",
                    "border-radius": "20px",
                    height: "70px",
                    display: "none",
                    "justify-content": "space-around",
                    margin: "0 auto",
                    "margin-bottom": "15px",
                    "text-align": "center",
                    "user-select": "none",
                })
                .append(studentNumber)
                .append(studentId)
                .append(studentName)
                .append(studentSetting)
                .insertAfter(studentNotYet)
        }
    })

    return studentListDiv
}
//----------------------------------------------
//main function---------------------------------
//render stundetList main function
function renderResponsePage(studentData) {
    const pageContainer = $(".adminContainer")

    pageContainer.append(renderResponseSearch())

    pageContainer.append(renderResponseStudentList(studentData, weekCount()))
}
//loading stundetList main function
function loadingResponse() {
    loadingPage(true)
    sessionCount().then(response => {
        for (let sessionConfig of response.data) {
            if (sessionConfig.active) {
                loadingAllStudent(sessionConfig.session)
                    .then(response => {
                        renderResponsePage(response.data)
                    })
                    .then(() => {
                        loadingPage(false)
                        $(".adminContainer").fadeIn(300)
                    })
            }
        }
    })
}

$("#Response").click(e => {
    $(".adminContainer").fadeOut(300)
    setTimeout(() => {
        $(".adminContainer").empty()
        loadingResponse()
    }, 300)
})
//-----------------------------------------------
