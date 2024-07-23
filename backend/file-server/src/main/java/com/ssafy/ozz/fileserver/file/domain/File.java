package com.ssafy.ozz.fileserver.file.domain;


import jakarta.persistence.*;
import lombok.*;

@Table
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int fildId;

    private String name;

    private String url;

    private String type;

    private String uploadDate;
}
