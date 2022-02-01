export default function dateFilter(value, format = 'date') {
    const options = {}
    if (format.includes('date')) {
        options.day = '2-digit'
        options.month = 'short'
        options.year = 'numeric'
    }
    if (format.includes('time')) {
        options.hour = 'numeric'
        options.minute = 'numeric'
            //options.second = 'numeric'
    }
    if (format == ('shortDateTime')) {
        options.day = '2-digit'
        options.month = '2-digit'
        options.year = '2-digit'
        options.hour = 'numeric'
        options.minute = 'numeric'
    }
    if (value != undefined) {
        return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value))
    } else {
        return null
    }

}