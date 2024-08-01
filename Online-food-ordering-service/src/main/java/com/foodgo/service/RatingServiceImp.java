package com.foodgo.service;

import com.foodgo.model.Rating;
import com.foodgo.model.Restaurant;
import com.foodgo.model.User;
import com.foodgo.repository.RatingRepository;
import com.foodgo.repository.RestaurantRepository;
import com.foodgo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingServiceImp implements RatingService{

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private BadWordService badWordService;
    @Override
    public Rating addRating(Long restaurantId, Long userId, int stars, String comment) {
        if (badWordService.containsBadWords(comment)) {
            throw new RuntimeException("Comment contains inappropriate language.");
        }
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow(() -> new RuntimeException("Restaurant not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Rating rating = new Rating();
        rating.setRestaurant(restaurant);
        rating.setUser(user);
        rating.setStars(stars);
        rating.setComment(comment);
        rating.setCreatedAt(LocalDateTime.now());
        rating.setVisible(stars > 2);

        return ratingRepository.save(rating);
    }

    @Override
    public List<Rating> getRatings(Long restaurantId) {

        return ratingRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public List<Rating> getRatingsVisible(Long restaurantId) {
        return ratingRepository.findByRestaurantId(restaurantId).stream()
                .filter(Rating::isVisible)
                .collect(Collectors.toList());
    }

    @Override
    public List<Rating> getRatingsByUserId(Long userId) {
        return ratingRepository.findByUserId(userId).stream()
                .filter(Rating::isVisible)
                .collect(Collectors.toList());
    }

    @Override
    public Rating getRating(Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId).orElseThrow(() -> new RuntimeException("Rating not found"));
        if (!rating.isVisible()) {
            throw new RuntimeException("Rating is not visible");
        }
        return rating;
    }

    @Override
    public Rating updateRating(Long ratingId, int stars, String comment) {
        Rating rating = ratingRepository.findById(ratingId).orElseThrow(() -> new RuntimeException("Rating not found"));
        rating.setStars(stars);
        rating.setComment(comment);
        return ratingRepository.save(rating);
    }

    @Override
    public void deleteRating(Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId).orElseThrow(() -> new RuntimeException("Rating not found"));
        ratingRepository.delete(rating);
    }

    @Override
    public void deleteRatingsByRestaurantId(Long restaurantId) {
        List<Rating> ratings = ratingRepository.findByRestaurantId(restaurantId);
        ratingRepository.deleteAll(ratings);
    }

    @Override
    public void deleteRatingsByUserId(Long userId) {
        List<Rating> ratings = ratingRepository.findByUserId(userId);
        ratingRepository.deleteAll(ratings);
    }

    @Override
    public void deleteRatingsByRestaurantIdAndUserId(Long restaurantId, Long userId) {
        List<Rating> ratings = ratingRepository.findByRestaurantIdAndUserId(restaurantId, userId);
        ratingRepository.deleteAll(ratings);
    }

    @Override
    public int getAverageRating(Long restaurantId) {
        List<Rating> ratings = ratingRepository.findByRestaurantId(restaurantId);
        if (ratings.isEmpty()) {
            return 0;
        }
        int sum = 0;
        for (Rating rating : ratings) {
            sum += rating.getStars();
        }
        return sum / ratings.size();
    }

    @Override
    public int getRatingCount(Long restaurantId) {
        List<Rating> ratings = ratingRepository.findByRestaurantId(restaurantId);
        return ratings.size();
    }

    @Override
    public Rating updateVisibility(Long id) {
        Rating rating = ratingRepository.findById(id).orElse(null);
        if (rating == null) {
            throw new RuntimeException("Rating not found");
        }
        rating.setVisible(!rating.isVisible());
        return ratingRepository.save(rating);
    }
}
