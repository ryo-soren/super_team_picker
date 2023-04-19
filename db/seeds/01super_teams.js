/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
*/
const faker = require("faker");
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("super_teams")
    .del()
    .then(() => {
      const cohorts = Array.from({length: 10}).map(() => {

        function members() {
          const randNum = Math.ceil(Math.random()*35)+1
          const arr = []
          for (let index = 0; index < randNum; index++) {
            arr.push(faker.name.firstName())
          }
          return arr
        }
        const players = members()
        return {
          team_name: faker.company.catchPhrase(),
          image_url: faker.image.abstract(640, 480, true),
          team_members: players.length,
          members: players.join(", "),
          created_by: faker.name.firstName()
        }
      });
      return knex("super_teams").insert(cohorts)
    })
};
