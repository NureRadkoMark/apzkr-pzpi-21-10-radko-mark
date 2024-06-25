package com.example.apz_mobile.network

import com.example.apz_mobile.models.Appointment
import com.example.apz_mobile.models.Department
import com.example.apz_mobile.models.LoginRequest
import com.example.apz_mobile.models.LoginResponse
import com.example.apz_mobile.models.Pet
import com.example.apz_mobile.models.RoleResponse
import com.example.apz_mobile.models.UpdateResponse
import com.example.apz_mobile.models.User
import com.example.apz_mobile.models.UserDetails
import com.example.apz_mobile.models.UserResponse
import retrofit2.Call
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.PUT

interface ApiService {

    @POST("/api/user/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @GET("/api/role/user")
    suspend fun getUserRole(@Header("Authorization") authorization: String): Response<RoleResponse>

    @GET("api/user/check")
    suspend fun refreshToken(@Header("Authorization") token: String): Response<LoginResponse>

    @GET("/api/user/details")
    suspend fun getUserDetails(@Header("Authorization") token: String): Response<UserResponse>

    @PUT("api/user/update")
    suspend fun updateUserDetails(
        @Header("Authorization") token: String,
        @Body userDetails: UserDetails
    ): Response<UpdateResponse>

    @PUT("/api/department/search")
    suspend fun searchDepartments(
        @Body requestBody: Map<String, String>
    ): Response<List<Department>>

    @POST("/api/appointment")
    suspend fun makeAppointment(
        @Body appointment: Appointment
    ): Response<Unit>

    @GET("/api/pet/user")
    suspend fun fetchPets(
        @Header("Authorization") token: String
    ): Response<List<Pet>>

    companion object {
        private const val BASE_URL = "http://10.0.2.2:5000/"

        fun create(): ApiService {
            val retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()

            return retrofit.create(ApiService::class.java)
        }
    }
}
