package com.example.apz_mobile.network

import com.example.apz_mobile.models.Appointment
import com.example.apz_mobile.models.Department
import com.example.apz_mobile.models.Pet
import com.example.apz_mobile.models.UpdateResponse
import com.example.apz_mobile.models.User
import com.example.apz_mobile.models.UserDetails
import com.example.apz_mobile.models.UserResponse
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.Date

class UserRepository(private val apiService: ApiService) {

    suspend fun getUserDetails(token: String): Response<User> {
        val response = apiService.getUserDetails("Bearer $token")
        if (response.isSuccessful) {
            val user = response.body()?.user
            if (user != null) {
                return Response.success(user)
            }
        }
        return Response.error(response.code(), response.errorBody())
    }

    suspend fun updateUserDetails(token: String, userDetails: UserDetails): Response<UpdateResponse> {
        return apiService.updateUserDetails("Bearer $token", userDetails)
    }

    suspend fun searchDepartments(address: String, lang: String): Response<List<Department>> {
        val requestBody = mapOf("Address" to address, "Lang" to lang)
        return apiService.searchDepartments(requestBody)
    }

    suspend fun makeAppointment(appointment: Appointment): Response<Unit> {
        return apiService.makeAppointment(appointment)
    }

    suspend fun fetchPets(token: String): Response<List<Pet>> {
        return apiService.fetchPets("Bearer $token")
    }
}