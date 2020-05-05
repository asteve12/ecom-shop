import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { useForm, OnSubmit, FieldError } from 'react-hook-form';
import { TState, TProductInCart } from '@/reducers/types';
import TextInput from '@/components/ui/inputs/text/TextInput';
import SimpleButton from '@/components/ui/buttons/simpleButton/SimpleButton';
import Tooltip from '@/components/ui/tooltip/Tooltip';
import Spinner from '@/components/ui/loaders/Spinner/Spinner';
import { makePayment as makePaymentAction, IPayAction } from '@/actions/cartActions';

import { IPaymentData } from '@/fakeApi/fakeFetch';
import {
  phone as phoneValidation,
  dateExpiration as dateExpirationValidation,
  cvv as cvvValidation,
  email as emailValidation,
  required as requiredValidation,
  cardNumber as cardNumberValidation,
} from './utils/formValidation';

import './style.scss';


const mapDispatchToProps = (dispatch: ThunkDispatch<TState, undefined, IPayAction>) => ({
  makePayment: (paymentData: IPaymentData) => dispatch(makePaymentAction(paymentData)),
});


type TSuccess = {
  code: number;
  text: string;
  data: any;
};
type TError = {
  code: number;
  text: string;
};
type TStatus = {
  loading: boolean;
  success: TSuccess | null;
  error: TError | null;
};

type TFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  cardOwner: string;
  cardNumber: string;
  expiration: {
    month: string;
    year: string;
  };
  cvv: string;
};

interface IProps extends ReturnType<typeof mapDispatchToProps> {
  items: TProductInCart[];
  className?: string;
}


const getErrorTooltip = (error: FieldError | undefined) => error && (error.types?.validate || error.message) && <Tooltip className="CheckoutForm__tooltip" value={(error.message as string) || (error.types?.validate as string)} />;


