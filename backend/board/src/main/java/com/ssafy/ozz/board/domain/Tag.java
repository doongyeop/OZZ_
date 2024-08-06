package com.ssafy.ozz.board.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tags")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long boardId;

    @Column(name = "x_position")
    private double xPosition;

    @Column(name = "y_position")
    private double yPosition;

    @Column(name = "clothes_id")
    private Long clothesId;
}
