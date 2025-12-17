/**
 * art-piece router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::art-piece.art-piece', {
    config: {
        find: {
            auth: false,
            policies: [],
            middlewares: [],
        },
        findOne: {
            auth: false,
            policies: [],
            middlewares: [],
        },
    },
});
