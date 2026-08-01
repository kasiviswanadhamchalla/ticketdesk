package com.ticketdesk.service;

import com.ticketdesk.dto.UserDto;
import com.ticketdesk.entity.ERole;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto getUserByUsername(String username);
    List<UserDto> getUsersByRole(ERole roleName);
    UserDto updateUserRole(Long userId, String roleName);
    UserDto toggleUserStatus(Long userId, boolean active);
}
