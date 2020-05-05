
import { TFilterPrices } from '@components/contexts/filter/FilterContext';

type TPriceValidator = (validationData: { price: string | number | undefined, type: 'from' | 'upto', oldPrices: TFilterPrices }) => TFilterPrices;

/**
 * Get validated array with prices "from" and "upto"
 */
const getValidatedPrice: TPriceValidator = ({ price, type, oldPrices }) => {
  let newPrice: number | '' = '';
  if (price) newPrice = typeof price === 'number' ? price : parseInt(price, 10);

  const [from, upto] = oldPrices;
  const newPrices: TFilterPrices = [from, upto];

  if (type === 'from') newPrices[0] = newPrice;
  if (type === 'upto') newPrices[1] = newPrice;

  return newPrices;
};

export default getValidatedPrice;
