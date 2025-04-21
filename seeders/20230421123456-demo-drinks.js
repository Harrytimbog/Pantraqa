'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('drinks', [
            // Coca Cola variations
            {
                name: 'Lemonade',
                size: '200ml',
                category: 'soft',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Coca Cola',
                size: '200ml',
                category: 'soft',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Coca Cola',
                size: '330ml',
                category: 'soft',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            // Coke Zero variations
            {
                name: 'Coke Zero',
                size: '200ml',
                category: 'soft',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Coke Zero',
                size: '330ml',
                category: 'soft',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            // Diet Coke variations
            {
                name: 'Diet Coke',
                size: '200ml',
                category: 'soft',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Diet Coke',
                size: '330ml',
                category: 'soft',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            // Ginger Beer
            {
                name: 'Ginger Beer',
                size: '200ml',
                category: 'soft',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            // Fanta
            {
                name: 'Fanta',
                size: '330ml', // Assuming standard Fanta bottle size
                category: 'soft',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            // Your original alcoholic drinks
            {
                name: 'Prosecco',
                size: 'Large',
                category: 'wine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Prosecco',
                size: 'Small',
                category: 'wine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Nyala Savignon Blanc',
                size: 'Large',
                category: 'wine',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Nyala Cabernet Sauvignon',
                size: 'Large',
                category: 'wine',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('drinks', null, {});
    },
};