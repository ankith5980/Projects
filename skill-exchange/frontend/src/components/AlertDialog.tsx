import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string | ReactNode;
    type?: 'error' | 'success' | 'info' | 'warning';
    buttonText?: string;
}

export default function AlertDialog({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    buttonText = 'OK'
}: AlertDialogProps) {
    if (!isOpen) return null;

    const typeStyles = {
        error: {
            iconBg: 'rgba(239, 68, 68, 0.15)',
            iconColor: 'var(--color-error)',
            Icon: AlertCircle,
            defaultTitle: 'Error'
        },
        success: {
            iconBg: 'rgba(34, 197, 94, 0.15)',
            iconColor: 'var(--color-success)',
            Icon: CheckCircle,
            defaultTitle: 'Success'
        },
        info: {
            iconBg: 'rgba(59, 130, 246, 0.15)',
            iconColor: '#3b82f6',
            Icon: Info,
            defaultTitle: 'Info'
        },
        warning: {
            iconBg: 'rgba(245, 158, 11, 0.15)',
            iconColor: 'var(--color-warning)',
            Icon: AlertTriangle,
            defaultTitle: 'Warning'
        }
    };

    const style = typeStyles[type];
    const IconComponent = style.Icon;
    const displayTitle = title || style.defaultTitle;

    return (
        <div
            className="modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="modal"
                style={{
                    maxWidth: '380px',
                    animation: 'slideUp 0.2s ease'
                }}
            >
                {/* Header with close button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: 'var(--spacing-sm) var(--spacing-sm) 0'
                }}>
                    <button onClick={onClose} className="modal-close">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    padding: '0 var(--spacing-xl) var(--spacing-xl)',
                    textAlign: 'center'
                }}>
                    {/* Icon */}
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 'var(--radius-full)',
                        background: style.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--spacing-md)'
                    }}>
                        <IconComponent size={28} color={style.iconColor} />
                    </div>

                    {/* Title */}
                    <h3 style={{
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: 600,
                        marginBottom: 'var(--spacing-sm)',
                        color: 'var(--color-text-primary)'
                    }}>
                        {displayTitle}
                    </h3>

                    {/* Message */}
                    <p style={{
                        color: 'var(--color-text-tertiary)',
                        fontSize: 'var(--font-size-sm)',
                        lineHeight: 1.6,
                        marginBottom: 'var(--spacing-lg)'
                    }}>
                        {message}
                    </p>

                    {/* Button */}
                    <button
                        className="btn btn-primary"
                        onClick={onClose}
                        style={{ minWidth: '120px' }}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
