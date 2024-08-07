package com.foodgo.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.foodgo.model.Address;
import com.foodgo.model.Event;
import jakarta.persistence.*;
import lombok.Data;

import java.util.*;

@Data // Tự động tạo getter, setter, toString, equals, hashCode
@Embeddable // Đánh dấu là một phần của entity khác, không phải một entity riêng biệt, không có id
public class RestaurantDto {
    private Long id;

    private String title;

    //@ElementCollection // Đánh dấu là một collection của các phần tử, không phải một entity riêng biệt
    //@Column(length = 1000) // Độ dài tối đa của mỗi phần tử
    private List<String> images;

    private String description;

//    private String phone;

    private Boolean open;

//    private Address address;

    //city
    private String city;

    private Integer totalFavorites = 0;

}
