import React from 'react';

interface IProps {
  children?: React.ReactNode;
}

const CheckoutPage: React.FC<IProps> = ({ children }) => (
  <>
    {children}
  </>
);

export default CheckoutPage;
