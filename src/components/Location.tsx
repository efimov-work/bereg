import { asset } from '@/lib/asset';

export default function Location() {
    return (
        <section className="location">
            <div className="location-content">
                <h2>
                    Ваш район.
                    <br />
                    <em>Ваш ритм жизни.</em>
                </h2>
                <p>Выберем район с удобной дорогой к морю, транспортом и нужными сервисами.</p>
                <ul className="location-points">
                    <li>Доступ к побережью</li>
                    <li>Подъезд и транспорт</li>
                    <li>Сервисы и места отдыха</li>
                </ul>
                <button className="text-link" data-inquiry="Помощь в выборе района у моря">
                    Выбрать район
                    <span>↗</span>
                </button>
            </div>
            <div className="location-collage">
                <figure className="location-main-photo">
                    <img
                        src={asset('/assets/images/17_courtyard.jpg')}
                        alt="Озеленённый внутренний двор резиденций"
                        loading="lazy"
                    />
                </figure>
                <figure className="location-coast-photo">
                    <img
                        src={asset('/assets/images/03_sea_approach.jpg')}
                        alt="Расположение здания относительно побережья"
                        loading="lazy"
                    />
                </figure>
            </div>
        </section>
    );
}
