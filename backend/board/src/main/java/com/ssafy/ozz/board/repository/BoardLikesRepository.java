package com.ssafy.ozz.board.repository;

import com.ssafy.ozz.board.domain.BoardLikes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardLikesRepository extends JpaRepository<BoardLikes, BoardLikes.BoardLikesId> {

    int countByBoard_Id(Long boardId);

}
