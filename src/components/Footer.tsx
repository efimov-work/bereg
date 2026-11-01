import { asset } from '@/lib/asset';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <a className="brand" href="#">
                    <img
                        className="brand-logo"
                        src={asset('/assets/brand/bereg-logo.png')}
                        alt="Берег"
                        width="2081"
                        height="756"
                        decoding="async"
                    />
                    <span className="brand-sub">Недвижимость у моря</span>
                </a>
                <nav className="footer-nav" aria-label="Разделы сайта">
                    <a href="#about">О подборе</a>
                    <a href="#life">Инфраструктура</a>
                    <a href="#contact">Контакты</a>
                </nav>
                <a href="#hero-title" className="back-top">
                    Вернуться наверх ↑
                </a>
            </div>
        </footer>
    );
}
