package com.ssafy.ozz.fileserver.file.repository;

import com.ssafy.ozz.fileserver.file.domain.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
}
