//-------------------------------
//axios function
//return All Data
function getWeekData(Week, Session) {
    return (
        axios({
            method: 'post',
            url: '/admin/readdata',
            data: {
                session: Session,
                week: Week,
            },
            withCredentials: true
        })
    )
}
//新增PDF
function addNewPdf(formData) {
    return (
        axios({
            method: 'post',
            url: '/admin/addpdf',
            data: formData,
            withCredentials: true,
        })
    )
}
//刪除PDF
function deletePdf(fileLink) {
    return (
        axios({
            method: 'post',
            url: '/admin/deletePdf',
            data: {
                link: fileLink
            }
        })
    )
}
//CRUD week 教學資料
function updateWeekData(Data) {
    return (
        axios({
            method: 'post',
            url: '/admin/adddata',
            data: {
                session: Data.session,
                week: Data.week,
                content: Data.content
            },
            withCredentials: true,
        })
    )
}
//CRUD week 任務
function updateWeekMission(Data) {
    return (
        axios({
            method: 'post',
            url: '/admin/addmission',
            data: {
                session: Data.session,
                week: Data.week,
                mission: Data.mission
            },
            withCredentials: true,
        })
    )
}
//更換屆數Data
function changeDatatList(Session) {
    loadingPage(true)
    const week = $('#data_week').val()
    getWeekData(week, Session).then(response => {
        $('.dataDetailContainer').fadeOut(100)
        setTimeout((e) => {
            $('.dataDetailContainer').remove()
            $('.adminContainer').append(renderDataDetails(response.data))
        }, 100)
    }).then(() => {
        loadingPage(false)
        $('.dataDetailContainer').fadeIn(300)
    })
}
//-------------------------------
//Click function
async function uploadDataDetail() {
    //建立模型
    const uploadData = {
        session: $('#data_session').val(),
        week: $('#data_week').val(),
        content: {
            pdf: [],
            video: [],
            thisWeekPoint: [...$('.dataMainPoint').val().split("\n")],
        }
    }

    //儲存PDF資料
    $('.dataDiv').find('.pdfIcon').map((index, value) => {
        uploadData.content.pdf.push({
            title: $(`#pdfTitle_${index}`).val(),
            link: value.id
        })
    })
    //儲存VIDEO資料
    $('.dataDiv').find('.videoIcon').map((index, value) => {
        uploadData.content.video.push({
            title: $(`#videoTitle_${index}`).val(),
            link: value.id
        })
    })
    let status = false
    await updateWeekData(uploadData).then(response => {
        status = response.data
    })
    return status
}
async function uploadWeekMission() {
    //建立模型
    const uploadMission = {
        session:$('#data_session').val(),
        week: $('#data_week').val(),
        mission: []
    }
    //儲存 Mission
    $('.dataMissionBox').find('.missionInputDiv').map(missionIndex => {
        const missionText = {
            title: $('.missionInputDiv').find('#missionTitle')[missionIndex].value,
            content: $('.missionInputDiv').find('#missionDecription')[missionIndex].value
        }
        uploadMission.mission.push(missionText)
    })

    let status = false
    await updateWeekMission(uploadMission).then(response => {
        status = response.data
    })
    return status
}
//render missionText 的框架
function renderMissionTextBox(missionData, missionCount) {
    //mission外框
    const missionTextDiv = $('<div>').prop({
        className: 'missionTextDiv',
        id: `missionTextDiv_${missionCount}`
    }).css({
        'width': '100%',
        'height': '150px',
        'padding': '5px 0',
        'border-radius': '20px',
        'border': '1px dashed rgba(0,0,0,0.3)',
        'margin': '0 auto',
        'margin-bottom': '15px',
        'display': 'none',
    })
    if (missionData != "") {
        missionTextDiv.css({ 'display': 'flex' })
    }
    //mission刪除紐
    const missionDelete = $('<div>').prop({
        className: 'missionDelete',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>'
    }).css({
        'margin': '5px 20px',
        'opacity': '0.2',
        'height': '150px',
        'width': '50px',
        'transition-duration': '0.3s',
    }).hover((e) => {
        missionDelete.css({
            'transition-duration': '0.3s',
            'opacity': '1'
        })
    }, (e) => {
        missionDelete.css({
            'transition-duration': '0.3s',
            'opacity': '0.2'
        })
    }).click((e) => {
        $(`#missionTextDiv_${missionCount}`).slideUp(200);
        setTimeout((e) => {
            $(`#missionTextDiv_${missionCount}`).remove()
        }, 200)
    }).appendTo(missionTextDiv)
    //mission輸入區
    const missionInputDiv = $('<div>').prop({
        className: 'missionInputDiv',
    }).css({
        'width': '80%',
        'height': '70px',
    }).appendTo(missionTextDiv)
    //mission Title輸入
    $('<div>').prop({
        className: 'form-floating mb-3',
        innerHTML: `<input type="text" class="form-control" id="missionTitle" placeholder="任務名稱" value="${missionData.title ? missionData.title : ''}">` +
            '<label for="floatingInput">任務名稱</label>'
    }).css({
        'width': '50%',
    }).appendTo(missionInputDiv)
    //missionDecription輸入
    $('<div>').prop({
        className: 'form-floating mb-3',
        innerHTML: `<input type="text" class="form-control" id="missionDecription" placeholder="任務簡易說明"  value="${missionData.content ? missionData.content : ''}">` +
            '<label for="floatingInput">任務簡易說明</label>'
    }).css({
        'margin-top': '10px',
        'width': '100%',
    }).appendTo(missionInputDiv)

    return missionTextDiv
}
//-------------------------------
//render PDF 以及 Video 圖示
function renderPDFandVideoIcon(Data, Index, type) {
    //Data Div外框架
    const dataDiv = $("<div>").prop({
        className: 'dataDiv',
    }).css({
        'width': '120px',
        'height': '150px',
        'margin-left': '10px'
    })
    //Ｄata Delete按鈕
    const dataDelete = $("<div>").prop({
        className: 'dataDelete',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>'
    }).css({
        'margin': '0 auto',
        'transition-duration': '0.3s',
        'width': '30px',
        'height': '30px',
        'border-radius': '10px',
        'opacity': '0.2'
    }).hover((e) => {
        dataDelete.css({
            'transition-duration': '0.3s',
            'background-color': 'rgba(255, 0, 0, 0.5)',
            'opacity': '1'
        })
    }, (e) => {
        dataDelete.css({
            'transition-duration': '0.3s',
            'background-color': 'rgba(255, 255, 255, 0)',
            'opacity': '0.2'
        })
    }).click((e) => {
        dataDiv.fadeOut(300)
        if (type == 'pdf') {
            deletePdf(Data.link).then(response => {
                window.alert(response.data)
            })
        }
        setTimeout((e) => {
            dataDiv.remove()
            uploadDataDetail()
        }, 300)

    }).appendTo(dataDiv)

    //Data Icon
    const dataIcon = $('<div>').prop({
        className: type == 'pdf' ? 'pdfIcon' : 'videoIcon',
        id: Data.link,
        innerHTML: type == 'pdf' ? `<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M88 304H80V256H88C101.3 256 112 266.7 112 280C112 293.3 101.3 304 88 304zM192 256H200C208.8 256 216 263.2 216 272V336C216 344.8 208.8 352 200 352H192V256zM224 0V128C224 145.7 238.3 160 256 160H384V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64C0 28.65 28.65 0 64 0H224zM64 224C55.16 224 48 231.2 48 240V368C48 376.8 55.16 384 64 384C72.84 384 80 376.8 80 368V336H88C118.9 336 144 310.9 144 280C144 249.1 118.9 224 88 224H64zM160 368C160 376.8 167.2 384 176 384H200C226.5 384 248 362.5 248 336V272C248 245.5 226.5 224 200 224H176C167.2 224 160 231.2 160 240V368zM288 224C279.2 224 272 231.2 272 240V368C272 376.8 279.2 384 288 384C296.8 384 304 376.8 304 368V320H336C344.8 320 352 312.8 352 304C352 295.2 344.8 288 336 288H304V256H336C344.8 256 352 248.8 352 240C352 231.2 344.8 224 336 224H288zM256 0L384 128H256V0z"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg"  width="50px" height="50px" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 0v128h128L256 0zM224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM224 384c0 17.67-14.33 32-32 32H96c-17.67 0-32-14.33-32-32V288c0-17.67 14.33-32 32-32h96c17.67 0 32 14.33 32 32V384zM320 284.9v102.3c0 12.57-13.82 20.23-24.48 13.57L256 376v-80l39.52-24.7C306.2 264.6 320 272.3 320 284.9z"/></svg>`
    }).css({
        'transition-duration': '0.3s',
        'text-align': 'center',
        'font-size': '15px',
        'user-select': 'none',
        'margin': '5px 10px 0 10px',
        'border-radius': '10px',
        'cursor': 'pointer'
    }).hover((e) => {
        dataIcon.css({
            'transition-duration': '0.3s',
            'background-color': 'rgba(100, 100, 255, 1)'
        })
    }, (e) => {
        dataIcon.css({
            'transition-duration': '0.3s',
            'background-color': 'rgba(255, 255, 255, 0)'
        })
    }).click((e) => {
        const block = $('<div>').prop({
            className: 'pdfBlock',
        }).css({
            'background-color': 'rgba(0,0,0,0.5)',
            'width': '100vw',
            'height': '100vh',
            'position': 'absolute',
            'display': 'none',
            'z-index': '1000'
        }).click((e) => {
            block.fadeOut(300)
            dataiFrame.fadeOut(300)
            setTimeout((e) => {
                block.remove()
                dataiFrame.remove()
            }, 300)
        })

        const dataiFrame = $('<iframe>').prop({
            className: 'dataiFrame',
            title: Data.title,
            src: Data.link,
        }).css(
            type == 'pdf' ? {
                'width': '40vw',
                'height': '95vh',
                'position': 'absolute',
                'top': '2.5vh',
                'left': '30vw',
                'display': 'none',
                'z-index': '1001'
            } : {
                'width': '70vw',
                'height': '70vh',
                'position': 'absolute',
                'top': '15vh',
                'left': '15vw',
                'display': 'none',
                'z-index': '1001'
            })

        $('body').prepend(block).prepend(dataiFrame)
        setTimeout((e) => {
            block.fadeIn(300)
            dataiFrame.fadeIn(300)
        }, 100)
    }).appendTo(dataDiv)
    //data 名稱位置
    $('<div>').prop({
        className: 'form-floating',
        innerHTML: `<input type="text" class="form-control" id='${type == 'pdf' ? 'pdfTitle_' + Index : 'videoTitle_' + Index}' value=${Data.title}>` +
            '<label for="floatingInput">檔案名稱</label>'
    }).css({
        'margin-top': '10px',
        'height': '30px',
    }).appendTo(dataDiv)
    return dataDiv
}
//按鈕欄位
function renderDataBtn() {
    //data week switch btn框
    const dataSwitchContainer = $('<div>').prop({
        className: 'btnContainer'
    }).css({
        'margin-top': '50px',
        'width': '100%',
        'height': '50px',
        'display': 'flex',
        'justify-content': 'space-around',
    })
    //選擇屆數
    const changeStudentsSession = $('<select>').prop({
        className: "form-select",
        id: 'data_session',
        ariaLabel: "Default select example"
    }).css({
        'width': '20%',
        'margin': '0'
    }).change((e) => {
        console.log(123)
        changeDatatList(e.target.value)
    }).appendTo(dataSwitchContainer)
    //閱覽所有屆數
    sessionCount().then(response => {
        for (let sessionConfig of response.data) {
            if (sessionConfig.active) {
                $('<option selected>').prop({
                    value: sessionConfig.session,
                    innerHTML: `第 ${sessionConfig.session} 屆`
                }).appendTo(changeStudentsSession)
            } else {
                $('<option>').prop({
                    value: sessionConfig.session,
                    innerHTML: `第 ${sessionConfig.session} 屆`
                }).appendTo(changeStudentsSession)
            }
        }
    })

    //選擇星期
    const chanageWeekData = $('<select>').prop({
        className: "form-select",
        id: 'data_week',
        ariaLabel: "Default select example"
    }).css({
        'width': '40%',
        'margin': '0'
    }).change((e) => {
        loadingPage(true)
        $('.dataDetailContainer').fadeOut(200)
        setTimeout(() => {
            $('.dataDetailContainer').remove()
            getWeekData(e.target.value, $('#data_session').val()).then(response => {
                $('.adminContainer').append(renderDataDetails(response.data))
            }).then(response => {
                loadingPage(false)
                $('.dataDetailContainer').css({ 'display': 'none' })
                $('.dataDetailContainer').fadeIn(200)
                $('.dataDetailContainer').css({ 'display': 'flex' })
            })
        }, 300)
    }).appendTo(dataSwitchContainer)
    for (let i = 1; i <= 5; i++) {
        if (i == weekCount()) {
            $('<option selected>').prop({
                value: i,
                innerHTML: `<h2>Week ${i}</h2>`
            }).appendTo(chanageWeekData)
        } else {
            $('<option>').prop({
                value: i,
                innerHTML: `<h2>Week ${i}</h2>`
            }).appendTo(chanageWeekData)
        }
    }
    //data Btn選擇器外框
    const dataPageBtnContainer = $('<div>').prop({
        className: 'dataPageBtnContainer',
        innerHTML: '<h1>Data && Task</h1>'
    }).css({
        'background-color': 'rgba(0, 0, 0, 0.3)',
        'border-radius': '20px',
        'width': '95vw',
        'height': '160px',
        'text-align': 'center',
        'margin': '0 auto'
    }).append(dataSwitchContainer)
    return dataPageBtnContainer
}
//DataContainer位置
function renderDataDetails(Data) {
    //教學資料輸入外框
    const dataInputDiv = $('<div>').prop({
        className: 'dataDetail_data',
        innerHTML: '<h2>教學資料</h2>'
    }).css({
        'padding-top': '10px',
        'width': '45%',
        'height': '100%',
        'border-radius': '20px',
        'background-color': 'rgba(255, 255, 255, 0.5)',
    })
    const dataBox = $('<div>').prop({
        className: 'dataBox',
    }).css({
        'padding': '10px 10px',
        'margin': '0 auto',
        'width': '95%',
        'height': '82%',
        'overflow-y': 'auto'
    }).appendTo(dataInputDiv)

    ////周次重點輸入區
    const dataMainPointDiv = $('<div>').prop({
        className: 'dataMainPointDiv',
        innerHTML: '<h5><strong>本周重點輸入 (以行區分重點)</strong></h5>'
    }).css({
        'margin': '0 auto',
        'margin-top': '10px',
        'width': '95%'
    }).appendTo(dataBox)
    ////周次重點 Input area
    $('<textarea>').prop({
        className: 'dataMainPoint',
        placeholder: "以行區分重點",
        value: Data.dataContent ? Data.dataContent.content.thisWeekPoint.join("\n") : ''
    }).css({
        'transition-duration': '0.3s',
        'padding': '10px',
        'margin-top': '10px',
        'margin-bottom': '10px',
        'width': '100%',
        'height': '150px',
        'border-radius': '20px',
        'border': '1px dashed rgba(0,0,0,0.3)',
        'resize': 'none'
    }).appendTo(dataMainPointDiv)

    ////PDF Input div
    $('<div>').prop({
        className: 'input-group mb-3',
        innerHTML: ' <label class="input-group-text" for="inputGroupFile01">PDF上傳</label><input type="file" class="form-control" id="uploadPDF" name="Data_pdf" accept="application/pdf">'
    }).css({
        'margin': '0 auto',
        'margin-top': '10px',
        'width': '95%',
        'height': '38px',
    }).change((e) => {
        let file = e.target.files[0]

        let formData = new FormData()
        formData.append('uploadPDF', file)
        loadingPage(true)
        addNewPdf(formData).then(response => {
            if(response.data == 'error'){
                window.alert("上傳失敗，請再試一次")
                return
            }
            renderPDFandVideoIcon(response.data, $('.pdfIconDiv').find('.dataDiv').length, 'pdf').appendTo(dataPdfDiv)
        }).then(response => {
            uploadDataDetail()
            loadingPage(false)
        })
    }).appendTo(dataBox)
    ////Video Input div
    $('<button>').prop({
        className: 'btn btn-secondary',
        innerHTML: '新增影片(網址)'
    }).css({
        'width': '95%',
        'margin': '0 auto',
        'margin-top': '2px',
    }).click((e) => {
        const videoTitle = window.prompt("輸入影片標題", "")
        if (videoTitle == null) {
            return
        }
        const videoLink = window.prompt("輸入影片網址", "")
        if (videoLink == null) {
            window.alert("取消")
            return
        }
        const videoData = {
            title: videoTitle,
            link: videoLink,
        }

        renderPDFandVideoIcon(videoData, $('.videoIconDiv').find('.dataDiv').length, 'video').appendTo(dataVideoDiv)
    }).appendTo(dataBox)
    ////PDF圖示區
    const dataPdfDiv = $('<div>').prop({
        className: 'pdfIconDiv',
    }).css({
        'margin': '0 auto',
        'width': '95%',
        'height': '155px',
        'display': 'flex'
    }).appendTo(dataBox)
    if (Data.dataContent != null) {
        Data.dataContent.content.pdf.map((pdfValue, pdfIndex) => {
            renderPDFandVideoIcon(pdfValue, pdfIndex, 'pdf').appendTo(dataPdfDiv)
        })
    }
    ////Video圖示區
    const dataVideoDiv = $('<div>').prop({
        className: 'videoIconDiv',
    }).css({
        'margin': '0 auto',
        'width': '95%',
        'height': '155px',
        'display': 'flex'
    }).appendTo(dataBox)
    if (Data.dataContent != null) {
        Data.dataContent.content.video.map((videoValue, videoIndex) => {
            renderPDFandVideoIcon(videoValue, videoIndex, 'video').appendTo(dataVideoDiv)
        })

    }

    ////data儲存按鈕
    $('<button>').prop({
        className: 'btn btn-info',
        innerHTML: '儲存教學資料'
    }).css({
        'margin': '0 auto',
        'margin-bottom': '10px',
        'width': '50%'
    }).click((e) => {
        loadingPage(true)
        uploadDataDetail().then(response => {
            window.alert(response)
            loadingPage(false)
        })
    }).appendTo(dataInputDiv)


    //本周任務輸入
    const missionInputDiv = $('<div>').prop({
        className: 'dataDetail_mission',
        innerHTML: '<h2>本周任務</h2>'
    }).css({
        'padding-top': '10px',
        'width': '45%',
        'height': '100%',
        'border-radius': '20px',
        'background-color': 'rgba(255, 255, 255, 0.5)'
    })

    ////mission 儲存區域
    const missionBox = $('<div>').prop({
        className: ' dataMissionBox',
    }).css({
        'padding': '10px 10px',
        'margin': '0 auto',
        'width': '95%',
        'height': '82%',
        'overflow-y': 'auto'
    }).appendTo(missionInputDiv)
    ////mission 增加按鈕
    const missionText = $('<div>').prop({
        className: 'addMission',
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg"  width="50px" height="40px" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"/></svg>'
    }).css({
        'width': '100%',
        'height': '50px',
        'padding': '5px 0',
        'transition-duration': '0.3s',
        'border-radius': '20px'
    }).hover((e) => {
        missionText.css({
            'transition-duration': '0.3s',
            'border': '1px solid black',
        })
    }, (e) => {
        missionText.css({
            'transition-duration': '0.3s',
            'border': '0px'
        })
    }).click(async (e) => {
        //計算 Mission 數量用
        const missionLength = $('.dataMissionBox').find('.missionTextDiv').length - 1
        let missionCount = 0
        if (missionLength != -1) missionCount = parseInt($('.dataMissionBox').find('.missionTextDiv')[missionLength].id.split("_")[1]) + 1
        await renderMissionTextBox("", missionCount).insertBefore(missionText)
        $(`#missionTextDiv_${missionCount}`).slideDown(200)
        $(`#missionTextDiv_${missionCount}`).css({ 'display': 'flex' })

    }).appendTo(missionBox)

    if (Data.missionContent != null) {
        Data.missionContent.mission.map((missionValue, missionIndex) => {
            renderMissionTextBox(missionValue, missionIndex).insertBefore(missionText)
        })
    }
    ////mission 儲存按鈕
    $('<button>').prop({
        className: 'btn btn-info',
        innerHTML: '儲存任務'
    }).css({
        'margin': '0 auto',
        'margin-bottom': '10px',
        'width': '50%'
    }).click((e) => {
        loadingPage(true)
        uploadWeekMission().then(response => {
            window.alert(response)
            loadingPage(false)
        })
    }).appendTo(missionInputDiv)



    //data外框
    const dataDetailContainer = $('<div>').prop({
        className: 'dataDetailContainer',
    }).css({
        'width': '95vw',
        'height': '600px',
        'margin': '0 auto',
        'margin-top': '30px',
        'text-align': 'center',
        'display': 'flex',
        'justify-content': 'space-between'
    }).append(dataInputDiv).append(missionInputDiv)



    return dataDetailContainer
}
//render data page main function
function renderDataPage(Data) {
    //Data 單周資訊
    const pageContainer = $('.adminContainer')
    //產生週數按鈕
    pageContainer.append(renderDataBtn())
    //產生當前週數Container
    pageContainer.append(renderDataDetails(Data))
}

//loading data page main function
function loadingData() {
    loadingPage(true)
    sessionCount().then(response=>{
        for(let sessionConfig of response.data){
            if(sessionConfig.active){
                //取得目前周次的內容並開始Render
                getWeekData(weekCount(), sessionConfig.session).then(response => {
                    renderDataPage(response.data)
                }).then(() => {
                    loadingPage(false)
                    $('.adminContainer').fadeIn(300)
                })    
                return
            }   
            
        }
        
    })
    
}

$('#Data').click((e) => {
    $('.adminContainer').fadeOut(300)
    setTimeout(() => {
        $('.adminContainer').empty()
        loadingData()
    }, 300)

})