// @ts-ignore
import { name, version, repository } from '../package.json';

export const VERSION: string = version;
export const USER_AGENT = `${name}/${version} (+https://npmjs.com/package/${name}) NodeJS_SwiftPay_API (+${repository.url})`;
