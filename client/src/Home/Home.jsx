import React from 'react';
import HeroSection from '../components/HeroSection'; // Ajustado a components
import StatsSection from '../components/StatsSection'; 
import ClassesSection from '../components/ClassesSection'; 
import MembershipSection from '../components/MembershipSection';
import FooterSection from '../components/FooterSection';

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <StatsSection />
            <ClassesSection />
            <MembershipSection />
            <FooterSection />
        </>
    );
};

export default HomePage;