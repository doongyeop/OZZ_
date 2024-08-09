package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.board.domain.Tag;
import com.ssafy.ozz.board.dto.request.BoardCreateRequest;
import com.ssafy.ozz.board.dto.request.BoardUpdateRequest;
import com.ssafy.ozz.board.dto.request.TagDto;
import com.ssafy.ozz.board.dto.response.BoardResponse;
import com.ssafy.ozz.board.dto.response.UserResponse;
import com.ssafy.ozz.board.global.feign.file.FileClient;
import com.ssafy.ozz.board.global.feign.user.UserClient;
import com.ssafy.ozz.board.repository.BoardRepository;
import com.ssafy.ozz.board.repository.TagRepository;
import com.ssafy.ozz.library.file.FileInfo;
import com.ssafy.ozz.library.global.error.exception.BoardNotFoundException;
import com.ssafy.ozz.library.global.error.exception.FileNotFoundException;
import com.ssafy.ozz.library.global.error.exception.UserNotFoundException;
import com.ssafy.ozz.library.user.UserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static com.ssafy.ozz.library.util.EnumBitwiseConverter.toBits;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final TagRepository tagRepository;
    private final UserClient userClient;
    private final FileClient fileClient;

    @Override
    public Board createBoard(Long userId, Long imgFileId, BoardCreateRequest request) {

        Board board = Board.builder()
                .content(request.content())
                .imgFileId(imgFileId)
                .userId(userId)
                .age(request.age())
                .coordinateId(request.coordinateId())
                .style(toBits(request.styleList()))
                .likes(0)
                .createdDate(new Date())
                .build();

        boardRepository.save(board);

        // 태그 저장
        for (TagDto tag : request.tagList()) {
            Tag newTag = Tag.builder()
                    .board(board)
                    .clothesId(tag.clothesId())
                    .xPosition(tag.xPosition())
                    .yPosition(tag.yPosition())
                    .build();
            tagRepository.save(newTag);
        }

        return board;
    }

    @Override
    public Page<Board> getBoardsByUserId(Long userId, Pageable pageable) {
        return boardRepository.findByUserId(userId, pageable);
    }

    @Override
    public Page<Board> getBoards(Pageable pageable) {
        return boardRepository.findAll(pageable);
    }

    @Override
    public Board getBoard(Long boardId) {
        return boardRepository.findById(boardId).orElseThrow(BoardNotFoundException::new);
    }

    @Override
    public BoardResponse updateBoard(Long boardId, BoardUpdateRequest request, Long imgFileId) {
        Board board = boardRepository.findById(boardId).orElseThrow(BoardNotFoundException::new);
        FileInfo file = fileClient.getFile(imgFileId).orElseThrow(FileNotFoundException::new);
        UserInfo user = userClient.getUserInfo(board.getUserId()).orElseThrow(UserNotFoundException::new);

        Board updatedBoard = board.toBuilder()
                .content(request.content())
                .imgFileId(imgFileId)
                .coordinateId(request.coordinateId())
                .style(toBits(request.styleList()))
                .build();

        boardRepository.save(updatedBoard);

        if (request.tagList() != null) {
            List<Tag> tags = request.tagList().stream()
                    .map(tagRequest -> Tag.builder()
                            .clothesId(tagRequest.clothesId())
                            .xPosition(tagRequest.xPosition())
                            .yPosition(tagRequest.yPosition())
                            .board(updatedBoard)
                            .build())
                    .collect(Collectors.toList());
            tagRepository.deleteAllByBoardId(boardId);
            tagRepository.saveAll(tags);
        }

        UserResponse userResponse = new UserResponse(
                user.userId(),
                user.nickname(),
                user.Birth(),
                user.profileFileId(),
                fileClient.getFile(user.profileFileId()).orElseThrow(FileNotFoundException::new)
        );

        return new BoardResponse(updatedBoard, file, userResponse);
    }

    @Override
    public void deleteBoard(Long boardId) {
        tagRepository.deleteAllByBoardId(boardId);
        boardRepository.deleteById(boardId);
    }

    @Override
    public Page<Board> getBoardsByStyle(Pageable pageable, String style) {
        return boardRepository.findByStyle(style, pageable);
    }

    @Override
    public Page<Board> getBoardsByAgeRange(Pageable pageable, int startAge, int endAge) {
        return boardRepository.findByAgeBetween(startAge, endAge, pageable);
    }

    @Override
    public Page<Board> getBoardsSortedByLikesInOneDay(Pageable pageable) {
        Date oneDayAgo = new Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000);
        return boardRepository.findByCreatedDateAfterOrderByLikesDesc(oneDayAgo, pageable);
    }
}

