package com.foodgo.service;

import com.foodgo.dto.EventDto;
import com.foodgo.dto.RestaurantDto;
import com.foodgo.model.Address;
import com.foodgo.model.Event;
import com.foodgo.model.Restaurant;
import com.foodgo.model.User;
import com.foodgo.repository.AddressRepository;
import com.foodgo.repository.EventRepository;
import com.foodgo.repository.RestaurantRepository;
import com.foodgo.repository.UserRepository;
import com.foodgo.request.CreateRestaurantRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RestaurantServiceImp implements RestaurantService{
    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;
    @Override
    public Restaurant createRestaurant(CreateRestaurantRequest req, User user) {
        Address address = addressRepository.save(req.getAddress()); // lưu địa chỉ vào database

        Restaurant restaurant = new Restaurant(); // tạo mới một nhà hàng
        restaurant.setAddress(address); // set địa chỉ cho nhà hàng
        restaurant.setContactInformation(req.getContactInformation()); // set thông tin liên hệ cho nhà hàng
        restaurant.setCuisineType(req.getCuisineType()); // set loại hình ẩm thực cho nhà hàng
        restaurant.setDescription(req.getDescription()); // set mô tả cho nhà hàng
        restaurant.setImages(req.getImages()); // set hình ảnh cho nhà hàng
        restaurant.setName(req.getName()); // set tên cho nhà hàng
        restaurant.setOpeningHours(req.getOpeningHours()); // set giờ mở cửa cho nhà hàng
        restaurant.setRegistrationDate(LocalDateTime.now()); // set thời gian đăng ký cho nhà hàng
        restaurant.setOwner(user); // set chủ sở hữu cho nhà hàng

        return restaurantRepository.save(restaurant); // lưu nhà hàng vào database
    }

    @Override
    public Restaurant updateRestaurant(Long restaurantId, CreateRestaurantRequest updatedRestaurant) throws Exception {
        Restaurant restaurant = findRestaurantById(restaurantId); // tìm nhà hàng theo id

        //nếu id không tồn tại thì báo lỗi
        if (restaurant == null) {
            throw new Exception("Restaurant not found");
        }

        if (restaurant.getCuisineType() != null) { // nếu loại hình ẩm thực không rỗng
            restaurant.setCuisineType(updatedRestaurant.getCuisineType()); // cập nhật loại hình ẩm thực
        }

        if (restaurant.getDescription() != null) { // nếu mô tả không rỗng
            restaurant.setDescription(updatedRestaurant.getDescription()); // cập nhật mô tả
        }

        if (restaurant.getName() != null) { // nếu tên không rỗng
            restaurant.setName(updatedRestaurant.getName()); // cập nhật tên
        }

        return restaurantRepository.save(restaurant); // lưu nhà hàng vào database
    }

    @Override
    public void deleteRestaurant(Long restaurantId) throws Exception {
        Restaurant restaurant = findRestaurantById(restaurantId); // tìm nhà hàng theo id

        if (restaurant == null) { // nếu nhà hàng không tồn tại
            throw new Exception("Restaurant not found"); // báo lỗi
        }

        restaurantRepository.delete(restaurant); // xóa nhà hàng khỏi database
    }

    @Override
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll(); // lấy tất cả nhà hàng từ database
    }

    @Override
    public List<Restaurant> searchRestaurant(String keyword) {
        return restaurantRepository.findBySearchQuery(keyword); // tìm kiếm nhà hàng theo query (từ khóa tìm kiếm)
    }

    @Override
    public Restaurant findRestaurantById(Long id) throws Exception {
        Optional<Restaurant> opt = restaurantRepository.findById(id);
        opt.ifPresent(restaurant -> {
            restaurant.setAddress(addressRepository.findById(restaurant.getAddress().getId()).get());

            List<Event> events = eventRepository.findByRestaurantId(restaurant.getId());
            List<EventDto> eventDtos = events.stream().map(event -> {
                EventDto eventDto = new EventDto();
                eventDto.setId(event.getId());
                eventDto.setName(event.getName());
                eventDto.setLocation(event.getLocation());
                eventDto.setDescription(event.getDescription());
                eventDto.setStartedAt(event.getStartedAt());
                eventDto.setEndsAt(event.getEndsAt());
                eventDto.setImages(event.getImages());
                eventDto.setOfRestaurant(event.getRestaurant().getName());
                eventDto.setEventLimit(event.getEventLimit());
                eventDto.setIsAvailable(event.isAvailable());
                eventDto.setIsFull(event.isFull());

                return eventDto;
            }).collect(Collectors.toList());

            restaurant.setEventDto(eventDtos);
        });
        if (opt.isEmpty()) {
            throw new Exception("Restaurant not found with id: " + id);
        }
        return opt.get();
    }

    @Override
    public Restaurant getRestaurantByUserId(Long userId) throws Exception {
        Restaurant restaurant = restaurantRepository.findByOwnerId(userId); // tìm nhà hàng theo id của chủ sở hữu
        if (restaurant == null) {
            throw new Exception("Restaurant not found with user id: " + userId); // nếu không tìm thấy nhà hàng thì báo lỗi
        }
        return restaurant; // trả về nhà hàng
    }

    @Override
    public RestaurantDto addToFavorites(Long restaurantId, User user) throws Exception {
        Restaurant restaurant = findRestaurantById(restaurantId); // tìm nhà hàng theo id

        RestaurantDto dto = new RestaurantDto(); // tạo mới một đối tượng RestaurantDto
        dto.setDescription(restaurant.getDescription()); // set mô tả cho đối tượng RestaurantDto
        dto.setImages(restaurant.getImages()); // set hình ảnh cho đối tượng RestaurantDto
        dto.setTitle(restaurant.getName()); // set tên cho đối tượng RestaurantDto
        dto.setId(restaurant.getId()); // set id cho đối tượng RestaurantDto
        dto.setOpen(restaurant.isOpen());// set trạng thái mở/closed cho đối tượng RestaurantDto
        dto.setTotalFavorites(restaurant.getTotalFavorites()); // set tổng số lượt yêu thích cho đối tượng RestaurantDto

        //lấy thêm city từ bảng address
        Address address = addressRepository.findById(restaurant.getAddress().getId()).get(); // lấy địa chỉ theo id
        dto.setCity(address.getCity()); // set city cho đối tượng RestaurantDto

        boolean isFavorite = false; // khởi tạo biến isFavorite với giá trị false
        List<RestaurantDto> favorites = user.getFavorites(); // lấy danh sách nhà hàng yêu thích của người dùng

        for (RestaurantDto favorite : favorites ) { // duyệt qua danh sách nhà hàng yêu thích của người dùng
            if (favorite.getId().equals(restaurantId)) { // nếu id của nhà hàng yêu thích trùng với id của nhà hàng
                isFavorite = true; // set isFavorite thành true
                break; // thoát khỏi vòng lặp
            }
        }

        if (isFavorite) { // nếu nhà hàng đã được thêm vào danh sách yêu thích
            boolean removed = favorites.removeIf(favorite -> favorite.getId().equals(restaurantId)); // xóa nhà hàng khỏi danh sách yêu thích của người dùng
            if(removed){ // nếu nhà hàng đã được xóa khỏi danh sách yêu thích
                if(restaurant.getTotalFavorites() > 0){
                    restaurant.setTotalFavorites(restaurant.getTotalFavorites() - 1); // giảm số lượng yêu thích của nhà hàng xuống 1 nếu nhà hàng thực sự bị xóa
                    dto.setTotalFavorites(restaurant.getTotalFavorites()); // cập nhật lại số lượng yêu thích của nhà hàng
                    favorites.removeIf(favorite -> favorite.getId().equals(restaurantId)); // xóa nhà hàng khỏi danh sách yêu thích của người dùng
                    user.getEventDto().removeIf(eventDto -> eventDto.getOfRestaurant().equals(restaurant.getName())); // xóa sự kiện của nhà hàng khỏi danh sách sự kiện yêu thích của người dùng
                    user.getEventDtoFavorites().removeIf(eventDtoFavorite -> eventDtoFavorite.getOfRestaurant().equals(restaurant.getName())); // xóa sự kiện yêu thích của nhà hàng khỏi danh sách sự kiện yêu thích của người dùng
                    // update lại các truong isFull và isAvailable của sự kiện
                    List<Event> events = eventRepository.findByRestaurantId(restaurant.getId());
                    for (Event event : events) {
                        event.setFull(false);
                        event.setAvailable(true);
                        event.setTotalFavorites(event.getTotalFavorites() - 1);
                        eventRepository.save(event);
                    }
                }
                else{
                    restaurant.setTotalFavorites(0); // set số lượng yêu thích của nhà hàng thành 0
                }
            }

        } else { // nếu nhà hàng chưa được thêm vào danh sách yêu thích
            favorites.add(dto); // thêm nhà hàng vào danh sách yêu thích của người dùng
            restaurant.setTotalFavorites(restaurant.getTotalFavorites() + 1); // tăng số lượng yêu thích của nhà hàng lên 1
        }

        userRepository.save(user); // lưu thông tin người dùng vào database
        return dto; // trả về đối tượng RestaurantDto (dto nghĩa là data transfer object, dùng để chuyển dữ liệu giữa các lớp)
    }

    @Override
    public Restaurant updateRestaurantStatus(Long id) throws Exception {
        Restaurant restaurant = findRestaurantById(id); // tìm nhà hàng theo id
        restaurant.setOpen(!restaurant.isOpen()); // cập nhật trạng thái mở/closed của nhà hàng
        return restaurantRepository.save(restaurant); // lưu nhà hàng vào database
    }

    @Override
    public List<Restaurant> getFavoriteRestaurants(User user) throws Exception {
        List<RestaurantDto> favorites = user.getFavorites(); // lấy danh sách nhà hàng yêu thích của người dùng
        List<Restaurant> restaurants = restaurantRepository.findAll(); // lấy tất cả nhà hàng từ database
        List<Restaurant> favoritesRestaurants = new ArrayList<>();

        for (Restaurant restaurant : restaurants) { // duyệt qua danh sách nhà hàng
            for (RestaurantDto favorite : favorites) { // duyệt qua danh sách nhà hàng yêu thích của người dùng
                if (restaurant.getId().equals(favorite.getId())) { // nếu id của nhà hàng trùng với id của nhà hàng yêu thích
                    favoritesRestaurants.add(restaurant); // thêm nhà hàng vào danh sách nhà hàng yêu thích
                }
            }
        }

        return favoritesRestaurants; // trả về danh sách nhà hàng yêu thích
    }
}
