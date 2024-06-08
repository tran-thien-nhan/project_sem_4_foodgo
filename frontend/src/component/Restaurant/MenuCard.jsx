import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react'
import { Category } from '@mui/icons-material';

const ingredients = [
    {
        Category: "Nuts & seeds",
        ingredients: "Cashews"
    },
    {
        Category: "Meat",
        ingredients: "Meat"
    },
    {
        Category: "bread",
        ingredients: "Bread"
    }
]

const demo = [
    {
        Category: "Nuts & seeds",
        ingredients: ["Cashews", "Almonds", "Peanuts", "Walnuts"]
    },
    {
        Category: "Meat",
        ingredients: ["Meat", "Chicken", "Bacons", "Beef"]
    },
    {
        Category: "Bread",
        ingredients: ["Bread", "Bun", "Baguette", "Croissant"]
    },
    {
        Category: "Vegetable",
        ingredients: ["Cucumber", "Tomato", "Lettuce", "Carrot"]
    },
    {
        Category: "Cheese",
        ingredients: ["Cheddar", "Mozzarella", "Parmesan", "Feta"]
    },
]

const MenuCard = () => {
    const handleCheckBoxChange = (value) => {
        console.log('value');
    }
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <div
                    className='lg:flex items-center justify-between'
                >
                    <div
                        className='lg:flex items-center lg:gap-5'
                    >
                        <img
                            className='w-[7rem] h-[7rem] object-cover'
                            src="https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg"
                            alt=""
                        />
                        <div
                            className='space-y-1 lg:space-y-5 lg:max-w-2xl:'
                        >
                            <p
                                className='text-xl font-semibold'
                            >
                                Burger
                            </p>
                            <p>30.000 VNĐ</p>
                            <p>
                                <span
                                    className='text-gray-400'
                                >Description:</span> this burger is the best burger in the world
                            </p>

                        </div>
                    </div>

                </div>
            </AccordionSummary>
            <AccordionDetails>
                <form action="">
                    <div className='flex gap-5 flex-wrap'>
                        {
                            demo.map((item) =>
                                <div>
                                    <p>{item.Category}</p>
                                    <FormGroup>
                                        {
                                            item.ingredients.map((item) =>
                                                <FormControlLabel
                                                    control={<Checkbox onChange={() => handleCheckBoxChange(item)} />}
                                                    label={item}
                                                />
                                            )
                                        
                                        }
                                    </FormGroup>
                                </div>

                            )
                        }
                    </div>

                    <div className='pt-5'>
                        <Button
                            type='submit'
                            variant='contained'
                            disabled={false}
                            className='mt-5'
                        >
                            {true ? 'Add to cart' : 'Out of stock'}
                        </Button>
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>
    )
}

export default MenuCard
