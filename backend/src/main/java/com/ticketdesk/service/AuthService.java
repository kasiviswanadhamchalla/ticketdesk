package com.ticketdesk.service;

import com.ticketdesk.dto.*;

public interface AuthService {
    AuthResponse authenticateUser(AuthRequest loginRequest);
    UserDto registerUser(RegisterRequest registerRequest);
    RefreshTokenResponse refreshToken(RefreshTokenRequest request);
    void changePassword(String username, ChangePasswordRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void logout(String username);
}
