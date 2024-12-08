export const profile = {
    name: 'Иван',
    fields: [
        { name: "Почта", value: "pochta@yandex.ru" },
        { name: "Логин", value: "ivanivanov" },
        { name: "Имя", value: "Иван" },
        { name: "Фамилия", value: "Иванов" },
        { name: "Имя в чате", value: "Иван" },
        { name: "Телефон", value: "7 (909) 967 30 30" }
    ],
    actions: [
        {
            id: 'profileChangeInfoBtn',
            text: 'Изменить данные',
            color: 'blue'
        },
        {
            id: 'profileChangePasswordBtn',
            text: 'Изменить пароль',
            color: 'blue'
        },
        {
            id: '',
            text: 'Выйти',
            color: 'red'
        }
    ],
    changePasswordFields: [
        { name: 'Старый пароль', value: "●●●●●" },
        { name: 'Новый пароль', value: "●●●" },
        { name: 'Повторите новый пароль', value: "●●●●" }
    ],
    changeProfileInfoControls: [
        {
            label: 'Почта',
            type: 'email',
            value: 'pochta@yandex.ru',
            inputName: 'email'
        },
        {
            label: 'Логин',
            type: 'text',
            value: 'ivanivanov',
            inputName: 'login'
        },
        {
            label: 'Имя',
            type: 'text',
            value: 'Иван',
            inputName: 'first_name'
        },
        {
            label: 'Фамилия',
            type: 'text',
            value: 'Иванов',
            inputName: 'second_name'
        },
        {
            label: 'Имя в чате',
            type: 'text',
            value: 'Иван',
            inputName: 'display_name'
        },
        {
            label: 'Телефон',
            type: 'tel',
            value: '+7 (909) 967 30 30',
            inputName: 'phone'
        }
    ],
    changeProfilePasswordControls: [
        {
            label: 'Старый пароль',
            type: 'password',
            value: '+7 (909) 967 30 30',
            inputName: 'oldPassword'
        },
        {
            label: 'Новый пароль',
            type: 'password',
            value: '+7 (909) 967 30 30',
            inputName: 'newPassword'
        },
        {
            label: 'Повторите новый пароль',
            type: 'password',
            value: '+7 (909) 967 30 30',
            hint: 'Пароли не совпадают',
            inputName: 'newPasswordCheck'
        }
    ]
};

export const signIn = {
    controls: [
        {
            label: 'Почта',
            type: 'email',
            value: 'pochta@yandex.ru',
            inputName: 'email'
        },
        {
            label: 'Логин',
            type: 'text',
            value: 'ivanivanov',
            inputName: 'login'
        },
        {
            label: 'Имя',
            type: 'text',
            value: 'Иван',
            inputName: 'first_name'
        },
        {
            label: 'Фамилия',
            type: 'text',
            value: 'Иванов',
            inputName: 'second_name'
        },
        {
            label: 'Телефон',
            type: 'tel',
            value: '+7 (909) 967 30 30',
            inputName: 'phone'
        },
        {
            label: 'Пароль',
            type: 'password',
            value: '+7 (909) 967 30 30',
            inputName: 'passwordFirst'
        },
        {
            label: 'Пароль (еще раз)',
            type: 'password',
            value: '+7 (909) 967 30 30',
            hint: 'Пароли не совпадают',
            inputName: 'password'
        }
    ]
};

export const logIn = {
    controls: [
        {
            label: 'Логин',
            type: 'text',
            value: 'ivanivanov',
            hint: 'Неверный логин',
            inputName: 'login'
        },
        {
            label: 'Пароль',
            type: 'password',
            value: '+7 (909) 967 30 30',
            inputName: 'password'
        }
    ]
}

export const navigationList = [
    {
        name: 'Чат',
        id: 'Chat'
    },
    {
        name: 'Выбрать Чат',
        id: 'ChatNotSelected'
    },
    {
        name: 'Поиск чата',
        id: 'ChatSearch'
    },
    {
        name: 'Функции чата',
        id: 'ChatFunctions'
    },
    {
        name: 'LogIn',
        id: 'LogIn'
    },
    {
        name: 'SignIn',
        id: 'SignIn'
    },
    {
        name: 'Профиль',
        id: 'Profile'
    },
    {
        name: 'Профиль. Изменить данные',
        id: 'ChangeProfileData'
    },
    {
        name: 'Профиль. Изменить пароль',
        id: 'ChangeProfilePassword'
    },
    {
        name: 'Профиль. Загрузить новый аватар',
        id: 'ChangeProfileAvatar'
    },
    {
        name: '404',
        id: 'Page404'
    },
    {
        name: '500',
        id: 'Page500'
    }
];

export const chatList = [
    {
        name: 'Андрей',
        time: '10:49',
        lastMsg: 'Изображение',
        unreadAmount: '2'
    },
    {
        name: 'Киноклуб',
        time: '12:00',
        lastMsg: '<span class="text-black">Вы:</span> стикер',
    },
    {
        name: 'Илья',
        time: '15:12',
        lastMsg: 'Друзья, у меня для вас особенный выпуск новостей!',
        unreadAmount: '4'
    },
    {
        name: 'Вадим',
        time: 'Пт',
        lastMsg: '<span class="text-black">Вы:</span> круто',
        isActive: true
    },
    {
        name: 'тет-а-теты',
        time: 'Ср',
        lastMsg: 'И Human Interface Guidelines и Material Design рекомендуют'
    },
    {
        name: '1, 2, 3',
        time: 'Пн',
        lastMsg: 'Миллионы россиян ежедневно проводят десятки часов свое...'
    },
    {
        name: 'Design Destroyer',
        time: 'Пн',
        lastMsg: 'В 2008 году художник Jon Rafman начал собирать'
    },
    {
        name: 'Day.',
        time: '1 Мая 2020',
        lastMsg: 'Так увлёкся работой по курсу, что совсем забыл его анонсир'
    },
    {
        name: 'тет-а-теты',
        time: 'Ср',
        lastMsg: 'И Human Interface Guidelines и Material Design рекомендуют'
    },
    {
        name: '1, 2, 3',
        time: 'Пн',
        lastMsg: 'Миллионы россиян ежедневно проводят десятки часов свое...'
    },
    {
        name: 'Design Destroyer',
        time: 'Пн',
        lastMsg: 'В 2008 году художник Jon Rafman начал собирать'
    },
    {
        name: 'Day.',
        time: '1 Мая 2020',
        lastMsg: 'Так увлёкся работой по курсу, что совсем забыл его анонсир'
    },
    {
        name: 'тет-а-теты',
        time: 'Ср',
        lastMsg: 'И Human Interface Guidelines и Material Design рекомендуют'
    },
    {
        name: '1, 2, 3',
        time: 'Пн',
        lastMsg: 'Миллионы россиян ежедневно проводят десятки часов свое...'
    },
    {
        name: 'Design Destroyer',
        time: 'Пн',
        lastMsg: 'В 2008 году художник Jon Rafman начал собирать'
    },
    {
        name: 'Day.',
        time: '1 Мая 2020',
        lastMsg: 'Так увлёкся работой по курсу, что совсем забыл его анонсир'
    }
];
