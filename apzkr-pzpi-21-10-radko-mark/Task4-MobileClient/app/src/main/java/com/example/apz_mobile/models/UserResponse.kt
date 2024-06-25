package com.example.apz_mobile.models

import com.google.gson.annotations.SerializedName

data class UserResponse(
    @SerializedName("user") val user: User
)