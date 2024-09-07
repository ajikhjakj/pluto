$.fn.isValid = function () {
    return this[0].checkValidity()
}

function checkValidate(event, callback) {
    if ($(event).isValid()) {
        callback()
        return;
    }
    alertErr(string('invadeInput'))
}

function alertErr(msg) {
    alertify.logPosition("top right");
    alertify.error(msg)
}

function alertSuccess(msg) {
    alertify.logPosition("top right");
    alertify.success(msg)
}

function alertConfirm(msg, callback) {
    alertify
        .okBtn(string('confirm'))
        .cancelBtn(string('cancel'))
        .confirm(msg, function (ev) {
            ev.preventDefault();
            callback()
        });
}

$.fn.recover = function () {
    let cover = $(this).attr('cover')
    $(this).html(cover)
    $(this).removeClass('disabled')
}

let covers = [];

function btnLoading(event) {
    $(event).attr('cover', $(event).html())
    $(event).html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...').addClass('disabled')
    covers.push($(event))
}

function btnRecoverAll() {
    for (let item of covers) {
        item.recover()
    }
    covers = [];
}

function showLoading(msg) {
    $("#loadingModal").modal('show')
}

function hideLoading() {
    $("#loadingModal").modal('hide')
}

function initLoading() {
    $('body').append('<div class="modal fade" id="loadingModal" tabindex="-1" aria-hidden="true">\n' +
        '    <div class="modal-dialog">\n' +
        '        <div class="loader">\n' +
        '            <ul>\n' +
        '                <li></li>\n' +
        '                <li></li>\n' +
        '                <li></li>\n' +
        '                <li></li>\n' +
        '            </ul>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>')
}

initLoading()