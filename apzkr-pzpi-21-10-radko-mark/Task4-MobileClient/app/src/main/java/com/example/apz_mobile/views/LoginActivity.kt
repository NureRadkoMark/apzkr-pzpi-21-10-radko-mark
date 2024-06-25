package com.example.apz_mobile.views

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import com.example.apz_mobile.MainActivity
import com.example.apz_mobile.databinding.ActivityLoginBinding
import com.example.apz_mobile.network.ApiServiceInstance
import com.example.apz_mobile.network.LoginRepository
import com.example.apz_mobile.viewmodels.LoginViewModel
import com.example.apz_mobile.viewmodels.LoginViewModelFactory

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private val loginViewModel: LoginViewModel by viewModels {
        LoginViewModelFactory(LoginRepository(ApiServiceInstance.apiService))
    }
    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sharedPreferences = getSharedPreferences("prefs", MODE_PRIVATE)

        binding.loginButton.setOnClickListener {
            val email = binding.emailEditText.text.toString()
            val password = binding.passwordEditText.text.toString()
            if (email.isNotEmpty() && password.isNotEmpty()) {
                loginViewModel.login(email, password)
            } else {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_LONG).show()
            }
        }

        loginViewModel.loginResponse.observe(this, Observer { response ->
            response?.let {
                val token = it.token
                saveToken(token)
                loginViewModel.getUserRole(token)
            }
        })

        loginViewModel.userRoleResponse.observe(this, Observer { response ->
            response?.let {
                val role = it.role.RoleName
                saveUserRole(role)
                Toast.makeText(this, "Role: $role", Toast.LENGTH_LONG).show()
                navigateToMainActivity()
            }
        })

        loginViewModel.error.observe(this, Observer { errorMessage ->
            errorMessage?.let {
                if (it.isNotEmpty()) {
                    Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, "An unknown error occurred", Toast.LENGTH_LONG).show()
                }
            }
        })
    }

    private fun saveToken(token: String) {
        with(sharedPreferences.edit()) {
            putString("jwtToken", token)
            apply()
            Log.d("TOKEN", "Saved token: $token")
        }
    }

    private fun saveUserRole(role: String) {
        with(sharedPreferences.edit()) {
            putString("Role", role)
            apply()
            Log.d("ROLE", "Saved role: $role")
        }
    }


    private fun navigateToMainActivity() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}








