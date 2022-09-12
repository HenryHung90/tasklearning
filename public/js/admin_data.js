//-------------------------------
//axios function
//return All Data
function getAllData(Week) {
    return (
        axios({
            method: 'post',
            url: '/admin/readdata',
            data: {
                week: Week,
            },
            withCredentials: true
        })
    )
}
//-------------------------------
//Click function
//weekSwitchBtn Click
function weekSwitchClickBtn(Week) {
    $('.weekSwitchBtn').removeClass('Selecting')
    $(`#week_${Week}`).addClass('Selecting')
}
//-------------------------------
//PDF上傳後新增Icon 如果是Click上傳 主動增加
//初始建構 建構所有
function renderPDFIcon(PDF, Index) {
    //PDF Div
    const pdfDiv = $("<div>").prop({
        'width': '120px',
        'height': '150px',
        'margin-left': '10px'
    })
    //PDF Icon
    const pdfIcon = $('<div>').prop({
        className: 'pdfIcon',
        id: `dataPDF_${Index}`,
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M88 304H80V256H88C101.3 256 112 266.7 112 280C112 293.3 101.3 304 88 304zM192 256H200C208.8 256 216 263.2 216 272V336C216 344.8 208.8 352 200 352H192V256zM224 0V128C224 145.7 238.3 160 256 160H384V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64C0 28.65 28.65 0 64 0H224zM64 224C55.16 224 48 231.2 48 240V368C48 376.8 55.16 384 64 384C72.84 384 80 376.8 80 368V336H88C118.9 336 144 310.9 144 280C144 249.1 118.9 224 88 224H64zM160 368C160 376.8 167.2 384 176 384H200C226.5 384 248 362.5 248 336V272C248 245.5 226.5 224 200 224H176C167.2 224 160 231.2 160 240V368zM288 224C279.2 224 272 231.2 272 240V368C272 376.8 279.2 384 288 384C296.8 384 304 376.8 304 368V320H336C344.8 320 352 312.8 352 304C352 295.2 344.8 288 336 288H304V256H336C344.8 256 352 248.8 352 240C352 231.2 344.8 224 336 224H288zM256 0L384 128H256V0z"/></svg>`
    }).css({
        'transition-duration': '0.3s',
        'text-align': 'center',
        'font-size': '15px',
        'user-select': 'none',
        'margin': '5px 10px 0 10px',
        'border-radius': '10px',
        'cursor': 'pointer'
    }).hover((e) => {
        pdfIcon.css({
            'transition-duration': '0.3s',
            'background-color': 'rgba(255, 0, 0, 0.6)'
        })
    }, (e) => {
        pdfIcon.css({
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
            pdfiFrame.fadeOut(300)
        })

        const pdfiFrame = $('<iframe>').prop({
            className: 'pdfiFrame',
            title: PDF.title,
            src: PDF.link,
        }).css({
            'width': '40vw',
            'height': '95vh',
            'position': 'absolute',
            'top': '2.5vh',
            'left': '30vw',
            'display': 'none',
            'z-index': '1001'
        })

        $('body').prepend(block).prepend(pdfiFrame)
        setTimeout((e) => {
            block.fadeIn(300)
            pdfiFrame.fadeIn(300)
        }, 100)
    }).appendTo(pdfDiv)
    //PDF 名稱位置
    $('<div>').prop({
        className: 'form-floating',
        innerHTML: `<input type="text" class="form-control" id='fileTitle_${Index}' value=${PDF.title}>` +
            '<label for="floatingInput">檔案名稱</label>'
    }).css({
        'margin-top': '10px',
        'height': '30px',
    }).appendTo(pdfDiv)
    return pdfDiv
}
//按鈕欄位
function renderDataBtn(weekNumber) {
    //data week switch btn框
    const dataSwitchContainer = $('<div>').prop({
        className: 'btnContainer'
    }).css({
        'margin-top': '50px',
        'width': '100%',
        'height': '50px',
        'display': 'flex',
        'justify-content': 'space-between',
    })

    for (let i = 1; i <= 5; i++) {
        const weekSwitchBtn = $('<div>').prop({
            className: 'weekSwitchBtn',
            id: `week_${i}`,
            innerHTML: `<h1>Week ${i}</h1>`
        }).css({
            'width': '15%',
            'height': '50px',
            'line-height': '50px',
            'text-align': 'center',
            'background-color': '#6c757d',
            'border-radius': '20px',
            'transition-duration': '0.2s',
            'color': 'white',
            'user-select': 'none'
        }).hover((e) => {
            weekSwitchBtn.css({
                'transition-duration': '0.2s',
                'background-color': 'purple',
            })
        }, (e) => {
            weekSwitchBtn.css({
                'transition-duration': '0.2s',
                'background-color': '#6c757d',
            })
        }).click((e) => {
            weekSwitchClickBtn(i)
            renderDataDetails()
        }).appendTo(dataSwitchContainer)

        if (weekNumber == i) {
            weekSwitchBtn.addClass('Selecting')
        }
    }
    //data Btn選擇器外框
    const dataPageBtnContainer = $('<div>').prop({
        className: 'dataPageBtnContainer',
        innerHTML: '<h1>Data && Task</h1>'
    }).css({
        'background-color': 'rgba(255, 255, 255, 0.5)',
        'width': '95vw',
        'height': '160px',
        'text-align': 'center',
        'margin': '0 auto'
    }).append(dataSwitchContainer)
    return dataPageBtnContainer
}
//DataContainer位置
function renderDataDetails(Data) {
    console.log(Data)
    //教學資料輸入
    const dataInputDiv = $('<div>').prop({
        className: 'dataDetail_data',
        innerHTML: '<h2>教學資料</h2>'
    }).css({
        'padding-top': '10px',
        'width': '45%',
        'height': '100%',
        'border-radius': '20px',
        'background-color': 'rgba(255, 255, 255, 0.5)'
    })
    //Text Input textarea
    const dataText = $('<textarea>').prop({
        className: 'dataTextInput',
        placeholder: '該處輸入本周教學說明',
        innerHTML: Data.dataContent.text
    }).css({
        'transition-duration': '0.3s',
        'padding': '10px',
        'margin-top': '10px',
        'width': '95%',
        'height': '30%',
        'border-radius': '20px',
        'border': '1px dashed rgba(0,0,0,0.3)',
        'resize': 'none'
    }).hover((e) => {
        dataText.css({
            'transition-duration': '0.3s',
            'border': '1px solid black'
        })
    }, (e) => {
        dataText.css({
            'border': '1px dashed rgba(0,0,0,0.3)'
        })
    }).appendTo(dataInputDiv)

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

        axios({
            method: 'post',
            url: '/admin/addpdf',
            data: formData,
            withCredentials: true,
        }).then(response => {
            renderPDFIcon(response.data, Data.dataContent.content.pdf.length).appendTo(dataPdfDiv)
        })
    }).appendTo(dataInputDiv)
    ////PDF圖示區
    const dataPdfDiv = $('<div>').prop({
        className: 'pdfIconDiv',
    }).css({
        'margin': '0 auto',
        'width': '95%',
        'height': '60px',
        'display': 'flex'
    }).appendTo(dataInputDiv)

    Data.dataContent.content.pdf.map((pdfValue, pdfIndex) => {
        renderPDFIcon(pdfValue, pdfIndex).appendTo(dataPdfDiv)
    })

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
    pageContainer.append(renderDataBtn(weekCount()))
    //產生當前週數Container
    pageContainer.append(renderDataDetails(Data))
}

//loading data page main function
function loadingData() {
    loadingPage(true)

    //取得目前周次的內容並開始Render
    getAllData(weekCount()).then(response => {
        renderDataPage(response.data)
    }).then(() => {
        loadingPage(false)
        $('.adminContainer').fadeIn(300)
    })
}

$('#Data').click((e) => {
    $('.adminContainer').fadeOut(300)
    setTimeout(() => {
        $('.adminContainer').empty()
        loadingData()
    }, 300)

})