# NodeJS [SwiftPay](https://swiftpayru.docs.apiary.io/#) API

[![license](https://img.shields.io/npm/l/swiftpay-api?style=flat-square)](https://github.com/xTCry/node-swiftpay-api/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/swiftpay-api?style=flat-square)](https://npmjs.com/package/swiftpay-api)
[![downloads](https://img.shields.io/npm/dm/swiftpay-api?style=flat-square)](https://npmjs.com/package/swiftpay-api)
[![GitHub](https://img.shields.io/github/stars/xTCry/node-swiftpay-api?style=flat-square)](https://github.com/xTCry/node-swiftpay-api)
[![last commit](https://img.shields.io/github/last-commit/xTCry/node-swiftpay-api?style=flat-square)](https://github.com/xTCry/node-swiftpay-api)

## 📦 Установка

```shell
yarn add swiftpay-api
```

## 🛠️ Использование

```typescript
import 'dotenv/config';
import { ApiClient } from 'swiftpay-api';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const main = async () => {
  const api = new ApiClient(
    process.env.WALLET_PROVIDER_SWIFTPAY_API_KEY!,
    Number(process.env.WALLET_PROVIDER_SWIFTPAY_SHOP_ID!),
  );

  let time = Date.now();
  const stats = await api.getStats();
  console.log('stats', stats);
  console.log(`Time: ${Date.now() - time} ms`);

  await sleep(500);

  time = Date.now();
  const account = await api.getAccount();
  console.log('account', account);
  console.log(`Time: ${Date.now() - time} ms`);

  await sleep(500);

  time = Date.now();
  const shops = await api.getShops();
  console.log('shops', shops);
  console.log(`Time: ${Date.now() - time} ms`);

  await sleep(500);

  if (process.env.WALLET_PROVIDER_SWIFTPAY_SHOP_ID) {
    time = Date.now();
    const { data: shop } = await api.getShop();
    console.log('shop', shop);
    console.log(`Time: ${Date.now() - time} ms`);
  }

  await sleep(500);

  // time = Date.now();
  // const { data: createOrder } = await api.createOrder({
  //   amount: 100,
  //   order_id: 4e7 + 2,
  //   data: { userId: 1230, email: 'gmail' },
  // });
  // console.log('createOrder', createOrder);
  // console.log(`Time: ${Date.now() - time} ms`);

  // await sleep(500);

  time = Date.now();
  const orders = await api.orders({ sort: 'id', data: [] });
  console.log('orders', orders);
  console.log(`Time: ${Date.now() - time} ms`);
};

main()
  .then()
  .catch((e) => {
    console.error(e);
  });


```
