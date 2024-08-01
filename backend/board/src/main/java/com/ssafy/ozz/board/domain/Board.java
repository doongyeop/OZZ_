package com.ssafy.ozz.board.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "boards")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "boards_id")
    private Long id;

    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "image_file_id")
    private Long imgId; // 외래키

    private int age;

    @Column(columnDefinition = "BIT(32)")
    private Integer style;

    @Column(name = "numlikes")
    private int likes;

    @Column(name = "created_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardLikes> likesList;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tag> tags;

    @PrePersist
    protected void onCreate() {
        createdDate = new Date();
    }

}
