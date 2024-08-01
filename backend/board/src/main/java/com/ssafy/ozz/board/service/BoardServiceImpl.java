package com.ssafy.ozz.board.service;

import com.ssafy.ozz.board.domain.Board;
import com.ssafy.ozz.board.dto.request.BoardCreateRequest;
import com.ssafy.ozz.board.dto.request.BoardUpdateRequest;
import com.ssafy.ozz.board.dto.response.BoardWithFileResponse;
import com.ssafy.ozz.board.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final FileService fileService;

    @Override
    public Board createBoard(Long userId, MultipartFile imageFile, BoardCreateRequest request) {
        Long imgId = fileService.saveFile(imageFile);

        Board board = Board.builder()
                .content(request.content())
                .imgId(imgId)
                .userId(userId)
                .age(request.age())
                .style(request.styleList())
                .likes(0)
                .createdDate(new Date())
                .build();

        return boardRepository.save(board);
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
    public Board updateBoard(Long boardId, BoardUpdateRequest request) {
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new IllegalArgumentException("Board not found"));

        board = board.toBuilder()
                .content(request.content())
                .age(request.age())
                .style(request.styleList())
                .build();

        return boardRepository.save(board);
    }

    @Override
    public BoardWithFileResponse updateBoard(Long boardId, BoardUpdateRequest request, MultipartFile imgFile) {
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new IllegalArgumentException("Board not found"));
        Long imgId = fileService.saveFile(imgFile);

        board = board.toBuilder()
                .content(request.content())
                .imgId(imgId)
                .age(request.age())
                .style(request.styleList())
                .build();

        boardRepository.save(board);
        return new BoardWithFileResponse(board, imgFile.getOriginalFilename());
    }

    @Override
    public void deleteBoard(Long boardId) {
        boardRepository.deleteById(boardId);
    }
}
