import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
    value: string;
    label: string;
}

interface CustomDropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minWidth?: string;
}

export default function CustomDropdown({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    minWidth = '150px'
}: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    return (
        <div
            ref={dropdownRef}
            style={{
                position: 'relative',
                minWidth,
                zIndex: isOpen ? 100 : 1
            }}
        >
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    background: 'var(--color-surface)',
                    border: '1px solid',
                    borderColor: isOpen ? 'var(--color-primary)' : 'var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    color: selectedOption ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--spacing-sm)',
                    transition: 'all 0.2s ease',
                    boxShadow: isOpen ? '0 0 0 3px var(--color-primary-glow)' : 'none'
                }}
            >
                <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {displayText}
                </span>
                <ChevronDown
                    size={16}
                    style={{
                        transition: 'transform 0.3s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        flexShrink: 0,
                        color: 'var(--color-text-tertiary)'
                    }}
                />
            </button>

            {/* Dropdown Menu */}
            <div
                style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden',
                    transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    maxHeight: '250px',
                    overflowY: 'auto'
                }}
            >
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                            onChange(option.value);
                            setIsOpen(false);
                        }}
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: option.value === value
                                ? 'rgba(139, 92, 246, 0.15)'
                                : 'transparent',
                            border: 'none',
                            color: option.value === value
                                ? 'var(--color-primary-light)'
                                : 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'block'
                        }}
                        onMouseEnter={(e) => {
                            if (option.value !== value) {
                                e.currentTarget.style.background = 'var(--color-surface-hover)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (option.value !== value) {
                                e.currentTarget.style.background = 'transparent';
                            }
                        }}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
