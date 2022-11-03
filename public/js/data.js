7//教材文字部分
const renderText = (text) => {
    const textDiv = $('<div>').prop({
        className: 'dataTextline',
        innerHTML: text,
    }).css({
        'white-space': 'pre-wrap',
        'font-size': '25px',
        'text-align': 'left'
    })
    return textDiv
}

//教材下載部分
const renderDownloadPDFandVideo = (pdfLocation, videoLocation) => {
    let returnDiv = $('<div>').css({ 'display': 'flex', 'justify-content': 'space-around' })
    pdfLocation.map((val, index) => {
        const downloadDiv = $('<div>').prop({
            className: 'dataDownload',
            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M88 304H80V256H88C101.3 256 112 266.7 112 280C112 293.3 101.3 304 88 304zM192 256H200C208.8 256 216 263.2 216 272V336C216 344.8 208.8 352 200 352H192V256zM224 0V128C224 145.7 238.3 160 256 160H384V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64C0 28.65 28.65 0 64 0H224zM64 224C55.16 224 48 231.2 48 240V368C48 376.8 55.16 384 64 384C72.84 384 80 376.8 80 368V336H88C118.9 336 144 310.9 144 280C144 249.1 118.9 224 88 224H64zM160 368C160 376.8 167.2 384 176 384H200C226.5 384 248 362.5 248 336V272C248 245.5 226.5 224 200 224H176C167.2 224 160 231.2 160 240V368zM288 224C279.2 224 272 231.2 272 240V368C272 376.8 279.2 384 288 384C296.8 384 304 376.8 304 368V320H336C344.8 320 352 312.8 352 304C352 295.2 344.8 288 336 288H304V256H336C344.8 256 352 248.8 352 240C352 231.2 344.8 224 336 224H288zM256 0L384 128H256V0z"/></svg>' +
                `<p>${val.title}.pdf</p>`,
            name:`${val.title}.pdf`
        }).css({
            'text-align': 'center',
            'font-size': '15px',
            'user-select': 'none',
            'margin':'0 auto',
            'border-radius': '10px',
            'height':'80px'
        }).click((e) => {
            const block = $('<div>').prop({
                className: 'pdfBlock',
            }).css({
                'background-color': 'rgba(0,0,0,0.5)',
                'width': '100vw',
                'height': '100vh',
                'position': 'absolute',
                'display': 'none',
                'z-index': '1000',
                'overflow':'hidden'
            }).click((e) => {
                block.fadeOut(300)
                pdfiFrame.fadeOut(300)
                //event Listener
                dataBoxClick(`${val.title}.pdf`,'C')
                setTimeout((e)=>{
                    block.remove()
                    pdfiFrame.remove()
                },300)
            })

            const pdfiFrame = $('<iframe>').prop({
                className: 'pdfiFrame',
                title: val.title,
                src: `${val.link}#toolbar=0`,
            }).css({
                'width': '40vw',
                'height': '95vh',
                'position': 'absolute',
                'top': '2.5vh',
                'left': '30vw',
                'display': 'none',
                'z-index': '1001',
                'overflow':'hidden'
            })

            $('body').prepend(block).prepend(pdfiFrame)
            setTimeout((e) => {
                block.fadeIn(300)
                pdfiFrame.fadeIn(300)
            }, 100)
        })

        returnDiv.append(downloadDiv)
    })

    videoLocation.map((val, index) => {
        const videohrefDiv = $('<div>').prop({
            className: 'dataVideo',
            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg"  width="50px" height="50px" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 0v128h128L256 0zM224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM224 384c0 17.67-14.33 32-32 32H96c-17.67 0-32-14.33-32-32V288c0-17.67 14.33-32 32-32h96c17.67 0 32 14.33 32 32V384zM320 284.9v102.3c0 12.57-13.82 20.23-24.48 13.57L256 376v-80l39.52-24.7C306.2 264.6 320 272.3 320 284.9z"/></svg>' +
                `<p>${val.title}</p>`,
            name:`影片 ${val.title}`
        }).css({
            'text-align': 'center',
            'font-size': '15px',
            'user-select': 'none',
            'margin':'0 auto',
            'border-radius': '10px'
        }).click((e) => {
            const block = $('<div>').prop({
                className: 'videoBlock',
            }).css({
                'background-color': 'rgba(0,0,0,0.5)',
                'width': '100vw',
                'height': '100vh',
                'position': 'absolute',
                'display': 'none',
                'z-index': '1000'
            }).click((e) => {
                block.fadeOut(300)
                videoiFrame.fadeOut(300)
                 //event Listener
                 dataBoxClick(`影片 ${val.title}`,'C')
                 setTimeout(e=>{
                    block.remove()
                    videoiFrame.remove()
                 },300)
            })

            const videoiFrame = $('<iframe>').prop({
                className: 'videoiFrame',
                title: val.title,
                src: val.link,
            }).css({
                'width': '60vw',
                'height': '60vh',
                'position': 'absolute',
                'left': '20vw',
                'top': '20vh',
                'display': 'none',
                'z-index': '1001'
            })

            $('body').prepend(block).prepend(videoiFrame)
            setTimeout((e) => {
                block.fadeIn(300)
                videoiFrame.fadeIn(300)
            }, 100)
        })

        returnDiv.append(videohrefDiv)
    })

    return returnDiv
}

//本周重點
const renderThisWeekPoint = (thisWeekPoint) => {
    let returnPointDiv = $('<div>')

    thisWeekPoint.map((val, index) => {
        const pointDiv = $('<div>').prop({
            className: 'thisWeekPointContent',
            innerHTML: `▓ ${val}`
        }).css({
            'text-align': 'left',
            'font-size': '20px',
            'padding-top': '10px',
            'margin': '0 auto',
            'margin-top': '15px',
            'border-top': '1px solid rgba(0,0,0,0.1)',
        })

        returnPointDiv.append(pointDiv)
    })
    return returnPointDiv
}

//上週重點
const renderLastWeekPoint = (lastWeekPoint) => {
    let returnPointDiv = $('<div>')

    lastWeekPoint.map((val, index) => {
        const pointDiv = $('<div>').prop({
            className: 'lastWeekPointContent',
            innerHTML: `▓ ${val}`
        }).css({
            'text-align': 'left',
            'font-size': '20px',
            'padding-top': '10px',
            'margin': '0 auto',
            'margin-top': '10px',
            'border-top': '1px solid rgba(0,0,0,0.1)',
        })

        returnPointDiv.append(pointDiv)
    })
    return returnPointDiv
}


function renderDataPage(data) {
    const dataDownload = $('.dataLink')
    const dataThisWeekPoint = $('.thisWeekPointContainer')
    const dataLastWeekPoint = $('.lastWeekPointContainer')

    dataDownload.append(renderDownloadPDFandVideo(data.thisWeekData.pdf, data.thisWeekData.video))

    dataThisWeekPoint.append(renderThisWeekPoint(data.thisWeekData.thisWeekPoint))
    dataLastWeekPoint.append(renderLastWeekPoint(data.lastWeekPoint))
}

function loadingData() {
    loadingPage(true)
    const dataWeek = $('.WeekTitle').html().split(" ")
    const userId = $('#userId').html()

    axios({
        method: 'post',
        url: '/student/readdata',
        data: {
            week: dataWeek[1],
        },
        withCredentials: true,
    }).then((response) => {
        if (response.data === "no found") {
            window.alert("尚未新增該周資訊!")
            window.location.href = `/dashboard/${userId}`
        }
        //loading page data
        renderDataPage(response.data)
    }).then(() => {
        loadingPage(false)
    })
}
$(window).ready((e) => {
    loadingData()
})