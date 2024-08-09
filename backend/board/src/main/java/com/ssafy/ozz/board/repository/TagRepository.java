package com.ssafy.ozz.board.repository;

import com.ssafy.ozz.board.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    void deleteAllByBoardId(Long boardId);
}
