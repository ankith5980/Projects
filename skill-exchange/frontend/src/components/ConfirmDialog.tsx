import { ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    isLoading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            iconBg: 'rgba(239, 68, 68, 0.15)',
            iconColor: 'var(--color-error)',
            buttonClass: 'btn-danger'
        },
        warning: {
            iconBg: 'rgba(245, 158, 11, 0.15)',
            iconColor: 'var(--color-warning)',
            buttonClass: 'btn-primary'
        },
        primary: {
            iconBg: 'rgba(139, 92, 246, 0.15)',
            iconColor: 'var(--color-primary)',
            buttonClass: 'btn-primary'
        }
    };

    const style = variantStyles[variant];

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
                    maxWidth: '400px',
                    animation: 'slideUp 0.2s ease'
                }}
            >
                {/* Header with close button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: 'var(--spacing-md) var(--spacing-md) 0'
                }}>
                    <button
                        onClick={onClose}
                        className="modal-close"
                        disabled={isLoading}
                    >
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
                        width: 64,
                        height: 64,
                        borderRadius: 'var(--radius-full)',
                        background: style.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--spacing-lg)'
                    }}>
                        <AlertTriangle size={32} color={style.iconColor} />
                    </div>

                    {/* Title */}
                    <h3 style={{
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 600,
                        marginBottom: 'var(--spacing-sm)',
                        color: 'var(--color-text-primary)'
                    }}>
                        {title}
                    </h3>

                    {/* Message */}
                    <p style={{
                        color: 'var(--color-text-tertiary)',
                        fontSize: 'var(--font-size-sm)',
                        lineHeight: 1.6,
                        marginBottom: 'var(--spacing-xl)'
                    }}>
                        {message}
                    </p>

                    {/* Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-md)',
                        justifyContent: 'center'
                    }}>
                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={isLoading}
                            style={{ minWidth: '100px' }}
                        >
                            {cancelText}
                        </button>
                        <button
                            className={`btn ${style.buttonClass}`}
                            onClick={onConfirm}
                            disabled={isLoading}
                            style={{ minWidth: '100px' }}
                        >
                            {isLoading ? 'Processing...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
