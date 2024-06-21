import { Chip, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllCartItems, removeCartItem, updateCartItem } from '../State/Cart/Action';
import { useNavigate } from 'react-router-dom';
import { categorizeIngredient, returnPriceOfIngredient } from '../util/categorizeIngredient';

const CartItem = ({ item }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const dispatch = useDispatch();
    const { auth, cart } = useSelector((store) => store);
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(item.totalPrice);
    const jwt = localStorage.getItem('jwt');
    const [ingredientsTotalPrice, setIngredientsTotalPrice] = useState(0);

    // console.log("CART 0: ", cart);
    // console.log("CART 0 ID: ", cart.cart?.id);

    useEffect(() => {
        const selectedIngredients = item.ingredients;
        const ingredientsTotalPriceAll = selectedIngredients.reduce((total, ingredientName) => {
            const ingredient = item.food.ingredients.find(ing => ing.name === ingredientName);
            return total + (ingredient ? ingredient.price : 0);
        }, 0);
        setIngredientsTotalPrice(ingredientsTotalPriceAll);
        setTotalPrice((item.food.price + ingredientsTotalPriceAll) * quantity);
    }, [quantity, item]);

    const handleUpdateCartItem = (value) => {
        if (value === -1 && quantity === 1) {
            handleRemoveCartItem();
        }
        else {
            const newQuantity = quantity + value;
            setQuantity(newQuantity);
            const selectedIngredients = item.ingredients;
            const ingredientsTotalPrice = selectedIngredients.reduce((total, ingredientName) => {
                const ingredient = item.food.ingredients.find(ing => ing.name === ingredientName);
                return total + (ingredient ? ingredient.price : 0);
            }, 0);
            const data = {
                cartItemId: item.id,
                quantity: item.quantity + value,
                ingredientsTotalPrice: ingredientsTotalPrice
            }
            dispatch(updateCartItem(data, (auth.jwt || jwt)));
        }
    }

    const handleRemoveCartItem = () => {
        dispatch(removeCartItem({
            cartItemId: item.id,
            jwt: auth.jwt || jwt
        })).then(() => {
            setQuantity(0);  // Cập nhật state để loại bỏ item khỏi giao diện
            dispatch(getAllCartItems({ cartId: cart.id, token: auth.jwt || jwt }));
        });
    }

    if (quantity === 0) {
        // không hiển thị item đã xóa khỏi giỏ hàng
        return null;
    }

    // nếu giỏ hàng rỗng thì chuyển hướng về trang chủ
    // if (cart.cartItems.length === 0) {
    //     navigate('/');
    // }


    const handleRemove = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            const selectedIngredients = item.ingredients;
            const ingredientsTotalPrice = selectedIngredients.reduce((total, ingredientName) => {
                const ingredient = item.food.ingredients.find(ing => ing.name === ingredientName);
                return total + (ingredient ? ingredient.price : 0);
            }, 0);
            dispatch(updateCartItem({
                cartItemId: item.id,
                quantity: newQuantity,
                ingredientsTotalPrice: ingredientsTotalPrice,
                // jwt: auth.jwt || jwt
            },(auth.jwt || jwt)));
        }
    };

    const handleAdd = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        const selectedIngredients = item.ingredients;
        const ingredientsTotalPrice = selectedIngredients.reduce((total, ingredientName) => {
            const ingredient = item.food.ingredients.find(ing => ing.name === ingredientName);
            return total + (ingredient ? ingredient.price : 0);
        }, 0);
        dispatch(updateCartItem({
            cartItemId: item.id,
            quantity: newQuantity,
            ingredientsTotalPrice: ingredientsTotalPrice,
            // jwt: auth.jwt || jwt            
        },(auth.jwt || jwt)));
    };

    const handleRemoveItemFromCart = () => {
        dispatch(removeCartItem({
            cartItemId: item.id,
            jwt: localStorage.getItem('jwt')
        })).then(() => {
            setQuantity(0);  // Cập nhật state để loại bỏ item khỏi giao diện
            dispatch(getAllCartItems({ cartId: cart.id, token: auth.jwt || jwt }));
        });
    }

    return (
        <div className='px-5'>
            <div className='lg:flex items-center lg:space-x-5'>
                <div>
                    <img
                        className='w-[5rem] h-[5rem] object-cover'
                        src={item.food.images[0] ? item.food.images[0] : 'https://via.placeholder.com/150'}
                        alt=""
                    />
                </div>
                <div className='flex items-center justify-between lg:w-[70%]'>
                    <div className='space-y-1 lg:space-y-3 w-full'>
                        <p>{item.food.name}</p>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center space-x-1'>
                                <p
                                    className='text-gray-500 text-sx'
                                >
                                    {item.food.price.toLocaleString('vi-VN')} x
                                </p>
                                <IconButton onClick={()=>handleUpdateCartItem(-1)}>
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                                <div className='w-5 h-5 text-xs flex items-center justify-center'>

                                    {quantity}

                                </div>
                                <IconButton onClick={()=>handleUpdateCartItem(1)}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    <p
                        className='mt-9 lg:mt-9'
                    >{totalPrice.toLocaleString('vi-VN')}đ</p>
                </div>
            </div>
            <div className='pt-3 space-x-2'>
                {
                    item.ingredients.map((i) => (
                        <Chip key={i} label={i} className='my-1' />
                    ))
                }
            </div>
            <IconButton onClick={handleRemoveItemFromCart}>
                <DeleteIcon />
            </IconButton>
        </div>
    );
};

export default CartItem;
