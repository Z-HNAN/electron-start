// import { delay } from 'lodash-es';

const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

export const hello = async (name: string) => {
  await delay(1000);

  return `hello ${name}`;
}
