package com.foodgo.helper;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;

import java.util.List;
import java.util.stream.Collectors;


@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private T data;
    private String message;
    private String status;
    private List<String> errors;

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<T>(data, message, "SUCCESS", null);
    }

    public static <T> ApiResponse<T> notFound(T data, String message, List<String> errors) {
        return new ApiResponse<T>(null, message, "NOT FOUND", null);
    }

    public static <T> ApiResponse<T> errorServer(T data, String message, List<String> errors) {
        return new ApiResponse<T>(null, message, "SERVER_ERROR", null);
    }

    public static ApiResponse<Object> badRequest(BindingResult bindingResult) {
        List<String> errorsBadRequest = bindingResult.getAllErrors()
                .stream()
                .map(ObjectError::getDefaultMessage)
                .collect(Collectors.toList());

        return new ApiResponse<>(null, "Bad request", "BAD_REQUEST", errorsBadRequest);
    }

    //cannot create object
    public static <T> ApiResponse<T> cannotCreate(T data, String message, List<String> errors) {
        return new ApiResponse<T>(null, message, "CANNOT_CREATE", null);
    }

    //DUPLICATE VALUE
    public static <T> ApiResponse<T> duplicateValue(T data, String message, List<String> errors) {
        return new ApiResponse<T>(null, message, "DUPLICATE_VALUE", null);
    }
}
