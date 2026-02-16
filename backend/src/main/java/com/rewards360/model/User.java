
package com.rewards360.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate; 

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    private String phone;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN or USER
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private CustomerProfile profile;
    private LocalDate createdAt;
}
