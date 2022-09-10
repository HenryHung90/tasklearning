//-------------------------------
//axios function
//return All Data
function getAllData() {
    return (
        axios({
            method: 'post',
            url: '/admin/readdata'
        })
    )
}
//-------------------------------
//Click function
//weekSwitchBtn Click
function weekSwitchClickBtn(Week){
    $('.weekSwitchBtn').removeClass('Selecting')
    $(`#week_${Week}`).addClass('Selecting')


}
//-------------------------------
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
            innerHTML: `<h1>${i}</h1>`
        }).css({
            'width': '15%',
            'height': '50px',
            'line-height': '50px',
            'text-align': 'center',
            'background-color': '#6c757d',
            'border-radius': '20px',
            'transition-duration': '0.2s',
            'color': 'white'
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
        }).appendTo(dataSwitchContainer)

        if(weekNumber == i){
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
function renderDataDetails(Data){

}

//render data page main function
function renderDataPage(Data) {
    const pageContainer = $('.adminContainer')
    //產生週數按鈕
    pageContainer.append(renderDataBtn(weekCount()))
    //產生當前週數Container
    pageContainer.append(renderDataDetails(Data))
}

//loading data page main function
function loadingData() {
    loadingPage(true)

    getAllData().then(response => {
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