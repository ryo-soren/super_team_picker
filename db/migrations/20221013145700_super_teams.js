/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable('super_teams', table => {
      table.increments('id'); 
      table.text('team_name');
      table.text('members'); 
      table.integer('team_members');
      table.string('image_url'); 
      table.text('created_by'); 
      table.timestamp('created_at').defaultTo(knex.fn.now()); 
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('super_teams')
  };