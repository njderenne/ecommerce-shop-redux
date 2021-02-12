import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from "../../utils/queries";
// import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
// import { isAbstractType } from "graphql";
import store from "../../utils/store";

function CategoryMenu() {

  // const [state, dispatch] = useStoreContext();

  // const [state, dispatch] = store;

  const state = store.getState();
  // console.log(state);

  // const dispatch = '1';

  const { categories } = state;


  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  // const unsubscribe = store.subscribe(() => console.log('Sate after dispatch: ', store.getState()))

  if (categoryData) {
    //execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
    store.dispatch({
      type: UPDATE_CATEGORIES,
      categories: categoryData.categories
    });
    categoryData.categories.forEach(category => {
      idbPromise('categories', 'put', category);
    });
  } else if (!loading) {
    idbPromise('categories', 'get').then(categories => {
      store.dispatch({
        type: UPDATE_CATEGORIES,
        categories: categories
      });
    });
  }

  // useEffect(() => {
  //   //if categoryData exists or has changed from the response of useQuery, then run dispatch()
  //   if (categoryData) {
  //     //execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
  //     store.dispatch({
  //       type: UPDATE_CATEGORIES,
  //       categories: categoryData.categories
  //     });
  //     categoryData.categories.forEach(category => {
  //       idbPromise('categories', 'put', category);
  //     });
  //   } else if (!loading) {
  //     idbPromise('categories', 'get').then(categories => {
  //       store.dispatch({
  //         type: UPDATE_CATEGORIES,
  //         categories: categories
  //       });
  //     });
  //   }
  // }, [categoryData, loading, store.dispatch]);

  const handleClick = id => {
    store.dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
