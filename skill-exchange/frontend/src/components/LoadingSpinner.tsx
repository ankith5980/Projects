

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
    const sizeMap = {
        sm: 24,
        md: 40,
        lg: 60
    };

    return (
        <div className="loading-container">
            <div
                className="loading-spinner"
                style={{
                    width: sizeMap[size],
                    height: sizeMap[size]
                }}
            />
            {text && <p className="text-muted mt-md">{text}</p>}
        </div>
    );
}
