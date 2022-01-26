import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import * as types from './types';
import { ParamsError, ResponseError } from './errors';
import { sha256 } from './utils';
import { USER_AGENT } from './identity';

export class ApiClient {
  public static readonly API_URL = 'https://api.swiftpay.store';

  private readonly _httpClient: AxiosInstance;

  constructor(public readonly apiKey: string, public readonly shopId?: number, apiOptions: AxiosRequestConfig = {}) {
    this._httpClient = axios.create({
      baseURL: ApiClient.API_URL,
      timeout: 10e3,
      ...apiOptions,
    });
    this._httpClient.defaults.headers.common['User-Agent'] = USER_AGENT;
  }

  public async _callApi<T = unknown>(url: string, method: Method = 'POST', data: any = {}) {
    try {
      const params: any = {};
      if (method == 'GET') {
        params.token = this.apiKey;
      } else {
        data.token = this.apiKey;
      }

      const resp = await this._httpClient.request<types.IResponseData<T>>({ url, params, method, data });
      return resp.data;
    } catch (e: any) {
      if (e.response.status === 404) {
        throw new ResponseError({ errCode: -1, error: 'Method not found' } as types.IResponseErrorData);
      }
      if (e.response?.data?.error) {
        throw new ResponseError(e.response.data as types.IResponseErrorData);
      }
      throw e;
    }
  }

  /**
   * Проверяет подпись уведомления о выплате
   * @param body Объект уведомления
   * @returns {boolean} Признак валидности
   */
  public checkSignPayment(body: types.PaymentResponse) {
    const compareSign = sha256(`${body.order_id + body.amount + this.apiKey + body.shop_id}`).toUpperCase();

    return body.sign === compareSign;
  }

  /**
   * Получение информации об аккаунте
   */
  public async getAccount() {
    return await this._callApi<types.ResponseAccount>('account', 'POST');
  }

  /**
   * Получение статистики аккаунта
   */
  public async getStats() {
    return await this._callApi<types.ResponseStats>('stats', 'GET');
  }

  /**
   * Получение списка созданных мерчантов
   */
  public async getShops() {
    return await this._callApi<types.ResponseShops>('shops', 'GET');
  }

  /**
   * Получение информации о конкретном мерчанте
   */
  public async getShop(shopId: number = this.shopId!) {
    if (!shopId || Number(shopId) <= 0) {
      throw new ParamsError('shopId should be a number greater than 0');
    }
    return await this._callApi<types.ResponseShop>(`shops/${shopId}`, 'GET');
  }

  /**
   * Включение мерчанта
   */
  public async shopActivate(shopId: number = this.shopId!) {
    if (!shopId || Number(shopId) <= 0) {
      throw new ParamsError('shopId should be a number greater than 0');
    }
    return await this._callApi<types.ResponseShopActivate>(`shop/activate/${shopId}`, 'GET');
  }

  /**
   * Отключение мерчанта
   */
  public async shopDeactivate(shopId: number = this.shopId!) {
    if (!shopId || Number(shopId) <= 0) {
      throw new ParamsError('shopId should be a number greater than 0');
    }
    return await this._callApi<types.ResponseShopDeactivate>(`shop/deactivate/${shopId}`, 'GET');
  }

  /**
   * Удаление мерчанта
   */
  public async shopDelete(shopId: number = this.shopId!) {
    if (!shopId || Number(shopId) <= 0) {
      throw new ParamsError('shopId should be a number greater than 0');
    }
    return await this._callApi<types.ResponseShopDelete>(`shop/delete/${shopId}`, 'GET');
  }

  /**
   * Получение списка пополнений аккаунта с фильтрами
   */
  public async orders(query: types.ParamsOrders) {
    return await this._callApi<types.ResponseOrders>('orders', 'POST', query);
  }

  /**
   * Проверка платежа
   * 
   * [Документация Swiftpay по методу `order`](https://swiftpayru.docs.apiary.io/#reference/4/2//order/:ordertoken)
   */
  public async order(orderToken: string) {
    if (!orderToken || orderToken.length < 10) {
      throw new ParamsError('orderToken required');
    }
    return await this._callApi<types.ResponseOrder>(`order/${orderToken}`, 'GET');
  }

