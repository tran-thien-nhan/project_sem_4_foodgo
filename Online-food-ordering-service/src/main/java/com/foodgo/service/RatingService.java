package com.foodgo.service;

import com.foodgo.model.Rating;

import java.util.List;

public interface RatingService {
    public Rating addRating(Long restaurantId, Long userId, int stars, String comment);
    public List<Rating> getRatings(Long restaurantId);
    public List<Rating> getRatingsVisible(Long restaurantId);

    public List<Rating> getRatingsByUserId(Long userId);

    public Rating getRating(Long ratingId);

    public Rating updateRating(Long ratingId, int stars, String comment);

    public void deleteRating(Long ratingId);

    public void deleteRatingsByRestaurantId(Long restaurantId);

    public void deleteRatingsByUserId(Long userId);

    public void deleteRatingsByRestaurantIdAndUserId(Long restaurantId, Long userId);

    public int getAverageRating(Long restaurantId);

    public int getRatingCount(Long restaurantId);

    public Rating updateVisibility(Long id);
}
