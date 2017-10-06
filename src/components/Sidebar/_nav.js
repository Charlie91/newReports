
export default {
  items: [
    {
      name: 'Главная',
      url: '/dashboard',
      icon: 'icon-home',
      badge: {
        variant: 'info'
      }
    },
    {
      name: 'ТРЦ Трафик',
      url: '/d',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
      }
    },
    {
      name: 'Руспетрол',
      url: '/da',
      icon: 'icon-fire',
      badge: {
        variant: 'info',
      }
    },
    {
      name: 'Ферма.РФ',
      url: '/das/das',
      icon: 'icon-basket-loaded',
      badge: {
        variant: 'info'
      },
      children: [
        {
          name: 'Выручка',
          url: '/components/buttons',
          icon: 'icon-credit-card',
          children:[
            {
              name: 'Выручка за 2017',
              url: '/components/buttons/2017',
              icon: 'icon-credit-card'
            }
          ]
        }
      ]
    },
    {
      name: 'Гостиницы',
      url: '/dash/dash',
      icon: 'icon-key',
      badge: {
        variant: 'info'
      },
      children: [
        {
          name: 'SK Royal',
          url: '/components/b',
          icon: 'icon-key'
        },
        {
          name: 'Калуга',
          url: '/components/bu',
          icon: 'icon-key'
        },
        {
          name: 'Паркотель',
          url: '/components/but',
          icon: 'icon-key'
        },
        {
          name: 'Квань',
          url: '/components/butt',
          icon: 'icon-key'
        },
        {
          name: 'ДеАрт 13',
          url: '/components/butto',
          icon: 'icon-key'
        }
      ]
    },
    {
      name: 'Рестораны',
      url: '/restaurants',
      icon: 'icon-cup',
      badge: {
        variant: 'info',
        text: 'NEW'
      },
      children: [
        {
          name: 'Арагви',
          url: '/restaurants/b',
          icon: 'icon-cup'
        },
        {
          name: 'Хлебный двор',
          url: '/restaurants/bu',
          icon: 'icon-cup'
        },
        {
          name: 'Ресторан D.O.M.',
          url: '/restaurants/but',
          icon: 'icon-cup'
        },
        {
          name: 'Seasons',
          url: '/restaurants/butt',
          icon: 'icon-cup'
        },
        {
          name: 'Рестораны Манчо',
          url: '/restaurants/butto',
          icon: 'icon-cup'
        },
        {
          name: 'Долина Солнца',
          url: '/restaurants/button',
          icon: 'icon-cup'
        }
      ]
    },
    {
      name: 'Фастфуд ГФ',
      url: '/fastfood',
      icon: 'icon-cup',
      badge: {
        variant: 'info',
        text: 'NEW'
      },
      children: [
        {
          name: 'Рестораны Мерцен',
          url: '/fastfood/b',
          icon: 'icon-cup'
        },
        {
          name: 'ГФ Москва',
          url: '/fastfood/bu',
          icon: 'icon-cup'
        },
        {
          name: 'ГФ Московская обл.',
          url: '/fastfood/but',
          icon: 'icon-cup'
        },
        {
          name: 'ГФ Аксай',
          url: '/fastfood/butt',
          icon: 'icon-cup'
        },
        {
          name: 'ГФ Астрахань',
          url: '/fastfood/butto',
          icon: 'icon-cup'
        },
        {
          name: 'ГФ Белгород',
          url: '/fastfood/button',
          icon: 'icon-cup'
        },
        {
          name: 'ГФ Владимир',
          url: '/fastfood/buttons',
          icon: 'icon-cup'
        }
      ]
    }
  ]
};
