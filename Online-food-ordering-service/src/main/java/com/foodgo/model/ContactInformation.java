package com.foodgo.model;

import lombok.*;

@Data
// vì sao ko có @Entity?
// vì class này chỉ chứa thông tin liên hệ của người dùng, không cần tương tác với database
public class ContactInformation {
    private String email;
    private String mobile;
    private String twitter;
    private String instagram;
    private String facebook;
    private String linkedin;
}
