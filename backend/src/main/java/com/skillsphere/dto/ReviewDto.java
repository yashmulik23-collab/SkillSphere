package com.skillsphere.dto;

import lombok.Data;

@Data
public class ReviewDto {
    private Long revieweeId;
    private Integer rating;
    private String comment;
}
