export default function fileTypeFilter(value) {
    const extLib = [{
            extention: ['xls', 'xlsx'],
            icon: '<i class="bi bi-file-earmark-excel"></i>',
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