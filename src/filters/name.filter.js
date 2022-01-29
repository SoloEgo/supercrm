export default async function nameFilter(value) {
    if (value != undefined) {
        let info = ''
        return info.name + ' ' + info.surname
    } else {
        return null
    }

}