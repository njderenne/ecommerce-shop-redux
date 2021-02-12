import { createStore } from 'redux';
import reducer from './reducers';

const initialState = {
    products: [],
    categories: [],
    currentCategory: {},
    cart: [],
    cartOpen: false
};

const store = createStore(reducer, initialState);

export default store;