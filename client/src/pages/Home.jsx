import HeroSection from '../pages/HeroSection'; 
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