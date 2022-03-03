export default function fileTypeFilter(value) {
    const extLib = [
        {
            extention: ['aac'],
            icon: '<i class="bi bi-filetype-aac"></i>',
        },{
            extention: ['ai'],
            icon: '<i class="bi bi-filetype-ai"></i>',
        },{
            extention: ['bmp'],
            icon: '<i class="bi bi-filetype-bmp"></i>',
        },{
            extention: ['cs'],
            icon: '<i class="bi bi-filetype-cs"></i>',
        },{
            extention: ['css'],
            icon: '<i class="bi bi-filetype-css"></i>',
        },{
            extention: ['csv'],
            icon: '<i class="bi bi-filetype-csv"></i>',
        },{
            extention: ['doc'],
            icon: '<i class="bi bi-filetype-doc"></i>',
        },{
            extention: ['docx'],
            icon: '<i class="bi bi-filetype-docx"></i>',
        },{
            extention: ['exe'],
            icon: '<i class="bi bi-filetype-exe"></i>',
        },{
            extention: ['gif'],
            icon: '<i class="bi bi-filetype-gif"></i>',
        },{
            extention: ['heic'],
            icon: '<i class="bi bi-filetype-heic"></i>',
        },{
            extention: ['html'],
            icon: '<i class="bi bi-filetype-html"></i>',
        },{
            extention: ['java'],
            icon: '<i class="bi bi-filetype-java"></i>',
        },{
            extention: ['js'],
            icon: '<i class="bi bi-filetype-js"></i>',
        },{
            extention: ['json'],
            icon: '<i class="bi bi-filetype-json"></i>',
        },{
            extention: ['jsx'],
            icon: '<i class="bi bi-filetype-jsx"></i>',
        },{
            extention: ['key'],
            icon: '<i class="bi bi-filetype-key"></i>',
        },{
            extention: ['m4p'],
            icon: '<i class="bi bi-filetype-m4p"></i>',
        },{
            extention: ['mov'],
            icon: '<i class="bi bi-filetype-mov"></i>',
        },{
            extention: ['mp3'],
            icon: '<i class="bi bi-filetype-mp3"></i>',
        },{
            extention: ['mp4'],
            icon: '<i class="bi bi-filetype-mp4"></i>',
        },{
            extention: ['php'],
            icon: '<i class="bi bi-filetype-php"></i>',
        },{
            extention: ['psd'],
            icon: '<i class="bi bi-filetype-psd"></i>',
        },{
            extention: ['ppt'],
            icon: '<i class="bi bi-filetype-ppt"></i>',
        },{
            extention: ['pptx'],
            icon: '<i class="bi bi-filetype-pptx"></i>',
        },{
            extention: ['sass'],
            icon: '<i class="bi bi-filetype-sass"></i>',
        },{
            extention: ['scss'],
            icon: '<i class="bi bi-filetype-scss"></i>',
        },{
            extention: ['svg'],
            icon: '<i class="bi bi-filetype-svg"></i>',
        },{
            extention: ['txt'],
            icon: '<i class="bi bi-filetype-txt"></i>',
        },{
            extention: ['xls'],
            icon: '<i class="bi bi-filetype-xls"></i>',
        },{
            extention: ['xlsx'],
            icon: '<i class="bi bi-filetype-xlsx"></i>',
        },{
            extention: ['xml'],
            icon: '<i class="bi bi-filetype-xml"></i>',
        },
        {
            extention: ['pdf'],
            icon: '<i class="bi bi-file-earmark-pdf"></i>',
        },
        {
            extention: ['jpg', 'jpeg', 'png', 'jtiff'],
            icon: '<i class="bi bi-file-earmark-image"></i>',
        },
    ]
    let fileIcon = ''
    const extention = value.split('.').pop().toLowerCase()
    let fileExt = (extLib.filter(e => e.extention.indexOf(extention) >= 0))[0]
    if (fileExt) {
        fileIcon = fileExt.icon
    } else {
        fileIcon = '<i class="bi bi-file-earmark"></i>'
    }

    return fileIcon
}