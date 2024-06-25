package com.example.apz_mobile.models

import com.google.gson.annotations.SerializedName
import java.util.Date

data class User(
    @SerializedName("UserId") val userId: Int,
    @SerializedName("FirstName") val firstName: String,
    @SerializedName("SecondName") val secondName: String,
    @SerializedName("PhoneNumber") val phoneNumber: String,
    @SerializedName("BirthDay") val birthDay: String?, //  null
    @SerializedName("PassportCode") val passportCode: String,
    @SerializedName("Email") val email: String,
    @SerializedName("IOTCode") val iotCode: String,
    @SerializedName("IsBanned") val isBanned: Boolean
)