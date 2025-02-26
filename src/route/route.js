export const routes = {
    '#home': {
        component: () => import('../../src/features/Home/HomePage.js')
    },
    '#facilities': {
        component: () => import('')
    },
    '#livetv': {
        component: () => import('../../src/features/LiveTv/LiveTv.js')
    },
    '#restaurant': {
        component: () => import('')
    },
    '#settings': {
        component: () => import('')
    }
};