  /**
   * Получение списка выводов аккаунта с фильтрами
   */
  public async payouts(query: types.ParamsPayouts) {
    return await this._callApi<types.ResponsePayouts>('payouts', 'POST', query);
  }

  /**
   * Получение информации о выводе
   */
  public async payout(payoutId: number) {
    if (!payoutId || Number(payoutId) <= 0) {
      throw new ParamsError('payoutId should be a number greater than 0');
    }
    return await this._callApi<types.ResponsePayout>(`payout/${payoutId}`, 'GET');
  }

  /**
   * Подтверждение выплаты (если в настройках аккаунта отключены автовыплаты)
   */
  public async payoutAccept(payoutId: number) {
    if (!payoutId || Number(payoutId) <= 0) {
      throw new ParamsError('payoutId should be a number greater than 0');
    }
    return await this._callApi<types.ResponsePayoutAccept>(`payoutAccept/${payoutId}`, 'GET');
  }

  /**
   * Отклонение оплаты (если в настройках аккаунта отключены автовыплаты)
   */
  public async payoutDecline(payoutId: number) {
    if (!payoutId || Number(payoutId) <= 0) {
      throw new ParamsError('payoutId should be a number greater than 0');
    }
    return await this._callApi<types.ResponsePayoutDecline>(`payoutDecline/${payoutId}`, 'GET');
  }

  /**
   * Получение списка активных систем и их комиссий
   */
  public async systems() {
    return await this._callApi<types.ResponseSystems>('systems', 'GET');
  }

  /**
   * Получение информации о заказе
   */
  public async orderById(orderId: number) {
    if (!orderId || Number(orderId) <= 0) {
      throw new ParamsError('orderId should be a number greater than 0');
    }
    return await this._callApi<types.ResponseOrderById>(`orderById/${orderId}`, 'GET');
  }

  /**
   * Создание ссылки для оплаты
   */
  public async createOrder(params: types.ParamsCreateOrder, shopId: number = this.shopId!) {
    if (!shopId || Number(shopId) <= 0) {
      throw new ParamsError('shopId should be a number greater than 0');
    }
    return await this._callApi<types.ResponseCreateOrder>('createOrder', 'POST', {
      shop_id: shopId,
      ...params,
    });
  }

  /**
   * Создание выплаты
   * @param system_id Id системы
   * @param amount Сумма вывода
   * @param wallet Кошелек для вывода
   */
  public async createPayout(system_id: types.SystemIdType, amount: number, wallet: string) {
    if (!amount || Number(amount) <= 0) {
      throw new ParamsError('amount should be a number greater than 0');
    }
    return await this._callApi<types.ResponseCreatePayout>('createPayout', 'POST', { system_id, amount, wallet });
  }

  /**
   * Создание платежа
   * 
   * [Документация Swiftpay по методу `payInCreate`](https://swiftpayru.docs.apiary.io/#reference/4/0//payin/create)
   */
  public async payInCreate(params: types.ParamsPayInCreate, shopId: number = this.shopId!) {
    if (!shopId || Number(shopId) <= 0) {
      throw new ParamsError('shopId should be a number greater than 0');
    }
    return await this._callApi<types.ResponsePayInCreate>('payIn/create', 'POST', {
      shop_id: shopId,
      ...params,
    });
  }

  /**
   * Создание платежа **по реквизитам карты**
   * 
   * [Документация Swiftpay по методу `gatePay`](https://swiftpayru.docs.apiary.io/#reference/4/1//gate/pay)
   */
  public async gatePay(params: types.ParamsGatePay, shopId: number = this.shopId!) {
    if (!shopId || Number(shopId) <= 0) {
      throw new ParamsError('shopId should be a number greater than 0');
    }
    return await this._callApi<types.ResponseGatePay>('gate/pay', 'POST', {
      shop_id: shopId,
      ...params,
    });
  }
}
