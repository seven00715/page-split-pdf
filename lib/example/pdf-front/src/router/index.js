"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
const vue_router_1 = __importDefault(require("vue-router"));
const index_vue_1 = __importDefault(require("../views/index.vue"));
const clickPage_vue_1 = __importDefault(require("../views/clickPage.vue"));
const syncPage_vue_1 = __importDefault(require("../views/syncPage.vue"));
const asyncDownload_vue_1 = __importDefault(require("../views/asyncDownload.vue"));
vue_1.default.use(vue_router_1.default);
const routes = [
    {
        path: '/',
        name: 'home',
        component: index_vue_1.default,
    },
    {
        path: '/clickPage',
        name: 'clickPage',
        component: clickPage_vue_1.default,
    },
    {
        path: '/syncPage',
        name: 'syncPage',
        component: syncPage_vue_1.default,
    },
    {
        path: '/asyncDownload',
        name: 'asyncDownload',
        component: asyncDownload_vue_1.default,
    },
];
const router = new vue_router_1.default({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});
exports.default = router;
