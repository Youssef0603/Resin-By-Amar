export const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hours = time.getHours() % 12 || 12;
    const minutes = time.getMinutes();
    const period = time.getHours() >= 12 ? 'pm' : 'am';
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}${period}`;
};

export const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const date = dateTime.toDateString();
    const time = formatTime(dateTimeString); // Formatting the time part
    return `${date} ${time}`;
};

export const formatNotificationDate = (dateTimeString)=>{
    const dateTime = new Date(dateTimeString);
    const now = new Date();
    const diffMilliseconds = now - dateTime;
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));

    let timeString;
    if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
        timeString = ` ${diffMinutes}min${diffMinutes === 1 ? '' : 's'}`;
    } else if (diffHours < 24) {
        timeString = ` ${diffHours}hr${diffHours === 1 ? '' : 's'}`;
    } else {
        timeString = dateTime.toLocaleDateString(); // Or any other format for older dates
    }

    return timeString;
}