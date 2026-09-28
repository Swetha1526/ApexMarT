import api from '../utils/api';
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_SUMMARY_REQUEST,
  ORDER_SUMMARY_SUCCESS,
  ORDER_SUMMARY_FAIL,
} from '../constants/orderConstants';
import { CART_CLEAR_ITEMS } from '../constants/cartConstants';

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });

    const { data } = await api.post('/orders/add/', order);

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });

    dispatch({ type: CART_CLEAR_ITEMS });
    localStorage.removeItem('cartItems');
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.message,
    });
  }
};

export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { data } = await api.get(`/orders/${id}/`);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.message,
    });
  }
};

export const payOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_PAY_REQUEST });

    const { data } = await api.put(`/orders/${id}/pay/`, {});

    dispatch({
      type: ORDER_PAY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_PAY_FAIL,
      payload: error.message,
    });
  }
};

export const listMyOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ORDER_LIST_MY_REQUEST });

    const { data } = await api.get('/orders/myorders/');

    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload: error.message,
    });
  }
};

export const listOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST });

    const { data } = await api.get('/orders/');

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const deliverOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DELIVER_REQUEST });

    const { data } = await api.put(`/orders/${id}/deliver/`, {});

    dispatch({
      type: ORDER_DELIVER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload: error.message,
    });
  }
};

export const getOrderSummary = () => async (dispatch) => {
  try {
    dispatch({ type: ORDER_SUMMARY_REQUEST });

    const { data } = await api.get('/orders/summary/');

    dispatch({
      type: ORDER_SUMMARY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_SUMMARY_FAIL,
      payload: error.message,
    });
  }
};
