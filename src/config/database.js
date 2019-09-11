module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  port: 25432,
  password: 'docker',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
