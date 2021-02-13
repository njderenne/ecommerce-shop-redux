import React, { useEffect } from "react";
import { useQuery } from '@apollo/react-hooks';
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
import ProductItem from "../ProductItem";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif"
import store from '../../utils/store';
import { useSelector } from 'react-redux';

function ProductList() {

  const state = useSelector(state=>state);

  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);


  useEffect(() => {

    if (data) {
      store.dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
      //add else if to check if `loading` is undefined in `useQuery()` hook
    } else if (!loading) {
      //since we're offline, get all fo the data from the `products` store
      idbPromise('products', 'get').then((products) => {
        //use retrieved data to set global state for offline browsing
        store.dispatch({
          type: UPDATE_PRODUCTS,
          products: products
        });
      });
    }
  }, [data, loading]);
  
  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
            {filterProducts().map(product => (
                <ProductItem
                  key= {product._id}
                  _id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  quantity={product.quantity}
                />
            ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      { loading ? 
      <img src={spinner} alt="loading" />: null}
    </div>
  );
}

export default ProductList;
