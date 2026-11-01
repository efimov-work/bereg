import About from '@/components/About';
import Architecture from '@/components/Architecture';
import Dialogs from '@/components/Dialogs';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Infrastructure from '@/components/Infrastructure';
import Location from '@/components/Location';
import Marquee from '@/components/Marquee';
import Motion from '@/components/Motion';
import Process from '@/components/Process';
import Request from '@/components/Request';
import Wave from '@/components/Wave';

export default function Page() {
    return (
        <div className="lp" id="top">
            <a className="skip" href="#about">
                К содержанию
            </a>
            <Header />
            <main>
                <Hero />
                <Marquee />
                <About />
                <Architecture />
                <Infrastructure />
                <Location />
                <Gallery />
                <Wave from="var(--deep)" to="#dfe9e5" />
                <Process />
                <Faq />
                <Request />
            </main>
            <Wave from="var(--paper)" to="var(--deep)" />
            <Footer />
            <Dialogs />
            <Motion />
        </div>
    );
}
