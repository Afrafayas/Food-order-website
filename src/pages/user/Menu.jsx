import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../../redux/productSlice';
import ProductList from '../../components/ProductList';

const Menu = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, loading, error } = useSelector((state) => state.products);

  const initialSearch   = searchParams.get('search')   || '';
  const initialCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Scroll to products once they load if a search/category was passed in
  useEffect(() => {
    if (!loading && (initialSearch || initialCategory !== 'All')) {
      setTimeout(() => {
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [loading]);

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-red-500 text-xl">{error}</p>
    </div>
  );

  return (
    <div className="w-full pt-0 bg-background text-text">
      <ProductList
        products={products}
        loading={loading}
        initialSearch={initialSearch}
        initialCategory={initialCategory}
      />
    </div>
  );
};

export default Menu;