const CheckoutForm: React.FC<IProps> = ({ className, items, makePayment }) => {
  const [status, setStatus] = useState<TStatus>({
    loading: false,
    success: null,
    error: null,
  });
  const { register, handleSubmit, getValues, setValue, errors, setError } = useForm<TFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      cardOwner: '',
      cardNumber: '',
      expiration: {
        month: '',
        year: '',
      },
      cvv: '',
    },
    validateCriteriaMode: 'all',
  });

  const onSubmit: OnSubmit<TFormData> = (data, e) => {
    if (e) e.preventDefault();

    if (items.some((item) => item.number < 1)) {
      const message = 'One or more items in the cart has 0 amount';
      setError('amount', { message });
      setStatus({
        loading: false,
        success: null,
        error: {
          code: 0,
          text: message,
        },
      });
      return;
    }
    setStatus((prevStatus) => ({ ...prevStatus, loading: true }));

    const paymentData: IPaymentData = {
      ...getValues() as TFormData,
      items,
    };

    makePayment(paymentData)
      .then((res) => {
        setStatus(() => ({
          loading: false,
          success: {
            code: res.status,
            text: res.text,
            data: res.data,
          },
          error: null,
        }));

        setValue([
          { firstName: '' },
          { lastName: '' },
          { phone: '' },
          { email: '' },
          { address: '' },
          { cardOwner: '' },
          { cardNumber: '' },
          { expiration: { month: '', year: '' } },
          { cvv: '' },
        ]);
      })
      .catch((err) => {
        setStatus(() => ({
          loading: false,
          success: null,
          error: {
            code: err.status,
            text: err.message,
          },
        }));
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`CheckoutForm ${className || ''}`}>
      <label className="CheckoutForm__label" htmlFor="firstName">
        <span className="CheckoutForm__label-text">First Name</span>
        <TextInput
          ref={register({
            required: true,
            validate: requiredValidation,
          })}
          name="firstName"
          id="firstName"
          className="CheckoutForm__input"
        />
        {getErrorTooltip(errors.firstName)}
      </label>

      <label className="CheckoutForm__label" htmlFor="lastName">
        <span className="CheckoutForm__label-text">Last Name</span>
        <TextInput
          ref={register({
            required: true,
            validate: requiredValidation,
          })}
          name="lastName"
          id="lastName"
          className="CheckoutForm__input"
        />
        {getErrorTooltip(errors.lastName)}
      </label>

      <label className="CheckoutForm__label" htmlFor="phone">
        <span className="CheckoutForm__label-text">Phone</span>
        <TextInput
          ref={register({
            required: true,
            validate: phoneValidation,
          })}
          name="phone"
          id="phone"
          className="CheckoutForm__input"
        />
        {getErrorTooltip(errors.phone)}
      </label>

      <label className="CheckoutForm__label" htmlFor="email">
        <span className="CheckoutForm__label-text">Email</span>
        <TextInput
          ref={register({
            required: true,
            validate: emailValidation,
          })}
          name="email"
          type="email"
          id="email"
          className="CheckoutForm__input"
        />
        {getErrorTooltip(errors.email)}
      </label>

      <label className="CheckoutForm__label" htmlFor="address">
        <span className="CheckoutForm__label-text">Address</span>
        <TextInput
          ref={register({
            required: true,
            validate: requiredValidation,
          })}
          name="address"
          id="address"
          className="CheckoutForm__input"
        />
        {getErrorTooltip(errors.address)}
      </label>

      <label className="CheckoutForm__label" htmlFor="cardOwner">
        <span className="CheckoutForm__label-text">Card Owner</span>
        <TextInput
          ref={register({
            required: true,
            validate: requiredValidation,
          })}
          name="cardOwner"
          id="cardOwner"
          className="CheckoutForm__input"
        />
        {getErrorTooltip(errors.cardOwner)}
      </label>

      <label className="CheckoutForm__label" htmlFor="cardNumber">
        <span className="CheckoutForm__label-text">Card Number</span>
        <TextInput
          ref={register({
            required: true,
            validate: cardNumberValidation,
          })}
          name="cardNumber"
          id="cardNumber"
          className="CheckoutForm__input"
        />
        {getErrorTooltip(errors.cardNumber)}
      </label>

      <label className="CheckoutForm__label CheckoutForm__label_date" htmlFor="month">
        <span className="CheckoutForm__label-text">Month</span>
        <TextInput
          ref={register({
            required: true,
            validate: dateExpirationValidation,
          })}
          name="expiration.month"
          id="month"
          className="CheckoutForm__input"
        />
        {getErrorTooltip(errors.expiration?.month)}
      </label>

      <label className="CheckoutForm__label CheckoutForm__label_date" htmlFor="year">
        <span className="CheckoutForm__label-text">Year</span>
        <TextInput
          ref={register({
            required: true,
            validate: dateExpirationValidation,
          })}
          name="expiration.year"
          id="year"
          className="CheckoutForm__input"
        />
        {getErrorTooltip(errors.expiration?.year)}
      </label>

      <label className="CheckoutForm__label CheckoutForm__label_cvv" htmlFor="cvv">
        <span className="CheckoutForm__label-text">CVV</span>
        <TextInput
          ref={register({
            required: true,
            validate: cvvValidation,
          })}
          name="cvv"
          id="cvv"
          className="CheckoutForm__input"
        />
        {getErrorTooltip(errors.cvv)}
      </label>

      {
        (status.success || status.error)
          ? (
            <p className={`CheckoutForm__result-status${status.success ? ' CheckoutForm__result-status_success' : ''}${status.error ? ' CheckoutForm__result-status_error' : ''}`}>
              {status.success && 'Payment successful!'}
              {status.error && `Error occured: ${status.error?.text || 'something gone wrong! We are working on resolving this issue!'}`}
            </p>
          )
          : null
      }

      <SimpleButton disabled={status.loading} className="CheckoutForm__submit-button" type="submit">
        {
          status.loading
            ? <Spinner spinnerClassName="CheckoutForm__spinner" />
            : 'Make a payment'
        }
      </SimpleButton>
    </form>
  );
};

export default connect(null, mapDispatchToProps)(CheckoutForm);
