export default function Process() {
    return (
        <section className="purchase section-pad" id="purchase">
            <div className="section-heading">
                <h2>
                    К своему дому.
                    <br />
                    <em>Шаг за шагом.</em>
                </h2>
            </div>
            <div className="purchase-grid">
                <article>
                    <span className="purchase-no">01</span>
                    <h3>Расскажите о планах</h3>
                    <p>Определим бюджет, район и важные для вас детали.</p>
                    <button className="text-link" data-inquiry="Первичная консультация по подбору недвижимости">
                        Обсудить пожелания
                        <span>↗</span>
                    </button>
                </article>
                <article>
                    <span className="purchase-no">02</span>
                    <h3>Сравните варианты</h3>
                    <p>Сравним предложения и организуем просмотр подходящих объектов.</p>
                    <button className="text-link" data-inquiry="Подбор вариантов и организация просмотра">
                        Запросить подборку
                        <span>↗</span>
                    </button>
                </article>
                <article>
                    <span className="purchase-no">03</span>
                    <h3>Пройдите этапы сделки</h3>
                    <p>Разберём условия, документы и порядок расчётов. Поможем пройти этапы покупки.</p>
                    <button className="text-link" data-inquiry="Консультация по этапам покупки недвижимости">
                        Обсудить покупку
                        <span>↗</span>
                    </button>
                </article>
            </div>
        </section>
    );
}
