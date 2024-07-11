import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, FormGroup, Chip, Tooltip, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useState, useEffect } from 'react';
import { categorizeIngredient } from '../util/categorizeIngredient';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, getAllCartItems } from '../State/Cart/Action';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const MenuCard = ({ item }) => {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const dispatch = useDispatch();
    const { restaurant, cart, loading, cartId, menu } = useSelector(store => store); // Lấy giá trị cart và cartId từ store
    const token = localStorage.getItem('jwt');
    const [totalPrice, setTotalPrice] = useState(item.price);
    const [cartTotal, setCartTotal] = useState(0);
    const navigate = useNavigate();

    //console.log("MENU: ", menu);

    const handleAddItemToCart = (e) => {
        e.preventDefault();

        if (!localStorage.getItem('jwt')) {
            toast.warn('please login to add item to cart !', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            navigate('/account/login');
            return;
        }

        const reqData = {
            token: localStorage.getItem('jwt'),
            cartItem: {
                foodId: item.id,
                quantity: 1,
                ingredients: selectedIngredients,
                totalPrice: totalPrice,
                ingredientsTotalPrice: totalPrice - item.price
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
        if (!localStorage.getItem('jwt')) {
            // Nếu chưa đăng nhập thì hiển thị thông báo và không thể chọn topping được (là không tick vô được checkbox)
            toast.warn('please login to add item to cart !', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            navigate('/account/login');

        }
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
                                {selectedIngredients.length > 0 && <span className='text-gray-400 px-1'>Toppings:</span>}
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
                                <span className='text-gray-400 px-1'>total:</span> {totalPrice.toLocaleString('vi-VN')} VNĐ
                            </p>
                            <div className="flex items-center space-x-1">
                                <p className="text-lg font-medium">{item.totalBought}</p>
                                <IconButton className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
                                    <AddShoppingCartIcon />
                                </IconButton>
                            </div>
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
                                            <Tooltip title={(!restaurant.restaurant.open || !item.restaurant.open) ? "this restaurant is closing" : ""} placement="bottom" arrow>
                                                <Tooltip title={!ingredient.inStoke ? "this topping is temporarily out of stoke" : ""} placement="bottom" arrow>
                                                    <FormControlLabel
                                                        key={ingredient.ID}
                                                        control={<Checkbox onChange={() => handleCheckBoxChange(ingredient.name)} />}
                                                        label={ingredient.name + ' (+' + ingredient.price.toLocaleString('vi-VN') + 'đ)'}
                                                        disabled={!ingredient.inStoke || !restaurant.restaurant.open}
                                                    />
                                                </Tooltip>
                                            </Tooltip>
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
                            <Tooltip title={!restaurant.restaurant.open ? "this restaurant is closing " : ""} placement="bottom" arrow>
                                <Button variant='contained' color='primary' disabled>
                                    Add to Cart
                                </Button>
                            </Tooltip>
                        }
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>
    );
};

export default MenuCard;
