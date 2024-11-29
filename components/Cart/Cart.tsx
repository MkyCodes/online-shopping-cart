import formatPrice from 'utils/formatPrice';
import CartProducts from './CartProducts';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

import { useCart } from 'contexts/cart-context';

import * as S from './style';
import { useEffect, useState } from 'react';

const Cart = () => {
  const { products, total, isOpen, openCart, closeCart } = useCart();
  const [ordered , setOrdered] = useState(true);
  const [email , setEmail] = useState(null);


  useEffect(() => {
    if(ordered && email) {
      const productsList = products.map(p => `${p.title}: ${p.quantity}`).join('\n')
      const totalPrice = total.totalPrice;

      const templateParams = {
        productsList,  // The list of products in the cart
        totalPrice: totalPrice,  // The total amount
        email: email,
        to_name: 'market_name',  // (Optional) Send to a specific recipient
      };

      emailjs
      .send(
        'service_4dd8f5f' ,
        'template_mvx2hfp',
        templateParams,
        'pKwZI9wXSIlvXr9nT'
      )
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          Swal.fire({
            title: 'Success!',
            text: 'We Received your order, checkout your email shortly!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        (error) => {
          console.log('FAILED...', error);
          Swal.fire({
            title: 'Error!',
            text: 'There has been an error, try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    }
    setEmail(null);
    setOrdered(false);
   }, [ordered, email, products, total]);

  const handleCheckout = () => {
    if (total.productQuantity) {
      
      Swal.fire({
        title: "Please Enter Your Email",
        text: "Email",
        input: 'text',
        showCancelButton: true        
      }).then((result) => {
          if (result.value) {
              console.log("Result: " + result.value);
              setEmail(result.value);
              setOrdered(true);
          }
      });
    } else {
      alert('Add some product in the cart!');
    }
  };

  const handleToggleCart = (isOpen: boolean) => () =>
    isOpen ? closeCart() : openCart();

  return (
    <S.Container isOpen={isOpen}>
      <S.CartButton onClick={handleToggleCart(isOpen)}>
        {isOpen ? (
          <span>X</span>
        ) : (
          <S.CartIcon>
            <S.CartQuantity title="Products in cart quantity">
              {total.productQuantity}
            </S.CartQuantity>
          </S.CartIcon>
        )}
      </S.CartButton>

      {isOpen && (
        <S.CartContent>
          <S.CartContentHeader>
            <S.CartIcon large>
              <S.CartQuantity>{total.productQuantity}</S.CartQuantity>
            </S.CartIcon>
            <S.HeaderTitle>Cart</S.HeaderTitle>
          </S.CartContentHeader>

          <CartProducts products={products} />

          <S.CartFooter>
            <S.Sub>SUBTOTAL</S.Sub>
            <S.SubPrice>
              <S.SubPriceValue>{`${total.currencyFormat} ${formatPrice(
                total.totalPrice,
                total.currencyId
              )}`}</S.SubPriceValue>
              <S.SubPriceInstallment>
                {total.installments ? (
                  <span>
                    {`OR UP TO ${total.installments} x ${
                      total.currencyFormat
                    } ${formatPrice(
                      total.totalPrice / total.installments,
                      total.currencyId
                    )}`}
                  </span>
                ) : null}
              </S.SubPriceInstallment>
            </S.SubPrice>
            <S.CheckoutButton onClick={handleCheckout} autoFocus>
              Place Your Order
            </S.CheckoutButton>
          </S.CartFooter>
        </S.CartContent>
      )}
    </S.Container>
  );
};

export default Cart;
