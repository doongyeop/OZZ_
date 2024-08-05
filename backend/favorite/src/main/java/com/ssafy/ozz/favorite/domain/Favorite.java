package com.ssafy.ozz.favorite.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Builder(toBuilder = true)
@Table(name = "favorite")
public class Favorite {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "favorite_group_id")
    private FavoriteGroup favoriteGroup;

    @ManyToOne
    @JoinColumn(name = "coordinate_id")
    private Coordinate coordinate;
}
