package com.example.apz_mobile.viewmodels

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.apz_mobile.models.UpdateResponse
import com.example.apz_mobile.models.User
import com.example.apz_mobile.models.UserDetails
import com.example.apz_mobile.network.UserRepository
import kotlinx.coroutines.launch

class UserViewModel(private val repository: UserRepository) : ViewModel() {

    val userDetailsResponse = MutableLiveData<User>()
    val updateUserResponse = MutableLiveData<UpdateResponse>()
    val error = MutableLiveData<String>()

    fun getUserDetails(token: String) {
        viewModelScope.launch {
            try {
                val response = repository.getUserDetails(token)
                if (response.isSuccessful) {
                    val user = response.body()
                    if (user != null) {
                        userDetailsResponse.postValue(user)
                    } else {
                        error.postValue("User data is null")
                    }
                } else {
                    error.postValue("Failed to get user details: ${response.message()}")
                }
            } catch (e: Exception) {
                error.postValue("Error getting user details: ${e.message}")
            }
        }
    }

    fun updateUserDetails(token: String, userDetails: UserDetails) {
        viewModelScope.launch {
            try {
                val response = repository.updateUserDetails(token, userDetails)
                if (response.isSuccessful) {
                    updateUserResponse.postValue(response.body())
                } else {
                    error.postValue("Failed to update user details: ${response.message()}")
                }
            } catch (e: Exception) {
                error.postValue("Error updating user details: ${e.message}")
            }
        }
    }
}


