package com.rewards360.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class TrendResponse {
    private List<String> labels;
    private List<Long> data;
}