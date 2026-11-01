const PHRASES = [
    'Дом у моря',
    'Подбор под ваш бюджет',
    'Проверенные объекты',
    'Просмотры без спешки',
    'Сопровождение сделки',
    'Честные условия'
];

export default function Marquee() {
    return (
        <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
                {[0, 1].map((copy) => (
                    <ul key={copy}>
                        {PHRASES.map((phrase) => (
                            <li key={phrase}>{phrase}</li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    );
}
