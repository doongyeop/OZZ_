package com.ssafy.ozz.user.service;

import com.ssafy.ozz.user.domain.User;

import java.util.Optional;

public interface UserService {
    public Optional<User> getUserById(Long id);

    public User updateUser(Long id, User updatedUser);

    public User updateProfileImg(Long id, User updatedUser);

    public void deleteUser(Long id);
}
