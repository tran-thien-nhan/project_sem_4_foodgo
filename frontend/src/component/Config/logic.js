export const isPresentInFavorite = (favorites, restaurant) => {
    if (!Array.isArray(favorites)) {
        return false;
    }
    for (let item of favorites) {
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