package com.ssafy.ozz.board.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clothes_tag")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boards_id")
    private Board board;

    @Column(name = "x_position")
    private Float xPosition;

    @Column(name = "y_position")
    private Float yPosition;

    @Column(name = "clothes_id")
    private Long clothesId;
}
