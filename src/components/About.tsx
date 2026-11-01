export default function About() {
    return (
        <section className="intro section-pad" id="about">
            <div className="intro-main">
                <h2>
                    Море ближе.
                    <br />
                    <em>Выбор понятнее.</em>
                </h2>
                <div className="intro-copy">
                    <p className="lead">Недвижимость для вашего ритма жизни.</p>
                    <p>
                        Подберём варианты под ваш бюджет. Сравним районы, планировки и расходы на содержание.
                        Организуем просмотр.
                    </p>
                    <a href="#architecture" className="text-link">
                        Посмотреть особенности
                        <span>↗</span>
                    </a>
                </div>
            </div>
            <div className="facts">
                <div>
                    <span className="fact-value">У моря</span>
                    <p>Выберем комфортное расстояние до пляжа и удобный путь к воде.</p>
                </div>
                <div>
                    <span className="fact-value">С террасой</span>
                    <p>Обсудим вид из окон, естественный свет и место для отдыха на воздухе.</p>
                </div>
                <div>
                    <span className="fact-value">С сервисами</span>
                    <p>Сравним предложения по важным для вас сервисам и расходам на содержание.</p>
                </div>
            </div>
        </section>
    );
}
