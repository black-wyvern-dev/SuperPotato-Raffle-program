import React, { useState } from "react";
import DatePicker from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";

export default function CustomDatePicker(props: {
    onChange: Function
}) {
    const [selectedDay, setSelectedDay] = useState<DateType>();
    const handleDate = (e: any) => {
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
