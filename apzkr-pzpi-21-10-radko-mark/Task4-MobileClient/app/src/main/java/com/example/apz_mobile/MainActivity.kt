package com.example.apz_mobile
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import com.example.apz_mobile.constrollers.TokenController
import com.example.apz_mobile.databinding.ActivityMainBinding
import com.example.apz_mobile.network.ApiServiceInstance
import com.example.apz_mobile.network.LoginRepository
import com.example.apz_mobile.views.LoginActivity
import com.example.apz_mobile.viewmodels.LoginViewModel
import com.example.apz_mobile.viewmodels.LoginViewModelFactory
import com.example.apz_mobile.views.HomeActivity

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var tokenController: TokenController
    private val loginViewModel: LoginViewModel by viewModels {
        LoginViewModelFactory(LoginRepository(ApiServiceInstance.apiService))
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialize Toolbar
        val toolbar: Toolbar = binding.toolbar
        setSupportActionBar(toolbar)

        sharedPreferences = getSharedPreferences("prefs", MODE_PRIVATE)
        tokenController = TokenController(sharedPreferences, loginViewModel, this)

        refreshToken()
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle item selection
        return when (item.itemId) {
            R.id.action_logout -> {
                logout()
                true
            }
            android.R.id.home -> {
                // Respond to the action bar's Up/Home button
                onBackPressed()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun refreshToken() {
        Log.d("MainActivity", "Starting token refresh")
        tokenController.refreshToken(
            onSuccess = {
                Log.d("MainActivity", "Token is valid")
                showMessage("Token is valid")
                navigateToHomeActivity()
            },
            onFailure = {
                Log.d("MainActivity", "Failed to refresh token, navigating to login")
                navigateToLoginActivity()
            }
        )
    }

    private fun navigateToLoginActivity() {
        Log.d("MainActivity", "Navigating to LoginActivity")
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }

    private fun navigateToHomeActivity() {
        Log.d("MainActivity", "Navigating to HomePageActivity")
        val intent = Intent(this, HomeActivity::class.java)
        startActivity(intent)
        finish()
    }

    private fun showMessage(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun logout() {
        // Clear SharedPreferences or perform any other logout actions
        sharedPreferences.edit().clear().apply()
        navigateToLoginActivity()
    }
}





