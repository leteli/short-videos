import { parseString } from 'src/common/utils/parsers/parseString';
import { parseBoolean } from 'src/common/utils/parsers/parseBoolean';
import { parseNumber } from 'src/common/utils/parsers/parseNumber';

import { SOCKET_FALLBACK_PORT } from '../constants/index';

const getConfig = () => ({
  isLocal: parseBoolean(process.env.IS_LOCAL, false),
  port: parseNumber(process.env.PORT, SOCKET_FALLBACK_PORT),
  rabbit: {
    user: parseString(process.env.RABBIT_USER, 'guest'),
    pass: parseString(process.env.RABBIT_PASS, 'guest'),
    host: parseString(process.env.RABBIT_HOST, 'localhost:5672'),
  },
});

export type Config = ReturnType<typeof getConfig>;
export default getConfig;
