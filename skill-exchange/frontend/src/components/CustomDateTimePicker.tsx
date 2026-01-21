import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

interface CustomDateTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    minDate?: Date;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

// Generate time slots in 30-minute increments
const generateTimeSlots = () => {
    const slots: { value: string; label: string }[] = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hour24 = h.toString().padStart(2, '0');
            const minute = m.toString().padStart(2, '0');
            const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
            const ampm = h < 12 ? 'AM' : 'PM';
            slots.push({
                value: `${hour24}:${minute}`,
                label: `${hour12}:${minute} ${ampm}`
            });
        }
    }
    return slots;
};

const TIME_SLOTS = generateTimeSlots();

export default function CustomDateTimePicker({
    value,
    onChange,
    minDate: _minDate = new Date()
}: CustomDateTimePickerProps) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const containerRef = useRef<HTMLDivElement>(null);

    // Parse current value
    const parseValue = () => {
        if (!value) return { date: null, time: '09:00' };
        const dateObj = new Date(value);
        return {
            date: dateObj,
            time: `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`
        };
    };

    const { date: selectedDate, time: selectedTime } = parseValue();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
                setShowTimePicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get days in month
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { firstDay, daysInMonth };
    };

    const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

    // Check if date is selectable (not in past)
    const isDateSelectable = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    };

    // Check if date is selected
    const isDateSelected = (day: number) => {
        if (!selectedDate) return false;
        return selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear();
    };

    // Check if date is today
    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day &&
            today.getMonth() === currentMonth.getMonth() &&
            today.getFullYear() === currentMonth.getFullYear();
    };

    // Handle date selection
    const handleDateSelect = (day: number) => {
        if (!isDateSelectable(day)) return;

        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const [hours, minutes] = selectedTime.split(':');
        newDate.setHours(parseInt(hours), parseInt(minutes));

        // Format as datetime-local compatible string
        const formatted = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${newDate.getDate().toString().padStart(2, '0')}T${selectedTime}`;
        onChange(formatted);
        setShowCalendar(false);
    };

    // Handle time selection
    const handleTimeSelect = (time: string) => {
        if (!selectedDate) {
            // If no date selected, use today
            const today = new Date();
            const formatted = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}T${time}`;
            onChange(formatted);
        } else {
            const formatted = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}T${time}`;
            onChange(formatted);
        }
        setShowTimePicker(false);
    };

    // Navigate months
    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    // Format display values
    const displayDate = selectedDate
        ? `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
        : 'Select date';

    const displayTime = TIME_SLOTS.find(slot => slot.value === selectedTime)?.label || 'Select time';

    const buttonStyle = (isActive: boolean) => ({
        flex: 1,
        padding: 'var(--spacing-sm) var(--spacing-md)',
        background: 'var(--color-surface)',
        border: '1px solid',
        borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        color: value ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        fontSize: 'var(--font-size-sm)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        transition: 'all 0.2s ease',
        boxShadow: isActive ? '0 0 0 3px var(--color-primary-glow)' : 'none'
    });

    const dropdownStyle = (isOpen: boolean) => ({
        position: 'absolute' as const,
        top: 'calc(100% + 8px)',
        left: 0,
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' as const : 'hidden' as const,
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000,
        overflow: 'hidden'
    });

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            {/* Date and Time Buttons */}
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                {/* Date Button */}
                <button
                    type="button"
                    onClick={() => {
                        setShowCalendar(!showCalendar);
                        setShowTimePicker(false);
                    }}
                    style={buttonStyle(showCalendar)}
                >
                    <Calendar size={16} color="var(--color-primary-light)" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {displayDate}
                    </span>
                </button>

                {/* Time Button */}
                <button
                    type="button"
                    onClick={() => {
                        setShowTimePicker(!showTimePicker);
                        setShowCalendar(false);
                    }}
                    style={{ ...buttonStyle(showTimePicker), flex: '0 0 120px' }}
                >
                    <Clock size={16} color="var(--color-secondary)" />
                    <span>{displayTime}</span>
                </button>
            </div>

            {/* Calendar Dropdown */}
            <div style={{ ...dropdownStyle(showCalendar), width: '320px', padding: 'var(--spacing-md)' }}>
                {/* Month Navigation */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-md)'
                }}>
                    <button
                        type="button"
                        onClick={prevMonth}
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <ChevronLeft size={18} color="var(--color-text-secondary)" />
                    </button>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                        type="button"
                        onClick={nextMonth}
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <ChevronRight size={18} color="var(--color-text-secondary)" />
                    </button>
                </div>

                {/* Day Headers */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                    marginBottom: 'var(--spacing-sm)'
                }}>
                    {DAYS.map(day => (
                        <div key={day} style={{
                            textAlign: 'center',
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: 600,
                            color: 'var(--color-text-tertiary)',
                            padding: '6px 0'
                        }}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px'
                }}>
                    {/* Empty cells for days before first of month */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {/* Day cells */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const selectable = isDateSelectable(day);
                        const selected = isDateSelected(day);
                        const today = isToday(day);

                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleDateSelect(day)}
                                disabled={!selectable}
                                style={{
                                    width: '100%',
                                    aspectRatio: '1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 'var(--radius-md)',
                                    border: today && !selected ? '1px solid var(--color-primary)' : 'none',
                                    background: selected
                                        ? 'var(--gradient-primary)'
                                        : 'transparent',
                                    color: selected
                                        ? 'white'
                                        : selectable
                                            ? 'var(--color-text-primary)'
                                            : 'var(--color-text-muted)',
                                    cursor: selectable ? 'pointer' : 'not-allowed',
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: selected || today ? 600 : 400,
                                    opacity: selectable ? 1 : 0.4,
                                    transition: 'all 0.2s ease',
                                    boxShadow: selected ? 'var(--shadow-glow-primary)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectable && !selected) {
                                        e.currentTarget.style.background = 'var(--color-surface-hover)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!selected) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Picker Dropdown */}
            <div style={{
                ...dropdownStyle(showTimePicker),
                right: 0,
                left: 'auto',
                width: '150px',
                maxHeight: '250px',
                overflowY: 'auto'
            }}>
                {TIME_SLOTS.map((slot) => (
                    <button
                        key={slot.value}
                        type="button"
                        onClick={() => handleTimeSelect(slot.value)}
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: slot.value === selectedTime
                                ? 'rgba(139, 92, 246, 0.15)'
                                : 'transparent',
                            border: 'none',
                            color: slot.value === selectedTime
                                ? 'var(--color-primary-light)'
                                : 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'block'
                        }}
                        onMouseEnter={(e) => {
                            if (slot.value !== selectedTime) {
                                e.currentTarget.style.background = 'var(--color-surface-hover)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (slot.value !== selectedTime) {
                                e.currentTarget.style.background = 'transparent';
                            }
                        }}
                    >
                        {slot.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
