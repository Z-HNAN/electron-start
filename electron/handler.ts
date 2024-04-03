export async function webEventHandler(func: string, param: any, { send }: { send: (event: any) => void }) {
  let res: any = { code: 0 }
  try {
    if (func === 'func1') {
      res = { code: 1, message: 'func1-res '}
    } else if (func === 'func2') {
      res = { code: 1, message: 'func2-res '}
    }
  } catch (err) {
    res = { code: 1, err }
  }

  return res;
}
