import { Chip, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeCartItem, updateCartItem } from '../State/Cart/Action';
import { useNavigate } from 'react-router-dom';

const CartItem = ({ item }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const dispatch = useDispatch();
    const { cart } = useSelector(store => store);
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(item.totalPrice);

    console.log("ITEM: ", item);

    useEffect(() => {
        const selectedIngredients = item.ingredients;
        const ingredientsTotalPrice = selectedIngredients.reduce((total, ingredientName) => {
            const ingredient = item.food.ingredients.find(ing => ing.name === ingredientName);
            return total + (ingredient ? ingredient.price : 0);
        }, 0);

        const newTotalPrice = (item.food.price + ingredientsTotalPrice) * quantity;
        setTotalPrice(newTotalPrice);
    }, [quantity, item]);

    const handleRemove = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            dispatch(updateCartItem({
                cartItemId: item.id,
                quantity: newQuantity,
                jwt: localStorage.getItem('jwt')
            }));
        }
    };

    const handleAdd = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        dispatch(updateCartItem({
            cartItemId: item.id,
            quantity: newQuantity,
            jwt: localStorage.getItem('jwt')
        }));
    };

    const handleRemoveItemFromCart = () => {
        dispatch(removeCartItem({
            cartItemId: item.id,
            jwt: localStorage.getItem('jwt')
        })).then(() => {
            // Kiểm tra giỏ hàng sau khi xóa item
            if (cart.cart?.cartItems?.length === 1) {
                // Nếu giỏ hàng rỗng, chuyển hướng về trang chủ
                navigate('/');
                window.location.reload();
            } else {
                // Nếu giỏ hàng không rỗng, reload trang
                window.location.reload();
            }
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
                                <IconButton onClick={handleRemove}>
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                                <div className='w-5 h-5 text-xs flex items-center justify-center'>
                                    {quantity}
                                </div>
                                <IconButton onClick={handleAdd}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    <p>{totalPrice.toLocaleString('vi-VN')}đ</p>
                </div>
            </div>
            <div className='pt-3 space-x-2'>
                {item.ingredients.map((i) => (
                    <Chip key={i} label={i} className='my-1' />
                ))}
            </div>
            <IconButton onClick={handleRemoveItemFromCart}>
                <DeleteIcon />
            </IconButton>
        </div>
    );
};

export default CartItem;
