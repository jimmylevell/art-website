/**
 * art-piece controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::art-piece.art-piece', ({ strapi }) => ({
    async find(ctx) {
        // Ensure category is populated
        ctx.query = {
            ...ctx.query,
            populate: {
                image: true,
                category: true,
            },
        };

        const { data, meta } = await super.find(ctx);
        return { data, meta };
    },

    async findOne(ctx) {
        // Ensure category is populated
        ctx.query = {
            ...ctx.query,
            populate: {
                image: true,
                category: true,
            },
        };

        const response = await super.findOne(ctx);
        return response;
    },
}));
