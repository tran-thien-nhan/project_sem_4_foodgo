package com.foodgo.controller;

import com.foodgo.model.Rating;
import com.foodgo.model.User;
import com.foodgo.service.RatingService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @Autowired
    private UserService userService;

    @PostMapping()
    public ResponseEntity<Rating> addRating(@RequestParam Long restaurantId,
                                            @RequestParam Long userId,
                                            @RequestParam int stars,
                                            @RequestParam String comment,
                                            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
//        if(user.getId() != userId) {
//            throw new Exception("User not found");
//        }
        Rating rating = ratingService.addRating(restaurantId, userId, stars, comment);
        return new ResponseEntity<>(rating, HttpStatus.CREATED);
    }

    @GetMapping("/{restaurantId}")
    public ResponseEntity<List<Rating>> getRatings(@PathVariable Long restaurantId,
                                                   @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        if (user == null) {
            throw new Exception("User not found");
        }
        List<Rating> ratings = ratingService.getRatings(restaurantId);
        return new ResponseEntity<>(ratings, HttpStatus.OK);
    }

    @PutMapping("/{ratingId}")
    public ResponseEntity<Rating> updateRating(@PathVariable Long ratingId,
                                               @RequestParam int stars,
                                               @RequestParam String comment,
                                               @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        if (user == null) {
            throw new Exception("User not found");
        }
        Rating updatedRating = ratingService.updateRating(ratingId, stars, comment);
        return new ResponseEntity<>(updatedRating, HttpStatus.OK);
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long ratingId,
                                             @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        if (user == null) {
            throw new Exception("User not found");
        }
        ratingService.deleteRating(ratingId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
