export const categorizeIngredient = (ingredients) => { //hàm này nhận vào mảng ingredients và trả về một object
    return ingredients.reduce((acc, ingredient) => { //reduce để chuyển mảng thành object với key là category.name và value là mảng các ingredient
        const { category } = ingredient; //lấy ra category của ingredient đó
        if (!acc[category.name]) {  //nếu chưa có category đó thì tạo mới
            acc[category.name] = []; // tạo mảng rỗng
        }
        acc[category.name].push(ingredient); //push ingredient vào mảng của category đó
        return acc; //trả về object
    }, {});
}
