export default function convert_hour_to_minutes(time: string) {
    const [hour, minutes] = time.split(':').map(Number);
    const time_in_minutes = (hour * 60) + minutes;

    return time_in_minutes;
}