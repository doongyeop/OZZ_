package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.board.domain.Style;
import com.ssafy.ozz.board.domain.Tag;
import com.ssafy.ozz.board.dto.request.BoardCreateRequest;
import com.ssafy.ozz.board.dto.request.BoardUpdateRequest;
import com.ssafy.ozz.board.dto.response.BoardResponse;
import com.ssafy.ozz.board.dto.response.BoardWithFileResponse;
import com.ssafy.ozz.board.repository.BoardRepository;
import com.ssafy.ozz.board.repository.TagRepository;
import com.ssafy.ozz.board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final FileService fileService;

    @Override
    public Board createBoard(Long userId, MultipartFile imgFile, BoardCreateRequest request) {
        Long imgId = fileService.saveFile(imgFile);

        Board board = Board.builder()
                .content(request.content())
                .imgId(imgId)
                .user(userRepository.findById(userId))
                .age(request.age())
                .style(Style) // 스타일 비트 연산
                .likes(0)
                .createdDate(new Date())
                .build();

        boardRepository.save(board);

        // 태그 저장
        for (BoardCreateRequest.Tag tag : request.tagList()) {
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
    public Optional<Board> getBoardsByUserId(Long userId) {
        return boardRepository.findByUserId(userId);
    }

    @Override
    public Page<Board> getBoards(Pageable pageable) {
        return boardRepository.findAll(pageable);
    }

    @Override
    public Board getBoard(Long boardId) {
        return boardRepository.findById(boardId).orElseThrow(() -> new IllegalArgumentException("Board not found"));
    }

    @Override
    public BoardResponse updateBoard(Long boardId, BoardUpdateRequest request) {
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new IllegalArgumentException("Board not found"));

        board = board.toBuilder()
                .content(request.content())
                .age(request.age())
                .style(Style.) // 스타일 비트 연산
                .build();

        boardRepository.save(board);

        // 기존 태그 삭제 후 새로운 태그 저장
        tagRepository.deleteAllByBoard(board);
        for (BoardUpdateRequest.Tag tag : request.tagList()) {
            Tag newTag = Tag.builder()
                    .board(board)
                    .clothesId(tag.clothesId())
                    .xPosition(tag.xPosition())
                    .yPosition(tag.yPosition())
                    .build();
            tagRepository.save(newTag);
        }

        return new BoardResponse(board);
    }

    @Override
    public BoardWithFileResponse updateBoard(Long boardId, BoardUpdateRequest request, MultipartFile imgFile) {
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new IllegalArgumentException("Board not found"));
        Long imgId = fileService.saveFile(imgFile);

        board = board.toBuilder()
                .content(request.content())
                .imgId(imgId)
                .age(request.age())
                .style() // 스타일 비트 연산
                .build();

        boardRepository.save(board);

        // 기존 태그 삭제 후 새로운 태그 저장
        tagRepository.deleteAllByBoard(board);
        for (BoardUpdateRequest.Tag tag : request.tagList()) {
            Tag newTag = Tag.builder()
                    .board(board)
                    .clothesId(tag.clothesId())
                    .xPosition(tag.xPosition())
                    .yPosition(tag.yPosition())
                    .build();
            tagRepository.save(newTag);
        }

        return new BoardWithFileResponse(board, imgFile);
    }

    @Override
    public void deleteBoard(Long boardId) {
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new IllegalArgumentException("Board not found"));
        tagRepository.deleteAllByBoard(board);
        boardRepository.deleteById(boardId);
    }

    @Override
    public Page<Board> getBoardsSortedBy(Pageable pageable, String sortBy) {
        switch (sortBy.toLowerCase()) {
            case "style":
                return boardRepository.findAll(pageable.sort(Sort.by("style")));
            case "age":
                return boardRepository.findAll(pageable.sort(Sort.by("age")));
            default:
                return boardRepository.findAll(pageable);
        }
    }

    @Override
    public Page<Board> getBoardsSortedByLikesInOneDay(Pageable pageable) {
        Date oneDayAgo = new Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000);
        return boardRepository.findByCreatedDateAfterOrderByLikesDesc(oneDayAgo, pageable);
    }
}
