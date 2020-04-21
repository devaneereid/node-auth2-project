
exports.up = function(knex) {
  return knex.schema.createTable('users', users => {
      users.increments();

        users.string('username', 128)
            .unique()
            .notNullable();

        users.string('password', 128)
            .notNullable();
        
        users.string('role', 128);
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
