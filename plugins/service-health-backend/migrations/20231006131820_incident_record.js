// @ts-check
/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('incident_record', table => {
    table.comment(
      'Table for tracking the service incidents we have alerted on',
    );

    table
      .string('incident_id')
      .notNullable()
      .primary()
      .comment('The upstream identifier of the incident');
    table.boolean('sent').notNullable().comment('Have we sent the alert?');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('incident_record');
};
