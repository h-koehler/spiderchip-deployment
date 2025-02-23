import { Pool } from "pg";
import globalConfig from "./global";

const pool = new Pool({
    connectionString: globalConfig.db.connectionString
});

export default pool;