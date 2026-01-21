
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Coins,
    Users,
    ArrowRight,
    Repeat,
    Zap,
    Shield,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    GraduationCap,
    Star,
    LucideIcon
} from 'lucide-react';

interface StepItem {
    step: number;
    title: string;
    desc: string;
    Icon: LucideIcon;
    color: string;
}

const howItWorksSteps: StepItem[] = [
    { step: 1, title: 'Create Profile', desc: 'Sign up and list the skills you can teach to the community', Icon: UserPlus, color: '#8B5CF6' },
    { step: 2, title: 'Earn Points', desc: 'Teach others and earn points for every session you complete', Icon: Coins, color: '#F59E0B' },
    { step: 3, title: 'Learn Skills', desc: 'Use your earned points to book sessions and learn new skills', Icon: GraduationCap, color: '#06B6D4' },
    { step: 4, title: 'Rate & Grow', desc: 'Rate your sessions and build your reputation in the community', Icon: Star, color: '#10B981' }
];

export default function HomePage() {
    const { isAuthenticated } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);

    // Auto-advance carousel every 3 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % howItWorksSteps.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const goToStep = (index: number) => setCurrentStep(index);
    const prevStep = () => setCurrentStep((prev) => (prev - 1 + howItWorksSteps.length) % howItWorksSteps.length);
    const nextStep = () => setCurrentStep((prev) => (prev + 1) % howItWorksSteps.length);

    const features = [
        {
            icon: Repeat,
            title: 'Skill Exchange',
            description: 'Trade your expertise. Teach what you know, learn what you need.'
        },
        {
            icon: Coins,
            title: 'Points Economy',
            description: 'Earn points by teaching, spend them to learn. Fair and balanced.'
        },
        {
            icon: Users,
            title: 'Community',
            description: 'Connect with learners and experts from around the world.'
        },
        {
            icon: Shield,
            title: 'Trusted Reviews',
            description: 'Make informed choices with our transparent rating system.'
        },
        {
            icon: MessageCircle,
            title: 'Easy Coordination',
            description: 'Built-in chat to schedule and coordinate your sessions.'
        },
        {
            icon: Zap,
            title: 'Instant Sessions',
            description: 'Book sessions quickly and start learning right away.'
        }
    ];

    const categories = [
        'Programming', 'Design', 'Marketing', 'Music',
        'Languages', 'Business', 'Photography', 'Writing'
    ];

    return (
        <div className="app-container" style={{ padding: 0 }}>
            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                padding: 'var(--spacing-2xl)'
            }}>
                {/* Background Gradient */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
                    animation: 'glow-rotate 30s linear infinite'
                }} />

                <div style={{
                    textAlign: 'center',
                    maxWidth: 800,
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-xs) var(--spacing-md)',
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-full)',
                        marginBottom: 'var(--spacing-xl)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <Zap size={16} color="var(--color-warning)" />
                        <span style={{ fontSize: 'var(--font-size-sm)' }}>
                            Start with 100 free points
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: 'var(--spacing-lg)'
                    }}>
                        Learn a Skill,{' '}
                        <span className="text-gradient">Teach a Skill</span>
                    </h1>

                    <p style={{
                        fontSize: 'var(--font-size-xl)',
                        color: 'var(--color-text-tertiary)',
                        marginBottom: 'var(--spacing-2xl)',
                        maxWidth: 600,
                        margin: '0 auto var(--spacing-2xl)'
                    }}>
                        The peer-to-peer skill exchange platform. No money involved –
                        just a community of people sharing knowledge and growing together.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-md)',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        {isAuthenticated ? (
                            <>
                                <Link to="/explore" className="btn btn-primary btn-lg">
                                    Explore Skills
                                    <ArrowRight size={18} />
                                </Link>
                                <Link to="/skills/new" className="btn btn-secondary btn-lg">
                                    Start Teaching
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get Started Free
                                    <ArrowRight size={18} />
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-lg">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--spacing-2xl)',
                        marginTop: 'var(--spacing-3xl)',
                        flexWrap: 'wrap'
                    }}>
                        {[
                            { value: '10K+', label: 'Active Users' },
                            { value: '5K+', label: 'Skills Listed' },
                            { value: '25K+', label: 'Sessions Completed' }
                        ].map((stat) => (
                            <div key={stat.label} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: 'var(--font-size-3xl)',
                                    fontWeight: 700
                                }}>
                                    {stat.value}
                                </div>
                                <div
                                    className="text-gradient"
                                    style={{
                                        fontSize: 'var(--font-size-sm)',
                                        fontWeight: 500
                                    }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{
                padding: 'var(--spacing-3xl) var(--spacing-xl)',
                background: 'var(--color-bg-secondary)'
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
                        <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>
                            Why Choose <span className="text-gradient">SkillSwap</span>?
                        </h2>
                        <p style={{ color: 'var(--color-text-tertiary)', maxWidth: 600, margin: '0 auto' }}>
                            Everything you need to learn and teach skills in a collaborative community.
                        </p>
                    </div>

                    <div className="grid grid-3">
                        {features.map((feature) => (
                            <div key={feature.title} className="card">
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--color-primary-glow)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 'var(--spacing-md)'
                                }}>
                                    <feature.icon size={24} color="var(--color-primary-light)" />
                                </div>
                                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{feature.title}</h3>
                                <p style={{ color: 'var(--color-text-tertiary)' }}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section style={{
                padding: 'var(--spacing-3xl) var(--spacing-xl)'
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                        <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>
                            Popular <span className="text-gradient">Categories</span>
                        </h2>
                        <p style={{ color: 'var(--color-text-tertiary)' }}>
                            Explore skills across various domains
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--spacing-md)',
                        justifyContent: 'center'
                    }}>
                        {categories.map((category) => (
                            <Link
                                key={category}
                                to={`/explore?category=${category}`}
                                style={{
                                    padding: 'var(--spacing-md) var(--spacing-xl)',
                                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    borderRadius: 'var(--radius-lg)',
                                    color: 'var(--color-text-primary)',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    fontSize: 'var(--font-size-sm)',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)';
                                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)';
                                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.1)';
                                }}
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            {/* How It Works - Carousel */}
            <section style={{
                padding: 'var(--spacing-2xl) var(--spacing-xl)',
                background: 'var(--color-bg-secondary)',
                overflow: 'hidden'
            }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                        <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-sm)' }}>
                            How It <span className="text-gradient">Works</span>
                        </h2>
                    </div>

                    {/* Carousel Container */}
                    <div style={{ position: 'relative' }}>
                        {/* Carousel Track */}
                        <div style={{
                            overflow: 'hidden',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-sm)'
                        }}>
                            <div style={{
                                display: 'flex',
                                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: `translateX(-${currentStep * 100}%)`
                            }}>
                                {howItWorksSteps.map((item) => (
                                    <div
                                        key={item.step}
                                        style={{
                                            minWidth: '100%',
                                            padding: 'var(--spacing-sm)'
                                        }}
                                    >
                                        <div style={{
                                            textAlign: 'center',
                                            padding: 'var(--spacing-xl) var(--spacing-lg)',
                                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(139, 92, 246, 0.15)',
                                            borderRadius: 'var(--radius-lg)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            {/* Step indicator badge */}
                                            <div style={{
                                                position: 'absolute',
                                                top: 12,
                                                left: 12,
                                                padding: '4px 10px',
                                                background: 'rgba(139, 92, 246, 0.15)',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '10px',
                                                fontWeight: 600,
                                                color: 'var(--color-primary-light)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Step {item.step} of 4
                                            </div>

                                            {/* Icon with gradient background */}
                                            <div style={{
                                                width: 64,
                                                height: 64,
                                                margin: '0 auto var(--spacing-md)',
                                                background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}08 100%)`,
                                                borderRadius: 'var(--radius-lg)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: `0 6px 24px -6px ${item.color}30`,
                                                border: `1px solid ${item.color}25`
                                            }}>
                                                <item.Icon size={32} color={item.color} strokeWidth={1.5} />
                                            </div>

                                            {/* Step number */}
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 32,
                                                height: 32,
                                                borderRadius: 'var(--radius-full)',
                                                background: 'var(--gradient-primary)',
                                                fontSize: 'var(--font-size-sm)',
                                                fontWeight: 700,
                                                marginBottom: 'var(--spacing-sm)'
                                            }}>
                                                {item.step}
                                            </div>

                                            {/* Title */}
                                            <h3 style={{
                                                fontSize: 'var(--font-size-lg)',
                                                fontWeight: 700,
                                                marginBottom: 'var(--spacing-xs)',
                                                color: 'var(--color-text-primary)'
                                            }}>
                                                {item.title}
                                            </h3>

                                            {/* Description */}
                                            <p style={{
                                                color: 'var(--color-text-tertiary)',
                                                fontSize: 'var(--font-size-sm)',
                                                lineHeight: 1.5,
                                                maxWidth: 280,
                                                margin: '0 auto'
                                            }}>
                                                {item.desc}
                                            </p>

                                            {/* Bottom accent line */}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 50,
                                                height: 2,
                                                background: 'var(--gradient-primary)',
                                                borderRadius: 'var(--radius-full)'
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Row: Arrows + Dots */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--spacing-lg)',
                            marginTop: 'var(--spacing-lg)'
                        }}>
                            {/* Left Arrow */}
                            <button
                                onClick={prevStep}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                                    border: '1px solid rgba(139, 92, 246, 0.4)',
                                    borderRadius: 'var(--radius-full)',
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    flexShrink: 0,
                                    boxShadow: '0 0 15px rgba(139, 92, 246, 0.2), inset 0 0 10px rgba(139, 92, 246, 0.05)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)';
                                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.6)';
                                    e.currentTarget.style.boxShadow = '0 0 25px rgba(139, 92, 246, 0.4), inset 0 0 15px rgba(139, 92, 246, 0.1)';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)';
                                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.2), inset 0 0 10px rgba(139, 92, 246, 0.05)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <ChevronLeft size={18} color="rgba(139, 92, 246, 0.9)" />
                            </button>

                            {/* Dots */}
                            <div style={{
                                display: 'flex',
                                gap: 'var(--spacing-xs)'
                            }}>
                                {howItWorksSteps.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToStep(index)}
                                        style={{
                                            width: index === currentStep ? 24 : 10,
                                            height: 10,
                                            borderRadius: 'var(--radius-full)',
                                            background: index === currentStep
                                                ? 'var(--color-primary)'
                                                : 'var(--color-border)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={nextStep}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                                    border: '1px solid rgba(139, 92, 246, 0.4)',
                                    borderRadius: 'var(--radius-full)',
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    flexShrink: 0,
                                    boxShadow: '0 0 15px rgba(139, 92, 246, 0.2), inset 0 0 10px rgba(139, 92, 246, 0.05)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)';
                                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.6)';
                                    e.currentTarget.style.boxShadow = '0 0 25px rgba(139, 92, 246, 0.4), inset 0 0 15px rgba(139, 92, 246, 0.1)';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)';
                                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.2), inset 0 0 10px rgba(139, 92, 246, 0.05)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <ChevronRight size={18} color="rgba(139, 92, 246, 0.9)" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: 'var(--spacing-3xl) var(--spacing-xl)',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>
                        Ready to <span className="text-gradient">Start Learning</span>?
                    </h2>
                    <p style={{
                        color: 'var(--color-text-tertiary)',
                        marginBottom: 'var(--spacing-xl)'
                    }}>
                        Join thousands of learners and teachers exchanging skills every day.
                    </p>
                    <Link to={isAuthenticated ? '/explore' : '/register'} className="btn btn-primary btn-lg">
                        {isAuthenticated ? 'Explore Skills' : 'Join SkillSwap Today'}
                        <ArrowRight size={18} />
                    </Link>
                </div>  
            </section>

            {/* Footer */}
            <footer style={{
                padding: 'var(--spacing-xl)',
                borderTop: '1px solid var(--color-border)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-sm)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-md)'
                }}>
                    <Repeat size={20} color="var(--color-primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        SkillSwap
                    </span>
                </div>
                <p>© 2025 SkillSwap. Built for Learners, by Learners.</p>
            </footer>
        </div>
    );
}
