export const isPresentInFavorite = (favoties, restaurant) => {
    // return favoties.some((item) => item.restaurantId === restaurant.restaurantId);
    for (let item of favoties) {
        if (restaurant.id === item.id) {
            return true;
        }
    }
    return false;
}

//isPresentEventInEventDtoFavorites
export const isPresentInEventDtoFavorites = (favorites, event) => {
    for (let item of favorites) {
        if (event.id === item.id) {
            return true;
        }
    }
    return false;
}