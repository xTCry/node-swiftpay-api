/** Статус операции */
export enum ErrorType {
  Unknown = 'Unknown',
  InvalidToken = 'InvalidToken',
  InvalidParams = 'InvalidParams',
}

/** Список доступных валют */
export enum CurrencyType {
  BCH = 'BCH',
  BTC = 'BTC',
  DAI = 'DAI',
  ETH = 'ETH',
  EUR = 'EUR',
  LTC = 'LTC',
  RUB = 'RUB',
  UAH = 'UAH',
  USD = 'USD',
  USDC = 'USDC',
}

export enum SystemType {
  QIWI = 'qiwi',
  CARD = 'card',
  FORM = 'form',
}

export enum SystemIdType {
  XX_30 = 30,
  /** Банковские карты */
  CARD = 40,
  QIWI = 41,
  /** Банковские карты [Trusted] */
  CARD_TRUSTED = 42,
  /** Банковские переводы */
  CARD_TRANSACTION = 43,
  /** Банковские карты [UAH] */
  CARD_UAH = 44,
  /** UDST Tether TRC-20 */
  UDST_TETHER = 45,
}

/** Статус операции */
export enum StatusValue {
  Paid = 'PAID' /* code = 1 */,
  Rejected = 'REJECTED' /* code = 2 */,
  // TODO: add other
}

// Deposits

/** Параметры уведомления о пополнении */
export type ResponsePayment = {
  /**
   * SHA256(order_id + amount + token + shop_id).toUpperCase()
   * Например заказ #123 на 10.43руб мерчанта с ID 22: SHA256(12310.430APIdi7O4mSNzd5ZJiMLEWKw22)
   */
  sign: string;
  // ID в системе SWIFTPAY
  id: number;
  /** ID системы */
  system_id: SystemIdType;
  /** ID пополнения в системе вашего мерчанта */
  order_id: string;
  shop_id: number;
  /** сумма пополнения */
  amount: number;
  amount_in_cur: number;
  cur: number;
  gate_fee: number;

  status: {
    /** Статус пополнения */
    code: number;
    /** Значение статуса */
    value: StatusValue;
  };

  /** дата создания заказа */
  created_at: string;
  /** дата оплаты заказа */
  paid_at: string;
  /** email пользователя */
  email: string;
  /** описание заказа */
  description: string | null;
  /** переданная при создании заказа data */
  data: any;
  /** Комиссия системы Swiftpay за транзакцию */
  commission: number;
  /** Маска карты (Например: 427638******3007) */
  card_mask: string | null;
  phone: string | null;
  token: string;
  hash: string;
};

// Responses

export interface IResponseData<T> {
  // status: 'info' | 'error' | /* ? */ 'success';
  text?: string;
  data: T;
}

export interface IResponseErrorData {
  errCode?: number;
  error: string;
  text?: string;
}

//

export type ResponseAccount = {
  id: number;
  name: string;
  balance: number;
  balanceCurrency: CurrencyType;
  wallets: Record<CurrencyType, number>;
};

export type ResponseStats = Record<'today' | 'yesterday' | 'month' | 'year', { add: number; sub: number }>;

export type ResponseShops = {
  id: number;
  name: string;
  url: string;
  verified: number;
  p2p_balance: number;
}[];

export type ResponseShop = {
  id: number;
  name: string;
  url: string;
  verified: number;
  p2p_balance: number;
  commission: number;
  url_success: string;
  url_redirect: string;
  token: string;
  p2p_notify: null;
  p2p_upincome: number;
  systems: SystemIdType[];
  allSystems: {
    id: SystemIdType;
    name: string;
    commission: number;
  }[];
  balances: null;
};

export type ResponseShopActivate = Boolean;
export type ResponseShopDeactivate = Boolean;
export type ResponseShopDelete = Boolean;

// Orders

type OrderFields = 'id' | 'amount' | 'order_id' | 'created_at' | 'paid_at' | 'shop_id' | 'email' | 'status';
type OrderSortableFields = Exclude<OrderFields, 'email' | 'status'>;
type OrderAllowedQueryFields = OrderFields;
type OrderAllowedOperators = '=' | '>' | '<' | '>=' | '<=' | '!=';

