//render 左側任務是否完成區域
function renderMindingManage(studentMission) {
    const missionData = Object.values(studentMission)

    //return 數字Mission轉文字MissionName
    async function switchValuetoName(Id) {
        const dataWeek = $('.WeekTitle').html().split(" ")[1]

        let returnData
        await axios({
            method: 'post',
            url: '/student/readmission',
            data: {
                week: dataWeek,
            },
            withCredentials: true
        }).then((response) => {
            returnData = response.data.mission[Id].title
        })
        return returnData
    }

    //上傳任務是否完成，於按勾選鈕時觸發
    async function uploadCompleteInfo(missionId, missionComplete) {
        let uploadStudentMission = studentMission
        uploadStudentMission[missionId].missionComplete = missionComplete
        missionComplete ? uploadStudentMission[missionId].missionReason = "" : null

        let isSuccess = false

        await axios({
            method: 'post',
            url: '/student/addminding',
            data: {
                week: $('.WeekTitle').html().split(" ")[1],
                studentMinding: uploadStudentMission
            },
            withCredentials: true
        }).then((response) => {
            isSuccess = response.data
        })

        return isSuccess
    }

    //mindingManage外框
    const mindingManageDiv = $('<div>').prop({
        className: 'mindingManageContainer',
    }).css({
        'width': '95%',
        'height': '90%',
        'margin': '0 auto',
        'margin-top': '15px',
        'border-radius': '20px',
    })

    //css for missionData
    const missionBtn_display = {
        'transition-duration': '0.3s',
        'width': '5%',
        'height': '70%',
        'margin-top': '10px',
        'border-radius': '10px',
    }
    const missionBtn_hidden = {
        'transition-duration': '0.3s',
        'width': '5%',
        'height': '70%',
        'margin-top': '10px',
        'border-radius': '10px',
        'display': 'none'
    }
    const missionTextarea_display = {
        'width': '70%',
        'height': '100%',
        'resize': 'none',
        'border': '1px dashed rgba(0,0,0,0.3)',
        'border-radius': '10px',
        'transition-duration': '0.5s'
    }
    const missionTextarea_hidden = {
        'width': '70%',
        'height': '100%',
        'resize': 'none',
        'border': '1px dashed rgba(0,0,0,0.3)',
        'border-radius': '10px',
        'transition-duration': '0.5s',
        'display': 'none'
    }
    const missionTextDiv_display = {
        'width': '70%',
        'height': '100%',
        'resize': 'none',
        'border-radius': '10px',
        'transition-duration': '0.5s',
    }
    const missionTextDiv_hidden = {
        'width': '70%',
        'height': '100%',
        'resize': 'none',
        'border-radius': '10px',
        'transition-duration': '0.5s',
        'display': 'none'
    }
    //內容
    missionData.map(async (dataValue, dataIndex) => {
        //missionCompleteBtn
        const missionCompleteBtn = $('<div>').prop({
            className: 'missionBtn',
            id: `missionBtn_${dataValue.missionName}_complete`,
            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="45%" height="100%" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M211.8 339.8C200.9 350.7 183.1 350.7 172.2 339.8L108.2 275.8C97.27 264.9 97.27 247.1 108.2 236.2C119.1 225.3 136.9 225.3 147.8 236.2L192 280.4L300.2 172.2C311.1 161.3 328.9 161.3 339.8 172.2C350.7 183.1 350.7 200.9 339.8 211.8L211.8 339.8zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z"/></svg>'
        }).css(dataValue.missionComplete ? missionBtn_display : missionBtn_hidden).hover((e) => {
            missionCompleteBtn.css({
                'transition-duration': '0.3s',
                'background-color': 'rgba(13, 202, 240,0.5)'
            })
        }, (e) => {
            missionCompleteBtn.css({
                'background-color': 'rgba(13, 202, 240,0)'
            })
        }).mousedown((e) => {
            e.preventDefault()
            loadingPage(true)
            mindingCompleteContent.fadeOut(300)

            uploadCompleteInfo(dataValue.missionName, false).then((response) => {
                if (!response) {
                    window.alert("網路錯誤，請重新整理")
                    return
                }
                setTimeout(() => {
                    mindingUncompleteContent.fadeIn(300)
                    missionCompleteBtn.css({
                        'display': 'none'
                    })
                    missionUncompleteBtn.css({
                        'display': 'block'
                    })
                    mindingMissionDiv.removeClass('missionComplete')
                    loadingPage(false)
                }, 300)
            })

        })
        //missionUnCompleteBtn
        const missionUncompleteBtn = $('<div>').prop({
            className: 'missionBtn',
            id: `missionBtn_${dataValue.missionName}_uncomplete`,
            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="45%" height="100%" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM384 80H64C55.16 80 48 87.16 48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80z" /></svg>'
        }).css(dataValue.missionComplete ? missionBtn_hidden : missionBtn_display).hover((e) => {
            missionUncompleteBtn.css({
                'transition-duration': '0.3s',
                'background-color': 'rgba(13, 202, 240,0.5)'
            })
        }, (e) => {
            missionUncompleteBtn.css({
                'background-color': 'rgba(13, 202, 240,0)'
            })
        }).mousedown((e) => {
            e.preventDefault()
            loadingPage(true)
            mindingUncompleteContent.fadeOut(300)
            uploadCompleteInfo(dataValue.missionName, true).then((response) => {
                if (!response) {
                    window.alert("網路錯誤，請重新整理")
                    return
                }
                setTimeout(() => {
                    mindingCompleteContent.fadeIn(300)
                    missionCompleteBtn.css({
                        'display': 'block'
                    })
                    missionUncompleteBtn.css({
                        'display': 'none'
                    })
                    mindingMissionDiv.addClass('missionComplete')
                    loadingPage(false)
                }, 300)
            })

        })
        //--------------------------------------------------
        //missionName
        const mindingMissionName = $('<div>').prop({
            className: 'missionName',
            innerHTML: await switchValuetoName(dataValue.missionName)
        }).css({
            'transition-duration': '0.3s',
            'user-select': 'none',
            'width': '20%',
            'height': '100%',
            'line-height': '400%',
            'font-size': '20px',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
            'text-align': 'left'
        })
        //---------------------------------------------------
        //missionUncompletedTextArea
        const mindingUncompleteContent = $('<textarea>').prop({
            className: 'missionTextarea',
            id: `mission_${dataValue.missionName}_uncomplete`,
            placeholder: '請寫下任務未完成原因，若完成則按左方完成選項',
            value: dataValue.missionReason
        }).css(dataValue.missionComplete ? missionTextarea_hidden : missionTextarea_display).hover((e) => {
            mindingUncompleteContent.css({
                'transition-duration': '0.5s',
                'border': '1.5px dashed rgba(0,0,0)'
            })
        }, (e) => {
            mindingUncompleteContent.css({
                'border': '1px dashed rgba(0,0,0,0.3)'
            })
        })
        //missionCompletedTextDiv
        const mindingCompleteContent = $('<div>').prop({
            className: 'missionTextarea',
            id: `mission_${dataValue.missionName}_complete`,
            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="100%" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M634 276.8l-9.999-13.88L624 185.7c0-11.88-12.5-19.49-23.12-14.11c-10.88 5.375-19.5 13.5-26.38 23l-65.75-90.92C490.6 78.71 461.8 64 431 64H112C63.37 64 24 103.4 24 152v86.38C9.5 250.1 0 267.9 0 288v32h8c35.38 0 64-28.62 64-64L72 152c0-16.88 10.5-31.12 25.38-37C96.5 119.1 96 123.5 96 128l.0002 304c0 8.875 7.126 16 16 16h63.1c8.875 0 16-7.125 16-16l.0006-112c9.375 9.375 20.25 16.5 32 21.88V368c0 8.875 7.252 16 16 16c8.875 0 15.1-7.125 15.1-16v-17.25c9.125 1 12.88 2.25 32-.125V368c0 8.875 7.25 16 16 16c8.875 0 16-7.125 16-16v-26.12C331.8 336.5 342.6 329.2 352 320l-.0012 112c0 8.875 7.125 16 15.1 16h64c8.75 0 16-7.125 16-16V256l31.1 32l.0006 41.55c0 12.62 3.752 24.95 10.75 35.45l41.25 62C540.8 440.1 555.5 448 571.4 448c22.5 0 41.88-15.88 46.25-38l21.75-108.6C641.1 292.8 639.1 283.9 634 276.8zM377.3 167.4l-22.88 22.75C332.5 211.8 302.9 224 272.1 224S211.5 211.8 189.6 190.1L166.8 167.4C151 151.8 164.4 128 188.9 128h166.2C379.6 128 393 151.8 377.3 167.4zM576 352c-8.875 0-16-7.125-16-16s7.125-16 16-16s16 7.125 16 16S584.9 352 576 352z"/></svg>' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="100%" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M432 96H384V64c0-17.67-14.33-32-32-32H64C46.33 32 32 46.33 32 64v352c0 35.35 28.65 64 64 64h224c35.35 0 64-28.65 64-64v-32.08l80.66-35.94C493.5 335.1 512 306.5 512 275V176C512 131.8 476.2 96 432 96zM160 368C160 376.9 152.9 384 144 384S128 376.9 128 368v-224C128 135.1 135.1 128 144 128S160 135.1 160 144V368zM224 368C224 376.9 216.9 384 208 384S192 376.9 192 368v-224C192 135.1 199.1 128 208 128S224 135.1 224 144V368zM288 368c0 8.875-7.125 16-16 16S256 376.9 256 368v-224C256 135.1 263.1 128 272 128S288 135.1 288 144V368zM448 275c0 6.25-3.75 12-9.5 14.62L384 313.9V160h48C440.9 160 448 167.1 448 176V275z"/></svg>'
        }).css(dataValue.missionComplete ? missionTextDiv_display : missionTextDiv_hidden)

        //mission任務欄
        const mindingMissionDiv = $('<div>').prop({
            className: `mission_${dataValue.missionName}`,
        }).css({
            'width': '100%',
            'height': '18%',
            'margin': '10px',
            'padding': '10px',
            'border-radius': '10px',
            'background-color': 'rgba(255,255,255,0.5)',
            'display': 'flex',
            'justify-content': 'space-between'
        })
            .append(missionCompleteBtn)
            .append(missionUncompleteBtn)
            .append(mindingMissionName)
            .append(mindingCompleteContent)
            .append(mindingUncompleteContent)
        dataValue.missionComplete ? mindingMissionDiv.addClass('missionComplete') : null

        mindingManageDiv.append(mindingMissionDiv)
    })

    return mindingManageDiv
}
//render 右上側目標修正區域
function renderManageFixing(studentFixing) {
    //manageFixing文字輸入區
    const manageFixingTextarea = $('<textarea>').prop({
        className: 'manageFixingTextarea',
        innerHTML: studentFixing,
        placeholder: '請輸入你認為下次的目標應該如何修正'
    }).css({
        'width': '90%',
        'height': '80%',
        'resize': 'none',
        'border': '1px dashed rgba(0,0,0,0.3)',
        'border-radius': '10px',
        'margin-top': '3%'
    }).hover((e) => {
        manageFixingTextarea.css({
            'transition-duration': '0.5s',
            'border': '1.5px dashed rgba(0,0,0)'
        })
    }, (e) => {
        manageFixingTextarea.css({
            'border': '1px dashed rgba(0,0,0,0.3)'
        })
    })
    //manageFixing外框
    const manageFixingDiv = $('<div>').prop({
        className: 'manageFixingContainer',
    }).css({
        'width': '100%',
        'height': '80%',
        'background-color': 'rgba(255,255,255,0.5)',
        'border-radius': '20px'
    }).append(manageFixingTextarea)

    return manageFixingDiv
}
//render 右下側自我評價
function renderManageRanking(studentRanking) {
    //manageRanking評分區
    const manageRankingScoring = $('<div>').prop({
        className: 'manageRankingScoring',
    }).css({
        'width': '90%',
        'height': '80%',
        'margin': '0 auto',
        'padding-top': '10%',
        'display': 'flex',
        'justify-content': 'space-around',
    })
    for (let i = 0; i < 5; i++) {
        const unSelectStar = '<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" /></svg>'
        const SelectStar = '<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"/></svg>'

        const rankingStar = $('<div>').prop({
            className: 'rankingStar',
            id: `rankingStar_${i}`,
            innerHTML: unSelectStar
        }).css({
            'width': '10%',
            'height': '60%',
        }).hover((e) => {
            e.stopPropagation()
            for (let star = 0; star < 5; star++) {
                if (star <= e.currentTarget.id.split("_")[1]) {
                    $(`#rankingStar_${star}`).html(SelectStar).addClass('rankingTotal')
                } else {
                    $(`#rankingStar_${star}`).html(unSelectStar).removeClass('rankingTotal')
                }
            }
        })
        if (i < studentRanking) {
            rankingStar.html(SelectStar).addClass('rankingTotal')
        }
        manageRankingScoring.append(rankingStar)
    }

    //manageRanking外框
    const manageRankingDiv = $('<div>').prop({
        className: 'manageRankingContainer',
    }).css({
        'width': '100%',
        'height': '80%',
        'background-color': 'rgba(255,255,255,0.5)',
        'border-radius': '20px'
    }).append(manageRankingScoring)

    return manageRankingDiv
}
//Click 確認是否已經完成過
async function stageBtnEnterForMission() {
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
        isDone = response.data[dataWeek].Status.Minding
    })
    return isDone
}
//上傳Minding
function uploadMinding(data) {
    let studentMindingData = data.studentMinding
    Object.keys(data.studentMinding).map((value) => {
        studentMindingData[value].missionReason = $(`#mission_${value}_uncomplete`).val()
    })

    const studentFixing = $('.manageFixingTextarea').val()
    const studentRanking = $('.rankingTotal').length
    loadingPage(true)

    axios({
        method: "POST",
        url: '/studentstage/mindingcomplete',
        data: {
            week: $('.WeekTitle').html()
        },
        withCredentials: true,
    }).then((response) => {
        axios({
            method: 'POST',
            url: '/student/addminding',
            data: {
                week: $('.WeekTitle').html().split(" ")[1],
                studentFixing: studentFixing,
                studentRanking: studentRanking,
                studentMinding: studentMindingData
            }
        }).then((response) => {
            if (!response.data) {
                window.alert('網路錯誤，請重新上傳')
            } else {
                window.location.href = `/dashboard/${$('#userId').html()}`
            }
        })
    })

}

