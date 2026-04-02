import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 12,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: {
            duration: 0.2,
            ease: [0.55, 0.085, 0.68, 0.53] as [number, number, number, number],
        },
    },
};

interface PageTransitionProps {
    children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ width: '100%' }}
        >
            {children}
        </motion.div>
    );
}
