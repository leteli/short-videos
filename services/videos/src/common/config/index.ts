import { parseString } from 'src/common/utils/parsers/parseString';
import { parseBoolean } from 'src/common/utils/parsers/parseBoolean';

const getConfig = () => ({
  isLocal: parseBoolean(process.env.IS_LOCAL, false),
  rabbit: {
    user: parseString(process.env.RABBIT_USER, 'guest'),
    pass: parseString(process.env.RABBIT_PASS, 'guest'),
    host: parseString(process.env.RABBIT_HOST, 'rabbit:5672'),
  },
});

export type Config = ReturnType<typeof getConfig>;
export default getConfig;
