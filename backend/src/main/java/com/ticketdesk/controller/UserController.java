package com.ticketdesk.controller;

import com.ticketdesk.dto.ApiResponse;
import com.ticketdesk.dto.UserDto;
import com.ticketdesk.entity.ERole;
import com.ticketdesk.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto userDto = userService.getUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT_ENGINEER')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT_ENGINEER')")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/role/{roleName}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT_ENGINEER')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsersByRole(@PathVariable String roleName) {
        ERole roleEnum = ERole.valueOf(roleName);
        List<UserDto> users = userService.getUsersByRole(roleEnum);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        UserDto updated = userService.updateUserRole(id, role);
        return ResponseEntity.ok(ApiResponse.success(updated, "User role updated"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserStatus(@PathVariable Long id, @RequestParam boolean active) {
        UserDto updated = userService.toggleUserStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success(updated, "User status updated"));
    }
}
