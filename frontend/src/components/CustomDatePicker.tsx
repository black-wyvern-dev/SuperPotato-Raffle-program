import React, { useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker from "react-modern-calendar-datepicker";

export default function CustomDatePicker(props: {
    onChange: Function
}) {
    const [selectedDay, setSelectedDay] = useState<DateType>();
    const handleDate = (e: any) => {
        console.log(e)
        setSelectedDay({
            day: e.day,
            month: e.month,
            year: e.year
        })
        props.onChange(`${e.year}/${e.month}/${e.day}`)
    }
    return (
        <DatePicker
            value={selectedDay}
            onChange={handleDate}
            inputPlaceholder="Raffle End Date"
        />
    );
};

interface DateType {
    day: number
    month: number
    year: number
}