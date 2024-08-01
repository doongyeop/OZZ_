package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.BoardLikes;
import com.ssafy.ozz.board.repository.BoardLikesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardLikesServiceImpl implements BoardLikesService {

    private final BoardLikesRepository boardLikesRepository;

    @Override
    @Transactional
    public boolean toggleLike(BoardLikes boardLikes) {
        Optional<BoardLikes> existingLike = boardLikesRepository.findById(new BoardLikes.BoardLikesId(boardLikes.getBoardId(), boardLikes.getUserId()));

        if (existingLike.isPresent()) {
            boardLikesRepository.delete(existingLike.get());
            return false;
        } else {
            BoardLikes newBoardLike = BoardLikes.builder()
                    .boardId(boardLikes.getBoardId())
                    .userId(boardLikes.getUserId())
                    .build();
            boardLikesRepository.save(newBoardLike);
            return true;
        }
    }

    @Override
    public List<Map<String, Object>> getLikesCountByBoardId(Long boardId) {
        return boardLikesRepository.getLikesCountByBoardId(boardId);
    }
}
