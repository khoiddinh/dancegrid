import React from 'react';
import { Home, User, Plus, Minus, Heart, Star } from 'lucide-react';


const HelloStyles = () => {
    // have all the colors here
    const colors = {
        primary: '#ffffff',
        secondary: '#cbced4',
        accent: '#93C5FD',
        accent2: '#FDE047',
        accent3: '#A7F3D0'
    }

    return (
        <div style={{ backgroundColor: colors.primary, color: colors.secondary }}>
            <h1 style={{ color: colors.secondary }}>Hello World App</h1>
            <h1 style={{ color: colors.secondary }}>Hello Styles</h1>
            <h1 style={{ color: colors.accent }}>Hello Styles</h1>
            <h1 style={{ color: colors.accent2 }}>Hello Styles</h1>
            <h1 style={{ color: colors.accent3 }}>Hello Styles</h1>
            <Home size={32} color={colors.accent} />
            <User size={32} color={colors.accent2} />
            <Plus size={32} color={colors.accent} />
            <Minus size={32} color={colors.accent2} />
            <Heart size={32} color={colors.accent3} />
            <Star size={32} color={colors.accent} />
        </div>
    );
}

export default HelloStyles