export type ParamsOrders = {
  /** Поле, по которому будет выполнена сортировка */
  sort: OrderSortableFields;
  /** `ASC` - по возрастанию, `DESC` - по убыванию */
  sortType?: 'ASC' | 'DESC';

  /**
   * Если нужно отобразить записи без фильтра, то передайте пустой массив - `data: []`
   *
   * **Пример:**
   * Отобразит только те записи, где дата создания была позже 19.01.2020 и сумма равной 100.
   * @example
   *  [
   *    {
   *      field: 'created_at';
   *      type: '>';
   *      value: '2020-01-19';
   *    },
   *    {
   *      field: 'amount';
   *      type: '=';
   *      value: '100';
   *    },
   *  ]
   * */
  data: {
    field: OrderAllowedQueryFields;
    type: OrderAllowedOperators;
    value: string;
  }[];

  /** Число записей **(от 25 до 250)** */
  limit?: number;
  /**
   * Смещение по записям.
   *
   * При `limit = 25`, `offset = 25` будет второй страницей, `offset = 50` будет третьей и т.д.
   * */
  offset?: number;
};

export type ResponseOrders = {
  id: number;
  shop_id: number;
  ticket: null;
  amount: number;
  status: 1 | 2 | number;
  amount_in_cur: number;
  cur: 1 | number;
  cur_name: CurrencyType;
  created_at: string;
  paid_at: string | null;
  email: string;
  description: string | null;
  log: string;
  token: string;
  order_id: string;
  ticket_status: null;
}[];

export type ResponseOrder = {
  id: number;
  url: string;
  email: string;
  url_redirect: string;
  amount: number;
  to_pay: any | null;
  amount_in_cur: number;
  processed_at: string;
  description: string;
  system_id: SystemIdType;
  status: 0 | 1 | number;
  substatus: 2 | number;
  name: string;
  created_at: string;
  paid_at: string;
  invoice: string | null;
  token: string;
  paid_at_formated: string;
  link: string | null;
  commission: number;
  shop_commission: number;
  income_in_cur: number;
  commission_amount_in_cur: number;
  cur: { name: CurrencyType; precision: number };
  systems: string | null;
  system_name: string | null;
  /** (`true` - **оплачен**, `false` - **неоплачен**) */
  paid: boolean;
  check: string;
};

// Payouts

type PayoutsFields = 'id' | 'amount' | 'system_id' | 'wallet' | 'created_at' | 'paid_at' | 'api' | 'status';
type PayoutsSortableFields = Exclude<PayoutsFields, 'status'>;
type PayoutsAllowedQueryFields = PayoutsFields;
type PayoutsAllowedOperators = '=' | '>' | '<' | '>=' | '<=' | '!=';

export type ParamsPayouts = {
  /** Поле, по которому будет выполнена сортировка */
  sort: PayoutsSortableFields;
  /** `ASC` - по возрастанию, `DESC` - по убыванию */
  sortType?: 'ASC' | 'DESC';

  /**
   * Если нужно отобразить записи без фильтра, то передайте пустой массив - `data: []`
   *
   * **Пример:**
   * Отобразит только те записи, где дата создания была позже 19.01.2020 и сумма равной 100.
   * @example
   *  [
   *    {
   *      field: 'created_at';
   *      type: '>';
   *      value: '2020-01-19';
   *    },
   *    {
   *      field: 'amount';
   *      type: '=';
   *      value: '100';
   *    },
   *  ]
   * */
  data: {
    field: PayoutsAllowedQueryFields;
    type: PayoutsAllowedOperators;
    value: string;
  }[];

  /** Число записей **(от 25 до 250)** */
  limit?: number;
  /**
   * Смещение по записям.
   *
   * При `limit = 25`, `offset = 25` будет второй страницей, `offset = 50` будет третьей и т.д.
   * */
  offset?: number;
};

export type ResponsePayouts = {
  id: number;
  system_id: SystemIdType;
  amount: number;
  amount_in_cur: number;
  cur: 1 | number;
  cur_name: CurrencyType;
  wallet: string;
  created_at: string;
  paid_at: string | null;
  status: 1 | 2 | number;
  api: number;
  usdt: number;
}[];

