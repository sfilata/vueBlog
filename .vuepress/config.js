module.exports = {
    title: 'Sfilata个人主页',
    description: 'vuepress 创建的博客',
    head: [
        ['link', { rel: 'icon', href: '/img/logo.ico' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
    ],
    themeConfig: {
        nav: [
            { text: '主页', link: '/' },
            { text: '博文',
              items: [
                { text: 'React', link: '/workdoc/' },
                { text: 'Vue', link: '/vue/' },
                { text: 'Web', link: '/web/' }
              ]
            },
            { text: '关于', link: '/about.html' },
            { text: '联系我', link: '/contact.html' },
            { text: 'Github', link: 'https://www.github.com/sfilata' },
        ],
        sidebar: {
            '/workdoc/': [
                '',
                'VsCode',  /* /foo/one.html */
                'Vue',   /* /foo/two.html */
            ],
            // fallback
            '/': [
                '',        /* / */
                'contact', /* /contact.html */
                'about'    /* /about.html */
            ]
        },
        lastUpdated: 'Last Updated', // string | boolean
    },
}