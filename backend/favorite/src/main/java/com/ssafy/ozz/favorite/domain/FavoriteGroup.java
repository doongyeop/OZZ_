package com.ssafy.ozz.favorite.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Builder(toBuilder = true)
@Table(name = "favorite_group")
public class FavoriteGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_group_id")
    private Long id;

    @Column(name = "favorite_group_name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "users_id")
    private User user;

    @OneToMany(mappedBy = "favoriteGroup")
    private List<Favorite> favorites;
}

    @Builder
    public FavoriteGroup(String name, Long userId) {
        this.name = name;
        this.userId = userId;
        this.favorites = new ArrayList<>();
    }
}
