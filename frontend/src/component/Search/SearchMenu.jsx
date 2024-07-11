import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MenuCard from '../Restaurant/MenuCard';
import { getAllMenuPubLicToSearch, getMenuItemsByRestaurantId, getMenuItemsByRestaurantIdPublic } from '../State/Menu/Action';
import { TextField, Grid, Card, CardHeader, Divider, FormControl, InputLabel, MenuItem, Select, Pagination, Button } from '@mui/material';
import { getAllRestaurantsAction, getAllRestaurantsPublicAction, getRestaurantById, getRestaurantPublicById, getRestaurantsCategory, getRestaurantsCategoryPublic } from '../State/Restaurant/Action';

const foodTypes = [
    { label: "All", value: "all" },
    { label: "Vegetarian only", value: "vegetarian" },
    { label: "Non-Vegetarian", value: "non_vegetarian" },
    { label: "Seasonal", value: "seasonal" },
];

const priceRanges = [
    { label: "All", value: "all" },
    { label: "50k-100k", value: "50k_100k" },
    { label: "100k-200k", value: "100k_200k" },
    { label: "200k-300k", value: "200k_300k" },
    { label: "300k-400k", value: "300k_400k" },
    { label: "above 400k", value: "above_400k" },
];

const SearchMenu = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenus, setFilteredMenus] = useState([]);
  const { menu, restaurant } = useSelector(store => store);
  const jwt = localStorage.getItem('jwt');
  const [foodType, setFoodType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const menusPerPage = 4;
  const id = 1;

  useEffect(() => {
    dispatch(getAllMenuPubLicToSearch());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getRestaurantById({ jwt, restaurantId: id }));
    dispatch(getRestaurantPublicById({ restaurantId: id }));
    dispatch(getRestaurantsCategory({ jwt, restaurantId: id }));
    dispatch(getRestaurantsCategoryPublic({ restaurantId: id }));
    dispatch(getAllRestaurantsAction(jwt));
    dispatch(getAllRestaurantsPublicAction());
  }, [dispatch, id, jwt]);

  useEffect(() => {
    dispatch(getMenuItemsByRestaurantId({
      jwt,
      restaurantId: id,
      vegetarian: foodType === "vegetarian",
      nonveg: foodType === "non_vegetarian",
      seasonal: foodType === "seasonal",
      foodCategory: selectedCategory,
    }));
    dispatch(getMenuItemsByRestaurantIdPublic({
      restaurantId: id,
      vegetarian: foodType === "vegetarian",
      nonveg: foodType === "non_vegetarian",
      seasonal: foodType === "seasonal",
      foodCategory: selectedCategory,
    }));
  }, [selectedCategory, foodType, dispatch, jwt, id]);

  useEffect(() => {
    setFilteredMenus(
      menu.list.filter(m => {
        const matchesSearchTerm = m.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFoodType = foodType === "all" || (foodType === "vegetarian" && m.vegetarian) || (foodType === "non_vegetarian" && !m.vegetarian) || (foodType === "seasonal" && m.seasonal);
        const matchesPriceRange = priceRange === "all" ||
          (priceRange === "50k_100k" && (m.price < 100000 && m.price >= 50000)) ||
          (priceRange === "100k_200k" && (m.price >= 100000 && m.price < 200000)) ||
          (priceRange === "200k_300k" && (m.price >= 200000 && m.price < 300000)) ||
          (priceRange === "300k_400k" && (m.price >= 300000 && m.price < 400000)) ||
          (priceRange === "above_400k" && (m.price >= 400000));
        
        return matchesSearchTerm && matchesFoodType && matchesPriceRange;
      })
    );
  }, [searchTerm, menu, foodType, priceRange]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFoodTypeChange = (e) => {
    setFoodType(e.target.value);
  };

  const handlePriceRangeChange = (e) => {
    setPriceRange(e.target.value);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFoodType('all');
    setSelectedCategory('');
    setPriceRange('all');
    setCurrentPage(1);
  };

  const indexOfLastMenu = currentPage * menusPerPage;
  const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
  const currentMenus = filteredMenus.slice(indexOfFirstMenu, indexOfLastMenu);

  return (
    <Card className='px-20'>
      <CardHeader>
        <h1>Search Menu</h1>
      </CardHeader>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <FormControl component="fieldset" fullWidth margin="normal">
        <InputLabel id="food-type-label">Food Type</InputLabel>
        <Select
          labelId="food-type-label"
          value={foodType}
          onChange={handleFoodTypeChange}
          label={foodType.label}
        >
          {foodTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl component="fieldset" fullWidth margin="normal">
        <InputLabel id="price-range-label">Price Range</InputLabel>
        <Select
          labelId="price-range-label"
          value={priceRange}
          onChange={handlePriceRangeChange}
        >
          {priceRanges.map((range) => (
            <MenuItem key={range.value} value={range.value}>
              {range.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="secondary" onClick={handleReset} className="mt-4">
        Reset
      </Button>
      <Grid container spacing={2}>
        {currentMenus.map(menu => (
          <Grid item xs={12} key={menu.id}>
            <MenuCard item={menu}/>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={Math.ceil(filteredMenus.length / menusPerPage)}
        page={currentPage}
        onChange={handleChangePage}
        color="primary"
        className="mt-4"
        variant="outlined"
      />
    </Card>
  );
};

export default SearchMenu;
