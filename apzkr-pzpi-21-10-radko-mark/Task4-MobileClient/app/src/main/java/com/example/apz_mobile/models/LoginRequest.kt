package com.example.apz_mobile.models

data class LoginRequest(
    val Email: String,
    val Password: String,
    val Lang: String = "ua"
)