// Payout

export type ResponsePayout = {};

//

export type ResponsePayoutAccept = {};

export type ResponsePayoutDecline = {};

export type ResponseSystems = {
  id: SystemIdType;
  name: string;
  payout_commission: number;
  payout_fixed_commission: number;
  regexp: string /* RegExp */;
}[];

export type ResponseOrderById = {
  id: number;
  amount: number;
  description: string | null;
  system_id: SystemIdType;
  status: 2 | number;
  created_at: string;
  link: string | null;
  commission: number;
  shop_commission: number;
  /** (`true` - **оплачен**, `false` - **неоплачен**) */
  paid: boolean;
  check: string;
};

export type ResponseCreatePayout = {
  error: 0 | number;
  id: number;
  user_id: number;
  system_id: SystemIdType;
  amount: number;
  wallet: string;
  status: 0 | number;
  created_at: string;
  paid_at: string | null;
  api: 0 | number;
  props_id: null;
};

// CreateOrder

export type ParamsCreateOrder = {
  /** Номер заказа в системе мерчанта. **Должен быть уникальным** */
  order_id: string;
  /** Сумма */
  amount: number;
  /** Описание. *Необязательный параметр* */
  desc?: string;

  /**
   * После успешной оплаты этот объект будет отправлен на ссылку уведомления.
   * *Необязательный параметр*
   * **Макс. количество полей: `5`**
   */
  data?: Record<string, string | number | boolean>;
};

export type ResponseCreateOrder = {
  /** Уникальный номер заказа за базе Swiftpay */
  id: number | string;
  /** Ссылка на оплату */
  link: string;
  info: {
    /** Номер заказа в системе мерчанта. */
    order_id: string;
    /** Сумма */
    amount: string;
    /** Объект, указанный при создании ссылки */
    data: Record<string, string | number | boolean>;
  };
};

// PayInCreate

export type ParamsPayInCreate = {
  /**
   * Номер заказа в системе мерчанта, *заранее созданный и сохраненный в базе обязательный*
   *
   * **Должен быть уникальным**
   * *до 36 симв*
   * */
  order_id: string;
  /** Сумма пополнения. `float`	**от 1 до 15000** */
  amount: number;

  /**
   * Объект, передаваемый на сервер вместе с уведомлением об успешном платеже.
   * **Макс. количество полей: `5`**
   */
  data?: Record<string, string | number | boolean>;

  /** Платежная система */
  system: SystemType;
  /** Email пользователя **от 1 до 255 симв.** */
  email: string;
  /** Ссылка для перенаправления на страницу успеха	**от 1 до 255 симв.** */
  redirect_success: string;
  /** Ссылка для перенаправления на страницу неуспеха	**от 1 до 255 симв.** */
  redirect_fail: string;
};

export type ResponsePayInCreate = {
  /** Уникальный номер заказа за базе Swiftpay */
  id: number;
  /** Ссылка на оплату */
  link: string;
  info: Partial<ParamsPayInCreate>;
};

// GatePay

export type ParamsGatePay = {
  /** Номер заказа в системе мерчанта. **Должен быть уникальным** */
  order_id: string;
  /** Сумма */
  amount: number;

  /**
   * После успешной оплаты этот объект будет отправлен на ссылку уведомления.
   * *Необязательный параметр*
   * **Макс. количество полей: `5`**
   */
  data?: Record<string, string | number | boolean>;

  email: string;
  pan: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  redirect_success: string;
  redirect_fail: string;
  browserData?: {
    browserAcceptHeader: string;
    browserColorDepth: string;
    browserIP: string;
    browserLanguage: string;
    browserScreenHeight: string;
    browserScreenWidth: string;
    browserTZ: string;
    browserUserAgent: string;
    browserJavaEnabled: string;
    windowWidth: string;
    windowHeight: string;
  };
};

export type ResponseGatePay = {
  /** Уникальный номер заказа за базе Swiftpay */
  id: number;
  type: '3DS';
  /** Ссылка на оплату */
  link: string;
};
