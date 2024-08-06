package com.ssafy.ozz.board.domain;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "board_likes")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
@IdClass(BoardLikes.BoardLikesId.class) // 복합키 지정
public class BoardLikes {

    @Id
    @Column(name = "boards_id", nullable = false)
    private Long boardId;

    @Id
    @Column(name = "users_id", nullable = false)
    private Long userId;

    @Column(name = "created_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @PrePersist
    protected void onCreate() {
        createdDate = new Date();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BoardLikesId implements Serializable {
        private Long boardId;
        private Long userId;
    }
}
