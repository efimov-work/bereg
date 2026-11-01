export const CONTACTS = {
    name: '',
    phone: '',
    phoneHref: '',
    email: '',
    telegram: '',
    max: ''
};

export const NAV = [
    { href: '#about', label: 'О подборе' },
    { href: '#architecture', label: 'Архитектура' },
    { href: '#life', label: 'Инфраструктура' },
    { href: '#purchase', label: 'Как купить' }
];

export const SCENES = [
    {
        id: 'pool',
        label: 'Бассейн над морем',
        title: 'Бассейн с видом на море.',
        description: 'Отдых у воды с видом на побережье.',
        image: '/assets/images/03_rooftop_pool-poster.jpg',
        alt: 'Бассейн на крыше с видом на побережье',
        video: '03_rooftop_pool.mp4'
    },
    {
        id: 'spa',
        label: 'Спа и восстановление',
        title: 'Спа внутри комплекса.',
        description: 'Тихое пространство для отдыха и восстановления.',
        image: '/assets/images/05_spa_interior-poster.jpg',
        alt: 'Спа с купелью и зоной отдыха',
        video: '05_spa_interior.mp4'
    },
    {
        id: 'restaurant',
        label: 'Ресторан',
        title: 'Ресторан рядом с домом.',
        description: 'Завтрак рядом с домом. Ужин после прогулки у моря.',
        image: '/assets/images/15_restaurant.jpg',
        alt: 'Ресторан с панорамными окнами'
    },
    {
        id: 'lobby',
        label: 'Клубная гостиная',
        title: 'Общие пространства.',
        description: 'Место для встреч и спокойного отдыха.',
        image: '/assets/images/12_lobby.jpg',
        alt: 'Клубная гостиная с местами для встреч'
    }
];

export const GALLERY = [
    {
        image: '/assets/images/19_interior_view.jpg',
        title: 'Интерьер',
        alt: 'Светлая гостиная с панорамным остеклением'
    },
    { image: '/assets/images/18_terrace.jpg', title: 'Терраса', alt: 'Терраса с видом на морское побережье' },
    { image: '/assets/images/09_blue_hour.jpg', title: 'Вечерний вид', alt: 'Вечернее освещение резиденций у моря' },
    { image: '/assets/images/16_lounge.jpg', title: 'Лаунж', alt: 'Лаунж с местами для встреч и отдыха' },
    { image: '/assets/images/14_fitness.jpg', title: 'Фитнес', alt: 'Фитнес-пространство с панорамным остеклением' }
];

// Enabled only after the owner configures contacts, data handling and delivery.
export const LEADS_ENABLED = process.env.NEXT_PUBLIC_LEADS_ENABLED === '1';
