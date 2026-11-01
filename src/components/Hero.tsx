import { asset } from '@/lib/asset';
import AmbientVideo from './AmbientVideo';

export default function Hero() {
    return (
        <section className="hero" aria-labelledby="hero-title">
            <div className="hero-content">
                <div className="hero-heading">
                    <h1 id="hero-title">
                        Ваш дом у моря.
                        <br />
                        <em>С заботой о выборе.</em>
                    </h1>
                </div>
                <div className="hero-intro">
                    <p className="hero-description">
                        Поможем найти недвижимость у моря для жизни и отдыха. Обсудим ваш бюджет, выберем район и
                        сравним подходящие варианты.
                    </p>
                    <div className="hero-actions">
                        <button className="button button-dark" data-inquiry="Подбор недвижимости у моря">
                            Подобрать недвижимость
                            <span>↗</span>
                        </button>
                        <a className="hero-secondary" href="#purchase">
                            Как проходит покупка
                            <span>↓</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="hero-film">
                <div className="hero-film-media">
                    <picture className="hero-poster">
                        <img
                            src={asset('/assets/images/00_coastal_sequence-poster.jpg')}
                            alt="Общий вид резиденций на морском побережье"
                            fetchPriority="high"
                        />
                    </picture>
                    <AmbientVideo
                        className="hero-video ambient-video"
                        file="00_coastal_sequence.mp4"
                        poster={asset('/assets/images/00_coastal_sequence-poster.jpg')}
                    />
                </div>
            </div>
        </section>
    );
}
