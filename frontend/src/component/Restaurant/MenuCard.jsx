import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, FormGroup, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useState, useEffect } from 'react';
import { categorizeIngredient } from '../util/categorizeIngredient';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, getAllCartItems } from '../State/Cart/Action';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MenuCard = ({ item }) => {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const dispatch = useDispatch();
    const { restaurant, cart, loading, cartId, menu } = useSelector(store => store); // Lấy giá trị cart và cartId từ store
    const token = localStorage.getItem('jwt');
    const [totalPrice, setTotalPrice] = useState(item.price);

    console.log("MENU: ", menu);

    const handleAddItemToCart = (e) => {
        e.preventDefault();
        const reqData = {
            token: localStorage.getItem('jwt'),
            cartItem: {
                foodId: item.id,
                quantity: 1,
                ingredients: selectedIngredients,
            }
        };
        console.log("Adding item to cart with reqData:", reqData);
        dispatch(addItemToCart(reqData));
        toast.success('add item to cart successfully !', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };

    useEffect(() => {
        if (cartId) {
            dispatch(getAllCartItems({ token, cartId }));
        }
    }, [cartId, dispatch, token]);

    const handleCheckBoxChange = (itemName) => {
        if (selectedIngredients.includes(itemName)) {
            setSelectedIngredients(selectedIngredients.filter(ingredient => ingredient !== itemName));
            setTotalPrice(totalPrice - item.ingredients.find(ingredient => ingredient.name === itemName).price);
        } else {
            setSelectedIngredients([...selectedIngredients, itemName]);
            setTotalPrice(totalPrice + item.ingredients.find(ingredient => ingredient.name === itemName).price);
        }
    };

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                <div className='lg:flex items-center justify-between'>
                    <div className='lg:flex items-center lg:gap-5'>
                        <img className='w-[7rem] h-[7rem] object-cover' src={item.images[0] || item.images[1]} alt="" />
                        <div className='space-y-1 lg:space-y-5 lg:max-w-2xl'>
                            <p className='text-xl font-semibold mt-3'>{item.name}</p>
                            <p>{item.price.toLocaleString('vi-VN')} VNĐ</p>
                            <p>
                                <span className='text-gray-400 px-1'>Description:</span>
                                {item.description}
                            </p>
                            <p>
                                <span className='text-gray-400 px-1'>Ingredients:</span>
                                {
                                    selectedIngredients.map((ingredient) => {
                                        if (selectedIngredients.length === 1) {
                                            return <Chip key={ingredient} label={ingredient} />;                                            
                                        }
                                        return <Chip key={ingredient} label={ingredient} className='mx-1' />;
                                    })
                                }
                            </p>
                            <p>
                                total: {totalPrice.toLocaleString('vi-VN')} VNĐ
                            </p>
                        </div>
                    </div>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <form onSubmit={handleAddItemToCart}>
                    <div className='flex gap-5 flex-wrap'>
                        {Object.keys(categorizeIngredient(item.ingredients)).map((category) => (
                            <div key={category}>
                                <p>{category}</p>
                                <FormGroup>
                                    {
                                        categorizeIngredient(item.ingredients)[category].map((ingredient) => (
                                            <FormControlLabel
                                                key={ingredient.ID}
                                                control={<Checkbox onChange={() => handleCheckBoxChange(ingredient.name)} />}
                                                label={ingredient.name + ' (' + ingredient.price.toLocaleString('vi-VN') + 'đ)'}
                                                disabled={!ingredient.inStoke || !restaurant.restaurant.open}
                                            />
                                        ))
                                    }
                                </FormGroup>
                            </div>
                        ))}
                    </div>
                    <div className='pt-5'>
                        {(restaurant.restaurant.open) ?
                            (item.available) ?
                                <Button type='submit' variant='contained' color='primary'>
                                    Add to Cart
                                </Button>
                                :
                                <Button variant='contained' color='primary' disabled>
                                    Out of Stock
                                </Button>
                            :
                            <Button variant='contained' color='primary' disabled>
                                Add to Cart
                            </Button>
                        }
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>
    );
};

export default MenuCard;
