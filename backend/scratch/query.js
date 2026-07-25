const { Client } = require('pg');
const client = new Client({
  connectionString: "postgresql://neondb_owner:npg_a2AmSHKEw8TW@ep-soft-king-ayvrxvyn.c-5.us-east-2.aws.neon.tech/investra?sslmode=require",
  ssl: true
});
client.connect()
  .then(() => console.log("Connected successfully"))
  .then(() => client.query('SELECT version();'))
  .then(res => {
    console.log(res.rows[0]);
    return client.query(`select "ns"."nspname" as "schema", "cls"."relname" as "name" from pg_class cls join pg_namespace ns on ns.oid = cls.relnamespace limit 5;`);
  })
  .then(res => {
    console.log(res.rows);
    client.end();
  })
  .catch(err => {
    console.error("Error:", err);
    client.end();
  });