//render Minding main function
function renderMindingPage(data) {
    const mindingManage = $('.mindingManage')
    const manageFixing = $('.manageFixing')
    const manageRanking = $('.manageRanking')

    //左側任務區
    mindingManage.append(renderMindingManage(data.studentMinding))
    //右側目標修正
    manageFixing.append(renderManageFixing(data.studentFixing))
    //右側自我評價
    manageRanking.append(renderManageRanking(data.studentRanking))
}

//loading Minding main function
function loadingMinding() {
    loadingPage(true)
    const dataWeek = $('.WeekTitle').html().split(" ")[1]
    const userId = $('#userId').html()

    //讀取已選任務
    axios({
        method: 'post',
        url: '/studentstage/checkstage',
        withCredentials: true
    }).then(response => {
        if (!response.data[dataWeek - 1].Status.Manage) {
            window.alert("尚未完成本周學習計畫")
            window.location.href = `/dashboard/${userId}`
        }
    })
    axios({
        method: 'post',
        url: '/student/readminding',
        data: {
            week: dataWeek,
        },
        withCredentials: true
    }).then(response => {
        if (response.data == 'no found') {
            window.alert("尚未完成本周學習計畫")
        }
        //render main function
        renderMindingPage(response.data)
        //完成Click事件
        $("#stageMindingCheck").click(async (e) => {
            await stageBtnEnterForMission().then(res => {
                if (res == false) {
                    if (window.confirm("確定完成 自我省思 進度嗎?")) {
                        uploadMinding(response.data)
                    }
                } else {
                    uploadMinding(response.data)
                }
            })
        })
    }).then(() => {

        loadingPage(false)
    })

}

$(window).ready((e) => {
    //取得當周所有資料
    loadingMinding()
})
