"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("TestMigrations", [
      {
        firstName: "Vlad",
        lastName: "Bortnik",
        email: "vb@mail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        successColumn: "ok",
      },
    ]);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete(
      "TestMigrations",
      { firstName: "Vlad" },
      {}
    );
  },
};
