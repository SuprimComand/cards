export class Course {
    static URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

    static getCourses = async () => {
        return await fetch(Course.URL);
    }
}

export interface ValuteType {
    CharCode: string;
    ID: string;
    Name: string;
    Nominal: number;
    NumCode: string;
    Previous: number;
    Value: number;
}
