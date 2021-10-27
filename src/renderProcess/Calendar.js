import {days, months} from './constants';
export class Calendar {
    constructor(month, year) {
        this.data = [];
        const numOfDays = new Date(year, (month + 1), 0).getDate();

        console.log(numOfDays);
        let i = 1;
        while(i <= numOfDays) {
            let day = new Date(year, month, i).getDay();
            const weekData = {sunday:'',monday:'',tuesday:'',wednesday:'',thursday:'',friday:''};
            let prevWeekDays = day - 1;
            let prevMonthDays = new Date(year, month, 0).getDate();
            while(prevWeekDays >= 0) {
                weekData[days[prevWeekDays]] = prevMonthDays + ' ' + months[(month || 12)];
                prevWeekDays--;
                prevMonthDays--;
            }
            while(day < 6 && i <= numOfDays) {
                weekData[days[new Date(year, month, i).getDay()]] = i + ' ' + months[((month) % 12 + 1)];
                day++;
                i++;
            }
            i++;
            let nextWeekDays = day;
            let nextMonthDays = 1;
            while(nextWeekDays < 6) {
                weekData[days[new Date(year,((month + 1)),nextMonthDays).getDay()]] = nextMonthDays++ + ' ' + months[((month + 1) % 12 + 1)];
                nextWeekDays++;
            }
          
            this.data.push(weekData);
            console.log(weekData);
        }
    }

    getData() {
        return this.data;
    }
}