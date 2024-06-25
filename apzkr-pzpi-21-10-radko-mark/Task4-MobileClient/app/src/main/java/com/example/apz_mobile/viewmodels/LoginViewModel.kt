package com.example.apz_mobile.viewmodels

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.apz_mobile.models.LoginResponse
import com.example.apz_mobile.models.RoleResponse
import com.example.apz_mobile.network.LoginRepository
import kotlinx.coroutines.launch

class LoginViewModel(private val repository: LoginRepository) : ViewModel() {

    val loginResponse = MutableLiveData<LoginResponse>()
    val userRoleResponse = MutableLiveData<RoleResponse>()
    val error = MutableLiveData<String>()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            try {
                val response = repository.login(email, password)
                if (response.isSuccessful) {
                    loginResponse.postValue(response.body())
                } else {
                    error.postValue("Login failed: ${response.message()}")
                }
            } catch (e: Exception) {
                error.postValue("Error logging in: ${e.message}")
            }
        }
    }

    fun getUserRole(token: String) {
        viewModelScope.launch {
            try {
                val response = repository.getUserRole(token)
                if (response.isSuccessful) {
                    userRoleResponse.postValue(response.body())
                } else {
                    error.postValue("Failed to get user role: ${response.message()}")
                }
            } catch (e: Exception) {
                error.postValue("Error getting user role: ${e.message}")
            }
        }
    }

    fun refreshToken(token: String) {
        viewModelScope.launch {
            try {
                val response = repository.refreshToken(token)
                if (response.isSuccessful) {
                    loginResponse.postValue(response.body())
                } else {
                    error.postValue("Failed to refresh token: ${response.message()}")
                }
            } catch (e: Exception) {
                error.postValue("Error refreshing token: ${e.message}")
            }
        }
    }
}


