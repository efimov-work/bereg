import { asset } from '@/lib/asset';
import AmbientVideo from './AmbientVideo';

export default function Architecture() {
    return (
        <section className="architecture" id="architecture">
            <div className="architecture-visual">
                <div className="architecture-photo">
                    <img
                        src={asset('/assets/images/02_architecture_detail-poster.jpg')}
                        alt="Фасад резиденций: скруглённые террасы и панорамное остекление"
                        loading="lazy"
                    />
                    <AmbientVideo className="ambient-video architecture-video" file="02_architecture_pingpong.mp4" />
                </div>
                <figure className="architecture-inset">
                    <img src={asset('/assets/images/10_entrance.jpg')} alt="Входная группа резиденций" loading="lazy" />
                </figure>
            </div>
            <div className="architecture-copy">
                <h2>
                    Больше света.
                    <br />
                    <em>Больше простора.</em>
                </h2>
                <p>Выберем планировку, вид и террасу под ваш образ жизни.</p>
                <div className="architecture-detail">
                    <div>
                        <h3>Остекление и террасы</h3>
                        <p>Оценим свет, вид из окон и пространство для отдыха.</p>
                    </div>
                </div>
                <div className="architecture-detail">
                    <div>
                        <h3>Инфраструктура комплекса</h3>
                        <p>Уточним доступ к сервисам и стоимость содержания.</p>
                    </div>
                </div>
                <button className="text-link" data-inquiry="Подбор недвижимости с террасой и видом на море">
                    Обсудить пожелания
                    <span>↗</span>
                </button>
            </div>
        </section>
    );
}
