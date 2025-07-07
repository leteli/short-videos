import { parseString } from 'src/common/utils/parsers/parseString';
import { parseBoolean } from 'src/common/utils/parsers/parseBoolean';
import { parseNumber } from 'src/common/utils/parsers/parseNumber';
import { FALLBACK_CORE_PORT } from '../constants/app.constants';

const getConfig = () => ({
  isLocal: parseBoolean(process.env.IS_LOCAL, false),
  port: parseNumber(process.env.PORT, FALLBACK_CORE_PORT),
  clientUrl: parseString(process.env.CLIENT_URL, 'http://localhost:3000'),
  mongo: {
    uri: parseString(process.env.MONGO_URI, 'mongodb://mongo:27017'),
    dbName: parseString(process.env.MONGO_DB_NAME, 'db'),
  },
  rabbit: {
    user: parseString(process.env.RABBIT_USER, 'guest'),
    pass: parseString(process.env.RABBIT_PASS, 'guest'),
    host: parseString(process.env.RABBIT_HOST, 'localhost:5672'),
  },
});

export type Config = ReturnType<typeof getConfig>;
export default getConfig;
