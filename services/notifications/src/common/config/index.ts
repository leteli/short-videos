import { parseString } from 'src/common/utils/parsers/parseString';
import { parseBoolean } from 'src/common/utils/parsers/parseBoolean';
import { parseNumber } from 'src/common/utils/parsers/parseNumber';

const getConfig = () => ({
  isLocal: parseBoolean(process.env.IS_LOCAL, false),
  rabbit: {
    user: parseString(process.env.RABBIT_USER, 'guest'),
    pass: parseString(process.env.RABBIT_PASS, 'guest'),
    host: parseString(process.env.RABBIT_HOST, 'rabbit:5672'),
  },
  mail: {
    host: parseString(process.env.MAIL_HOST, 'smtp.mail.me.com'),
    port: parseNumber(process.env.MAIL_PORT, 587),
    user: parseString(process.env.MAIL_USER, ''),
    pass: parseString(process.env.MAIL_PASS, ''),
  },
});

export type Config = ReturnType<typeof getConfig>;
export default getConfig;
