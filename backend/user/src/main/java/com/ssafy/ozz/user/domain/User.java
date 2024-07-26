package com.ssafy.ozz.user.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "users_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 63)
    private String email;

    @Column(nullable = true, length = 15)
    private String nickname;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date birth;

    @Column(name = "created_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    // 외래키
    @Column(name = "profile_file_id", nullable = true)
    private Long profileFileId;

    @Column(nullable = false, length = 7)
    private String provider;

    private String username;

    @PrePersist // user entity가 저장될 때 현재 날짜로 설정
    protected void onCreate() {
        createdDate = new Date();
    }

}