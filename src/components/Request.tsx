import { CONTACTS } from '@/lib/content';
import RequestForm from './RequestForm';

export default function Request() {
    const phone = CONTACTS.phoneHref || `tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`;
    return (
        <section className="contact partner-contacts" id="contact" aria-labelledby="contacts-title">
            <div className="contact-copy">
                <h2 id="contacts-title">
                    Ваше агентство.
                    <br />
                    <em>На связи.</em>
                </h2>
                {CONTACTS.name && <p className="agent-name">{CONTACTS.name}</p>}
                <p>Обсудим ваш бюджет и пожелания. Подбором и покупкой занимаемся лично.</p>
                <dl className="contact-direct" id="contact-direct" hidden={!CONTACTS.phone && !CONTACTS.email}>
                    {CONTACTS.phone && (
                        <div>
                            <dt>Телефон</dt>
                            <dd>
                                <a href={phone}>{CONTACTS.phone}</a>
                            </dd>
                        </div>
                    )}
                    {CONTACTS.email && (
                        <div>
                            <dt>Почта</dt>
                            <dd>
                                <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
                            </dd>
                        </div>
                    )}
                </dl>
                <div className="contact-channels" id="contact-channels">
                    <button type="button" data-inquiry="Обратный звонок риэлтора по подбору недвижимости">
                        <span className="contact-channel-icon" aria-hidden="true">
                            ↗
                        </span>
                        <span>
                            <strong>Обратный звонок</strong>
                            <small>Оставить номер для связи</small>
                        </span>
                        <span aria-hidden="true">→</span>
                    </button>
                    {[
                        { label: 'Telegram', url: CONTACTS.telegram },
                        { label: 'MAX', url: CONTACTS.max }
                    ]
                        .filter((item) => item.url.startsWith('https://'))
                        .map((item) => (
                            <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer">
                                <span className="contact-channel-icon" aria-hidden="true">
                                    ↗
                                </span>
                                <span>
                                    <strong>{item.label}</strong>
                                    <small>Написать риэлтору</small>
                                </span>
                                <span aria-hidden="true">→</span>
                            </a>
                        ))}
                </div>
            </div>
            <div className="contact-form-card">
                <h3>
                    Найдём ваш
                    <br />
                    дом у моря.
                </h3>
                <RequestForm id="contact-form" />
            </div>
        </section>
    );
}
