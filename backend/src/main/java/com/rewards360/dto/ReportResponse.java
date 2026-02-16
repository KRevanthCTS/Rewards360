
package com.rewards360.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReportResponse {
    private String metric;
    private String start;
    private String end;
    private List<String> labels;
    private List<Integer> values;
}
