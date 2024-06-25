package com.example.apz_mobile.network

import com.example.apz_mobile.models.LoginRequest
import com.example.apz_mobile.models.LoginResponse
import com.example.apz_mobile.models.RoleResponse
import retrofit2.Response


class LoginRepository(private val apiService: ApiService) {

    suspend fun login(email: String, password: String): Response<LoginResponse> {
        val request = LoginRequest(email, password)
        return apiService.login(request)
    }

    suspend fun getUserRole(token: String): Response<RoleResponse> {
        return apiService.getUserRole("Bearer $token")
    }

    suspend fun refreshToken(token: String): Response<LoginResponse> {
        return apiService.refreshToken("Bearer $token")
    }
}