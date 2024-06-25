package com.example.apz_mobile.constrollers
import android.content.SharedPreferences
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import android.util.Log
import com.example.apz_mobile.network.LoginRepository
import com.example.apz_mobile.viewmodels.LoginViewModel

class TokenController(
    private val sharedPreferences: SharedPreferences,
    private val loginViewModel: LoginViewModel,
    private val lifecycleOwner: LifecycleOwner
) {

    fun refreshToken(onSuccess: (String) -> Unit, onFailure: () -> Unit) {
        val storedToken = sharedPreferences.getString("jwtToken", "")
        Log.d("TokenController", "Stored token: $storedToken")

        if (!storedToken.isNullOrEmpty()) {
            loginViewModel.refreshToken(storedToken)
            Log.d("TokenController", "Called refreshToken in ViewModel")

            loginViewModel.loginResponse.observe(lifecycleOwner, Observer { response ->
                response?.let {
                    val newToken = it.token
                    Log.d("TokenController", "New token received: $newToken")
                    if (newToken != null) {
                        sharedPreferences.edit().putString("jwtToken", newToken).apply()
                        onSuccess(newToken)
                    } else {
                        Log.d("TokenController", "New token is null")
                        onFailure()
                    }
                } ?: run {
                    Log.d("TokenController", "Login response is null")
                    onFailure()
                }
            })

            loginViewModel.error.observe(lifecycleOwner, Observer { errorMessage ->
                errorMessage?.let {
                    Log.d("TokenController", "Error refreshing token: $it")
                    onFailure()
                }
            })
        } else {
            Log.d("TokenController", "Stored token is null or empty")
            onFailure()
        }
    }
}


