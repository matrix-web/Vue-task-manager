export default function dateFilter(date, format="date") {
    const options = {}

    if (format.includes('date')) {
        options.day = '2-digit'
        options.month = '2-digit'
        options.year = 'numeric'
    }

    if (format.includes('time')) {
        options.hour = '2-digit'
        options.minute = '2-digit'
        options.second = '2-digit'
    }

    return Intl.DateTimeFormat('ru-RU', options).format(new Date(date))
}